# Jquery and AngularJS Lab Manual — Experiments 

**Audience:** Beginners to AngularJS (1.x) and jQuery. Assumes basic HTML/CSS/JavaScript knowledge.

**How to use this manual:**

* Each experiment contains: Objectives, Theory, Files to create, Step-by-step instructions, Hints, and Expected output.
* Create a project folder and copy the files exactly as named. Use a simple static server to avoid any browser restrictions when accessing local files (instructions below).

---

## Prerequisites & Setup

1. Editor: VS Code, Sublime Text, or any plain text editor.
2. Browser: Chrome/Firefox/Edge.
3. Recommended: Run a local static server (to avoid CORS or file:// issues):

```bash
# Python 3
python -m http.server 8000
# then open http://localhost:8000/ in your browser
```

4. Download or use CDNs for libraries (we use CDNs here for simplicity):

* jQuery 3.x CDN
* AngularJS 1.8.x CDN (latest 1.x series)

CDN links used in examples (already included in the sample files):

```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.3/angular.min.js"></script>
```

---

## Project folder structure (suggested)

```
angular-lab/
├─ exp2/
│  ├─ index.html            # jQuery experiments
│  └─ styles.css
├─ exp3/
│  ├─ index.html            # AngularJS tables examples
│  └─ app.js
├─ exp4/
│  ├─ registration.html     # Angular forms & validation
│  ├─ bill-payment.html     # Bill Payment Record app
│  └─ app.js
└─ README.md
```

---

# Experiment 2: jQuery CSS and Events

**Objectives**

1. Write a jQuery script to add a class to an element.
2. Write a jQuery script to access the position of an element.
3. Create a jQuery animation to manipulate multiple CSS properties (padding, color, etc.).

**Theory & Concepts introduced**

* jQuery selector basics: `$()` and chaining methods.
* `.addClass()` to add CSS classes.
* `.position()` and `.offset()` for location information.
* `.animate()` to change numeric CSS properties over time.
* Event handlers: `.click()`, `.on()`.

**Files to create**
`exp2/index.html`
`exp2/styles.css`

---

### exp2/index.html

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Experiment 2 - jQuery CSS and Events</title>
  <link rel="stylesheet" href="styles.css">
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>
  <div class="container">
    <h1>jQuery CSS & Events</h1>

    <section id="add-class">
      <h2>Add a class to an element</h2>
      <p id="para">This paragraph will change class when you click the button.</p>
      <button id="btn-add">Add .highlight</button>
    </section>

    <section id="position">
      <h2>Get element position</h2>
      <div id="pos-box">Position me</div>
      <button id="btn-pos">Show position</button>
      <p id="pos-output"></p>
    </section>

    <section id="animate">
      <h2>Animate multiple CSS properties</h2>
      <div id="anim-box">Animate me</div>
      <button id="btn-anim">Animate</button>
    </section>
  </div>

  <script>
    $(document).ready(function() {
      // 1. Add class to an element
      $("#btn-add").click(function() {
        $("#para").addClass("highlight");
      });

      // 2. Access position of an element
      $("#btn-pos").click(function() {
        // position() gives position relative to offset parent
        const pos = $("#pos-box").position();
        // offset() gives document position
        const off = $("#pos-box").offset();
        $("#pos-output").text(`position: top=${pos.top}, left=${pos.left}  |  offset: top=${off.top.toFixed(1)}, left=${off.left.toFixed(1)}`);
      });

      // 3. Animate multiple CSS properties
      $("#btn-anim").click(function() {
        $("#anim-box").animate({
          paddingLeft: "40px",
          paddingRight: "40px",
          height: "80px"
        }, 700, function() {
          // after animation, change color via CSS class (color cannot be animated via jQuery animate without plugin)
          $(this).addClass("anim-done");
        });
      });
    });
  </script>
</body>
</html>
```

---

### exp2/styles.css

```css
body { font-family: Arial, sans-serif; padding: 20px; }
.container { max-width: 800px; margin: auto; }
#pos-box, #anim-box { border: 1px solid #333; padding: 10px; display:inline-block; margin:10px 0; }
.highlight { background: #ffef9a; border-left: 4px solid #ffb347; padding: 6px; }
.anim-done { color: #fff; background: #4caf50; }
```

---

### Step-by-step Instructions (Exp 2)

1. Create the `exp2` folder and add `index.html` and `styles.css` with the content above.
2. Start your static server from the `angular-lab` directory and open `/exp2/index.html`.
3. Click **Add .highlight** — the paragraph should gain the `.highlight` class and change appearance.
4. Click **Show position** — the paragraph will show both `.position()` and `.offset()` values.
5. Click **Animate** — the `#anim-box` should expand its padding and height, then receive the `.anim-done` class.

**Hints**

* If color transitions are desired via `.animate()`, remember jQuery's `.animate()` only works on numeric properties; to animate colors you need the jQuery Color plugin or use CSS transitions and toggle classes.
* `.position()` is relative to the offset parent, `.offset()` is relative to the whole document.

**Assessment**

* Modify the animation so it toggles back to original size when clicking the button again (use `.is(':animated')` guard and track a boolean state).

---


# Instructor Hints (for grading)

* Award points for correctness of functionality, code readability, and use of Angular features (two-way binding, form state, filters).


