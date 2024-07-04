// implement your posts router here
const express = require("express");
const Posts = require("./posts-model");

const router = express.Router();

// GET /api/posts
router.get("/", (req, res) => {
  res.json({ message: "GET /api/posts endpoint" });
});

// Other routes will be added here

module.exports = router;
