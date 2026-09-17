# Assignment 2 — PostgreSQL as SQL + NoSQL: Working with JSONB

## Learning objective

Understand how PostgreSQL's `jsonb` type lets a single relational database act as both a SQL and a NoSQL (document-style) engine, and evaluate where it can substitute for MongoDB.

---

## Part A — Conceptual questions

Answer in your own words (150–250 words each), with at least one SQL example per answer.

1. **What is `jsonb` in PostgreSQL, and how does it differ from the plain `json` type?**
   Cover storage format (binary vs text), effect on write speed, and effect on query/index speed.

2. **How can PostgreSQL work as both a SQL and a NoSQL database in the same table?**
   Explain using a table that has strict typed columns (e.g. `id`, `name`, `price`) alongside a `jsonb` column for variable attributes. Give an example schema.

3. **Give an example of a `jsonb` query using each of these operators, with the value it returns:**
   `->`, `->>`, `@>`, `?` (key-exists), and explain the difference between the first two.

4. **How can a GIN index on a `jsonb` column change query performance?**
   State what kind of query it speeds up and one query it does *not* help with.

5. **Where could PostgreSQL + `jsonb` replace a MongoDB deployment, and where would MongoDB still be the better fit?**
   Answer with reference to: transactions, joins, schema enforcement, and horizontal scaling.

---

## Part B — Hands-on exercise: Product catalog

### Task 1 — Schema

```sql
-- create a products table with fixed columns + one jsonb column
CREATE TABLE products (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    attributes JSONB
);
```

### Task 2 — Insert data

Insert **5 products across at least 3 categories**, where each category has *different* attribute keys in `attributes` (e.g. a book has `author`/`pages`, a laptop has `ram_gb`/`cpu`, an accessory has `color`/`wireless`).

```sql
-- example row for one category — write the remaining 4 yourself
INSERT INTO products (name, category, price, attributes) VALUES
('Clean Code', 'book', 499.00,
    '{"author": "Robert C. Martin", "pages": 464}');
```

### Task 3 — Query by category-specific attribute

Write **one query per category** that filters on an attribute unique to that category (not on `name`/`category`/`price`).

```sql
-- example: laptops with at least 16GB RAM
SELECT name, attributes ->> 'cpu' AS cpu
FROM products
WHERE category = 'laptop'
  AND (attributes ->> 'ram_gb')::int >= 16;
```

### Task 4 — Containment query

```sql
-- find any product where a given key/value exists inside attributes
SELECT name FROM products WHERE attributes @> '{"wireless": true}';
```

### Task 5 — Update JSONB without altering the table

```sql
-- add a new attribute to one existing row, no ALTER TABLE needed
UPDATE products
SET attributes = attributes || '{"discount_pct": 10}'
WHERE name = 'Wireless Mouse';
```

### Task 6 — Index and compare

```sql
-- index the jsonb column
CREATE INDEX idx_products_attributes ON products USING GIN (attributes);

-- run EXPLAIN ANALYZE on your Task 3 queries before and after creating the index
EXPLAIN ANALYZE
SELECT name FROM products WHERE attributes @> '{"wireless": true}';
```

### Task 7 — MongoDB comparison

Recreate the same 5 products as documents in a MongoDB `products` collection (`mongosh`), run the equivalent of Task 3's queries there, and note any differences in syntax, indexing, or ease of use.

```javascript
// mongosh equivalent — adapt to your own product data
db.products.insertMany([
  { name: "Clean Code", category: "book", price: 499.00, attributes: { author: "Robert C. Martin", pages: 464 } }
])

db.products.find({ category: "laptop", "attributes.ram_gb": { $gte: 16 } })
```

---

## Submission guidelines

Submit a single Markdown file named `<roll_number>_assignment2.md` in Theory folder, named `Assignment 2 <title>.md` in your github repository.
