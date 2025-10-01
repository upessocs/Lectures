# Class Experiment: 
Handling Form Data and Saving Files with Node.js + Express

## Goal

1. Serve an **HTML form** for user input.
2. Accept **form data** and return it as **JSON**.
3. Save that data into a **text file** inside a directory named after the username.

---

## 1. Packages and Their Role

* **express**
  Web framework for Node.js. Makes it easy to define routes and handle requests/responses.

* **body-parser**
  Middleware that parses request bodies.

  * `bodyParser.urlencoded()` parses HTML form submissions (application/x-www-form-urlencoded).
  * `bodyParser.json()` parses JSON payloads (application/json).

* **fs (File System module)**
  Built-in Node.js module for reading/writing files.

* **path**
  Built-in Node.js module for handling file paths safely across operating systems.

---

## 2. Why Each Route is Required?

1. **`GET /`** → Serves the HTML form.

   * Without it, users wouldn’t have a way to submit data.

2. **`POST /submit`** → Accepts form submission and returns JSON.

   * Converts form fields into structured JSON.
   * Useful for APIs or debugging.

3. **`POST /save`** → Accepts JSON directly and saves it to a file.

   * Demonstrates persistence (saving user data on the server).
   * Organizes files by username to simulate user-specific storage.

---

## 3. Incremental Development

We’ll build this route by route.

---

### Step 1: Basic Server + HTML Form

```js
// server-step1.js
const express = require('express');
const app = express();
const PORT = 3000;

// Route 1: Show HTML form
app.get('/', (req, res) => {
  res.send(`
    <h2>User Form</h2>
    <form action="/submit" method="post">
      <label>Username:</label>
      <input type="text" name="username" required /><br/><br/>
      
      <label>Email:</label>
      <input type="email" name="email" required /><br/><br/>
      
      <label>Message:</label><br/>
      <textarea name="message"></textarea><br/><br/>
      
      <button type="submit">Submit</button>
    </form>
  `);
});

app.listen(PORT, () => console.log(`Step 1 running on http://localhost:${PORT}`));
```

* Run: `node server-step1.js`
* Visit `http://localhost:3000/` → See form.

---

### Step 2: Parse Form and Return JSON

Now add `body-parser` to process form data.

```bash
npm install express body-parser
```

```js
// server-step2.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route 1: Show form
app.get('/', (req, res) => {
  res.send(`
    <h2>User Form</h2>
    <form action="/submit" method="post">
      <label>Username:</label>
      <input type="text" name="username" required /><br/><br/>
      
      <label>Email:</label>
      <input type="email" name="email" required /><br/><br/>
      
      <label>Message:</label><br/>
      <textarea name="message"></textarea><br/><br/>
      
      <button type="submit">Submit</button>
    </form>
  `);
});

// Route 2: Handle form and return JSON
app.post('/submit', (req, res) => {
  const userData = {
    username: req.body.username,
    email: req.body.email,
    message: req.body.message
  };
  res.json({ success: true, data: userData });
});

app.listen(PORT, () => console.log(`Step 2 running on http://localhost:${PORT}`));
```

* Fill the form → Submit → You’ll see JSON output in browser.

---

### Step 3: Save JSON into File

Now we use **fs** and **path**.

```js
// server-step3.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route 1: Show form
app.get('/', (req, res) => {
  res.send(`
    <h2>User Form</h2>
    <form action="/save" method="post">
      <label>Username:</label>
      <input type="text" name="username" required /><br/><br/>
      
      <label>Email:</label>
      <input type="email" name="email" required /><br/><br/>
      
      <label>Message:</label><br/>
      <textarea name="message"></textarea><br/><br/>
      
      <button type="submit">Save</button>
    </form>
  `);
});

// Route 3: Save JSON into text file by username
app.post('/save', (req, res) => {
  const { username, email, message } = req.body;
  if (!username) return res.status(400).send('Username is required!');

  // Create user-specific folder
  const userDir = path.join(__dirname, 'users', username);
  if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

  // Save data
  const filePath = path.join(userDir, 'data.txt');
  const userData = { username, email, message, savedAt: new Date().toISOString() };
  fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));

  res.send(`Data saved to ${filePath}`);
});

app.listen(PORT, () => console.log(`Step 3 running on http://localhost:${PORT}`));
```

* Submit the form → A folder `/users/<username>/data.txt` will be created.

---

## 4. Final Combined Code

```js
// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route 1: Show HTML form
app.get('/', (req, res) => {
  res.send(`
    <h2>User Form</h2>
    <form action="/submit" method="post">
      <label>Username:</label>
      <input type="text" name="username" required /><br/><br/>
      
      <label>Email:</label>
      <input type="email" name="email" required /><br/><br/>
      
      <label>Message:</label><br/>
      <textarea name="message"></textarea><br/><br/>
      
      <button type="submit">Submit</button>
    </form>
  `);
});

// Route 2: Return JSON from form
app.post('/submit', (req, res) => {
  const userData = {
    username: req.body.username,
    email: req.body.email,
    message: req.body.message
  };
  res.json({ success: true, data: userData });
});

// Route 3: Save JSON data into text file
app.post('/save', (req, res) => {
  const { username, email, message } = req.body;
  if (!username) return res.status(400).json({ error: 'Username is required' });

  const userDir = path.join(__dirname, 'users', username);
  if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

  const filePath = path.join(userDir, 'data.txt');
  const userData = { username, email, message, savedAt: new Date().toISOString() };
  fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));

  res.json({ success: true, message: `Data saved successfully in ${filePath}` });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
```


