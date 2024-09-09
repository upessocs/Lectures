# **Functions in Python**

**Introduction:**
Functions are blocks of reusable code designed to perform specific tasks. They help organize code, reduce repetition, and enhance readability. Python functions can take inputs, process data, and return results. Functions are essential for structuring programs in a modular and efficient way.


#### **1. Defining Your Own Functions**

**Advanced Explanation:**
In Python, you define a function using the `def` keyword followed by the function name and parentheses `()`. Inside the parentheses, you can specify parameters (if any). The function body contains the code that runs when the function is called.

**Example Code:**

```python
def greet(name):
    """Greets a person by their name."""
    return f"Hello, {name}!"

# Calling the function
message = greet("Alice")
print(message)  # Output: Hello, Alice!
```

**Explanation:**
- The function `greet` is defined with a single parameter `name`.
- The function returns a greeting message that includes the given name.
- The function is called with the argument `"Alice"`, and the output is printed.

---

#### **2. Parameters**

**Advanced Explanation:**
Parameters are the variables listed inside the parentheses in the function definition. They allow you to pass data into the function, which the function can then use to perform its operations.

**Example Code:**

```python
def add(a, b):
    """Returns the sum of two numbers."""
    return a + b

# Calling the function with arguments
result = add(5, 3)
print(result)  # Output: 8
```

**Explanation:**
- The function `add` takes two parameters, `a` and `b`.
- It returns the sum of these two numbers.
- When the function is called with `5` and `3` as arguments, it returns `8`.

---

#### **3. Function Documentation**

**Advanced Explanation:**
Function documentation, or docstrings, are a way to describe what a function does. A docstring is a string literal that appears right after the function header and explains the function's purpose, parameters, and return value.

**Example Code:**

```python
def multiply(a, b):
    """
    Multiplies two numbers and returns the result.
    
    Parameters:
    a (int, float): The first number.
    b (int, float): The second number.
    
    Returns:
    int, float: The product of a and b.
    """
    return a + b

print(multiply.__doc__)
```

**Explanation:**
- The docstring for `multiply` explains what the function does, the parameters it accepts, and the return value.
- The `__doc__` attribute can be used to access the function’s docstring.

---

#### **4. Keyword and Optional Parameters**

**Advanced Explanation:**
Keyword parameters allow you to specify argument values by their parameter names when calling a function. Optional parameters are parameters with default values, which means they can be omitted when the function is called.

**Example Code:**

```python
def introduce(name, age=25):
    """Introduces a person with their name and age."""
    return f"My name is {name}, and I am {age} years old."

# Calling with positional arguments
print(introduce("Bob"))  # Output: My name is Bob, and I am 25 years old.

# Calling with keyword arguments
print(introduce(name="Alice", age=30))  # Output: My name is Alice, and I am 30 years old.
```

**Explanation:**
- The `introduce` function has a parameter `age` with a default value of `25`, making it optional.
- If `age` is not provided when calling the function, it defaults to `25`.
- You can also specify arguments using their parameter names.

---

#### **5. Passing Collections to a Function**

**Advanced Explanation:**
You can pass entire collections (like lists, tuples, sets, or dictionaries) to a function. This allows the function to process a sequence of data.

**Example Code:**

```python
def sum_numbers(numbers):
    """Sums all the numbers in a collection."""
    return sum(numbers)

# Passing a list to the function
result = sum_numbers([1, 2, 3, 4, 5])
print(result)  # Output: 15

# Passing a tuple to the function
result = sum_numbers((10, 20, 30))
print(result)  # Output: 60
```

**Explanation:**
- The `sum_numbers` function takes a collection of numbers and returns their sum.
- It works with both lists and tuples.

---

#### **6. Variable Number of Arguments (`*args` and `**kwargs`)**

**Advanced Explanation:**
Sometimes, you might not know in advance how many arguments will be passed to your function. Python allows you to handle this using `*args` for non-keyword arguments and `**kwargs` for keyword arguments.

**Example Code:**

```python
def print_numbers(*args):
    """Prints each number passed as an argument."""
    for number in args:
        print(number)

# Calling with multiple arguments
print_numbers(1, 2, 3, 4)
# Output:
# 1
# 2
# 3
# 4

def print_key_value(**kwargs):
    """Prints each key-value pair passed as keyword arguments."""
    for key, value in kwargs.items():
        print(f"{key}: {value}")

# Calling with keyword arguments
print_key_value(name="Alice", age=30)
# Output:
# name: Alice
# age: 30
```

**Explanation:**
- `*args` allows you to pass a variable number of non-keyword arguments to a function. These arguments are accessible as a tuple inside the function.
- `**kwargs` allows you to pass a variable number of keyword arguments to a function. These arguments are accessible as a dictionary inside the function.

---

#### **7. Scope**

**Advanced Explanation:**
Scope refers to the visibility and lifetime of variables within different parts of your code. In Python, there are four types of scopes:
- **Local Scope:** Variables declared inside a function are local to that function.
- **Enclosing Scope:** Refers to variables in the scope of the outer function when using nested functions.
- **Global Scope:** Variables declared at the top level of a script or module are global and can be accessed anywhere in the code.
- **Built-in Scope:** Refers to the names of built-in functions and exceptions.

**Example Code:**

```python
x = 10  # Global variable

def outer_function():
    x = 20  # Enclosing variable

    def inner_function():
        x = 30  # Local variable
        print(x)  # Output: 30

    inner_function()
    print(x)  # Output: 20

outer_function()
print(x)  # Output: 10
```

**Explanation:**
- The variable `x` is defined in three different scopes: global, enclosing, and local.
- The `inner_function` prints the local value of `x`, the `outer_function` prints the enclosing value, and the global `x` is printed at the end.

---
# Passing Arguments to Functions in Python

In Python, functions can accept arguments in several ways. Understanding these methods can help you write more flexible and efficient code.

#### 1. **Positional Arguments**
- **Definition**: These are the most straightforward type of arguments, passed to a function in the order defined.
- **Example**:
     ```python
     def greet(name, message):
         return f"Hello, {name}! {message}"

     print(greet("Alice", "Welcome to the team!"))
     ```
- **Use Case**: Use when the order of arguments matters and is clear.

#### 2. **Default Arguments**
- **Definition**: You can assign a default value to an argument. If the argument is not provided during the function call, the default value is used.
- **Example**:
     ```python
     def greet(name, message="Welcome!"):
         return f"Hello, {name}! {message}"

     print(greet("Alice"))  # Uses default message
     print(greet("Bob", "Good to see you!"))  # Overrides default
     ```
- **Use Case**: Use when you want to make an argument optional or when a common default value makes sense.

#### 3. **`*args` (Arbitrary Positional Arguments)**
- **Definition**: Allows a function to accept any number of positional arguments, which are packed into a tuple.
- **Example**:
     ```python
     def greet(*names):
         for name in names:
             print(f"Hello, {name}!")

     greet("Alice", "Bob", "Charlie")
     ```
- **Use Case**: Use when you don’t know beforehand how many positional arguments will be passed to the function.

#### 4. **`**kwargs` (Arbitrary Keyword Arguments)**
- **Definition**: Allows a function to accept any number of keyword arguments, which are packed into a dictionary.
- **Example**:
     ```python
     def describe_person(**info):
         for key, value in info.items():
             print(f"{key}: {value}")

     describe_person(name="Alice", age=30, job="Engineer")
     ```
- **Use Case**: Use when you don’t know beforehand how many keyword arguments will be passed or when arguments need to be flexible.

### Returning Values from Functions

In Python, functions can return values using the `return` statement.

#### Example:
```python
def add(a, b):
    return a + b

result = add(5, 3)
print(result)  # Output: 8
```

- **Multiple Values**: Python functions can return multiple values as a tuple.
```python
def swap(a, b):
    return b, a

x, y = swap(1, 2)
print(x, y)  # Output: 2 1
```

### Modifying Global Variables

To modify a global variable inside a function, you must use the `global` keyword.

#### Example:
```python
counter = 0

def increment():
    global counter
    counter += 1

increment()
print(counter)  # Output: 1
```

### Behavior of Mutable and Immutable Arguments

- **Immutable Objects**: When you pass an immutable object (like integers, strings, tuples) to a function, and modify it inside the function, a new object is created, and the original object remains unchanged.

  **Example**:
  ```python
  def modify_immutable(x):
      x += 1
      print(f"Inside function: {x}")

  a = 5
  modify_immutable(a)
  print(f"Outside function: {a}")  # Output: 5 (unchanged)
  ```

- **Mutable Objects**: When you pass a mutable object (like lists, dictionaries) to a function, modifications inside the function affect the original object.

  **Example**:
  ```python
  def modify_mutable(lst):
      lst.append(4)
      print(f"Inside function: {lst}")

  my_list = [1, 2, 3]
  modify_mutable(my_list)
  print(f"Outside function: {my_list}")  # Output: [1, 2, 3, 4] (modified)
  ```

#### **`id` Function and Object Identity**

- **Before and After Modification**: The `id()` function can be used to check if the identity of the object has changed.
  
  **Immutable Example**:
  ```python
  def modify(x):
      print(f"Before: {id(x)}")
      x += 1
      print(f"After: {id(x)}")

  a = 5
  modify(a)
  ```

  **Mutable Example**:
  ```python
  def modify(lst):
      print(f"Before: {id(lst)}")
      lst.append(4)
      print(f"After: {id(lst)}")

  my_list = [1, 2, 3]
  modify(my_list)
  ```

- **Immutable Objects**: Since they cannot be changed, a new object is created when you attempt to modify them, resulting in a different `id`.
- **Mutable Objects**: The `id` remains the same because the object itself is modified rather than being replaced.

### Summary and Best Practices
- **Positional vs. Keyword**: Use positional arguments when the order is essential. Use keyword arguments to improve clarity.
- **Default Arguments**: Useful for optional parameters.
- **`*args` and `**kwargs`**: Provide flexibility for functions that need to handle a variable number of inputs.
- **Global Variables**: Use with caution, as they can lead to code that is difficult to understand and maintain.
- **Mutability**: Be mindful of whether you are passing mutable or immutable objects, as it affects how changes within functions impact the original data.














---
# **8. Functions as "First-Class Citizens"**

**Advanced Explanation:**
In Python, functions are first-class citizens, meaning they can be treated like any other object. You can assign them to variables, pass them as arguments, and return them from other functions.

**Example Code:**

```python
def square(x):
    return x * x

# Assigning a function to a variable
f = square
print(f(5))  # Output: 25

# Passing a function as an argument
def apply_function(func, value):
    return func(value)

result = apply_function(square, 4)
print(result)  # Output: 16
```

**Explanation:**
- The `square` function is assigned to the variable `f`.
- The function `apply_function` takes another function and a value as arguments, demonstrating that functions can be passed around just like other objects.

---

#### **9. Passing Functions to a Function**

**Advanced Explanation:**
You can pass functions as arguments to other functions. This allows for higher-order functions, which can perform actions on other functions.

**Example Code:**

```python
def double(x):
    return x * 2

def triple(x):
    return x * 3

def apply_operation(func, number):
    return func(number)

print(apply_operation(double, 5))  # Output: 10
print(apply_operation(triple, 5))  # Output: 15
```

**Explanation:**
- The `apply_operation` function accepts another function (`func`) and a number, then applies the function to the number.
- You can pass different functions to `apply_operation` to achieve different results.

> You should search about `decoraters in python`


---


# Introduction to `*args` and `**kwargs`:

> Functions can accept  variable-length arguments (`*args` and `**kwargs`).

### **Using `*args` and `**kwargs` in Python**



In Python, `*args` and `**kwargs` are used to pass a variable number of arguments to a function. They are useful when you don't know beforehand how many arguments will be passed to your function.

- **`*args`:** Allows a function to accept any number of positional arguments, which are passed to the function as a tuple.
- **`**kwargs`:** Allows a function to accept any number of keyword arguments, which are passed as a dictionary.

---

#### **Using `*args`:**

**Example:**

```python
def print_numbers(*args):
    """Prints each number passed as an argument."""
    for number in args:
        print(number)

# Calling the function with multiple arguments
print_numbers(1, 2, 3, 4, 5)
```

**Output:**

```
1
2
3
4
5
```

**Explanation:**

- The `print_numbers` function can accept any number of positional arguments, which are collected into a tuple named `args`.
- The function then iterates over `args` and prints each number.

**Use Case:**

- `*args` is useful when you want a function to handle a flexible number of inputs, such as when creating a summation function that can add any number of numbers.

---

#### **Using `**kwargs`:**

**Example:**

```python
def print_key_values(**kwargs):
    """Prints each key-value pair passed as keyword arguments."""
    for key, value in kwargs.items():
        print(f"{key}: {value}")

# Calling the function with keyword arguments
print_key_values(name="Alice", age=30, city="New York")
```

**Output:**

```
name: Alice
age: 30
city: New York
```

**Explanation:**

- The `print_key_values` function can accept any number of keyword arguments, which are collected into a dictionary named `kwargs`.
- The function then iterates over the dictionary and prints each key-value pair.

**Use Case:**

- `**kwargs` is useful when you want a function to handle named arguments, such as when configuring settings for an application where different parameters can be passed as keyword arguments.

---

#### **Combining `*args` and `**kwargs`:**

You can use `*args` and `**kwargs` together in a function to accept both positional and keyword arguments.

**Example:**

```python
def greet(*args, **kwargs):
    """Greets people and provides additional information."""
    for name in args:
        print(f"Hello, {name}!")
    
    for key, value in kwargs.items():
        print(f"{key}: {value}")

# Calling the function with both positional and keyword arguments
greet("Alice", "Bob", age=25, city="New York")
```

**Output:**

```
Hello, Alice!
Hello, Bob!
age: 25
city: New York
```

**Explanation:**

- The `greet` function can accept any number of positional arguments (names) and any number of keyword arguments (additional information).
- This makes the function flexible, allowing for various combinations of inputs.

**Use Case:**

- A combined use of `*args` and `**kwargs` is helpful when writing functions that need to be highly flexible, such as a logging function that can handle any number of messages and various optional metadata.


---

#### **10. Lambda Functions**

**Advanced Explanation:**
A lambda function is a small anonymous function defined with the `lambda` keyword. Lambda functions can have any number of parameters but only one expression, which is evaluated and returned.

**Example Code:**

```python
# Lambda function to add two numbers
add = lambda a, b: a + b
print(add(3, 5))  # Output: 8

# Using a lambda function with map
numbers = [1, 2, 3, 4]
squared = map(lambda x: x * x, numbers)
print(list(squared))  # Output: [1, 4, 9, 16]
```

**Explanation:**
- The `add` lambda function performs the same operation as a regular function but is defined in a single line.
- Lambda functions are often used with functions like `map`, `filter`, and `sorted`.


---


#### **11. `map` and `filter`**

**Advanced Explanation:**
`map` and `filter` are built-in functions that allow you to apply a function to a collection of data. 
- `map` applies a given function to each item of an iterable (like a list) and returns a map object (which is an iterator).
- `filter` applies a function to each item of an iterable and returns a filter object containing only the items that return `True`.

**Example Code:**

```python
# Using map to square each number in a list
numbers = [1, 2, 3, 4, 5]
squared = map(lambda x: x * x, numbers)
print(list(squared))  # Output: [1, 4, 9, 16, 25]



# Using filter to get only even numbers from a list
even_numbers = filter(lambda x: x % 2 == 0, numbers)
print(list(even_numbers))  # Output: [2, 4]
```

**Explanation:**
- `map` applies the lambda function `x: x * x` to each number in `numbers`, returning a list of squared numbers.
- `filter` applies the lambda function `x: x % 2 == 0` to each number, returning only the even numbers.

---

#### **12. Mapping Functions in a Dictionary**

**Advanced Explanation:**
You can use dictionaries to map string keys to functions, enabling you to dynamically select and execute functions based on input.

**Example Code:**

```python
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

operations = {
    "add": add,
    "subtract": subtract
}

# Selecting and executing a function from the dictionary
operation = "add"
result = operations[operation](10, 5)
print(result)  # Output: 15
```

**Explanation:**
- The `operations` dictionary maps strings like `"add"` and `"subtract"` to their respective functions.
- You can dynamically select and call the appropriate function based on user input or other logic.




---

#### **13. Inner Functions**

**Advanced Explanation:**
Inner functions are functions defined inside other functions. They can only be accessed within the enclosing function, making them useful for encapsulating functionality that doesn't need to be exposed globally.

**Example Code:**

```python
def outer_function(text):
    def inner_function():
        return text.upper()
    return inner_function()
	
result = outer_function("hello")
print(result)  # Output: HELLO
```

**Explanation:**
- `inner_function` is defined inside `outer_function` and is used to transform the `text` to uppercase.
- The inner function is only accessible within the `outer_function`, providing a way to encapsulate helper functions.

---

#### **14. Closures**

**Advanced Explanation:**
A closure occurs when an inner function captures and remembers the environment (variables) of the enclosing function even after the outer function has finished executing. Closures allow you to create functions with persistent state.

**Example Code:**

```python
def make_multiplier(n):
    def multiplier(x):
        return x * n
    return multiplier

times_three = make_multiplier(3)
print(times_three(10))  # Output: 30
```

**Explanation:**
- The `make_multiplier` function returns the `multiplier` function, which captures the value of `n` from its enclosing scope.
- The `times_three` closure retains the value of `n = 3` and uses it to multiply any number passed to it.

---