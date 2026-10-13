# Lecture 25

# Introduction to Express.js Framework: Setup and Basic Structure

**Course Outcome:** CO3 – Utilize frameworks and APIs to build backend applications.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 25 |
| Unit | Unit 3: Frameworks and Performance Optimization |
| Topic | Introduction to Express.js Framework: Setup and Basic Structure |
| Course Outcome | CO3 – Utilize frameworks and APIs |
| Bloom's Knowledge Level | Understand |
| Skills Developed | Express.js installation, Node.js project management, Basic server routing |
| Applications | RESTful API development, Web application backend architecture |
| PBL Activity | Setting up the Student Management API skeleton using Express.js |
| Assessment Method | Coding task |

---

## Part A – Theory

### 1. Introduction

In Unit 2, we worked directly with databases to perform CRUD operations. Now, we move to frameworks that structure and simplify backend development. 

Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It simplifies the process of writing server-side code in Node.js by providing a higher-level abstraction over the built-in `http` module.

By the end of this lecture, students will be able to:

1. Initialize an Express.js project environment.
2. Understand the basic structure and lifecycle of an Express application.
3. Create a basic server that handles HTTP requests and returns responses.

### 2. Express.js Architecture

Express follows a middleware-based architecture, where requests pass through a pipeline of functions before reaching a route handler.

<svg xmlns="http://www.w3.org/2000/svg" width="600" height="150" viewBox="0 0 600 150">
<rect width="600" height="150" fill="white"/>
<text x="300" y="25" text-anchor="middle" font-size="16" font-weight="bold">Express.js Application Flow</text>
<rect x="50" y="50" width="100" height="50" rx="5" fill="#EAF4FF" stroke="#1E88E5"/>
<text x="100" y="80" text-anchor="middle">Client</text>
<rect x="250" y="50" width="100" height="50" rx="5" fill="#E8F8EC" stroke="#43A047"/>
<text x="300" y="80" text-anchor="middle">Express App</text>
<rect x="450" y="50" width="100" height="50" rx="5" fill="#FFF8E6" stroke="#FB8C00"/>
<text x="500" y="80" text-anchor="middle">Database</text>
<path d="M 150 75 L 250 75 M 240 65 L 250 75 L 240 85" fill="none" stroke="black"/>
<path d="M 350 75 L 450 75 M 440 65 L 450 75 L 440 85" fill="none" stroke="black"/>
<text x="200" y="70" text-anchor="middle" font-size="10">Request</text>
<text x="400" y="70" text-anchor="middle" font-size="10">Query</text>
</svg>

---

## Part B – Installation

### Express.js Setup
1. **Initialize Project:**
   ```bash
   mkdir express-api && cd express-api
   npm init -y
   ```
2. **Install Express:**
   ```bash
   npm install express
   ```

---

## Part C – Hands-On

### Basic Server Structure (`app.js`)

```javascript
// Import the express module
const express = require('express');
// Initialize the express application
const app = express();
const PORT = 3000;

// Built-in middleware to parse incoming JSON payloads
app.use(express.json());

// Basic Route Definition
// When a GET request is made to '/', this function executes
app.get('/', (req, res) => {
    // res.send sends a response back to the client
    res.send('Welcome to the Student Management API');
});

// Start the server to listen on the specified port
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

---

## PBL Activity

### Problem Scenario
You need to initiate the development of the Student Management System backend using a structured framework.

### Student Task
Set up the Express project environment, install dependencies, and create a base `app.js` file that responds with "API is running" on the root path.

---

## Assessment Activity

### Assessment Method
Coding Task: Submit the `package.json` and `app.js` file showing a running Express server.

### Evaluation Criteria
| Criterion | Expected Evidence |
|---|---|
| Environment Setup | Correct `package.json` |
| Server Functionality | Server listens and responds to '/' |

---

## Summary

### Key Takeaways
- Express.js is a minimal, unopinionated web framework for Node.js.
- It simplifies routing, middleware integration, and request/response handling.
- `app.use()` is the mechanism to integrate middleware in the request pipeline.

### Next Lecture
L26 – Django Framework: Overview, Architecture, and Setup.
