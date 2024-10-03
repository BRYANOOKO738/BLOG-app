// Route to update a user
const express = require('express');
const con = require('../db');
const bcrypt = require('bcryptjs');
const router = express.Router();
const user = require("./Auth")
const verifyToken = require('../Verify.user');

router.put('/update/:id',verifyToken,  async (req, res) => {
    try {
        const { id } = req.params;
    const { username, email, password, image } = req.body;
        
    console.log('Logged-in user ID:', req.user.id);
    console.log('Requested update ID:', id);

    // Convert id from string to integer for comparison, if necessary
    const userId = parseInt(id, 10);

    // Verify if the logged-in user ID matches the requested user ID for update
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'User not verified' });
    }

       
        let updateFields = {};
        if (username) updateFields.username = username;
        if (email) updateFields.email = email;
        if (image) updateFields.image = image;

        // Validate and hash the new password if provided
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ message: 'Password must be more than six characters' });
            }
            updateFields.password = await bcrypt.hash(password, 10);
        }

        // Validate the username if provided
        if (username) {
            if (username.length < 7 || username.length > 20) {
                return res.status(400).json({ message: 'Username must be between 7 and 20 characters' });
            }
            if (username.includes(' ') || !username.match(/^[a-z0-9]+$/) ) {
                return res.status(400).json({ message: 'Username can only contain lowercase alphanumeric characters' });
            }
        }

        // Proceed with updating the user in the database
        con.query(
            'UPDATE users SET ? WHERE id = ?', 
            [updateFields, id],
            (err, result) => {
                if (err) {
                    console.error('Error updating user:', err);
                    return res.status(500).json({ message: 'Server error' });
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'User not found' });
                }
                console.log('1 record updated');
                return res.json({ message: 'User updated successfully', user: { id, ...updateFields } });
            }
        );
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});


router.delete("/delete/:id", verifyToken, (req, res) => {
    const { id } = req.params;    

    console.log('Logged-in user ID:', req.user.id);
    console.log('Requested delete ID:', id);

    // Convert id from string to integer for comparison
    const userId = parseInt(id, 10);

    // Verify if the logged-in user ID matches the requested user ID for deletion
    if (req.user.id !== userId) {
        return res.status(403).json({ message: 'User not verified' });
    } 

    // Proceed to delete the user in the database
    con.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ message: 'Server error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json({ message: 'User deleted successfully' });
    });
});

router.post("/Signout", () => {
    try {
        res.clearCookie("access_token").status(200).json("User Signout successfully")
    } catch (error) {
        console.error('Error signing out user:', error);
    }
})

module.exports = router;
