# Question Bank I for Python 

### Basics of Python:
1. **What is the difference between scripting mode and interactive mode in Python?**
- **Answer**: In scripting mode, you write the code in a file and execute it, while in interactive mode, you type code in a Python shell (REPL) and execute it line by line.
- **Explanation**: Scripting is used for writing complete programs, whereas interactive mode is good for testing small code snippets.

2. **How do you install and use `pip`?**
- **Answer**: Use `pip install <package>` to install packages. Example: `pip install requests` installs the requests module.
- **Explanation**: Pip is Python's package manager that allows easy installation of third-party packages.

3. **What is JupyterLab, and how is it different from the Python shell?**
- **Answer**: JupyterLab is an interactive environment supporting notebooks, code execution, and rich output (e.g., plots). Unlike the shell, JupyterLab allows for markdown notes and inline visualizations.

### Data Types and Their Methods:
4. **What is the difference between `list`, `tuple`, and `set`?**
- **Answer**: Lists are mutable, tuples are immutable, and sets are unordered collections of unique elements.
- **Explanation**: Understanding the mutability and use cases of these data structures is key in Python.

5. **Write a Python function to reverse a string.**
- **Answer**: 
```python
def reverse_string(s):
 return s[::-1]
```
- **Explanation**: The slice operation `[:: -1]` is a common way to reverse a string.

6. **How does the `type()` function work in Python? Give an example.**
- **Answer**: `type()` returns the data type of an object. Example: `type(5)` returns `<class 'int'>`.

### File Handling:
7. **Write Python code to read a file and count the number of lines.**
- **Answer**:
```python
with open('file.txt', 'r') as file:
 lines = file.readlines()
 print(len(lines))
```
- **Explanation**: The `with` statement is used to manage file contexts, and `readlines()` reads all lines into a list.

8. **What does the `write()` method do in file handling?**
- **Answer**: `write()` writes a string to a file. It does not add a newline unless explicitly specified.
- **Explanation**: It is important to understand how to control file writing.

### Modules:
9. **Explain how to use the `os` module to list all files in a directory.**
- **Answer**:
```python
import os
files = os.listdir()
print(files)
```
- **Explanation**: The `os` module is used for interacting with the operating system, and `listdir()` lists the contents of a directory.

10. **Write code using the `requests` module to fetch data from a URL.**
- **Answer**:
```python
import requests
response = requests.get('https://example.com')
print(response.text)
```
- **Explanation**: `requests` simplifies working with HTTP requests.

11. **How would you use the `tkinter` module to create a simple GUI window?**
- **Answer**:
```python
import tkinter as tk
root = tk.Tk()
root.title("Hello World")
root.mainloop()
```
- **Explanation**: Tkinter is Python's standard library for GUI development.

### Debugging and Errors:
12. **What is an `assert` statement in Python?**
- **Answer**: The `assert` statement is used for debugging; it tests if a condition is true, and raises an `AssertionError` if it is false.

13. **Explain the try-except block in Python with an example.**
- **Answer**:
```python
try:
  x = 1 / 0
except ZeroDivisionError:
  print("You can't divide by zero!")
```
- **Explanation**: The `try-except` block is used to handle exceptions and prevent the program from crashing.

### Functions:
14. **What are the different types of function arguments in Python?**
- **Answer**: Positional, keyword, default, *args (variable-length), and **kwargs (keyword-variable-length).
- **Explanation**: Understanding argument types allows for more flexible function definitions.

15. **Write a function that accepts *args and **kwargs and prints them.**
- **Answer**:
```python
def print_args_kwargs(*args, **kwargs):
  print(args)
  print(kwargs)
```
- **Explanation**: `*args` handles variable numbers of positional arguments, while `**kwargs` handles variable keyword arguments.

16. **Explain the significance of `__name__ == "__main__"` in Python.**
- **Answer**: It ensures that code is only run when the script is executed directly, not when imported as a module.
- **Explanation**: This is crucial for modularity in Python.

17. **How can a function be passed as an object in Python?**
- **Answer**:
```python
def greet():
  print("Hello!")
  
def call_function(f):
  f()
  
call_function(greet)
```
- **Explanation**: Functions are first-class objects and can be passed as arguments to other functions.

### Pickle Module:
18. **What is the `pickle` module used for?**
- **Answer**: The `pickle` module is used for serializing and deserializing Python objects into a byte stream.
- **Explanation**: It is used when you need to save the state of an object to a file.

19. **Write code to pickle and unpickle a Python object.**
- **Answer**:
```python
import pickle
data = {'name': 'Alice', 'age': 30}

with open('data.pkl', 'wb') as file:
  pickle.dump(data, file)
  
with open('data.pkl', 'rb') as file:
  loaded_data = pickle.load(file)
  print(loaded_data)
```
- **Explanation**: Pickling helps with saving data and reloading it later, ensuring data persistence.

### Miscellaneous:
20. **What is the difference between a shallow copy and a deep copy in Python?**
- **Answer**: A shallow copy creates a new object but doesn't recursively copy objects inside it, whereas a deep copy creates copies of all nested objects.
- **Explanation**: The `copy` module has `copy()` for shallow and `deepcopy()` for deep copies.




---

### 22. Write a Python function to calculate the factorial of a number.

```python
def factorial(n):
    """
    Calculate the factorial of a given number.
    
    Args:
        n (int): A non-negative integer.

    Returns:
        int: The factorial of the number.
    """
    assert n >= 0, "Number must be non-negative"
    
    if n == 0:
        return 1
    else:
        return n * factorial(n - 1)

# Example usage:
print(factorial(5))  # Output: 120
```
- **Explanation**: The `factorial` function uses recursion to compute the factorial of a number. It includes an assert statement to ensure the input is a non-negative integer.

---

### 23. What is the difference between `is` and `==`?

```python
a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(a == b)  # Output: True (compares values)
print(a is b)  # Output: False (compares identities)
print(a is c)  # Output: True (c is the same object as a)
```
- **Explanation**: `==` compares the values of two objects, while `is` checks if two objects are the same in memory (i.e., have the same identity).

---

### 24. Explain the `dir()` function.

```python
# Example usage of dir() function
print(dir(list))  # Output: List of methods available for the list object
```
- **Explanation**: The `dir()` function returns a list of attributes and methods associated with an object. It’s often used for introspection.



### 25. How do you use list comprehension?

```python
# List comprehension example to generate squares of numbers
squares = [x**2 for x in range(5)]
print(squares)  # Output: [0, 1, 4, 9, 16]
```
- **Explanation**: List comprehension is a concise way to create lists by iterating over an iterable and applying an expression.




### 27. What is the difference between `import` and `from` in Python?

```python
import math
from math import sqrt

print(math.sqrt(16))  # Output: 4.0
print(sqrt(16))       # Output: 4.0
```
- **Explanation**: `import` imports the entire module, while `from` imports specific components (e.g., functions or variables) from a module.



### 28. How can you execute a shell command from within Python?

```python
import os

# Execute a shell command
os.system("ls")
```
- **Explanation**: The `os.system()` function allows you to execute shell commands from within Python code.




### 31. How can you handle multiple exceptions in one `try-except` block?

```python
try:
    x = int(input("Enter a number: "))
    print(10 / x)
except (ValueError, ZeroDivisionError) as e:
    print(f"Error occurred: {e}")
```
- **Explanation**: Multiple exceptions can be handled by grouping them in a tuple within a `try-except` block.



### 32. How do you test if a variable is of a certain type?

```python
x = 10
assert isinstance(x, int), "x is not an integer"
```
- **Explanation**: The `isinstance()` function checks if a variable is of a particular type. The `assert` statement helps verify this condition.



### 33. Explain the difference between `len()` and `count()` for Python lists.

```python
my_list = [1, 2, 3, 2]
print(len(my_list))   # Output: 4 (total number of elements)
print(my_list.count(2))  # Output: 2 (number of occurrences of 2)
```
- **Explanation**: `len()` returns the total number of elements in a list, while `count()` returns the number of occurrences of a specific element.




---


1. **What is the difference between the following imports?**

```python
import math
from math import sqrt
import math as m
```

- **Answer**:
 - `import math`: Imports the entire `math` module. You access functions like `math.sqrt()`.
 - `from math import sqrt`: Imports only the `sqrt` function from `math`. You can use `sqrt()` directly.
 - `import math as m`: Imports the `math` module and renames it to `m`. You access functions like `m.sqrt()`.

- **Explanation**: These different import methods affect how functions or modules are accessed in your code.



2. **Find the error in the following code and correct it:**

```python
from os import listdir as ls
print(os.listdir())
```

- **Error**: The `os` module itself was not imported, only the `listdir` function was imported and renamed to `ls`.

- **Corrected Code**:
```python
from os import listdir as ls
print(ls())
```

- **Explanation**: The error occurred because the code tries to use `os.listdir()` while only `listdir` (renamed as `ls`) was imported. You either need to import the whole `os` module or use `ls()` after renaming.



3. **Find the error in the following code and explain it:**

```python
from math import *
print(sqrt(16))
print(math.pi)
```

- **Error**: The wildcard import (`*`) imports all functions from `math` directly into the namespace. You cannot access them using `math.<function>`.

- **Corrected Code**:
```python
from math import *
print(sqrt(16))
print(pi)
```

- **Explanation**: When you use `from module import *`, functions and constants are directly available without the need for module prefixes. In this case, `math.pi` is incorrect; it should be `pi`.



4. **What will happen if you write the following code? Identify and fix the error:**

```python
from math import pi, e as exponential
print(pi)
print(e)
```

- **Error**: The variable `e` was renamed to `exponential`, so `e` is not recognized.

- **Corrected Code**:
```python
from math import pi, e as exponential
print(pi)
print(exponential)
```

- **Explanation**: The error happens because `e` was imported as `exponential`. After renaming a variable with `as`, you must refer to it by its new name.



5. **Find the error in the following code related to imports and fix it:**

```python
import os as operating_system
print(os.getcwd())
```

- **Error**: The `os` module was renamed to `operating_system`, so `os.getcwd()` will raise an error because `os` is not defined.

- **Corrected Code**:
```python
import os as operating_system
print(operating_system.getcwd())
```

- **Explanation**: Since `os` was imported as `operating_system`, you must refer to it by that name in the code.



### Code with Errors (More Focused on Syntax and Logic):

6. **Find and fix the error in this code that uses the `in` keyword:**

```python
numbers = [1, 2, 3, 4]
if 5 in numbers:
   print("Found!")
else:
   print("Not Found!")
```

- **No Error**: This code works as expected. It checks if `5` is in the list `numbers`. Since `5` is not in the list, the output will be "Not Found!".

- **Explanation**: The `in` keyword is used to check for membership in a list, tuple, set, or other iterables.



7. **Find the error in the following code and fix it:**

```python
my_list = [1, 2, 3, 4, 5]
if 3 in my_list == True:
   print("3 is in the list!")
```

- **Error**: The condition `3 in my_list == True` is not valid. It compares `my_list == True`, not checking membership correctly.

- **Corrected Code**:
```python
my_list = [1, 2, 3, 4, 5]
if 3 in my_list:
 print("3 is in the list!")
```

- **Explanation**: The `in` operator checks if an element is in the list directly. The incorrect syntax used `==` which compared the entire list to `True`.



8. **Identify and fix the error in this function import:**

```python
from random import randint as random_integer
print(randint(1, 10))
```

- **Error**: The `randint` function was imported as `random_integer`, so `randint(1, 10)` will raise an error.

- **Corrected Code**:
```python
from random import randint as random_integer
print(random_integer(1, 10))
```

- **Explanation**: After importing `randint` as `random_integer`, you must use `random_integer()` to generate a random integer. The original name `randint` is no longer valid in this scope.



9. **Detect and explain the error in this code snippet:**

```python
from os import getcwd, remove as delete_file
print(getcwd())
remove('file.txt')
```

- **Error**: The `remove` function was imported as `delete_file`, but the code still uses `remove()`.

- **Corrected Code**:
 ```python
 from os import getcwd, remove as delete_file
 print(getcwd())
 delete_file('file.txt')
 ```

- **Explanation**: Since `remove` was renamed to `delete_file` using `as`, the function must be called as `delete_file()`. The original function name `remove` is not valid in this context.






---
you may skip next part form now
---




10. **Explain the error in the following code and provide the correct version:**

```python
from random import choice, sample
my_list = [1, 2, 3, 4]
print(sample(my_list, 2))
print(choice(my_list, 2))
```

- **Error**: The `choice()` function selects a single element from a sequence, but the code tries to pass two arguments, which is invalid.

- **Corrected Code**:
```python
from random import choice, sample
my_list = [1, 2, 3, 4]
print(sample(my_list, 2))  # Selects 2 random elements
print(choice(my_list))  # Selects 1 random element
```

- **Explanation**: `sample()` selects multiple elements from a sequence, whereas `choice()` picks a single random element. The incorrect usage of `choice(my_list, 2)` caused the error.


### 21. What is the `__init__` method in Python classes? 

```python
class Person:
    """
    A class to represent a person.
    
    Attributes:
        name (str): The name of the person.
        age (int): The age of the person.
    """
    
    def __init__(self, name, age):
        """
        Initialize a new person object.
        
        Args:
            name (str): The person's name.
            age (int): The person's age.
        """
        self.name = name
        self.age = age

# Example usage:
person = Person("John", 30)
print(person.name)  # Output: John
print(person.age)   # Output: 30
```
- **Explanation**: The `__init__` method is the constructor for a class. It is automatically invoked when an object of the class is created and allows for initialization of the object’s attributes.
### 26. How do you debug Python code using `pdb`?

```python
import pdb

def add(a, b):
    pdb.set_trace()  # Start debugging
    return a + b

add(3, 4)
```
- **Explanation**: The `pdb.set_trace()` function starts the Python debugger (`pdb`) at that point in the code, allowing you to step through, inspect variables, and find issues.


### 29. Explain the concept of recursion with an example.

```python
def fibonacci(n):
    """
    Calculate the nth Fibonacci number using recursion.
    
    Args:
        n (int): The position of the Fibonacci number.

    Returns:
        int: The nth Fibonacci number.
    """
    if n <= 1:
        return n
    else:
        return fibonacci(n - 1) + fibonacci(n - 2)

# Example usage:
print(fibonacci(5))  # Output: 5
```
- **Explanation**: Recursion is a process where a function calls itself. In this example, the Fibonacci function recursively calculates the Fibonacci sequence.

---

### 30. What is the difference between a generator and an iterator?

```python
def generator_example():
    for i in range(3):
        yield i

gen = generator_example()

print(next(gen))  # Output: 0
print(next(gen))  # Output: 1
```
- **Explanation**: A generator is a special type of iterator that generates values lazily using the `yield` keyword. Iterators are objects that allow traversing through all the elements of a collection.


### 34. How can you make a class iterable in Python?

```python
class MyIterable:
    def __init__(self, data):
        self.data = data
        self.index = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.index < len(self.data):
            result = self.data[self.index]
            self.index += 1
            return result
        else:
            raise StopIteration

# Example usage:
my_iterable = MyIterable([1, 2, 3])
for item in my_iterable:
    print(item)
```
- **Explanation**: To make a class iterable, define `__iter__()` to return the iterator object and `__next__()` to return the next element.
