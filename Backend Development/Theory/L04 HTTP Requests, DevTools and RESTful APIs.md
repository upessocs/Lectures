# Lecture 04

# HTTP Requests, DevTools, and RESTful APIs

**Course Outcome:** CO1 – Understand HTTP fundamentals, inspect request–response cycles, and design RESTful APIs.

---

## Part A – Theory

---

### 1. Introduction

In L03, we studied HTTP fundamentals and built our first backend servers using Express.js and Flask. We saw how a client sends a request and the server returns a response. Today, we go deeper by **inspecting** what actually travels between client and server, and then learn how to **design proper APIs** using REST principles.

By the end of this lecture, you will have:

1. A detailed understanding of HTTP request and response structure.
2. The ability to inspect requests using browser DevTools, curl, and Postman.
3. An understanding of how APIs evolved before REST.
4. Knowledge of REST principles, constraints, and best practices.
5. The ability to build a simple API using FastAPI.

---

### 2. Anatomy of an HTTP Request

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

#### Request Line

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

#### Request Headers

Headers are key-value pairs that carry metadata about the request.

| Header | Purpose | Example Value |
|--------|---------|---------------|
| **Host** | The server's domain name | `localhost:3000` |
| **User-Agent** | Browser and OS information | `Mozilla/5.0 ...` |
| **Accept** | Data formats the client can handle | `application/json` |
| **Content-Type** | Format of data being sent | `application/json` |
| **Authorization** | Authentication credentials | `Bearer abc123` |

#### Request Body

The body carries data sent to the server. It is optional and typically used with `POST` and `PUT` requests.

```json
{
  "name": "Aarav",
  "branch": "CSE"
}
```

GET requests usually have no body. POST and PUT requests send data in the body.

---

### 3. Anatomy of an HTTP Response

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

#### Status Line

```
HTTP/version STATUS_CODE REASON
```

**Example:**

```
HTTP/1.1 200 OK
```

#### Response Headers

| Header | Purpose | Example Value |
|--------|---------|---------------|
| **Content-Type** | Format of the response data | `application/json` |
| **Content-Length** | Size of the response body in bytes | `256` |
| **Cache-Control** | Caching instructions | `no-cache` |
| **Set-Cookie** | Sends a cookie to the client | `session=abc123` |

#### Response Body

The actual data returned by the server — HTML, JSON, a file, or an error message.

```json
[
  { "id": 1, "name": "Aarav", "branch": "CSE" },
  { "id": 2, "name": "Diya", "branch": "ECE" }
]
```

---

### 4. HTTP Methods Compared

Understanding how each method behaves differently is critical for building APIs.

| Method | Purpose | Has Body? | Typical Response |
|--------|---------|-----------|------------------|
| **GET** | Retrieve data | No | `200 OK` with data |
| **POST** | Create new data | Yes | `201 Created` with new resource |
| **PUT** | Update existing data | Yes | `200 OK` with updated resource |
| **DELETE** | Remove data | No | `204 No Content` |

---

### 5. Inspecting Requests with Browser DevTools

Browser DevTools is the fastest way to see what happens when your browser communicates with a server.

#### How to Open DevTools

- **Windows / Linux:** Press `F12` or `Ctrl + Shift + I`
- **macOS:** Press `Cmd + Option + I`
- Or right-click anywhere on the page and select **Inspect**

#### The Network Tab

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

### 6. Inspecting Requests with curl

**curl** is a command-line tool for sending HTTP requests. It is available on virtually every operating system and is essential for testing APIs without a browser.

#### Basic Syntax

```bash
curl [options] URL
```

#### Common Options

| Option | Purpose | Example |
|--------|---------|---------|
| `-v` | Verbose mode — shows full request/response headers | `curl -v http://localhost:3000/` |
| `-X` | Specify the HTTP method | `curl -X POST http://localhost:3000/students` |
| `-H` | Add a request header | `curl -H "Accept: application/json" ...` |
| `-d` | Send data in the request body | `curl -d '{"name":"Aarav"}' ...` |
| `-i` | Include response headers in output | `curl -i http://localhost:3000/` |

#### Example: Verbose Request

```bash
curl -v http://localhost:3000/students
```

This prints the full request headers, response headers, and response body — everything you need to debug an API.

---

### 7. Inspecting Requests with Postman

**Postman** is a graphical tool designed specifically for building, testing, and debugging APIs. It provides a visual interface for constructing requests and inspecting responses.

#### Key Features

| Feature | Description |
|---------|-------------|
| **Request Builder** | Build requests with a GUI — select method, enter URL, add headers, body |
| **Collections** | Organize and save groups of related requests |
| **Environment Variables** | Switch between development, staging, and production environments |
| **Response Viewer** | View formatted JSON, headers, status codes, and timing |
| **History** | Automatically saves every request you send |

#### Why Use Postman?

- Browser DevTools are great for GET requests but limited for POST, PUT, and DELETE.
- curl is powerful but requires memorizing flags and syntax.
- Postman gives you **visual control** over every part of the request.

---

### 8. Before REST: How APIs Worked

Before REST became standard in the early 2000s, web services used different approaches. Understanding these helps appreciate why REST succeeded.

<svg xmlns="http://www.w3.org/2000/svg" width="900" height="200" viewBox="0 0 900 200">
<rect width="900" height="200" fill="white"/>
<text x="450" y="30" text-anchor="middle" font-size="18" font-weight="bold">Evolution of Web APIs</text>
<rect x="40" y="60" width="200" height="100" rx="8" fill="#F3E5F5" stroke="#8E24AA"/>
<text x="140" y="95" text-anchor="middle" font-size="16" font-weight="bold">SOAP</text>
<text x="140" y="115" text-anchor="middle" font-size="12">XML Only</text>
<text x="140" y="135" text-anchor="middle" font-size="12">WSDL Contracts</text>
<rect x="280" y="60" width="200" height="100" rx="8" fill="#E0F7FA" stroke="#00ACC1"/>
<text x="380" y="95" text-anchor="middle" font-size="16" font-weight="bold">XML-RPC</text>
<text x="380" y="115" text-anchor="middle" font-size="12">XML over HTTP</text>
<text x="380" y="135" text-anchor="middle" font-size="12">Simple but Limited</text>
<rect x="520" y="60" width="200" height="100" rx="8" fill="#E8F8EC" stroke="#43A047"/>
<text x="620" y="95" text-anchor="middle" font-size="16" font-weight="bold">REST</text>
<text x="620" y="115" text-anchor="middle" font-size="12">JSON / XML</text>
<text x="620" y="135" text-anchor="middle" font-size="12">Resource-Based</text>
<rect x="760" y="60" width="110" height="100" rx="8" fill="#FFF8E6" stroke="#FB8C00"/>
<text x="815" y="95" text-anchor="middle" font-size="14" font-weight="bold">GraphQL</text>
<text x="815" y="115" text-anchor="middle" font-size="11">Query Language</text>
<text x="815" y="135" text-anchor="middle" font-size="11">2015+</text>
<text x="450" y="190" text-anchor="middle" font-size="12" fill="#555">Complexity Decreased - Developer Adoption Increased</text>
</svg>

#### 8.1 SOAP (Simple Object Access Protocol)

SOAP was the dominant enterprise protocol from the late 1990s to early 2000s.

**Characteristics:**

- Uses XML exclusively for message format
- Requires WSDL (Web Services Description Language) contracts
- Heavy envelope structure with headers and body
- Built-in security (WS-Security) and transactions (WS-AtomicTransaction)
- Used HTTP, SMTP, or other transport protocols

**Example SOAP Request:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetStudent xmlns="http://example.com/api">
      <StudentId>1</StudentId>
    </GetStudent>
  </soap:Body>
</soap:Envelope>
```

**Problems:**

- Verbose XML payloads increase bandwidth usage
- Complex tooling required (WSDL parsers, SOAP clients)
- Tight coupling between client and server
- Poor browser support

#### 8.2 XML-RPC

A simpler predecessor to SOAP that also used XML but with less overhead.

**Characteristics:**

- Method calls encoded in XML
- Uses HTTP as transport
- No contract language like WSDL
- Simpler than SOAP but limited features

**Example XML-RPC Request:**

```xml
<?xml version="1.0"?>
<methodCall>
  <methodName>GetStudent</methodName>
  <params>
    <param><value><int>1</int></value></param>
  </params>
</methodCall>
```

#### 8.3 The Problem REST Solved

| Aspect | SOAP | XML-RPC | REST |
|--------|------|---------|------|
| Data Format | XML only | XML only | JSON, XML, HTML |
| Contract | WSDL (complex) | None | Self-documenting |
| Complexity | High | Medium | Low |
| State | Stateful | Stateful | Stateless |
| Browser Support | Poor | Poor | Native |
| Developer Experience | Difficult | Moderate | Simple |

REST solved these problems by using HTTP as-is, supporting JSON, and providing a resource-based mental model.

---

### 9. What is REST?

**REST (Representational State Transfer)** is an architectural style defined by Roy Fielding in his 2000 doctoral dissertation. It is NOT a protocol or standard — it is a set of design constraints.

<svg xmlns="http://www.w3.org/2000/svg" width="800" height="280" viewBox="0 0 800 280">
<rect width="800" height="280" fill="white"/>
<text x="400" y="30" text-anchor="middle" font-size="18" font-weight="bold">REST Core Concepts</text>
<rect x="40" y="60" width="220" height="90" rx="8" fill="#EAF4FF" stroke="#1E88E5"/>
<text x="150" y="90" text-anchor="middle" font-size="14" font-weight="bold">Resources</text>
<text x="150" y="110" text-anchor="middle" font-size="12">Everything is a resource</text>
<text x="150" y="130" text-anchor="middle" font-size="12">Identified by URIs</text>
<rect x="290" y="60" width="220" height="90" rx="8" fill="#E8F8EC" stroke="#43A047"/>
<text x="400" y="90" text-anchor="middle" font-size="14" font-weight="bold">Representations</text>
<text x="400" y="110" text-anchor="middle" font-size="12">JSON, XML, HTML</text>
<text x="400" y="130" text-anchor="middle" font-size="12">Views of resource state</text>
<rect x="540" y="60" width="220" height="90" rx="8" fill="#FFF8E6" stroke="#FB8C00"/>
<text x="650" y="90" text-anchor="middle" font-size="14" font-weight="bold">Stateless</text>
<text x="650" y="110" text-anchor="middle" font-size="12">No server session</text>
<text x="650" y="130" text-anchor="middle" font-size="12">Each request is independent</text>
<rect x="140" y="180" width="520" height="70" rx="8" fill="#FCE4EC" stroke="#E53935"/>
<text x="400" y="210" text-anchor="middle" font-size="14" font-weight="bold">Uniform Interface</text>
<text x="400" y="235" text-anchor="middle" font-size="12">Consistent methods: GET, POST, PUT, DELETE</text>
</svg>

#### 9.1 Key Concepts

**Resources**

- Everything in your API is a **resource** — students, courses, grades, users
- Each resource has a unique identifier (URI)
- Examples: `/students`, `/students/1`, `/courses`

**Representations**

- Resources are not directly transferred — their **representations** are
- A student resource might be represented as JSON, XML, or HTML
- Client specifies preferred representation via `Accept` header

**Stateless**

- The server stores NO session state between requests
- Every request contains all information needed to process it
- Authentication tokens (JWT) replace server-side sessions

#### 9.2 Resource Identification

Every resource is identified by a **URI (Uniform Resource Identifier)**:

| Resource | URI | Description |
|----------|-----|-------------|
| Students collection | `/students` | All students |
| Single student | `/students/1` | Student with ID 1 |
| Student's courses | `/students/1/courses` | Courses for student 1 |
| Courses collection | `/courses` | All courses |

---

### 10. The Six REST Constraints

Roy Fielding defined six constraints that make an API truly RESTful:

<svg xmlns="http://www.w3.org/2000/svg" width="800" height="320" viewBox="0 0 800 320">
<rect width="800" height="320" fill="white"/>
<text x="400" y="30" text-anchor="middle" font-size="18" font-weight="bold">The Six REST Constraints</text>
<rect x="40" y="60" width="220" height="70" rx="8" fill="#EAF4FF" stroke="#1E88E5"/>
<text x="150" y="85" text-anchor="middle" font-size="13" font-weight="bold">Client-Server</text>
<text x="150" y="105" text-anchor="middle" font-size="11">Separation of concerns</text>
<rect x="290" y="60" width="220" height="70" rx="8" fill="#E8F8EC" stroke="#43A047"/>
<text x="400" y="85" text-anchor="middle" font-size="13" font-weight="bold">Stateless</text>
<text x="400" y="105" text-anchor="middle" font-size="11">No session on server</text>
<rect x="540" y="60" width="220" height="70" rx="8" fill="#FFF8E6" stroke="#FB8C00"/>
<text x="650" y="85" text-anchor="middle" font-size="13" font-weight="bold">Cacheable</text>
<text x="650" y="105" text-anchor="middle" font-size="11">Responses declare cacheability</text>
<rect x="40" y="155" width="220" height="70" rx="8" fill="#E0F7FA" stroke="#00ACC1"/>
<text x="150" y="180" text-anchor="middle" font-size="13" font-weight="bold">Uniform Interface</text>
<text x="150" y="200" text-anchor="middle" font-size="11">Consistent resource access</text>
<rect x="290" y="155" width="220" height="70" rx="8" fill="#F3E5F5" stroke="#8E24AA"/>
<text x="400" y="180" text-anchor="middle" font-size="13" font-weight="bold">Layered System</text>
<text x="400" y="200" text-anchor="middle" font-size="11">Client unaware of layers</text>
<rect x="540" y="155" width="220" height="70" rx="8" fill="#FCE4EC" stroke="#E53935"/>
<text x="650" y="180" text-anchor="middle" font-size="13" font-weight="bold">Code on Demand</text>
<text x="650" y="200" text-anchor="middle" font-size="11">Optional executable code</text>
<rect x="140" y="260" width="520" height="40" rx="8" fill="#E0F7FA" stroke="#00ACC1"/>
<text x="400" y="285" text-anchor="middle" font-size="12">First 5 constraints are required; Code on Demand is optional</text>
</svg>

#### 10.1 Client-Server

The client (frontend) and server (backend) are independent. They can evolve separately as long as the interface remains the same.

#### 10.2 Stateless

Each request must contain all information needed. The server does not store session state. This improves scalability and reliability.

#### 10.3 Cacheable

Responses must indicate if they can be cached. This reduces unnecessary server calls and improves performance.

#### 10.4 Uniform Interface

All resources are accessed through the same consistent interface — HTTP methods (GET, POST, PUT, DELETE) on resource URIs.

#### 10.5 Layered System

The client cannot tell if it is connected directly to the server or through intermediaries (load balancers, proxies). This allows flexible deployment.

#### 10.6 Code on Demand (Optional)

The server can send executable code (JavaScript) to extend client functionality. Most REST APIs do not use this constraint.

---

### 11. RESTful Resource Naming Conventions

Proper naming makes APIs intuitive and self-documenting.

<svg xmlns="http://www.w3.org/2000/svg" width="800" height="280" viewBox="0 0 800 280">
<rect width="800" height="280" fill="white"/>
<text x="400" y="30" text-anchor="middle" font-size="18" font-weight="bold">Student Management API - Resource Model</text>
<rect x="250" y="60" width="300" height="50" rx="8" fill="#E8F8EC" stroke="#43A047"/>
<text x="400" y="90" text-anchor="middle" font-size="14" font-weight="bold">/students</text>
<line x1="400" y1="110" x2="200" y2="150" stroke="black" stroke-width="2"/>
<line x1="400" y1="110" x2="400" y2="150" stroke="black" stroke-width="2"/>
<line x1="400" y1="110" x2="600" y2="150" stroke="black" stroke-width="2"/>
<rect x="100" y="150" width="200" height="50" rx="8" fill="#EAF4FF" stroke="#1E88E5"/>
<text x="200" y="180" text-anchor="middle" font-size="12" font-weight="bold">/students/{id}</text>
<rect x="300" y="150" width="200" height="50" rx="8" fill="#FFF8E6" stroke="#FB8C00"/>
<text x="400" y="180" text-anchor="middle" font-size="12" font-weight="bold">/courses</text>
<rect x="500" y="150" width="200" height="50" rx="8" fill="#F3E5F5" stroke="#8E24AA"/>
<text x="600" y="180" text-anchor="middle" font-size="12" font-weight="bold">/users</text>
<text x="400" y="240" text-anchor="middle" font-size="12" fill="#555">Plural nouns for collections, nested for relationships</text>
</svg>

**Rules:**

| Rule | Good | Bad |
|------|------|-----|
| Use plural nouns | `/students` | `/student`, `/getStudents` |
| Use nouns not verbs | `/students` | `/getAllStudents` |
| Use hyphens for multi-word | `/student-profiles` | `/studentProfiles` |
| Nest for relationships | `/students/1/courses` | `/getCoursesByStudent/1` |

---

### 12. HTTP Methods in REST

Each HTTP method maps to a CRUD operation on resources.

<svg xmlns="http://www.w3.org/2000/svg" width="800" height="200" viewBox="0 0 800 200">
<rect width="800" height="200" fill="white"/>
<text x="400" y="30" text-anchor="middle" font-size="18" font-weight="bold">HTTP Methods to CRUD Mapping</text>
<rect x="40" y="60" width="150" height="60" rx="8" fill="#E8F8EC" stroke="#43A047"/>
<text x="115" y="85" text-anchor="middle" font-size="14" font-weight="bold">GET</text>
<text x="115" y="105" text-anchor="middle" font-size="11">Read</text>
<rect x="210" y="60" width="150" height="60" rx="8" fill="#EAF4FF" stroke="#1E88E5"/>
<text x="285" y="85" text-anchor="middle" font-size="14" font-weight="bold">POST</text>
<text x="285" y="105" text-anchor="middle" font-size="11">Create</text>
<rect x="380" y="60" width="150" height="60" rx="8" fill="#FFF8E6" stroke="#FB8C00"/>
<text x="455" y="85" text-anchor="middle" font-size="14" font-weight="bold">PUT</text>
<text x="455" y="105" text-anchor="middle" font-size="11">Update (full)</text>
<rect x="550" y="60" width="150" height="60" rx="8" fill="#F3E5F5" stroke="#8E24AA"/>
<text x="625" y="85" text-anchor="middle" font-size="14" font-weight="bold">DELETE</text>
<text x="625" y="105" text-anchor="middle" font-size="11">Remove</text>
<text x="400" y="160" text-anchor="middle" font-size="12" fill="#555">GET and DELETE are idempotent; POST is not</text>
</svg>

| Method | CRUD | Has Body? | Idempotent? | Typical Response |
|--------|------|-----------|-------------|------------------|
| **GET** | Read | No | Yes | `200 OK` with data |
| **POST** | Create | Yes | No | `201 Created` with new resource |
| **PUT** | Full Update | Yes | Yes | `200 OK` with updated resource |
| **PATCH** | Partial Update | Yes | No | `200 OK` with updated resource |
| **DELETE** | Delete | No | Yes | `204 No Content` |

**Idempotent** means calling the method multiple times produces the same result as calling it once. GET, PUT, and DELETE are idempotent. POST is not — sending the same POST request twice creates two resources.

---

### 13. Status Codes for REST APIs

| Code | Meaning | When to Use |
|------|---------|-------------|
| **200** | OK | Successful GET, PUT, PATCH |
| **201** | Created | Successful POST that creates a resource |
| **204** | No Content | Successful DELETE (no body returned) |
| **400** | Bad Request | Invalid input from client |
| **401** | Unauthorized | Authentication required |
| **403** | Forbidden | Authenticated but not allowed |
| **404** | Not Found | Resource does not exist |
| **409** | Conflict | Duplicate or conflicting state |
| **422** | Unprocessable Entity | Validation errors |
| **500** | Internal Server Error | Unexpected server failure |

---

### 14. REST Best Practices

<svg xmlns="http://www.w3.org/2000/svg" width="800" height="250" viewBox="0 0 800 250">
<rect width="800" height="250" fill="white"/>
<text x="400" y="30" text-anchor="middle" font-size="18" font-weight="bold">REST API Best Practices</text>
<rect x="40" y="60" width="340" height="70" rx="8" fill="#E8F8EC" stroke="#43A047"/>
<text x="210" y="85" text-anchor="middle" font-size="13" font-weight="bold">Use Plural Nouns</text>
<text x="210" y="105" text-anchor="middle" font-size="11">GET /students not /getStudents</text>
<rect x="420" y="60" width="340" height="70" rx="8" fill="#EAF4FF" stroke="#1E88E5"/>
<text x="590" y="85" text-anchor="middle" font-size="13" font-weight="bold">Version Your API</text>
<text x="590" y="105" text-anchor="middle" font-size="11">/api/v1/students</text>
<rect x="40" y="150" width="340" height="70" rx="8" fill="#FFF8E6" stroke="#FB8C00"/>
<text x="210" y="175" text-anchor="middle" font-size="13" font-weight="bold">Use Proper Status Codes</text>
<text x="210" y="195" text-anchor="middle" font-size="11">201 for create, 204 for delete</text>
<rect x="420" y="150" width="340" height="70" rx="8" fill="#F3E5F5" stroke="#8E24AA"/>
<text x="590" y="175" text-anchor="middle" font-size="13" font-weight="bold">Paginate Collections</text>
<text x="590" y="195" text-anchor="middle" font-size="11">?page=1&amp;limit=20</text>
</svg>

1. **Use plural nouns** for resource names (`/students`, not `/student`)
2. **Version your API** (`/api/v1/students`) to support backward compatibility
3. **Use proper status codes** — don't return 200 for errors
4. **Return consistent error responses** with `detail` field
5. **Filter, sort, paginate** collections (`/students?branch=CSE&page=1`)
6. **Use HATEOAS** for discoverability (links in responses)
7. **Document your API** with OpenAPI/Swagger

---

### 15. Introduction to FastAPI

**FastAPI** is a modern Python web framework for building APIs. It is ideal for learning REST because it is simple, fast, and auto-generates API documentation.

**Why FastAPI?**

- **Type hints** with Pydantic for automatic validation
- **Auto-generated docs** at `/docs` (Swagger UI) and `/redoc`
- **Performance** comparable to Node.js and Go
- **Minimal boilerplate** — working API in 10 lines

**Install FastAPI:**

```bash
pip install fastapi uvicorn
```

**Minimal Example:**

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, REST!"}
```

Run with: `uvicorn main:app --reload`

Open `http://localhost:8000/docs` to see auto-generated Swagger UI.

#### Running Uvicorn as a Module

Instead of running `uvicorn` from the command line, you can import it in `main.py` and run the server directly:

```python
from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, REST!"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
```

Now run the server with:

```bash
python main.py
```

**What changed:**

- `uvicorn.run()` starts the server programmatically
- `host="127.0.0.1"` — binds to localhost only
- `port=8000` — specifies the port number
- `reload=True` — auto-restarts on code changes (use `False` in production)

This approach is useful when you want to control server settings from within your code rather than the command line.

---

## Part B – Installation

---

### 16. Installing Tools

#### Verify curl (pre-installed)

curl comes pre-installed on most systems.

```bash
curl --version
```

Expected output:

```
curl 8.4.0 (x86_64-pc-linux-gnu) ...
```

If curl is not installed on Windows, it is available by default in Windows 10 and later.

#### Installing Postman

1. Visit [https://www.postman.com/downloads/](https://www.postman.com/downloads/).
2. Download the version for your operating system (Windows, macOS, or Linux).
3. Run the installer and follow the default settings.
4. When Postman opens, you can skip signing in — the basic functionality works without an account.

#### Setting Up FastAPI

```bash
mkdir student-api
cd student-api

# using venv
python -m venv venv
source venv/bin/activate     # macOS/Linux
venv\Scripts\activate        # Windows
pip install fastapi uvicorn

# is not using vnev use pipenv
pipenv install fastapi uvicorn
pipenv shell
```

Verify:

```bash
pip list | grep fastapi
```

---

## Part C – Hands-On: HTTP Inspection and RESTful API

---

### 17. Task 1 — Inspect a Request Using Browser DevTools

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

### 18. Task 2 — Send Requests Using curl

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

### 19. Task 3 — Send Requests Using Postman

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
   - **Key:** `Accept`
   - **Value:** `application/json`
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

### 20. Task 4 — Same Request, Three Tools

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

### 21. Task 5 — Flask Server Inspection

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

### 22. Task 6 — Build a RESTful API with FastAPI

Now that you understand HTTP requests and how to inspect them, let us build a proper RESTful API.

#### Step 1: Create main.py

Create a file called `main.py`:

```python
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI(title="Student Management API", version="1.0.0")


class Student(BaseModel):
    id: int
    name: str
    branch: str


class StudentCreate(BaseModel):
    name: str
    branch: str


students: List[Student] = [
    Student(id=1, name="Aarav", branch="CSE"),
    Student(id=2, name="Diya", branch="ECE"),
    Student(id=3, name="Rohan", branch="IT"),
]

next_id = 4


@app.get("/students", response_model=List[Student])
def list_students(branch: Optional[str] = Query(None)):
    if branch:
        return [s for s in students if s.branch.upper() == branch.upper()]
    return students


@app.get("/students/{student_id}", response_model=Student)
def get_student(student_id: int):
    for student in students:
        if student.id == student_id:
            return student
    raise HTTPException(status_code=404, detail="Student not found")


@app.post("/students", response_model=Student, status_code=201)
def create_student(student: StudentCreate):
    global next_id
    new_student = Student(id=next_id, **student.model_dump())
    students.append(new_student)
    next_id += 1
    return new_student


@app.put("/students/{student_id}", response_model=Student)
def update_student(student_id: int, student: StudentCreate):
    for i, existing in enumerate(students):
        if existing.id == student_id:
            updated = Student(id=student_id, **student.model_dump())
            students[i] = updated
            return updated
    raise HTTPException(status_code=404, detail="Student not found")


@app.delete("/students/{student_id}", status_code=204)
def delete_student(student_id: int):
    for i, student in enumerate(students):
        if student.id == student_id:
            students.pop(i)
            return
    raise HTTPException(status_code=404, detail="Student not found")
```

#### Step 2: Run the server

```bash
uvicorn main:app --reload
```

#### Step 3: Test with Swagger UI

Open `http://localhost:8000/docs` — you will see interactive API documentation.

#### Step 4: Test with curl

**List all students:**

```bash
curl http://localhost:8000/students
```

**Get a single student:**

```bash
curl http://localhost:8000/students/1
```

**Create a student:**

```bash
curl -X POST http://localhost:8000/students \
  -H "Content-Type: application/json" \
  -d '{"name": "Priya", "branch": "CSE"}'
```

**Filter by branch:**

```bash
curl "http://localhost:8000/students?branch=CSE"
```

**Delete a student:**

```bash
curl -X DELETE http://localhost:8000/students/2
```

#### Step 5: Test with Postman

1. Import the endpoints into Postman.
2. Test each CRUD operation.
3. Observe status codes: `200` for GET/PUT, `201` for POST, `204` for DELETE.

---

## Summary

In this lecture, you learned:

* The **structure of an HTTP request** — method, path, version, headers, and body.
* The **structure of an HTTP response** — status code, headers, and body.
* How to use **browser DevTools** to inspect requests in real time.
* How to use **curl** to send requests from the command line.
* How to use **Postman** to build, send, and save API requests.
* **Before REST**: SOAP used verbose XML with WSDL contracts; XML-RPC was simpler but limited.
* **REST principles**: Resources, Representations, Stateless, Uniform Interface.
* **Six REST constraints**: Client-Server, Stateless, Cacheable, Uniform Interface, Layered System, Code on Demand.
* **Resource naming**: Use plural nouns, nest for relationships, avoid verbs.
* **Status codes**: 200, 201, 204 for success; 400, 401, 403, 404, 422 for client errors.
* **Best practices**: Versioning, filtering, pagination, consistent error responses.
* How to build a **complete CRUD API** using FastAPI with automatic validation and Swagger docs.

### Key Takeaways

- HTTP requests and responses have a well-defined structure that all servers follow.
- Browser DevTools, curl, and Postman are three essential tools for inspecting HTTP traffic.
- REST is an architectural style, not a protocol — it provides design constraints.
- Proper resource naming (`/students`) is more intuitive than verb-based naming (`/getStudents`).
- FastAPI auto-generates API documentation and validates input using Pydantic models.
- Always use appropriate HTTP status codes to communicate results.

This lecture covered how to **observe** HTTP traffic and **design** RESTful APIs. In **L05 – Introduction to Backend Languages**, you will explore Python and JavaScript in more depth for backend development.

---

### Lab Exercise

1. Start the Express server from L03 and use browser DevTools to capture a screenshot of the request–response cycle for `GET /students`.
2. Use curl to send a GET request to `/students/3` and verify the response matches the expected data.
3. Use Postman to send a GET request to `http://localhost:5000/students` on the Flask server and save it to a new collection.
4. Add a new endpoint `GET /students/{id}/courses` to the FastAPI app that returns an empty list. Test it with curl.
5. Modify the FastAPI API to support sorting students by name using a query parameter `?sort=name`.
