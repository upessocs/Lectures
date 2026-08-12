# Experiment 12: Node.js, Express.js, and EJS Templating

## Objective
To understand and implement server-side JavaScript using Node.js, build RESTful APIs with Express.js, handle HTTP requests and responses, work with URL parameters and POST data, implement EJS templating, and use development tools like Nodemon.

---

## Theory

### What is Node.js?
Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows developers to run JavaScript on the server-side, enabling full-stack JavaScript development. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient.

**Key Features:**
- Asynchronous and Event-Driven
- Single-threaded with event loop
- Fast execution (V8 engine)
- NPM (Node Package Manager) ecosystem
- Cross-platform

### What is NPM?
NPM (Node Package Manager) is the default package manager for Node.js. It allows developers to:
- Install and manage third-party libraries
- Share and reuse code
- Manage project dependencies
- Run scripts

### What is Express.js?
Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It simplifies the process of building web servers and APIs.

**Key Features:**
- Routing
- Middleware support
- Template engine integration
- HTTP utility methods
- Error handling

### Common Express Methods for Sending Responses
1. **res.send()** - Sends various types of responses (string, object, buffer)
2. **res.json()** - Sends JSON response
3. **res.render()** - Renders a view template
4. **res.sendFile()** - Sends a file as response
5. **res.status()** - Sets HTTP status code
6. **res.redirect()** - Redirects to another URL

### What is EJS?
EJS (Embedded JavaScript) is a simple templating language that lets you generate HTML markup with plain JavaScript. It allows you to embed dynamic content in HTML pages.

### What is Nodemon?
Nodemon is a development tool that automatically restarts your Node.js application when file changes are detected. This eliminates the need to manually restart the server during development.

**Installation Options:**
- Local (project-specific): `npm install nodemon -D` (or `--save-dev`)
- Global (system-wide): `npm install nodemon -g` (or `-G`)

---

## PART A: Node.js and Express Basics

### Step 1: Install Node.js and NPM

1. **Download Node.js:**
   - Visit [https://nodejs.org/](https://nodejs.org/)
   - Download the LTS (Long Term Support) version
   - Run the installer

2. **Verify Installation:**
   ```bash
   node --version
   npm --version
   ```

### Step 2: Create Project and Initialize NPM

1. **Create Project Directory:**
   ```bash
   mkdir nodejs-express-lab
   cd nodejs-express-lab
   ```

2. **Initialize NPM (Interactive Mode):**
   ```bash
   npm init
   ```
   This will ask you questions about your project (name, version, description, entry point, etc.)

3. **Initialize NPM (Quick Mode):**
   ```bash
   npm init -y
   ```
   This creates a package.json with default values automatically.

**Generated package.json:**
```json
{
  "name": "nodejs-express-lab",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

### Step 3: Create a Basic Node.js Script

**File: script.js**
```javascript
console.log("Hello from Node.js!");

const name = "Student";
const course = "Backend Development";

console.log(`Welcome ${name} to ${course}`);

const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log(`Sum of numbers: ${sum}`);
```

**Run the script:**
```bash
node script.js
```

### Step 4: Install Express.js

```bash
npm install express
```

This will:
- Add express to package.json dependencies
- Create node_modules folder
- Create package-lock.json

### Step 5: Create Basic Express Server

**File: app.js**
```javascript
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

**Run the server:**
```bash
node app.js
```

Visit: http://localhost:3000

### Step 6: Add npm Scripts

**Update package.json:**
```json
{
  "name": "nodejs-express-lab",
  "version": "1.0.0",
  "description": "Node.js and Express Lab",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "node app.js"
  },
  "keywords": ["nodejs", "express"],
  "author": "Your Name",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

**Run using npm:**
```bash
npm run dev
```

### Step 7: Express Response Methods

**File: app.js (Updated)**
```javascript
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Welcome to Express!');
});

app.get('/text', (req, res) => {
  res.send('This is plain text response');
});

app.get('/html', (req, res) => {
  res.send('<h1>HTML Response</h1><p>This is HTML content</p>');
});

app.get('/json', (req, res) => {
  res.json({
    message: 'This is JSON response',
    status: 'success',
    data: {
      name: 'Student',
      course: 'Backend Development'
    }
  });
});

app.get('/status', (req, res) => {
  res.status(201).json({ message: 'Created successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

---

## PART B: URL Parameters and POST Data

### Step 8: URL Parameters (Route Parameters)

```javascript
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  res.json({
    message: 'User details',
    userId: userId
  });
});

app.get('/product/:category/:id', (req, res) => {
  const { category, id } = req.params;
  res.json({
    category: category,
    productId: id
  });
});
```

**Test:**
- http://localhost:3000/user/123
- http://localhost:3000/product/electronics/456

### Step 9: Query Parameters

```javascript
app.get('/search', (req, res) => {
  const { q, page, limit } = req.query;
  res.json({
    searchQuery: q,
    page: page || 1,
    limit: limit || 10
  });
});

app.get('/calculate', (req, res) => {
  const { num1, num2, operation } = req.query;
  const n1 = parseFloat(num1);
  const n2 = parseFloat(num2);
  
  let result;
  switch(operation) {
    case 'add':
      result = n1 + n2;
      break;
    case 'subtract':
      result = n1 - n2;
      break;
    case 'multiply':
      result = n1 * n2;
      break;
    case 'divide':
      result = n2 !== 0 ? n1 / n2 : 'Error: Division by zero';
      break;
    default:
      result = 'Invalid operation';
  }
  
  res.json({ num1: n1, num2: n2, operation, result });
});
```

**Test:**
- http://localhost:3000/search?q=nodejs&page=2&limit=20
- http://localhost:3000/calculate?num1=10&num2=5&operation=add

### Step 10: Handling POST Data

**Install body-parser middleware (already included in Express):**

```javascript
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  
  res.json({
    message: 'Registration successful',
    user: {
      username,
      email
    }
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'test@example.com' && password === 'password123') {
    res.json({
      success: true,
      message: 'Login successful',
      token: 'sample-jwt-token'
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});
```

**Test with curl or Postman:**
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"pass123"}'
```

---

## PART C: EJS Templating

### Step 11: Install and Configure EJS

```bash
npm install ejs
```

**Configure EJS in app.js:**
```javascript
app.set('view engine', 'ejs');
app.set('views', './views');
```

### Step 12: Create EJS Templates

**Create folder structure:**
```bash
mkdir views
```

**File: views/home.ejs**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= title %></title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 { color: #333; }
    .info { color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h1><%= heading %></h1>
    <p class="info"><%= message %></p>
    <p>Current Time: <%= new Date().toLocaleString() %></p>
  </div>
</body>
</html>
```

**File: views/users.ejs**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Users List</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #4CAF50;
      color: white;
    }
  </style>
</head>
<body>
  <h1>Users List</h1>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody>
      <% users.forEach(function(user) { %>
        <tr>
          <td><%= user.id %></td>
          <td><%= user.name %></td>
          <td><%= user.email %></td>
        </tr>
      <% }); %>
    </tbody>
  </table>
  
  <% if (users.length === 0) { %>
    <p>No users found.</p>
  <% } %>
</body>
</html>
```

**File: views/profile.ejs**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>User Profile</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
    }
    .profile-card {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .profile-header {
      border-bottom: 2px solid #4CAF50;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .profile-info p {
      margin: 10px 0;
    }
    .label {
      font-weight: bold;
      color: #555;
    }
  </style>
</head>
<body>
  <div class="profile-card">
    <div class="profile-header">
      <h1>User Profile</h1>
    </div>
    <div class="profile-info">
      <p><span class="label">Name:</span> <%= user.name %></p>
      <p><span class="label">Email:</span> <%= user.email %></p>
      <p><span class="label">Age:</span> <%= user.age %></p>
      <p><span class="label">City:</span> <%= user.city %></p>
    </div>
  </div>
</body>
</html>
```

### Step 13: Render EJS Templates

**Add routes in app.js:**
```javascript
app.get('/home', (req, res) => {
  res.render('home', {
    title: 'Home Page',
    heading: 'Welcome to EJS Templating',
    message: 'EJS makes it easy to generate dynamic HTML'
  });
});

app.get('/users', (req, res) => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
  ];
  
  res.render('users', { users });
});

app.get('/profile/:id', (req, res) => {
  const userId = req.params.id;
  
  const user = {
    id: userId,
    name: 'John Doe',
    email: 'john@example.com',
    age: 25,
    city: 'New York'
  };
  
  res.render('profile', { user });
});
```

---

## PART D: Nodemon for Auto-Restart

### Step 14: Install Nodemon

**Local Installation (Project-specific, Recommended):**
```bash
npm install nodemon -D
```
or
```bash
npm install nodemon --save-dev
```

**Global Installation (System-wide):**
```bash
npm install nodemon -g
```
or
```bash
npm install nodemon -G
```

### Step 15: Configure Nodemon

**Update package.json scripts:**
```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

**Run with Nodemon:**
```bash
npm run dev
```

**Optional: Create nodemon.json for configuration:**
```json
{
  "watch": ["*.js", "views"],
  "ext": "js,json,ejs",
  "ignore": ["node_modules"],
  "delay": "2500"
}
```

---

## Complete Working Code

**File: app.js**
```javascript
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.send('Welcome to Express Server!');
});

app.get('/text', (req, res) => {
  res.send('This is plain text response');
});

app.get('/html', (req, res) => {
  res.send('<h1>HTML Response</h1><p>This is HTML content</p>');
});

app.get('/json', (req, res) => {
  res.json({
    message: 'This is JSON response',
    status: 'success',
    data: { name: 'Student', course: 'Backend Development' }
  });
});

app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ message: 'User details', userId: userId });
});

app.get('/search', (req, res) => {
  const { q, page, limit } = req.query;
  res.json({
    searchQuery: q,
    page: page || 1,
    limit: limit || 10
  });
});

app.get('/calculate', (req, res) => {
  const { num1, num2, operation } = req.query;
  const n1 = parseFloat(num1);
  const n2 = parseFloat(num2);
  
  let result;
  switch(operation) {
    case 'add': result = n1 + n2; break;
    case 'subtract': result = n1 - n2; break;
    case 'multiply': result = n1 * n2; break;
    case 'divide': result = n2 !== 0 ? n1 / n2 : 'Error'; break;
    default: result = 'Invalid operation';
  }
  
  res.json({ num1: n1, num2: n2, operation, result });
});

app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  res.json({
    message: 'Registration successful',
    user: { username, email }
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'test@example.com' && password === 'password123') {
    res.json({
      success: true,
      message: 'Login successful',
      token: 'sample-jwt-token'
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

app.get('/home', (req, res) => {
  res.render('home', {
    title: 'Home Page',
    heading: 'Welcome to EJS Templating',
    message: 'EJS makes it easy to generate dynamic HTML'
  });
});

app.get('/users', (req, res) => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
  ];
  res.render('users', { users });
});

app.get('/profile/:id', (req, res) => {
  const user = {
    id: req.params.id,
    name: 'John Doe',
    email: 'john@example.com',
    age: 25,
    city: 'New York'
  };
  res.render('profile', { user });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  / - Welcome message');
  console.log('  GET  /text - Plain text');
  console.log('  GET  /html - HTML response');
  console.log('  GET  /json - JSON response');
  console.log('  GET  /user/:id - User by ID');
  console.log('  GET  /search?q=term - Search');
  console.log('  GET  /calculate?num1=10&num2=5&operation=add');
  console.log('  POST /register - Register user');
  console.log('  POST /login - Login user');
  console.log('  GET  /home - EJS home page');
  console.log('  GET  /users - Users list');
  console.log('  GET  /profile/:id - User profile');
});
```

**File: package.json**
```json
{
  "name": "nodejs-express-lab",
  "version": "1.0.0",
  "description": "Node.js, Express.js, and EJS Lab",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "keywords": ["nodejs", "express", "ejs"],
  "author": "Your Name",
  "license": "ISC",
  "dependencies": {
    "ejs": "^3.1.9",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

---

## Lab Tasks

### Task 1: Basic Server
Create an Express server with routes that return your name, roll number, and branch in different formats (text, HTML, JSON).

### Task 2: Calculator API
Build a complete calculator API that supports add, subtract, multiply, divide, modulus, and power operations using query parameters.

### Task 3: Student Management
Create routes to:
- GET /students - Return list of students (JSON)
- GET /students/:id - Return specific student details
- POST /students/add - Add new student

### Task 4: EJS Template
Create an EJS template that displays a course timetable with day, time, subject, and faculty. Pass the data from Express route.

### Task 5: Form Handling
Create an EJS form for student registration (name, email, course, semester) and handle POST request to display submitted data on a results page.

---

## Viva Questions with Hints

### Basic Concepts

**Q1: What is Node.js and why is it popular?**
**Hint:** Event-driven, non-blocking I/O, V8 engine, JavaScript on server-side

**Q2: What is the difference between Node.js and JavaScript?**
**Hint:** JavaScript is a language; Node.js is a runtime environment

**Q3: What is NPM?**
**Hint:** Node Package Manager, manages dependencies

**Q4: What is the difference between `npm init` and `npm init -y`?**
**Hint:** Interactive vs automatic with defaults

**Q5: What is package.json?**
**Hint:** Project metadata, dependencies, scripts

**Q6: What are dependencies and devDependencies?**
**Hint:** Production vs development packages

### Express.js

**Q7: What is Express.js?**
**Hint:** Minimal web framework for Node.js

**Q8: What is the purpose of `app.listen()`?**
**Hint:** Starts the server on specified port

**Q9: What is the difference between `res.send()` and `res.json()`?**
**Hint:** res.send() sends any type; res.json() specifically sends JSON with correct headers

**Q10: What are route parameters and how do you access them?**
**Hint:** `/user/:id` accessed via `req.params.id`

**Q11: What is the difference between `req.params` and `req.query`?**
**Hint:** params from URL path (/user/:id), query from query string (?page=1)

**Q12: What is middleware in Express?**
**Hint:** Functions that have access to req, res, and next

**Q13: What does `express.json()` do?**
**Hint:** Parses incoming JSON payloads

**Q14: What does `express.urlencoded()` do?**
**Hint:** Parses URL-encoded form data

### HTTP Methods

**Q15: What is the difference between GET and POST?**
**Hint:** GET retrieves data, POST submits data

**Q16: What are HTTP status codes? Give examples.**
**Hint:** 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error)

**Q17: How do you send status codes in Express?**
**Hint:** `res.status(404).json({...})`

### EJS Templating

**Q18: What is EJS?**
**Hint:** Embedded JavaScript templating engine

**Q19: How do you render an EJS template?**
**Hint:** `res.render('template', { data })`

**Q20: What is the EJS syntax for embedding JavaScript?**
**Hint:** `<%= %>` for output, `<% %>` for logic

**Q21: How do you loop through an array in EJS?**
**Hint:** `<% array.forEach(item => { %> ... <% }); %>`

**Q22: What is the difference between `<%=` and `<%-` in EJS?**
**Hint:** `<%=` escapes HTML, `<%-` renders raw HTML

### Nodemon

**Q23: What is Nodemon?**
**Hint:** Auto-restarts server on file changes

**Q24: What is the difference between `npm install nodemon -D` and `npm install nodemon -g`?**
**Hint:** -D (local/dev dependency), -g (global installation)

**Q25: When should you use local vs global installation?**
**Hint:** Local for project-specific, global for CLI tools

### Advanced

**Q26: What is the event loop in Node.js?**
**Hint:** Handles asynchronous operations

**Q27: What is callback hell and how to avoid it?**
**Hint:** Nested callbacks; use Promises or async/await

**Q28: What are environment variables and how to use them?**
**Hint:** Configuration values, use process.env

**Q29: What is CORS?**
**Hint:** Cross-Origin Resource Sharing, security feature

**Q30: How do you handle errors in Express?**
**Hint:** Error handling middleware with 4 parameters (err, req, res, next)

---

## Conclusion

This experiment covered:
- Node.js and NPM installation and usage
- Creating and running Node.js scripts
- Building web servers with Express.js
- Handling different types of HTTP responses
- Working with URL parameters and query strings
- Handling POST data
- Templating with EJS
- Using Nodemon for development

These concepts form the foundation of backend development with Node.js and are essential for building modern web applications.
