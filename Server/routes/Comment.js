const express = require("express");
const router = express.Router();
const verifyToken = require("../Verify.user");
const con = require("../db");


router.post("/CreateComments", verifyToken, (req, res) => {
  const { content, postId, userId } = req.body;

  console.log(req.body); // Log the request body for debugging

  // Validate input
  if (!content || !postId || !userId) {
    return res
      .status(400)
      .json({ message: "Content, postId, and userId are required." });
  }

  if (userId !== req.user.id) {
    return res.status(403).json({
      message: "You do not have permission to create a comment on this post.",
    });
  }

  const sql =
    "INSERT INTO comments ( user_id, post_id, comment_text) VALUES (?, ?, ?)";

  con.query(sql, [userId, postId, content], (err, result) => {
    if (err) {
      console.error("Database error:", err); // Log the error
      return res.status(500).json({ error: err.message });
    }

    res.json({
      message: "Comment added successfully!",
      commentId: result.insertId, // Correctly return the new comment ID
    });
  });
});

module.exports = router;