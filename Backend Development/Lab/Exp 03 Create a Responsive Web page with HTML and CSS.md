# Experiment 03: Create a Responsive Web Page with HTML and CSS

## Objective

Build a responsive web page from scratch using HTML5, CSS3, Flexbox, and Media Queries — no frameworks.

---

## Theory

### What is Responsive Design?
A responsive web page adapts its layout to the user's screen size. A page that looks great on a 1440px desktop should also work on a 375px phone.

### The Viewport Meta Tag
Browsers on phones render pages at ~980px by default (to show desktop sites). The viewport tag overrides this:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

| Attribute | Meaning |
|-----------|---------|
| `width=device-width` | Page width = device screen width |
| `initial-scale=1.0` | No zoom on page load |

Without this tag, mobile browsers shrink your page to fit — making text unreadable.

### CSS Flexbox (One-Dimensional Layout)
Flexbox lays out items in a **row** or **column**. The parent becomes a flex container:

```css
.container { display: flex; }          /* horizontal row */
.container { display: flex; flex-direction: column; } /* vertical stack */
```

Key properties on children (flex items):

| Property | What it does |
|----------|-------------|
| `flex: 1` | Item grows to fill available space |
| `flex-wrap: wrap` | Items wrap to next line when they don't fit |
| `gap: 20px` | Space between items |

### CSS Grid (Two-Dimensional Layout)
Grid lays out items in **rows AND columns** simultaneously:

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* 3 equal columns */
}
```

### Media Queries — Deep Dive

A media query applies CSS **only when a condition is true**:

```css
@media (max-width: 768px) {
  /* CSS rules here apply only when viewport ≤ 768px */
}
```

#### Breakpoint Conventions

| Breakpoint | Target Device | Typical Use |
|-----------|---------------|-------------|
| `≤ 480px` | Small phones | Single column, large touch targets |
| `≤ 768px` | Tablets | 2-column layout, sidebar collapses |
| `≤ 1024px` | Small laptops | Navigation condenses |
| `> 1024px` | Desktops | Full multi-column layout |

#### Common Media Query Patterns

```css
/* 1. Max-width (mobile-first: applies to small screens) */
@media (max-width: 768px) { ... }

/* 2. Min-width (desktop-first: applies to large screens) */
@media (min-width: 769px) { ... }

/* 3. Range (between two sizes) */
@media (min-width: 481px) and (max-width: 1024px) { ... }

/* 4. Print-specific */
@media print { ... }

/* 5. Orientation */
@media (orientation: portrait) { ... }
```

#### Use Cases

| Scenario | Media Query |
|----------|-------------|
| Hide sidebar on phone | `@media (max-width: 768px) { .sidebar { display: none; } }` |
| Stack columns on tablet | `@media (max-width: 768px) { .row { flex-direction: column; } }` |
| Larger font on desktop | `@media (min-width: 1025px) { body { font-size: 18px; } }` |
| Hide decorative image on print | `@media print { .hero-img { display: none; } }` |
| Adjust grid for wide screens | `@media (min-width: 1200px) { .grid { grid-template-columns: 1fr 1fr 1fr 1fr; } }` |

---

## Hands-on Tasks

### Task 1 — HTML Skeleton with Viewport

Create `index.html`:

<!-- filename: index.html -->
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responsive Page</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: Arial, sans-serif;
      background-color: #f0f0f0;
    }
    .header {
      background-color: #333;
      color: white;
      text-align: center;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>My Responsive Page</h1>
  </div>
</body>
</html>
```

**What changed:** Basic HTML with viewport tag and a styled header bar.

---

### Task 2 — Add a Flexbox Row (Desktop Layout)

Replace the `<body>` content with:

<!-- filename: index.html -->
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responsive Page</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: Arial, sans-serif;
      background-color: #f0f0f0;
    }
    .header {
      background-color: #333;
      color: white;
      text-align: center;
      padding: 20px;
    }
    .container {
      display: flex;
      gap: 20px;
      padding: 20px;
    }
    .card {
      flex: 1;
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .card h2 {
      margin-bottom: 10px;
      color: #333;
    }
    .card p {
      line-height: 1.6;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>My Responsive Page</h1>
  </div>
  <div class="container">
    <div class="card">
      <h2>Card 1</h2>
      <p>This is the first card. It sits side by side with others on desktop.</p>
    </div>
    <div class="card">
      <h2>Card 2</h2>
      <p>This is the second card. It has the same width as the others.</p>
    </div>
    <div class="card">
      <h2>Card 3</h2>
      <p>This is the third card. All three share space equally.</p>
    </div>
  </div>
</body>
</html>
```

**What changed:** Added `.container` with `display: flex` and three `.card` elements. On desktop they appear in a horizontal row.

---

### Task 3 — Make Cards Stack on Mobile (Media Query)

Add a media query to the `<style>` block. On screens ≤ 768px, cards stack vertically and grow full width:

<!-- filename: index.html -->
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responsive Page</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: Arial, sans-serif;
      background-color: #f0f0f0;
    }
    .header {
      background-color: #333;
      color: white;
      text-align: center;
      padding: 20px;
    }
    .container {
      display: flex;
      gap: 20px;
      padding: 20px;
    }
    .card {
      flex: 1;
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .card h2 {
      margin-bottom: 10px;
      color: #333;
    }
    .card p {
      line-height: 1.6;
      color: #666;
    }

    /* --- Mobile breakpoint --- */
    @media (max-width: 768px) {
      .container {
        flex-direction: column;  /* stack cards vertically */
      }
      .header h1 {
        font-size: 1.2rem;       /* smaller heading on mobile */
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>My Responsive Page</h1>
  </div>
  <div class="container">
    <div class="card">
      <h2>Card 1</h2>
      <p>This is the first card. It stacks vertically on mobile.</p>
    </div>
    <div class="card">
      <h2>Card 2</h2>
      <p>This is the second card. It appears below Card 1 on small screens.</p>
    </div>
    <div class="card">
      <h2>Card 3</h2>
      <p>This is the third card. All cards stack into a single column.</p>
    </div>
  </div>
</body>
</html>
```

**What changed:** Added `@media (max-width: 768px)` block that sets `flex-direction: column` so cards stack vertically on tablets/phones.

---

### Task 4 — Add a Responsive Navigation Bar

Add a nav bar above the header, and hide its links on mobile:

<!-- filename: index.html -->
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responsive Page</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: Arial, sans-serif;
      background-color: #f0f0f0;
    }
    /* --- Navigation --- */
    nav {
      background-color: #222;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    nav .logo {
      color: white;
      font-weight: bold;
      font-size: 1.2rem;
    }
    nav ul {
      list-style: none;
      display: flex;
      gap: 20px;
    }
    nav ul li a {
      color: white;
      text-decoration: none;
      padding: 5px 10px;
      border-radius: 4px;
    }
    nav ul li a:hover {
      background-color: #555;
    }
    /* --- Header --- */
    .header {
      background-color: #333;
      color: white;
      text-align: center;
      padding: 20px;
    }
    /* --- Cards --- */
    .container {
      display: flex;
      gap: 20px;
      padding: 20px;
    }
    .card {
      flex: 1;
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .card h2 {
      margin-bottom: 10px;
      color: #333;
    }
    .card p {
      line-height: 1.6;
      color: #666;
    }

    /* --- Tablet breakpoint --- */
    @media (max-width: 768px) {
      .container {
        flex-direction: column;
      }
      .header h1 {
        font-size: 1.2rem;
      }
      nav ul {
        gap: 10px;
      }
    }

    /* --- Phone breakpoint --- */
    @media (max-width: 480px) {
      nav {
        flex-direction: column;
        gap: 10px;
      }
      nav ul {
        flex-wrap: wrap;
        justify-content: center;
      }
    }
  </style>
</head>
<body>
  <nav>
    <div class="logo">MySite</div>
    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Services</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </nav>
  <div class="header">
    <h1>My Responsive Page</h1>
  </div>
  <div class="container">
    <div class="card">
      <h2>Card 1</h2>
      <p>This is the first card. The layout adjusts at two breakpoints.</p>
    </div>
    <div class="card">
      <h2>Card 2</h2>
      <p>This is the second card. The nav bar wraps on phones.</p>
    </div>
    <div class="card">
      <h2>Card 3</h2>
      <p>This is the third card. Resize the browser to see changes.</p>
    </div>
  </div>
</body>
</html>
```

**What changed:** Added a `<nav>` with logo and links. Two breakpoints: at 768px cards stack; at 480px the nav itself stacks vertically.

---

### Task 5 — Add a Footer and CSS Grid Layout

Replace the card container with CSS Grid and add a footer:

<!-- filename: index.html -->
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responsive Page</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: Arial, sans-serif;
      background-color: #f0f0f0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    /* --- Navigation --- */
    nav {
      background-color: #222;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    nav .logo {
      color: white;
      font-weight: bold;
      font-size: 1.2rem;
    }
    nav ul {
      list-style: none;
      display: flex;
      gap: 20px;
    }
    nav ul li a {
      color: white;
      text-decoration: none;
      padding: 5px 10px;
      border-radius: 4px;
    }
    nav ul li a:hover {
      background-color: #555;
    }
    /* --- Header --- */
    .header {
      background-color: #333;
      color: white;
      text-align: center;
      padding: 40px 20px;
    }
    /* --- Cards with Grid --- */
    .container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      padding: 20px;
      flex: 1;
    }
    .card {
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .card h2 {
      margin-bottom: 10px;
      color: #333;
    }
    .card p {
      line-height: 1.6;
      color: #666;
    }
    /* --- Footer --- */
    footer {
      background-color: #333;
      color: white;
      text-align: center;
      padding: 15px;
    }

    /* --- Tablet: 2 columns --- */
    @media (max-width: 768px) {
      .container {
        grid-template-columns: repeat(2, 1fr);
      }
      .header h1 {
        font-size: 1.2rem;
      }
      nav ul {
        gap: 10px;
      }
    }

    /* --- Phone: 1 column --- */
    @media (max-width: 480px) {
      .container {
        grid-template-columns: 1fr;  /* single column */
      }
      nav {
        flex-direction: column;
        gap: 10px;
      }
      nav ul {
        flex-wrap: wrap;
        justify-content: center;
      }
    }
  </style>
</head>
<body>
  <nav>
    <div class="logo">MySite</div>
    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Services</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </nav>
  <div class="header">
    <h1>My Responsive Page</h1>
    <p>Resize the browser window to see the layout change</p>
  </div>
  <div class="container">
    <div class="card">
      <h2>Card 1</h2>
      <p>On desktop, I am in a 3-column grid. On tablet I become 2-column. On phone I take full width.</p>
    </div>
    <div class="card">
      <h2>Card 2</h2>
      <p>Media queries let us redefine the grid at every breakpoint.</p>
    </div>
    <div class="card">
      <h2>Card 3</h2>
      <p>This approach uses pure CSS — no framework needed.</p>
    </div>
  </div>
  <footer>
    <p>&copy; 2026 My Responsive Page</p>
  </footer>
</body>
</html>
```

**What changed:** Switched from Flexbox to CSS Grid with `grid-template-columns: repeat(3, 1fr)`. Added a sticky footer. Two breakpoints: 2-column at 768px, 1-column at 480px.

---

## Concepts Reference

### Media Query Breakpoints Cheat Sheet

```css
/* Extra small (phone portrait) */
@media (max-width: 480px) { }

/* Small (phone landscape / small tablet) */
@media (min-width: 481px) and (max-width: 768px) { }

/* Medium (tablet) */
@media (min-width: 769px) and (max-width: 1024px) { }

/* Large (desktop) */
@media (min-width: 1025px) { }
```

### Flexbox vs Grid

| Aspect | Flexbox | Grid |
|--------|---------|------|
| Dimension | 1D (row OR column) | 2D (rows AND columns) |
| Best for | Navigation bars, card rows | Page layouts, dashboards |
| Alignment | `justify-content`, `align-items` | `justify-items`, `align-items`, `place-items` |

---

## Exercises

1. **Three Breakpoints:** Modify Task 5 so that at `> 1024px` the grid shows 4 columns (add a 4th card).
2. **Responsive Image:** Add an `<img>` inside one card. Use `max-width: 100%; height: auto;` to make it scale.
3. **Dark Mode:** Add a `@media (prefers-color-scheme: dark)` query that changes `background-color` to `#1a1a1a` and text to `#e0e0e0`.

---

## Viva Questions

1. **Why is the viewport meta tag necessary?**
   Without it, mobile browsers assume a 980px viewport and scale down the page, making text unreadable.

2. **What is the difference between `max-width` and `min-width` media queries?**
   `max-width` applies CSS when viewport is **at or below** the value (small screens). `min-width` applies when viewport is **at or above** (large screens).

3. **What is the mobile-first approach?**
   Writing base CSS for small screens and using `min-width` queries to add complexity for larger screens. It results in smaller, faster-loading base styles.

4. **What is the difference between Flexbox and Grid?**
   Flexbox handles one dimension (row or column). Grid handles two dimensions simultaneously (rows and columns).

5. **How does `box-sizing: border-box` help in responsive design?**
   It makes `width` include padding and border, so elements don't overflow their containers when padding is added.

---

## References

- [MDN: Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [MDN: Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)
- [MDN: Flexbox](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox)
- [MDN: Grid](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Grids)
