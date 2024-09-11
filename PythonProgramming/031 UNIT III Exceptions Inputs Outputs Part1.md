### **1. Exceptions in Python**

#### **Errors vs. Exceptions**

- **Errors**: Errors are problems in a program due to syntax issues, invalid operations, or logical mistakes. Errors prevent the program from running.
  - **SyntaxError**: Occurs when the code structure is incorrect.
  - **IndentationError**: Occurs when there are issues with indentation.

- **Exceptions**: Exceptions occur during the execution of a program (runtime errors). These can be caught and handled to prevent the program from crashing.

#### **Runtime Errors**
Runtime errors occur while the program is running. Examples include:
  - **ZeroDivisionError**: Occurs when a number is divided by zero.
  - **FileNotFoundError**: Occurs when a file being read does not exist.

#### **The Exception Model**

Python uses an exception-handling model where exceptions are objects. If an error occurs in a block of code, the interpreter will raise an exception. If not caught, the program will terminate. If caught, the program can handle the exception and continue executing.

#### **Exception Hierarchy**

Python’s built-in exceptions are organized in a hierarchy. All exceptions inherit from the `BaseException` class.

- `BaseException`
  - `Exception`
    - `ArithmeticError`
      - `ZeroDivisionError`
    - `FileNotFoundError`
    - `ValueError`
    - `TypeError`
    - And many others…

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

#### **Using `raise`**

You can manually raise an exception using the `raise` keyword.

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

#### **Access Modes**

- `'r'` – Read mode (default).
- `'w'` – Write mode. Overwrites the file if it exists.
- `'a'` – Append mode.
- `'b'` – Binary mode.

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

#### **Additional File Methods**

- `readlines()`: Reads all lines from a file.
- `write()`: Writes a string to a file.
- `writelines()`: Writes a list of strings to a file.

#### **Using Pipes as Data Streams**

Pipes allow data to flow from one program to another. In Python, you can use the `subprocess` module to create and use pipes.

```python
import subprocess

# Use a pipe to capture the output of a shell command
proc = subprocess.Popen(["echo", "Hello, world!"], stdout=subprocess.PIPE)
output = proc.communicate()[0]
print(output.decode())  # Output: Hello, world!
```

#### **Handling IO Exceptions**

File operations can fail, so handling exceptions like `IOError` is important.

```python
try:
    file = open("non_existent_file.txt", "r")
except IOError:
    print("File not found or unable to read.")
```

#### **Working with Directories**

You can use the `os` module to work with directories.

```python
import os

# Create a directory
os.mkdir("new_directory")

# Change working directory
os.chdir("new_directory")

# List all files and directories
print(os.listdir("."))  # Output: []
```

#### **Metadata**

You can retrieve metadata (e.g., file size, creation time) using `os.stat()`.

```python
import os

stat_info = os.stat("example.txt")
print(f"Size of file: {stat_info.st_size} bytes")
```
---
The `pickle` module in Python is used for serializing and deserializing Python objects, which is often referred to as **pickling** and **unpickling**. Serialization is the process of converting a Python object into a byte stream, which can then be stored in a file or transferred over a network. Deserialization (unpickling) is the reverse process, where the byte stream is converted back into a Python object.

### Why Use `pickle`?
1. **Persistence**: You can save the state of an object to disk and retrieve it later, even after the program has closed.
2. **Data Transfer**: You can send a pickled object across a network to another Python program and unpickle it there.
3. **Caching**: You can cache Python objects in serialized form to avoid recalculating expensive data.

### When to Use `pickle`?
- **When you need to store Python objects** (dictionaries, lists, classes, etc.) in a file or send them over a network and later reconstruct them exactly as they were.
- **When working with Python-specific objects**: Pickle can handle complex objects like functions, classes, and instances, which JSON (another serialization format) can't do.

### Basic Concepts

1. **Pickling (Serialization)**: Converting a Python object to a byte stream.
2. **Unpickling (Deserialization)**: Reconstructing the object from the byte stream.

### Common Pickle Functions

- `pickle.dump(obj, file)`: Serializes `obj` to the open file `file`.
- `pickle.load(file)`: Deserializes an object from the open file `file`.
- `pickle.dumps(obj)`: Serializes `obj` to a bytes object.
- `pickle.loads(bytes)`: Deserializes an object from a bytes object.

### Example: Pickling and Unpickling

#### **Pickling (Serialization) Example**:

```python
import pickle

# A Python object (dictionary in this case)
data = {"name": "Alice", "age": 30, "occupation": "Engineer"}

# Open a file in binary write mode
with open("data.pickle", "wb") as file:
    # Pickle the Python object and save it to file
    pickle.dump(data, file)

print("Data has been serialized and saved to data.pickle")
```

#### **Unpickling (Deserialization) Example**:

```python
import pickle

# Open the file in binary read mode
with open("data.pickle", "rb") as file:
    # Unpickle the Python object from the file
    loaded_data = pickle.load(file)

print("Deserialized data:", loaded_data)
```

**Output**:
```
Data has been serialized and saved to data.pickle
Deserialized data: {'name': 'Alice', 'age': 30, 'occupation': 'Engineer'}
```

### How Pickle Works Internally
Pickle stores the object structure and data in a binary format using an internal protocol. It can handle complex data structures such as:
- Lists, dictionaries, tuples
- Nested objects (like lists of dictionaries)
- Classes and instances
- Functions (with some limitations)

For example, pickling a list of dictionaries:

```python
import pickle

data = [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]
with open("data_list.pickle", "wb") as file:
    pickle.dump(data, file)

# Now unpickle it
with open("data_list.pickle", "rb") as file:
    loaded_data = pickle.load(file)

print(loaded_data)
```

**Output**:
```
[{'id': 1, 'name': 'Alice'}, {'id': 2, 'name': 'Bob'}]
```

### Pickle Protocols
The `pickle` module supports different **protocols** that determine the efficiency and compatibility of the serialization process:
- **Protocol 0**: ASCII format (human-readable). Compatible with Python 2.x.
- **Protocol 1**: Old binary format (compatible with Python 2.x).
- **Protocol 2**: Introduced in Python 3.x for more efficient serialization.
- **Protocol 3**: Introduced in Python 3.0 (binary format).
- **Protocol 4**: Introduced in Python 3.4 (handles larger objects).
- **Protocol 5**: Introduced in Python 3.8 (used for out-of-band data, efficient with large objects).

You can specify the protocol when pickling an object:

```python
with open("data.pickle", "wb") as file:
    pickle.dump(data, file, protocol=pickle.HIGHEST_PROTOCOL)  # Uses the highest available protocol
```

### Important Considerations
1. **Security**: Never unpickle data received from an untrusted or unauthenticated source. Malicious data can execute arbitrary code when unpickled.
2. **Cross-language Limitations**: Pickle is Python-specific. Other languages can't read pickled files. For cross-language data serialization, formats like JSON or XML are preferred.
3. **Backwards Compatibility**: Objects pickled in newer protocols may not be readable by older Python versions. Always consider the Python version if you share pickled data across environments.

### The `shelve` Module (Similar to `pickle`)
The `shelve` module provides a more sophisticated way to store Python objects by offering dictionary-like access to objects stored in a file.

```python
import shelve

# Store data in a shelve
with shelve.open('mydata') as db:
    db['key'] = {'name': 'Alice', 'age': 30}

# Retrieve data from shelve
with shelve.open('mydata') as db:
    print(db['key'])  # Output: {'name': 'Alice', 'age': 30}
```

### Pickling Custom Python Classes

You can pickle instances of user-defined classes as well.

```python
import pickle

class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def __repr__(self):
        return f"Person(name={self.name}, age={self.age})"

# Serialize an instance of Person
person = Person("Alice", 30)
with open("person.pickle", "wb") as file:
    pickle.dump(person, file)

# Deserialize it
with open("person.pickle", "rb") as file:
    loaded_person = pickle.load(file)

print(loaded_person)
```

**Output**:
```
Person(name=Alice, age=30)
```

### Summary of `pickle` Module
- **Purpose**: Serialize and deserialize Python objects.
- **Common Uses**: Save objects to files or send them across networks.
- **Methods**:
  - `dump()`: Serialize an object to a file.
  - `load()`: Deserialize an object from a file.
  - `dumps()`: Serialize an object to bytes.
  - `loads()`: Deserialize an object from bytes.
- **Security Risk**: Only unpickle data from trusted sources.



---

### **Summary**

#### **Exceptions**:  
- Runtime errors are handled through exceptions using `try`, `except`, `raise`, and `assert`.
  
#### **Input/Output**:  
- Python provides rich support for file handling, streams, and directory operations through modules like `os` and `pickle` for working with serialized data.


