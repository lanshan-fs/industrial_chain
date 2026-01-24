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
        level: tag.level,
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
      } else if (tag.level === 1) {
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
      `Tree Build Complete: Total L1 Tags: ${l1Nodes.length}, Mapped: ${mappedCount}`,
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
        (t) => t.level === 1 && stageMap[t.tag_name] === stageName,
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

    let sql = `
      SELECT DISTINCT 
        c.company_id, 
        c.company_name, 
        c.raw_variants
      FROM companies c
    `;

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
    console.error("Search Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
