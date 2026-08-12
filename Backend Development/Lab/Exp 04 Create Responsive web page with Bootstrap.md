# Experiment 04: Create Responsive Web Pages with Bootstrap and Tailwind CSS

## Objective

Build the same responsive page using two CSS frameworks — Bootstrap and Tailwind CSS — and understand their philosophies, common classes, and tradeoffs.

---

## Theory

### Why CSS Frameworks?
Writing responsive CSS from scratch (Exp 03) is educational but slow for production. Frameworks provide:
- Pre-tested responsive grid systems
- Consistent, cross-browser components (buttons, navbars, modals)
- Utility classes for rapid prototyping

### Two Philosophies

| | Bootstrap | Tailwind CSS |
|---|-----------|-------------|
| **Approach** | Component-based | Utility-first |
| **Style** | Pre-built (looks "Bootstrap-y" out of box) | Custom (you build the design) |
| **CSS File Size** | ~200KB (can be reduced with PurgeCSS) | ~3KB (after PurgeCSS removes unused classes) |
| **Customization** | Override SASS variables | Extend `tailwind.config.js` |

---

## Part A: Bootstrap

### Concept: The 12-Column Grid

Bootstrap divides the viewport into **12 equal columns**. You decide how many each element spans:

```
|----|----|----|----|----|----|----|----|----|----|----|----|
  1    2    3    4    5    6    7    8    9   10   11   12
```

```html
<div class="row">
  <div class="col-6">Takes 6/12 = 50% width</div>
  <div class="col-6">Takes 6/12 = 50% width</div>
</div>
```

### Common Bootstrap Classes Reference

#### Layout Classes

| Class | Purpose | Example |
|-------|---------|---------|
| `container` | Centered responsive wrapper | `<div class="container">` |
| `row` | Flex-based horizontal group | `<div class="row">` |
| `col` | Auto-width column | `<div class="col">` |
| `col-{n}` | Fixed-width column (out of 12) | `col-6` = 50% |
| `col-{bp}-{n}` | Column width at breakpoint | `col-md-6` = 50% at ≥768px |

#### Breakpoint Prefixes

| Prefix | Min Width | Target |
|--------|-----------|--------|
| `col-` | 0px | Extra small phones |
| `col-sm-` | 576px | Small tablets |
| `col-md-` | 768px | Tablets |
| `col-lg-` | 992px | Desktops |
| `col-xl-` | 1200px | Large desktops |
| `col-xxl-` | 1400px | Extra large screens |

#### Spacing Classes (Margin & Padding)

Pattern: `{property}{side}-{size}`

| Part | Values |
|------|--------|
| **Property** | `m` (margin), `p` (padding) |
| **Side** | `t` (top), `b` (bottom), `s` (start/left), `e` (end/right), `x` (horizontal), `y` (vertical), or blank (all) |
| **Size** | `0`, `1` (0.25rem), `2` (0.5rem), `3` (1rem), `4` (1.5rem), `5` (3rem), `auto` |

```
p-3    → padding: 1rem (all sides)
mx-auto → margin-left/right: auto (center block)
mt-2    → margin-top: 0.5rem
px-4    → padding-left/right: 1.5rem
```

#### Typography

| Class | Effect |
|-------|--------|
| `h1` .. `h6` | Heading styles |
| `text-start` / `text-center` / `text-end` | Alignment |
| `text-primary` / `text-danger` / `text-muted` | Color |
| `fw-bold` / `fw-light` | Font weight |
| `fs-1` .. `fs-6` | Font size scale |

#### Buttons

| Class | Style |
|-------|-------|
| `btn` | Base button |
| `btn-primary` | Blue filled |
| `btn-secondary` | Gray filled |
| `btn-outline-danger` | Red border, transparent |
| `btn-sm` / `btn-lg` | Size variants |

#### Cards

```html
<div class="card">
  <img src="..." class="card-img-top">
  <div class="card-body">
    <h5 class="card-title">Title</h5>
    <p class="card-text">Description</p>
    <a href="#" class="btn btn-primary">Go</a>
  </div>
</div>
```

#### Navbar

```html
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container">
    <a class="navbar-brand" href="#">Logo</a>
    <div class="collapse navbar-collapse">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link" href="#">Home</a></li>
      </ul>
    </div>
  </div>
</nav>
```

---

### Task 1 — Bootstrap Setup

<!-- filename: exp04-bootstrap.html -->
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bootstrap Responsive Page</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <h1>Bootstrap Page</h1>
</body>
</html>
```

**What changed:** Added Bootstrap 5 CDN link in `<head>`. All Bootstrap classes are now available.

---

### Task 2 — Responsive Navbar

<!-- filename: exp04-bootstrap.html -->
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bootstrap Responsive Page</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <a class="navbar-brand" href="#">MySite</a>
      <button class="navbar-toggler" type="button"
              data-bs-toggle="collapse" data-bs-target="#navMenu">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navMenu">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><a class="nav-link active" href="#">Home</a></li>
          <li class="nav-item"><a class="nav-link" href="#">About</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Services</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Contact</a></li>
        </ul>
      </div>
    </div>
  </nav>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

**What changed:** Added `navbar` with `navbar-expand-lg` (collapses to hamburger on screens < 992px). The JS bundle enables the toggle button.

---

### Task 3 — Hero Section with Grid Columns

<!-- filename: exp04-bootstrap.html -->
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bootstrap Responsive Page</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <a class="navbar-brand" href="#">MySite</a>
      <button class="navbar-toggler" type="button"
              data-bs-toggle="collapse" data-bs-target="#navMenu">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navMenu">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><a class="nav-link active" href="#">Home</a></li>
          <li class="nav-item"><a class="nav-link" href="#">About</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Services</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Contact</a></li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- Hero: 2 columns on desktop, stacked on mobile -->
  <div class="container my-5">
    <div class="row align-items-center">
      <div class="col-lg-6 mb-4 mb-lg-0">
        <h1 class="display-4 fw-bold">Welcome to MySite</h1>
        <p class="lead text-muted">
          Bootstrap makes responsive design fast. The grid automatically
          adjusts from 1 column on phones to 2 columns on desktops.
        </p>
        <a href="#" class="btn btn-primary btn-lg">Get Started</a>
        <a href="#" class="btn btn-outline-secondary btn-lg ms-2">Learn More</a>
      </div>
      <div class="col-lg-6 text-center">
        <img src="https://via.placeholder.com/500x300" class="img-fluid rounded shadow" alt="Hero Image">
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

**What changed:** Added a hero section using `row` + `col-lg-6`. On desktop: text and image side by side. On mobile: stacked vertically (because `col-lg-6` applies only at ≥992px).

---

### Task 4 — Card Grid Section

<!-- filename: exp04-bootstrap.html -->
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bootstrap Responsive Page</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <a class="navbar-brand" href="#">MySite</a>
      <button class="navbar-toggler" type="button"
              data-bs-toggle="collapse" data-bs-target="#navMenu">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navMenu">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><a class="nav-link active" href="#">Home</a></li>
          <li class="nav-item"><a class="nav-link" href="#">About</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Services</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Contact</a></li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- Hero -->
  <div class="container my-5">
    <div class="row align-items-center">
      <div class="col-lg-6 mb-4 mb-lg-0">
        <h1 class="display-4 fw-bold">Welcome to MySite</h1>
        <p class="lead text-muted">
          Bootstrap makes responsive design fast. The grid automatically
          adjusts from 1 column on phones to 2 columns on desktops.
        </p>
        <a href="#" class="btn btn-primary btn-lg">Get Started</a>
        <a href="#" class="btn btn-outline-secondary btn-lg ms-2">Learn More</a>
      </div>
      <div class="col-lg-6 text-center">
        <img src="https://via.placeholder.com/500x300" class="img-fluid rounded shadow" alt="Hero Image">
      </div>
    </div>
  </div>

  <!-- Cards: 3 columns on desktop, 1 on phone -->
  <div class="container my-5">
    <h2 class="text-center mb-4">Our Services</h2>
    <div class="row g-4">
      <div class="col-md-6 col-lg-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title text-primary">Web Design</h5>
            <p class="card-text">Beautiful, responsive websites built with modern frameworks and best practices.</p>
            <a href="#" class="btn btn-outline-primary">Learn More</a>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title text-success">Development</h5>
            <p class="card-text">Full-stack development with Node.js, Python, and cloud deployment.</p>
            <a href="#" class="btn btn-outline-success">Learn More</a>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title text-danger">SEO</h5>
            <p class="card-text">Optimize your site for search engines and drive organic traffic growth.</p>
            <a href="#" class="btn btn-outline-danger">Learn More</a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer class="bg-dark text-white text-center py-3">
    <p class="mb-0">&copy; 2026 MySite — Built with Bootstrap</p>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

**What changed:** Added card grid with `col-md-6 col-lg-4` (2 columns on tablet, 3 on desktop). `g-4` adds gutter spacing. `h-100` makes cards equal height.

---

## Part B: Tailwind CSS

### How Tailwind Classes Work

Tailwind provides **utility classes** — small, single-purpose classes you compose in HTML. The naming pattern is systematic:

### Spacing Scale (Padding & Margin)

All spacing follows a consistent scale: `0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96`

Each number maps to `N × 0.25rem` (4px per unit).

#### Padding Classes

| Class | Value | Pixels (approx) |
|-------|-------|-----------------|
| `p-0` | 0 | 0px |
| `p-1` | 0.25rem | 4px |
| `p-2` | 0.5rem | 8px |
| `p-3` | 0.75rem | 12px |
| `p-4` | 1rem | 16px |
| `p-5` | 1.25rem | 20px |
| `p-6` | 1.5rem | 24px |
| `p-8` | 2rem | 32px |
| `p-10` | 2.5rem | 40px |
| `p-12` | 3rem | 48px |
| `p-16` | 4rem | 64px |
| `p-20` | 5rem | 80px |

**Directional variants:**
| Class | Effect |
|-------|--------|
| `px-4` | Padding left + right |
| `py-4` | Padding top + bottom |
| `pt-4` | Padding top only |
| `pb-4` | Padding bottom only |
| `ps-4` | Padding start (left in LTR) |
| `pe-4` | Padding end (right in LTR) |

#### Margin Classes

Same scale as padding, but with `m` prefix:

| Class | Value | Pixels |
|-------|-------|--------|
| `m-0` | 0 | 0px |
| `m-1` | 0.25rem | 4px |
| `m-2` | 0.5rem | 8px |
| `m-4` | 1rem | 16px |
| `m-auto` | auto | Centered |
| `mx-auto` | margin: 0 auto | Center block |
| `mt-4` | margin-top | 16px |
| `mb-8` | margin-bottom | 32px |
| `ml-4` | margin-left | 16px |
| `mr-4` | margin-right | 16px |

### Width & Height Classes

| Class | Value |
|-------|-------|
| `w-full` | width: 100% |
| `w-1/2` | width: 50% |
| `w-1/3` | width: 33.33% |
| `w-1/4` | width: 25% |
| `max-w-sm` | max-width: 24rem (384px) |
| `max-w-md` | max-width: 28rem (448px) |
| `max-w-lg` | max-width: 32rem (512px) |
| `max-w-xl` | max-width: 36rem (576px) |
| `max-w-2xl` | max-width: 42rem (672px) |
| `h-screen` | height: 100vh |
| `min-h-screen` | min-height: 100vh |

### Typography Classes

| Class | Effect |
|-------|--------|
| `text-xs` | 0.75rem (12px) |
| `text-sm` | 0.875rem (14px) |
| `text-base` | 1rem (16px) |
| `text-lg` | 1.125rem (18px) |
| `text-xl` | 1.25rem (20px) |
| `text-2xl` | 1.5rem (24px) |
| `text-3xl` | 1.875rem (30px) |
| `text-4xl` | 2.25rem (36px) |
| `font-bold` | font-weight: 700 |
| `font-semibold` | font-weight: 600 |
| `font-medium` | font-weight: 500 |
| `text-center` | text-align: center |
| `text-left` | text-align: left |
| `text-right` | text-align: right |
| `leading-tight` | line-height: 1.25 |
| `leading-normal` | line-height: 1.5 |
| `tracking-wide` | letter-spacing: 0.05em |

### Color Classes

Pattern: `text-{color}` (text) or `bg-{color}` (background)

| Class | Color |
|-------|-------|
| `text-black` / `bg-black` | #000 |
| `text-white` / `bg-white` | #fff |
| `text-gray-500` / `bg-gray-100` | Gray scale (100–900) |
| `text-red-500` / `bg-red-100` | Red scale |
| `text-blue-500` / `bg-blue-100` | Blue scale |
| `text-green-500` / `bg-green-100` | Green scale |
| `text-yellow-500` / `bg-yellow-100` | Yellow scale |
| `text-primary` | Brand primary (custom) |

**Opacity modifier:** `bg-black/50` = black at 50% opacity.

### Border & Rounded

| Class | Effect |
|-------|--------|
| `border` | 1px solid border |
| `border-2` | 2px solid border |
| `border-gray-300` | Gray border |
| `rounded` | 0.25rem radius |
| `rounded-lg` | 0.5rem radius |
| `rounded-xl` | 0.75rem radius |
| `rounded-full` | 9999px (pill/circle) |

### Shadow

| Class | Effect |
|-------|--------|
| `shadow-sm` | Small shadow |
| `shadow` | Default shadow |
| `shadow-lg` | Large shadow |
| `shadow-xl` | Extra large shadow |

### Flexbox & Grid Utilities

| Class | Effect |
|-------|--------|
| `flex` | display: flex |
| `flex-row` | flex-direction: row |
| `flex-col` | flex-direction: column |
| `flex-wrap` | flex-wrap: wrap |
| `items-center` | align-items: center |
| `items-start` | align-items: flex-start |
| `justify-center` | justify-content: center |
| `justify-between` | justify-content: space-between |
| `gap-4` | gap: 1rem |
| `grid` | display: grid |
| `grid-cols-1` | grid-template-columns: 1fr |
| `grid-cols-2` | grid-template-columns: repeat(2, 1fr) |
| `grid-cols-3` | grid-template-columns: repeat(3, 1fr) |

### Responsive Prefixes

Tailwind uses **mobile-first** — classes apply from that breakpoint **upward**:

| Prefix | Min Width | Target |
|--------|-----------|--------|
| (none) | 0px | All sizes (mobile-first) |
| `sm:` | 640px | Small tablets |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Desktops |
| `xl:` | 1280px | Large desktops |
| `2xl:` | 1536px | Extra large |

```html
<!-- w-full on mobile, w-1/2 on tablets and up -->
<div class="w-full md:w-1/2">

<!-- p-4 on mobile, p-8 on desktop -->
<div class="p-4 lg:p-8">

<!-- hidden on mobile, flex on desktop -->
<div class="hidden lg:flex">
```

---

### Task 5 — Tailwind Setup

<!-- filename: exp04-tailwind.html -->
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tailwind Responsive Page</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <h1>Tailwind Page</h1>
</body>
</html>
```

**What changed:** Added Tailwind CDN script. All utility classes are now available.

---

### Task 6 — Tailwind Navbar

<!-- filename: exp04-tailwind.html -->
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tailwind Responsive Page</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
  <nav class="bg-gray-900 text-white">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <span class="text-xl font-bold">MySite</span>
      <ul class="flex gap-6">
        <li><a href="#" class="hover:text-gray-300">Home</a></li>
        <li><a href="#" class="hover:text-gray-300">About</a></li>
        <li><a href="#" class="hover:text-gray-300">Services</a></li>
        <li><a href="#" class="hover:text-gray-300">Contact</a></li>
      </ul>
    </div>
  </nav>
  <h1 class="text-3xl p-8">Tailwind Page</h1>
</body>
</html>
```

**What changed:** Built a navbar using utility classes: `bg-gray-900` for dark background, `flex justify-between` for logo-left/links-right layout, `px-4 py-3` for padding, `gap-6` for spacing between links.

---

### Task 7 — Tailwind Hero Section

<!-- filename: exp04-tailwind.html -->
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tailwind Responsive Page</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
  <nav class="bg-gray-900 text-white">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <span class="text-xl font-bold">MySite</span>
      <ul class="flex gap-6">
        <li><a href="#" class="hover:text-gray-300">Home</a></li>
        <li><a href="#" class="hover:text-gray-300">About</a></li>
        <li><a href="#" class="hover:text-gray-300">Services</a></li>
        <li><a href="#" class="hover:text-gray-300">Contact</a></li>
      </ul>
    </div>
  </nav>

  <!-- Hero: stacked on mobile, side-by-side on desktop -->
  <section class="max-w-6xl mx-auto px-4 py-16 flex flex-col lg:flex-row items-center gap-12">
    <div class="lg:w-1/2">
      <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
        Welcome to MySite
      </h1>
      <p class="text-lg text-gray-600 mb-8 leading-relaxed">
        Tailwind lets you build custom designs by composing utility classes.
        Every style is right here in the HTML — no separate CSS file needed.
      </p>
      <div class="flex gap-4">
        <a href="#" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
          Get Started
        </a>
        <a href="#" class="border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 hover:text-white">
          Learn More
        </a>
      </div>
    </div>
    <div class="lg:w-1/2">
      <img src="https://via.placeholder.com/500x300" class="w-full rounded-xl shadow-lg" alt="Hero Image">
    </div>
  </section>

  <h1 class="text-3xl p-8">More content here</h1>
</body>
</html>
```

**What changed:** Hero uses `flex-col lg:flex-row` — stacked on mobile, horizontal on desktop. `lg:w-1/2` splits width. `px-4 py-16` adds generous padding. `gap-12` spaces the two halves.

---

### Task 8 — Tailwind Card Grid + Footer

<!-- filename: exp04-tailwind.html -->
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tailwind Responsive Page</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
  <nav class="bg-gray-900 text-white">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <span class="text-xl font-bold">MySite</span>
      <ul class="flex gap-6">
        <li><a href="#" class="hover:text-gray-300">Home</a></li>
        <li><a href="#" class="hover:text-gray-300">About</a></li>
        <li><a href="#" class="hover:text-gray-300">Services</a></li>
        <li><a href="#" class="hover:text-gray-300">Contact</a></li>
      </ul>
    </div>
  </nav>

  <!-- Hero -->
  <section class="max-w-6xl mx-auto px-4 py-16 flex flex-col lg:flex-row items-center gap-12">
    <div class="lg:w-1/2">
      <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
        Welcome to MySite
      </h1>
      <p class="text-lg text-gray-600 mb-8 leading-relaxed">
        Tailwind lets you build custom designs by composing utility classes.
        Every style is right here in the HTML — no separate CSS file needed.
      </p>
      <div class="flex gap-4">
        <a href="#" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
          Get Started
        </a>
        <a href="#" class="border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 hover:text-white">
          Learn More
        </a>
      </div>
    </div>
    <div class="lg:w-1/2">
      <img src="https://via.placeholder.com/500x300" class="w-full rounded-xl shadow-lg" alt="Hero Image">
    </div>
  </section>

  <!-- Card Grid -->
  <section class="max-w-6xl mx-auto px-4 py-12">
    <h2 class="text-3xl font-bold text-center mb-8">Our Services</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      <!-- Card 1 -->
      <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
        <h3 class="text-xl font-semibold text-blue-600 mb-3">Web Design</h3>
        <p class="text-gray-600 leading-relaxed mb-4">
          Beautiful, responsive websites built with modern frameworks and best practices.
        </p>
        <a href="#" class="text-blue-600 font-semibold hover:underline">Learn More →</a>
      </div>

      <!-- Card 2 -->
      <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
        <h3 class="text-xl font-semibold text-green-600 mb-3">Development</h3>
        <p class="text-gray-600 leading-relaxed mb-4">
          Full-stack development with Node.js, Python, and cloud deployment.
        </p>
        <a href="#" class="text-green-600 font-semibold hover:underline">Learn More →</a>
      </div>

      <!-- Card 3 -->
      <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
        <h3 class="text-xl font-semibold text-red-600 mb-3">SEO</h3>
        <p class="text-gray-600 leading-relaxed mb-4">
          Optimize your site for search engines and drive organic traffic growth.
        </p>
        <a href="#" class="text-red-600 font-semibold hover:underline">Learn More →</a>
      </div>

    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-gray-900 text-white text-center py-4">
    <p>&copy; 2026 MySite — Built with Tailwind CSS</p>
  </footer>
</body>
</html>
```

**What changed:** Added card grid with `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (1 col on mobile, 2 on tablet, 3 on desktop). Each card uses `bg-white rounded-xl shadow-md p-6`. Added hover effects with `hover:shadow-lg transition-shadow`.

---

## Comparison: Bootstrap vs Tailwind

### Same Page — Key Differences

| Aspect | Bootstrap Version | Tailwind Version |
|--------|------------------|-----------------|
| **CSS Approach** | Pre-built `.card`, `.btn-primary` classes | Utility classes composed inline |
| **HTML Size** | Shorter class names | Longer, more descriptive class lists |
| **Customization** | Override SASS variables | Extend `tailwind.config.js` |
| **Learning Curve** | Lower (learn component names) | Higher (learn utility patterns) |
| **Unique Designs** | Hard (looks "Bootstrap-ish") | Easy (any design possible) |
| **File Size (production)** | ~200KB (unpurged) / ~20KB (purged) | ~3KB (purged) |

### When to Use What

| Scenario | Recommended |
|----------|-------------|
| Quick prototype / MVP | Bootstrap |
| Custom brand design | Tailwind |
| Team with mixed skill levels | Bootstrap |
| Performance-critical site | Tailwind |
| Admin dashboard | Bootstrap |
| Marketing / landing pages | Tailwind |
| WordPress theme | Bootstrap |
| SaaS product UI | Tailwind |

### Benefits and Tradeoffs

#### Bootstrap
- **Benefits:**
  - Faster to learn — remember one class name (`btn-primary`) instead of 6 utilities
  - Consistent design system out of the box
  - Massive community, tons of templates
- **Tradeoffs:**
  - Every Bootstrap site looks similar
  - Hard to override default styles without fighting specificity
  - Larger CSS bundle if you don't purge unused classes
  - Components are opinionated — hard to customize beyond the theme

#### Tailwind CSS
- **Benefits:**
  - Complete design freedom — no framework aesthetic forced on you
  - Tiny CSS file after purging unused classes
  - No naming conflicts — utilities are atomic and predictable
  - Design system in `tailwind.config.js` — change colors/fonts once, updates everywhere
- **Tradeoffs:**
  - HTML becomes long and "noisy" with many classes
  - Steeper learning curve — must memorize utility patterns
  - No pre-built components — you build cards, navbars, etc. from scratch
  - Requires build tools for production (PurgeCSS) — CDN is for dev only

---

## Exercises

1. **Bootstrap Task:** Add a responsive contact form using Bootstrap's `form-control`, `form-label`, and `form-group` classes. It should stack inputs vertically on mobile.
2. **Tailwind Task:** Recreate the Bootstrap contact form from Exercise 1 using Tailwind utilities (`w-full border rounded px-3 py-2` for inputs).
3. **Compare:** Open both files side by side. Count the number of CSS classes in each. Which file has more total class names? Which is easier to read?

---

## Viva Questions

1. **What is the 12-column grid system in Bootstrap?**
   Bootstrap divides the page into 12 equal columns. You assign column spans (`col-md-6` = 50%) to control layout. The grid is responsive — column widths adjust at breakpoints.

2. **How does Tailwind's spacing scale work?**
   Tailwind uses a numeric scale (1–96) where each unit = 0.25rem (4px). So `p-4` = 4 × 4px = 16px padding, `p-8` = 32px. The same scale applies to margin (`m-*`), gap (`gap-*`), and size (`w-*`, `h-*`).

3. **What is "mobile-first" in the context of CSS frameworks?**
   Base styles target small screens. Responsive prefixes (`md:`, `lg:`) add complexity for larger screens. This produces smaller CSS and better mobile performance.

4. **What is PurgeCSS and why does Tailwind need it?**
   Tailwind generates thousands of utility classes. PurgeCSS scans your HTML and removes unused classes from the final CSS file. Without it, the CSS file is ~3MB. With it, it shrinks to ~3KB.

5. **When would you choose Bootstrap over Tailwind?**
   When building a quick prototype, admin panel, or when the team is less experienced with CSS. Bootstrap provides consistent components out of the box with minimal customization.

---

## References

- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS Utility Classes](https://tailwindcss.com/docs/utility-first)
- [Bootstrap Grid System](https://getbootstrap.com/docs/5.3/layout/grid/)
