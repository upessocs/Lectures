# Web-Technology-Oriented Explanation of Key Database & Object-Oriented Concepts

> This document links traditional database/system topics with how they apply in today’s web stack (jQuery, AngularJS, Node.js, MongoDB, D3.js).

---

# 1. Overview of Object-Oriented Concepts

Object-oriented concepts describe how data and behavior are bundled using objects.
In web technology, this influences how frameworks manage data models and interaction.

### Core OO Concepts

## Classes

Blueprint defining structure and behavior (properties + methods).
In JavaScript (Node.js, AngularJS), classes can be created using the `class` keyword or constructor functions.

## Objects

Instances of classes.
Example in JS:

```js
let user = { name: "John", age: 22 };
```

## Encapsulation

Hiding data inside objects and exposing only required methods.
AngularJS controllers/services encapsulate logic, and Node.js modules hide internal code via exports.

## Inheritance

Reusing behavior from a parent class.
Example:

```js
class Admin extends User { ... }
```

## Polymorphism

Methods behave differently depending on the object calling them.
Useful in MVC structures of Angular or server logic in Node.js.

### Relevance in Web Technologies

* **AngularJS** uses OO ideas for controllers, services, and components.
* **Node.js** uses prototypes and classes for modular server-side structures.
* **MongoDB ODMs** (like Mongoose) use model classes to structure documents.
* **jQuery plugins** often behave like OO objects, encapsulating internal logic.

---

# 2. Object Model of ODMG (Object Database Management Group)

ODMG was a standard for object databases, defining:

* Object Model
* Object Definition Language (ODL)
* Object Query Language (OQL)

Its design concepts influenced modern NoSQL systems like MongoDB.

### Key Components

## Object Identity (OID)

Each object has a unique ID independent of attribute values.
Similar to MongoDB’s `_id`.

## Attributes and Relationships

Objects contain attributes and references to other objects (1:1, 1:N, N:N).

## Collections

Sets, lists, arrays stored directly as object properties.

### Web Technology Connection

MongoDB’s document model resembles ODMG’s object model:

* BSON documents = Objects
* Embedded documents = Aggregation
* Referenced documents = Associations

Node.js interacts smoothly with MongoDB because JSON ≈ object structure.

---

# 3. Object Definition Language (ODL)

ODL defines the schema of an object database.

Example ODL:

```
interface Student {
   attribute string name;
   relationship Set<Course> courses;
};
```

### Modern Equivalent

* **MongoDB Schema (Mongoose)**:

```js
const StudentSchema = new Schema({
  name: String,
  courses: [String]
});
```

* **TypeScript interfaces in Angular** also serve a similar structural purpose.

---

# 4. Object Query Language (OQL)

OQL is an SQL-like language for querying objects.

Example:

```
SELECT s.name FROM Student s WHERE s.age > 20;
```

### Modern Equivalent

* **MongoDB Query Language** (document-based):

```js
db.students.find({ age: { $gt: 20 } }, { name: 1 });
```

* **JavaScript Filters** used in Angular or Node mirror OQL functional style:

```js
students.filter(s => s.age > 20);
```

* **D3.js data filtering**:

```js
let adults = data.filter(d => d.age > 20);
```

---

# 5. Object Database Conceptual Design

Conceptual design includes:

1. Identifying objects
2. Identifying attributes
3. Identifying relationships
4. Defining collections
5. Mapping real-world relationships to object models

### Example (Web-context)

Design for an e-commerce site:

* Object: User, Product, Cart
* Relationships: User has Orders, Cart contains Products
* Embedded structures: CartItems inside Cart document
* Used heavily in **MongoDB schemas** and **Angular models**.

---

# 6. Distributed Database Concepts

A distributed database is stored across multiple physical locations.

Key requirements:

* Transparency (user sees one system)
* Reliability
* Scalability
* Network communication

### Web Context

Modern web apps use distributed databases:

* MongoDB Atlas clusters
* Node.js microservices accessing distributed DB nodes
* AngularJS front-end calling replicated APIs

---

# 7. Data Fragmentation

Splitting a database into pieces across sites.

## Types

### Horizontal Fragmentation

Rows are distributed.
Example:
Users from Asia stored in India server; users from Europe stored in Germany.

### Vertical Fragmentation

Columns distributed.
Example:
Profile info stored in one location, login credentials in another.

### Mixed Fragmentation

Combination of both.

### Web Context

Modern distributed NoSQL systems use sharding (horizontal fragmentation).
MongoDB sharding:

* Shard key divides documents
* Node.js drivers automatically route queries
* AngularJS receives data transparently

---

# 8. Replication

Copying data to multiple sites for reliability.

## Types

* Synchronous replication
* Asynchronous replication
* Multi-master replication

### Web Context

MongoDB replica sets provide:

* Automatic failover
* High availability
  Node.js apps automatically reconnect to the primary.

jQuery or AngularJS apps stay unaffected because load balancers handle routing.

---

# 9. Allocation Techniques

Deciding where to store each fragment or replica.

Methods include:

* Centralized
* Partitioned
* Fully replicated
* Mixed strategy based on:

  * Access frequency
  * Cost
  * Latency

### Web Context

CDNs, application servers, and distributed databases use similar principles for fast delivery to Angular or jQuery apps.

---

# 10. Types of Distributed Database Systems

## Homogeneous DDBMS

All sites use the same database system.

## Heterogeneous DDBMS

Different DB systems on different nodes.

## Federated Databases

Independent DBs connected through a common interface.

### Modern Web Examples

* Microservices running Node.js using different databases
* Systems integrating MongoDB + MySQL + Redis
* API gateways unify access so Angular front-ends see one interface

---

# 11. Query Processing in Distributed Databases

Query needs to be:

1. Parsed
2. Optimized
3. Executed across nodes
4. Results merged

Techniques:

* Local processing
* Semi-join
* Query shipping vs data shipping

### Web Context

Node.js servers or MongoDB cluster routers:

* Route query to the correct shard
* Combine responses
* Return data to Angular/jQuery frontend

Large analytics dashboards built using D3.js often depend on distributed query processing for fast data fetch.

---

# 12. Concurrency Control in Distributed Databases

Ensures correct transactions when multiple users access the system.

### Techniques

* Two-phase locking (2PL)
* Timestamp ordering
* Optimistic concurrency control
* Distributed locking

### Web Context

Node.js APIs handle concurrent requests.
MongoDB uses:

* WiredTiger engine
* Document-level locks
* Optimistic concurrency via write concern and versioning

AngularJS and jQuery apps benefit implicitly through consistent API behavior.

---

# 13. Recovery Techniques in Distributed Databases

Ensures the system returns to a consistent state after failure.

### Techniques

* Logging (redo, undo logs)
* Checkpointing
* Two-phase commit recovery
* Replication recovery

### Web Context

MongoDB clusters automatically:

* Elect a new primary
* Replay oplogs
* Restore consistency

Node.js apps reconnect automatically to a healthy node.

