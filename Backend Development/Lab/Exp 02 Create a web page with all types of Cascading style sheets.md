# Experiment 2: Create a web page with all types of Cascading style sheets

## Course Outcome Mapped: CO2 (Create and build web pages and applications)

## Objectives

After completing this experiment, students will be able to:

1. Understand the three types of CSS: Inline, Internal, and External
2. Apply CSS styling to HTML elements using different selector types
3. Implement responsive design principles using CSS
4. Differentiate between class, ID, and element selectors
5. Use CSS box model for layout management
6. Apply CSS flexbox and grid for modern layouts
7. Understand CSS specificity and inheritance
8. Implement CSS animations and transitions

---

## Requirements/Tools

| Component | Specification |
|-----------|---------------|
| Operating System | Windows 10/11, macOS, or Linux |
| Browser | Google Chrome (v90+), Mozilla Firefox (v88+), or Edge (v90+) |
| Code Editor | VS Code (recommended with Live Server extension) |
| Browser DevTools | Chrome DevTools / Firefox Developer Tools |
| CSS Frameworks (Optional) | Bootstrap 5, Tailwind CSS |

---

## Theory

### What is CSS?

CSS (Cascading Style Sheets) is a styling language used to describe the presentation of HTML documents. It controls the layout, colors, fonts, and overall visual appearance of web pages.

### The "Cascading" Nature

The term "cascading" refers to the priority scheme that determines which style rules apply when multiple rules conflict. The cascade order (from lowest to highest priority):

1. **User Agent Styles** (Browser default styles)
2. **External Stylesheets** (Linked via `<link>`)
3. **Internal Stylesheets** (Defined in `<style>` tag)
4. **Inline Styles** (Defined directly on elements)
5. **Important Declarations** (`!important` - highest priority)

### Three Types of CSS

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" font-family="Arial, sans-serif">
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#2c3e50"/>
    </marker>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#2c3e50;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3498db;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="inlineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#e74c3c;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#c0392b;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="internalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#2ecc71;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#27ae60;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="externalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#3498db;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2980b9;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="900" height="600" fill="#f8f9fa" rx="10"/>

  <!-- Title -->
  <rect x="50" y="20" width="800" height="50" rx="25" fill="url(#headerGrad)"/>
  <text x="450" y="50" text-anchor="middle" fill="white" font-size="20" font-weight="bold">Types of CSS - Cascading Style Sheets</text>

  <!-- Inline CSS Box -->
  <rect x="50" y="100" width="240" height="130" rx="10" fill="white" stroke="#e74c3c" stroke-width="3"/>
  <rect x="50" y="100" width="240" height="35" rx="10" fill="url(#inlineGrad)"/>
  <rect x="50" y="125" width="240" height="10" fill="url(#inlineGrad)"/>
  <text x="170" y="124" text-anchor="middle" fill="white" font-size="16" font-weight="bold">🔴 Inline CSS</text>
  <text x="70" y="165" fill="#333" font-size="13">• Applied directly in HTML</text>
  <text x="70" y="185" fill="#333" font-size="13">• Uses style attribute</text>
  <text x="70" y="205" fill="#333" font-size="13">• Highest specificity</text>
  <text x="70" y="225" fill="#333" font-size="13">• Less maintainable</text>

  <!-- Internal CSS Box -->
  <rect x="330" y="100" width="240" height="130" rx="10" fill="white" stroke="#27ae60" stroke-width="3"/>
  <rect x="330" y="100" width="240" height="35" rx="10" fill="url(#internalGrad)"/>
  <rect x="330" y="125" width="240" height="10" fill="url(#internalGrad)"/>
  <text x="450" y="124" text-anchor="middle" fill="white" font-size="16" font-weight="bold">🟢 Internal CSS</text>
  <text x="350" y="165" fill="#333" font-size="13">• Defined in &lt;style&gt; tag</text>
  <text x="350" y="185" fill="#333" font-size="13">• In the &lt;head&gt; section</text>
  <text x="350" y="205" fill="#333" font-size="13">• Applies to one page</text>
  <text x="350" y="225" fill="#333" font-size="13">• Moderate specificity</text>

  <!-- External CSS Box -->
  <rect x="610" y="100" width="240" height="130" rx="10" fill="white" stroke="#2980b9" stroke-width="3"/>
  <rect x="610" y="100" width="240" height="35" rx="10" fill="url(#externalGrad)"/>
  <rect x="610" y="125" width="240" height="10" fill="url(#externalGrad)"/>
  <text x="730" y="124" text-anchor="middle" fill="white" font-size="16" font-weight="bold">🔵 External CSS</text>
  <text x="630" y="165" fill="#333" font-size="13">• Separate .css file</text>
  <text x="630" y="185" fill="#333" font-size="13">• Linked via &lt;link&gt;</text>
  <text x="630" y="205" fill="#333" font-size="13">• Reusable across pages</text>
  <text x="630" y="225" fill="#333" font-size="13">• Lowest specificity</text>

  <!-- Arrows showing priorities -->
  <line x1="170" y1="230" x2="170" y2="290" stroke="#2c3e50" stroke-width="2" marker-end="url(#arrowhead)"/>
  <line x1="450" y1="230" x2="450" y2="290" stroke="#2c3e50" stroke-width="2" marker-end="url(#arrowhead)"/>
  <line x1="730" y1="230" x2="730" y2="290" stroke="#2c3e50" stroke-width="2" marker-end="url(#arrowhead)"/>

  <!-- Priority Labels -->
  <text x="170" y="310" text-anchor="middle" fill="#e74c3c" font-size="14" font-weight="bold">Priority: 1 (Highest)</text>
  <text x="450" y="310" text-anchor="middle" fill="#27ae60" font-size="14" font-weight="bold">Priority: 2</text>
  <text x="730" y="310" text-anchor="middle" fill="#2980b9" font-size="14" font-weight="bold">Priority: 3</text>

  <!-- Example Code Boxes -->
  <rect x="50" y="350" width="800" height="230" rx="10" fill="white" stroke="#ddd" stroke-width="2"/>

  <!-- Inline Example -->
  <rect x="70" y="365" width="240" height="100" rx="5" fill="#fdf2f2" stroke="#e74c3c" stroke-width="1"/>
  <text x="80" y="385" fill="#e74c3c" font-size="13" font-weight="bold">Example:</text>
  <text x="80" y="405" fill="#333" font-size="12" font-family="Courier">&lt;h1 style="color: red;</text>
  <text x="80" y="422" fill="#333" font-size="12" font-family="Courier">  font-size: 24px;"&gt;</text>
  <text x="80" y="439" fill="#333" font-size="12" font-family="Courier">  Hello&lt;/h1&gt;</text>

  <!-- Internal Example -->
  <rect x="330" y="365" width="240" height="100" rx="5" fill="#f0faf5" stroke="#27ae60" stroke-width="1"/>
  <text x="340" y="385" fill="#27ae60" font-size="13" font-weight="bold">Example:</text>
  <text x="340" y="405" fill="#333" font-size="12" font-family="Courier">&lt;style&gt;</text>
  <text x="340" y="422" fill="#333" font-size="12" font-family="Courier">  h1 { color: green; }</text>
  <text x="340" y="439" fill="#333" font-size="12" font-family="Courier">&lt;/style&gt;</text>

  <!-- External Example -->
  <rect x="590" y="365" width="240" height="100" rx="5" fill="#f0f7fd" stroke="#2980b9" stroke-width="1"/>
  <text x="600" y="385" fill="#2980b9" font-size="13" font-weight="bold">Example:</text>
  <text x="600" y="405" fill="#333" font-size="12" font-family="Courier">&lt;link rel="stylesheet"</text>
  <text x="600" y="422" fill="#333" font-size="12" font-family="Courier">  href="style.css"&gt;</text>
  <text x="600" y="439" fill="#333" font-size="12" font-family="Courier">/* style.css */</text>
  <text x="600" y="456" fill="#333" font-size="12" font-family="Courier">h1 { color: blue; }</text>

  <!-- Bottom Note -->
  <text x="450" y="580" text-anchor="middle" fill="#666" font-size="12">CSS uses cascading priority: Inline &gt; Internal &gt; External</text>
</svg>
```

### CSS Box Model

The CSS box model is fundamental to understanding layout. Every HTML element is considered a box with:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420" font-family="Arial, sans-serif">
  <defs>
    <linearGradient id="marginGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#f39c12;stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:#f39c12;stop-opacity:0.1" />
    </linearGradient>
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#2980b9;stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:#2980b9;stop-opacity:0.1" />
    </linearGradient>
    <linearGradient id="paddingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#27ae60;stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:#27ae60;stop-opacity:0.1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="600" height="420" fill="#f8f9fa" rx="10"/>

  <!-- Title -->
  <text x="300" y="30" text-anchor="middle" fill="#2c3e50" font-size="18" font-weight="bold">CSS Box Model</text>

  <!-- Margin Area (Outermost) -->
  <rect x="50" y="50" width="500" height="340" rx="8" fill="url(#marginGrad)" stroke="#f39c12" stroke-width="2" stroke-dasharray="5,5"/>
  <text x="300" y="75" text-anchor="middle" fill="#f39c12" font-size="14" font-weight="bold">Margin (Transparent - Space outside border)</text>

  <!-- Border Area -->
  <rect x="100" y="100" width="400" height="260" rx="5" fill="url(#borderGrad)" stroke="#2980b9" stroke-width="3"/>
  <text x="300" y="125" text-anchor="middle" fill="#2980b9" font-size="14" font-weight="bold">Border</text>

  <!-- Padding Area -->
  <rect x="150" y="150" width="300" height="180" rx="5" fill="url(#paddingGrad)" stroke="#27ae60" stroke-width="2"/>
  <text x="300" y="175" text-anchor="middle" fill="#27ae60" font-size="14" font-weight="bold">Padding</text>

  <!-- Content Area -->
  <rect x="200" y="200" width="200" height="100" rx="5" fill="#3498db" stroke="#2c3e50" stroke-width="2"/>
  <text x="300" y="260" text-anchor="middle" fill="white" font-size="16" font-weight="bold">Content</text>

  <!-- Labels with arrows -->
  <text x="30" y="220" fill="#f39c12" font-size="12" font-weight="bold">Margin</text>
  <text x="30" y="360" fill="#2980b9" font-size="12" font-weight="bold">Border</text>
  <text x="30" y="390" fill="#27ae60" font-size="12" font-weight="bold">Padding</text>

  <!-- Dimension labels -->
  <text x="300" y="410" text-anchor="middle" fill="#666" font-size="11">Width = margin-left + border-left + padding-left + width + padding-right + border-right + margin-right</text>
</svg>
```

### CSS Selector Types

| Selector Type | Syntax | Example | Priority |
|---------------|--------|---------|----------|
| **Element/Type** | `element` | `p { color: blue; }` | Low |
| **Class** | `.classname` | `.highlight { background: yellow; }` | Medium |
| **ID** | `#idname` | `#header { font-size: 24px; }` | High |
| **Universal** | `*` | `* { margin: 0; }` | Lowest |
| **Descendant** | `parent child` | `div p { color: red; }` | Varies |
| **Child** | `parent > child` | `ul > li { list-style: none; }` | Varies |
| **Adjacent Sibling** | `element + element` | `h1 + p { margin-top: 0; }` | Varies |
| **General Sibling** | `element ~ element` | `h1 ~ p { color: gray; }` | Varies |
| **Attribute** | `[attribute="value"]` | `[type="text"] { width: 100%; }` | Varies |
| **Pseudo-class** | `:pseudo-class` | `a:hover { color: red; }` | Varies |
| **Pseudo-element** | `::pseudo-element` | `p::first-line { font-weight: bold; }` | Varies |

### CSS Specificity Calculation

Specificity is calculated based on selectors:

```
Inline styles: 1000
IDs: 100
Classes, attributes, pseudo-classes: 10
Elements, pseudo-elements: 1
```

**Example:** `#header .nav a:hover` = 100 + 10 + 1 + 10 = 121

### CSS Flexbox (Modern Layout)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" font-family="Arial, sans-serif">
  <rect width="800" height="200" fill="#f8f9fa" rx="10"/>
  <text x="400" y="25" text-anchor="middle" fill="#2c3e50" font-size="16" font-weight="bold">CSS Flexbox Layout</text>

  <!-- Flex Container -->
  <rect x="50" y="40" width="700" height="140" rx="8" fill="#ebf5fb" stroke="#3498db" stroke-width="2"/>
  <text x="400" y="60" text-anchor="middle" fill="#3498db" font-size="12">Flex Container</text>

  <!-- Flex Items -->
  <rect x="70" y="75" width="120" height="80" rx="5" fill="#e74c3c" stroke="#c0392b" stroke-width="2"/>
  <text x="130" y="115" text-anchor="middle" fill="white" font-size="12">Item 1</text>

  <rect x="210" y="75" width="120" height="80" rx="5" fill="#2ecc71" stroke="#27ae60" stroke-width="2"/>
  <text x="270" y="115" text-anchor="middle" fill="white" font-size="12">Item 2</text>

  <rect x="350" y="75" width="120" height="80" rx="5" fill="#3498db" stroke="#2980b9" stroke-width="2"/>
  <text x="410" y="115" text-anchor="middle" fill="white" font-size="12">Item 3</text>

  <rect x="490" y="75" width="120" height="80" rx="5" fill="#f39c12" stroke="#e67e22" stroke-width="2"/>
  <text x="550" y="115" text-anchor="middle" fill="white" font-size="12">Item 4</text>

  <rect x="630" y="75" width="100" height="80" rx="5" fill="#9b59b6" stroke="#8e44ad" stroke-width="2"/>
  <text x="680" y="115" text-anchor="middle" fill="white" font-size="12">Item 5</text>

  <!-- Flex Properties -->
  <text x="400" y="180" text-anchor="middle" fill="#666" font-size="11">display: flex; flex-direction: row; justify-content: space-around; align-items: center;</text>
</svg>
```

### CSS Grid (Modern Layout)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 280" font-family="Arial, sans-serif">
  <rect width="800" height="280" fill="#f8f9fa" rx="10"/>
  <text x="400" y="25" text-anchor="middle" fill="#2c3e50" font-size="16" font-weight="bold">CSS Grid Layout</text>

  <!-- Grid Container -->
  <rect x="50" y="40" width="700" height="220" rx="8" fill="#fef9e7" stroke="#f39c12" stroke-width="2"/>
  <text x="400" y="60" text-anchor="middle" fill="#f39c12" font-size="12">Grid Container</text>

  <!-- Grid Items -->
  <!-- Row 1 -->
  <rect x="70" y="75" width="150" height="70" rx="5" fill="#e74c3c" stroke="#c0392b" stroke-width="2"/>
  <text x="145" y="110" text-anchor="middle" fill="white" font-size="12">Item 1</text>

  <rect x="235" y="75" width="150" height="70" rx="5" fill="#2ecc71" stroke="#27ae60" stroke-width="2"/>
  <text x="310" y="110" text-anchor="middle" fill="white" font-size="12">Item 2</text>

  <rect x="400" y="75" width="150" height="70" rx="5" fill="#3498db" stroke="#2980b9" stroke-width="2"/>
  <text x="475" y="110" text-anchor="middle" fill="white" font-size="12">Item 3</text>

  <!-- Row 2 -->
  <rect x="70" y="160" width="150" height="70" rx="5" fill="#f39c12" stroke="#e67e22" stroke-width="2"/>
  <text x="145" y="195" text-anchor="middle" fill="white" font-size="12">Item 4</text>

  <rect x="235" y="160" width="320" height="70" rx="5" fill="#9b59b6" stroke="#8e44ad" stroke-width="2"/>
  <text x="395" y="195" text-anchor="middle" fill="white" font-size="12">Item 5 (Span 2)</text>

  <rect x="570" y="75" width="160" height="155" rx="5" fill="#1abc9c" stroke="#16a085" stroke-width="2"/>
  <text x="650" y="153" text-anchor="middle" fill="white" font-size="12">Item 6</text>
  <text x="650" y="170" text-anchor="middle" fill="white" font-size="10">(Row Span 2)</text>

  <!-- Grid Properties -->
  <text x="400" y="260" text-anchor="middle" fill="#666" font-size="11">display: grid; grid-template-columns: 1fr 1fr 1fr; grid-template-rows: auto auto;</text>
</svg>
```

### Why CSS Matters in Backend Development

1. **Template Rendering**: Backend frameworks generate HTML with CSS classes
2. **Admin Panels**: Backend developers create admin interfaces with CSS
3. **API Documentation**: Styling API documentation pages
4. **Error Pages**: Creating visually appealing error pages (404, 500)
5. **Email Templates**: Styling transactional emails
6. **Content Management**: CMS systems rely on CSS for content presentation
7. **Reporting Dashboards**: Data visualization and dashboard styling

---

## Procedure

### Part A: External CSS (Recommended Approach)

**Task:** Create a standalone CSS file and link it to HTML.

**Step 1:** Create the HTML file `index-external.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>External CSS Example</title>
    <!-- Link to external stylesheet -->
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>External CSS Styling</h1>
        <p>This page uses an external stylesheet</p>
    </header>

    <main>
        <section class="card">
            <h2>About External CSS</h2>
            <p>External CSS is the recommended approach for styling web pages.</p>
            <ul>
                <li>Reusable across multiple pages</li>
                <li>Separates content from presentation</li>
                <li>Easier to maintain and update</li>
                <li>Better browser caching</li>
            </ul>
        </section>

        <section class="card featured">
            <h2>Key Benefits</h2>
            <div class="benefit-grid">
                <div class="benefit-item">
                    <span class="icon">📁</span>
                    <h3>Reusable</h3>
                    <p>One stylesheet for all pages</p>
                </div>
                <div class="benefit-item">
                    <span class="icon">🧹</span>
                    <h3>Clean Code</h3>
                    <p>Separation of concerns</p>
                </div>
                <div class="benefit-item">
                    <span class="icon">⚡</span>
                    <h3>Performance</h3>
                    <p>Better caching and loading</p>
                </div>
            </div>
        </section>
    </main>

    <footer>
        <p>&copy; 2026 Backend Development - External CSS Example</p>
    </footer>
</body>
</html>
```

**Step 2:** Create the external CSS file `styles.css`:

```css
/* ====== RESET STYLES ====== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* ====== BASE STYLES ====== */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    min-height: 100vh;
    padding: 20px;
}

/* ====== HEADER STYLES ====== */
header {
    text-align: center;
    padding: 40px 20px;
    background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
    border-radius: 12px;
    margin-bottom: 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
}

header::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: shimmer 15s linear infinite;
}

@keyframes shimmer {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

header h1 {
    color: #fff;
    font-size: 2.5rem;
    margin-bottom: 10px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

header p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.2rem;
}

/* ====== MAIN CONTENT ====== */
main {
    max-width: 1200px;
    margin: 0 auto;
}

/* ====== SECTION / CARD STYLES ====== */
.card {
    background: #fff;
    padding: 30px;
    border-radius: 12px;
    margin-bottom: 25px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.card h2 {
    color: #2c3e50;
    margin-bottom: 15px;
    border-bottom: 3px solid #3498db;
    padding-bottom: 10px;
}

.card.featured {
    border-left: 5px solid #3498db;
    background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
}

/* ====== LIST STYLES ====== */
.card ul {
    list-style: none;
    padding: 0;
}

.card ul li {
    padding: 10px 15px;
    background: #f8f9fa;
    margin-bottom: 8px;
    border-radius: 6px;
    border-left: 4px solid #3498db;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.card ul li:hover {
    background: #e9ecef;
    transform: translateX(10px);
}

.card ul li::before {
    content: '→ ';
    color: #3498db;
    font-weight: bold;
}

/* ====== BENEFIT GRID (FLEXBOX) ====== */
.benefit-grid {
    display: flex;
    gap: 20px;
    margin-top: 20px;
    flex-wrap: wrap;
}

.benefit-item {
    flex: 1;
    min-width: 200px;
    padding: 25px 20px;
    background: #fff;
    border-radius: 10px;
    text-align: center;
    border: 1px solid #e9ecef;
    transition: all 0.3s ease;
}

.benefit-item:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(52, 152, 219, 0.2);
    border-color: #3498db;
}

.benefit-item .icon {
    font-size: 2.5rem;
    display: block;
    margin-bottom: 10px;
}

.benefit-item h3 {
    color: #2c3e50;
    margin-bottom: 5px;
}

.benefit-item p {
    color: #6c757d;
    font-size: 0.9rem;
}

/* ====== FOOTER STYLES ====== */
footer {
    text-align: center;
    padding: 25px;
    margin-top: 30px;
    background: #2c3e50;
    border-radius: 12px;
    color: rgba(255, 255, 255, 0.8);
}

footer p {
    margin: 0;
}

/* ====== RESPONSIVE DESIGN ====== */
@media (max-width: 768px) {
    header h1 {
        font-size: 1.8rem;
    }

    .benefit-grid {
        flex-direction: column;
    }

    .benefit-item {
        min-width: auto;
    }

    .card {
        padding: 20px;
    }
}

@media (max-width: 480px) {
    body {
        padding: 10px;
    }

    header {
        padding: 25px 15px;
    }

    header h1 {
        font-size: 1.4rem;
    }

    .card ul li {
        padding: 8px 12px;
        font-size: 0.9rem;
    }
}
```

**Step 3:** Open `index-external.html` in a browser to see the styling applied.

---

### Part B: Internal CSS

**Task:** Add CSS directly within the HTML `<style>` tag.

**Step 1:** Create the HTML file `index-internal.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Internal CSS Example</title>
    
    <!-- Internal CSS -->
    <style>
        /* ====== BASE STYLES ====== */
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #2c3e50;
            background-color: #f0f4f8;
            padding: 20px;
            margin: 0;
        }

        /* ====== HEADER STYLES ====== */
        .page-header {
            background: linear-gradient(135deg, #2c3e50, #2ecc71);
            color: white;
            padding: 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
        }

        .page-header h1 {
            margin: 0;
            font-size: 2.2rem;
            letter-spacing: 2px;
        }

        .page-header .subtitle {
            margin-top: 8px;
            opacity: 0.9;
            font-size: 1.1rem;
        }

        /* ====== CONTAINER ====== */
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        /* ====== CONTENT STYLES ====== */
        .content {
            padding: 30px;
        }

        .content h2 {
            color: #27ae60;
            border-bottom: 3px solid #27ae60;
            padding-bottom: 10px;
            margin-top: 0;
        }

        .content h3 {
            color: #2c3e50;
            margin-top: 25px;
        }

        /* ====== FEATURE BOXES ====== */
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }

        .feature-box {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #27ae60;
            transition: all 0.3s ease;
        }

        .feature-box:hover {
            background: #e8f5e9;
            transform: translateY(-3px);
            box-shadow: 0 4px 15px rgba(46, 204, 113, 0.2);
        }

        .feature-box .icon {
            font-size: 2rem;
        }

        .feature-box h4 {
            margin: 10px 0 5px 0;
            color: #27ae60;
        }

        .feature-box p {
            margin: 0;
            color: #555;
            font-size: 0.95rem;
        }

        /* ====== CODE BLOCK ====== */
        .code-block {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 15px 20px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            overflow-x: auto;
            margin: 15px 0;
        }

        .code-block .tag {
            color: #e74c3c;
        }

        .code-block .attr {
            color: #f39c12;
        }

        .code-block .value {
            color: #2ecc71;
        }

        /* ====== TABLE STYLES ====== */
        .comparison-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        .comparison-table th {
            background: #27ae60;
            color: white;
            padding: 12px 15px;
            text-align: left;
        }

        .comparison-table td {
            padding: 12px 15px;
            border-bottom: 1px solid #e9ecef;
        }

        .comparison-table tr:hover {
            background: #f8f9fa;
        }

        .comparison-table .highlight-row {
            background: #e8f5e9;
            font-weight: bold;
        }

        /* ====== BUTTON STYLES ====== */
        .btn {
            display: inline-block;
            padding: 12px 25px;
            background: #27ae60;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
        }

        .btn:hover {
            background: #219a52;
            transform: scale(1.05);
        }

        .btn-secondary {
            background: #2c3e50;
        }

        .btn-secondary:hover {
            background: #1a252f;
        }

        /* ====== FOOTER ====== */
        .page-footer {
            background: #2c3e50;
            color: rgba(255, 255, 255, 0.8);
            text-align: center;
            padding: 20px;
            border-radius: 0 0 10px 10px;
        }

        .page-footer small {
            opacity: 0.7;
        }

        /* ====== RESPONSIVE ====== */
        @media (max-width: 600px) {
            .page-header h1 {
                font-size: 1.6rem;
            }

            .content {
                padding: 20px;
            }

            .comparison-table {
                font-size: 0.85rem;
            }

            .comparison-table th,
            .comparison-table td {
                padding: 8px 10px;
            }

            .feature-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="page-header">
            <h1>🎨 Internal CSS</h1>
            <p class="subtitle">Styling defined within the &lt;style&gt; tag in the head section</p>
        </header>

        <div class="content">
            <h2>Understanding Internal CSS</h2>
            <p>Internal CSS is defined within the <code>&lt;style&gt;</code> element in the <code>&lt;head&gt;</code> section of an HTML document. It applies styles to that single page only.</p>

            <h3>When to Use Internal CSS</h3>
            <ul>
                <li>When styling a single page</li>
                <li>When prototyping or testing styles</li>
                <li>When page-specific overrides are needed</li>
                <li>When external CSS is not feasible</li>
            </ul>

            <h3>Benefits of Internal CSS</h3>
            <div class="feature-grid">
                <div class="feature-box">
                    <div class="icon">📄</div>
                    <h4>Single Page</h4>
                    <p>Perfect for pages that need unique styling</p>
                </div>
                <div class="feature-box">
                    <div class="icon">🚀</div>
                    <h4>Fast Load</h4>
                    <p>No additional HTTP requests</p>
                </div>
                <div class="feature-box">
                    <div class="icon">🛠️</div>
                    <h4>Easy Testing</h4>
                    <p>Quick to modify and test</p>
                </div>
                <div class="feature-box">
                    <div class="icon">📦</div>
                    <h4>Self-Contained</h4>
                    <p>Everything in one file</p>
                </div>
            </div>

            <h3>Code Example</h3>
            <div class="code-block">
                <pre style="margin:0; color: #ecf0f1;">
<span class="tag">&lt;style&gt;</span>
    <span style="color: #2ecc71;">body</span> <span style="color: #ecf0f1;">{</span>
        <span style="color: #f39c12;">font-family</span>: <span style="color: #2ecc71;">Arial, sans-serif</span>;
        <span style="color: #f39c12;">background-color</span>: <span style="color: #2ecc71;">#f0f4f8</span>;
    <span style="color: #ecf0f1;">}</span>

    <span style="color: #2ecc71;">.page-header</span> <span style="color: #ecf0f1;">{</span>
        <span style="color: #f39c12;">background</span>: <span style="color: #2ecc71;">linear-gradient(135deg, #2c3e50, #2ecc71)</span>;
        <span style="color: #f39c12;">color</span>: <span style="color: #2ecc71;">white</span>;
        <span style="color: #f39c12;">padding</span>: <span style="color: #2ecc71;">30px</span>;
        <span style="color: #f39c12;">text-align</span>: <span style="color: #2ecc71;">center</span>;
    <span style="color: #ecf0f1;">}</span>
<span class="tag">&lt;/style&gt;</span>
                </pre>
            </div>

            <h3>CSS Properties Comparison</h3>
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Description</th>
                        <th>Example Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>color</code></td>
                        <td>Text color</td>
                        <td><span style="color:#e74c3c;">#e74c3c</span></td>
                    </tr>
                    <tr>
                        <td><code>background</code></td>
                        <td>Background color/gradient</td>
                        <td><span style="background:#27ae60;color:#fff;padding:2px 8px;border-radius:3px;">#27ae60</span></td>
                    </tr>
                    <tr>
                        <td><code>font-size</code></td>
                        <td>Text size</td>
                        <td>1.2rem</td>
                    </tr>
                    <tr>
                        <td><code>padding</code></td>
                        <td>Internal spacing</td>
                        <td>20px 30px</td>
                    </tr>
                    <tr>
                        <td><code>margin</code></td>
                        <td>External spacing</td>
                        <td>10px 0</td>
                    </tr>
                    <tr class="highlight-row">
                        <td><code>border</code></td>
                        <td>Border style</td>
                        <td>2px solid #3498db</td>
                    </tr>
                    <tr>
                        <td><code>box-shadow</code></td>
                        <td>Shadow effect</td>
                        <td>0 4px 15px rgba(0,0,0,0.1)</td>
                    </tr>
                </tbody>
            </table>

            <div style="display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap;">
                <button class="btn">Primary Button</button>
                <button class="btn btn-secondary">Secondary Button</button>
            </div>
        </div>

        <footer class="page-footer">
            <p>Internal CSS Demonstration &bull; Backend Development Lab</p>
            <small>&copy; 2026 CSFS3008P - Experiment 2</small>
        </footer>
    </div>
</body>
</html>
```

---

### Part C: Inline CSS

**Task:** Apply CSS directly to individual HTML elements.

**Step 1:** Create the HTML file `index-inline.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inline CSS Example</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: linear-gradient(135deg, #f5f7fa, #c3cfe2); min-height: 100vh; padding: 20px; margin: 0;">

    <div style="max-width: 900px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); overflow: hidden;">

        <!-- HEADER -->
        <header style="background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 35px 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 2.2rem; letter-spacing: 1px;">⚡ Inline CSS</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 1.1rem;">Styles applied directly to individual HTML elements</p>
        </header>

        <!-- CONTENT -->
        <div style="padding: 30px;">

            <!-- Introduction -->
            <section style="margin-bottom: 30px;">
                <h2 style="color: #e74c3c; border-bottom: 3px solid #e74c3c; padding-bottom: 10px; margin-top: 0;">What is Inline CSS?</h2>
                <p style="font-size: 1.05rem;">Inline CSS uses the <code style="background: #f8f9fa; padding: 2px 6px; border-radius: 4px;">style</code> attribute directly on HTML elements. This applies styles to <strong style="color: #e74c3c;">specific</strong> elements only.</p>

                <div style="background: #fdf2f2; border-left: 5px solid #e74c3c; padding: 15px 20px; border-radius: 4px; margin-top: 15px;">
                    <p style="margin: 0;"><strong>💡 Key Characteristic:</strong> Inline CSS has the <strong style="color: #e74c3c;">highest specificity</strong> and will override all other styles.</p>
                </div>
            </section>

            <!-- Feature Cards -->
            <section style="margin-bottom: 30px;">
                <h3 style="color: #2c3e50;">Features of Inline CSS</h3>
                <div style="display: flex; gap: 15px; flex-wrap: wrap; margin-top: 15px;">

                    <div style="flex: 1; min-width: 180px; background: #f8f9fa; padding: 20px; border-radius: 8px; border-top: 4px solid #e74c3c;">
                        <div style="font-size: 2rem; text-align: center;">🎯</div>
                        <h4 style="margin: 10px 0 5px 0; text-align: center; color: #e74c3c;">Precise</h4>
                        <p style="margin: 0; text-align: center; color: #666; font-size: 0.9rem;">Applies to a single element</p>
                    </div>

                    <div style="flex: 1; min-width: 180px; background: #f8f9fa; padding: 20px; border-radius: 8px; border-top: 4px solid #f39c12;">
                        <div style="font-size: 2rem; text-align: center;">⚡</div>
                        <h4 style="margin: 10px 0 5px 0; text-align: center; color: #f39c12;">Highest Priority</h4>
                        <p style="margin: 0; text-align: center; color: #666; font-size: 0.9rem;">Overrides all other styles</p>
                    </div>

                    <div style="flex: 1; min-width: 180px; background: #f8f9fa; padding: 20px; border-radius: 8px; border-top: 4px solid #3498db;">
                        <div style="font-size: 2rem; text-align: center;">🧪</div>
                        <h4 style="margin: 10px 0 5px 0; text-align: center; color: #3498db;">Quick Testing</h4>
                        <p style="margin: 0; text-align: center; color: #666; font-size: 0.9rem;">Fast for experimental styling</p>
                    </div>

                </div>
            </section>

            <!-- Comparison Table -->
            <section style="margin-bottom: 30px;">
                <h3 style="color: #2c3e50;">CSS Types Comparison</h3>
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.95rem;">
                        <thead>
                            <tr style="background: #2c3e50; color: white;">
                                <th style="padding: 12px 15px; text-align: left;">Feature</th>
                                <th style="padding: 12px 15px; text-align: left; background: #e74c3c;">Inline</th>
                                <th style="padding: 12px 15px; text-align: left; background: #27ae60;">Internal</th>
                                <th style="padding: 12px 15px; text-align: left; background: #3498db;">External</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 10px 15px;"><strong>Reusability</strong></td>
                                <td style="padding: 10px 15px; color: #e74c3c;">❌ No</td>
                                <td style="padding: 10px 15px; color: #f39c12;">⚠️ Limited</td>
                                <td style="padding: 10px 15px; color: #27ae60;">✅ Yes</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #eee; background: #f8f9fa;">
                                <td style="padding: 10px 15px;"><strong>Maintainability</strong></td>
                                <td style="padding: 10px 15px; color: #e74c3c;">❌ Hard</td>
                                <td style="padding: 10px 15px; color: #f39c12;">⚠️ Moderate</td>
                                <td style="padding: 10px 15px; color: #27ae60;">✅ Easy</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 10px 15px;"><strong>Specificity</strong></td>
                                <td style="padding: 10px 15px; color: #e74c3c; font-weight: bold;">Highest</td>
                                <td style="padding: 10px 15px; color: #f39c12;">Medium</td>
                                <td style="padding: 10px 15px; color: #3498db;">Lowest</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #eee; background: #f8f9fa;">
                                <td style="padding: 10px 15px;"><strong>Caching</strong></td>
                                <td style="padding: 10px 15px; color: #e74c3c;">❌ No</td>
                                <td style="padding: 10px 15px; color: #e74c3c;">❌ No</td>
                                <td style="padding: 10px 15px; color: #27ae60;">✅ Yes</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 15px;"><strong>Best For</strong></td>
                                <td style="padding: 10px 15px; color: #e74c3c;">Single elements</td>
                                <td style="padding: 10px 15px; color: #f39c12;">Single pages</td>
                                <td style="padding: 10px 15px; color: #27ae60;">Multiple pages</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Code Example -->
            <section style="margin-bottom: 20px;">
                <h3 style="color: #2c3e50;">Code Example</h3>
                <div style="background: #2c3e50; color: #ecf0f1; padding: 15px 20px; border-radius: 6px; font-family: 'Courier New', monospace; font-size: 0.9rem; overflow-x: auto;">
                    <pre style="margin: 0; color: #ecf0f1;">
<span style="color: #f39c12;">&lt;h1</span> <span style="color: #2ecc71;">style</span>=<span style="color: #e74c3c;">"color: #e74c3c; font-size: 2.5rem; text-align: center;"</span><span style="color: #f39c12;">&gt;</span>
    <span style="color: #ecf0f1;">Hello World</span>
<span style="color: #f39c12;">&lt;/h1&gt;</span>

<span style="color: #f39c12;">&lt;p</span> <span style="color: #2ecc71;">style</span>=<span style="color: #e74c3c;">"background: #f8f9fa; padding: 15px; border-left: 4px solid #3498db;"</span><span style="color: #f39c12;">&gt;</span>
    <span style="color: #ecf0f1;">This paragraph has inline styling for background, padding, and border.</span>
<span style="color: #f39c12;">&lt;/p&gt;</span>

<span style="color: #f39c12;">&lt;div</span> <span style="color: #2ecc71;">style</span>=<span style="color: #e74c3c;">"display: flex; gap: 10px; justify-content: center;"</span><span style="color: #f39c12;">&gt;</span>
    <span style="color: #f39c12;">&lt;button</span> <span style="color: #2ecc71;">style</span>=<span style="color: #e74c3c;">"background: #27ae60; color: white; padding: 10px 20px; border: none; border-radius: 5px;"</span><span style="color: #f39c12;">&gt;</span>Submit<span style="color: #f39c12;">&lt;/button&gt;</span>
<span style="color: #f39c12;">&lt;/div&gt;</span>
                    </pre>
                </div>
            </section>

            <!-- Interactive Example -->
            <section>
                <h3 style="color: #2c3e50;">Try It Yourself</h3>
                <div style="display: flex; gap: 20px; flex-wrap: wrap; background: #f8f9fa; padding: 20px; border-radius: 8px;">

                    <div style="flex: 1; min-width: 150px; text-align: center;">
                        <div style="font-size: 4rem;">🔴</div>
                        <p style="margin: 5px 0 0 0; font-weight: bold; color: #e74c3c;">Red Style</p>
                        <div style="width: 100px; height: 100px; background: #e74c3c; border-radius: 12px; margin: 10px auto;"></div>
                    </div>

                    <div style="flex: 1; min-width: 150px; text-align: center;">
                        <div style="font-size: 4rem;">🟢</div>
                        <p style="margin: 5px 0 0 0; font-weight: bold; color: #27ae60;">Green Style</p>
                        <div style="width: 100px; height: 100px; background: #27ae60; border-radius: 12px; margin: 10px auto;"></div>
                    </div>

                    <div style="flex: 1; min-width: 150px; text-align: center;">
                        <div style="font-size: 4rem;">🔵</div>
                        <p style="margin: 5px 0 0 0; font-weight: bold; color: #3498db;">Blue Style</p>
                        <div style="width: 100px; height: 100px; background: #3498db; border-radius: 12px; margin: 10px auto;"></div>
                    </div>

                </div>
            </section>

        </div>

        <!-- FOOTER -->
        <footer style="background: #2c3e50; color: rgba(255,255,255,0.8); text-align: center; padding: 20px;">
            <p style="margin: 0;">Inline CSS Demonstration &bull; Backend Development Lab</p>
            <small style="opacity: 0.7;">&copy; 2026 CSFS3008P - Experiment 2</small>
        </footer>

    </div>

</body>
</html>
```

---

### Part D: CSS Selectors Demonstration

**Task:** Create a page demonstrating all major CSS selector types.

**Step 1:** Create the HTML file `index-selectors.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Selectors Demonstration</title>
    <style>
        /* ====== UNIVERSAL SELECTOR ====== */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        /* ====== ELEMENT/TYPE SELECTOR ====== */
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            background: #f0f4f8;
            padding: 20px;
            color: #2c3e50;
        }

        h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 20px;
        }

        h2 {
            color: #2980b9;
            margin: 20px 0 10px 0;
        }

        h3 {
            color: #2c3e50;
            margin: 15px 0 8px 0;
        }

        p {
            margin-bottom: 10px;
        }

        /* ====== CLASS SELECTOR ====== */
        .container {
            max-width: 1100px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .demo-section {
            border: 2px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 25px;
        }

        .highlight {
            background: #fff3cd;
            padding: 2px 8px;
            border-radius: 4px;
            color: #856404;
        }

        .box {
            width: 100px;
            height: 100px;
            background: #3498db;
            margin: 10px;
            display: inline-block;
            border-radius: 6px;
            transition: all 0.3s ease;
        }

        .box.rounded {
            border-radius: 50%;
        }

        .box.shadow {
            box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
        }

        .text-large {
            font-size: 1.3rem;
        }

        .text-success {
            color: #27ae60;
        }

        .text-danger {
            color: #e74c3c;
        }

        .text-muted {
            color: #6c757d;
        }

        .badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: bold;
            color: white;
        }

        .badge-primary {
            background: #3498db;
        }

        .badge-success {
            background: #27ae60;
        }

        .badge-danger {
            background: #e74c3c;
        }

        /* ====== ID SELECTOR ====== */
        #main-heading {
            color: #2c3e50;
            font-size: 2.2rem;
            border-bottom: 4px solid #3498db;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }

        #unique-box {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            margin: 20px 0;
        }

        #unique-box h3 {
            color: white;
            margin: 0;
        }

        /* ====== DESCENDANT SELECTOR ====== */
        .descendant-demo li {
            padding: 8px 15px;
            background: #f8f9fa;
            margin-bottom: 5px;
            border-radius: 4px;
            list-style: none;
        }

        .descendant-demo li a {
            color: #3498db;
            text-decoration: none;
        }

        .descendant-demo li a:hover {
            text-decoration: underline;
        }

        /* ====== CHILD SELECTOR ====== */
        .child-demo > li {
            border-left: 4px solid #27ae60;
            padding-left: 15px;
        }

        .child-demo > li > ul > li {
            border-left: 4px solid #f39c12;
            padding-left: 15px;
        }

        /* ====== ADJACENT SIBLING SELECTOR ====== */
        h2 + p {
            background: #e8f4f8;
            padding: 10px 15px;
            border-radius: 6px;
            border-left: 4px solid #3498db;
        }

        /* ====== GENERAL SIBLING SELECTOR ====== */
        h3 ~ p {
            color: #555;
            font-style: italic;
        }

        /* ====== ATTRIBUTE SELECTOR ====== */
        [type="text"] {
            border: 2px solid #3498db;
            padding: 8px 12px;
            border-radius: 6px;
            width: 200px;
            transition: border-color 0.3s ease;
        }

        [type="text"]:focus {
            border-color: #27ae60;
            outline: none;
        }

        [type="submit"] {
            background: #27ae60;
            color: white;
            border: none;
            padding: 8px 25px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
        }

        [type="submit"]:hover {
            background: #219a52;
        }

        [href^="https"] {
            color: #27ae60;
            font-weight: bold;
        }

        [href$=".pdf"]::after {
            content: " 📄";
        }

        [title] {
            border-bottom: 2px dotted #f39c12;
            cursor: help;
        }

        /* ====== PSEUDO-CLASS SELECTORS ====== */
        .pseudo-demo a {
            display: inline-block;
            padding: 8px 15px;
            margin: 5px;
            background: #e9ecef;
            color: #2c3e50;
            text-decoration: none;
            border-radius: 4px;
            transition: all 0.3s ease;
        }

        .pseudo-demo a:hover {
            background: #3498db;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(52, 152, 219, 0.3);
        }

        .pseudo-demo a:active {
            transform: scale(0.95);
        }

        .pseudo-demo a:visited {
            color: #8e44ad;
        }

        .pseudo-demo input:focus {
            border-color: #e74c3c;
            outline: 2px solid rgba(231, 76, 60, 0.3);
        }

        .pseudo-demo li:first-child {
            font-weight: bold;
            color: #27ae60;
        }

        .pseudo-demo li:last-child {
            color: #e74c3c;
            font-style: italic;
        }

        .pseudo-demo li:nth-child(odd) {
            background: #f8f9fa;
        }

        .pseudo-demo li:nth-child(even) {
            background: #e9ecef;
        }

        /* ====== PSEUDO-ELEMENT SELECTORS ====== */
        .pseudo-element-demo p::first-line {
            font-weight: bold;
            color: #2c3e50;
        }

        .pseudo-element-demo p::first-letter {
            font-size: 2.5rem;
            color: #e74c3c;
            float: left;
            margin-right: 5px;
            font-weight: bold;
        }

        .pseudo-element-demo p::before {
            content: "📌 ";
            color: #f39c12;
        }

        .pseudo-element-demo p::after {
            content: " ✨";
            color: #f39c12;
        }

        /* ====== COMBINED SELECTORS ====== */
        .combined-demo div.box {
            background: #f39c12;
        }

        .combined-demo .box.rounded {
            background: #9b59b6;
        }

        .combined-demo #special-box.box {
            background: #e74c3c;
            width: 120px;
            height: 120px;
        }

        /* ====== RESPONSIVE ====== */
        @media (max-width: 768px) {
            .container {
                padding: 15px;
            }
            
            .demo-section {
                padding: 15px;
            }
            
            .box {
                width: 70px;
                height: 70px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 id="main-heading">🎯 CSS Selectors Demonstration</h1>

        <!-- ====== ELEMENT SELECTOR ====== -->
        <section class="demo-section">
            <h2>1. Element/Type Selector</h2>
            <p>This paragraph is styled using the element selector.</p>
            <p>All <code>&lt;p&gt;</code> elements get these styles.</p>
            <h3>Subheading using h3 selector</h3>
        </section>

        <!-- ====== CLASS SELECTOR ====== -->
        <section class="demo-section">
            <h2>2. Class Selector</h2>
            <p>Classes are denoted with a <span class="highlight">dot (.)</span> prefix.</p>
            <p>Multiple classes can be applied: 
                <span class="badge badge-primary">Primary</span>
                <span class="badge badge-success">Success</span>
                <span class="badge badge-danger">Danger</span>
            </p>
            <div>
                <div class="box"></div>
                <div class="box rounded"></div>
                <div class="box shadow"></div>
                <div class="box rounded shadow"></div>
            </div>
            <p>
                <span class="text-success">✅ Success text</span>
                <span class="text-danger">❌ Danger text</span>
                <span class="text-muted">Muted text</span>
            </p>
        </section>

        <!-- ====== ID SELECTOR ====== -->
        <section class="demo-section">
            <h2>3. ID Selector</h2>
            <p>IDs are denoted with a <span class="highlight">hash (#)</span> prefix.</p>
            <div id="unique-box">
                <h3>✨ This box is styled using an ID selector</h3>
                <p style="color: rgba(255,255,255,0.9);">IDs should be unique per page.</p>
            </div>
        </section>

        <!-- ====== DESCENDANT SELECTOR ====== -->
        <section class="demo-section">
            <h2>4. Descendant Selector</h2>
            <p>Selects elements <span class="highlight">nested</span> inside other elements.</p>
            <ul class="descendant-demo">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a>
                    <ul>
                        <li><a href="#web">Web Development</a></li>
                        <li><a href="#mobile">Mobile Apps</a></li>
                    </ul>
                </li>
                <li><a href="#contact">Contact</a></li>
            </ul>
            <p style="font-size: 0.85rem; color: #6c757d;">All <code>&lt;a&gt;</code> tags inside <code>.descendant-demo</code> are styled.</p>
        </section>

        <!-- ====== CHILD SELECTOR ====== -->
        <section class="demo-section">
            <h2>5. Child Selector</h2>
            <p>Selects <span class="highlight">direct children</span> only using <code>&gt;</code>.</p>
            <ul class="child-demo">
                <li>Direct child - has green border
                    <ul>
                        <li>Grandchild - has orange border</li>
                        <li>Grandchild - has orange border</li>
                    </ul>
                </li>
                <li>Direct child - has green border
                    <ul>
                        <li>Grandchild - has orange border</li>
                    </ul>
                </li>
            </ul>
        </section>

        <!-- ====== ADJACENT SIBLING SELECTOR ====== -->
        <section class="demo-section">
            <h2>6. Adjacent Sibling Selector</h2>
            <p>Selects the <span class="highlight">immediate</span> sibling using <code>+</code>.</p>
            <h3>Heading 3</h3>
            <p>This paragraph is immediately after h3, so it gets special styling.</p>
            <p>This paragraph is NOT immediately after h3.</p>
        </section>

        <!-- ====== GENERAL SIBLING SELECTOR ====== -->
        <section class="demo-section">
            <h2>7. General Sibling Selector</h2>
            <p>Selects all <span class="highlight">following</span> siblings using <code>~</code>.</p>
            <h3>Another Heading 3</h3>
            <p>This paragraph is after h3</p>
            <p>This paragraph is also after h3</p>
            <div>A div element (not a paragraph)</div>
            <p>This paragraph is also after h3</p>
        </section>

        <!-- ====== ATTRIBUTE SELECTOR ====== -->
        <section class="demo-section">
            <h2>8. Attribute Selector</h2>
            <p>Selects elements based on <span class="highlight">attributes</span>.</p>
            <form>
                <div>
                    <label>Text Input: </label>
                    <input type="text" placeholder="Type something...">
                </div>
                <div style="margin-top: 10px;">
                    <input type="submit" value="Submit">
                </div>
            </form>
            <div style="margin-top: 15px;">
                <a href="https://example.com">Secure HTTPS Link</a>
                <a href="http://example.com">HTTP Link</a>
                <a href="document.pdf">PDF Document</a>
            </div>
            <p title="This is a tooltip">Hover over this text to see the tooltip.</p>
        </section>

        <!-- ====== PSEUDO-CLASS SELECTOR ====== -->
        <section class="demo-section pseudo-demo">
            <h2>9. Pseudo-Class Selector</h2>
            <p>Selects elements in a <span class="highlight">special state</span>.</p>
            <div>
                <a href="#">Hover me</a>
                <a href="#">Click me</a>
                <a href="#">Visit me</a>
            </div>
            <div style="margin-top: 15px;">
                <input type="text" placeholder="Focus on me..." style="padding: 8px 12px; border: 2px solid #ddd; border-radius: 6px; width: 200px;">
            </div>
            <ul style="margin-top: 15px; padding-left: 20px;">
                <li>First item (bold)</li>
                <li>Second item</li>
                <li>Third item</li>
                <li>Fourth item</li>
                <li>Last item (italic)</li>
            </ul>
        </section>

        <!-- ====== PSEUDO-ELEMENT SELECTOR ====== -->
        <section class="demo-section pseudo-element-demo">
            <h2>10. Pseudo-Element Selector</h2>
            <p>Selects a <span class="highlight">specific part</span> of an element.</p>
            <p>This paragraph has special styling for first-line and first-letter, plus before and after pseudo-elements.</p>
            <p>Notice the 📌 before and ✨ after each paragraph.</p>
        </section>

        <!-- ====== COMBINED SELECTORS ====== -->
        <section class="demo-section combined-demo">
            <h2>11. Combined Selectors</h2>
            <p>Combining selectors for <span class="highlight">more specificity</span>.</p>
            <div>
                <div class="box"></div>
                <div class="box rounded"></div>
                <div class="box" id="special-box"></div>
            </div>
            <ul style="margin-top: 15px; font-size: 0.9rem; color: #6c757d;">
                <li>✅ First box: <code>.combined-demo div.box</code> (orange)</li>
                <li>✅ Second box: <code>.combined-demo .box.rounded</code> (purple)</li>
                <li>✅ Third box: <code>.combined-demo #special-box.box</code> (red, larger)</li>
            </ul>
        </section>
    </div>
</body>
</html>
```

---

### Part E: CSS Layout Techniques (Flexbox & Grid)

**Task:** Create a layout page demonstrating Flexbox and Grid.

**Step 1:** Create the HTML file `index-layout.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Layout - Flexbox & Grid</title>
    <style>
        /* ====== RESET ====== */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            background: #f0f4f8;
            padding: 20px;
            color: #2c3e50;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        h1 {
            text-align: center;
            margin-bottom: 30px;
            color: #2c3e50;
            border-bottom: 4px solid #3498db;
            padding-bottom: 15px;
        }

        h2 {
            color: #2980b9;
            margin-bottom: 15px;
        }

        .section {
            background: white;
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 30px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        }

        /* ====== FLEXBOX DEMO ====== */

        /* Flex Container Properties */
        .flex-container {
            display: flex;
            background: #e9ecef;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            min-height: 150px;
            gap: 10px;
            flex-wrap: wrap;
        }

        .flex-container.column {
            flex-direction: column;
        }

        .flex-container.wrap {
            flex-wrap: wrap;
        }

        .flex-container.center {
            justify-content: center;
            align-items: center;
        }

        .flex-container.space-between {
            justify-content: space-between;
        }

        .flex-container.space-around {
            justify-content: space-around;
        }

        .flex-container.align-end {
            align-items: flex-end;
        }

        .flex-item {
            background: #3498db;
            color: white;
            padding: 20px;
            border-radius: 6px;
            text-align: center;
            font-weight: bold;
            flex: 1;
            min-width: 80px;
            transition: all 0.3s ease;
        }

        .flex-item:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
        }

        .flex-item.varied {
            flex: 0 1 auto;
        }

        .flex-item:nth-child(1) { background: #e74c3c; }
        .flex-item:nth-child(2) { background: #27ae60; }
        .flex-item:nth-child(3) { background: #f39c12; }
        .flex-item:nth-child(4) { background: #9b59b6; }
        .flex-item:nth-child(5) { background: #1abc9c; }

        .flex-item.grow-1 { flex: 1; }
        .flex-item.grow-2 { flex: 2; }
        .flex-item.grow-3 { flex: 3; }

        .flex-item.small { padding: 10px 20px; }
        .flex-item.large { padding: 30px 20px; }

        /* ====== GRID DEMO ====== */

        .grid-container {
            display: grid;
            gap: 15px;
            background: #e9ecef;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .grid-container.cols-2 {
            grid-template-columns: 1fr 1fr;
        }

        .grid-container.cols-3 {
            grid-template-columns: repeat(3, 1fr);
        }

        .grid-container.cols-4 {
            grid-template-columns: repeat(4, 1fr);
        }

        .grid-container.cols-auto {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        }

        .grid-container.rows-2 {
            grid-template-rows: auto auto;
        }

        .grid-container.asymmetric {
            grid-template-columns: 1fr 2fr 1fr;
        }

        .grid-item {
            background: #3498db;
            color: white;
            padding: 25px 15px;
            border-radius: 6px;
            text-align: center;
            font-weight: bold;
            transition: all 0.3s ease;
        }

        .grid-item:hover {
            transform: scale(1.02);
            box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
        }

        .grid-item:nth-child(1) { background: #e74c3c; }
        .grid-item:nth-child(2) { background: #27ae60; }
        .grid-item:nth-child(3) { background: #f39c12; }
        .grid-item:nth-child(4) { background: #9b59b6; }
        .grid-item:nth-child(5) { background: #1abc9c; }
        .grid-item:nth-child(6) { background: #e67e22; }
        .grid-item:nth-child(7) { background: #2ecc71; }
        .grid-item:nth-child(8) { background: #e74c3c; }
        .grid-item:nth-child(9) { background: #3498db; }

        .grid-item.span-2 {
            grid-column: span 2;
        }

        .grid-item.span-row-2 {
            grid-row: span 2;
        }

        /* ====== RESPONSIVE ====== */
        @media (max-width: 768px) {
            .grid-container.cols-2,
            .grid-container.cols-3,
            .grid-container.cols-4,
            .grid-container.asymmetric {
                grid-template-columns: 1fr;
            }

            .grid-item.span-2 {
                grid-column: span 1;
            }

            .flex-container {
                flex-direction: column;
                align-items: stretch;
            }

            .flex-item.grow-1,
            .flex-item.grow-2,
            .flex-item.grow-3 {
                flex: 1;
            }
        }

        /* ====== CODE DISPLAY ====== */
        .code-display {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 15px 20px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            font-size: 0.85rem;
            overflow-x: auto;
            margin-top: 15px;
        }

        .code-display .property {
            color: #f39c12;
        }

        .code-display .value {
            color: #2ecc71;
        }

        .code-display .selector {
            color: #e74c3c;
        }

        .code-display .comment {
            color: #6c757d;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📐 CSS Layout Techniques</h1>

        <!-- ====== FLEXBOX SECTION ====== -->
        <section class="section">
            <h2>🔲 Flexbox Layout</h2>
            <p style="margin-bottom: 20px;">Flexbox is a one-dimensional layout model for distributing space and aligning items.</p>

            <!-- Flex: Row -->
            <h3>Flex Direction: Row (Default)</h3>
            <div class="flex-container">
                <div class="flex-item">1</div>
                <div class="flex-item">2</div>
                <div class="flex-item">3</div>
                <div class="flex-item">4</div>
                <div class="flex-item">5</div>
            </div>
            <div class="code-display">
                <span class="selector">.flex-container</span> { <br>
                &nbsp;&nbsp;<span class="property">display</span>: <span class="value">flex</span>; <br>
                &nbsp;&nbsp;<span class="property">flex-direction</span>: <span class="value">row</span>; <br>
                &nbsp;&nbsp;<span class="property">gap</span>: <span class="value">10px</span>; <br>
                }
            </div>

            <!-- Flex: Column -->
            <h3 style="margin-top: 25px;">Flex Direction: Column</h3>
            <div class="flex-container column" style="min-height: 200px;">
                <div class="flex-item">1</div>
                <div class="flex-item">2</div>
                <div class="flex-item">3</div>
            </div>

            <!-- Flex: Center -->
            <h3 style="margin-top: 25px;">Justify & Align: Center</h3>
            <div class="flex-container center" style="min-height: 150px;">
                <div class="flex-item" style="flex: 0 1 auto; padding: 15px 30px;">Centered</div>
            </div>

            <!-- Flex: Space Between -->
            <h3 style="margin-top: 25px;">Justify: Space Between</h3>
            <div class="flex-container space-between">
                <div class="flex-item" style="flex: 0 1 auto; padding: 15px 25px;">Item</div>
                <div class="flex-item" style="flex: 0 1 auto; padding: 15px 25px;">Item</div>
                <div class="flex-item" style="flex: 0 1 auto; padding: 15px 25px;">Item</div>
            </div>

            <!-- Flex: Grow -->
            <h3 style="margin-top: 25px;">Flex: Grow</h3>
            <div class="flex-container">
                <div class="flex-item grow-1">flex: 1</div>
                <div class="flex-item grow-2">flex: 2</div>
                <div class="flex-item grow-3">flex: 3</div>
            </div>
            <div class="code-display">
                <span class="selector">.grow-1</span> { <span class="property">flex</span>: <span class="value">1</span>; } &nbsp;&nbsp;
                <span class="selector">.grow-2</span> { <span class="property">flex</span>: <span class="value">2</span>; } &nbsp;&nbsp;
                <span class="selector">.grow-3</span> { <span class="property">flex</span>: <span class="value">3</span>; }
            </div>

            <!-- Flex: Wrap -->
            <h3 style="margin-top: 25px;">Flex: Wrap</h3>
            <div class="flex-container wrap" style="min-height: auto;">
                <div class="flex-item" style="flex: 0 1 150px;">Item 1</div>
                <div class="flex-item" style="flex: 0 1 150px;">Item 2</div>
                <div class="flex-item" style="flex: 0 1 150px;">Item 3</div>
                <div class="flex-item" style="flex: 0 1 150px;">Item 4</div>
                <div class="flex-item" style="flex: 0 1 150px;">Item 5</div>
                <div class="flex-item" style="flex: 0 1 150px;">Item 6</div>
            </div>
        </section>

        <!-- ====== GRID SECTION ====== -->
        <section class="section">
            <h2>🔲 CSS Grid Layout</h2>
            <p style="margin-bottom: 20px;">CSS Grid is a two-dimensional layout system for creating complex layouts.</p>

            <!-- Grid: 2 Columns -->
            <h3>Grid: 2 Columns</h3>
            <div class="grid-container cols-2">
                <div class="grid-item">1</div>
                <div class="grid-item">2</div>
                <div class="grid-item">3</div>
                <div class="grid-item">4</div>
            </div>
            <div class="code-display">
                <span class="selector">.grid-container</span> { <br>
                &nbsp;&nbsp;<span class="property">display</span>: <span class="value">grid</span>; <br>
                &nbsp;&nbsp;<span class="property">grid-template-columns</span>: <span class="value">1fr 1fr</span>; <br>
                &nbsp;&nbsp;<span class="property">gap</span>: <span class="value">15px</span>; <br>
                }
            </div>

            <!-- Grid: 3 Columns -->
            <h3 style="margin-top: 25px;">Grid: 3 Columns</h3>
            <div class="grid-container cols-3">
                <div class="grid-item">1</div>
                <div class="grid-item">2</div>
                <div class="grid-item">3</div>
                <div class="grid-item">4</div>
                <div class="grid-item">5</div>
                <div class="grid-item">6</div>
            </div>

            <!-- Grid: Asymmetric -->
            <h3 style="margin-top: 25px;">Grid: Asymmetric Columns</h3>
            <div class="grid-container asymmetric">
                <div class="grid-item">1fr</div>
                <div class="grid-item">2fr</div>
                <div class="grid-item">1fr</div>
                <div class="grid-item">1fr</div>
                <div class="grid-item">2fr</div>
                <div class="grid-item">1fr</div>
            </div>
            <div class="code-display">
                <span class="selector">.grid-container</span> { <br>
                &nbsp;&nbsp;<span class="property">grid-template-columns</span>: <span class="value">1fr 2fr 1fr</span>; <br>
                }
            </div>

            <!-- Grid: Auto-fit -->
            <h3 style="margin-top: 25px;">Grid: Auto-fit (Responsive)</h3>
            <div class="grid-container cols-auto">
                <div class="grid-item">1</div>
                <div class="grid-item">2</div>
                <div class="grid-item">3</div>
                <div class="grid-item">4</div>
                <div class="grid-item">5</div>
            </div>
            <div class="code-display">
                <span class="selector">.grid-container</span> { <br>
                &nbsp;&nbsp;<span class="property">grid-template-columns</span>: <span class="value">repeat(auto-fit, minmax(150px, 1fr))</span>; <br>
                }
            </div>

            <!-- Grid: Span -->
            <h3 style="margin-top: 25px;">Grid: Spanning Columns</h3>
            <div class="grid-container cols-3">
                <div class="grid-item">1</div>
                <div class="grid-item span-2">2 (span 2)</div>
                <div class="grid-item">3</div>
                <div class="grid-item">4</div>
                <div class="grid-item">5</div>
                <div class="grid-item">6</div>
            </div>
            <div class="code-display">
                <span class="selector">.span-2</span> { <br>
                &nbsp;&nbsp;<span class="property">grid-column</span>: <span class="value">span 2</span>; <br>
                }
            </div>

            <!-- Grid: Row Span -->
            <h3 style="margin-top: 25px;">Grid: Row Span</h3>
            <div class="grid-container cols-3 rows-2">
                <div class="grid-item">1</div>
                <div class="grid-item span-row-2">2 (span 2 rows)</div>
                <div class="grid-item">3</div>
                <div class="grid-item">4</div>
                <div class="grid-item">5</div>
            </div>
            <div class="code-display">
                <span class="selector">.span-row-2</span> { <br>
                &nbsp;&nbsp;<span class="property">grid-row</span>: <span class="value">span 2</span>; <br>
                }
            </div>
        </section>

        <!-- ====== COMPARISON SECTION ====== -->
        <section class="section">
            <h2>📊 Flexbox vs Grid Comparison</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <thead>
                    <tr style="background: #2c3e50; color: white;">
                        <th style="padding: 12px 15px; text-align: left;">Feature</th>
                        <th style="padding: 12px 15px; text-align: left; background: #3498db;">Flexbox</th>
                        <th style="padding: 12px 15px; text-align: left; background: #27ae60;">Grid</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px 15px; font-weight: bold;">Dimensionality</td>
                        <td style="padding: 10px 15px;">One-dimensional (row/column)</td>
                        <td style="padding: 10px 15px;">Two-dimensional (rows + columns)</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee; background: #f8f9fa;">
                        <td style="padding: 10px 15px; font-weight: bold;">Best For</td>
                        <td style="padding: 10px 15px;">Components, nav bars, small layouts</td>
                        <td style="padding: 10px 15px;">Page layouts, complex grids</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px 15px; font-weight: bold;">Alignment</td>
                        <td style="padding: 10px 15px;">Easier alignment in one direction</td>
                        <td style="padding: 10px 15px;">More control over both axes</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee; background: #f8f9fa;">
                        <td style="padding: 10px 15px; font-weight: bold;">Item Sizing</td>
                        <td style="padding: 10px 15px;">Items size based on content</td>
                        <td style="padding: 10px 15px;">Items size based on grid cells</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 15px; font-weight: bold;">Browser Support</td>
                        <td style="padding: 10px 15px; color: #27ae60;">✅ Excellent</td>
                        <td style="padding: 10px 15px; color: #27ae60;">✅ Excellent</td>
                    </tr>
                </tbody>
            </table>
        </section>
    </div>
</body>
</html>
```

---

### Part F: CSS Animations & Transitions

**Task:** Create a page demonstrating CSS animations and transitions.

**Step 1:** Create the HTML file `index-animations.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Animations & Transitions</title>
    <style>
        /* ====== BASE ====== */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f0f4f8;
            padding: 30px;
            color: #2c3e50;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
        }

        h1 {
            text-align: center;
            margin-bottom: 30px;
            color: #2c3e50;
        }

        .section {
            background: white;
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 25px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        }

        h2 {
            color: #2980b9;
            margin-bottom: 15px;
        }

        .demo-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 20px;
            margin: 15px 0;
        }

        /* ====== TRANSITIONS ====== */

        .transition-box {
            background: #3498db;
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.4s ease;
        }

        .transition-box:hover {
            transform: translateY(-5px) scale(1.05);
            background: #e74c3c;
            box-shadow: 0 10px 30px rgba(231, 76, 60, 0.3);
            border-radius: 20px;
        }

        .transition-box.width:hover {
            transform: none;
            width: 200px;
            background: #27ae60;
        }

        .transition-box.opacity {
            background: #9b59b6;
        }

        .transition-box.opacity:hover {
            opacity: 0.3;
            transform: none;
            background: #9b59b6;
        }

        .transition-box.rotate:hover {
            transform: rotate(180deg);
            background: #f39c12;
            border-radius: 50%;
        }

        .transition-box.skew:hover {
            transform: skewX(-10deg) skewY(5deg);
            background: #1abc9c;
        }

        .transition-box.shadow:hover {
            transform: none;
            background: #e67e22;
            box-shadow: 0 0 0 10px rgba(230, 126, 34, 0.3);
        }

        /* Multiple transitions */
        .transition-box.multi {
            background: #2ecc71;
            transition: 
                transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55),
                background 0.4s ease,
                border-radius 0.6s ease,
                box-shadow 0.4s ease;
        }

        .transition-box.multi:hover {
            transform: translateY(-10px) scale(1.1) rotate(5deg);
            background: #e74c3c;
            border-radius: 30px 0 30px 0;
            box-shadow: 0 15px 40px rgba(231, 76, 60, 0.4);
        }

        /* ====== ANIMATIONS ====== */

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            30% { transform: translateY(-30px); }
            50% { transform: translateY(0); }
            70% { transform: translateY(-15px); }
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @keyframes slide-in {
            0% { transform: translateX(-100px); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
        }

        @keyframes rainbow {
            0% { background: #e74c3c; }
            16% { background: #f39c12; }
            33% { background: #f1c40f; }
            50% { background: #2ecc71; }
            66% { background: #3498db; }
            83% { background: #9b59b6; }
            100% { background: #e74c3c; }
        }

        @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-10px) rotate(-3deg); }
            75% { transform: translateY(10px) rotate(3deg); }
        }

        @keyframes typewriter {
            from { width: 0; }
            to { width: 100%; }
        }

        @keyframes blink {
            0%, 100% { border-color: transparent; }
            50% { border-color: #2c3e50; }
        }

        .animation-box {
            background: #3498db;
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px;
            font-weight: bold;
        }

        .animation-box.bounce {
            animation: bounce 1.5s ease infinite;
        }

        .animation-box.pulse {
            animation: pulse 1.5s ease infinite;
        }

        .animation-box.spin {
            animation: spin 3s linear infinite;
        }

        .animation-box.slide-in {
            animation: slide-in 0.8s ease forwards;
        }

        .animation-box.rainbow {
            animation: rainbow 6s linear infinite;
        }

        .animation-box.float {
            animation: float 3s ease-in-out infinite;
        }

        /* Typewriter text */
        .typewriter {
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
            border-right: 3px solid #2c3e50;
            animation: typewriter 3s steps(30) 1s forwards, blink 0.8s step-end infinite;
            width: 0;
            font-size: 1.2rem;
            font-weight: bold;
            color: #2c3e50;
        }

        /* ====== KEYFRAME DEMO ====== */
        .keyframe-demo {
            display: flex;
            flex-direction: column;
            gap: 15px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }

        .keyframe-row {
            display: flex;
            align-items: center;
            gap: 15px;
            flex-wrap: wrap;
        }

        .keyframe-row label {
            font-weight: bold;
            min-width: 120px;
        }

        .keyframe-ball {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #3498db;
        }

        .keyframe-ball.linear { animation: slide-in 2s linear infinite alternate; }
        .keyframe-ball.ease { animation: slide-in 2s ease infinite alternate; }
        .keyframe-ball.ease-in { animation: slide-in 2s ease-in infinite alternate; }
        .keyframe-ball.ease-out { animation: slide-in 2s ease-out infinite alternate; }
        .keyframe-ball.ease-in-out { animation: slide-in 2s ease-in-out infinite alternate; }
        .keyframe-ball.bounce-timing { animation: slide-in 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite alternate; }

        /* ====== CODE DISPLAY ====== */
        .code-display {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 15px 20px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            font-size: 0.85rem;
            overflow-x: auto;
            margin-top: 15px;
        }

        .code-display .property { color: #f39c12; }
        .code-display .value { color: #2ecc71; }
        .code-display .selector { color: #e74c3c; }
        .code-display .key { color: #9b59b6; }

        /* ====== RESPONSIVE ====== */
        @media (max-width: 600px) {
            body { padding: 15px; }
            .demo-grid { grid-template-columns: 1fr 1fr; }
            .keyframe-row { flex-direction: column; align-items: flex-start; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>✨ CSS Animations & Transitions</h1>

        <!-- ====== TRANSITIONS ====== -->
        <section class="section">
            <h2>🔄 CSS Transitions</h2>
            <p style="margin-bottom: 15px;">Transitions allow smooth changes between property values over a specified duration.</p>

            <div class="demo-grid">
                <div class="transition-box">Hover Me</div>
                <div class="transition-box width">Width Change</div>
                <div class="transition-box opacity">Opacity</div>
                <div class="transition-box rotate">Rotate</div>
                <div class="transition-box skew">Skew</div>
                <div class="transition-box shadow">Shadow</div>
                <div class="transition-box multi">Multi Transition</div>
            </div>

            <div class="code-display">
                <span class="selector">.transition-box</span> { <br>
                &nbsp;&nbsp;<span class="property">transition</span>: <span class="value">all 0.4s ease</span>; <br>
                } <br><br>
                <span class="selector">.transition-box:hover</span> { <br>
                &nbsp;&nbsp;<span class="property">transform</span>: <span class="value">translateY(-5px) scale(1.05)</span>; <br>
                &nbsp;&nbsp;<span class="property">background</span>: <span class="value">#e74c3c</span>; <br>
                &nbsp;&nbsp;<span class="property">box-shadow</span>: <span class="value">0 10px 30px rgba(231,76,60,0.3)</span>; <br>
                }
            </div>
        </section>

        <!-- ====== ANIMATIONS ====== -->
        <section class="section">
            <h2>🎬 CSS Animations</h2>
            <p style="margin-bottom: 15px;">Animations use <code>@keyframes</code> to define complex, multi-step animations.</p>

            <div class="demo-grid">
                <div class="animation-box bounce">Bounce</div>
                <div class="animation-box pulse">Pulse</div>
                <div class="animation-box spin">Spin</div>
                <div class="animation-box slide-in">Slide In</div>
                <div class="animation-box rainbow">Rainbow</div>
                <div class="animation-box float">Float</div>
            </div>

            <div style="margin-top: 20px;">
                <h3 style="color: #2c3e50; margin-bottom: 10px;">Typewriter Effect</h3>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                    <span class="typewriter">CSS Animations are powerful!</span>
                </div>
            </div>

            <div class="code-display">
                <span class="key">@keyframes</span> <span class="selector">bounce</span> { <br>
                &nbsp;&nbsp;<span class="value">0%</span>, <span class="value">100%</span> { <span class="property">transform</span>: <span class="value">translateY(0)</span>; } <br>
                &nbsp;&nbsp;<span class="value">30%</span> { <span class="property">transform</span>: <span class="value">translateY(-30px)</span>; } <br>
                &nbsp;&nbsp;<span class="value">50%</span> { <span class="property">transform</span>: <span class="value">translateY(0)</span>; } <br>
                &nbsp;&nbsp;<span class="value">70%</span> { <span class="property">transform</span>: <span class="value">translateY(-15px)</span>; } <br>
                } <br><br>
                <span class="selector">.bounce</span> { <br>
                &nbsp;&nbsp;<span class="property">animation</span>: <span class="value">bounce 1.5s ease infinite</span>; <br>
                }
            </div>
        </section>

        <!-- ====== TIMING FUNCTIONS ====== -->
        <section class="section">
            <h2>⏱️ Timing Functions</h2>
            <p style="margin-bottom: 15px;">Different timing functions create different motion feels.</p>

            <div class="keyframe-demo">
                <div class="keyframe-row">
                    <label>Linear:</label>
                    <div class="keyframe-ball linear"></div>
                    <span style="font-size: 0.85rem; color: #6c757d;">Constant speed</span>
                </div>
                <div class="keyframe-row">
                    <label>Ease:</label>
                    <div class="keyframe-ball ease"></div>
                    <span style="font-size: 0.85rem; color: #6c757d;">Slow start, fast middle, slow end</span>
                </div>
                <div class="keyframe-row">
                    <label>Ease-in:</label>
                    <div class="keyframe-ball ease-in"></div>
                    <span style="font-size: 0.85rem; color: #6c757d;">Slow start</span>
                </div>
                <div class="keyframe-row">
                    <label>Ease-out:</label>
                    <div class="keyframe-ball ease-out"></div>
                    <span style="font-size: 0.85rem; color: #6c757d;">Slow end</span>
                </div>
                <div class="keyframe-row">
                    <label>Ease-in-out:</label>
                    <div class="keyframe-ball ease-in-out"></div>
                    <span style="font-size: 0.85rem; color: #6c757d;">Slow start and end</span>
                </div>
                <div class="keyframe-row">
                    <label>Bounce (cubic-bezier):</label>
                    <div class="keyframe-ball bounce-timing"></div>
                    <span style="font-size: 0.85rem; color: #6c757d;">Overshoot effect</span>
                </div>
            </div>

            <div class="code-display">
                <span class="comment">/* Timing functions for animations */</span> <br>
                <span class="selector">.linear</span> { <span class="property">animation-timing-function</span>: <span class="value">linear</span>; } <br>
                <span class="selector">.ease</span> { <span class="property">animation-timing-function</span>: <span class="value">ease</span>; } <br>
                <span class="selector">.ease-in</span> { <span class="property">animation-timing-function</span>: <span class="value">ease-in</span>; } <br>
                <span class="selector">.ease-out</span> { <span class="property">animation-timing-function</span>: <span class="value">ease-out</span>; } <br>
                <span class="selector">.ease-in-out</span> { <span class="property">animation-timing-function</span>: <span class="value">ease-in-out</span>; } <br>
                <span class="selector">.bounce-timing</span> { <br>
                &nbsp;&nbsp;<span class="property">animation-timing-function</span>: <span class="value">cubic-bezier(0.68, -0.55, 0.265, 1.55)</span>; <br>
                }
            </div>
        </section>
    </div>
</body>
</html>
```

---

## Complete Project Structure

```
experiment-2-css/
│
├── index-external.html
├── index-internal.html
├── index-inline.html
├── index-selectors.html
├── index-layout.html
├── index-animations.html
├── styles.css
└── README.md
```

---

## Conclusion

In this experiment, you have learned:

1. **Three Types of CSS**:
   - **Inline CSS**: Applied directly using `style` attribute (highest specificity)
   - **Internal CSS**: Defined in `<style>` tag within `<head>` (single page)
   - **External CSS**: Separate `.css` file linked via `<link>` (recommended)

2. **CSS Selectors**:
   - Element, Class, ID, Descendant, Child, Sibling, Attribute, Pseudo-class, Pseudo-element

3. **CSS Box Model**:
   - Content → Padding → Border → Margin

4. **CSS Layout**:
   - **Flexbox**: One-dimensional layout for components
   - **Grid**: Two-dimensional layout for page structure

5. **CSS Animations**:
   - **Transitions**: Smooth property changes on state change
   - **Keyframe Animations**: Complex multi-step animations

6. **Responsive Design**:
   - Media queries for different screen sizes

### Backend Development Context

CSS skills are essential for backend developers because:

- **Admin Interfaces**: Backend developers create admin dashboards
- **Template Engines**: CSS is used with template engines (EJS, Jinja2)
- **API Documentation**: Styling Swagger/OpenAPI documentation
- **Error Pages**: Creating professional error pages
- **Email Templates**: Styling transactional emails
- **Content Management**: CMS styling

---

## Practice Tasks

### Task 1: CSS Types Practice
Create a single HTML page that demonstrates all three CSS types:
- Use inline CSS for the header
- Use internal CSS for the main content
- Use external CSS for the footer

### Task 2: Selector Challenge
Create a page that uses at least 10 different CSS selectors including:
- Element, Class, ID
- Descendant, Child, Sibling
- Attribute, Pseudo-class, Pseudo-element

### Task 3: Layout Creation
Recreate a typical website layout using:
- Flexbox for the navigation bar
- CSS Grid for the main content grid
- Responsive design for mobile

### Task 4: Animation Gallery
Create an animated gallery with:
- Hover transitions on cards
- A loading spinner animation
- A subtle background animation

### Task 5: Theme Creator
Create a page with a "dark mode" toggle that changes:
- Background colors
- Text colors
- Card styles

---

## Viva Questions

### Basic Level

1. **What are the three types of CSS?**
   - Inline, Internal, and External CSS.

2. **What is the difference between `class` and `id`?**
   - Classes can be used multiple times; IDs must be unique per page.

3. **What is the CSS box model?**
   - The box model consists of: Content → Padding → Border → Margin.

4. **What is the difference between `margin` and `padding`?**
   - Margin is space outside the border; padding is space inside the border.

5. **What are pseudo-classes?**
   - Pseudo-classes define special states of elements (e.g., `:hover`, `:active`).

6. **What is the difference between `display: flex` and `display: grid`?**
   - Flexbox is one-dimensional; Grid is two-dimensional.

7. **What is the `!important` declaration used for?**
   - It overrides all other style declarations.

8. **What is CSS specificity?**
   - It determines which styles apply when multiple rules conflict.

9. **What is the difference between `display: inline` and `display: block`?**
   - Inline: elements stay in line; Block: elements take full width.

10. **What is `display: flex` used for?**
    - It creates a flex container for flexible layout.

### Intermediate Level

11. **Explain the concept of CSS cascade.**
    - The cascade is the process of combining styles from different sources based on priority.

12. **What are pseudo-elements? Give examples.**
    - Pseudo-elements style specific parts of elements (e.g., `::first-line`, `::before`).

13. **What is the difference between `flex-direction: row` and `flex-direction: column`?**
    - Row: items flow horizontally; Column: items flow vertically.

14. **What is `flex-wrap` used for?**
    - It controls whether flex items wrap to the next line.

15. **Explain `grid-template-columns` and `grid-template-rows`.**
    - They define the number and size of columns/rows in a grid.

16. **What is the difference between `justify-content` and `align-items`?**
    - Justify-content: main axis alignment; Align-items: cross axis alignment.

17. **How do you create a responsive layout in CSS?**
    - Using media queries, flexible units (%, rem, vw/vh), and responsive frameworks.

18. **What is `box-sizing: border-box` used for?**
    - It includes padding and border in the element's total width/height.

19. **What are CSS custom properties (CSS variables)?**
    - They allow storing values for reuse throughout the document.

20. **Explain the `position` property values.**
    - Static, relative, absolute, fixed, sticky.

### Advanced Level

21. **How does CSS specificity calculation work?**
    - Inline styles (1000) > ID (100) > Class (10) > Element (1).

22. **What is the difference between `display: none` and `visibility: hidden`?**
    - None: removes from layout; Hidden: hides but maintains space.

23. **Explain `z-index` and its stacking context.**
    - Z-index controls stacking order; stacking contexts isolate elements.

24. **What is `flex: 1` equivalent to?**
    - `flex: 1 1 0%` (flex-grow: 1, flex-shrink: 1, flex-basis: 0%).

25. **Explain the `@keyframes` rule.**
    - It defines the steps of an animation.

26. **What are `rem` and `em` units?**
    - `rem`: relative to root font size; `em`: relative to parent font size.

27. **How do you implement dark mode in CSS?**
    - Using CSS custom properties and `prefers-color-scheme` media query.

28. **What is the `object-fit` property used for?**
    - It controls how replaced elements (images/videos) fit their containers.

29. **Explain `CSS grid` auto-placement.**
    - Items are placed automatically into grid cells based on order.

30. **What is the `will-change` property used for?**
    - It hints to browsers about upcoming changes for performance optimization.