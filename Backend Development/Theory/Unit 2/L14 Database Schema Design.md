# Lecture 14

# Database Schema Design: ER Diagrams, Normalization, Relationships

**Course Outcome:** CO2 – Design effective database schemas using ER diagrams and normalization techniques.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 14 |
| Unit | Unit 2: Database Management |
| Topic | Database Schema Design: ER Diagrams, Normalization, Relationships |
| Course Outcome | CO2 |
| Bloom's Knowledge Level | Create |
| Skills Developed | ER diagramming, Database normalization, Relationship modeling, Schema design |
| Applications | Database architecture, Data integrity, Efficient query design |
| PBL Activity | Drawing ER diagrams and normalizing real-world data |
| Assessment Method | Coding project & Normalized schema demonstration |

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

The notation below is what every ER diagram in this course uses. Note that a **primary key** and a **foreign key** are not separate shapes — they are just an attribute written with a solid or dashed underline.

<svg xmlns="http://www.w3.org/2000/svg" width="960" height="340" viewBox="0 0 960 340">
<rect width="960" height="340" fill="white"/>
<text x="480" y="30" text-anchor="middle" font-size="20" font-weight="bold" font-family="Arial">ER Diagram Notation</text>

<!-- Entity -->
<rect x="30" y="65" width="170" height="75" rx="6" fill="#EAF4FF" stroke="#1E88E5" stroke-width="2"/>
<text x="115" y="107" text-anchor="middle" font-size="16" font-family="Arial" font-weight="bold">Student</text>
<text x="115" y="165" text-anchor="middle" font-size="13" font-family="Arial" font-weight="bold" fill="#1E88E5">Entity</text>
<text x="115" y="183" text-anchor="middle" font-size="11" font-family="Arial" fill="#555">Rectangle = a table</text>

<!-- Attribute -->
<ellipse cx="330" cy="102" rx="85" ry="35" fill="#E8F8EC" stroke="#43A047" stroke-width="2"/>
<text x="330" y="107" text-anchor="middle" font-size="15" font-family="Arial">email</text>
<text x="330" y="165" text-anchor="middle" font-size="13" font-family="Arial" font-weight="bold" fill="#43A047">Attribute</text>
<text x="330" y="183" text-anchor="middle" font-size="11" font-family="Arial" fill="#555">Oval = a column</text>

<!-- Key attribute -->
<ellipse cx="560" cy="102" rx="85" ry="35" fill="#F3E5F5" stroke="#8E24AA" stroke-width="2"/>
<text x="560" y="107" text-anchor="middle" font-size="15" font-family="Arial" text-decoration="underline">id</text>
<text x="560" y="165" text-anchor="middle" font-size="13" font-family="Arial" font-weight="bold" fill="#8E24AA">Key Attribute</text>
<text x="560" y="183" text-anchor="middle" font-size="11" font-family="Arial" fill="#555">Underlined = primary key</text>

<!-- Relationship diamond -->
<polygon points="850,55 930,102 850,149 770,102" fill="#FFF8E6" stroke="#FB8C00" stroke-width="2"/>
<text x="850" y="107" text-anchor="middle" font-size="14" font-family="Arial" font-weight="bold">enrolls</text>
<text x="850" y="165" text-anchor="middle" font-size="13" font-family="Arial" font-weight="bold" fill="#FB8C00">Relationship</text>
<text x="850" y="183" text-anchor="middle" font-size="11" font-family="Arial" fill="#555">Diamond = an action/verb</text>

<!-- Cardinality strip -->
<rect x="30" y="225" width="420" height="95" rx="6" fill="#FDFDFD" stroke="#999" stroke-width="1"/>
<text x="240" y="250" text-anchor="middle" font-size="13" font-family="Arial" font-weight="bold">Cardinality</text>
<rect x="50" y="270" width="90" height="34" rx="4" fill="#EAF4FF" stroke="#1E88E5" stroke-width="1.5"/>
<text x="95" y="292" text-anchor="middle" font-size="12" font-family="Arial">Student</text>
<line x1="140" y1="287" x2="300" y2="287" stroke="black" stroke-width="2"/>
<text x="158" y="280" font-size="13" font-family="Arial" font-weight="bold">M</text>
<text x="278" y="280" font-size="13" font-family="Arial" font-weight="bold">N</text>
<rect x="300" y="270" width="90" height="34" rx="4" fill="#E8F8EC" stroke="#43A047" stroke-width="1.5"/>
<text x="345" y="292" text-anchor="middle" font-size="12" font-family="Arial">Course</text>
<text x="240" y="315" text-anchor="middle" font-size="11" font-family="Arial" fill="#555">Numbers/letters on the line show how many rows on each side can relate</text>

<!-- Foreign key strip -->
<rect x="490" y="225" width="440" height="95" rx="6" fill="#E0F7FA" stroke="#00ACC1" stroke-width="1.5"/>
<text x="710" y="250" text-anchor="middle" font-size="13" font-family="Arial" font-weight="bold" fill="#006064">Foreign Key (shown once tables are derived)</text>
<text x="520" y="280" font-size="13" font-family="Arial">department_id</text>
<line x1="520" y1="285" x2="640" y2="285" stroke="#00838F" stroke-width="1.5" stroke-dasharray="4,3"/>
<text x="710" y="305" text-anchor="middle" font-size="11" font-family="Arial" fill="#555">Dashed underline = column referencing another table's primary key</text>
</svg>

### 2.3 Annotated Example — Explaining Every Component Together

Before looking at a full system diagram, study this one relationship in isolation. Every numbered label below points at one piece of ER notation, so you can see how the pieces in section 2.2 combine in practice.

<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="560" viewBox="0 0 1100 560">
<rect width="1100" height="560" fill="white"/>
<text x="550" y="30" text-anchor="middle" font-size="20" font-weight="bold" font-family="Arial">Annotated Example: "A Student Enrolls in a Course"</text>

<!-- Student entity -->
<rect x="140" y="230" width="150" height="60" rx="6" fill="#EAF4FF" stroke="#1E88E5" stroke-width="2"/>
<text x="215" y="266" text-anchor="middle" font-size="15" font-weight="bold" font-family="Arial">Student</text>

<!-- Student attributes -->
<line x1="215" y1="230" x2="215" y2="170" stroke="#43A047" stroke-width="1.5"/>
<ellipse cx="215" cy="140" rx="62" ry="28" fill="#F3E5F5" stroke="#8E24AA" stroke-width="2"/>
<text x="215" y="145" text-anchor="middle" font-size="13" font-family="Arial" text-decoration="underline">id</text>

<line x1="170" y1="238" x2="110" y2="150" stroke="#43A047" stroke-width="1.5"/>
<ellipse cx="95" cy="120" rx="60" ry="28" fill="#E8F8EC" stroke="#43A047" stroke-width="2"/>
<text x="95" y="125" text-anchor="middle" font-size="13" font-family="Arial">name</text>

<line x1="150" y1="285" x2="100" y2="350" stroke="#43A047" stroke-width="1.5"/>
<ellipse cx="95" cy="380" rx="60" ry="28" fill="#E8F8EC" stroke="#43A047" stroke-width="2"/>
<text x="95" y="385" text-anchor="middle" font-size="13" font-family="Arial">email</text>

<!-- Relationship diamond -->
<polygon points="480,225 560,260 480,295 400,260" fill="#FFF8E6" stroke="#FB8C00" stroke-width="2"/>
<text x="480" y="265" text-anchor="middle" font-size="14" font-weight="bold" font-family="Arial">Enrolls</text>

<!-- lines Student-Enrolls -->
<line x1="290" y1="257" x2="400" y2="258" stroke="black" stroke-width="2"/>
<text x="305" y="250" font-size="13" font-weight="bold" font-family="Arial">M</text>

<!-- relationship attribute -->
<line x1="480" y1="295" x2="480" y2="345" stroke="#FB8C00" stroke-width="1.5"/>
<ellipse cx="480" cy="375" rx="75" ry="28" fill="#FFF8E6" stroke="#FB8C00" stroke-width="2"/>
<text x="480" y="380" text-anchor="middle" font-size="12" font-family="Arial">enrollment_date</text>

<!-- Course entity -->
<rect x="750" y="230" width="150" height="60" rx="6" fill="#E8F8EC" stroke="#43A047" stroke-width="2"/>
<text x="825" y="266" text-anchor="middle" font-size="15" font-weight="bold" font-family="Arial">Course</text>

<!-- lines Enrolls-Course -->
<line x1="560" y1="259" x2="750" y2="258" stroke="black" stroke-width="2"/>
<text x="700" y="250" font-size="13" font-weight="bold" font-family="Arial">N</text>

<!-- Course attributes -->
<line x1="825" y1="230" x2="825" y2="170" stroke="#43A047" stroke-width="1.5"/>
<ellipse cx="825" cy="140" rx="62" ry="28" fill="#F3E5F5" stroke="#8E24AA" stroke-width="2"/>
<text x="825" y="145" text-anchor="middle" font-size="13" font-family="Arial" text-decoration="underline">id</text>

<line x1="880" y1="238" x2="945" y2="150" stroke="#43A047" stroke-width="1.5"/>
<ellipse cx="965" cy="120" rx="60" ry="28" fill="#E8F8EC" stroke="#43A047" stroke-width="2"/>
<text x="965" y="125" text-anchor="middle" font-size="13" font-family="Arial">title</text>

<line x1="880" y1="282" x2="945" y2="350" stroke="#43A047" stroke-width="1.5"/>
<ellipse cx="965" cy="380" rx="60" ry="28" fill="#E8F8EC" stroke="#43A047" stroke-width="2"/>
<text x="965" y="385" text-anchor="middle" font-size="13" font-family="Arial">credits</text>

<!-- Callout labels -->
<line x1="215" y1="290" x2="215" y2="325" stroke="#1E88E5" stroke-width="1" stroke-dasharray="3,2"/>
<text x="215" y="345" text-anchor="middle" font-size="12" font-family="Arial" fill="#1E88E5" font-weight="bold">(1) Entity — a rectangle</text>

<text x="95" y="210" text-anchor="middle" font-size="11" font-family="Arial" fill="#43A047" font-weight="bold">(2) Attribute</text>
<text x="95" y="225" text-anchor="middle" font-size="10.5" font-family="Arial" fill="#555">an oval, joined to</text>
<text x="95" y="238" text-anchor="middle" font-size="10.5" font-family="Arial" fill="#555">its entity by a line</text>

<text x="215" y="185" text-anchor="middle" font-size="11" font-family="Arial" fill="#8E24AA" font-weight="bold">(3) Primary key</text>
<text x="215" y="200" text-anchor="middle" font-size="10.5" font-family="Arial" fill="#555">underlined attribute</text>

<text x="480" y="205" text-anchor="middle" font-size="11" font-family="Arial" fill="#FB8C00" font-weight="bold">(4) Relationship — a diamond,</text>
<text x="480" y="218" text-anchor="middle" font-size="10.5" font-family="Arial" fill="#555">named with a verb, joins two entities</text>

<text x="345" y="225" text-anchor="middle" font-size="11" font-family="Arial" fill="#333" font-weight="bold">(5) Cardinality</text>
<text x="345" y="238" text-anchor="middle" font-size="10.5" font-family="Arial" fill="#555">M / N on the line</text>

<text x="480" y="425" text-anchor="middle" font-size="11" font-family="Arial" fill="#FB8C00" font-weight="bold">(6) Relationship attribute</text>
<text x="480" y="440" text-anchor="middle" font-size="10.5" font-family="Arial" fill="#555">describes the pairing itself</text>
<text x="480" y="453" text-anchor="middle" font-size="10.5" font-family="Arial" fill="#555">(only meaningful for M:N)</text>

<rect x="700" y="440" width="360" height="90" rx="6" fill="#E0F7FA" stroke="#00ACC1" stroke-width="1.5"/>
<text x="880" y="463" text-anchor="middle" font-size="12" font-weight="bold" font-family="Arial" fill="#006064">(7) Foreign key (not drawn on the ER diagram itself)</text>
<text x="880" y="483" text-anchor="middle" font-size="11" font-family="Arial" fill="#333">When this diagram becomes tables, the M:N relationship</text>
<text x="880" y="499" text-anchor="middle" font-size="11" font-family="Arial" fill="#333">"Enrolls" turns into an enrollments table holding</text>
<text x="880" y="515" text-anchor="middle" font-size="11" font-family="Arial" fill="#333">student_id and course_id as foreign keys.</text>

<text x="550" y="545" text-anchor="middle" font-size="12" font-family="Arial" fill="#555">Read as: Student (M) — Enrolls — (N) Course, i.e. many students enroll in many courses</text>
</svg>

**Walking through the labels:**

1. **Entity** — `Student` and `Course` are each a rectangle, and each becomes one table.
2. **Attribute** — every oval is a column, connected to its entity by a plain line.
3. **Primary key** — the `id` attribute is underlined in both entities; it uniquely identifies each row.
4. **Relationship** — the diamond `Enrolls` is the verb connecting the two entities; it becomes its own table only when the relationship is M:N.
5. **Cardinality** — the letters `M` and `N` on the connecting lines say "many Students to many Courses."
6. **Relationship attribute** — `enrollment_date` belongs to the *pairing* of a specific student and course, not to either entity alone, so it hangs off the diamond.
7. **Foreign key** — this never appears as a shape on the ER diagram; it only appears after you translate the diagram into SQL tables (see 2.4 and section 3.3).

### 2.4 ER Diagram Example — Student Management System

<svg xmlns="http://www.w3.org/2000/svg" width="960" height="520" viewBox="0 0 960 520">
<rect width="960" height="520" fill="white"/>
<text x="480" y="30" text-anchor="middle" font-size="20" font-weight="bold" font-family="Arial">Student Management System — ER Diagram</text>

<!-- Student Entity -->
<rect x="30" y="70" width="220" height="175" rx="8" fill="#EAF4FF" stroke="#1E88E5" stroke-width="2"/>
<text x="140" y="95" text-anchor="middle" font-size="16" font-weight="bold" font-family="Arial">Student</text>
<line x1="30" y1="105" x2="250" y2="105" stroke="#1E88E5" stroke-width="1.5"/>
<text x="50" y="128" font-size="13" font-family="Arial" text-decoration="underline">id</text>
<text x="50" y="150" font-size="13" font-family="Arial">name</text>
<text x="50" y="172" font-size="13" font-family="Arial">email</text>
<text x="50" y="194" font-size="13" font-family="Arial">branch</text>
<text x="50" y="216" font-size="13" font-family="Arial" fill="#00838F">department_id</text>
<line x1="50" y1="221" x2="180" y2="221" stroke="#00838F" stroke-width="1.5" stroke-dasharray="4,3"/>

<!-- Course Entity -->
<rect x="370" y="70" width="220" height="175" rx="8" fill="#E8F8EC" stroke="#43A047" stroke-width="2"/>
<text x="480" y="95" text-anchor="middle" font-size="16" font-weight="bold" font-family="Arial">Course</text>
<line x1="370" y1="105" x2="590" y2="105" stroke="#43A047" stroke-width="1.5"/>
<text x="390" y="128" font-size="13" font-family="Arial" text-decoration="underline">id</text>
<text x="390" y="150" font-size="13" font-family="Arial">title</text>
<text x="390" y="172" font-size="13" font-family="Arial">credits</text>
<text x="390" y="194" font-size="13" font-family="Arial">department</text>

<!-- Faculty Entity -->
<rect x="710" y="70" width="220" height="175" rx="8" fill="#FFF8E6" stroke="#FB8C00" stroke-width="2"/>
<text x="820" y="95" text-anchor="middle" font-size="16" font-weight="bold" font-family="Arial">Faculty</text>
<line x1="710" y1="105" x2="930" y2="105" stroke="#FB8C00" stroke-width="1.5"/>
<text x="730" y="128" font-size="13" font-family="Arial" text-decoration="underline">id</text>
<text x="730" y="150" font-size="13" font-family="Arial">name</text>
<text x="730" y="172" font-size="13" font-family="Arial">department</text>
<text x="730" y="194" font-size="13" font-family="Arial">designation</text>

<!-- Enrolls diamond (between Student and Course) -->
<polygon points="300,335 375,375 300,415 225,375" fill="#F3E5F5" stroke="#8E24AA" stroke-width="2"/>
<text x="300" y="380" text-anchor="middle" font-size="13" font-weight="bold" font-family="Arial">Enrolls</text>

<!-- Teaches diamond (between Faculty and Course) -->
<polygon points="660,335 735,375 660,415 585,375" fill="#E0F7FA" stroke="#00ACC1" stroke-width="2"/>
<text x="660" y="380" text-anchor="middle" font-size="13" font-weight="bold" font-family="Arial">Teaches</text>

<!-- enrollment_date attribute on Enrolls relationship -->
<line x1="300" y1="415" x2="300" y2="450" stroke="#8E24AA" stroke-width="1.5"/>
<ellipse cx="300" cy="475" rx="72" ry="26" fill="#F3E5F5" stroke="#8E24AA" stroke-width="1.5"/>
<text x="300" y="480" text-anchor="middle" font-size="12" font-family="Arial">enrollment_date</text>

<!-- Lines: Student - Enrolls -->
<line x1="140" y1="245" x2="270" y2="360" stroke="black" stroke-width="2"/>
<text x="165" y="270" font-size="14" font-weight="bold" font-family="Arial">M</text>

<!-- Lines: Course - Enrolls -->
<line x1="440" y1="245" x2="335" y2="360" stroke="black" stroke-width="2"/>
<text x="420" y="270" font-size="14" font-weight="bold" font-family="Arial">N</text>

<!-- Lines: Faculty - Teaches -->
<line x1="800" y1="245" x2="685" y2="360" stroke="black" stroke-width="2"/>
<text x="775" y="270" font-size="14" font-weight="bold" font-family="Arial">1</text>

<!-- Lines: Course - Teaches -->
<line x1="500" y1="245" x2="630" y2="360" stroke="black" stroke-width="2"/>
<text x="515" y="270" font-size="14" font-weight="bold" font-family="Arial">M</text>

<text x="480" y="510" text-anchor="middle" font-size="11" font-family="Arial" fill="#555">One student enrolls in many courses and one course has many students (M:N) · One faculty teaches many courses (1:M)</text>
</svg>

Note that the `Enrolls` relationship is correctly marked **M:N** here (many students, many courses) — matching the junction-table example you'll build in section 3.3 — and `department_id` / `Enrolls` both carry the dashed/solid underline convention from section 2.2, so you can read the keys straight off the diagram.

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

This is exactly the table MySQL/PostgreSQL would generate from the `Enrolls` diamond in sections 2.3 and 2.4: the relationship's own attribute (`enrollment_date`) becomes a column, and each entity's primary key becomes a foreign key column in the junction table.

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
