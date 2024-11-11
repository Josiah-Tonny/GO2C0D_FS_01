const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../assets/uploads');
    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper function to read posts
const readPosts = () => {
  const postsPath = path.join(__dirname, '../data/posts.json');
  try {
    const data = fs.readFileSync(postsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading posts:', error);
    return [];
  }
};

// Helper function to write posts
const writePosts = (posts) => {
  const postsPath = path.join(__dirname, '../data/posts.json');
  try {
    fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing posts:', error);
    return false;
  }
};

// GET all posts
router.get('/', (req, res) => {
  try {
    const posts = readPosts();
    res.json(posts);
  } catch (error) {
    console.error('Error getting posts:', error);
    res.status(500).json({ message: 'Error retrieving posts' });
  }
});

// POST new post
router.post('/', upload.single('image'), (req, res) => {
  try {
    const { title, content, tags, author } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      author: author || 'Anonymous',
      imageUrl: req.file ? `/assets/uploads/${req.file.filename}` : null,
      date: new Date().toISOString()
    };

    const posts = readPosts();
    posts.push(newPost);
    
    if (writePosts(posts)) {
      res.status(201).json({ message: 'Post created successfully', post: newPost });
    } else {
      res.status(500).json({ message: 'Error saving post' });
    }
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
});

module.exports = router;