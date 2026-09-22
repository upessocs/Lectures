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

### Task 1: Arrays
Create a script `script.js` that initializes an array of numbers, finds the sum of the elements, and prints the result.

### Task 2: Objects
Create an object representing a `Book` with properties like `title`, `author`, and `year`. Write a function to display the book details in a formatted string.

### Task 3: Node.js Execution
Run the created `script.js` using Node.js in the terminal.

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
