
# D3.js Lab Manual and Hands-On Tutorial

## Experiment 10: Data Visualization with SVG and D3.js

It includes:

1. Initial setup using Node.js + Express + Nodemon + Browser-Sync + Concurrently
2. Folder structure
3. `index.html` using D3 from CDN
4. `script.js` with commented examples
5. Experiments 10.1 to 10.4 with explanations and full runnable code.



---

# 1. Introduction to D3.js

D3.js (Data-Driven Documents) is a JavaScript library used to bind data to DOM elements and apply transformations to create dynamic, interactive data visualizations. It works mainly with **SVG**, **HTML**, and **Canvas**.

Core ideas:

* Select elements
* Bind data
* Enter, update, exit pattern
* Build shapes using SVG
* Build charts like bar charts, line charts
* Load external data formats (CSV, JSON)

---

# 2. Initial Project Setup

We will serve a simple web project using:

* **Express** (Node.js web server)
* **Nodemon** (auto-restart server)
* **Browser-Sync** (auto-reload browser)
* **Concurrently** (run both with a single command)

---

## 2.1 Folder Structure

```
d3-labs/
│── package.json
│── server.js
│── public/
│     ├── index.html
│     ├── script.js
│     └── data.csv
```

---

# 3. Node.js Environment Setup

Run these commands inside the project folder.

### Step 1: Initialize project

```
npm init -y
```

### Step 2: Install required packages

```
npm install express
npm install --save-dev nodemon browser-sync concurrently
```

### Step 3: Create `server.js`

```
const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
```

### Step 4: Add scripts to `package.json`

```
"scripts": {
  "server": "nodemon server.js",
  "sync": "browser-sync start --proxy 'localhost:3000' --files 'public/*.html, public/*.js, public/*.css'",
  "dev": "concurrently \"npm run server\" \"npm run sync\""
}
```

### Step 5: Start development server

```
npm run dev
```

This will:

* Run Express on port `3000`
* Auto-restart server on file change
* Auto-refresh browser on file change

---

# 4. index.html with D3.js from CDN

`public/index.html`

```
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>D3.js Lab Experiments</title>
</head>
<body>

    <h1>D3.js Experiments</h1>

    <svg id="chart" width="600" height="300"></svg>

    <script src="https://d3js.org/d3.v7.min.js"></script>
    <script src="script.js"></script>
</body>
</html>
```

---

# 5. script.js (Base File)

`public/script.js`

```
console.log("D3 Lab Loaded");

// Basic SVG reference
const svg = d3.select("#chart");
```

Additional experiment code will be appended below.

---

# 6. Experiment 10.1

## Create a Bar Chart Using SVG and D3.js

### Concepts Covered

* Binding data to SVG rectangles
* Scaling values
* Using `.attr()` to set SVG attributes

### Code (place inside script.js)

```
const data = [30, 80, 45, 60, 20, 90, 50];

const width = 600;
const height = 300;
const barWidth = width / data.length;

const yScale = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([0, height]);

svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * barWidth)
    .attr("y", d => height - yScale(d))
    .attr("width", barWidth - 2)
    .attr("height", d => yScale(d))
    .attr("fill", "steelblue");
```

Explanation:

* `selectAll("rect")` selects all rectangles (none exist yet).
* `.data(data)` binds the data array.
* `.enter()` creates placeholders for each element.
* Adding `<rect>` for each bar.

---

# 7. Experiment 10.2

## Create Circles and Rectangles with Interactive Controls

### Concepts:

* Creating multiple SVG shapes
* Adding mouse events
* Styling shapes using D3

### Code:

```
const shapesSvg = d3.select("body")
    .append("svg")
    .attr("width", 500)
    .attr("height", 200);

// Create circles
shapesSvg.selectAll("circle")
    .data([50, 150, 250, 350])
    .enter()
    .append("circle")
    .attr("cx", d => d)
    .attr("cy", 80)
    .attr("r", 25)
    .attr("fill", "orange")
    .on("mouseover", function () {
        d3.select(this).attr("fill", "red");
    })
    .on("mouseout", function () {
        d3.select(this).attr("fill", "orange");
    });

// Create rectangles
shapesSvg.selectAll("rect")
    .data([60, 160, 260, 360])
    .enter()
    .append("rect")
    .attr("x", d => d)
    .attr("y", 120)
    .attr("width", 40)
    .attr("height", 30)
    .attr("fill", "green")
    .on("click", function () {
        d3.select(this).attr("fill", "purple");
    });
```

---

# 8. Experiment 10.3

## Write Code to Select an Element and Modify Its Properties

### Concepts:

* Selecting an element via ID/Class
* Dynamically changing styles

### Add to HTML:

```
<div id="myDiv">Original Text</div>
```

### Code in script.js:

```
d3.select("#myDiv")
    .style("color", "blue")
    .style("font-size", "24px")
    .text("This text is modified by D3");
```

Explanation:

* `select("#myDiv")` selects the element.
* `.style()` sets CSS properties.
* `.text()` modifies content.

---

# 9. Experiment 10.4

## Fetch Data from CSV and Populate a Graph

### Step 1: Create a CSV file

`public/data.csv`

```
year,value
2016,30
2017,50
2018,80
2019,45
2020,90
```

### Step 2: Load and visualize CSV

```
d3.csv("data.csv").then(data => {

    data.forEach(d => {
        d.value = +d.value;// text to numeric +d.value same as Number(d.value)
    });

    const width = 600;
    const height = 300;

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.year))
        .range([0, width])
        .padding(0.3);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([height, 0]);

    const svg2 = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    svg2.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.year))
        .attr("y", d => yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.value))
        .attr("fill", "teal");
});
```

---

# 10. Summary

In this lab you learned:

1. Creating and serving a D3 project with Express, Nodemon, Browser-Sync, Concurrently
2. Using SVG with D3.js
3. Building bar charts
4. Creating interactive shapes
5. Selecting and modifying HTML elements
6. Loading CSV data and generating visualizations

---
---


# Common D3.js Methods: Summary, Explanation, Use Cases

---

# 1. d3.select()

### Summary

Selects a **single DOM element** (first match) and returns a D3 selection.

### Explanation

Works like `document.querySelector()`, but returns a D3 selection so you can chain D3 methods.

### Example

```
d3.select("h1").style("color", "blue");
```

### Use Case

Modify or bind data to one element such as:

* a specific SVG
* a div
* a single circle

---

# 2. d3.selectAll()

### Summary

Selects **all matching elements** from the DOM.

### Explanation

Works like `document.querySelectorAll()`, but D3 adds data-binding ability.

### Example

```
d3.selectAll("circle").attr("fill", "red");
```

### Use Case

Used when you want to:

* create multiple shapes
* update a list of SVG elements
* bind an array of data to multiple items

---

# 3. selection.data()

### Summary

Binds **an array of data** to selected DOM elements.

### Explanation

Matches each element with one data point.

### Example

```
d3.selectAll("rect").data([10, 20, 30]);
```

### Use Case

Essential for:

* charts
* repeating shapes
* dynamic lists

---

# 4. selection.enter()

### Summary

Represents **elements that need to be created** because there is more data than existing DOM elements.

### Explanation

`.enter()` contains placeholders for each new item.

### Example

```
d3.selectAll("rect")
  .data([10, 20, 30])
  .enter()
  .append("rect");
```

### Use Case

Used when building charts such as:

* bar charts
* scatter plots
* circles from array

---

# 5. selection.append()

### Summary

Adds a new DOM element to the selected parent.

### Explanation

Creates SVG or HTML elements dynamically.

### Example

```
d3.select("svg").append("circle");
```

### Use Case

Adding new shapes:

* `rect`
* `circle`
* `text`
* `g`

---

# 6. selection.attr()

### Summary

Sets or gets **attributes** of an SVG or HTML element.

### Explanation

Useful for position, size, id, class, etc.

### Example

```
d3.select("rect")
  .attr("x", 20)
  .attr("width", 50);
```

### Use Case

Used for SVG attributes like:

* x, y
* width, height
* cx, cy, r
* fill

---

# 7. selection.style()

### Summary

Applies **CSS styles** to elements.

### Example

```
d3.select("div").style("background", "lightgray");
```

### Use Case

Good for:

* coloring
* fonts
* borders

---

# 8. d3.scaleLinear()

### Summary

Maps a numeric input range to a numeric output range.

### Explanation

Commonly used for:

* mapping data values to pixel heights
* positioning items on an axis

### Example

```
const scale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, 300]);
```

### Use Case

Used in:

* bar heights
* circle radii
* scatter plot y-values

---

# 9. d3.scaleBand()

### Summary

Creates a scale for categorical data and helps space items evenly.

### Explanation

Transforms categories (years, names, labels) into pixel positions.

### Example

```
const x = d3.scaleBand()
  .domain(["A", "B", "C"])
  .range([0, 300])
  .padding(0.2);
```

### Use Case

Standard for:

* bar chart x-axis
* spacing categories evenly

---

# 10. domain()

### Summary

Defines the **input range** of the data.

### Example

```
scale.domain([0, 100]);
```

### Use Case

Defines what values you expect in data:

* min/max
* categories in scaleBand

---

# 11. range()

### Summary

Defines the **output range** (pixel space).

### Example

```
scale.range([0, 400]);
```

### Use Case

Defines:

* width of bar chart
* height of y-axis
* pixel spread

---

# 12. d3.axisBottom() / d3.axisLeft()

### Summary

Generates prebuilt axes.

### Example

```
const xAxis = d3.axisBottom(xScale);
svg.append("g").call(xAxis);
```

### Use Case

Displaying axes for:

* bar charts
* line charts

---

# 13. d3.csv()

### Summary

Loads and parses a CSV file.

### Example

```
d3.csv("data.csv").then(data => { ... });
```

### Use Case

Used for:

* reading real datasets
* student lab data
* graph input

---

# 14. selection.text()

### Summary

Sets or gets the text content of an element.

### Example

```
d3.select("h2").text("Updated Title");
```

### Use Case

Changing:

* labels
* axis numbers
* descriptions

---

# 15. selection.on()

### Summary

Adds event listeners.

### Example

```
d3.select("circle")
  .on("mouseover", () => console.log("hover"));
```

### Use Case

Makes visualizations interactive:

* hover
* click
* mouseout

---

# 16. d3.max(), d3.min()

### Summary

Finds maximum and minimum values in an array.

### Example

```
d3.max(data, d => d.value)
```

### Use Case

Setting domains for scales.

---

# 17. d3.line()

### Summary

Generates an SVG path string for line charts.

### Example

```
const line = d3.line()
  .x(d => x(d.year))
  .y(d => y(d.value));
```

### Use Case

Used for:

* line charts
* shape outlines

---

# Combined Example (Bar Chart Summary)

```
const svg = d3.select("svg");

const x = d3.scaleBand()
  .domain(data.map(d => d.name))
  .range([0, 500])
  .padding(0.2);

const y = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.value)])
  .range([300, 0]);

svg.selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", d => x(d.name))
  .attr("y", d => y(d.value))
  .attr("width", x.bandwidth())
  .attr("height", d => 300 - y(d.value))
  .attr("fill", "steelblue");
```

---
---

# D3.js Summary Table (Core Methods)

| Category     | Method                 | Summary                                               | Example                       | Use Case                        |
| ------------ | ---------------------- | ----------------------------------------------------- | ----------------------------- | ------------------------------- |
| Selection    | `d3.select()`          | Selects the first matching element                    | `d3.select("svg")`            | Modify one element              |
| Selection    | `d3.selectAll()`       | Selects all matching elements                         | `d3.selectAll("rect")`        | Lists, shapes, repeated items   |
| Selection    | `.append()`            | Adds a new element inside the selection               | `svg.append("rect")`          | Create SVG shapes dynamically   |
| Selection    | `.remove()`            | Deletes selected elements                             | `.remove()`                   | Remove bars, circles, text      |
| Selection    | `.attr()`              | Sets/gets HTML or SVG attributes                      | `.attr("width",50)`           | Position, size, color, etc.     |
| Selection    | `.style()`             | Sets CSS style properties                             | `.style("fill","blue")`       | Text color, borders, background |
| Selection    | `.text()`              | Sets text content                                     | `.text("Hello")`              | Titles, labels, values          |
| Selection    | `.html()`              | Sets HTML content inside selected element             | `.html("<b>Hi</b>")`          | Formatted text                  |
| Selection    | `.classed()`           | Adds/removes CSS classes                              | `.classed("active", true)`    | Toggling styles                 |
| Selection    | `.on()`                | Adds event listeners                                  | `.on("click", fn)`            | Interaction (hover, click)      |
| Data Binding | `.data()`              | Binds array to elements                               | `.data([10,20])`              | Bar heights, circles from data  |
| Data Binding | `.enter()`             | Creates placeholder for data with no matching element | `.enter().append("rect")`     | Populate chart elements         |
| Data Binding | `.exit()`              | Selects elements not matched by data                  | `.exit().remove()`            | Dynamic updates                 |
| Data Binding | `.join()`              | Simplifies enter/update/exit                          | `.join("rect")`               | Clean chart updates             |
| Scales       | `d3.scaleLinear()`     | Maps numeric data to numeric pixels                   | `scale(d)`                    | Bar height, scatter y-axis      |
| Scales       | `d3.scaleBand()`       | Maps categories to evenly spaced bands                | `x("A")`                      | Bar chart x-axis                |
| Scales       | `d3.scaleOrdinal()`    | Maps categories to discrete values (colors)           | `color("A")`                  | Coloring categories             |
| Scales       | `.domain()`            | Defines input range                                   | `.domain([0,100])`            | Min/max of data                 |
| Scales       | `.range()`             | Defines output pixels                                 | `.range([0,400])`             | Chart width, axis height        |
| Axes         | `d3.axisBottom()`      | Axis generator for x-axis                             | `svg.append("g").call(axis)`  | Bar/line chart x-axis           |
| Axes         | `d3.axisLeft()`        | Axis generator for y-axis                             |                               | y-axis                          |
| Shapes       | `d3.line()`            | Creates SVG line path generator                       | `line(data)`                  | Line charts                     |
| Shapes       | `d3.area()`            | Creates area chart generator                          | `area(data)`                  | Area charts                     |
| Shapes       | `d3.arc()`             | Creates arcs/pie slices                               | `arc(data)`                   | Pie charts, gauges              |
| Transitions  | `.transition()`        | Animates property changes                             | `.transition().duration(500)` | Smooth updates                  |
| Transitions  | `.duration()`          | Sets animation duration                               |                               | Control speed                   |
| Transitions  | `.delay()`             | Adds delay between transitions                        |                               | Sequential animations           |
| Loading Data | `d3.csv()`             | Loads CSV files                                       | `d3.csv("file.csv")`          | Data import                     |
| Loading Data | `d3.json()`            | Loads JSON files                                      | `d3.json("data.json")`        | API responses                   |
| Loading Data | `d3.tsv()`             | Loads tab-separated files                             |                               | Scientific data                 |
| Arrays       | `d3.max()`             | Returns max value                                     | `d3.max(data)`                | Scale domain                    |
| Arrays       | `d3.min()`             | Returns min value                                     |                               | Scale domain                    |
| Arrays       | `d3.sum()`             | Sums values                                           |                               | Aggregation                     |
| Arrays       | `d3.mean()`            | Average value                                         |                               | Stats                           |
| Arrays       | `d3.extent()`          | Returns [min, max]                                    |                               | Auto domain                     |
| Color        | `d3.interpolate*()`    | Color interpolation                                   | `d3.interpolateBlues(t)`      | Gradients, heatmaps             |
| Color        | `d3.scaleSequential()` | Continuous color scale                                |                               | Heatmaps                        |
| Layouts      | `d3.pie()`             | Converts values to pie slices                         |                               | Pie charts                      |
| Layouts      | `d3.stack()`           | Stacked data generator                                |                               | Stacked bar charts              |
| Layouts      | `d3.forceSimulation()` | Physics simulation for nodes                          |                               | Force-directed graphs           |
| Layouts      | `d3.tree()`            | Tree layout                                           |                               | Hierarchy visualization         |
| Layouts      | `d3.pack()`            | Circle packing layout                                 |                               | Bubble charts                   |

---

# Additional Compact Table (Most Frequently Used in Student Labs)

| Method             | Purpose                                      |
| ------------------ | -------------------------------------------- |
| `d3.select()`      | Select one element                           |
| `d3.selectAll()`   | Select multiple elements                     |
| `.append()`        | Create new SVG/HTML element                  |
| `.data()`          | Bind data                                    |
| `.enter()`         | Handle data points with no existing elements |
| `.attr()`          | Set SVG attributes                           |
| `.style()`         | Apply CSS                                    |
| `.text()`          | Set text                                     |
| `.on()`            | Add event listeners                          |
| `d3.scaleLinear()` | Numeric scales                               |
| `d3.scaleBand()`   | Categorical scales                           |
| `.domain()`        | Input data range                             |
| `.range()`         | Output pixel range                           |
| `d3.axisBottom()`  | X-axis generator                             |
| `d3.axisLeft()`    | Y-axis generator                             |
| `d3.csv()`         | Load CSV files                               |
| `d3.max()`         | Max value                                    |
| `d3.line()`        | Line generator                               |

