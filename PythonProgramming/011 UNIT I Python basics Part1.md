---
### 1. **Interactive Mode and Scripting Mode**
- **Interactive Mode:**
- This is when you type Python commands directly into the Python interpreter and see the results immediately. It's great for testing small pieces of code.
- You can start interactive mode by typing `python` or `python3` in your terminal or command prompt.
 **Example:**
```python
>>> 2 + 2
4
>>> print("Hello, World!")
Hello, World!
```
- **Scripting Mode:**
- In this mode, you write your Python code in a file (with a `.py` extension) and then run the file using the Python interpreter. This is used for writing larger programs.
 **Example:**
- Create a file named `script.py`:
```python
# script.py
print("Hello, World!")
```
- Run the script from the command line:
```bash
python script.py
```
---
### 2. **Dynamic Types**
- Python is dynamically typed, meaning that you don’t need to declare the type of a variable explicitly; the type is inferred based on the value assigned to it.
**Example:**
```python
x = 10        # x is an integer
x = "Hello"   # x is now a string
```
---
### 3. **Mutable and Immutable Data Types**
In Python, objects can be classified as either **mutable** or **immutable** depending on whether or not their state (i.e., their data or contents) can be changed after they are created.
### Immutable Objects
**Immutable** objects cannot be modified after they are created. If you want to change the value of an immutable object, you must create a new object.
**Examples of Immutable Objects:**
- **Integers:** `int`
- **Floating-point numbers:** `float`
- **Strings:** `str`
- **Tuples:** `tuple`
- **Frozen Sets:** `frozenset`
- **Bytes:** `bytes`
**Example with an Immutable Object:**
```python
x = 10
print(id(x))  # Output: Address of x
x = x + 1
print(id(x))  # Output: New address, since x is now a new object
y = "Hello"
print(id(y))  # Output: Address of y
y = y + " World"
print(id(y))  # Output: New address, since y is now a new object
```
In this example, when you modify `x` and `y`, new objects are created with different memory addresses.
### Mutable Objects
**Mutable** objects can be modified after they are created. Changes to these objects are done in place, meaning the object's identity (memory address) remains the same even though its contents change.
**Examples of Mutable Objects:**
- **Lists:** `list`
- **Dictionaries:** `dict`
- **Sets:** `set`
- **Byte Arrays:** `bytearray`
**Example with a Mutable Object:**
```python
z = [1, 2, 3]
print(id(z))  # Output: Address of z
z.append(4)
print(id(z))  # Output: Same address, even though the contents have changed
```
In this example, the list `z` remains at the same memory address even after its contents are modified.
### Why the Difference Matters
Understanding mutability is important for several reasons:
- **Performance:** Immutable objects are often used for fixed data since they can be optimized by the Python interpreter.
- **Safety:** Immutable objects are thread-safe, meaning they can be shared between threads without the risk of unexpected changes.
- **Behavioral Expectations:** Knowing whether an object is mutable or immutable helps you predict how it will behave when passed to functions or modified.
### Practical Implications
- When you pass an immutable object to a function, you can be sure it won't be changed by that function.
- When working with mutable objects, be aware that changes to the object within a function or elsewhere in the code will affect the original object.
Understanding mutability helps you write more predictable and efficient Python code.   

---
### 4. **Basic Syntax**
- Python has a simple and readable syntax. Code blocks are defined by indentation rather than braces or keywords.
**Example:**
```python
if 5 > 2:
 print("Five is greater than two!")  # Indentation is crucial in Python
```
### 5. **Comments**
- Comments are non-executable parts of the code meant for documentation or explanation. They are ignored by the interpreter.
**Example:**
```python
# This is a single-line comment
print("Hello, World!")  # This is an inline comment
"""
This is a
multi-line comment
or docstring
"""
```
### 6. **String Values**
- Strings are sequences of characters enclosed in single (`'`) or double (`"`) quotes.
**Example:**
```python
my_string = "Hello, World!"
```
### 7. **String Methods**
- Python provides many built-in methods for string manipulation.
**Examples:**
```python
my_string = "hello, world!"
print(my_string.upper())  # Output: HELLO, WORLD!
print(my_string.capitalize())  # Output: Hello, world!
print(my_string.replace("world", "Python"))  # Output: hello, Python!
```
### 8. **String Operators**
- Operators allow you to perform operations on strings.
**Examples:**
```python
# Concatenation
str1 = "Hello"
str2 = "World"
result = str1 + " " + str2  # Output: "Hello World"
# Repetition
result = str1 * 3  # Output: "HelloHelloHello"
# Membership
print("H" in str1)  # Output: True
print("Z" not in str1)  # Output: True
```
Python provides several operators that can be used to manipulate strings. Here’s a rundown of the most common string operators:
### 1. **Concatenation Operator (`+`)**
- Combines two strings together.
```python
str1 = "Hello"
str2 = "World"
result = str1 + " " + str2
print(result)  # Output: Hello World
```
### 2. **Repetition Operator (`*`)**
- Repeats the string a specified number of times.
```python
str1 = "Hi"
result = str1 * 3
print(result)  # Output: HiHiHi
```
### 3. **Membership Operators (`in` and `not in`)**
- Checks if a substring is present in a string.
```python
str1 = "Hello World"
print("World" in str1)     # Output: True
print("world" not in str1) # Output: True (case-sensitive)
```
### 4. **Slice Operator (`[]`)**
- Accesses a part of the string using indices.
```python
str1 = "Python"
print(str1[0])    # Output: P (first character)
print(str1[-1])   # Output: n (last character)
print(str1[0:3])  # Output: Pyt (slice from index 0 to 2)
```
### 5. **String Comparison Operators (`==`, `!=`, `<`, `>`, `<=`, `>=`)**
- Compares two strings lexicographically (based on their ASCII values).
```python
str1 = "apple"
str2 = "banana"
print(str1 == str2)  # Output: False
print(str1 < str2)   # Output: True (because "a" < "b")
```
### 6. **Escape Character (`\`)**
- Used to insert characters that are illegal in a string (like newline or tab).
```python
str1 = "He said, \"Hello!\""
print(str1)  # Output: He said, "Hello!"
str2 = "Line1\nLine2"
print(str2)  # Output: 
 # Line1
 # Line2
```
### 7. **Raw Strings (`r''` or `r""`)**
- Ignores escape sequences.
```python
str1 = r"C:\Users\name\docs"
print(str1)  # Output: C:\Users\name\docs
```
### 8. **String Formatting (`%`, `str.format()`, f-strings)**
- Format strings using placeholders.
```python
# Old-style formatting
name = "Alice"
age = 30
print("My name is %s and I am %d years old." % (name, age))  # Output: My name is Alice and I am 30 years old.
# Using format()
print("My name is {} and I am {} years old.".format(name, age))  # Output: My name is Alice and I am 30 years old.
# Using f-strings (Python 3.6+)
print(f"My name is {name} and I am {age} years old.")  # Output: My name is Alice and I am 30 years old.
```
### 9. **Length Operator (`len()`)**
- Returns the length of the string.
```python
str1 = "Hello"
print(len(str1))  # Output: 5
```
### 10. **String Methods**
- Python provides many built-in string methods like `.upper()`, `.lower()`, `.strip()`, `.replace()`, `.find()`, and more, which act like operators on strings.
```python
str1 = "hello"
print(str1.upper())  # Output: HELLO
```
---
### 9. **Format Method**
- The `format()` method is used to format strings by embedding values within them.
**Example:**
```python
name = "Alice"
age = 30
message = "My name is {} and I am {} years old.".format(name, age)
print(message)  # Output: My name is Alice and I am 30 years old.
```
---
### 10. **Numeric Data Types**
- Python supports several numeric data types, including integers (`int`), floating-point numbers (`float`), and complex numbers (`complex`).
**Examples:**
```python
x = 10       # Integer
y = 3.14     # Float
z = 1 + 2j   # Complex number
```
Python provides several numeric data types to represent different kinds of numbers. Here's an overview of the primary numeric data types in Python:
### 1. **Integer (`int`)**
- Represents whole numbers (positive, negative, or zero) without any decimal point.
- In Python 3, the `int` type has unlimited precision, meaning it can handle arbitrarily large integers.
**Example:**
```python
a = 10
b = -25
c = 12345678901234567890  # Large integer
```
### 2. **Floating-Point Number (`float`)**
- Represents real numbers that have a decimal point.
- Internally, they are implemented using double precision (64-bit) which provides approximately 15-17 digits of precision.
**Example:**
```python
d = 3.14159
e = -2.71828
f = 1.0
```
### 3. **Complex Number (`complex`)**
- Represents complex numbers in the form of `a + bj`, where `a` is the real part and `b` is the imaginary part.
- The imaginary part is denoted by a `j` suffix.
**Example:**
```python
g = 3 + 4j
h = -5j
i = 2.5 + 0j
```
### 4. **Boolean (`bool`)**
- Represents Boolean values, which are technically a subclass of `int`.
- Only two possible values: `True` (equivalent to `1`) and `False` (equivalent to `0`).
**Example:**
```python
j = True
k = False
```
### Type Conversion
You can convert between these numeric types using built-in functions:
- **Convert to Integer:** `int()`
- **Convert to Float:** `float()`
- **Convert to Complex:** `complex()`
- **Convert to Boolean:** `bool()`
**Example:**
```python
l = int(3.7)        # Converts to 3
m = float(5)        # Converts to 5.0
n = complex(2)      # Converts to (2+0j)
o = bool(0)         # Converts to False
p = bool(42)        # Converts to True
```
### Operations on Numeric Types
- **Arithmetic Operations:** Addition (`+`), Subtraction (`-`), Multiplication (`*`), Division (`/`), Floor Division (`//`), Modulus (`%`), and Exponentiation (`**`).
```python
# Examples of operations
result1 = 10 + 5        # Addition
result2 = 10 - 5        # Subtraction
result3 = 10 * 5        # Multiplication
result4 = 10 / 5        # Division
result5 = 10 // 3       # Floor Division
result6 = 10 % 3        # Modulus
result7 = 2 ** 3        # Exponentiation
```
- **Comparisons:** Equality (`==`), Inequality (`!=`), Greater than (`>`), Less than (`<`), Greater than or equal to (`>=`), Less than or equal to (`<=`).
```python
# Example of comparisons
is_equal = (10 == 10)  # True
is_greater = (10 > 5)  # True
```
- **Complex Numbers:** Python supports arithmetic operations with complex numbers, where the operations apply to both the real and imaginary parts.
```python
complex1 = 2 + 3j
complex2 = 1 + 4j
result = complex1 + complex2  # Output: (3+7j)
```
### Numeric Functions
Python provides several built-in functions to work with numeric data:
- `abs(x)`: Returns the absolute value of `x`.
- `round(x, n)`: Rounds `x` to `n` decimal places.
- `pow(x, y)`: Returns `x` raised to the power `y`.
- `max(x, y, ...)`: Returns the largest of the input values.
- `min(x, y, ...)`: Returns the smallest of the input values.
- `sum(iterable)`: Returns the sum of all elements in the iterable.

---
### 11. **Input and Output Functions**
- **Input:** The `input()` function reads a string from the user.
- **Output:** The `print()` function displays output to the console.
**Examples:**
```python
name = input("Enter your name: ")  # User inputs "Alice"
print("Hello, " + name + "!")  # Output: Hello, Alice!
```



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