# Mastering Data Updates in D3.js: From Static to Animated Visualizations

## Summary

This tutorial explains the two stages of handling dynamic data in D3.js:

1. Updating charts **without animations**
2. Updating charts **with animations**


---

## index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>D3.js Chart Updates Tutorial</title>
    <link rel="stylesheet" href="./style.css">
    <script src="./d3.min.js"></script>
</head>
<body>

<h1>D3.js Chart Updates Tutorial</h1>


<div class="tutorial-section">
    <h2>Data Size Control</h2>

    <label>
        <input type="checkbox" id="autoSizeToggle">
        Change number of elements before each update
    </label>

    <div style="margin-top:10px;">
        <label>Elements: </label>
        <input type="range" id="sizeSlider" min="1" max="20" value="4" oninput="sizeValue.textContent=this.value">
        <span id="sizeValue">4</span>
    </div>
</div>



<div class="tutorial-section">
    <h2>Part 1: Update Without Animation</h2>
    <p>Direct updates. Changes apply instantly with no transitions.</p>

    <div class="chart-container"><div id="chart1"></div></div>
    <button onclick="updateWithoutAnimation()">Update Without Animation</button>

    <pre class="code-block">
    const bars = svg1.selectAll("rect").data(data);

    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => xScale1(i))
        .attr("y", d => yScale1(d))
        .attr("width", xScale1.bandwidth())
        .attr("height", d => height - yScale1(d));

    bars
        .attr("x", (d, i) => xScale1(i))
        .attr("y", d => yScale1(d))
        .attr("width", xScale1.bandwidth())
        .attr("height", d => height - yScale1(d));
    </pre>
</div>

<div class="tutorial-section">
    <h2>Part 2: Update With Animation</h2>
    <p>Smooth transitions between old and new values.</p>

    <div class="chart-container"><div id="chart2"></div></div>
    <button onclick="updateWithAnimation()">Update With Animation</button>

    <pre class="code-block">
    const bars = svg2.selectAll("rect").data(data);

    const enterBars = bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => xScale2(i))
        .attr("y", height)
        .attr("width", xScale2.bandwidth())
        .attr("height", 0)
        .attr("fill", "orange")
        .attr("stroke", "black");

    enterBars.merge(bars)
        .transition()
        .duration(1000)
        .attr("x", (d, i) => xScale2(i))
        .attr("y", d => yScale2(d))
        .attr("width", xScale2.bandwidth())
        .attr("height", d => height - yScale2(d));

    bars.exit()
        .transition()
        .duration(1000)
        .attr("y", height)
        .attr("height", 0)
        .remove();
    </pre>
</div>

<div style="text-align:center;margin:20px;">
    <button class="reset-btn" onclick="resetBothCharts()">Reset Both Charts</button>
</div>

<script src="./script.js"></script>
</body>
</html>
```

---

## script.js

This script contains both versions:

* `renderWithoutAnimation()`
* `renderWithAnimation()`

Both charts work independently and cleanly.

```js
const width = 400;
const height = 220;

/* ------------------------
   CHART 1 (NO ANIMATION)
-------------------------*/
const svg1 = d3.select("#chart1")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

let data1 = [40, 80, 55, 20];

function generateSizedArray() {
    const count = parseInt(document.getElementById("sizeSlider").value, 10);
    return Array.from({ length: count }, () => Math.floor(Math.random() * 100));
}


const xScale1 = d3.scaleBand().range([0, width]).padding(0.2);
const yScale1 = d3.scaleLinear().range([height, 0]);

function renderWithoutAnimation(data) {
    xScale1.domain(data.map((d, i) => i));
    yScale1.domain([0, d3.max(data)]);

    const bars = svg1.selectAll("rect").data(data);

    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => xScale1(i))
        .attr("y", d => yScale1(d))
        .attr("width", xScale1.bandwidth())
        .attr("height", d => height - yScale1(d));

    bars
        .attr("x", (d, i) => xScale1(i))
        .attr("y", d => yScale1(d))
        .attr("width", xScale1.bandwidth())
        .attr("height", d => height - yScale1(d));

    bars.exit().remove();
}

function updateWithoutAnimation() {
    // data1 = data1.map(() => Math.floor(Math.random() * 100));
    if (document.getElementById("autoSizeToggle").checked) {
        data1 = generateSizedArray();
    } else {
        data1 = data1.map(() => Math.floor(Math.random() * 100));
    }

    renderWithoutAnimation(data1);
}


/* ------------------------
   CHART 2 (WITH ANIMATION)
-------------------------*/
const svg2 = d3.select("#chart2")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

let data2 = [40, 80, 55, 20];

const xScale2 = d3.scaleBand().range([0, width]).padding(0.2);
const yScale2 = d3.scaleLinear().range([height, 0]);

function renderWithAnimation(data) {
    xScale2.domain(data.map((d, i) => i));
    yScale2.domain([0, d3.max(data)]);

    const bars = svg2.selectAll("rect").data(data);

    const enterBars = bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => xScale2(i))
        .attr("y", height)
        .attr("width", xScale2.bandwidth())
        .attr("height", 0)
        .attr("fill", "orange")
        .attr("stroke", "black");

    enterBars.merge(bars)
        .transition()
        .duration(1000)
        .attr("x", (d, i) => xScale2(i))
        .attr("y", d => yScale2(d))
        .attr("width", xScale2.bandwidth())
        .attr("height", d => height - yScale2(d));

    bars.exit()
        .transition()
        .duration(1000)
        .attr("y", height)
        .attr("height", 0)
        .remove();
}

function updateWithAnimation() {
    // data2 = data2.map(() => Math.floor(Math.random() * 100));
    if (document.getElementById("autoSizeToggle").checked) {
        data2 = generateSizedArray();
    } else {
        data2 = data2.map(() => Math.floor(Math.random() * 100));
}


    renderWithAnimation(data2);
}

/* ------------------------
   RESET BOTH
-------------------------*/
function resetBothCharts() {
    data1 = [40, 80, 55, 20];
    data2 = [40, 80, 55, 20];
    document.getElementById("sizeSlider").value = 4;
    document.getElementById("sizeValue").textContent = 4;
    document.getElementById("autoSizeToggle").checked = false;

    svg1.selectAll("*").remove();
    svg2.selectAll("*").remove();
    renderWithoutAnimation(data1);
    renderWithAnimation(data2);
}

renderWithoutAnimation(data1);
renderWithAnimation(data2);
```

---

## style.css

```css
body {
    font-family: Arial, sans-serif;
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
}

.tutorial-section {
    background: #f8f9fa;
    padding: 20px;
    margin: 30px 0;
    border-radius: 8px;
    border-left: 4px solid #007bff;
}

.chart-container {
    margin: 20px 0;
    padding: 15px;
    background: white;
    border: 1px solid #ccc;
}

button {
    padding: 10px 18px;
    background: #007bff;
    border: none;
    color: white;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background: #0056b3;
}

.reset-btn {
    background: #d9534f;
}

.reset-btn:hover {
    background: #c9302c;
}

.bar {
    fill: #4285f4;
}

.code-block {
    background: #222;
    color: #ddd;
    padding: 15px;
    font-size: 12px;
    border-radius: 4px;
    overflow-x: auto;
}
```































---



# D3’s **conceptual model** is:

1. **Enter** = what *needs to be created*
2. **Update** = what *needs to be updated*
3. **Exit** = what *needs to be removed*

But when you write JavaScript code, you do not actually call them in the conceptual order.
You call them in the **execution order**.


---

# 1. Conceptual model (theory)

When D3 binds data:

```
selection.data(data)
```

D3 internally computes three groups:

* **enter selection** → data items that have no DOM element yet
* **update selection** → data items that match existing DOM elements
* **exit selection** → DOM elements that no longer have data

This theoretical explanation in documentation follows the **lifecycle** of data → enter/update/exit.

---

# 2. Practical coding model (real code)

Most real-world D3 code is written like this:

```
const li = d3.select("#data1")
    .selectAll("li")
    .data(data);

// UPDATE
li.text(d => d);

// ENTER
li.enter()
  .append("li")
  .text(d => d);

// EXIT
li.exit().remove();
```

Notice the order:

1. **Update first**
2. **Enter second**
3. **Exit last**

Why?

### Reason 1 — You already have the update selection

`li` (the returned value from `.data(...)`) *is the update selection*.
So the most natural thing is to apply update logic immediately.

### Reason 2 — Enter selection needs its own block

`li.enter()` is a different selection.
You usually want to set all attributes/text for new elements there.

### Reason 3 — Exit must be removed last

You don't want to remove elements before you possibly reuse or transition them.

---

# 3. A clear example

### HTML

```
<ul id="data1"></ul>
```

### JS (correct D3 flow)

```
const li = d3.select("#data1")
  .selectAll("li")
  .data(data);

// UPDATE selection
li.text(d => d);

// ENTER selection
li.enter()
  .append("li")
  .text(d => d);

// EXIT selection
li.exit().remove();
```


---





# Understand d3:Data-driven Document update enter and exit process

## D3 Tutorial: Data Manipulation Using `<ul><li>`

> **enter → update → exit** 

This tutorial teaches the **core D3 ideology** using a simple but powerful example:
Updating a list (`<ul><li>`) when data changes.

> This is the same update cycle used for bar charts, scatter plots, maps, and dashboards.

---

# 1. Setup the HTML

```html
<ul id="dataList"></ul>
```

We will fill this `<ul>` based entirely on data.

---

# 2. Basic Dataset

```js
let data = [5, 12, 20];
```

---

# 3. Bind → Update → Enter → Exit Pattern

This is the **canonical D3 sequence**.

```js
function updateList(data) {
    // 1. BIND
    const li = d3.select("#dataList")
        .selectAll("li")
        .data(data);

    // 2. UPDATE
    li.text(d => d);

    // 3. ENTER
    li.enter()
        .append("li")
        .text(d => d);

    // 4. EXIT
    li.exit().remove();
}
```

Call the function:

```js
updateList(data);
```

---

# 4. Understanding Each Step in Depth

## Step 1 — BIND

```js
const li = d3.select("#dataList")
    .selectAll("li")
    .data(data);
```

What D3 does internally:

* Selects all `<li>` (even if zero)
* Binds the `data` array to them
* Creates three selections:

### 1. Update selection (`li`)

Existing elements matched with data

### 2. Enter selection (`li.enter()`)

New data items → need new DOM nodes

### 3. Exit selection (`li.exit()`)

Old DOM nodes with no data → must be removed

This is the core ideology:

> D3 compares DOM count with data count and categorizes everything.

---

## Step 2 — UPDATE (existing elements)

```js
li.text(d => d);
```

* Runs only on elements that already exist in DOM
* Ensures the DOM stays in sync with the new data
* Should always be applied before entering new elements

This is where you modify attributes, text, styles, etc.

---

## Step 3 — ENTER (create new elements)

```js
li.enter()
    .append("li")
    .text(d => d);
```

* Data items with no DOM nodes enter here
* `.enter()` holds only the “extra” data
* `.append("li")` creates new list elements for them

Enter selection is **only for new elements**.

---

## Step 4 — EXIT (remove unused elements)

```js
li.exit().remove();
```

* DOM nodes that no longer have data
* Must be removed to keep document consistent

Exit selection prevents “orphan DOM”.

---

# 5. Visualizing How D3 Splits Selections

Assume initial DOM:

```
<li>5</li>
<li>12</li>
<li>20</li>
```

New data:

```
[7, 9]
```

D3 creates:

### Update selection

matching 7 → first li
matching 9 → second li

### Enter selection

no new data → empty

### Exit selection

one extra DOM element → third li

So exit removes the last element.

---

# 6. Experiment: Expanding Data

```js
data = [10, 20, 30, 40, 50];
updateList(data);
```

* update runs for 3 existing `<li>`
* enter creates 2 new `<li>`

DOM becomes:

```
10
20
30
40
50
```

---

# 7. Experiment: Shrinking Data

```js
data = [99];
updateList(data);
```

* update updates the first li
* enter is empty
* exit removes the other li

DOM becomes:

```
99
```

---

# 8. D3 Methods Used (Explained Clearly)

### d3.select()

Selects a single DOM element.

### d3.selectAll()

Selects multiple DOM elements.

### .data(data)

Connects data to DOM nodes and produces three selections.

### update selection

The default returned selection from `.data()`.

### .enter()

Data with no DOM nodes.

### .exit()

DOM nodes with no data.

### .append()

Creates new DOM elements (commonly used with enter selection).

### .text()

Sets the text content.

### .remove()

Deletes DOM nodes.

---

# 9. Common Pitfalls When Updating Lists

## Pitfall 1: Applying update logic only on enter

Wrong:

```js
li.enter().append("li").text(d => d);
```

Existing elements will never update.

---

## Pitfall 2: Using `.enter()` in the middle of a chain

Wrong:

```js
.data(data)
.text(...)
.enter()  // selection switches here
.append(...)
.exit()   // now exit is broken
```

Always store your update selection first:

```js
const li = selection.data(data);
```

---

## Pitfall 3: Forgetting exit()

DOM grows forever even if data shrinks.

---

## Pitfall 4: Calling .enter().merge() incorrectly

Enter selection must merge with update selection when updating attributes.

---

# 10. Best Practices (for lists, charts, everything)

### Always store your update selection in a variable

```js
const sel = selection.data(data);
```

### Apply update logic before enter

Ensures consistent behavior.

### Remove exit elements

Keeps DOM in sync with data.

### Use .join() for simple cases

Modern D3:

```js
d3.select("#dataList")
  .selectAll("li")
  .data(data)
  .join("li")
  .text(d => d);
```



---

# D3.js Assignment 3

---

## Task 1 — Draw Shapes (Circle, Oval, Rectangle)

Create an SVG that displays at least three shapes.

### Requirements

* Add one **circle**
* Add one **oval** (ellipse)
* Add one **rectangle**
* All shapes must use data binding (`.data()` → `.enter()`)

### Hints

* Use `.append("circle")`, `.append("ellipse")`, `.append("rect")`

* For ellipse, use:
	`attr("rx", ...)`, `attr("ry", ...)`

* Try binding a small data array, for example:
	`[ {x:50, y:50, r:30}, ... ]`

* Apply fill using `.attr("fill", "steelblue")`

---

## Task 2 — Build a Pie Chart

Create a simple pie chart showing four categories of any numeric values.

### Requirements

* Use `d3.pie()` and `d3.arc()`

* Each slice should display a unique color
* Add a label near each slice

### Hints

* Start with data like `[30, 10, 20, 40]`

* Use:
	`const pie = d3.pie()(data);`
	`const arc = d3.arc().innerRadius(0).outerRadius(100);`

* Bind pie data using:
	`svg.selectAll("path").data(pie).enter().append("path")`

* Translate the entire chart using:
	`.attr("transform", "translate(150,150)")`

---

## Task 3 — Use HSL Color for Dynamic Fill

Modify any previous chart so each element gets a color generated using **HSL**.

### Requirements

* Use an HSL color formula
* Create variety by mapping data → hue, saturation, or lightness
* No fixed hex colors allowed

### Hints

* Use string format:
	`"hsl(" + hue + ", 70%, 50%)"`

* For bars or circles, try:
	`const hue = i * 40;`

* Try mapping value to lightness
	`const light = 20 + d * 1.5;`

---

## Task 4 — Line Plot (Simple Line Chart)

Create a line chart using D3's path generator.

### Requirements

* At least five data points
* Data must be scaled using `scaleLinear`
* Use `d3.line()` to construct the `d` attribute

### Hints

* Example dataset:
    `[{x:0,y:20}, {x:10,y:40}, ...]`

* Scales:
    `xScale = d3.scaleLinear().domain([...]).range([...])`
    `yScale = d3.scaleLinear().domain([...]).range([...])`

* Line generator:
    `const line = d3.line().x(d=>xScale(d.x)).y(d=>yScale(d.y));`

* Append path:
    `svg.append("path").attr("d", line(data))`

---

## Task 5 — Combine Any Two Tasks

Create a single SVG that combines **any two visualizations** (example: pie chart + line, scatterplot + shapes, etc.)

### Hints

* Use `g` groups with independent transforms for each visualization
* Prevent overlap by shifting one chart using
	`.attr("transform", "translate(300,0)")`


