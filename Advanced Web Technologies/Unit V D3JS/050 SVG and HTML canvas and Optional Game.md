# 1. Basics of Canvas

**Canvas** (`<canvas>`) is a **pixel-based**, **immediate-mode** drawing surface.
This means:

* You draw using JavaScript (lines, shapes, text, images).
* After drawing, the browser “forgets” the shapes—you cannot edit them later unless you redraw everything.
* Good for **dynamic graphics**, games, real-time animations, and large datasets.

### * Canvas Example (Draw a Circle)

```html
<canvas id="myCanvas" width="300" height="200" style="border:1px solid #000"></canvas>

<script>
const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");

// Fill circle
ctx.beginPath();
ctx.arc(150, 100, 60, 0, Math.PI * 2);
ctx.fillStyle = "lightblue";
ctx.fill();

// Stroke border
ctx.strokeStyle = "black";
ctx.stroke();
</script>
```

---

# 2. Basics of SVG

**SVG** (Scalable Vector Graphics) is **vector-based** and **retained-mode**.

This means:

* You write shapes using XML tags (`<circle>`, `<rect>`, `<path>`).
* The browser keeps each shape as an object in the DOM.
* Shapes stay editable (CSS, JS can modify them anytime).
* Perfect for diagrams, charts, UI illustrations, and high-quality exports.

### * SVG Example

```html
<svg width="300" height="200" style="border:1px solid #000">
  <circle cx="150" cy="100" r="60" fill="lightgreen" stroke="black"/>
</svg>
```

---

# 3. Canvas vs SVG (Side-by-Side Comparison)

| Feature            | Canvas                           | SVG                                                 |
| ------------------ | -------------------------------- | --------------------------------------------------- |
| **Drawing type**   | Pixel-based (bitmap)             | Vector-based                                        |
| **Scalability**    | Loses quality when scaled        | Infinite resolution                                 |
| **Interactivity**  | Harder (manual hit detection)    | Easy (each shape is DOM element)                    |
| **Performance**    | Faster for many objects (10k+)   | Slower for huge scenes                              |
| **State**          | Not retained (must redraw)       | Objects retained and editable                       |
| **Best use cases** | Games, animations, image editing | Charts, diagrams, icons, GUIs, static illustrations |

---

# 4. Example: Create a Final Figure + Export as PNG

(Using **SVG → Canvas → PNG Download** technique)

This example:

1. Draws an SVG figure.
2. Converts it to Canvas.
3. Exports it as a PNG download.

### * Complete Working Example (HTML)

```html
<!DOCTYPE html>
<html>
<body>

<h3>SVG Figure → Export as PNG</h3>

<!-- Step 1: SVG figure -->
<svg id="mysvg" width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- background -->
  <rect width="300" height="200" fill="#fafafa"/>

  <!-- text -->
  <text x="150" y="40" font-size="22" text-anchor="middle" fill="black">
    Sample Figure
  </text>

  <!-- shapes -->
  <circle cx="100" cy="120" r="40" fill="lightblue" stroke="black"/>
  <rect x="160" y="80" width="80" height="80" fill="lightgreen" stroke="black"/>
</svg>

<br><br>

<!-- Step 2: Export button -->
<button onclick="exportPNG()">Download PNG</button>

<!-- Hidden canvas -->
<canvas id="canvas" width="300" height="200" style="display:none"></canvas>

<script>
function exportPNG() {
  const svg = document.getElementById("mysvg");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // Convert SVG to a data URL
  const data = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  // Draw SVG on Canvas
  const img = new Image();
  img.onload = function() {
    ctx.drawImage(img, 0, 0);

    // Create PNG download
    const pngURL = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = pngURL;
    a.download = "figure.png";
    a.click();

    // cleanup
    URL.revokeObjectURL(url);
  };
  img.src = url;
}
</script>

</body>
</html>
```

---

# 5. How this export works

1. **SVG is serialized** into XML text.
2. Browser loads it as an image.
3. Draws the image onto a hidden **Canvas**.
4. Uses `canvas.toDataURL("image/png")` to generate PNG.
5. Creates a downloadable link automatically.

This method gives:

* SVG quality drawing
* Canvas export flexibility
* PNG download

---

Below is a **very brief and minimal example** that shows how to export **Canvas** as **image/png**.

---

# Minimal Canvas to PNG Export Example

```html
<canvas id="c" width="200" height="150" style="border:1px solid #000"></canvas>
<button id="saveBtn">Download PNG</button>

<script>
// Draw something
const c = document.getElementById("c");
const ctx = c.getContext("2d");
ctx.fillStyle = "orange";
ctx.fillRect(30, 30, 140, 90);

// Export as PNG
document.getElementById("saveBtn").onclick = () => {
  const link = document.createElement("a");
  link.download = "canvas-image.png";
  link.href = c.toDataURL("image/png");
  link.click();
};
</script>
```



### What this does

1. Draws a simple orange rectangle on Canvas.
2. When you click **Download PNG**, it converts the canvas to PNG using:

```
canvas.toDataURL("image/png")
```

and triggers a download.

---
# Optional
---

# RGB, HSL, and HSLA Explained

## RGB (Red, Green, Blue)

RGB represents colors using three light components:

* **Red**: 0–255
* **Green**: 0–255
* **Blue**: 0–255

Example:
`rgb(255, 0, 0)` → pure red
`rgb(0, 255, 0)` → pure green
`rgb(0, 0, 255)` → pure blue

RGB is good for defining precise screen colors but not ideal for adjusting hue or lightness intuitively.

---

## HSL (Hue, Saturation, Lightness)

HSL represents colors in a more human-friendly way:

* **Hue**: angle 0–360 (color type)

  * 0 = red
  * 120 = green
  * 240 = blue
* **Saturation**: 0–100% (color intensity)
* **Lightness**: 0–100%

  * 0% = black
  * 50% = normal color
  * 100% = white

Example:
`hsl(200, 70%, 50%)` → a medium bright blue

HSL is easier for dynamic color generation because you can change hue or lightness independently.

---

## HSLA (Hue, Saturation, Lightness, Alpha)

HSLA adds transparency:

* Same H, S, L as HSL
* **Alpha**: 0–1

  * 0 = fully transparent
  * 1 = fully opaque

Example:
`hsla(200, 70%, 50%, 0.5)` → semi-transparent blue

---

# Simple HTML + JavaScript Snippet to Try HSL Colors

This example changes the background color based on a slider controlling the **hue** value.

```html

```

<h3>HSL Color Controller</h3>

<label>Hue (0–360)</label>
<input type="range" id="hue" min="0" max="360" value="180"><br><br>

<label>Saturation (0–100%)</label>
<input type="range" id="sat" min="0" max="100" value="70"><br><br>

<label>Lightness (0–100%)</label>
<input type="range" id="light" min="0" max="100" value="50"><br><br>

<p id="valueText">hsl(180, 70%, 50%)</p>

<div id="box" style="
  width:250px; 
  height:120px; 
  border:1px solid #000; 
  background:hsl(180, 70%, 50%);">
</div>

<script>
const hue = document.getElementById("hue");
const sat = document.getElementById("sat");
const light = document.getElementById("light");
const box = document.getElementById("box");
const text = document.getElementById("valueText");

function updateColor() {
  const h = hue.value;
  const s = sat.value;
  const l = light.value;

  const color = `hsl(${h}, ${s}%, ${l}%)`;
  box.style.background = color;
  text.textContent = color;
}

hue.oninput = updateColor;
sat.oninput = updateColor;
light.oninput = updateColor;
</script>

---

## Game Dev with SVG or HTML Canvas
1. A **simple Ping-Pong game** (Canvas)
2. A **Coin-Collection game** (SVG)
3. Visual **SVG graphics** showing the game logic
4. **Challenges** after each game

> Everything is beginner-friendly but structured so you can extend it into a real project.

---

# 1. Simple Ping-Pong Game (Canvas)

Goal: Move a paddle using arrow keys and bounce a ball.

## Core Logic Diagram (SVG)

A minimal diagram explaining the game logic:

<svg width="420" height="180" style="border:1px solid #000">
  <rect x="10" y="10" width="400" height="160" fill="#f9f9f9" stroke="black"/>
  
  <!-- Paddle -->
  <rect x="180" y="140" width="60" height="10" fill="#00aaff"/>
  <text x="190" y="135">Paddle</text>

  <!-- Ball -->
  <circle cx="200" cy="70" r="8" fill="orange"/>
  <text x="215" y="75">Ball</text>

  <!-- Arrows -->
  <text x="150" y="160">← move →</text>
</svg>

```html
<svg width="420" height="180" style="border:1px solid #000">
  <rect x="10" y="10" width="400" height="160" fill="#f9f9f9" stroke="black"/>
  
  <!-- Paddle -->
  <rect x="180" y="140" width="60" height="10" fill="#00aaff"/>
  <text x="190" y="135">Paddle</text>

  <!-- Ball -->
  <circle cx="200" cy="70" r="8" fill="orange"/>
  <text x="215" y="75">Ball</text>

  <!-- Arrows -->
  <text x="150" y="160">← move →</text>
</svg>
```

---

## Key Functions (Hints)

### **1. Setup Canvas**

```js
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
```

### **2. Paddle Object**

```js
const paddle = {
  x: 150,
  y: 280,
  width: 100,
  height: 12,
  speed: 7
};
```

### **3. Ball Object**

```js
const ball = {
  x: 200,
  y: 150,
  radius: 8,
  dx: 4,
  dy: -4
};
```

### **4. Draw Functions**

```js
function drawPaddle() {
  ctx.fillStyle = "lightblue";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "orange";
  ctx.fill();
}
```

### **5. Movement**

```js
document.addEventListener('keydown', e => {
  if (e.key === "ArrowLeft") paddle.x -= paddle.speed;
  if (e.key === "ArrowRight") paddle.x += paddle.speed;
});
```

### **6. Ball Physics**

```js
ball.x += ball.dx;
ball.y += ball.dy;

if (ball.x < 0 || ball.x > canvas.width) ball.dx *= -1;
if (ball.y < 0) ball.dy *= -1;

// Paddle collision
if (ball.y > paddle.y - ball.radius &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width) {
  ball.dy *= -1;
}
```

### **7. Game Loop**

```js
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  drawBall();
  requestAnimationFrame(loop);
}
loop();
```

---

## Challenges (Ping-Pong)

1. Add **score** when ball hits paddle.
2. Add **lives** when ball falls below screen.
3. Increase **ball speed** over time.
4. Make paddle controlled by **mouse**.
5. Add **sound effects** on hit.

---

# 2. Simple Coin Collection Game (SVG)

Goal: Move a player to collect coins on the screen.

SVG makes objects easy to click, detect, and animate.

---

## Game Logic Diagram (SVG)

<svg width="420" height="180" style="border:1px solid #000">
  <!-- Player -->
  <circle cx="60" cy="90" r="15" fill="steelblue"/>
  <text x="40" y="120">Player</text>

  <!-- Coins -->
  <circle cx="200" cy="50" r="10" fill="gold"/>
  <circle cx="320" cy="120" r="10" fill="gold"/>
  <text x="190" y="30">Coins</text>

  <!-- Direction arrows -->
  <text x="30" y="170">↑↓←→ to move</text>
</svg>


```html
<svg width="420" height="180" style="border:1px solid #000">
  <!-- Player -->
  <circle cx="60" cy="90" r="15" fill="steelblue"/>
  <text x="40" y="120">Player</text>

  <!-- Coins -->
  <circle cx="200" cy="50" r="10" fill="gold"/>
  <circle cx="320" cy="120" r="10" fill="gold"/>
  <text x="190" y="30">Coins</text>

  <!-- Direction arrows -->
  <text x="30" y="170">↑↓←→ to move</text>
</svg>
```

---

## Key SVG Game Functions (Hints)

### **1. Get SVG Elements**

```js
const player = document.getElementById("player");
const coins = document.querySelectorAll(".coin");
```

### **2. Player Position**

```js
let px = 60;
let py = 90;
```

### **3. Move Player**

```js
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") py -= 10;
  if (e.key === "ArrowDown") py += 10;
  if (e.key === "ArrowLeft") px -= 10;
  if (e.key === "ArrowRight") px += 10;

  player.setAttribute("cx", px);
  player.setAttribute("cy", py);

  checkCollisions();
});
```

### **4. Collision Detection**

```js
function hit(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx*dx + dy*dy) < 25; // rough hit radius
}

function checkCollisions() {
  coins.forEach(coin => {
    const cx = +coin.getAttribute("cx");
    const cy = +coin.getAttribute("cy");
    if (hit({x: px, y: py}, {x: cx, y: cy})) {
      coin.style.display = "none"; // collected!
    }
  });
}
```

---

# Challenges (Coin Game)

1. Add **score + sound** on coin pickup.
2. Add **bad obstacles** that reduce life.
3. Let coins **respawn** in new random positions.
4. Add **timer** to finish in limited time.
5. Add enemies that move in SVG using `animate` tag.

