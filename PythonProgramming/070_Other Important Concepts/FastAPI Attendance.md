# fast API Attendance moduel

```python

## pip install fastapi uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse

import uvicorn
from typing import Union
import pandas as pd







app = FastAPI()




html = '''
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
        const predefinedPart = "http://10.3.10.46:8000/markattendance/";

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

'''

@app.get("/")
def read_root():
    return {"Hello":"FastAPI",
            "test":"http://10.3.10.46:8000/attendance"}


@app.get("/attendance/")
def read_root():
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


# sapids = []

# @app.get("/markattendance/{item_id}")
# def mark_attendance(item_id: int, q: Union[str, None] = None):
    
#     print(sapids)
#     sapids.append(item_id)
#     sapids = list(set(sapids))
#     print(f"\n{sapids}\n")

#     return {"Status":f"attendance Marked for {item_id}"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
















# sapid= []

# @app.get("/sapid/{item_id}")
# def read_item(item_id: int, q: Union[str, None] = None):
#     sapid.append(item_id)
#     sapid = list(set(sapid))
#     print(f"\n {sapid} \n")
#     data= {"Present":sapid}
#     df = pd.DataFrame(data)
#     df.to_excel("B1B2Attendance.xlsx")


#     return {"Attendance marked": item_id}

# @app.get("/sapid/",response_class=HTMLResponse)
# def getSapid(request=Request):
#     html="""

# """



























# from fastapi.responses import  HTMLResponse
# from fastapi.staticfiles import StaticFiles
# from fastapi.templating import Jinja2Templates
# app.mount("/static", StaticFiles(directory="static"),name="static")

# templates = Jinja2Templates(directory="templates")


```

- [reference](https://fastapi.tiangolo.com/#create-it)