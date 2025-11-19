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


