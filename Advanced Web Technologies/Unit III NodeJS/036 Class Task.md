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

> check whether app is working as expected and list your suggestions to improve app
---
---






---
> Try to focus on understanding logic

# Solution: 

> you already have data being received at `/submit` and JSON being returned. Now the challenge is:

**How do we take that data and also send it to `/save` so it gets stored in a file?**

There are **two approaches**:

---

## 1. Client-Side Forwarding (Browser/Client Side)

The browser submits the form to `/submit`. Then, from the **client-side JavaScript**, you can make another request to `/save` with the same data.

### Option A: Redirect with `fetch`

```html
<form id="userForm">
  <label>Username:</label>
  <input type="text" name="username" required /><br/>
  <label>Email:</label>
  <input type="email" name="email" required /><br/>
  <label>Message:</label>
  <textarea name="message"></textarea><br/>
  <button type="submit">Submit</button>
</form>

<script>
document.getElementById('userForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // prevent default form submit

  // Collect form data
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  // 1. Send to /submit
  const res = await fetch('/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  console.log("Received from /submit:", json);

  // 2. Forward to /save
  const saveRes = await fetch('/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const saveJson = await saveRes.json();
  console.log("Saved:", saveJson);
});
</script>
```

**Flow:**

* User submits form.
* Data first goes to `/submit`.
* Then, JS sends another request to `/save`.
* In practice, you can show a confirmation message when `/save` responds.

---

### Option B: Directly Submit to `/save`

If you don’t care about the `/submit` response, you can just change the form action:

```html
<form action="/save" method="post">
  <!-- same fields -->
</form>
```

This bypasses `/submit` and directly stores data.

---

## 2. Server-Side Forwarding (Inside Express)

Instead of having the **client** make two requests, you can forward data from `/submit` to `/save` **inside your Express server**.

Yes — absolutely. In fact, you can do this in Node/Express almost the same way you would in a frontend app when you call an API from another API.

There are **two main ways** to send data from the `/submit` route to the `/save` route:

---

## 1. Call the `/save` route internally (server-side function call)

Instead of literally making an HTTP request to `/save`, you can just **reuse the save logic** from inside `/submit`. This is the most efficient way.

```js
const fs = require('fs');
const path = require('path');

// helper function
function saveUserData({ username, email, message }) {
  const userDir = path.join(__dirname, 'users', username);
  if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

  const filePath = path.join(userDir, 'data.txt');
  const userData = { username, email, message, savedAt: new Date().toISOString() };

  fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));
  return filePath;
}

app.post('/submit', (req, res) => {
  const { username, email, message } = req.body;
  const filePath = saveUserData({ username, email, message });

  res.json({
    success: true,
    message: "Data submitted and saved",
    file: filePath
  });
});
```

Here:

* The `/submit` route **handles the form** and internally calls `saveUserData()`.
* No extra HTTP request to `/save` is needed.
* Faster and cleaner.

---

## 2. Call `/save` as an HTTP request from `/submit`

If you specifically want `/submit` to **make an API call to `/save`** (like frontend JS calling another API), you can use a request library such as **axios** or **node-fetch**.

```bash
npm install axios
```

```js
const axios = require('axios');

app.post('/submit', async (req, res) => {
  const userData = {
    username: req.body.username,
    email: req.body.email,
    message: req.body.message
  };

  try {
    // Call /save route internally via HTTP
    const response = await axios.post(`http://localhost:3000/save`, userData);

    res.json({
      success: true,
      message: "Data received and forwarded to /save",
      saveResponse: response.data
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to forward data to /save" });
  }
});
```

Here:

* `/submit` receives the data.
* Then **it posts the same data to `/save`** using `axios`.
* Finally, `/submit` returns a combined response to the client.

---

## A: Which method is better on server side data passing?

* **Method 1 (function call)** → Recommended. Cleaner, no extra HTTP overhead, everything stays inside your app.
* **Method 2 (axios/fetch)** → Only needed if you deliberately want to test how one API calls another via HTTP (e.g., in microservices, when APIs run on different servers).



## B: Which to Choose clientside or serverside?

* **Client-side forwarding** → If you want two separate APIs (`/submit` for response, `/save` for persistence) and let the browser decide.
* **Server-side forwarding** → Cleaner if every `/submit` should always be saved. You centralize saving logic and don’t depend on client scripts.



