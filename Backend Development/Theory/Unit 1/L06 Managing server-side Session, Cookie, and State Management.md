

## **1. Introduction to Session Control**

Web applications use the **HTTP protocol**, which is **stateless** — it does not remember any information about previous requests made by the same user.
For example, once a user logs in and navigates to another page, the server does not automatically know who they are.

To overcome this, web developers use **session control mechanisms** to track users and maintain continuity across multiple requests.

Session control helps in:

* Remembering who the user is.
* Storing temporary data (like login state, cart contents).
* Improving user experience by maintaining interaction state.

---

## **2. Concept of Session Tracking**

**Session tracking** refers to the process of maintaining data across multiple HTTP requests made by the same client during a visit to a website.

There are several techniques for session tracking:

| Technique                         | Description                                                                     |
| --------------------------------- | ------------------------------------------------------------------------------- |
| **Cookies**                       | Small data stored on the client’s browser to identify the user.                 |
| **Hidden form fields**            | Stores data in a hidden HTML form field that is sent with each form submission. |
| **URL rewriting / Query Strings** | Appends user data to the URL.                                                   |
| **Server-side sessions**          | Stores user data on the server and sends only a session ID to the client.       |

The **most secure and widely used** method is **server-side session management**.

---

## **3. Difference between Session and State Management**

| Feature      | Session Management                            | State Management                             |
| ------------ | --------------------------------------------- | -------------------------------------------- |
| **Purpose**  | Maintain user-specific data between requests. | Maintain data across the entire application. |
| **Scope**    | Per user session                              | Application-wide                             |
| **Storage**  | Typically on the server (temporary)           | On the server or client (persistent)         |
| **Lifetime** | Ends when user logs out or closes browser     | May persist longer (config or database)      |
| **Example**  | User login session                            | Application configuration values             |

---

## **4. Sessions in Express (Node.js)**

### **Definition**

A **session** in Express is a way to store information about a user on the **server side** that persists across multiple requests.

Each session has a unique **Session ID**, which is sent to the client via a cookie. When the client sends the Session ID back with each request, the server uses it to retrieve the corresponding session data.

### **Working**

1. The server creates a session and assigns a session ID.
2. The session data (e.g., username, preferences) is stored in server memory or a database.
3. The session ID is sent to the browser as a cookie.
4. The browser automatically sends this ID back with every request.
5. The server identifies the user and retrieves their data using the ID.

### **Advantages**

* Secure, since data is not stored on the client.
* Supports storing complex data (objects, arrays).
* Automatically managed by middleware (`express-session`).

### **Limitations**

* Sessions consume server memory.
* If the server restarts, session data may be lost unless stored in a database.

---

## **5. Cookies**

### **Definition**

A **cookie** is a small piece of text stored in the user’s web browser.
It contains information such as user preferences, session identifiers, or tokens.

Cookies help the server remember the user between requests, but the data itself resides **on the client side**.

### **Types of Cookies**

1. **Session Cookies:** Deleted when the browser is closed.
2. **Persistent Cookies:** Remain stored until a set expiration time.
3. **Secure Cookies:** Transmitted only over HTTPS.
4. **HttpOnly Cookies:** Not accessible via JavaScript (preventing XSS attacks).

### **How Cookies Work**

1. The server sends a cookie with an HTTP response.
2. The browser stores the cookie.
3. On subsequent requests, the browser sends the cookie back to the server.
4. The server reads it to identify or remember the user.

### **Advantages**

* Simple to implement.
* Useful for storing user preferences, tokens, or “remember me” data.

### **Limitations**

* Limited storage size (~4 KB).
* Visible to the user; can be modified.
* Security risk if not marked as `HttpOnly` or `Secure`.

### **Security Attributes**

| Attribute                | Description                                      |
| ------------------------ | ------------------------------------------------ |
| **`maxAge` / `expires`** | Defines cookie lifetime.                         |
| **`secure`**             | Ensures transmission only via HTTPS.             |
| **`httpOnly`**           | Restricts JavaScript access (protects from XSS). |
| **`sameSite`**           | Controls cross-site cookie sending behavior.     |

---

## **6. Query Strings**

### **Definition**

A **query string** is part of a URL used to send small pieces of data between web pages.

Example:

```
http://localhost:3000/welcome?user=Alice&role=admin
```

Here,

* `user` and `role` are parameters.
* `Alice` and `admin` are their respective values.

### **Use Cases**

* Sending search filters.
* Pagination (e.g., `?page=2`).
* Non-sensitive configuration data.

### **Advantages**

* Easy to use.
* Works without cookies or sessions.
* Visible and bookmarkable.

### **Limitations**

* Data is visible in the URL.
* Not suitable for sensitive information.
* Limited in length and complexity.

---

## **7. Comparison of Sessions, Cookies, and Query Strings**

| Feature        | Session                          | Cookie              | Query String             |
| -------------- | -------------------------------- | ------------------- | ------------------------ |
| **Stored On**  | Server                           | Client (Browser)    | URL                      |
| **Security**   | High                             | Medium              | Low                      |
| **Data Limit** | Large                            | ~4 KB               | Few KB                   |
| **Lifetime**   | Until logout or timeout          | Until expiry        | Only per request         |
| **Visibility** | Hidden from user                 | User can view       | Visible in URL           |
| **Best For**   | Login data, cart, temporary info | Preferences, tokens | Passing small parameters |

---

## **8. Summary**

* **Sessions**: Best for storing **temporary, sensitive user data** on the server.
* **Cookies**: Useful for **persistent data** that should remain across sessions.
* **Query Strings**: Suitable for **non-sensitive parameters** that need to be visible or shareable.

Together, these mechanisms form the **core of state management** in web applications.
In modern Node.js Express apps, these are often used alongside secure practices such as encryption, HTTPS, and token-based authentication.

---


## **1. Introduction to Session Control**

HTTP is **stateless**, meaning every request is independent.
To remember users (e.g., when they log in), we use **sessions** and **cookies**.

* **Sessions** → store user data **on the server**.
* **Cookies** → store small pieces of data **in the browser**.
* **Query Strings** → pass data in the **URL**.

---

## **2. Sessions in Express**

We’ll use the package **`express-session`** to handle sessions.

### **Setup Example**

```bash
npm install express express-session
```

---

### **Creating and Starting Sessions**

```javascript
// app.js
const express = require('express');
const session = require('express-session');
const app = express();

// Middleware to handle sessions
app.use(session({
  secret: 'mySecretKey',       // used to sign session ID cookies
  resave: false,               // do not save if not modified
  saveUninitialized: true,     // save new sessions
  cookie: { maxAge: 60000 }    // cookie expiry: 1 minute
}));

// Set session variable
app.get('/login', (req, res) => {
  req.session.username = 'JohnDoe';
  res.send('Session started for ' + req.session.username);
});

// Access session data
app.get('/profile', (req, res) => {
  if (req.session.username) {
    res.send('Welcome ' + req.session.username);
  } else {
    res.send('Please log in first.');
  }
});

// Destroy session
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.send('Error destroying session');
    res.send('Session destroyed successfully');
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### **Explanation**

* `express-session` automatically creates a **session ID cookie** and sends it to the client.
* The **actual session data** (like `username`) is stored **on the server** (in memory by default).
* On every request, the client sends the session ID back, allowing retrieval of stored data.

---

## **3. Cookies in Express**

Cookies are managed via the **`cookie-parser`** middleware.

### **Setup**

```bash
npm install cookie-parser
```

---

### **Setting Up and Reading Cookies**

```javascript
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());

// Set a cookie
app.get('/setcookie', (req, res) => {
  res.cookie('username', 'JohnDoe', {
    maxAge: 3600000, // 1 hour
    httpOnly: true,  // not accessible by JavaScript
    secure: false     // true only if using HTTPS
  });
  res.send('Cookie has been set!');
});

// Read a cookie
app.get('/getcookie', (req, res) => {
  const user = req.cookies.username;
  if (user) {
    res.send('Welcome back, ' + user);
  } else {
    res.send('No cookie found.');
  }
});

// Delete a cookie
app.get('/deletecookie', (req, res) => {
  res.clearCookie('username');
  res.send('Cookie deleted.');
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### **Explanation**

* `res.cookie(name, value, options)` → creates a cookie.
* `req.cookies` → allows reading cookies.
* `res.clearCookie(name)` → deletes the cookie.

---

### **Security Attributes**

| Attribute  | Description                                   |
| ---------- | --------------------------------------------- |
| `maxAge`   | Lifetime of the cookie in milliseconds        |
| `secure`   | Send only over HTTPS                          |
| `httpOnly` | Prevent JavaScript access (helps prevent XSS) |
| `sameSite` | Restrict cross-site cookie usage              |

**Example:**

```javascript
res.cookie('token', 'abc123', {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
});
```

---

## **4. Query Strings**

Query strings are part of the URL, used to send small pieces of data between pages.

Example URL:

```
http://localhost:3000/welcome?user=Alice&role=admin
```

### **Example**

```javascript
const express = require('express');
const app = express();

app.get('/welcome', (req, res) => {
  const user = req.query.user;
  const role = req.query.role;
  res.send(`Welcome ${user}, your role is ${role}`);
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### **Explanation**

* `req.query` holds key-value pairs from the URL.
* Suitable for short, non-sensitive data (filters, search parameters).
* Not secure for private data (e.g., passwords).

---

## **5. Comparison**

| Feature              | Session                  | Cookie         | Query String       |
| -------------------- | ------------------------ | -------------- | ------------------ |
| **Storage location** | Server                   | Browser        | URL                |
| **Security**         | More secure              | Can be exposed | Visible in URL     |
| **Data Size Limit**  | Large                    | ~4 KB          | Very small         |
| **Lifespan**         | Until logout/session end | Until expiry   | Until request      |
| **Use Case**         | Login state, user data   | Preferences    | Search/filter data |

