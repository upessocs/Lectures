# jQuery Task/Question Bank with Hints

## Basic Selectors & DOM Manipulation

### Task 1: Select all paragraphs and change their text color to blue
**Hint**: Use the element selector `$("p")` and the `.css()` method.

### Task 2: Select an element with ID "main" and hide it
**Hint**: Use the ID selector `$("#main")` and the `.hide()` method.

### Task 3: Select all elements with class "highlight" and add a border
**Hint**: Use the class selector `$(".highlight")` and the `.css()` method.

### Task 4: Change the HTML content of a div with class "container"
**Hint**: Use the class selector `$(".container")` and the `.html()` method.

### Task 5: Change the text content of all elements with class "description"
**Hint**: Use the class selector `$(".description")` and the `.text()` method.

### Task 6: Select the first list item in an unordered list and make it bold
**Hint**: Use `$("ul li:first")` and the `.css()` method.

### Task 7: Select all even table rows and change their background color
**Hint**: Use `$("tr:even")` and the `.css()` method.

## Events

### Task 8: Add a click event to a button that shows an alert
**Hint**: Use the `.click()` method or `.on('click')` to bind the event handler.

### Task 9: Prevent a form from submitting and validate input
**Hint**: Use `event.preventDefault()` in the form's submit handler.

### Task 10: Change background color when mouse enters and leaves a div
**Hint**: Use the `.hover()` method with two handler functions.

### Task 11: Show a hidden div when a button is clicked
**Hint**: Use the `.click()` event handler and the `.show()` method.

### Task 12: Toggle a class on an element when it's clicked
**Hint**: Use the `.click()` event handler and the `.toggleClass()` method.

### Task 13: Update a character counter as user types in a textarea
**Hint**: Use the `.on('input')` event and check the length of the value.

## DOM Traversal & Manipulation

### Task 14: Find all children of a div and add a class to them
**Hint**: Use the `.children()` method and then `.addClass()`.

### Task 15: Find the parent of a button and change its background
**Hint**: Use the `.parent()` method and then `.css()`.

### Task 16: Find all siblings of a selected list item and hide them
**Hint**: Use the `.siblings()` method and then `.hide()`.

### Task 17: Append a new list item to an existing unordered list
**Hint**: Use the `.append()` method with the HTML string.

### Task 18: Prepend a new div to a container
**Hint**: Use the `.prepend()` method.

### Task 19: Remove all elements with class "temp" from the DOM
**Hint**: Use the `.remove()` method on the selected elements.

### Task 20: Create a new element and insert it after a specific div
**Hint**: Use the `.after()` method.

### Task 21: Clone an element and insert the clone elsewhere in the DOM
**Hint**: Use the `.clone()` and then `.appendTo()` methods.

## Effects & Animations

### Task 22: Create a fade-in effect for a hidden div
**Hint**: Use `.fadeIn()` method on a hidden element.

### Task 23: Create a slide toggle effect for a menu
**Hint**: Use the `.slideToggle()` method.

### Task 24: Animate an element's width and height simultaneously
**Hint**: Use the `.animate()` method with an object of properties.

### Task 25: Create a custom animation that moves an element diagonally
**Hint**: Use the `.animate()` method with 'left' and 'top' properties.

### Task 26: Chain multiple animations one after another
**Hint**: jQuery methods can be chained together.

### Task 27: Delay an animation by 2 seconds before executing
**Hint**: Use the `.delay()` method in the animation chain.

## Forms

### Task 28: Get the value from a text input and display it elsewhere
**Hint**: Use the `.val()` method to get the input value.

### Task 29: Check if a checkbox is checked
**Hint**: Use the `.is(':checked')` method.

### Task 30: Disable a submit button after it's clicked once
**Hint**: Use the `.prop('disabled', true)` method in the click handler.

### Task 31: Select all checked checkboxes and count them
**Hint**: Use `$('input[type="checkbox"]:checked')` and then `.length`.

### Task 32: Clear all input fields in a form
**Hint**: Use the `.val('')` method on form inputs.

### Task 33: Enable a button only when all required fields are filled
**Hint**: Check input values on the input event and set button disabled state accordingly.

## Advanced Concepts

### Task 34: Make an AJAX GET request to fetch data from an API
**Hint**: Use `$.get()` or `$.ajax()` method.

### Task 35: Make an AJAX POST request to submit form data
**Hint**: Use `$.post()` or `$.ajax()` method.

### Task 36: Handle AJAX errors and display a message
**Hint**: Use the `.fail()` method or error callback in `$.ajax()`.

### Task 37: Use event delegation for dynamically added elements
**Hint**: Use `.on()` with a selector parameter: `$(parent).on('event', 'selector', handler)`.

### Task 38: Create a simple plugin that adds a method to jQuery
**Hint**: Extend the jQuery prototype with `$.fn.methodName = function() {}`.

### Task 39: Store data on a DOM element using jQuery's data method
**Hint**: Use the `.data()` method to store and retrieve data.

### Task 40: Debounce a resize event handler for better performance
**Hint**: Use a timeout to limit how often the handler executes.
---

## HTML Structure for Practice

#### Learning Tips

1. Start with the basic selector tasks and DOM manipulation
2. Move on to events once you're comfortable with selectors
3. Practice DOM traversal before attempting animations
4. Save AJAX and advanced concepts for last
5. Try to solve each task without looking at the hint first
6. Experiment with variations of each task to deepen your understanding

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>jQuery Practice</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .container { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; }
        .highlight { background-color: yellow; }
        .hidden { display: none; }
    </style>
</head>
<body>
    <div id="main">
        <h1>jQuery Practice</h1>
        
        <div class="container">
            <p>This is a paragraph.</p>
            <p>This is another paragraph.</p>
        </div>
        
        <ul>
            <li>First item</li>
            <li>Second item</li>
            <li>Third item</li>
        </ul>
        
        <div class="highlight">This is a highlighted div.</div>
        
        <button id="myButton">Click Me</button>
        
        <form id="myForm">
            <input type="text" id="name" placeholder="Enter your name">
            <input type="checkbox" id="agree"> I agree
            <button type="submit">Submit</button>
        </form>
        
        <div id="result"></div>
    </div>

    <script>
        // Your jQuery code will go here
    </script>
</body>
</html>
```

## Have a look at below links


- [https://htmlcheatsheet.com/jquery/](https://htmlcheatsheet.com/jquery/)
- [https://quickref.me/jquery.html](https://quickref.me/jquery.html)
- [https://www.jquerycheatsheet.com/](https://www.jquerycheatsheet.com/)


