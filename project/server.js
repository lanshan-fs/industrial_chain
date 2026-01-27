import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import crypto from "crypto";
import { message } from "antd";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Justdoit123@",
  database: "industrial_chain",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool
  .getConnection()
  .then((conn) => {
    console.log("Database connected successfully");
    conn.release();
  })
  .catch((err) => console.error("Fail", err.message));

app.get("/api/companies", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT company_id, company_name, raw_variants FROM companies LIMIT 100",
    );

    const formattedData = rows.map((row) => ({
      key: row.company_id,
      name: row.company_name,
      variants: row.raw_variants || "",
      updateTime: "2026-01-22",
    }));

    res.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("查询出错", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/dashboard/overview", async (req, res) => {
  try {
    const [totalRows] = await pool.query(
      "SELECT COUNT(*) as total FROM companies",
    );
    const totalCompanies = totalRows[0].total;

    const [chainRows] = await pool.query(`
      SELECT 
        m.chain_stage as stage,
        t.level1 as tagName,
        COUNT(DISTINCT ctm.company_id) as count
      FROM 
        tags t
      JOIN 
        tags_chain_stage_map m ON t.domain = m.domain AND t.level1 = m.level1
      LEFT JOIN 
        companies_tags_map ctm ON t.tag_id = ctm.tag_id
      WHERE 
        t.level1 IS NOT NULL AND t.level1 != ''
      GROUP BY 
        m.chain_stage, t.level1
      ORDER BY 
        count DESC

      `);

    const stageMap = {
      上游: {
        type: "upstream",
        title: "上游 · 研发与技术",
        color: "#1890ff",
        list: [],
      },
      中游: {
        type: "midstream",
        title: "中游 · 生产与制造",
        color: "#52c41a",
        list: [],
      },
      下游: {
        type: "downstream",
        title: "下游 · 服务与应用",
        color: "#fa8c16",
        list: [],
      },
    };

    chainRows.forEach((row) => {
      if (stageMap[row.stage]) {
        stageMap[row.stage].list.push({
          name: row.tagName,
          count: row.count,
          isWeak: row.count < 50 && row.count > 0,
        });
      }
    });

    const chainData = Object.values(stageMap).map((item) => ({
      type: item.type,
      title: item.title,
      color: item.color,
      total: item.list.reduce((acc, cur) => acc + cur.count, 0),
      subTags: item.list,
    }));

    res.json({
      success: true,
      data: {
        totalCompanies,
        chainData,
      },
    });
  } catch (error) {
    console.error("Dashboard overview query failed:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/chat/history", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT session_id, title, create_time FROM chat_sessions ORDER BY create_time DESC LIMIT 20",
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/chat/history/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const [rows] = await pool.query(
      "SELECT role, content, create_time FROM chat_messages WHERE session_id = ? ORDER BY message_id ASC",
      [sessionId],
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/chat", async (req, res) => {
  const { messages, sessionId } = req.body;

  const API_KEY = "sk-d1a18b48e5b544fbadd0ece3ab3960ee";
  const API_URL = "https://api.deepseek.com/chat/completions";

  let currentSessionId = sessionId;
  let isNewSession = false;

  if (!currentSessionId) {
    currentSessionId = crypto.randomUUID();
    isNewSession = true;
  }

  const userLatestMsg = messages[messages.length - 1].content;

  try {
    if (isNewSession) {
      const title =
        userLatestMsg.substring(0, 20) +
        (userLatestMsg.length > 20 ? "..." : "");
      await pool.query(
        "INSERT INTO chat_sessions (session_id, title) VALUES (?, ?)",
        [currentSessionId, title],
      );
    }

    await pool.query(
      "INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)",
      [currentSessionId, "user", userLatestMsg],
    );

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "你是一个专业的区域产业链分析助手..." },
          ...messages,
        ],
        stream: false,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "API调用失败");

    const aiContent = data.choices[0].message.content;

    await pool.query(
      "INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)",
      [currentSessionId, "assistant", aiContent],
    );

    res.json({
      success: true,
      data: aiContent,
      sessionId: currentSessionId,
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    res.status(500).json({ success: false, message: "服务异常" });
  }
});

async function getAllTagsWithHierarchy() {
  const [tags] = await pool.query("SELECT * FROM tags");
  const [stageMapRows] = await pool.query("SELECT * FROM tags_chain_stage_map");

  const stageMap = {};
  stageMapRows.forEach((row) => {
    if (row.level1 && row.chain_stage) {
      stageMap[row.level1.trim()] = row.chain_stage;
    }
  });
  return { tags, stageMap };
}

function getDescendantTagIds(rootId, allTags) {
  let ids = [rootId];
  const children = allTags.filter((t) => t.parent_tag_id === rootId);
  for (const child of children) {
    ids = [...ids, ...getDescendantTagIds(child.tag_id, allTags)];
  }
  return ids;
}

app.get("/api/industry/tree", async (req, res) => {
  try {
    const { tags, stageMap } = await getAllTagsWithHierarchy();

    // 统计企业数量
    const [counts] = await pool.query(`
      SELECT tag_id, COUNT(DISTINCT company_id) as count 
      FROM companies_tags_map 
      GROUP BY tag_id
    `);
    const countMap = {};
    counts.forEach((c) => (countMap[c.tag_id] = c.count));

    // 构建节点映射
    const tagNodeMap = {};
    tags.forEach((tag) => {
      tagNodeMap[tag.tag_id] = {
        key: tag.tag_id,
        title: tag.tag_name,
        level: parseInt(tag.level, 10),
        children: [],
        count: countMap[tag.tag_id] || 0,
        isTag: true,
      };
    });

    // 组装树结构
    const l1Nodes = [];
    tags.forEach((tag) => {
      const node = tagNodeMap[tag.tag_id];
      if (tag.parent_tag_id && tagNodeMap[tag.parent_tag_id]) {
        tagNodeMap[tag.parent_tag_id].children.push(node);
      }
      if (parseInt(tag.level, 10) === 1) {
        l1Nodes.push(node);
      }
    });

    // 递归累加数量
    const calcTreeCount = (node) => {
      let sum = node.count;
      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => (sum += calcTreeCount(child)));
      }
      node.count = sum;
      node.title = `${node.title} (${sum})`; // 在树节点显示数量
      return sum;
    };
    l1Nodes.forEach((node) => calcTreeCount(node));

    // 按上中下游分组
    const rootTree = [
      { key: "stage_upstream", title: "上游", children: [], isStage: true },
      { key: "stage_midstream", title: "中游", children: [], isStage: true },
      { key: "stage_downstream", title: "下游", children: [], isStage: true },
    ];

    l1Nodes.forEach((node) => {
      // 去除数量后缀获取纯名称用于匹配
      const cleanName = node.title.split(" (")[0].trim();
      const stageName = stageMap[cleanName];

      let targetRoot = rootTree.find((r) => r.title === stageName);
      if (!targetRoot && stageName) {
        // 容错：如果映射表里有但rootTree里没有
      }
      if (targetRoot) {
        targetRoot.children.push(node);
      }
    });

    res.json({ success: true, data: rootTree });
  } catch (error) {
    console.error("Tree Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/industry/companies", async (req, res) => {
  const { keyword, tagId, stageKey } = req.query;

  try {
    const { tags, stageMap } = await getAllTagsWithHierarchy();
    let targetTagIds = [];

    if (stageKey) {
      const stageName = stageKey.replace("stage_", "");
      const l1Tags = tags.filter(
        (t) =>
          parseInt(t.level, 10) === 1 && stageMap[t.tag_name] === stageName,
      );

      l1Tags.forEach((t) => {
        targetTagIds = [
          ...targetTagIds,
          ...getDescendantTagIds(t.tag_id, tags),
        ];
      });
    } else if (tagId) {
      targetTagIds = getDescendantTagIds(tagId, tags);
    }

    let sql = `SELECT DISTINCT c.company_id, c.company_name, c.raw_variants FROM companies c`;
    if (targetTagIds.length > 0) {
      sql += ` JOIN companies_tags_map ctm ON c.company_id = ctm.company_id `;
    }
    sql += ` WHERE 1=1 `;
    const params = [];

    if (targetTagIds.length > 0) {
      sql += ` AND ctm.tag_id IN (?) `;
      params.push(targetTagIds);
    } else if (stageKey || tagId) {
      return res.json({ success: true, data: [] });
    }

    if (keyword) {
      sql += ` AND (c.company_name LIKE ? OR c.raw_variants LIKE ?) `;
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    sql += ` LIMIT 50`;
    const [rows] = await pool.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

async function getModelDimensions(modelKey) {
  try {
    const [rows] = await pool.query(
      "SELECT dimension_name, weight, calc_method FROM evaluation_dimensions WHERE model_key = ? ORDER BY sort_order",
      [modelKey],
    );
    return rows;
  } catch (err) {
    console.error(`Failed to fetch dimensions for ${modelKey}`, err);
    return [];
  }
}

// --- 核心接口：行业画像 ---
app.get("/api/industry/profile", async (req, res) => {
  const { industryName } = req.query;
  // 处理可能传入的 "数字医疗 (123)" 格式，提取真实名称
  const cleanIndustryName = industryName ? industryName.split(" (")[0] : "";

  try {
    const { tags } = await getAllTagsWithHierarchy();
    const targetTag = tags.find(
      (t) =>
        t.tag_name === cleanIndustryName ||
        t.tag_name.includes(cleanIndustryName),
    );

    if (!targetTag) {
      return res.json({
        success: true,
        data: null,
        message: "未找到该行业标签",
      });
    }

    const allTagIds = getDescendantTagIds(targetTag.tag_id, tags);

    // 1. 聚合统计
    const [companies] = await pool.query(
      `
      SELECT DISTINCT c.* FROM companies c
      JOIN companies_tags_map ctm ON c.company_id = ctm.company_id
      WHERE ctm.tag_id IN (?)
    `,
      [allTagIds.length > 0 ? allTagIds : ["dummy"]],
    );

    let aggData = {
      totalCompanies: companies.length,
      totalCapital: 0,
      highTechCount: 0,
      totalPatents: 0,
      avgRiskScore: 0,
      highRiskList: [],
      lowRiskList: [],
    };

    companies.forEach((c) => {
      const cap = parseFloat(c.registered_capital) || 0;
      const risk = c.risk_score !== null ? c.risk_score : 100;

      aggData.totalCapital += cap;
      if (c.is_high_tech) aggData.highTechCount++;
      aggData.totalPatents += c.patent_count || 0;
      aggData.avgRiskScore += risk;

      const riskItem = {
        id: c.company_id,
        name: c.company_name,
        capital: cap,
        score: risk,
        tags: c.is_high_tech ? ["高新企业"] : [],
        reason: risk < 60 ? "存在经营异常/司法风险" : "经营稳健",
      };

      if (risk < 60) aggData.highRiskList.push(riskItem);
      else if (risk >= 85) aggData.lowRiskList.push(riskItem);
    });

    if (aggData.totalCompanies > 0) {
      aggData.avgRiskScore = aggData.avgRiskScore / aggData.totalCompanies;
    }

    // 2. 动态计算三大模型得分 (Mock Calculation based on Real Aggregation)

    // Helper: 模拟维度得分
    const getDimScore = (val, target) =>
      Math.min(100, Math.round(60 + (val / target) * 40));

    // (A) 行业基础模型
    const basicScore = getDimScore(aggData.totalCapital, 100000);
    const basicDims = [
      {
        name: "产业规模",
        weight: 40,
        score: getDimScore(aggData.totalCompanies, 50),
        value: aggData.totalCompanies + " 家",
      },
      {
        name: "资本沉淀",
        weight: 30,
        score: getDimScore(aggData.totalCapital, 100000),
        value: (aggData.totalCapital / 10000).toFixed(1) + " 亿元",
      },
      { name: "成熟度", weight: 30, score: 85, value: "成长均值 5年+" },
    ];

    // (B) 科技属性模型
    const techScore = getDimScore(
      aggData.highTechCount,
      aggData.totalCompanies * 0.3,
    );
    const techDims = [
      {
        name: "创新主体",
        weight: 40,
        score: getDimScore(aggData.highTechCount, 10),
        value: aggData.highTechCount + " 家高新",
      },
      {
        name: "知识产权",
        weight: 30,
        score: getDimScore(aggData.totalPatents, 500),
        value: aggData.totalPatents + " 件专利",
      },
      { name: "研发强度", weight: 30, score: 78, value: "平均占比 4.2%" },
    ];

    // (C) 行业能力模型
    const abilityScore = getDimScore(aggData.avgRiskScore, 100);
    const abilityDims = [
      { name: "盈利能力", weight: 30, score: 75, value: "毛利 15%+" },
      { name: "营商环境", weight: 30, score: 90, value: "政策支持 A级" },
      {
        name: "风险控制",
        weight: 40,
        score: aggData.avgRiskScore.toFixed(0),
        value: "平均分 " + aggData.avgRiskScore.toFixed(0),
      },
    ];

    // 3. 组装响应数据
    const responseData = {
      basicInfo: {
        industryName: targetTag.tag_name,
        totalCompanies: aggData.totalCompanies,
        totalCapital: (aggData.totalCapital / 10000).toFixed(2),
        updateTime: new Date().toISOString().split("T")[0],
      },
      // 总体评分
      totalScore: Math.round(
        basicScore * 0.3 + techScore * 0.4 + abilityScore * 0.3,
      ),
      // 总体雷达
      overallRadar: [
        { item: "行业基础", score: basicScore },
        { item: "科技属性", score: techScore },
        { item: "行业能力", score: abilityScore },
        { item: "人才聚集", score: 82 },
        { item: "资本热度", score: 70 },
      ],
      // 三大模型详情
      models: {
        basic: {
          title: "行业基础评分模型",
          score: basicScore,
          radar: basicDims.map((d) => ({ item: d.name, score: d.score })), // 小雷达数据
          dimensions: basicDims,
        },
        tech: {
          title: "行业科技属性评分模型",
          score: techScore,
          radar: techDims.map((d) => ({ item: d.name, score: d.score })),
          dimensions: techDims,
        },
        ability: {
          title: "行业能力评分模型",
          score: abilityScore,
          radar: abilityDims.map((d) => ({ item: d.name, score: d.score })),
          dimensions: abilityDims,
        },
      },
      // 风险与薄弱环节
      weakLinks: [
        { name: "关键原材料", level: "高危", reason: "对外依存度 > 80%" },
        { name: "高端制程设备", level: "中危", reason: "国产替代率低" },
      ],
      risks: {
        high: aggData.highRiskList
          .sort((a, b) => a.score - b.score)
          .slice(0, 5),
        low: aggData.lowRiskList.sort((a, b) => b.score - a.score).slice(0, 5),
      },
      // 重点企业 (Top 10 by Capital)
      topCompanies: companies
        .sort((a, b) => b.registered_capital - a.registered_capital)
        .slice(0, 10)
        .map((c) => ({
          name: c.company_name,
          capital: c.registered_capital,
          score: c.risk_score || 80,
          tags: c.is_high_tech ? ["高新技术", "专精特新"] : ["中小企业"],
        })),
    };

    res.json({ success: true, data: responseData });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/evaluation/models", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM evaluation_models ORDER BY id",
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/api/evaluation/model-details", async (req, res) => {
  const { modelKey } = req.query;
  if (!modelKey) {
    return res
      .status(400)
      .json({ success: false, message: "Missing modelKey" });
  }

  try {
    // 获取维度
    const [dims] = await pool.query(
      "SELECT * FROM evaluation_dimensions WHERE model_key = ? ORDER BY sort_order",
      [modelKey],
    );

    if (dims.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const dimIds = dims.map((d) => d.id);

    // 获取规则
    // 注意：如果 dimIds 为空会导致 sql 错误，但上面已判断 length === 0
    const [rules] = await pool.query(
      "SELECT * FROM evaluation_rules WHERE dimension_id IN (?) ORDER BY id",
      [dimIds],
    );

    // 组装数据结构：Dimension -> Rules
    const result = dims.map((d) => ({
      ...d,
      rules: rules.filter((r) => r.dimension_id === d.id),
    }));

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/evaluation/save", async (req, res) => {
  const { dimensions } = req.body;

  if (!dimensions || !Array.isArray(dimensions)) {
    return res.status(400).json({ success: false, message: "Invalid data" });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    for (const dim of dimensions) {
      // 1. 更新维度权重
      await connection.query(
        "UPDATE evaluation_dimensions SET weight = ? WHERE id = ?",
        [dim.weight, dim.id],
      );

      // 2. 更新规则得分
      if (dim.rules && dim.rules.length > 0) {
        for (const rule of dim.rules) {
          await connection.query(
            "UPDATE evaluation_rules SET score = ? WHERE id = ?",
            [rule.score, rule.id],
          );
        }
      }
    }

    await connection.commit();
    res.json({ success: true, message: "配置已保存" });
  } catch (err) {
    await connection.rollback();
    console.error("Save Error:", err);
    res
      .status(500)
      .json({ success: false, message: "保存失败: " + err.message });
  } finally {
    connection.release();
  }
});

app.delete("/api/evaluation/rule/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM evaluation_rules WHERE id = ?", [id]);
    res.json({ success: true, message: "规则已删除" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
