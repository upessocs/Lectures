# Common node packages (Optional Read)

## File System Interaction

### **fs (built-in)**
The native file system module - no installation needed.

```javascript
const fs = require('fs').promises; // Using promises API

// Read file
async function readFile() {
    try {
        const data = await fs.readFile('file.txt', 'utf8');
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}

// Write file
async function writeFile() {
    try {
        await fs.writeFile('output.txt', 'Hello World!');
        console.log('File written successfully');
    } catch (err) {
        console.error(err);
    }
}

// Append to file
async function appendFile() {
    try {
        await fs.appendFile('log.txt', 'New log entry\n');
    } catch (err) {
        console.error(err);
    }
}
```

### **fs-extra**
Enhanced version of fs with more methods and promise support.

```bash
npm install fs-extra
```

```javascript
const fse = require('fs-extra');

// Copy directory
fse.copySync('src/', 'dist/');

// Ensure directory exists
fse.ensureDirSync('logs/');

// Read JSON file
const config = fse.readJsonSync('config.json');
```

## Templating Engines

### **EJS (Embedded JavaScript)**
Simple and powerful templating.

```bash
npm install ejs
```

```javascript
const ejs = require('ejs');

const template = `
<h1>Hello, <%= name %>!</h1>
<ul>
    <% users.forEach(user => { %>
        <li><%= user.name %></li>
    <% }); %>
</ul>
`;

const data = {
    name: 'John',
    users: [{name: 'Alice'}, {name: 'Bob'}]
};

const html = ejs.render(template, data);
console.log(html);
```

### **Handlebars**
Logic-less templating syntax.

```bash
npm install handlebars
```

```javascript
const handlebars = require('handlebars');

const template = `
<div class="entry">
    <h1>{{title}}</h1>
    <div class="body">
        {{body}}
    </div>
    {{#if comments}}
    <h3>Comments:</h3>
    <ul>
        {{#each comments}}
        <li>{{this}}</li>
        {{/each}}
    </ul>
    {{/if}}
</div>
`;

const compiled = handlebars.compile(template);
const html = compiled({
    title: 'My Post',
    body: 'This is the content',
    comments: ['Great!', 'Nice post']
});
```

### **Pug (formerly Jade)**
Whitespace-sensitive templating.

```bash
npm install pug
```

```javascript
const pug = require('pug');

const template = `
html
    head
        title= pageTitle
    body
        h1= message
        ul
            each user in users
                li= user.name
`;

const compiled = pug.compile(template);
const html = compiled({
    pageTitle: 'My Page',
    message: 'Welcome!',
    users: [{name: 'Alice'}, {name: 'Bob'}]
});
```

## Additional Useful Packages

### **path (built-in)**
File path utilities.

```javascript
const path = require('path');

const fullPath = path.join(__dirname, 'files', 'data.txt');
const ext = path.extname('document.pdf'); // '.pdf'
const base = path.basename('/files/data.txt'); // 'data.txt'
```

### **dotenv**
Environment variable management.

```bash
npm install dotenv
```

```javascript
require('dotenv').config();

console.log(process.env.DATABASE_URL);
console.log(process.env.API_KEY);
```

### **nodemon**
Auto-restart server during development.

```bash
npm install -g nodemon
# or locally: npm install --save-dev nodemon
```

```json
// package.json
{
  "scripts": {
    "dev": "nodemon server.js"
  }
}
```

### **express**
Web application framework.

```bash
npm install express
```

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000);
```

### **moment.js (or date-fns)**
Date manipulation.

```bash
npm install moment
```

```javascript
const moment = require('moment');

console.log(moment().format('YYYY-MM-DD'));
console.log(moment().add(1, 'days').calendar());
```

### **axios**
HTTP client for making requests.

```bash
npm install axios
```

```javascript
const axios = require('axios');

async function fetchData() {
    try {
        const response = await axios.get('https://api.example.com/data');
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}
```

### **lodash**
Utility functions for common tasks.

```bash
npm install lodash
```

```javascript
const _ = require('lodash');

const array = [1, 2, 3, 4];
const chunked = _.chunk(array, 2); // [[1, 2], [3, 4]]
const deepCopy = _.cloneDeep(object);
```

These packages cover most common needs for file operations, templating, and general utility functions in Node.js applications.