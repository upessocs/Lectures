# Lecture 26

# Django Framework: Detailed Overview, Architecture, and Setup

**Course Outcome:** CO3 – Utilize frameworks and APIs to build backend applications.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 26 |
| Unit | Unit 3: Frameworks and Performance Optimization |
| Topic | Django Framework: Detailed Overview, Architecture, and Setup |
| Course Outcome | CO3 – Utilize frameworks and APIs |
| Bloom's Knowledge Level | Understand |
| Skills Developed | Django installation, Python virtual environment management, Project/App structure setup |
| Applications | Building robust, scalable, and secure backend enterprise applications |
| PBL Activity | Setting up the Student Management API project structure using Django |
| Assessment Method | Coding task |

---

## Part A – Theory

### 1. Introduction to Django

Django is a **high-level Python web framework** designed to help developers build web applications quickly, securely, and with minimal code. Its official tagline — *"The web framework for perfectionists with deadlines"* — captures its core philosophy: it handles the tedious, repetitive parts of web development so you can focus on business logic.

Django is often described as **"batteries-included"**, meaning it ships with a rich set of built-in features:

- **ORM (Object-Relational Mapper)** — interact with databases using Python code instead of raw SQL
- **Admin panel** — an auto-generated interface for managing your data
- **Authentication & Authorization** — user login, permissions, groups out of the box
- **URL routing** — clean, readable URL patterns
- **Template engine** — server-side HTML rendering
- **Security protections** — CSRF, XSS, SQL injection, clickjacking mitigation
- **Form handling & validation**
- **Internationalization (i18n) and localization (l10n)**
- **Caching framework**
- **Testing tools**

It was originally developed in 2003 at the *Lawrence Journal-World* newspaper and publicly released in 2005. It is now maintained by the **Django Software Foundation (DSF)** and used by companies like Instagram, Pinterest, Mozilla, and Disqus.

---

### 2. Why Use a Web Framework?

Before frameworks, developers had to manually:
- Parse HTTP requests
- Connect to databases
- Handle sessions and cookies
- Prevent security vulnerabilities
- Structure large codebases

A framework like Django provides **structure, conventions, and reusable components**, so developers don't reinvent the wheel. This leads to faster development, fewer bugs, and more maintainable code.

---

### 3. Django Architecture: The MVT Pattern

Django follows the **MVT (Model-View-Template)** architectural pattern — a close cousin of the classic **MVC (Model-View-Controller)** pattern, but with Django-specific naming.

#### 3.1 What Each Component Does

- **Model** — Represents the **data structure**. Django's ORM maps Python classes to database tables. Each attribute of a model class becomes a column in the database.
- **View** — Contains the **business logic**. It receives an HTTP request, processes it (often by querying the Model), and returns an HTTP response (HTML, JSON, redirect, etc.).
- **Template** — Defines the **presentation layer** (usually HTML). It uses Django's template language to render dynamic data received from the View. For API-only projects (like our Student Management API), templates are often skipped and JSON is returned directly.

#### 3.2 MVT Flow Diagram

<svg xmlns="http://www.w3.org/2000/svg" width="700" height="300" viewBox="0 0 700 300">
<rect width="700" height="300" fill="white"/>
<text x="350" y="25" text-anchor="middle" font-size="16" font-weight="bold">Django MVT Architecture Flow</text>

<!-- Client -->
<rect x="20" y="120" width="100" height="60" rx="5" fill="#FCE4EC" stroke="#D81B60"/>
<text x="70" y="145" text-anchor="middle" font-size="13">Client</text>
<text x="70" y="162" text-anchor="middle" font-size="11">(Browser)</text>

<!-- URL Dispatcher -->
<rect x="170" y="120" width="110" height="60" rx="5" fill="#EDE7F6" stroke="#5E35B1"/>
<text x="225" y="145" text-anchor="middle" font-size="13">URL</text>
<text x="225" y="162" text-anchor="middle" font-size="11">Dispatcher</text>

<!-- View -->
<rect x="330" y="120" width="100" height="60" rx="5" fill="#E8F8EC" stroke="#43A047"/>
<text x="380" y="152" text-anchor="middle" font-size="13">View</text>

<!-- Model -->
<rect x="330" y="220" width="100" height="60" rx="5" fill="#EAF4FF" stroke="#1E88E5"/>
<text x="380" y="252" text-anchor="middle" font-size="13">Model</text>

<!-- Template -->
<rect x="500" y="120" width="100" height="60" rx="5" fill="#FFF8E6" stroke="#FB8C00"/>
<text x="550" y="152" text-anchor="middle" font-size="13">Template</text>

<!-- DB -->
<rect x="500" y="220" width="100" height="60" rx="5" fill="#F0F0F0" stroke="#616161"/>
<text x="550" y="252" text-anchor="middle" font-size="13">Database</text>

<!-- Arrows -->
<defs>
<marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
<polygon points="0 0, 10 3.5, 0 7" fill="black"/>
</marker>
</defs>
<path d="M 120 150 L 170 150" fill="none" stroke="black" marker-end="url(#arrowhead)"/>
<path d="M 280 150 L 330 150" fill="none" stroke="black" marker-end="url(#arrowhead)"/>
<path d="M 380 180 L 380 220" fill="none" stroke="black" marker-end="url(#arrowhead)"/>
<path d="M 430 150 L 500 150" fill="none" stroke="black" marker-end="url(#arrowhead)"/>
<path d="M 550 220 L 550 180" fill="none" stroke="black" marker-end="url(#arrowhead)"/>
<path d="M 550 120 L 550 80 L 70 80 L 70 120" fill="none" stroke="black" marker-end="url(#arrowhead)"/>
<text x="310" y="70" text-anchor="middle" font-size="11">HTTP Response</text>
</svg>

#### 3.3 Step-by-Step Request Lifecycle

1. **Client** (browser or API consumer) sends an HTTP request to a URL.
2. **URL Dispatcher** (`urls.py`) matches the URL to a specific **View**.
3. **View** executes business logic — it may query the **Model** for data.
4. **Model** interacts with the **Database** through Django's ORM.
5. View optionally passes data to a **Template** for rendering.
6. View returns an **HTTP Response** (HTML, JSON, redirect) back to the client.

---

### 4. MVT vs MVC vs Other Architectural Patterns

To understand MVT properly, it helps to compare it with other popular patterns.

#### 4.1 MVC (Model-View-Controller)

The classic MVC pattern (used by Ruby on Rails, Laravel, Spring MVC) has three parts:

| Component | Responsibility |
|---|---|
| **Model** | Data and business rules |
| **View** | What the user sees (UI) |
| **Controller** | Handles input, coordinates Model and View |

**MVC Flow:** User → Controller → Model → View → User

#### 4.2 MVT (Model-View-Template) — Django's Approach

Django's naming is different from MVC, but the roles are similar:

| Django (MVT) | Classic MVC Equivalent | Responsibility |
|---|---|---|
| **Model** | Model | Data structure and DB access |
| **View** | **Controller** | Business logic, request handling |
| **Template** | **View** | Presentation (HTML output) |
| **URL Dispatcher** | Router | Maps URLs to views |

**Key insight:** What Django calls a *View* is actually the *Controller* in MVC terminology, and what Django calls a *Template* is the *View* in MVC terminology. This naming reversal is the most common source of confusion for beginners.

#### 4.3 Comparison Table

| Aspect | MVC | MVT (Django) | MVP | MVVM |
|---|---|---|---|---|
| Full form | Model-View-Controller | Model-View-Template | Model-View-Presenter | Model-View-ViewModel |
| Used by | Rails, Laravel, Spring | **Django** | Android (older) | Angular, Vue, WPF |
| Handles input | Controller | View | Presenter | ViewModel |
| Presentation | View | Template | View | View (with binding) |
| Data binding | Manual | Manual | Manual | Two-way (automatic) |
| Coupling | Medium | Low | Low | Very low |

#### 4.4 Other Architectural Approaches

- **MVC (Model-View-Controller)** — The classic pattern; separates data, UI, and input handling.
- **MVP (Model-View-Presenter)** — Similar to MVC, but the Presenter handles all UI logic; View is passive.
- **MVVM (Model-View-ViewModel)** — Used in modern front-end frameworks; two-way data binding between View and ViewModel.
- **REST (Representational State Transfer)** — Architectural style for APIs; Django REST Framework builds on this.
- **Layered Architecture** — Presentation, Business, Persistence, Database layers.
- **Microservices** — Small, independently deployable services (Django can power each service).
- **Serverless** — Functions-as-a-service; Django can run via Zappa or AWS Lambda.

#### 4.5 Why Django Chose MVT

- **Separation of concerns** — data, logic, and presentation stay decoupled.
- **Reusability** — templates can be reused across views; models across apps.
- **Testability** — views and models can be unit-tested independently.
- **DRY principle** — Don't Repeat Yourself; Django's conventions reduce boilerplate.

---

### 5. Understanding Project Structure

When you run `django-admin startproject student_system`, the following directory structure is created:

```text
student_system/             # Root directory
├── manage.py               # Command-line utility for project management
└── student_system/         # Main project package (configuration folder)
    ├── __init__.py         # Makes this directory a Python package
    ├── settings.py         # Main configuration (DB, installed apps, middleware)
    ├── urls.py             # Global URL routing configuration
    ├── asgi.py             # ASGI deployment entry point
    └── wsgi.py             # WSGI deployment entry point
```

#### File Explanations

| File | Purpose |
|---|---|
| `manage.py` | Command-line interface for administrative tasks (`runserver`, `migrate`, `startapp`, etc.) |
| `__init__.py` | Tells Python that this directory is a package |
| `settings.py` | Project-wide configuration: database, installed apps, middleware, templates, static files, security keys |
| `urls.py` | Root URL configuration — maps URLs to views |
| `asgi.py` | Entry point for ASGI servers (async support, WebSockets) |
| `wsgi.py` | Entry point for WSGI servers (traditional synchronous deployment) |

#### WSGI vs ASGI

| Feature | WSGI | ASGI |
|---|---|---|
| Full form | Web Server Gateway Interface | Asynchronous Server Gateway Interface |
| Protocol | Synchronous | Asynchronous |
| Supports WebSockets | No | Yes |
| Supports async views | No | Yes |
| Typical servers | Gunicorn, uWSGI | Daphne, Uvicorn |
| Use case | Traditional web apps | Real-time, chat, streaming apps |

After running `python manage.py startapp students`, a new directory is added:

```text
students/                   # The 'students' app
├── migrations/             # Database migration files
│   └── __init__.py
├── __init__.py
├── admin.py                # Admin panel configuration
├── apps.py                 # App configuration
├── models.py               # Database models
├── tests.py                # Unit tests
└── views.py                # Request handling logic
```

#### Project vs App

| Concept | Project | App |
|---|---|---|
| Definition | The entire Django web application | A reusable module with a specific purpose |
| Created by | `django-admin startproject` | `python manage.py startapp` |
| Contains | Settings, root URLs, WSGI/ASGI | Models, views, templates, tests |
| Count | One per website | Many per project |
| Reusability | Not reusable | Can be reused across projects |

> **Analogy:** A project is the entire university website; apps are the individual departments (students, courses, faculty, fees).

---

## Part B – Installation and Setup

### Step-by-Step Setup

1. **Virtual Environment:** Always create a virtual environment to isolate project dependencies.
   ```bash
   python -m venv venv
   # On Windows: venv\Scripts\activate
   # On macOS/Linux: source venv/bin/activate
   ```

2. **Installation:**
   ```bash
   pip install django
   ```

   Verify:
   ```bash
   python -m django --version
   ```

3. **Project Creation:**
   ```bash
   django-admin startproject student_system
   cd student_system
   ```

4. **App Creation:**
   ```bash
   python manage.py startapp students
   ```

5. **Connecting App to Project:**
   In `student_system/settings.py`, register your new app:
   ```python
   INSTALLED_APPS = [
       'django.contrib.admin',
       'django.contrib.auth',
       'django.contrib.contenttypes',
       'django.contrib.sessions',
       'django.contrib.messages',
       'django.contrib.staticfiles',
       'students',   # <-- Register the app here
   ]
   ```

6. **Running the Development Server:**
   ```bash
   python manage.py runserver
   ```
   Access it at `http://127.0.0.1:8000/`.

### Understanding `manage.py`

`manage.py` is your main interface for Django commands:

| Command | Purpose |
|---|---|
| `runserver` | Starts the development server (default port 8000) |
| `startapp` | Creates a new app structure |
| `makemigrations` | Creates new migrations based on model changes |
| `migrate` | Applies migrations to the database |
| `createsuperuser` | Creates an admin user for the Django admin panel |
| `shell` | Opens an interactive Python shell with Django context |
| `check` | Validates the project for common issues |
| `collectstatic` | Gathers static files into one directory for deployment |
| `test` | Runs unit tests |
| `dbshell` | Opens the database command-line client |

---

## Part C – Hands-On

### Creating a Basic View (`students/views.py`)

```python
from django.http import HttpResponse

# This function acts as a view to handle incoming requests
def index(request):
    return HttpResponse("Welcome to the Student Management API (Django)")
```

To see this work, map the URL in `student_system/urls.py`:

```python
from django.urls import path
from students import views

urlpatterns = [
    path('', views.index),
]
```

### Returning JSON Instead of HTML (API Style)

Since our goal is to build an **API**, we return JSON rather than HTML:

```python
from django.http import JsonResponse

def index(request):
    return JsonResponse({
        "message": "Welcome to the Student Management API",
        "version": "1.0",
        "status": "running"
    })
```

Run the server and visit `http://127.0.0.1:8000/` — you'll see JSON output.

---

## Summary

- **Django** is a "batteries-included" Python framework for rapid, secure web development.
- It uses the **MVT pattern**: Model (Data), View (Logic), Template (Presentation).
- **MVT ≈ MVC** — Django's *View* acts as the *Controller*, and Django's *Template* acts as the *View* in classic MVC terminology.
- Other architectural patterns include **MVP**, **MVVM**, **REST**, **Layered**, **Microservices**, and **Serverless**.
- A **Django project** is the whole application; **apps** are reusable modules within it.
- **WSGI** handles synchronous requests; **ASGI** handles asynchronous and WebSocket connections.
- `manage.py` is the central command-line tool for all Django operations.

### Next Lecture
**L27 – Working with Middleware in Django.**

Middleware sits between the request and the view, processing requests and responses globally — essential for authentication, logging, CORS, and security.