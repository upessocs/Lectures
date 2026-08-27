# Lecture 18

# Designing RESTful APIs: Endpoint Planning and Resource Modeling

**Course Outcome:** CO3 – Design well-structured RESTful APIs with proper endpoint planning and resource modeling.

---

## 1. Introduction

In L17, we learned how to optimize database queries for better performance. Now, we will shift focus to designing the APIs that expose our data to clients. A well-designed API is intuitive, consistent, and easy to use — it should feel natural to developers without needing extensive documentation.

**API design** is the process of planning endpoints, defining resources, specifying request/response formats, and establishing conventions that make your API predictable and developer-friendly.

By the end of this lecture, you will have:

1. Understanding of resource-oriented API design principles.
2. Knowledge of endpoint naming conventions and HTTP method usage.
3. Skills to design API schemas for requests and responses.
4. Ability to plan API versioning and documentation.
5. Hands-on experience designing a complete API for a real-world application.

---

## 2. Resource-Oriented Design

REST APIs are built around **resources** — any entity that can be named and addressed. Instead of thinking in terms of operations (getStudent, createStudent), think in terms of resources (Student, Course, Enrollment).

### 2.1 Identifying Resources

For a **Student Management System**, the resources are:

| Resource | Description | URI Example |
|----------|-------------|-------------|
| Student | Individual student | `/students/1` |
| Students | Collection of students | `/students` |
| Course | Individual course | `/courses/CS301` |
| Courses | Collection of courses | `/courses` |
| Enrollment | Student-course relationship | `/students/1/enrollments` |
| Department | Academic department | `/departments/1` |
| Faculty | Teaching staff | `/faculty/1` |

### 2.2 Resource Relationships

<svg xmlns="http://www.w3.org/2000/svg" width="900" height="300" viewBox="0 0 900 300">
<rect width="900" height="300" fill="white"/>
<text x="450" y="30" text-anchor="middle" font-size="18" font-weight="bold">API Resource Relationships</text>

<!-- Department -->
<rect x="40" y="80" width="150" height="80" rx="8" fill="#EAF4FF" stroke="#1E88E5"/>
<text x="115" y="110" text-anchor="middle" font-size="14" font-weight="bold">Department</text>
<text x="115" y="135" text-anchor="middle" font-size="11">/departments/{id}</text>

<!-- Student -->
<rect x="250" y="80" width="150" height="80" rx="8" fill="#E8F8EC" stroke="#43A047"/>
<text x="325" y="110" text-anchor="middle" font-size="14" font-weight="bold">Student</text>
<text x="325" y="135" text-anchor="middle" font-size="11">/students/{id}</text>

<!-- Course -->
<rect x="460" y="80" width="150" height="80" rx="8" fill="#FFF8E6" stroke="#FB8C00"/>
<text x="535" y="110" text-anchor="middle" font-size="14" font-weight="bold">Course</text>
<text x="535" y="135" text-anchor="middle" font-size="11">/courses/{id}</text>

<!-- Faculty -->
<rect x="670" y="80" width="150" height="80" rx="8" fill="#F3E5F5" stroke="#8E24AA"/>
<text x="745" y="110" text-anchor="middle" font-size="14" font-weight="bold">Faculty</text>
<text x="745" y="135" text-anchor="middle" font-size="11">/faculty/{id}</text>

<!-- Enrollment -->
<rect x="350" y="200" width="150" height="80" rx="8" fill="#E0F7FA" stroke="#00ACC1"/>
<text x="425" y="230" text-anchor="middle" font-size="14" font-weight="bold">Enrollment</text>
<text x="425" y="255" text-anchor="middle" font-size="11">/students/{id}/enrollments</text>

<!-- Relationships -->
<line x1="190" y1="120" x2="250" y2="120" stroke="black" stroke-width="2"/>
<text x="220" y="110" font-size="10">has</text>

<line x1="400" y1="120" x2="460" y2="120" stroke="black" stroke-width="2"/>
<text x="430" y="110" font-size="10">enrolls</text>

<line x1="610" y1="120" x2="670" y2="120" stroke="black" stroke-width="2"/>
<text x="640" y="110" font-size="10">teaches</text>

<line x1="325" y1="160" x2="425" y2="200" stroke="black" stroke-width="2"/>
<text x="355" y="180" font-size="10">1:M</text>

<line x1="535" y1="160" x2="425" y2="200" stroke="black" stroke-width="2"/>
<text x="505" y="180" font-size="10">1:M</text>
</svg>

---

## 3. Endpoint Design

### 3.1 Naming Conventions

| Rule | Good | Bad |
|------|------|-----|
| Use plural nouns | `/students` | `/student`, `/getStudents` |
| Use nouns, not verbs | `/students` | `/getAllStudents` |
| Use hyphens for multi-word | `/student-profiles` | `/studentProfiles` |
| Use lowercase | `/students` | `/Students` |
| Nest for relationships | `/students/1/courses` | `/getCoursesByStudent/1` |
| Use path parameters for IDs | `/students/1` | `/students?id=1` |

### 3.2 HTTP Methods

| Method | Purpose | Request Body | Response | Idempotent |
|--------|---------|--------------|----------|------------|
| **GET** | Read resource(s) | No | 200 OK + data | Yes |
| **POST** | Create new resource | Yes | 201 Created + data | No |
| **PUT** | Full update | Yes | 200 OK + data | Yes |
| **PATCH** | Partial update | Yes | 200 OK + data | No |
| **DELETE** | Remove resource | No | 204 No Content | Yes |

### 3.3 Complete API Endpoint Plan

**Students:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/students` | List all students |
| GET | `/students/{id}` | Get a specific student |
| POST | `/students` | Create a new student |
| PUT | `/students/{id}` | Full update a student |
| PATCH | `/students/{id}` | Partial update a student |
| DELETE | `/students/{id}` | Delete a student |

**Courses:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/courses` | List all courses |
| GET | `/courses/{id}` | Get a specific course |
| POST | `/courses` | Create a new course |
| PUT | `/courses/{id}` | Full update a course |
| DELETE | `/courses/{id}` | Delete a course |

**Enrollments (Nested):**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/students/{id}/enrollments` | List enrollments for a student |
| POST | `/students/{id}/enrollments` | Enroll student in a course |
| DELETE | `/students/{id}/enrollments/{courseId}` | Unenroll student from a course |

---

## 4. Request and Response Design

### 4.1 Request Body for Creating a Student

```json
{
    "name": "Aarav",
    "email": "aarav@upes.ac.in",
    "branch": "CSE",
    "enrollment_date": "2024-08-01"
}
```

### 4.2 Response for Single Student

```json
{
    "id": 1,
    "name": "Aarav",
    "email": "aarav@upes.ac.in",
    "branch": "CSE",
    "enrollment_date": "2024-08-01",
    "created_at": "2024-08-01T10:30:00Z",
    "department": {
        "id": 1,
        "name": "Computer Science"
    }
}
```

### 4.3 Response for Collection (with Pagination)

```json
{
    "data": [
        {
            "id": 1,
            "name": "Aarav",
            "email": "aarav@upes.ac.in",
            "branch": "CSE"
        },
        {
            "id": 2,
            "name": "Diya",
            "email": "diya@upes.ac.in",
            "branch": "ECE"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 150,
        "total_pages": 15
    }
}
```

### 4.4 Error Response

```json
{
    "error": {
        "code": 404,
        "message": "Student not found",
        "details": "No student exists with ID 999"
    }
}
```

---

## 5. Filtering, Sorting, and Pagination

### 5.1 Query Parameters

| Parameter | Example | Description |
|-----------|---------|-------------|
| `branch` | `?branch=CSE` | Filter by branch |
| `sort` | `?sort=name` | Sort by field |
| `order` | `?order=desc` | Sort order (asc/desc) |
| `page` | `?page=2` | Page number |
| `limit` | `?limit=20` | Items per page |
| `search` | `?search=aarav` | Full-text search |

### 5.2 Example API Calls

```
GET /students?branch=CSE&sort=name&order=asc&page=1&limit=10
GET /courses?credits=3&department=CSE
GET /students?search=aarav
```

### 5.3 Response with Metadata

```json
{
    "data": [...],
    "meta": {
        "filters": {
            "branch": "CSE"
        },
        "sort": {
            "field": "name",
            "order": "asc"
        },
        "pagination": {
            "page": 1,
            "limit": 10,
            "total": 50
        }
    }
}
```

---

## 6. API Schema Design

### 6.1 Input Validation with Pydantic

```python
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date
from enum import Enum

class BranchEnum(str, Enum):
    CSE = "CSE"
    ECE = "ECE"
    IT = "IT"
    ME = "ME"
    CE = "CE"

class StudentCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Student name")
    email: EmailStr = Field(..., description="Student email")
    branch: BranchEnum = Field(..., description="Branch abbreviation")
    enrollment_date: Optional[date] = Field(None, description="Enrollment date")

class StudentUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    branch: Optional[BranchEnum] = None

class StudentResponse(BaseModel):
    id: int
    name: str
    email: str
    branch: str
    enrollment_date: Optional[date]
    created_at: str
    
    class Config:
        from_attributes = True
```

### 6.2 API Documentation with FastAPI

```python
from fastapi import FastAPI, HTTPException, Query
from typing import List, Optional

app = FastAPI(
    title="Student Management API",
    description="API for managing students, courses, and enrollments",
    version="1.0.0"
)

@app.get(
    "/students",
    response_model=List[StudentResponse],
    summary="List all students",
    description="Retrieve a paginated list of students with optional filtering"
)
def list_students(
    branch: Optional[BranchEnum] = Query(None, description="Filter by branch"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page")
):
    """Retrieve students with filtering and pagination."""
    pass
```

---

## 7. API Versioning

### 7.1 URL Versioning (Recommended)

```
/api/v1/students
/api/v2/students
```

### 7.2 Header Versioning

```
GET /students
Accept-Version: v1
```

### 7.3 Versioning Strategy

| Strategy | Pros | Cons |
|----------|------|------|
| URL versioning | Clear, cacheable | URL pollution |
| Header versioning | Clean URLs | Hard to test |
| Query parameter | Easy to implement | Less RESTful |

**Recommendation:** Use URL versioning (`/api/v1/`) for public APIs.

---

## 8. Summary

* **Resource-oriented design** focuses on nouns (resources) rather than verbs (operations).
* **Endpoint naming** should be consistent, use plural nouns, and follow REST conventions.
* **HTTP methods** map to CRUD operations (GET=Read, POST=Create, PUT=Update, DELETE=Delete).
* **Request/response schemas** should be well-defined using Pydantic or similar tools.
* **API versioning** ensures backward compatibility when making breaking changes.

### Key Takeaways

* Design APIs around resources, not operations.
* Use plural nouns for collections (`/students`) and path parameters for IDs (`/students/1`).
* Consistent error responses improve developer experience.
* Document your API with OpenAPI/Swagger for discoverability.
* Plan for versioning from the start to avoid breaking changes.

In **L19 – Implementing RESTful APIs: Building API Endpoints**, you will implement the API endpoints you designed using FastAPI.

---

### Lab Exercise

1. Design a complete API for a **Library Management System** with resources: Book, Member, Loan.
2. Document all endpoints with HTTP methods, request/response schemas, and status codes.
3. Create Pydantic models for input validation and response serialization.
4. Design the API for filtering books by genre, author, and availability.
5. Plan the pagination strategy for listing books and members.
6. Create an OpenAPI documentation using FastAPI's built-in Swagger UI.