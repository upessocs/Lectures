# **Assignment 2B: Web App for Student Marks Entry & Performance Visualization**

## **Objective**

Design and implement a full-stack web application where **teachers (after login)** can enter marks for students (identified by their **SAP ID**) and later view **student performance statistics** through **D3.js-based charts**.


the code should be in your git repository.
---

# **1. Problem Statement**

Build a secure web application that allows multiple teachers to:

1. Log in using their credentials.
2. Add/update marks for students (each student uniquely identified by their **SAPID**).
3. View class performance statistics based on mark ranges:

   * 0%
   * 45%
   * 65%
   * 75%
   * 85%
   * 100%
4. Visualize these statistics in:

   * **Pie Chart**
   * **Bar Chart**
5. Store user accounts and student marks in **MongoDB**.
6. Use **Node.js + Express** as backend API with proper session handling.

---

# **2. Functional Requirements**

### **2.1 Authentication**

* Teacher must log in using username + password.
* Use:

  * `express-session` for session-based login
  * `cookie-parser` for storing session cookies
* After login, teacher is redirected to the dashboard.

### **2.2 Student Marks Entry**

* Teacher can enter:

  * SAP ID
  * Student Name
  * Marks (0–100)
* Teacher can edit previously entered marks.

### **2.3 Performance Statistics**

The system must:

* Categorize students into score ranges:

  ```
  0–45%
  46–65%
  66–75%
  76–85%
  86–100%
  ```
* Count number of students in each category.
* Expose an API endpoint:

  ```
  GET /api/stats
  ```

  returning these counts.

### **2.4 D3.js Data Visualization**

* Display:

  * **Pie Chart** for percentage distribution of ranges
  * **Bar Chart** for numerical count per range
* Charts must update dynamically when new marks are added.

### **2.5 Tech Stack Requirements**

Use the following mandatory technologies:

* **Backend:** Node.js, Express, Express-session, Cookie-parser
* **Database:** MongoDB + Mongoose
* **Frontend:** HTML/CSS/JS + D3.js (No React/Angular)
* **API Format:** JSON
* **Session handling:** Must prevent unauthorized access.

---

# **3. Technical Requirements**

### **3.1 Backend**

* Create models using `mongoose`:

  * **User Model** (Teacher)
  * **Student Model** (SAPID, Name, Marks)

* Implement backend routes:

  ```
  POST /login
  GET  /logout
  POST /students           (add/update marks)
  GET  /students           (list students)
  GET  /api/stats          (return JSON stats)
  ```

### **3.2 Frontend**

* Login page
* Marks entry page
* Stats dashboard:

  * Fetch stats using AJAX
  * Render pie + bar charts using **D3.js**

---

# **4. Steps to Implement**

### **Step 1: Project Initialization**

* Initialize Node.js project
* Install dependencies:

  ```
  npm install express mongoose cookie-parser express-session d3
  ```

### **Step 2: Create Database Models**

* User model: username, password (hashed)
* Student model: SAPID, name, marks

### **Step 3: Implement Authentication**

* Setup `express-session` for server-side sessions
* Use `cookie-parser` to attach cookies
* Middleware to protect routes:

  ```js
  function checkAuth(req, res, next) {
      if (req.session.user) next();
      else res.redirect('/login');
  }
  ```

### **Step 4: Student Marks CRUD**

* Create routes to add and update marks
* Validate SAPID uniqueness
* Store marks in MongoDB

### **Step 5: Generate Performance Stats**

* Query MongoDB to calculate counts for each range
* Example:

  ```js
  { marks: { $lte: 45 } }
  { marks: { $gt: 45, $lte: 65 } }
  ...
  ```

### **Step 6: Build Stats API endpoint**

* `/api/stats` returns:

  ```json
  {
    "range_0_45": 12,
    "range_46_65": 30,
    "range_66_75": 25,
    "range_76_85": 18,
    "range_86_100": 5
  }
  ```

### **Step 7: Create Dashboard + D3.js Charts**

* Use AJAX to fetch `/api/stats`
* Build:

  * D3 pie chart
  * D3 bar chart

### **Step 8: Final Testing**

* Test multiple teachers
* Test mark updates
* Test session expiration
* Validate chart correctness

---

# **5. Hints for Students**

### **Backend Hints**

* Use `bcrypt` to hash passwords.
* Use `req.session.user = { id: user._id }` after successful login.
* Use MongoDB’s `$gte`, `$lte` to compute ranges.
* Create a separate utility function to compute statistics.

### **Frontend Hints**

* Use `fetch("/api/stats")` for data loading.
* Structure chart data as:

  ```js
  [
    { label: "0–45%", value: count },
    { label: "46–65%", value: count },
    ...
  ]
  ```

### **D3.js Hints**

* For pie chart:

  * Use `d3.pie()` and `d3.arc()`
* For bar chart:

  * Use `d3.scaleBand()` and `d3.scaleLinear()`
* Ensure charts re-render when data updates.

### **Session + Security Hints**

* Add a middleware to restrict dashboard access.
* Set session expiry time.
* Validate SAPID before entry.

---

# **6. Expected Deliverables**

1. Source code (Node.js + frontend)
2. Screenshots of:

   * Login
   * Marks entry
   * Pie chart
   * Bar chart
3. ER diagram / schema diagram
4. 2–3 pages explaining the workflow

