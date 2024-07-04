// implement your posts router here
const express = require("express");
const Posts = require("./posts-model");
const { post } = require("../server");

const router = express.Router();

// GET /api/posts
router.get("/", (req, res) => {
  Posts.find()
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: "The posts information could not be retrieved" });
    });
});

// GET /api/posts/:id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  Posts.findById(id)
    .then((post) => {
      if (post) {
        res.json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: "The post information could not be retrieved" });
    });
});

// POST /api/posts
router.post("/", (req, res) => {
  const { title, contents } = req.body;

  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    Posts.insert({ title, contents })
      .then(({ id }) => {
        // After inserting, fetch the full post object
        return Posts.findById(id);
      })
      .then((post) => {
        res.status(201).json(post);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "There was an error while saving the post to the database",
        });
      });
  }
});

// PUT /api/posts/:id
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, contents } = req.body;

  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    Posts.findById(id)
      .then((post) => {
        if (post) {
          return Posts.update(id, { title, contents });
        } else {
          res
            .status(404)
            .json({ message: "The post with the specified ID does not exist" });
        }
      })
      .then((updated) => {
        if (updated) {
          return Posts.findById(id);
        }
      })
      .then((post) => {
        if (post) {
          res.json(post);
        }
      })
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .json({ message: "The post information could not be modified" });
      });
  }
});

// DELETE /api/posts/:id
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  Posts.findById(id)
    .then((post) => {
      if (post) {
        return Posts.remove(id).then(() => {
          res.json(post); // Return the deleted post object
        });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "The post could not be removed" });
    });
});

// GET /api/posts/:id/comments
router.get("/:id/comments", (req, res) => {
  const { id } = req.params;

  Posts.findById(id)
    .then((post) => {
      if (post) {
        return Posts.findPostComments(id).then((comments) => {
          res.json(comments);
        });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: "The comments information could not be retrieved" });
    });
});

module.exports = router;
