# Lecture 19

# Implementing RESTful APIs: Building API Endpoints

**Course Outcome:** CO3 – Build complete RESTful API endpoints with proper request handling and response formatting.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 19 |
| Unit | Unit 2: Database Management |
| Topic | Implementing RESTful APIs: Building API Endpoints |
| Course Outcome | CO3 |
| Bloom's Knowledge Level | Apply |
| Skills Developed | API development, Request validation, FastAPI/Pydantic implementation, Error handling |
| Applications | Backend service deployment, API endpoints, Web application integration |
| PBL Activity | Implementing a complete CRUD API for a Student/Course system in FastAPI |
| Assessment Method | Coding project & API implementation demonstration |

---

## 1. Introduction

In L18, we learned how to design RESTful APIs with proper endpoint planning and resource modeling. Now, we will implement those designs by building actual API endpoints. This is where theory meets practice — you will create working APIs that handle HTTP requests, interact with databases, and return responses.

**API implementation** involves writing the code that receives HTTP requests, validates input, performs business logic, interacts with the database, and returns appropriate responses.

By the end of this lecture, you will have:

1. Skills to implement CRUD endpoints using FastAPI.
2. Knowledge of request validation, error handling, and response formatting.
3. Understanding of how to structure API code for maintainability.
4. Ability to test APIs using Postman and curl.
5. Hands-on experience building a complete API with database integration.

---

## 2. Project Setup

### 2.1 Create Project Structure

```
student_api/
├── main.py
├── models.py
├── schemas.py
├── database.py
├── requirements.txt
└── .env
```

### 2.2 Install Dependencies

```bash
pip install fastapi uvicorn sqlalchemy python-dotenv pydantic[email]
```

### 2.3 Database Configuration

**database.py:**

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./students.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

---

## 3. Implementing Models

**models.py:**

```python
from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Department(Base):
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    students = relationship("Student", back_populates="department")
    courses = relationship("Course", back_populates="department")

class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    branch = Column(String(50), nullable=False)
    enrollment_date = Column(Date)
    department_id = Column(Integer, ForeignKey("departments.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    department = relationship("Department", back_populates="students")
    enrollments = relationship("Enrollment", back_populates="student", cascade="all, delete-orphan")

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(String(10), primary_key=True)
    title = Column(String(100), nullable=False)
    credits = Column(Integer, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    department = relationship("Department", back_populates="courses")
    enrollments = relationship("Enrollment", back_populates="course")

class Enrollment(Base):
    __tablename__ = "enrollments"
    
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), primary_key=True)
    course_id = Column(String(10), ForeignKey("courses.id"), primary_key=True)
    semester = Column(String(20))
    grade = Column(String(2))
    enrolled_at = Column(DateTime(timezone=True), server_default=func.now())
    
    student = relationship("Student", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")
```

---

## 4. Implementing Schemas

**schemas.py:**

```python
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date, datetime
from enum import Enum

class BranchEnum(str, Enum):
    CSE = "CSE"
    ECE = "ECE"
    IT = "IT"
    ME = "ME"
    CE = "CE"

# Department schemas
class DepartmentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentResponse(DepartmentBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Student schemas
class StudentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    branch: BranchEnum

class StudentCreate(StudentBase):
    department_id: Optional[int] = None
    enrollment_date: Optional[date] = None

class StudentUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    branch: Optional[BranchEnum] = None
    department_id: Optional[int] = None

class StudentResponse(StudentBase):
    id: int
    enrollment_date: Optional[date]
    department_id: Optional[int]
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class StudentListResponse(BaseModel):
    data: List[StudentResponse]
    total: int
    page: int
    limit: int
    total_pages: int

# Course schemas
class CourseBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    credits: int = Field(..., ge=1, le=6)

class CourseCreate(CourseBase):
    department_id: Optional[int] = None

class CourseResponse(CourseBase):
    id: str
    department_id: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Enrollment schemas
class EnrollmentCreate(BaseModel):
    course_id: str
    semester: str
    grade: Optional[str] = None

class EnrollmentResponse(BaseModel):
    student_id: int
    course_id: str
    semester: str
    grade: Optional[str]
    enrolled_at: datetime
    
    class Config:
        from_attributes = True

# Error schema
class ErrorResponse(BaseModel):
    error: dict
```

---

## 5. Implementing API Endpoints

**main.py:**

```python
from fastapi import FastAPI, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import date
import math

from database import engine, get_db, Base
from models import Student, Course, Department, Enrollment
from schemas import (
    StudentCreate, StudentUpdate, StudentResponse, StudentListResponse,
    CourseCreate, CourseResponse,
    DepartmentCreate, DepartmentResponse,
    EnrollmentCreate, EnrollmentResponse,
    ErrorResponse, BranchEnum
)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Student Management API",
    description="API for managing students, courses, and enrollments",
    version="1.0.0"
)

# ==================== STUDENTS ====================

@app.get("/students", response_model=StudentListResponse)
def list_students(
    branch: Optional[BranchEnum] = Query(None, description="Filter by branch"),
    department_id: Optional[int] = Query(None, description="Filter by department"),
    search: Optional[str] = Query(None, description="Search by name or email"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db)
):
    query = db.query(Student)
    
    if branch:
        query = query.filter(Student.branch == branch)
    if department_id:
        query = query.filter(Student.department_id == department_id)
    if search:
        query = query.filter(
            (Student.name.ilike(f"%{search}%")) | 
            (Student.email.ilike(f"%{search}%"))
        )
    
    total = query.count()
    total_pages = math.ceil(total / limit)
    offset = (page - 1) * limit
    
    students = query.offset(offset).limit(limit).all()
    
    return {
        "data": students,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": total_pages
    }

@app.get("/students/{student_id}", response_model=StudentResponse)
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@app.post("/students", response_model=StudentResponse, status_code=201)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    existing = db.query(Student).filter(Student.email == student.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")
    
    db_student = Student(**student.model_dump())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

@app.put("/students/{student_id}", response_model=StudentResponse)
def update_student(
    student_id: int, 
    student: StudentUpdate, 
    db: Session = Depends(get_db)
):
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    update_data = student.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_student, field, value)
    
    db.commit()
    db.refresh(db_student)
    return db_student

@app.delete("/students/{student_id}", status_code=204)
def delete_student(student_id: int, db: Session = Depends(get_db)):
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    db.delete(db_student)
    db.commit()
    return None

# ==================== COURSES ====================

@app.get("/courses", response_model=List[CourseResponse])
def list_courses(
    department_id: Optional[int] = Query(None),
    credits: Optional[int] = Query(None, ge=1, le=6),
    db: Session = Depends(get_db)
):
    query = db.query(Course)
    
    if department_id:
        query = query.filter(Course.department_id == department_id)
    if credits:
        query = query.filter(Course.credits == credits)
    
    return query.all()

@app.post("/courses", response_model=CourseResponse, status_code=201)
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    existing = db.query(Course).filter(Course.id == course.id).first()
    if existing:
        raise HTTPException(status_code=409, detail="Course already exists")
    
    db_course = Course(**course.model_dump())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

# ==================== ENROLLMENTS ====================

@app.get("/students/{student_id}/enrollments", response_model=List[EnrollmentResponse])
def list_student_enrollments(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return db.query(Enrollment).filter(Enrollment.student_id == student_id).all()

@app.post(
    "/students/{student_id}/enrollments", 
    response_model=EnrollmentResponse, 
    status_code=201
)
def create_enrollment(
    student_id: int, 
    enrollment: EnrollmentCreate, 
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    course = db.query(Course).filter(Course.id == enrollment.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    existing = db.query(Enrollment).filter(
        Enrollment.student_id == student_id,
        Enrollment.course_id == enrollment.course_id
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Already enrolled in this course")
    
    db_enrollment = Enrollment(
        student_id=student_id,
        **enrollment.model_dump()
    )
    db.add(db_enrollment)
    db.commit()
    db.refresh(db_enrollment)
    return db_enrollment

@app.delete(
    "/students/{student_id}/enrollments/{course_id}", 
    status_code=204
)
def delete_enrollment(
    student_id: int, 
    course_id: str, 
    db: Session = Depends(get_db)
):
    enrollment = db.query(Enrollment).filter(
        Enrollment.student_id == student_id,
        Enrollment.course_id == course_id
    ).first()
    
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    db.delete(enrollment)
    db.commit()
    return None

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
```

---

## 6. Testing the API

### 6.1 Run the Server

```bash
python main.py
```

### 6.2 Test with curl

**Create a student:**

```bash
curl -X POST http://localhost:8000/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Aarav",
    "email": "aarav@upes.ac.in",
    "branch": "CSE",
    "enrollment_date": "2024-08-01"
  }'
```

**List students:**

```bash
curl "http://localhost:8000/students?branch=CSE&page=1&limit=5"
```

**Get a student:**

```bash
curl http://localhost:8000/students/1
```

**Update a student:**

```bash
curl -X PUT http://localhost:8000/students/1 \
  -H "Content-Type: application/json" \
  -d '{"branch": "ECE"}'
```

**Delete a student:**

```bash
curl -X DELETE http://localhost:8000/students/1
```

### 6.3 Test with Swagger UI

Open `http://localhost:8000/docs` to access interactive API documentation.

---

## 7. Error Handling Best Practices

| HTTP Status | Meaning | When to Use |
|-------------|---------|-------------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource |
| 422 | Unprocessable Entity | Validation error |
| 500 | Internal Server Error | Unexpected error |

---

## 8. Summary

* **API implementation** involves writing code that handles HTTP requests, validates input, interacts with databases, and returns responses.
* **FastAPI** provides automatic validation, documentation, and type checking.
* **Pydantic schemas** ensure data integrity for requests and responses.
* **Error handling** with appropriate HTTP status codes improves developer experience.
* Always test your API endpoints using curl, Postman, or Swagger UI.

### Key Takeaways

* FastAPI simplifies API development with automatic validation and documentation.
* Use dependency injection for database sessions and authentication.
* Return appropriate HTTP status codes for all operations.
* Implement pagination for collection endpoints to handle large datasets.
* Test all endpoints thoroughly before deployment.

In **L20 – Authentication Mechanisms: Basic Auth, Token-based Auth, JWT**, you will learn how to secure your API endpoints.

---

### Lab Exercise

1. Implement the complete Student Management API with all CRUD operations.
2. Add filtering to the `GET /students` endpoint (by branch, department, search).
3. Implement pagination with page, limit, total, and total_pages in the response.
4. Create a `POST /courses` endpoint and test it with Postman.
5. Implement nested endpoints for student enrollments.
6. Add proper error handling for all endpoints (404, 409, 422).
7. Document your API using FastAPI's built-in Swagger UI.