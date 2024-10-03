# Decorators
### Python Wrapper Functions and Decorators

In Python, a **decorator** is a special type of function that allows you to modify or extend the behavior of another function without permanently changing it. It is a powerful tool used to wrap functionality around an existing function.

#### Wrapper Function:
A **wrapper function** is a function that “wraps” another function, meaning it accepts a function as input and adds some behavior before or after the function is executed.

### Basic Structure of a Wrapper Function

```python
def my_wrapper(func):
    def wrapper():
        print("Before the function call")
        func()  # Call the original function
        print("After the function call")
    return wrapper
```

In this example:
- `my_wrapper` is a higher-order function (it takes a function as input).
- `wrapper` is the actual function that wraps around the original function, adding behavior before and after calling `func()`.

---

### Introduction to Decorators

A **decorator** is essentially a wrapper function that is applied to another function using the `@` symbol. When a decorator is applied to a function, the function is replaced by the wrapper function.

Here’s how you can create and use a decorator in Python:

### Basic Example of a Decorator

```python
# Define a decorator function
def my_decorator(func):
    def wrapper():
        print("Something before the function.")
        func()  # Call the original function
        print("Something after the function.")
    return wrapper

# Using the decorator with @ syntax
@my_decorator
def say_hello():
    print("Hello!")

# Call the function
say_hello()
```

### Explanation:
1. The `my_decorator` function takes `func` (the original function) as input.
2. Inside `my_decorator`, the `wrapper` function is defined to add behavior around `func()`.
3. `@my_decorator` applies the decorator to the `say_hello` function.
4. When you call `say_hello()`, it actually calls the `wrapper()` function.

### Output:

```
Something before the function.
Hello!
Something after the function.
```

---

### Using a Decorator with Function Arguments

You can create decorators that work with functions that accept arguments by using `*args` and `**kwargs`. This way, the decorator can handle any number of positional and keyword arguments.

#### Example:

```python
def my_decorator(func):
    def wrapper(*args, **kwargs):
        print("Before the function call")
        result = func(*args, **kwargs)  # Call the original function
        print("After the function call")
        return result  # Return the result of the original function
    return wrapper

# Applying the decorator
@my_decorator
def add(a, b):
    return a + b

# Call the function with arguments
result = add(5, 3)
print(f"Result: {result}")
```

### Explanation:
1. The `wrapper` function can accept any number of arguments (`*args` for positional arguments and `**kwargs` for keyword arguments).
2. The decorator adds behavior before and after the function call but still allows the function to work with arguments.

### Output:

```
Before the function call
After the function call
Result: 8
```

---

### Decorators with Return Values

The `wrapper` function should return the result of the original function so that the decorated function still returns what it’s supposed to. This is crucial when the original function has a return value.

#### Example:

```python
def my_decorator(func):
    def wrapper(*args, **kwargs):
        print("Executing function...")
        result = func(*args, **kwargs)  # Execute the function and store the result
        print("Function executed.")
        return result  # Return the result
    return wrapper

@my_decorator
def multiply(a, b):
    return a * b

result = multiply(4, 5)
print(f"Result of multiplication: {result}")
```

### Output:

```
Executing function...
Function executed.
Result of multiplication: 20
```

---

### Practical Use Case: Timing Function Execution with a Decorator

A common use case for decorators is to measure the execution time of a function. Let’s create a decorator that wraps around a function and prints how long it took to run.

#### Example:

```python
import time

# Define the timing decorator
def timer_decorator(func):
    def wrapper(*args, **kwargs):
        start_time = time.time()  # Start time
        result = func(*args, **kwargs)  # Execute the function
        end_time = time.time()  # End time
        elapsed_time = end_time - start_time  # Calculate elapsed time
        print(f"Function '{func.__name__}' took {elapsed_time:.5f} seconds to execute.")
        return result
    return wrapper

# Apply the decorator to a function
@timer_decorator
def slow_function():
    time.sleep(2)  # Simulate a slow function
    print("Finished slow function.")

# Call the decorated function
slow_function()
```

### Explanation:
1. The `timer_decorator` captures the start and end times, calculates the elapsed time, and prints it.
2. The `slow_function()` simulates a time delay using `time.sleep()`, which pauses execution for 2 seconds.

### Output:

```
Finished slow function.
Function 'slow_function' took 2.00234 seconds to execute.
```

---

### Stacking Multiple Decorators

You can apply multiple decorators to the same function by stacking them. The decorators are applied from top to bottom.

#### Example:

```python
def decorator_one(func):
    def wrapper(*args, **kwargs):
        print("Decorator One")
        return func(*args, **kwargs)
    return wrapper

def decorator_two(func):
    def wrapper(*args, **kwargs):
        print("Decorator Two")
        return func(*args, **kwargs)
    return wrapper

@decorator_one
@decorator_two
def greet():
    print("Hello!")

# Call the function
greet()
```

### Explanation:
1. `decorator_two` is applied first, followed by `decorator_one`.
2. The order of execution is from top to bottom in the code, but function wrapping happens from the inside out.

### Output:

```
Decorator One
Decorator Two
Hello!
```

---

### Summary:
- **Wrapper functions** in Python allow you to add functionality to a function before or after its execution.
- **Decorators** are a cleaner and more Pythonic way to apply wrapper functions using the `@` syntax.
- Decorators are commonly used for tasks like logging, timing, authentication, and enforcing access control.
- They help you keep your code DRY (Don’t Repeat Yourself) by separating cross-cutting concerns from the main logic.