# Question Bank 


## Suggested Key Points for Full Marks

When writing answers, students should:

1. Define or explain key terms clearly and concisely.
1. Use correct syntax in code snippets; pseudo-code is acceptable if syntax is correct.
1. Label diagrams (for architecture or event loop) neatly.
1. Highlight key features (e.g., advantages, steps, properties) in bullet form.
1. Explain the output or behavior of every code example.

For higher-mark questions, structure the answer:

1. Introduction – concept and purpose.
2. Main body – detailed explanation, flow diagrams, or code.
3. Conclusion/advantages/limitations – summarise key insights.

> Focusing on clarity, correctness of technical details, and linking theory with examples will ensure full marks.

---

Question Bank – jQuery and AngularJS

Section A – 5 Marks Questions (20 × 5 = 100 marks)

1. Define jQuery. Why is it called “write less, do more”? **Hint:  Include its lightweight nature, simplified DOM manipulation, cross-browser compatibility.**
2. Write the syntax to include jQuery in a webpage. **Hint:  `<script>` tag with CDN/local reference.**
3. Differentiate between id and class selectors in jQuery. **Hint:  Syntax: `$("#id") vs $(".class")`, usage examples.**
4. What is the role of the ready() function in jQuery? **Hint:  Ensures DOM is fully loaded before execution.**
5. Write a jQuery snippet to hide a paragraph on button click. **Hint:  `$("button").click(function(){ $("p").hide(); });`**
6. Define AngularJS. **Hint:  MVC framework, two-way data binding, client-side scripting.**
7. What is ng-model in AngularJS? **Hint:  Binds input, textarea, select to model data.**
8. Differentiate between ng-show and ng-hide. **Hint:  Both control visibility based on Boolean expression.**
9. Write a short note on AngularJS expressions. **Hint: ` {{ }}` binding, evaluated against scope, no control flow.**
10. What is $scope in AngularJS? **Hint:  Object linking controller with view, stores data and methods.**
11. Mention any two advantages of jQuery over JavaScript. **Hint:  Cross-browser, concise code, animations, AJAX support.**
12. Write syntax for chaining multiple filters in AngularJS. **Hint:  `{{ data | filter1 | filter2 }}`**
13. List any three jQuery event methods. **Hint:  `click(), hover(), keydown()`.**
14. What is ng-repeat? **Hint:  Directive for iterating collections.**
15. Differentiate between AngularJS directive and expression. **Hint:  Directives extend HTML; expressions bind data.**
16. What is the difference between text() and html() in jQuery? **Hint:  `text()` for plain text, `html()` for HTML content.**
17. Explain AngularJS filters briefly. **Hint:  Format data – currency, uppercase, filter.**
18. Write the syntax to create a custom directive in AngularJS. **Hint:  `app.directive("myDirective", function(){ return { ... } });`**
19. Define AJAX in jQuery. **Hint:  Asynchronous requests without reloading page.**
20. Mention any two AngularJS form validation states. **Hint:  `$dirty`, `$pristine`, `$valid`, `$invalid`.**
---

Section B – 15 Marks Questions (20 × 15 = 300 marks)

(Medium-length, explanations with examples, differences, code snippets)

1. Explain jQuery DOM traversal methods with examples. **Hint:  `parent(), children(), find(), siblings()`.**
2. Discuss jQuery effects: fadeIn(), fadeOut(), slideUp(), slideDown() with syntax. **Hint:  Show short code snippets.**
3. Compare JavaScript, jQuery, and AngularJS. **Hint:  Plain JS vs library vs framework, complexity, learning curve.**
4. Explain AngularJS two-way data binding with an example. **Hint:  Model ↔ View synchronization, use ng-model.**
5. Write a jQuery program to toggle visibility of a paragraph on button click. **Hint:  `toggle()` usage with example.**
6. Explain AngularJS directives with any 3 examples. **Hint:  `ng-model, ng-repeat, ng-bind`.**
7. Differentiate between AngularJS controller and service. **Hint:  Controller → binds scope; Service → reusable logic.**
8. Explain jQuery AJAX methods with a simple example. **Hint:  `$.ajax(), $.get(), $.post()`.**
9. What are AngularJS modules? Write steps to create and use a module. **Hint:  `angular.module("app", [])`, controller attachment.**
10. Explain AngularJS form validation with example. **Hint:  `ng-model`, validation attributes, error messages.**
11. Explain event delegation in jQuery. Why is it needed? **Hint:  Attaching events to parent using `.on()` for dynamic elements.**
12. Differentiate between ng-bind and expressions ({{ }}). **Hint:  Flash of unstyled content problem, cleaner binding.**
13. Write a short note on AngularJS scope hierarchy. **Hint:  Root scope, child scope, inheritance.**
14. Explain the role of $http service in AngularJS with example. **Hint:  AJAX-like service for REST APIs.**
15. Write jQuery code to validate a simple login form. **Hint:  Username not empty, password length check.**
16. Explain AngularJS filters with an example of custom filter. **Hint:  `app.filter("myFilter", function(){ return function(input){...}; });`**
17. Write a jQuery script to change CSS properties dynamically. **Hint:  `.css()` method usage.**
18. Discuss the MVC architecture of AngularJS. **Hint:  Model, View, Controller roles, `$scope` as bridge.**
19. Explain AngularJS $watch with an example. **Hint:  Watches scope variable changes and executes function.**
20. Explain the difference between AngularJS 1.x and jQuery in terms of data binding and DOM manipulation. **Hint:  AngularJS = declarative, data-driven; jQuery = imperative, DOM-focused.**
---

Section C – 20 Marks Questions (10 × 20 = 200 marks)

(Long-answer, in-depth explanations, programs, and diagrams)

1. Design a small jQuery-based image gallery with next/prev buttons. **Hint:  Use `hide(), show(), click()`, array of image paths.**
2. Write and explain an AngularJS application for a student result management system using ng-repeat and filters. **Hint:  Display list of students with marks, apply orderBy/filter.**
3. Explain in detail the working of AngularJS form validation with a code example. **Hint:  Form states, error highlighting, $dirty, $valid.**
4. Develop a jQuery form validation script for registration form (name, email, password, confirm password). **Hint:  Regex for email, password match, required fields.**
5. Explain AngularJS dependency injection with an example. **Hint:  Services injected into controllers, modularity.**
6. Compare AngularJS Directives and Components with examples. **Hint:  Custom reusable UI, lifecycle differences.**
7. Create a jQuery + AJAX example to fetch and display data from a JSON file. **Hint:  `$.getJSON()` or `$.ajax()`, DOM manipulation.**
8. Discuss the digest cycle in AngularJS with a diagram. **Hint:  How AngularJS checks model-view synchronization.**
9. Build a small AngularJS single-page application (SPA) with routing. **Hint:  Use ngRoute, multiple views, controllers.**
10. Explain differences between jQuery and AngularJS in terms of architecture, use cases, and data binding. Provide examples. **Hint:  jQuery = DOM-centric, AngularJS = MVC & data binding.**
---

5-Marks Questions  (30 questions)

Unit I – jQuery

1. Define jQuery and list any three advantages over plain JavaScript.
2. Write the steps to link a jQuery file using a CDN.
3. Differentiate between the jQuery `$(document).ready()` and window.onload event.
4. Give two examples of jQuery selectors with syntax and usage.
5. Explain the purpose of jQuery filters with one example.
6. Show a short code snippet to change the CSS background color of all `<p>` tags using jQuery.
7. Describe how to handle a button click event in jQuery.
8. Write jQuery code to create a simple fade-in animation.
9. What is event delegation in jQuery and why is it useful?
10. Mention any two differences between `.css()` and `.addClass()` in jQuery.

Unit II – AngularJS

11. What role does AngularJS play in front-end web development?
12. List the core concepts of AngularJS architecture.
13. Define two-way data binding with a simple example.
14. Name four commonly used built-in AngularJS directives and their purpose.
15. How do you create a custom directive? State the key steps.
16. Show an example of using AngularJS filters to format currency.
17. Explain the use of controllers in AngularJS.
18. How is form validation handled in AngularJS? Mention two directives used.
19. What is $scope in AngularJS?
20. Identify two common debugging tools/techniques for AngularJS applications.

Unit III – Node.js

21. Define Node.js and give two advantages over traditional web servers.
22. Contrast the traditional web server model with the Node.js process model.
23. Outline the steps to install Node.js on Windows.
24. What are Node.js modules? Name two types with examples.
25. Explain the role of the Node.js Event Emitter class.
26. What is the difference between Buffer and Stream in Node.js?
27. Write a short Node.js program to read and print a text file using a built-in module.
28. Explain the purpose of the Node Package Manager (NPM).
29. What is the Event Loop in Node.js?
30. Mention two advantages of using asynchronous I/O in Node.js.

---

15-Marks Questions  (10 questions)

Unit I – jQuery

1. Demonstrate, with code and explanation, how to animate an image that enlarges on hover and shrinks back when the mouse leaves.
2. Describe jQuery event handling in detail, including event binding, unbinding, and delegation with suitable code examples.

Unit II – AngularJS

3. Explain AngularJS two-way data binding mechanism and illustrate how it updates the view and the model simultaneously with a sample application.
4. Discuss AngularJS directives in detail. Differentiate between built-in and custom directives with code examples.
5. Describe AngularJS form validation. Create a simple form that validates an email field and displays an error message.

Unit III – Node.js

6. Explain the Node.js event-driven architecture. Describe how the Event Loop works with the help of a diagram.
7. Write and explain a Node.js program that creates a basic HTTP server and serves a static HTML file.
8. Discuss the different types of Node.js modules and how to create a custom module with code illustration.
9. Explain the working of the Node.js Event Emitter class with a small example of custom events.
10. Compare the traditional web server request handling model with the Node.js non-blocking model using a suitable diagram and examples.

---

25-Marks Questions  (10 questions)

Unit I – jQuery

1. Design a small jQuery application that dynamically changes the style of a list of items and adds a fade-out effect on clicking an item. Explain the code thoroughly.
2. Develop and explain a jQuery script that validates a simple registration form (name, email, password) and shows error messages without page reload.

Unit II – AngularJS

3. Create a complete AngularJS single-page application that displays a list of products and allows filtering by category using AngularJS filters. Explain the architecture and code.
4. Explain the MVC pattern in AngularJS with the help of a complete example showing model, view, and controller interaction.
5. Develop an AngularJS form with real-time validation and show how two-way data binding updates the UI as the user types. Provide and explain the code.

Unit III – Node.js

6. Develop a Node.js application that reads data from a file, processes it, and sends the result to the client via HTTP. Explain each part of the code.
7. Explain Node.js buffer and stream concepts with a program that streams a large file to the browser.
8. Write a Node.js application using EventEmitter to handle custom events. Explain the flow and event sequence.
9. Create a Node.js module that exposes multiple functions and demonstrate how to import and use it in another file. Provide full explanation.
10. Analyze the advantages and limitations of using Node.js for high-concurrency applications, with real-world examples.

