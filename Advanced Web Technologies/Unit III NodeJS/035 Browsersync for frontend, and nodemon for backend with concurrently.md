# Nodemon and BrowserSync together with concurrently 
(Optional)

Below is a **minimal complete example** that runs:

* a small Node/Express backend under **nodemon**, and
* **BrowserSync** in **proxy mode**,

both launched together with **concurrently**, so that:

* when you change `server.js` (backend) → nodemon restarts the server, and BrowserSync triggers a browser reload.
* when you change `public/style.css` → BrowserSync live-reloads immediately.

---

## 1. Folder Layout

```
bs-nodemon-demo/
├─ package.json
├─ server.js
└─ public/
   ├─ index.html
   └─ style.css
```

---

## 2. Files

### `server.js`

```js
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

---

### `public/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>BS + Nodemon Demo</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>BrowserSync + Nodemon</h1>
  <p>Change <code>style.css</code> or <code>server.js</code> and see the browser update.</p>
</body>
</html>
```

---

### `public/style.css`

```css
body {
  background: #f0f0f0;
  text-align: center;
  font-family: sans-serif;
  padding-top: 40px;
}

h1 {
  color: blue;
}
```

---

## 3. Install Dependencies

```bash
npm init -y
npm install express
npm install --save-dev nodemon browser-sync concurrently
```

---

## 4. BrowserSync Config (`bs-config.js`)

Create a small config file so we can call `browser-sync reload` programmatically.

```js
module.exports = {
  proxy: "http://localhost:3000",
  files: "public/**/*.{html,css,js}",
  port: 3001
};
```

---

## 5. Package Scripts

In `package.json` add:

```json
"scripts": {
  "dev:server": "nodemon --watch server.js --exec \"node server.js\"",
  "dev:bs-conf": "browser-sync start --config bs-config.js --ws --logLevel debug",
  "dev:bs": "browser-sync start -p localhost:3000 --port 4000 --files 'public/**/*.*' --ws --logLevel debug",
  "dev": "concurrently \"npm run dev:server\" \"npm run dev:bs\""
}
```

This starts **nodemon** on port `3000` and **BrowserSync** on port `3001` in proxy mode.

---

## 6. Start

```bash
npm run dev
```

You will see something like:

```
[0] Server running at http://localhost:3000
[1] [Browsersync] Proxying: http://localhost:3000
[1] [Browsersync] Local: http://localhost:3001
[1] [Browsersync] Watching files...
```

Open `http://localhost:3001` in your browser.

---

## 7. Test It

* Edit `public/style.css` – the browser refreshes instantly.
* Edit `server.js` (for example, change the API message) – nodemon restarts the backend, and BrowserSync forces a reload once the server is back up.

---

### How it Works

* **nodemon** restarts the backend on every server-side change.
* **BrowserSync** proxies the Express server and injects its live-reload script.
* When nodemon restarts, the proxy detects a short disconnect and BrowserSync reloads the page automatically.

This is the simplest pattern to have **backend restarts and frontend live-reload** running together with `concurrently`.


---

# References

- [BrowserSync commands](https://browsersync.io/docs/command-line)