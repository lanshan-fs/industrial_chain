import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import { message } from "antd";

const app = express();
const PORT = 3306;

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
    console.log("Database connected");
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

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
