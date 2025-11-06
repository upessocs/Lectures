# Express + Mongoose Tutorial: User Registration, Login & Todo List

## Prerequisites & Installation

### Option 1: Local MongoDB Installation

**Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer (choose "Complete" installation)
3. MongoDB will run as a service automatically
4. Connection URL: `mongodb://localhost:27017/todoapp`

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### Option 2: MongoDB Atlas (Cloud - Recommended for Beginners)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (choose Free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/todoapp?retryWrites=true&w=majority`
6. Replace `<username>` and `<password>` with your credentials

### Project Setup

```bash
mkdir todo-app
cd todo-app
npm init -y
npm install express mongoose bcryptjs jsonwebtoken dotenv
npm install --save-dev nodemon
```

Update `package.json` scripts:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

Create `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/todoapp
# OR for Atlas: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/todoapp
JWT_SECRET=your_super_secret_key_change_this_in_production
PORT=3000
```

---

## Experiment 1: Connect to MongoDB

**Goal:** Establish connection to MongoDB and verify it works

### Step 1.1: Create `config/db.js`

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

**Explanation:**
- `mongoose.connect()` establishes connection to MongoDB
- Options ensure compatibility with newer MongoDB drivers
- `process.exit(1)` stops the app if connection fails
- Using async/await for cleaner asynchronous code

### Step 1.2: Create `server.js`

```javascript
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

**Explanation:**
- `dotenv` loads environment variables from `.env`
- `express.json()` parses incoming JSON requests
- `express.urlencoded()` parses form data

### Step 1.3: Test the Connection

```bash
npm run dev
```

You should see:
```
MongoDB Connected: localhost
Server running on port 3000
```

Visit `http://localhost:3000/` - you should see: `{"message": "API is running..."}`

---

## Experiment 2: User Registration

**Goal:** Create user model and registration endpoint

### Step 2.1: Create User Model - `models/User.js`

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

**Explanation:**
- **Schema**: Defines structure of user documents
- **Validators**: Built-in validation (required, unique, minlength)
- **pre('save') hook**: Automatically hashes password before saving
- **comparePassword method**: Securely compares passwords
- **timestamps**: Automatically adds createdAt/updatedAt fields

### Step 2.2: Create Auth Routes - `routes/auth.js`

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password, // Will be hashed by pre-save hook
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;
```

**Explanation:**
- `$or` operator checks if email OR username exists
- JWT token contains user ID, signed with secret key
- Password is automatically hashed by the User model's pre-save hook
- Returns token for immediate authentication after registration

### Step 2.3: Update `server.js`

```javascript
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

### Step 2.4: Test Registration

**Using cURL:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"password123"}'
```

**Using Postman or Thunder Client:**
- Method: POST
- URL: `http://localhost:3000/api/auth/register`
- Body (JSON):
```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john",
    "email": "john@example.com"
  }
}
```

---

## Experiment 3: User Login

**Goal:** Create login endpoint with authentication

### Step 3.1: Add Login Route to `routes/auth.js`

```javascript
// Add this to routes/auth.js after the register route

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});
```

**Explanation:**
- Returns generic "Invalid credentials" for security (don't reveal if email exists)
- Uses `comparePassword` method from User model to check password
- Returns same token structure as registration

### Step 3.2: Create Authentication Middleware - `middleware/auth.js`

```javascript
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        message: 'No token, authorization denied' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user id to request
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    res.status(401).json({ 
      message: 'Token is not valid' 
    });
  }
};

module.exports = auth;
```

**Explanation:**
- Extracts JWT token from `Authorization` header
- Verifies token using same secret used to create it
- Adds `userId` to request object for use in protected routes
- `next()` passes control to the next middleware/route handler

### Step 3.3: Test Login

**Using cURL:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john",
    "email": "john@example.com"
  }
}
```

**Save the token** - you'll need it for the next experiments!

---

## Experiment 4: Create Todo List

**Goal:** Build CRUD operations for todos

### Step 4.1: Create Todo Model - `models/Todo.js`

```javascript
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  dueDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Todo', todoSchema);
```

**Explanation:**
- `user` field links todo to specific user (relationship)
- `ref: 'User'` enables population of user data
- `enum` restricts priority to specific values
- Optional `dueDate` for deadline tracking

### Step 4.2: Create Todo Routes - `routes/todos.js`

```javascript
const express = require('express');
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes are protected with auth middleware

// @route   GET /api/todos
// @desc    Get all todos for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.userId })
      .sort({ createdAt: -1 }); // Newest first

    res.json({
      count: todos.length,
      todos,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   GET /api/todos/:id
// @desc    Get single todo
router.get('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.userId, // Ensure user owns this todo
    });

    if (!todo) {
      return res.status(404).json({ 
        message: 'Todo not found' 
      });
    }

    res.json(todo);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   POST /api/todos
// @desc    Create a new todo
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    const todo = new Todo({
      user: req.userId,
      title,
      description,
      priority,
      dueDate,
    });

    await todo.save();

    res.status(201).json({
      message: 'Todo created successfully',
      todo,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   PUT /api/todos/:id
// @desc    Update a todo
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, completed, priority, dueDate } = req.body;

    let todo = await Todo.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!todo) {
      return res.status(404).json({ 
        message: 'Todo not found' 
      });
    }

    // Update fields
    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (completed !== undefined) todo.completed = completed;
    if (priority !== undefined) todo.priority = priority;
    if (dueDate !== undefined) todo.dueDate = dueDate;

    await todo.save();

    res.json({
      message: 'Todo updated successfully',
      todo,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   DELETE /api/todos/:id
// @desc    Delete a todo
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!todo) {
      return res.status(404).json({ 
        message: 'Todo not found' 
      });
    }

    res.json({
      message: 'Todo deleted successfully',
      todo,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;
```

**Explanation:**
- All routes use `auth` middleware to protect them
- `user: req.userId` ensures users only see/modify their own todos
- `sort({ createdAt: -1 })` shows newest todos first
- Update route checks `undefined` to allow partial updates

### Step 4.3: Update `server.js`

```javascript
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/todos', require('./routes/todos')); // Add this line

app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

### Step 4.4: Test Todo Operations

**1. Create a Todo:**
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"Buy groceries","description":"Milk, eggs, bread","priority":"high"}'
```

**2. Get All Todos:**
```bash
curl -X GET http://localhost:3000/api/todos \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**3. Update a Todo:**
```bash
curl -X PUT http://localhost:3000/api/todos/TODO_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"completed":true}'
```

**4. Delete a Todo:**
```bash
curl -X DELETE http://localhost:3000/api/todos/TODO_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Complete Project Structure

```
todo-app/
├── config/
│   └── db.js
├── middleware/
│   └── auth.js
├── models/
│   ├── User.js
│   └── Todo.js
├── routes/
│   ├── auth.js
│   └── todos.js
├── .env
├── server.js
└── package.json
```

---

## Key Concepts Explained

### 1. **Mongoose Schemas**
- Define structure and validation rules for documents
- Use `type`, `required`, `default`, `enum` for validation
- Methods and middleware (pre/post hooks) add functionality

### 2. **JWT Authentication**
- Stateless authentication (no sessions needed)
- Token contains encoded user information
- Sent in `Authorization: Bearer <token>` header
- Verified by middleware before accessing protected routes

### 3. **Password Security**
- Never store plain text passwords
- `bcrypt` hashes passwords with salt
- Pre-save hook automatically hashes on user creation/update
- Compare hashed passwords using bcrypt.compare()

### 4. **RESTful API Design**
- GET: Retrieve resources
- POST: Create new resources
- PUT: Update existing resources
- DELETE: Remove resources

### 5. **Error Handling**
- Try-catch blocks for async operations
- Appropriate HTTP status codes (200, 201, 400, 401, 404, 500)
- Descriptive error messages

---

## Common Issues & Solutions

### Issue 1: "MongooseServerSelectionError"
**Solution:** Check MongoDB is running or Atlas connection string is correct

### Issue 2: "ValidationError"
**Solution:** Check required fields are provided in request body

### Issue 3: "Token is not valid"
**Solution:** Ensure token is sent as `Bearer <token>` in Authorization header

### Issue 4: "User already exists"
**Solution:** Email or username is taken - use different credentials

---

## Next Steps

1. **Add input validation**: Use `express-validator` for request validation
2. **Add pagination**: Limit todos returned per request
3. **Add filtering**: Filter by completed status, priority, date range
4. **Add search**: Search todos by title/description
5. **Add categories/tags**: Organize todos into categories
6. **Add refresh tokens**: Implement token refresh mechanism
7. **Build frontend**: Create React/Vue frontend to consume API

---

## Testing Checklist

- [ ] MongoDB connection successful
- [ ] User registration works
- [ ] Duplicate registration prevented
- [ ] User login works
- [ ] Invalid login credentials rejected
- [ ] Protected routes require authentication
- [ ] Create todo works
- [ ] Get all todos returns only user's todos
- [ ] Update todo works
- [ ] Delete todo works
- [ ] Users cannot access other users' todos

---

## Resources

- [Express Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [REST API Best Practices](https://restfulapi.net/)

Happy coding! 