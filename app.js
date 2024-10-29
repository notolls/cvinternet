// app.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const crypto = require('crypto');

const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};
const secretKey = generateSecretKey();
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define user schema and model
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
// Registration endpoint

app.get('/register', (req, res) => {
  // Serve the registration.html file
  res.sendFile(path.join(__dirname, 'public/register.html'));
});

app.get('/dashboard', (req, res) => {
  // Serve the registration.html file
  res.sendFile(path.join(__dirname, 'public/dashboard.html'));
});

app.get('/login', (req, res) => {
  // Serve the registration.html file
  res.sendFile(path.join(__dirname, 'public/login.html'));
});
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (username.length < 8) {
          return res.status(400).json({ message: 'Username must be at least 8 characters long' });
      }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });

  // Send the token as a response
  res.json({ token });
});
// Login endpoint
// app.post('/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const user = await User.findOne({ username });
//         if (!user) {
//             return res.status(401).json({ error: 'Invalid username ' });
//         }
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ error: 'Invalid username or password' });
//         }
//         const token = jwt.sign({ username }, secretKey , { expiresIn: '1h' });
//         res.json({ token });
//         // res.redirect(`/index.html?token=${token}`);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// Protected endpoint (example)
app.get('/profile', verifyToken, (req, res) => {
    res.json({ username: req.user.username });
});

// Verify JWT middleware
function verifyToken(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(403).json({ error: 'No token provided' });
    jwt.verify(token, secretKey , (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });
        req.user = decoded;
        next();
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  // Get token from request headers
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
      return res.status(401).json({ message: 'Token is missing' });
  }

  // Verify token
  jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
          return res.status(401).json({ message: 'Invalid token' });
      }
      // If token is valid, proceed with the next middleware
      req.userId = decoded.userId; // Attach decoded user ID to request object
      next();
  });
}

// upload file

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      // Specify the directory where uploaded files will be stored
      cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
      // Generate a unique filename for the uploaded file
      cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Route to handle file upload
app.post('/upload', verifyToken, upload.single('file'), (req, res) => {
  res.status(200).json({ message: 'File uploaded successfully' });
});

// Route to handle file deletion
app.delete('/delete/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
      // Delete the file
      fs.unlinkSync(filePath);
      res.status(200).json({ message: 'File deleted successfully' });
  } else {
      res.status(404).json({ message: 'File not found' });
  }
});

// Serve uploaded files statically
app.use('/uploads',verifyToken, express.static('uploads'));

// Start the server