# **Backend API Test Automation with FastAPI and Requests**

GitHub Resource [https://github.com/upessocs/devops-test-automation](https://github.com/upessocs/devops-test-automation)


In this tutorial, we'll cover how to automate backend API testing using **FastAPI** for the server and **Requests** for testing. We'll follow a structured approach:

#### 1. **Setting Up the FastAPI Server**
#### 2. **Running the Server**
#### 3. **Writing Automated Tests using Requests**
#### 4. **Enhancing Tests with Pytest**
#### 5. **Expanding the Idea for Real-World Projects**

---

## **1. Setting Up the FastAPI Server**
We'll first create a simple API with three endpoints: **add, subtract, and multiply**.

### **Install FastAPI and Uvicorn**
If you haven't already, install FastAPI and Uvicorn:

```sh
pip install fastapi uvicorn
```


### `apiserver.py`

```python
from fastapi import FastAPI

# Initialize the FastAPI app
app = FastAPI()

# Root endpoint
@app.get("/")
def read_root():
    return {"Hello": "World"}

# Addition endpoint
@app.get("/add/{num1}/{num2}")
def add(num1: int, num2: int):
    """
    Adds two numbers.
    Example: /add/2/3 returns {"result": 5}
    """
    return {"result": num1 + num2}

# Subtraction endpoint
@app.get("/subtract/{num1}/{num2}")
def subtract(num1: int, num2: int):
    """
    Subtracts the second number from the first.
    Example: /subtract/5/3 returns {"result": 2}
    """
    return {"result": num1 - num2}

# Multiplication endpoint
@app.get("/multiply/{num1}/{num2}")
def multiply(num1: int, num2: int):
    """
    Multiplies two numbers.
    Example: /multiply/2/3 returns {"result": 6}
    """
    return {"result": num1 * num2}

# Run the app using Uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("apiserver:app", host="0.0.0.0", port=8000, reload=True)
```

---

### `testAutomation.py`

```python
import requests

# Define test cases for the API endpoints
testcases = [
    {
        "url": "http://localhost:8000/add/2/2",
        "expected": 4,
        "description": "Test addition of 2 and 2"
    },
    {
        "url": "http://localhost:8000/subtract/2/2",
        "expected": 0,
        "description": "Test subtraction of 2 from 2"
    },
    {
        "url": "http://localhost:8000/multiply/2/2",
        "expected": 4,
        "description": "Test multiplication of 2 and 2"
    }
]

def test():
    """
    Runs automated tests on the API endpoints.
    Asserts that the API response matches the expected result.
    """
    for case in testcases:
        # Make a GET request to the API endpoint
        response = requests.get(case["url"])
        
        # Parse the JSON response
        result = response.json()["result"]
        
        # Assert that the result matches the expected value
        assert result == case["expected"], f"Test failed: {case['description']}. Expected {case['expected']}, got {result}"
        
        # Print success message if the test passes
        print(f"Test passed: {case['description']}")
    
    print("All tests passed!")

# Run the test function
test()
```

---

### Key Improvements and Comments

#### 1. **Descriptive Comments**:
- Added comments to explain the purpose of each function and endpoint.
- Included example usage in the API endpoint docstrings.

#### 2. **Test Case Descriptions**:
- Added a `description` field to each test case for better readability and debugging.

#### 3. **Error Handling in Tests**:
- The `assert` statement now includes a descriptive error message to help identify which test case failed.

#### 4. **Scalability**:
- The test framework is modular, making it easy to add more test cases or endpoints.

---

### How to Expand for Testing Automation

#### 1. **Add More Test Cases**:
- Include edge cases (e.g., negative numbers, zero, large numbers).
- Test invalid inputs (e.g., non-integer values) if the API includes input validation.

#### 2. **Parameterized Testing**:
- Use a library like `pytest` to parameterize tests and avoid repetitive code.

#### 3. **Test Other HTTP Methods**:
- Add tests for `POST`, `PUT`, `DELETE`, etc., if the API supports them.

#### 4. **Environment Configuration**:
- Use environment variables or a configuration file to manage different environments (e.g., development, staging, production).

#### 5. **Integration with CI/CD**:
- Integrate the test script into a CI/CD pipeline (e.g., GitHub Actions, Jenkins) to automate testing on every code change.

#### 6. **Performance Testing**:
- Use tools like `locust` or `k6` to test the API's performance under load.

#### 7. **Mocking External Dependencies**:
- If the API depends on external services, use mocking libraries like `responses` or `unittest.mock` to simulate those services.

#### 8. **Reporting**:
- Generate test reports using libraries like `pytest-html` or `allure` for better visibility into test results.

---

### Example of Expanded Test Automation with `pytest`

```python
import pytest
import requests

# Define test cases as a list of tuples for parameterized testing
testcases = [
    ("http://localhost:8000/add/2/2", 4, "Test addition of 2 and 2"),
    ("http://localhost:8000/subtract/2/2", 0, "Test subtraction of 2 from 2"),
    ("http://localhost:8000/multiply/2/2", 4, "Test multiplication of 2 and 2"),
    ("http://localhost:8000/add/-1/1", 0, "Test addition of -1 and 1"),
    ("http://localhost:8000/multiply/0/5", 0, "Test multiplication by zero"),
]

@pytest.mark.parametrize("url, expected, description", testcases)
def test_api(url, expected, description):
    """
    Parameterized test for API endpoints.
    """
    response = requests.get(url)
    result = response.json()["result"]
    assert result == expected, f"{description}. Expected {expected}, got {result}"

# Run tests using pytest
if __name__ == "__main__":
    pytest.main()
```

---

### Summary

- Your current implementation is a solid foundation for API development and testing.
- By adding descriptive comments, improving test case management, and integrating with tools like `pytest`, you can create a robust and scalable testing framework.
- Expanding the framework to include performance testing, CI/CD integration, and reporting will make it even more powerful.




# Expanding the Idea for Real-World Projects**
Now that we have a basic API with automated tests, how can this be applied in real-world projects?

### **1 Add Database Integration**
Instead of simple arithmetic, imagine an API that fetches/stores data in a **PostgreSQL** or **MongoDB** database. Testing would involve:
- **Checking data integrity** after each API call.
- **Mocking database connections** for isolated testing.

### **2 Authentication and Authorization**
- Add **OAuth2, JWT, or API keys** for secure endpoints.
- Test unauthorized access to ensure security.

### **3 CI/CD Integration**
- Use **GitHub Actions / Jenkins** to automate testing on each code push.
- Example **GitHub Action for Pytest**:

```yaml
name: API Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: "3.10"

      - name: Install dependencies
        run: |
          sudo apt install python3 pipenv -y
          pipenv install fastapi uvicorn pytest requests

      - name: Start FastAPI server
        run: pipenv run python3 apiserver.py &
        env:
          PYTHONUNBUFFERED: 1

      - name: Wait for server to be ready
        run: sleep 5  # Wait to ensure the server is up

      - name: Run tests
        run: pipenv run pytest automation_test_pytest.py

```

### **4 Advanced Error Handling & Logging**
- Use Python's `logging` module to track API requests/responses.
- Store logs in **CloudWatch** or **Elastic Stack**.

### **5 Performance & Load Testing**
- Use **`pytest-benchmark`** or **`locust.io`** to simulate high-traffic conditions.

---

## **Final Thoughts**
In this tutorial, we:
Built a **FastAPI server** with three endpoints  
Wrote **automated tests** using `requests`  
Improved testing with **pytest**  
Discussed **expanding to real-world applications**  
