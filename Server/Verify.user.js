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

  console.log(token);

  // Use the same secret used when signing the token
//   const secretKey = process.env.JWT_SECRET || '@OOKO738kk';

  // Decode the token without verifying the signature
  const decodedToken = jwt.decode(token);
  console.log(decodedToken);

  // Check if the token is decoded properly and contains the id
  if (!decodedToken || !decodedToken.id) {
    return res.status(400).send('Invalid token.');
  }

  // Initialize req.user if it's not already initialized
//   req.user = req.user || {};

  // Assign the decoded id to req.user.id
    req.user = decodedToken;
    console.log(req.user);

  // Proceed to the next middleware
  next();
};

module.exports = verifyToken;
