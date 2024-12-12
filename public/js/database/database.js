const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const predefined = require('./predefined.json')
dotenv.config();

let db;
function getDb() {
  db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  }).promise();
}

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  }).promise();

  try {
    connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DATABASE};`);
  } catch (err) {
    throw err;
  } finally {
    await connection.end();
  }

  getDb();
}

async function createTables() {

  await db.query(`
    CREATE TABLE users (
      email VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(60) NOT NULL,
      image VARCHAR(100),
      name VARCHAR(50) NOT NULL DEFAULT 'Lunar User',
      id BIGINT AUTO_INCREMENT PRIMARY KEY
    );
  `);

  await db.query(`
    CREATE TABLE crypto_sol (
      ca VARCHAR(50) NOT NULL UNIQUE,
      name VARCHAR(50) NOT NULL,
      acronym VARCHAR(9) NOT NULL,
      H_open DECIMAL(18, 8),
      H_high DECIMAL(18, 8) NOT NULL DEFAULT 0,
      H_low DECIMAL(18, 8) NOT NULL DEFAULT 100000000,
      H_close DECIMAL(18, 8),
      decimals TINYINT NOT NULL,
      last_price DECIMAL(18, 8) DEFAULT 0,
      id BIGINT AUTO_INCREMENT PRIMARY KEY
    );
  `);

  await db.query(`
    CREATE TABLE portfolio_chart (
      chart_id BIGINT PRIMARY KEY AUTO_INCREMENT,
      user_id BIGINT NOT NULL,
      timestamp BIGINT NOT NULL,
      open DECIMAL(18, 8) NOT NULL,
      high DECIMAL(18, 8) NOT NULL,
      low DECIMAL(18, 8) NOT NULL,
      close DECIMAL(18, 8) NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
  await db.query(`
    CREATE TABLE portfolio (
      user_id BIGINT NOT NULL,
      crypto_id BIGINT NOT NULL,
      quantity DECIMAL(30, 8) NOT NULL,
      FOREIGN KEY (crypto_id) REFERENCES crypto_sol(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      PRIMARY KEY (user_id, crypto_id)
    );
  `);

  predefined.crypto_sol.forEach(async (token) => {
    await db.query(`INSERT INTO crypto_sol (ca, name, acronym, decimals)
      VALUES (?, ?, ?, ?)`, [token.ca, token.name, token.acronym, token.decimals])
  });
}

async function connectToDatabase() {

  try {
    await db.connect();
    console.log("Database conectada com sucesso!");
    return true;
  } catch (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    return false;
  }
}

async function createUser(email, password) {

  const hashpass = await bcrypt.hash(password, 10);
  const sql = `INSERT INTO users (email, password) VALUES (?, ?)`;
  const [result] = await db.query(sql, [email, hashpass]);

  return result.insertId;
}

async function QueryDatabase(query, params) {

  try {
    const result = await db.query(query, params);
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = { createDatabase, createTables, connectToDatabase, createUser, QueryDatabase };