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

> If Jane places five orders, her name, address, and phone may be stored five times. If Widget A appears in 1,000 order lines, its price may be stored 1,000 times.
---
## Redundancy creates three classic problems.

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
(OrderID, ProductID) # composite key
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

- means that one customer ID can have only one customer name. If two rows contain `CustomerID = C01`, both must contain the same name. However, the arrow does not automatically work in reverse: two customers may share a name, so `CustomerName → CustomerID` may be false.

Similarly:

```text
ProductID → ProductName, UnitPrice
```

- means a product ID determines both its product name and current catalog price. The left side can also contain several attributes:

```text
(OrderID, ProductID) → Qty
```

Here, neither `OrderID` nor `ProductID` alone is enough. The combination identifies a particular product within a particular order and therefore determines its quantity.

- Functional dependencies express business rules that must always be true, not patterns that happen to appear in a small sample of data.
- Functional dependencies are the main reasoning tool used for 2NF, 3NF, and BCNF.

---

# 3. Superkey, candidate key, primary key, and prime attribute

These terms describe different roles that attributes can play in identifying rows. They are especially important when checking **3NF** and **BCNF**.

Consider the following relation:

```text
STUDENT(StudentID, Email, StudentName, Department)
```

Assume that both `StudentID` and `Email` are unique for every student.

## Superkey

A **superkey** is any set of one or more attributes that uniquely identifies a row.

For the `STUDENT` relation, all of the following are superkeys:

```text
{StudentID}
{Email}
{StudentID, StudentName}
{Email, Department}
```

The last two sets contain extra attributes, but they still identify one student because they include either `StudentID` or `Email`.

<div style="background:white">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 330" role="img" aria-label="Examples of superkeys and non-superkeys in the Student relation">
  <rect width="1000" height="330" fill="white"/>
  <text x="500" y="34" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="#1f2937">Which attribute sets uniquely identify a student?</text>

  <g font-family="Arial,sans-serif">
    <rect x="45" y="70" width="275" height="205" rx="14" fill="#ecfdf5" stroke="#15803d" stroke-width="2"/>
    <text x="182" y="100" text-anchor="middle" font-size="18" font-weight="700" fill="#166534">Minimal superkeys</text>
    <rect x="78" y="125" width="208" height="48" rx="9" fill="white" stroke="#22c55e" stroke-width="2"/>
    <text x="182" y="155" text-anchor="middle" font-size="16" fill="#1f2937">{StudentID}</text>
    <rect x="78" y="190" width="208" height="48" rx="9" fill="white" stroke="#22c55e" stroke-width="2"/>
    <text x="182" y="220" text-anchor="middle" font-size="16" fill="#1f2937">{Email}</text>

    <rect x="363" y="70" width="275" height="205" rx="14" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
    <text x="500" y="100" text-anchor="middle" font-size="18" font-weight="700" fill="#1d4ed8">Non-minimal superkeys</text>
    <rect x="388" y="125" width="225" height="48" rx="9" fill="white" stroke="#60a5fa" stroke-width="2"/>
    <text x="500" y="155" text-anchor="middle" font-size="15" fill="#1f2937">{StudentID, StudentName}</text>
    <rect x="388" y="190" width="225" height="48" rx="9" fill="white" stroke="#60a5fa" stroke-width="2"/>
    <text x="500" y="220" text-anchor="middle" font-size="15" fill="#1f2937">{Email, Department}</text>

    <rect x="680" y="70" width="275" height="205" rx="14" fill="#fef2f2" stroke="#dc2626" stroke-width="2"/>
    <text x="817" y="100" text-anchor="middle" font-size="18" font-weight="700" fill="#b91c1c">Not superkeys</text>
    <rect x="713" y="125" width="208" height="48" rx="9" fill="white" stroke="#f87171" stroke-width="2"/>
    <text x="817" y="155" text-anchor="middle" font-size="16" fill="#1f2937">{StudentName}</text>
    <rect x="713" y="190" width="208" height="48" rx="9" fill="white" stroke="#f87171" stroke-width="2"/>
    <text x="817" y="220" text-anchor="middle" font-size="16" fill="#1f2937">{Department}</text>

    <text x="500" y="309" text-anchor="middle" font-size="14" fill="#4b5563">A set is a superkey if its values can point to exactly one row.</text>
  </g>
</svg>

</div>

## Candidate key

A **candidate key** is a **minimal superkey**: it uniquely identifies a row, and no attribute can be removed without losing that property.

Therefore, the candidate keys are:

```text
{StudentID}
{Email}
```

`{StudentID, StudentName}` is a superkey but **not** a candidate key. Removing `StudentName` still leaves `{StudentID}`, which is enough to identify the student. The extra attribute makes the set non-minimal.

> **Quick test:** A candidate key must pass both tests: **unique** and **minimal**.

## Primary key

A table can have several candidate keys, but the database designer chooses one of them as the **primary key**. The remaining candidate keys are often called **alternate keys**.

For example, if `StudentID` is selected:

```text
Primary key:   {StudentID}
Alternate key: {Email}
```

Choosing `StudentID` as the primary key does not stop `Email` from being a candidate key.

## Prime attribute

A **prime attribute** is an attribute that belongs to **at least one candidate key**.

In this example:

- `StudentID` is prime because it forms the candidate key `{StudentID}`.
- `Email` is prime because it forms the candidate key `{Email}`.
- `StudentName` and `Department` are non-prime because they do not belong to any candidate key.

<div style="background:white">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 360" role="img" aria-label="Relationship between superkeys, candidate keys, the primary key, and prime attributes">
  <rect width="1000" height="360" fill="white"/>
  <text x="500" y="34" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="#1f2937">How the key terms are related</text>

  <g font-family="Arial,sans-serif">
    <rect x="45" y="62" width="570" height="245" rx="18" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
    <text x="75" y="92" font-size="18" font-weight="700" fill="#1d4ed8">Superkeys</text>
    <text x="75" y="116" font-size="13" fill="#475569">Every set here uniquely identifies a row</text>

    <rect x="105" y="135" width="385" height="135" rx="16" fill="#ecfdf5" stroke="#16a34a" stroke-width="2"/>
    <text x="135" y="166" font-size="18" font-weight="700" fill="#15803d">Candidate keys</text>
    <text x="135" y="188" font-size="13" fill="#475569">The minimal superkeys</text>

    <rect x="160" y="207" width="145" height="42" rx="9" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
    <text x="232" y="233" text-anchor="middle" font-size="15" font-weight="700" fill="#92400e">StudentID</text>
    <text x="325" y="233" text-anchor="middle" font-size="21" fill="#64748b">or</text>
    <rect x="350" y="207" width="105" height="42" rx="9" fill="white" stroke="#22c55e" stroke-width="2"/>
    <text x="402" y="233" text-anchor="middle" font-size="15" font-weight="700" fill="#166534">Email</text>

    <text x="505" y="175" font-size="13" fill="#1e40af">Examples with extras:</text>
    <text x="505" y="200" font-size="13" fill="#1f2937">{StudentID, Name}</text>
    <text x="505" y="223" font-size="13" fill="#1f2937">{Email, Department}</text>

    <line x1="305" y1="228" x2="678" y2="228" stroke="#d97706" stroke-width="2"/>
    <polygon points="678,228 666,221 666,235" fill="#d97706"/>

    <rect x="680" y="163" width="270" height="130" rx="14" fill="#fffbeb" stroke="#d97706" stroke-width="2"/>
    <text x="815" y="194" text-anchor="middle" font-size="18" font-weight="700" fill="#92400e">Primary key</text>
    <text x="815" y="221" text-anchor="middle" font-size="15" fill="#1f2937">The selected candidate key</text>
    <text x="815" y="254" text-anchor="middle" font-size="19" font-weight="700" fill="#b45309">StudentID</text>

    <text x="500" y="337" text-anchor="middle" font-size="14" fill="#374151">Prime attributes: StudentID and Email â€” both appear in at least one candidate key.</text>
  </g>
</svg>

</div>

The distinction is important in **3NF**: whether a dependent attribute is prime can determine if a functional dependency is allowed. In **BCNF**, every determinant must be a superkey.


---

# 4. The normalization journey

We will use an order-management example.

> The journey is in following stages: Each stage solves a different type of dependency problem.

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

Most normalization examples stop at **Third Normal Form (3NF)** because it removes the most common dependency problems. However, 3NF has one exception: it can allow a dependency whose determinant is not a superkey when the dependent attribute is prime.

**Boyce-Codd Normal Form (BCNF)** removes that exception. It is stricter than 3NF and is especially important when a relation has overlapping candidate keys.

Before stating the rule, recall these terms:

- A **functional dependency (FD)**, written `X → Y`, means that one value of `X` is associated with only one value of `Y`.
- The left side, `X`, is called the **determinant**.
- A **superkey** is any set of attributes that uniquely identifies a complete row.
- A **candidate key** is a minimal superkey: it has no unnecessary attribute.
- A **prime attribute** belongs to at least one candidate key.

## Formal definition

A relation is in **BCNF** if, for every non-trivial functional dependency:

```text
X → Y
```

`X` is a **superkey** of the relation.

In simple words:

> Every determinant must be able to identify one complete row.

The word **superkey** is important. A determinant may determine one attribute without determining the entire row. Such a determinant violates BCNF.

<div style="background:white">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 400" role="img" aria-label="Steps for checking whether a functional dependency satisfies BCNF">
  <rect width="1000" height="400" fill="white"/>
  <text x="500" y="34" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="#1f2937">How to Check One Functional Dependency for BCNF</text>

  <g font-family="Arial,sans-serif">
    <rect x="340" y="62" width="320" height="60" rx="12" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
    <text x="500" y="88" text-anchor="middle" font-size="17" font-weight="700" fill="#1d4ed8">Start with an FD: X → Y</text>
    <text x="500" y="108" text-anchor="middle" font-size="13" fill="#475569">X is the determinant</text>

    <line x1="500" y1="122" x2="500" y2="158" stroke="#64748b" stroke-width="2"/>
    <polygon points="500,164 493,152 507,152" fill="#64748b"/>

    <polygon points="500,164 675,238 500,312 325,238" fill="#fffbeb" stroke="#d97706" stroke-width="2"/>
    <text x="500" y="229" text-anchor="middle" font-size="17" font-weight="700" fill="#92400e">Does X determine</text>
    <text x="500" y="253" text-anchor="middle" font-size="17" font-weight="700" fill="#92400e">every attribute?</text>

    <line x1="325" y1="238" x2="180" y2="238" stroke="#16a34a" stroke-width="2"/>
    <polygon points="174,238 186,231 186,245" fill="#16a34a"/>
    <text x="250" y="225" text-anchor="middle" font-size="14" font-weight="700" fill="#15803d">YES</text>
    <rect x="35" y="200" width="140" height="76" rx="11" fill="#ecfdf5" stroke="#16a34a" stroke-width="2"/>
    <text x="105" y="230" text-anchor="middle" font-size="16" font-weight="700" fill="#166534">X is a superkey</text>
    <text x="105" y="252" text-anchor="middle" font-size="14" fill="#166534">BCNF satisfied</text>

    <line x1="675" y1="238" x2="820" y2="238" stroke="#dc2626" stroke-width="2"/>
    <polygon points="826,238 814,231 814,245" fill="#dc2626"/>
    <text x="750" y="225" text-anchor="middle" font-size="14" font-weight="700" fill="#b91c1c">NO</text>
    <rect x="825" y="200" width="140" height="76" rx="11" fill="#fef2f2" stroke="#dc2626" stroke-width="2"/>
    <text x="895" y="230" text-anchor="middle" font-size="16" font-weight="700" fill="#991b1b">X is not a key</text>
    <text x="895" y="252" text-anchor="middle" font-size="14" fill="#991b1b">BCNF violated</text>

    <text x="500" y="356" text-anchor="middle" font-size="15" fill="#374151">Repeat this test for every non-trivial functional dependency in the relation.</text>
  </g>
</svg>

</div>




---
# Optional


---


# Optional: Practice Example to detect 3NF or BCNF

# 10. A relation that is in 3NF but not BCNF

Consider a university system that records which instructor teaches a student in a course:

```text
StudentCourseInstructor(
    StudentID,
    CourseID,
    InstructorID
)
```

We will use these business rules:

1. For a particular student and course, there is exactly one instructor.
2. Each instructor teaches exactly one course, but can teach many students.

Example data:

| StudentID | CourseID | InstructorID |
|---|---|---|
| S01 | C101 | I10 |
| S02 | C101 | I10 |
| S03 | C102 | I20 |
| S04 | C102 | I20 |
| S05 | C103 | I30 |

## Step 1 — Write the functional dependencies

The first business rule gives this FD:

```text
(StudentID, CourseID) → InstructorID
```

It means that if `StudentID` and `CourseID` are known together, there can be only one matching `InstructorID`.

The second business rule gives this FD:

```text
InstructorID → CourseID
```

It means that one `InstructorID` always has the same `CourseID`. The arrow does **not** work in reverse because a course can have more than one instructor.

Notice that `InstructorID` determines `CourseID`, but it does not determine `StudentID`. For example, `I10` appears with both `S01` and `S02`.

## Step 2 — Find the candidate keys

A candidate key must determine all three attributes and must be minimal.

Start with `{StudentID, CourseID}`:

```text
{StudentID, CourseID}
        ↓
(StudentID, CourseID) → InstructorID
        ↓
{StudentID, CourseID, InstructorID}
```

The pair determines the complete row. Neither attribute alone does, so it is a candidate key.

Now start with `{StudentID, InstructorID}`:

```text
{StudentID, InstructorID}
        ↓
InstructorID → CourseID
        ↓
{StudentID, InstructorID, CourseID}
```

This pair also determines the complete row. Neither attribute alone does, so it is another candidate key.

Therefore, the relation has two candidate keys:

```text
{StudentID, CourseID}
{StudentID, InstructorID}
```

Any candidate key is automatically a superkey. A larger set such as `{StudentID, CourseID, InstructorID}` is also a superkey, but it is not a candidate key because it contains unnecessary attributes.

## Step 3 — Identify the prime attributes

A prime attribute appears in at least one candidate key:

- `StudentID` appears in both candidate keys.
- `CourseID` appears in `{StudentID, CourseID}`.
- `InstructorID` appears in `{StudentID, InstructorID}`.

Therefore, **all three attributes are prime**.

<div style="background:white">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 475" role="img" aria-label="Deriving the candidate keys and prime attributes of Student Course Instructor">
  <rect width="1100" height="475" fill="white"/>
  <text x="550" y="34" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="#1f2937">Finding the Candidate Keys</text>

  <g font-family="Arial,sans-serif">
    <rect x="40" y="65" width="485" height="245" rx="15" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
    <text x="282" y="96" text-anchor="middle" font-size="18" font-weight="700" fill="#1d4ed8">Candidate key 1</text>
    <rect x="105" y="120" width="355" height="48" rx="9" fill="white" stroke="#60a5fa" stroke-width="2"/>
    <text x="282" y="150" text-anchor="middle" font-size="16" fill="#1f2937">{StudentID, CourseID}</text>
    <line x1="282" y1="168" x2="282" y2="207" stroke="#2563eb" stroke-width="2"/>
    <polygon points="282,213 275,201 289,201" fill="#2563eb"/>
    <text x="302" y="194" font-size="13" fill="#1d4ed8">determines InstructorID</text>
    <rect x="80" y="213" width="405" height="58" rx="9" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
    <text x="282" y="239" text-anchor="middle" font-size="15" font-weight="700" fill="#1e3a8a">StudentID + CourseID + InstructorID</text>
    <text x="282" y="259" text-anchor="middle" font-size="13" fill="#1e40af">All attributes are known</text>

    <rect x="575" y="65" width="485" height="245" rx="15" fill="#ecfdf5" stroke="#16a34a" stroke-width="2"/>
    <text x="817" y="96" text-anchor="middle" font-size="18" font-weight="700" fill="#15803d">Candidate key 2</text>
    <rect x="640" y="120" width="355" height="48" rx="9" fill="white" stroke="#4ade80" stroke-width="2"/>
    <text x="817" y="150" text-anchor="middle" font-size="16" fill="#1f2937">{StudentID, InstructorID}</text>
    <line x1="817" y1="168" x2="817" y2="207" stroke="#16a34a" stroke-width="2"/>
    <polygon points="817,213 810,201 824,201" fill="#16a34a"/>
    <text x="837" y="194" font-size="13" fill="#15803d">determines CourseID</text>
    <rect x="615" y="213" width="405" height="58" rx="9" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
    <text x="817" y="239" text-anchor="middle" font-size="15" font-weight="700" fill="#14532d">StudentID + InstructorID + CourseID</text>
    <text x="817" y="259" text-anchor="middle" font-size="13" fill="#166534">All attributes are known</text>

    <rect x="115" y="345" width="870" height="82" rx="13" fill="#fffbeb" stroke="#d97706" stroke-width="2"/>
    <text x="550" y="375" text-anchor="middle" font-size="17" font-weight="700" fill="#92400e">Prime attributes</text>
    <text x="550" y="402" text-anchor="middle" font-size="15" fill="#1f2937">StudentID, CourseID, and InstructorID are prime because each appears in a candidate key.</text>
  </g>
</svg>

</div>

## Step 4 — Check 3NF

For each FD `X → A`, 3NF requires at least one of these conditions:

1. `X` is a superkey, or
2. `A` is a prime attribute.

Apply the rule:

| Functional dependency | Why it passes 3NF |
|---|---|
| `(StudentID, CourseID) → InstructorID` | `(StudentID, CourseID)` is a candidate key and therefore a superkey. |
| `InstructorID → CourseID` | `CourseID` is a prime attribute, so the prime-attribute exception applies. |

Therefore, the relation is in **3NF**.

## Step 5 — Check BCNF

BCNF has only one test: the determinant of every non-trivial FD must be a superkey.

For the dependency:

```text
InstructorID → CourseID
```

`InstructorID` is **not** a superkey because it cannot identify one complete row. The same instructor can teach several students:

```text
I10 → (S01, C101)
I10 → (S02, C101)
```

Knowing `I10` tells us the course, `C101`, but it does not tell us which student row is intended. Therefore, `InstructorID → CourseID` violates BCNF.

<div style="background:white">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 385" role="img" aria-label="Why Student Course Instructor passes 3NF but fails BCNF">
  <rect width="1100" height="385" fill="white"/>
  <text x="550" y="34" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="#1f2937">The Same Dependency, Two Different Tests</text>

  <g font-family="Arial,sans-serif">
    <rect x="335" y="62" width="430" height="62" rx="11" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
    <text x="550" y="88" text-anchor="middle" font-size="18" font-weight="700" fill="#1f2937">InstructorID → CourseID</text>
    <text x="550" y="110" text-anchor="middle" font-size="13" fill="#475569">InstructorID is not a superkey; CourseID is prime</text>

    <line x1="455" y1="124" x2="300" y2="177" stroke="#16a34a" stroke-width="2"/>
    <polygon points="294,179 304,169 308,182" fill="#16a34a"/>
    <line x1="645" y1="124" x2="800" y2="177" stroke="#dc2626" stroke-width="2"/>
    <polygon points="806,179 792,182 796,169" fill="#dc2626"/>

    <rect x="70" y="180" width="430" height="145" rx="15" fill="#ecfdf5" stroke="#16a34a" stroke-width="2"/>
    <text x="285" y="213" text-anchor="middle" font-size="20" font-weight="700" fill="#166534">3NF: PASS</text>
    <text x="285" y="244" text-anchor="middle" font-size="15" fill="#1f2937">The determinant is not a superkey,</text>
    <text x="285" y="267" text-anchor="middle" font-size="15" fill="#1f2937">but CourseID is a prime attribute.</text>
    <text x="285" y="298" text-anchor="middle" font-size="14" font-weight="700" fill="#15803d">3NF allows this exception.</text>

    <rect x="600" y="180" width="430" height="145" rx="15" fill="#fef2f2" stroke="#dc2626" stroke-width="2"/>
    <text x="815" y="213" text-anchor="middle" font-size="20" font-weight="700" fill="#991b1b">BCNF: FAIL</text>
    <text x="815" y="244" text-anchor="middle" font-size="15" fill="#1f2937">InstructorID is not a superkey,</text>
    <text x="815" y="267" text-anchor="middle" font-size="15" fill="#1f2937">so the dependency is not allowed.</text>
    <text x="815" y="298" text-anchor="middle" font-size="14" font-weight="700" fill="#b91c1c">BCNF has no prime-attribute exception.</text>

    <text x="550" y="360" text-anchor="middle" font-size="15" fill="#374151">Result: the relation is in 3NF, but it is not in BCNF.</text>
  </g>
</svg>

</div>

> **Beginner shortcut:** 3NF asks, “Is the left side a superkey, or is the right side prime?” BCNF asks only, “Is the left side a superkey?”


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

- Always establish the real business rules before deciding keys and dependencies.

---
# 12. 3NF versus BCNF

The easiest way to remember the difference is:

### 3NF

For every non-trivial FD (**FD = Functional Dependency**, a rule `X → Y` meaning X uniquely determines Y):

```text
X → A
```

at least one must be true:

```text
X is a superkey
OR
A is a prime attribute
```

> **superkey** = any set of one or more attributes that uniquely identifies a row.
> **prime attribute** = an attribute that belongs to at least one candidate key (a minimal superkey).

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

## Visual example: 3NF but not BCNF

Consider the relation:

```text
StudentCourseInstructor(StudentID, CourseID, InstructorID)
```

Business rules:

- Each instructor teaches exactly one course.
- A student can take a course from only one instructor.
- A course can be taught by multiple instructors.

Functional dependencies:

```text
InstructorID → CourseID          (each instructor teaches one course)
(StudentID, CourseID) → InstructorID   (a student takes a course from one instructor)
```

Candidate keys:

```text
{StudentID, CourseID}
{StudentID, InstructorID}
```

Prime attributes (**prime attribute** = attribute in at least one candidate key):

```text
StudentID, CourseID, InstructorID
```

Check 3NF:

| FD | Determinant (X) | Is X a superkey? | Is dependent (A) prime? | 3NF? |
|---|---|---|---|---|
| `InstructorID → CourseID` | InstructorID | No | Yes (CourseID is prime) | Yes |
| `(StudentID, CourseID) → InstructorID` | (StudentID, CourseID) | Yes | — | Yes |

Check BCNF:

| FD | Determinant (X) | Is X a superkey? | BCNF? |
|---|---|---|---|
| `InstructorID → CourseID` | InstructorID | No | **No** |
| `(StudentID, CourseID) → InstructorID` | (StudentID, CourseID) | Yes | Yes |

So this relation is in 3NF but **not** in BCNF, because `InstructorID → CourseID` has a determinant (`InstructorID`) that is not a superkey, even though the dependent attribute (`CourseID`) is prime.

<div style="background:white">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 520" role="img" aria-label="3NF but not BCNF example with StudentCourseInstructor relation">
  <rect width="1100" height="520" fill="white"/>
  <text x="550" y="34" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="#1f2937">3NF but NOT BCNF — StudentCourseInstructor</text>

  <g font-family="Arial,sans-serif">
    <!-- Relation box -->
    <rect x="80" y="65" width="940" height="70" rx="10" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
    <text x="550" y="93" text-anchor="middle" font-size="16" font-weight="700" fill="#0f172a">StudentCourseInstructor(StudentID, CourseID, InstructorID)</text>
    <text x="550" y="118" text-anchor="middle" font-size="13" fill="#475569">Candidate keys: {StudentID, CourseID} and {StudentID, InstructorID}</text>

    <!-- FDs -->
    <rect x="80" y="155" width="450" height="130" rx="10" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
    <text x="305" y="182" text-anchor="middle" font-size="16" font-weight="700" fill="#1d4ed8">Functional Dependencies</text>
    <text x="110" y="210" font-size="14" fill="#1f2937">InstructorID → CourseID</text>
    <text x="110" y="235" font-size="13" fill="#64748b">(determinant is not a superkey)</text>
    <text x="110" y="262" font-size="14" fill="#1f2937">(StudentID, CourseID) → InstructorID</text>
    <text x="110" y="282" font-size="13" fill="#64748b">(determinant is a superkey)</text>

    <!-- Prime attributes -->
    <rect x="570" y="155" width="450" height="130" rx="10" fill="#ecfdf5" stroke="#15803d" stroke-width="2"/>
    <text x="795" y="182" text-anchor="middle" font-size="16" font-weight="700" fill="#166534">Prime Attributes</text>
    <text x="600" y="212" font-size="14" fill="#1f2937">StudentID</text>
    <text x="600" y="237" font-size="14" fill="#1f2937">CourseID</text>
    <text x="600" y="262" font-size="14" fill="#1f2937">InstructorID</text>
    <text x="600" y="283" font-size="12" fill="#64748b">All appear in at least one candidate key.</text>

    <!-- 3NF check -->
    <rect x="80" y="315" width="450" height="160" rx="10" fill="#fffbeb" stroke="#d97706" stroke-width="2"/>
    <text x="305" y="342" text-anchor="middle" font-size="16" font-weight="700" fill="#92400e">3NF Check</text>
    <text x="110" y="370" font-size="13" fill="#1f2937">For each FD X → A:</text>
    <text x="110" y="395" font-size="13" fill="#1f2937">X is superkey OR A is prime?</text>
    <text x="110" y="425" font-size="13" fill="#166534">✓ InstructorID → CourseID</text>
    <text x="130" y="443" font-size="12" fill="#166534">CourseID is prime → allowed</text>
    <text x="110" y="465" font-size="13" fill="#166534">✓ (StudentID, CourseID) → InstructorID</text>

    <!-- BCNF check -->
    <rect x="570" y="315" width="450" height="160" rx="10" fill="#fef2f2" stroke="#dc2626" stroke-width="2"/>
    <text x="795" y="342" text-anchor="middle" font-size="16" font-weight="700" fill="#b91c1c">BCNF Check</text>
    <text x="600" y="370" font-size="13" fill="#1f2937">For each FD X → Y:</text>
    <text x="600" y="395" font-size="13" fill="#1f2937">Is X a superkey?</text>
    <text x="600" y="425" font-size="13" fill="#b91c1c">✗ InstructorID → CourseID</text>
    <text x="620" y="443" font-size="12" fill="#b91c1c">InstructorID is NOT a superkey</text>
    <text x="600" y="465" font-size="13" fill="#166534">✓ (StudentID, CourseID) → InstructorID</text>

    <!-- Verdict -->
    <rect x="250" y="490" width="600" height="24" rx="6" fill="#fff8e1" stroke="#c68a00"/>
    <text x="550" y="507" text-anchor="middle" font-size="12" fill="#92400e">Verdict: In 3NF (because CourseID is prime), but NOT in BCNF (because InstructorID is not a superkey).</text>
  </g>
</svg>

</div>

The key insight:

```text
3NF allows:   X → A   when X is not a superkey, as long as A is prime.
BCNF allows:  X → Y   only when X is a superkey.
```

In the example above, `InstructorID → CourseID` is the FD that separates 3NF from BCNF. Because `CourseID` is a **prime attribute** (it belongs to the candidate key `{StudentID, CourseID}`), 3NF tolerates this dependency. BCNF does not, because `InstructorID` alone is **not a superkey** — it cannot uniquely identify a row in `StudentCourseInstructor`.
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

# Optional Read
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
