const jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticateToken(req, res, next) {
  const token = req.cookies?.jwt;
  console.log(token);

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }
      req.user = user;
      console.log(user);
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
}

module.exports = authenticateToken;
