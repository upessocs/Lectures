# Lab Project with MCQ test

Build a **simple Node.js + Express project** that teaches you:

* User registration with password hashing
* Login with session management using **JWT**
* Storage in CSV (no database)
* Cookie-based authentication

We’ll go **step by step**, incrementally, with explanations and finally give a full project structure.


---

## **Step 0: Initialize Project**

```bash
mkdir nodejs-auth-csv
cd nodejs-auth-csv
npm init -y
npm install express bcrypt jsonwebtoken cookie-parser csv-parser csv-writer body-parser
```

**Explanation of packages:**

* `express` → Web framework
* `bcrypt` → For hashing passwords
* `jsonwebtoken` → JWT creation and verification
* `cookie-parser` → Parse cookies
* `csv-parser` → Read CSV files
* `csv-writer` → Write CSV files
* `body-parser` → Parse JSON form requests

---

## **Step 1: Project Structure**

```
nodejs-auth-csv/
├── app.js
├── users.csv
├── package.json
├── utils/
│   ├── csvUtils.js
│   └── auth.js
└── routes/
    └── auth.js
```

**Explanation:**

* `app.js` → Main entry point
* `users.csv` → Store users: id,email,passwordHash
* `routes/auth.js` → Handles registration/login routes
* `utils/csvUtils.js` → Functions to read/write CSV
* `utils/auth.js` → JWT creation/verification

---

## **Step 2: CSV Utilities**

`utils/csvUtils.js`

```javascript
const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvFilePath = './users.csv';

const readUsers = () => {
    return new Promise((resolve, reject) => {
        const users = [];
        if (!fs.existsSync(csvFilePath)) return resolve(users);

        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (data) => users.push(data))
            .on('end', () => resolve(users))
            .on('error', (err) => reject(err));
    });
};

const addUser = async (user) => {
    const csvWriter = createCsvWriter({
        path: csvFilePath,
        header: [
            {id: 'id', title: 'id'},
            {id: 'email', title: 'email'},
            {id: 'password', title: 'password'}
        ],
        append: fs.existsSync(csvFilePath)
    });
    await csvWriter.writeRecords([user]);
};

module.exports = { readUsers, addUser };
```

**Explanation:**

* `readUsers()` → Reads CSV into JS array
* `addUser(user)` → Appends a new user

---

## **Step 3: JWT Helper**

`utils/auth.js`

```javascript
const jwt = require('jsonwebtoken');
const SECRET = 'mysecretkey'; // Normally use env variable

const generateToken = (user) => {
    // Payload: minimal info
    const payload = { id: user.id, email: user.email };
    return jwt.sign(payload, SECRET, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET);
    } catch (err) {
        return null;
    }
};

module.exports = { generateToken, verifyToken };
```

**Explanation:**

* JWT contains minimal info (`id` & `email`)
* Signed with secret key
* Expires in 1 hour

---

## **Step 4: Auth Routes**

`routes/auth.js`

```javascript
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { readUsers, addUser } = require('../utils/csvUtils');
const { generateToken, verifyToken } = require('../utils/auth');

router.use(express.json());

// Registration
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send('Email & password required');

    const users = await readUsers();
    if (users.find(u => u.email === email)) return res.status(400).send('User exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now().toString(), email, password: hashedPassword };
    await addUser(newUser);

    res.send('Registration successful');
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const users = await readUsers();
    const user = users.find(u => u.email === email);
    if (!user) return res.status(400).send('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).send('Invalid credentials');

    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true });
    res.send('Login successful');
});

// Protected route
router.get('/profile', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).send('Not authorized');

    const payload = verifyToken(token);
    if (!payload) return res.status(401).send('Invalid token');

    res.send(`Welcome ${payload.email}`);
});

module.exports = router;
```

**Explanation:**

* **Registration** → Hash password using bcrypt → Store in CSV
* **Login** → Verify password → Create JWT → Set in cookie
* **Profile** → Protected route → Verify JWT from cookie

---

## **Step 5: Main App**

`app.js`

```javascript
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cookieParser());
app.use('/auth', authRoutes);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
```

---

## **Step 6: Test API**

* **POST /auth/register** → `{ "email": "a@b.com", "password": "123" }`
* **POST /auth/login** → `{ "email": "a@b.com", "password": "123" }`
* **GET /auth/profile** → Cookie `token` required

---

### **Project Complete**

* Users stored in CSV
* Password hashed
* JWT-based session in cookies
* Fully functional without database



---

# Optional frontend

> Let’s create a **minimal frontend** so you can test registration, login, and protected route in the browser. We’ll keep it simple with **HTML + fetch API**.

---

## **Step 7: Update Project Structure**

```
nodejs-auth-csv/
├── app.js
├── users.csv
├── package.json
├── public/
│   ├── index.html
│   └── profile.html
├── utils/
│   ├── csvUtils.js
│   └── auth.js
└── routes/
    └── auth.js
```

* `public/` → Static frontend files
* `index.html` → Registration/Login forms
* `profile.html` → Protected page

---

## **Step 8: Serve Static Files**

Update `app.js` to serve static frontend:

```javascript
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const path = require('path');

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

app.use('/auth', authRoutes);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
```

---

## **Step 9: Frontend HTML – Registration/Login**

`public/index.html`

```html
<!DOCTYPE html>
<html>
<head>
    <title>Auth Demo</title>
</head>
<body>
    <h1>Register</h1>
    <form id="registerForm">
        <input type="email" id="regEmail" placeholder="Email" required />
        <input type="password" id="regPassword" placeholder="Password" required />
        <button type="submit">Register</button>
    </form>

    <h1>Login</h1>
    <form id="loginForm">
        <input type="email" id="loginEmail" placeholder="Email" required />
        <input type="password" id="loginPassword" placeholder="Password" required />
        <button type="submit">Login</button>
    </form>

    <script>
        const registerForm = document.getElementById('registerForm');
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const res = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            alert(await res.text());
        });

        const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const res = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            alert(await res.text());
        });
    </script>
</body>
</html>
```

---

## **Step 10: Frontend HTML – Protected Page**

`public/profile.html`

```html
<!DOCTYPE html>
<html>
<head>
    <title>Profile</title>
</head>
<body>
    <h1>Profile Page</h1>
    <button id="loadProfile">Load Profile</button>
    <div id="output"></div>

    <script>
        document.getElementById('loadProfile').addEventListener('click', async () => {
            const res = await fetch('/auth/profile', {
                method: 'GET',
                credentials: 'include'
            });
            const text = await res.text();
            document.getElementById('output').innerText = text;
        });
    </script>
</body>
</html>
```

**Explanation:**

* `credentials: 'include'` → Sends cookies with request
* `/auth/profile` → Returns protected info if JWT cookie is valid

---

## **Step 11: Test Everything**

1. Run server:

```bash
node app.js
```

2. Open browser → `http://localhost:3000`
3. Register a new user
4. Login → Cookie set automatically
5. Open `http://localhost:3000/profile.html` → Click "Load Profile" to see protected data

---

This setup gives you:

* Full **register/login** flow
* Password hashing
* JWT authentication
* Cookie-based session
* CSV storage
* Browser testing

---
# Optional logout and automatic protection/redirect

Let’s add **logout** and **automatic protection/redirect** to make this a mini real-world authentication system. We’ll explain each step.

---

## **Step 12: Update Auth Routes – Logout**

Edit `routes/auth.js` and add a logout route:

```javascript
// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token'); // Remove the JWT cookie
    res.send('Logged out successfully');
});
```

**Explanation:**

* `res.clearCookie('token')` removes the JWT cookie from the browser
* The user is now “unauthenticated”
* Frontend can redirect to login page after logout

---

## **Step 13: Protecting Pages – Auto-Redirect**

We’ll add a small JS snippet in `profile.html` to **redirect if not authorized**.

Update `public/profile.html`:

```html
<script>
async function checkAuth() {
    const res = await fetch('/auth/profile', {
        method: 'GET',
        credentials: 'include'
    });

    if (res.status === 401) {
        alert('Not authorized. Redirecting to login.');
        window.location.href = '/';
    } else {
        const text = await res.text();
        document.getElementById('output').innerText = text;
    }
}

document.getElementById('loadProfile').addEventListener('click', checkAuth);

// Optional: Check auth immediately on page load
checkAuth();
</script>
```

**Explanation:**

* Sends the JWT cookie with `credentials: 'include'`
* If the token is invalid/missing → 401 → redirect to login
* Otherwise, shows profile info
* This mimics “protected pages” behavior

---

## **Step 14: Frontend Logout Button**

Add a logout button to `profile.html`:

```html
<button id="logoutBtn">Logout</button>

<script>
document.getElementById('logoutBtn').addEventListener('click', async () => {
    const res = await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include'
    });
    alert(await res.text());
    window.location.href = '/'; // Redirect to login page
});
</script>
```

**Explanation:**

* Sends a POST request to `/auth/logout`
* Clears JWT cookie on server → session ended
* Redirects user back to login page

---

## **Step 15: Optional – Auto-Redirect if Logged In**

You can also redirect from `index.html` to `profile.html` if already logged in:

```html
<script>
async function checkLoggedIn() {
    const res = await fetch('/auth/profile', {
        method: 'GET',
        credentials: 'include'
    });
    if (res.status === 200) {
        window.location.href = '/profile.html';
    }
}

// Check when page loads
checkLoggedIn();
</script>
```

**Explanation:**

* If user already has valid JWT cookie → redirect to profile page automatically
* Makes UX smoother like real apps

---

## **Step 16: Final Project Structure with Frontend**

```
nodejs-auth-csv/
├── app.js
├── users.csv
├── package.json
├── public/
│   ├── index.html        # Registration/Login page
│   └── profile.html      # Protected page with logout
├── utils/
│   ├── csvUtils.js       # Read/write CSV
│   └── auth.js           # JWT generate/verify
└── routes/
    └── auth.js           # register, login, profile, logout
```

---

## **Summary of Features**

1. **Register**

   * Hash password → store in CSV
2. **Login**

   * Verify password → generate JWT → set cookie
3. **Protected Page**

   * JWT verified from cookie → show profile
4. **Logout**

   * Remove JWT cookie
5. **Auto Redirect**

   * Redirect to login if not authorized
   * Redirect to profile if already logged in
6. **Frontend**

   * Simple HTML + fetch API
   * Works without any database

---

## Try to Implement

> Allow “remember me” or “token expiration refresh” to simulate real-world auth systems, which is the next step after JWT basics.

