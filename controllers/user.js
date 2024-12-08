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
    const token = req.cookies.jwtToken;
    const decoded = jwt.verify(token, process.env.SECRET);
    const userDataDB = await QueryDatabase("SELECT * FROM users WHERE id = ?", [decoded.id])
    
    let userData = {
        "email": userDataDB[0][0].email,
        "name": userDataDB[0][0].name,
        "image": userDataDB[0][0].image ? userDataDB[0][0].image : 'img/Users/Default.png'
    }

    res.render('profile', { userData });
  } catch (err) {
    return res.status(500).send(`Something went wrong: \n${err}`);
  }
}

module.exports = { profilePage, requireValidToken }