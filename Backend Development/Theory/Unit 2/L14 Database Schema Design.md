# Lecture 14

# Database Schema Design: ER Diagrams, Normalization, Relationships

**Course Outcome:** CO2 – Design effective database schemas using ER diagrams and normalization techniques.

---

## 1. Introduction

In L13, we learned about relational and NoSQL databases and why data persistence is essential for backend applications. However, simply creating tables is not enough — the structure of those tables determines how efficiently data can be stored, retrieved, and maintained. Poor schema design leads to data redundancy, inconsistency, and performance problems.

**Database schema design** is the process of defining the structure, relationships, and constraints of a database. A well-designed schema ensures data integrity, minimizes redundancy, and supports efficient queries.

By the end of this lecture, you will have:

1. Knowledge of Entity-Relationship (ER) diagrams and their components.
2. Understanding of database normalization and its normal forms.
3. The ability to design schemas with proper relationships (1:1, 1:M, M:N).
4. Skills to apply normalization techniques to real-world scenarios.
5. Hands-on experience creating a normalized database schema.

---

## 2. Entity-Relationship (ER) Diagrams

An **ER diagram** is a visual representation of a database schema. It shows entities, their attributes, and the relationships between entities.

### 2.1 Components of ER Diagrams

**Entities**

An **entity** is a real-world object or concept that can be distinctly identified. Entities become tables in a database.

Examples: Student, Course, Faculty, Department

**Attributes**

**Attributes** are properties that describe an entity. Attributes become columns in a table.

Examples: Student has attributes like `id`, `name`, `email`, `branch`

**Relationships**

**Relationships** describe how entities interact with each other.

Examples: A Student *enrolls in* a Course; a Faculty *teaches* a Course

### 2.2 ER Diagram Notation

<svg xmlns="http://www.w3.org/2000/svg" width="900" height="250" viewBox="0 0 900 250">
<rect width="900" height="250" fill="white"/>
<text x="450" y="30" text-anchor="middle" font-size="18" font-weight="bold">ER Diagram Notation</text>

<!-- Entity -->
<rect x="40" y="60" width="150" height="80" rx="8" fill="#EAF4FF" stroke="#1E88E5"/>
<text x="115" y="90" text-anchor="middle" font-size="14" font-weight="bold">Entity</text>
<text x="115" y="110" text-anchor="middle" font-size="11">Rectangle</text>
<text x="115" y="130" text-anchor="middle" font-size="11">Student, Course</text>

<!-- Attribute -->
<ellipse cx="300" cy="100" rx="70" ry="30" fill="#E8F8EC" stroke="#43A047"/>
<text x="300" y="95" text-anchor="middle" font-size="14" font-weight="bold">Attribute</text>
<text x="300" y="115" text-anchor="middle" font-size="11">Ellipse</text>

<!-- Relationship -->
<rect x="420" y="70" width="150" height="60" rx="0" fill="#FFF8E6" stroke="#FB8C00" transform="rotate(45 495 100)"/>
<text x="495" y="105" text-anchor="middle" font-size="14" font-weight="bold">Relationship</text>
<text x="495" y="125" text-anchor="middle" font-size="11">Diamond</text>

<!-- Primary Key -->
<rect x="600" y="60" width="150" height="80" rx="8" fill="#F3E5F5" stroke="#8E24AA"/>
<text x="675" y="90" text-anchor="middle" font-size="14" font-weight="bold">Primary Key</text>
<text x="675" y="110" text-anchor="middle" font-size="11">Underlined Attribute</text>
<text x="675" y="130" text-anchor="middle" font-size="11">Unique Identifier</text>

<!-- Foreign Key -->
<rect x="780" y="60" width="100" height="80" rx="8" fill="#E0F7FA" stroke="#00ACC1"/>
<text x="830" y="90" text-anchor="middle" font-size="14" font-weight="bold">Foreign Key</text>
<text x="830" y="110" text-anchor="middle" font-size="11">Dashed Underline</text>

<text x="450" y="220" text-anchor="middle" font-size="12">ER diagrams provide a blueprint before writing SQL CREATE statements</text>
</svg>

### 2.3 ER Diagram Example — Student Management System

<svg xmlns="http://www.w3.org/2000/svg" width="900" height="350" viewBox="0 0 900 350">
<rect width="900" height="350" fill="white"/>
<text x="450" y="30" text-anchor="middle" font-size="18" font-weight="bold">Student Management System - ER Diagram</text>

<!-- Student Entity -->
<rect x="40" y="80" width="200" height="160" rx="8" fill="#EAF4FF" stroke="#1E88E5"/>
<text x="140" y="105" text-anchor="middle" font-size="16" font-weight="bold">Student</text>
<line x1="40" y1="115" x2="240" y2="115" stroke="#1E88E5"/>
<text x="60" y="135" font-size="12"><tspan text-decoration="underline">id</tspan></text>
<text x="60" y="155" font-size="12">name</text>
<text x="60" y="175" font-size="12">email</text>
<text x="60" y="195" font-size="12">branch</text>
<text x="60" y="215" font-size="12">enrollment_date</text>

<!-- Course Entity -->
<rect x="350" y="80" width="200" height="160" rx="8" fill="#E8F8EC" stroke="#43A047"/>
<text x="450" y="105" text-anchor="middle" font-size="16" font-weight="bold">Course</text>
<line x1="350" y1="115" x2="550" y2="115" stroke="#43A047"/>
<text x="370" y="135" font-size="12"><tspan text-decoration="underline">id</tspan></text>
<text x="370" y="155" font-size="12">title</text>
<text x="370" y="175" font-size="12">credits</text>
<text x="370" y="195" font-size="12">department</text>

<!-- Faculty Entity -->
<rect x="660" y="80" width="200" height="160" rx="8" fill="#FFF8E6" stroke="#FB8C00"/>
<text x="760" y="105" text-anchor="middle" font-size="16" font-weight="bold">Faculty</text>
<line x1="660" y1="115" x2="860" y2="115" stroke="#FB8C00"/>
<text x="680" y="135" font-size="12"><tspan text-decoration="underline">id</tspan></text>
<text x="680" y="155" font-size="12">name</text>
<text x="680" y="175" font-size="12">department</text>
<text x="680" y="195" font-size="12">designation</text>

<!-- Enrollment Relationship -->
<rect x="220" y="280" width="120" height="40" rx="0" fill="#F3E5F5" stroke="#8E24AA" transform="rotate(0 280 300)"/>
<text x="280" y="305" text-anchor="middle" font-size="12" font-weight="bold">Enrolls</text>

<!-- Teaches Relationship -->
<rect x="560" y="280" width="120" height="40" rx="0" fill="#E0F7FA" stroke="#00ACC1" transform="rotate(0 620 300)"/>
<text x="620" y="305" text-anchor="middle" font-size="12" font-weight="bold">Teaches</text>

<!-- Lines from Student to Enrolls -->
<line x1="140" y1="240" x2="280" y2="280" stroke="black" stroke-width="2"/>
<!-- Lines from Course to Enrolls -->
<line x1="450" y1="240" x2="280" y2="280" stroke="black" stroke-width="2"/>
<!-- Lines from Faculty to Teaches -->
<line x1="760" y1="240" x2="620" y2="280" stroke="black" stroke-width="2"/>
<!-- Lines from Course to Teaches -->
<line x1="450" y1="240" x2="620" y2="280" stroke="black" stroke-width="2"/>

<!-- Cardinality -->
<text x="200" y="265" font-size="10">1</text>
<text x="370" y="265" font-size="10">M</text>
<text x="530" y="265" font-size="10">1</text>
<text x="690" y="265" font-size="10">M</text>
</svg>

---

## 3. Relationships in Detail

### 3.1 One-to-One (1:1)

One record in Table A relates to exactly one record in Table B.

Example: Student ↔ StudentProfile

```
students (1) ──────── (1) student_profiles
```

Use case: When an entity has optional or extended attributes stored separately.

```sql
CREATE TABLE student_profiles (
    student_id INT PRIMARY KEY,
    passport_number VARCHAR(50),
    blood_group VARCHAR(5),
    FOREIGN KEY (student_id) REFERENCES students(id)
);
```

### 3.2 One-to-Many (1:M)

One record in Table A relates to many records in Table B.

Example: Department → Students

```
departments (1) ──────── (M) students
```

Use case: A department has many students; a student belongs to one department.

```sql
CREATE TABLE departments (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE students (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);
```

### 3.3 Many-to-Many (M:N)

Many records in Table A relate to many records in Table B. This requires a **junction table** (also called a bridge table).

Example: Students ↔ Courses

```
students (M) ──────── (M) courses
         \                /
          enrollments
           (junction)
```

```sql
CREATE TABLE enrollments (
    student_id INT,
    course_id INT,
    enrollment_date DATE,
    grade VARCHAR(2),
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

---

## 4. Database Normalization

**Normalization** is the process of organizing data to reduce redundancy and improve data integrity. It involves decomposing tables into smaller, well-structured tables and defining relationships between them.

### 4.1 Problems Without Normalization

Consider this unnormalized `student_courses` table:

| student_id | student_name | student_email | course1 | course2 | course3 |
|------------|--------------|---------------|---------|---------|---------|
| 1 | Aarav | aarav@upes | CS301 | CS302 | MA201 |
| 2 | Diya | diya@upes | CS301 | EC201 | NULL |

**Problems:**

* **Data redundancy** — student name and email repeated for each course
* **Update anomaly** — changing Aarav's email requires updating multiple rows
* **Insertion anomaly** — cannot add a student without a course
* **Deletion anomaly** — deleting all courses deletes the student

### 4.2 Normal Forms

**First Normal Form (1NF)**

* Each column contains atomic (indivisible) values
* Each row is unique
* No repeating groups

Bad (violates 1NF):

| id | name | courses |
|----|------|---------|
| 1 | Aarav | CS301, CS302, MA201 |

Good (follows 1NF):

| student_id | course_id |
|------------|-----------|
| 1 | CS301 |
| 1 | CS302 |
| 1 | MA201 |

**Second Normal Form (2NF)**

* Must be in 1NF
* Every non-key attribute depends on the entire primary key (no partial dependencies)

**Third Normal Form (3NF)**

* Must be in 2NF
* No transitive dependencies (non-key attributes should not depend on other non-key attributes)

### 4.3 Normalization Example

**Unnormalized Table:**

| student_id | name | branch | course_id | course_name | faculty_id | faculty_name |
|------------|------|--------|-----------|-------------|------------|--------------|
| 1 | Aarav | CSE | CS301 | DSA | F01 | Dr. Sharma |
| 1 | Aarav | CSE | CS302 | OS | F02 | Dr. Verma |
| 2 | Diya | ECE | EC201 | Signals | F03 | Dr. Gupta |

**After Normalization:**

Students Table:
| id | name | branch |
|----|------|--------|
| 1 | Aarav | CSE |
| 2 | Diya | ECE |

Courses Table:
| id | name | faculty_id |
|----|------|------------|
| CS301 | DSA | F01 |
| CS302 | OS | F02 |
| EC201 | Signals | F03 |

Enrollments Table:
| student_id | course_id |
|------------|-----------|
| 1 | CS301 |
| 1 | CS302 |
| 2 | EC201 |

Faculty Table:
| id | name |
|----|------|
| F01 | Dr. Sharma |
| F02 | Dr. Verma |
| F03 | Dr. Gupta |

---

## 5. Schema Design Best Practices

| Practice | Description |
|----------|-------------|
| **Use meaningful names** | `students` not `table1`; `enrollment_date` not `col2` |
| **Primary keys** | Use auto-incrementing integers or UUIDs |
| **Foreign keys** | Always define foreign key constraints |
| **Data types** | Use appropriate types (INT for IDs, VARCHAR for text, DATE for dates) |
| **NOT NULL** | Mark required fields as NOT NULL |
| **UNIQUE constraints** | Ensure uniqueness for emails, usernames |
| **Indexes** | Add indexes on frequently queried columns |
| **Default values** | Provide defaults for optional fields |
| **Timestamps** | Include `created_at` and `updated_at` columns |
| **Avoid SELECT *** | Always specify columns in queries |

---

## 6. Summary

* **ER diagrams** provide a visual blueprint of database structure with entities, attributes, and relationships.
* **Relationships** (1:1, 1:M, M:N) define how entities interact and determine foreign key placement.
* **Normalization** reduces data redundancy and prevents anomalies through normal forms (1NF, 2NF, 3NF).
* **Schema design** is a critical step before implementing databases — good design ensures data integrity and performance.
* Always plan your schema with ER diagrams before writing SQL CREATE statements.

### Key Takeaways

* ER diagrams visualize entities, attributes, and relationships before implementation.
* 1:M relationships use foreign keys; M:N relationships require junction tables.
* Normalization eliminates redundancy through progressive normal forms (1NF → 2NF → 3NF).
* Meaningful naming, proper data types, and constraints are essential for maintainable schemas.
* Schema design directly impacts application performance and data integrity.

In **L15 – Data Modeling: Designing Models for Applications**, you will learn how to translate ER diagrams into actual database tables and application models.

---

### Lab Exercise

1. Draw an ER diagram for a **Library Management System** with entities: Book, Member, Loan, Author.
2. Design the schema with proper relationships (a Book can have multiple Authors; a Member can borrow multiple Books).
3. Write SQL `CREATE TABLE` statements with primary keys, foreign keys, and constraints.
4. Normalize the following table to 3NF:

| order_id | customer_name | customer_email | product_name | product_price | quantity |
|----------|---------------|----------------|--------------|---------------|----------|
| 1 | Aarav | aarav@email | Laptop | 65000 | 1 |
| 1 | Aarav | aarav@email | Mouse | 500 | 2 |
| 2 | Diya | diya@email | Keyboard | 1500 | 1 |

5. Create the normalized tables in MySQL/PostgreSQL and insert sample data.