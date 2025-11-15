

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

