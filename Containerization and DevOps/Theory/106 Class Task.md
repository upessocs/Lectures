# Class Test: Containerize a Python Application (Containerization Focus)

## Objective

The goal of this hands-on is to evaluate your understanding of **containerization concepts**:

* Base images
* Dependency installation
* Image naming and tagging
* Container execution and testing

> **This does NOT test Python, NumPy, or pip knowledge.**

---

## Problem Statement

You are given a simple Python program that:

1. Takes a **SAP ID** as input
2. Compares it with a **stored SAP ID**
3. Prints:

   * `Matched` if both SAP IDs are same
   * `Not Matched` otherwise

You must **containerize this application** using Docker.

---

## Application Code (Provided)

Create a file named `app.py` with the following content:

```python
# Simple program to verify SAP ID
# This program is intentionally basic
# Focus of this task is containerization, not Python

import numpy as np  # dependency for learning purpose

stored_sapid = "REPLACE_WITH_YOUR_SAPID"
user_sapid = input("Enter your SAP ID: ")

if user_sapid == stored_sapid:
    print("Matched")
else:
    print("Not Matched")
```

---

## Containerization Requirements (Strict)

### 1. Base Image

* Use an **official Python image**
* Python version: **3.10 or above**

### 2. Dependencies

* The program uses:

  * `python`
  * `pip`
  * `numpy`

These **must be installed inside the container**, not on the host system.

---

### 3. Image Name and Tag

* Image name **must be**: `sapid-checker`
* Image tag **must be your SAP ID**

Example:

```bash
sapid-checker:500123456
```

---

### 4. Dockerfile Requirements

Your Dockerfile must:

* Set a working directory
* Copy the application file
* Install required dependencies
* Run the Python program when the container starts

---

## Hints (Read Carefully)

* Python images already include `pip`
* NumPy must be installed using `pip`
* Use `CMD` or `ENTRYPOINT` correctly
* The container should accept input from the terminal
* Use interactive mode while running the container

---

## Build Instructions (Expected)

```bash
docker build -t sapid-checker:<YOUR_SAPID> .
```

---

## Run & Test Instructions (Expected)

```bash
docker run -it sapid-checker:<YOUR_SAPID>
```

### Example Output

```text
Enter your SAP ID: 500123456
Matched
```

or

```text
Enter your SAP ID: 500999999
Not Matched
```

---

## Evaluation Criteria

| Criteria                         | Marks |
| -------------------------------- | ----- |
| Correct Dockerfile               | ✔     |
| Correct base image               | ✔     |
| NumPy installed inside container | ✔     |
| Correct image name & tag         | ✔     |
| Container runs successfully      | ✔     |

---

## What is NOT evaluated

* Python syntax depth
* NumPy usage complexity
* Input validation logic

---

## Bonus (Optional – Not Mandatory)

* Use `.dockerignore`
* Reduce image size
* Explain each Dockerfile instruction in comments

