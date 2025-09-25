# `require` with CommonJS/VanillaJS and `import` after ES6

The difference between **`require`** and **`import`** in Node.js

## 1. `require` (CommonJS)

### Overview

* **Module system:** CommonJS
* **Default in:** Older versions of Node.js (pre–ES modules).
* **Synchronous:** Loads modules at runtime.

### Syntax

```js
// Import entire module
const fs = require('fs');

// Import specific export from a custom file
const math = require('./math');
const sum = math.add(2, 3);
```

### Exporting

```js
// math.js
module.exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};
```

### Key Points

* Executes at runtime, so you can use it conditionally:

  ```js
  if (condition) {
    const special = require('./special');
  }
  ```
* Works in all Node versions without extra configuration.

---

## 2. `import` (ES Modules)

### Overview

* **Module system:** ES Modules (ESM).

* **Default in:** Modern JavaScript and supported in Node.js when you:

  * Use `.mjs` file extension, **or**
  * Set `"type": "module"` in `package.json`.

* **Static:** Resolved at compile time.

### Syntax

```js
// Import named exports
import { add } from './math.js';

// Import default export
import subtract from './subtract.js';

// Import everything
import * as math from './math.js';
```

### Exporting

```js
// math.js
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }

// Or default export
export default function multiply(a, b) { return a * b; }
```

### Key Points

* **Top-level only:** You cannot conditionally `import` inside blocks without using dynamic `import()`.
* Better support for **tree-shaking** (removing unused code during bundling).
* Aligns with modern JavaScript standards (browser and Node).

---

## 3. Side-by-Side Comparison

| Feature | `require` (CommonJS)    | `import` (ES Modules) |
| :------- | :---------- | :---- |
| Module type         | CommonJS                         | ES Modules                             |
| File extension      | `.js` (default)                  | `.mjs` or `.js` with `"type":"module"` |
| Loading time        | Runtime (synchronous)            | Compile time (static)                  |
| Conditional loading | Allowed                          | Not directly (use `import()` function) |
| Standard            | Node-specific (legacy)           | ECMAScript standard                    |

---

## 4. Dynamic `import()`

ES Modules also support **dynamic import**, which behaves like `require`:

```js
const module = await import('./math.js');
console.log(module.add(2, 3));
```

* Returns a promise.
* Useful for conditional or lazy loading.

---

## Practical Recommendation

* **New projects:** Prefer `import` (ESM) for future compatibility and modern tooling.
* **Existing CommonJS projects:** Continue with `require` unless you plan to migrate.

---

### Quick Example in the Same Project

**package.json**

```json
{
  "type": "module"
}
```

**math.js**

```js
export function add(a, b) { return a + b; }
```

**index.js**

```js
import { add } from './math.js';
console.log(add(2, 3));
```

Run:

```bash
node index.js
```

This uses ES Modules (`import`) instead of CommonJS (`require`).

---


# Nodemon

**Purpose**:
Nodemon is a development tool for Node.js applications that **automatically restarts the server** whenever files in the project change. This removes the need to manually stop and restart the server after every code update.

### Key Features

* Watches files and folders for changes.
* Restarts the Node.js process automatically.
* Works with any Node.js application.
* Allows ignoring specific files/folders.
* Can pass custom arguments to the application.

### Installation

Global installation (common for development):

```bash
npm install -g nodemon
```

or as a dev dependency:

```bash
npm install --save-dev nodemon
```

### Usage

Run a Node.js script:

```bash
nodemon app.js
```

With npm scripts (`package.json`):

```json
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}
```

Run with:

```bash
npm run dev
```

### Configuration

Create a `nodemon.json` file to customize behavior:

```json
{
  "watch": ["src"],
  "ext": "js,json",
  "ignore": ["node_modules"],
  "exec": "node server.js"
}
```

### Typical Use Case

* Backend development: Express, REST APIs, GraphQL servers.
* Speeds up development by automatically reloading the server on code changes.

---

# BrowserSync

**Purpose**:
BrowserSync is a tool that provides **live-reloading** and **synchronized testing** across multiple browsers and devices. It refreshes or injects changes into the browser whenever you modify frontend files (HTML, CSS, JS).

### Key Features

* Auto-reloads browser when HTML, CSS, or JS changes.
* Synchronizes scrolling, clicks, and form inputs across multiple devices.
* Integrates with task runners like Gulp, Webpack, or can be used standalone.
* Supports both static sites and server-side apps.

### Installation

Global installation:

```bash
npm install -g browser-sync
```

or as a dev dependency:

```bash
npm install --save-dev browser-sync
```

### Usage (Static Files)

Serve a folder and watch for changes:

```bash
browser-sync start --server --files "index.html, css/*.css, js/*.js"
```

### With npm scripts (`package.json`)

```json
"scripts": {
  "start": "browser-sync start --server --files 'index.html, css/*.css, js/*.js'"
}
```


### Typical Use Case

* Frontend development for static sites.
* Real-time testing on multiple devices.
* Faster feedback when editing HTML/CSS/JS.

---

## Key Difference

| Tool            | Focus                                                                  |
| :---- | :---- |
| **Nodemon**     | Auto-restart Node.js server when backend files change.                 |
| **BrowserSync** | Auto-refresh browser and sync interactions when frontend files change. |

**In full-stack development**, they are often used **together**:

> **Nodemon** for backend auto-reload.
> **BrowserSync** for frontend live-reload and multi-device testing.

---
# Run Nodemon and BrowerSync together

You can run **Nodemon** and **BrowserSync together** so that:

* **Nodemon** restarts your **Node.js backend server** when you change server-side files.
* **BrowserSync** automatically **refreshes the browser** whenever the backend restarts or you edit frontend files.

There are two common setups:

---

## 1. Using BrowserSync in **Proxy Mode** (Recommended for Express/Node servers)

In this approach the Node.js app is the real server, and BrowserSync acts as a **proxy** that injects live-reload scripts into the pages it serves.

### Steps

#### 1. Install packages

```bash
npm install --save-dev nodemon browser-sync concurrently
```

* **nodemon**: auto-restart backend.
* **browser-sync**: live reload frontend.
* **concurrently**: run multiple commands in one terminal.

#### 2. `package.json` scripts

Add scripts:

```json
"scripts": {
  "dev:server": "nodemon server.js",
  "dev:bs": "browser-sync start --proxy 'http://localhost:3000' --files 'public/**/*.*' --port 4000",
  "dev": "concurrently \"npm run dev:server\" \"npm run dev:bs\""
}
```

* `--proxy 'http://localhost:3000'` : URL of your Node app.
* `--files 'public/**/*.*'` : watch all frontend files (HTML, CSS, JS, images).
* `--port 4000` : BrowserSync will serve at `http://localhost:4000`.

#### 3. Run

```bash
npm run dev
```

Now:

* Nodemon runs your backend on **port 3000**.
* BrowserSync serves it on **port 4000**, auto-refreshing the browser whenever backend restarts or frontend files change.

---


## How This Works

* **Nodemon** watches server files and restarts Node.js when backend code changes.
* **BrowserSync** connects as a proxy:

  * If backend restarts, BrowserSync notices and reloads the page.
  * If frontend files (HTML/CSS/JS) change, BrowserSync injects changes or reloads the browser immediately.

---

### Quick Recap

| Task                          | Tool                         |
| ----------------------------- | ---------------------------- |
| Restart server on code change | **Nodemon**                  |
| Refresh browser / sync input  | **BrowserSync**              |
| Run both commands together    | **Concurrently** or **Gulp** |

This combination gives you **instant backend reloads** and **live frontend updates**, making full-stack development much faster.
