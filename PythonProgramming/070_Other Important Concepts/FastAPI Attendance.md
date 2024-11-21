# FastAPI Attendance moduel



```python

## pip install fastapi uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse

import uvicorn
from typing import Union
import pandas as pd







app = FastAPI()



@app.get("/")
def read_root():
    return {"Hello":"FastAPI",
            "test":"http://10.3.10.46:8000/attendance"}


@app.get("/attendance/")
def read_root():
	with open("index.html","r") as htmlFile:
		html = htmlFile.read()
    return HTMLResponse(html)


sapid= []


@app.get("/markattendance/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    global sapid
    sapid.append(item_id)
    sapid = list(set(sapid))
    print(f"\n {sapid} \n")
    data= {"Present":sapid}
    df = pd.DataFrame(data)
    df.to_excel("B3B4Attendance.xlsx")


    return {"Attendance marked": item_id}



if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)



```

`index.html`


```html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dynamic URL Generator</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        form {
            margin-bottom: 10px;
        }
        input {
            margin-right: 10px;
            padding: 5px;
            font-size: 16px;
        }
        button {
            padding: 5px 10px;
            font-size: 16px;
        }
        .result {
            margin-top: 20px;
            font-size: 18px;
            color: green;
        }
    </style>
</head>
<body>
    <h1>Attendamce</h1>
    <p>Enter sapid:</p>
    <form id="urlForm">
        <input type="text" id="userInput" placeholder="SAPID" required />
        <button type="submit">Generate URL</button>
    </form>
    <div class="result" id="result"></div>

    <script>
		const serverAddress = `http://127.0.0.1:8080/`
        const predefinedPart = serverAddress + "/markattendance/";

        document.getElementById("urlForm").addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent page reload
            const userInput = document.getElementById("userInput").value.trim();

            if (userInput) {
                const generatedUrl = predefinedPart + encodeURIComponent(userInput);
                const resultDiv = document.getElementById("result");
                resultDiv.innerHTML = `Generated URL: <a href="${generatedUrl}" target="_blank">${generatedUrl}</a>`;
            } else {
                alert("Please enter a valid input.");
            }
        });
    </script>
</body>
</html>

```



### Explanation of the Code

This code creates a FastAPI application that serves a simple attendance marking system. It uses dynamic HTML content to generate a URL for marking attendance based on a user-entered SAP ID (student ID).

---

### **Key Components**

1. **Dependencies:**
- **FastAPI:** To create and manage the web API.
- **uvicorn:** To run the ASGI server for the FastAPI app.
- **pandas:** To handle data operations and export attendance to an Excel file.

2. **HTML Interface:**
- Provides a web page for users to input their SAP ID.
- Includes a form and a JavaScript function that generates a dynamic URL based on the input.

3. **Endpoints:**
- **`GET /`**: Returns a basic JSON response with links and information.
- **`GET /attendance/`**: Serves the HTML form for generating the attendance URL.
- **`GET /markattendance/{item_id}`**: Marks the attendance for a given SAP ID and saves it to an Excel file.

---

### **Code Walkthrough**

#### **HTML Page**
- The `html` variable contains a basic web page where users can enter their SAP ID.
- A JavaScript function appends the SAP ID to a predefined URL (`http://10.3.10.46:8000/markattendance/{sapid}`) and displays it.

---

#### **FastAPI Routes**

1. **Root Endpoint (`/`)**:
- Returns a simple JSON object with a greeting and a link to the `/attendance/` page.

```python
@app.get("/")
def read_root():
   return {"Hello": "FastAPI",
		   "test": "http://10.3.10.46:8000/attendance"}
```

2. **Attendance Page (`/attendance/`)**:
- Returns the HTML response defined in the `html` variable.
- Allows users to generate dynamic attendance URLs.

```python
@app.get("/attendance/")
def read_root():
   return HTMLResponse(html)
```

3. **Mark Attendance (`/markattendance/{item_id}`)**:
- Takes a dynamic `item_id` (SAP ID) from the URL.
- Adds the SAP ID to a global list (`sapid`) to avoid duplicates.
- Exports the current attendance list to an Excel file (`B3B4Attendance.xlsx`).

```python
@app.get("/markattendance/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
   global sapid
   sapid.append(item_id)
   sapid = list(set(sapid))  # Remove duplicates
   print(f"\n {sapid} \n")
   data = {"Present": sapid}
   df = pd.DataFrame(data)
   df.to_excel("B3B4Attendance.xlsx")  # Save attendance to an Excel file
   return {"Attendance marked": item_id}
```

---

#### **Uvicorn Runner**
- Runs the application with live reload enabled on `http://0.0.0.0:8000`.

```python
if __name__ == "__main__":
   uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
```

---

### **Functionality Flow**

1. Access the root (`/`) endpoint to see the API info.
2. Go to `/attendance/` to use the HTML form for generating URLs.
3. Enter a SAP ID, and the form will generate a URL like `http://10.3.10.46:8000/markattendance/{sapid}`.
4. Access the generated URL to mark attendance for the entered SAP ID.
5. Attendance is stored in `B3B4Attendance.xlsx`.

---

### **Improvements**
1. **Error Handling:** Add validation for non-integer SAP IDs and handle duplicates gracefully.
2. **Dynamic File Paths:** Use the `os` module to handle file paths for cross-platform compatibility.
3. **Security:** Avoid using global variables (`sapid`). Instead, maintain state using a database or session management.



---

### Explanation of the Imports and Methods

1. **`from fastapi.responses import HTMLResponse`**:
- **Purpose:** Enables the FastAPI endpoint to return an **HTML** response.
- **Usage:** Use this when you want to directly serve HTML content from a FastAPI route.
- **Example:**
```python
from fastapi.responses import HTMLResponse

@app.get("/html", response_class=HTMLResponse)
def serve_html():
 html_content = "<h1>Hello, FastAPI!</h1>"
 return HTMLResponse(content=html_content)
```

2. **`from fastapi.staticfiles import StaticFiles`**:
- **Purpose:** Allows you to serve static files (like CSS, JavaScript, images) from a specific directory.
- **Usage:** Typically used for front-end resources in web applications.
- **`app.mount(...)` Usage:**
- Mounts the `StaticFiles` middleware at a specific route (e.g., `/static`).
- Files placed in the specified `directory` (e.g., `static/`) will be served when requested.
- **Example:**
```python
from fastapi.staticfiles import StaticFiles

app.mount("/static", StaticFiles(directory="static"), name="static")
```
- Now, a file at `static/style.css` can be accessed via `http://<your-host>/static/style.css`.

3. **`from fastapi.templating import Jinja2Templates`**:
- **Purpose:** Enables server-side rendering of HTML templates using the **Jinja2** templating engine.
- **Usage:** Dynamically generate HTML responses by combining templates with context data.
- **`templates = Jinja2Templates(...)` Usage:**
- Initializes the templates directory (`directory="templates"`).
- You can pass context data to these templates for rendering.
- **Example:**
```python
from fastapi.templating import Jinja2Templates
from fastapi import Request

templates = Jinja2Templates(directory="templates")

@app.get("/page")
async def serve_page(request: Request):
 context = {"request": request, "message": "Hello, FastAPI with Jinja2!"}
 return templates.TemplateResponse("index.html", context)
```
- If there is a file `templates/index.html` with the content:
```html
<html>
<body>
   <p>{{ message }}</p>
</body>
</html>
```
- Visiting `/page` will render:
```html
<html>
<body>
   <p>Hello, FastAPI with Jinja2!</p>
</body>
</html>
```

---

### Example Usage of All Components Together

```python
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize templates directory
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request, "title": "Home Page"})
```

#### Directory Structure:
```
project/
│
├── static/
│   ├── style.css
│   └── script.js
│
├── templates/
│   └── home.html
│
├── main.py
```

#### Example:
1. **Static Files:**
   - Access `style.css` via `http://<your-host>/static/style.css`.
2. **Dynamic Templates:**
   - The `home.html` template can use `{{ title }}` to display "Home Page".


- [reference](https://fastapi.tiangolo.com/#create-it)

---
Here's the corrected and improved version of your FastAPI attendance module code and its accompanying HTML file, with explanations for the changes.

---
# Alternative code with better error handeling

### **Python Code (FastAPI Application)**

#### Corrected Code:
```python
# FastAPI Attendance Module

# Install dependencies: pip install fastapi uvicorn pandas

from fastapi import FastAPI
from fastapi.responses import HTMLResponse
import uvicorn
from typing import Union
import pandas as pd

app = FastAPI()

# Route to test FastAPI setup
@app.get("/")
def read_root():
    return {
        "message": "Welcome to the FastAPI Attendance Module",
        "attendance_url": "http://127.0.0.1:8000/attendance/"
    }

# Route to serve the HTML form
@app.get("/attendance/", response_class=HTMLResponse)
def attendance_form():
    try:
        with open("index.html", "r") as htmlFile:
            html = htmlFile.read()
        return HTMLResponse(content=html)
    except FileNotFoundError:
        return HTMLResponse(content="<h1>index.html file not found</h1>", status_code=404)

# List to store SAP IDs
sapid = []

# Route to mark attendance
@app.get("/markattendance/{item_id}")
def mark_attendance(item_id: int, q: Union[str, None] = None):
    global sapid
    sapid.append(item_id)
    sapid = list(set(sapid))  # Remove duplicates
    print(f"\nSAP IDs marked as present: {sapid}\n")
    data = {"Present": sapid}
    df = pd.DataFrame(data)
    df.to_excel("B3B4Attendance.xlsx", index=False)  # Save the Excel file
    return {"Attendance marked for": item_id, "current_attendance_list": sapid}

# Run the application
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
```

---

### **Changes and Explanations**
1. **Code Documentation**:
- Added meaningful comments for clarity.
- Added the installation command in a comment for missing dependencies.

2. **`attendance_form` Route**:
- Used `response_class=HTMLResponse` explicitly to ensure the HTML file is served correctly.
- Added a `FileNotFoundError` handler to return an error message if `index.html` is not found.

3. **Global List `sapid`**:
- Duplicates are removed using `list(set(sapid))` to ensure unique entries.

4. **Excel File Handling**:
- Added `index=False` in `df.to_excel` to prevent an extra index column in the Excel file.

5. **Consistent Endpoint URLs**:
- Ensured consistency in URLs (`http://127.0.0.1:8000/`).

---

### **HTML Code (index.html)**

#### Corrected Code:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Attendance Module</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        form {
            margin-bottom: 10px;
        }
        input {
            margin-right: 10px;
            padding: 5px;
            font-size: 16px;
        }
        button {
            padding: 5px 10px;
            font-size: 16px;
        }
        .result {
            margin-top: 20px;
            font-size: 18px;
            color: green;
        }
    </style>
</head>
<body>
    <h1>Attendance Module</h1>
    <p>Enter SAP ID to mark attendance:</p>
    <form id="urlForm">
        <input type="text" id="userInput" placeholder="Enter SAP ID" required />
        <button type="submit">Generate URL</button>
    </form>
    <div class="result" id="result"></div>

    <script>
        const serverAddress = "http://127.0.0.1:8000";
        const predefinedPart = `${serverAddress}/markattendance/`;

        document.getElementById("urlForm").addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent page reload
            const userInput = document.getElementById("userInput").value.trim();

            if (userInput) {
                const generatedUrl = predefinedPart + encodeURIComponent(userInput);
                const resultDiv = document.getElementById("result");
                resultDiv.innerHTML = `Generated URL: <a href="${generatedUrl}" target="_blank">${generatedUrl}</a>`;
            } else {
                alert("Please enter a valid SAP ID.");
            }
        });
    </script>
</body>
</html>
```

---

### **Changes and Explanations**
1. **HTML Structure**:
- Renamed the title to "Attendance Module" for relevance.
- Improved labels and placeholders for user input for better user experience.

2. **JavaScript URL Generation**:
- Fixed the `serverAddress` URL to match the FastAPI server (`http://127.0.0.1:8000`).
- Used ES6 template literals (`${}`) for cleaner string concatenation.

3. **Validation**:
- Added a more user-friendly error alert when no SAP ID is entered.

---

### **Running the Application**
1. Save the Python code as `main.py`.
2. Save the HTML file as `index.html` in the same directory.
3. Run the FastAPI server:
   ```bash
   python main.py
   ```
4. Open `http://127.0.0.1:8000/attendance/` in a browser to access the HTML form.
5. Enter a SAP ID to generate a URL and test the attendance marking functionality.
