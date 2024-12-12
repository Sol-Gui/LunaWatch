CREATE DATABASE lunawatch;

DROP DATABASE lunawatch;

SELECT * FROM crypto_sol WHERE id = 1;
SELECT * FROM portfolio_chart WHERE user_id = 1;

SELECT close FROM portfolio_chart WHERE user_id = 1 ORDER BY chart_id DESC LIMIT 1;

SELECT * FROM portfolio_chart WHERE user_id = 1;

CREATE TABLE lunawatch.users (
  email VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(60) NOT NULL,
  image VARCHAR(100),
  name VARCHAR(50) NOT NULL DEFAULT "Lunar User",
  id BIGINT AUTO_INCREMENT PRIMARY KEY
);

CREATE TABLE lunawatch.crypto_sol (
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

CREATE TABLE lunawatch.portfolio_chart (
  chart_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  timestamp BIGINT NOT NULL,
  open DECIMAL(18, 8) NOT NULL,
  high DECIMAL(18, 8) NOT NULL,
  low DECIMAL(18, 8) NOT NULL,
  close DECIMAL(18, 8) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE lunawatch.portfolio (
  portfolio_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  crypto_id BIGINT NOT NULL,
  quantity DECIMAL(30, 8) NOT NULL,
  FOREIGN KEY (crypto_id) REFERENCES crypto_sol(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  PRIMARY KEY (user_id, crypto_id)
);