# Lecture 24

# Assignment-I Discussion and Solution Review

**Course Outcome:** CO2 – Review and discuss solutions for the first assignment, reinforcing concepts from Unit II.

---

## 1. Introduction

In Lectures L13–L23, we covered the fundamentals of database management, API design, and security. This lecture provides an opportunity to review the Assignment-I solutions, discuss common challenges, and reinforce the concepts learned throughout Unit II.

**Assignment-I** focused on building a complete backend application with database integration, CRUD operations, authentication, and authorization.

By the end of this lecture, you will have:

1. Understanding of common implementation patterns and best practices.
2. Knowledge of common mistakes and how to avoid them.
3. Ability to critique and improve existing code.
4. Skills to discuss technical decisions and trade-offs.
5. A checklist for evaluating backend applications.

---

## 2. Assignment-I Overview

### 2.1 Typical Assignment Requirements

The Assignment-I usually includes:

1. **Database Design:** ER diagram, normalized schema, relationships.
2. **CRUD Operations:** Implement Create, Read, Update, Delete for at least two entities.
3. **API Endpoints:** RESTful API with proper HTTP methods and status codes.
4. **Authentication:** JWT-based user authentication.
5. **Authorization:** Role-based access control.
6. **Documentation:** API documentation using Swagger/Postman.

### 2.2 Evaluation Criteria

| Criteria | Weight | Description |
|----------|--------|-------------|
| **Database Design** | 20% | ER diagram, normalization, relationships |
| **Code Quality** | 25% | Clean code, separation of concerns, naming |
| **API Design** | 20% | RESTful conventions, status codes, error handling |
| **Security** | 15% | Authentication, authorization, input validation |
| **Documentation** | 10% | Swagger UI, README, code comments |
| **Testing** | 10% | API testing, edge cases, error scenarios |

---

## 3. Common Implementation Patterns

### 3.1 Project Structure

**Recommended Structure:**

```
student_api/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── auth.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── students.py
│   │   ├── courses.py
│   │   └── enrollments.py
│   └── services/
│       ├── __init__.py
│       ├── student_service.py
│       └── course_service.py
├── tests/
│   ├── __init__.py
│   ├── test_students.py
│   └── test_courses.py
├── requirements.txt
├── .env
└── README.md
```

### 3.2 Separation of Concerns

```python
# Good: Separated into routers, services, and models
# routers/students.py
from fastapi import APIRouter, Depends
from services.student_service import StudentService

router = APIRouter()

@router.get("/students")
def list_students(service: StudentService = Depends()):
    return service.get_all_students()

# services/student_service.py
class StudentService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_all_students(self):
        return self.db.query(Student).all()
```

### 3.3 Configuration Management

```python
# config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"

settings = Settings()
```

---

## 4. Common Mistakes and Solutions

### 4.1 Database Design Mistakes

| Mistake | Solution |
|---------|----------|
| **No primary keys** | Always define primary keys for all tables |
| **Missing foreign keys** | Define foreign key constraints for relationships |
| **Over-normalization** | Balance normalization with query performance |
| **No indexes** | Add indexes on frequently queried columns |
| **Hardcoded values** | Use environment variables for configuration |

### 4.2 API Design Mistakes

| Mistake | Solution |
|---------|----------|
| **Using verbs in URLs** | Use nouns: `/students` not `/getStudents` |
| **Wrong HTTP methods** | GET for read, POST for create, PUT for update, DELETE for delete |
| **Missing status codes** | Use 201 for create, 204 for delete, 404 for not found |
| **No error handling** | Return consistent error responses with details |
| **No pagination** | Implement pagination for collection endpoints |

### 4.3 Security Mistakes

| Mistake | Solution |
|---------|----------|
| **Storing plain text passwords** | Use bcrypt or Argon2 for password hashing |
| **No token expiration** | Implement short-lived access tokens (15-30 min) |
| **Missing input validation** | Validate all input at API boundary |
| **No rate limiting** | Implement rate limiting for sensitive endpoints |
| **Hardcoded secrets** | Use environment variables for secrets |

### 4.4 Code Quality Mistakes

| Mistake | Solution |
|---------|----------|
| **No type hints** | Use Python type hints for better code quality |
| **Magic numbers** | Define constants for magic numbers |
| **No error handling** | Use try-except blocks and proper error responses |
| **No logging** | Implement logging for debugging and monitoring |
| **No tests** | Write unit tests and integration tests |

---

## 5. Code Review Checklist

### 5.1 Database

- [ ] All tables have primary keys
- [ ] Foreign keys are defined for relationships
- [ ] Appropriate indexes are created
- [ ] Data types are correct (INT for IDs, VARCHAR for text)
- [ ] NOT NULL constraints for required fields
- [ ] UNIQUE constraints for unique fields

### 5.2 API Endpoints

- [ ] RESTful naming conventions followed
- [ ] Correct HTTP methods used
- [ ] Appropriate status codes returned
- [ ] Request validation implemented
- [ ] Response models defined
- [ ] Error handling for all edge cases

### 5.3 Authentication & Authorization

- [ ] Passwords are hashed (not plain text)
- [ ] JWT tokens have expiration
- [ ] Protected routes require authentication
- [ ] Role-based access control implemented
- [ ] Ownership checks for user-specific resources

### 5.4 Code Quality

- [ ] Code is well-organized (routers, services, models)
- [ ] Type hints are used throughout
- [ ] Configuration is externalized
- [ ] Error messages are descriptive
- [ ] No hardcoded values

### 5.5 Documentation

- [ ] Swagger UI is accessible at `/docs`
- [ ] API endpoints have descriptions
- [ ] Request/response examples are provided
- [ ] Error responses are documented
- [ ] README includes setup instructions

---

## 6. Sample Solutions

### 6.1 Database Schema Solution

```sql
-- Students Table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    branch VARCHAR(50) NOT NULL,
    enrollment_date DATE,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_branch ON students(branch);

-- Courses Table
CREATE TABLE courses (
    id VARCHAR(10) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    credits INTEGER CHECK (credits BETWEEN 1 AND 6),
    department_id INTEGER REFERENCES departments(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enrollments Table
CREATE TABLE enrollments (
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    course_id VARCHAR(10) REFERENCES courses(id),
    semester VARCHAR(20) NOT NULL,
    grade VARCHAR(2),
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, course_id)
);
```

### 6.2 API Endpoint Solution

```python
# Complete CRUD with validation, auth, and error handling
from fastapi import FastAPI, HTTPException, Depends, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
import math

app = FastAPI()

@app.get("/api/v1/students", response_model=StudentListResponse)
def list_students(
    branch: Optional[BranchEnum] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Student)
    
    if branch:
        query = query.filter(Student.branch == branch)
    
    total = query.count()
    students = query.offset((page - 1) * limit).limit(limit).all()
    
    return {
        "data": students,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": math.ceil(total / limit)
    }

@app.post("/api/v1/students", response_model=StudentResponse, status_code=201)
def create_student(
    student: StudentCreate,
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    existing = db.query(Student).filter(Student.email == student.email).first()
    if existing:
        raise HTTPException(
            status_code=409,
            detail="Email already registered"
        )
    
    db_student = Student(
        **student.model_dump(),
        hashed_password=get_password_hash(student.password)
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student
```

---

## 7. Discussion Points

### 7.1 Technical Decisions

1. **Why use SQLite for development?**
   - No setup required
   - File-based, easy to backup
   - Good for learning and testing
   - Switch to PostgreSQL for production

2. **Why use Pydantic for validation?**
   - Automatic validation
   - Type safety
   - Auto-generated documentation
   - Integration with FastAPI

3. **Why implement RBAC?**
   - Scalable authorization model
   - Easy to understand and maintain
   - Industry standard
   - Supports complex permission hierarchies

### 7.2 Trade-offs

| Decision | Pros | Cons |
|----------|------|------|
| **SQLite** | Simple, no setup | Not for production |
| **JWT** | Stateless, scalable | Token size, revocation |
| **RBAC** | Simple, scalable | Role explosion |
| **FastAPI** | Fast, auto-docs | Newer ecosystem |

---

## 8. Summary

* **Assignment-I** covers database design, CRUD operations, API development, authentication, and authorization.
* **Code review** should focus on database design, API conventions, security, and code quality.
* **Common mistakes** include missing primary keys, wrong HTTP methods, and plain text passwords.
* **Best practices** include separation of concerns, proper error handling, and comprehensive documentation.
* **Continuous improvement** is essential — review code regularly and apply feedback.

### Key Takeaways

* Database design is foundational — invest time in proper schema design.
* Follow RESTful conventions for API consistency.
* Security is not optional — implement authentication and authorization.
* Documentation improves developer experience and API adoption.
* Code review helps identify issues and improve code quality.

---

## 9. Next Steps

After completing Assignment-I, you should:

1. **Review feedback** — Understand areas for improvement.
2. **Refactor code** — Apply best practices and fix issues.
3. **Add tests** — Write unit and integration tests.
4. **Deploy** — Deploy your API to a cloud platform.
5. **Document** — Create comprehensive API documentation.

In **Unit III**, we will explore advanced frameworks, middleware, third-party integrations, testing, security, caching, and performance optimization.

---

### Lab Exercise

1. Review a peer's Assignment-I solution using the code review checklist.
2. Identify at least 3 areas for improvement and suggest solutions.
3. Refactor your own assignment based on the discussion points.
4. Add unit tests for your API endpoints.
5. Document your API using Swagger UI and Postman.
6. Deploy your API to a cloud platform (Heroku, Railway, or Render).