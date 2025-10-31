# MongoDB Shell (mongosh) Cheatsheet Tutorial

## Quick Start

### Connect to MongoDB
```bash
# Connect to local MongoDB
mongosh

# Connect to specific database
mongosh localhost:27017/mydb

# Connect with authentication
mongosh -u username -p password --authenticationDatabase admin

# Connect to MongoDB Atlas
mongosh "mongodb+srv://username:password@cluster.mongodb.net/database"
```
---
## Database Management

### 1. Show & Select Databases
```javascript
// Show all databases
show dbs

// Show current database
db

// Switch to database (creates if doesn't exist)
use school
use myapp
use testdb
```

### 2. Create Database
```javascript
// Databases are created when you first store data
use newdatabase
db.createCollection("users")  // Now database exists
db.users.insertOne({name: "First User"})
```

### 3. Drop Database
```javascript
// Switch to database first
use olddatabase

// Drop current database
db.dropDatabase()

// Confirm deletion
show dbs
```
---
## Collection Management

### 1. Show & Create Collections
```javascript
// Show all collections
show collections
// OR
db.getCollectionNames()

// Create collection explicitly
db.createCollection("students")
db.createCollection("teachers", { 
    capped: true, 
    size: 100000,  // 100KB max size
    max: 1000      // max 1000 documents
})
```

### 2. Drop Collection
```javascript
// Drop a collection
db.students.drop()

// Verify collection is gone
show collections
```
---
## CRUD Operations - CREATE

### 1. Insert Single Document
```javascript
// Insert one document
db.students.insertOne({
    name: "John Doe",
    age: 20,
    grade: "A",
    email: "john@school.com",
    enrolled: true
})
```

### 2. Insert Multiple Documents
```javascript
// Insert multiple documents
db.students.insertMany([
    {
        name: "Jane Smith",
        age: 22,
        grade: "B+",
        email: "jane@school.com"
    },
    {
        name: "Bob Johnson",
        age: 19, 
        grade: "A-",
        email: "bob@school.com"
    },
    {
        name: "Alice Brown",
        age: 21,
        grade: "B",
        email: "alice@school.com"
    }
])
```

### 3. Insert with Custom ID
```javascript
// Insert with custom _id
db.students.insertOne({
    _id: "STU001",
    name: "Custom Student",
    age: 23
})
```
---
## CRUD Operations - READ

### 1. Basic Find Operations
```javascript
// Find all documents
db.students.find()

// Pretty print results
db.students.find().pretty()

// Find first document only
db.students.findOne()

// Count documents
db.students.countDocuments()
```

### 2. Filtering Documents
```javascript
// Find with equality filter
db.students.find({ grade: "A" })

// Find with multiple conditions
db.students.find({ grade: "A", age: 20 })

// Find with comparison operators
db.students.find({ age: { $gt: 20 } })      // greater than
db.students.find({ age: { $gte: 18 } })     // greater than or equal
db.students.find({ age: { $lt: 25 } })      // less than
db.students.find({ age: { $lte: 22 } })     // less than or equal
db.students.find({ age: { $ne: 20 } })      // not equal

// Find with IN operator
db.students.find({ grade: { $in: ["A", "A-", "B+"] } })
```

### 3. Projection (Select Specific Fields)
```javascript
// Include specific fields only
db.students.find(
    { grade: "A" }, 
    { name: 1, email: 1, _id: 0 }
)

// Exclude specific fields
db.students.find(
    {}, 
    { _id: 0, enrolled: 0 }
)
```

### 4. Sorting and Limiting
```javascript
// Sort results
db.students.find().sort({ age: 1 })      // ascending
db.students.find().sort({ age: -1 })     // descending

// Limit results
db.students.find().limit(5)

// Skip documents
db.students.find().skip(10)

// Combine sort, skip, limit
db.students.find()
    .sort({ name: 1 })
    .skip(5)
    .limit(10)
```
---
## CRUD Operations - UPDATE

### 1. Update Single Document
```javascript
// Update specific fields
db.students.updateOne(
    { name: "John Doe" },
    { 
        $set: { 
            grade: "A+",
            updatedAt: new Date()
        }
    }
)

// Increment field value
db.students.updateOne(
    { name: "Jane Smith" },
    { $inc: { age: 1 } }
)

// Add to array field
db.students.updateOne(
    { name: "John Doe" },
    { $push: { subjects: "Mathematics" } }
)

// Remove from array
db.students.updateOne(
    { name: "John Doe" },
    { $pull: { subjects: "Art" } }
)
```

### 2. Update Multiple Documents
```javascript
// Update all matching documents
db.students.updateMany(
    { age: { $lt: 20 } },
    { 
        $set: { 
            status: "Minor",
            updatedAt: new Date()
        }
    }
)
```

### 3. Replace Document
```javascript
// Replace entire document
db.students.replaceOne(
    { name: "Bob Johnson" },
    {
        name: "Bob Johnson",
        age: 20,
        grade: "A",
        email: "bob.new@school.com",
        status: "Updated"
    }
)
```
---
## CRUD Operations - DELETE

### 1. Delete Documents
```javascript
// Delete single document
db.students.deleteOne({ name: "John Doe" })

// Delete multiple documents
db.students.deleteMany({ grade: "F" })

// Delete all documents in collection
db.students.deleteMany({})
```

## Advanced Queries

### 1. Logical Operators
```javascript
// AND operator (implicit)
db.students.find({ grade: "A", age: { $gt: 20 } })

// OR operator
db.students.find({
    $or: [
        { grade: "A" },
        { grade: "A-" }
    ]
})

// AND + OR combination
db.students.find({
    $and: [
        { age: { $gte: 18 } },
        { 
            $or: [
                { grade: "A" },
                { grade: "B+" }
            ]
        }
    ]
})
```

### 2. Array Operations
```javascript
// Find if array contains value
db.students.find({ subjects: "Math" })

// Find if array contains all values
db.students.find({ subjects: { $all: ["Math", "Science"] } })

// Find by array size
db.students.find({ subjects: { $size: 3 } })

// Find by array element position
db.students.find({ "subjects.0": "Math" })  // first element is Math
```

### 3. Text Search
```javascript
// Create text index first
db.students.createIndex({ name: "text" })

// Text search
db.students.find({ $text: { $search: "john" } })
```
---
## Aggregation Framework

### 1. Basic Aggregation
```javascript
// Group by grade and count
db.students.aggregate([
    {
        $group: {
            _id: "$grade",
            count: { $sum: 1 },
            averageAge: { $avg: "$age" }
        }
    }
])

// Filter and group
db.students.aggregate([
    { $match: { age: { $gte: 18 } } },      // filter
    { $group: { 
        _id: "$grade", 
        totalStudents: { $sum: 1 },
        ages: { $push: "$age" }
    }},                                     // group
    { $sort: { totalStudents: -1 } }        // sort
])
```
---
## Index Management

### 1. Create Indexes
```javascript
// Create single field index
db.students.createIndex({ email: 1 })

// Create unique index
db.students.createIndex({ email: 1 }, { unique: true })

// Create compound index
db.students.createIndex({ name: 1, age: -1 })

// Create text index
db.students.createIndex({ name: "text" })
```

### 2. Manage Indexes
```javascript
// List all indexes
db.students.getIndexes()

// Drop index
db.students.dropIndex("email_1")

// Drop all indexes (except _id)
db.students.dropIndexes()
```
---
## Utility Commands

### 1. Information Commands
```javascript
// Get collection statistics
db.students.stats()

// Get database statistics
db.stats()

// Explain query execution
db.students.find({ grade: "A" }).explain("executionStats")

// Get distinct values
db.students.distinct("grade")
```

### 2. Bulk Operations
```javascript
// Perform multiple operations
const bulkOps = [
    { insertOne: { document: { name: "New Student", age: 20 } } },
    { updateOne: { 
        filter: { name: "Jane Smith" }, 
        update: { $set: { grade: "A+" } } 
    }},
    { deleteOne: { filter: { name: "Bob Johnson" } } }
];

db.students.bulkWrite(bulkOps);
```
---
## User Management

### 1. Create Users
```javascript
// Switch to admin database
use admin

// Create admin user
db.createUser({
  user: "admin",
  pwd: "password123",
  roles: ["root"]
})

// Create database user
use school
db.createUser({
  user: "schooluser",
  pwd: "user123",
  roles: ["readWrite"]
})
```

### 2. Manage Users
```javascript
// Show users
db.getUsers()

// Update user roles
db.updateUser("schooluser", {
  roles: ["readWrite", "dbAdmin"]
})

// Delete user
db.dropUser("schooluser")
```
---
## Backup and Restore Commands

### 1. Export Data
```bash
# Export collection to JSON
mongoexport --uri="mongodb://localhost:27017/school" --collection=students --out=students.json

# Export with query
mongoexport --uri="mongodb://localhost:27017/school" --collection=students --query='{"grade":"A"}' --out=gradeA_students.json
```

### 2. Import Data
```bash
# Import JSON data
mongoimport --uri="mongodb://localhost:27017/school" --collection=students --file=students.json

# Import with drop existing collection
mongoimport --uri="mongodb://localhost:27017/school" --collection=students --file=students.json --drop
```

### 3. Backup Database
```bash
# Backup entire database
mongodump --uri="mongodb://localhost:27017/school" --out=./backup

# Restore database
mongorestore --uri="mongodb://localhost:27017/school" ./backup/school
```
---
## Quick Reference Examples

### Complete Workflow Example
```javascript
// 1. Switch to database
use university

// 2. Create collection and insert data
db.students.insertMany([
    { name: "John", age: 20, grade: "A", subjects: ["Math", "Science"] },
    { name: "Sarah", age: 22, grade: "B+", subjects: ["History", "Art"] }
])

// 3. Query data
db.students.find({ age: { $gt: 20 } })

// 4. Update data
db.students.updateOne(
    { name: "John" }, 
    { $set: { grade: "A+" } }
)

// 5. Delete data
db.students.deleteOne({ name: "Sarah" })

// 6. Clean up
db.students.drop()
```

### Common Patterns
```javascript
// Pagination
db.students.find()
    .sort({ _id: -1 })
    .skip(0)
    .limit(10)

// Search with multiple conditions
db.students.find({
    $and: [
        { age: { $gte: 18, $lte: 25 } },
        { grade: { $in: ["A", "A-", "B+"] } }
    ]
})

// Update with current timestamp
db.students.updateOne(
    { name: "John" },
    { 
        $set: { 
            status: "active",
            lastModified: new Date() 
        } 
    }
)

// Find documents created today
db.students.find({
    createdAt: {
        $gte: new Date(new Date().setHours(0,0,0,0)),
        $lt: new Date(new Date().setHours(23,59,59,999))
    }
})
```
---
## Troubleshooting Common Issues

### Connection Issues
```bash
# Check if MongoDB is running
sudo systemctl status mongod  # Linux
net start MongoDB            # Windows

# Check connection
mongosh --eval "db.adminCommand('ping')"

# View MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log  # Linux
```

### Performance Issues
```javascript
// Check query performance
db.students.find({ grade: "A" }).explain("executionStats")

// Create indexes for slow queries
db.students.createIndex({ grade: 1, age: 1 })

// Check current operations
db.currentOp()
```
