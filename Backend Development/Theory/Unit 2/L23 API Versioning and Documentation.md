# Lecture 23

# API Versioning and Documentation: Swagger/OpenAPI, Postman

**Course Outcome:** CO3 – Implement API versioning strategies and create comprehensive API documentation.

---

## 1. Introduction

In L22, we learned how to validate requests and serialize responses for data integrity. Now, we will focus on two critical aspects of API development: **versioning** and **documentation**. As APIs evolve, changes can break existing clients. Versioning ensures backward compatibility, while documentation helps developers understand and use your API effectively.

**API versioning** is the practice of managing changes to APIs without breaking existing clients. **API documentation** provides developers with clear, interactive guides for using your API.

By the end of this lecture, you will have:

1. Understanding of API versioning strategies and when to use each.
2. Knowledge of OpenAPI/Swagger specification for API documentation.
3. Skills to implement versioned APIs using FastAPI.
4. Ability to create interactive documentation using Swagger UI and ReDoc.
5. Hands-on experience documenting APIs with Postman collections.

---

## 2. Why Versioning Matters

### 2.1 Breaking Changes

| Change Type | Example | Impact |
|-------------|---------|--------|
| **Endpoint removal** | DELETE `/students/{id}` | Clients crash |
| **Field rename** | `name` → `full_name` | Parsing errors |
| **Type change** | `id: int` → `id: string` | Type mismatches |
| **Behavior change** | Pagination default 10 → 20 | Unexpected results |

### 2.2 Non-breaking Changes

| Change Type | Example | Impact |
|-------------|---------|--------|
| **Adding fields** | New `phone` field | Backward compatible |
| **Adding endpoints** | New `/students/search` | No impact |
| **Adding optional params** | `?branch=CSE` | No impact |
| **Expanding enums** | Add `AI` to branches | May need update |

---

## 3. Versioning Strategies

### 3.1 URL Path Versioning (Recommended)

**Format:** `/api/v1/students`, `/api/v2/students`

**Pros:**
* Clear and explicit
* Easy to route and cache
* Easy to test in browser
* Most common approach

**Cons:**
* URL pollution
* Multiple versions to maintain

**Implementation:**

```python
from fastapi import FastAPI

app = FastAPI()

# V1 endpoints
@app.get("/api/v1/students")
def list_students_v1():
    return {"version": "v1", "students": [...]}

# V2 endpoints (new version with changes)
@app.get("/api/v2/students")
def list_students_v2():
    return {"version": "v2", "data": [...], "pagination": {...}}
```

### 3.2 Header Versioning

**Format:** `Accept-Version: v1` or `API-Version: 1`

**Pros:**
* Clean URLs
* Version info in request metadata

**Cons:**
* Harder to test in browser
* Not cacheable by default

**Implementation:**

```python
from fastapi import FastAPI, Header

app = FastAPI()

@app.get("/students")
def list_students(accept_version: str = Header(default="v1")):
    if accept_version == "v1":
        return {"version": "v1", "students": [...]}
    elif accept_version == "v2":
        return {"version": "v2", "data": [...]}
```

### 3.3 Query Parameter Versioning

**Format:** `/students?version=v1`

**Pros:**
* Easy to implement
* Easy to test

**Cons:**
* Not RESTful
* Cache issues

### 3.4 Comparison

| Strategy | URL | Testability | Caching | RESTful |
|----------|-----|-------------|---------|---------|
| URL path | `/api/v1/students` | Easy | Yes | Yes |
| Header | `Accept-Version: v1` | Medium | No | Yes |
| Query param | `/students?v=1` | Easy | No | No |

**Recommendation:** Use URL path versioning for public APIs.

---

## 4. Implementing Versioned APIs

### 4.1 Router-based Versioning

```python
from fastapi import FastAPI, APIRouter

app = FastAPI()

# V1 Router
v1_router = APIRouter(prefix="/api/v1")

@v1_router.get("/students")
def list_students_v1():
    return {
        "version": "v1",
        "students": [
            {"id": 1, "name": "Aarav", "branch": "CSE"}
        ]
    }

@v1_router.get("/students/{student_id}")
def get_student_v1(student_id: int):
    return {"version": "v1", "student": {"id": student_id, "name": "Aarav"}}

# V2 Router (improved response format)
v2_router = APIRouter(prefix="/api/v2")

@v2_router.get("/students")
def list_students_v2(page: int = 1, limit: int = 10):
    return {
        "version": "v2",
        "data": [
            {"id": 1, "name": "Aarav", "branch": "CSE", "enrollment_date": "2024-08-01"}
        ],
        "pagination": {
            "page": page,
            "limit": limit,
            "total": 100,
            "total_pages": 10
        }
    }

@v2_router.get("/students/{student_id}")
def get_student_v2(student_id: int):
    return {
        "version": "v2",
        "data": {
            "id": student_id,
            "name": "Aarav",
            "branch": "CSE",
            "enrollment_date": "2024-08-01",
            "department": {"id": 1, "name": "CSE"}
        }
    }

# Include routers
app.include_router(v1_router)
app.include_router(v2_router)
```

### 4.2 Deprecation Headers

```python
from fastapi import Response

@app.get("/api/v1/students", deprecated=True)
def list_students_v1(response: Response):
    response.headers["Deprecation"] = "true"
    response.headers["Sunset"] = "Sat, 01 Jan 2025 00:00:00 GMT"
    response.headers["Link"] = '/api/v2/students; rel="successor-version"'
    return {"version": "v1", "students": [...]}
```

---

## 5. OpenAPI/Swagger Specification

**OpenAPI** (formerly Swagger) is a standard for describing REST APIs. It provides a machine-readable format for API documentation.

### 5.1 FastAPI Automatic Documentation

FastAPI automatically generates OpenAPI documentation:

* **Swagger UI:** `http://localhost:8000/docs`
* **ReDoc:** `http://localhost:8000/redoc`
* **OpenAPI JSON:** `http://localhost:8000/openapi.json`

### 5.2 Customizing Documentation

```python
app = FastAPI(
    title="Student Management API",
    description="""
    ## Student Management API
    
    A comprehensive API for managing students, courses, and enrollments.
    
    ### Features
    * Student CRUD operations
    * Course management
    * Enrollment tracking
    * Authentication and authorization
    
    ### Authentication
    All protected endpoints require a JWT token.
    Get a token by calling `/api/v1/login`.
    """,
    version="2.0.0",
    contact={
        "name": "API Support",
        "email": "support@upes.ac.in"
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT"
    },
    openapi_tags=[
        {
            "name": "Students",
            "description": "Operations with students"
        },
        {
            "name": "Courses",
            "description": "Manage courses"
        },
        {
            "name": "Authentication",
            "description": "Login and registration"
        }
    ]
)
```

### 5.3 Adding Examples to Documentation

```python
from pydantic import Field

class StudentCreate(BaseModel):
    name: str = Field(
        ...,
        examples=["Aarav Kumar"],
        description="Student's full name"
    )
    email: EmailStr = Field(
        ...,
        examples=["aarav@upes.ac.in"],
        description="University email address"
    )
    branch: BranchEnum = Field(
        ...,
        examples=["CSE"],
        description="Branch abbreviation"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Aarav Kumar",
                "email": "aarav@upes.ac.in",
                "branch": "CSE",
                "enrollment_date": "2024-08-01"
            }
        }

@app.post(
    "/api/v1/students",
    response_model=StudentResponse,
    status_code=201,
    summary="Create a new student",
    description="Create a new student record with the provided information.",
    response_description="The created student object",
    tags=["Students"]
)
def create_student(student: StudentCreate):
    """Create a new student with the following information:
    
    - **name**: Student's full name (required)
    - **email**: University email address (required, unique)
    - **branch**: Branch abbreviation (CSE, ECE, IT, ME, CE)
    - **enrollment_date**: Date of enrollment (optional)
    """
    pass
```

---

## 6. Postman Collections

### 6.1 Exporting from FastAPI

1. Open Swagger UI at `http://localhost:8000/docs`
2. Click "Authorize" to add JWT token
3. Click "Download" → "OpenAPI 3.0.0"
4. Import into Postman:
   * File → Import → Upload Files
   * Select the downloaded JSON file
   * Postman creates a collection with all endpoints

### 6.2 Creating Postman Collection

**Manual Collection Structure:**

```
Student Management API
├── Authentication
│   ├── Register Student
│   └── Login
├── Students
│   ├── List Students
│   ├── Get Student
│   ├── Create Student
│   ├── Update Student
│   └── Delete Student
├── Courses
│   ├── List Courses
│   └── Create Course
└── Enrollments
    ├── List Student Enrollments
    └── Enroll in Course
```

### 6.3 Environment Variables

Create environments for different deployment stages:

**Development:**

```json
{
    "base_url": "http://localhost:8000",
    "api_version": "v1",
    "auth_token": ""
}
```

**Production:**

```json
{
    "base_url": "https://api.example.com",
    "api_version": "v1",
    "auth_token": ""
}
```

### 6.4 Pre-request Scripts

```javascript
// Auto-login and set token
pm.test("Auto-login", function () {
    const loginRequest = {
        url: pm.environment.get("base_url") + "/api/v1/login",
        method: "POST",
        header: { "Content-Type": "application/json" },
        body: {
            mode: "raw",
            raw: JSON.stringify({
                email: "admin@upes.ac.in",
                password: "admin123"
            })
        }
    };

    pm.sendRequest(loginRequest, function (err, response) {
        pm.environment.set("auth_token", response.json().access_token);
    });
});
```

---

## 7. API Documentation Best Practices

| Practice | Description |
|----------|-------------|
| **Auto-generate** | Use FastAPI's built-in documentation |
| **Add examples** | Include request/response examples |
| **Document errors** | List all possible error responses |
| **Version docs** | Maintain separate docs for each API version |
| **Interactive testing** | Use Swagger UI for live testing |
| **Postman collections** | Export collections for team sharing |
| **Changelog** | Document changes between versions |
| **Status codes** | Document all HTTP status codes returned |

---

## 8. Summary

* **API versioning** ensures backward compatibility when making breaking changes.
* **URL path versioning** (`/api/v1/students`) is the most common and recommended approach.
* **OpenAPI/Swagger** provides machine-readable API documentation.
* **FastAPI** automatically generates interactive documentation (Swagger UI, ReDoc).
* **Postman collections** enable team collaboration and automated testing.

### Key Takeaways

* Use URL path versioning for public APIs (`/api/v1/`, `/api/v2/`).
* Always deprecate old versions gracefully with headers and timelines.
* FastAPI auto-generates OpenAPI documentation at `/docs` and `/redoc`.
* Add examples and descriptions to improve documentation quality.
* Export Postman collections for team collaboration and testing.

In **L24 – Assignment-I Discussion and Solution Review**, you will review and discuss solutions for the first assignment.

---

### Lab Exercise

1. Implement versioned endpoints for the Student Management API:
   - `/api/v1/students` (basic response)
   - `/api/v2/students` (enhanced response with pagination)
2. Add deprecation headers to v1 endpoints.
3. Customize the Swagger UI documentation with:
   - API title and description
   - Contact information
   - Tags for endpoint grouping
   - Request/response examples
4. Export your API as a Postman collection.
5. Create Postman environments for development and production.
6. Test your API documentation by:
   - Opening Swagger UI and testing endpoints
   - Using ReDoc for readable documentation
   - Importing the Postman collection and running requests