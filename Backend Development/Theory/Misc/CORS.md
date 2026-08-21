# CORS in FastAPI: A Practical Tutorial

CORS is one of those things that appears confusing at first because your API may work perfectly in the browser or Postman, while `fetch()` from your frontend suddenly fails.

The key idea is:

> **CORS is a browser security mechanism that controls whether JavaScript running on one origin is allowed to access resources on another origin.**

## 1. First understand the problem

Suppose you have:

```text
Frontend
http://localhost:5500
```

and your FastAPI server is running at:

```text
http://localhost:8000
```

Your JavaScript does:

```javascript
fetch("http://localhost:8000/")
```

The request is going from:

```text
localhost:5500
       |
       | fetch()
       v
localhost:8000
```

The browser sees that these are **different origins**.

So it asks:

> "Is the server at `localhost:8000` allowing JavaScript from `localhost:5500` to access it?"

If the FastAPI server doesn't provide the appropriate CORS headers, the browser blocks the response.

That is **CORS**.

## 2. What is an origin?

An origin consists of three things:

```text
scheme + host + port
```

For example:

```text
http://localhost:5500
```

has:

```text
scheme = http
host   = localhost
port   = 5500
```

Changing any of these creates a different origin.

For example:

```text
http://localhost:5500
http://localhost:8000
```

Different port → different origin.

Similarly:

```text
http://localhost:5500
http://127.0.0.1:5500
```

Different host → different origin.

And:

```text
http://localhost:5500
https://localhost:5500
```

Different scheme → different origin.

So these are all different origins:

```text
http://localhost:5500
http://localhost:8000
http://127.0.0.1:5500
https://localhost:5500
```

## 3. Why does the browser care?

Imagine you are logged into your bank:

```text
https://bank.example
```

Now you visit a malicious website:

```text
https://evil.example
```

That website could potentially run:

```javascript
fetch("https://bank.example/account")
```

If browsers allowed unrestricted cross-origin requests, malicious websites could potentially interact with websites where you are authenticated.

CORS is part of the browser's security model that prevents this kind of cross-origin access unless the target server explicitly permits it.

## 4. Important: CORS is mainly a browser issue

This explains an important observation.

You might test:

```text
FastAPI
   |
   v
Postman
```

and everything works.

But:

```text
Browser
   |
   | fetch()
   v
FastAPI
```

fails with CORS.

That is normal.

Postman isn't enforcing browser CORS rules in the same way.

The FastAPI server itself can be perfectly functional.

## 5. Your first FastAPI application

Create:

```text
main.py
```

with:

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def home():
    return {
        "message": "FastAPI is working"
    }
```

Run it:

```bash
uvicorn main:app --reload
```

You should get:

```text
http://127.0.0.1:8000
```

Open that address in your browser.

You should see:

```json
{
  "message": "FastAPI is working"
}
```

You can also visit:

```text
http://127.0.0.1:8000/docs
```

FastAPI automatically provides Swagger documentation.

## 6. Create a frontend

Create:

```text
index.html
```

For example:

```html
<!DOCTYPE html>
<html>
<head>
    <title>FastAPI CORS Test</title>
</head>
<body>

    <h1>FastAPI Test</h1>

    <button onclick="getData()">
        Get Data
    </button>

    <p id="result"></p>

    <script>
        async function getData() {
            const response = await fetch(
                "http://127.0.0.1:8000/"
            );

            const data = await response.json();

            document.getElementById("result").textContent =
                data.message;
        }
    </script>

</body>
</html>
```

Now serve this HTML from another server.

For example:

```bash
python -m http.server 5500
```

Your frontend is now:

```text
http://localhost:5500
```

while FastAPI is:

```text
http://127.0.0.1:8000
```

These are different origins.

## 7. What happens when you click the button?

The browser executes:

```javascript
fetch("http://127.0.0.1:8000/")
```

The browser knows that the page came from:

```text
http://localhost:5500
```

So it effectively tells FastAPI:

```text
Origin: http://localhost:5500
```

FastAPI currently doesn't have CORS configured.

The browser therefore refuses to give your JavaScript access to the response.

You may see an error similar to:

```text
Access to fetch at 'http://127.0.0.1:8000/'
from origin 'http://localhost:5500'
has been blocked by CORS policy
```

## 8. Fix CORS in FastAPI

FastAPI provides CORS middleware.

Add:

```python
from fastapi.middleware.cors import CORSMiddleware
```

Then configure it:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "FastAPI is working"
    }
```

Restart FastAPI:

```bash
uvicorn main:app --reload
```

Now try your frontend again.

It should work.

## 9. What does this configuration mean?

Let's break it down.

### `allow_origins`

```python
allow_origins=["*"]
```

This means:

```text
Allow requests from any origin.
```

For development, this is convenient.

For example:

```text
http://localhost:5500
http://localhost:3000
http://localhost:5173
http://127.0.0.1:5500
```

are all allowed.

### `allow_methods`

```python
allow_methods=["*"]
```

Allows HTTP methods such as:

```text
GET
POST
PUT
PATCH
DELETE
OPTIONS
```

### `allow_headers`

```python
allow_headers=["*"]
```

Allows request headers such as:

```text
Content-Type
Authorization
```

and others.

## 10. Better development configuration

Instead of allowing everything, you can explicitly specify your frontend.

Suppose your frontend runs on:

```text
http://localhost:5500
```

Use:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Now only that frontend origin is allowed.

## 11. `localhost` vs `127.0.0.1`

This causes a lot of confusion.

Suppose your frontend is:

```text
http://localhost:5500
```

and your API is:

```text
http://127.0.0.1:8000
```

That's okay.

But if you configure:

```python
allow_origins=[
    "http://127.0.0.1:5500"
]
```

it does **not** mean:

```text
http://localhost:5500
```

They are different origins.

If you want to support both:

```python
allow_origins=[
    "http://localhost:5500",
    "http://127.0.0.1:5500",
]
```

## 12. A more realistic FastAPI example

Suppose you have:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "API is working"
    }


@app.get("/students")
def students():
    return [
        {
            "id": 1,
            "name": "Aarav"
        },
        {
            "id": 2,
            "name": "Diya"
        }
    ]
}
```

Your frontend can then do:

```javascript
async function getStudents() {

    const response = await fetch(
        "http://127.0.0.1:8000/students"
    );

    const data = await response.json();

    console.log(data);
}
```

## 13. What is a preflight request?

This is the next important concept.

For a simple request such as:

```javascript
fetch("http://127.0.0.1:8000/students")
```

the browser may be able to make the request directly.

But some requests are more complicated.

For example:

```javascript
fetch("http://127.0.0.1:8000/students", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        name: "Aarav"
    })
});
```

Before sending the actual request, the browser may send an:

```text
OPTIONS
```

request.

This is called a **preflight request**.

Conceptually:

```text
Browser
   |
   | OPTIONS
   | "Can I POST JSON?"
   v
FastAPI
   |
   | "Yes, your origin is allowed"
   v
Browser
   |
   | POST
   v
FastAPI
```

FastAPI's `CORSMiddleware` handles this for you.

That's why this configuration is useful:

```python
allow_methods=["*"]
```

## 14. What are CORS headers?

The server communicates its CORS policy using HTTP response headers.

For example:

```text
Access-Control-Allow-Origin: http://localhost:5500
```

This tells the browser:

```text
localhost:5500 is allowed to access this response.
```

For preflight requests, you may see headers such as:

```text
Access-Control-Allow-Origin
Access-Control-Allow-Methods
Access-Control-Allow-Headers
```

You can see these in:

```text
Browser
→ Developer Tools
→ Network
→ Request
→ Response Headers
```

This is very useful when debugging CORS.

## 15. Don't blindly use `*` in production

During development:

```python
allow_origins=["*"]
```

is convenient.

For production, prefer:

```python
allow_origins=[
    "https://myfrontend.example.com"
]
```

rather than:

```python
allow_origins=["*"]
```

For example:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://app.example.com"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)
```

This gives you a much more controlled policy.

## 16. One important detail about credentials

Suppose your frontend sends authentication information such as cookies.

You might have:

```javascript
fetch("https://api.example.com/user", {
    credentials: "include"
});
```

Then your FastAPI configuration can use:

```python
allow_credentials=True
```

But don't combine credentials with a wildcard origin like this:

```python
allow_origins=["*"]
allow_credentials=True
```

For credentialed cross-origin requests, use explicit origins:

```python
allow_origins=[
    "http://localhost:5500"
],
allow_credentials=True
```

## 17. Common CORS mistakes

### Mistake 1: Wrong port

Frontend:

```text
http://localhost:3000
```

But you allowed:

```python
allow_origins=[
    "http://localhost:5500"
]
```

That won't work.

### Mistake 2: `localhost` vs `127.0.0.1`

Frontend:

```text
http://localhost:5500
```

Allowed:

```python
"http://127.0.0.1:5500"
```

Different origin.

### Mistake 3: Including a trailing slash

Use:

```python
"http://localhost:5500"
```

rather than:

```python
"http://localhost:5500/"
```

### Mistake 4: Thinking CORS fixes the API

CORS doesn't fix your API.

For example, if your API returns:

```text
500 Internal Server Error
```

that's an application/server problem.

CORS is specifically about whether the **browser allows JavaScript to access the cross-origin response**.

## 18. Recommended setup while learning

For your current FastAPI learning environment, I'd use:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "FastAPI is working"
    }
```

Then later, when you understand deployment better, reduce the list to only the actual frontend origin.

## 19. The mental model to remember

Think of CORS as:

```text
                  Different Origin
                       |
                       v
Browser ──────────> FastAPI
   |                    |
   |                    |
   | "Is this origin    |
   |  allowed?"         |
   |                    |
   |<───────────────────|
   |   CORS headers     |
   |
   v
Allow / Block
```

The important distinction is:

```text
CORS is enforced by the browser.
```

The FastAPI server tells the browser which origins it permits by returning the appropriate CORS headers.

So when you see:

```text
CORS error
```

your first debugging questions should be:

1. **What is my frontend origin?**
2. **What is my FastAPI origin?**
3. **Are they different origins?**
4. **Did I configure `CORSMiddleware`?**
5. **Does `allow_origins` exactly match the frontend origin?**
6. **If it's POST/PUT/etc., is the preflight `OPTIONS` request succeeding?**

Once you understand those six questions, most FastAPI CORS problems become straightforward.
