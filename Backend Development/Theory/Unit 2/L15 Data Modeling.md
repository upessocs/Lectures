# Lecture 15

# Data Modeling: Designing Models for Applications

**Course Outcome:** CO2 – Design data models that translate business requirements into database structures.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 15 |
| Unit | Unit 2: Database Management |
| Topic | Data Modeling: Designing Models for Applications |
| Course Outcome | CO2 |
| Bloom's Knowledge Level | Create |
| Skills Developed | Conceptual/Logical/Physical modeling, ORM/ODM implementation, Data validation |
| Applications | Application data structures, Database interaction, Schema mapping |
| PBL Activity | Modeling an E-Commerce system and implementing SQLAlchemy/Mongoose models |
| Assessment Method | Coding project & Data model design demonstration |

---

## 1. Introduction

In L14, we learned about ER diagrams and normalization techniques for designing database schemas. However, a database schema alone is not enough — backend applications need a way to interact with the database programmatically. **Data modeling** bridges the gap between business requirements and database implementation by defining how data is structured, stored, and accessed in an application.

A **data model** is a conceptual representation of data structures, their relationships, and the rules governing them. It serves as a blueprint for both database design and application code.

By the end of this lecture, you will have:

1. Understanding of different data modeling approaches (conceptual, logical, physical).
2. Knowledge of how to translate business requirements into data models.
3. Skills to implement data models using ORM (Object-Relational Mapping).
4. Familiarity with SQLAlchemy (Python) and Mongoose (Node.js) for database interaction.
5. Hands-on experience creating and using data models in a backend application.

---

## 2. Levels of Data Modeling

Data modeling occurs at three levels, each serving a different purpose:

### 2.1 Conceptual Data Model

The **conceptual model** is a high-level overview of the data structure. It identifies entities and relationships without worrying about implementation details.

**Purpose:** Communicate with stakeholders, understand business requirements.

**Components:**
* Entities (Student, Course, Faculty)
* Relationships (Enrolls, Teaches)
* Attributes (name, email, branch)

**Example:**

```
Student --Enrolls--> Course
Faculty --Teaches--> Course
Student --BelongsTo--> Department
```

### 2.2 Logical Data Model

The **logical model** adds detail to the conceptual model by defining attributes, data types, and constraints. It remains database-agnostic.

**Purpose:** Detailed design before implementation.

**Components:**
* Entities with attributes
* Data types (INTEGER, VARCHAR, DATE)
* Primary keys and foreign keys
* Constraints (NOT NULL, UNIQUE)

**Example:**

```
Student (
    id: INTEGER PRIMARY KEY,
    name: VARCHAR(100) NOT NULL,
    email: VARCHAR(100) UNIQUE NOT NULL,
    branch: VARCHAR(50),
    enrollment_date: DATE
)
```

### 2.3 Physical Data Model

The **physical model** translates the logical model into actual database tables, indexes, and constraints for a specific DBMS.

**Purpose:** Implementation in a specific database system.

**Components:**
* Table definitions with storage details
* Indexes for performance
* Partitioning strategies
* Database-specific optimizations

**Example (PostgreSQL):**

```sql
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    branch VARCHAR(50),
    enrollment_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_students_branch ON students(branch);
```

---

## 3. Translating Business Requirements to Data Models

### 3.1 Process

1. **Identify entities** — What objects does the system manage?
2. **Identify attributes** — What properties does each entity have?
3. **Identify relationships** — How do entities interact?
4. **Define constraints** — What rules must the data follow?
5. **Choose data types** — What format does each attribute use?
6. **Create the model** — Document the design in ER diagrams or code.

### 3.2 Example: Student Management System

**Business Requirements:**
* Students enroll in courses
* Courses are taught by faculty
* Each course belongs to a department
* Students receive grades for enrolled courses

**Step 1: Identify Entities**

* Student
* Course
* Faculty
* Department
* Enrollment

**Step 2: Identify Attributes**

Student: id, name, email, phone, branch, enrollment_date
Course: id, title, credits, department_id
Faculty: id, name, email, department_id, designation
Department: id, name, building
Enrollment: student_id, course_id, semester, grade

**Step 3: Identify Relationships**

* Department 1:M Students
* Department 1:M Faculty
* Department 1:M Courses
* Faculty 1:M Courses (a course has one faculty)
* Student M:N Courses (through Enrollment)

**Step 4: Define Constraints**

* Student email must be unique
* Course credits must be between 1 and 6
* Grade must be A+, A, B+, B, C+, C, D, F, or NULL
* Enrollment date cannot be in the future

---

## 4. Object-Relational Mapping (ORM)

**ORM** is a technique that maps Python/JavaScript objects to database tables. Instead of writing raw SQL, you interact with objects — the ORM translates your operations into SQL behind the benefits:

* Write database operations in your programming language
* Automatic SQL generation
* Built-in validation and type checking
* Database-agnostic code (switch databases without changing code)
* Relationship handling (lazy loading, eager loading)

### 4.1 SQLAlchemy (Python)

SQLAlchemy is the most popular ORM for Python.

**Installation:**

```bash
pip install sqlalchemy
```

**Basic Usage:**

```python
from sqlalchemy import create_engine, Column, Integer, String, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

# Create database connection
engine = create_engine("sqlite:///students.db")
Base = declarative_base()
Session = sessionmaker(bind=engine)
session = Session()

# Define models
class Department(Base):
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True, nullable=False)
    
    students = relationship("Student", back_populates="department")
    courses = relationship("Course", back_populates="department")

class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    branch = Column(String(50))
    enrollment_date = Column(Date)
    department_id = Column(Integer, ForeignKey("departments.id"))
    
    department = relationship("Department", back_populates="students")
    enrollments = relationship("Enrollment", back_populates="student")

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(String(10), primary_key=True)
    title = Column(String(100), nullable=False)
    credits = Column(Integer, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"))
    
    department = relationship("Department", back_populates="courses")
    enrollments = relationship("Enrollment", back_populates="course")

class Enrollment(Base):
    __tablename__ = "enrollments"
    
    student_id = Column(Integer, ForeignKey("students.id"), primary_key=True)
    course_id = Column(String(10), ForeignKey("courses.id"), primary_key=True)
    semester = Column(String(20))
    grade = Column(String(2))
    
    student = relationship("Student", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")

# Create tables
Base.metadata.create_all(engine)
```

**CRUD Operations:**

```python
# Create
new_student = Student(
    name="Aarav",
    email="aarav@upes.ac.in",
    branch="CSE",
    enrollment_date=date(2024, 8, 1),
    department_id=1
)
session.add(new_student)
session.commit()

# Read
students = session.query(Student).filter(Student.branch == "CSE").all()
student = session.query(Student).filter_by(id=1).first()

# Update
student.branch = "ECE"
session.commit()

# Delete
session.delete(student)
session.commit()
```

### 4.2 Mongoose (Node.js)

Mongoose is the most popular ODM (Object Document Modeling) for MongoDB with Node.js.

**Installation:**

```bash
npm install mongoose
```

**Basic Usage:**

```javascript
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/student_management');

// Define schema
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    branch: {
        type: String,
        enum: ['CSE', 'ECE', 'IT', 'ME', 'CE']
    },
    enrollmentDate: {
        type: Date,
        default: Date.now
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
});

// Create model
const Student = mongoose.model('Student', studentSchema);

// CRUD Operations
async function createStudent() {
    const student = new Student({
        name: 'Aarav',
        email: 'aarav@upes.ac.in',
        branch: 'CSE',
        courses: ['courseId1', 'courseId2']
    });
    await student.save();
}

async function findStudents() {
    const cseStudents = await Student.find({ branch: 'CSE' });
    const student = await Student.findById('studentId');
}

async function updateStudent() {
    await Student.findByIdAndUpdate('studentId', { branch: 'ECE' });
}

async function deleteStudent() {
    await Student.findByIdAndDelete('studentId');
}
```

---

## 5. Data Model Validation

Validating data before storing it in the database prevents corruption and ensures consistency.

### 5.1 Validation with Pydantic (Python)

Pydantic is used with FastAPI for request validation:

```python
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date

class StudentCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    branch: str = Field(..., pattern=r'^(CSE|ECE|IT|ME|CE)$')
    enrollment_date: Optional[date] = None

class StudentResponse(BaseModel):
    id: int
    name: str
    email: str
    branch: str
    enrollment_date: date

# FastAPI endpoint
@app.post("/students", response_model=StudentResponse, status_code=201)
def create_student(student: StudentCreate):
    # Pydantic validates the request body automatically
    db_student = Student(**student.model_dump())
    session.add(db_student)
    session.commit()
    return db_student
```

### 5.2 Validation with Mongoose (Node.js)

Mongoose provides built-in validation:

```javascript
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [1, 'Name cannot be empty'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },
    age: {
        type: Number,
        min: [17, 'Minimum age is 17'],
        max: [30, 'Maximum age is 30']
    }
});
```

---

## 6. Data Modeling Best Practices

| Practice | Description |
|----------|-------------|
| **Start with requirements** | Understand business needs before designing models |
| **Use meaningful names** | `enrollment_date` not `ed` |
| **Normalize appropriately** | Avoid over-normalization (can hurt performance) |
| **Add timestamps** | `created_at` and `updated_at` for auditing |
| **Use enums for fixed values** | Branch, status, grade fields |
| **Index frequently queried fields** | Improve query performance |
| **Plan for scale** | Consider future growth in data volume |
| **Document your models** | Schema documentation helps team collaboration |

---

## 7. Summary

* **Data modeling** translates business requirements into structured database designs at three levels: conceptual, logical, and physical.
* **ORM/ODM frameworks** (SQLAlchemy, Mongoose) allow developers to interact with databases using objects instead of raw SQL.
* **Validation** (Pydantic, Mongoose schemas) ensures data integrity before storage.
* Proper data modeling is essential for building maintainable, scalable backend applications.
* Always design your data models before writing application code.

### Key Takeaways

* Data modeling has three levels: conceptual, logical, and physical.
* ORM maps objects to database tables; ODM maps objects to documents.
* SQLAlchemy (Python) and Mongoose (Node.js) are popular ORM/ODM frameworks.
* Validation prevents invalid data from entering the database.
* Good data models are self-documenting and support future growth.

In **L16 – CRUD Operations: Create, Read, Update, Delete in Databases**, you will implement full CRUD functionality using your data models.

---

### Lab Exercise

1. Design a conceptual data model for an **E-Commerce System** with entities: Product, Order, Customer, Cart.
2. Create SQLAlchemy models for the Student Management System with proper relationships.
3. Implement CRUD operations using SQLAlchemy:
   - Create a new student with department assignment
   - Retrieve all students in a specific branch
   - Update a student's branch
   - Delete a student and verify cascade behavior
4. Create Mongoose schemas for a Blog Application with Post and Comment models.
5. Add validation rules to ensure data integrity (required fields, unique constraints, enum values).