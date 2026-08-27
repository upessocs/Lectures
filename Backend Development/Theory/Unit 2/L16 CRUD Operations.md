# Lecture 16

# CRUD Operations: Create, Read, Update, Delete in Databases

**Course Outcome:** CO2 – Implement complete CRUD functionality in database-backed applications.

---

## 1. Introduction

In L15, we learned about data modeling and ORM/ODM frameworks that map objects to database tables. Now, we will implement the four fundamental operations that form the backbone of every backend application: **CRUD** — Create, Read, Update, and Delete.

**CRUD operations** are the basic operations performed on data in any persistent storage system. Every web application, mobile app, and API ultimately performs these four operations on data.

| Operation | HTTP Method | SQL Statement | Description |
|-----------|-------------|---------------|-------------|
| **Create** | POST | INSERT | Add new records to the database |
| **Read** | GET | SELECT | Retrieve existing records from the database |
| **Update** | PUT/PATCH | UPDATE | Modify existing records in the database |
| **Delete** | DELETE | DELETE | Remove records from the database |

By the end of this lecture, you will have:

1. Understanding of CRUD operations and their mapping to HTTP methods.
2. Skills to implement CRUD using raw SQL and ORM.
3. Knowledge of query filtering, sorting, and pagination.
4. Ability to handle related data in CRUD operations.
5. Hands-on experience building a complete CRUD API.

---

## 2. CRUD Operations Overview

<svg xmlns="http://www.w3.org/2000/svg" width="900" height="250" viewBox="0 0 900 250">
<rect width="900" height="250" fill="white"/>
<text x="450" y="30" text-anchor="middle" font-size="18" font-weight="bold">CRUD Operations Mapping</text>

<!-- Create -->
<rect x="40" y="60" width="180" height="120" rx="8" fill="#E8F8EC" stroke="#43A047"/>
<text x="130" y="85" text-anchor="middle" font-size="16" font-weight="bold">CREATE</text>
<text x="130" y="110" text-anchor="middle" font-size="12">HTTP: POST</text>
<text x="130" y="130" text-anchor="middle" font-size="12">SQL: INSERT</text>
<text x="130" y="150" text-anchor="middle" font-size="12">ORM: .add()/.save()</text>

<!-- Read -->
<rect x="250" y="60" width="180" height="120" rx="8" fill="#EAF4FF" stroke="#1E88E5"/>
<text x="340" y="85" text-anchor="middle" font-size="16" font-weight="bold">READ</text>
<text x="340" y="110" text-anchor="middle" font-size="12">HTTP: GET</text>
<text x="340" y="130" text-anchor="middle" font-size="12">SQL: SELECT</text>
<text x="340" y="150" text-anchor="middle" font-size="12">ORM: .query()/.find()</text>

<!-- Update -->
<rect x="460" y="60" width="180" height="120" rx="8" fill="#FFF8E6" stroke="#FB8C00"/>
<text x="550" y="85" text-anchor="middle" font-size="16" font-weight="bold">UPDATE</text>
<text x="550" y="110" text-anchor="middle" font-size="12">HTTP: PUT/PATCH</text>
<text x="550" y="130" text-anchor="middle" font-size="12">SQL: UPDATE</text>
<text x="550" y="150" text-anchor="middle" font-size="12">ORM: .update()/.save()</text>

<!-- Delete -->
<rect x="670" y="60" width="180" height="120" rx="8" fill="#FCE4EC" stroke="#E53935"/>
<text x="760" y="85" text-anchor="middle" font-size="16" font-weight="bold">DELETE</text>
<text x="760" y="110" text-anchor="middle" font-size="12">HTTP: DELETE</text>
<text x="760" y="130" text-anchor="middle" font-size="12">SQL: DELETE</text>
<text x="760" y="150" text-anchor="middle" font-size="12">ORM: .delete()/.remove()</text>

<text x="450" y="220" text-anchor="middle" font-size="12">Each CRUD operation maps to an HTTP method and SQL statement</text>
</svg>

---

## 3. CREATE Operations

### 3.1 Raw SQL — INSERT

```sql
-- Insert a single record
INSERT INTO students (name, email, branch, enrollment_date)
VALUES ('Aarav', 'aarav@upes.ac.in', 'CSE', '2024-08-01');

-- Insert multiple records
INSERT INTO students (name, email, branch, enrollment_date)
VALUES 
    ('Diya', 'diya@upes.ac.in', 'ECE', '2024-08-01'),
    ('Rohan', 'rohan@upes.ac.in', 'IT', '2024-08-01'),
    ('Priya', 'priya@upes.ac.in', 'CSE', '2024-08-01');

-- Insert with returning the created record
INSERT INTO students (name, email, branch)
VALUES ('Vikram', 'vikram@upes.ac.in', 'ME')
RETURNING id, name, email, branch;
```

### 3.2 SQLAlchemy — Create

```python
from datetime import date

# Create single student
new_student = Student(
    name="Aarav",
    email="aarav@upes.ac.in",
    branch="CSE",
    enrollment_date=date(2024, 8, 1),
    department_id=1
)
session.add(new_student)
session.commit()
print(f"Created student with ID: {new_student.id}")

# Create multiple students
students = [
    Student(name="Diya", email="diya@upes.ac.in", branch="ECE", department_id=2),
    Student(name="Rohan", email="rohan@upes.ac.in", branch="IT", department_id=3),
    Student(name="Priya", email="priya@upes.ac.in", branch="CSE", department_id=1),
]
session.add_all(students)
session.commit()
```

### 3.3 Mongoose — Create

```javascript
// Create single student
const student = new Student({
    name: 'Aarav',
    email: 'aarav@upes.ac.in',
    branch: 'CSE',
    enrollmentDate: new Date('2024-08-01')
});
await student.save();
console.log(`Created student with ID: ${student._id}`);

// Create multiple students
const students = await Student.insertMany([
    { name: 'Diya', email: 'diya@upes.ac.in', branch: 'ECE' },
    { name: 'Rohan', email: 'rohan@upes.ac.in', branch: 'IT' },
    { name: 'Priya', email: 'priya@upes.ac.in', branch: 'CSE' }
]);
```

---

## 4. READ Operations

### 4.1 Raw SQL — SELECT

```sql
-- Select all records
SELECT * FROM students;

-- Select specific columns
SELECT id, name, email FROM students;

-- Filter with WHERE
SELECT * FROM students WHERE branch = 'CSE';

-- Filter with multiple conditions
SELECT * FROM students WHERE branch = 'CSE' AND enrollment_date > '2024-01-01';

-- Order by
SELECT * FROM students ORDER BY name ASC;

-- Limit results
SELECT * FROM students LIMIT 10 OFFSET 20;

-- Count records
SELECT COUNT(*) as total FROM students WHERE branch = 'CSE';

-- Aggregate functions
SELECT branch, COUNT(*) as student_count 
FROM students 
GROUP BY branch;
```

### 4.2 SQLAlchemy — Read

```python
# Select all students
all_students = session.query(Student).all()

# Select specific columns
names_emails = session.query(Student.name, Student.email).all()

# Filter with where
cse_students = session.query(Student).filter(Student.branch == "CSE").all()

# Filter with multiple conditions
filtered = session.query(Student).filter(
    Student.branch == "CSE",
    Student.enrollment_date > date(2024, 1, 1)
).all()

# Order by
ordered = session.query(Student).order_by(Student.name.asc()).all()

# Limit and offset
paginated = session.query(Student).limit(10).offset(20).all()

# Get single record
student = session.query(Student).filter_by(id=1).first()
student = session.query(Student).get(1)  # By primary key

# Count
total = session.query(Student).filter(Student.branch == "CSE").count()

# Check existence
exists = session.query(Student.query.filter_by(email="aarav@upes.ac.in").exists()).scalar()
```

### 4.3 Mongoose — Read

```javascript
// Select all students
const allStudents = await Student.find();

// Select specific fields
const names = await Student.find().select('name email');

// Filter
const cseStudents = await Student.find({ branch: 'CSE' });

// Filter with multiple conditions
const filtered = await Student.find({ 
    branch: 'CSE', 
    enrollmentDate: { $gt: new Date('2024-01-01') } 
});

// Order by
const ordered = await Student.find().sort({ name: 1 }); // 1 = ascending

// Limit and offset
const paginated = await Student.find().skip(20).limit(10);

// Get single record
const student = await Student.findById('studentId');
const student = await Student.findOne({ email: 'aarav@upes.ac.in' });

// Count
const count = await Student.countDocuments({ branch: 'CSE' });

// Chaining queries
const results = await Student
    .find({ branch: 'CSE' })
    .sort({ name: 1 })
    .select('name email')
    .limit(10);
```

---

## 5. UPDATE Operations

### 5.1 Raw SQL — UPDATE

```sql
-- Update single column
UPDATE students SET branch = 'ECE' WHERE id = 1;

-- Update multiple columns
UPDATE students 
SET branch = 'ECE', email = 'aarav_new@upes.ac.in' 
WHERE id = 1;

-- Update with condition
UPDATE students 
SET branch = 'CSE' 
WHERE branch = 'IT' AND enrollment_date < '2024-01-01';

-- Update all records
UPDATE students SET created_at = CURRENT_TIMESTAMP;

-- Update and return
UPDATE students SET branch = 'ECE' WHERE id = 1 RETURNING *;
```

### 5.2 SQLAlchemy — Update

```python
# Update single record
student = session.query(Student).filter_by(id=1).first()
student.branch = "ECE"
session.commit()

# Update multiple fields
session.query(Student).filter_by(id=1).update({
    "branch": "ECE",
    "email": "aarav_new@upes.ac.in"
})
session.commit()

# Bulk update
session.query(Student).filter(
    Student.branch == "IT",
    Student.enrollment_date < date(2024, 1, 1)
).update({"branch": "CSE"})
session.commit()
```

### 5.3 Mongoose — Update

```javascript
// Update single record
const student = await Student.findByIdAndUpdate(
    'studentId',
    { branch: 'ECE' },
    { new: true } // Return updated document
);

// Update with validation
const student = await Student.findOneAndUpdate(
    { email: 'aarav@upes.ac.in' },
    { branch: 'ECE' },
    { new: true, runValidators: true }
);

// Bulk update
const result = await Student.updateMany(
    { branch: 'IT' },
    { $set: { branch: 'CSE' } }
);
```

---

## 6. DELETE Operations

### 6.1 Raw SQL — DELETE

```sql
-- Delete single record
DELETE FROM students WHERE id = 1;

-- Delete with condition
DELETE FROM students WHERE branch = 'ME' AND enrollment_date < '2023-01-01';

-- Delete all records
DELETE FROM students;

-- Delete and return
DELETE FROM students WHERE id = 1 RETURNING *;
```

### 6.2 SQLAlchemy — Delete

```python
# Delete single record
student = session.query(Student).filter_by(id=1).first()
session.delete(student)
session.commit()

# Bulk delete
session.query(Student).filter(Student.branch == "ME").delete()
session.commit()
```

### 6.3 Mongoose — Delete

```javascript
// Delete single record
const student = await Student.findByIdAndDelete('studentId');

// Delete with condition
const result = await Student.deleteMany({ branch: 'ME' });

// Soft delete (mark as deleted instead of removing)
await Student.findByIdAndUpdate('studentId', { deleted: true });
```

---

## 7. Query Filtering, Sorting, and Pagination

### 7.1 Filtering Patterns

**SQLAlchemy:**

```python
# Exact match
students = session.query(Student).filter(Student.branch == "CSE").all()

# Not equal
students = session.query(Student).filter(Student.branch != "CSE").all()

# In list
students = session.query(Student).filter(Student.branch.in_(["CSE", "ECE"])).all()

# Like pattern
students = session.query(Student).filter(Student.name.like("%aarav%")).all()

# Is null
students = session.query(Student).filter(Student.phone.is_(None)).all()

# Between
students = session.query(Student).filter(
    Student.enrollment_date.between(date(2024, 1, 1), date(2024, 12, 31))
).all()
```

**Mongoose:**

```javascript
// Exact match
const students = await Student.find({ branch: 'CSE' });

// Not equal
const students = await Student.find({ branch: { $ne: 'CSE' } });

// In list
const students = await Student.find({ branch: { $in: ['CSE', 'ECE'] } });

// Regex
const students = await Student.find({ name: /aarav/i });

// Greater than
const students = await Student.find({ age: { $gt: 18 } });

// Combined
const students = await Student.find({
    branch: { $in: ['CSE', 'ECE'] },
    enrollmentDate: { $gte: new Date('2024-01-01') }
});
```

### 7.2 Sorting

**SQLAlchemy:**

```python
# Ascending
students = session.query(Student).order_by(Student.name.asc()).all()

# Descending
students = session.query(Student).order_by(Student.name.desc()).all()

# Multiple fields
students = session.query(Student).order_by(
    Student.branch.asc(),
    Student.name.asc()
).all()
```

**Mongoose:**

```javascript
// Ascending
const students = await Student.find().sort({ name: 1 });

// Descending
const students = await Student.find().sort({ name: -1 });

// Multiple fields
const students = await Student.find().sort({ branch: 1, name: 1 });
```

### 7.3 Pagination

**SQLAlchemy:**

```python
page = 1
per_page = 10
offset = (page - 1) * per_page

students = session.query(Student).offset(offset).limit(per_page).all()
total = session.query(Student).count()
total_pages = (total + per_page - 1) // per_page
```

**Mongoose:**

```javascript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const students = await Student.find()
    .skip(skip)
    .limit(limit)
    .sort({ name: 1 });

const total = await Student.countDocuments();
const totalPages = Math.ceil(total / limit);
```

---

## 8. Handling Related Data

### 8.1 Creating Related Records

**SQLAlchemy:**

```python
# Create student with department
department = session.query(Department).filter_by(id=1).first()
student = Student(
    name="Aarav",
    email="aarav@upes.ac.in",
    department=department
)
session.add(student)
session.commit()

# Create enrollment
student = session.query(Student).filter_by(id=1).first()
course = session.query(Course).filter_by(id="CS301").first()
enrollment = Enrollment(student=student, course=course, semester="Fall 2024")
session.add(enrollment)
session.commit()
```

**Mongoose:**

```javascript
// Create student with courses
const student = new Student({
    name: 'Aarav',
    email: 'aarav@upes.ac.in',
    courses: ['courseId1', 'courseId2']
});
await student.save();

// Populate related data
const studentWithCourses = await Student.findById(studentId).populate('courses');
```

### 8.2 Querying Related Data

**SQLAlchemy (Eager Loading):**

```python
from sqlalchemy.orm import joinedload

# Load student with department
student = session.query(Student).options(
    joinedload(Student.department)
).filter_by(id=1).first()
print(student.department.name)

# Load student with enrollments and courses
student = session.query(Student).options(
    joinedload(Student.enrollments).joinedload(Enrollment.course)
).filter_by(id=1).first()
```

**Mongoose:**

```javascript
// Populate single reference
const student = await Student.findById(id).populate('department');

// Populate nested references
const student = await Student.findById(id)
    .populate({
        path: 'enrollments',
        populate: { path: 'course' }
    });
```

---

## 9. Summary

* **CRUD operations** are the foundation of every backend application — Create, Read, Update, Delete.
* Each CRUD operation maps to HTTP methods (POST, GET, PUT/PATCH, DELETE) and SQL statements (INSERT, SELECT, UPDATE, DELETE).
* **Query filtering**, **sorting**, and **pagination** are essential for managing large datasets.
* **Related data** can be created and queried using foreign keys (SQL) or references (NoSQL).
* ORM/ODM frameworks simplify CRUD operations by providing object-oriented interfaces.

### Key Takeaways

* CRUD operations form the backbone of all data-driven applications.
* INSERT creates records; SELECT reads them; UPDATE modifies them; DELETE removes them.
* Filtering, sorting, and pagination are essential for user-friendly data access.
* Related data is handled through foreign keys (SQLAlchemy) or references (Mongoose).
* Always validate data before performing CRUD operations.

In **L17 – Query Optimization: Indexing and Performance Tuning**, you will learn how to make your database queries faster and more efficient.

---

### Lab Exercise

1. Implement a complete CRUD API for a **Course** resource using FastAPI and SQLAlchemy.
2. Add filtering to retrieve courses by department and credits.
3. Implement pagination to retrieve courses page by page (10 courses per page).
4. Create a **Student** model with a foreign key to **Department** and implement CRUD with related data.
5. Write SQL queries to:
   - Find all students enrolled after August 2024
   - Count students in each branch
   - Find students who are enrolled in more than 3 courses
6. Test your API using Postman and verify all CRUD operations work correctly.