# D3.js Tutorial – Bringing Data to Life in the Browser

D3.js (Data-Driven Documents) is a JavaScript library used to create **dynamic**, **interactive**, and **data-driven** visualizations inside the browser using **HTML, SVG, and CSS**.


> D3 works by **binding data to elements in the DOM (Document Object Model)** and then controlling those elements.

---

# Core Theory: The Data Join

The most important concept in D3 is the **data join**, which connects your data to visual elements.

For any dataset, D3 manages three states:

### 1. Enter

New data items that do not have corresponding DOM elements yet.
Used to **create** new bars, circles, rows, etc.

### 2. Update

Existing elements that still have data bound to them.
Used to **modify/update** bars when data changes.

### 3. Exit

DOM elements that no longer have data points.
Used to **remove** elements.

This enter–update–exit pattern is what makes D3 excellent for dynamic visualizations.

---

# Tutorial: Building a Simple Bar Chart

> Below is a clear, step-by-step version of the bar chart tutorial.


## Step 1: Create `index.html`

This loads D3 from CDN and an empty `<svg>` where the chart will be drawn.

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>D3 Bar Chart</title>
    <script src="https://d3js.org/d3.v7.min.js"></script>
</head>
<body>
    <svg id="chart"></svg>
    <script src="script.js"></script>
</body>
</html>
```

---

## Step 2: Create `script.js` (Main D3 File)

### 1. Dataset (Simple Array)

```javascript
const dataset = [30, 86, 150, 80, 200, 60, 120];
```

### 2. Chart Dimensions

```javascript
const margin = { top: 20, right: 30, bottom: 40, left: 40 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;
```

### 3. Select SVG and Make It Responsive

```javascript
const svg = d3.select("#chart")
    .attr("viewBox", `0 0 600 400`);
```

### 4. Create a Group Inside SVG (To Apply Margins)

```javascript
const g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
```

---

## Step 3: Create the Scales

### 1. X-Scale (scaleBand)

Used for **categories or indexed items** like bars.

```javascript
const xScale = d3.scaleBand()
    .domain(d3.range(dataset.length))
    .range([0, width])
    .padding(0.1);
```

### 2. Y-Scale (scaleLinear)

Used for **numerical values** like heights.

```javascript
const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([height, 0]);
```

---

## Step 4: Draw Bars (Enter Selection)

```javascript
g.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xScale(i))
    .attr("y", d => yScale(d))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - yScale(d))
    .attr("fill", "steelblue");
```

### Key points to understand:

* `.data(dataset)` binds data to rectangles
* `.enter()` handles new data points
* `.append("rect")` creates a new bar for each number
* `xScale(i)` positions bars
* Height is calculated as `height - yScale(d)` due to SVG’s coordinate system

---

## Step 5: Draw Axes

### X-Axis

```javascript
g.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).tickFormat(i => i + 1));
```

### Y-Axis

```javascript
g.append("g")
    .call(d3.axisLeft(yScale));
```

Axes are automatically created by passing the scales to D3’s built-in axis generators.

---

# Key D3 Concepts Covered

### 1. Selection

`d3.select()` and `d3.selectAll()` pick elements in the DOM.

### 2. Data Binding

`.data()` attaches data to those elements.

### 3. Enter Selection

`.enter()` creates new elements when data is more than existing DOM elements.

### 4. Scales

Translate **data values** into **screen positions**.

* `scaleBand()` for categorical spacing (bar widths, x-axis)
* `scaleLinear()` for numeric scales (heights, y-axis)

### 5. Axes

`d3.axisBottom()` and `d3.axisLeft()` automatically generate tick marks and labels.

---

# Why D3 Is Important for Theory Exams

* Based on the concept of **data-driven document manipulation**.
* Uses **enter-update-exit** pattern for efficient rendering.
* Provides **scales** to map data to pixel values.
* Uses **SVG** for vector-based drawings.
* Allows dynamic updates and interactions (event listeners, transitions).
* Widely used in modern web-based dashboards and analytics tools.

