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

async function hashedPassword(password) {
  const hashpass = await bcrypt.hash(password, 10);
  return hashpass;
}

async function createUser(email, password) {
  const hashpass = await hashedPassword(password);
  const sql = `INSERT INTO users (email, password) VALUES (?, ?)`;
  const [result] = await db.query(sql, [email, hashpass]);

  console.log({
    email: email,
    password: hashpass
  })

  return result.insertId;
}

async function findInDatabase(select, from, where, info) {
  try {
    const sql = select === "*"
      ? `SELECT * FROM ?? WHERE ?? = ?`
      : `SELECT ?? FROM ?? WHERE ?? = ?`;
    
    const params = select === "*" ? [from, where, info] : [select, from, where, info];
    
    const result = await db.query(sql, params);
    return result;
  } catch (error) {
    throw error;
  }
}


module.exports = { connectToDatabase, createUser, findInDatabase, hashedPassword}