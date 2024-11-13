const express = require("express");
const router = express.Router();
const verifyToken = require("../Verify.user");
const con = require("../db");

router.post("/Createpost", verifyToken, (req, res) => {
  if (!req.user.isAdmin) {
    res
      .status(401)
      .json({ message: "You do not have permission to create a post." });
    return;
  }
  if (!req.body.title || !req.body.content) {
    res
      .status(400)
      .json({ message: "Please provide a title and content for the post." });
    return;
  }

  const author_id = req.user.id;
  const { title, content, category, image } = req.body;
  const imagePath =
    image ||
    "https://th.bing.com/th/id/OIP.UmWSXseYC8zUioUB9OhOaQHaDQ?rs=1&pid=ImgDetMain"; // Use default if no image provided

  // Generate the slug from the title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };
  const slug = generateSlug(title);

  // Include the slug in the query
  const query =
    "INSERT INTO blog_posts (title, content, author_id, category, image, slug) VALUES (?, ?, ?, ?, ?, ?)";
  con.query(
    query,
    [title, content, author_id, category, imagePath, slug],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Failed to create post" });
      }
      res
        .status(201)
        .json({ message: "Post created successfully", slug: slug });
    }
  );
});
router.get("/getpost", (req, res) => {
  if (req.query.postId) {
    const query = "SELECT * FROM blog_posts WHERE id = ?";
    const queryParams = [req.query.postId];

    con.query(query, queryParams, (error, posts) => {
      if (error) {
        console.error("Error getting post:", error);
        return res.status(500).json({ error: "Failed to get post" });
      }

      if (posts.length === 0) {
        return res.status(404).json({ error: "Post not found" });
      }

      res.status(200).json({ posts });
    });
  } else {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? "ASC" : "DESC";

    let query = "SELECT * FROM blog_posts WHERE 1=1";
    const queryParams = [];

    if (req.query.author_id) {
      query += " AND author_id = ?";
      queryParams.push(req.query.author_id);
    }

    if (req.query.category) {
      query += " AND category = ?";
      queryParams.push(req.query.category);
    }

    if (req.query.slug) {
      query += " AND slug = ?";
      queryParams.push(req.query.slug);
    }

    if (req.query.searchTerm) {
      query += " AND (title LIKE ? OR content LIKE ?)";
      const searchTerm = `%${req.query.searchTerm}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    query += ` ORDER BY updated_at ${sortDirection} LIMIT ? OFFSET ?`;
    queryParams.push(limit, startIndex);

    con.query(query, queryParams, (error, posts) => {
      if (error) {
        console.error("Error getting posts:", error);
        return res.status(500).json({ error: "Failed to get posts" });
      }

      con.query(
        "SELECT COUNT(*) as count FROM blog_posts",
        (error, totalPostsResult) => {
          if (error) {
            console.error("Error getting total posts count:", error);
            return res
              .status(500)
              .json({ error: "Failed to get total posts count" });
          }

          const totalPosts = totalPostsResult[0].count;

          const now = new Date();
          const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
          );

          con.query(
            "SELECT COUNT(*) as count FROM blog_posts WHERE created_at >= ?",
            [oneMonthAgo],
            (error, lastMonthPostsResult) => {
              if (error) {
                console.error("Error getting last month posts count:", error);
                return res
                  .status(500)
                  .json({ error: "Failed to get last month posts count" });
              }

              const lastMonthPosts = lastMonthPostsResult[0].count;

              res.status(200).json({
                posts,
                totalPosts,
                lastMonthPosts,
              });
            }
          );
        }
      );
    });
  }
});
router.delete("/deletepost/:postid/:id", verifyToken, (req, res) => {
  const { postid, id } = req.params; 

  // Convert id from string to integer for comparison
  const userId = parseInt(id, 10);
  const postId = parseInt(postid, 10);

  if (!req.user.isAdmin && req.user.id !== userId) {
    return res
      .status(403)
      .json({ message: "You do not have permission to delete this post." });
  }

  // Proceed to delete the post in the database
  con.query(
    "DELETE FROM blog_posts WHERE id = ? AND author_id = ?",
    [postId, userId],
    (err, result) => {
      if (err) {
        console.error("Error deleting post:", err);
        return res.status(500).json({ message: "Server error" });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({
            message: "Post not found or you don't have permission to delete it",
          });
      }
      return res.json({ message: "Post deleted successfully" });
    }
  );
});

router.put("/updatepost/:postid/:id", verifyToken, (req, res) => {
  const { postid, id } = req.params;
  

  // Convert id from string to integer for comparison
  const userId = parseInt(id, 10);
  const postId = parseInt(postid, 10);
 

  if (!req.user.isAdmin && req.user.id !== userId) {
    return res
      .status(403)
      .json({ message: "You do not have permission to update this post." });
  }

  try {
    const { title, content, category, image } = req.body;

    // Update query
    const updateQuery = `UPDATE blog_posts SET title = ?, content = ?, category = ?, image = ? WHERE id = ? AND author_id = ?`;

    con.query(
      updateQuery,
      [title, content, category, image, postId, userId],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error updating post", error: err });
        }

        if (result.affectedRows === 0) {
          return res
            .status(404)
            .json({
              message:
                "Post not found or you do not have permission to update it.",
            });
        }

        // After updating, retrieve the updated post
        const selectQuery = `SELECT * FROM blog_posts WHERE id = ? AND author_id = ?`;
        con.query(selectQuery, [postId, userId], (err, updatedPost) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Error retrieving updated post", error: err });
          }

          return res
            .status(200)
            .json({
              message: "Post updated successfully",
              updatedPost: updatedPost[0],
            });
        });
      }
    );
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error });
  }
});

module.exports = router;
