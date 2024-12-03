const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise();

async function connectToDatabase() {
  try {
    await db.connect();
    console.log("Database conectada com sucesso!");
  } catch (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
  }
}

async function createUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = `INSERT INTO users (email, password) VALUES (?, ?)`;
  const [result] = await db.query(sql, [email, hashedPassword]);

  console.log({
    email: email,
    password: hashedPassword
  })

  return result.insertId;
}

module.exports = { connectToDatabase, createUser }