# Lecture 22

# Handling API Requests and Responses: Validation, Serialization

**Course Outcome:** CO3 – Implement robust request validation and response serialization for API data integrity.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 22 |
| Unit | Unit 2: Database Management |
| Topic | Handling API Requests and Responses: Validation, Serialization |
| Course Outcome | CO3 |
| Bloom's Knowledge Level | Apply |
| Skills Developed | Input validation, Response serialization, Custom Pydantic validators, File upload validation |
| Applications | Data sanitization, Security compliance, API performance optimization |
| PBL Activity | Implementing comprehensive request validation and response serialization for a Student API |
| Assessment Method | Coding project & Validation/Serialization demonstration |

---

## 1. Introduction

In L21, we learned how to control user access through authorization mechanisms. Now, we will focus on ensuring that the data flowing through our APIs is valid, properly formatted, and securely processed. Poor data handling leads to security vulnerabilities, application crashes, and inconsistent data.

**Request validation** ensures incoming data meets expected formats and constraints before processing. **Response serialization** converts internal data structures into standard formats (JSON) for clients.

By the end of this lecture, you will have:

1. Understanding of input validation techniques and their importance.
2. Knowledge of Pydantic's validation capabilities for request data.
3. Skills to serialize complex data structures for API responses.
4. Ability to handle file uploads and binary data.
5. Hands-on experience implementing comprehensive data validation.

---

## 2. Why Validation Matters

| Problem | Impact | Example |
|---------|--------|---------|
| **SQL Injection** | Database compromise | `' OR '1'='1` in input |
| **XSS Attacks** | Client-side code execution | `<script>alert('hack')</script>` |
| **Invalid Data** | Application crashes | String in integer field |
| **Inconsistent Data** | Business logic errors | Future date for enrollment |
| **Missing Fields** | Incomplete records | No email for student |

---

## 3. Pydantic Validation

Pydantic provides powerful validation through Python type hints.

### 3.1 Basic Validation

```python
from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional, List
from datetime import date
from enum import Enum

class BranchEnum(str, Enum):
    CSE = "CSE"
    ECE = "ECE"
    IT = "IT"
    ME = "ME"
    CE = "CE"

class StudentCreate(BaseModel):
    name: str = Field(
        ..., 
        min_length=1, 
        max_length=100,
        description="Student's full name",
        examples=["Aarav Kumar"]
    )
    email: EmailStr = Field(
        ...,
        description="Student's email address"
    )
    branch: BranchEnum = Field(
        ...,
        description="Branch abbreviation"
    )
    enrollment_date: Optional[date] = Field(
        None,
        description="Date of enrollment"
    )
    age: int = Field(
        ...,
        ge=17,
        le=30,
        description="Student's age (17-30)"
    )
    phone: Optional[str] = Field(
        None,
        pattern=r'^\d{10}$',
        description="10-digit phone number"
    )
```

### 3.2 Custom Validators

```python
class StudentCreate(BaseModel):
    name: str
    email: str
    enrollment_date: date
    
    @validator('name')
    def name_must_contain_space(cls, v):
        if ' ' not in v:
            raise ValueError('Name must contain at least one space (first and last name)')
        return v.title()
    
    @validator('enrollment_date')
    def enrollment_not_future(cls, v):
        if v > date.today():
            raise ValueError('Enrollment date cannot be in the future')
        return v
    
    @validator('email')
    def email_must_be_university(cls, v):
        if not v.endswith('@upes.ac.in'):
            raise ValueError('Email must be a university email (@upes.ac.in)')
        return v.lower()
```

### 3.3 Nested Validation

```python
class Address(BaseModel):
    street: str = Field(..., min_length=5)
    city: str = Field(..., min_length=2)
    state: str = Field(..., min_length=2)
    pincode: str = Field(..., pattern=r'^\d{6}$')

class StudentWithAddress(BaseModel):
    name: str
    email: EmailStr
    address: Address
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Aarav Kumar",
                "email": "aarav@upes.ac.in",
                "address": {
                    "street": "123 MG Road",
                    "city": "Dehradun",
                    "state": "Uttarakhand",
                    "pincode": "248001"
                }
            }
        }
```

---

## 4. Request Body Validation

### 4.1 FastAPI Automatic Validation

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI()

@app.post("/students", status_code=201)
def create_student(student: StudentCreate):
    # FastAPI automatically validates the request body
    # Returns 422 if validation fails
    return {"message": "Student created", "student": student}
```

### 4.2 Validation Error Response

When validation fails, FastAPI returns:

```json
{
    "detail": [
        {
            "type": "value_error",
            "loc": ["body", "email"],
            "msg": "value is not a valid email address",
            "input": "invalid-email",
            "ctx": {"reason": "An email address must have the @ sign..."}
        }
    ]
}
```

### 4.3 Query Parameter Validation

```python
from fastapi import Query

@app.get("/students")
def list_students(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    branch: Optional[BranchEnum] = Query(None, description="Filter by branch"),
    search: Optional[str] = Query(None, min_length=2, max_length=50)
):
    return {"page": page, "limit": limit}
```

### 4.4 Path Parameter Validation

```python
from fastapi import Path

@app.get("/students/{student_id}")
def get_student(
    student_id: int = Path(..., ge=1, description="Student ID")
):
    return {"student_id": student_id}
```

---

## 5. Response Serialization

### 5.1 Response Models

Pydantic models control what data is exposed in responses:

```python
class StudentResponse(BaseModel):
    id: int
    name: str
    email: str
    branch: str
    enrollment_date: Optional[date]
    created_at: datetime
    
    class Config:
        from_attributes = True  # Allows ORM model conversion

@app.get("/students/{student_id}", response_model=StudentResponse)
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student  # Automatically serialized by Pydantic
```

### 5.2 Excluding Fields

```python
class StudentResponse(BaseModel):
    id: int
    name: str
    email: str
    branch: str
    
    # Exclude sensitive fields
    class Config:
        fields = {
            'password': {'exclude': True},
            'hashed_password': {'exclude': True}
        }

# Or use exclude parameter
@app.get("/students/{student_id}", response_model=StudentResponse)
def get_student(student_id: int):
    student = get_student_from_db(student_id)
    return student.model_dump(exclude={"password", "hashed_password"})
```

### 5.3 Custom JSON Encoders

```python
from fastapi.encoders import jsonable_encoder
from datetime import datetime, date

@app.get("/students/{student_id}")
def get_student(student_id: int):
    student = get_student_from_db(student_id)
    
    # Custom serialization
    response_data = {
        "id": student.id,
        "name": student.name,
        "enrollment_date": student.enrollment_date.isoformat() if student.enrollment_date else None,
        "created_at": student.created_at.isoformat()
    }
    
    return response_data
```

---

## 6. Handling Complex Data Types

### 6.1 File Uploads

```python
from fastapi import File, UploadFile
from typing import List

@app.post("/students/{student_id}/upload-photo")
async def upload_photo(
    student_id: int,
    file: UploadFile = File(..., description="Student photo")
):
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPEG, PNG, and WebP images are allowed"
        )
    
    # Validate file size (max 5MB)
    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File size must be less than 5MB"
        )
    
    # Save file
    file_path = f"uploads/students/{student_id}/{file.filename}"
    with open(file_path, "wb") as f:
        f.write(contents)
    
    return {"filename": file.filename, "content_type": file.content_type}
```

### 6.2 List Responses with Filtering

```python
from typing import List
from fastapi import Query

class StudentListResponse(BaseModel):
    data: List[StudentResponse]
    total: int
    page: int
    limit: int
    filters: dict

@app.get("/students", response_model=StudentListResponse)
def list_students(
    branch: Optional[BranchEnum] = Query(None),
    min_age: Optional[int] = Query(None, ge=17),
    max_age: Optional[int] = Query(None, le=30),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
):
    query = db.query(Student)
    
    if branch:
        query = query.filter(Student.branch == branch)
    if min_age:
        query = query.filter(Student.age >= min_age)
    if max_age:
        query = query.filter(Student.age <= max_age)
    
    total = query.count()
    students = query.offset((page - 1) * limit).limit(limit).all()
    
    return {
        "data": students,
        "total": total,
        "page": page,
        "limit": limit,
        "filters": {
            "branch": branch,
            "min_age": min_age,
            "max_age": max_age
        }
    }
```

---

## 7. Advanced Validation Patterns

### 7.1 Conditional Validation

```python
class EnrollmentCreate(BaseModel):
    course_id: str
    semester: str
    grade: Optional[str] = None
    
    @validator('grade')
    def validate_grade(cls, v, values):
        # Grade is required when semester is "completed"
        if values.get('semester') == 'completed' and v is None:
            raise ValueError('Grade is required for completed semesters')
        return v
```

### 7.2 Cross-field Validation

```python
class DateRange(BaseModel):
    start_date: date
    end_date: date
    
    @validator('end_date')
    def end_must_be_after_start(cls, v, values):
        if 'start_date' in values and v <= values['start_date']:
            raise ValueError('End date must be after start date')
        return v
```

### 7.3 Dynamic Validation

```python
from pydantic import model_validator

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    branch: Optional[BranchEnum] = None
    
    @model_validator(mode='after')
    def validate_at_least_one_field(self):
        if not any([self.name, self.email, self.branch]):
            raise ValueError('At least one field must be provided for update')
        return self
```

---

## 8. Security Considerations

### 8.1 Preventing SQL Injection

```python
# BAD - vulnerable to SQL injection
@app.get("/students/search")
def search_student(name: str):
    query = f"SELECT * FROM students WHERE name LIKE '%{name}%'"
    result = db.execute(query)
    return result.fetchall()

# GOOD - using parameterized queries
@app.get("/students/search")
def search_student(name: str):
    students = db.query(Student).filter(
        Student.name.ilike(f"%{name}%")
    ).all()
    return students
```

### 8.2 Preventing XSS

```python
from bleach import clean

class CommentCreate(BaseModel):
    content: str
    
    @validator('content')
    def sanitize_content(cls, v):
        # Remove HTML tags to prevent XSS
        return clean(v, tags=[], strip=True)
```

### 8.3 Rate Limiting

```python
from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.get("/students")
@limiter.limit("100/minute")
def list_students(request: Request):
    return db.query(Student).all()
```

---

## 9. Summary

* **Request validation** prevents invalid, malicious, or inconsistent data from entering your system.
* **Pydantic** provides powerful validation through type hints, custom validators, and field constraints.
* **Response serialization** controls what data is exposed to clients and ensures consistent formats.
* Always validate input at the API boundary before processing.
* Use response models to filter sensitive data and maintain API contracts.

### Key Takeaways

* Validate all input at the API boundary using Pydantic models.
* Use custom validators for complex business rules.
* Response models prevent exposing sensitive data.
* File uploads require validation of type, size, and content.
* Always sanitize user input to prevent XSS and SQL injection.

In **L23 – API Versioning and Documentation: Swagger/OpenAPI, Postman**, you will learn how to version your APIs and create comprehensive documentation.

---

### Lab Exercise

1. Create a comprehensive validation schema for a **Course** resource with:
   - Required fields (title, credits)
   - Optional fields (description, prerequisites)
   - Custom validators (credits between 1-6, title minimum length)
2. Implement file upload for student profile photos with validation.
3. Create a response model that excludes sensitive fields (password, internal notes).
4. Add custom validation for cross-field constraints (enrollment date before graduation date).
5. Test your validation by sending invalid data and verifying proper error responses.
6. Implement rate limiting for the `/login` endpoint (max 5 attempts per minute).