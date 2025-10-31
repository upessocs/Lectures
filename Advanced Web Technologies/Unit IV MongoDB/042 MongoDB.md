
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

## **4. Installation, Setting up MongoDB**

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

# Installation on Ubuntu linux

https://www.mongodb.com/docs/v8.0/tutorial/install-mongodb-on-ubuntu/

```bash
sudo apt update -y
sudo apt-get install gnupg curl -y
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
   --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```
# start mongodb

```bash
sudo systemctl start mongod
sudo systemctl daemon-reload
sudo systemctl status mongod
sudo systemctl enable mongod

# sudo systemctl stop mongod
# sudo systemctl restart mongod

```


Begin using MongoDB.

Start a mongosh session on the same host machine as the mongod. You can run mongosh without any command-line options to connect to a mongod that is running on your localhost with default port 27017.

```bash
mongosh
```


For more information on connecting using mongosh, such as to connect to a mongod instance running on a different host and/or port, see the mongosh documentation. https://www.mongodb.com/docs/v8.0/tutorial/getting-started/#std-label-getting-started


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


---

Optional Read
---
# Installation and testing troubleshooting

I'll guide you through installing and using MongoDB on Ubuntu. Here are the main methods:

## Method 1: Install MongoDB Community Edition (Recommended)

### Step 1: Import MongoDB Public Key and Add Repository
```bash
# Update package list
sudo apt update

# Install prerequisites
sudo apt install -y wget curl gnupg

# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository (for Ubuntu 22.04/Jammy)
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package database again
sudo apt update
```

### Step 2: Install MongoDB
```bash
# Install MongoDB package
sudo apt install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod

# Enable MongoDB to start on boot
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod
```

## Method 2: Using MongoDB Official .deb Package

### Download and Install Directly
```bash
# Download the package (adjust version as needed)
wget https://repo.mongodb.org/apt/ubuntu/dists/jammy/mongodb-org/7.0/multiverse/binary-amd64/mongodb-org-server_7.0.5_amd64.deb

# Install the package
sudo dpkg -i mongodb-org-server_7.0.5_amd64.deb
```

## Basic MongoDB Operations

### Start MongoDB Service
```bash
# Start service
sudo systemctl start mongod

# Stop service
sudo systemctl stop mongod

# Restart service
sudo systemctl restart mongod
```

### Access MongoDB Shell
```bash
# Connect to local MongoDB instance
mongosh

# Or with legacy mongo shell (if installed)
mongo
```

## Basic MongoDB Usage Examples

### In MongoDB Shell:
```javascript
// Show databases
show dbs

// Switch to/create database
use mydatabase

// Create collection and insert document
db.users.insertOne({
  name: "John Doe",
  age: 30,
  email: "john@example.com"
})

// Insert multiple documents
db.users.insertMany([
  { name: "Jane Smith", age: 25, email: "jane@example.com" },
  { name: "Bob Johnson", age: 35, email: "bob@example.com" }
])

// Find all documents
db.users.find()

// Find with filter
db.users.find({ age: { $gt: 25 } })

// Update document
db.users.updateOne(
  { name: "John Doe" },
  { $set: { age: 31 } }
)

// Delete document
db.users.deleteOne({ name: "Bob Johnson" })

// Create index
db.users.createIndex({ email: 1 })
```

## Configuration and Security

### Basic Security Setup
```bash
# Edit MongoDB configuration
sudo nano /etc/mongod.conf
```

Key configuration options in `/etc/mongod.conf`:
```yaml
# Network settings
net:
  port: 27017
  bindIp: 127.0.0.1  # Change to 0.0.0.0 for remote access

# Security
security:
  authorization: enabled
```

### Enable Authentication
```javascript
// In MongoDB shell, switch to admin database
use admin

// Create admin user
db.createUser({
  user: "admin",
  pwd: "your-secure-password",
  roles: ["root"]
})

// Create database user
use mydatabase
db.createUser({
  user: "myuser",
  pwd: "user-password",
  roles: ["readWrite"]
})
```

### Connect with Authentication
```bash
# Connect with authentication
mongosh -u admin -p --authenticationDatabase admin

# Or in shell after connecting
db.auth("username", "password")
```

## Useful Management Commands

### Backup and Restore
```bash
# Create backup
mongodump --uri="mongodb://localhost:27017/mydatabase" --out=/path/to/backup

# Restore backup
mongorestore --uri="mongodb://localhost:27017/mydatabase" /path/to/backup/mydatabase

# Export collection to JSON
mongoexport --uri="mongodb://localhost:27017/mydatabase" --collection=users --out=users.json

# Import from JSON
mongoimport --uri="mongodb://localhost:27017/mydatabase" --collection=users --file=users.json
```

### Monitoring and Logs
```bash
# View MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Check disk usage
sudo du -sh /var/lib/mongodb

# Check service status
sudo systemctl status mongod
```

## Troubleshooting Common Issues

### If MongoDB fails to start:
```bash
# Check logs
sudo journalctl -u mongod

# Fix permission issues
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown mongodb:mongodb /tmp/mongodb-27017.sock

# Repair database (if corrupted)
sudo mongod --repair
```

### Uninstall MongoDB
```bash
# Stop service
sudo systemctl stop mongod

# Remove packages
sudo apt purge mongodb-org*

# Remove data and logs
sudo rm -r /var/log/mongodb
sudo rm -r /var/lib/mongodb
```
