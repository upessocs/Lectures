# SQL Tutorial with PostgreSQL – From Docker Installation to Normalization and Joins

Welcome! This tutorial will take you from zero to comfortable SQL using **PostgreSQL**, highlighting features that are unique (or particularly elegant) in this database. We’ll use Docker for a clean, no‑mess setup, and you’ll learn by solving real‑world tasks on a small e‑commerce database.

---

## 1. Installing PostgreSQL with Docker

We’ll run PostgreSQL and pgAdmin (a graphical interface) inside containers. That way you don’t need to install any database software on your machine – only Docker.

### 1.1 Create a Docker network
Containers need to communicate. Create a dedicated network:
```bash
docker network create pg-network
```

### 1.2 Start PostgreSQL
```bash
docker run -d \
  --name postgres-tutorial \
  --network pg-network \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -p 5432:5432 \
  postgres:latest
```
- `POSTGRES_PASSWORD` sets the superuser (`postgres`) password.
- Port `5432` is exposed so you can connect from your host machine as well.

### 1.3 Start pgAdmin (optional but helpful)
```bash
docker run -d \
  --name pgadmin4 \
  --network pg-network \
  -p 5050:80 \
  -e PGADMIN_DEFAULT_EMAIL=admin@example.com \
  -e PGADMIN_DEFAULT_PASSWORD=admin \
  dpage/pgadmin4
```
Then open **http://localhost:5050** in your browser, log in with the credentials above, and add a new server:
- **Host name/address:** `postgres-tutorial` (the container name)
- **Port:** `5432`
- **Username:** `postgres`
- **Password:** `mysecretpassword`

### 1.4 psql – the command‑line tool
You can jump directly into PostgreSQL’s interactive terminal using Docker:
```bash
docker exec -it postgres-tutorial psql -U postgres
```
You’ll see a prompt like `postgres=#`. Throughout this tutorial, we’ll write SQL in that **psql** session (or inside pgAdmin’s query tool).  
To exit psql, type `\q`.

---

## 2. Creating the Dummy Database

Our example models a small webshop: customers, products, orders and order items.

PostgreSQL‑specific details you’ll see:
- **`SERIAL`** – auto‑incrementing integer (a syntactic sugar for creating a sequence).
- **`BOOLEAN`** – true/false column (not all databases have a native boolean type).
- **`TIMESTAMPTZ`** – timestamp with time zone, strongly recommended for real‑world data.
- **`RETURNING`** – after INSERT/UPDATE/DELETE, immediately get back the affected rows (PostgreSQL extension).

Create the database (in psql):
```sql
CREATE DATABASE webshop;
```
Then connect to it: `\c webshop` (or in pgAdmin, select it from the dropdown).

### 2.1 Create tables
```sql
-- Customers
CREATE TABLE customers (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT UNIQUE,
    signup_date TIMESTAMPTZ DEFAULT NOW(),
    active      BOOLEAN DEFAULT TRUE
);

-- Products
CREATE TABLE products (
    id       SERIAL PRIMARY KEY,
    name     TEXT NOT NULL,
    price    NUMERIC(10,2) CHECK (price > 0),
    category TEXT
);

-- Orders
CREATE TABLE orders (
    id          SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    order_date  TIMESTAMPTZ DEFAULT NOW(),
    total_amount NUMERIC(10,2)
);

-- Order items (composite primary key)
CREATE TABLE order_items (
    order_id       INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id     INTEGER REFERENCES products(id) ON DELETE RESTRICT,
    quantity       INTEGER CHECK (quantity > 0),
    price_per_unit NUMERIC(10,2),
    PRIMARY KEY (order_id, product_id)
);
```

### 2.2 Insert sample data (with RETURNING)
PostgreSQL’s **`RETURNING`** clause gives you back the columns of the row(s) you just inserted/updated/deleted – incredibly handy.

```sql
-- Insert customers and see their auto-generated IDs
INSERT INTO customers (name, email)
VALUES
  ('Alice Johnson', 'alice@example.com'),
  ('Bob Smith', 'bob@example.com'),
  ('Charlie Brown', 'charlie@example.com'),
  ('Diana Prince', 'diana@example.com')
RETURNING id, name;
```
(You should see 4 rows with ids 1–4.)

Insert products:
```sql
INSERT INTO products (name, price, category)
VALUES
  ('Laptop', 999.99, 'Electronics'),
  ('Mouse', 19.99, 'Electronics'),
  ('Desk Chair', 149.99, 'Furniture'),
  ('Notebook', 2.99, 'Stationery'),
  ('Headphones', 79.99, 'Electronics')
RETURNING id, name;
```

Create orders. We’ll insert an order and its items together using a transaction (optional; just show `RETURNING` again):
```sql
INSERT INTO orders (customer_id, total_amount)
VALUES
  (1, 1019.98),
  (2, 19.99),
  (1, 82.98),
  (3, 2.99)
RETURNING id;

-- Now order items (we know the order IDs from above: 1,2,3,4)
INSERT INTO order_items (order_id, product_id, quantity, price_per_unit)
VALUES
  (1, 1, 1, 999.99),  -- Laptop
  (1, 2, 1, 19.99),   -- Mouse
  (2, 2, 1, 19.99),   -- Mouse
  (3, 5, 1, 79.99),   -- Headphones
  (3, 4, 1, 2.99),    -- Notebook
  (4, 4, 1, 2.99)     -- Notebook
RETURNING *;
```

Now we have realistic data to work with.

---

## 3. Basic Querying – `SELECT`, `WHERE`, `ORDER BY`, `LIMIT`

**Task 1:** *List all active customers, ordered alphabetically by name.*

**Explanation:**
- **`SELECT`** – chooses columns (use `*` for all).
- **`FROM`** – which table.
- **`WHERE`** – filters rows (here only `active IS TRUE`).
- **`ORDER BY`** – sorts; `ASC` is default, `DESC` for descending.

```sql
SELECT name, email
FROM customers
WHERE active = TRUE
ORDER BY name ASC;
```

**Task 2:** *Find electronics products whose price is above 20, using case‑insensitive search on category.*

**Explanation:**
- PostgreSQL’s **`ILIKE`** is a case‑insensitive `LIKE` – very useful because `LIKE` is case‑sensitive.
- **`AND`** to combine conditions.
- **`LIMIT`** restricts the number of rows returned.

```sql
SELECT name, price
FROM products
WHERE price > 20
  AND category ILIKE 'elec%'   -- % matches any sequence of characters
ORDER BY price DESC
LIMIT 5;
```

---

## 4. Data Manipulation with `RETURNING`

### 4.1 INSERT and get generated ID
**Task 3:** *Add a new customer and immediately obtain the new ID and signup date.*

```sql
INSERT INTO customers (name, email)
VALUES ('Eve Adams', 'eve@example.com')
RETURNING id, name, signup_date;
```
`RETURNING` is a PostgreSQL extension that returns the values you just inserted – you avoid a separate `SELECT`.

### 4.2 UPDATE with RETURNING
**Task 4:** *Deactivate the customer 'Bob Smith' and see the updated row.*

```sql
UPDATE customers
SET active = FALSE
WHERE name = 'Bob Smith'
RETURNING id, name, active;
```

### 4.3 DELETE with RETURNING
**Task 5:** *Remove the order item for product ‘Notebook’ from order 3, and get back what was deleted.*

```sql
DELETE FROM order_items
WHERE order_id = 3 AND product_id = 4
RETURNING *;
```

---

## 5. Aggregation and Grouping

**Task 6:** *Find the total amount spent by each customer, but only show those who spent more than 500.*

**Explanation:**
- **`SUM()`**, **`COUNT()`**, **`AVG()`**, **`MAX()`**, **`MIN()`** aggregate values.
- **`GROUP BY`** groups rows that have the same value in a column.
- **`HAVING`** filters groups (like `WHERE` for aggregate results).

```sql
SELECT
    c.name,
    SUM(o.total_amount) AS total_spent
FROM customers c
JOIN orders o ON c.id = o.customer_id    -- join explained later, but needed here
GROUP BY c.name
HAVING SUM(o.total_amount) > 500
ORDER BY total_spent DESC;
```
(You should see Alice Johnson with a total > 1000.)

---

## 6. `DISTINCT ON` and `NULL` handling

### 6.1 `DISTINCT ON` – get first row per group
**Task 7:** *For each customer, show only their most recent order.*

**Explanation:**
- **`DISTINCT ON (expression)`** is a PostgreSQL extension. It keeps the first row for each distinct value of the expression(s), according to the `ORDER BY` inside the same query. It’s extremely concise compared to subqueries or window functions in other databases.

```sql
SELECT DISTINCT ON (customer_id)
    customer_id,
    id AS order_id,
    order_date,
    total_amount
FROM orders
ORDER BY customer_id, order_date DESC;
```
Here we sort by `customer_id` (for distinctness) and then by `order_date DESC` so the latest order comes first per customer.

### 6.2 Concatenation, `COALESCE`, and the `||` operator
**Task 8:** *Create a greeting phrase for each customer. If an email is missing, show ‘no email’ instead of NULL.*

**Explanation:**
- PostgreSQL uses `||` for string concatenation.
- **`COALESCE(value, fallback)`** returns the first non‑NULL argument – it’s standard SQL, but we’ll highlight it.

```sql
SELECT
    'Hello ' || name || ', your contact: ' || COALESCE(email, 'no email') AS greeting
FROM customers;
```

---

## 7. Upsert – `INSERT … ON CONFLICT`

**Task 9:** *Add a product ‘Laptop’ with a new price, but if it already exists (by name), update the price instead of failing.*

**Explanation:**
- PostgreSQL’s **`ON CONFLICT`** clause (often called “upsert”) lets you define what happens when a unique constraint or primary key would be violated. You can `DO NOTHING` or `DO UPDATE`.
- Here we assume `name` is unique (we didn’t add a constraint earlier; let’s add it first).

```sql
-- Add unique constraint on product name
ALTER TABLE products ADD CONSTRAINT unique_product_name UNIQUE (name);
```

Now perform the upsert:
```sql
INSERT INTO products (name, price, category)
VALUES ('Laptop', 1099.99, 'Electronics')
ON CONFLICT (name) DO UPDATE
  SET price = EXCLUDED.price,
      category = EXCLUDED.category
RETURNING *;
```
- `EXCLUDED` refers to the row that was proposed for insertion. This saves a round‑trip: no need to check existence first.

---

## 8. Common Table Expressions (CTEs)

**Task 10:** *Find the top 3 customers by total spending using a CTE.*

**Explanation:**
- **`WITH … AS ()`** defines a temporary result set that you can reference later in the same query – improves readability and allows recursion (PostgreSQL supports recursive CTEs).
- We’ll use `LIMIT` after ordering.

```sql
WITH customer_totals AS (
    SELECT
        customer_id,
        SUM(total_amount) AS spent
    FROM orders
    GROUP BY customer_id
)
SELECT c.name, ct.spent
FROM customer_totals ct
JOIN customers c ON c.id = ct.customer_id
ORDER BY ct.spent DESC
LIMIT 3;
```

---

## 9. Window Functions

**Task 11:** *Rank products by the total quantity sold, showing their rank in descending order.*

**Explanation:**
- **Window functions** (like `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`) calculate a value across a set of rows related to the current row, without collapsing them into groups.
- **`OVER (ORDER BY …)`** defines the window.
- `RANK()` skips ranks when there’s a tie, `DENSE_RANK()` doesn’t.

```sql
SELECT
    p.name,
    SUM(oi.quantity) AS total_sold,
    RANK() OVER (ORDER BY SUM(oi.quantity) DESC) AS rank
FROM products p
JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name
ORDER BY rank;
```

---

## 10. Normalization and Joins

### 10.1 Normalization concepts
- **1NF**: Each cell contains a single value; no repeating groups. Our tables are already in 1NF.
- **2NF**: 1NF + no partial dependencies (every non‑key column must depend on the whole primary key). In `order_items`, `price_per_unit` depends on the product, not on the order, but because `order_id + product_id` is the primary key, we might move the price to `products` – but we store the price at the time of purchase, so it’s correct (historical price).
- **3NF**: 2NF + no transitive dependencies. Our schema is clean: `orders.total_amount` could be computed from `order_items`, but denormalization is acceptable for performance; a purely normalized design would omit it.

**Why normalize?** Eliminates redundancy, ensures data integrity, makes updates easier.

### 10.2 Joins – combining normalized tables
Now we’ll write queries that bring the data back together.

**Task 12:** *List all orders with customer name, product names, and total line price (quantity × price_per_unit).*  
This requires an **`INNER JOIN`** – only rows that match in both tables.

```sql
SELECT
    o.id AS order_id,
    c.name AS customer,
    p.name AS product,
    oi.quantity,
    oi.price_per_unit,
    oi.quantity * oi.price_per_unit AS line_total
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
ORDER BY o.id;
```

**Task 13:** *Find all customers who have never placed an order.*  
Use a **`LEFT JOIN`** and check for `NULL` on the right side.

```sql
SELECT c.name
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL;
```

**Task 14:** *Perform a full outer join of customers and orders (just to see all data from both sides, even unmatched).*

```sql
SELECT c.name, o.id AS order_id
FROM customers c
FULL OUTER JOIN orders o ON c.id = o.customer_id;
```
This would show customers without orders and (if any) orders without a customer (which cannot happen due to our foreign key).

---

## 11. Summary of Keywords & PostgreSQL Highlights

| SQL Keyword / Feature | Description | PostgreSQL‑specific? |
|----------------------|-------------|----------------------|
| `SELECT`, `FROM`, `WHERE` | Basic query structure | Standard |
| `AND`, `OR`, `NOT` | Logical operators | Standard |
| `ORDER BY` (ASC/DESC) | Sort rows | Standard |
| `LIMIT`, `OFFSET` | Restrict number of rows returned | Standard (MySQL uses LIMIT; SQL Server uses TOP) |
| `INSERT INTO … VALUES` | Insert new rows | Standard |
| `UPDATE … SET … WHERE` | Modify existing rows | Standard |
| `DELETE FROM … WHERE` | Remove rows | Standard |
| `RETURNING` | Returns the inserted/updated/deleted rows | **PostgreSQL** (also in Oracle, SQLite, but not MySQL/SQL Server) |
| `SERIAL` | Auto‑increment integer column | **PostgreSQL** (standard SQL uses `GENERATED AS IDENTITY` also supported by PG) |
| `BOOLEAN` | True/false column | **PostgreSQL** (MySQL has tinyint, SQL Server has bit) |
| `TIMESTAMPTZ` | Timestamp with time zone | Standard type, but PG’s handling of time zones is robust |
| `ILIKE` | Case‑insensitive pattern matching | **PostgreSQL** (other DBs use `LOWER(column) LIKE LOWER(…)`) |
| `DISTINCT ON` | Keep first row for each group | **PostgreSQL** – very powerful |
| `GROUP BY`, `HAVING` | Aggregate and filter groups | Standard |
| `COUNT`, `SUM`, `AVG`, `MAX`, `MIN` | Aggregate functions | Standard |
| `AS` (alias) | Rename column or table in output | Standard |
| `JOIN` / `INNER JOIN` | Combine rows from two tables where condition matches | Standard |
| `LEFT JOIN` / `RIGHT JOIN` | Keep all rows from left/right table | Standard |
| `FULL OUTER JOIN` | Keep all rows from both tables | Standard |
| `CROSS JOIN` | Cartesian product | Standard |
| `ON`, `USING`, `NATURAL` | Join conditions | Standard |
| `COALESCE(value, …)` | Return first non‑NULL value | Standard |
| `NULLIF(expr1, expr2)` | Return NULL if equal | Standard |
| `CASE WHEN … THEN … ELSE … END` | Conditional expression | Standard |
| `WITH … AS` (CTE) | Common Table Expression – temporary result set | Standard (PostgreSQL adds `RECURSIVE`, `MATERIALIZED`) |
| `UNION`, `INTERSECT`, `EXCEPT` | Combine results of two queries | Standard |
| `INSERT … ON CONFLICT DO …` | Upsert – insert or update on constraint violation | **PostgreSQL** (MySQL: `ON DUPLICATE KEY`, SQL Server: `MERGE`) |
| `OVER`, `PARTITION BY` | Window functions (ROW_NUMBER, RANK, etc.) | Standard (but PG’s implementation is very complete) |
| `EXPLAIN` | Show execution plan | Standard (output differs) |
| `JSONB` | Binary JSON storage with indexing | **PostgreSQL** (other DBs have JSON, but JSONB is a PG highlight) |
| `ARRAY` | Native array column type | **PostgreSQL** (very rare in other DBs) |
| `NUMERIC(precision, scale)` | Exact decimal number | Standard (called DECIMAL in some) |
| `CHECK`, `UNIQUE`, `PRIMARY KEY`, `FOREIGN KEY` | Constraints | Standard |

**PostgreSQL‑specific highlights in this tutorial:**
- `RETURNING` for immediate feedback after modifications.
- `SERIAL` for auto‑increment (or `GENERATED AS IDENTITY`).
- Native `BOOLEAN` type.
- `ILIKE` for effortless case‑insensitive search.
- `DISTINCT ON` to fetch one row per group without subqueries.
- `ON CONFLICT` (upsert) – a clean way to handle “insert or update”.
- `||` for string concatenation (convenient).
- Robust `TIMESTAMPTZ` handling.

