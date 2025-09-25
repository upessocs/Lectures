
## 1 Node.js Console

The **Node.js Console** is similar to the browser console, but for the **server environment**.

### Common Methods:

| Method                                 | Description                      | Example                                                     |
| -------------------------------------- | -------------------------------- | ----------------------------------------------------------- |
| `console.log()`                        | Print normal messages            | `console.log("Hello Node")`                                 |
| `console.error()`                      | Print error messages             | `console.error("Error occurred!")`                          |
| `console.warn()`                       | Warnings                         | `console.warn("Warning!")`                                  |
| `console.table()`                      | Display data in table format     | `console.table([{id:1,name:"A"}])`                          |
| `console.time()` / `console.timeEnd()` | Measure time taken by code block | `console.time("test"); /* code */ console.timeEnd("test");` |

> Used for debugging, logging server output, and tracking performance.

---

## 2 Node.js Modules and Its Types

A **module** is a reusable block of code that can be imported/exported.

### Types of Modules:

1. **Core Modules** (built-in)

   * No installation needed.
   * Examples: `fs`, `http`, `path`, `os`.

   ```js
   const fs = require('fs');
   fs.readFile('file.txt', 'utf8', (err, data) => console.log(data));
   ```

2. **Local Modules**

   * Your own files.

   ```js
   // math.js
   exports.add = (a,b) => a+b;

   // index.js
   const math = require('./math');
   console.log(math.add(2,3));
   ```

3. **Third-Party Modules**

   * Installed via **npm**.
   * Example: `express`, `mongoose`.

   ```bash
   npm install express
   ```

   ```js
   const express = require('express');
   const app = express();
   ```

---

## 3 Functions in Node.js

Functions in Node.js work the same as in JavaScript.

### Types

* **Normal function**

  ```js
  function greet(name) {
    return `Hello ${name}`;
  }
  console.log(greet("Prateek"));
  ```
* **Arrow function**

  ```js
  const greet = name => `Hello ${name}`;
  ```
* **Callback function**: Passed as an argument to be executed later.

  ```js
  fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) console.error(err);
    else console.log(data);
  });
  ```

---

## 4 Buffer

A **Buffer** is a raw memory allocation outside the V8 JavaScript engine used to handle **binary data**, e.g., images, videos.

### Example:

```js
const buf = Buffer.from('Hello');
console.log(buf);          // <Buffer 48 65 6c 6c 6f>
console.log(buf.toString()); // Hello
```

* Buffers are essential when working with streams, files, or network data.

---

## 5 Understanding Node’s Event-Driven Framework

Node.js is **event-driven**:

* It uses an **event loop** to handle multiple requests asynchronously.
* Operations like I/O don’t block other code.

### Event Loop:

* Listens for events and executes callbacks when events occur.
* Enables **non-blocking** behavior.

---

## 6 EventEmitter Class

`EventEmitter` is provided by the `events` module to **create and listen to custom events**.

### Example:

```js
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('greet', (name) => {     // listener
  console.log(`Hello ${name}`);
});

emitter.emit('greet', 'Prateek');   // emit event
```

---

## 7 Inheriting Events

You can create your own class and inherit from EventEmitter.

```js
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

myEmitter.on('data', () => console.log('Data received!'));
myEmitter.emit('data');
```

---

## 8 Node Package Manager (npm)

**npm** is the default package manager for Node.js:

* Installs libraries from the [npm registry](https://www.npmjs.com/).
* Manages project dependencies.

### Common Commands:

| Command                  | Description             |
| ------------------------ | ----------------------- |
| `npm init`               | Create package.json     |
| `npm install package`    | Install package locally |
| `npm install -g package` | Install globally        |
| `npm uninstall package`  | Remove package          |
| `npm update`             | Update dependencies     |

---

## 9 Using `req` and `res` in Express

### Setup Express:

```bash
npm install express
```

```js
const express = require('express');
const app = express();
app.listen(3000, () => console.log('Server started on http://localhost:3000'));
```

### Accessing Request Data (`req`)

| Usage                | Example                                             |
| -------------------- | --------------------------------------------------- |
| **Headers**          | `req.headers`                                       |
| **Query parameters** | `req.query`                                         |
| **URL params**       | `req.params`                                        |
| **Request body**     | `req.body` (needs middleware like `express.json()`) |
| **Original URL**     | `req.originalUrl`                                   |

#### Example:

```js
app.get('/user/:id', (req, res) => {
  console.log('Headers:', req.headers);
  console.log('Query params:', req.query);    // e.g. ?age=20
  console.log('URL params:', req.params.id);  // from /user/123
  console.log('Full URL:', req.originalUrl);

  res.send(`User ID: ${req.params.id}`);
});
```

---

### Sending Responses (`res`)

| Method               | Description               |
| -------------------- | ------------------------- |
| `res.send()`         | Send text or HTML         |
| `res.json()`         | Send JSON                 |
| `res.status(code)`   | Set status code           |
| `res.sendFile(path)` | Send a file               |
| `res.redirect(url)`  | Redirect to another route |

#### Examples:

```js
// Send plain text
app.get('/text', (req, res) => res.send('Hello Text'));

// Send HTML
app.get('/html', (req, res) => res.send('<h1>Hello HTML</h1>'));

// Send JSON
app.get('/json', (req, res) => res.json({ message: 'Hello JSON' }));

// Set status code
app.get('/notfound', (req, res) => res.status(404).send('Not Found'));
```

---

## 10 EJS Templating Engine

**EJS (Embedded JavaScript Templates)** allows you to write HTML pages with embedded JavaScript.

### Installation:

```bash
npm install ejs
```

### Setup:

```js
app.set('view engine', 'ejs');
app.set('views', './views'); // default is ./views
```

### Create View File:

`views/index.ejs`

```html
<!DOCTYPE html>
<html>
<head>
  <title>EJS Example</title>
</head>
<body>
  <h1>Hello <%= name %></h1>
  <ul>
    <% items.forEach(item => { %>
      <li><%= item %></li>
    <% }) %>
  </ul>
</body>
</html>
```

* `<%= %>` : Output escaped value.
* `<% %>` : Run JavaScript code without output.

### Route to Render EJS:

```js
app.get('/', (req, res) => {
  res.render('index', { name: 'Prateek', items: ['Node', 'Express', 'EJS'] });
});
```

Visit: [http://localhost:3000](http://localhost:3000)
➡ Renders dynamic HTML with passed variables.

---

### Summary 

| Feature      | Key Method                        | Example                    |
| ------------ | --------------------------------- | -------------------------- |
| Console      | `console.log()`                   | `console.log('Debug')`     |
| Module       | `require()`                       | `const fs = require('fs')` |
| Buffer       | `Buffer.from()`                   | `Buffer.from('Hello')`     |
| EventEmitter | `emitter.on()` / `emitter.emit()` | Custom events              |
| npm          | `npm install`                     | Install dependencies       |
| Express req  | `req.query`, `req.params`         | Access URL/query           |
| Express res  | `res.send()`, `res.json()`        | Send response              |
| EJS          | `<%= %>`                          | Embed variables in HTML    |


