## Experiment 8 

- one using **MongoDB Atlas (Version 8A)** 
- one using **local MongoDB installation (Version 8B)**.


---

# **Experiment 8A — Working with Data (MongoDB Atlas + Node.js)**

## Part 1: Connect Node.js with MongoDB Atlas

### **Step 1: Create a MongoDB Atlas Account**

1. Visit [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Click **“Sign Up”** (or **“Start Free”**) and create an account using Google / email.
3. After login, create a **free cluster** using:

   * **Cloud Provider:** AWS / Azure / GCP (any)
   * **Region:** Closest to your location
   * **Tier:** Free (M0)

### **Step 2: Configure Database Access**

1. In the left menu, go to **“Database Access”** → **“Add New Database User”**.
2. Create a user:

   * Username: `nodeuser`
   * Password: `password123` (or any strong password)
   * Select **“Read and write to any database”**

### **Step 3: Configure Network Access**

1. Go to **“Network Access”** → **“Add IP Address”**.
2. Choose **“Allow access from anywhere” (0.0.0.0/0)** for testing.
   *(Later, restrict to your server’s IP for security.)*

### **Step 4: Get the Connection String**

1. Go to **“Database”** → **“Connect”** → **“Connect your application”**.
2. Copy the connection string (it will look like below):

```
mongodb+srv://nodeuser:<password>@cluster0.abcde.mongodb.net/school?retryWrites=true&w=majority
```

3. Replace `<password>` with your actual password.

### **Step 5: Install Dependencies**

```bash
npm install express mongoose
```

### **Step 6: Code — `db-connect.js`**

```js
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://nodeuser:password123@cluster0.abcde.mongodb.net/school?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('Atlas connection failed:', err));
```

*Rest of the experiment (Parts 2 – 4) remains exactly the same as in your base code.*

---

# **Experiment 8B — Working with Data (Local MongoDB + Node.js)**

## Part 1: Install MongoDB on Local System

### **A. Windows Installation**

1. Download MongoDB Community Server from
   [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community).
2. Run the installer and:

   * Select **Complete Setup**
   * Tick **Install MongoDB as a Service**
3. Once installed, open **Command Prompt** and start `mongosh`:

   ```bash
   mongosh
   ```
4. Create and verify a database:

   ```bash
   use school
   db.createCollection("students")
   show dbs
   ```

### **B. Ubuntu Installation**

```bash
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
mongosh
```

Then verify:

```bash
use school
db.createCollection("students")
show dbs
```

### **Step 2: Node.js Setup**

Install project dependencies:

```bash
npm install express mongoose
```

### **Step 3: Code — `db-connect.js`**

```js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/school', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to Local MongoDB'))
.catch(err => console.error('Local connection failed:', err));
```

### **Basic `mongosh` Commands for Testing**

| Command                                                              | Description                 |
| -------------------------------------------------------------------- | --------------------------- |
| `show dbs`                                                           | Lists all databases         |
| `use school`                                                         | Switch to database `school` |
| `show collections`                                                   | Lists all collections       |
| `db.students.find()`                                                 | View all documents          |
| `db.students.insertOne({ name: "John", age: 22, grade: "A" })`       | Insert a document           |
| `db.students.updateOne({ name: "John" }, { $set: { grade: "A+" } })` | Update a document           |
| `db.students.deleteOne({ name: "John" })`                            | Delete a document           |

*All remaining code for Student and Shopping Center app (Parts 2–4) remains same as the original.*

---

## **Final Directory Structure (Common for Both Versions)**

```
lab/
│
├── Experiment-8A/
│   ├── db-connect.js
│   ├── student-model.js
│   ├── add-student.js
│   ├── search-student.js
│   ├── item-model.js
│   └── shopping-app.js
│
├── Experiment-8B/
│   ├── db-connect.js
│   ├── student-model.js
│   ├── add-student.js
│   ├── search-student.js
│   ├── item-model.js
│   └── shopping-app.js
│
├── package.json
└── README.md
```

---

