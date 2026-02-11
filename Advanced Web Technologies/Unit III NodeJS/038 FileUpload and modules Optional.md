# Tutorial: Building a Simple Node.js Express File-Upload App

## 1. What this mini-app will do

1. A form where a user enters:

   * sapid
   * name
   * uploads a file

2. The server:

   * Receives the file
   * Identifies the user using the request headers (user-agent, platform, OS)
   * Saves file inside `uploads/` folder
   * Renames file to something like:
     `sapid_timestamp_originalname`
   * Stores uploader info in `data.json`

3. A route `/list` shows all uploads and user metadata.

---

# 2. Required Node.js modules

| Module      | Purpose                                          |
| ----------- | ------------------------------------------------ |
| express     | Web server                                       |
| multer      | Middleware for handling file uploads             |
| useragent   | Parsing user browser/OS information              |
| fs, path    | Writing metadata, renaming files, handling paths |
| body-parser | To read form fields like sapid and name          |

---

# 3. How file upload works (multer)

### 3.1 Storage engine

Multer allows you to define where and how files are stored:

```js
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const sapid = req.body.sapid || 'unknown';
    const timestamp = Date.now();
    cb(null, `${sapid}_${timestamp}_${file.originalname}`);
  }
});
```

This does two things:

* Stores files in `uploads/`
* Renames them using sapid and timestamp for uniqueness

### 3.2 Using middleware

```js
const upload = multer({ storage: storage });
```

To handle a single file upload:

```js
app.post('/upload', upload.single('myfile'), (req, res) => { ... });
```

---

# 4. Extracting browser, OS, platform information

Install:

```
npm install useragent
```

Use:

```js
const ua = useragent.parse(req.headers['user-agent']);
const metadata = {
  browser: ua.family,
  os: ua.os.toString(),
  device: ua.device.toString()
};
```

---

# 5. Storing uploader information

We will store all uploads in a file `data.json` like:

```json
[
  {
    "sapid": "12345",
    "name": "John",
    "filename": "12345_171234567_file.pdf",
    "browser": "Chrome",
    "os": "Windows 10",
    "device": "Desktop"
  }
]
```

Appending new entries:

```js
const dbPath = path.join(__dirname, 'data.json');
let existing = [];
if (fs.existsSync(dbPath)) {
  existing = JSON.parse(fs.readFileSync(dbPath));
}
existing.push(newEntry);
fs.writeFileSync(dbPath, JSON.stringify(existing, null, 2));
```

---

# 6. Listing all uploaded data

A simple GET route:

```js
app.get('/list', (req, res) => {
  const data = fs.existsSync(dbPath)
    ? JSON.parse(fs.readFileSync(dbPath))
    : [];
  res.json(data);
});
```

---

# 7. HTML upload form (public/index.html)

```html
<!DOCTYPE html>
<html>
<body>
  <h2>Upload File</h2>
  <form action="/upload" method="POST" enctype="multipart/form-data">
    <label>SAPID:</label><br>
    <input type="text" name="sapid" required><br><br>

    <label>Name:</label><br>
    <input type="text" name="name" required><br><br>

    <label>File:</label><br>
    <input type="file" name="myfile" required><br><br>

    <button type="submit">Upload</button>
  </form>
</body>
</html>
```

---

# Complete Working Project Code

Create this structure:

```
project/
  server.js
  uploads/
  data.json   (auto created)
  public/
    index.html
```

---

# server.js (final complete code)

```js
const express = require('express');
const multer = require('multer');
const useragent = require('useragent');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const uploadFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

const dbPath = path.join(__dirname, 'data.json');

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const sapid = req.body.sapid || 'unknown';
    const timestamp = Date.now();
    cb(null, `${sapid}_${timestamp}_${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// POST upload
app.post('/upload', upload.single('myfile'), (req, res) => {
  if (!req.file) {
    return res.send('No file uploaded');
  }

  const ua = useragent.parse(req.headers['user-agent']);

  const entry = {
    sapid: req.body.sapid,
    name: req.body.name,
    filename: req.file.filename,
    browser: ua.family,
    os: ua.os.toString(),
    device: ua.device.toString(),
    timestamp: new Date().toISOString()
  };

  let existing = [];
  if (fs.existsSync(dbPath)) {
    existing = JSON.parse(fs.readFileSync(dbPath));
  }

  existing.push(entry);
  fs.writeFileSync(dbPath, JSON.stringify(existing, null, 2));

  res.send('Upload successful');
});

// List all uploads
app.get('/list', (req, res) => {
  const data = fs.existsSync(dbPath)
    ? JSON.parse(fs.readFileSync(dbPath))
    : [];

  res.json(data);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
```


---

# Same logic using modules 
> if helps maintain and update code in small files


---
# Tutorial: Breaking an Express App into Modules

A clean Node.js project should separate logic into reusable components.
We will break the project into:

1. server.js
2. routes
3. controllers
4. services
5. utils
6. config

> This makes your project scalable and readable.

---

# 1. Folder Structure

Create this structure:

```
project/
  server.js
  config/
    multerConfig.js
    paths.js
  routes/
    uploadRoutes.js
    listRoutes.js
  controllers/
    uploadController.js
    listController.js
  services/
    metadataService.js
  utils/
    userAgentParser.js
  uploads/
  data.json
  public/
    index.html
```

---

# 2. Teaching Modules + Exports

## 2.1 How to export a function

In a file:

```js
function add(a, b) {
  return a + b;
}
module.exports = add;
```

Use it:

```js
const add = require('./add');
console.log(add(2, 3));
```

## 2.2 Export multiple items

```js
function a() {}
function b() {}

module.exports = { a, b };
```

Use:

```js
const { a, b } = require('./file');
```

## 2.3 Export an object or instance

```js
module.exports = {
  value: 10,
  sayHi() { return "hi"; }
};
```

---

# 3. Explanation of Code Modules

## config/multerConfig.js

Defines file upload storage engine and export multer instance.

## config/paths.js

Stores project-wide reusable file paths.

## utils/userAgentParser.js

Extracts browser, OS, device from user-agent header.

## services/metadataService.js

Reads and writes metadata to `data.json`.

## controllers/uploadController.js

Handles POST upload request.

## controllers/listController.js

Handles GET listing request.

## routes/uploadRoutes.js

Maps URL to upload controller.

## routes/listRoutes.js

Maps URL to list controller.

---

# 4. Full Code Files

## server.js

```js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const uploadRoutes = require('./routes/uploadRoutes');
const listRoutes = require('./routes/listRoutes');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/upload', uploadRoutes);
app.use('/list', listRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
```

---

## config/paths.js

```js
const path = require('path');

module.exports = {
  dataFile: path.join(__dirname, '..', 'data.json'),
  uploadFolder: path.join(__dirname, '..', 'uploads')
};
```

---

## config/multerConfig.js

```js
const multer = require('multer');
const fs = require('fs');
const { uploadFolder } = require('./paths');

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const sapid = req.body.sapid || 'unknown';
    const timestamp = Date.now();
    cb(null, `${sapid}_${timestamp}_${file.originalname}`);
  }
});

module.exports = multer({ storage: storage });
```

---

## utils/userAgentParser.js

```js
const useragent = require('useragent');

function parseUA(req) {
  const ua = useragent.parse(req.headers['user-agent']);
  return {
    browser: ua.family,
    os: ua.os.toString(),
    device: ua.device.toString()
  };
}

module.exports = parseUA;
```

---

## services/metadataService.js

```js
const fs = require('fs');
const { dataFile } = require('../config/paths');

function loadData() {
  if (!fs.existsSync(dataFile)) return [];
  return JSON.parse(fs.readFileSync(dataFile));
}

function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function addEntry(entry) {
  const data = loadData();
  data.push(entry);
  saveData(data);
}

module.exports = {
  loadData,
  saveData,
  addEntry
};
```

---

## controllers/uploadController.js

```js
const parseUA = require('../utils/userAgentParser');
const { addEntry } = require('../services/metadataService');

function handleUpload(req, res) {
  if (!req.file) {
    return res.send('No file uploaded');
  }

  const ua = parseUA(req);

  const entry = {
    sapid: req.body.sapid,
    name: req.body.name,
    filename: req.file.filename,
    browser: ua.browser,
    os: ua.os,
    device: ua.device,
    timestamp: new Date().toISOString()
  };

  addEntry(entry);
  res.send('Upload successful');
}

module.exports = handleUpload;
```

---

## controllers/listController.js

```js
const { loadData } = require('../services/metadataService');

function listUploads(req, res) {
  const data = loadData();
  res.json(data);
}

module.exports = listUploads;
```

---

## routes/uploadRoutes.js

```js
const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const handleUpload = require('../controllers/uploadController');

router.post('/', upload.single('myfile'), handleUpload);

module.exports = router;
```

---

## routes/listRoutes.js

```js
const express = require('express');
const router = express.Router();
const listUploads = require('../controllers/listController');

router.get('/', listUploads);

module.exports = router;
```

---

## public/index.html

```html
<!DOCTYPE html>
<html>
<body>
  <h2>Upload File</h2>

  <form action="/upload" method="POST" enctype="multipart/form-data">
    <label>SAPID:</label><br>
    <input type="text" name="sapid" required><br><br>

    <label>Name:</label><br>
    <input type="text" name="name" required><br><br>

    <label>File:</label><br>
    <input type="file" name="myfile" required><br><br>

    <button type="submit">Upload</button>
  </form>
</body>
</html>
```

