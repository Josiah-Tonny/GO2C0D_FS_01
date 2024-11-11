const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Define the path to posts.json
const postsFilePath = path.join(__dirname, '../data/posts.json');

// Endpoint to create a post
router.post('/', (req, res) => {
  const { title, content, tags } = req.body;
  const newPost = {
    id: Date.now().toString(),
    title,
    content,
    tags,
    date: new Date().toLocaleString(),
  };

  // Read existing posts
  fs.readFile(postsFilePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read posts file' });
    const posts = data ? JSON.parse(data) : [];
    posts.push(newPost);

    // Write updated posts
    fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Failed to write posts file' });
      res.status(201).json(newPost);
    });
  });
});

module.exports = router;
