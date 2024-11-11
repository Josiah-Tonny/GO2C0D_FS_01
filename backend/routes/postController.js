const fs = require('fs');
const path = require('path');

// Path to your posts.json file
const postsFilePath = path.join(__dirname, '../data/posts.json');

// Helper function to read and write posts to the posts.json file
const savePostToFile = (post) => {
  try {
    let posts = [];
    // Check if posts.json exists, if not initialize an empty array
    if (fs.existsSync(postsFilePath)) {
      posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf-8'));
    }
    posts.push(post);
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
  } catch (error) {
    console.error('Error saving post:', error);
  }
};

// Create Post Logic
const createPost = (upload) => (req, res) => {
  // Handling image upload
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const { title, content, tags, author } = req.body;
    const imageUrl = req.file ? `/assets/uploads/${req.file.filename}` : null;  // Set the image URL

    const newPost = {
      id: Date.now().toString(),  // Unique ID for the post
      title,
      content,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],  // Optional tags
      author: author || 'Anonymous', // Default to 'Anonymous' if no author is provided
      imageUrl,
      date: new Date().toLocaleString(), // Store the date when the post is created
    };

    // Save the post data to the file
    savePostToFile(newPost);
    res.status(201).json({ message: 'Post created successfully!', post: newPost });
  });
};

// Get Posts Logic
const getPosts = (req, res) => {
  try {
    const posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf-8'));
    res.json(posts);
  } catch (error) {
    console.error('Error reading posts:', error);
    res.status(500).json({ message: 'Error loading posts' });
  }
};

module.exports = { createPost, getPosts };
