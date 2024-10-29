const express = require("express");
const router = express.Router();
const verifyToken = require("../Verify.user");
const con = require("../db");

router.post("/Subscribe", async (req, res) => {
  const { email } = req.body;
  console.log(req.body);
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  const sql = "INSERT INTO Subscribers (email) VALUES (?)";
  con.query(sql, [email], (err, result) => {
    if (err) {
      console.error("Error inserting data: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "Email subscription successful" });
  });
});

router.get("/getAll", verifyToken, async (req, res) => {
  if (!req.user.isAdmin) {
    return res
      .status(401)
      .json({ message: "You do not have permission to view all subscribers." });
  }
  const sql = "SELECT * FROM Subscribers";
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error retrieving data: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
});
module.exports = router;