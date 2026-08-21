# Lecture 03

# Setting Up the Backend Environment

**Course Outcome:** CO1 – Understand HTTP fundamentals and set up a working backend development environment.

---

## Section 1 – Introduction


In L01, we studied what backend development is and why it matters. In L02, we explored the client–server architecture and how clients communicate with servers over a network. Today, we take the next step by understanding the protocol that makes this communication possible — **HTTP** — and then setting up a real backend development environment where you will write and run your first server.

By the end of this lecture, you will have:

1. A working understanding of HTTP and the request–response cycle.
2. Node.js, npm, Python, and pip installed on your machine.
3. A running backend server in both Express.js and Flask.

---

## Section 2 – What is HTTP?


The Internet connects millions of different devices — laptops, phones, tablets, servers — built by different manufacturers and running different operating systems. For these devices to exchange information, they need a **common language**.

**HTTP (HyperText Transfer Protocol)** is that common language for the web.

* It defines **how** messages are formatted and transmitted.
* It defines **what** actions servers and browsers should take in response to specific requests.
* It is **stateless** — each request is independent; the server does not remember previous requests by default.

Without HTTP, every web application would need its own custom protocol, making the web fragmented and incompatible.

### Client–Server Recap

| Component | Role |
|-----------|------|
| **Client** | Sends a request (e.g., browser, mobile app, curl) |
| **Server** | Receives the request, processes it, sends a response |
| **Network** | The medium through which requests and responses travel |

---

## Section 3 – The Request–Response Cycle


HTTP communication follows a simple, predictable cycle:

<svg xmlns="http://www.w3.org/2000/svg" width="900" height="350" viewBox="0 0 900 350">
<rect width="900" height="350" fill="white"/>
<rect x="40" y="50" width="180" height="100" rx="8" fill="#EAF4FF" stroke="#1E88E5"/>
<text x="130" y="80" text-anchor="middle" font-size="20">Client</text>
<text x="130" y="105" text-anchor="middle" font-size="14">Browser / App</text>
<rect x="680" y="50" width="180" height="100" rx="8" fill="#E8F8EC" stroke="#43A047"/>
<text x="770" y="80" text-anchor="middle" font-size="20">Server</text>
<text x="770" y="105" text-anchor="middle" font-size="14">Express / Flask</text>
<rect x="680" y="200" width="180" height="100" rx="8" fill="#FFF8E6" stroke="#FB8C00"/>
<text x="770" y="230" text-anchor="middle" font-size="20">Database</text>
<text x="770" y="255" text-anchor="middle" font-size="14">Data Storage</text>
<line x1="220" y1="80" x2="680" y2="80" stroke="black" stroke-width="2"/>
<polygon points="675,75 688,80 675,85" fill="black"/>
<text x="450" y="70" text-anchor="middle" font-size="14">1. HTTP Request</text>
<line x1="680" y1="120" x2="220" y2="120" stroke="black" stroke-width="2"/>
<polygon points="225,115 212,120 225,125" fill="black"/>
<text x="450" y="145" text-anchor="middle" font-size="14">5. HTTP Response</text>
<line x1="770" y1="150" x2="770" y2="200" stroke="black" stroke-width="2"/>
<polygon points="765,195 770,208 775,195" fill="black"/>
<text x="830" y="180" text-anchor="middle" font-size="12">3. Query</text>
<line x1="680" y1="220" x2="680" y2="170" stroke="black" stroke-width="2"/>
<polygon points="675,175 680,162 685,175" fill="black"/>
<text x="620" y="180" text-anchor="middle" font-size="12">4. Data</text>
<text x="770" y="185" text-anchor="middle" font-size="12">2. Process</text>
<text x="130" y="175" text-anchor="middle" font-size="14">6. Render Result</text>
<rect x="40" y="160" width="180" height="30" rx="4" fill="#E0F7FA" stroke="#00ACC1"/>
<text x="130" y="180" text-anchor="middle" font-size="12">Display Response</text>
</svg>

### HTTP Request Structure

An HTTP request is a message sent by the client to the server asking for a resource or requesting an action.

| Component | Description | Example |
|-----------|-------------|---------|
| **Method** | The type of action | `GET`, `POST`, `PUT`, `DELETE` |
| **URL** | The address of the resource | `/students/1` |
| **Headers** | Additional metadata | `Accept: application/json` |
| **Body** (optional) | Data being sent to the server | `{ "name": "Aarav" }` |

### HTTP Response Structure

An HTTP response is the server's reply to the client's request.

| Component | Description | Example |
|-----------|-------------|---------|
| **Status Code** | Whether the request succeeded or failed | `200 OK`, `404 Not Found` |
| **Headers** | Metadata about the response | `Content-Type: application/json` |
| **Body** | The actual data returned | `[{"id":1,"name":"Aarav"}]` |

---

## Section 4 – HTTP Methods & Status Codes


### HTTP Methods

| Method | Purpose | Has Body? |
|--------|---------|-----------|
| **GET** | Retrieve data | No |
| **POST** | Create new data | Yes |
| **PUT** | Update existing data | Yes |
| **DELETE** | Remove data | No |
| **PATCH** | Partially update data | Yes |

### HTTP Status Codes

| Code Range | Category | Common Examples |
|------------|----------|-----------------|
| **1xx** | Informational | 100 Continue |
| **2xx** | Success | 200 OK, 201 Created |
| **3xx** | Redirection | 301 Moved Permanently |
| **4xx** | Client Error | 400 Bad Request, 404 Not Found |
| **5xx** | Server Error | 500 Internal Server Error |

---

## Section 5 – URL Structure & localhost


### URL Components

A **URL (Uniform Resource Locator)** is the address used to identify a resource on the web.

<svg xmlns="http://www.w3.org/2000/svg" width="900" height="200" viewBox="0 0 900 200">
<rect width="900" height="200" fill="white"/>
<text x="450" y="30" text-anchor="middle" font-size="16" font-family="monospace">https://www.example.com:443/students/5?format=json#results</text>
<rect x="40" y="60" width="90" height="40" rx="6" fill="#EAF4FF" stroke="#1E88E5"/>
<text x="85" y="85" text-anchor="middle" font-size="13">Protocol</text>
<rect x="140" y="60" width="200" height="40" rx="6" fill="#E8F8EC" stroke="#43A047"/>
<text x="240" y="85" text-anchor="middle" font-size="13">Hostname</text>
<rect x="350" y="60" width="60" height="40" rx="6" fill="#FFF8E6" stroke="#FB8C00"/>
<text x="380" y="85" text-anchor="middle" font-size="13">Port</text>
<rect x="420" y="60" width="120" height="40" rx="6" fill="#F3E5F5" stroke="#8E24AA"/>
<text x="480" y="85" text-anchor="middle" font-size="13">Path</text>
<rect x="550" y="60" width="140" height="40" rx="6" fill="#E0F7FA" stroke="#00ACC1"/>
<text x="620" y="85" text-anchor="middle" font-size="13">Query</text>
<rect x="700" y="60" width="100" height="40" rx="6" fill="#FCE4EC" stroke="#E53935"/>
<text x="750" y="85" text-anchor="middle" font-size="13">Fragment</text>
<text x="85" y="130" text-anchor="middle" font-size="12">http://</text>
<text x="240" y="130" text-anchor="middle" font-size="12">www.example.com</text>
<text x="380" y="130" text-anchor="middle" font-size="12">:443</text>
<text x="480" y="130" text-anchor="middle" font-size="12">/students/5</text>
<text x="620" y="130" text-anchor="middle" font-size="12">?format=json</text>
<text x="750" y="130" text-anchor="middle" font-size="12">#results</text>
<line x1="85" y1="40" x2="85" y2="58" stroke="#1E88E5" stroke-width="2"/>
<polygon points="85,58 80,48 90,48" fill="#1E88E5"/>
<text x="85" y="50" text-anchor="middle" font-size="11">https://</text>
<text x="450" y="175" text-anchor="middle" font-size="14" fill="#555">URL Structure Breakdown</text>
</svg>

| Component | Description | Example |
|-----------|-------------|---------|
| **Protocol** | The communication scheme | `http://` or `https://` |
| **Hostname** | The server's domain name or IP | `www.example.com` |
| **Port** | The network port (optional) | `:443` |
| **Path** | The resource location on the server | `/students/5` |
| **Query** | Key-value parameters | `?format=json` |
| **Fragment** | A specific section of the page | `#results` |

### localhost and Ports

* **`localhost`** is a special hostname that always refers to your own computer (IP address `127.0.0.1`).
* **Ports** are numerical identifiers (0–65535) that distinguish different services running on the same machine.

| Port | Common Use |
|------|------------|
| `3000` | Node.js / Express |
| `5000` | Flask |
| `8080` | Java servers |
| `80` | Default HTTP |
| `443` | Default HTTPS |

---

## Section 6 – Installing Node.js and npm

**Node.js** is a JavaScript runtime that allows you to run JavaScript outside the browser. **npm (Node Package Manager)** comes bundled with Node.js and is used to install libraries and frameworks.

1. Visit [https://nodejs.org](https://nodejs.org).
2. Download the **LTS (Long Term Support)** version.
3. Run the installer and follow the default settings.
4. Verify installation:

```bash
node --version
npm --version
```

Expected output:

```
v20.11.0
10.2.4
```

### Recommended VS Code Extensions

| Extension | Purpose |
|-----------|---------|
| **ESLint** | JavaScript linting and code quality |
| **Prettier** | Code formatting |
| **Thunder Client** | API testing (alternative to Postman, inside VS Code) |

---

## Section 7 – Building an Express.js Server


### Task 1 — Hello World Server

#### Step 1: Initialize the project

```bash
mkdir express-demo
cd express-demo
npm init -y
```

#### Step 2: Install Express

```bash
npm install express
```

#### Step 3: Create `server.js`

```javascript
const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Backend Server Running");
});

app.listen(3000, () => {
    console.log("Server started at http://localhost:3000");
});
```

#### Step 4: Run and test

```bash
node server.js
```

Visit `http://localhost:3000` — you should see `Backend Server Running`.

### Task 2 — Multiple Routes

Update `server.js`:

```javascript
const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Welcome to the Student Management API");
});

app.get("/students", (req, res) => {
    res.send("List of all students");
});

app.get("/students/1", (req, res) => {
    res.send("Student: Aarav, Roll No: 1");
});

app.listen(3000, () => {
    console.log("Server started at http://localhost:3000");
});
```

| URL | Response |
|-----|----------|
| `http://localhost:3000/` | Welcome to the Student Management API |
| `http://localhost:3000/students` | List of all students |
| `http://localhost:3000/students/1` | Student: Aarav, Roll No: 1 |

### Task 3 — Returning JSON Data

Update `server.js`:

```javascript
const express = require("express");
const app = express();

const students = [
    { id: 1, name: "Aarav", branch: "CSE" },
    { id: 2, name: "Diya", branch: "ECE" },
    { id: 3, name: "Rohan", branch: "IT" }
];

app.get("/", (req, res) => {
    res.send("Student Management API");
});

app.get("/students", (req, res) => {
    res.json(students);
});

app.get("/students/:id", (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (student) {
        res.json(student);
    } else {
        res.status(404).json({ error: "Student not found" });
    }
});

app.listen(3000, () => {
    console.log("Server started at http://localhost:3000");
});
```

| URL | Response |
|-----|----------|
| `http://localhost:3000/students` | Full student array as JSON |
| `http://localhost:3000/students/1` | Aarav's record |
| `http://localhost:3000/students/5` | `{"error": "Student not found"}` with 404 |

### Task 4 — Sending HTML Responses

Backend servers often send HTML pages instead of plain text or JSON. Use `res.send()` with an HTML string.

Update `server.js`:

```javascript
const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("<h1>Student Management API</h1><p>Welcome to the backend server.</p>");
});

app.get("/students", (req, res) => {
    const students = [
        { id: 1, name: "Aarav", branch: "CSE" },
        { id: 2, name: "Diya", branch: "ECE" },
        { id: 3, name: "Rohan", branch: "IT" }
    ];

    let html = "<h2>All Students</h2><ul>";
    students.forEach(s => {
        html += `<li><strong>${s.name}</strong> — ${s.branch}</li>`;
    });
    html += "</ul>";

    res.send(html);
});

app.get("/students/:id", (req, res) => {
    const students = [
        { id: 1, name: "Aarav", branch: "CSE" },
        { id: 2, name: "Diya", branch: "ECE" },
        { id: 3, name: "Rohan", branch: "IT" }
    ];

    const student = students.find(s => s.id === parseInt(req.params.id));
    if (student) {
        res.send(`<h2>${student.name}</h2><p>Branch: ${student.branch}</p>`);
    } else {
        res.status(404).send("<h2>Student not found</h2>");
    }
});

app.listen(3000, () => {
    console.log("Server started at http://localhost:3000");
});
```

| URL | Response |
|-----|----------|
| `http://localhost:3000/` | HTML heading and paragraph |
| `http://localhost:3000/students` | HTML list of all students |
| `http://localhost:3000/students/1` | HTML card for Aarav |

This works, but building HTML strings inside JavaScript code becomes messy quickly. For dynamic pages, use a **template engine**.

### Task 5 — Brief Intro to Templating with EJS

**EJS (Embedded JavaScript)** is a simple templating engine for Express. It lets you write HTML files with embedded JavaScript placeholders.

#### Step 1: Install EJS

```bash
npm install ejs
```

#### Step 2: Create a views folder

```bash
mkdir views
```

#### Step 3: Create `views/students.ejs`

```html
<!DOCTYPE html>
<html>
<head>
    <title>Students</title>
</head>
<body>
    <h1>All Students</h1>
    <ul>
        <% students.forEach(student => { %>
            <li><strong><%= student.name %></strong> — <%= student.branch %></li>
        <% }); %>
    </ul>
    <a href="/">Back to Home</a>
</body>
</html>
```

#### Step 4: Create `views/home.ejs`

```html
<!DOCTYPE html>
<html>
<head>
    <title>Home</title>
</head>
<body>
    <h1>Student Management API</h1>
    <p>Welcome to the backend server.</p>
    <a href="/students">View All Students</a>
</body>
</html>
```

#### Step 5: Update `server.js`

```javascript
const express = require("express");
const app = express();

app.set("view engine", "ejs");

const students = [
    { id: 1, name: "Aarav", branch: "CSE" },
    { id: 2, name: "Diya", branch: "ECE" },
    { id: 3, name: "Rohan", branch: "IT" }
];

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/students", (req, res) => {
    res.render("students", { students: students });
});

app.listen(3000, () => {
    console.log("Server started at http://localhost:3000");
});
```

#### Step 6: Run and test

```bash
node server.js
```

Visit `http://localhost:3000/students` — you see a styled HTML page rendered from the template.

| Concept | Syntax |
|---------|--------|
| **Output value** | `<%= variable %>` |
| **Execute JS** | `<% code %>` |
| **Render template** | `res.render("filename", { data })` |

EJS keeps HTML separate from server logic. This is covered in depth in **L10 – Server-Side Rendering**.

---

## Section 8 – Installing Python and pip

**Python** is a versatile programming language widely used in backend development. **pip** is Python's package manager.

1. Visit [https://www.python.org/downloads/](https://www.python.org/downloads/).
2. Download the latest stable version (3.11 or above recommended).
3. During installation, **check the box** that says "Add Python to PATH" (Windows).
4. Verify installation:

```bash
python --version
pip --version
```

Expected output:

```
Python 3.12.2
pip 24.0 from ... (python 3.12)
```

### Python Virtual Environment

A **virtual environment** creates an isolated Python environment for each project, preventing dependency conflicts.

```bash
mkdir backend-project
cd backend-project
python -m venv venv
```

Activate the virtual environment:

**Windows:**

```bash
venv\Scripts\activate
```

**macOS / Linux:**

```bash
source venv/bin/activate
```

Install Flask inside the virtual environment:

```bash
pip install flask
```

### Recommended VS Code Extensions

| Extension | Purpose |
|-----------|---------|
| **Python** | Python IntelliSense, linting, and debugging |

---

## Section 9 – Building a Flask Server


### Task 6 — Hello World Server

#### Step 1: Ensure virtual environment is active

```bash
cd backend-project
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS/Linux
```

#### Step 2: Create `app.py`

```python
from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "Backend Server Running"

if __name__ == "__main__":
    app.run(debug=True)
```

#### Step 3: Run and test

```bash
python app.py
```

Visit `http://localhost:5000` — you should see `Backend Server Running`.

### Task 7 — Multiple Routes and JSON

Update `app.py`:

```python
from flask import Flask, jsonify

app = Flask(__name__)

students = [
    {"id": 1, "name": "Aarav", "branch": "CSE"},
    {"id": 2, "name": "Diya", "branch": "ECE"},
    {"id": 3, "name": "Rohan", "branch": "IT"}
]

@app.route("/")
def home():
    return "Student Management API"

@app.route("/students")
def get_students():
    return jsonify(students)

@app.route("/students/<int:student_id>")
def get_student(student_id):
    student = next((s for s in students if s["id"] == student_id), None)
    if student:
        return jsonify(student)
    else:
        return jsonify({"error": "Student not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)
```

| URL | Response |
|-----|----------|
| `http://localhost:5000/` | Student Management API |
| `http://localhost:5000/students` | Full student list as JSON |
| `http://localhost:5000/students/1` | Aarav's record |
| `http://localhost:5000/students/5` | `{"error": "Student not found"}` with 404 |

---

## Section 10 – Observing the Request–Response Cycle


### Task 8 — Using Browser DevTools

1. Open Chrome and press `F12` to open DevTools.
2. Go to the **Network** tab.
3. Visit `http://localhost:3000/students` (Express) or `http://localhost:5000/students` (Flask).
4. Click on the request in the Network tab.
5. Observe:

| Field | Value |
|-------|-------|
| **Request Method** | GET |
| **Status Code** | 200 OK |
| **Response Headers** | Content-Type, etc. |
| **Response Body** | The JSON data |

This is the request–response cycle in action — exactly what we studied in the theory section.

---

## Section 11 – Summary


In this lecture, you learned:

* **HTTP** is the protocol that enables communication between clients and servers on the web.
* The **request–response cycle** is the fundamental pattern of all HTTP communication.
* HTTP requests include a **method**, **URL**, **headers**, and optionally a **body**.
* HTTP responses include a **status code**, **headers**, and a **body**.
* **localhost** refers to your own machine; **ports** distinguish different services.
* You installed **Node.js**, **npm**, **Python**, and **pip**.
* You set up a **Python virtual environment** for isolated dependency management.
* You built your first backend servers using **Express.js** and **Flask**.
* You created multiple routes and returned **JSON** and **HTML** data.
* You used **EJS** to separate HTML from server logic using templates.
* You observed the request–response cycle using browser DevTools.

### Key Takeaways

* HTTP is the foundation of all web communication.
* A backend server listens on a port and responds to incoming HTTP requests.
* Express.js and Flask are lightweight frameworks for building backend servers quickly.
* JSON is the standard data format for API responses; HTML is used for rendering pages.
* **Template engines** like EJS keep HTML templates separate from server logic.
* Browser DevTools let you inspect the request–response cycle in real time.

This lecture laid the groundwork for **L04 – HTTP Requests**, where you will use tools like Postman and curl to inspect HTTP requests and responses in greater depth.

---

### Lab Exercise

1. Install all tools as described in Sections 6 and 8.
2. Complete all eight hands-on tasks in Sections 7, 9, and 10.
3. Modify Task 3 to add a new route `/students/branch/:branch` that returns all students from a given branch.
4. Modify Task 7 to add a `POST /students` route that appends a new student to the list.
5. Use browser DevTools to capture a screenshot of the request–response cycle for one API call.
