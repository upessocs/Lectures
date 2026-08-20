# Lecture 06

# Server-Side Rendering and Templating Engines

**Course Outcome:** CO2 – Understand server-side rendering concepts and build dynamic web pages using templating engines.

---

## Part A – Theory

---

### 1. Introduction

In L03 and L04, our Express and Flask servers returned **static responses** — hardcoded strings or JSON data. Real web applications need to send **dynamic HTML pages** that change based on data, user identity, or time of day.

**Server-Side Rendering (SSR)** is the technique where the server generates the full HTML for each page before sending it to the browser. Instead of returning a fixed string, the server combines a **template** (HTML structure) with **data** (from a database, user input, etc.) to produce a complete page.

By the end of this lecture, you will have:

1. An understanding of why SSR is needed and how it works.
2. The ability to build dynamic pages using Express and EJS.
3. The ability to build dynamic pages using FastAPI and Jinja2.
4. Knowledge of how to serve static files (CSS, images) from a backend server.

---

### 2. Why Server-Side Rendering?

Consider a student dashboard that displays a list of students. The list changes every time a student is added or removed. If we hardcode the HTML, we would need to rewrite the file every time the data changes.

With SSR, the server **builds the HTML on every request** using a template and current data:

```
Template (HTML structure) + Data (student list) → Complete HTML page
```

The browser receives a fully rendered page — no extra JavaScript needed to display content.

---

### 3. SSR vs Client-Side Rendering (CSR)

| Aspect | SSR (Server-Side Rendering) | CSR (Client-Side Rendering) |
|--------|----------------------------|-----------------------------|
| **Where HTML is built** | On the server | In the browser (via JavaScript) |
| **Initial load** | Fast — page is ready immediately | Slower — must download JS first |
| **SEO** | Excellent — search engines see full HTML | Poor — bots may not execute JS |
| **Server load** | Higher — server builds pages per request | Lower — server only sends data (JSON) |
| **Interactivity** | Full page reload on navigation | Smooth transitions (SPA) |
| **Best for** | Content-heavy sites, blogs, dashboards | Apps with rich interactivity (Gmail, Trello) |

---

### 4. Benefits of SSR

1. **Faster First Paint** — The browser receives complete HTML, so content appears immediately.
2. **Better SEO** — Search engine crawlers see fully rendered pages.
3. **Simpler Client Code** — The browser does not need a JavaScript framework to display content.
4. **Data Security** — Sensitive logic stays on the server; the client only sees the output.
5. **Works Without JavaScript** — Pages are readable even if JavaScript is disabled.

---

### 5. Tradeoffs of SSR

1. **Higher Server Load** — The server builds a new HTML page for every request.
2. **Slower Time-to-Interactive** — Full page reloads on every navigation (compared to SPA).
3. **Scaling Costs** — More server resources needed as traffic grows.
4. **Less Dynamic UI** — No smooth transitions or instant updates without page reloads.
5. **Template Complexity** — Large templates can become hard to maintain.

---

### 6. Templating Engines

A **templating engine** is a library that lets you embed dynamic content inside HTML files. It combines a template with data and produces a final HTML string.

| Engine | Language | Syntax | Used With |
|--------|----------|--------|-----------|
| **EJS** | JavaScript | `<%= variable %>` | Express.js |
| **Pug (Jade)** | JavaScript | `h1= variable` | Express.js |
| **Handlebars** | JavaScript | `{{variable}}` | Express.js |
| **Jinja2** | Python | `{{ variable }}` | FastAPI, Flask |
| **Mako** | Python | `${variable}` | Pyramid |

In this lecture, we use **EJS** (with Express) and **Jinja2** (with FastAPI) — both use similar `<%= %>` / `{{ }}` syntax.

---

### 7. How SSR Works — Request Flow

<svg xmlns="http://www.w3.org/2000/svg" width="900" height="280" viewBox="0 0 900 280">
<rect width="900" height="280" fill="white"/>
<text x="450" y="25" text-anchor="middle" font-size="16" font-weight="bold">Server-Side Rendering Flow</text>
<rect x="30" y="50" width="140" height="70" rx="8" fill="#EAF4FF" stroke="#1E88E5"/>
<text x="100" y="80" text-anchor="middle" font-size="13" font-weight="bold">Browser</text>
<text x="100" y="100" text-anchor="middle" font-size="11">GET /students</text>
<rect x="230" y="50" width="140" height="70" rx="8" fill="#E8F8EC" stroke="#43A047"/>
<text x="300" y="80" text-anchor="middle" font-size="13" font-weight="bold">Express / FastAPI</text>
<text x="300" y="100" text-anchor="middle" font-size="11">Receive request</text>
<rect x="430" y="50" width="140" height="70" rx="8" fill="#FFF8E6" stroke="#FB8C00"/>
<text x="500" y="80" text-anchor="middle" font-size="13" font-weight="bold">Fetch Data</text>
<text x="500" y="100" text-anchor="middle" font-size="11">From DB / array</text>
<rect x="630" y="50" width="140" height="70" rx="8" fill="#F3E5F5" stroke="#8E24AA"/>
<text x="700" y="80" text-anchor="middle" font-size="13" font-weight="bold">Render Template</text>
<text x="700" y="100" text-anchor="middle" font-size="11">Template + Data</text>
<rect x="330" y="160" width="240" height="60" rx="8" fill="#FCE4EC" stroke="#E53935"/>
<text x="450" y="185" text-anchor="middle" font-size="13" font-weight="bold">Send Complete HTML</text>
<text x="450" y="205" text-anchor="middle" font-size="11">200 OK with HTML body</text>
<line x1="170" y1="85" x2="230" y2="85" stroke="#1E88E5" stroke-width="2" marker-end="url(#arrow1)"/>
<line x1="370" y1="85" x2="430" y2="85" stroke="#43A047" stroke-width="2" marker-end="url(#arrow1)"/>
<line x1="570" y1="85" x2="630" y2="85" stroke="#FB8C00" stroke-width="2" marker-end="url(#arrow1)"/>
<line x1="700" y1="120" x2="450" y2="160" stroke="#8E24AA" stroke-width="2" marker-end="url(#arrow1)"/>
<line x1="330" y1="190" x2="170" y2="120" stroke="#E53935" stroke-width="2" marker-end="url(#arrow1)"/>
<text x="450" y="260" text-anchor="middle" font-size="12" fill="#555">Server builds complete HTML and sends it — browser just displays it</text>
<defs>
<marker id="arrow1" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
<polygon points="0 0, 10 3.5, 0 7" fill="#555"/>
</marker>
</defs>
</svg>

---

## Part B – Node.js + Express + EJS

---

### 8. Setting Up the Project

#### Step 1: Create project and install dependencies

```bash
mkdir ssr-demo
cd ssr-demo
npm init -y
npm install express ejs
npm install --save-dev nodemon
```

#### Step 2: Add start scripts to `package.json`

```json
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}
```

#### Step 3: Project structure

```
ssr-demo/
├── views/
│   └── home.ejs
├── app.js
└── package.json
```

---

### 9. Minimal EJS Example — Hello World

#### Step 1: Create `app.js`

```javascript
const express = require('express');
const app = express();

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Route that renders home.ejs
app.get('/', (req, res) => {
  res.render('home', { name: 'Aarav' });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
```

#### Step 2: Create `views/home.ejs`

```html
<!DOCTYPE html>
<html>
<head>
  <title>SSR Demo</title>
</head>
<body>
  <h1>Hello, <%= name %>!</h1>
</body>
</html>
```

#### Step 3: Run the server

```bash
npm run dev
```

Open `http://localhost:3000` — the browser receives **complete HTML** with "Hello, Aarav!" already rendered.

**What happened:**

1. Browser requested `GET /`.
2. Express looked for `views/home.ejs`.
3. EJS replaced `<%= name %>` with the value `'Aarav'`.
4. Express sent the final HTML to the browser.

---

### 10. From HTML to EJS — Converting a Static Page

Let us start with a **plain HTML** page and convert it to a **dynamic EJS** template.

#### Original HTML (static)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Student List</title>
</head>
<body>
  <h1>Students</h1>
  <ul>
    <li>Aarav — CSE</li>
    <li>Diya — ECE</li>
    <li>Rohan — IT</li>
  </ul>
</body>
</html>
```

This page is **static** — the student list never changes.

#### Converted EJS (dynamic)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Student List</title>
</head>
<body>
  <h1>Students</h1>
  <ul>
    <% students.forEach(student => { %>
      <li><%= student.name %> — <%= student.branch %></li>
    <% }) %>
  </ul>
</body>
</html>
```

**Key EJS syntax:**

| Syntax | Purpose | Example |
|--------|---------|---------|
| `<%= expr %>` | Output the value of an expression (escaped) | `<%= name %>` |
| `<% code %>` | Execute JavaScript (no output) | `<% items.forEach(...) %>` |
| `<%- expr %>` | Output raw HTML (unescaped) | `<%- include('header') %>` |

#### Updated `app.js`

```javascript
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

const students = [
  { name: 'Aarav', branch: 'CSE' },
  { name: 'Diya', branch: 'ECE' },
  { name: 'Rohan', branch: 'IT' }
];

app.get('/', (req, res) => {
  res.render('students', { students });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
```

Now the page **dynamically renders** whatever data you pass to the template. Add a new student to the array — the HTML updates automatically.

---

### 11. Expanding with Conditionals and Loops

EJS supports full JavaScript inside templates. Here is an expanded example:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Student Dashboard</title>
</head>
<body>
  <h1>Student Dashboard</h1>

  <% if (students.length === 0) { %>
    <p>No students found.</p>
  <% } else { %>
    <p>Total students: <%= students.length %></p>
    <table border="1">
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Branch</th>
      </tr>
      <% students.forEach(student => { %>
        <tr>
          <td><%= student.id %></td>
          <td><%= student.name %></td>
          <td><%= student.branch %></td>
        </tr>
      <% }) %>
    </table>
  <% } %>
</body>
</html>
```

**What you can do with EJS:**

- `<% if (condition) { %> ... <% } else { %> ... <% } %>` — conditionals
- `<% for (let i = 0; i < items.length; i++) { %> ... <% } %>` — loops
- `<% include('partials/header') %>` — include other template files
- `<%= upperCase(name) %>` — call functions defined on the server

---

## Part C – Python + FastAPI + Jinja2

---

### 12. Setting Up the Project

#### Step 1: Create project and install dependencies

```bash
mkdir ssr-python
cd ssr-python
python -m venv venv
source venv/bin/activate        # macOS/Linux
venv\Scripts\activate           # Windows
pip install fastapi uvicorn jinja2
```

#### Step 2: Project structure

```
ssr-python/
├── templates/
│   └── students.html
├── main.py
└── requirements.txt
```

---

### 13. Minimal Jinja2 Example — Hello World

#### Step 1: Create `main.py`

```python
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from starlette.requests import Request
import uvicorn

app = FastAPI()
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("home.html", {
        "request": request,
        "name": "Aarav"
    })

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
```

#### Step 2: Create `templates/home.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>SSR Demo</title>
</head>
<body>
  <h1>Hello, {{ name }}!</h1>
</body>
</html>
```

#### Step 3: Run the server

**Method 1 — Command line (normal way):**

```bash
uvicorn main:app --reload
```

**Method 2 — Run from Python directly:**

```bash
python main.py
```

Both start the server on `http://localhost:8000`. The second method uses `uvicorn.run()` inside `if __name__ == "__main__"`, which is useful when you want to control host, port, and reload from within your code. The `reload=True` flag watches for file changes and restarts the server automatically — handy during development.

Open `http://localhost:8000` — you see "Hello, Aarav!" rendered server-side.

**Key difference from Express + EJS:** FastAPI's `templates.TemplateResponse()` requires a `request` object as the first parameter. This is a Jinja2 requirement.

---

### 14. Student List with Jinja2

#### Create `templates/students.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>Student List</title>
</head>
<body>
  <h1>Students</h1>

  {% if students|length == 0 %}
    <p>No students found.</p>
  {% else %}
    <p>Total students: {{ students|length }}</p>
    <table border="1">
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Branch</th>
      </tr>
      {% for student in students %}
      <tr>
        <td>{{ student.id }}</td>
        <td>{{ student.name }}</td>
        <td>{{ student.branch }}</td>
      </tr>
      {% endfor %}
    </table>
  {% endif %}
</body>
</html>
```

#### Update `main.py`

```python
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from starlette.requests import Request
import uvicorn

app = FastAPI()
templates = Jinja2Templates(directory="templates")

students = [
    {"id": 1, "name": "Aarav", "branch": "CSE"},
    {"id": 2, "name": "Diya", "branch": "ECE"},
    {"id": 3, "name": "Rohan", "branch": "IT"},
]

@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("students.html", {
        "request": request,
        "students": students
    })

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
```

---

### 15. EJS vs Jinja2 — Syntax Comparison

| Feature | EJS (Express) | Jinja2 (FastAPI) |
|---------|---------------|------------------|
| **Output variable** | `<%= name %>` | `{{ name }}` |
| **Conditional** | `<% if (x) { %>` | `{% if x %}` |
| **Loop** | `<% items.forEach(i => { %>` | `{% for i in items %}` |
| **End block** | `<% } %>` | `{% endif %}` / `{% endfor %}` |
| **Include** | `<%- include('header') %>` | `{% include 'header.html' %}` |
| **Filters** | Functions in JS | `{{ name\|upper }}`, `{{ list\|length }}` |

Both follow the same principle: **template + data = HTML**.

---

## Part D – Serving Static Content

---

### 16. What are Static Files?

Static files are assets that the server sends **as-is** without modification:

- **CSS** — stylesheets
- **JavaScript** — client-side scripts
- **Images** — logos, photos, icons
- **Fonts** — custom typefaces
- **Downloads** — PDFs, documents

Unlike templates, static files do not need processing — the server just reads the file and sends it to the browser.

---

### 17. Serving Static Files with Express

Express provides built-in middleware for serving static files:

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('home', { name: 'Aarav' });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
```

#### Project structure

```
ssr-demo/
├── public/
│   ├── css/
│   │   └── style.css
│   └── images/
│       └── logo.png
├── views/
│   └── home.ejs
├── app.js
└── package.json
```

#### In your EJS template, reference files with `/` prefix

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <img src="/images/logo.png" alt="Logo">
  <h1>Hello, <%= name %>!</h1>
</body>
</html>
```

The browser requests `/css/style.css` — Express maps it to `public/css/style.css` and sends the file.

---

### 18. Serving Static Files with FastAPI

FastAPI uses `StaticFiles` from Starlette:

```python
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from starlette.requests import Request
import uvicorn

app = FastAPI()
templates = Jinja2Templates(directory="templates")

# Mount static files — serves everything under "static" at "/static"
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("home.html", {
        "request": request,
        "name": "Aarav"
    })

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
```

#### Project structure

```
ssr-python/
├── static/
│   ├── css/
│   │   └── style.css
│   └── images/
│       └── logo.png
├── templates/
│   └── home.html
├── main.py
└── requirements.txt
```

#### In your Jinja2 template, reference files with `/static/` prefix

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/static/css/style.css">
</head>
<body>
  <img src="/static/images/logo.png" alt="Logo">
  <h1>Hello, {{ name }}!</h1>
</body>
</html>
```

**Key difference:** FastAPI requires you to explicitly **mount** static files at a URL prefix (`/static`), while Express serves from the `public` folder at the root (`/`).

---

### 19. Static Files — Quick Comparison

| Aspect | Express | FastAPI |
|--------|---------|---------|
| **Setup** | `app.use(express.static('public'))` | `app.mount("/static", StaticFiles(...))` |
| **URL prefix** | None (root `/`) | Custom (usually `/static`) |
| **Folder** | `public/` (convention) | Any folder you choose |
| **How it works** | Built-in middleware | Starlette `StaticFiles` mount |

---

## Summary

In this lecture, you learned:

* **Server-Side Rendering (SSR)** generates complete HTML on the server before sending it to the browser.
* SSR provides **faster first paint**, **better SEO**, and **simpler client code** compared to CSR.
* SSR has tradeoffs: **higher server load**, **full page reloads**, and **less dynamic UI**.
* **Templating engines** combine HTML templates with data to produce dynamic pages.
* **EJS** uses `<%= %>` syntax and works with Express.js via `res.render()`.
* **Jinja2** uses `{{ }}` syntax and works with FastAPI via `templates.TemplateResponse()`.
* Static files (CSS, images, JS) are served separately from templates using built-in middleware.
* Express serves static files from `public/` at the root URL; FastAPI mounts them at `/static`.

### Key Takeaways

- SSR is ideal for content-heavy pages that need fast initial load and good SEO.
- Converting static HTML to EJS/Jinja2 involves replacing hardcoded values with template variables.
- Templates support conditionals, loops, and includes — just like programming.
- Always keep templates in a dedicated folder (`views/` for EJS, `templates/` for Jinja2).
- Static assets go in a separate folder (`public/` for Express, `static/` for FastAPI).
- Choose SSR for dashboards, blogs, and e-commerce; choose CSR for interactive apps.

---

### Lab Exercise

1. Convert the Express student list example to display students in an HTML table with alternating row colors using a CSS class.
2. Add a new EJS route `GET /about` that renders an about page with the course name and lecturer name passed as variables.
3. Build a FastAPI page that displays the current date and time using Jinja2: `{{ now }}`.
4. Serve a custom CSS file with Express that changes the background color and font of the student list page.
5. Create a FastAPI app that serves an image from the `static/images/` folder and displays it in a Jinja2 template.
