
## **1. Dictionaries with Compound Values**

In Python, dictionaries can store **compound values**, meaning the values can be lists, tuples, or even other dictionaries. This allows you to model more complex data structures.

### **Example 1: Dictionary with List as Value**
```python
students = {
    'Alice': [85, 90, 92],
    'Bob': [78, 81, 85],
    'Charlie': [92, 88, 84]
}

# Access grades of a specific student
print(students['Alice'])  # Output: [85, 90, 92]

# Calculate average grades for each student
for name, grades in students.items():
    avg = sum(grades) / len(grades)
    print(f"{name}'s average grade: {avg}")
```

### **Example 2: Dictionary with Dictionary as Value**
```python
contacts = {
    'John': {'phone': '123-456', 'email': 'john@example.com'},
    'Mary': {'phone': '987-654', 'email': 'mary@example.com'}
}

# Access specific information
print(contacts['John']['email'])  # Output: john@example.com
```

### **Use Case**: Compound values in dictionaries are useful for representing real-world entities (e.g., students with multiple scores or people with multiple contact methods).

---

## **2. Processing Lists in Parallel**

You can **process multiple lists in parallel** using the `zip()` function, which pairs elements from multiple iterables.

### **Example: Processing Two Lists in Parallel**
```python
names = ['Alice', 'Bob', 'Charlie']
scores = [85, 78, 92]

# Print name and score pairs
for name, score in zip(names, scores):
    print(f'{name}: {score}')
```

**Output:**
```
Alice: 85
Bob: 78
Charlie: 92
```

### **Use Case**: Processing lists in parallel is useful when you have related data in separate lists (e.g., names and corresponding scores).

---

## **3. Specialized Sorts**

Python's `sorted()` function and list’s `sort()` method allow for specialized sorting using the **`key` parameter** to define a custom sort order.

### **Example: Sorting a List of Tuples by the Second Element**
```python
students = [('Alice', 85), ('Bob', 78), ('Charlie', 92)]

# Sort students by score (second element)
sorted_students = sorted(students, key=lambda x: x[1])
print(sorted_students)
```

**Output:**
```
[('Bob', 78), ('Alice', 85), ('Charlie', 92)]
```

### **Example: Sorting Dictionary by Values**
```python
scores = {'Alice': 85, 'Bob': 78, 'Charlie': 92}

# Sort dictionary by score
sorted_scores = dict(sorted(scores.items(), key=lambda x: x[1]))
print(sorted_scores)
```

**Output:**
```
{'Bob': 78, 'Alice': 85, 'Charlie': 92}
```

### **Use Case**: Custom sorting helps in scenarios where data needs to be ordered based on non-trivial criteria.

---

## **4. Time Functionality**

Python’s `time` and `datetime` modules provide tools for **working with time and dates**.

### **Example: Getting Current Time**
```python
import time

# Get current epoch time
epoch_time = time.time()
print(f'Epoch time: {epoch_time}')

# Sleep for 2 seconds
time.sleep(2)

# Get current local time
local_time = time.ctime()
print(f'Local time: {local_time}')
```

### **Example: Working with Dates using `datetime`**
```python
from datetime import datetime

# Get current date and time
now = datetime.now()
print(f'Current Date and Time: {now}')

# Format date
formatted = now.strftime('%Y-%m-%d %H:%M:%S')
print(f'Formatted Date: {formatted}')
```

### **Use Case**: Time functionality is useful for tracking execution time, scheduling, and formatting dates for display.

---

## **5. Generators**

A **generator** is a function that returns an iterator and allows you to iterate over data lazily (on demand), which is memory efficient.

### **Creating a Generator with `yield`**
```python
def count_up_to(max_value):
    counter = 1
    while counter <= max_value:
        yield counter
        counter += 1

# Create a generator
counter = count_up_to(5)

# Iterate through the generator
for num in counter:
    print(num)
```

**Output:**
```
1
2
3
4
5
```

### **Use Case**: Generators are useful when working with large datasets since they generate items on-the-fly instead of storing them in memory.

