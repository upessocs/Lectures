# Lab: Relational vs Document Databases — PostgreSQL & MongoDB

## Assignment

- Create a database `student_management` (PostgreSQL preferred).
- Create a `students` table: `id`, `name`, `branch`, `email`, `enrollment_date`.
- Insert at least 5 student records.
- Write queries for: students in `CSE`, students enrolled after Jan 2024, update a branch, delete a record.
- Install MongoDB, create a `students` collection with at least 3 documents.
- Compare the experience of inserting/querying data in PostgreSQL vs MongoDB.

---

## Module 1 — Installing PostgreSQL (CLI)

### macOS (Homebrew)

```bash
# install postgresql (includes psql client + server)
brew install postgresql@16

# start the service now and on every login
brew services start postgresql@16

# confirm it's running and check version
pg_isready
psql --version
```

### Windows (via WSL — recommended over native Windows installer)

```bash
# from PowerShell, install WSL + a Linux distro if you don't have one yet
wsl --install -d Ubuntu

# then open the Ubuntu shell and follow the WSL/Linux steps below
```

### WSL / Ubuntu / Debian (CLI)

```bash
# refresh package lists
sudo apt update

# install server + client
sudo apt install -y postgresql postgresql-contrib

# postgresql starts automatically on Debian/Ubuntu; verify:
sudo systemctl status postgresql

# if not running, start + enable on boot
sudo systemctl enable --now postgresql
```

### First-time setup (all platforms)

```bash
# the installer creates a Linux/macOS user "postgres" with a matching DB role
# switch to it to get admin access to psql
sudo -u postgres psql

# inside psql, set a password for that role (optional but recommended)
# ALTER USER postgres WITH PASSWORD 'your_password';
```

---

## Module 2 — psql meta-commands

These start with `\` and do **not** need a semicolon (plain SQL statements do).

```sql
\q                          -- quit psql
\l                           -- list all databases
\c student_management        -- connect to a database
\dt                           -- list tables in current database
\d students                  -- describe a table's columns/types
\du                           -- list roles/users
\?                            -- help: psql meta-commands
\h CREATE TABLE               -- help: syntax for a specific SQL statement
\i /path/to/file.sql          -- run a .sql script inside psql
```

```bash
# import/export run from the terminal, NOT inside psql
pg_dump student_management > backup.sql
psql student_management < backup.sql
```

---

## Module 3 — SQL CRUD (with example data)

### Create database + table

```sql
CREATE DATABASE student_management;
\c student_management

CREATE TABLE students (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    branch VARCHAR(50),
    email VARCHAR(255) UNIQUE,
    enrollment_date DATE DEFAULT CURRENT_DATE
);
```

### Insert (Create)

```sql
INSERT INTO students (name, branch, email, enrollment_date)
VALUES
    ('Alice Sharma',  'CSE', 'alice@example.com',  '2024-01-15'),
    ('Bilal Khan',    'ECE', 'bilal@example.com',  '2023-08-10'),
    ('Carla Gomez',   'CSE', 'carla@example.com',  '2024-03-02'),
    ('Divya Nair',    'ME',  'divya@example.com',  '2023-11-20'),
    ('Ethan Brooks',  'CSE', 'ethan@example.com',  '2024-02-18');
```

### Read (Retrieve)

```sql
-- all students in CSE
SELECT * FROM students WHERE branch = 'CSE';

-- students enrolled after Jan 2024
SELECT * FROM students WHERE enrollment_date > '2024-01-31';

-- case-insensitive name search
SELECT * FROM students WHERE name ILIKE 'a%';
```

### Update

```sql
UPDATE students
SET branch = 'AI/ML'
WHERE email = 'bilal@example.com';
```

### Delete

```sql
-- always check what you're about to delete first
SELECT * FROM students WHERE email = 'divya@example.com';

DELETE FROM students
WHERE email = 'divya@example.com';
```

### Aggregation (bonus)

```sql
SELECT branch, COUNT(*) AS total
FROM students
GROUP BY branch
ORDER BY total DESC;
```

---

## Module 4 — MongoDB equivalent (CLI)

```bash
# WSL/Ubuntu install
sudo apt update
sudo apt install -y mongodb

# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# launch the shell
mongosh
```

```javascript
// inside mongosh
use student_management

db.students.insertMany([
  { name: "Alice Sharma", branch: "CSE", email: "alice@example.com", enrollment_date: new Date("2024-01-15") },
  { name: "Bilal Khan",   branch: "ECE", email: "bilal@example.com", enrollment_date: new Date("2023-08-10") },
  { name: "Carla Gomez",  branch: "CSE", email: "carla@example.com", enrollment_date: new Date("2024-03-02") }
])

db.students.find({ branch: "CSE" })
db.students.updateOne({ email: "bilal@example.com" }, { $set: { branch: "AI/ML" } })
db.students.deleteOne({ email: "carla@example.com" })
```

---

## Module 5 — JSONB in PostgreSQL, and replacing MongoDB with it

PostgreSQL's `jsonb` column type stores JSON in a decomposed binary form (not plain text), so it can be indexed and queried efficiently — this is what lets a relational table behave like a document store when you need flexible/nested fields alongside strict columns.

### Add a flexible field to the relational table

```sql
ALTER TABLE students ADD COLUMN profile JSONB;

UPDATE students
SET profile = '{"skills": ["python", "sql"], "clubs": {"robotics": true}}'
WHERE email = 'alice@example.com';
```

### Querying JSONB

```sql
-- -> returns JSON, ->> returns text
SELECT profile -> 'skills' FROM students WHERE email = 'alice@example.com';
SELECT profile ->> 'clubs' FROM students WHERE email = 'alice@example.com';

-- @> containment check (does profile include this key/value?)
SELECT * FROM students WHERE profile @> '{"clubs": {"robotics": true}}';

-- index JSONB for fast lookups, same idea as a MongoDB index
CREATE INDEX idx_students_profile ON students USING GIN (profile);
```

### Comparison: MongoDB collection vs jsonb column

| Aspect | MongoDB collection | PostgreSQL `jsonb` column |
|---|---|---|
| Storage | Every document is schemaless JSON/BSON | JSON stored per-row, alongside strict typed columns |
| Query language | MQL (`find`, `$set`, aggregation pipeline) | Standard SQL + JSON operators (`->`, `->>`, `@>`) |
| Indexing | Default `_id` index, secondary indexes on fields | B-tree on normal columns, GIN index on JSONB |
| Transactions | Multi-document transactions since v4.0, but not the primary model | Full ACID by default, across relational + JSONB columns in one statement |
| Joins | No native joins; usually `$lookup` or app-side joins | Native `JOIN`, can combine relational and JSONB data in one query |
| When it fits | Data is naturally document-shaped and schema varies a lot per record | You want strict schema for core data (id, name, dates) but flexible schema for a subset (profile, metadata, settings) |

**Takeaway:** for this lab's use case (students with a few flexible extra attributes), a single PostgreSQL table with a `jsonb` column often replaces the need for a separate MongoDB database entirely — you get relational integrity (foreign keys, transactions, joins) *and* document flexibility in one engine.