# ToDo app with database and user login

## Prequesite
* Node.js + Express
* Mongoose + MongoDB Atlas (or local MongoDB server)
* User registration
* Login + hashed passwords
* Express session with cookie
* Todo page that loads/saves todos from the database for the logged-in user
* jQuery frontend to communicate via AJAX


---

# Node.js + Express + Mongoose + Session Auth + jQuery Todo App

## 1. Key Concepts

### 1.1 What is Express?

Express is a lightweight Node.js framework for building web servers and APIs.
It handles:

* Routing (`GET`, `POST`, etc.)
* Middleware (processing requests)
* Serving static files
* Reading form data (`express.json()`)

---

### 1.2 What is Mongoose?

Mongoose is an ODM (Object Data Modeling) library for MongoDB. It provides:

* Schema definitions
* Models to interact with collections
* Built-in validation
* Easy queries like `.find()`, `.create()`, `.updateOne()`

---

### 1.3 What is Express-Session?

Express-session allows your server to store a “session” for each logged-in user.

**Session flow:**

1. User logs in → server creates a **session object**
2. Session object is saved on server (in memory or store)
3. Server sends a **session ID** to browser as a cookie
4. Browser sends this cookie on future requests
5. Server uses the session ID to identify the user

So the cookie does **not** store the user data; it stores only a session ID.

---

### 1.4 Why Do We Need Sessions for the Todo App?

* After login, user should stay logged in
* All Todo API requests must belong to the correct user
* Use session.userId to know which user is making the request

---

### 1.5 How Will jQuery Be Used?

jQuery will handle:

* AJAX requests (`$.post`, `$.get`, `$.ajax`)
* DOM manipulation (show todos, add todos)
* Basic UI interactions

The backend will expose REST endpoints that jQuery calls.

---

# 2. Project Structure

```
project/
  server.js
  models/
    User.js
    Todo.js
  public/
    index.html        (registration + login)
    todo.html         (todo page after login)
    script.js         (AJAX for login/register/todo)
```

---

# 3. Step-by-Step Implementation

## 3.1 Install Dependencies

```bash
npm init -y
npm install express mongoose express-session bcryptjs
```

We will also serve static files (`public/` folder).

---

# 4. Mongoose Models

## 4.1 User Model (`models/User.js`)

```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String   // hashed
});

module.exports = mongoose.model('User', userSchema);
```

---

## 4.2 Todo Model (`models/Todo.js`)

Each todo belongs to a user:

```js
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  done: Boolean
});

module.exports = mongoose.model('Todo', todoSchema);
```

---

# 5. Server Setup (`server.js`)

This file handles:

* Express init
* Sessions
* Static files
* Auth routes
* Todo routes

---

## 5.1 Base Server + MongoDB Connection

```js
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Todo = require('./models/Todo');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessions
app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 86400000 } // 1 day
}));

// Serve static files from public/
app.use(express.static('public'));

// MongoDB Atlas connection
mongoose.connect('YOUR_MONGODB_ATLAS_URL')
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));
```

---

# 6. Authentication Routes

## 6.1 Register

```js
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  const existing = await User.findOne({ username });
  if (existing) return res.json({ success: false, message: "Username taken" });

  const hashed = await bcrypt.hash(password, 10);

  await User.create({ username, password: hashed });

  res.json({ success: true });
});
```

---

## 6.2 Login

```js
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.json({ success: false, message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ success: false, message: "Invalid credentials" });

  // Save user ID to session
  req.session.userId = user._id;

  res.json({ success: true });
});
```

---

## 6.3 Middleware to Protect Todo Routes

```js
function requireLogin(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ message: "Not logged in" });
  next();
}
```

---

# 7. Todo Routes (Protected)

## 7.1 Get All Todos

```js
app.get('/api/todos', requireLogin, async (req, res) => {
  const todos = await Todo.find({ userId: req.session.userId });
  res.json(todos);
});
```

---

## 7.2 Add Todo

```js
app.post('/api/todos', requireLogin, async (req, res) => {
  const todo = await Todo.create({
    userId: req.session.userId,
    text: req.body.text,
    done: false
  });
  res.json(todo);
});
```

---

## 7.3 Toggle Done

```js
app.post('/api/todos/toggle', requireLogin, async (req, res) => {
  const { id } = req.body;
  const todo = await Todo.findOne({ _id: id, userId: req.session.userId });

  todo.done = !todo.done;
  await todo.save();

  res.json(todo);
});
```

---

## 7.4 Delete Todo

```js
app.post('/api/todos/delete', requireLogin, async (req, res) => {
  const { id } = req.body;
  await Todo.deleteOne({ _id: id, userId: req.session.userId });
  res.json({ success: true });
});
```

---

# 8. Frontend (jQuery)

## 8.1 Registration + Login Page (`public/index.html`)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Auth</title>
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
</head>
<body>

<h2>Register</h2>
<input id="regUser" placeholder="username">
<input id="regPass" type="password" placeholder="password">
<button id="registerBtn">Register</button>
<div id="regMsg"></div>

<h2>Login</h2>
<input id="logUser" placeholder="username">
<input id="logPass" type="password" placeholder="password">
<button id="loginBtn">Login</button>
<div id="logMsg"></div>

<script src="script.js"></script>
</body>
</html>
```

---

## 8.2 Todo Page (`public/todo.html`)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Todo</title>
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
</head>
<body>

<h2>Your Todos</h2>

<input id="todoInput" placeholder="new task">
<button id="addBtn">Add</button>

<ul id="todoList"></ul>

<script src="script.js"></script>
</body>
</html>
```

---

## 8.3 jQuery Frontend Logic (`public/script.js`)

### Registration

```js
$("#registerBtn").click(() => {
  $.post('/api/register', {
    username: $("#regUser").val(),
    password: $("#regPass").val()
  }, res => {
    $("#regMsg").text(res.success ? "Registered!" : res.message);
  });
});
```

---

### Login

```js
$("#loginBtn").click(() => {
  $.post('/api/login', {
    username: $("#logUser").val(),
    password: $("#logPass").val()
  }, res => {
    if (res.success) {
      window.location = "/todo.html";
    } else {
      $("#logMsg").text(res.message);
    }
  });
});
```

---

### Todo Logic

Load Todos:

```js
if (window.location.pathname === "/todo.html") {
  loadTodos();
}

function loadTodos() {
  $.get('/api/todos', todos => {
    $("#todoList").empty();
    todos.forEach(t => {
      $("#todoList").append(`
        <li>
          <span style="text-decoration:${t.done?'line-through':'none'}">${t.text}</span>
          <button onclick="toggleTodo('${t._id}')">Done</button>
          <button onclick="deleteTodo('${t._id}')">Delete</button>
        </li>
      `);
    });
  });
}
```

Add Todo:

```js
$("#addBtn").click(() => {
  $.post('/api/todos', { text: $("#todoInput").val() }, () => {
    $("#todoInput").val('');
    loadTodos();
  });
});
```

Toggle:

```js
function toggleTodo(id) {
  $.post('/api/todos/toggle', { id }, loadTodos);
}
```

Delete:

```js
function deleteTodo(id) {
  $.post('/api/todos/delete', { id }, loadTodos);
}
```

---

# 9. Start Server

```bash
node server.js
```

Open:

* `http://localhost:3000/` → Register/Login page
* `http://localhost:3000/todo.html` → Todo page after login

---

# 10. Summary of What You Learned

| Concept          | Explanation                                             |
| ---------------- | ------------------------------------------------------- |
| Express          | Routing + Middleware                                    |
| Mongoose         | MongoDB models + schemas                                |
| Session Auth     | Server stores session, browser stores session ID cookie |
| jQuery UI        | AJAX + DOM manipulation                                 |
| Todo API         | Auth-protected CRUD endpoints                           |
| Persistent Login | Session cookie sent automatically by browser            |

You now have a fully working login + todo system.

