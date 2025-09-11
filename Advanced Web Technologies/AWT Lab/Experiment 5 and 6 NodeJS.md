# Experiment 5 & 6
##  NodeJS Basic



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

### 1. Hello World Server

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
### 2. String Replacement with Regex

#### Explanation
This function uses a regular expression to replace two or more consecutive 'a's with the letter 'b'.

#### Code Snippet
```javascript
function replaceAsWithB(inputString) {
  // Regular expression to match two or more 'a's
  const regex = /a{2,}/g;
  return inputString.replace(regex, 'b');
}

// Example usage
const result = replaceAsWithB("aaapple banaana caaar");
console.log(result); // Output: "bpple banbna cbar"
```
---
### 3. HTTP Calculator

#### Explanation
This creates a calculator API that accepts HTTP GET requests with parameters for operation and numbers.

#### Code Snippet
```javascript
app.get('/calculate', (req, res) => {
  const { operation, num1, num2 } = req.query;
  const n1 = parseFloat(num1);
  const n2 = parseFloat(num2);
  
  let result;
  switch(operation) {
    case 'add':
      result = n1 + n2;
      break;
    case 'subtract':
      result = n1 - n2;
      break;
    case 'multiply':
      result = n1 * n2;
      break;
    case 'divide':
      result = n2 !== 0 ? n1 / n2 : 'Error: Division by zero';
      break;
    default:
      result = 'Error: Invalid operation';
  }
  
  res.json({ result });
});
```
---
### 4. Array Iteration

#### Explanation
This demonstrates different ways to iterate over arrays in Node.js.

#### Code Snippet
```javascript
function iterateArray(arr) {
  console.log("Array iteration methods:");
  
  // Using for loop
  console.log("1. Using for loop:");
  for (let i = 0; i < arr.length; i++) {
    console.log(`Index ${i}: ${arr[i]}`);
  }
  
  // Using forEach
  console.log("2. Using forEach:");
  arr.forEach((item, index) => {
    console.log(`Index ${index}: ${item}`);
  });
  
  // Using for...of
  console.log("3. Using for...of:");
  for (const item of arr) {
    console.log(`Item: ${item}`);
  }
}
```
---
## Final Working Code

### File 1: server.js
```javascript
const express = require('express');
const app = express();
const port = 3000;

// Hello World endpoint
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// String replacement endpoint
app.get('/replace', (req, res) => {
  const { text } = req.query;
  if (!text) {
    return res.status(400).json({ error: 'Text parameter is required' });
  }
  
  const regex = /a{2,}/g;
  const result = text.replace(regex, 'b');
  res.json({ original: text, replaced: result });
});

// Calculator endpoint
app.get('/calculate', (req, res) => {
  const { operation, num1, num2 } = req.query;
  const n1 = parseFloat(num1);
  const n2 = parseFloat(num2);
  
  if (isNaN(n1) || isNaN(n2)) {
    return res.status(400).json({ error: 'Invalid numbers provided' });
  }
  
  let result;
  switch(operation) {
    case 'add':
      result = n1 + n2;
      break;
    case 'subtract':
      result = n1 - n2;
      break;
    case 'multiply':
      result = n1 * n2;
      break;
    case 'divide':
      result = n2 !== 0 ? n1 / n2 : 'Error: Division by zero';
      break;
    default:
      return res.status(400).json({ error: 'Invalid operation. Use add, subtract, multiply, or divide' });
  }
  
  res.json({ operation, num1: n1, num2: n2, result });
});

// Array iteration endpoint
app.get('/iterate', (req, res) => {
  const array = [10, 20, 30, 40, 50];
  const iterations = [];
  
  // Using for loop
  iterations.push("Using for loop:");
  for (let i = 0; i < array.length; i++) {
    iterations.push(`Index ${i}: ${array[i]}`);
  }
  
  // Using forEach
  iterations.push("Using forEach:");
  array.forEach((item, index) => {
    iterations.push(`Index ${index}: ${item}`);
  });
  
  // Using for...of
  iterations.push("Using for...of:");
  for (const item of array) {
    iterations.push(`Item: ${item}`);
  }
  
  res.json({ array, iterations });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Available endpoints:');
  console.log('  GET / - Hello World');
  console.log('  GET /replace?text=your_text - Replace multiple a\'s with b');
  console.log('  GET /calculate?operation=add&num1=5&num2=3 - Calculator');
  console.log('  GET /iterate - Array iteration examples');
});
```

### File 2: package.json
```json
{
  "name": "nodejs-lab",
  "version": "1.0.0",
  "description": "NodeJS basic exercises lab",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "keywords": ["nodejs", "express", "lab"],
  "author": "Your Name",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

### File 3: README.md
```markdown
# NodeJS Lab Exercises

## How to Run
1. Install dependencies: `npm install`
2. Start the server: `npm start`
3. Open your browser and visit:
   - http://localhost:3000 - Hello World
   - http://localhost:3000/replace?text=aaapple banaana caaar - String replacement
   - http://localhost:3000/calculate?operation=add&num1=5&num2=3 - Calculator
   - http://localhost:3000/iterate - Array iteration examples

## API Endpoints
- GET `/` - Returns "Hello, World!"
- GET `/replace?text=your_text` - Replaces two or more a's with b
- GET `/calculate?operation=add&num1=5&num2=3` - Performs arithmetic operations
- GET `/iterate` - Demonstrates array iteration methods
```

## Running the Application

1. Save the code to the respective files
2. Install dependencies: `npm install`
3. Start the server: `node server.js` or `npm start`
4. Test the endpoints using a browser or tools like curl or Postman

Example requests:
- Visit http://localhost:3000
- Visit http://localhost:3000/replace?text=aaapple banaana caaar
- Visit http://localhost:3000/calculate?operation=add&num1=5&num2=3
- Visit http://localhost:3000/iterate
