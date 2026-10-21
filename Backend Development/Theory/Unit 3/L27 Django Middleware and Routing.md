# Lecture 27

# Django Middleware and URL Routing

**Course Outcome:** CO3 – Utilize frameworks and APIs to build backend applications.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 27 |
| Unit | Unit 3: Frameworks and Performance Optimization |
| Topic | Django Middleware and URL Routing |
| Course Outcome | CO3 – Utilize frameworks and APIs to build backend applications |
| Bloom's Knowledge Level | Apply and Analyze |
| Skills Developed | Writing callable middleware, registering middleware, composing URL configurations, route parameters, debugging routing errors |
| Applications | Request logging, authentication checks, timing, security headers, API versioning, and modular route design |
| PBL Activity | Add logging and student-detail routes to the Student Management API |
| Assessment Method | Coding and debugging exercise |

---

## Part A – Theory

### 1. Learning Objectives

By the end of this lecture, students will be able to:

1. Explain where middleware runs in the request-response lifecycle.
2. Explain why middleware order matters.
3. Implement and register custom logging middleware.
4. Map fixed and parameterized URLs to views.
5. Split app routes into `students/urls.py` and include them in the project URLconf.

### 2. What Is Middleware?

Middleware is a series of components that can inspect or modify an HTTP request before the view runs and inspect or modify the response after the view runs. It applies broadly across a project, so it is appropriate for cross-cutting concerns rather than student-specific business logic.

Common uses include sessions, authentication, security protections, request logging, timing, headers, and global request filtering.

### 3. Request and Response Flow

For a request, middleware runs from top to bottom in the order listed in `settings.py`. After the view returns, the response travels back through the middleware in reverse order.

<svg xmlns="http://www.w3.org/2000/svg" width="900" height="460" viewBox="0 0 900 460" role="img" aria-labelledby="middleware-title middleware-desc">
  <title id="middleware-title">Django middleware request and response flow</title>
  <desc id="middleware-desc">A request travels from the client through middleware one, middleware two, URL routing, and the view. The response returns through the same middleware in reverse order.</desc>
  <defs>
    <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#1565c0"/>
    </marker>
    <marker id="arrow-green" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#2e7d32"/>
    </marker>
  </defs>
  <rect width="900" height="460" rx="14" fill="#ffffff" stroke="#cfd8dc"/>
  <text x="450" y="32" text-anchor="middle" font-family="Arial, sans-serif" font-size="21" font-weight="bold" fill="#263238">Django request–response lifecycle</text>
  <text x="450" y="58" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#546e7a">The same middleware wraps the view like nested layers</text>

  <rect x="35" y="125" width="120" height="70" rx="10" fill="#fce4ec" stroke="#c2185b" stroke-width="2"/>
  <text x="95" y="154" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Client</text>
  <text x="95" y="176" text-anchor="middle" font-family="Arial, sans-serif" font-size="12">Browser / API</text>

  <rect x="205" y="105" width="145" height="110" rx="10" fill="#e3f2fd" stroke="#1565c0" stroke-width="2"/>
  <text x="277" y="137" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" font-weight="bold">Middleware 1</text>
  <text x="277" y="160" text-anchor="middle" font-family="Arial, sans-serif" font-size="12">Security / sessions</text>
  <text x="277" y="181" text-anchor="middle" font-family="Arial, sans-serif" font-size="12">before + after view</text>

  <rect x="400" y="105" width="145" height="110" rx="10" fill="#e8eaf6" stroke="#3949ab" stroke-width="2"/>
  <text x="472" y="137" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" font-weight="bold">Middleware 2</text>
  <text x="472" y="160" text-anchor="middle" font-family="Arial, sans-serif" font-size="12">Custom logging</text>
  <text x="472" y="181" text-anchor="middle" font-family="Arial, sans-serif" font-size="12">start timer / log result</text>

  <rect x="595" y="105" width="120" height="110" rx="10" fill="#fff3e0" stroke="#ef6c00" stroke-width="2"/>
  <text x="655" y="137" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" font-weight="bold">URLconf</text>
  <text x="655" y="160" text-anchor="middle" font-family="Arial, sans-serif" font-size="12">matches path</text>
  <text x="655" y="181" text-anchor="middle" font-family="Arial, sans-serif" font-size="12">selects view</text>

  <rect x="765" y="105" width="100" height="110" rx="10" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2"/>
  <text x="815" y="145" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold">View</text>
  <text x="815" y="168" text-anchor="middle" font-family="Arial, sans-serif" font-size="12">business</text>
  <text x="815" y="186" text-anchor="middle" font-family="Arial, sans-serif" font-size="12">logic</text>

  <path d="M155 145 H205" fill="none" stroke="#1565c0" stroke-width="3" marker-end="url(#arrow-blue)"/>
  <path d="M350 145 H400" fill="none" stroke="#1565c0" stroke-width="3" marker-end="url(#arrow-blue)"/>
  <path d="M545 145 H595" fill="none" stroke="#1565c0" stroke-width="3" marker-end="url(#arrow-blue)"/>
  <path d="M715 145 H765" fill="none" stroke="#1565c0" stroke-width="3" marker-end="url(#arrow-blue)"/>
  <text x="450" y="92" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#1565c0">REQUEST: top-to-bottom</text>

  <path d="M765 270 H715" fill="none" stroke="#2e7d32" stroke-width="3" marker-end="url(#arrow-green)"/>
  <path d="M595 270 H545" fill="none" stroke="#2e7d32" stroke-width="3" marker-end="url(#arrow-green)"/>
  <path d="M400 270 H350" fill="none" stroke="#2e7d32" stroke-width="3" marker-end="url(#arrow-green)"/>
  <path d="M205 270 H155" fill="none" stroke="#2e7d32" stroke-width="3" marker-end="url(#arrow-green)"/>
  <text x="450" y="310" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#2e7d32">RESPONSE: bottom-to-top</text>
  <rect x="205" y="335" width="510" height="72" rx="10" fill="#f1f8e9" stroke="#7cb342"/>
  <text x="460" y="362" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#33691e">Custom logging middleware after the view</text>
  <text x="460" y="385" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#33691e">Measures duration → logs status code → returns response</text>
</svg>

#### Reading the diagram

Suppose the client requests `GET /api/students/42/`:

1. The request enters the first middleware. Each middleware can inspect it or stop it early.
2. The request reaches the URLconf, which matches the path and selects `student_detail`.
3. The view performs its work and creates a response, such as JSON with status `200`.
4. The response travels backward through the middleware. The logging middleware records the status and elapsed time.
5. Django sends the final response to the client.

**Middleware order can change application behavior.** For example, authentication depends on session data being available first.

### 4. Middleware Contract

```python
class ExampleMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Before the view
        response = self.get_response(request)
        # After the view
        return response
```

`get_response` points to the next middleware or, for the last middleware, the view. A middleware must return an `HttpResponse`, usually the response received from `get_response`.

The logging example follows the diagram exactly:

| Code location | Lifecycle stage | What it does |
|---|---|---|
| Before `self.get_response(request)` | Request phase | Starts the timer and logs the method and path |
| `self.get_response(request)` | View/next layer | Passes control to the next middleware or view |
| After `self.get_response(request)` | Response phase | Reads the status code, calculates duration, and logs the result |
| `return response` | Response completion | Sends the unchanged response to the previous layer |

### 5. URL Routing

Django uses a URLconf, normally `urls.py`, to map a URL pattern to a view:

```python
path("api/health/", health_check, name="health-check")
```

The `name` makes a route easier to use in templates, redirects, tests, and other code.

#### Fixed and parameterized routes

```python
path("api/students/", student_list, name="student-list"),
path("api/students/<int:student_id>/", student_detail, name="student-detail"),
```

`<int:student_id>` validates that the URL segment is an integer and passes it to the view as a keyword argument. The view must therefore accept `student_id`.

### 6. Project URLs and App URLs

Let each app own its routes. The project includes the app URLconf under a prefix:

```python
# student_system/urls.py
path("api/students/", include("students.urls")),
```

This produces routes such as `/api/students/` and `/api/students/12/`, without making the project URL file unnecessarily large.

---

## Part B – Hands-On

### Task 1: Implement Request Logging Middleware

Create `students/middleware.py`:

```python
import logging
import time

logger = logging.getLogger(__name__)


class SimpleLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.perf_counter()
        logger.info("Request: %s %s", request.method, request.get_full_path())

        response = self.get_response(request)

        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "Response: %s in %.2f ms",
            response.status_code,
            duration_ms,
        )
        return response
```

`perf_counter()` measures elapsed time. Passing logging arguments separately allows the logging system to format messages efficiently.

### Task 2: Register the Middleware

Add the class near the top of `MIDDLEWARE` in `student_system/settings.py`:

```python
MIDDLEWARE = [
    "students.middleware.SimpleLoggingMiddleware",
    # Django's default middleware entries...
]
```

Do not remove Django’s default middleware. Start the server and request `/api/health/`; observe the messages in the server terminal.

### Task 3: Create App-Level Routes

Create `students/urls.py`:

```python
from django.urls import path

from . import views

urlpatterns = [
    path("", views.student_list, name="student-list"),
    path("<int:student_id>/", views.student_detail, name="student-detail"),
]
```

Add these views to `students/views.py`:

```python
from django.http import JsonResponse


def student_list(request):
    return JsonResponse({
        "students": [],
        "message": "Student list endpoint",
    })


def student_detail(request, student_id):
    return JsonResponse({
        "student_id": student_id,
        "message": "Student detail endpoint",
    })
```

Include the app routes in `student_system/urls.py`:

```python
from django.urls import include, path

urlpatterns = [
    path("api/students/", include("students.urls")),
]
```

Test `GET /api/students/` and `GET /api/students/42/`.

### Task 4: Diagnose Common Errors

| Error or symptom | Likely cause |
|---|---|
| `ModuleNotFoundError` | Incorrect import or app location |
| `404 Not Found` | Pattern, prefix, or trailing slash does not match |
| `TypeError` about `student_id` | Route parameter and view argument do not match |
| Middleware does not log | Incorrect dotted path or server not restarted |
| No log output | Logger configuration or level filters the message |

---

## Part C – PBL Activity

### Problem Scenario

The Student Management API needs consistent request timing and separate routes for listing students and viewing one student.

### Student Task

1. Add the logging middleware.
2. Create app-level list and detail routes.
3. Test both endpoints.
4. Intentionally introduce one routing error, predict the result, and fix it.

### Expected Learning

Students apply middleware and URL routing together, explain execution order, and use status codes and error messages to debug a Django application.

## Assessment Activity

### Assessment Method

Coding and debugging exercise.

| Criterion | Expected Evidence |
|---|---|
| Middleware | Logs method, path, status code, and elapsed time |
| Registration | Uses the correct dotted path |
| Routing | Fixed and parameterized routes return expected JSON |
| Debugging | Corrects one URL or parameter mismatch |
| CO Attainment | Explains how the implementation supports a backend API |

## Summary

- Middleware applies shared request and response behavior across a project.
- Request middleware runs in listed order; response processing returns in reverse order.
- `path()` maps URL patterns to views, and converters pass validated values to views.
- App-level URLconfs make larger Django projects easier to maintain.

### Next Lecture

**L28 – Integrating Third-Party APIs and Services.**
