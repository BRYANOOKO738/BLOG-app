const express = require('express');
const router = express.Router();
const verifyToken = require('../Verify.user');
const con = require('../db');

router.post("/Createpost", verifyToken, (req, res) => {
    if (!req.user.isAdmin) {
        res.status(401).json({ message: "You do not have permission to create a post." });
        return;
    }
    if (!req.body.title || !req.body.content) {
        res.status(400).json({ message: "Please provide a title and content for the post." });
        return;
    }

    const author_id = req.user.id;
    const { title, content, category, image } = req.body;
    const imagePath = image || 'https://th.bing.com/th/id/OIP.UmWSXseYC8zUioUB9OhOaQHaDQ?rs=1&pid=ImgDetMain'; // Use default if no image provided

    // Generate the slug from the title
    const generateSlug = (title) => {
        return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    };
    const slug = generateSlug(title);

    // Include the slug in the query
    const query = 'INSERT INTO blog_posts (title, content, author_id, category, image, slug) VALUES (?, ?, ?, ?, ?, ?)';
    con.query(query, [title, content, author_id, category, imagePath, slug], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to create post' });
        }
        res.status(201).json({ message: 'Post created successfully', slug: slug });
    });
});

module.exports = router;

