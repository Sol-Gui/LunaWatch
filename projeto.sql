DROP TABLE users;

DROP TABLE crypto_sol;

DROP TABLE portfolio;

CREATE TABLE users (
  email VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(60) NOT NULL,
  id BIGINT AUTO_INCREMENT PRIMARY KEY
);

CREATE TABLE crypto_sol (
  ca VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(50) NOT NULL,
  acronym VARCHAR(9) NOT NULL,
  id BIGINT AUTO_INCREMENT PRIMARY KEY
);

# INSERT INTO crypto_sol (ca, name, acronym) VALUES ("B", "BB", "BBB");

CREATE TABLE portfolio (
  user_id BIGINT NOT NULL,
  crypto_id BIGINT NOT NULL,
  quantity DECIMAL(18, 8) NOT NULL,
  FOREIGN KEY (crypto_id) REFERENCES crypto_sol(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  PRIMARY KEY (user_id, crypto_id)
);

# INSERT INTO portfolio (user_id, crypto_id, quantity) VALUES (1, 3, 100)

SELECT 
  cs.id AS crypto_id,
  cs.ca AS contract_address,
  cs.name AS crypto_name,
  cs.acronym AS crypto_acronym,
  p.quantity AS quantity_owned
FROM 
  portfolio p
JOIN 
  crypto_sol cs
ON 
  p.crypto_id = cs.id
WHERE 
  p.user_id = 1; 