# Lecture 17

# Query Optimization: Indexing and Performance Tuning

**Course Outcome:** CO2 – Optimize database queries for better performance using indexing and tuning techniques.

---

## 1. Introduction

In L16, we learned how to implement CRUD operations on databases. However, as applications grow and data volume increases, slow queries can severely impact user experience and system performance. A query that takes milliseconds with 1,000 records might take seconds with 1,000,000 records.

**Query optimization** is the process of improving database query performance by reducing execution time and resource consumption. It involves understanding how databases execute queries and applying techniques like indexing, query restructuring, and configuration tuning.

By the end of this lecture, you will have:

1. Understanding of how databases execute queries (query execution plans).
2. Knowledge of indexing techniques and their impact on performance.
3. Skills to identify slow queries and optimize them.
4. Familiarity with database configuration tuning.
5. Hands-on experience measuring and improving query performance.

---

## 2. Why Query Optimization Matters

| Scenario | Without Optimization | With Optimization |
|----------|----------------------|-------------------|
| Search products | 5 seconds | 50 milliseconds |
| Load user dashboard | 3 seconds | 300 milliseconds |
| Generate report | 30 seconds | 2 seconds |
| API response time | 2000ms | 200ms |

**Impact of slow queries:**

* Poor user experience (users abandon slow websites)
* Increased server costs (more CPU/memory usage)
* Scalability limitations (cannot handle concurrent users)
* Revenue loss (e-commerce abandonment)

---

## 3. How Databases Execute Queries

When you run a SQL query, the database follows these steps:

<svg xmlns="http://www.w3.org/2000/svg" width="900" height="200" viewBox="0 0 900 200">
<rect width="900" height="200" fill="white"/>
<text x="450" y="30" text-anchor="middle" font-size="18" font-weight="bold">Query Execution Flow</text>

<rect x="40" y="60" width="120" height="60" rx="8" fill="#EAF4FF" stroke="#1E88E5"/>
<text x="100" y="95" text-anchor="middle" font-size="12">Parse</text>

<line x1="160" y1="90" x2="200" y2="90" stroke="black" stroke-width="2"/>

<rect x="200" y="60" width="120" height="60" rx="8" fill="#E8F8EC" stroke="#43A047"/>
<text x="260" y="95" text-anchor="middle" font-size="12">Optimize</text>

<line x1="320" y1="90" x2="360" y2="90" stroke="black" stroke-width="2"/>

<rect x="360" y="60" width="120" height="60" rx="8" fill="#FFF8E6" stroke="#FB8C00"/>
<text x="420" y="95" text-anchor="middle" font-size="12">Plan</text>

<line x1="480" y1="90" x2="520" y2="90" stroke="black" stroke-width="2"/>

<rect x="520" y="60" width="120" height="60" rx="8" fill="#F3E5F5" stroke="#8E24AA"/>
<text x="580" y="95" text-anchor="middle" font-size="12">Execute</text>

<line x1="640" y1="90" x2="680" y2="90" stroke="black" stroke-width="2"/>

<rect x="680" y="60" width="120" height="60" rx="8" fill="#E0F7FA" stroke="#00ACC1"/>
<text x="740" y="95" text-anchor="middle" font-size="12">Return</text>

<text x="450" y="155" text-anchor="middle" font-size="12">The optimizer chooses the best execution plan based on statistics and indexes</text>
</svg>

### 3.1 Full Table Scan

Without indexes, the database must read every row to find matching records. This is called a **full table scan**.

```sql
-- This causes a full table scan without an index
SELECT * FROM students WHERE branch = 'CSE';
```

For 1 million students, this reads all 1,000,000 rows.

### 3.2 Index Scan

With an index, the database can jump directly to matching rows. This is called an **index scan**.

```sql
-- Create index on branch column
CREATE INDEX idx_students_branch ON students(branch);

-- Now this query uses the index
SELECT * FROM students WHERE branch = 'CSE';
```

For 1 million students with 100,000 CSE students, this reads only 100,000 rows.

---

## 4. Indexing

An **index** is a data structure that improves the speed of data retrieval operations. It works like a book's index — instead of reading every page, you look up the topic in the index and jump directly to the relevant page.

### 4.1 Types of Indexes

**B-Tree Index (Default)**

Most common index type. Suitable for equality and range queries.

```sql
CREATE INDEX idx_students_email ON students(email);
```

**Composite Index**

Index on multiple columns. Useful for queries filtering on multiple fields.

```sql
CREATE INDEX idx_students_branch_name ON students(branch, name);
```

**Unique Index**

Ensures all values in the column are unique.

```sql
CREATE UNIQUE INDEX idx_students_email ON students(email);
```

**Partial Index**

Index only a subset of rows. Useful when you frequently query a specific condition.

```sql
CREATE INDEX idx_active_students ON students(id) WHERE status = 'active';
```

### 4.2 When to Create Indexes

| Create Index On | Reason |
|-----------------|--------|
| Primary keys | Automatic in most databases |
| Foreign keys | Speed up JOIN operations |
| WHERE clause columns | Speed up filtered queries |
| ORDER BY columns | Speed up sorting |
| GROUP BY columns | Speed up aggregation |
| High-cardinality columns | Many unique values (email, phone) |

### 4.3 When NOT to Create Indexes

| Avoid Indexing | Reason |
|----------------|--------|
| Small tables | Full scan is faster than index scan |
| Low-cardinality columns | Few unique values (boolean, gender) |
| Frequently updated columns | Index maintenance overhead |
| Columns rarely used in queries | Wasted storage and maintenance |

### 4.4 Index Trade-offs

| Advantage | Disadvantage |
|-----------|--------------|
| Faster reads | Slower writes (INSERT, UPDATE, DELETE) |
| Efficient sorting | Additional storage space |
| Faster JOINs | Index maintenance overhead |
| Improved WHERE performance | Complex index management |

---

## 5. Identifying Slow Queries

### 5.1 EXPLAIN Command

The `EXPLAIN` command shows how a query will be executed:

```sql
EXPLAIN SELECT * FROM students WHERE branch = 'CSE';
```

**PostgreSQL Output:**

```
Seq Scan on students  (cost=0.00..1250.00 rows=100000 width=52)
  Filter: (branch = 'CSE')
```

**With Index:**

```
Index Scan using idx_students_branch on students  (cost=0.42..8500.00 rows=100000 width=52)
  Index Cond: (branch = 'CSE')
```

### 5.2 EXPLAIN ANALYZE

Shows actual execution time:

```sql
EXPLAIN ANALYZE SELECT * FROM students WHERE branch = 'CSE';
```

### 5.3 Slow Query Log

Enable slow query logging to identify problematic queries:

**MySQL:**

```sql
SET GLOBAL slow_query_log = 1;
SET GLOBAL long_query_time = 2;  -- Log queries taking > 2 seconds
```

**PostgreSQL:**

```sql
ALTER SYSTEM SET log_min_duration_statement = 2000;  -- Log queries > 2 seconds
SELECT pg_reload_conf();
```

---

## 6. Query Optimization Techniques

### 6.1 Use Proper WHERE Clauses

**Bad:**

```sql
-- Functions prevent index usage
SELECT * FROM students WHERE UPPER(branch) = 'CSE';

-- Wildcard at start prevents index usage
SELECT * FROM students WHERE name LIKE '%aarav%';
```

**Good:**

```sql
-- Direct column comparison uses index
SELECT * FROM students WHERE branch = 'CSE';

-- Wildcard at end can use index
SELECT * FROM students WHERE name LIKE 'aarav%';
```

### 6.2 Avoid SELECT *

**Bad:**

```sql
SELECT * FROM students WHERE branch = 'CSE';
```

**Good:**

```sql
SELECT id, name, email FROM students WHERE branch = 'CSE';
```

**Why:** `SELECT *` reads all columns, even those not needed. This increases I/O and memory usage.

### 6.3 Use JOIN Instead of Subqueries

**Bad:**

```sql
SELECT * FROM students 
WHERE department_id IN (SELECT id FROM departments WHERE name = 'CSE');
```

**Good:**

```sql
SELECT s.* FROM students s
JOIN departments d ON s.department_id = d.id
WHERE d.name = 'CSE';
```

### 6.4 Pagination with OFFSET vs Cursor

**Bad (slow for large offsets):**

```sql
SELECT * FROM students ORDER BY id LIMIT 10 OFFSET 100000;
```

**Good (cursor-based):**

```sql
SELECT * FROM students WHERE id > 100000 ORDER BY id LIMIT 10;
```

### 6.5 Batch Operations

**Bad:**

```sql
-- Individual inserts (slow)
INSERT INTO students (name, email) VALUES ('Aarav', 'aarav@upes');
INSERT INTO students (name, email) VALUES ('Diya', 'diya@upes');
INSERT INTO students (name, email) VALUES ('Rohan', 'rohan@upes');
```

**Good:**

```sql
-- Batch insert (fast)
INSERT INTO students (name, email) VALUES 
    ('Aarav', 'aarav@upes'),
    ('Diya', 'diya@upes'),
    ('Rohan', 'rohan@upes');
```

---

## 7. Database Configuration Tuning

### 7.1 Connection Pooling

Reuse database connections instead of creating new ones for each request.

**SQLAlchemy:**

```python
from sqlalchemy import create_engine

engine = create_engine(
    "postgresql://user:pass@localhost/student_db",
    pool_size=20,          # Number of persistent connections
    max_overflow=10,       # Additional connections when needed
    pool_timeout=30,       # Seconds to wait for a connection
    pool_recycle=1800      # Recycle connections after 30 minutes
)
```

### 7.2 Query Cache

Cache frequently accessed, rarely changing data.

**MySQL:**

```sql
SET GLOBAL query_cache_size = 1048576;  -- 1MB cache
SET GLOBAL query_cache_type = 1;
```

### 7.3 Memory Configuration

**PostgreSQL:**

```sql
-- Increase shared buffers (25% of RAM)
ALTER SYSTEM SET shared_buffers = '4GB';

-- Increase work memory for sorts
ALTER SYSTEM SET work_mem = '256MB';
```

---

## 8. Performance Measurement

### 8.1 Measuring Query Time

**Python:**

```python
import time

start = time.time()
students = session.query(Student).filter(Student.branch == "CSE").all()
end = time.time()

print(f"Query took {end - start:.4f} seconds")
print(f"Returned {len(students)} students")
```

**MySQL:**

```sql
-- Enable profiling
SET profiling = 1;

-- Run query
SELECT * FROM students WHERE branch = 'CSE';

-- Show profile
SHOW PROFILE;
```

### 8.2 Benchmarking

```python
import time

def benchmark_query(query_func, iterations=100):
    start = time.time()
    for _ in range(iterations):
        query_func()
    end = time.time()
    return (end - start) / iterations

avg_time = benchmark_query(
    lambda: session.query(Student).filter(Student.branch == "CSE").all()
)
print(f"Average query time: {avg_time*1000:.2f}ms")
```

---

## 9. Summary

* **Query optimization** is essential for maintaining application performance as data grows.
* **Indexing** dramatically improves read performance by allowing the database to jump directly to matching rows.
* Use `EXPLAIN` to understand how queries are executed and identify bottlenecks.
* Avoid `SELECT *`, use proper `WHERE` clauses, and prefer `JOIN` over subqueries.
* **Database configuration** (connection pooling, caching, memory) significantly impacts performance.

### Key Takeaways

* Indexes speed up reads but slow down writes — index strategically.
* `EXPLAIN` and `EXPLAIN ANALYZE` reveal query execution plans.
* Avoid `SELECT *` — specify only needed columns.
* Use cursor-based pagination for large datasets.
* Connection pooling and caching reduce database load.

In **L18 – Designing RESTful APIs: Endpoint Planning and Resource Modeling**, you will learn how to design well-structured APIs that map to your data models.

---

### Lab Exercise

1. Create a `students` table with 100,000 sample records using a script.
2. Run a query without an index and measure the execution time.
3. Create an index on the `branch` column and re-run the same query.
4. Use `EXPLAIN` to compare the execution plans before and after indexing.
5. Optimize the following slow query and explain your changes:

```sql
SELECT * FROM students 
WHERE UPPER(branch) = 'CSE' 
AND name LIKE '%ar%'
ORDER BY enrollment_date;
```

6. Implement connection pooling in a FastAPI application using SQLAlchemy.
7. Benchmark your API response times before and after optimization.