
# Experiment 7

## State Management

### Objective:

Demonstrate session and cookie management using Node.js.

---

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
