# Download a file using `requests` library

Function to download a file using Python's `requests` library

```python
import requests

def download_file(url, file_name):
    # Send a GET request to the provided URL
    response = requests.get(url)
    
    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        # Open a local file in binary write mode and save the content
        with open(file_name, 'wb') as file:
            file.write(response.content)
        print(f"File '{file_name}' downloaded successfully.")
    else:
        print(f"Failed to download file. Status code: {response.status_code}")

# Example usage
if __name__ == "__main__":
	url = 'https://example.com/file.pdf'
	file_name = 'file.pdf'
	download_file(url, file_name)
```

### How it works:
- The function takes in the URL (`url`) of the file and the `file_name` under which you want to save it locally.
- It sends a **GET** request using `requests.get(url)`, which retrieves the file content from the given URL.
- If the request is successful (i.e., status code 200), the file is written to disk using the `with open(file_name, 'wb')` statement, where `'wb'` means "write in binary mode".
- The content of the response is saved using `response.content`.

### **Explanation of Other HTTP Methods:**

- **GET**:  
The most common method used to request data from a specified resource. It sends data through the URL query string. When downloading files, this is the method typically used.
- **POST**:  
Used to send data to a server to create or update a resource. Unlike GET, POST submits data enclosed in the body of the request. It’s often used for sending form data to a web server.
```python
response = requests.post('https://example.com/api', data={'key': 'value'})
```
- **PUT**:  
This method is used to update or create a resource on the server. It is idempotent, meaning calling it multiple times will always produce the same result. It usually uploads data to the server.
```python
response = requests.put('https://example.com/api/resource', data={'name': 'new_name'})
```
- **DELETE**:  
Used to delete a resource from the server.
```python
response = requests.delete('https://example.com/api/resource')
```
- **HEAD**:  
This method is identical to GET but does not return the body of the response. It only retrieves headers, which is useful to check if a resource exists or to get metadata.
```python
response = requests.head('https://example.com/file')
```
- **OPTIONS**:  
Used to describe the communication options for the target resource. It’s useful for discovering the allowed HTTP methods.
```python
response = requests.options('https://example.com/api/resource')
```


---
# The `requests` module

The `requests` module in Python is a powerful and user-friendly library for making HTTP requests. It abstracts many of the complexities involved in working with web servers and provides a simple API for interacting with them. 

### Installation:
You can install `requests` using pip:
```bash
pip install requests
```

### Key Features of `requests`:
1. **Easy to use and read**: The syntax is intuitive and minimalistic.
2. **Supports all major HTTP methods**: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, etc.
3. **Handles sessions and cookies**: `requests` can manage server-side sessions and persist cookies.
4. **Timeouts and retries**: You can specify timeouts for requests and implement retries.
5. **JSON support**: Direct support for sending and receiving JSON data.
6. **Custom headers and authentication**: You can easily customize headers or use different types of authentication.

---
### Basic Example of a `GET` Request

```python
import requests

response = requests.get('https://api.github.com')

# Status code
print(f"Status Code: {response.status_code}")

# Response content (JSON data)
print(f"JSON Response: {response.json()}")

# Headers
print(f"Response Headers: {response.headers}")

# Raw text data
print(f"Text Response: {response.text}")
```

#### Explanation:
- `response = requests.get('url')`: Sends a GET request to the URL.
- `response.status_code`: Returns the HTTP status code (e.g., 200 for success, 404 for not found).
- `response.json()`: Converts the response content to a Python dictionary if the server returns JSON.
- `response.headers`: Contains the response headers (meta-information about the response).
- `response.text`: Returns the response content as a string (useful for HTML pages).

### Handling Parameters in URLs
Sometimes, you need to pass parameters in a GET request. Instead of manually appending them to the URL, you can pass them using the `params` argument.

```python
params = {'q': 'requests+python', 'page': 2}
response = requests.get('https://api.github.com/search/repositories', params=params)

print(f"URL with Parameters: {response.url}")  # Prints the complete URL with parameters
```
---

### Sending `POST` Requests
The `POST` method is used when you need to send data to the server (e.g., when submitting a form).

```python
data = {'username': 'testuser', 'password': 'testpass'}
response = requests.post('https://httpbin.org/post', data=data)

print(f"Response Text: {response.text}")
```

#### Explanation:
- `data={'key': 'value'}`: Sends form data with the request.
- `response.text`: Shows the response content, which might include confirmation that the data was received.

### Sending JSON Data in `POST` Requests
You can also send JSON data in the body of a POST request by passing the `json` argument.

```python
import json

data = {'username': 'testuser', 'password': 'testpass'}
response = requests.post('https://httpbin.org/post', json=data)

print(f"JSON Sent: {json.dumps(data)}")
print(f"Response JSON: {response.json()}")
```
---
### Handling Timeouts
You can set a timeout for requests to prevent them from hanging indefinitely.

```python
try:
    response = requests.get('https://httpbin.org/delay/3', timeout=2)
except requests.Timeout:
    print("The request timed out")
```

#### Explanation:
- `timeout=2`: Specifies a 2-second timeout. If the server takes longer than 2 seconds to respond, a `Timeout` exception is raised.

### Custom Headers
Sometimes, you might need to modify the request headers, like adding a User-Agent or authorization token.

```python
headers = {'User-Agent': 'my-app/0.0.1'}
response = requests.get('https://httpbin.org/headers', headers=headers)

print(f"Request Headers: {response.request.headers}")
```


---
### File Uploads
You can upload files using `requests`.

```python
files = {'file': open('example.txt', 'rb')}
response = requests.post('https://httpbin.org/post', files=files)

print(f"Response Text: {response.text}")
```

#### Explanation:
- The file is opened in binary mode (`rb`) and passed as part of the `files` dictionary.
- The server will receive the file as if it was uploaded via an HTML form.

### Authentication
`requests` supports various types of authentication, including Basic Auth, Digest Auth, OAuth, etc.

```python
from requests.auth import HTTPBasicAuth

response = requests.get('https://api.github.com/user', auth=HTTPBasicAuth('username', 'password'))

print(f"Response Status: {response.status_code}")
```

#### Explanation:
- `auth=HTTPBasicAuth('username', 'password')`: Sends the username and password for basic authentication.


---
### Sessions
A session object allows you to persist certain parameters across requests (like cookies).

```python
session = requests.Session()
session.get('https://httpbin.org/cookies/set/sessioncookie/123456789')

response = session.get('https://httpbin.org/cookies')
print(response.text)
```

#### Explanation:
- `session.get()`: Sends a GET request using the session object.
- The session will maintain the cookies between different requests.

### Handling Redirects
By default, `requests` will follow redirects. You can disable this behavior using `allow_redirects=False`.

```python
response = requests.get('https://httpbin.org/redirect/1', allow_redirects=False)

print(f"Status Code: {response.status_code}")
print(f"Redirect Location: {response.headers['Location']}")
```

#### Explanation:
- If a redirect is detected, the status code (e.g., 302) and the new URL will be returned in the `Location` header.


---
### Handling SSL Verification
By default, `requests` verifies SSL certificates. You can disable this for testing purposes using `verify=False`.

```python
response = requests.get('https://self-signed.badssl.com/', verify=False)
print(response.text)
```

> Note: Disabling SSL verification can make your connection insecure, so avoid it in production.

### Example of Full Usage
Here's an example that includes multiple features: headers, parameters, JSON, and handling errors.

```python
url = 'https://api.github.com/repos/psf/requests'
params = {'state': 'open'}
headers = {'User-Agent': 'my-app'}

try:
    response = requests.get(url, params=params, headers=headers)
    response.raise_for_status()  # Raises an error for bad responses (4xx or 5xx)
    
    # Handle JSON response
    data = response.json()
    print(f"Repository Name: {data['name']}")
    print(f"Stars: {data['stargazers_count']}")
except requests.exceptions.HTTPError as http_err:
    print(f"HTTP error occurred: {http_err}")
except Exception as err:
    print(f"Other error occurred: {err}")
```

### Summary:
- `requests` makes working with HTTP in Python straightforward.
- It supports various methods like `GET`, `POST`, `PUT`, `DELETE`, along with sessions, authentication, timeouts, and error handling.
- `requests` is highly versatile and can handle everything from downloading files to interacting with complex APIs.