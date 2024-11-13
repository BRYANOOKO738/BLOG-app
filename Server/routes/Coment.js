const express = require("express");
const router = express.Router();
const verifyToken = require("../Verify.user");
const con = require("../db");

router.get("/Create",  (req, res) => {      
  
    const { content, postId,userId } = req.body;
    if (userId !== req.user.id) { 
        return res
         .status(403)
         .json({ message: "You do not have permission to create a comment on this post." });
    }
  const sql = `
    SELECT 
      comments.id,
      comments.user_id,
      comments.post_id,
      comments.comment_text,
      comments.created_at,
      comments.updated_at,
      COUNT(likes.id) AS total_likes
    FROM 
      comments
    LEFT JOIN 
      likes ON comments.id = likes.comment_id
    WHERE 
      comments.post_id = ?
    GROUP BY 
      comments.id
    ORDER BY 
      comments.created_at DESC`;

  con.query(sql, [postId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});



router.post("/CreateComments", verifyToken, (req, res) => {
  const { content, PostId, userId } = req.body;
  // Validate input
 

  if (userId !== req.user.id) {
    return res.status(403).json({
      message: "You do not have permission to create a comment on this post.",
    });
  }

  const sql =
    "INSERT INTO comments (user_id, post_id, comment_text) VALUES (?, ?, ?)";

  console.log("SQL Query:", sql, [userId, PostId, content]); // Log the SQL query

  con.query(sql, [userId, PostId, content], (err, result) => {
    if (err) {
      console.error("Database error:", err); // Log any SQL errors
      return res.status(500).json({ error: err.message });
    }

    res.json({
      message: "Comment added successfully!",
      commentId: result.insertId, // Correctly return the new comment ID
    });
  });
});

router.get("/getAllPost/:PostId", (req, res) => {
  try {
    
    const { PostId } = req.params;
    

    const sql =
      "SELECT * FROM comments WHERE post_id = ? ORDER BY updated_at DESC";

    con.query(sql, [PostId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results)
      
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return res.status(500).json({ error: "Failed to fetch post" });
  }
});
router.get("/getAllComents", verifyToken, (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res
        .status(401)
        .json({ message: "You do not have permission to view all comments." });
    }

    // SQL queries
    const totalCommentsSql = "SELECT COUNT(*) AS totalComments FROM comments";
    const lastMonthCommentsSql = `SELECT COUNT(*) AS totalLastMonthComments FROM comments WHERE updated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)`;
    const allCommentsSql = "SELECT * FROM comments";

    // Query to get total comments
    con.query(totalCommentsSql, (err, totalCommentsResult) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Query to get total comments from last month
      con.query(lastMonthCommentsSql, (err, lastMonthCommentsResult) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Query to get all comment details
        con.query(allCommentsSql, (err, allCommentsResult) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          // Return results
          res.status(200).json({
            totalComments: totalCommentsResult[0].totalComments,
            totalLastMonthComments:
              lastMonthCommentsResult[0].totalLastMonthComments,
            comments: allCommentsResult,
          });
        });
      });
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ error: "Failed to fetch comments" });
  }
});

//like coment
router.post("/:comment_id/like", (req, res) => {
 
  const { commentId, user_id } = req.params;   
 
    

  // Check if the user has already liked the comment
  const checkSql =
    "SELECT * FROM comment_likes WHERE user_id = ? AND comment_id = ?";
  con.query(checkSql, [user_id, commentId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.length > 0) {
      return res
        .status(400)
        .json({ message: "You have already liked this comment." });
    }

    // Insert like into the database
    const sql = "INSERT INTO comment_likes (user_id, comment_id) VALUES (?, ?)";
    con.query(sql, [user_id, commentId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Comment liked successfully!" });
    });
  });
});

// Get like count for a comment
router.get("/likeCount/:commentId", (req, res) => {
  const { commentId } = req.params;

  const sql = "SELECT COUNT(*) AS likeCount FROM comment_likes WHERE comment_id = ?";
  con.query(sql, [commentId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const likeCount = result[0].likeCount;
    res.json({ likeCount });
  });
});
router.post("/unlikeComment/:userId/:commentId", (req, res) => {
  const { userId, commentId } = req.params;
  

  const sql = "DELETE FROM comment_likes WHERE user_id = ? AND comment_id = ?";
  con.query(sql, [userId, commentId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Comment unliked!" });
  });
});
// Check if a user has liked a comment
router.get("/hasLiked/:userId/:commentId", (req, res) => {
  const { userId, commentId } = req.params;
  // console.log(req.params)

  const sql = "SELECT * FROM comment_likes WHERE user_id = ? AND comment_id = ?";
  con.query(sql, [userId, commentId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.length > 0) {
      res.json({ liked: true });
    } else {
      res.json({ liked: false });
    }
  });
});



// 4. Unlike a comment
// router.delete("/comments/:comment_id/unlike", (req, res) => {
//   const { user_id } = req.body;
//   const commentId = req.params.comment_id;

//   const sql = "DELETE FROM likes WHERE user_id = ? AND comment_id = ?";
//   con.query(sql, [user_id, commentId], (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     if (result.affectedRows === 0) {
//       return res
//         .status(404)
//         .json({ message: "Like not found or already removed." });
//     }
//     res.json({ message: "Like removed successfully!" });
//   });
// });

// 5. Update a comment
// router.put("/comments/:id", (req, res) => {
//   const commentId = req.params.id;
//   const { comment_text } = req.body;
//   const sql =
//     "UPDATE comments SET comment_text = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";

//   con.query(sql, [comment_text, commentId], (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.json({ message: "Comment updated successfully!" });
//   });
// });

// 6. Delete a comment
router.delete("/comments/:id",verifyToken, (req, res) => {
  
  const { id } = req.params;

  

  // Convert id from string to integer for comparison
  const userId = parseInt(id, 10);
  const loggedInUserId = parseInt(req.user.id, 10);

  // Check if the logged-in user is the account owner or an admin
  if (loggedInUserId !== userId && !req.user.isAdmin) {
    return res.status(403).json({
      message:
        "Unauthorized: You can only delete your own account or you must be an admin",
    });
  }

  const sql = "DELETE FROM comments WHERE id = ?";

  con.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Comment deleted successfully!" });
  });
});
 module.exports = router;