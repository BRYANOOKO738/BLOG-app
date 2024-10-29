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
        
    // console.log('Logged-in user ID:', req.user.id);
    // console.log('Requested update ID:', id);

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

  // console.log("Logged-in user ID:", req.user.id);
  // console.log("Requested delete ID:", id);

  // Convert id from string to integer for comparison
  const userId = parseInt(id, 10);
  const loggedInUserId = parseInt(req.user.id, 10);

  // Check if the logged-in user is the account owner or an admin
  if (loggedInUserId !== userId && !req.user.isAdmin) {
    return res
      .status(403)
      .json({
        message:
          "Unauthorized: You can only delete your own account or you must be an admin",
      });
  }

  // Proceed to delete the user in the database
  con.query("DELETE FROM users WHERE id = ?", [userId], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ message: "Server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ message: "User deleted successfully" });
  });
});

router.post("/Signout", (req,res) => {
    try {
        res.clearCookie("access_token").status(200).json("User Signout successfully")
    } catch (error) {
        console.error('Error signing out user:', error);
    }
})
router.get("/getAllUsers", verifyToken, async (req, res) => {
  if (!req.user.isAdmin) {
    return res
      .status(401)
      .json({ message: "You do not have permission to view all users." });
  }
 
  try {
    // Pagination parameters
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;

    // Sorting parameters (default to sorting by 'created_at' in descending order)
    const sortField = req.query.sortField || "created_at";
    const sortDirection = req.query.sortDirection === "asc" ? "ASC" : "DESC";

    // Query to get all users with pagination and sorting
    const query = `SELECT * FROM users ORDER BY ${sortField} ${sortDirection} LIMIT ?, ?`;

    con.query(query, [startIndex, limit], (err, users) => {
      if (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({ message: "Error fetching users" });
      }

      // Remove password from each user object
      const usersWithoutPassword = users.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      // Query to get total users count
      const totalUsersQuery = "SELECT COUNT(*) AS totalUsers FROM users";

      // Query to get users created in the last 1 month
      const lastMonthUsersQuery = `
        SELECT COUNT(*) AS lastMonthUsers 
        FROM users 
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
      `;

      // Execute the queries
      con.query(totalUsersQuery, (err, totalResult) => {
        if (err) {
          console.error("Error fetching total users:", err);
          return res
            .status(500)
            .json({ message: "Error fetching total users" });
        }
        const totalUsers = totalResult[0].totalUsers;

        con.query(lastMonthUsersQuery, (err, lastMonthResult) => {
          if (err) {
            console.error("Error fetching users from last month:", err);
            return res
              .status(500)
              .json({ message: "Error fetching users from last month" });
          }
          const lastMonthUsers = lastMonthResult[0].lastMonthUsers;

          // Send back the users without passwords, along with total and last month counts
          res.status(200).json({
            message: "Users fetched successfully",
            users: usersWithoutPassword,
            totalUsers,
            lastMonthUsers,
          });
        });
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
// Get user by userId
router.get("/:userId", (req, res) => {
    const { userId } = req.params; // Get userId from the request parameters

    // Validate userId
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    const sql = 'SELECT * FROM users WHERE id = ?';

    con.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error.' });
        }

        // Check if the user was found
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Get the user object
        const user = results[0];

        // Remove the password field
        delete user.password;

        // Send back the user data excluding the password
        res.json(user);
    });
});



module.exports = router;
