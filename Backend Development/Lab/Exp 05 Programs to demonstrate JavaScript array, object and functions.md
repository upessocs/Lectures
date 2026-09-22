# Lab Experiment 05

# Programs to demonstrate JavaScript array, object and functions

**Course Outcome:** CO2 – Create and build web pages and applications.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | Exp 05 |
| Unit | II |
| Topic | Programs to demonstrate JavaScript array, object and functions |
| Course Outcome | CO2 |
| Bloom's Knowledge Level | Apply |
| Skills Developed | Programming (JavaScript), Data structures implementation, Function definitions |
| Applications | Data handling in web applications, API data processing, UI component logic |
| PBL Activity | Implement a simple data management utility using Arrays and Objects |
| Assessment Method | Coding task / Lab Exercise |

---

## Part A – Theory

### 1. Introduction

JavaScript is a versatile language essential for backend development. Understanding how to work with data structures like Arrays and Objects, and organizing code using Functions, is fundamental for building scalable backend systems.

By the end of this lab, students will be able to:
1. Initialize and manipulate JavaScript arrays.
2. Define and access properties in JavaScript objects.
3. Write and invoke JavaScript functions to modularize code.

---

### 2. Concepts

#### JavaScript Arrays
Arrays are used to store multiple values in a single variable.
```javascript
const fruits = ['Apple', 'Banana', 'Mango'];
fruits.push('Orange');
```

#### JavaScript Objects
Objects are collections of related data and/or functionality, stored as key-value pairs.
```javascript
const student = {
    name: 'John Doe',
    age: 20
};
console.log(student.name);
```

#### JavaScript Functions
Functions are blocks of code designed to perform a particular task.
```javascript
function greet(name) {
    return `Hello, ${name}!`;
}
```

---

## Part B – Hands-On

### Task 1: Basic JavaScript
Create `script.js` to demonstrate arrays, objects, and functions.

```javascript
// 1. Arrays
const fruits = ['Apple', 'Banana', 'Mango'];
console.log('--- Array Demonstration ---');
console.log('Fruits array:', fruits);
fruits.push('Orange');
console.log('After push:', fruits);

// 2. Objects
const student = {
    name: 'John Doe',
    age: 20,
    course: 'Backend Development'
};
console.log('\n--- Object Demonstration ---');
console.log('Student object:', student);
console.log('Student Name:', student.name);

// 3. Functions
function greet(name) {
    return `Hello, ${name}! Welcome to Backend Development Lab.`;
}

console.log('\n--- Function Demonstration ---');
console.log(greet('Student'));
```

### Task 2: Advanced JavaScript Methods
Create `script2.js` to demonstrate string, array, and object manipulation methods.

```javascript
// --- String Methods ---
const str = "Backend Development";
console.log("--- String Methods ---");
console.log("Original:", str);

// toUpperCase(): Converts all characters in a string to uppercase
console.log("Upper Case:", str.toUpperCase());

// toLowerCase(): Converts all characters in a string to lowercase
console.log("Lower Case:", str.toLowerCase());

// split(): Splits a string into an array of substrings based on a delimiter
const words = str.split(" "); 
console.log("Split by space:", words);

// --- Array Methods (Add, Read, Update) ---
console.log("\n--- Array Methods ---");
let items = ['Node', 'Express'];

// Add: push() adds an element to the end of an array
items.push('MongoDB');
console.log("After Adding:", items);

// Read: Accessing an element by index
console.log("First Item (Read):", items[0]);

// Update: Changing an element by its index
items[0] = 'Node.js';
console.log("After Updating:", items);

// --- Object Methods (Add, Read, Update) ---
console.log("\n--- Object Methods ---");
let user = { name: "John", role: "Dev" };

// Add: Adding a new key-value pair to the object
user.age = 25;
console.log("After Adding Key:", user);

// Read: Accessing a value using dot notation
console.log("User Name (Read):", user.name);

// Update: Modifying an existing value
user.role = "Senior Dev";
console.log("After Updating Role:", user);
```

### Task 3: HTML Integration
Create `index.html` to run `script.js` in a browser.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Exp 5: JavaScript Demo</title>
</head>
<body>
    <h1>Exp 5: JavaScript Demo</h1>
    <p>Open the browser console (F12) to see the results.</p>
    <script src="script.js"></script>
</body>
</html>
```

### Task 4: Node.js Execution
Run `script.js` and `script2.js` using Node.js in the terminal.

---

## PBL Activity

### Problem Scenario
You need to manage a list of library books in a web application. Each book is an object. You need to create functions to add a new book to the list and to find a book by its title.

### Student Task
1. Define an array named `library`.
2. Implement a function `addBook(title, author)` to add a book object to the array.
3. Implement a function `findBook(title)` to search for a book object by title.
4. Test these functions using Node.js.

### Expected Learning
Students will demonstrate proficiency in managing collections of objects and using functions to perform CRUD operations in memory.

---

## Assessment Activity

### Assessment Method
Practical implementation of the PBL activity.

### Evaluation Criteria

| Criterion | Expected Evidence |
|---|---|
| Conceptual Understanding | Correct usage of objects and arrays |
| Practical Skill | Successful execution in Node.js |
| Problem Solving | Functional `addBook` and `findBook` |
| CO Attainment | Completion of the lab exercise |

---

## Summary

### Key Takeaways
- Arrays manage ordered lists of data.
- Objects store structured data as key-value pairs.
- Functions encapsulate logic, promoting reusability.

### Next Lecture
Client-Side Scripts for Form Validation using JavaScript.
