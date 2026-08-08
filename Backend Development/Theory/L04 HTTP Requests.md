# Lecture 04

# HTTP Requests

**Course Outcome:** CO1 – Understand HTTP fundamentals and inspect request–response cycles using developer tools.

---

## Section 1 – Introduction


In L03, we studied HTTP fundamentals and built our first backend servers using Express.js and Flask. We saw how a client sends a request and the server returns a response. Today, we go deeper by **inspecting** what actually travels between client and server. You will learn to use browser DevTools, curl, and Postman to observe raw HTTP requests and responses — the same skills professional backend developers use every day.

By the end of this lecture, you will have:

1. A detailed understanding of HTTP request and response structure.
2. The ability to inspect requests using browser DevTools.
3. The ability to send requests using curl and Postman.

---

## Section 2 – Anatomy of an HTTP Request


Every HTTP request has a precise structure. Understanding this structure is essential for debugging and building APIs.

<svg xmlns="http://www.w3.org/2000/svg" width="900" height="320" viewBox="0 0 900 320">
<rect width="900" height="320" fill="white"/>
<text x="450" y="30" text-anchor="middle" font-size="18" font-weight="bold">HTTP Request Structure</text>
<rect x="40" y="50" width="820" height="60" rx="8" fill="#E0F7FA" stroke="#00ACC1"/>
<text x="60" y="75" font-size="14" font-weight="bold">Request Line</text>
<text x="60" y="95" font-size="13" font-family="monospace">GET /students/5 HTTP/1.1</text>
<rect x="40" y="120" width="820" height="80" rx="8" fill="#EAF4FF" stroke="#1E88E5"/>
<text x="60" y="145" font-size="14" font-weight="bold">Headers</text>
<text x="60" y="165" font-size="12" font-family="monospace">Host: localhost:3000</text>
<text x="60" y="185" font-size="12" font-family="monospace">Accept: application/json</text>
<text x="350" y="165" font-size="12" font-family="monospace">User-Agent: Mozilla/5.0</text>
<text x="350" y="185" font-size="12" font-family="monospace">Content-Type: application/json</text>
<rect x="40" y="210" width="820" height="80" rx="8" fill="#FFF8E6" stroke="#FB8C00"/>
<text x="60" y="235" font-size="14" font-weight="bold">Body (optional)</text>
<text x="60" y="255" font-size="12" font-family="monospace">{ "name": "Aarav", "branch": "CSE" }</text>
<text x="60" y="275" font-size="11" fill="#888">Used with POST, PUT, PATCH methods</text>
<text x="450" y="310" text-anchor="middle" font-size="12" fill="#555">Method + Path + Version | Metadata | Data</text>
</svg>

### Request Line

The first line of every request contains three parts:

```
METHOD /path HTTP/version
```

| Part | Description | Example |
|------|-------------|---------|
| **Method** | The action the client wants | `GET`, `POST`, `PUT`, `DELETE` |
| **Path** | The resource being requested | `/students`, `/students/1` |
| **Version** | The HTTP version being used | `HTTP/1.1` |

**Example:**

```
GET /students HTTP/1.1
```

### Request Headers

Headers are key-value pairs that carry metadata about the request.

| Header | Purpose | Example Value |
|--------|---------|---------------|
| **Host** | The server's domain name | `localhost:3000` |
| **User-Agent** | Browser and OS information | `Mozilla/5.0 ...` |
| **Accept** | Data formats the client can handle | `application/json` |
| **Content-Type** | Format of data being sent | `application/json` |
| **Authorization** | Authentication credentials | `Bearer abc123` |

### Request Body

The body carries data sent to the server. It is optional and typically used with `POST` and `PUT` requests.

```json
{
  "name": "Aarav",
  "branch": "CSE"
}
```

GET requests usually have no body. POST and PUT requests send data in the body.

---

## Section 3 – Anatomy of an HTTP Response


The server's reply follows a similar structure.

<svg xmlns="http://www.w3.org/2000/svg" width="900" height="320" viewBox="0 0 900 320">
<rect width="900" height="320" fill="white"/>
<text x="450" y="30" text-anchor="middle" font-size="18" font-weight="bold">HTTP Response Structure</text>
<rect x="40" y="50" width="820" height="60" rx="8" fill="#E8F8EC" stroke="#43A047"/>
<text x="60" y="75" font-size="14" font-weight="bold">Status Line</text>
<text x="60" y="95" font-size="13" font-family="monospace">HTTP/1.1 200 OK</text>
<rect x="40" y="120" width="820" height="80" rx="8" fill="#EAF4FF" stroke="#1E88E5"/>
<text x="60" y="145" font-size="14" font-weight="bold">Headers</text>
<text x="60" y="165" font-size="12" font-family="monospace">Content-Type: application/json</text>
<text x="60" y="185" font-size="12" font-family="monospace">Content-Length: 256</text>
<text x="400" y="165" font-size="12" font-family="monospace">Cache-Control: no-cache</text>
<text x="400" y="185" font-size="12" font-family="monospace">Set-Cookie: session=abc123</text>
<rect x="40" y="210" width="820" height="80" rx="8" fill="#FFF8E6" stroke="#FB8C00"/>
<text x="60" y="235" font-size="14" font-weight="bold">Body</text>
<text x="60" y="255" font-size="12" font-family="monospace">[{"id":1,"name":"Aarav","branch":"CSE"}]</text>
<text x="60" y="275" font-size="11" fill="#888">JSON, HTML, text, or file data</text>
<text x="450" y="310" text-anchor="middle" font-size="12" fill="#555">Status Code + Metadata | Response Data</text>
</svg>

### Status Line

```
HTTP/version STATUS_CODE REASON
```

**Example:**

```
HTTP/1.1 200 OK
```

### Response Headers

| Header | Purpose | Example Value |
|--------|---------|---------------|
| **Content-Type** | Format of the response data | `application/json` |
| **Content-Length** | Size of the response body in bytes | `256` |
| **Cache-Control** | Caching instructions | `no-cache` |
| **Set-Cookie** | Sends a cookie to the client | `session=abc123` |

### Response Body

The actual data returned by the server — HTML, JSON, a file, or an error message.

```json
[
  { "id": 1, "name": "Aarav", "branch": "CSE" },
  { "id": 2, "name": "Diya", "branch": "ECE" }
]
```

---

## Section 4 – HTTP Methods Compared


Understanding how each method behaves differently is critical for building APIs.

| Method | Purpose | Has Body? | Typical Response |
|--------|---------|-----------|------------------|
| **GET** | Retrieve data | No | `200 OK` with data |
| **POST** | Create new data | Yes | `201 Created` with new resource |
| **PUT** | Update existing data | Yes | `200 OK` with updated resource |
| **DELETE** | Remove data | No | `204 No Content` |

---

## Section 5 – Inspecting Requests with Browser DevTools


Browser DevTools is the fastest way to see what happens when your browser communicates with a server.

### How to Open DevTools

* **Windows / Linux:** Press `F12` or `Ctrl + Shift + I`
* **macOS:** Press `Cmd + Option + I`
* Or right-click anywhere on the page and select **Inspect**

### The Network Tab

1. Open DevTools and click the **Network** tab.
2. Visit a URL (e.g., `http://localhost:3000/students`).
3. A new entry appears in the Network panel.
4. Click on it to see:

| Section | What You See |
|---------|--------------|
| **Headers** | Request method, URL, status code, all headers |
| **Preview** | A formatted view of the response body |
| **Response** | The raw response body |
| **Timing** | How long the request took |

This gives you full visibility into every HTTP exchange between your browser and the server.

---

## Section 6 – Inspecting Requests with curl


**curl** is a command-line tool for sending HTTP requests. It is available on virtually every operating system and is essential for testing APIs without a browser.

### Basic Syntax

```bash
curl [options] URL
```

### Common Options

| Option | Purpose | Example |
|--------|---------|---------|
| `-v` | Verbose mode — shows full request/response headers | `curl -v http://localhost:3000/` |
| `-X` | Specify the HTTP method | `curl -X POST http://localhost:3000/students` |
| `-H` | Add a request header | `curl -H "Accept: application/json" ...` |
| `-d` | Send data in the request body | `curl -d '{"name":"Aarav"}' ...` |
| `-i` | Include response headers in output | `curl -i http://localhost:3000/` |

### Example: Verbose Request

```bash
curl -v http://localhost:3000/students
```

This prints the full request headers, response headers, and response body — everything you need to debug an API.

---

## Section 7 – Inspecting Requests with Postman


**Postman** is a graphical tool designed specifically for building, testing, and debugging APIs. It provides a visual interface for constructing requests and inspecting responses.

### Key Features

| Feature | Description |
|---------|-------------|
| **Request Builder** | Build requests with a GUI — select method, enter URL, add headers, body |
| **Collections** | Organize and save groups of related requests |
| **Environment Variables** | Switch between development, staging, and production environments |
| **Response Viewer** | View formatted JSON, headers, status codes, and timing |
| **History** | Automatically saves every request you send |

### Why Use Postman?

* Browser DevTools are great for GET requests but limited for POST, PUT, and DELETE.
* curl is powerful but requires memorizing flags and syntax.
* Postman gives you **visual control** over every part of the request.

---

## Section 8 – Installing Postman


1. Visit [https://www.postman.com/downloads/](https://www.postman.com/downloads/).
2. Download the version for your operating system (Windows, macOS, or Linux).
3. Run the installer and follow the default settings.
4. When Postman opens, you can skip signing in — the basic functionality works without an account.

### Verify curl (pre-installed)

curl comes pre-installed on most systems.

```bash
curl --version
```

Expected output:

```
curl 8.4.0 (x86_64-pc-linux-gnu) ...
```

If curl is not installed on Windows, it is available by default in Windows 10 and later.

---

## Section 9 – Hands-On: DevTools Inspection


### Task 1 — Inspect a Request Using Browser DevTools

#### Step 1: Start the Express server

```bash
cd express-demo
node server.js
```

#### Step 2: Open DevTools

1. Open Chrome.
2. Press `F12` to open DevTools.
3. Click the **Network** tab.

#### Step 3: Send a request

In the browser address bar, type:

```
http://localhost:3000/students
```

#### Step 4: Inspect the request

In the Network tab, click on the `students` entry. Observe:

| Field | Expected Value |
|-------|----------------|
| **Request Method** | GET |
| **Status Code** | 200 OK |
| **Request URL** | `http://localhost:3000/students` |
| **Response Content-Type** | `application/json` |

#### Step 5: View the response body

Click the **Response** or **Preview** tab within the entry. You should see:

```json
[
  { "id": 1, "name": "Aarav", "branch": "CSE" },
  { "id": 2, "name": "Diya", "branch": "ECE" },
  { "id": 3, "name": "Rohan", "branch": "IT" }
]
```

---

## Section 10 – Hands-On: curl Requests


### Task 2 — Send Requests Using curl

#### Step 1: Simple GET request

Open a new terminal (keep the server running) and type:

```bash
curl http://localhost:3000/students
```

Expected output:

```json
[{"id":1,"name":"Aarav","branch":"CSE"},{"id":2,"name":"Diya","branch":"ECE"},{"id":3,"name":"Rohan","branch":"IT"}]
```

#### Step 2: Verbose mode

```bash
curl -v http://localhost:3000/students
```

This prints the full request and response headers. Look for:

```
> GET /students HTTP/1.1
> Host: localhost:3000
> Accept: */*
```

And the response:

```
< HTTP/1.1 200 OK
< Content-Type: application/json
```

#### Step 3: Request a single student

```bash
curl http://localhost:3000/students/1
```

Expected output:

```json
{"id":1,"name":"Aarav","branch":"CSE"}
```

#### Step 4: Request a non-existent student

```bash
curl http://localhost:3000/students/99
```

Expected output:

```json
{"error": "Student not found"}
```

#### Step 5: Include response headers

```bash
curl -i http://localhost:3000/students
```

This shows both the headers and the body in one output.

---

## Section 11 – Hands-On: Postman Requests


### Task 3 — Send Requests Using Postman

#### Step 1: Create a new request

1. Open Postman.
2. Click the **+** button to create a new tab.
3. Select **GET** from the method dropdown.
4. Enter the URL: `http://localhost:3000/students`
5. Click **Send**.

#### Step 2: Inspect the response

In the response section, observe:

| Section | What to Look For |
|---------|------------------|
| **Status** | `200 OK` |
| **Body** | The JSON array of students |
| **Headers** | `Content-Type: application/json` |

#### Step 3: Add a request header

1. Click the **Headers** tab in the request section.
2. Add a new header:
   * **Key:** `Accept`
   * **Value:** `application/json`
3. Click **Send** again.

This explicitly tells the server you expect JSON back.

#### Step 4: Send a POST request

1. Change the method to **POST**.
2. Enter the URL: `http://localhost:3000/students`
3. Click the **Body** tab.
4. Select **raw** and choose **JSON** from the dropdown.
5. Enter:

```json
{
  "id": 4,
  "name": "Priya",
  "branch": "CSE"
}
```

6. Click **Send**.

> Note: The server built in L03 does not handle POST requests yet. You may see an error. This is expected — you will add POST handling in L05 when building RESTful APIs.

#### Step 5: Save the request

1. Click the **Save** button (or press `Ctrl + S`).
2. Name it `Get All Students`.
3. Create a collection called `Student Management API`.
4. Click **Save**.

---

## Section 12 – Hands-On: Compare All Three Tools


### Task 4 — Same Request, Three Tools

#### Request to send:

```
GET http://localhost:3000/students/2
```

#### Using Browser DevTools:

1. Open `http://localhost:3000/students/2` in the browser.
2. Check the Network tab for the request details.

#### Using curl:

```bash
curl -i http://localhost:3000/students/2
```

#### Using Postman:

1. Enter the URL, select GET, click Send.
2. Check the response body and headers.

All three tools send the same HTTP request and receive the same response. The difference is how they **display** the information:

<svg xmlns="http://www.w3.org/2000/svg" width="900" height="280" viewBox="0 0 900 280">
<rect width="900" height="280" fill="white"/>
<text x="450" y="30" text-anchor="middle" font-size="18" font-weight="bold">Three Tools, One Request</text>
<rect x="40" y="50" width="240" height="180" rx="8" fill="#EAF4FF" stroke="#1E88E5"/>
<text x="160" y="80" text-anchor="middle" font-size="16" font-weight="bold">Browser DevTools</text>
<text x="160" y="105" text-anchor="middle" font-size="12">Built into Chrome</text>
<text x="160" y="125" text-anchor="middle" font-size="12">Network Tab</text>
<text x="160" y="145" text-anchor="middle" font-size="12">F12 to open</text>
<rect x="60" y="160" width="200" height="30" rx="4" fill="#1E88E5"/>
<text x="160" y="180" text-anchor="middle" font-size="12" fill="white">Quick browser inspection</text>
<rect x="330" y="50" width="240" height="180" rx="8" fill="#E8F8EC" stroke="#43A047"/>
<text x="450" y="80" text-anchor="middle" font-size="16" font-weight="bold">curl</text>
<text x="450" y="105" text-anchor="middle" font-size="12">Command-line tool</text>
<text x="450" y="125" text-anchor="middle" font-size="12">Pre-installed on OS</text>
<text x="450" y="145" text-anchor="middle" font-size="12">curl -v URL</text>
<rect x="350" y="160" width="200" height="30" rx="4" fill="#43A047"/>
<text x="450" y="180" text-anchor="middle" font-size="12" fill="white">Scripting and automation</text>
<rect x="620" y="50" width="240" height="180" rx="8" fill="#F3E5F5" stroke="#8E24AA"/>
<text x="740" y="80" text-anchor="middle" font-size="16" font-weight="bold">Postman</text>
<text x="740" y="105" text-anchor="middle" font-size="12">GUI application</text>
<text x="740" y="125" text-anchor="middle" font-size="12">Visual request builder</text>
<text x="740" y="145" text-anchor="middle" font-size="12">Save and share requests</text>
<rect x="640" y="160" width="200" height="30" rx="4" fill="#8E24AA"/>
<text x="740" y="180" text-anchor="middle" font-size="12" fill="white">API development workflow</text>
<text x="450" y="260" text-anchor="middle" font-size="14" fill="#555">All send GET http://localhost:3000/students/2 and receive the same JSON response</text>
</svg>

| Tool | Best For |
|------|----------|
| **Browser DevTools** | Quick inspection while browsing |
| **curl** | Scripting, automation, server-side debugging |
| **Postman** | Building, testing, and sharing API requests |

---

## Section 13 – Hands-On: Flask Server Inspection


### Task 5 — Flask Server: Same Inspection

#### Step 1: Start the Flask server

```bash
cd backend-project
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS/Linux
python app.py
```

#### Step 2: Use curl

```bash
curl -v http://localhost:5000/students
```

Observe the same request–response structure, now served by Flask on port 5000.

#### Step 3: Use Postman

1. Create a new request in Postman.
2. Enter `http://localhost:5000/students`.
3. Click **Send**.
4. Observe the response — identical in structure to the Express server.

This confirms that HTTP is a **protocol** — the same request works with any server implementation.

---

## Section 14 – Summary


In this lecture, you learned:

* The **structure of an HTTP request** — method, path, version, headers, and body.
* The **structure of an HTTP response** — status code, headers, and body.
* How to use **browser DevTools** to inspect requests in real time.
* How to use **curl** to send requests from the command line.
* How to use **Postman** to build, send, and save API requests.
* That **GET, POST, PUT, and DELETE** behave differently regarding request bodies and expected responses.
* That the same HTTP request works across different server implementations (Express, Flask).

### Key Takeaways

* HTTP requests and responses have a well-defined structure that all servers follow.
* Browser DevTools, curl, and Postman are three essential tools for inspecting HTTP traffic.
* curl is ideal for quick command-line testing; Postman is ideal for visual API development.
* The protocol is independent of the server — the same tools work with Express, Flask, Django, or any other backend.

This lecture covered how to **observe** HTTP traffic. In **L05 – RESTful APIs**, you will learn how to design and build APIs that follow REST principles, turning the routes you created in L03 into a well-structured Student Management API.

---

### Lab Exercise

1. Start the Express server from L03 and use browser DevTools to capture a screenshot of the request–response cycle for `GET /students`.
2. Use curl to send a GET request to `/students/3` and verify the response matches the expected data.
3. Use Postman to send a GET request to `http://localhost:5000/students` on the Flask server and save it to a new collection.
4. Use curl with the `-v` flag to observe the request headers your browser sends by default.
5. Create a new Postman request that sends a GET request with a custom header `Accept: application/json` and document the response.
