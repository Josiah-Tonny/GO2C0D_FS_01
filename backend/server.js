const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'assets', 'uploads');
const dataDir = path.join(__dirname, 'data');

// Ensure directories exist
[uploadsDir, dataDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Initialize posts.json if it doesn't exist
const postsFile = path.join(dataDir, 'posts.json');
if (!fs.existsSync(postsFile)) {
  fs.writeFileSync(postsFile, '[]', 'utf8');
}

// Serve static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// GET posts
app.get('/api/posts', (req, res) => {
  try {
    const posts = JSON.parse(fs.readFileSync(postsFile, 'utf8'));
    res.json(posts);
  } catch (error) {
    console.error('Error reading posts:', error);
    res.status(500).json({ message: 'Error reading posts' });
  }
});

// POST new post
app.post('/api/posts', upload.single('image'), (req, res) => {
  try {
    const { title, content, tags, author } = req.body;
    const imageUrl = req.file ? `/assets/uploads/${req.file.filename}` : null;

    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      author: author || 'Anonymous',
      imageUrl,
      date: new Date().toISOString()
    };

    // Read existing posts
    const posts = JSON.parse(fs.readFileSync(postsFile, 'utf8'));
    
    // Add new post
    posts.push(newPost);
    
    // Save updated posts
    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});