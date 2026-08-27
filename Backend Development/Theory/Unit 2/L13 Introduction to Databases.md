# Lecture 13

# Introduction to Databases: Relational vs NoSQL Databases

**Course Outcome:** CO1 – Understand the role of databases in backend development and differentiate between relational and NoSQL databases.

---

## 1. Introduction

In L11, we learned how to render dynamic HTML using template engines like EJS and Jinja2. However, template engines only handle presentation — they do not store or manage data. Every real-world application needs a way to persist information: student records, product catalogs, user accounts, transaction histories, and more. This persistent storage is provided by **databases**.

A **database** is an organized collection of structured or unstructured data that can be easily accessed, managed, and updated. Databases are the backbone of backend development — without them, applications would lose all data when the server restarts.

By the end of this lecture, you will have:

1. An understanding of what databases are and why they are essential.
2. Knowledge of the two major database categories: relational (SQL) and NoSQL.
3. The ability to compare relational and NoSQL databases based on structure, scalability, and use cases.
4. Familiarity with popular database systems (MySQL, PostgreSQL, MongoDB).
5. Hands-on experience connecting a backend application to a database.

---

## 2. Why Do We Need Databases?

Before databases, applications stored data in flat files (text files, CSV files, Excel spreadsheets). This approach had severe limitations:

| Problem | Description |
|---------|-------------|
| **No concurrent access** | Multiple users cannot safely read/write simultaneously |
| **No data integrity** | No constraints to prevent invalid data |
| **No relationships** | Cannot link related data across files |
| **No indexing** | Searching large files is extremely slow |
| **No security** | No user authentication or access control |
| **No backup/recovery** | Data loss is permanent |

Databases solve all these problems by providing:

* **Data persistence** — data survives server restarts
* **Concurrent access** — multiple users can read/write safely
* **Data integrity** — constraints ensure valid data
* **Relationships** — link related data across tables/collections
* **Indexing** — fast searches even on millions of records
* **Security** — user authentication and access control
* **Backup and recovery** — protect against data loss
* **ACID transactions** — ensure consistency during operations

---

## 3. Database Management Systems (DBMS)

A **Database Management System (DBMS)** is software that interacts with users, applications, and the database itself to capture and analyze data. It provides an interface for creating, reading, updating, and deleting data (CRUD operations).

Popular DBMS categories:

| Category | Examples | Data Model |
|----------|----------|------------|
| Relational (SQL) | MySQL, PostgreSQL, SQLite, Oracle | Tables with rows and columns |
| Document (NoSQL) | MongoDB, CouchDB | JSON-like documents |
| Key-Value (NoSQL) | Redis, DynamoDB | Key-value pairs |
| Column-Family (NoSQL) | Cassandra, HBase | Column families |
| Graph (NoSQL) | Neo4j, ArangoDB | Nodes and relationships |

---

## 4. Relational Databases (SQL)

A **relational database** organizes data into **tables** (also called relations). Each table consists of **rows** (records) and **columns** (attributes). Tables can be related to each other through **keys**.

### 4.1 Key Concepts

**Tables**

A table is a two-dimensional structure containing rows and columns. Each row represents a single record, and each column represents an attribute.

Example — `students` table:

| id | name | branch | email |
|----|------|--------|-------|
| 1 | Aarav | CSE | aarav@upes.ac.in |
| 2 | Diya | ECE | diya@upes.ac.in |
| 3 | Rohan | IT | rohan@upes.ac.in |

**Primary Key**

A **primary key** is a unique identifier for each row in a table. No two rows can have the same primary key, and it cannot be NULL.

```sql
CREATE TABLE students (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    branch VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);
```

**Foreign Key**

A **foreign key** is a column that references the primary key of another table. It creates relationships between tables.

```sql
CREATE TABLE enrollments (
    id INT PRIMARY KEY,
    student_id INT,
    course_id INT,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

**SQL (Structured Query Language)**

SQL is the standard language for interacting with relational databases. Common operations:

```sql
-- Create
INSERT INTO students (id, name, branch, email) VALUES (4, 'Priya', 'CSE', 'priya@upes.ac.in');

-- Read
SELECT * FROM students WHERE branch = 'CSE';

-- Update
UPDATE students SET branch = 'ECE' WHERE id = 1;

-- Delete
DELETE FROM students WHERE id = 4;
```

### 4.2 ACID Properties

Relational databases guarantee **ACID** properties for transactions:

| Property | Description |
|----------|-------------|
| **Atomicity** | All operations in a transaction complete or none do |
| **Consistency** | Database moves from one valid state to another |
| **Isolation** | Concurrent transactions don't interfere with each other |
| **Durability** | Committed data survives system failures |

### 4.3 Popular Relational Databases

| Database | Use Case | Key Feature |
|----------|----------|-------------|
| **MySQL** | Web applications | Fast, open-source, large community |
| **PostgreSQL** | Complex queries, analytics | Advanced features, JSON support |
| **SQLite** | Embedded, mobile apps | Serverless, zero-config |
| **Oracle** | Enterprise applications | Commercial, highly scalable |
| **MS SQL Server** | Enterprise (Microsoft) | Integration with .NET ecosystem |

---

## 5. NoSQL Databases

**NoSQL** (Not Only SQL) databases are designed for flexible data models, horizontal scaling, and rapid development. They do not use the traditional table-based relational model.

### 5.1 Types of NoSQL Databases

**Document Databases**

Store data as JSON-like documents. Each document can have a different structure.

Example — MongoDB document:

```json
{
  "_id": "ObjectId('64a1b2c3d4e5f6a7b8c9d0e1')",
  "name": "Aarav",
  "branch": "CSE",
  "email": "aarav@upes.ac.in",
  "courses": ["CS301", "CS302", "MA201"],
  "address": {
    "city": "Dehradun",
    "state": "Uttarakhand"
  }
}
```

**Key-Value Databases**

Store data as key-value pairs. Optimized for fast reads and writes.

Example — Redis:

```
SET student:1 "Aarav"
GET student:1  → "Aarav"
```

**Column-Family Databases**

Store data in columns rather than rows. Optimized for queries over large datasets.

**Graph Databases**

Store data as nodes and relationships. Ideal for social networks, recommendation engines.

---

## 6. Relational vs NoSQL — Comparison

| Aspect | Relational (SQL) | NoSQL |
|--------|------------------|-------|
| **Data Model** | Tables with rows/columns | Documents, key-value, graph, column |
| **Schema** | Fixed schema (predefined) | Dynamic schema (flexible) |
| **Relationships** | Foreign keys, JOINs | Embedded documents or references |
| **Scalability** | Vertical (bigger server) | Horizontal (more servers) |
| **ACID** | Full ACID support | Eventual consistency (BASE) |
| **Query Language** | SQL | Database-specific APIs |
| **Best For** | Complex queries, transactions | Big data, real-time, flexible schemas |
| **Examples** | MySQL, PostgreSQL | MongoDB, Redis, Cassandra |

### 6.1 When to Use Relational

* Data has clear structure and relationships
* ACID transactions are critical (banking, e-commerce)
* Complex queries with JOINs and aggregations
* Data integrity is paramount

### 6.2 When to Use NoSQL

* Data structure varies or evolves rapidly
* Massive scale (millions of reads/writes per second)
* Real-time applications (chat, gaming, IoT)
* Rapid prototyping and development

---

## 7. SQL vs NoSQL — Visual Comparison

<svg xmlns="http://www.w3.org/2000/svg" width="900" height="300" viewBox="0 0 900 300">
<rect width="900" height="300" fill="white"/>
<text x="450" y="30" text-anchor="middle" font-size="18" font-weight="bold">Relational vs NoSQL Database Models</text>

<!-- Relational Side -->
<rect x="40" y="60" width="400" height="220" rx="8" fill="#EAF4FF" stroke="#1E88E5"/>
<text x="240" y="85" text-anchor="middle" font-size="16" font-weight="bold">Relational (SQL)</text>
<text x="240" y="110" text-anchor="middle" font-size="12">Tables with Fixed Schema</text>

<!-- Table representation -->
<rect x="60" y="125" width="360" height="25" rx="4" fill="#1E88E5"/>
<text x="240" y="142" text-anchor="middle" font-size="11" fill="white">students</text>
<rect x="60" y="150" width="90" height="20" rx="2" fill="white" stroke="#1E88E5"/>
<text x="105" y="164" text-anchor="middle" font-size="9">id</text>
<rect x="150" y="150" width="90" height="20" rx="2" fill="white" stroke="#1E88E5"/>
<text x="195" y="164" text-anchor="middle" font-size="9">name</text>
<rect x="240" y="150" width="90" height="20" rx="2" fill="white" stroke="#1E88E5"/>
<text x="285" y="164" text-anchor="middle" font-size="9">branch</text>
<rect x="330" y="150" width="90" height="20" rx="2" fill="white" stroke="#1E88E5"/>
<text x="375" y="164" text-anchor="middle" font-size="9">email</text>

<rect x="60" y="175" width="360" height="20" rx="2" fill="white" stroke="#1E88E5"/>
<text x="105" y="189" text-anchor="middle" font-size="9">1</text>
<text x="195" y="189" text-anchor="middle" font-size="9">Aarav</text>
<text x="285" y="189" text-anchor="middle" font-size="9">CSE</text>
<text x="375" y="189" text-anchor="middle" font-size="9">aarav@upes</text>

<rect x="60" y="195" width="360" height="20" rx="2" fill="white" stroke="#1E88E5"/>
<text x="105" y="209" text-anchor="middle" font-size="9">2</text>
<text x="195" y="209" text-anchor="middle" font-size="9">Diya</text>
<text x="285" y="209" text-anchor="middle" font-size="9">ECE</text>
<text x="375" y="209" text-anchor="middle" font-size="9">diya@upes</text>

<text x="240" y="250" text-anchor="middle" font-size="11">SQL: SELECT * FROM students WHERE branch='CSE'</text>

<!-- NoSQL Side -->
<rect x="460" y="60" width="400" height="220" rx="8" fill="#E8F8EC" stroke="#43A047"/>
<text x="660" y="85" text-anchor="middle" font-size="16" font-weight="bold">NoSQL (Document)</text>
<text x="660" y="110" text-anchor="middle" font-size="12">Flexible JSON Documents</text>

<!-- Document representation -->
<rect x="480" y="125" width="360" height="120" rx="4" fill="white" stroke="#43A047"/>
<text x="490" y="140" font-size="10" fill="#43A047">{</text>
<text x="500" y="155" font-size="10">"name": "Aarav",</text>
<text x="500" y="170" font-size="10">"branch": "CSE",</text>
<text x="500" y="185" font-size="10">"courses": ["CS301", "CS302"],</text>
<text x="500" y="200" font-size="10">"address": { "city": "Dehradun" }</text>
<text x="490" y="215" font-size="10" fill="#43A047">}</text>

<text x="660" y="260" text-anchor="middle" font-size="11">db.students.find({ branch: "CSE" })</text>
</svg>

---

## 8. Real-World Database Architecture

Most modern applications use a combination of databases:

<svg xmlns="http://www.w3.org/2000/svg" width="900" height="250" viewBox="0 0 900 250">
<rect width="900" height="250" fill="white"/>
<text x="450" y="30" text-anchor="middle" font-size="18" font-weight="bold">Polyglot Persistence Architecture</text>

<rect x="40" y="70" width="150" height="80" rx="8" fill="#EAF4FF" stroke="#1E88E5"/>
<text x="115" y="100" text-anchor="middle" font-size="14">Client</text>
<text x="115" y="120" text-anchor="middle" font-size="11">Browser / App</text>

<line x1="190" y1="110" x2="280" y2="110" stroke="black" stroke-width="2"/>
<text x="235" y="100" font-size="10">HTTP</text>

<rect x="280" y="70" width="150" height="80" rx="8" fill="#E8F8EC" stroke="#43A047"/>
<text x="355" y="100" text-anchor="middle" font-size="14">Backend</text>
<text x="355" y="120" text-anchor="middle" font-size="11">API Server</text>

<line x1="430" y1="90" x2="520" y2="90" stroke="black" stroke-width="2"/>
<text x="475" y="80" font-size="10">SQL</text>

<line x1="430" y1="130" x2="520" y2="130" stroke="black" stroke-width="2"/>
<text x="475" y="120" font-size="10">NoSQL</text>

<rect x="520" y="60" width="160" height="50" rx="8" fill="#FFF8E6" stroke="#FB8C00"/>
<text x="600" y="85" text-anchor="middle" font-size="12">PostgreSQL</text>
<text x="600" y="100" text-anchor="middle" font-size="10">User Accounts, Orders</text>

<rect x="520" y="120" width="160" height="50" rx="8" fill="#F3E5F5" stroke="#8E24AA"/>
<text x="600" y="145" text-anchor="middle" font-size="12">MongoDB</text>
<text x="600" y="160" text-anchor="middle" font-size="10">Product Catalog, Logs</text>

<rect x="720" y="70" width="150" height="80" rx="8" fill="#E0F7FA" stroke="#00ACC1"/>
<text x="795" y="100" text-anchor="middle" font-size="12">Redis</text>
<text x="795" y="120" text-anchor="middle" font-size="10">Session Cache</text>

<line x1="680" y1="85" x2="720" y2="85" stroke="black" stroke-width="2"/>
<line x1="680" y1="145" x2="720" y2="115" stroke="black" stroke-width="2"/>
</svg>

### Example: E-Commerce Application

| Data | Database | Reason |
|------|----------|--------|
| User accounts, orders, payments | PostgreSQL | ACID transactions, complex queries |
| Product catalog, reviews | MongoDB | Flexible schema, varied attributes |
| Shopping cart, session tokens | Redis | Fast reads/writes, temporary data |
| Search index | Elasticsearch | Full-text search, fuzzy matching |

---

## 9. Database Selection Criteria

When choosing a database, consider:

| Factor | Question |
|--------|----------|
| **Data Structure** | Is the schema fixed or evolving? |
| **Consistency Requirements** | Do you need ACID or is eventual consistency acceptable? |
| **Scale** | Will you need to handle millions of concurrent users? |
| **Query Patterns** | Do you need complex JOINs or simple lookups? |
| **Development Speed** | Do you need rapid prototyping? |
| **Cost** | Are you using open-source or commercial solutions? |
| **Team Expertise** | Does your team know SQL or NoSQL better? |

---

## 10. Summary

* **Databases** provide persistent, secure, and efficient data storage for backend applications.
* **Relational databases** (MySQL, PostgreSQL) organize data in tables with fixed schemas and use SQL for queries. They guarantee ACID properties.
* **NoSQL databases** (MongoDB, Redis) offer flexible data models, horizontal scaling, and are ideal for big data and real-time applications.
* **Polyglot persistence** — using multiple databases for different data types — is common in modern applications.
* Choosing the right database depends on data structure, consistency requirements, scale, and query patterns.

### Key Takeaways

* Databases are essential for data persistence in backend applications.
* Relational databases excel at complex queries and transactional integrity.
* NoSQL databases excel at flexibility, scalability, and rapid development.
* Modern applications often combine multiple database types (polyglot persistence).
* Understanding database fundamentals is critical before designing APIs and data models.

In **L14 – Database Schema Design: ER Diagrams, Normalization, Relationships**, you will learn how to design effective database schemas using ER diagrams and normalization techniques.

---

### Lab Exercise

1. Install MySQL or PostgreSQL on your system and create a database named `student_management`. 
   - ***try to work with PostgreSQL***
2. Create a `students` table with columns: `id`, `name`, `branch`, `email`, `enrollment_date`.
3. Insert at least 5 student records using SQL `INSERT` statements.
4. Write SQL queries to:
   - Retrieve all students in the 'CSE' branch.
   - Find students enrolled after January 2024.
   - Update a student's branch.
   - Delete a student record.
5. Install MongoDB and create a collection named `students` with at least 3 documents.
6. Compare the experience of inserting and querying data in MySQL vs MongoDB.