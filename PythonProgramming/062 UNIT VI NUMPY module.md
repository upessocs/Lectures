# `Numpy` 

**NumPy**, one of the most popular libraries for scientific computing in Python, through a detailed breakdown of its core concepts.

# **1. NumPy Overview**
- **NumPy** stands for **Numerical Python**.
- It provides support for **multi-dimensional arrays** and **matrices** along with a wide variety of mathematical functions.
#### **Why use NumPy?**
- Faster than native Python lists.
- Uses less memory.
- Supports **vectorized operations**, which makes computations more efficient.

---

# **2. Setup**
If you don’t have NumPy installed, run:

```bash
pip install numpy
```

After installation, import it into your code:

```python
import numpy as np
```

---

# **3. NumPy Data Types**
NumPy supports several **data types** (called `dtypes`), such as:
- `int32`, `int64`: 32-bit and 64-bit integers
- `float32`, `float64`: 32-bit and 64-bit floating-point numbers
- `bool`: Boolean values (`True` or `False`)
- `complex`: Complex numbers

You can specify the `dtype` while creating arrays:

```python
arr = np.array([1, 2, 3], dtype=np.float64)
print(arr)
print("Data type:", arr.dtype)
```

---

# **4. Basic Operators**
NumPy provides **element-wise operations** on arrays:

### Example: Arithmetic Operations
```python
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

print("Addition:", a + b)
print("Subtraction:", a - b)
print("Multiplication:", a * b)
print("Division:", a / b)
```

**Output:**
```
Addition: [5 7 9]
Subtraction: [-3 -3 -3]
Multiplication: [4 10 18]
Division: [0.25 0.4  0.5 ]
```

---

# **5. Array Indexing and Slicing**
NumPy arrays allow **indexing** and **slicing**, just like Python lists.

### Example: Indexing and Slicing
```python
arr = np.array([10, 20, 30, 40, 50])

# Access elements by index
print("First Element:", arr[0])
print("Last Element:", arr[-1])

# Slicing
print("First Three Elements:", arr[:3])
print("Elements from Index 2 to 4:", arr[2:5])
```

**Output:**
```
First Element: 10
Last Element: 50
First Three Elements: [10 20 30]
Elements from Index 2 to 4: [30 40 50]
```

---

# **6. Broadcasting**
**Broadcasting** allows NumPy to perform operations on arrays of different shapes.

### Example: Broadcasting Scalars
```python
arr = np.array([1, 2, 3])
print("Array + 10:", arr + 10)
```

**Output:**
```
Array + 10: [11 12 13]
```

In the above example, the scalar `10` is **broadcasted** to each element in the array.

### Example: Broadcasting Arrays
```python
a = np.array([[1, 2, 3], [4, 5, 6]])
b = np.array([10, 20, 30])

print("Broadcasted Addition:\n", a + b)
```

**Output:**
```
Broadcasted Addition:
 [[11 22 33]
 [14 25 36]]
```

---

# **7. Matrix Operations**
NumPy supports various **matrix operations** like **dot products**, **transpose**, and **inversion**.

### Example: Matrix Multiplication
```python
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

# Element-wise multiplication
print("Element-wise Multiplication:\n", A * B)

# Matrix multiplication (dot product)
print("Matrix Multiplication:\n", np.dot(A, B))
```

**Output:**
```
Element-wise Multiplication:
 [[ 5 12]
 [21 32]]
Matrix Multiplication:
 [[19 22]
 [43 50]]
```

### Example: Transpose of a Matrix
```python
A = np.array([[1, 2], [3, 4]])
print("Original Matrix:\n", A)
print("Transpose:\n", A.T)
```

**Output:**
```
Original Matrix:
 [[1 2]
 [3 4]]
Transpose:
 [[1 3]
 [2 4]]
```

### Example: Inverse of a Matrix
```python
from numpy.linalg import inv

A = np.array([[1, 2], [3, 4]])
print("Inverse:\n", inv(A))
```

**Output:**
```
Inverse:
 [[-2.   1. ]
 [ 1.5 -0.5]]
```

---

# **8. Example Assignment (Q&A)**

### **Q1: Create a 2x3 Array of Random Integers Between 1 and 50. Find Its Mean and Transpose.**

```python
import numpy as np

arr = np.random.randint(1, 51, size=(2, 3))
print("Original Array:\n", arr)

mean_value = np.mean(arr)
print("Mean:", mean_value)

transpose = arr.T
print("Transpose:\n", transpose)
```

---

### **Q2: Perform Element-wise Addition and Matrix Multiplication on Two 2x2 Matrices.**

```python
import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

print("Element-wise Addition:\n", A + B)
print("Matrix Multiplication:\n", np.dot(A, B))
```

---

### **Q3: Create a 1D Array of Even Numbers Between 10 and 20. Replace All Values Greater Than 15 with -1.**

```python
import numpy as np

arr = np.arange(10, 21, 2)
print("Original Array:", arr)

arr[arr > 15] = -1
print("Modified Array:", arr)
```

---

### **Q4: Create a 3x3 Identity Matrix and Multiply It with a Random 3x3 Matrix.**

```python
import numpy as np

identity_matrix = np.eye(3)
random_matrix = np.random.randint(1, 10, size=(3, 3))

print("Identity Matrix:\n", identity_matrix)
print("Random Matrix:\n", random_matrix)

result = np.dot(identity_matrix, random_matrix)
print("Result of Multiplication:\n", result)
```

---

### **Q5: Demonstrate Broadcasting by Adding a 1D Array to a 2D Array.**

```python
import numpy as np

a = np.array([[1, 2, 3], [4, 5, 6]])
b = np.array([10, 20, 30])

print("Original 2D Array:\n", a)
print("1D Array:", b)

result = a + b  # Broadcasting
print("Broadcasted Addition:\n", result)
```

---

# **Summary**

| **Topic**          | **Description** |
|--------------------|-----------------|
| **Setup**          | Installation and importing NumPy. |
| **Data Types**     | Different dtypes like int, float, bool. |
| **Basic Operators**| Element-wise operations (+, -, *, /). |
| **Indexing**       | Access and slice elements in arrays. |
| **Broadcasting**   | Operations on arrays of different shapes. |
| **Matrix Operations** | Multiplication, transpose, and inverse. |



---

# Optional reading
---

## **1. What is NumPy?**
- **NumPy** stands for **Numerical Python**.
- It allows you to perform fast mathematical operations on large datasets, such as matrix multiplication, linear algebra, and Fourier transforms.
- Arrays in NumPy are called **ndarrays**, and they are faster and more memory-efficient than standard Python lists.

---

## **2. Installing and Importing NumPy**

If you don’t have NumPy installed, use the following command:
```bash
pip install numpy
```

Import NumPy into your program:
```python
import numpy as np
```

---

## **3. Basic Operations with NumPy**

### **Creating Arrays**
```python
import numpy as np

# 1D Array
arr1 = np.array([1, 2, 3, 4])
print("1D Array:", arr1)

# 2D Array (Matrix)
arr2 = np.array([[1, 2], [3, 4]])
print("2D Array:\n", arr2)

# Array of zeros
zeros = np.zeros((2, 3))
print("Array of Zeros:\n", zeros)

# Array of ones
ones = np.ones((3, 2))
print("Array of Ones:\n", ones)

# Identity matrix
identity = np.eye(3)
print("Identity Matrix:\n", identity)
```

---

### **Array Attributes**
```python
print("Shape of arr2:", arr2.shape)  # Shape of the array
print("Number of Dimensions:", arr2.ndim)  # Number of dimensions
print("Data Type:", arr2.dtype)  # Data type of elements
print("Size of Array:", arr2.size)  # Total elements
```

---

### **Array Reshaping**
```python
arr = np.array([1, 2, 3, 4, 5, 6])
reshaped = arr.reshape((2, 3))
print("Reshaped Array:\n", reshaped)
```

---

### **Array Indexing and Slicing**
```python
arr = np.array([10, 20, 30, 40, 50])

# Access elements by index
print("First Element:", arr[0])
print("Last Element:", arr[-1])

# Slicing the array
print("First Three Elements:", arr[:3])
```

---

### **Operations on Arrays**
```python
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

# Element-wise addition, subtraction, multiplication, and division
print("Addition:", a + b)
print("Subtraction:", a - b)
print("Multiplication:", a * b)
print("Division:", a / b)

# Broadcasting
print("Add Scalar 10 to all elements:", a + 10)
```

---

### **Matrix Multiplication**
```python
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

# Element-wise multiplication
print("Element-wise Multiplication:\n", A * B)

# Matrix multiplication
print("Matrix Multiplication:\n", A @ B)  # or np.dot(A, B)
```

---

### **Statistical Functions**
```python
arr = np.array([1, 2, 3, 4, 5])

print("Sum:", np.sum(arr))
print("Mean:", np.mean(arr))
print("Max:", np.max(arr))
print("Min:", np.min(arr))
print("Standard Deviation:", np.std(arr))
```

---

### **Generating Random Numbers**
```python
# Random float values between 0 and 1
random_arr = np.random.rand(2, 3)
print("Random Array:\n", random_arr)

# Random integers between 10 and 50
rand_ints = np.random.randint(10, 50, size=(2, 2))
print("Random Integers:\n", rand_ints)
```

---

### **Sorting and Searching**
```python
arr = np.array([3, 1, 2, 5, 4])

# Sorting the array
sorted_arr = np.sort(arr)
print("Sorted Array:", sorted_arr)

# Searching for the index of a value
index = np.where(arr == 5)
print("Index of 5:", index)
```

---

### **Handling NaN (Not a Number)**
```python
arr = np.array([1, 2, np.nan, 4])

print("Sum ignoring NaN:", np.nansum(arr))  # Ignores NaN values
```

---

### **Example Q&A Assignment**

---

#### **Q1: Create a 3x3 Matrix of Random Integers Between 1 and 100. Find the Sum, Mean, and Transpose of the Matrix.**

**Code:**
```python
import numpy as np

# Create a 3x3 matrix with random integers between 1 and 100
matrix = np.random.randint(1, 101, size=(3, 3))
print("Original Matrix:\n", matrix)

# Calculate sum and mean
matrix_sum = np.sum(matrix)
matrix_mean = np.mean(matrix)

# Transpose the matrix
transpose = np.transpose(matrix)

print("Sum:", matrix_sum)
print("Mean:", matrix_mean)
print("Transpose:\n", transpose)
```

---

#### **Q2: Write a Program to Create a 2D Array of Shape (4, 5) Filled with Zeros. Replace All Elements in the Second Column with the Value 10.**

**Code:**
```python
import numpy as np

# Create a 2D array of zeros with shape (4, 5)
arr = np.zeros((4, 5))
print("Original Array:\n", arr)

# Replace the second column with 10
arr[:, 1] = 10
print("Modified Array:\n", arr)
```

---

#### **Q3: Generate an Array of 10 Random Floats Between 0 and 1. Find the Index of the Maximum Value.**

**Code:**
```python
import numpy as np

# Generate an array of 10 random floats
random_floats = np.random.rand(10)
print("Random Floats:", random_floats)

# Find the index of the maximum value
max_index = np.argmax(random_floats)
print("Index of Maximum Value:", max_index)
```

---

#### **Q4: Write a Program to Flatten a 2D Array into a 1D Array.**

**Code:**
```python
import numpy as np

# Create a 2D array
arr = np.array([[1, 2, 3], [4, 5, 6]])
print("Original Array:\n", arr)

# Flatten the 2D array into a 1D array
flattened = arr.flatten()
print("Flattened Array:", flattened)
```

---

#### **Q5: Create Two 1D Arrays, One of Even Numbers and One of Odd Numbers, Each of Length 5. Concatenate Them into a Single Array.**

**Code:**
```python
import numpy as np

# Create two 1D arrays
even = np.array([2, 4, 6, 8, 10])
odd = np.array([1, 3, 5, 7, 9])

# Concatenate the arrays
concatenated = np.concatenate((even, odd))
print("Concatenated Array:", concatenated)
```

---
