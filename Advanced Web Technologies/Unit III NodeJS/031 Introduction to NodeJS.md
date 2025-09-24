# Introduction to Node.js
#### (Intro. from nodejs.org)

Node.js is an open-source and cross-platform JavaScript runtime environment. 

> Node.js runs the **V8 JavaScript engine**, the core of Google Chrome, **outside of the browser**. 

A Node.js app runs in a single process, without creating a new thread for every request. Node.js provides a set of asynchronous I/O primitives in its standard library that prevent JavaScript code from blocking. In addition, libraries in Node.js are generally written using **non-blocking** paradigms. Accordingly, blocking behavior is the exception rather than the norm in Node.js.

> When Node.js performs an I/O operation, like reading from the network, accessing a database or the filesystem, instead of blocking the thread and wasting CPU cycles waiting, Node.js will resume the operations when the response comes back.

> *This allows Node.js to handle thousands of concurrent connections with a single server without introducing the burden of managing thread concurrency, which could be a significant source of bugs.*


Node.js has a unique advantage because millions of frontend developers that write JavaScript for the browser are now able to write the server-side code in addition to the client-side code without the need to learn a completely different language.

In Node.js the new **ECMAScript standards** can be used without problems, as you don't have to wait for all your users to update their browsers - you are in charge of deciding which ECMAScript version to use by changing the Node.js version, and you can also enable specific experimental features by running Node.js with flags.
---

## What is Node.js?

**Node.js** is an open-source, cross-platform JavaScript runtime environment that allows you to run JavaScript code **outside the browser**, primarily on the server side.
It is built on **Google Chrome’s V8 JavaScript engine**, which compiles JavaScript directly into machine code for high performance.

Key points:

* Created by **Ryan Dahl in 2009**.
* Uses an **event-driven**, **non-blocking I/O** model.
* Ideal for building **scalable** and **real-time** applications (e.g., chat apps, streaming services, APIs).

---

## Advantages of Node.js

1. **High Performance**

   * Powered by the V8 engine which compiles JS into machine code.
   * Handles a large number of concurrent connections efficiently.

2. **Non-Blocking, Event-Driven I/O**

   * Uses a single-threaded event loop.
   * Non-blocking I/O operations make it suitable for real-time applications.

3. **Single Language for Full Stack**

   * JavaScript can be used for both client and server sides.

4. **Rich Ecosystem (npm)**

   * Largest collection of open-source libraries through **npm**.

5. **Scalability**

   * Designed to handle thousands of simultaneous connections.

6. **Community Support**

   * Active developer community and frequent updates.

7. **Fast Prototyping**

   * Easy to build and deploy applications quickly.

---

## Traditional Web Server Model

Before Node.js, most traditional servers (like **Apache HTTP Server**, **PHP**, or **Java-based servers**) used a **multi-threaded blocking model**:

* **Request-Response Cycle:**

  1. Each client request spawns or uses a **separate thread** or process.
  2. Server waits for database or file operations to complete (**blocking I/O**).
  3. The thread is released when the response is sent.

* **Problems:**

  * **Resource Intensive:** Each thread consumes memory and CPU.
  * **Limited Scalability:** High number of simultaneous connections can overwhelm the server.
  * **Latency:** Blocking I/O increases response time.

---

## Node.js Process Model

Node.js uses a **Single-Threaded Event Loop** with **Non-Blocking I/O**:

### How it Works:

1. **Single Main Thread**: Runs the event loop.
2. **Event Queue**: Incoming requests are placed in a queue.
3. **Non-Blocking I/O**:

   * Time-consuming tasks (e.g., file read, DB queries) are delegated to the system’s **thread pool** or kernel.
   * The main thread continues processing other requests.
4. **Callback/Event Handling**: When the task completes, a callback is added to the event queue and executed.

### Key Characteristics:

* **Non-blocking**: The server does not wait for I/O tasks to finish.
* **Asynchronous**: Code execution continues without waiting for previous tasks.
* **Highly Scalable**: Can handle thousands of connections using fewer resources.

---

### Comparison Table: Traditional vs Node.js Model

| Feature        | Traditional Server (e.g., Apache) | Node.js Process Model           |
| -------------- | --------------------------------- | ------------------------------- |
| Threading      | Multi-threaded                    | Single-threaded event loop      |
| I/O Operations | Blocking                          | Non-blocking (asynchronous)     |
| Scalability    | Limited by number of threads      | High – handles many connections |
| Resource Usage | High                              | Low                             |
| Ideal Use Case | CPU-intensive tasks               | I/O-bound, real-time apps       |

---

### Summary

> Node.js revolutionized server-side programming by allowing JavaScript to be used on the backend and by adopting an **event-driven, non-blocking** architecture. This makes it particularly well-suited for **real-time, data-intensive applications** like chat servers, APIs, and streaming platforms.

---


---

## Installation Instructions

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Steps
1. **Install Node.js**:
   - Visit [nodejs.org](https://nodejs.org/)
   - Download and install the LTS version for your operating system
   - Verify installation by running:
     ```bash
     node --version
     npm --version
     ```

2. **Create Project Directory**:
   ```bash
   mkdir nodejs-lab
   cd nodejs-lab
   ```

3. **Initialize npm Project**:
   ```bash
   npm init -y
   ```

4. **Install Express** (for the web server):
   ```bash
   npm install express
   ```
---

5.  **Test installation**
   ```bash
   node -v
   ```

6. **Create http server and run using node**

`server.js`
```js
// server.mjs
import { createServer } from 'node:http';

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!\n');
});

// starts a simple http server locally on port 3000
server.listen(3000, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3000');
});

// run with `node server.mjs`
```

> run with `node server.mjs`

---

### 1. Hello World Server using express or (node express)

#### Explanation
This creates a basic web server using Express that responds with "Hello, World!" when accessed.

#### Code Snippet
```javascript
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

---




# Step-by-step guide
To initialize a **Hello World** Node.js project, including the **commands**, **file structure**, and **explanations**.


## 1 Prerequisites

* **Install Node.js**:
  Download and install from [https://nodejs.org](https://nodejs.org)
  After installation, check versions:

  ```bash
  node -v
  npm -v
  ```

  `node` is the runtime; `npm` is the Node Package Manager.


## 2 Create a Project Folder

Create a new directory and move into it:

```bash
mkdir hello-node
cd hello-node
```

This folder will contain all files of your Node.js project.


## 3 Initialize the Project

Run:

```bash
npm init -y
```

* Creates a **package.json** file with default settings.
* `-y` accepts default options (name, version, license, etc.).

Your folder now looks like:

```
hello-node/
└── package.json
```


### `package.json` Overview

This file describes the project and its dependencies:

```json
{
  "name": "hello-node",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  }
}
```

* **name**: Project name
* **version**: Version of your app
* **main**: Entry file (default `index.js`)
* **scripts**: Commands you can run with `npm run <script>`


## 4 Create the Main File

Create an `index.js` file:

```bash
touch index.js
```

Edit `index.js`:

```javascript
// index.js
const http = require('http');

// Create a server
const server = http.createServer((req, res) => {
  res.statusCode = 200;             // HTTP status code
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');          // Response text
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
```


## 5 Run the Application

Use either command:

```bash
node index.js
```

or (because we added a script in `package.json`):

```bash
npm start
```

Visit: [http://localhost:3000](http://localhost:3000)
 You should see: **Hello World**


## 6 Final Project Structure

After initialization and adding code:

```
hello-node/
│
├── package.json        # Project metadata and scripts
├── package-lock.json   # Auto-generated exact dependency versions (created when you install packages)
└── index.js            # Your Hello World server code
```

> **Note**: `package-lock.json` is created automatically when you run `npm install` (even if no extra packages are installed yet).


## 7 Optional Enhancements

* Add a `.gitignore` file if using Git:

  ```
  node_modules/
  ```
* Install additional packages (for example `express`) using:

  ```bash
  npm install express
  ```

---

### Quick Recap

1. **mkdir hello-node && cd hello-node** – Create project folder.
2. **npm init -y** – Initialize Node project and create `package.json`.
3. **index.js** – Write server code.
4. **node index.js** or **npm start** – Run and test in browser.

This is the minimal setup to create a **Hello World** web server in Node.js.





