# Experiment 1: Create a web page with all possible elements of HTML5

## Course Outcome Mapped: CO2 (Create and build web pages and applications)


## Objectives

After completing this experiment, students will be able to:
1. Create a well-structured HTML5 web page using appropriate semantic elements
2. Differentiate between HTML4 and HTML5 structural elements
3. Apply various HTML5 form input types and attributes
4. Implement multimedia elements (audio, video) in web pages
5. Understand the Document Object Model (DOM) structure
6. Create accessible and SEO-friendly web pages using semantic HTML

---

## Requirements/Tools

| Component | Specification |
|-----------|---------------|
| Operating System | Windows 10/11, macOS, or Linux |
| Browser | Google Chrome (v90+), Mozilla Firefox (v88+), or Edge (v90+) |
| Code Editor | VS Code (recommended with Live Server extension), Sublime Text, or Notepad++ |
| Browser DevTools | Chrome DevTools / Firefox Developer Tools |
| Version Control | Git (optional, for tracking changes) |

---

## Theory

### What is HTML?

HTML (HyperText Markup Language) is the standard markup language used to create web pages. It provides the structure and content of a webpage, defining elements like headings, paragraphs, links, images, forms, and multimedia.

### HTML Evolution: From HTML4 to HTML5

HTML5, introduced in 2014, brought significant improvements:

| Feature | HTML4 | HTML5 |
|---------|-------|-------|
| **Doctype** | `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">` | `<!DOCTYPE html>` |
| **Semantic Elements** | Limited (`<div>`, `<span>`) | Rich (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`) |
| **Multimedia** | Required plugins (Flash) | Native `<audio>` and `<video>` support |
| **Forms** | Basic input types | Advanced input types (email, url, date, range, color, etc.) |
| **Graphical Content** | Required Flash/SVG plugins | Native `<canvas>` and `<svg>` |
| **Client-side Storage** | Only cookies | LocalStorage, SessionStorage, IndexedDB |
| **Geolocation** | Not supported | Native Geolocation API |
| **Offline Support** | Not supported | Application Cache, Service Workers |

### Backend Development Context

Understanding HTML is crucial for backend development because:

1. **Template Rendering**: Backend frameworks (Django, Node.js with EJS, Flask with Jinja2) render HTML templates dynamically
2. **API Responses**: HTML can be served as a response from backend APIs
3. **Server-Side Rendering (SSR)**: Many modern frameworks (Next.js, Nuxt.js) use SSR where HTML is generated on the server
4. **Form Handling**: Backend processes form data submitted through HTML forms
5. **Web Scraping**: Understanding HTML structure is essential for data extraction from websites

### HTML Document Structure

```html
<!DOCTYPE html>              <!-- Document Type Declaration -->
<html lang="en">              <!-- Root element, lang attribute for accessibility -->
<head>                       <!-- Metadata container -->
    <meta charset="UTF-8">   <!-- Character encoding -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- Responsive design -->
    <title>Page Title</title> <!-- Browser tab title -->
</head>
<body>                       <!-- Visible content container -->
    <!-- Content goes here -->
</body>
</html>
```

### Semantic HTML Elements

Semantic elements clearly describe their meaning to both the browser and developer:

```html
<!-- Header - Represents introductory content or navigational aids -->
<header>
    <h1>Company Name</h1>
    <nav>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
        </ul>
    </nav>
</header>

<!-- Navigation - Represents section with navigation links -->
<nav>
    <!-- navigation links -->
</nav>

<!-- Main - Represents the dominant content -->
<main>
    <!-- primary content -->
    <article>
        <!-- self-contained composition -->
        <h2>Article Title</h2>
        <p>Article content...</p>
    </article>
    
    <section>
        <!-- thematic grouping of content -->
        <h2>Section Title</h2>
        <p>Section content...</p>
    </section>
</main>

<!-- Aside - Represents tangentially related content -->
<aside>
    <!-- sidebar content -->
</aside>

<!-- Footer - Represents footer content -->
<footer>
    <!-- copyright, contact info -->
</footer>
```

### Why Use Semantic HTML?

1. **Accessibility**: Screen readers rely on semantic elements for navigation
2. **SEO**: Search engines prioritize content based on semantic structure
3. **Maintainability**: Code is cleaner and more understandable
4. **Browser Compatibility**: Better rendered across devices
5. **Faster Development**: Clear structure guides development

---

## HTML5 Tags Reference

### Complete Alphabetical List of HTML Tags

<details>
<summary><b>Click to expand full alphabetical list</b></summary>

| Tag | Description |
|-----|-------------|
| `<!-- -->` | Comment |
| `<!DOCTYPE>` | Document type declaration |
| `<a>` | Anchor (hyperlink) |
| `<abbr>` | Abbreviation |
| `<acronym>` | Acronym (deprecated) |
| `<address>` | Contact information |
| `<applet>` | Java applet (deprecated) |
| `<area>` | Image map area |
| `<article>` | Article content |
| `<aside>` | Sidebar content |
| `<audio>` | Audio content |
| `<b>` | Bold text |
| `<base>` | Base URL for relative URLs |
| `<basefont>` | Base font (deprecated) |
| `<bdi>` | Bidirectional isolation |
| `<bdo>` | Bidirectional override |
| `<big>` | Big text (deprecated) |
| `<blockquote>` | Block quotation |
| `<body>` | Document body |
| `<br>` | Line break |
| `<button>` | Clickable button |
| `<canvas>` | Graphics container |
| `<caption>` | Table caption |
| `<center>` | Centered text (deprecated) |
| `<cite>` | Citation |
| `<code>` | Code snippet |
| `<col>` | Table column |
| `<colgroup>` | Table column group |
| `<data>` | Machine-readable data |
| `<datalist>` | Input suggestions |
| `<dd>` | Description list definition |
| `<del>` | Deleted text |
| `<details>` | Expandable details |
| `<dfn>` | Definition |
| `<dialog>` | Dialog box |
| `<dir>` | Directory list (deprecated) |
| `<div>` | Division/container |
| `<dl>` | Description list |
| `<dt>` | Description list term |
| `<em>` | Emphasis |
| `<embed>` | Embedded content |
| `<fieldset>` | Form fieldset |
| `<figcaption>` | Figure caption |
| `<figure>` | Figure content |
| `<font>` | Font (deprecated) |
| `<footer>` | Footer section |
| `<form>` | Form |
| `<frame>` | Frame (deprecated) |
| `<frameset>` | Frameset (deprecated) |
| `<h1>` to `<h6>` | Headings |
| `<head>` | Document head |
| `<header>` | Header section |
| `<hgroup>` | Heading group |
| `<hr>` | Horizontal rule |
| `<html>` | HTML document root |
| `<i>` | Italic text |
| `<iframe>` | Inline frame |
| `<img>` | Image |
| `<input>` | Input field |
| `<ins>` | Inserted text |
| `<kbd>` | Keyboard input |
| `<label>` | Form label |
| `<legend>` | Fieldset legend |
| `<li>` | List item |
| `<link>` | External resource |
| `<main>` | Main content |
| `<map>` | Image map |
| `<mark>` | Marked/highlighted text |
| `<menu>` | Menu |
| `<menuitem>` | Menu item |
| `<meta>` | Metadata |
| `<meter>` | Gauge/measure |
| `<nav>` | Navigation |
| `<noframes>` | No frames content (deprecated) |
| `<noscript>` | No script content |
| `<object>` | Embedded object |
| `<ol>` | Ordered list |
| `<optgroup>` | Option group |
| `<option>` | Option |
| `<output>` | Calculation output |
| `<p>` | Paragraph |
| `<param>` | Object parameter |
| `<picture>` | Responsive images |
| `<pre>` | Preformatted text |
| `<progress>` | Progress bar |
| `<q>` | Inline quotation |
| `<rp>` | Ruby parenthesis |
| `<rt>` | Ruby text |
| `<ruby>` | Ruby annotation |
| `<s>` | Strikethrough |
| `<samp>` | Sample output |
| `<script>` | Script |
| `<section>` | Section |
| `<select>` | Dropdown |
| `<small>` | Small text |
| `<source>` | Media source |
| `<span>` | Inline container |
| `<strike>` | Strikethrough (deprecated) |
| `<strong>` | Strong importance |
| `<style>` | CSS styles |
| `<sub>` | Subscript |
| `<summary>` | Details summary |
| `<sup>` | Superscript |
| `<svg>` | SVG graphics |
| `<table>` | Table |
| `<tbody>` | Table body |
| `<td>` | Table cell |
| `<template>` | Template |
| `<textarea>` | Text area |
| `<tfoot>` | Table footer |
| `<th>` | Table header |
| `<thead>` | Table header group |
| `<time>` | Time |
| `<title>` | Page title |
| `<tr>` | Table row |
| `<track>` | Media track |
| `<tt>` | Teletype text (deprecated) |
| `<u>` | Underline |
| `<ul>` | Unordered list |
| `<var>` | Variable |
| `<video>` | Video content |
| `<wbr>` | Word break opportunity |

</details>

### Tags Grouped by Functionality

<details>
<summary><b>Click to expand tags by functionality</b></summary>

#### Document Structure
| Tag | Description | Example |
|-----|-------------|---------|
| `<!DOCTYPE>` | Document type | `<!DOCTYPE html>` |
| `<html>` | HTML document root | `<html lang="en">` |
| `<head>` | Document head | `<head>...</head>` |
| `<body>` | Document body | `<body>...</body>` |

#### Metadata
| Tag | Description | Example |
|-----|-------------|---------|
| `<meta>` | Metadata | `<meta charset="UTF-8">` |
| `<title>` | Page title | `<title>My Page</title>` |
| `<link>` | External resource | `<link rel="stylesheet" href="style.css">` |
| `<style>` | CSS styles | `<style>body{color:red;}</style>` |
| `<base>` | Base URL | `<base href="https://example.com/">` |

#### Text Formatting
| Tag | Description | Example |
|-----|-------------|---------|
| `<p>` | Paragraph | `<p>Text content</p>` |
| `<h1>`-`<h6>` | Headings | `<h1>Main Title</h1>` |
| `<b>` | Bold (semantic emphasis) | `<b>Bold</b>` |
| `<strong>` | Strong importance | `<strong>Important</strong>` |
| `<i>` | Italic (semantic emphasis) | `<i>Italic</i>` |
| `<em>` | Emphasis | `<em>Emphasized</em>` |
| `<u>` | Underline | `<u>Underlined</u>` |
| `<s>` | Strikethrough | `<s>Strikethrough</s>` |
| `<mark>` | Highlighted | `<mark>Highlighted</mark>` |
| `<small>` | Small text | `<small>Fine print</small>` |
| `<del>` | Deleted text | `<del>Removed</del>` |
| `<ins>` | Inserted text | `<ins>Added</ins>` |
| `<sub>` | Subscript | `H<sub>2</sub>O` |
| `<sup>` | Superscript | `E=mc<sup>2</sup>` |
| `<pre>` | Preformatted | `<pre>Code block</pre>` |
| `<code>` | Code snippet | `<code>var x = 10;</code>` |
| `<blockquote>` | Blockquote | `<blockquote>Quote</blockquote>` |
| `<q>` | Inline quote | `<q>Short quote</q>` |
| `<abbr>` | Abbreviation | `<abbr title="HyperText Markup Language">HTML</abbr>` |
| `<address>` | Contact info | `<address>email@example.com</address>` |
| `<br>` | Line break | `<br>` |
| `<hr>` | Horizontal rule | `<hr>` |

#### Links and Navigation
| Tag | Description | Example |
|-----|-------------|---------|
| `<a>` | Anchor | `<a href="https://example.com">Link</a>` |
| `<nav>` | Navigation | `<nav>...</nav>` |

#### Lists
| Tag | Description | Example |
|-----|-------------|---------|
| `<ul>` | Unordered list | `<ul><li>Item</li></ul>` |
| `<ol>` | Ordered list | `<ol><li>Item</li></ol>` |
| `<li>` | List item | `<li>Item</li>` |
| `<dl>` | Description list | `<dl><dt>Term</dt><dd>Definition</dd></dl>` |
| `<dt>` | Description term | `<dt>Term</dt>` |
| `<dd>` | Description definition | `<dd>Definition</dd>` |

#### Tables
| Tag | Description | Example |
|-----|-------------|---------|
| `<table>` | Table | `<table>...</table>` |
| `<thead>` | Table head | `<thead>...</thead>` |
| `<tbody>` | Table body | `<tbody>...</tbody>` |
| `<tfoot>` | Table foot | `<tfoot>...</tfoot>` |
| `<tr>` | Table row | `<tr>...</tr>` |
| `<th>` | Table header cell | `<th>Name</th>` |
| `<td>` | Table data cell | `<td>John</td>` |
| `<caption>` | Table caption | `<caption>Employee List</caption>` |
| `<colgroup>` | Column group | `<colgroup>...</colgroup>` |
| `<col>` | Column | `<col span="2">` |

#### Forms
| Tag | Description | Example |
|-----|-------------|---------|
| `<form>` | Form | `<form action="/submit" method="POST">` |
| `<input>` | Input field | `<input type="text" name="username">` |
| `<label>` | Form label | `<label for="username">Username:</label>` |
| `<select>` | Dropdown | `<select name="city">` |
| `<option>` | Option | `<option value="NY">New York</option>` |
| `<optgroup>` | Option group | `<optgroup label="Cities">` |
| `<textarea>` | Text area | `<textarea rows="5" cols="30"></textarea>` |
| `<button>` | Button | `<button type="submit">Submit</button>` |
| `<fieldset>` | Fieldset | `<fieldset><legend>Personal Info</legend></fieldset>` |
| `<legend>` | Legend | `<legend>Personal Info</legend>` |
| `<datalist>` | Data list | `<datalist id="browsers">` |
| `<output>` | Output | `<output name="result">50</output>` |
| `<progress>` | Progress bar | `<progress value="50" max="100">50%</progress>` |
| `<meter>` | Meter | `<meter value="75" min="0" max="100">75%</meter>` |

#### Multimedia
| Tag | Description | Example |
|-----|-------------|---------|
| `<img>` | Image | `<img src="image.jpg" alt="Description">` |
| `<audio>` | Audio | `<audio controls><source src="audio.mp3"></audio>` |
| `<video>` | Video | `<video controls><source src="video.mp4"></video>` |
| `<source>` | Media source | `<source src="video.mp4" type="video/mp4">` |
| `<track>` | Media track | `<track kind="subtitles" src="sub.vtt">` |
| `<embed>` | Embedded content | `<embed src="file.pdf">` |
| `<object>` | Embedded object | `<object data="file.pdf">` |
| `<param>` | Object parameter | `<param name="autoplay" value="true">` |
| `<picture>` | Responsive images | `<picture><source srcset="large.jpg"></picture>` |
| `<canvas>` | Graphics | `<canvas id="myCanvas"></canvas>` |
| `<svg>` | SVG graphics | `<svg width="100" height="100">...</svg>` |
| `<map>` | Image map | `<map name="map">` |
| `<area>` | Image map area | `<area shape="rect" coords="0,0,50,50" href="link.html">` |
| `<figure>` | Figure | `<figure><img src="pic.jpg"><figcaption>Caption</figcaption></figure>` |
| `<figcaption>` | Figure caption | `<figcaption>Image Caption</figcaption>` |

#### Interactive
| Tag | Description | Example |
|-----|-------------|---------|
| `<details>` | Expandable details | `<details><summary>More Info</summary>...</details>` |
| `<summary>` | Details summary | `<summary>Click to expand</summary>` |
| `<dialog>` | Dialog box | `<dialog>...</dialog>` |
| `<menu>` | Menu | `<menu><li>File</li></menu>` |

#### Scripting and Templates
| Tag | Description | Example |
|-----|-------------|---------|
| `<script>` | JavaScript | `<script>console.log('Hello');</script>` |
| `<noscript>` | No-script fallback | `<noscript>Please enable JavaScript</noscript>` |
| `<template>` | Template | `<template id="card">...</template>` |

#### Semantic Structure
| Tag | Description | Example |
|-----|-------------|---------|
| `<header>` | Header section | `<header>...</header>` |
| `<footer>` | Footer section | `<footer>...</footer>` |
| `<main>` | Main content | `<main>...</main>` |
| `<section>` | Section | `<section>...</section>` |
| `<article>` | Article | `<article>...</article>` |
| `<aside>` | Sidebar | `<aside>...</aside>` |
| `<nav>` | Navigation | `<nav>...</nav>` |
| `<hgroup>` | Heading group | `<hgroup><h1>Title</h1><p>Subtitle</p></hgroup>` |
| `<bdi>` | Bidirectional isolation | `<bdi>...</bdi>` |
| `<bdo>` | Bidirectional override | `<bdo dir="rtl">...</bdo>` |

</details>

---

## Procedure

### Part A: Creating a Basic HTML5 Page Structure

**Task:** Create a basic HTML5 page with proper document structure and essential elements.

**Hands-on Task:**

**Step 1:** Create a new file named `index.html` in your project folder.

**Step 2:** Add the HTML5 boilerplate:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First HTML5 Page</title>
</head>
<body>
    <!-- Content will go here -->
</body>
</html>
```

**Step 3:** Add basic content structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First HTML5 Page</title>
</head>
<body>
    <header>
        <h1>Welcome to Backend Development</h1>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#courses">Courses</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="home">
            <h2>Introduction</h2>
            <p>This page demonstrates HTML5 elements for backend development.</p>
        </section>

        <section id="about">
            <h2>About Backend Development</h2>
            <p>Backend development involves server-side programming, database management, and API creation.</p>
        </section>
    </main>

    <footer>
        <p>&copy; 2026 Backend Development Course. All rights reserved.</p>
    </footer>
</body>
</html>
```

**Expected Output:**
- A webpage with a header containing a title and navigation links
- A main section with two content sections
- A footer with copyright information

---

### Part B: Working with Text Formatting and Lists

**Task:** Enhance the page with text formatting elements and various list types.

**Hands-on Task:**

**Step 1:** Add text formatting elements inside the about section:

```html
<section id="about">
    <h2>About Backend Development</h2>
    <p>Backend development involves server-side programming, database management, and API creation.</p>
    
    <h3>Key Concepts</h3>
    <p><strong>Server-Side Programming:</strong> Writing code that runs on the server.</p>
    <p><em>Database Management:</em> Storing and retrieving data efficiently.</p>
    <p><mark>API Development:</mark> Creating interfaces for frontend-backend communication.</p>
    <p><del>Traditional approaches</del> have been replaced by <ins>modern frameworks</ins>.</p>
    <p>Example: <code>const result = await fetch('/api/data');</code></p>
    <p>Shortcut: <kbd>Ctrl + Shift + I</kbd> opens developer tools.</p>
</section>
```

**Step 2:** Add ordered and unordered lists:

```html
<section id="courses">
    <h2>Backend Technologies</h2>
    <ul>
        <li>Programming Languages
            <ul>
                <li>Python</li>
                <li>JavaScript (Node.js)</li>
                <li>Java</li>
                <li>Ruby</li>
            </ul>
        </li>
        <li>Frameworks
            <ul>
                <li>Django</li>
                <li>Flask</li>
                <li>Express.js</li>
                <li>Spring Boot</li>
            </ul>
        </li>
        <li>Databases
            <ul>
                <li>MySQL</li>
                <li>PostgreSQL</li>
                <li>MongoDB</li>
                <li>Redis</li>
            </ul>
        </li>
    </ul>

    <h3>Learning Path</h3>
    <ol>
        <li>Learn HTML5 and CSS3</li>
        <li>Understand JavaScript</li>
        <li>Choose a backend language</li>
        <li>Learn a framework</li>
        <li>Study database design</li>
        <li>Build RESTful APIs</li>
        <li>Deploy to cloud</li>
    </ol>

    <h3>Technologies and Their Uses</h3>
    <dl>
        <dt>Django</dt>
        <dd>High-level Python web framework promoting rapid development</dd>
        <dt>Express.js</dt>
        <dd>Minimalist web framework for Node.js applications</dd>
        <dt>MongoDB</dt>
        <dd>NoSQL document database for modern applications</dd>
    </dl>
</section>
```

---

### Part C: Creating and Styling Tables

**Task:** Create a table to display backend technology comparisons.

**Hands-on Task:**

**Step 1:** Add a table with proper structure:

```html
<section id="comparison">
    <h2>Backend Technology Comparison</h2>
    <table border="1" cellpadding="10" cellspacing="0">
        <caption>Comparison of Popular Backend Technologies</caption>
        <thead>
            <tr>
                <th>Technology</th>
                <th>Type</th>
                <th>Learning Curve</th>
                <th>Use Case</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Node.js + Express</td>
                <td>JavaScript Runtime + Framework</td>
                <td>Moderate</td>
                <td>Real-time apps, REST APIs</td>
            </tr>
            <tr>
                <td>Python + Django</td>
                <td>Language + Full-Stack Framework</td>
                <td>Moderate</td>
                <td>Content-heavy sites, admin panels</td>
            </tr>
            <tr>
                <td>Python + Flask</td>
                <td>Language + Micro-framework</td>
                <td>Easy</td>
                <td>Microservices, REST APIs</td>
            </tr>
            <tr>
                <td>Java + Spring Boot</td>
                <td>Language + Enterprise Framework</td>
                <td>Steep</td>
                <td>Enterprise applications, microservices</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="4">Table 1: Backend Technology Comparison</td>
            </tr>
        </tfoot>
    </table>
</section>
```

**Step 2:** (Optional) Add CSS styling for better appearance (inline for now):

```html
<style>
    table {
        border-collapse: collapse;
        width: 100%;
        max-width: 800px;
    }
    th, td {
        border: 1px solid #ddd;
        padding: 12px;
        text-align: left;
    }
    th {
        background-color: #4CAF50;
        color: white;
    }
    tr:nth-child(even) {
        background-color: #f2f2f2;
    }
    tr:hover {
        background-color: #ddd;
    }
    caption {
        caption-side: bottom;
        margin-top: 10px;
        font-style: italic;
    }
</style>
```

---

### Part D: Working with Forms

**Task:** Create a registration/contact form.

**Hands-on Task:**

**Step 1:** Add a form with various input types:

```html
<section id="contact">
    <h2>Contact Us</h2>
    <form action="/submit" method="POST" id="contactForm">
        <fieldset>
            <legend>Personal Information</legend>
            
            <div>
                <label for="fullname">Full Name:</label>
                <input type="text" id="fullname" name="fullname" placeholder="Enter your full name" required>
            </div>
            
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" placeholder="your@email.com" required>
            </div>
            
            <div>
                <label for="phone">Phone:</label>
                <input type="tel" id="phone" name="phone" placeholder="+91-XXXXXXXXXX" pattern="[+]{0,1}[0-9\- ]+">
            </div>
            
            <div>
                <label for="age">Age:</label>
                <input type="number" id="age" name="age" min="18" max="100">
            </div>
            
            <div>
                <label for="dob">Date of Birth:</label>
                <input type="date" id="dob" name="dob">
            </div>
        </fieldset>

        <fieldset>
            <legend>Course Interest</legend>
            
            <div>
                <label for="course">Select Course:</label>
                <select id="course" name="course">
                    <optgroup label="Backend Courses">
                        <option value="node">Node.js Development</option>
                        <option value="python">Python Backend</option>
                        <option value="django">Django Framework</option>
                    </optgroup>
                    <optgroup label="Frontend Courses">
                        <option value="react">React.js</option>
                        <option value="angular">Angular</option>
                    </optgroup>
                </select>
            </div>
            
            <div>
                <label>Experience Level:</label>
                <div>
                    <input type="radio" id="beginner" name="level" value="beginner">
                    <label for="beginner">Beginner</label>
                </div>
                <div>
                    <input type="radio" id="intermediate" name="level" value="intermediate">
                    <label for="intermediate">Intermediate</label>
                </div>
                <div>
                    <input type="radio" id="advanced" name="level" value="advanced">
                    <label for="advanced">Advanced</label>
                </div>
            </div>
            
            <div>
                <label>Topics of Interest:</label>
                <div>
                    <input type="checkbox" id="api" name="topics" value="api">
                    <label for="api">API Development</label>
                </div>
                <div>
                    <input type="checkbox" id="db" name="topics" value="database">
                    <label for="db">Database Design</label>
                </div>
                <div>
                    <input type="checkbox" id="security" name="topics" value="security">
                    <label for="security">Security & Authentication</label>
                </div>
                <div>
                    <input type="checkbox" id="devops" name="topics" value="devops">
                    <label for="devops">DevOps & Deployment</label>
                </div>
            </div>
            
            <div>
                <label for="experience">Experience (years):</label>
                <input type="range" id="experience" name="experience" min="0" max="10" value="1">
                <output id="experienceOutput">1</output>
            </div>
        </fieldset>

        <fieldset>
            <legend>Additional Information</legend>
            
            <div>
                <label for="message">Message:</label>
                <textarea id="message" name="message" rows="5" cols="30" placeholder="Tell us about your learning goals..."></textarea>
            </div>
            
            <div>
                <label for="color">Favorite Color:</label>
                <input type="color" id="color" name="color" value="#4CAF50">
            </div>
            
            <div>
                <label for="file">Upload Resume:</label>
                <input type="file" id="file" name="file" accept=".pdf,.doc,.docx">
            </div>
            
            <div>
                <label for="url">Portfolio URL:</label>
                <input type="url" id="url" name="url" placeholder="https://yourportfolio.com">
            </div>
        </fieldset>

        <div>
            <button type="submit">Submit Application</button>
            <button type="reset">Clear Form</button>
        </div>
    </form>
</section>
```

**Step 2:** (Optional) Add JavaScript for real-time feedback:

```html
<script>
    // Update experience output
    const experience = document.getElementById('experience');
    const output = document.getElementById('experienceOutput');
    experience.addEventListener('input', function() {
        output.textContent = this.value;
    });

    // Form validation demo
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        // This prevents actual submission for demo purposes
        e.preventDefault();
        alert('Form submitted successfully! (Demo)');
        return false;
    });
</script>
```

---

### Part E: Embedding Multimedia Content

**Task:** Add images, audio, and video elements.

**Hands-on Task:**

**Step 1:** Add multimedia elements:

```html
<section id="multimedia">
    <h2>Multimedia Content</h2>
    
    <article>
        <h3>Images</h3>
        <!-- Using picture element for responsive images -->
        <picture>
            <source media="(min-width: 800px)" srcset="https://via.placeholder.com/800x400/4CAF50/white?text=Backend+Development">
            <source media="(min-width: 400px)" srcset="https://via.placeholder.com/400x200/4CAF50/white?text=Backend">
            <img src="https://via.placeholder.com/200x100/4CAF50/white?text=Backend" alt="Backend Development Illustration">
        </picture>
        
        <figure>
            <img src="https://via.placeholder.com/300x200/2196F3/white?text=API" alt="API Illustration">
            <figcaption>Figure 1: RESTful API Concept</figcaption>
        </figure>
    </article>

    <article>
        <h3>Audio</h3>
        <audio controls>
            <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg">
            <source src="https://www.soundhelix.com/examples/ogg/SoundHelix-Song-1.ogg" type="audio/ogg">
            Your browser does not support the audio element.
        </audio>
    </article>

    <article>
        <h3>Video</h3>
        <video controls width="560" height="315">
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
            <source src="https://www.w3schools.com/html/mov_bbb.ogg" type="video/ogg">
            Your browser does not support the video tag.
        </video>
        <track kind="subtitles" src="subtitles.vtt" srclang="en" label="English">
    </article>

    <article>
        <h3>Progress Indicators</h3>
        <p>Course Progress: 
            <progress value="45" max="100">45%</progress>
        </p>
        <p>Storage Used: 
            <meter value="6" min="0" max="10">60%</meter>
        </p>
    </article>
</section>
```

---

### Part F: Advanced Interactive Elements

**Task:** Implement details/dialog and data list elements.

**Hands-on Task:**

**Step 1:** Add interactive elements:

```html
<section id="interactive">
    <h2>Interactive Elements</h2>

    <details>
        <summary>View Course Prerequisites</summary>
        <ul>
            <li>Basic understanding of programming concepts</li>
            <li>Familiarity with HTML, CSS (from Frontend Development course)</li>
            <li>Knowledge of basic data structures</li>
        </ul>
    </details>

    <details>
        <summary>View Course Outcomes</summary>
        <ol>
            <li>Understand Back End Development Fundamentals</li>
            <li>Create and build web pages and applications</li>
            <li>Utilize frameworks and APIs</li>
            <li>Apply security best practices and conduct testing</li>
            <li>Demonstrate effective team collaboration skills</li>
        </ol>
    </details>

    <div>
        <h3>Search with Autocomplete</h3>
        <form>
            <label for="techSearch">Search Backend Technologies:</label>
            <input list="technologies" id="techSearch" name="techSearch" placeholder="Type to search...">
            <datalist id="technologies">
                <option value="Node.js">
                <option value="Express.js">
                <option value="Django">
                <option value="Flask">
                <option value="Spring Boot">
                <option value="Ruby on Rails">
                <option value="MongoDB">
                <option value="MySQL">
                <option value="PostgreSQL">
                <option value="Redis">
                <option value="Docker">
                <option value="Kubernetes">
            </datalist>
            <button type="submit">Search</button>
        </form>
    </div>

    <dialog id="myDialog">
        <p>This is a dialog box example.</p>
        <button id="closeDialog">Close</button>
    </dialog>
    <button id="openDialog">Open Dialog</button>
</section>

<script>
    // Dialog handling
    const dialog = document.getElementById('myDialog');
    document.getElementById('openDialog').addEventListener('click', () => {
        dialog.showModal();
    });
    document.getElementById('closeDialog').addEventListener('click', () => {
        dialog.close();
    });
</script>
```

---

### Complete HTML File

Here's the complete HTML file combining all parts:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Backend Development - HTML5 Lab</title>
    <style>
        /* Reset and base styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            padding: 20px;
        }
        
        /* Layout styles */
        header {
            background: linear-gradient(135deg, #2c3e50, #3498db);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            margin-bottom: 2rem;
        }
        
        header h1 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        
        nav ul {
            list-style: none;
            display: flex;
            gap: 2rem;
            flex-wrap: wrap;
        }
        
        nav a {
            color: white;
            text-decoration: none;
            font-weight: 500;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            transition: background-color 0.3s;
        }
        
        nav a:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }
        
        main {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        section {
            background: white;
            padding: 2rem;
            margin-bottom: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        section h2 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 0.5rem;
            margin-bottom: 1rem;
        }
        
        section h3 {
            color: #2c3e50;
            margin: 1.5rem 0 0.5rem 0;
        }
        
        footer {
            text-align: center;
            padding: 1rem;
            color: #666;
            margin-top: 2rem;
        }
        
        /* Form styles */
        form {
            max-width: 700px;
        }
        
        fieldset {
            border: 1px solid #ddd;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            border-radius: 6px;
        }
        
        legend {
            font-weight: bold;
            padding: 0 0.5rem;
            color: #2c3e50;
        }
        
        form div {
            margin-bottom: 1rem;
        }
        
        label {
            display: inline-block;
            width: 150px;
            font-weight: 500;
        }
        
        input:not([type="radio"]):not([type="checkbox"]):not([type="color"]):not([type="range"]),
        select,
        textarea {
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 100%;
            max-width: 300px;
        }
        
        input[type="radio"],
        input[type="checkbox"] {
            width: auto;
        }
        
        button {
            background: #3498db;
            color: white;
            border: none;
            padding: 0.7rem 2rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
            transition: background-color 0.3s;
        }
        
        button:hover {
            background: #2980b9;
        }
        
        button[type="reset"] {
            background: #95a5a6;
            margin-left: 0.5rem;
        }
        
        button[type="reset"]:hover {
            background: #7f8c8d;
        }
        
        /* Table styles */
        table {
            width: 100%;
            max-width: 800px;
            border-collapse: collapse;
            margin: 1rem 0;
        }
        
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        
        th {
            background: #3498db;
            color: white;
        }
        
        tr:nth-child(even) {
            background: #f9f9f9;
        }
        
        tr:hover {
            background: #f1f1f1;
        }
        
        caption {
            caption-side: bottom;
            margin-top: 10px;
            font-style: italic;
            color: #666;
        }
        
        /* List styles */
        ul, ol {
            padding-left: 2rem;
            margin: 0.5rem 0;
        }
        
        ul ul, ol ul {
            padding-left: 1.5rem;
        }
        
        /* Multimedia styles */
        video, audio {
            max-width: 100%;
            margin: 0.5rem 0;
        }
        
        figure {
            margin: 1rem 0;
            text-align: center;
        }
        
        figcaption {
            font-style: italic;
            color: #666;
            margin-top: 0.5rem;
        }
        
        picture img {
            max-width: 100%;
            height: auto;
        }
        
        /* Interactive elements */
        details {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 4px;
            margin-bottom: 1rem;
        }
        
        details summary {
            font-weight: bold;
            cursor: pointer;
        }
        
        details ul, details ol {
            margin-top: 0.5rem;
        }
        
        dialog {
            padding: 2rem;
            border: none;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            max-width: 400px;
        }
        
        dialog::backdrop {
            background: rgba(0, 0, 0, 0.5);
        }
        
        .radio-group, .checkbox-group {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem 1.5rem;
        }
        
        .radio-group div, .checkbox-group div {
            display: flex;
            align-items: center;
            gap: 0.3rem;
        }
        
        .radio-group label, .checkbox-group label {
            width: auto;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            body {
                padding: 10px;
            }
            
            header {
                padding: 1rem;
            }
            
            section {
                padding: 1rem;
            }
            
            nav ul {
                flex-direction: column;
                gap: 0.5rem;
            }
            
            label {
                width: 100%;
                display: block;
                margin-bottom: 0.2rem;
            }
            
            input:not([type="radio"]):not([type="checkbox"]):not([type="color"]):not([type="range"]),
            select,
            textarea {
                max-width: 100%;
            }
            
            table {
                font-size: 0.9rem;
            }
            
            th, td {
                padding: 8px;
            }
        }
        
        @media (max-width: 480px) {
            table, thead, tbody, th, td, tr {
                display: block;
            }
            
            thead {
                display: none;
            }
            
            tr {
                margin-bottom: 1rem;
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 0.5rem;
            }
            
            td {
                border: none;
                padding: 0.3rem 0;
                display: flex;
                justify-content: space-between;
            }
            
            td::before {
                content: attr(data-label);
                font-weight: bold;
                margin-right: 1rem;
            }
        }
    </style>
</head>
<body>
    <header>
        <h1>🚀 Backend Development</h1>
        <p>HTML5 Lab - Semester 5 | B.Tech Full Stack</p>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#courses">Courses</a></li>
                <li><a href="#comparison">Comparison</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#multimedia">Media</a></li>
                <li><a href="#interactive">Interactive</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <!-- Home Section -->
        <section id="home">
            <h2>Welcome to Backend Development Lab</h2>
            <p>This lab manual demonstrates the implementation of various HTML5 elements and their use in backend development context.</p>
            <p><strong>Note:</strong> This page is designed to showcase all HTML5 elements while maintaining semantic structure and accessibility.</p>
        </section>

        <!-- About Section -->
        <section id="about">
            <h2>About Backend Development</h2>
            <p>Backend development involves server-side programming, database management, and API creation.</p>
            
            <h3>Key Concepts</h3>
            <p><strong>Server-Side Programming:</strong> Writing code that runs on the server.</p>
            <p><em>Database Management:</em> Storing and retrieving data efficiently.</p>
            <p><mark>API Development:</mark> Creating interfaces for frontend-backend communication.</p>
            <p><del>Traditional approaches</del> have been replaced by <ins>modern frameworks</ins>.</p>
            <p>Example: <code>const result = await fetch('/api/data');</code></p>
            <p>Shortcut: <kbd>Ctrl + Shift + I</kbd> opens developer tools.</p>
            <p>Term: <abbr title="Application Programming Interface">API</abbr> is essential for modern web apps.</p>
            <p>Contact: <address>backend.course@university.edu</address></p>
        </section>

        <!-- Courses Section -->
        <section id="courses">
            <h2>Backend Technologies</h2>
            <ul>
                <li>Programming Languages
                    <ul>
                        <li>Python</li>
                        <li>JavaScript (Node.js)</li>
                        <li>Java</li>
                        <li>Ruby</li>
                    </ul>
                </li>
                <li>Frameworks
                    <ul>
                        <li>Django</li>
                        <li>Flask</li>
                        <li>Express.js</li>
                        <li>Spring Boot</li>
                    </ul>
                </li>
                <li>Databases
                    <ul>
                        <li>MySQL</li>
                        <li>PostgreSQL</li>
                        <li>MongoDB</li>
                        <li>Redis</li>
                    </ul>
                </li>
            </ul>

            <h3>Learning Path</h3>
            <ol>
                <li>Learn HTML5 and CSS3</li>
                <li>Understand JavaScript</li>
                <li>Choose a backend language</li>
                <li>Learn a framework</li>
                <li>Study database design</li>
                <li>Build RESTful APIs</li>
                <li>Deploy to cloud</li>
            </ol>

            <h3>Technologies and Their Uses</h3>
            <dl>
                <dt>Django</dt>
                <dd>High-level Python web framework promoting rapid development</dd>
                <dt>Express.js</dt>
                <dd>Minimalist web framework for Node.js applications</dd>
                <dt>MongoDB</dt>
                <dd>NoSQL document database for modern applications</dd>
            </dl>
        </section>

        <!-- Comparison Section -->
        <section id="comparison">
            <h2>Backend Technology Comparison</h2>
            <table>
                <caption>Table 1: Comparison of Popular Backend Technologies</caption>
                <thead>
                    <tr>
                        <th>Technology</th>
                        <th>Type</th>
                        <th>Learning Curve</th>
                        <th>Use Case</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td data-label="Technology">Node.js + Express</td>
                        <td data-label="Type">JavaScript Runtime + Framework</td>
                        <td data-label="Learning Curve">Moderate</td>
                        <td data-label="Use Case">Real-time apps, REST APIs</td>
                    </tr>
                    <tr>
                        <td data-label="Technology">Python + Django</td>
                        <td data-label="Type">Language + Full-Stack Framework</td>
                        <td data-label="Learning Curve">Moderate</td>
                        <td data-label="Use Case">Content-heavy sites, admin panels</td>
                    </tr>
                    <tr>
                        <td data-label="Technology">Python + Flask</td>
                        <td data-label="Type">Language + Micro-framework</td>
                        <td data-label="Learning Curve">Easy</td>
                        <td data-label="Use Case">Microservices, REST APIs</td>
                    </tr>
                    <tr>
                        <td data-label="Technology">Java + Spring Boot</td>
                        <td data-label="Type">Language + Enterprise Framework</td>
                        <td data-label="Learning Curve">Steep</td>
                        <td data-label="Use Case">Enterprise applications, microservices</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4">Table 1: Backend Technology Comparison</td>
                    </tr>
                </tfoot>
            </table>
        </section>

        <!-- Contact Section -->
        <section id="contact">
            <h2>Contact Us</h2>
            <form id="contactForm">
                <fieldset>
                    <legend>Personal Information</legend>
                    
                    <div>
                        <label for="fullname">Full Name:</label>
                        <input type="text" id="fullname" name="fullname" placeholder="Enter your full name" required>
                    </div>
                    
                    <div>
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" placeholder="your@email.com" required>
                    </div>
                    
                    <div>
                        <label for="phone">Phone:</label>
                        <input type="tel" id="phone" name="phone" placeholder="+91-XXXXXXXXXX">
                    </div>
                    
                    <div>
                        <label for="age">Age:</label>
                        <input type="number" id="age" name="age" min="18" max="100">
                    </div>
                    
                    <div>
                        <label for="dob">Date of Birth:</label>
                        <input type="date" id="dob" name="dob">
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Course Interest</legend>
                    
                    <div>
                        <label for="course">Select Course:</label>
                        <select id="course" name="course">
                            <optgroup label="Backend Courses">
                                <option value="node">Node.js Development</option>
                                <option value="python">Python Backend</option>
                                <option value="django">Django Framework</option>
                            </optgroup>
                            <optgroup label="Frontend Courses">
                                <option value="react">React.js</option>
                                <option value="angular">Angular</option>
                            </optgroup>
                        </select>
                    </div>
                    
                    <div>
                        <label>Experience Level:</label>
                        <div class="radio-group">
                            <div>
                                <input type="radio" id="beginner" name="level" value="beginner">
                                <label for="beginner">Beginner</label>
                            </div>
                            <div>
                                <input type="radio" id="intermediate" name="level" value="intermediate">
                                <label for="intermediate">Intermediate</label>
                            </div>
                            <div>
                                <input type="radio" id="advanced" name="level" value="advanced">
                                <label for="advanced">Advanced</label>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <label>Topics of Interest:</label>
                        <div class="checkbox-group">
                            <div>
                                <input type="checkbox" id="api" name="topics" value="api">
                                <label for="api">API Development</label>
                            </div>
                            <div>
                                <input type="checkbox" id="db" name="topics" value="database">
                                <label for="db">Database Design</label>
                            </div>
                            <div>
                                <input type="checkbox" id="security" name="topics" value="security">
                                <label for="security">Security & Authentication</label>
                            </div>
                            <div>
                                <input type="checkbox" id="devops" name="topics" value="devops">
                                <label for="devops">DevOps & Deployment</label>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <label for="experience">Experience (years):</label>
                        <input type="range" id="experience" name="experience" min="0" max="10" value="1">
                        <output id="experienceOutput">1</output>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Additional Information</legend>
                    
                    <div>
                        <label for="message">Message:</label>
                        <textarea id="message" name="message" rows="5" cols="30" placeholder="Tell us about your learning goals..."></textarea>
                    </div>
                    
                    <div>
                        <label for="color">Favorite Color:</label>
                        <input type="color" id="color" name="color" value="#4CAF50">
                    </div>
                    
                    <div>
                        <label for="file">Upload Resume:</label>
                        <input type="file" id="file" name="file" accept=".pdf,.doc,.docx">
                    </div>
                    
                    <div>
                        <label for="url">Portfolio URL:</label>
                        <input type="url" id="url" name="url" placeholder="https://yourportfolio.com">
                    </div>
                </fieldset>

                <div>
                    <button type="submit">Submit Application</button>
                    <button type="reset">Clear Form</button>
                </div>
            </form>
        </section>

        <!-- Multimedia Section -->
        <section id="multimedia">
            <h2>Multimedia Content</h2>
            
            <article>
                <h3>Images</h3>
                <picture>
                    <source media="(min-width: 800px)" srcset="https://via.placeholder.com/800x400/2c3e50/white?text=Backend+Development">
                    <source media="(min-width: 400px)" srcset="https://via.placeholder.com/400x200/2c3e50/white?text=Backend">
                    <img src="https://via.placeholder.com/200x100/2c3e50/white?text=Backend" alt="Backend Development Illustration">
                </picture>
                
                <figure>
                    <img src="https://via.placeholder.com/300x200/3498db/white?text=REST+API" alt="API Illustration" style="max-width:100%; height:auto;">
                    <figcaption>Figure 1: RESTful API Concept</figcaption>
                </figure>
            </article>

            <article>
                <h3>Audio</h3>
                <audio controls>
                    <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg">
                    <source src="https://www.soundhelix.com/examples/ogg/SoundHelix-Song-1.ogg" type="audio/ogg">
                    Your browser does not support the audio element.
                </audio>
            </article>

            <article>
                <h3>Video</h3>
                <video controls width="560" height="315">
                    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
                    <source src="https://www.w3schools.com/html/mov_bbb.ogg" type="video/ogg">
                    Your browser does not support the video tag.
                </video>
            </article>

            <article>
                <h3>Progress Indicators</h3>
                <p>Course Progress: 
                    <progress value="45" max="100">45%</progress>
                </p>
                <p>Storage Used: 
                    <meter value="6" min="0" max="10">60%</meter>
                </p>
            </article>
        </section>

        <!-- Interactive Section -->
        <section id="interactive">
            <h2>Interactive Elements</h2>

            <details>
                <summary>View Course Prerequisites</summary>
                <ul>
                    <li>Basic understanding of programming concepts</li>
                    <li>Familiarity with HTML, CSS (from Frontend Development course)</li>
                    <li>Knowledge of basic data structures</li>
                </ul>
            </details>

            <details>
                <summary>View Course Outcomes</summary>
                <ol>
                    <li>Understand Back End Development Fundamentals</li>
                    <li>Create and build web pages and applications</li>
                    <li>Utilize frameworks and APIs</li>
                    <li>Apply security best practices and conduct testing</li>
                    <li>Demonstrate effective team collaboration skills</li>
                </ol>
            </details>

            <div>
                <h3>Search with Autocomplete</h3>
                <form>
                    <label for="techSearch">Search Backend Technologies:</label>
                    <input list="technologies" id="techSearch" name="techSearch" placeholder="Type to search..." style="max-width:300px;">
                    <datalist id="technologies">
                        <option value="Node.js">
                        <option value="Express.js">
                        <option value="Django">
                        <option value="Flask">
                        <option value="Spring Boot">
                        <option value="Ruby on Rails">
                        <option value="MongoDB">
                        <option value="MySQL">
                        <option value="PostgreSQL">
                        <option value="Redis">
                        <option value="Docker">
                        <option value="Kubernetes">
                    </datalist>
                    <button type="submit">Search</button>
                </form>
            </div>

            <div style="margin-top: 1rem;">
                <button id="openDialog">Open Dialog</button>
                <dialog id="myDialog">
                    <p><strong>📢 Important Message</strong></p>
                    <p>This is a dialog box created using the HTML5 <code>&lt;dialog&gt;</code> element.</p>
                    <p>It can be used for modal popups, confirmations, or important announcements.</p>
                    <button id="closeDialog" style="margin-top: 1rem;">Close</button>
                </dialog>
            </div>
        </section>
    </main>

    <footer>
        <p>&copy; 2026 Backend Development Course - CSFS3008P</p>
        <p>B.Tech Full Stack | Semester 5</p>
    </footer>

    <script>
        // Update experience output on range slider
        const experience = document.getElementById('experience');
        const output = document.getElementById('experienceOutput');
        if (experience && output) {
            experience.addEventListener('input', function() {
                output.textContent = this.value;
            });
        }

        // Form submission handler (demo)
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('✅ Form submitted successfully!\n(Note: This is a demo. No data was actually sent.)');
                return false;
            });
        }

        // Dialog handling
        const dialog = document.getElementById('myDialog');
        const openBtn = document.getElementById('openDialog');
        const closeBtn = document.getElementById('closeDialog');

        if (dialog && openBtn && closeBtn) {
            openBtn.addEventListener('click', () => {
                dialog.showModal();
            });
            closeBtn.addEventListener('click', () => {
                dialog.close();
            });
            
            // Close dialog on backdrop click
            dialog.addEventListener('click', (e) => {
                const rect = dialog.getBoundingClientRect();
                const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                                  rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
                if (!isInDialog) {
                    dialog.close();
                }
            });
        }

        // Console greeting for backend developers
        console.log('🚀 Backend Development Lab - HTML5 Complete');
        console.log('📚 Experiment 1: All HTML5 Elements Demonstrated');
    </script>
</body>
</html>
```

---

## Conclusion

In this experiment, you have learned:

1. **HTML5 Document Structure**: How to create a well-formed HTML5 document with proper DOCTYPE, meta tags, and semantic elements
2. **Semantic Elements**: The importance of using `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, and `<footer>` for accessibility and SEO
3. **Text Formatting**: Various formatting tags including `<b>`, `<strong>`, `<i>`, `<em>`, `<mark>`, `<del>`, `<ins>`, `<sub>`, `<sup>`, `<code>`, and `<kbd>`
4. **Lists**: Creating unordered, ordered, and description lists
5. **Tables**: Building structured tables with headers, body, footer, and styling
6. **Forms**: Creating interactive forms with various input types (text, email, tel, number, date, color, range, file, url, radio, checkbox, select, textarea)
7. **Multimedia**: Embedding images with `<picture>` and `<figure>`, audio, video, and progress indicators
8. **Interactive Elements**: Using `<details>`, `<summary>`, `<datalist>`, and `<dialog>`
9. **Responsive Design**: Basic CSS for responsive layouts
10. **JavaScript Integration**: Adding interactivity to forms, dialogs, and range sliders

### Backend Development Context

Understanding HTML is essential for backend developers because:

- **Template Rendering**: Backend frameworks render HTML templates
- **Form Data Processing**: Backend processes form submissions
- **Server-Side Rendering**: Many modern frameworks use SSR
- **API Documentation**: HTML is used for API documentation
- **Content Management**: Backend systems generate HTML content

---

## Practice Tasks

### Task 1: Create a Blog Post Page
Create a blog post page using semantic HTML5 elements. Include:
- Header with navigation
- Main content with article and section
- Sidebar with aside element
- Footer with contact information

### Task 2: Build an Event Registration Form
Create a comprehensive event registration form with:
- Personal details (name, email, phone, age)
- Event selection (dropdown with optgroups)
- Dietary preferences (radio buttons)
- Sessions to attend (checkboxes)
- Special requests (textarea)
- Experience level (range slider)
- Upload profile picture (file input)

### Task 3: Create a Technology Comparison Table
Build a comparison table for backend frameworks including:
- Framework name, language, learning curve, community size, use cases
- Use table header, body, and footer
- Include a caption
- Apply appropriate styling

### Task 4: Develop a Multimedia Gallery
Create a page showcasing:
- Responsive images using `<picture>` element
- Audio player with controls
- Video player with controls
- Progress indicators
- Figure with figcaption

### Task 5: Implement Interactive Elements
Create a page with:
- Collapsible sections using `<details>` and `<summary>`
- Autocomplete search using `<datalist>`
- Modal dialog using `<dialog>` element
- Range slider with real-time output

---

## Viva Questions

### Basic Level

1. **What is the difference between HTML4 and HTML5?**
   - HTML5 introduces semantic elements, native multimedia support, new form input types, and APIs like canvas, geolocation, and local storage.

2. **What is the purpose of the `<!DOCTYPE html>` declaration?**
   - It tells the browser to render the page in standards mode, ensuring proper rendering across browsers.

3. **Explain the difference between `<section>` and `<div>`?**
   - `<section>` has semantic meaning and represents a thematic grouping of content, while `<div>` is a generic container with no semantic meaning.

4. **What are semantic elements and why are they important?**
   - Semantic elements clearly describe their meaning to browsers, developers, and screen readers. They improve accessibility and SEO.

5. **What is the difference between `<b>` and `<strong>`?**
   - `<b>` makes text bold visually, while `<strong>` indicates strong importance (semantic), which screen readers may emphasize differently.

6. **What is the purpose of the `alt` attribute in `<img>`?**
   - It provides alternative text for screen readers and when the image cannot load, improving accessibility and SEO.

7. **What is the difference between `<ul>` and `<ol>`?**
   - `<ul>` creates an unordered (bulleted) list, while `<ol>` creates an ordered (numbered) list.

8. **What is the `<meta>` tag used for?**
   - It provides metadata about the HTML document, such as character encoding, viewport settings, and SEO information.

9. **What is the difference between `<article>` and `<section>`?**
   - `<article>` represents self-contained content that could be distributed independently, while `<section>` represents a thematic grouping of content within a document.

10. **What is the `value` attribute in input elements?**
    - It sets the initial value of the input field. For different input types, it serves different purposes (e.g., for checkbox, it defines the value sent on form submission).

### Intermediate Level

11. **Explain the `<picture>` element and its use case?**
    - The `<picture>` element provides responsive images by allowing multiple sources based on media conditions (screen size, resolution), improving performance and user experience.

12. **What are the new input types introduced in HTML5?**
    - Email, url, tel, number, range, color, date, datetime-local, month, week, time, search, and file.

13. **What is the purpose of the `<datalist>` element?**
    - It provides autocomplete suggestions for input fields, allowing users to type and see a list of pre-defined options.

14. **Explain the difference between `<audio>` and `<video>` elements?**
    - `<audio>` embeds audio content, `<video>` embeds video content. Both support controls, multiple sources, and tracks.

15. **What is the `<dialog>` element used for?**
    - It represents a dialog box or interactive component that can be shown/hidden using JavaScript.

16. **Explain the `for` attribute in `<label>`?**
    - It links the label to a form control using the control's `id`, making the label clickable and improving accessibility.

17. **What is the difference between `<thead>`, `<tbody>`, and `<tfoot>`?**
    - They semantically group table header, body, and footer rows, improving accessibility and allowing for features like sticky headers.

18. **What is the `<fieldset>` element used for?**
    - It groups related form controls, and with `<legend>` provides a caption for the group.

19. **Explain the difference between `GET` and `POST` methods?**
    - GET sends data in the URL (visible, limited size), POST sends data in the request body (more secure, larger size).

20. **What is the purpose of the `<noscript>` tag?**
    - It provides fallback content for browsers that have JavaScript disabled or don't support it.

### Advanced Level

21. **How does the `<picture>` element work with `srcset`?**
    - `<picture>` uses `<source>` elements with `media` and `srcset` attributes to provide different images based on viewport or screen density.

22. **What are microdata attributes (`itemscope`, `itemprop`, `itemtype`)?**
    - They add structured data to HTML, helping search engines understand content better for rich snippets.

23. **Explain the concept of Progressive Web App (PWA) and its relation to HTML5?**
    - PWAs use HTML5, service workers, and manifest files to create app-like experiences in the browser.

24. **How does the `<template>` element work?**
    - It defines HTML fragments that are not rendered on page load but can be instantiated later using JavaScript.

25. **What is the `contenteditable` attribute?**
    - It makes an element editable by users, allowing in-place content editing.

26. **Explain the `data-*` custom attributes?**
    - They store custom data private to the page or application, accessible via JavaScript.

27. **What is the difference between `localStorage` and `sessionStorage`?**
    - localStorage persists until manually cleared; sessionStorage persists only for the session (tab/window).

28. **How does the `<canvas>` element differ from SVG?**
    - `<canvas>` uses raster-based rendering (pixel-based), while SVG uses vector-based rendering (shape-based, resolution-independent).

29. **What is the purpose of the `rel="noopener"` attribute?**
    - It prevents the new page from having access to the `window.opener` property, improving security.

30. **Explain the accessibility features of HTML5?**
    - Semantic elements, ARIA attributes, `alt` text, `label` association, `role` attributes, `aria-*` attributes.

31. **What is the difference between `<input type="submit">` and `<button type="submit">`?**
    - Both submit forms, but `<button>` can contain HTML content while `<input>` is self-closing.

32. **How do you create a link that opens in a new tab?**
    - Use `<a href="url" target="_blank">` (consider adding `rel="noopener noreferrer"` for security).

33. **What is the purpose of the `defer` and `async` attributes in `<script>`?**
    - Async: script loads asynchronously and executes when ready (best for independent scripts). Defer: script executes after HTML parsing (best for scripts that depend on DOM).

34. **Explain the concept of "reflow" and "repaint" in browser rendering?**
    - Reflow: recalculating element positions and geometry; Repaint: redrawing pixels. Reflow is more expensive, so minimize DOM manipulations.

35. **How do you optimize HTML for SEO?**
    - Use semantic elements, proper heading hierarchy, `meta` description, `alt` text, structured data, and clean URL structure.

