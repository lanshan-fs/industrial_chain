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
  const { messages, sessionId } = req.body; // 前端传当前的 sessionId (如果是新对话则为 null)

  const API_KEY = "sk-d1a18b48e5b544fbadd0ece3ab3960ee";
  const API_URL = "https://api.deepseek.com/chat/completions";

  // 生成或使用现有的 session_id
  let currentSessionId = sessionId;
  let isNewSession = false;

  if (!currentSessionId) {
    currentSessionId = crypto.randomUUID();
    isNewSession = true;
  }

  // 获取用户最新的一条消息（用于做标题和存库）
  const userLatestMsg = messages[messages.length - 1].content;

  try {
    // 1. 如果是新会话，先存 session 表
    if (isNewSession) {
      // 截取前 20 个字作为标题
      const title =
        userLatestMsg.substring(0, 20) +
        (userLatestMsg.length > 20 ? "..." : "");
      await pool.query(
        "INSERT INTO chat_sessions (session_id, title) VALUES (?, ?)",
        [currentSessionId, title],
      );
    }

    // 2. 存用户的提问到 message 表
    await pool.query(
      "INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)",
      [currentSessionId, "user", userLatestMsg],
    );

    // 3. 调用 DeepSeek API
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

    // 4. 存 AI 的回复到 message 表
    await pool.query(
      "INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)",
      [currentSessionId, "assistant", aiContent],
    );

    // 返回内容，同时返回 sessionId 给前端，以便前端下次接着发
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

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
