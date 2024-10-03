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
    const image = "https://www.pngkit.com/png/full/281-2812821_user-account-management-logo-user-icon-png.png"; 
       
    try {
      const hash = await bcrypt.hash(password, 10);
      const sql = 'INSERT INTO users(username,password, email,image) VALUES (?, ?,?, ?)';
      
      con.query(sql, [username, hash, email,image], (err, result) => {
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

    // Validate input
    if (!email || !password) {
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
                // Generate JWT token
                const token = jwt.sign(
                    {
                        id: user.id,
                        email: user.email,
                        username: user.username
                    },
                    secretKey,
                    { expiresIn: '1h' } // Token expires in 1 hour
                );

                // Set the cookie and send response
                return res.status(200).cookie('access_token', token, {
                    httpOnly: true
                }).json({ id: user.id,email: user.email,username: user.username,image: user.image,access_token: token});
            } else {
                return res.status(404).json({ error: 'Invalid credentials' });
            }

        } catch (error) {
            console.error('Error comparing passwords:', error);
            return res.status(500).json({ error: 'Server error' });
        }
    });
});



router.post('/google', async (req, res) => {
  const { name, email, image } = req.body;

  // Default photo if not provided
  const defaultPhotoURL = 'https://www.pngkit.com/png/full/281-2812821_user-account-management-logo-user-icon-png.png'; // Replace with actual URL
  const userPhotoURL = image || defaultPhotoURL;

  try {
    // Step 1: Check if the user already exists in the database
    const sqlCheckUser = 'SELECT * FROM users WHERE email = ?';
    
    con.query(sqlCheckUser, [email], async (err, result) => {
      if (err) {
        console.error('Error while checking for user:', err);
        return res.status(500).json({ error: 'Server error' });
      }

      if (result.length === 0) {
        // Step 2: User does not exist, create a new one
        // Generate a random password
        const generatedPassword = Math.random().toString(36).slice(-8); // Generate an 8-character random password

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        const sqlInsertUser = `
          INSERT INTO users (username, email, image, password)
          VALUES (?, ?, ?, ?)
        `;

        con.query(sqlInsertUser, [name, email, userPhotoURL, hashedPassword], (err, result) => {
          if (err) {
            console.error('Error while inserting new user:', err);
            return res.status(500).json({ error: 'Server error' });
          }

          // Create a user object
          const user = {
            id: result.insertId,
            username: name,
            email: email,
            image: userPhotoURL
          };

          // Generate JWT token
          const token = jwt.sign(
            {
              id: user.id,
              email: user.email,
              username: user.username,
              image:user.image

            },
            secretKey,
            { expiresIn: '1h' }
          );

          // Send response with token and user data
          return res.status(201).cookie('access_token', token, {
                    httpOnly: true
                }).json({
            message: 'User created successfully',
            id: user.id,email: user.email,username: user.username,image: user.image,
            token: token
          });
        });
      } else {
        // Step 3: User already exists, update user information
        const sqlUpdateUser = `
          UPDATE users 
          SET username = ?, image = ? 
          WHERE email = ?
        `;

        con.query(sqlUpdateUser, [name, userPhotoURL, email], (err, result) => {
          if (err) {
            console.error('Error while updating user:', err);
            return res.status(500).json({ error: 'Server error' });
          }

          const user = {
            id: result.affectedRows > 0 ? result.insertId : result[0]?.id, // Fallback to original user ID in case of update
            username: name,
            email: email,
            image: userPhotoURL
          };

          // Generate JWT token
          const token = jwt.sign(
            {
              id: user.id,
              email: user.email,
              username: user.username
            },
            secretKey,
            { expiresIn: '1h' }
          );

          return res.status(200).cookie('access_token', token, {
                    httpOnly: true
                }).json({
            message: 'User updated successfully',
            token: token,
            id: user.id,email: user.email,username: user.username,image: user.image,token: user.token
          });
        });
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
});


module.exports = router;