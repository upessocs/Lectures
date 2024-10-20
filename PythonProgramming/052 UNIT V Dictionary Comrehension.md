# List comprehension and dictionary comprehension
> List comprehension and dictionary comprehension are concise ways to create lists and dictionaries in Python. They allow you to generate these data structures in a single line of code, making your code more readable and efficient. Let’s break them down:



## **1. List Comprehension**

**List comprehension** is a compact way to create lists. The syntax is:

```python
[expression for item in iterable if condition]
```

- **`expression`**: What to include in the list.
- **`item`**: The current item from the iterable.
- **`iterable`**: Any iterable (like a list, tuple, or string).
- **`condition`** (optional): A filter that only includes items that meet the condition.

### **Basic Examples**

### **a) Creating a List of Squares**
```python
squares = [x**2 for x in range(10)]
print(squares)
```
**Output:**
```
[0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
```

### **b) Filtering Even Numbers**
```python
evens = [x for x in range(20) if x % 2 == 0]
print(evens)
```
**Output:**
```
[0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
```

### **c) Applying Functions to List Elements**
```python
fruits = ['apple', 'banana', 'cherry']
fruit_lengths = [len(fruit) for fruit in fruits]
print(fruit_lengths)
```
**Output:**
```
[5, 6, 6]
```

### **d) Nested List Comprehension**
```python
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened = [num for row in matrix for num in row]
print(flattened)
```
**Output:**
```
[1, 2, 3, 4, 5, 6, 7, 8, 9]
```

---

## **2. Dictionary Comprehension**

**Dictionary comprehension** is similar to list comprehension but creates dictionaries. The syntax is:

```python
{key_expression: value_expression for item in iterable if condition}
```

- **`key_expression`**: The key for the dictionary.
- **`value_expression`**: The value corresponding to the key.
- **`condition`** (optional): A filter for items to include.

### **Basic Examples**

### **a) Creating a Dictionary of Squares**
```python
squares_dict = {x: x**2 for x in range(5)}
print(squares_dict)
```
**Output:**
```
{0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
```

### **b) Filtering Items in a Dictionary**
```python
fruits = ['apple', 'banana', 'cherry']
fruit_dict = {fruit: len(fruit) for fruit in fruits}
print(fruit_dict)
```
**Output:**
```
{'apple': 5, 'banana': 6, 'cherry': 6}
```

### **c) Inverting a Dictionary**
```python
original_dict = {'a': 1, 'b': 2, 'c': 3}
inverted_dict = {value: key for key, value in original_dict.items()}
print(inverted_dict)
```
**Output:**
```
{1: 'a', 2: 'b', 3: 'c'}
```

### **d) Nested Dictionary Comprehension**
```python
matrix = [[1, 2, 3], [4, 5, 6]]
dict_matrix = {i: {j: value for j, value in enumerate(row)} for i, row in enumerate(matrix)}
print(dict_matrix)
```
**Output:**
```
{0: {0: 1, 1: 2, 2: 3}, 1: {0: 4, 1: 5, 2: 6}}
```

---

## **Advantages of Comprehensions**
- **Conciseness**: Reduce the number of lines of code.
- **Readability**: Often more readable than equivalent for-loops.
- **Performance**: Generally faster than using traditional loops to create lists and dictionaries.

---

## **Example Questions**

### **1. List Comprehension Question**
**Q**: Create a list of the first 10 cube numbers.
```python
cubes = [x**3 for x in range(10)]
print(cubes)
```

### **2. Dictionary Comprehension Question**
**Q**: Create a dictionary that maps each number from 1 to 5 to its factorial.
```python
import math
factorials = {x: math.factorial(x) for x in range(1, 6)}
print(factorials)
```

