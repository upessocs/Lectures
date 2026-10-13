# Experiment 07 & 08: ES6, DOM Manipulation, and Event Handling

## 1. Objective

To understand and apply **ES6 (ECMAScript 2015)** features in JavaScript, learn **DOM (Document Object Model) manipulation**, and implement **event handling** to build interactive web pages.

By the end of this experiment, you will be able to write modern JavaScript, dynamically modify HTML/CSS through the DOM, and respond to user interactions using event listeners.

---

## 2. Prerequisites

- Basic knowledge of HTML and CSS
- Familiarity with fundamental JavaScript (variables, functions, loops, conditionals)
- A text editor (VS Code recommended)
- A modern web browser (Chrome, Firefox, Edge)

---

## 3. Part A: ES6 (ECMAScript 2015) Features

ES6 introduced significant improvements to JavaScript, making code cleaner, more readable, and more powerful.

### 3.1 `let` and `const`

Before ES6, only `var` was available. ES6 introduced **block-scoped** declarations .

```javascript
// var — function-scoped, can be redeclared
var x = 10;
var x = 20; // allowed

// let — block-scoped, cannot be redeclared in same scope
let y = 10;
// let y = 20; // Error!

// const — block-scoped, cannot be reassigned
const z = 30;
// z = 40; // Error!

// Block scope demonstration
if (true) {
    let blockVar = "inside";
    var funcVar = "outside";
}
// console.log(blockVar); // ReferenceError
console.log(funcVar);     // "outside"
```

**Rule of thumb**: Use `const` by default, `let` when reassignment is needed, and avoid `var` in modern code.

### 3.2 Arrow Functions

Arrow functions provide a shorter syntax and do not bind their own `this` .

```javascript
// Traditional function
function add(a, b) {
    return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// Single parameter — parentheses optional
const square = x => x * x;

// No parameters
const greet = () => "Hello!";

// Multi-line arrow function
const multiply = (a, b) => {
    const result = a * b;
    return result;
};

console.log(add(3, 4));      // 7
console.log(square(5));      // 25
```

**Important**: Arrow functions do not have their own `this`. They inherit `this` from the enclosing scope — very useful in callbacks.

### 3.3 Template Literals

Template literals use backticks (`` ` ``) and allow string interpolation and multi-line strings.

```javascript
const name = "Alice";
const age = 25;

// Old way
const msg1 = "Hello, " + name + "! You are " + age + " years old.";

// Template literal
const msg2 = `Hello, ${name}! You are ${age} years old.`;

// Multi-line strings
const html = `
    <div>
        <h1>${name}</h1>
        <p>Age: ${age}</p>
    </div>
`;

// Expressions inside ${}
console.log(`Sum: ${5 + 3}`);       // Sum: 8
console.log(`Upper: ${name.toUpperCase()}`); // Upper: ALICE
```

### 3.4 Destructuring

Extract values from arrays or objects into distinct variables.

```javascript
// Array destructuring
const colors = ["red", "green", "blue"];
const [first, second, third] = colors;
console.log(first);  // "red"
console.log(second); // "green"

// Skip elements
const [, , thirdColor] = colors;
console.log(thirdColor); // "blue"

// Object destructuring
const person = { name: "Bob", age: 30, city: "Mumbai" };
const { name, age } = person;
console.log(name); // "Bob"
console.log(age);  // 30

// Renaming
const { name: fullName } = person;
console.log(fullName); // "Bob"

// Default values
const { country = "India" } = person;
console.log(country); // "India"
```

### 3.5 Spread and Rest Operators (`...`)

```javascript
// Spread — expand array/object
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
console.log(combined); // [1, 2, 3, 4, 5, 6]

// Copy array
const copy = [...arr1];

// Spread in objects
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 };
console.log(obj2); // { a: 1, b: 2, c: 3 }

// Rest — collect remaining arguments
function sum(...numbers) {
    return numbers.reduce((total, n) => total + n, 0);
}
console.log(sum(1, 2, 3, 4)); // 10

// Rest in destructuring
const [head, ...tail] = [10, 20, 30, 40];
console.log(head); // 10
console.log(tail); // [20, 30, 40]
```

### 3.6 Default Parameters

```javascript
function greet(name = "Guest", greeting = "Hello") {
    return `${greeting}, ${name}!`;
}

console.log(greet());              // "Hello, Guest!"
console.log(greet("Alice"));       // "Hello, Alice!"
console.log(greet("Bob", "Hi"));   // "Hi, Bob!"
```

### 3.7 Classes

ES6 introduced a cleaner syntax for creating objects and inheritance .

```javascript
class Animal {
    constructor(name, sound) {
        this.name = name;
        this.sound = sound;
    }

    speak() {
        return `${this.name} says ${this.sound}`;
    }

    static info() {
        return "Animals are living beings.";
    }
}

class Dog extends Animal {
    constructor(name) {
        super(name, "Woof");
    }

    fetch() {
        return `${this.name} is fetching the ball.`;
    }
}

const dog = new Dog("Rex");
console.log(dog.speak());   // "Rex says Woof"
console.log(dog.fetch());   // "Rex is fetching the ball."
console.log(Animal.info()); // "Animals are living beings."
```

### 3.8 Modules (`import` / `export`)

Split code into reusable files.

**`math.js`**:
```javascript
export const PI = 3.14159;

export function add(a, b) {
    return a + b;
}

export default function multiply(a, b) {
    return a * b;
}
```

**`main.js`**:
```javascript
import multiply, { PI, add } from './math.js';

console.log(PI);            // 3.14159
console.log(add(2, 3));     // 5
console.log(multiply(4, 5)); // 20
```

**Note**: To use modules in the browser, add `type="module"` to the `<script>` tag.

### 3.9 Promises and Async/Await

```javascript
// Promise
const fetchData = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve("Data loaded"), 1000);
    });
};

fetchData().then(data => console.log(data));

// Async/Await
async function loadData() {
    try {
        const data = await fetchData();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}
loadData();
```

### 3.10 Enhanced Object Literals

```javascript
const name = "Alice";
const age = 25;

// Shorthand property
const person = { name, age };

// Shorthand method
const calculator = {
    add(a, b) { return a + b; },
    subtract(a, b) { return a - b; }
};

// Computed property names
const key = "dynamicKey";
const obj = { [key]: "value" };
console.log(obj.dynamicKey); // "value"
```

---

## 4. Part B: DOM Manipulation

### 4.1 What is the DOM?

The **Document Object Model (DOM)** is a programming interface for HTML documents. When a browser loads an HTML page, it creates a tree-like structure where each HTML element becomes a **node**. JavaScript can access and modify this tree, dynamically changing the page without reloading.

```
document
  └── html
       ├── head
       │    └── title
       └── body
            ├── h1
            └── p
```

### 4.2 Selecting Elements

| Method | Description | Returns |
|--------|-------------|---------|
| `document.getElementById(id)` | Select by ID | Single element |
| `document.getElementsByClassName(class)` | Select by class | HTMLCollection |
| `document.getElementsByTagName(tag)` | Select by tag | HTMLCollection |
| `document.querySelector(selector)` | CSS selector | First match |
| `document.querySelectorAll(selector)` | CSS selector | NodeList |

```html
<div id="container">
    <p class="text">First paragraph</p>
    <p class="text">Second paragraph</p>
</div>
```

```javascript
// getElementById
const container = document.getElementById("container");

// getElementsByClassName
const paragraphs = document.getElementsByClassName("text");
console.log(paragraphs.length); // 2

// querySelector — returns first match
const firstPara = document.querySelector(".text");

// querySelectorAll — returns all matches
const allParas = document.querySelectorAll(".text");
allParas.forEach(p => console.log(p.textContent));
```

### 4.3 Modifying Content

```javascript
const heading = document.querySelector("h1");

// textContent — plain text only
heading.textContent = "New Heading";

// innerHTML — parses HTML tags
heading.innerHTML = "<em>Italic Heading</em>";

// innerText — respects CSS styling (visible text)
heading.innerText = "Visible Text";
```

**Security Warning**: Avoid using `innerHTML` with user-supplied data — it can lead to XSS (Cross-Site Scripting) attacks.

### 4.4 Modifying Attributes

```javascript
const link = document.querySelector("a");

// Get attribute
console.log(link.getAttribute("href"));

// Set attribute
link.setAttribute("href", "https://example.com");
link.setAttribute("target", "_blank");

// Remove attribute
link.removeAttribute("target");

// Direct property access
link.href = "https://example.com";
```

### 4.5 Modifying Styles

```javascript
const box = document.querySelector(".box");

// Inline styles (camelCase for CSS properties)
box.style.backgroundColor = "blue";
box.style.fontSize = "20px";
box.style.marginTop = "10px";

// Adding/removing CSS classes (preferred approach)
box.classList.add("highlight");
box.classList.remove("hidden");
box.classList.toggle("active"); // adds if absent, removes if present
console.log(box.classList.contains("active")); // true/false
```

### 4.6 Creating and Adding Elements

```javascript
// Create element
const newDiv = document.createElement("div");
newDiv.textContent = "I am new!";
newDiv.classList.add("card");

// Append to parent
const container = document.getElementById("container");
container.appendChild(newDiv);

// Insert before a specific child
const firstChild = container.firstElementChild;
container.insertBefore(newDiv, firstChild);

// Modern insertion methods
container.append(newDiv);       // inserts at end (can accept strings)
container.prepend(newDiv);      // inserts at beginning
firstChild.before(newDiv);      // inserts before
firstChild.after(newDiv);       // inserts after
```

### 4.7 Removing Elements

```javascript
const element = document.querySelector(".remove-me");

// Old way
element.parentNode.removeChild(element);

// Modern way
element.remove();
```

### 4.8 Traversing the DOM

```javascript
const item = document.querySelector(".item");

// Parent
item.parentElement;

// Children
item.children;          // HTMLCollection of element children
item.firstElementChild; // First child element
item.lastElementChild;  // Last child element

// Siblings
item.nextElementSibling;
item.previousElementSibling;
```

---

## 5. Part C: Event Handling

### 5.1 What is an Event?

An **event** is an action or occurrence that happens in the browser — a click, keypress, mouse movement, page load, form submission, etc. JavaScript can "listen" for these events and execute code in response.

### 5.2 Three Ways to Attach Event Handlers

**Method 1: HTML attribute (not recommended)**
```html
<button onclick="alert('Clicked!')">Click Me</button>
```

**Method 2: DOM property**
```javascript
const btn = document.querySelector("button");
btn.onclick = function() {
    alert("Clicked!");
};
// Only one handler allowed — overwrites previous
```

**Method 3: `addEventListener()` (recommended)**
```javascript
const btn = document.querySelector("button");
btn.addEventListener("click", function() {
    alert("Clicked!");
});

// Multiple listeners supported
btn.addEventListener("click", () => console.log("Second handler"));
```

### 5.3 Common Event Types

| Event | Triggered When |
|-------|----------------|
| `click` | Element is clicked |
| `dblclick` | Element is double-clicked |
| `mouseover` | Mouse enters element |
| `mouseout` | Mouse leaves element |
| `mousedown` / `mouseup` | Mouse button pressed/released |
| `keydown` / `keyup` | Key pressed/released |
| `keypress` | Character key pressed (deprecated) |
| `input` | Value changes in input field |
| `change` | Value committed (for select, checkbox) |
| `submit` | Form is submitted |
| `focus` / `blur` | Element gains/loses focus |
| `load` | Page or resource loaded |
| `scroll` | Page or element scrolled |
| `resize` | Window resized |

### 5.4 The Event Object

Every event handler receives an **event object** containing useful information.

```javascript
document.querySelector("button").addEventListener("click", function(event) {
    console.log(event.type);       // "click"
    console.log(event.target);     // Element that triggered event
    console.log(event.clientX);    // Mouse X coordinate
    console.log(event.clientY);    // Mouse Y coordinate
    console.log(event.timeStamp);  // Time since page load
});
```

### 5.5 Keyboard Events

```javascript
document.addEventListener("keydown", (event) => {
    console.log(`Key pressed: ${event.key}`);
    console.log(`Code: ${event.code}`);
    console.log(`Ctrl pressed: ${event.ctrlKey}`);
    console.log(`Shift pressed: ${event.shiftKey}`);
});
```

### 5.6 Form Events

```html
<form id="myForm">
    <input type="text" id="username" required>
    <button type="submit">Submit</button>
</form>
```

```javascript
const form = document.getElementById("myForm");

form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevents page reload
    const username = document.getElementById("username").value;
    console.log(`Submitted: ${username}`);
});

// Input event — fires on every keystroke
document.getElementById("username").addEventListener("input", (e) => {
    console.log(`Current value: ${e.target.value}`);
});
```

### 5.7 Event Bubbling and Capturing

Events propagate through the DOM in three phases:
1. **Capturing** — from root down to target
2. **Target** — at the target element
3. **Bubbling** — from target up to root

```html
<div id="outer">
    <button id="inner">Click Me</button>
</div>
```

```javascript
document.getElementById("outer").addEventListener("click", () => {
    console.log("Outer clicked");
});

document.getElementById("inner").addEventListener("click", () => {
    console.log("Inner clicked");
});

// Clicking the button logs:
// "Inner clicked"
// "Outer clicked"  ← because of bubbling
```

### 5.8 `stopPropagation()` and `preventDefault()`

```javascript
document.getElementById("inner").addEventListener("click", (event) => {
    event.stopPropagation(); // Stops bubbling to outer
    console.log("Inner clicked");
});

// preventDefault — stops default browser behavior
document.querySelector("a").addEventListener("click", (event) => {
    event.preventDefault(); // Prevents navigation
    console.log("Link clicked but not followed");
});
```

### 5.9 Event Delegation

Instead of attaching listeners to many elements, attach one to a parent and use `event.target`.

```html
<ul id="taskList">
    <li>Task 1</li>
    <li>Task 2</li>
    <li>Task 3</li>
</ul>
```

```javascript
document.getElementById("taskList").addEventListener("click", (event) => {
    if (event.target.tagName === "LI") {
        event.target.classList.toggle("done");
        console.log(`Clicked: ${event.target.textContent}`);
    }
});
```

**Benefits**: Works for dynamically added elements, uses less memory.

---

## 6. Practical Exercise: Interactive To-Do List

Combine ES6, DOM manipulation, and events into a working application.

**`index.html`**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>ES6 To-Do App</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 500px; margin: 40px auto; }
        input { padding: 8px; width: 70%; }
        button { padding: 8px 16px; cursor: pointer; }
        ul { list-style: none; padding: 0; }
        li { padding: 10px; border-bottom: 1px solid #ddd;
             display: flex; justify-content: space-between; }
        .done { text-decoration: line-through; color: gray; }
        .delete-btn { background: red; color: white; border: none; }
    </style>
</head>
<body>
    <h1>My To-Do List</h1>
    <input type="text" id="taskInput" placeholder="Enter a task...">
    <button id="addBtn">Add</button>
    <ul id="taskList"></ul>

    <script src="app.js"></script>
</body>
</html>
```

**`app.js`**:
```javascript
// State
let tasks = [];

// DOM elements
const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");

// ES6 class for Task
class Task {
    constructor(title) {
        this.id = Date.now();
        this.title = title;
        this.completed = false;
    }
}

// Render tasks
const renderTasks = () => {
    list.innerHTML = "";
    tasks.forEach(({ id, title, completed }) => {
        const li = document.createElement("li");
        li.dataset.id = id;

        const span = document.createElement("span");
        span.textContent = title;
        if (completed) span.classList.add("done");

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.classList.add("delete-btn");

        li.append(span, delBtn);
        list.appendChild(li);
    });
};

// Add task
const addTask = () => {
    const title = input.value.trim();
    if (!title) return;
    tasks = [...tasks, new Task(title)]; // spread operator
    input.value = "";
    renderTasks();
};

// Event listeners
addBtn.addEventListener("click", addTask);

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
});

// Event delegation for toggle & delete
list.addEventListener("click", (event) => {
    const li = event.target.closest("li");
    if (!li) return;
    const id = Number(li.dataset.id);

    if (event.target.classList.contains("delete-btn")) {
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
    } else {
        tasks = tasks.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        );
        renderTasks();
    }
});
```

**Concepts used**: `const`/`let`, arrow functions, template literals, destructuring, spread operator, classes, DOM selection, element creation, `classList`, event listeners, event delegation, `dataset`.

---

## 7. Summary Table

| Topic | Key Concepts |
|-------|--------------|
| **ES6** | `let`/`const`, arrow functions, template literals, destructuring, spread/rest, classes, modules, promises |
| **DOM** | `querySelector`, `createElement`, `appendChild`, `classList`, `style`, `innerHTML`, `textContent` |
| **Events** | `addEventListener`, event object, bubbling, `preventDefault`, `stopPropagation`, delegation |

---

## 8. Common Errors and Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot read property of null` | Selecting element before DOM loads | Move `<script>` to end of `<body>` or use `DOMContentLoaded` |
| Event handler not firing | Element not yet created | Use event delegation or wait for DOM load |
| `innerHTML` not updating | Typo in selector | Check `id`/`class` spelling |
| Arrow function `this` issue | Arrow functions don't bind `this` | Use regular function if you need dynamic `this` |
| Module import fails | Missing `type="module"` | Add `<script type="module" src="...">` |

**Example — waiting for DOM load**:
```javascript
document.addEventListener("DOMContentLoaded", () => {
    // Your DOM code here
});
```

---

## 9. Conclusion

In this experiment, you have:

- Explored modern **ES6 features** that make JavaScript cleaner and more powerful
- Learned how to **select, create, modify, and remove DOM elements**
- Understood how to attach and manage **event listeners**
- Applied **event bubbling, delegation, and prevention**
- Built an **interactive To-Do application** using all these concepts

These skills form the foundation of front-end web development and are essential before learning frameworks like React, Vue, or Angular, which build upon these same DOM and event principles.