# Lecture 29

# Testing and Debugging Django Applications

**Course Outcome:** CO4 - Apply security best practices and conduct testing.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 29 |
| Unit | Unit 3: Frameworks and Performance Optimization |
| Topic | Testing and Debugging Django Applications |
| Course Outcome | CO4 - Apply security best practices and conduct testing |
| Bloom's Knowledge Level | Analyze |
| Skills Developed | Writing unit and integration tests, using the Django test client, isolating database tests, interpreting failures, and using logging |
| Applications | Regression prevention, production stability, API quality, and systematic defect diagnosis |
| PBL Activity | Build tests for the Student API and diagnose an intentionally introduced defect |
| Assessment Method | Coding exercise and debugging task |

---

## Part A - Theory

### 1. Learning Objectives

By the end of this lecture, students will be able to:

1. Explain why automated tests are important in backend development.
2. Distinguish unit, integration, and endpoint tests.
3. Write Django tests for JSON API responses and database behavior.
4. Run tests and interpret assertion failures.
5. Use logging and debugging tools to locate the cause of a defect.

### 2. Why Test Django Applications?

Testing checks that code behaves as expected and protects existing behavior when new features are added. A test is an executable statement of an expected behavior, such as “a valid health endpoint returns HTTP 200” or “requesting an unknown student returns HTTP 404.”

Tests help developers:

- detect regressions after changes;
- verify success and failure cases;
- document expected behavior;
- refactor with confidence;
- diagnose defects before deployment.

### 3. Types of Tests

| Test type | What it checks | Example |
|---|---|---|
| Unit test | A small function or class in isolation | A service utility handles a timeout |
| Integration test | Several components working together | A view calls a mocked external service |
| Endpoint test | The application’s HTTP behavior | `GET /api/health/` returns JSON and HTTP 200 |
| Model test | Model validation and database behavior | A `Student` record is saved correctly |

Django’s `TestCase` creates a separate temporary test database. Tests can create and change records without modifying the development database.

> **Beginner note:** A test is not normally run by opening a browser and clicking buttons. Django creates a test client that behaves like a small browser. It can send `GET`, `POST`, `PUT`, and `DELETE` requests to your views and lets you inspect the response.

> **Important distinction:** `TestCase` is used when a test needs Django’s database. `SimpleTestCase` is used when the test does not need database access, such as testing a utility function or a mocked external service. Choosing the simpler class makes the purpose of the test clearer.

### 4. Testing and Debugging Workflow

<svg xmlns="http://www.w3.org/2000/svg" width="920" height="550" viewBox="0 0 920 550" role="img" aria-labelledby="test-title test-desc">
  <title id="test-title">Django testing and debugging workflow</title>
  <desc id="test-desc">A test runner executes a test client request against Django. The URLconf selects a view, which may use a test database. Assertions compare the actual response with expected behavior. A failure leads to logs and diagnosis, followed by a code fix and another test run.</desc>
  <defs>
    <marker id="blue-arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#1565c0"/></marker>
    <marker id="green-arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#2e7d32"/></marker>
    <marker id="red-arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#c62828"/></marker>
  </defs>
  <rect width="920" height="550" rx="14" fill="#fff" stroke="#cfd8dc"/>
  <text x="460" y="32" text-anchor="middle" font-family="Arial, sans-serif" font-size="21" font-weight="bold" fill="#263238">Django testing and debugging workflow</text>
  <text x="460" y="57" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#546e7a">A failing test is evidence that helps locate a defect</text>

  <rect x="35" y="105" width="155" height="80" rx="10" fill="#e3f2fd" stroke="#1565c0" stroke-width="2"/>
  <text x="112" y="138" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Test Runner</text>
  <text x="112" y="162" text-anchor="middle" font-family="Arial, sans-serif" font-size="12">manage.py test</text>

  <rect x="245" y="105" width="155" height="80" rx="10" fill="#e8eaf6" stroke="#3949ab" stroke-width="2"/>
  <text x="322" y="138" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Test Client</text>
  <text x="322" y="162" text-anchor="middle" font-family="Arial, sans-serif" font-size="12">GET / POST / PUT</text>

  <rect x="455" y="105" width="155" height="80" rx="10" fill="#fff3e0" stroke="#ef6c00" stroke-width="2"/>
  <text x="532" y="138" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Django App</text>
  <text x="532" y="162" text-anchor="middle" font-family="Arial, sans-serif" font-size="12">URLconf → View</text>

  <rect x="665" y="105" width="220" height="80" rx="10" fill="#f3e5f5" stroke="#8e24aa" stroke-width="2"/>
  <text x="775" y="138" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Temporary Test DB</text>
  <text x="775" y="162" text-anchor="middle" font-family="Arial, sans-serif" font-size="12">isolated test data</text>

  <path d="M190 145 H245" fill="none" stroke="#1565c0" stroke-width="3" marker-end="url(#blue-arrow)"/>
  <path d="M400 145 H455" fill="none" stroke="#1565c0" stroke-width="3" marker-end="url(#blue-arrow)"/>
  <path d="M610 145 H665" fill="none" stroke="#1565c0" stroke-width="3" marker-end="url(#blue-arrow)"/>
  <text x="460" y="91" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#1565c0">TEST EXECUTION</text>

  <rect x="310" y="250" width="300" height="75" rx="10" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2"/>
  <text x="460" y="281" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#1b5e20">Assertions</text>
  <text x="460" y="304" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#1b5e20">status, JSON, database state</text>
  <path d="M775 185 V225 H610 V250" fill="none" stroke="#2e7d32" stroke-width="3" marker-end="url(#green-arrow)"/>
  <path d="M532 185 V250" fill="none" stroke="#2e7d32" stroke-width="3" marker-end="url(#green-arrow)"/>

  <rect x="70" y="390" width="230" height="75" rx="10" fill="#ffebee" stroke="#c62828" stroke-width="2"/>
  <text x="185" y="421" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#b71c1c">Test Failure</text>
  <text x="185" y="444" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#b71c1c">expected ≠ actual</text>

  <rect x="345" y="390" width="230" height="75" rx="10" fill="#fff8e1" stroke="#f9a825" stroke-width="2"/>
  <text x="460" y="421" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#795548">Diagnose</text>
  <text x="460" y="444" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#795548">traceback + logs + debugger</text>

  <rect x="620" y="390" width="230" height="75" rx="10" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2"/>
  <text x="735" y="421" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#1b5e20">Fix and Re-run</text>
  <text x="735" y="444" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#1b5e20">test the behavior again</text>

  <path d="M310 288 C250 300 185 345 185 390" fill="none" stroke="#c62828" stroke-width="3" marker-end="url(#red-arrow)"/>
  <path d="M300 428 H345" fill="none" stroke="#f9a825" stroke-width="3" marker-end="url(#red-arrow)"/>
  <path d="M575 428 H620" fill="none" stroke="#2e7d32" stroke-width="3" marker-end="url(#green-arrow)"/>
  <path d="M735 390 C735 350 112 350 112 185" fill="none" stroke="#2e7d32" stroke-width="3" stroke-dasharray="8 6" marker-end="url(#green-arrow)"/>
  <text x="462" y="513" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#546e7a">Repeat until the expected behavior is verified</text>
</svg>

#### Reading the diagram

1. The test runner discovers and executes the test.
2. Django’s test client sends a request without requiring a browser or live server.
3. The URLconf and view process the request; database tests use an isolated temporary database.
4. Assertions compare actual behavior with the expected behavior.
5. If a test fails, use the failure message, traceback, logs, or debugger to identify the cause, fix it, and run the test again.

### 5. Debugging Techniques

#### Read the failure first

A failure usually reports the test name, source line, expected value, actual value, and traceback. Start at the assertion and trace backward to the first application line that produced the wrong value.

#### Use logging

```python
import logging

logger = logging.getLogger(__name__)


def student_detail(request, student_id):
    logger.info("Looking up student_id=%s", student_id)
    # application logic...
```

The line `logging.getLogger(__name__)` creates a logger named after the current Python module. `logger.info()` writes a normal informational message; it does not stop the program. During debugging, `logger.debug()` can provide more detail, while `logger.error()` and `logger.exception()` are appropriate for failures.

> **Beginner note:** `print()` may appear in the terminal during development, but logging is preferred because messages can later be filtered, formatted, and sent to a file or monitoring system. A log message helps you observe what the program received and what decision it made.

Do not log passwords, tokens, session cookies, or sensitive personal data. In production, use appropriate log levels and a central log destination.

#### Django Debug Toolbar

The Django Debug Toolbar can display SQL queries, request timing, templates, cache activity, and headers during local development. It is useful for investigation but should not be enabled for public production traffic.

To install it in a development environment:

```bash
python -m pip install django-debug-toolbar
```

Add `debug_toolbar` to `INSTALLED_APPS`, add its URLs to the project URL configuration, and configure its middleware according to the version of Django being used. Keep `DEBUG = True` and restrict the toolbar to trusted local users. Never expose debugging information publicly because it may reveal settings, SQL queries, file paths, or request data.

---

## Part B - Hands-On

### Task 1: Test the Health Endpoint

Create the file `students/tests.py` inside the Django app. Django automatically discovers test files whose names begin with `test` or the conventional `tests.py` file. The `students` part below must be replaced with the actual name of your app.

In `students/tests.py`:

```python
from django.test import TestCase
from django.urls import reverse


class StudentAPITest(TestCase):
    def test_health_endpoint(self):
        # self.client sends a request to Django without starting a real server.
        # reverse() finds the URL from its name, so this test still works if
        # the path changes from /health/ to another path later.
        response = self.client.get(reverse("health-check"))

        # status_code is the HTTP result, such as 200, 404, or 500.
        self.assertEqual(response.status_code, 200)
        # response.json() converts a JSON response into a Python dictionary.
        self.assertEqual(response.json()["status"], "ok")
```

This uses the route name already created in Lecture 26. Using `reverse()` avoids hard-coding the URL path in the test.

For this test to work, the URL must have the matching name:

```python
path("health/", views.health_check, name="health-check")
```

The string passed to `reverse()` is the `name`, not the path and not the view function name. If Django raises `NoReverseMatch`, check the spelling of the name, the URL namespace, and any required parameters.

### Task 2: Test a Parameterized Endpoint

```python
class StudentRouteTest(TestCase):
    def test_student_detail_returns_id(self):
        # kwargs supplies the value for <student_id> in the URL pattern.
        response = self.client.get(
            reverse("student-detail", kwargs={"student_id": 42})
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["student_id"], 42)
```

The matching URL pattern could be:

```python
path(
    "students/<int:student_id>/",
    views.student_detail,
    name="student-detail",
)
```

Here, `<int:student_id>` means Django converts the value in the URL to an integer before passing it to the view. The dictionary key in `kwargs` must have exactly the same name: `student_id`.

> **Common mistake:** `reverse("student-detail")` is incomplete for a parameterized URL. Django cannot build the URL unless you provide `student_id` through `kwargs` or `args`.

### Task 3: Run the Tests

```bash
python manage.py test
```

Run one test class or method while debugging:

```bash
python manage.py test students.tests.StudentAPITest
python manage.py test students.tests.StudentAPITest.test_health_endpoint
```

Run these commands from the folder that contains `manage.py`. A successful result such as `OK` means the assertions passed; it does not necessarily mean that every possible behavior has been tested. A failure means that the actual result differed from the expected result, or that the application raised an exception.

Useful options include:

```bash
# Show more detail about each test
python manage.py test -v 2

# Stop after the first failure
python manage.py test --failfast
```

> **Reading a failure:** Start with the final exception message, then locate the test assertion that failed. Compare the expected value with the actual value. For example, `200 != 404` tells you that the view returned a different HTTP status from the one the test expected.

### Task 4: Test a Service with a Mock

The external API test from Lecture 28 should mock the network. This keeps the test deterministic:

```python
from unittest.mock import patch

from django.test import SimpleTestCase
import requests

from .utils import get_external_data


class ExternalServiceTest(SimpleTestCase):
    @patch("students.utils.requests.get")
    def test_timeout_returns_safe_error(self, mock_get):
        # Replace requests.get with a fake object for this test only.
        # No real internet request is made.
        mock_get.side_effect = requests.Timeout

        result = get_external_data(1)

        self.assertIsNone(result["data"])
        self.assertEqual(result["error"], "External service timed out")
```

Add `import requests` to the test file when using `requests.Timeout`. This test exposes a common mistake: forgetting to handle a dependency failure.

The patch target must be the location where the code looks up the dependency. If `utils.py` contains `requests.get(...)`, patch `students.utils.requests.get`; patching a different import path may leave the real network call active. A mock makes the test fast and repeatable because the test controls the dependency’s behavior.

You should normally test at least two outcomes for an external service:

```python
@patch("students.utils.requests.get")
def test_success_returns_data(self, mock_get):
    mock_get.return_value.json.return_value = {"name": "Aarav"}
    mock_get.return_value.raise_for_status.return_value = None

    result = get_external_data(1)

    self.assertEqual(result["data"]["name"], "Aarav")
    self.assertIsNone(result["error"])
```

The first test checks the success path; the original timeout test checks an error path. Testing both is important because error-handling code is often missed.

### Task 5: Introduce and Diagnose a Defect

Temporarily change the health view to return status `201` instead of `200`. Run the test, read the assertion failure, identify the incorrect status, restore `200`, and run the test again.

This demonstrates a useful debugging cycle:

1. Write down the expected behavior.
2. Reproduce the problem with a test.
3. Read the failure and traceback from the bottom upward.
4. Inspect the first application line related to the failure.
5. Fix the code and run the focused test again.
6. Run the complete test suite to check for regressions.

> **Do not weaken the test just to make it pass.** If the requirement is that the endpoint returns `200`, change the view or configuration that produced `201`. A test should describe the required behavior, not hide a defect.

---

## Part C - PBL Activity

### Problem Scenario

A new feature was added to the Student Management API, but an existing endpoint may have been broken during the change.

### Student Task

1. Write tests for health, list, and detail endpoints.
2. Add model tests if a `Student` model is available.
3. Mock the external service and test both success and timeout cases.
4. Diagnose one intentionally introduced defect using the test output and logs.

Before writing tests, inspect the existing URL patterns, view functions, and model fields. Tests must match the application’s real route names and response format. If an endpoint returns a list, test the list length and important fields; if it returns an error, test both the status code and the error message.

For database tests, create records inside the test rather than depending on data that happens to exist in your development database:

```python
student = Student.objects.create(
    name="Aarav",
    email="aarav@example.com",
)
response = self.client.get(
    reverse("student-detail", kwargs={"student_id": student.id})
)

self.assertEqual(response.status_code, 200)
self.assertEqual(response.json()["name"], "Aarav")
```

The test database is recreated and cleaned by Django. This keeps tests independent: one test should not rely on another test running first or on records manually inserted into the development database.

### Expected Learning

Students demonstrate regression testing, API behavior verification, isolated database use, mock-based dependency testing, and systematic debugging.

## Assessment Activity

### Assessment Method

Coding exercise and debugging task.

| Criterion | Expected Evidence |
|---|---|
| Test coverage | Health, list, detail, and relevant failure paths are tested |
| Test quality | Uses named URLs, meaningful assertions, and isolated test data |
| Debugging | Interprets the traceback and identifies the faulty code |
| Dependency testing | Mocks external API calls rather than using the internet |
| CO Attainment | Explains how testing supports reliable and secure backend development |

## Summary

- Automated tests protect behavior against regressions.
- Django’s `TestCase` supports endpoint and database tests with an isolated test database.
- `reverse()` keeps tests independent of hard-coded URL paths.
- Logs, tracebacks, and debugging tools provide evidence for diagnosing failures.
- External services should be mocked in tests.

### Next Lecture

**L30 - Security, Authentication, and Authorization in Django.**
