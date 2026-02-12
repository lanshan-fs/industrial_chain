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
      "SELECT company_id, company_name, raw_variants, registered_capital, establishment_date FROM companies LIMIT 200",
    );

    const formattedData = rows.map((row) => ({
      key: row.company_id,
      name: row.company_name,
      variants: row.raw_variants || "",
      // 数据库中可能存的是数字，格式化为带单位的字符串给前端，或者前端处理，这里示例直接透传
      registeredCapital: row.registered_capital,
      // 模拟法定代表人数据 (随机生成一个姓氏+总)
      legalPerson:
        ["张", "王", "李", "赵", "刘"][Math.floor(Math.random() * 5)] + "总",
      establishmentDate: row.establishment_date,
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

app.get("/api/industry/profile", async (req, res) => {
  const { industryName } = req.query;
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

    // 1. 获取该行业下所有企业 (Limit 100 for demo performance)
    const [companies] = await pool.query(
      `
      SELECT DISTINCT c.* FROM companies c
      JOIN companies_tags_map ctm ON c.company_id = ctm.company_id
      WHERE ctm.tag_id IN (?)
      LIMIT 100
    `,
      [allTagIds.length > 0 ? allTagIds : ["dummy"]],
    );

    // 2. 为每个企业计算/模拟三个模型的分数
    let totalBasic = 0,
      totalTech = 0,
      totalAbility = 0;
    let totalCapital = 0,
      highTechCount = 0;
    const companyScores = [];

    // Helper: 模拟生成维度详情
    const genDetails = (baseScore) => {
      const d = [];
      // 简单的随机生成 3-4 个维度
      d.push({
        name: "核心指标A",
        weight: 40,
        score: Math.min(100, baseScore + Math.floor(Math.random() * 10 - 5)),
      });
      d.push({
        name: "核心指标B",
        weight: 30,
        score: Math.min(100, baseScore + Math.floor(Math.random() * 20 - 10)),
      });
      d.push({
        name: "辅助指标C",
        weight: 30,
        score: Math.min(100, baseScore + Math.floor(Math.random() * 15 - 5)),
      });
      return d;
    };

    companies.forEach((c) => {
      totalCapital += parseFloat(c.registered_capital) || 0;
      if (c.is_high_tech) highTechCount++;

      // 模拟评分：基于注册资本和是否高新做一点区分，让数据看起来真实点
      const capScore = Math.min(
        100,
        60 + parseFloat(c.registered_capital) / 1000,
      );
      const techBase = c.is_high_tech ? 80 : 50;

      const basicScore = Math.floor(capScore);
      const techScore = Math.floor(techBase + Math.random() * 20);
      const abilityScore = c.risk_score || 70; // 假设 risk_score 代表能力/稳健度

      totalBasic += basicScore;
      totalTech += techScore;
      totalAbility += abilityScore;

      companyScores.push({
        id: c.company_id,
        name: c.company_name,
        basicScore,
        techScore,
        abilityScore,
        // 生成详情用于弹窗
        details: {
          basic: genDetails(basicScore),
          tech: genDetails(techScore),
          ability: genDetails(abilityScore),
        },
      });
    });

    const count = companies.length || 1;
    const avgBasic = Math.round(totalBasic / count);
    const avgTech = Math.round(totalTech / count);
    const avgAbility = Math.round(totalAbility / count);

    // 3. 构造历史雷达数据 (6个月层叠)
    // 模拟趋势：假设数据在稳步增长
    const historyRadar = [];
    const months = [];
    // 生成过去6个月的月份标签
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push(
        `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`,
      );
    }

    months.forEach((m, idx) => {
      // 越近的时间，分数越接近当前平均分 (idx 0 -> 5)
      // 模拟一个 0.85 -> 1.0 的增长曲线
      const ratio = 0.85 + idx * 0.03;

      historyRadar.push({
        item: "行业基础",
        score: Math.round(avgBasic * ratio),
        date: m,
      });
      historyRadar.push({
        item: "科技属性",
        score: Math.round(avgTech * ratio),
        date: m,
      });
      historyRadar.push({
        item: "行业能力",
        score: Math.round(avgAbility * ratio),
        date: m,
      });
      // 额外两个维度固定一下，丰富雷达图
      historyRadar.push({
        item: "人才聚集",
        score: Math.round(75 * ratio),
        date: m,
      });
      historyRadar.push({
        item: "资本热度",
        score: Math.round(65 * ratio),
        date: m,
      });
    });

    // 4. 组装响应
    const responseData = {
      basicInfo: {
        industryName: targetTag.tag_name,
        totalCompanies: count,
        totalCapital: (totalCapital / 10000).toFixed(2),
        updateTime: new Date().toISOString().split("T")[0],
      },
      // 总体评分 (加权)
      totalScore: Math.round(avgBasic * 0.3 + avgTech * 0.4 + avgAbility * 0.3),

      // 主雷达图数据 (带时间维度的层叠数据)
      overallRadar: historyRadar,

      // 三大模型详情 (含企业列表)
      models: {
        basic: {
          title: "行业基础评分模型",
          score: avgBasic, // 行业均值
          companies: companyScores.map((c) => ({
            name: c.name,
            score: c.basicScore,
            details: c.details.basic,
          })),
        },
        tech: {
          title: "行业科技属性评分模型",
          score: avgTech,
          companies: companyScores.map((c) => ({
            name: c.name,
            score: c.techScore,
            details: c.details.tech,
          })),
        },
        ability: {
          title: "行业能力评分模型",
          score: avgAbility,
          companies: companyScores.map((c) => ({
            name: c.name,
            score: c.abilityScore,
            details: c.details.ability,
          })),
        },
      },
      // 风险与薄弱环节 (保持原有逻辑)
      weakLinks: [
        { name: "关键原材料", level: "高危", reason: "对外依存度 > 80%" },
        { name: "高端制程设备", level: "中危", reason: "国产替代率低" },
      ],
      risks: {
        high: companyScores
          .filter((c) => c.abilityScore < 60)
          .slice(0, 5)
          .map((c) => ({
            name: c.name,
            score: c.abilityScore,
            reason: "经营风险高",
          })),
        low: companyScores
          .filter((c) => c.abilityScore > 85)
          .slice(0, 5)
          .map((c) => ({
            name: c.name,
            score: c.abilityScore,
            reason: "经营稳健",
          })),
      },
      topCompanies: companies.slice(0, 10).map((c) => ({
        name: c.company_name,
        capital: c.registered_capital,
        score: c.risk_score || 80,
        tags: c.is_high_tech ? ["高新技术"] : ["中小企业"],
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

// --- 辅助函数：将数据库 domain 映射到前端 5 大维度 ---
function mapDomainToDimension(domain) {
  // 简单的关键词映射逻辑
  if (!domain) return "basic";
  if (
    domain.includes("科技") ||
    domain.includes("技术") ||
    domain.includes("专利")
  )
    return "tech";
  if (
    domain.includes("风险") ||
    domain.includes("合规") ||
    domain.includes("法务")
  )
    return "risk";
  if (
    domain.includes("市场") ||
    domain.includes("金融") ||
    domain.includes("投资")
  )
    return "market";
  if (
    domain.includes("业务") ||
    domain.includes("产品") ||
    domain.includes("行业")
  )
    return "business";
  return "basic"; // 默认归为基本信息
}

// 1. 获取企业标签列表（优化版：支持按维度分组返回）
app.get("/api/tags/companies", async (req, res) => {
  const { page = 1, pageSize = 10, keyword = "" } = req.query;
  const offset = (page - 1) * pageSize;

  try {
    let whereClause = "";
    const params = [];
    if (keyword) {
      whereClause = "WHERE company_name LIKE ? OR company_id LIKE ?";
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM companies ${whereClause}`,
      params,
    );
    const total = countResult[0].total;

    const [companies] = await pool.query(
      `SELECT company_id, company_name, raw_variants, registered_capital, establishment_date, is_high_tech, risk_score, patent_count 
       FROM companies 
       ${whereClause} 
       ORDER BY establishment_date DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(pageSize), parseInt(offset)],
    );

    if (companies.length === 0) {
      return res.json({ success: true, data: { list: [], total: 0 } });
    }

    // 查询关联标签
    const companyIds = companies.map((c) => c.company_id);
    const [tags] = await pool.query(
      `SELECT m.company_id, t.tag_id, t.tag_name, t.domain 
       FROM companies_tags_map m
       JOIN tags t ON m.tag_id = t.tag_id
       WHERE m.company_id IN (?)`,
      [companyIds],
    );

    const list = companies.map((comp) => {
      // 初始化维度容器
      const dimensions = {
        basic: [],
        business: [],
        tech: [],
        risk: [],
        market: [],
      };

      // 1. 填充数据库已有的标签
      const compTags = tags.filter((t) => t.company_id === comp.company_id);
      compTags.forEach((t) => {
        const dim = mapDomainToDimension(t.domain);
        dimensions[dim].push(t.tag_name);
      });

      // 2. 自动生成一些标签（用于演示数据丰富度）
      // 仅当该维度为空时才自动填充，避免覆盖人工操作
      if (dimensions.basic.length === 0) {
        if (comp.registered_capital > 5000)
          dimensions.basic.push("注册资本超5千万");
        dimensions.basic.push("朝阳区注册");
      }
      if (dimensions.tech.length === 0 && comp.is_high_tech) {
        dimensions.tech.push("国家高新技术企业");
      }
      if (dimensions.risk.length === 0) {
        dimensions.risk.push(comp.risk_score < 60 ? "高风险预警" : "信用良好");
      }

      return {
        key: comp.company_id,
        name: comp.company_name,
        code: comp.company_id,
        updateTime: new Date().toISOString().split("T")[0],
        dimensions: dimensions,
      };
    });

    res.json({ success: true, data: { list, total } });
  } catch (error) {
    console.error("Fetch company tags error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. 新增标签 (单条追加，用于 "+" 号功能)
app.post("/api/tags/add", async (req, res) => {
  const { companyId, tagName, dimension } = req.body;

  // 这里的逻辑稍微复杂一点：
  // 真实场景通常是关联已有的 tag_id。
  // 为了演示方便，如果 tags 表里没有这个 tag_name，我们先创建它。

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. 检查标签是否存在，不存在则创建
    let tagId;
    const [existingTag] = await conn.query(
      "SELECT tag_id FROM tags WHERE tag_name = ?",
      [tagName],
    );

    if (existingTag.length > 0) {
      tagId = existingTag[0].tag_id;
    } else {
      tagId = "TAG_" + Date.now() + Math.floor(Math.random() * 1000);
      // 将前端传来的 dimension 映射回数据库的 domain 字段，方便下次查询归类
      let domain = "基本信息";
      if (dimension === "tech") domain = "科技属性";
      if (dimension === "business") domain = "业务领域";
      if (dimension === "risk") domain = "风险合规";
      if (dimension === "market") domain = "市场表现";

      await conn.query(
        "INSERT INTO tags (tag_id, tag_name, domain, level) VALUES (?, ?, ?, 1)",
        [tagId, tagName, domain],
      );
    }

    // 2. 建立关联 (使用 IGNORE 避免重复报错)
    await conn.query(
      "INSERT IGNORE INTO companies_tags_map (company_id, tag_id) VALUES (?, ?)",
      [companyId, tagId],
    );

    await conn.commit();
    res.json({ success: true, message: "标签添加成功" });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    conn.release();
  }
});

// ==========================================
// 新增：元数据获取接口 (用于高级搜索)
// ==========================================
app.get("/api/meta/all", async (req, res) => {
  try {
    const conn = await pool.getConnection();

    // 1. 获取所有字典数据
    const [dictRows] = await conn.query(
      "SELECT group_code, name, sort_order FROM sys_dictionary ORDER BY sort_order",
    );
    const dictionary = {};
    dictRows.forEach((row) => {
      if (!dictionary[row.group_code]) {
        dictionary[row.group_code] = [];
      }
      dictionary[row.group_code].push({ label: row.name, value: row.name });
    });

    // 2. 获取行业分类 (构建树)
    const [industryRows] = await conn.query(
      "SELECT id, parent_id, name, level FROM sys_industry_category ORDER BY sort_order",
    );
    const industryTree = buildTree(industryRows);

    // 3. 获取应用场景
    const [scenarioRows] = await conn.query(
      "SELECT name FROM sys_scenario ORDER BY sort_order",
    );
    const scenarios = scenarioRows.map((r) => ({
      label: r.name,
      value: r.name,
    }));

    // 4. 获取行政区域 (街道/地区)
    const [regionRows] = await conn.query(
      "SELECT name, type FROM sys_region WHERE type IN ('STREET', 'AREA') ORDER BY sort_order",
    );
    const regions = {
      street: regionRows
        .filter((r) => r.type === "STREET")
        .map((r) => ({ label: r.name, value: r.name })),
      area: regionRows
        .filter((r) => r.type === "AREA")
        .map((r) => ({ label: r.name, value: r.name })),
    };

    conn.release();

    res.json({
      success: true,
      data: {
        dictionary,
        industryTree,
        scenarios,
        regions,
      },
    });
  } catch (error) {
    console.error("Meta API Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 辅助函数：构建树形结构
function buildTree(items) {
  const itemMap = {};
  const rootNodes = [];

  items.forEach((item) => {
    itemMap[item.id] = {
      title: item.name,
      value: item.name, // 使用名称作为 value，方便前端搜索
      key: item.id,
      children: [],
    };
  });

  items.forEach((item) => {
    const node = itemMap[item.id];
    if (item.parent_id && item.parent_id !== 0 && itemMap[item.parent_id]) {
      itemMap[item.parent_id].children.push(node);
    } else {
      rootNodes.push(node);
    }
  });

  return rootNodes;
}

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
