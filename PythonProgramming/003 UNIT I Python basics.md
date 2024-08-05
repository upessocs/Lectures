---
### 1. **Executing Python from the Command Line & IDLE**
- **Command Line:** You can execute Python scripts from the command line (e.g., terminal or command prompt) by typing `python script_name.py`. If Python is added to your system’s PATH, this command will run the script.
- **IDLE:** IDLE (Integrated Development and Learning Environment) is Python's built-in IDE. You can run Python code interactively or by opening a file and running it. To open IDLE, type `idle` in your terminal or find it in your programs menu. It's useful for quickly testing small pieces of code.
---
### 2. **Editing Python Files, Documentation, and Getting Help**
- **Editing Python Files:** Python files have the `.py` extension and can be edited using any text editor or IDE like VSCode, PyCharm, or even IDLE. Save your code in a `.py` file and run it using Python.
- **Documentation:** Python has extensive documentation available at [docs.python.org](https://docs.python.org). It covers everything from basic syntax to advanced libraries.
- **Getting Help:** Python has a built-in `help()` function. You can use it to get information on modules, functions, and more. For example, `help(str)` will provide details on the string type.
---
### 3. **Python Reserved Words & Naming Conventions**
- **Reserved Words:** Python has a set of reserved words (also called keywords) that have special meaning and cannot be used as identifiers (variable names). Some examples include `if`, `else`, `while`, `for`, `import`, `def`, etc.
- **Naming Conventions:** Python follows PEP 8 guidelines. Variable names should be lowercase with words separated by underscores (e.g., `my_variable`). Constants are usually all uppercase (e.g., `PI`). Class names follow the CapWords convention (e.g., `MyClass`).
---
### 4. **Basic Python Syntax - Introduction**
- **Indentation:** Python uses indentation to define code blocks, such as in loops, conditionals, and function definitions. Incorrect indentation will lead to syntax errors.
- **Comments:** Single-line comments start with `#`, while multi-line comments can be written using triple quotes (`''' comment '''` or `""" comment """`).
- **Variables:** You don't need to declare variables with a type. Just assign a value, like `x = 5`.
---
### 5. **String Values, Methods, and Operators**
- **String Values:** Strings are sequences of characters enclosed in single quotes (`'...'`) or double quotes (`"..."`). They are immutable, meaning you can't change them once they're created.
- **Methods:** Strings come with built-in methods like `str.upper()`, `str.lower()`, `str.replace('old', 'new')`, and `str.split('delimiter')`.
- **Operators:** Common string operators include `+` for concatenation, `*` for repetition, and `in` for membership testing (e.g., `'a' in 'apple'`).
---
### 6. **Numeric Data Types, Conversion Functions, and Simple I/O**
#####  **Numeric Data Types:** Python has several numeric types, including:
- `int` for integers (e.g., `42`)
- `float` for floating-point numbers (e.g., `3.14`)
- `complex` for complex numbers (e.g., `3+4j`)
- **Conversion Functions:** Convert between types using functions like `int()`, `float()`, and `str()`. For example, `int('42')` converts the string `'42'` to an integer.
#####  **Simple I/O:**
- Use `input()` to read user input (always returns a string).
- Use `print()` to display output on the screen.
---
### 7. **`id` Data Type and Basics of Python**
- **`id` Function:** In Python, the `id()` function returns the unique identifier for an object. It's a numeric value that remains constant during the object's lifetime. For example, `id(x)` returns the memory address of the variable `x`.
##### **Basics of Python:**
- Python is an interpreted, high-level language known for its readability  - It supports multiple programming paradigms, including procedural, object-oriented, and functional programming.
- Python's simplicity and readability make it an excellent language for beginners and experienced developers alike.


---   
# The size, type, memory location, and `id` of a variable using the following built-in functions:

### 1. **Finding the Size of a Variable**
You can use the `sys.getsizeof()` function to find the size (in bytes) of a variable.

```python
import sys

x = 42
size = sys.getsizeof(x)
print(f"Size of x: {size} bytes")
```

### 2. **Finding the Type of a Variable**
You can use the `type()` function to find out the data type of a variable.

```python
x = 42
variable_type = type(x)
print(f"Type of x: {variable_type}")
```

### 3. **Finding the Memory Location**
The `id()` function gives the memory address where the object is stored. This address is a unique identifier for the object during its lifetime.

```python
x = 42
memory_location = id(x)
print(f"Memory location of x: {memory_location}")
```

### 4. **Finding All Information Together**

Here’s a combined example:

```python
import sys

x = 42
size = sys.getsizeof(x)
variable_type = type(x)
memory_location = id(x)

print(f"Size of x: {size} bytes")
print(f"Type of x: {variable_type}")
print(f"Memory location (id) of x: {memory_location}")
```

### Output Example:
```
Size of x: 28 bytes
Type of x: <class 'int'>
Memory location (id) of x: 9794400
```

- **`sys.getsizeof()`**: Returns the size of the object in memory.
- **`type()`**: Returns the type of the object.
- **`id()`**: Returns the memory location (unique identifier) of the object. 

> These functions are very useful for debugging and understanding how Python manages objects in memory.