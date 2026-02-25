import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import crypto from "crypto";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "chaoyang_industrial_secret_2026";

app.use(cors());
app.use(express.json());

// --- 数据库连接池 ---
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "industrial_chain",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// --- 邮件服务配置 ---
const codeCache = new Map();
const emailPort = parseInt(process.env.EMAIL_PORT) || 465;
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.163.com",
  port: emailPort,
  secure: emailPort === 465,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  tls: { rejectUnauthorized: false }
});

// ==========================================
// 1. 用户认证模块 (Auth)
// ==========================================

app.post("/api/auth/register", async (req, res) => {
  const { username, password, email, realName, inviteCode } = req.body;
  if (inviteCode !== "CY2026") return res.status(400).json({ success: false, message: "邀请码无效" });
  try {
    const [existing] = await pool.query("SELECT id FROM users WHERE username = ? OR email = ?", [username, email]);
    if (existing.length > 0) return res.status(400).json({ success: false, message: "用户名或邮箱已存在" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await pool.query("INSERT INTO users (username, password, email, real_name) VALUES (?, ?, ?, ?)", [username, hashedPassword, email, realName]);
    res.json({ success: true, message: "注册成功" });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length === 0) return res.status(400).json({ success: false, message: "用户不存在" });
    const user = rows[0];
    let isMatch = (user.password === password) ? true : await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "密码错误" });
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ success: true, data: { token, user: { id: user.id, username: user.username, role: user.role, realName: user.real_name } } });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

app.post("/api/auth/send-code", async (req, res) => {
  const { username, email } = req.body;
  try {
    const [rows] = await pool.query("SELECT id FROM users WHERE username = ? AND email = ?", [username, email]);
    if (rows.length === 0) return res.status(400).json({ success: false, message: "用户名与绑定的邮箱不匹配" });
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    codeCache.set(username, { code, email, expire: Date.now() + 5 * 60 * 1000 });
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({ from: `"朝阳产业链平台" <${process.env.EMAIL_USER}>`, to: email, subject: "【安全验证】找回您的登录密码", html: `<p>您好，您正在申请重置密码。</p><p>您的验证码是：<b>${code}</b></p>` });
      res.json({ success: true, message: "验证码已发送至您的邮箱" });
    } else { res.json({ success: true, message: `(模拟) 验证码：${code}` }); }
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

app.post("/api/auth/reset-password", async (req, res) => {
  const { username, code, newPassword } = req.body;
  try {
    const cached = codeCache.get(username);
    if (!cached || cached.code !== code || Date.now() > cached.expire) return res.status(400).json({ success: false, message: "验证码无效或已过期" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await pool.query("UPDATE users SET password = ? WHERE username = ?", [hashedPassword, username]);
    codeCache.delete(username);
    res.json({ success: true, message: "密码重置成功" });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

// ==========================================
// 2. 基础数据与元数据模块 (Meta)
// ==========================================

app.get("/api/meta/all", async (req, res) => {
  try {
    const [dictRows] = await pool.query("SELECT group_code, name FROM sys_dictionary ORDER BY sort_order");
    const dictionary = {};
    dictRows.forEach(row => { if (!dictionary[row.group_code]) dictionary[row.group_code] = []; dictionary[row.group_code].push({ label: row.name, value: row.name }); });
    
    const tagMapping = { 103: "PAID_CAPITAL", 104: "BIZ_STATUS", 105: "ENT_TYPE", 106: "ORG_TYPE", 108: "BRANCH_STATUS", 109: "ADDR_INFO", 110: "FINANCING", 201: "STAFF_RANGE", 202: "INSURED_RANGE", 203: "LISTING_STATUS", 204: "ABOVE_SCALE", 205: "CONTACT_TYPE", 206: "NUMBER_STATUS", 207: "EMAIL_STATUS", 208: "SMALL_MICRO", 209: "CHANGE_INFO", 210: "TAX_PAYER", 211: "FINANCING", 212: "BIDDING", 213: "RECRUITMENT", 214: "TAX_RATING", 215: "IMPORT_EXPORT", 216: "BANK_TYPE", 301: "PATENT_TYPE", 302: "TECH_ATTR", 303: "CERT_TYPE", 304: "IP_STATUS_TRADEMARK", 305: "IP_STATUS_PATENT", 306: "IP_STATUS_COPYRIGHT", 307: "IP_STATUS_SOFTWARE", 308: "IP_STATUS_HIGH_TECH", 309: "IP_STATUS_WECHAT", 310: "IP_STATUS_STANDARD", 311: "IP_STATUS_IC", 312: "IP_STATUS_CONST", 313: "IP_STATUS_WEB", 314: "IP_STATUS_ICP", 315: "IP_STATUS_FRANCHISE", 401: "RISK_DISHONEST", 402: "RISK_MORTGAGE", 403: "RISK_ABNORMAL", 404: "RISK_LEGAL_DOC", 405: "RISK_PENALTY", 406: "RISK_BANKRUPTCY", 407: "RISK_LIQUIDATION", 408: "RISK_ENV_PENALTY", 409: "RISK_EQUITY_FREEZE", 410: "RISK_EXECUTOR", 411: "RISK_LIMIT_CONSUMPTION", 501: "scenario" };
    
    const [tagRows] = await pool.query("SELECT sub_dimension_id, tag_name FROM tag_library ORDER BY sort_order");
    const scenarios = [];
    tagRows.forEach(row => { 
      const k = tagMapping[row.sub_dimension_id]; 
      if (k === "scenario") scenarios.push({ label: row.tag_name, value: row.tag_name }); 
      else if (k) { 
        if (!dictionary[k]) dictionary[k] = []; 
        if (!dictionary[k].some(item => item.value === row.tag_name)) dictionary[k].push({ label: row.tag_name, value: row.tag_name }); 
      } 
    });

    const [indRows] = await pool.query("SELECT id, parent_id, name FROM industry_categories ORDER BY sort_order");
    const buildTree = (items, pid = null) => items.filter(i => i.parent_id === pid).map(i => ({ title: i.name, value: i.name, key: i.id, children: buildTree(items, i.id) }));
    
    const [regRows] = await pool.query("SELECT name, type FROM sys_region ORDER BY sort_order");
    
    res.json({ 
      success: true, 
      data: { 
        dictionary, 
        industryTree: buildTree(indRows, null), 
        scenarios, 
        regions: { 
          street: regRows.filter(r => r.type === 'STREET').map(r => ({ label: r.name, value: r.name })), 
          area: regRows.filter(r => r.type === 'AREA').map(r => ({ label: r.name, value: r.name })) 
        } 
      } 
    });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ==========================================
// 3. 产业链与行业分析模块
// ==========================================

/**
 * 产业链树谱数据 (恢复)
 */
app.get("/api/industry/tree", async (req, res) => {
  try {
    const [cats] = await pool.query("SELECT * FROM industry_categories ORDER BY sort_order");
    const [sm] = await pool.query("SELECT * FROM tags_chain_stage_map");
    const stageMap = {}; sm.forEach(r => stageMap[r.level1] = r.chain_stage);
    
    const [cnts] = await pool.query("SELECT tag_id, COUNT(DISTINCT company_id) as count FROM company_tag_map GROUP BY tag_id");
    const countMap = {}; cnts.forEach(c => countMap[c.tag_id] = c.count);
    
    const nodeMap = {}; cats.forEach(c => { nodeMap[c.id] = { key: c.id, title: c.name, level: c.level, children: [], count: countMap[c.id] || 0, isTag: true }; });
    const finalTree = [{ key: "stage_upstream", title: "上游", children: [], isStage: true }, { key: "stage_midstream", title: "中游", children: [], isStage: true }, { key: "stage_downstream", title: "下游", children: [], isStage: true }];
    
    cats.forEach(c => { 
      const n = nodeMap[c.id]; 
      if (c.parent_id && nodeMap[c.parent_id]) nodeMap[c.parent_id].children.push(n); 
      if (c.level === 1) { 
        const t = finalTree.find(x => x.title === stageMap[c.name]); 
        if (t) t.children.push(n); 
      } 
    });
    res.json({ success: true, data: finalTree });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

/**
 * 首页总览统计 (恢复)
 */
app.get("/api/dashboard/overview", async (req, res) => {
  try {
    const [tRows] = await pool.query("SELECT COUNT(*) as total FROM companies");
    const [stats] = await pool.query("SELECT m.chain_stage as stage, ic.name as tagName, COUNT(DISTINCT ctm.company_id) as count FROM tags_chain_stage_map m JOIN industry_categories ic ON m.level1 = ic.name LEFT JOIN company_tag_map ctm ON ic.id = ctm.tag_id GROUP BY m.chain_stage, ic.name ORDER BY count DESC");
    const sMap = { "上游": { type: "upstream", title: "上游 · 研发与技术", color: "#1890ff", list: [] }, "中游": { type: "midstream", title: "中游 · 生产与制造", color: "#52c41a", list: [] }, "下游": { type: "downstream", title: "下游 · 服务与应用", color: "#fa8c16", list: [] } };
    stats.forEach(r => { if (sMap[r.stage]) sMap[r.stage].list.push({ name: r.tagName, count: r.count, isWeak: r.count === 0 }); });
    res.json({ success: true, data: { totalCompanies: tRows[0].total, chainData: Object.values(sMap).map(s => ({...s, total: s.list.reduce((a, b) => a + b.count, 0), subTags: s.list})) } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

/**
 * 行业画像/高级搜索 - 企业列表查询
 */
app.get("/api/industry/companies", async (req, res) => {
  const { keyword, tagId } = req.query;
  try {
    let sql = "SELECT DISTINCT c.company_id, c.company_name, c.reg_capital as registeredCapital, c.legal_person as legalPerson, c.establishment_date_desc as establishmentDate, c.enterprise_scale as scale, c.district, c.street, c.phone_gs as phone, c.email_gs as email, c.financing_round FROM companies c";
    const params = []; const conds = ["1=1"];
    if (tagId) { sql += " JOIN company_tag_map ctm ON c.company_id = ctm.company_id "; conds.push("ctm.tag_id = ?"); params.push(tagId); }
    if (keyword) { conds.push("(c.company_name LIKE ? OR c.company_id LIKE ?)"); params.push(`%${keyword}%`, `%${keyword}%`); }
    const [rows] = await pool.query(`${sql} WHERE ${conds.join(" AND ")} LIMIT 100`, params);
    if (rows.length > 0) {
      const [tRows] = await pool.query("SELECT m.company_id, t.tag_name FROM company_tag_map m JOIN tag_library t ON m.tag_id = t.id WHERE m.company_id IN (?)", [rows.map(r => r.company_id)]);
      rows.forEach(r => { r.tags = tRows.filter(t => t.company_id === r.company_id).map(t => t.tag_name); r.key = r.company_id; });
    }
    res.json({ success: true, data: rows });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

/**
 * 企业详情
 */
app.get("/api/companies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM companies WHERE company_id = ? OR company_name = ?", [id, id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: "未找到企业" });
    const raw = rows[0];
    const [tRows] = await pool.query("SELECT t.tag_name FROM company_tag_map ctm JOIN tag_library t ON ctm.tag_id = t.id WHERE ctm.company_id = ?", [raw.company_id]);
    const parseList = (s) => s ? s.split(/[;；,，\n]/).filter(x => x.trim()).map((x, i) => ({ key: i, name: x.trim() })) : [];
    res.json({ success: true, data: { baseInfo: { id: raw.company_id, name: raw.company_name, legalPerson: raw.legal_person, status: "存续", establishDate: raw.establishment_date_desc, regCapital: raw.reg_capital, paidInCapital: raw.paid_capital, address: raw.address_detail || raw.address_info, industry: raw.industry_gs, scope: raw.business_scope }, basicInfoData: { shareholders: parseList(raw.shareholders), branches: parseList(raw.is_branch_info), keyPersonnel: [{ key: 1, name: raw.legal_person, title: "法定代表人" }], social: [{ key: 1, year: '2024', pension: raw.insured_count || 0 }] }, tags: tRows.map(t => t.tag_name), metrics: { totalScore: raw.total_score || 85, rank: 12 }, migrationRisk: { level: "低", score: 20, color: "#52c41a", factors: [] }, overallRadar: [{ item: "基础实力", score: 80 }, { item: "科技属性", score: 90 }, { item: "专业能力", score: 75 }, { item: "成长潜力", score: 85 }, { item: "合规风险", score: 95 }], models: { basic: { score: 85, dimensions: [] }, tech: { score: 80, dimensions: [] }, ability: { score: 75, dimensions: [] } }, honors: raw.qualifications ? raw.qualifications.split('|').map(q => ({ year: '-', name: q.trim() })) : [] } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ==========================================
// 4. 智能诊断 AI 模块 (恢复)
// ==========================================

app.post("/api/chat", async (req, res) => {
  const { messages, sessionId } = req.body;
  const API_KEY = process.env.DEEPSEEK_API_KEY;
  const API_URL = "https://api.deepseek.com/chat/completions";
  let currentSessionId = sessionId || crypto.randomUUID();
  try {
    let aiContent = "";
    if (!API_KEY) { aiContent = "【演示模式】密钥未配置。请在 .env 文件中配置 DEEPSEEK_API_KEY。"; } else {
      const response = await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}` }, body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "system", content: "你是一个专业的产业链分析助手" }, ...messages] }) });
      const data = await response.json(); 
      aiContent = data.choices ? data.choices[0].message.content : "AI 服务暂时不可用：" + JSON.stringify(data);
    }
    res.json({ success: true, data: aiContent, sessionId: currentSessionId });
  } catch (error) { res.json({ success: false, message: error.message }); }
});

// ==========================================
// 5. 系统管理模块
// ==========================================

/**
 * 系统管理：企业数据列表 (带聚合标签)
 */
app.get("/api/system/companies", async (req, res) => {
  const { page = 1, pageSize = 15, keyword = "" } = req.query;
  const offset = (page - 1) * pageSize;
  try {
    let where = "WHERE 1=1";
    const params = [];
    if (keyword) { where += " AND (company_name LIKE ? OR company_id LIKE ?)"; params.push(`%${keyword}%`, `%${keyword}%`); }
    const [totalRows] = await pool.query(`SELECT COUNT(*) as total FROM companies ${where}`, params);
    const [rows] = await pool.query(`SELECT company_id as \`key\`, company_name as name, legal_person as legalPerson, reg_capital_rmb as registeredCapital, establishment_date_desc as establishmentDate, update_time as updateTime FROM companies ${where} ORDER BY create_time DESC LIMIT ? OFFSET ?`, [...params, parseInt(pageSize), offset]);
    if (rows.length === 0) return res.json({ success: true, data: [], total: 0 });
    const [tagRows] = await pool.query(`SELECT ctm.company_id, tl.tag_name FROM company_tag_map ctm JOIN tag_library tl ON ctm.tag_id = tl.id WHERE ctm.company_id IN (?)`, [rows.map(r => r.key)]);
    const result = rows.map(r => ({ ...r, variants: tagRows.filter(t => t.company_id === r.key).map(t => t.tag_name).join(" | ") }));
    res.json({ success: true, data: result, total: totalRows[0].total });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

app.post("/api/system/companies", async (req, res) => {
  const { key, name, legalPerson, registeredCapital, establishmentDate } = req.body;
  try {
    await pool.query(`INSERT INTO companies (company_id, company_name, legal_person, reg_capital_rmb, establishment_date_desc) VALUES (?, ?, ?, ?, ?)`, [key, name, legalPerson, registeredCapital, establishmentDate]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

app.put("/api/system/companies/:id", async (req, res) => {
  const { id } = req.params;
  const { name, legalPerson, registeredCapital, establishmentDate } = req.body;
  try {
    await pool.query(`UPDATE companies SET company_name = ?, legal_person = ?, reg_capital_rmb = ?, establishment_date_desc = ? WHERE company_id = ?`, [name, legalPerson, registeredCapital, establishmentDate, id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

app.delete("/api/system/companies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM companies WHERE company_id = ?", [id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

// --- 系统管理：标签管理 ---

/**
 * 标签管理：获取企业列表及聚合标签
 */
app.get("/api/tags/companies", async (req, res) => {
  const { page = 1, pageSize = 10, keyword = "" } = req.query;
  const offset = (page - 1) * pageSize;
  try {
    let where = "WHERE 1=1";
    const params = [];
    if (keyword) { where += " AND (company_name LIKE ? OR company_id LIKE ?)"; params.push(`%${keyword}%`, `%${keyword}%`); }
    const [totalRows] = await pool.query(`SELECT COUNT(*) as total FROM companies ${where}`, params);
    const [rows] = await pool.query(`SELECT company_id, company_name FROM companies ${where} LIMIT ? OFFSET ?`, [...params, parseInt(pageSize), offset]);
    if (rows.length === 0) return res.json({ success: true, data: { list: [], total: 0 } });
    const [tagRows] = await pool.query(`SELECT ctm.company_id, tl.tag_name, td.name as dimensionName FROM company_tag_map ctm JOIN tag_library tl ON ctm.tag_id = tl.id JOIN tag_sub_dimensions tsd ON tl.sub_dimension_id = tsd.id JOIN tag_dimensions td ON tsd.dimension_id = td.id WHERE ctm.company_id IN (?)`, [rows.map(r => r.company_id)]);
    const dimMap = { "基本信息": "basic", "经营状况": "business", "知识产权": "tech", "风险信息": "risk", "产业链环节": "market" };
    const list = rows.map(r => {
      const dimensions = { basic: [], business: [], tech: [], risk: [], market: [] };
      tagRows.filter(t => t.company_id === r.company_id).forEach(t => { const key = dimMap[t.dimensionName]; if (key) dimensions[key].push(t.tag_name); });
      return { key: r.company_id, name: r.company_name, code: r.company_id, dimensions };
    });
    res.json({ success: true, data: { list, total: totalRows[0].total } });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

/**
 * 标签管理：添加标签
 */
app.post("/api/tags/add", async (req, res) => {
  const { companyId, tagName } = req.body;
  try {
    const [tagRows] = await pool.query("SELECT id FROM tag_library WHERE tag_name = ? LIMIT 1", [tagName]);
    if (tagRows.length === 0) return res.status(400).json({ success: false, message: "标签不存在" });
    await pool.query("INSERT IGNORE INTO company_tag_map (company_id, tag_id) VALUES (?, ?)", [companyId, tagRows[0].id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

/**
 * 标签管理：删除标签
 */
app.post("/api/tags/delete", async (req, res) => {
  const { companyId, tagName } = req.body;
  try {
    const [tagRows] = await pool.query("SELECT id FROM tag_library WHERE tag_name = ? LIMIT 1", [tagName]);
    if (tagRows.length > 0) {
      await pool.query("DELETE FROM company_tag_map WHERE company_id = ? AND tag_id = ?", [companyId, tagRows[0].id]);
    }
    res.json({ success: true });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

/**
 * 标签管理：维度统计 (恢复)
 */
app.get("/api/tags/dimensions/stats", async (req, res) => {
  try {
    const [totalRows] = await pool.query("SELECT COUNT(*) as total FROM companies");
    const totalCompanies = totalRows[0].total || 1;
    const [rows] = await pool.query(`
      SELECT td.id, td.name, COUNT(DISTINCT tl.id) as tagCount, COUNT(DISTINCT ctm.company_id) as usedCount
      FROM tag_dimensions td
      LEFT JOIN tag_sub_dimensions tsd ON td.id = tsd.dimension_id
      LEFT JOIN tag_library tl ON tsd.id = tl.sub_dimension_id
      LEFT JOIN company_tag_map ctm ON tl.id = ctm.tag_id
      GROUP BY td.id, td.name ORDER BY td.sort_order
    `);
    const colorMap = ["#1890ff", "#52c41a", "#fa8c16", "#722ed1", "#13c2c2", "#f5222d", "#eb2f96", "#faad14"];
    const data = rows.map((r, i) => ({ ...r, color: colorMap[i % colorMap.length], coverage: Math.round((r.usedCount / totalCompanies) * 100) }));
    res.json({ success: true, data: { dimensions: data, overview: { totalTags: data.reduce((a, c) => a + c.tagCount, 0), coveredEnterprises: data.reduce((a, c) => Math.max(a, c.usedCount), 0), totalCompanies } } });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
