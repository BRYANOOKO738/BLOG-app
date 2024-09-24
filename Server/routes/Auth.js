const express = require('express');
const con = require('../db');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const jwt = require("jsonwebtoken")

const secretKey = 'PROCESS.env.JWT_SECRET';
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    
    const checkEmailSql = 'SELECT * FROM users WHERE email = ?';
  con.query(checkEmailSql, [email], async (err, results) => {
    if (err) {
      console.error('Error checking email:', err);
      return res.status(500).json({ error: 'Server error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'User is already registered' });
    }

    try {
      const hash = await bcrypt.hash(password, 10);
      const sql = 'INSERT INTO users(username,password, email) VALUES (?, ?, ?)';
      
      con.query(sql, [username, hash, email], (err, result) => {
        if (err) {
          console.error('Error while inserting:', err);
          return res.status(500).json({ error: 'Error while inserting' });
        } else {
          res.status(200).json({ message: 'Registered successfully' });
        }
      });
    } catch (error) {
      console.error('Error hashing password:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

})

router.get('/test', (req, res) => { 
    res.send('Server working');  
})

router.post('/login', (req, res) => { 
    const { email, password } = req.body;
    
    if (!email ||!password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const sql = 'SELECT * FROM users WHERE email = ?';  
    con.query(sql, [email], async (err, result) => {
        if (err || result.length === 0) {
            return res.status(404).json({ error: 'Invalid credentials' });
        }
        
        try {
            const user = result[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                res.json({ message: `You have logged in successfully` });
            } else {
                res.status(404).json({ error: 'Invalid credentials' });
          }
          console.log('Password received:', req.body.password); // Log password received from the frontend

        } catch (error) {
            console.error('Error comparing passwords:', error);
            res.status(500).json({ error: 'Server error' });
      }
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username
        },
        secretKey,
        { expiresIn: '1h' } // Token expires in 1 hour
      );
      res.status(200).cookie('access_token', token, {
        httpOnly: true
      }).json("user")
    });
})

module.exports = router;