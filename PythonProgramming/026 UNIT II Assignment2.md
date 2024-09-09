### Python Assignment 2



1. **Basic Function Implementation:**
Write a function `greet` that takes two arguments: `name` (a string) and `greeting` (a string with a default value of "Hello"). The function should return a greeting message.

- **Example Usage:**
```python
greet("Alice")     # Output: "Hello Alice"
greet("Bob", "Good Morning")  # Output: "Good Morning Bob"
```

2. **Named Arguments:**
Create a function `create_profile` that takes arguments for `name`, `age`, and `city` as named arguments. The function should return a string like "Name: Alice, Age: 25, City: New York". Ensure that the `age` argument has a default value of 18.

- **Example Usage:**
```python
create_profile(name="John", city="Chicago")  # Output: "Name: John, Age: 18, City: Chicago"
create_profile(name="Emma", age=22, city="Los Angeles")  # Output: "Name: Emma, Age: 22, City: Los Angeles"
```

3. **Using *args and **kwargs:**
Write a function `sum_numbers` that takes any number of positional arguments (*args) and keyword arguments (**kwargs). It should:
- Return the sum of all *args if they are numbers.
- Return a dictionary of all keyword arguments.

- **Example Usage:**
```python
sum_numbers(1, 2, 3)  # Output: 6
sum_numbers(1, 2, x=4, y=5)  # Output: (6, {'x': 4, 'y': 5})
```


4. **Lambdas and Map:**
Write a function that uses `map` and a lambda to return a list where each element is squared.

- **Example Usage:**
```python
square_list([1, 2, 3, 4])  # Output: [1, 4, 9, 16]
```

5. **Filter and Lambdas:**
Write a function that filters out all odd numbers from a list using `filter` and a lambda function.

- **Example Usage:**
```python
filter_odd_numbers([1, 2, 3, 4, 5])  # Output: [2, 4]
```



6. **Basic List Comprehension:**
Create a list comprehension that takes a list of numbers and returns a list of their squares.

- **Example Usage:**
```python
[x**2 for x in range(5)]  # Output: [0, 1, 4, 9, 16]
```

7. **List Comprehension with Condition:**
Use a list comprehension to create a list of even numbers from 1 to 20.

- **Example Usage:**
```python
[x for x in range(1, 21) if x % 2 == 0]  # Output: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
```



8. **Using `os` and `time` Modules:**
Write a function `file_operations` that creates a directory named "test_folder" using `os.makedirs()`. Then, pause the execution for 3 seconds using `time.sleep()`, and finally, delete the directory using `os.rmdir()`.

- **Example Usage:**
```python
file_operations()  # Creates "test_folder", pauses for 3 seconds, and deletes it.
```

9. **Importing Specific Functions:**
Write a Python script that imports only `sleep` from the `time` module and renames it to `pause`. Use it to pause execution for 2 seconds and print "Paused execution...".

- **Example Usage:**
```python
from time import sleep as pause
pause(2)  # Pauses for 2 seconds
print("Paused execution...")
```



10. **Recursive Function with *args and **kwargs (Flattening a List):**
Write a recursive function `flatten_list` that can flatten a nested list of any depth using *args and **kwargs.

**Explanation**:
- Flattening a list means converting a nested list into a single-level list. If the list contains sub-lists, we recursively traverse them and extract their elements to form one flat list.
 
- **Example Usage:**
```python
flatten_list([1, [2, 3], [[4, 5], 6]])  # Output: [1, 2, 3, 4, 5, 6]
flatten_list([[1, 2], [3, [4, [5]]]])  # Output: [1, 2, 3, 4, 5]
```

**Hint**: 
- Use `isinstance(element, list)` to check if an element is a list and recurse through it.
- Keep appending non-list elements to the result.

```python
def flatten_list(nested_list):
flat_list = []
for item in nested_list:
    if isinstance(item, list):
        flat_list.extend(flatten_list(item))
    else:
        flat_list.append(item)
return flat_list
```




### Submission Guidelines
- Submit your code in a Jupyter notebook file named `Assignment2.ipynb`.
- Test each function with examples provided and include the outputs in the notebook cells.
- Include comments to explain your approach, especially for challenging questions.

Assignment Submission URL
[https://forms.office.com/r/cXPbDEXy89](https://forms.office.com/r/cXPbDEXy89)