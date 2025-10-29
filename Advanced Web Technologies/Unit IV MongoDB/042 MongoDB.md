
## **1. Introduction to MongoDB**

### **Overview**

**MongoDB** is an **open-source, NoSQL, document-oriented database** designed to store large amounts of unstructured or semi-structured data.
It uses a **flexible schema model**, where data is stored in **collections** as **documents** (in JSON-like format).

### **Key Features**

* **Document-oriented storage:** Uses JSON-like BSON documents.
* **Schema-less:** No need to predefine table structures.
* **High performance:** Fast reads and writes.
* **Scalability:** Supports horizontal scaling (sharding).
* **Indexing and Aggregation:** Built-in support for fast searches and analytics.
* **Replication:** Provides data redundancy and fault tolerance.

---

## **2. Document-Oriented Database Concept**

Instead of rows and tables (like SQL), MongoDB stores data in:

* **Collections** → like tables.
* **Documents** → like rows but in JSON format.

### **Example Document**

```json
{
  "name": "Alice",
  "age": 25,
  "skills": ["JavaScript", "Node.js"],
  "address": { "city": "Dehradun", "country": "India" }
}
```

### **Advantages**

* Each document can have a **different structure**.
* Easier to model real-world data.
* Reduces the need for joins (nested documents handle relationships).

---

## **3. Difference between SQL and NoSQL Databases**

| Feature            | SQL (MySQL, PostgreSQL)     | NoSQL (MongoDB)                                                 |
| ------------------ | --------------------------- | --------------------------------------------------------------- |
| **Data Model**     | Tables, Rows                | Collections, Documents                                          |
| **Schema**         | Fixed schema                | Dynamic / flexible schema                                       |
| **Joins**          | Supported                   | Usually avoided                                                 |
| **Scalability**    | Vertical                    | Horizontal                                                      |
| **Query Language** | SQL                         | MongoDB Query Language (MQL)                                    |
| **Transactions**   | Strong ACID                 | Eventual consistency (though ACID supported in latest versions) |
| **Best For**       | Structured, relational data | Unstructured, evolving data                                     |

---

## **4. Setting up MongoDB**

### **Local Installation**

1. Download MongoDB from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Install and start the MongoDB service:

   ```bash
   mongod
   ```
3. Open Mongo shell:

   ```bash
   mongosh
   ```

### **Cloud Setup (MongoDB Atlas)**

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster.
3. Whitelist your IP and create a database user.
4. Get your connection string:

   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/myDatabase
   ```

---

## **5. Connecting MongoDB to Node.js**

Install Mongoose (ODM library for MongoDB):

```bash
npm install mongoose
```

### **Connection Example**

```javascript
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/schoolDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('Connection error:', err));
```

### **Using MongoDB Atlas (Cloud)**

```javascript
mongoose.connect('mongodb+srv://user:password@cluster0.mongodb.net/schoolDB');
```

---

## **6. Authentication and Security**

### **Creating Users and Roles (Mongo Shell Example)**

```js
use admin;
db.createUser({
  user: "adminUser",
  pwd: "securePassword123",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
});
```

Then connect using authentication:

```bash
mongosh -u adminUser -p securePassword123 --authenticationDatabase admin
```

### **Database Authentication Methods**

* **SCRAM (default):** Secure challenge-response mechanism.
* **x.509 certificates:** For enterprise security.
* **LDAP/Kerberos:** For organization-based authentication.

---

## **7. Model Creation**

MongoDB itself is schema-less, but Mongoose adds a **schema layer** for validation and structure.

### **Schema and Model Example**

```javascript
const mongoose = require('mongoose');

// Define schema
const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  course: String,
  marks: Number
});

// Create model
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
```

* **Schema:** Defines structure and rules for documents.
* **Model:** Provides an interface to interact with the collection.

---

## **8. Managing Database Connections**

### **Safe Connection Handling**

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/testDB');
    console.log('Database connected');
  } catch (error) {
    console.error('Connection error:', error);
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  console.log('Database disconnected');
};

connectDB();

// On exit
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});
```

### **Connection Pooling**

Mongoose automatically manages a pool of connections, so multiple requests can share the same connection efficiently.

---

## **9. Basic CRUD Operations**

### **(1) Create – Insert a Document**

```javascript
const Student = require('./studentModel');

const newStudent = new Student({
  name: "Alice",
  age: 22,
  course: "B.Tech",
  marks: 88
});

await newStudent.save();
console.log('Student added!');
```

---

### **(2) Read – Find Documents**

```javascript
// Find all
const students = await Student.find();
console.log(students);

// Find with condition
const result = await Student.findOne({ name: "Alice" });
console.log(result);
```

---

### **(3) Update – Modify Existing Document**

```javascript
await Student.updateOne({ name: "Alice" }, { $set: { marks: 92 } });
console.log('Record updated');
```

---

### **(4) Delete – Remove Document**

```javascript
await Student.deleteOne({ name: "Alice" });
console.log('Record deleted');
```

---

## **10. Query Operators and Filters**

### **Examples**

```javascript
// Greater than operator
const topStudents = await Student.find({ marks: { $gt: 80 } });

// AND condition
const csStudents = await Student.find({ course: "CS", marks: { $gte: 75 } });

// OR condition
const special = await Student.find({ $or: [{ course: "IT" }, { marks: { $lt: 50 } }] });
```

---

## **11. Sorting, Limiting, and Projecting Results**

### **Sorting**

```javascript
const sorted = await Student.find().sort({ marks: -1 }); // Descending
```

### **Limiting**

```javascript
const top5 = await Student.find().sort({ marks: -1 }).limit(5);
```

### **Projection (select specific fields)**

```javascript
const namesOnly = await Student.find({}, { name: 1, course: 1, _id: 0 });
```

---

## **12. Summary**

| Concept        | Description                  | Example                                              |
| -------------- | ---------------------------- | ---------------------------------------------------- |
| **Database**   | Container of collections     | `schoolDB`                                           |
| **Collection** | Group of documents           | `students`                                           |
| **Document**   | JSON-like record             | `{name:"Alice", age:22}`                             |
| **Schema**     | Structure definition         | via `mongoose.Schema()`                              |
| **Model**      | Interface for CRUD ops       | via `mongoose.model()`                               |
| **CRUD**       | Create, Read, Update, Delete | `.save()`, `.find()`, `.updateOne()`, `.deleteOne()` |

---

### **In short**

* **MongoDB** is flexible, JSON-based, and scalable.
* **Mongoose** provides schema validation and simplifies CRUD operations.
* Together, they form the backbone of most **Node.js-based web applications** today (MEAN/MERN stacks).


