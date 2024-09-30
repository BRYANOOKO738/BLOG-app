const jwt = require('jsonwebtoken');
const express =require("express")
// const con = require('..');
const router = express.Router();


function verifyToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(403).send('Token is required');
    }
    try {
        const decoded = jwt.verify(token, 'PROCESS.env.JWT_SECRET');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).send('Invalid token');
    }
}
module.exports = router;

