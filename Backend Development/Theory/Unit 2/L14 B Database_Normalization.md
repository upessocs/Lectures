# Database Normalization: From Raw Data to BCNF

This tutorial builds database normalization from the ground up. We start with a realistic, messy dataset and progressively transform it into **1NF, 2NF, 3NF, and BCNF**.

The same ideas are used throughout:

> **Raw data → identify dependencies → choose keys → remove repeating/multi-valued data → remove partial dependencies → remove transitive dependencies → check BCNF**

The examples are intentionally small enough to inspect by hand, but they use the same reasoning needed for real relational database design.

## 1. Why do we normalize a database?

Suppose an online store keeps order information in one spreadsheet:

- Who placed the order?
- What products were ordered?
- How many?
- What is each product's price?
- What is the customer's address?
- What is the customer's phone number?

A beginner may put everything into one table because it is easy to understand initially.

The problem is **redundancy**.

If Jane places five orders, her name, address, and phone may be stored five times. If Widget A appears in 1,000 order lines, its price may be stored 1,000 times.

Redundancy creates three classic problems.

### Update anomaly

Suppose Jane changes her phone number.

If her phone number is stored in 20 rows, all 20 rows must be updated. If one is missed, the database contains conflicting information.

### Insertion anomaly

Suppose a new product has been added to the catalog but nobody has ordered it yet.

If product information can only be stored inside an order table, there may be no suitable row in which to store the new product.

### Deletion anomaly

Suppose Gadget X has only one order.

If deleting that order also deletes the only record containing Gadget X's product information, the database loses catalog information.

Normalization reduces these anomalies by organizing facts according to what they describe and by using relationships between tables.

---

# 2. Important concepts before normalization

Normalization becomes much easier when four terms are clear.

## 2.1 Attribute

An **attribute** is a property represented by a column.

For example:

```text
CustomerID
CustomerName
OrderDate
ProductID
Quantity
UnitPrice
```

## 2.2 Tuple

A **tuple** is a row in a relational table.

For example:

```text
O101 | C01 | 2026-09-01
```

is one tuple in an Orders relation.

## 2.3 Primary key

A **primary key** is a column or combination of columns that uniquely identifies each row.

Examples:

```text
CustomerID
OrderID
(OrderID, ProductID)
```

A key containing more than one attribute is called a **composite key**.

## 2.4 Functional dependency

A **functional dependency (FD)** describes a rule between attributes. The notation

```text
A → B
```

is read as:

> **A functionally determines B.**

It means that whenever two rows have the same value of `A`, they must also have the same value of `B`. Once `A` is known, there can be only one matching value of `B`. Here, `A` is the **determinant** (the attribute doing the determining), and `B` is the **dependent attribute**.

For example:

```text
CustomerID → CustomerName
```

means that one customer ID can have only one customer name. If two rows contain `CustomerID = C01`, both must contain the same name. However, the arrow does not automatically work in reverse: two customers may share a name, so `CustomerName → CustomerID` may be false.

Similarly:

```text
ProductID → ProductName, UnitPrice
```

means a product ID determines both its product name and current catalog price. The left side can also contain several attributes:

```text
(OrderID, ProductID) → Qty
```

Here, neither `OrderID` nor `ProductID` alone is enough. The combination identifies a particular product within a particular order and therefore determines its quantity.

Functional dependencies express business rules that must always be true, not patterns that happen to appear in a small sample of data.

Functional dependencies are the main reasoning tool used for 2NF, 3NF, and BCNF.

---

# 3. Superkey, candidate key, and prime attribute

These terms are essential for understanding BCNF.

## Superkey

A **superkey** is any set of attributes that uniquely identifies a row.

If `StudentID` uniquely identifies a student, then both of these can be superkeys:

```text
{StudentID}
{StudentID, StudentName}
```

The second one contains unnecessary information, but it can still uniquely identify a row.

## Candidate key

A **candidate key** is a **minimal superkey**.

If `StudentID` alone is sufficient, then:

```text
{StudentID}
```

is a candidate key, while:

```text
{StudentID, StudentName}
```

is not minimal.

A table can have more than one candidate key.

## Primary key

The database designer chooses one candidate key as the **primary key**.

## Prime attribute

An attribute is called a **prime attribute** if it belongs to at least one candidate key.

This matters when checking 3NF.

---

# 4. The normalization journey

We will use an order-management example.

The journey is:

```text
UNF
 ↓
1NF
 ↓
2NF
 ↓
3NF
 ↓
BCNF
```

Each stage solves a different type of dependency problem.

<div style="background:white">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 250" role="img" aria-label="Normalization journey from unnormalized data to BCNF">
  <rect width="1100" height="250" fill="white"/>
  <text x="550" y="30" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" font-weight="700">Normalization Journey</text>

  <g font-family="Arial,sans-serif">
    <rect x="40" y="75" width="170" height="65" rx="10" fill="#f7f7f7" stroke="#b33" stroke-width="2"/>
    <text x="125" y="103" text-anchor="middle" font-size="17" font-weight="700">UNF</text>
    <text x="125" y="125" text-anchor="middle" font-size="12">Lists / repeating groups</text>

    <line x1="210" y1="108" x2="255" y2="108" stroke="#555" stroke-width="2"/>
    <polygon points="255,108 245,102 245,114" fill="#555"/>

    <rect x="255" y="75" width="170" height="65" rx="10" fill="#f7f7f7" stroke="#2e7d32" stroke-width="2"/>
    <text x="340" y="103" text-anchor="middle" font-size="17" font-weight="700">1NF</text>
    <text x="340" y="125" text-anchor="middle" font-size="12">Atomic values</text>

    <line x1="425" y1="108" x2="470" y2="108" stroke="#555" stroke-width="2"/>
    <polygon points="470,108 460,102 460,114" fill="#555"/>

    <rect x="470" y="75" width="170" height="65" rx="10" fill="#f7f7f7" stroke="#1565c0" stroke-width="2"/>
    <text x="555" y="103" text-anchor="middle" font-size="17" font-weight="700">2NF</text>
    <text x="555" y="125" text-anchor="middle" font-size="12">No partial dependency</text>

    <line x1="640" y1="108" x2="685" y2="108" stroke="#555" stroke-width="2"/>
    <polygon points="685,108 675,102 675,114" fill="#555"/>

    <rect x="685" y="75" width="170" height="65" rx="10" fill="#f7f7f7" stroke="#6a1b9a" stroke-width="2"/>
    <text x="770" y="103" text-anchor="middle" font-size="17" font-weight="700">3NF</text>
    <text x="770" y="125" text-anchor="middle" font-size="12">No transitive dependency</text>

    <line x1="855" y1="108" x2="900" y2="108" stroke="#555" stroke-width="2"/>
    <polygon points="900,108 890,102 890,114" fill="#555"/>

    <rect x="900" y="75" width="160" height="65" rx="10" fill="#f7f7f7" stroke="#ef6c00" stroke-width="2"/>
    <text x="980" y="103" text-anchor="middle" font-size="17" font-weight="700">BCNF</text>
    <text x="980" y="125" text-anchor="middle" font-size="12">Every determinant is a key</text>
  </g>

  <text x="550" y="185" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#444">Each step preserves the useful facts while reducing a different class of redundancy.</text>
  <text x="550" y="210" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#444">Important: not every database needs to be decomposed all the way to BCNF.</text>
</svg>

</div>

---

# 5. Stage 0 — Raw / Unnormalized Data (UNF)

Consider this spreadsheet:

| OrderID | CustomerID | CustomerName | Address | Products | Phones | OrderDate |
|---|---|---|---|---|---|---|
| O101 | C01 | Jane Smith | 42 Oak St, Seattle, 98101 | Widget A × 2, Widget B × 1 | 555-0101, 555-0199 | 2026-09-01 |
| O102 | C02 | Bob Jones | 18 Pine Ave, Portland, 97201 | Widget A × 5, Gadget X × 1 | 555-0202 | 2026-09-02 |
| O103 | C01 | Jane Smith | 42 Oak St, Seattle, 98101 | Gadget X × 3, Widget B × 2 | 555-0101, 555-0199 | 2026-09-03 |

The data is easy to read as a human spreadsheet, but it is not a good relational design.

<div style="background:white">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 420" role="img" aria-label="Unnormalized order table with multi-valued cells highlighted">
  <rect width="1100" height="420" fill="white"/>
  <text x="550" y="30" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" font-weight="700">UNF — Raw Order Data</text>
  <text x="550" y="52" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#555">Red cells contain multiple values or repeating groups.</text>

  <g font-family="Arial,sans-serif" font-size="12">
    <rect x="30" y="75" width="75" height="34" fill="#444"/>
    <rect x="105" y="75" width="80" height="34" fill="#444"/>
    <rect x="185" y="75" width="120" height="34" fill="#444"/>
    <rect x="305" y="75" width="190" height="34" fill="#444"/>
    <rect x="495" y="75" width="350" height="34" fill="#444"/>
    <rect x="845" y="75" width="210" height="34" fill="#444"/>
    <text x="67" y="97" text-anchor="middle" fill="white" font-weight="700">OrderID</text>
    <text x="145" y="97" text-anchor="middle" fill="white" font-weight="700">CustID</text>
    <text x="245" y="97" text-anchor="middle" fill="white" font-weight="700">Customer</text>
    <text x="400" y="97" text-anchor="middle" fill="white" font-weight="700">Address</text>
    <text x="670" y="97" text-anchor="middle" fill="white" font-weight="700">Products</text>
    <text x="950" y="97" text-anchor="middle" fill="white" font-weight="700">Phones</text>

    <rect x="30" y="109" width="75" height="55" fill="white" stroke="#ccc"/>
    <rect x="105" y="109" width="80" height="55" fill="white" stroke="#ccc"/>
    <rect x="185" y="109" width="120" height="55" fill="white" stroke="#ccc"/>
    <rect x="305" y="109" width="190" height="55" fill="#fff0f0" stroke="#c62828" stroke-width="2"/>
    <rect x="495" y="109" width="350" height="55" fill="#fff0f0" stroke="#c62828" stroke-width="2"/>
    <rect x="845" y="109" width="210" height="55" fill="#fff0f0" stroke="#c62828" stroke-width="2"/>
    <text x="67" y="141" text-anchor="middle">O101</text>
    <text x="145" y="141" text-anchor="middle">C01</text>
    <text x="245" y="141" text-anchor="middle">Jane Smith</text>
    <text x="400" y="132" text-anchor="middle">42 Oak St,</text>
    <text x="400" y="149" text-anchor="middle">Seattle, 98101</text>
    <text x="670" y="132" text-anchor="middle">Widget A × 2,</text>
    <text x="670" y="149" text-anchor="middle">Widget B × 1</text>
    <text x="950" y="132" text-anchor="middle">555-0101,</text>
    <text x="950" y="149" text-anchor="middle">555-0199</text>

    <rect x="30" y="164" width="75" height="55" fill="white" stroke="#ccc"/>
    <rect x="105" y="164" width="80" height="55" fill="white" stroke="#ccc"/>
    <rect x="185" y="164" width="120" height="55" fill="white" stroke="#ccc"/>
    <rect x="305" y="164" width="190" height="55" fill="#fff0f0" stroke="#c62828" stroke-width="2"/>
    <rect x="495" y="164" width="350" height="55" fill="#fff0f0" stroke="#c62828" stroke-width="2"/>
    <rect x="845" y="164" width="210" height="55" fill="white" stroke="#ccc"/>
    <text x="67" y="196" text-anchor="middle">O102</text>
    <text x="145" y="196" text-anchor="middle">C02</text>
    <text x="245" y="196" text-anchor="middle">Bob Jones</text>
    <text x="400" y="187" text-anchor="middle">18 Pine Ave,</text>
    <text x="400" y="204" text-anchor="middle">Portland, 97201</text>
    <text x="670" y="187" text-anchor="middle">Widget A × 5,</text>
    <text x="670" y="204" text-anchor="middle">Gadget X × 1</text>
    <text x="950" y="196" text-anchor="middle">555-0202</text>

    <rect x="30" y="219" width="75" height="55" fill="white" stroke="#ccc"/>
    <rect x="105" y="219" width="80" height="55" fill="white" stroke="#ccc"/>
    <rect x="185" y="219" width="120" height="55" fill="white" stroke="#ccc"/>
    <rect x="305" y="219" width="190" height="55" fill="#fff0f0" stroke="#c62828" stroke-width="2"/>
    <rect x="495" y="219" width="350" height="55" fill="#fff0f0" stroke="#c62828" stroke-width="2"/>
    <rect x="845" y="219" width="210" height="55" fill="#fff0f0" stroke="#c62828" stroke-width="2"/>
    <text x="67" y="251" text-anchor="middle">O103</text>
    <text x="145" y="251" text-anchor="middle">C01</text>
    <text x="245" y="251" text-anchor="middle">Jane Smith</text>
    <text x="400" y="242" text-anchor="middle">42 Oak St,</text>
    <text x="400" y="259" text-anchor="middle">Seattle, 98101</text>
    <text x="670" y="242" text-anchor="middle">Gadget X × 3,</text>
    <text x="670" y="259" text-anchor="middle">Widget B × 2</text>
    <text x="950" y="242" text-anchor="middle">555-0101,</text>
    <text x="950" y="259" text-anchor="middle">555-0199</text>

    <rect x="30" y="310" width="1025" height="80" rx="8" fill="#fff8e1" stroke="#c68a00"/>
    <text x="50" y="334" font-weight="700">What is wrong?</text>
    <text x="50" y="355">1. Products contains multiple product-line values in one cell.</text>
    <text x="50" y="373">2. Phones contains multiple phone values in one cell.</text>
    <text x="50" y="391">3. Several facts are repeated because one row represents an entire order rather than an order line.</text>
  </g>
</svg>

</div>

## Important note about "atomic"

Do not memorize the rule as "a cell can never contain a compound concept."

Atomicity is **domain-dependent**.

For example, an application may legitimately treat a postal address as one value:

```text
42 Oak St, Seattle, 98101
```

The strict 1NF issue in this example is that `Products` and `Phones` represent **sets of values** inside one cell.

We will split the address into separate attributes because it makes the example easier to query and is a common design choice. That split should not be confused with the core 1NF requirement.

---

# 6. Stage 1 — First Normal Form (1NF)

## Definition

A relation is in **First Normal Form (1NF)** when its attributes contain atomic values and there are no repeating groups or multi-valued attributes represented inside a single relational cell.

For practical database design, ask:

> Can I treat each cell as one value of the column's defined domain?

And:

> Is a set of values being hidden inside one cell?

## What we change

Instead of:

```text
O101 | Widget A × 2, Widget B × 1
```

we create two order-line rows:

```text
O101 | Widget A | 2
O101 | Widget B | 1
```

Now each row represents **one product line of one order**.

### 1NF table

| OrderID | CustomerID | CustomerName | Street | City | Zip | ProductID | ProductName | Qty | UnitPrice | OrderDate |
|---|---|---|---|---|---|---|---|---:|---:|---|
| O101 | C01 | Jane Smith | 42 Oak St | Seattle | 98101 | P01 | Widget A | 2 | 9.99 | 2026-09-01 |
| O101 | C01 | Jane Smith | 42 Oak St | Seattle | 98101 | P02 | Widget B | 1 | 4.49 | 2026-09-01 |
| O102 | C02 | Bob Jones | 18 Pine Ave | Portland | 97201 | P01 | Widget A | 5 | 9.99 | 2026-09-02 |
| O102 | C02 | Bob Jones | 18 Pine Ave | Portland | 97201 | P03 | Gadget X | 1 | 24.99 | 2026-09-02 |
| O103 | C01 | Jane Smith | 42 Oak St | Seattle | 98101 | P03 | Gadget X | 3 | 24.99 | 2026-09-03 |
| O103 | C01 | Jane Smith | 42 Oak St | Seattle | 98101 | P02 | Widget B | 2 | 4.49 | 2026-09-03 |

The likely key is:

```text
(OrderID, ProductID)
```

because one order can contain several products.

This is a **candidate key** only if the business rule says a product can occur at most once in an order. If the same product can appear as separate lines, a separate `OrderLineID` or another line identifier is required.

That business rule matters: **keys come from the data model, not from the number of columns we happen to see.**

## What 1NF has solved

- No product list is hidden in one cell.
- No phone list is hidden in one cell.
- Each row represents one order-product combination.
- We can query product lines directly.

## What 1NF has NOT solved

There is still a lot of duplication.

For example:

```text
OrderID = O101
CustomerID = C01
CustomerName = Jane Smith
Street = 42 Oak St
City = Seattle
Zip = 98101
OrderDate = 2026-09-01
```

is repeated for every product in order O101.

Also:

```text
ProductID = P01
ProductName = Widget A
UnitPrice = 9.99
```

is repeated whenever Widget A occurs in an order.

This leads to the next question:

> Does every non-key attribute depend on the **whole key**?

That is the 2NF question.

---

# 7. Stage 2 — Second Normal Form (2NF)

## Definition

A relation is in **Second Normal Form (2NF)** if:

1. It is already in 1NF, and
2. Every non-prime attribute is **fully functionally dependent on the whole of every candidate key**.

In beginner language:

> If the primary key has multiple columns, a non-key column must not depend on only one part of that key.

This is called a **partial dependency**.

## Find the dependencies

Our 1NF candidate key is:

```text
(OrderID, ProductID)
```

Now inspect the attributes.

### Order-level facts

```text
OrderID → CustomerID, CustomerName, Street, City, Zip, OrderDate
```

These facts depend only on `OrderID`.

Therefore they depend on only **part** of the composite key:

```text
(OrderID, ProductID)
       ↑
   only OrderID
```

That is a partial dependency.

### Product-level facts

```text
ProductID → ProductName, UnitPrice
```

These facts depend only on `ProductID`.

Again, they depend on only part of the composite key.

### Line-level fact

```text
(OrderID, ProductID) → Qty
```

Quantity depends on the complete order-product combination.

That is a full dependency.

## Visualizing the problem

<div style="background:white">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 430" role="img" aria-label="Partial dependencies in the 1NF table">
  <rect width="1100" height="430" fill="white"/>
  <text x="550" y="30" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" font-weight="700">1NF → 2NF: Find Partial Dependencies</text>

  <g font-family="Arial,sans-serif">
    <rect x="40" y="75" width="300" height="60" rx="8" fill="#f7f7f7" stroke="#555"/>
    <text x="190" y="100" text-anchor="middle" font-size="16" font-weight="700">Composite Key</text>
    <text x="190" y="121" text-anchor="middle" font-size="14">(OrderID, ProductID)</text>

    <rect x="60" y="180" width="260" height="75" rx="8" fill="#fff0f0" stroke="#c62828" stroke-width="2"/>
    <text x="190" y="205" text-anchor="middle" font-size="14" font-weight="700">Order-level attributes</text>
    <text x="190" y="226" text-anchor="middle" font-size="12">CustomerID, CustomerName</text>
    <text x="190" y="244" text-anchor="middle" font-size="12">Address, OrderDate</text>

    <line x1="150" y1="135" x2="150" y2="180" stroke="#c62828" stroke-width="2"/>
    <polygon points="150,180 144,170 156,170" fill="#c62828"/>
    <text x="95" y="160" font-size="12" fill="#c62828">OrderID alone</text>

    <rect x="420" y="180" width="260" height="75" rx="8" fill="#fff0f0" stroke="#c62828" stroke-width="2"/>
    <text x="550" y="205" text-anchor="middle" font-size="14" font-weight="700">Product-level attributes</text>
    <text x="550" y="226" text-anchor="middle" font-size="12">ProductName, UnitPrice</text>
    <text x="550" y="244" text-anchor="middle" font-size="12">depend on ProductID</text>

    <line x1="250" y1="135" x2="550" y2="180" stroke="#c62828" stroke-width="2"/>
    <polygon points="550,180 540,172 543,184" fill="#c62828"/>

    <rect x="760" y="180" width="260" height="75" rx="8" fill="#eef7ff" stroke="#1565c0" stroke-width="2"/>
    <text x="890" y="205" text-anchor="middle" font-size="14" font-weight="700">Line-level attribute</text>
    <text x="890" y="226" text-anchor="middle" font-size="12">Qty</text>
    <text x="890" y="244" text-anchor="middle" font-size="12">depends on both key parts</text>

    <line x1="300" y1="135" x2="860" y2="180" stroke="#1565c0" stroke-width="2"/>
    <polygon points="860,180 848,175 851,187" fill="#1565c0"/>

    <rect x="80" y="300" width="940" height="85" rx="8" fill="#fff8e1" stroke="#c68a00"/>
    <text x="100" y="326" font-weight="700" font-size="14">2NF rule</text>
    <text x="100" y="348" font-size="12">A non-key attribute must not depend on only OrderID or only ProductID.</text>
    <text x="100" y="368" font-size="12">It must depend on the complete candidate key. Move order facts and product facts into separate relations.</text>
  </g>
</svg>

</div>

## Decompose the table

Create three relations.

### Orders

| OrderID | CustomerID | CustomerName | Street | City | Zip | OrderDate |
|---|---|---|---|---|---|---|
| O101 | C01 | Jane Smith | 42 Oak St | Seattle | 98101 | 2026-09-01 |
| O102 | C02 | Bob Jones | 18 Pine Ave | Portland | 97201 | 2026-09-02 |
| O103 | C01 | Jane Smith | 42 Oak St | Seattle | 98101 | 2026-09-03 |

Key:

```text
OrderID
```

### Products

| ProductID | ProductName | UnitPrice |
|---|---|---:|
| P01 | Widget A | 9.99 |
| P02 | Widget B | 4.49 |
| P03 | Gadget X | 24.99 |

Key:

```text
ProductID
```

### OrderDetails

| OrderID | ProductID | Qty |
|---|---|---:|
| O101 | P01 | 2 |
| O101 | P02 | 1 |
| O102 | P01 | 5 |
| O102 | P03 | 1 |
| O103 | P03 | 3 |
| O103 | P02 | 2 |

Key:

```text
(OrderID, ProductID)
```

`OrderID` and `ProductID` are also foreign keys.

## What 2NF has solved

- Product information is stored once.
- Order information is stored once per order.
- Quantity remains in the relationship between an order and a product.
- Partial dependencies caused by the composite key are removed.

## What problem remains?

Look at `Orders`:

```text
OrderID → CustomerID
CustomerID → CustomerName, Street, City, Zip
```

Therefore:

```text
OrderID → CustomerID → CustomerName, Street, City, Zip
```

Customer information is really a property of the customer, not of the order.

This is a **transitive dependency**.

That leads to 3NF.

---

# 8. Stage 3 — Third Normal Form (3NF)

## Definition

A relation is in **Third Normal Form (3NF)** if:

1. It is already in 2NF, and
2. For every non-trivial functional dependency `X → A`, either:
   - `X` is a superkey, or
   - `A` is a prime attribute.

For beginners, a useful working version is:

> A non-key attribute should not depend on another non-key attribute.

This is the familiar **no transitive dependency** rule.

The formal definition is more precise and is important when comparing 3NF with BCNF.

## Find the transitive dependency

In `Orders`:

```text
OrderID → CustomerID
CustomerID → CustomerName, Street, City, Zip
```

`OrderID` determines customer information indirectly through `CustomerID`.

So the dependency chain is:

```text
OrderID
   ↓
CustomerID
   ↓
CustomerName, Street, City, Zip
```

The customer attributes do not belong directly in the Orders relation.

## Decompose again

### Customers

| CustomerID | CustomerName | Street | City | Zip |
|---|---|---|---|---|
| C01 | Jane Smith | 42 Oak St | Seattle | 98101 |
| C02 | Bob Jones | 18 Pine Ave | Portland | 97201 |

Key:

```text
CustomerID
```

### Orders

| OrderID | CustomerID | OrderDate |
|---|---|---|
| O101 | C01 | 2026-09-01 |
| O102 | C02 | 2026-09-02 |
| O103 | C01 | 2026-09-03 |

`CustomerID` is now a foreign key referencing `Customers`.

### Products

| ProductID | ProductName | UnitPrice |
|---|---|---:|
| P01 | Widget A | 9.99 |
| P02 | Widget B | 4.49 |
| P03 | Gadget X | 24.99 |

### OrderDetails

| OrderID | ProductID | Qty |
|---|---|---:|
| O101 | P01 | 2 |
| O101 | P02 | 1 |
| O102 | P01 | 5 |
| O102 | P03 | 1 |
| O103 | P03 | 3 |
| O103 | P02 | 2 |

## Visualizing 3NF

<div style="background:white">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 420" role="img" aria-label="3NF decomposition into customers orders products and order details">
  <rect width="1100" height="420" fill="white"/>
  <text x="550" y="30" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" font-weight="700">3NF — Separate Facts by What They Describe</text>

  <g font-family="Arial,sans-serif">
    <rect x="60" y="75" width="390" height="105" rx="8" fill="#f7f7f7" stroke="#1565c0" stroke-width="2"/>
    <text x="255" y="101" text-anchor="middle" font-size="16" font-weight="700">Orders</text>
    <text x="255" y="126" text-anchor="middle" font-size="13">OrderID (PK)</text>
    <text x="255" y="147" text-anchor="middle" font-size="13">CustomerID (FK), OrderDate</text>
    <text x="255" y="168" text-anchor="middle" font-size="12" fill="#555">Facts about an order</text>

    <rect x="650" y="75" width="390" height="105" rx="8" fill="#f7f7f7" stroke="#2e7d32" stroke-width="2"/>
    <text x="845" y="101" text-anchor="middle" font-size="16" font-weight="700">Customers</text>
    <text x="845" y="126" text-anchor="middle" font-size="13">CustomerID (PK)</text>
    <text x="845" y="147" text-anchor="middle" font-size="13">CustomerName, Street, City, Zip</text>
    <text x="845" y="168" text-anchor="middle" font-size="12" fill="#555">Facts about a customer</text>

    <line x1="450" y1="127" x2="650" y2="127" stroke="#555" stroke-width="2"/>
    <polygon points="650,127 638,121 638,133" fill="#555"/>
    <text x="550" y="115" text-anchor="middle" font-size="12">CustomerID FK</text>

    <rect x="60" y="245" width="390" height="105" rx="8" fill="#f7f7f7" stroke="#6a1b9a" stroke-width="2"/>
    <text x="255" y="271" text-anchor="middle" font-size="16" font-weight="700">Products</text>
    <text x="255" y="296" text-anchor="middle" font-size="13">ProductID (PK)</text>
    <text x="255" y="317" text-anchor="middle" font-size="13">ProductName, UnitPrice</text>
    <text x="255" y="338" text-anchor="middle" font-size="12" fill="#555">Facts about a product</text>

    <rect x="650" y="245" width="390" height="105" rx="8" fill="#f7f7f7" stroke="#ef6c00" stroke-width="2"/>
    <text x="845" y="271" text-anchor="middle" font-size="16" font-weight="700">OrderDetails</text>
    <text x="845" y="296" text-anchor="middle" font-size="13">OrderID + ProductID (PK)</text>
    <text x="845" y="317" text-anchor="middle" font-size="13">Qty</text>
    <text x="845" y="338" text-anchor="middle" font-size="12" fill="#555">Facts about an order-product pair</text>

    <line x1="450" y1="297" x2="650" y2="297" stroke="#555" stroke-width="2"/>
    <polygon points="650,297 638,291 638,303" fill="#555"/>
    <text x="550" y="285" text-anchor="middle" font-size="12">OrderID / ProductID FKs</text>

    <rect x="180" y="375" width="740" height="28" rx="6" fill="#fff8e1" stroke="#c68a00"/>
    <text x="550" y="394" text-anchor="middle" font-size="12">Each relation stores facts that depend on the key representing that entity or relationship.</text>
  </g>
</svg>

</div>

## What 3NF has solved

- Customer information is stored once.
- Changing a customer's address requires one update.
- Orders reference customers instead of copying customer details.
- Product facts remain independent of orders.
- Order-line facts remain independent of customer and product descriptions.

At this point, the order schema is in 3NF.

But **3NF and BCNF are not identical**.

BCNF is stricter.

---

# 9. Boyce-Codd Normal Form (BCNF)

## Why do we need BCNF?

Most beginner examples stop at 3NF. That is reasonable because 3NF removes the common partial and transitive dependency problems.

However, there are relations that satisfy 3NF but still contain a dependency that BCNF considers problematic.

BCNF is especially useful when a relation has **multiple candidate keys** and a determinant is not itself a superkey.

## Formal definition

A relation is in **BCNF** if, for every non-trivial functional dependency:

```text
X → Y
```

`X` is a **superkey**.

In simple words:

> Every determinant must be a key.

A **determinant** is the left-hand side of a functional dependency.

So if:

```text
InstructorID → CourseID
```

then `InstructorID` is a determinant.

For BCNF, `InstructorID` must be a superkey of that relation.

---

# 10. A relation that is in 3NF but not BCNF

Consider a university scheduling rule:

> Each instructor teaches only one course.

A student can enroll in a course, and each instructor is assigned to one course.

Create this relation:

```text
StudentCourseInstructor(
    StudentID,
    CourseID,
    InstructorID
)
```

Example data:

| StudentID | CourseID | InstructorID |
|---|---|---|
| S01 | C101 | I10 |
| S02 | C101 | I10 |
| S03 | C102 | I20 |
| S04 | C102 | I20 |
| S05 | C103 | I30 |

Assume these functional dependencies:

```text
(StudentID, CourseID) → InstructorID
InstructorID → CourseID
```

The first dependency says:

> For a particular student and course, there is one instructor.

The second says:

> Each instructor teaches one course.

## Candidate keys

Because:

```text
InstructorID → CourseID
```

the pair:

```text
(StudentID, InstructorID)
```

also determines the course.

Therefore there are two candidate keys:

```text
(StudentID, CourseID)
(StudentID, InstructorID)
```

So:

- `StudentID` is prime because it occurs in both candidate keys.
- `CourseID` is prime because it occurs in the first candidate key.
- `InstructorID` is prime because it occurs in the second candidate key.

This is the key observation that makes the relation a useful 3NF-but-not-BCNF example.

---

The relation passes 3NF because `CourseID`, the attribute on the right of `InstructorID → CourseID`, is prime. It fails BCNF because `InstructorID` is not a superkey: the same instructor can appear in rows for several students. This is the only distinction to remember here—3NF allows the prime-attribute exception, while BCNF does not.

---

# 11. Decompose the relation to BCNF

We separate the instructor-course dependency from the student-instructor relationship.

## InstructorCourse

| InstructorID | CourseID |
|---|---|
| I10 | C101 |
| I20 | C102 |
| I30 | C103 |

Functional dependency:

```text
InstructorID → CourseID
```

Here `InstructorID` is the key.

Therefore this relation satisfies BCNF.

## StudentInstructor

| StudentID | InstructorID |
|---|---|
| S01 | I10 |
| S02 | I10 |
| S03 | I20 |
| S04 | I20 |
| S05 | I30 |

Its key is:

```text
(StudentID, InstructorID)
```

There is no non-key determinant violating BCNF under the stated dependency set.

Therefore this relation also satisfies BCNF.

## Visualizing BCNF decomposition

<div style="background:white">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 400" role="img" aria-label="BCNF decomposition from Student Course Instructor into Instructor Course and Student Instructor">
  <rect width="1100" height="400" fill="white"/>
  <text x="550" y="30" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" font-weight="700">BCNF — Every Determinant Must Be a Superkey</text>

  <rect x="55" y="75" width="990" height="95" rx="8" fill="#fff8e1" stroke="#c68a00" stroke-width="2"/>
  <text x="550" y="100" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" font-weight="700">Before BCNF</text>
  <text x="550" y="125" text-anchor="middle" font-family="Arial,sans-serif" font-size="14">StudentCourseInstructor(StudentID, CourseID, InstructorID)</text>
  <text x="550" y="150" text-anchor="middle" font-family="Arial,sans-serif" font-size="13">InstructorID → CourseID, but InstructorID is not a superkey</text>

  <line x1="550" y1="170" x2="550" y2="215" stroke="#555" stroke-width="2"/>
  <polygon points="550,215 544,203 556,203" fill="#555"/>

  <g font-family="Arial,sans-serif">
    <rect x="80" y="230" width="400" height="105" rx="8" fill="#f7f7f7" stroke="#2e7d32" stroke-width="2"/>
    <text x="280" y="256" text-anchor="middle" font-size="16" font-weight="700">InstructorCourse</text>
    <text x="280" y="281" text-anchor="middle" font-size="13">InstructorID (PK)</text>
    <text x="280" y="303" text-anchor="middle" font-size="13">CourseID</text>
    <text x="280" y="325" text-anchor="middle" font-size="12">InstructorID → CourseID</text>

    <rect x="620" y="230" width="400" height="105" rx="8" fill="#f7f7f7" stroke="#1565c0" stroke-width="2"/>
    <text x="820" y="256" text-anchor="middle" font-size="16" font-weight="700">StudentInstructor</text>
    <text x="820" y="281" text-anchor="middle" font-size="13">StudentID + InstructorID (PK)</text>
    <text x="820" y="303" text-anchor="middle" font-size="13">relationship between student and instructor</text>
    <text x="820" y="325" text-anchor="middle" font-size="12">No non-key determinant under stated FDs</text>
  </g>
</svg>

</div>

## Important BCNF caution

Normalization is based on **functional dependencies and business rules**, not merely on the values currently visible in a sample table.

For example, if the rule changes from:

> Each instructor teaches one course.

to:

> An instructor can teach several courses.

then:

```text
InstructorID → CourseID
```

is no longer a valid functional dependency.

Always establish the real business rules before deciding keys and dependencies.

---

# 12. 3NF versus BCNF

The easiest way to remember the difference is:

### 3NF

For every non-trivial FD:

```text
X → A
```

at least one must be true:

```text
X is a superkey
OR
A is a prime attribute
```

### BCNF

For every non-trivial FD:

```text
X → Y
```

this must be true:

```text
X is a superkey
```

So BCNF removes the second exception allowed by 3NF.

| Property | 3NF | BCNF |
|---|---|---|
| Must already be in lower normal forms | Yes | Yes |
| Partial dependencies removed | Yes | Yes |
| Transitive dependency problems addressed | Yes | Yes |
| Every determinant must be a superkey | No | Yes |
| Allows FD where determinant is not a superkey if dependent attribute is prime | Yes | No |
| Strictness | Less strict | More strict |

Therefore:

```text
BCNF ⟹ 3NF
```

but generally:

```text
3NF ⇏ BCNF
```

In other words, every BCNF relation is in 3NF, but a 3NF relation need not be in BCNF.

---

# 13. Complete example: dependency analysis

Before decomposing any relation, write down the dependencies.

For our order example:

## Customer relation

```text
CustomerID → CustomerName, Street, City, Zip
```

Candidate key:

```text
CustomerID
```

## Product relation

```text
ProductID → ProductName, UnitPrice
```

Candidate key:

```text
ProductID
```

## Order relation

```text
OrderID → CustomerID, OrderDate
```

Candidate key:

```text
OrderID
```

## OrderDetails relation

```text
(OrderID, ProductID) → Qty
```

Candidate key:

```text
(OrderID, ProductID)
```

The dependencies explain why the tables are structured this way.

Do not normalize merely by "splitting large tables." First identify what each attribute actually depends on.

---

# 14. How to solve a normalization question in an exam

When given a large relation, use this sequence.

## Step 1 — Write the attributes

For example:

```text
R(A, B, C, D, E)
```

## Step 2 — Identify candidate keys

Ask:

> Which minimum set of attributes uniquely identifies every row?

Do not automatically assume the first column is the key.

## Step 3 — Write functional dependencies

For example:

```text
A → B
A → C
(A, D) → E
```

## Step 4 — Check 1NF

Look for:

- lists in cells
- arrays
- repeating groups
- multiple values represented inside one attribute

If found, convert the repeating values into rows or related relations.

## Step 5 — Check 2NF

Only matters when a candidate key is composite.

Ask:

> Does any non-prime attribute depend on only part of a candidate key?

If yes, decompose.

## Step 6 — Check 3NF

Ask:

> Does a non-key determinant determine another non-key attribute?

Use the formal 3NF rule when there are multiple candidate keys.

If a dependency is transitive in the common case, decompose.

## Step 7 — Check BCNF

For every non-trivial FD:

```text
X → Y
```

ask:

> Is X a superkey?

If not, the relation is not in BCNF.

## Step 8 — Check the decomposition

A good decomposition should generally aim for:

- **lossless join** — joining the decomposed relations should recover the original information
- **dependency preservation** where practical — important dependencies can still be enforced without reconstructing the entire original relation

Lossless join and dependency preservation are important properties of decomposition; normal form alone is not the entire design problem.

---

# 15. What each normal form actually removes

The stages should not be memorized as arbitrary table-splitting exercises.

| Stage | Main question | Problem removed |
|---|---|---|
| UNF | Are several values/repeating groups hidden in a row? | Starting raw structure |
| 1NF | Does each attribute contain an atomic value with no repeating group? | Multi-valued cells / repeating groups |
| 2NF | Does every non-prime attribute depend on the whole candidate key? | Partial dependency |
| 3NF | For every FD, is the determinant a superkey or is the dependent attribute prime? | Transitive dependency in the common case |
| BCNF | Is every determinant a superkey? | Remaining FD-based redundancy not eliminated by 3NF |

---

# 16. A visual memory aid

<div style="background:white">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 470" role="img" aria-label="Visual memory aid for database normalization">
  <rect width="1000" height="470" fill="white"/>
  <text x="500" y="30" text-anchor="middle" font-family="Arial,sans-serif" font-size="21" font-weight="700">Normalization: One Question at Each Stage</text>

  <g font-family="Arial,sans-serif">
    <rect x="70" y="65" width="860" height="60" rx="10" fill="#f7f7f7" stroke="#b33" stroke-width="2"/>
    <text x="500" y="91" text-anchor="middle" font-size="16" font-weight="700">1NF</text>
    <text x="500" y="112" text-anchor="middle" font-size="13">"Is one relational cell hiding multiple values or a repeating group?"</text>

    <line x1="500" y1="125" x2="500" y2="155" stroke="#555" stroke-width="2"/>
    <polygon points="500,155 494,143 506,143" fill="#555"/>

    <rect x="70" y="155" width="860" height="60" rx="10" fill="#f7f7f7" stroke="#1565c0" stroke-width="2"/>
    <text x="500" y="181" text-anchor="middle" font-size="16" font-weight="700">2NF</text>
    <text x="500" y="202" text-anchor="middle" font-size="13">"Does a non-prime attribute depend on only part of a composite candidate key?"</text>

    <line x1="500" y1="215" x2="500" y2="245" stroke="#555" stroke-width="2"/>
    <polygon points="500,245 494,233 506,233" fill="#555"/>

    <rect x="70" y="245" width="860" height="60" rx="10" fill="#f7f7f7" stroke="#6a1b9a" stroke-width="2"/>
    <text x="500" y="271" text-anchor="middle" font-size="16" font-weight="700">3NF</text>
    <text x="500" y="292" text-anchor="middle" font-size="13">"For every FD X → A, is X a superkey or is A a prime attribute?"</text>

    <line x1="500" y1="305" x2="500" y2="335" stroke="#555" stroke-width="2"/>
    <polygon points="500,335 494,323 506,323" fill="#555"/>

    <rect x="70" y="335" width="860" height="60" rx="10" fill="#f7f7f7" stroke="#ef6c00" stroke-width="2"/>
    <text x="500" y="361" text-anchor="middle" font-size="16" font-weight="700">BCNF</text>
    <text x="500" y="382" text-anchor="middle" font-size="13">"For every non-trivial FD X → Y, is X a superkey?"</text>

    <text x="500" y="430" text-anchor="middle" font-size="13" fill="#444">Remember: BCNF is stricter than 3NF.</text>
  </g>
</svg>

</div>

---

# 17. Common beginner mistakes

## Mistake 1 — "Every composite value violates 1NF"

Not necessarily.

Atomicity depends on the relation's intended domain.

A value such as:

```text
42 Oak St, Seattle, 98101
```

can be treated as one address value.

The stronger 1NF problem is a cell such as:

```text
Widget A, Widget B, Widget C
```

where the attribute represents a set of product values.

## Mistake 2 — "2NF means remove all redundancy"

No.

2NF specifically addresses **partial dependency on part of a composite candidate key**.

If the key contains only one attribute, partial dependency is impossible.

Therefore:

> A relation in 1NF with a single-attribute candidate key is automatically in 2NF.

## Mistake 3 — "3NF simply means no transitive dependency"

That is a useful beginner shortcut, but the formal definition is:

```text
For every non-trivial X → A:
X is a superkey OR A is prime.
```

The formal definition matters when a relation has multiple candidate keys.

## Mistake 4 — "BCNF means no redundancy at all"

No.

BCNF removes a particular class of redundancy caused by functional dependencies.

A database can still have other design issues, including multivalued dependencies, join dependencies, derived values, poor indexing, or intentionally denormalized structures.

## Mistake 5 — "The primary key is always the candidate key"

A table can have multiple candidate keys.

The primary key is the candidate key selected by the designer.

## Mistake 6 — "If the sample data looks unique, it must be a key"

Keys are determined by **business rules**, not accidental uniqueness in a small sample.

If today's data contains one row for each instructor, that does not prove:

```text
InstructorID → StudentID
```

The rule governing the system must establish the dependency.

## Mistake 7 — "Just keep splitting tables until everything is tiny"

Normalization is not arbitrary fragmentation.

Every decomposition should have a reason based on:

- functional dependencies
- candidate keys
- entity/relationship meaning
- lossless join
- dependency preservation
- application requirements

---

# 18. Why normalization is not always the final design

Normalization is mainly a method for designing a consistent relational model.

After normalization, a production system may deliberately introduce **denormalization** for:

- reporting
- analytics
- read-heavy workloads
- caching
- materialized views
- reducing expensive joins

For example, an application may maintain a reporting table containing:

```text
OrderID
CustomerName
ProductName
Qty
OrderTotal
```

even though those facts are stored separately in the normalized OLTP schema.

The important distinction is:

> **Normalize first to understand the correct dependencies; denormalize later for a measured requirement.**

Do not introduce duplicated data merely because a single wide table looks easier.

---

# 19. Complete worked progression

Here is the entire transformation in compact form.

## UNF

```text
OrdersRaw(
    OrderID,
    CustomerID,
    CustomerName,
    Address,
    Products,
    Phones,
    OrderDate
)
```

Problem:

```text
Products = {P01, P02, ...}
Phones   = {phone1, phone2, ...}
```

## 1NF

```text
OrderLines(
    OrderID,
    CustomerID,
    CustomerName,
    Street,
    City,
    Zip,
    ProductID,
    ProductName,
    Qty,
    UnitPrice,
    OrderDate
)
```

Candidate key:

```text
(OrderID, ProductID)
```

Dependencies:

```text
OrderID → CustomerID, CustomerName, Street, City, Zip, OrderDate
ProductID → ProductName, UnitPrice
(OrderID, ProductID) → Qty
```

Problems remaining:

```text
partial dependencies
```

## 2NF

```text
Orders(
    OrderID,
    CustomerID,
    CustomerName,
    Street,
    City,
    Zip,
    OrderDate
)

Products(
    ProductID,
    ProductName,
    UnitPrice
)

OrderDetails(
    OrderID,
    ProductID,
    Qty
)
```

Problem remaining in Orders:

```text
OrderID → CustomerID
CustomerID → CustomerName, Street, City, Zip
```

This is the transitive dependency.

## 3NF

```text
Customers(
    CustomerID,
    CustomerName,
    Street,
    City,
    Zip
)

Orders(
    OrderID,
    CustomerID,
    OrderDate
)

Products(
    ProductID,
    ProductName,
    UnitPrice
)

OrderDetails(
    OrderID,
    ProductID,
    Qty
)
```

The order example is now in 3NF and, under the stated dependencies, also satisfies BCNF.

The separate university example demonstrates why a relation can be in 3NF but not BCNF.

---

# 20. From one normal form to the next — final table

| Stage | Starting point | What to inspect | Key question | Action if problem exists | Result |
|---|---|---|---|---|---|
| **UNF** | Raw spreadsheet/data | Lists, arrays, repeating groups | Is one cell or row hiding multiple values? | Convert repeating values into separate rows/relations | Data ready for 1NF |
| **1NF** | Atomic rows | Atomicity and repeating groups | Does each attribute contain one value from its defined domain? | Remove multi-valued cells and repeating groups | 1NF |
| **2NF** | 1NF relation | Candidate keys and FDs | Does a non-prime attribute depend on only part of a composite candidate key? | Move attributes to relations where they depend on the complete key | 2NF |
| **3NF** | 2NF relation | All FDs | For `X → A`, is `X` a superkey or is `A` prime? | Remove transitive/non-key dependency where required | 3NF |
| **BCNF** | 3NF relation | All determinants | For every non-trivial `X → Y`, is `X` a superkey? | Decompose the relation around the violating FD | BCNF |
| **After normalization** | Normalized schema | Decomposition quality | Is the decomposition lossless and are important dependencies preserved? | Validate joins, constraints, and business rules | Usable relational design |

---

# 21. One-line memory rules

```text
1NF  → One cell should not hide a set of values.

2NF  → No partial dependency on part of a composite candidate key.

3NF  → For every FD, determinant is a superkey or dependent attribute is prime.

BCNF → Every determinant is a superkey.
```

The most useful conceptual progression is:

```text
1NF  = structure of values
2NF  = dependency on the whole key
3NF  = dependency through another non-key attribute
BCNF = every determinant must be a key
```

And the most important dependency notation to practice is:

```text
A → B
```

meaning:

> A functionally determines B.
