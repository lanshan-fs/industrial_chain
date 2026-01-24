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

    const [counts] = await pool.query(`
      SELECT tag_id, COUNT(DISTINCT company_id) as count 
      FROM companies_tags_map 
      GROUP BY tag_id
    `);
    const countMap = {};
    counts.forEach((c) => (countMap[c.tag_id] = c.count));

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

    const calcTreeCount = (node) => {
      let sum = node.count;
      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => {
          sum += calcTreeCount(child);
        });
      }
      node.count = sum;
      return sum;
    };
    l1Nodes.forEach((node) => calcTreeCount(node));

    const rootTree = [
      {
        key: "stage_上游",
        title: "上游",
        children: [],
        count: 0,
        isStage: true,
      },
      {
        key: "stage_中游",
        title: "中游",
        children: [],
        count: 0,
        isStage: true,
      },
      {
        key: "stage_下游",
        title: "下游",
        children: [],
        count: 0,
        isStage: true,
      },
    ];

    let mappedCount = 0;
    l1Nodes.forEach((node) => {
      const stageName = stageMap[node.title ? node.title.trim() : ""];
      if (stageName) {
        const targetRoot = rootTree.find((r) => r.title === stageName);
        if (targetRoot) {
          targetRoot.children.push(node);
          targetRoot.count += node.count;
          mappedCount++;
        }
      } else {
        console.log(`Warning: Unmapped Level 1 Tag: ${node.title}`);
      }
    });

    console.log(
      `Tree Build: Total L1 Tags: ${l1Nodes.length}, Mapped: ${mappedCount}`,
    );

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
      "SELECT dimension_name, weight FROM evaluation_dimensions WHERE model_key = ? ORDER BY sort_order",
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

  try {
    // 1. 准备数据：获取所有 Tag 以便递归
    const { tags } = await getAllTagsWithHierarchy();

    // 找到当前行业对应的 Tag (模糊匹配或精确匹配)
    const targetTag = tags.find(
      (t) => t.tag_name === industryName || t.tag_name.includes(industryName),
    );

    if (!targetTag) {
      return res.json({
        success: true,
        data: null,
        message: "未找到该行业标签",
      });
    }

    // 2. 递归查找该行业下的所有子标签 ID
    const allTagIds = getDescendantTagIds(targetTag.tag_id, tags);

    // 3. 查询关联的所有企业 (使用 IN 查询)
    // 注意：这里聚合了所有子标签下的企业
    const [companies] = await pool.query(
      `
      SELECT DISTINCT c.* FROM companies c
      JOIN companies_tags_map ctm ON c.company_id = ctm.company_id
      WHERE ctm.tag_id IN (?)
    `,
      [allTagIds.length > 0 ? allTagIds : ["dummy"]],
    );

    // 4. 聚合计算 (Aggregation Logic)
    let aggData = {
      totalCompanies: companies.length,
      totalCapital: 0,
      avgCapital: 0,
      highTechCount: 0,
      totalPatents: 0,
      avgRiskScore: 0,
      highRiskList: [],
      lowRiskList: [],
    };

    companies.forEach((c) => {
      // 处理可能为 null 的字段
      const cap = parseFloat(c.registered_capital) || 0;
      const risk = c.risk_score !== null ? c.risk_score : 100;

      aggData.totalCapital += cap;
      if (c.is_high_tech) aggData.highTechCount++;
      aggData.totalPatents += c.patent_count || 0;
      aggData.avgRiskScore += risk;

      // 风险名单构建
      const riskItem = {
        name: c.company_name,
        score: risk,
        reason: risk < 60 ? "存在经营异常/司法风险" : "经营稳健",
      };
      if (risk < 60) aggData.highRiskList.push(riskItem);
      else if (risk >= 90) aggData.lowRiskList.push(riskItem);
    });

    if (aggData.totalCompanies > 0) {
      aggData.avgCapital = aggData.totalCapital / aggData.totalCompanies;
      aggData.avgRiskScore = aggData.avgRiskScore / aggData.totalCompanies;
    }

    // 5. 简单动态打分 (演示用，实际应对接 evaluation_rules)
    // 这里保留之前的简单逻辑，重点是数据源现在是真实的了
    const calcScore = (base, val, threshold) =>
      Math.min(100, Math.round(base + (val > threshold ? 20 : 0)));

    const scores = {
      foundation:
        calcScore(60, aggData.totalCapital, 50000) +
        (aggData.totalCompanies > 10 ? 10 : 0),
      tech:
        calcScore(
          50,
          aggData.highTechCount / (aggData.totalCompanies || 1),
          0.1,
        ) + (aggData.totalPatents > 0 ? 20 : 0),
      ability: calcScore(70, aggData.avgCapital, 1000),
    };

    const totalScore = Math.round(
      scores.foundation * 0.3 + scores.tech * 0.4 + scores.ability * 0.3,
    );

    // 6. 获取模型元数据 (维度名称与权重)
    // 假设数据库中的 model_key 映射关系如下
    const metaFoundation = await getModelDimensions("ind_basic");
    const metaTech = await getModelDimensions("ind_tech");
    const metaAbility = await getModelDimensions("ind_ability");

    // 7. 组装响应
    const responseData = {
      basicInfo: {
        industryName: targetTag.tag_name, // 使用数据库中的规范名称
        totalCompanies: aggData.totalCompanies,
        totalCapital: (aggData.totalCapital / 10000).toFixed(2), // 换算为亿元
        avgRisk: aggData.avgRiskScore.toFixed(0),
      },
      totalScore,
      radarData: [
        { item: "行业基础", score: scores.foundation, fullMark: 100 },
        { item: "科技属性", score: scores.tech, fullMark: 100 },
        { item: "行业能力", score: scores.ability, fullMark: 100 },
        { item: "人才聚集", score: 85, fullMark: 100 },
        { item: "资本热度", score: 78, fullMark: 100 },
      ],
      dimensions: [
        {
          key: "foundation",
          title: "行业基础",
          score: scores.foundation,
          weight: "30%",
          desc: "反映行业存量规模、企业数量及注册资本情况",
          metaConfig: metaFoundation, // 新增：完整的维度权重列表
          subRules: [
            {
              name: "企业总量",
              value: aggData.totalCompanies + " 家",
              score: 85,
            },
            {
              name: "资本总量",
              value: (aggData.totalCapital / 10000).toFixed(2) + " 亿元",
              score: scores.foundation,
            },
          ],
        },
        {
          key: "tech",
          title: "科技属性",
          score: scores.tech,
          weight: "40%",
          desc: "反映行业专利申请、高新企业占比及研发投入",
          metaConfig: metaTech, // 新增
          subRules: [
            {
              name: "高企占比",
              value:
                (
                  (aggData.highTechCount / aggData.totalCompanies || 0) * 100
                ).toFixed(1) + "%",
              score: scores.tech,
            },
            {
              name: "专利总数",
              value: aggData.totalPatents + " 件",
              score: 80,
            },
          ],
        },
        {
          key: "ability",
          title: "行业能力",
          score: scores.ability,
          weight: "30%",
          desc: "反映行业盈利能力、纳税贡献及增长潜力",
          metaConfig: metaAbility, // 新增
          subRules: [
            {
              name: "户均资本",
              value: aggData.avgCapital.toFixed(0) + " 万元",
              score: scores.ability,
            },
            {
              name: "平均风控分",
              value: aggData.avgRiskScore.toFixed(0) + " 分",
              score: 90,
            },
          ],
        },
      ],
      risks: {
        high: aggData.highRiskList
          .slice(0, 10)
          .sort((a, b) => a.score - b.score),
        low: aggData.lowRiskList.slice(0, 10).sort((a, b) => b.score - a.score),
      },
    };

    res.json({ success: true, data: responseData });
  } catch (error) {
    console.error("Industry Profile Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
