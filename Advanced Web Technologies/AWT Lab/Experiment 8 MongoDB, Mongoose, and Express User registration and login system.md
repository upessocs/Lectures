# Express + Mongoose User Management Tutorial

A beginner-friendly guide to learn MongoDB, Mongoose, and Express basics through a simple user registration and login system.


## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Understanding the Components](#understanding-the-components)
4. [Complete Code](#complete-code)
5. [Testing the Application](#testing-the-application)
6. [Key Mongoose Concepts](#key-mongoose-concepts)

---

## Prerequisites

- Node.js installed on your system
- MongoDB installed locally OR a MongoDB Atlas account
- Basic understanding of JavaScript

---

## Project Setup

### Step 1: Create Project Directory

```bash
mkdir mongoose-demo
cd mongoose-demo
```

### Step 2: Initialize Node.js Project

```bash
npm init -y
```

### Step 3: Install Dependencies

```bash
npm install express mongoose
```

### Step 4: Create server.js File

Create a file named `server.js` in your project directory and add the code from the next section.

---

## Understanding the Components

### What is Mongoose?

Mongoose is a library that helps you work with MongoDB in Node.js. It provides:
- **Schemas**: Define the structure of your data
- **Models**: Interface to interact with database
- **Validation**: Ensures data meets requirements
- **Queries**: Easy methods to find, save, update, delete data

### What is a Schema?

A schema is like a blueprint or template that defines what fields your documents should have.

```javascript
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
```

### What is a Model?

A model is a class that you use to create, read, update, and delete documents in MongoDB.

```javascript
const User = mongoose.model('User', userSchema);
```

---

## Complete Code

Create `server.js` with the following content:

```javascript
// server.js
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// STEP 1: CONNECT TO MONGODB
// ============================================

// Choose one of these connection strings:

// Option A: Local MongoDB (must have MongoDB installed)
const DB_URL = 'mongodb://localhost:27017/userdb';

// Option B: MongoDB Atlas (replace with your connection string)
// const DB_URL = 'mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/userdb?retryWrites=true&w=majority';

mongoose.connect(DB_URL)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// ============================================
// STEP 2: DEFINE THE USER SCHEMA
// ============================================

// Schema defines the structure of documents in the collection
const userSchema = new mongoose.Schema({
  username: {
    type: String,        // Field must be text
    required: true,      // Field is mandatory
    unique: true         // No two users can have same username
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now    // Automatically set to current date/time
  }
});

// ============================================
// STEP 3: CREATE THE MODEL
// ============================================

// Model is the interface to interact with the database
const User = mongoose.model('User', userSchema);

// ============================================
// STEP 4: CREATE ROUTES
// ============================================

// HOME ROUTE
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>User Management System</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .container { background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px; }
        h2 { color: #333; }
        input { width: 100%; padding: 10px; margin: 5px 0; box-sizing: border-box; }
        button { background: #007bff; color: white; padding: 10px 20px; border: none; cursor: pointer; margin: 5px; }
        button:hover { background: #0056b3; }
        .success { color: green; }
        .error { color: red; }
      </style>
    </head>
    <body>
      <h1>User Management System</h1>
      
      <div class="container">
        <h2>Register New User</h2>
        <form action="/signup" method="POST">
          <input type="text" name="username" placeholder="Username" required>
          <input type="email" name="email" placeholder="Email" required>
          <input type="password" name="password" placeholder="Password" required>
          <button type="submit">Sign Up</button>
        </form>
      </div>

      <div class="container">
        <h2>Login</h2>
        <form action="/login" method="POST">
          <input type="text" name="username" placeholder="Username" required>
          <input type="password" name="password" placeholder="Password" required>
          <button type="submit">Login</button>
        </form>
      </div>

      <div class="container">
        <h2>View All Users</h2>
        <form action="/users" method="GET">
          <button type="submit">Show All Registered Users</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

// SIGNUP ROUTE - Register a new user
app.post('/signup', async (req, res) => {
  try {
    // Get data from the form submission
    const { username, email, password } = req.body;

    // Create a new user document
    const newUser = new User({
      username: username,
      email: email,
      password: password
    });

    // Save the document to MongoDB
    await newUser.save();

    res.send(`
      <h2 class="success">User registered successfully!</h2>
      <p>Username: ${username}</p>
      <p>Email: ${email}</p>
      <a href="/">Go back to home</a>
    `);

  } catch (error) {
    // Handle errors (like duplicate username or email)
    if (error.code === 11000) {
      res.send(`
        <h2 class="error">Error: Username or email already exists</h2>
        <a href="/">Go back and try again</a>
      `);
    } else {
      res.send(`
        <h2 class="error">Error: ${error.message}</h2>
        <a href="/">Go back and try again</a>
      `);
    }
  }
});

// LOGIN ROUTE - Check user credentials
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user in database
    const user = await User.findOne({ username: username });

    // Check if user exists
    if (!user) {
      return res.send(`
        <h2 class="error">User not found</h2>
        <a href="/">Go back and try again</a>
      `);
    }

    // Check if password matches
    if (user.password !== password) {
      return res.send(`
        <h2 class="error">Incorrect password</h2>
        <a href="/">Go back and try again</a>
      `);
    }

    // Login successful
    res.send(`
      <h2 class="success">Login successful!</h2>
      <p>Welcome back, ${user.username}!</p>
      <p>Email: ${user.email}</p>
      <p>Account created: ${user.createdAt.toDateString()}</p>
      <a href="/">Go back to home</a>
    `);

  } catch (error) {
    res.send(`
      <h2 class="error">Error: ${error.message}</h2>
      <a href="/">Go back and try again</a>
    `);
  }
});

// GET ALL USERS ROUTE - Display all registered users
app.get('/users', async (req, res) => {
  try {
    // Find all users in the database
    const allUsers = await User.find();

    // Check if there are any users
    if (allUsers.length === 0) {
      return res.send(`
        <h2>No users registered yet</h2>
        <a href="/">Go back to home</a>
      `);
    }

    // Create HTML to display users
    let userList = '<h2>Registered Users</h2><ul>';
    
    allUsers.forEach(user => {
      userList += `
        <li>
          <strong>Username:</strong> ${user.username} | 
          <strong>Email:</strong> ${user.email} | 
          <strong>Joined:</strong> ${user.createdAt.toDateString()}
        </li>
      `;
    });
    
    userList += '</ul><a href="/">Go back to home</a>';
    res.send(userList);

  } catch (error) {
    res.send(`
      <h2 class="error">Error: ${error.message}</h2>
      <a href="/">Go back and try again</a>
    `);
  }
});

// ============================================
// START THE SERVER
// ============================================

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

---

## Testing the Application

### Step 1: Start MongoDB

**For Local MongoDB:**
```bash
mongod
```

**For MongoDB Atlas:**
- Create a cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Get your connection string
- Replace the DB_URL in the code

### Step 2: Run the Server

```bash
node server.js
```

You should see:
```
Server running on http://localhost:3000
Connected to MongoDB successfully
```

### Step 3: Open Browser

Navigate to: `http://localhost:3000`

### Step 4: Test the Features

1. **Register a User**: Fill the signup form with username, email, and password
2. **Login**: Use the credentials you just created
3. **View All Users**: Click the button to see all registered users

---

## Key Mongoose Concepts

### 1. Connecting to MongoDB

```javascript
mongoose.connect(DB_URL)
  .then(() => console.log('Connected'))
  .catch(err => console.error('Error:', err));
```

This establishes a connection between your application and MongoDB database.

### 2. Schema Definition

```javascript
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }
});
```

Defines what fields your documents will have and their properties.

### 3. Creating a Model

```javascript
const User = mongoose.model('User', userSchema);
```

Creates a model named User. MongoDB will create a collection called 'users' (lowercase, plural).

### 4. Creating and Saving Documents

```javascript
const newUser = new User({ username: 'john', email: 'john@email.com' });
await newUser.save();
```

Creates a new document and saves it to the database.

### 5. Finding Documents

```javascript
// Find one document
const user = await User.findOne({ username: 'john' });

// Find all documents
const allUsers = await User.find();

// Find with conditions
const admins = await User.find({ role: 'admin' });
```

### 6. Error Handling

```javascript
try {
  await newUser.save();
} catch (error) {
  if (error.code === 11000) {
    console.log('Duplicate key error');
  }
}
```

Error code 11000 means a unique field already exists in the database.

---

## Common Mongoose Methods

| Method | Purpose | Example |
|--------|---------|---------|
| `.save()` | Save a new document | `await user.save()` |
| `.find()` | Find all documents | `await User.find()` |
| `.findOne()` | Find one document | `await User.findOne({ username: 'john' })` |
| `.findById()` | Find by ID | `await User.findById(id)` |
| `.updateOne()` | Update one document | `await User.updateOne({ username: 'john' }, { email: 'new@email.com' })` |
| `.deleteOne()` | Delete one document | `await User.deleteOne({ username: 'john' })` |

---

## Project Structure

```
mongoose-demo/
├── node_modules/
├── server.js
├── package.json
└── package-lock.json
```

---

## Important Notes

1. **No Encryption**: This is a learning example. Passwords are stored as plain text. In production, always use encryption libraries like bcrypt.

2. **Error Handling**: The code includes basic error handling for learning purposes.

3. **Database Name**: The database name is 'userdb'. MongoDB creates it automatically when you first save data.

4. **Collection Name**: With model name 'User', Mongoose creates a collection named 'users' (lowercase, plural).

5. **Async/Await**: All database operations are asynchronous. We use async/await to handle them.

---

## Troubleshooting

### Connection Error
- **Local MongoDB**: Make sure MongoDB is running (`mongod` command)
- **Atlas**: Check your connection string, username, and password

### Port Already in Use
Change the PORT variable in the code:
```javascript
const PORT = 3001; // or any other available port
```

### Duplicate Key Error
This happens when trying to register with an existing username or email. The error is already handled in the code.

---

## Next Steps Optional

Once you understand this basic example, you can:
- Add password encryption using bcrypt
- Implement sessions for logged-in users
- Add more fields to the schema (age, address, etc.)
- Create update and delete routes
- Add input validation
- Use environment variables for database URL
- Separate routes into different files
- Add a proper frontend framework

---

## Summary

This tutorial demonstrated:
- Connecting to MongoDB using Mongoose
- Defining schemas to structure data
- Creating models to interact with database
- Saving data with `.save()`
- Retrieving data with `.findOne()` and `.find()`
- Basic error handling
- Creating a simple web interface with Express

> You now have a foundation to build more complex applications with MongoDB and Mongoose!