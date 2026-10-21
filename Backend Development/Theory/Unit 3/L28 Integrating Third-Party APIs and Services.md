# Lecture 28

# Integrating Third-Party APIs and Services

**Course Outcome:** CO3 – Utilize frameworks and APIs to build backend applications.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 28 |
| Unit | Unit 3: Frameworks and Performance Optimization |
| Topic | Integrating Third-Party APIs and Services |
| Course Outcome | CO3 – Utilize frameworks and APIs to build backend applications |
| Bloom's Knowledge Level | Apply and Analyze |
| Skills Developed | HTTP client usage, service-layer design, JSON handling, timeout and exception handling, API testing with mocks |
| Applications | Payment gateways, social login, weather and mapping services, notifications, and data-provider integrations |
| PBL Activity | Add an external data service to the Student Management API |
| Assessment Method | Coding, error-handling, and mocked testing exercise |

---

## Part A – Theory

### 1. Learning Objectives

By the end of this lecture, students will be able to:

1. Explain why backend applications consume third-party APIs.
2. Make an HTTP request from Django using the `requests` library.
3. Separate external-service code from view code.
4. Handle timeouts, HTTP errors, and network failures safely.
5. Test an integration without making a real internet request.

### 2. Why Integrate External APIs?

Modern applications rarely operate in isolation. They use specialized services for payments, maps, email, SMS, authentication, weather, analytics, and many other capabilities. Integration lets an application reuse an external service instead of implementing and maintaining the same capability itself.

Examples include:

- Stripe or PayPal for payments;
- Google or GitHub OAuth for authentication;
- weather, maps, or stock-data providers;
- email, SMS, and notification services;
- institutional or government data services.

An external API is a dependency: it may be slow, unavailable, rate-limited, changed, or require authentication. A reliable application must handle these conditions explicitly.

### 3. Integration Request Flow

The browser does not need to call the external service directly. Django can call it on the server, validate the result, and return only the data needed by the application.

<svg xmlns="http://www.w3.org/2000/svg" width="920" height="510" viewBox="0 0 920 510" role="img" aria-labelledby="api-title api-desc">
  <title id="api-title">Django third-party API integration flow</title>
  <desc id="api-desc">A client calls a Django endpoint. The Django view calls a service utility, which sends an HTTP request to a third-party API. The result returns through the utility and view to the client. Timeout and error handling protect the application.</desc>
  <defs>
    <marker id="request-arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#1565c0"/></marker>
    <marker id="response-arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#2e7d32"/></marker>
    <marker id="error-arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#c62828"/></marker>
  </defs>
  <rect width="920" height="510" rx="14" fill="#fff" stroke="#cfd8dc"/>
  <text x="460" y="31" text-anchor="middle" font-family="Arial, sans-serif" font-size="21" font-weight="bold" fill="#263238">Django third-party API integration</text>
  <text x="460" y="56" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#546e7a">The service layer isolates external communication from the view</text>

  <rect x="35" y="125" width="135" height="80" rx="10" fill="#fce4ec" stroke="#c2185b" stroke-width="2"/>
  <text x="102" y="158" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Client</text>
  <text x="102" y="181" text-anchor="middle" font-family="Arial, sans-serif" font-size="12">GET /api/external/1/</text>

  <rect x="225" y="105" width="150" height="120" rx="10" fill="#e3f2fd" stroke="#1565c0" stroke-width="2"/>
  <text x="300" y="140" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Django View</text>
  <text x="300" y="164" text-anchor="middle" font-family="Arial, sans-serif" font-size="12">validates input</text>
  <text x="300" y="183" text-anchor="middle" font-family="Arial, sans-serif" font-size="12">builds response</text>

  <rect x="430" y="105" width="165" height="120" rx="10" fill="#e8eaf6" stroke="#3949ab" stroke-width="2"/>
  <text x="512" y="140" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Service Utility</text>
  <text x="512" y="164" text-anchor="middle" font-family="Arial, sans-serif" font-size="12">requests.get(...)</text>
  <text x="512" y="183" text-anchor="middle" font-family="Arial, sans-serif" font-size="12">timeout + error handling</text>

  <rect x="650" y="105" width="220" height="120" rx="10" fill="#fff3e0" stroke="#ef6c00" stroke-width="2"/>
  <text x="760" y="140" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Third-Party API</text>
  <text x="760" y="164" text-anchor="middle" font-family="Arial, sans-serif" font-size="12">JSON response or failure</text>
  <text x="760" y="183" text-anchor="middle" font-family="Arial, sans-serif" font-size="12">external network boundary</text>

  <path d="M170 145 H225" fill="none" stroke="#1565c0" stroke-width="3" marker-end="url(#request-arrow)"/>
  <path d="M375 145 H430" fill="none" stroke="#1565c0" stroke-width="3" marker-end="url(#request-arrow)"/>
  <path d="M595 145 H650" fill="none" stroke="#1565c0" stroke-width="3" marker-end="url(#request-arrow)"/>
  <text x="460" y="91" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#1565c0">OUTBOUND REQUEST</text>

  <path d="M650 285 H595" fill="none" stroke="#2e7d32" stroke-width="3" marker-end="url(#response-arrow)"/>
  <path d="M430 285 H375" fill="none" stroke="#2e7d32" stroke-width="3" marker-end="url(#response-arrow)"/>
  <path d="M225 285 H170" fill="none" stroke="#2e7d32" stroke-width="3" marker-end="url(#response-arrow)"/>
  <text x="460" y="325" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#2e7d32">NORMALIZED RESPONSE TO CLIENT</text>

  <rect x="115" y="365" width="690" height="90" rx="10" fill="#ffebee" stroke="#c62828" stroke-width="2"/>
  <text x="460" y="395" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#b71c1c">Failure protection at the service boundary</text>
  <text x="460" y="419" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#b71c1c">Timeout → ConnectionError → HTTP error → safe application response</text>
  <text x="460" y="439" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#b71c1c">Never allow an unreliable external service to hang the Django request indefinitely</text>
</svg>

#### Reading the diagram

For `GET /api/external/1/`:

1. Django’s view receives the client request.
2. The view calls a small service utility instead of containing HTTP-client code itself.
3. The utility sends a request to the external API with a timeout.
4. The external JSON is checked and returned to the view.
5. The view sends a controlled JSON response to the client.
6. If the service times out or fails, the utility returns a safe error result and the view returns an appropriate status code.

### 4. The `requests` Library

The `requests` library provides a readable Python interface for HTTP calls:

- `requests.get()` and `requests.post()` send HTTP requests;
- `response.json()` decodes a JSON response into Python data;
- `response.raise_for_status()` raises an exception for HTTP 4xx or 5xx responses;
- `timeout` prevents a request from waiting forever;
- exceptions such as `Timeout` and `RequestException` represent network failures.

Keep third-party calls in a service or utility module. This makes views easier to read and allows the service to be tested independently.

---

## Part B – Hands-On

### Task 1: Install the HTTP Client

```bash
python -m pip install requests
```

### Task 2: Create a Service Utility

Create `students/utils.py`:

```python
import requests


EXTERNAL_API_URL = "https://jsonplaceholder.typicode.com/posts/{post_id}"


def get_external_data(post_id):
    url = EXTERNAL_API_URL.format(post_id=post_id)

    try:
        response = requests.get(url, timeout=2)
        response.raise_for_status()
        return {"data": response.json(), "error": None}
    except requests.Timeout:
        return {"data": None, "error": "External service timed out"}
    except requests.RequestException:
        return {"data": None, "error": "External service is unavailable"}
    except ValueError:
        return {"data": None, "error": "External service returned invalid JSON"}
```

The `timeout=2` value means the application will not wait longer than two seconds for the external service. In a production project, the URL and timeout should normally come from configuration rather than being hard-coded.

### Task 3: Use the Service in a View

In `students/views.py`:

```python
from django.http import JsonResponse

from .utils import get_external_data


def external_data_view(request, post_id):
    result = get_external_data(post_id)

    if result["error"]:
        return JsonResponse(
            {"error": result["error"]},
            status=503,
        )

    return JsonResponse(result["data"])
```

### Task 4: Add the Route

In `students/urls.py`:

```python
path(
    "external/<int:post_id>/",
    views.external_data_view,
    name="external-data",
),
```

Test `GET /api/students/external/1/` and observe the returned JSON.

### Task 5: Test Without the Internet

Use `unittest.mock` to replace `requests.get` during a test:

```python
from unittest.mock import Mock, patch

from django.test import SimpleTestCase

from .utils import get_external_data


class ExternalDataTests(SimpleTestCase):
    @patch("students.utils.requests.get")
    def test_external_data_success(self, mock_get):
        mock_response = Mock()
        mock_response.json.return_value = {"id": 1, "title": "Example"}
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response

        result = get_external_data(1)

        self.assertEqual(result["data"]["id"], 1)
        mock_get.assert_called_once_with(
            "https://jsonplaceholder.typicode.com/posts/1",
            timeout=2,
        )
```

Mocking makes tests fast, repeatable, and independent of the external service’s availability.

---

## Part C – PBL Activity

### Problem Scenario

The Student Management API must display information from an external service, but that service is sometimes slow or unavailable.

### Student Task

1. Implement the service utility and view.
2. Set a two-second timeout.
3. Return HTTP `503 Service Unavailable` when the dependency cannot be reached.
4. Add a mocked test for a successful response and a timeout case.

### Expected Learning

Students demonstrate API consumption, separation of concerns, defensive error handling, and testing without a live network dependency.

## Assessment Activity

### Assessment Method

Coding and mocked testing exercise.

| Criterion | Expected Evidence |
|---|---|
| Integration | Correctly calls the external endpoint and decodes JSON |
| Reliability | Uses a timeout and handles network/HTTP failures |
| API design | Keeps external communication in a utility/service module |
| Testing | Uses `unittest.mock` instead of calling the real internet |
| CO Attainment | Explains how the integration extends the backend application |

## Summary

- Third-party APIs extend an application’s capabilities without reimplementing specialized services.
- Keep external HTTP calls in a service or utility layer.
- Always use timeouts and handle HTTP, network, and invalid-data failures.
- Mock external calls in tests so that tests remain fast and reliable.

### Next Lecture

**L29 – Testing and Debugging Django Applications.**
