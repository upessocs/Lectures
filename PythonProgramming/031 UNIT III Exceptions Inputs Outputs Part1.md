### **1. Exceptions in Python**

#### **Errors vs. Exceptions**

- **Errors**: Errors are problems in a program due to syntax issues, invalid operations, or logical mistakes. Errors prevent the program from running.
1. **SyntaxError**: Occurs when the code structure is incorrect.
1. **IndentationError**: Occurs when there are issues with indentation.

- **Exceptions**: Exceptions occur during the execution of a program (runtime errors). These can be caught and handled to prevent the program from crashing.

#### **Runtime Errors**
Runtime errors occur while the program is running. Examples include:
1. **ZeroDivisionError**: Occurs when a number is divided by zero.
1. **FileNotFoundError**: Occurs when a file being read does not exist.

#### **The Exception Model**

Python uses an exception-handling model where exceptions are objects. If an error occurs in a block of code, the interpreter will raise an exception. If not caught, the program will terminate. If caught, the program can handle the exception and continue executing.

#### **Exception Hierarchy**

Python’s built-in exceptions are organized in a hierarchy. All exceptions inherit from the `BaseException` class.

1. 1 `BaseException`
1. 1.1 `Exception`
1. 1.1.1 `ArithmeticError`
1. 1.1.1.1 `ZeroDivisionError`
1. 1.1.2 `FileNotFoundError`
1. 1.1.3 `ValueError`
1. 1.1.4 `TypeError`
1. And many others…

### **Handling Exceptions in Python**

Python provides a `try-except` block to catch and handle exceptions.

#### **Handling Multiple Exceptions**

You can handle multiple exceptions by specifying different types in multiple `except` clauses:

```python
try:
    a = 5 / 0  # ZeroDivisionError
    b = int("Hello")  # ValueError
except ZeroDivisionError:
    print("Cannot divide by zero!")
except ValueError:
    print("Invalid literal for int()!")
```

---
#### **Using `raise`**

In Python, `raise` is used to explicitly trigger an exception. When you use `raise`, you're instructing Python to stop normal execution and throw an error. Let's break down your example step by step:

### Example Code:
```python
def check_age(age):
    if age < 18:
        raise ValueError("Age must be at least 18!")
    return "Age is valid."

try:
    check_age(16)
except ValueError as e:
    print(e)
```

### Explanation:

1. **`raise` Keyword**:
- `raise` is used to throw an exception. In your case, you're raising a `ValueError` when a certain condition (`age < 18`) is met.
- This interrupts the normal flow of the program and transfers control to the nearest `except` block that can handle the exception.

2. **`ValueError`**:
- This is a built-in Python exception that is typically used to signal that a function has received an argument with an inappropriate value. Here, you're using it to indicate that the age provided is less than the required minimum (18).
- The string `"Age must be at least 18!"` is passed to the `ValueError`, and this message will be displayed when the error is caught.

3. **`check_age(16)`**:
- This function call passes `16` as the age argument. Since `16 < 18`, the condition in the `if` statement is true, and the `raise ValueError("Age must be at least 18!")` is executed.

4. **`try`-`except` Block**:
- The `try` block is used to execute code that may raise an exception.
- When the `raise` statement in the `check_age` function triggers the `ValueError`, it jumps to the `except` block, where the exception is caught and handled.
- The `except ValueError as e:` catches the `ValueError` and binds the error message (`"Age must be at least 18!"`) to the variable `e`.
- `print(e)` prints the error message `"Age must be at least 18!"`.

### Output:
```
Age must be at least 18!
```

### Summary:
- The `raise` keyword is used to throw an exception when a condition is met.
- In this case, when the age is less than 18, a `ValueError` is raised with a custom message.
- The `try-except` block catches the exception and handles it gracefully by printing the error message.

---

#### **Using `assert`**

Assertions are used to enforce conditions that must be true.

```python
x = 10
assert x > 5, "x should be greater than 5!"
assert x > 15, "x should be greater than 15!"  # This will raise AssertionError
```
---
### **2. Input and Output in Python**

#### **Introduction**

Input/Output (I/O) refers to the process of reading from or writing to external sources, like files or user input/output. Python provides built-in functions to handle I/O such as `print()`, `input()`, `open()`, etc.

#### **Data Streams**

- **Input stream**: Used to read data.
- **Output stream**: Used to write data.

#### **Creating Your Own Data Streams**

You can create streams using Python's `open()` function for file I/O operations. Streams can have different modes for reading and writing.


---



## Handling files (opening, reading, writing) can be done using built-in functions. 

### 1. **Opening a File**:
- The `open()` function is used to open a file.
- It has two main arguments: the file path and the mode in which to open the file.
  
#### Modes include:

- `'r'`: Read (default mode). Opens the file for reading.
- `'w'`: Write. Opens the file for writing (if the file exists, it will be overwritten; if it doesn’t, a new file will be created).
- `'a'`: Append. Opens the file for appending (adds to the end of the file if it exists).
- `'r+'`: Read and write.
- `'b'`: Binary mode (used for binary files like images or audio).

### 2. **Reading from a File**:
   You can use:
- `read()`: Reads the entire file.
- `readline()`: Reads a single line at a time.
- `readlines()`: Reads all lines and returns them as a list.

### 3. **Writing to a File**:
   To write to a file, you can use:
- `write()`: Writes a string to the file.
- `writelines()`: Writes a list of strings to the file.


---

#### **Writing Data to a File**

Example: Writing to a file using `'w'` mode.

```python
file = open("example.txt", "w")
file.write("Hello, this is a test.")
file.close()
```

#### **Reading Data from a File**

Example: Reading from a file using `'r'` mode.

```python
file = open("example.txt", "r")
content = file.read()
print(content)  # Output: Hello, this is a test.
file.close()
```





---
## `with` for file handling        
File handling can be done both **with** and **without** the `with` statement. Here’s a comparison between the two approaches:

### 1. **Without `with` Statement**:
When you open a file without using `with`, you need to manually close the file using `file.close()`.

#### Example: Reading and Writing Without `with`

```python
# Opening a file for reading (without 'with')
file = open('example.txt', 'r')
content = file.read()  # Reading the entire file content
print(content)  # Displaying the content
file.close()  # Closing the file manually

# Opening a file for writing (without 'with')
file = open('example.txt', 'w')
file.write('Hello, World!')  # Writing to the file
file.close()  # Manually closing the file
```

#### Explanation:
- **Reading**: The file is opened using `open('example.txt', 'r')`. After reading the content with `file.read()`, the file must be explicitly closed using `file.close()`.
- **Writing**: Similarly, the file is opened in write mode using `open('example.txt', 'w')`. After writing, the file must be manually closed.

### Risks of Not Using `with`:
- If an exception occurs before `file.close()`, the file may remain open, leading to resource leaks (e.g., the file staying locked, running out of file handles).
  
### 2. **With `with` Statement**:
Using the `with` statement ensures that the file is automatically closed when the block of code finishes, even if exceptions are raised.

#### Example: Reading and Writing Using `with`

```python
# Opening a file for reading (with 'with')
with open('example.txt', 'r') as file:
    content = file.read()  # Reading the content
    print(content)  # Displaying the content
# The file is automatically closed after the block

# Opening a file for writing (with 'with')
with open('example.txt', 'w') as file:
    file.write('Hello, World!')  # Writing to the file
# The file is automatically closed after the block
```

#### Explanation:
- **Reading**: The file is opened using `with open('example.txt', 'r')`. The file is automatically closed when the `with` block ends, regardless of whether an exception occurs or not.
- **Writing**: Similarly, in write mode, the file is closed automatically at the end of the `with` block.

### Key Differences:
- **Manual Handling (`without with`)**: 
1. You have to explicitly call `file.close()`.
1. More error-prone since the file might remain open if not closed properly.
  
- **Automatic Handling (`with with`)**: 
1. Python automatically takes care of closing the file when you're done.
1. More concise and safe, as the file is guaranteed to be closed properly, even in cases of errors or exceptions.

### Best Practice:
It is generally recommended to use the `with` statement when working with files in Python because it’s safer and requires less code.



