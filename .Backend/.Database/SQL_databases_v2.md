# Tutorial 2: Advanced SQL and Backend Topics with PostgreSQL

This tutorial starts with PostgreSQL and Docker, then continues into advanced SQL, FastAPI, authentication, deployment, and ERD topics.


#### You will learn:

* Running PostgreSQL with Docker Compose or manual Docker commands
* Using `psql` (terminal client)
* Using pgAdmin
* Creating databases and tables
* SQL queries step-by-step
* PostgreSQL-specific features
* Normalization
* Joins

> We will build one sample database and continuously use it in all examples.

---

# 1. What is PostgreSQL?

PostgreSQL is an advanced open-source relational database system.

It supports:

* SQL standard
* JSON data
* Arrays
* Custom data types
* Functions
* Transactions
* Extensions

It is more feature-rich than many beginner databases like MySQL or SQLite.

Official Website:
[PostgreSQL Official Website](https://www.postgresql.org?utm_source=chatgpt.com)

---

# 2. Why Use Docker for PostgreSQL?

Docker helps you:

* Avoid manual installation
* Run PostgreSQL anywhere
* Easily reset databases
* Use same environment on all systems

Official Docker Image:
[PostgreSQL Docker Image](https://hub.docker.com/_/postgres?utm_source=chatgpt.com)

---

# 3. Install Docker

Install Docker Desktop or Docker Engine.

Official Download:
[Docker Official Website](https://www.docker.com/products/docker-desktop/?utm_source=chatgpt.com)

Verify installation:

```bash
docker --version
```

---

# 4. Run PostgreSQL with Docker

We need two containers:

- PostgreSQL: the database server
- pgAdmin: a browser-based interface for PostgreSQL

There are two common ways to create this setup. **Choose one approach only.** Docker Compose and manual Docker commands do the same task here.

## Approach A: Docker Compose

Docker Compose keeps the full setup in one YAML file. Create a `docker-compose.yml` file:

```yml
services:
  postgres:
    image: postgres:16
    container_name: postgres-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin123
      POSTGRES_DB: companydb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin -d companydb"]
      interval: 10s
      timeout: 5s
      retries: 5

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: pgadmin
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: admin123
    ports:
      - "5050:80"
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - pgadmin_data:/var/lib/pgadmin

volumes:
  postgres_data:
  pgadmin_data:
```

Start all services with 

```bash
docker compose up -d
```


This creates the following environment:

| Service | URL / Port | Login |
| ------- | ---------- | ----- |
| PostgreSQL | `localhost:5432` | user `admin`, password `admin123`, database `companydb` |
| pgAdmin | `http://localhost:5050` | email `admin@example.com`, password `admin123` |

---

# 5. Manage Containers

```bash
docker ps
```

Stop containers:

```bash
docker compose down
```

Start again:

```bash
docker compose up -d
```

Remove containers and saved database data:

```bash
docker compose down -v
```

## Approach B: Manual Docker Commands

This approach creates the same PostgreSQL and pgAdmin setup using separate Docker commands.

Create a Docker network so both containers can communicate:

```bash
docker network create pg-network
```

Start PostgreSQL:

```bash
docker run -d \
  --name postgres-db \
  --network pg-network \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin123 \
  -e POSTGRES_DB=companydb \
  -p 5432:5432 \
  postgres:16
```

Start pgAdmin:

```bash
docker run -d \
  --name pgadmin \
  --network pg-network \
  -e PGADMIN_DEFAULT_EMAIL=admin@example.com \
  -e PGADMIN_DEFAULT_PASSWORD=admin123 \
  -p 5050:80 \
  dpage/pgadmin4:latest
```

Stop and remove the manual containers:

```bash
docker rm -f pgadmin postgres-db
docker network rm pg-network
```

---

# 6. Understanding PostgreSQL Architecture

Basic structure:

```text
PostgreSQL Server
 ├── Database
 │    ├── Tables
 │    ├── Views
 │    ├── Functions
 │    └── Indexes
```

---

# 7. Using psql (PostgreSQL Shell)

`psql` is PostgreSQL command-line client.

Connect inside container:

```bash
docker exec -it postgres-db psql -U admin -d companydb
```

Now you enter PostgreSQL shell:

```text
companydb=#
```

---

# 8. Important psql Commands

| Command     | Meaning          |
| ----------- | ---------------- |
| `\l`        | List databases   |
| `\c dbname` | Connect database |
| `\dt`       | List tables      |
| `\d table`  | Describe table   |
| `\q`        | Exit             |
| `\du`       | List users       |
| `\dn`       | List schemas     |

Example:

```sql
\dt
```

---

# 9. Using pgAdmin

pgAdmin provides graphical interface.

Official Website:
[pgAdmin Official Website](https://www.pgadmin.org?utm_source=chatgpt.com)

Open browser:

```text
http://localhost:5050
```

---

# 10. Connect pgAdmin to PostgreSQL

Server settings:

| Field    | Value                |
| -------- | -------------------- |
| Host     | `postgres` with Docker Compose, or `postgres-db` with manual Docker commands |
| Port     | 5432                 |
| Username | admin                |
| Password | admin123             |

Because pgAdmin and PostgreSQL run inside Docker, pgAdmin should use the Compose service name or Docker container name as the host.

---

# 11. Create Dummy Database Structure

We will create a small company management system.

Entities:

* Departments
* Employees
* Projects
* Attendance

---

# 12. Create Tables

## Task

Create tables for company system.

## SQL Keywords Introduced

| Keyword        | Meaning                 |
| -------------- | ----------------------- |
| `CREATE TABLE` | Create new table        |
| `PRIMARY KEY`  | Unique identifier       |
| `SERIAL`       | Auto increment          |
| `FOREIGN KEY`  | Relation between tables |
| `NOT NULL`     | Cannot store NULL       |

---

## Create Department Table

```sql
CREATE TABLE departments (
    dept_id SERIAL PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL
);
```

---

## Create Employees Table

```sql
CREATE TABLE employees (
    emp_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    salary NUMERIC(10,2),
    joining_date DATE,
    dept_id INT REFERENCES departments(dept_id)
);
```

---

## Create Projects Table

```sql
CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(100),
    budget NUMERIC(12,2)
);
```

---

## Create Attendance Table

```sql
CREATE TABLE attendance (
    attendance_id SERIAL PRIMARY KEY,
    emp_id INT REFERENCES employees(emp_id),
    attendance_date DATE,
    status VARCHAR(20)
);
```

---

# 13. Insert Dummy Data

## SQL Keywords

| Keyword       | Meaning     |
| ------------- | ----------- |
| `INSERT INTO` | Add records |
| `VALUES`      | Data values |

---

## Insert Departments

```sql
INSERT INTO departments (dept_name)
VALUES
('HR'),
('Engineering'),
('Finance'),
('Marketing');
```

---

## Insert Employees

```sql
INSERT INTO employees
(first_name, last_name, email, salary, joining_date, dept_id)
VALUES
('Aman', 'Sharma', 'aman@example.com', 50000, '2025-01-10', 2),
('Priya', 'Verma', 'priya@example.com', 65000, '2024-07-15', 2),
('Rohit', 'Singh', 'rohit@example.com', 45000, '2025-03-01', 1),
('Neha', 'Kapoor', 'neha@example.com', 70000, '2023-09-20', 3);
```

---

## Insert Projects

```sql
INSERT INTO projects (project_name, budget)
VALUES
('Inventory System', 100000),
('AI Chatbot', 250000),
('Payroll System', 150000);
```

---

# 14. View Data

## SQL Keyword

| Keyword  | Meaning       |
| -------- | ------------- |
| `SELECT` | Retrieve data |

---

## Task

Show all employees.

```sql
SELECT * FROM employees;
```

---

# 15. Selecting Specific Columns

## Task

Show only employee names and salary.

```sql
SELECT first_name, salary
FROM employees;
```

---

# 16. Filtering Data with WHERE

## SQL Keyword

| Keyword | Meaning     |
| ------- | ----------- |
| `WHERE` | Filter rows |

---

## Task

Find employees with salary greater than 50000.

```sql
SELECT *
FROM employees
WHERE salary > 50000;
```

---

# 17. Comparison Operators

| Operator | Meaning          |
| -------- | ---------------- |
| `=`      | Equal            |
| `!=`     | Not equal        |
| `>`      | Greater          |
| `<`      | Less             |
| `>=`     | Greater or equal |
| `<=`     | Less or equal    |

---

# 18. Sorting Data

## SQL Keyword

| Keyword    | Meaning   |
| ---------- | --------- |
| `ORDER BY` | Sort rows |

---

## Task

Sort employees by salary descending.

```sql
SELECT *
FROM employees
ORDER BY salary DESC;
```

---

# 19. Limiting Results

## SQL Keyword

| Keyword | Meaning       |
| ------- | ------------- |
| `LIMIT` | Restrict rows |

---

## Task

Show top 2 highest paid employees.

```sql
SELECT *
FROM employees
ORDER BY salary DESC
LIMIT 2;
```

---

# 20. Updating Data

## SQL Keyword

| Keyword  | Meaning     |
| -------- | ----------- |
| `UPDATE` | Modify data |

---

## Task

Increase Aman's salary.

```sql
UPDATE employees
SET salary = 55000
WHERE first_name = 'Aman';
```

---

# 21. Delete Data

## SQL Keyword

| Keyword  | Meaning     |
| -------- | ----------- |
| `DELETE` | Remove rows |

---

## Task

Delete an employee.

```sql
DELETE FROM employees
WHERE emp_id = 3;
```

---

# 22. Aggregate Functions

| Function  | Meaning    |
| --------- | ---------- |
| `COUNT()` | Count rows |
| `SUM()`   | Total      |
| `AVG()`   | Average    |
| `MAX()`   | Maximum    |
| `MIN()`   | Minimum    |

---

## Task

Find average salary.

```sql
SELECT AVG(salary)
FROM employees;
```

---

# 23. GROUP BY

## Task

Find department-wise average salary.

```sql
SELECT dept_id, AVG(salary)
FROM employees
GROUP BY dept_id;
```

---

# 24. HAVING Clause

Used after grouping.

## Task

Show departments with average salary above 60000.

```sql
SELECT dept_id, AVG(salary)
FROM employees
GROUP BY dept_id
HAVING AVG(salary) > 60000;
```

---

# 25. PostgreSQL-Specific Feature: RETURNING

This is very useful and not available in many databases.

## Task

Insert employee and immediately return inserted row.

```sql
INSERT INTO employees
(first_name, last_name, email, salary, joining_date, dept_id)
VALUES
('Karan', 'Mehta', 'karan@example.com', 80000, CURRENT_DATE, 2)
RETURNING *;
```

PostgreSQL Feature Highlight:

* `RETURNING`

---

# 26. PostgreSQL-Specific Feature: SERIAL

`SERIAL` auto-generates integer IDs.

Example already used:

```sql
emp_id SERIAL PRIMARY KEY
```

Modern PostgreSQL also supports:

```sql
GENERATED ALWAYS AS IDENTITY
```

---

# 27. PostgreSQL-Specific Feature: ARRAY

PostgreSQL supports arrays directly.

## Create Table

```sql
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    emp_name VARCHAR(100),
    technologies TEXT[]
);
```

## Insert Array

```sql
INSERT INTO skills (emp_name, technologies)
VALUES
('Aman', ARRAY['Python', 'Docker', 'PostgreSQL']);
```

## Query Array

```sql
SELECT *
FROM skills
WHERE 'Docker' = ANY(technologies);
```

---

# 28. PostgreSQL-Specific Feature: JSON

PostgreSQL supports JSON storage.

## Create Table

```sql
CREATE TABLE employee_profiles (
    id SERIAL PRIMARY KEY,
    profile JSONB
);
```

## Insert JSON

```sql
INSERT INTO employee_profiles (profile)
VALUES (
'{
  "name": "Aman",
  "skills": ["Python", "SQL"],
  "experience": 3
}'
);
```

## Query JSON

```sql
SELECT profile->>'name'
FROM employee_profiles;
```

PostgreSQL Feature Highlight:

* `JSONB`
* `->`
* `->>`

---

# 29. PostgreSQL-Specific Feature: ILIKE

Case-insensitive search.

```sql
SELECT *
FROM employees
WHERE first_name ILIKE 'aman';
```

---

# 30. PostgreSQL-Specific Feature: UPSERT

Insert or update.

```sql
INSERT INTO departments (dept_id, dept_name)
VALUES (1, 'Human Resources')
ON CONFLICT (dept_id)
DO UPDATE
SET dept_name = EXCLUDED.dept_name;
```

PostgreSQL Feature Highlight:

* `ON CONFLICT`

---

# 31. Constraints

| Constraint    | Purpose         |
| ------------- | --------------- |
| `PRIMARY KEY` | Unique row      |
| `UNIQUE`      | No duplicate    |
| `NOT NULL`    | Mandatory value |
| `CHECK`       | Validate rule   |
| `FOREIGN KEY` | Relationship    |

---

## Example CHECK Constraint

```sql
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    price NUMERIC CHECK (price > 0)
);
```

---

# 32. Indexes

Indexes improve query speed.

## Create Index

```sql
CREATE INDEX idx_employee_email
ON employees(email);
```

---

# 33. Transactions

Transactions ensure safe operations.

## Keywords

| Keyword    | Meaning           |
| ---------- | ----------------- |
| `BEGIN`    | Start transaction |
| `COMMIT`   | Save changes      |
| `ROLLBACK` | Undo changes      |

---

## Example

```sql
BEGIN;

UPDATE employees
SET salary = salary + 5000
WHERE dept_id = 2;

ROLLBACK;
```

---

# 34. Views

Virtual tables created from queries.

```sql
CREATE VIEW high_salary_employees AS
SELECT *
FROM employees
WHERE salary > 60000;
```

Query:

```sql
SELECT * FROM high_salary_employees;
```

---

# 35. Joins

Joins combine tables.

---

# INNER JOIN

Returns matching rows.

## Task

Show employee with department name.

```sql
SELECT
    employees.first_name,
    departments.dept_name
FROM employees
INNER JOIN departments
ON employees.dept_id = departments.dept_id;
```

---

# LEFT JOIN

Returns all left table rows.

```sql
SELECT
    employees.first_name,
    departments.dept_name
FROM employees
LEFT JOIN departments
ON employees.dept_id = departments.dept_id;
```

---

# RIGHT JOIN

Returns all right table rows.

```sql
SELECT
    employees.first_name,
    departments.dept_name
FROM employees
RIGHT JOIN departments
ON employees.dept_id = departments.dept_id;
```

---

# FULL JOIN

Returns all rows from both tables.

```sql
SELECT
    employees.first_name,
    departments.dept_name
FROM employees
FULL JOIN departments
ON employees.dept_id = departments.dept_id;
```

---

# 36. Database Normalization

Normalization reduces redundancy.

---

# First Normal Form (1NF)

Rules:

* No repeating groups
* Atomic values

Bad:

| Student | Subjects      |
| ------- | ------------- |
| Aman    | Math, Science |

Good:

| Student | Subject |
| ------- | ------- |
| Aman    | Math    |
| Aman    | Science |

---

# Second Normal Form (2NF)

Rules:

* Must be in 1NF
* Remove partial dependency

Separate employee and department data.

---

# Third Normal Form (3NF)

Rules:

* Must be in 2NF
* Remove transitive dependency

Avoid storing manager phone in employee table if manager data exists elsewhere.

---

# Example Proper Design

```text
departments
employees
projects
attendance
```

Each table stores only related data.

---

# 37. Common PostgreSQL Data Types

| Type         | Purpose        |
| ------------ | -------------- |
| `INT`        | Integer        |
| `SERIAL`     | Auto increment |
| `VARCHAR(n)` | String         |
| `TEXT`       | Long text      |
| `DATE`       | Date           |
| `TIMESTAMP`  | Date + time    |
| `BOOLEAN`    | True/False     |
| `NUMERIC`    | Exact decimal  |
| `JSONB`      | JSON           |
| `ARRAY`      | Array          |

---

# 38. PostgreSQL Features Summary

Features especially powerful in PostgreSQL:

| Feature            | Description             |
| ------------------ | ----------------------- |
| `JSONB`            | NoSQL-like JSON storage |
| `ARRAY`            | Array support           |
| `ILIKE`            | Case-insensitive search |
| `RETURNING`        | Return modified rows    |
| `ON CONFLICT`      | UPSERT support          |
| `Extensions`       | Add capabilities        |
| `Full Text Search` | Search engine features  |
| `CTE`              | Advanced queries        |
| `Window Functions` | Analytics queries       |

---

# 39. Complete SQL Keywords Learned

| Keyword        | Purpose             |
| -------------- | ------------------- |
| `CREATE TABLE` | Create table        |
| `INSERT INTO`  | Insert data         |
| `SELECT`       | Retrieve data       |
| `WHERE`        | Filter              |
| `ORDER BY`     | Sort                |
| `GROUP BY`     | Group rows          |
| `HAVING`       | Filter grouped rows |
| `UPDATE`       | Modify              |
| `DELETE`       | Remove              |
| `LIMIT`        | Restrict results    |
| `JOIN`         | Combine tables      |
| `PRIMARY KEY`  | Unique row          |
| `FOREIGN KEY`  | Relations           |
| `UNIQUE`       | Unique values       |
| `CHECK`        | Validation          |
| `INDEX`        | Faster search       |
| `VIEW`         | Virtual table       |
| `BEGIN`        | Start transaction   |
| `COMMIT`       | Save transaction    |
| `ROLLBACK`     | Undo transaction    |

---
# 41. Advanced Joins

Earlier we learned basic joins. Now let us learn advanced joins used in real applications.

---

# SELF JOIN

A table joined with itself.

## Use Case

Employee and manager relationship.

---

## Create Table

```sql id="b1p8g7"
CREATE TABLE staff (
    emp_id SERIAL PRIMARY KEY,
    emp_name VARCHAR(100),
    manager_id INT
);
```

---

## Insert Data

```sql id="q7v9h2"
INSERT INTO staff (emp_name, manager_id)
VALUES
('Aman', NULL),
('Priya', 1),
('Rohit', 1),
('Neha', 2);
```

---

## Task

Show employee with manager name.

```sql id="s3j4c8"
SELECT
    e.emp_name AS employee,
    m.emp_name AS manager
FROM staff e
LEFT JOIN staff m
ON e.manager_id = m.emp_id;
```

---

# CROSS JOIN

Creates all possible combinations.

## Use Case

Generate combinations of students and subjects.

---

```sql id="d8k2f1"
SELECT
    employees.first_name,
    departments.dept_name
FROM employees
CROSS JOIN departments;
```

---

# NATURAL JOIN

Automatically joins matching column names.

```sql id="r5n1u9"
SELECT *
FROM employees
NATURAL JOIN departments;
```

Avoid in production because schema changes can break queries.

---

# 42. Stored Procedures

Stored procedures contain reusable SQL logic.

PostgreSQL supports procedures using `CREATE PROCEDURE`.

---

## Use Case

Increase salary for all employees in a department.

---

## Create Procedure

```sql id="u6w3t2"
CREATE OR REPLACE PROCEDURE increase_salary(
    dept INT,
    increment_amount NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE employees
    SET salary = salary + increment_amount
    WHERE dept_id = dept;
END;
$$;
```

---

## Execute Procedure

```sql id="m4x7p1"
CALL increase_salary(2, 5000);
```

---

# PostgreSQL Feature Highlight

* `plpgsql`
* `CREATE PROCEDURE`
* `CALL`

These are powerful PostgreSQL server-side programming features.

---

# 43. Functions

Functions return values.

---

## Create Function

```sql id="n2z8q4"
CREATE OR REPLACE FUNCTION yearly_salary(monthly NUMERIC)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN monthly * 12;
END;
$$;
```

---

## Use Function

```sql id="f7a1m5"
SELECT
    first_name,
    yearly_salary(salary)
FROM employees;
```

---

# Difference Between Function and Procedure

| Function            | Procedure          |
| ------------------- | ------------------ |
| Returns value       | Usually no return  |
| Used in queries     | Called separately  |
| `SELECT function()` | `CALL procedure()` |

---

# 44. Triggers

Triggers automatically execute when events occur.

Events:

* INSERT
* UPDATE
* DELETE

---

# Use Case

Automatically log employee updates.

---

## Create Audit Table

```sql id="p3w8j6"
CREATE TABLE employee_audit (
    audit_id SERIAL PRIMARY KEY,
    emp_id INT,
    action_time TIMESTAMP,
    old_salary NUMERIC,
    new_salary NUMERIC
);
```

---

## Create Trigger Function

```sql id="k9d4r7"
CREATE OR REPLACE FUNCTION log_salary_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO employee_audit
    (
        emp_id,
        action_time,
        old_salary,
        new_salary
    )
    VALUES
    (
        OLD.emp_id,
        CURRENT_TIMESTAMP,
        OLD.salary,
        NEW.salary
    );

    RETURN NEW;
END;
$$;
```

---

## Create Trigger

```sql id="h5s2n8"
CREATE TRIGGER salary_update_trigger
BEFORE UPDATE ON employees
FOR EACH ROW
WHEN (OLD.salary IS DISTINCT FROM NEW.salary)
EXECUTE FUNCTION log_salary_change();
```

---

## Test Trigger

```sql id="v1f6q9"
UPDATE employees
SET salary = 90000
WHERE emp_id = 1;
```

---

# PostgreSQL Feature Highlight

* `TRIGGER`
* `OLD`
* `NEW`
* `plpgsql`

---

# 45. Window Functions

Window functions perform calculations across rows without grouping them permanently.

Very important for analytics.

---

# ROW_NUMBER()

Assigns row numbers.

## Task

Rank employees by salary.

```sql id="g2u9e1"
SELECT
    first_name,
    salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) AS rank
FROM employees;
```

---

# RANK()

Handles ties.

```sql id="a8k5v3"
SELECT
    first_name,
    salary,
    RANK() OVER (ORDER BY salary DESC)
FROM employees;
```

---

# PARTITION BY

Groups logically inside window function.

## Task

Rank employees department-wise.

```sql id="c4j7l2"
SELECT
    first_name,
    dept_id,
    salary,
    ROW_NUMBER() OVER (
        PARTITION BY dept_id
        ORDER BY salary DESC
    )
FROM employees;
```

---

# PostgreSQL Feature Highlight

Window functions are extremely optimized in PostgreSQL.

---

# 46. Common Table Expressions (CTE)

CTE improves readability.

Uses `WITH`.

---

# Example Without CTE

```sql id="o9m3x6"
SELECT *
FROM (
    SELECT dept_id, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY dept_id
) AS dept_avg
WHERE avg_salary > 60000;
```

---

# Same Query Using CTE

```sql id="t6y2b8"
WITH dept_avg AS (
    SELECT
        dept_id,
        AVG(salary) AS avg_salary
    FROM employees
    GROUP BY dept_id
)
SELECT *
FROM dept_avg
WHERE avg_salary > 60000;
```

---

# Recursive CTE

Useful for hierarchy/tree structures.

```sql id="y7p1n4"
WITH RECURSIVE numbers AS (
    SELECT 1 AS n

    UNION ALL

    SELECT n + 1
    FROM numbers
    WHERE n < 5
)
SELECT * FROM numbers;
```

---

# PostgreSQL Feature Highlight

* `WITH RECURSIVE`

Very powerful in PostgreSQL.

---

# 47. Performance Optimization

Databases become slow with large data.

Optimization improves speed.

---

# Use Indexes

```sql id="z3r5m7"
CREATE INDEX idx_salary
ON employees(salary);
```

---

# Analyze Query

PostgreSQL provides `EXPLAIN`.

```sql id="e4n8k2"
EXPLAIN
SELECT *
FROM employees
WHERE salary > 50000;
```

---

# Detailed Execution Plan

```sql id="l6v9c1"
EXPLAIN ANALYZE
SELECT *
FROM employees
WHERE salary > 50000;
```

---

# PostgreSQL Feature Highlight

`EXPLAIN ANALYZE` is one of the best query debugging tools.

---

# Optimization Tips

| Method                  | Purpose              |
| ----------------------- | -------------------- |
| Indexes                 | Faster searching     |
| Normalize tables        | Reduce duplication   |
| Use LIMIT               | Reduce output        |
| Avoid SELECT *          | Fetch needed columns |
| Analyze execution plans | Improve queries      |

---

# 48. Backup and Restore

Critical for production systems.

---

# Backup Database

Using `pg_dump`.

```bash id="e1g4m9"
docker exec postgres-db \
pg_dump -U admin companydb > backup.sql
```

---

# Restore Database

```bash id="b7n2q5"
docker exec -i postgres-db \
psql -U admin companydb < backup.sql
```

---

# Backup All Databases

```bash id="r4c8t6"
docker exec postgres-db \
pg_dumpall -U admin > all_backup.sql
```

---

# PostgreSQL Feature Highlight

* `pg_dump`
* `pg_dumpall`

Industry-standard backup utilities.

---

# 49. Partitioning

Partitioning splits huge tables into smaller pieces.

Useful for:

* Logs
* Attendance
* Transactions
* Analytics

---

# Create Partitioned Table

```sql id="u5j3w7"
CREATE TABLE attendance_logs (
    id SERIAL,
    emp_id INT,
    attendance_date DATE
)
PARTITION BY RANGE (attendance_date);
```

---

# Create Partitions

```sql id="x2m9k4"
CREATE TABLE attendance_2025
PARTITION OF attendance_logs
FOR VALUES FROM ('2025-01-01')
TO ('2026-01-01');
```

---

# PostgreSQL Feature Highlight

Native partitioning is highly optimized.

---

# 50. Replication

Replication copies data between servers.

Used for:

* High availability
* Backup
* Scaling
* Disaster recovery

---

# Types of Replication

| Type                  | Purpose            |
| --------------------- | ------------------ |
| Streaming Replication | Real-time copy     |
| Logical Replication   | Selected tables    |
| Synchronous           | Guaranteed write   |
| Asynchronous          | Faster replication |

---

# PostgreSQL Replication Advantages

* Reliable
* Production-ready
* Supports failover
* Supports read replicas

---

# Basic Replication Architecture

```text id="t8n1v5"
Primary Server
      |
      v
Replica Server
```

---

# 51. Real Beginner Practice Tasks

---

# Task 1

Create a student table with:

* id
* name
* course
* marks

---

# Task 2

Insert 10 students.

---

# Task 3

Find top 3 students by marks.

---

# Task 4

Find average marks course-wise.

---

# Task 5

Create attendance table linked using foreign key.

---

# Task 6

Create trigger to log deleted students.

---

# Task 7

Create function to calculate grade.

---

# Task 8

Create view for passed students.

---

# 52. Mini Project Ideas with Database Concepts

| Project           | Concepts            |
| ----------------- | ------------------- |
| Library System    | Joins, transactions |
| Hostel Management | Relationships       |
| Inventory System  | Triggers            |
| Banking System    | Transactions        |
| Attendance Portal | Dates, functions    |
| Hospital System   | Large joins         |
| E-commerce System | Optimization        |

---

# 53. Recommended PostgreSQL Tools

| Tool      | Purpose                |
| --------- | ---------------------- |
| pgAdmin   | GUI administration     |
| psql      | Command line           |
| DBeaver   | Multi-database GUI     |
| TablePlus | Lightweight SQL client |

---

# 54. PostgreSQL Features Rarely Found Together in Other Databases

| PostgreSQL Feature  | Why Important            |
| ------------------- | ------------------------ |
| JSONB               | NoSQL + SQL hybrid       |
| Arrays              | Store lists directly     |
| Recursive CTE       | Tree structures          |
| Full-text search    | Search engine capability |
| Materialized views  | Faster analytics         |
| Extensions          | Add capabilities         |
| GIS support         | Maps/location data       |
| Window functions    | Analytics                |
| Partitioning        | Big data handling        |
| Logical replication | Flexible replication     |

---

# 55. Final SQL Learning Roadmap

## Beginner

* SELECT
* INSERT
* UPDATE
* DELETE
* WHERE
* ORDER BY
* GROUP BY
* JOINS

---

## Intermediate

* Functions
* Procedures
* Triggers
* Views
* Indexes
* Transactions

---

## Advanced

* Window functions
* CTEs
* Query optimization
* Partitioning
* Replication
* Distributed systems

---

# 56. Final Advice for Beginners

SQL is best learned by writing queries repeatedly.

Do not only read tutorials.

Practice:

* creating tables,
* breaking queries,
* fixing errors,
* optimizing slow queries,
* designing databases.

Most real learning happens while debugging.

---

# Suggested Daily Practice Routine

| Time   | Activity           |
| ------ | ------------------ |
| 15 min | Create tables      |
| 15 min | Insert data        |
| 20 min | Write queries      |
| 10 min | Fix errors         |
| 20 min | Build mini project |

---

# FastAPI + PostgreSQL + SQLModel Complete Beginner Tutorial

This tutorial teaches how to build a real backend API using:

* FastAPI
* PostgreSQL
* SQLAlchemy
* SQLModel
* JWT Authentication
* User login system
* Secure APIs
* CRUD operations
* Dynamic database operations

Goal:
Build APIs that return JSON responses for frontend/web applications.

---

# 1. What is FastAPI?

FastAPI is a modern Python backend framework.

Features:

* Very fast
* Automatic Swagger documentation
* JSON APIs
* Async support
* Type hints
* JWT authentication support
* Easy integration with databases

Official Website:
[FastAPI Official Website](https://fastapi.tiangolo.com?utm_source=chatgpt.com)

---

# 2. Architecture Overview

```text id="8h5u2q"
Frontend (React/Vue/Mobile)
          |
          v
      FastAPI
          |
          v
 PostgreSQL Database
```

---

# 3. Install Required Tools

Install:

* Python
* Docker
* PostgreSQL container started with Docker Compose or manual Docker commands

---

# 4. Run PostgreSQL with Docker

If you want the shorter setup, use the Compose file shown earlier:

```bash id="m2p9d7"
docker compose up -d
```

Manual Docker commands with `docker network`, `docker run postgres`, and `docker run pgadmin` are an alternative way to create the same environment.

---

# 5. Create FastAPI Project

## Create Folder

```bash id="k4s1n8"
mkdir fastapi-postgres
cd fastapi-postgres
```

---

# 6. Create Virtual Environment

```bash id="z7c3w5"
python -m venv venv
```

Activate:

Linux/macOS:

```bash id="r8v6j1"
source venv/bin/activate
```

Windows:

```bash id="e3f2t9"
venv\Scripts\activate
```

---

# 7. Install Packages

```bash id="x1m5q7"
pip install fastapi uvicorn psycopg2-binary sqlalchemy sqlmodel python-jose passlib bcrypt python-multipart
```

---

# 8. Project Structure

```text id="d6n2k4"
project/
│
├── main.py
├── database.py
├── models.py
├── schemas.py
├── auth.py
├── crud.py
└── requirements.txt
```

---

# 9. Create Database Connection

## database.py

```python id="g9u4r3"
from sqlmodel import create_engine, Session

DATABASE_URL = "postgresql://admin:admin123@localhost/companydb"

engine = create_engine(DATABASE_URL)

def get_session():
    with Session(engine) as session:
        yield session
```

---

# 10. Create First FastAPI App

## main.py

```python id="w5t8p1"
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "FastAPI working"}
```

---

# 11. Run FastAPI Server

```bash id="h3v7m9"
uvicorn main:app --reload
```

Open:

```text id="n8x2d6"
http://127.0.0.1:8000
```

Swagger Docs:

```text id="j1r4k7"
http://127.0.0.1:8000/docs
```

---

# 12. Understanding JSON API Response

Example response:

```json id="s2p6q8"
{
  "message": "FastAPI working"
}
```

Most web/mobile apps communicate using JSON.

---

# 13. Create SQLAlchemy Model

Before SQLModel, understand traditional ORM.

---

# What is ORM?

ORM = Object Relational Mapping

Instead of writing raw SQL:

```sql id="a4m7w2"
SELECT * FROM users;
```

You use Python classes.

---

# Traditional SQLAlchemy Example

## models.py

```python id="c9t3k5"
from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String)
    email = Column(String)
```

This works but feels verbose.

---

# 14. Introduction to SQLModel

SQLModel combines:

* SQLAlchemy
* Pydantic

Benefits:

* Less code
* Easier validation
* Cleaner models
* Better FastAPI integration

Official Website:
[SQLModel Official Website](https://sqlmodel.tiangolo.com?utm_source=chatgpt.com)

---

# 15. Same Model Using SQLModel

## models.py

```python id="q6w2n9"
from typing import Optional
from sqlmodel import SQLModel, Field

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    email: str
```

Much cleaner.

---

# SQLAlchemy vs SQLModel

| SQLAlchemy            | SQLModel             |
| --------------------- | -------------------- |
| More code             | Less code            |
| Separate schema       | Combined schema      |
| Complex for beginners | Beginner friendly    |
| Manual validation     | Automatic validation |

---

# 16. Create Database Tables

## main.py

```python id="t8m4c1"
from fastapi import FastAPI
from sqlmodel import SQLModel
from database import engine

app = FastAPI()

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)
```

---

# 17. Create User Model

## models.py

```python id="p5k9v3"
from typing import Optional
from sqlmodel import SQLModel, Field

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    email: str
    password: str
```

---

# 18. Create API Route

## main.py

```python id="y2n6r8"
from fastapi import FastAPI

app = FastAPI()

@app.get("/users")
def get_users():
    return {"users": []}
```

---

# 19. HTTP Methods

| Method | Purpose |
| ------ | ------- |
| GET    | Read    |
| POST   | Create  |
| PUT    | Update  |
| DELETE | Remove  |

---

# 20. Create User API

## main.py

```python id="u7v3d5"
from fastapi import Depends
from sqlmodel import Session

from database import get_session
from models import User

@app.post("/users")
def create_user(
    user: User,
    session: Session = Depends(get_session)
):
    session.add(user)
    session.commit()
    session.refresh(user)

    return user
```

---

# 21. Test API Using Swagger

Open:

```text id="l4j7f1"
http://127.0.0.1:8000/docs
```

FastAPI automatically creates API documentation.

---

# 22. Read Users from Database

```python id="e8p2w6"
from sqlmodel import select

@app.get("/users")
def read_users(
    session: Session = Depends(get_session)
):
    users = session.exec(select(User)).all()

    return users
```

---

# 23. Get Single User

```python id="r5x1n4"
@app.get("/users/{user_id}")
def get_user(
    user_id: int,
    session: Session = Depends(get_session)
):
    user = session.get(User, user_id)

    return user
```

---

# 24. Update User

```python id="k3m8q2"
@app.put("/users/{user_id}")
def update_user(
    user_id: int,
    updated_user: User,
    session: Session = Depends(get_session)
):
    user = session.get(User, user_id)

    user.username = updated_user.username
    user.email = updated_user.email

    session.add(user)
    session.commit()

    return user
```

---

# 25. Delete User

```python id="f6v2p9"
@app.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    session: Session = Depends(get_session)
):
    user = session.get(User, user_id)

    session.delete(user)
    session.commit()

    return {"message": "User deleted"}
```

---

# 26. Authentication Basics

Authentication verifies identity.

Example:

* Username/password login

Authorization decides permissions.

Example:

* Admin can delete users
* Normal user cannot

---

# 27. Why JWT?

JWT = JSON Web Token

Used because:

* Stateless
* Secure
* Works well for APIs
* Used in frontend apps/mobile apps

---

# JWT Flow

```text id="a1z5m8"
Login
  |
  v
Server validates credentials
  |
  v
Server returns JWT token
  |
  v
Client sends token in every request
```

---

# 28. Password Hashing

Never store plain passwords.

Use hashing.

---

# auth.py

```python id="n7w4p1"
from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(
    plain_password,
    hashed_password
):
    return pwd_context.verify(
        plain_password,
        hashed_password
    )
```

---

# 29. Hash Password Before Saving

```python id="v3m9q7"
user.password = hash_password(user.password)
```

---

# 30. Create JWT Token

## auth.py

```python id="j8r2k5"
from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = "MYSECRETKEY"
ALGORITHM = "HS256"

def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(hours=1)

    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )
```

---

# 31. Login API

```python id="d4x7m2"
@app.post("/login")
def login(
    username: str,
    password: str,
    session: Session = Depends(get_session)
):
    statement = select(User).where(
        User.username == username
    )

    user = session.exec(statement).first()

    if not user:
        return {"error": "Invalid user"}

    if not verify_password(
        password,
        user.password
    ):
        return {"error": "Wrong password"}

    token = create_access_token(
        {"sub": user.username}
    )

    return {"access_token": token}
```

---

# Example JWT Response

```json id="m9k1v4"
{
  "access_token": "eyJhbGciOiJIUzI1Ni..."
}
```

---

# 32. Secure Routes Using JWT

Client sends:

```text id="c6n3w8"
Authorization: Bearer TOKEN
```

---

# 33. Verify JWT Token

## auth.py

```python id="p2m5x9"
from jose import JWTError

def verify_token(token: str):

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        username = payload.get("sub")

        return username

    except JWTError:
        return None
```

---

# 34. Protected Route

```python id="w1q7r3"
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="login"
)

@app.get("/secure-data")
def secure_data(
    token: str = Depends(oauth2_scheme)
):

    username = verify_token(token)

    if not username:
        return {"error": "Invalid token"}

    return {
        "message": "Protected data",
        "user": username
    }
```

---

# 35. Role-Based Authorization

Add role column.

```python id="k8p4n6"
role: str = "user"
```

---

# Admin Route

```python id="s5m2x7"
if user.role != "admin":
    return {"error": "Access denied"}
```

---

# 36. Dynamic Database Creation

PostgreSQL allows creating databases.

---

# WARNING

Normally only admins should do this.

---

# Create Database API

```python id="x7v1m3"
from sqlalchemy import text

@app.post("/create-database/{db_name}")
def create_database(
    db_name: str,
    session: Session = Depends(get_session)
):
    session.execute(
        text(f'CREATE DATABASE "{db_name}"')
    )

    session.commit()

    return {"message": "Database created"}
```

---

# Delete Database API

```python id="z4n8p2"
@app.delete("/delete-database/{db_name}")
def delete_database(
    db_name: str,
    session: Session = Depends(get_session)
):
    session.execute(
        text(f'DROP DATABASE "{db_name}"')
    )

    session.commit()

    return {"message": "Database deleted"}
```

---

# Important Security Note

Never directly trust user input in SQL queries.

Use validation.

Bad:

```python id="y9w5k1"
f"DROP DATABASE {db_name}"
```

Can cause SQL injection.

---

# 37. CRUD Summary

| Operation | HTTP   | SQL    |
| --------- | ------ | ------ |
| Create    | POST   | INSERT |
| Read      | GET    | SELECT |
| Update    | PUT    | UPDATE |
| Delete    | DELETE | DELETE |

---

# 38. Real Backend Features Usually Added

| Feature         | Purpose        |
| --------------- | -------------- |
| JWT             | Authentication |
| Role system     | Authorization  |
| Pagination      | Large data     |
| File upload     | Images/docs    |
| Rate limiting   | Security       |
| Logging         | Monitoring     |
| Caching         | Performance    |
| Background jobs | Async tasks    |

---

# 39. Example Real API Flow

```text id="u2n8q4"
Frontend Login
      |
      v
POST /login
      |
      v
JWT Token
      |
      v
Frontend stores token
      |
      v
Every API request sends token
```

---

# 40. FastAPI Advantages

| Feature       | Why Useful         |
| ------------- | ------------------ |
| Swagger Docs  | Automatic API docs |
| Async support | High performance   |
| Type hints    | Cleaner code       |
| Pydantic      | Validation         |
| SQLModel      | Easy ORM           |
| JWT support   | Secure APIs        |

---

# 41. Recommended Production Stack

| Layer            | Technology                |
| ---------------- | ------------------------- |
| Frontend         | React/Vue                 |
| Backend          | FastAPI                   |
| Database         | PostgreSQL                |
| Reverse Proxy    | Nginx                     |
| Containerization | Docker                    |
| Authentication   | JWT                       |
| Deployment       | Docker Compose/Kubernetes |

---

# 42. Docker Compose Deployment Example

For deployment, Docker Compose can describe multiple services in one file. Create a `docker-compose.yml` with PostgreSQL and pgAdmin:

```yaml id="r6m1k8"
services:
  postgres:
    image: postgres:16
    container_name: postgres-db
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin123
      POSTGRES_DB: companydb
    ports:
      - "5432:5432"

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: admin123
    ports:
      - "5050:80"
    depends_on:
      - postgres
```

Start it with:

```bash
docker compose up -d
```

The manual Docker alternative does the same job with separate commands:

```bash
docker network create pg-network
docker run -d --name postgres-db --network pg-network -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin123 -e POSTGRES_DB=companydb -p 5432:5432 postgres:16
docker run -d --name pgadmin --network pg-network -e PGADMIN_DEFAULT_EMAIL=admin@example.com -e PGADMIN_DEFAULT_PASSWORD=admin123 -p 5050:80 dpage/pgadmin4:latest
```

---

# 43. Suggested Next Learning Topics

After this:

1. Async database operations
2. Alembic migrations
3. Redis caching
4. Background workers
5. WebSockets
6. OAuth login
7. Multi-tenant databases
8. Microservices
9. Kubernetes deployment
10. CI/CD pipelines

---

# 44. Best Practice Advice

Do:

* Use environment variables
* Hash passwords
* Validate inputs
* Use JWT expiry
* Use HTTPS
* Add logging
* Use ORM carefully

Avoid:

* Plain passwords
* Raw SQL from users
* Hardcoded secrets
* Open admin APIs

---

# Project: Student Portal Backend System Using FastAPI + PostgreSQL

This project combines:

* Student Portal
* Backend APIs
* Authentication Server
* JWT Security
* Role-Based Access
* Database APIs

Technology Stack:

| Component        | Technology      |
| ---------------- | --------------- |
| Backend API      | FastAPI         |
| Database         | PostgreSQL      |
| ORM              | SQLModel        |
| Authentication   | JWT             |
| Password Hashing | bcrypt          |
| Deployment       | Docker          |
| API Docs         | Swagger/OpenAPI |

---

# 1. What is a Student Portal?

A student portal is a web/mobile system where students can:

* Login
* View profile
* Check attendance
* View marks
* Submit assignments
* Access courses
* Download notes
* View timetable
* Pay fees
* Communicate with teachers

---

# 2. What is a Backend API?

Frontend applications cannot directly talk to databases securely.

Instead:

```text id="m7p2q4"
Frontend
   |
   v
Backend API
   |
   v
Database
```

Backend APIs:

* receive requests,
* validate users,
* process data,
* return JSON responses.

---

# Example API Response

```json id="j8x4n2"
{
  "student_name": "Aman",
  "attendance": 92
}
```

---

# 3. What is an Authentication Server?

Authentication server handles:

* Login
* Password verification
* Token generation
* Session validation

Instead of every application managing login separately, one authentication service handles all authentication.

---

# Authentication Server Architecture

```text id="k3m9v5"
Frontend
   |
   v
Authentication Server
   |
   v
JWT Token
   |
   v
Other APIs trust the token
```

---

# Example

Student logs in:

```text id="t5x1n8"
POST /login
```

Authentication server checks:

* username,
* password.

Then returns:

```json id="u4q7m3"
{
  "access_token": "JWT_TOKEN"
}
```

Now student uses this token in every request.

---

# Why Authentication Servers Are Important

Benefits:

| Benefit           | Purpose                     |
| ----------------- | --------------------------- |
| Centralized login | One login for all apps      |
| Security          | Secure token validation     |
| Scalability       | Multiple apps use same auth |
| Single Sign-On    | Login once                  |
| API protection    | Secure backend routes       |

---

# Real Examples

| Company     | Authentication System |
| ----------- | --------------------- |
| Google      | Google Login          |
| Microsoft   | Azure AD              |
| GitHub      | GitHub OAuth          |
| College ERP | University SSO        |

---

# 4. Project Architecture

```text id="n6w2p7"
Frontend (React/Vue/Mobile)
          |
          v
     FastAPI Backend
          |
          +------ Authentication APIs
          |
          +------ Student APIs
          |
          +------ Teacher APIs
          |
          +------ Admin APIs
          |
          v
      PostgreSQL
```

---

# 5. Features of Our Student Portal

---

# Authentication Features

* Student login
* Teacher login
* Admin login
* JWT token generation
* Role-based authorization
* Password hashing

---

# Student Features

* View profile
* View marks
* View attendance
* View assignments
* View timetable

---

# Teacher Features

* Upload marks
* Mark attendance
* Upload assignments
* Manage students

---

# Admin Features

* Create users
* Delete users
* Create courses
* Manage departments
* Create semesters

---

# 6. Database Design

---

# Users Table

```text id="q1n8m4"
users
-----
id
username
email
password
role
```

---

# Students Table

```text id="z5k2p9"
students
---------
student_id
user_id
course
semester
attendance
```

---

# Teachers Table

```text id="c7m1x3"
teachers
---------
teacher_id
user_id
department
```

---

# Courses Table

```text id="p8v4r6"
courses
--------
course_id
course_name
teacher_id
```

---

# Marks Table

```text id="a2w9n5"
marks
-----
id
student_id
course_id
marks
```

---

# 7. Project Folder Structure

```text id="y4m7q2"
project/
│
├── main.py
├── database.py
├── models/
│   ├── user.py
│   ├── student.py
│   ├── teacher.py
│   └── marks.py
│
├── routers/
│   ├── auth.py
│   ├── students.py
│   ├── teachers.py
│   └── admin.py
│
├── services/
│   ├── jwt_service.py
│   └── auth_service.py
│
├── middleware/
│   └── auth_middleware.py
│
└── requirements.txt
```

---

# 8. User Roles

| Role    | Permissions    |
| ------- | -------------- |
| student | View own data  |
| teacher | Manage courses |
| admin   | Full access    |

---

# 9. JWT Authentication Flow

---

# Step 1 — Login

```text id="v9p3k1"
POST /login
```

Request:

```json id="f2m6q8"
{
  "username": "aman",
  "password": "mypassword"
}
```

---

# Step 2 — Server Verifies Password

Backend checks:

* username,
* hashed password.

---

# Step 3 — JWT Generated

```json id="r7x4n9"
{
  "access_token": "eyJhbGc..."
}
```

---

# Step 4 — Frontend Stores Token

Usually:

* localStorage,
* cookies,
* mobile secure storage.

---

# Step 5 — Secure API Requests

```text id="t1q8m5"
Authorization: Bearer JWT_TOKEN
```

---

# 10. Example Secure Route

```python id="j5w2n7"
@app.get("/student/profile")
def get_profile(
    current_user = Depends(get_current_user)
):
    return current_user
```

Without token:

* Access denied.

---

# 11. Authentication vs Authorization

| Authentication   | Authorization        |
| ---------------- | -------------------- |
| Who are you?     | What can you access? |
| Login            | Permissions          |
| JWT verification | Role checking        |

---

# Example

Student token cannot:

```text id="m8v1x6"
DELETE /students
```

Admin token can.

---

# 12. Example APIs in Student Portal

---

# Authentication APIs

| API                 | Purpose        |
| ------------------- | -------------- |
| POST /register      | Create account |
| POST /login         | Login          |
| POST /logout        | Logout         |
| POST /refresh-token | Refresh JWT    |

---

# Student APIs

| API                      | Purpose         |
| ------------------------ | --------------- |
| GET /students/me         | View profile    |
| GET /students/marks      | View marks      |
| GET /students/attendance | View attendance |

---

# Teacher APIs

| API              | Purpose         |
| ---------------- | --------------- |
| POST /marks      | Upload marks    |
| POST /attendance | Mark attendance |

---

# Admin APIs

| API                | Purpose        |
| ------------------ | -------------- |
| POST /users        | Create users   |
| DELETE /users/{id} | Delete user    |
| POST /courses      | Create courses |

---

# 13. Example JSON Response

```json id="n2q6w4"
{
  "student_id": 1,
  "name": "Aman Sharma",
  "course": "B.Tech CSE",
  "semester": 5
}
```

---

# 14. Why FastAPI Is Excellent for This Project

| Feature             | Benefit                  |
| ------------------- | ------------------------ |
| Swagger Docs        | Easy API testing         |
| Async Support       | Fast performance         |
| JWT Integration     | Secure APIs              |
| Pydantic Validation | Automatic validation     |
| SQLModel            | Easy database operations |

---

# 15. Security Features Needed

---

# Password Hashing

Never store plain passwords.

Use:

* bcrypt
* Argon2

---

# JWT Expiry

Tokens should expire.

Example:

* 15 min access token
* 7 day refresh token

---

# HTTPS

Always use HTTPS in production.

---

# Rate Limiting

Prevent brute-force login attacks.

---

# Input Validation

Prevent:

* SQL injection,
* malicious data.

---

# 16. What Happens in Real Universities?

Large systems usually have:

```text id="x6m2r9"
Authentication Service
        |
        +---- Student Portal
        |
        +---- LMS
        |
        +---- Attendance System
        |
        +---- Exam Portal
```

Single login works everywhere.

This is called:

* SSO (Single Sign-On)

---

# 17. Advanced Features You Can Add

---

# Notifications

* Email alerts
* SMS alerts
* Push notifications

---

# File Uploads

Students upload:

* assignments,
* reports,
* PDFs.

---

# AI Features

* AI chatbot
* Attendance prediction
* Student analytics

---

# Real-Time Features

Using WebSockets:

* live chat,
* live attendance,
* live announcements.

---

# 18. Docker Deployment

Use Docker Compose.

```text id="b5w1k8"
services:
  api
  postgres
  nginx
```

---

# 19. Production Components

| Component  | Purpose          |
| ---------- | ---------------- |
| Nginx      | Reverse proxy    |
| PostgreSQL | Database         |
| FastAPI    | Backend          |
| Redis      | Cache            |
| Celery     | Background tasks |
| Docker     | Containerization |

---

# 20. Recommended Learning Order

---

# Phase 1

Learn:

* SQL
* PostgreSQL
* CRUD APIs

---

# Phase 2

Learn:

* JWT
* Authentication
* Authorization

---

# Phase 3

Learn:

* SQLModel
* Relationships
* Joins

---

# Phase 4

Learn:

* Docker
* Nginx
* Deployment

---

# Phase 5

Learn:

* Async APIs
* WebSockets
* Scaling

---
---
# What is ERD?

ERD stands for:

# Entity Relationship Diagram

It is a visual diagram used to design and understand databases.

ERD shows:

* entities (tables),
* attributes (columns),
* relationships between tables.

---

# Why ERD is Important

Without ERD:

* database becomes confusing,
* duplicate data appears,
* relationships become unclear,
* developers create inconsistent structures.

ERD helps before writing SQL.

---

# Real Analogy

Think of a university.

You have:

* Students
* Teachers
* Courses
* Departments

These are connected.

Example:

```text id="m2x7q4"
Student --> enrolls in --> Course
Teacher --> teaches --> Course
Course --> belongs to --> Department
```

ERD visually represents these relationships.

---

# Basic ERD Components

---

# 1. Entity

Entity means a table.

Examples:

* students
* teachers
* courses
* departments

In ERD:

```text id="p5n1v8"
+-----------+
| students  |
+-----------+
```

---

# 2. Attributes

Attributes are columns.

Example:

```text id="a7k3m2"
students
---------
student_id
name
email
course
```

---

# 3. Relationships

Relationships connect entities.

Example:

```text id="u9w4q1"
students --> courses
```

Meaning:

* one student belongs to a course.

---

# Example Simple ERD

```text id="d6x2p9"
+------------+
| students   |
+------------+
| student_id |
| name       |
| email      |
| course_id  |
+------------+
       |
       |
       v
+------------+
| courses    |
+------------+
| course_id  |
| course     |
+------------+
```

---

# Primary Key in ERD

Primary Key uniquely identifies rows.

Example:

```text id="q8n5r3"
student_id
course_id
```

Usually shown as:

* PK
* underlined
* key icon

---

# Foreign Key in ERD

Foreign Key connects tables.

Example:

```text id="v1m7k4"
course_id
```

inside `students` references `courses`.

---

# Why Relationships Matter

Without relationships:

* duplicate data increases,
* queries become difficult,
* normalization fails.

Relationships help:

* maintain consistency,
* avoid redundancy,
* support joins.

---

# Types of Relationships

---

# 1. One-to-One (1:1)

One row linked to one row.

Example:

```text id="y4p2n8"
Student --> Student ID Card
```

Each student has one ID card.

---

# 2. One-to-Many (1:N)

Most common relationship.

Example:

```text id="j6x9m1"
Department --> Students
```

One department has many students.

---

# 3. Many-to-Many (M:N)

Example:

```text id="k3v8q5"
Students <--> Courses
```

One student can enroll in many courses.

One course has many students.

Requires junction table.

---

# Example Many-to-Many Design

```text id="t5n2x7"
students
courses
student_courses
```

`student_courses` stores mapping.

---

# Why ERD is Used Before Database Creation

ERD helps:

| Purpose            | Benefit                      |
| ------------------ | ---------------------------- |
| Planning           | Better design                |
| Visualization      | Easy understanding           |
| Relationships      | Proper foreign keys          |
| Team communication | Developers understand system |
| Normalization      | Avoid duplicate data         |
| Documentation      | Future maintenance           |

---

# Real Software Development Flow

```text id="w9m4p1"
Requirement
    |
    v
ERD Design
    |
    v
Database Tables
    |
    v
Backend APIs
    |
    v
Frontend
```

ERD comes before coding.

---

# Example Student Portal ERD

---

# Entities

```text id="r7n3x8"
users
students
teachers
courses
attendance
marks
```

---

# Relationships

```text id="s1k6q2"
users --> students
teachers --> courses
students --> marks
students --> attendance
```

---

# Sample ERD Representation

```text id="c8v5m4"
+---------+
| users   |
+---------+
| user_id |
| email   |
| role    |
+---------+
     |
     |
     v
+-------------+
| students    |
+-------------+
| student_id  |
| user_id FK  |
| semester    |
+-------------+
```

---

# ERD Levels

---

# 1. Conceptual ERD

High-level overview.

Shows:

* entities,
* relationships.

No technical details.

Used with:

* clients,
* management.

---

# 2. Logical ERD

Adds:

* columns,
* primary keys,
* foreign keys.

Still database-independent.

---

# 3. Physical ERD

Actual implementation.

Includes:

* PostgreSQL types,
* indexes,
* constraints.

Used by developers.

---

# ERD Symbols

| Symbol    | Meaning      |
| --------- | ------------ |
| Rectangle | Entity/Table |
| Oval      | Attribute    |
| Diamond   | Relationship |
| Line      | Connection   |

Modern tools often use simplified notation.

---

# Crow's Foot Notation

Very common ERD style.

Example:

```text id="x4n7q1"
Department |-----< Students
```

Meaning:

* one department,
* many students.

---

# Tools Used for ERD

---

# Beginner-Friendly Tools

| Tool         | Purpose                    |
| ------------ | -------------------------- |
| draw.io      | Free diagram tool          |
| dbdiagram.io | Easy ERD creation          |
| Lucidchart   | Professional diagrams      |
| DBeaver      | Generate ERD from database |
| pgAdmin      | PostgreSQL management      |

---

# Professional Database Modeling Tools

| Tool               | Usage               |
| ------------------ | ------------------- |
| MySQL Workbench    | MySQL ERD           |
| pgModeler          | PostgreSQL modeling |
| ERwin Data Modeler | Enterprise modeling |
| Navicat            | Database design     |

---

# Recommended Tool for Beginners

Use:

1. dbdiagram.io
2. draw.io

because:

* easy,
* visual,
* free,
* browser-based.

---

# Example dbdiagram.io Syntax

```text id="g5q2n9"
Table students {
  student_id int [pk]
  name varchar
  course_id int
}

Table courses {
  course_id int [pk]
  course_name varchar
}

Ref: students.course_id > courses.course_id
```

Automatically creates ERD.

---

# ERD vs Database Schema

| ERD                | Schema               |
| ------------------ | -------------------- |
| Visual design      | Actual SQL structure |
| Planning stage     | Implementation       |
| Easy to understand | Technical            |
| Used before coding | Used during coding   |

---

# ERD and Normalization

ERD helps normalization by:

* separating entities,
* reducing duplication,
* improving relationships.

Example:

Bad Design:

```text id="v8m1q4"
student_name
course1
course2
course3
```

Good ERD:

```text id="n3x7k2"
students
courses
student_courses
```

---

# ERD and APIs

When building APIs:

```text id="u6p4n1"
ERD
  |
  v
Database
  |
  v
FastAPI Models
  |
  v
JSON APIs
```

Backend structure usually follows ERD.

---

# ERD in FastAPI + SQLModel

Example SQLModel:

```python id="p9x2m5"
class Student(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    course_id: int | None = Field(default=None, foreign_key="course.id")
```

This corresponds directly to ERD relationship.

---

# Real Enterprise Usage

ERDs are heavily used in:

* universities,
* banks,
* ERP systems,
* hospital systems,
* e-commerce,
* fintech,
* SaaS applications.

Before large systems are built, ERD is usually mandatory.

---

# Best Practices

Before creating APIs or writing SQL:

1. Design ERD first
2. Identify entities
3. Define relationships
4. Add primary keys
5. Add foreign keys
6. Normalize tables
7. Then write SQL/FastAPI code

Good ERD design prevents major backend problems later.
