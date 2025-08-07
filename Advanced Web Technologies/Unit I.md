<style>
    :root{
        --hue:340;
        --hueAscent:10;
    }
</style>

# Unit I 
## Introduction to jQuery 


**jQuery** is a fast, lightweight, and feature-rich **JavaScript library** designed to simplify client-side scripting in web development. It provides an easy-to-use API for DOM manipulation, event handling, animations, and AJAX, making it compatible across different browsers.

---

### **jQuery Website**
The official jQuery website is:  [https://jquery.com/](https://jquery.com/)  

Here, you can find:
- Documentation & API references ([https://api.jquery.com/](https://api.jquery.com/))
- Downloadable versions (minified & uncompressed)
- Tutorials and blog posts
- Plugins repository ([https://plugins.jquery.com/](https://plugins.jquery.com/))  

---

### **Installation**
jQuery can be added to a project in multiple ways:

#### **1. CDN (Recommended for quick use)**



```html
<!-- Using jQuery's official CDN -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
```

#### **2. Downloading Manually**
- Visit [https://jquery.com/download/](https://jquery.com/download/)  
- Choose the **production** (minified) or **development** (uncompressed) version.  
- Include it in your HTML:
  ```html
  <script src="path/to/jquery.min.js"></script>
  ```

#### **3. Using npm/yarn (For Node.js/bundlers)**


```bash
npm install jquery
# or
yarn add jquery
```
Then import it in JavaScript:


```javascript
import $ from 'jquery';
```

---

### **Use Cases**
jQuery is useful for:
1. **DOM Manipulation** – Selecting, modifying, and traversing HTML elements.

```javascript
$("#myElement").hide();
```
2. **Event Handling** – Simplified click, hover, and form events.

```javascript
$("button").click(() => alert("Clicked!"));
```
3. **AJAX Requests** – Easy HTTP requests.

```javascript
$.get("https://api.example.com/data", (data) => console.log(data));
```
4. **Animations** – Built-in effects like `fadeIn()`, `slideUp()`, etc.
5. **Cross-browser Compatibility** – Works consistently across old browsers.

---

### **License**
jQuery is **open-source** and released under the **MIT License**, meaning:
- Free to use in personal & commercial projects  
- Allows modification & redistribution  
- Requires attribution (license notice in distributions)  

More details: [https://jquery.org/license/](https://jquery.org/license/)  

---

### **Is jQuery Still Used?**
While modern frameworks (React, Vue, Angular) have reduced jQuery's dominance, it remains useful for:
- Legacy projects  
- Quick prototyping  
- Simple websites needing light interactivity  




---

# Comparision **jQuery** with **vanilla JavaScript (plain JS)** and **modern alternatives** like React, Vue, and Angular.  



## **1. jQuery vs Vanilla JavaScript (Plain JS)**
### **Similarities**  
Both are used for:  
- DOM manipulation  
- Event handling  
- AJAX requests  

### **Key Differences**  

| Feature               | jQuery                              | Vanilla JavaScript                          |
|:-----|:-----|:-----|
| **Syntax**            | Shorter, chainable methods (`$()`)  | Verbose (`document.querySelector()`)        |
| **Browser Support**   | Handles cross-browser issues        | Requires manual polyfills for old browsers  |
| **AJAX**              | Simplified (`$.ajax()`)             | Uses `fetch()` or `XMLHttpRequest`          |
| **Animations**        | Built-in (`fadeIn()`, `slideUp()`)  | Requires CSS/JS animations                  |
| **Performance**       | Slightly slower (library overhead)  | Faster (no extra dependencies)              |

### **When to Use Which?**  
**Use jQuery if:**  
- Supporting old browsers (IE8-10)  
- Quick DOM manipulation in legacy projects  
- Need simple animations/AJAX without modern tooling  

**Use Vanilla JS if:**  
- Building modern, performance-critical apps  
- Using ES6+ features (Promises, `async/await`)  
- Avoiding unnecessary library overhead  

---

## **2. jQuery vs Modern Frameworks (React, Vue, Angular)**
### **Key Differences**  

| Feature          | jQuery                            | React / Vue / Angular                     |
|:-----|:-----|:-----|
| **Purpose**      | DOM manipulation & utilities      | Full-featured **component-based** apps    |
| **Rendering**    | Direct DOM updates (imperative)   | Virtual DOM / Reactive rendering          |
| **State Mgmt**   | Manual (no built-in solution)     | Built-in state management (Redux, Pinia)  |
| **Data Binding** | Manual updates                    | Automatic (React Hooks, Vue reactivity)   |
| **Scalability**  | Poor for large apps               | Designed for complex SPAs                 |
| **Tooling**      | Works standalone                  | Requires bundlers (Webpack, Vite)         |

### **When to Use Which?**  
**Use jQuery if:**  
- Adding interactivity to a static website  
- Maintaining an old codebase  
- Need a lightweight script without build tools  

**Use React/Vue/Angular if:**  
- Building **single-page applications (SPAs)**  
- Need **reusable components**  
- Working with dynamic data & APIs  
- Prefer modern tooling (HMR, SSR, TypeScript)  

---

## **3. Is jQuery Dead?**
- **No, but declining** in new projects.  
- **Modern browsers** have adopted many jQuery features (`querySelector`, `fetch`, `classList`).  
- **Frameworks** (React/Vue) handle DOM efficiently, reducing jQuery’s need.  
- **Still used** in WordPress plugins, legacy systems, and quick fixes.  

### **Alternatives to jQuery**  
| Use Case               | jQuery                | Modern Alternative               |
|:-----|:-----|:-----|
| **DOM Selection**      | `$("#element")`       | `document.querySelector()`       |
| **AJAX**               | `$.ajax()`            | `fetch()` + `axios`              |
| **Animations**         | `$(el).fadeIn()`      | CSS Transitions/GSAP             |
| **Event Handling**     | `$(el).on("click")`   | `el.addEventListener()`          |




---


### **Lecture 1: Introduction to jQuery & Setup**  
**Task**: Change text color of a `<div>` on button click.  
- **Conventional Method**:  

```html
<button id="btn">Click Me</button>
<div id="content">Hello World</div>
<script>
  document.getElementById("btn").addEventListener("click", function() {
    document.getElementById("content").style.color = "red";
  });
</script>
```
- **jQuery Method**:  

```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
  $(document).ready(function() {
    $("#btn").click(function() {
      $("#content").css("color", "red");
    });
  });
</script>
```
**Advantages**: Shorter syntax, cross-browser compatibility, built-in `document.ready`.  

---
# Experiment: Set up a local jQuery file vs. CDN and test loading time.  

## Objective

Compare **loading time** between:

1. A **local jQuery file**
2. jQuery loaded via a **CDN (Content Delivery Network)**


## Step 1: Prepare Two HTML Files

Create two HTML files in the same directory:

### `index.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>Local jQuery</title>
  <script src="./jquery-3.7.1.js"></script> Make sure this file exists locally
  <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.js"></script> -->
</head>
<body>
  <h1>Testing Local jQuery</h1>
  <p>time taken is <span id="time">being estimated</span></p>
  <script>
    const start = performance.now();

    $(document).ready(function () {
      const end = performance.now();
      var timeTaken = end - start;
      console.log("Local jQuery load time: " + (end - start).toFixed(2) + " ms");
      $(time).html(timeTaken +" ms");
    });
  </script>
</body>
</html>
```

> Place `jquery-3.7.1.min.js` in the same folder as this HTML file (download from [jquery.com](https://jquery.com/download/)).


---

## Step 2: Open Developer Tools

In your browser (Chrome/Firefox):

1. Right-click → Inspect → go to **Console** and **Network** tabs.
2. Open both files one at a time (in separate tabs or windows).
3. Look for:

* Console output: will show jQuery load time using `performance.now()`.
* Network tab: shows resource size, transfer time, and cache behavior.


---

### **Lecture 2: jQuery Selectors**  
**Task**: Hide all `<p>` elements with class `hidden`.  
- **Conventional Method**:  

```javascript
let paragraphs = document.querySelectorAll("p.hidden");
paragraphs.forEach(p => p.style.display = "none");
```
- **jQuery Method**:  

```javascript
$("p.hidden").hide();
```
**Advantages**: Simplified selection (CSS-style syntax), method chaining.  
**Experiment**: Compare performance (e.g., `document.querySelectorAll` vs. `$()`).  

---

### **Lecture 3: jQuery Filters**  
**Task**: Highlight the first and last `<li>` in a list.  
- **Conventional Method**:  

```javascript
let items = document.querySelectorAll("li");
items[0].style.backgroundColor = "yellow";
items[items.length - 1].style.backgroundColor = "yellow";
```
- **jQuery Method**:  

```javascript
$("li:first, li:last").css("background-color", "yellow");
```
**Advantages**: Built-in filters (`:first`, `:last`, `:even`, `:odd`).  
**Experiment**: Filter tables rows by odd/even indices.  

---

### **Lecture 4: Event Handling**  
**Task**: Toggle a menu on hover.  
- **Conventional Method**:  


```javascript
let menu = document.getElementById("menu");
menu.addEventListener("mouseenter", () => menu.style.display = "block");
menu.addEventListener("mouseleave", () => menu.style.display = "none");
```
- **jQuery Method**:  

```javascript
$("#menu").hover(
  () => $(this).show(), 
  () => $(this).hide()
);
```
**Advantages**: Combined events (`hover()`), simplified `this` binding.  
**Experiment**: Handle form `submit` events with `preventDefault()`.  

---

### **Lecture 5: DOM Manipulation**  
**Task**: Add a new `<li>` to a list.  
- **Conventional Method**:  

```javascript
let list = document.getElementById("myList");
let newItem = document.createElement("li");
newItem.textContent = "New Item";
list.appendChild(newItem);
```
- **jQuery Method**:  

```javascript
$("#myList").append("<li>New Item</li>");
```
**Advantages**: One-liner DOM updates, HTML string support.  
**Experiment**: Compare `append()` vs. `appendTo()`.  

---

### **Lecture 6: Animations**  
**Task**: Fade out a div on click.  
- **Conventional Method**:  

```javascript
// Requires manual CSS transitions/animations.
```
- **jQuery Method**:  

```javascript
$("#box").click(function() {
  $(this).fadeOut("slow");
});
```
**Advantages**: Pre-built animations (`fadeIn()`, `slideUp()`, etc.).  
**Experiment**: Chain animations (`fadeOut()` → `fadeIn()`).  

---

### **Lecture 7: CSS & Styling**  
**Task**: Add a class to buttons dynamically.  
- **Conventional Method**:  

```javascript
document.querySelectorAll("button").forEach(btn => {
  btn.classList.add("active");
});
```
- **jQuery Method**:  

```javascript
$("button").addClass("active");
```
**Advantages**: Batch operations, toggle/remove classes easily.  
**Experiment**: Toggle a dark/light theme with `toggleClass()`.  

---

### **Lecture 8: AJAX with jQuery**  
**Task**: Fetch data from an API.  
- **Conventional Method**:  

```javascript
fetch("https://api.example.com/data")
  .then(response => response.json())
  .then(data => console.log(data));
```
- **jQuery Method**:  

```javascript
$.get("https://api.example.com/data", function(data) {
  console.log(data);
});
```
**Advantages**: Simplified syntax, error handling via `.fail()`.  
**Experiment**: Load JSON data into a table.  

---

### **Lecture 9: Practical Project**  
**Task**: Build a to-do app with:  
1. Add/delete tasks (jQuery DOM manipulation).  
2. Highlight completed tasks (CSS classes).  
3. Save tasks to [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) (AJAX-like).  

**Compare**: Implement the same app with vanilla JS vs. jQuery.  

---

### **Key Takeaways**:  
- **Why jQuery?**: Faster development, fewer lines of code, cross-browser support.  
- **When to Avoid?**: For modern apps (use React/Vue), or when performance is critical.  


---

# Resources and references

- [https://htmlcheatsheet.com/jquery/](https://htmlcheatsheet.com/jquery/)
- [https://www.jquerycheatsheet.com/](https://www.jquerycheatsheet.com/)

- [https://jquery.com/](https://jquery.com/)
