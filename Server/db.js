const mysql = require('mysql2');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'blog'
});
con.connect((err) => {
    if (err) {
        console.log("Problem while connecting to the database:", err);
    } else {
        console.log("Database connected successfully");
    }
});
module.exports = con;