
# Experiment 1
# **Lab Manual: jQuery Implementation**  

## **Objective**  
To understand jQuery basics, including event handling, DOM manipulation, and animations.  

---

## **Setup Procedure**  

### **1. Include jQuery in HTML**  
Add jQuery via CDN or local file:   


```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
```
 

### **2. Create a JavaScript File (`script.js`)**  
Link it before `</body>`:  


```html
<script src="script.js"></script>
```
 

---

## **Experiment 1: Basic jQuery Implementation**  

### **Task 1: Disable Right-Click Menu**  
**Code:**  

```javascript
$(document).ready(function() {
    $(document).on("contextmenu", function(e) {
        e.preventDefault();
    });
});
```


**Related Tasks:**  
- Disable text selection:  

```javascript
$(document).on("selectstart", function(e) { e.preventDefault(); });
```
 
- Disable Ctrl+C:  

```javascript
$(document).on("keydown", function(e) {
    if (e.ctrlKey && e.keyCode === 67) e.preventDefault();
});
```
 

---

### **Task 2: Click Image to Scroll to Top**  
**Code:**  

```javascript
$(document).ready(function() {
    $("#scrollTopImg").click(function() {
        $("html, body").animate({ scrollTop: 0 }, 500);
    });
});
```
 

**Related Tasks:**  
- Scroll to specific section:  

```javascript
$("#scrollBtn").click(function() {
    $("html, body").animate({ scrollTop: $("#section2").offset().top }, 500);
});
```
 

---

### **Task 3: Change Paragraph Color on Mouseover**  
**Code:**  

```javascript
$(document).ready(function() {
    $("p").hover(
        function() { $(this).css("color", "red"); },
        function() { $(this).css("color", ""); }
    );
});
```
 

**Related Tasks:**  
- Highlight table row:  

```javascript
$("tr").hover(
    function() { $(this).css("background", "yellow"); },
    function() { $(this).css("background", ""); }
);
```  

---

### **Task 4: Show/Hide Message on Button Click**  
**Code:**  

```javascript
$(document).ready(function() {
    $("#showBtn").click(function() { $("#messageDiv").show(); });
    $("#hideBtn").click(function() { $("#messageDiv").hide(); });
});
```
 
**Related Tasks:**  
- Toggle visibility:  

```javascript
$("#toggleBtn").click(function() { $("#messageDiv").toggle(); });
```  
- Fade effects:  

```javascript
$("#fadeInBtn").click(function() { $("#messageDiv").fadeIn(); });
$("#fadeOutBtn").click(function() { $("#messageDiv").fadeOut(); });
```  

---

## **Conclusion**  
This lab covers:  
- Event handling (`click`, `hover`).  
- DOM manipulation (`show`, `hide`, `css`).  
- Animations (`animate`, `fadeIn`, `fadeOut`).