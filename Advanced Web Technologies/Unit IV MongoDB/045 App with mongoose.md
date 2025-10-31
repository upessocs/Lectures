# Simple Node.js Express + MongoDB Authentication App

> This experiment involves building a simple Node.js Express application with MongoDB to demonstrate user authentication by implementing user registration and login functionality. 
> The application will connect to either a local MongoDB instance or MongoDB Atlas cloud service, store user credentials securely with password hashing, and provide endpoints for registering new users and authenticating existing ones. 
> It serves as a practical demonstration of database integration, data modeling, and basic security practices in web application development.


## Project Structure
```
simple-mongo-auth/
├── config/
│   └── db.js
├── models/
│   └── User.js
├── server.js
├── package.json
└── .env
```
---
## Package.json
```json
{
  "name": "simple-mongo-auth",
  "version": "1.0.0",
  "description": "Simple MongoDB authentication demo",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## Environment Configuration (.env)
```env
PORT=3000

# Choose ONE - Comment out the other:
# MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://username:password@cluster0.abc123.mongodb.net/auth_demo

# Local MongoDB
# MONGODB_URI=mongodb://localhost:27017/auth_demo
```
---
## Database Configuration (config/db.js)
```javascript
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.name}`);
        
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
```

## User Model (models/User.js)
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

## Main Server (server.js)
```javascript
const express = require('express');
const connectDB = require('./config/db');
const User = require('./models/User');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes

// 1. User Registration
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email or username'
            });
        }

        // Create new user
        const user = new User({
            username,
            email,
            password
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
});

// 2. User Login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
});

// 3. Get all users (for testing)
app.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
});

// 4. Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
```
---
## Installation & Setup

### 1. Initialize Project
```bash
mkdir simple-mongo-auth
cd simple-mongo-auth
npm init -y
```

### 2. Install Dependencies
```bash
npm install express mongoose dotenv bcryptjs
npm install -D nodemon
```

### 3. Setup Environment
```bash
# Create .env file and add your MongoDB URI
echo "PORT=3000" > .env
echo "MONGODB_URI=your_mongodb_connection_string" >> .env
```

### 4. Create the folder structure
```bash
mkdir config models
```

### 5. Start the Application
```bash
# Development
npm run dev

# Production
npm start
```
---
## Testing the Application

### Test 1: Health Check
```bash
curl http://localhost:3000/health
```

### Test 2: User Registration
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Test 3: User Login
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Test 4: Get All Users
```bash
curl http://localhost:3000/users
```
---
## MongoDB Connection Options

### Option A: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Get connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.abc123.mongodb.net/auth_demo
```

### Option B: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service:
```bash
# Ubuntu
sudo systemctl start mongod

# Windows
net start MongoDB
```
3. Use connection string:
```env
MONGODB_URI=mongodb://localhost:27017/auth_demo
```
---
## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Check server and database status |
| POST | `/register` | Register a new user |
| POST | `/login` | Authenticate existing user |
| GET | `/users` | Get all users (for testing) |

## Sample Test Data

```json
// Registration
{
  "username": "test_user",
  "email": "test@example.com", 
  "password": "test123"
}

// Login
{
  "email": "test@example.com",
  "password": "test123"
}
```

This simplified application demonstrates:
- MongoDB connection (Atlas or local)
- User registration with password hashing
- User authentication
- Basic error handling
- Clean project structure

> The app is ready to run with minimal setup and clearly shows MongoDB integration for user management.