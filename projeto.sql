DROP TABLE users;

DROP TABLE crypto_sol;

DROP TABLE portfolio;
DROP TABLE portfolio_chart

CREATE TABLE users (
  email VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(60) NOT NULL,
  image VARCHAR(100),
  name VARCHAR(50) NOT NULL DEFAULT "Lunar User",
  id BIGINT AUTO_INCREMENT PRIMARY KEY
);

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

INSERT INTO crypto_sol (ca, name, acronym, decimals) VALUES ("34a8ALsPmbWxp7D3bQ6erERrCLz1ahr6u6o66Udmpump", "Pesto the Baby King Penguin", "PESTO", 6);
INSERT INTO crypto_sol (ca, name, acronym, decimals) VALUES ("3B5wuUrMEi5yATD7on46hKfej3pfmd7t1RKgrsN3pump", "BILLY", "BILLY", 6);
INSERT INTO crypto_sol (ca, name, acronym, decimals) VALUES ("8Sk2EJ9oo25b7Mmf4qd5gJw6z3738AXvAbkuSSpQpump", "WAWA CAT", "WAWA", 6);
INSERT INTO crypto_sol (ca, name, acronym, decimals) VALUES ("7RrLheV7dSecVka3MfjYb4Wa6Z6uegNyzhpFeERsfFZP", "Retardia", "Retardia", 6);
INSERT INTO crypto_sol (ca, name, acronym, decimals) VALUES ("Df6yfrKC8kZE3KNkrHERKzAetSxbrWeniQfyJY4Jpump", "Just a chill guy", "CHILLGUY", 6);

INSERT INTO crypto_sol (ca, name, acronym, decimals) VALUES ("9d24jNVbvHQH3pCB1ZzxRjpFuVV4j1MMJDU3SPxQpump", "AA", "AAA", 6);

CREATE TABLE portfolio_chart (
  user_id BIGINT NOT NULL,
  timestamp BIGINT NOT NULL,
  open DECIMAL(18, 8) NOT NULL,
  high DECIMAL(18, 8) NOT NULL,
  low DECIMAL(18, 8) NOT NULL,
  close DECIMAL(18, 8) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
)

UPDATE crypto_sol SET H_close = 10 WHERE ca = "34a8ALsPmbWxp7D3bQ6erERrCLz1ahr6u6o66Udmpump";
SELECT * FROM crypto_sol WHERE id = 5 ;

SELECT * FROM portfolio_chart WHERE user_id = 1;
CREATE TABLE portfolio (
  user_id BIGINT NOT NULL,
  crypto_id BIGINT NOT NULL,
  quantity DECIMAL(18, 8) NOT NULL,
  FOREIGN KEY (crypto_id) REFERENCES crypto_sol(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  PRIMARY KEY (user_id, crypto_id)
);

SELECT * FROM crypto_sol WHERE id = 4;
INSERT INTO portfolio (user_id, crypto_id, quantity) VALUES (1, 4, 900000);

SELECT 
  cs.id AS crypto_id,
  cs.ca AS contract_address,
  cs.name AS crypto_name,
  cs.acronym AS crypto_acronym,
  p.quantity AS quantity_owned,
FROM 
  portfolio p
JOIN 
  crypto_sol cs
ON 
  p.crypto_id = cs.id
WHERE 
  p.user_id = 1; 


SELECT id FROM crypto_sol WHERE ca = "9d24jNVbvHQH3pCB1ZzxRjpFuVV4j1MMJDU3SPxQpump";