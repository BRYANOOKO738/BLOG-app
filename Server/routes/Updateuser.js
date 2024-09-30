// Route to update a user
const express = require('express');
const con = require('../db');
const bcrypt = require('bcryptjs');
const router = express.Router();
const verifyToken =require("../Verify.user")
router.put("/update/:id",verifyToken, async (req, res, next) => {
    try {
        // Log the user
        console.log(req.user);

        // Verify if the logged-in user ID matches the requested user ID for update
        if (req.user.id !== req.params.id) {
            return res.status(403).json({ message: "User not verified" });
        }

        // If password is being updated
        if (req.body.password) {
            if (req.body.password.length < 6) {
                return res.send("Password must be more than six characters");
            }
            // Hash the new password
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        // Validate and update the username
        if (req.body.username) {
            if (req.body.username.length < 7 || req.body.username.length > 20) {
                return res.send("Username must be between 7 and 20 characters");
            }

            if (req.body.username.includes(' ')) {
                return res.send("Username cannot contain spaces");
            }

            if (req.body.username !== req.body.username.toLowerCase()) {
                return res.send("Username should be in lowercase");
            }

            if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
                return res.send("Username can only contain alphanumeric characters");
            }
        }

        // Proceed with updating the user in the database
        con.query(
            "UPDATE users SET ? WHERE id = ?", 
            [{
                username: req.body.username, 
                password: req.body.password,
                email: req.body.email,
                image: req.body.image
            }, req.params.id], 
            (err, result) => {
                if (err) {
                    console.error('Error updating user:', err);
                    return res.status(500).send("Server error");
                }

                console.log("1 record updated");
                return res.json({ message: "User updated successfully", user: req.user });
            }
        );
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).send("Server error");
    }
});

module.exports = router;