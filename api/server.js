// implement your server here
// require your posts router and connect it here

const express = require("express");
const postsRouter = require("./posts/posts-router");
const rateLimit = require("express-rate-limit"); // Add this line

const server = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

server.use(limiter);

server.use(express.json());

server.use("/api/posts", postsRouter);

server.use("*", (req, res) => {
  res.status(404).json({ message: "Not found" });
});

module.exports = server;
