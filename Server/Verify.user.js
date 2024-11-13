const jwt = require('jsonwebtoken');
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware to parse cookies
app.use(cookieParser());

// const jwt = require('jsonwebtoken');

// const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).send('No token provided.');
  }
try {
  const secretKey = process.env.JWT_SECRET;
  const decodedToken = jwt.verify(token, secretKey);

  req.user = decodedToken;
   next();
} catch (error) {
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid token." });
  } else if (error.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Token expired." });
  } else {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while verifying the token." });
  }
  
}
  
   
 
};

module.exports = verifyToken;
