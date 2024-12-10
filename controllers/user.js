const jwt = require('jsonwebtoken');
const { QueryDatabase } = require('../public/js/database/database.js');

async function requireValidToken(req, res, next) {
  if (!res.locals.isAuthenticated) {
    return res.status(401).send('Unauthorized: No authorization token found or Invalid token');
  }
  next();
}

async function profilePage(req, res) {
  try {
    const userDataDB = await QueryDatabase("SELECT * FROM users WHERE id = ?", [res.locals.userId])
    
    let userData = {
        "email": userDataDB[0][0].email,
        "name": userDataDB[0][0].name,
        "image": userDataDB[0][0].image ? userDataDB[0][0].image : 'img/Users/Default.png'
    }

    const portfolioData = await QueryDatabase(`
    SELECT 
      cs.ca AS contract_address,
      cs.name AS crypto_name,
      cs.acronym AS crypto_acronym,
      p.quantity AS quantity_owned,
      cs.last_price AS last_price,
      cs.id AS crypto_sol_id
    FROM 
      portfolio p
    JOIN 
      crypto_sol cs
    ON 
      p.crypto_id = cs.id
    WHERE 
      p.user_id = ?; `, [res.locals.userId])
    const portfolioChartData = await QueryDatabase("SELECT * FROM portfolio_chart WHERE user_id = ?", [res.locals.userId])

    res.render('profile', { userData, portfolioData, portfolioChartData });
  } catch (err) {
    return res.status(500).send(`Something went wrong: \n${err}`);
  }
}

async function removeCoin(req, res) {
  try {
    await QueryDatabase("DELETE FROM portfolio WHERE user_id = ? AND crypto_id = ?;", [res.locals.userId, req.params.id]);

    res.status(200).send('Removed :)');
  } catch (err) {
    res.status(500).send('Failed to remove coin');
    throw err;
  }
}


async function editCoin(req, res) {
  try {
    await QueryDatabase("UPDATE portfolio SET quantity = ? WHERE user_id = ? AND crypto_id = ?;", [req.params.quantity, res.locals.userId, req.params.id]);
    res.status(200).send('Coin updated ;)');
  } catch (err) {
    res.status(500).send('Failed to edit coinn');
    throw err
  }
}

async function addCoin(req, res) {
  try {
    const { contract_address } = req.body;
    const crypto_id = await QueryDatabase("SELECT id FROM crypto_sol WHERE ca = ?", [contract_address]);
    await QueryDatabase("INSERT INTO portfolio (user_id, crypto_id, quantity) VALUES (?, ?, ?);", [res.locals.userId, crypto_id[0][0].id, 0]);
    res.status(200).send('Coin added');
  } catch (err) {
    res.status(500).send('Failed to add coin');
    throw err
  }
}

module.exports = { profilePage, requireValidToken, removeCoin, editCoin, addCoin }