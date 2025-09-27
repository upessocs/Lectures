
# Experiment 7
## Using Node.js to Manage Sessions & Cookies

> how **sessions** and **cookies** work for user management, and how you can implement them using **Node.js**.


## 1. Understanding the Basics

### HTTP is **Stateless**

* Each HTTP request is independent—your server doesn’t automatically remember who you are between page loads.
* To “remember” users (for login, shopping carts, etc.), we need **state management**.
* Two common solutions: **Cookies** and **Sessions**.

---

## 2. Cookies

A **cookie** is a small piece of data stored in the user’s browser and sent to the server with every HTTP request.

* **Created by server or client-side JavaScript**.
* **Stored in the browser** until it expires or is deleted.
* Good for **non-sensitive data**, like:

  * User preferences (theme, language)
  * Items in a shopping cart (if not sensitive)

### Key Properties of a Cookie

* **name** and **value**: The actual data stored.
* **expiration**: How long it lasts.
* **secure/HttpOnly** flags:

  * `HttpOnly`: JavaScript cannot access it (protects from XSS).
  * `Secure`: Sent only over HTTPS.

---

## 3. Sessions

A **session** is a server-side storage mechanism.

* Server keeps user data (like user ID) in memory or in a database.
* The client only stores a **session ID** (usually inside a cookie).
* Much safer for **sensitive data**, because real data never leaves the server.

### Typical Flow

1. User logs in.
2. Server creates a **session object** with user info and generates a **session ID**.
3. Session ID is sent to the browser inside a cookie.
4. Browser sends the session ID cookie with each request.
5. Server looks up the session ID and retrieves user info.



---
### Experiment Objective:

Demonstrate session and cookie management using Node.js.


### Part 1: Session Management using Node.js

#### Use Case:

Maintain user session during login and destroy session on logout.

#### Requirements:

* `express`
* `express-session`

#### Install Dependencies:

```bash
npm install express express-session
```

#### Code: `session-example.js`

```js
const express = require('express');
const session = require('express-session');

const app = express();

app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true
}));

app.get('/', (req, res) => {
    if (req.session.views) {
        req.session.views++;
        res.send(`Welcome back! You visited ${req.session.views} times.`);
    } else {
        req.session.views = 1;
        res.send('Welcome to the session demo. Refresh to count visits.');
    }
});

app.get('/destroy', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send('Error destroying session');
        }
        res.send('Session destroyed');
    });
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
```

#### Explanation:

* Session is initialized on first request.
* `req.session.views` tracks number of times the user visits.
* `/destroy` endpoint removes session data.

---

### Part 2: Cookie Management using Node.js

#### Use Case:

Create and delete cookies using HTTP headers.

#### Requirements:

* `express`
* `cookie-parser`

#### Install Dependencies:

```bash
npm install express cookie-parser
```

#### Code: `cookie-example.js`

```js
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

app.get('/set-cookie', (req, res) => {
    res.cookie('username', 'JohnDoe', { maxAge: 900000 });
    res.send('Cookie has been set');
});

app.get('/get-cookie', (req, res) => {
    const user = req.cookies['username'];
    res.send(`Cookie Retrieved: ${user}`);
});

app.get('/delete-cookie', (req, res) => {
    res.clearCookie('username');
    res.send('Cookie deleted');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

#### Explanation:

* `/set-cookie`: Sets a cookie named `username`
* `/get-cookie`: Reads the cookie from client
* `/delete-cookie`: Removes the cookie

---
## Final File Structure (Do Not Execute/Test)

```
lab-manual/
│
├── Experiment-7/
│   ├── session-example.js
│   └── cookie-example.js
││
├── package.json
└── README.md
```


---


## 4. Using Node.js to Manage Sessions & Cookies

We’ll use:

* **Express**: Web framework.
* **express-session**: Session middleware.
* **cookie-parser**: To easily read cookies.

### Install Packages

```bash
npm init -y
npm install express express-session cookie-parser
```

### Folder Structure

```
session-cookie-demo/
├─ server.js
└─ package.json
```

---

## 5. Step-by-Step Code

### `server.js`

```js
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // to handle form data

// Session middleware
app.use(session({
  secret: 'mysecretkey',          // used to sign the session ID cookie
  resave: false,                  // do not save session if unmodified
  saveUninitialized: true,        // save new sessions
  cookie: { maxAge: 60000 }       // cookie expiration in ms (here: 1 minute)
}));

// Home route
app.get('/', (req, res) => {
  if (req.session.username) {
    res.send(`Welcome back, ${req.session.username}! <a href="/logout">Logout</a>`);
  } else {
    res.send(`
      <form action="/login" method="post">
        <input type="text" name="username" placeholder="Enter username"/>
        <button type="submit">Login</button>
      </form>
    `);
  }
});

// Login route
app.post('/login', (req, res) => {
  const { username } = req.body;
  req.session.username = username; // store username in session
  res.cookie('theme', 'dark', { maxAge: 900000, httpOnly: true }); // sample cookie
  res.redirect('/');
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid'); // remove session cookie
    res.redirect('/');
  });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
```

---

### How It Works

1. **First visit:** No session exists → form is shown.
2. **Login:** Username saved in session, and a sample cookie (`theme`) is set.
3. **Subsequent requests:** The `connect.sid` cookie automatically tells the server who you are.
4. **Logout:** Session is destroyed and the session cookie is cleared.

---

## 6. Key Notes for Beginners

* **Do not store passwords or sensitive info in cookies**.
* **Session data is safer** because it stays on the server.
* For production:

  * Use a persistent session store (e.g., Redis, MongoDB) instead of default memory.
  * Use `secure: true` in cookies when running on HTTPS.

---

## 7. When to Use What

| Use Case                        | Recommended |
| ------------------------------- | ----------- |
| Remembering a theme or language | Cookie      |
| Keeping a user logged in        | Session     |
| Storing shopping cart items     | Session     |

---

### Next Steps

* Add authentication (e.g., with `passport.js`).
* Use environment variables for secrets (`dotenv`).
* Deploy on a secure HTTPS server.


This is the basic workflow of using **cookies and sessions** in **Node.js** for user management.
