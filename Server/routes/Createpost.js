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

  if (req.query.postId) {
    query += " AND id = ?";
    queryParams.push(req.query.postId);
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
});


module.exports = router;
