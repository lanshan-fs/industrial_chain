import mysql from "mysql2/promise";

// 示例数据
const data = [
  ["腾讯科技", "互联网", 95],
  ["阿里巴巴", "电商", 92],
];

async function main() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Justdoit123@",
    database: "industrial_chain",
  });

  console.log("数据库连接成功！");

  try {
    const sql = "INSERT INTO enterprises (name, industry, score) VALUE ?";

    // query 方法接受两个参数：SQL 语句和参数数组
    // 注意：批量插入时，mysql2 要求数据必须是 [ [row1], [row2] ] 的格式
    const [result] = await connection.query(sql, [data]);

    console.log(`成功导入 ${result.affectedRows}`);
  } catch (err) {
    console.error("导入数据出错：", err);
  } finally {
    await connection.end();
  }
}

main();
