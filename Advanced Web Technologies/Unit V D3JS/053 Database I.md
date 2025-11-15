### Part 2: Advanced Database Systems Overview
---
#### 1. Overview of Object-Oriented Concepts in Databases
Object-Oriented Databases (OODBMS) were created to handle complex data relationships more naturally than Relational Databases (RDBMS).
*   **Objects:** Encapsulate both data (attributes) and behavior (methods).
*   **Classes:** Blueprints for creating objects.
*   **Inheritance:** A class can inherit attributes and methods from a parent class, promoting code reuse.
*   **Polymorphism:** The same operation can behave differently on different classes.
*   **Encapsulation:** Hiding the internal state of an object and requiring all interaction to be performed through an object's methods.
---
#### 2. Object Model of ODMG
The Object Data Management Group (ODMG) proposed a standard for OODBMS.
*   **Objective:** To provide portability for applications across compliant OODBMS, similar to how SQL provides portability across RDBMS.
*   **Key Components:**
    *   **Object Model:** A standard data model with objects, literals, types, etc.
    *   **Object Definition Language (ODL):** Used to define the database schema.
    *   **Object Query Language (OQL):** A declarative query language for objects.
    *   **Bindings:** To programming languages like C++, Java, and Smalltalk.
---
#### 3. Object Definition Language (ODL)
ODL is the schema definition language for OODBMS, analogous to SQL's DDL (CREATE TABLE...).
*   It defines classes, their attributes, relationships, and methods.
*   **Example:**
    ```odl
    interface Person {
      attribute string name;
      attribute Date birthdate;
      relationship Set<Project> works_on inverse Project::has_members;
    };
    interface Project {
      attribute string title;
      relationship Set<Person> has_members inverse Person::works_on;
    };
    ```
---
#### 4. Object Query Language (OQL)
OQL is a query language for OODBMS, designed to be similar to SQL but for objects.
*   It supports complex objects, path expressions, and inheritance.
*   **Example:** `SELECT p.name FROM Persons p WHERE p.age > 30`

#### 5. Object Database Conceptual Design
The process involves mapping an object-oriented model (e.g., from UML) directly to an OODB schema.
*   **Mapping Classes:** Each persistent class becomes a class in the OODB schema.
*   **Mapping Attributes:** Simple attributes are mapped directly.
*   **Mapping Relationships:** Relationships (like 1:N, M:N) are mapped using reference attributes or relationship constructs (as shown in the ODL example).
---
#### 6. Distributed Database Concepts
A **Distributed Database (DDB)** is a collection of multiple, logically interrelated databases distributed over a computer network.
*   **Motivation:** Modular growth, improved performance/availability, and organizational autonomy.

#### 7. Data Fragmentation, Replication, and Allocation
These are the core design techniques for distributing data.
*   **Fragmentation:** Splitting a relation (table) into smaller pieces.
    *   **Horizontal:** A subset of *rows* (e.g., all customers in Europe).
    *   **Vertical:** A subset of *columns* (e.g., customer contact info separate from order history).
*   **Replication:** Storing multiple copies of a fragment at different sites.
    *   Improves reliability and read performance but complicates updates.
*   **Allocation:** Deciding at which site(s) to place each fragment.
---
#### 8. Types of Distributed Database Systems
*   **Homogeneous DDBMS:** All sites use the same DBMS software.
*   **Heterogeneous DDBMS:** Different sites may run different DBMS software (much more complex, requires gateways).

#### 9. Query Processing in Distributed Databases
The goal is to transform a high-level query into an efficient execution strategy across the network.
*   **Key Steps:**
    1.  **Query Decomposition:** Parse and validate the query.
    2.  **Data Localization:** Translate the query into fragments (e.g., replace a global table name with its constituent fragments).
    3.  **Global Query Optimization:** Find the best (least cost) execution plan, considering local processing cost and network communication cost (which is often the dominant factor). Techniques include **semijoin** to reduce data transfer.
---
#### 10. Overview of Concurrency Control and Recovery in Distributed Databases
*   **Concurrency Control:** Ensures transaction isolation and consistency in a distributed environment.
    *   **Distributed Locking:** Protocols like *Distributed Two-Phase Locking (2PL)*.
    *   **Timestamp Ordering:** Assigns unique timestamps to order transactions globally.
    *   **Distributed Deadlock Detection:** More complex as waits-for graphs are distributed.
*   **Recovery:** Ensures atomicity and durability even after failures.
    *   **Distributed Commit:** The **Two-Phase Commit (2PC)** protocol is the standard for ensuring all sites either all commit or all abort a transaction. It involves a coordinator and participants.
    *   **Logging & Checkpointing:** Similar to centralized DBMS, but logs are maintained at each local site.

