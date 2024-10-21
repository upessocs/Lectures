# `MATPLOTLIB`

## **1. Matplotlib Overview**
- **Matplotlib** is a Python library used to create **static, interactive, and animated visualizations**.
- It closely resembles MATLAB’s plotting capabilities but is **free** and works within Python programs.
- The core of Matplotlib is **`pyplot`**, a module used to create and customize plots.

---

# **2. Setup and Installation**
If Matplotlib is not installed, use the following command:

```bash
pip install matplotlib
```

Import it using:
```python
import matplotlib.pyplot as plt
```

---

# **3. Basic Plotting**

### **Line Plot Example**
```python
import matplotlib.pyplot as plt

# Data for plotting
x = [1, 2, 3, 4]
y = [10, 20, 25, 30]

# Create a simple line plot
plt.plot(x, y)
plt.title("Basic Line Plot")
plt.xlabel("X-Axis")
plt.ylabel("Y-Axis")
plt.show()
```

---

# **4. Customizing Plots**

### Example: Changing Line Color, Marker, and Adding Grid
```python
x = [1, 2, 3, 4]
y = [10, 20, 25, 30]

plt.plot(x, y, color='red', marker='o', linestyle='--', linewidth=2)
plt.title("Customized Line Plot")
plt.xlabel("X-Axis")
plt.ylabel("Y-Axis")
plt.grid(True)  # Adds a grid
plt.show()
```

### **Explanation**:
- **`color`**: Changes the line color.
- **`marker`**: Adds markers on data points.
- **`linestyle`**: Customizes the line style (dashed, dotted, etc.).
- **`grid()`**: Adds a background grid.

---

# **5. Subplots**

### Example: Multiple Plots in One Figure
```python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
y1 = [10, 20, 25, 30]
y2 = [30, 25, 20, 15]

# Create a 1x2 grid of subplots
plt.subplot(1, 2, 1)  # 1 row, 2 columns, 1st subplot
plt.plot(x, y1, color='blue')
plt.title("Plot 1")

plt.subplot(1, 2, 2)  # 1 row, 2 columns, 2nd subplot
plt.plot(x, y2, color='green')
plt.title("Plot 2")

plt.show()
```

### **Explanation**:
- **`plt.subplot()`**: Creates a subplot grid. The arguments `(rows, cols, index)` specify which subplot to plot in.

---

# **6. Common Plot Types**

### **Scatter Plot**
```python
x = [5, 7, 8, 5, 6, 7]
y = [99, 86, 87, 88, 100, 86]

plt.scatter(x, y, color='purple')
plt.title("Scatter Plot")
plt.show()
```

### **Bar Plot**
```python
x = ['A', 'B', 'C', 'D']
y = [3, 8, 1, 10]

plt.bar(x, y, color='orange')
plt.title("Bar Plot")
plt.show()
```

### **Histogram**
```python
data = [1, 2, 2, 3, 3, 3, 4, 4, 5]

plt.hist(data, bins=5, color='skyblue', edgecolor='black')
plt.title("Histogram")
plt.show()
```

---

# **7. 3D Plotting**

To create 3D plots, use the **`Axes3D`** module from `mpl_toolkits`.

### Example: 3D Line Plot
```python
from mpl_toolkits.mplot3d import Axes3D
import matplotlib.pyplot as plt
import numpy as np

fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')

# Data for plotting
x = np.linspace(-5, 5, 100)
y = np.sin(x)
z = np.cos(x)

ax.plot(x, y, z, color='red')
ax.set_title("3D Line Plot")
ax.set_xlabel("X-Axis")
ax.set_ylabel("Y-Axis")
ax.set_zlabel("Z-Axis")

plt.show()
```

---

# **8. Example Q&A Assignment**

### **Q1: Create a Line Plot with Titles and Labels on Both Axes.**
```python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [2, 4, 6, 8, 10]

plt.plot(x, y)
plt.title("Line Plot Example")
plt.xlabel("X-Axis")
plt.ylabel("Y-Axis")
plt.show()
```

---

### **Q2: Create Two Subplots in a 2x1 Layout. One Should be a Scatter Plot and the Other a Bar Plot.**

```python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
y = [10, 20, 25, 30]

# Scatter plot on the first subplot
plt.subplot(2, 1, 1)  # 2 rows, 1 column, 1st subplot
plt.scatter(x, y)
plt.title("Scatter Plot")

# Bar plot on the second subplot
plt.subplot(2, 1, 2)  # 2 rows, 1 column, 2nd subplot
plt.bar(x, y)
plt.title("Bar Plot")

plt.tight_layout()  # Adjusts layout to prevent overlap
plt.show()
```

---

### **Q3: Plot a Histogram of Random Data Generated from a Normal Distribution.**

```python
import matplotlib.pyplot as plt
import numpy as np

data = np.random.randn(1000)  # Generate 1000 random numbers from a normal distribution

plt.hist(data, bins=30, color='green', edgecolor='black')
plt.title("Histogram of Normal Distribution")
plt.show()
```

---

### **Q4: Create a 3D Scatter Plot with Random Data.**

```python
from mpl_toolkits.mplot3d import Axes3D
import matplotlib.pyplot as plt
import numpy as np

fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')

# Generate random data
x = np.random.rand(100)
y = np.random.rand(100)
z = np.random.rand(100)

ax.scatter(x, y, z, color='blue')
ax.set_title("3D Scatter Plot")
ax.set_xlabel("X-Axis")
ax.set_ylabel("Y-Axis")
ax.set_zlabel("Z-Axis")

plt.show()
```

---

# **Summary**

| **Topic**          | **Description** |
|--------------------|-----------------|
| **Setup**          | Install Matplotlib and import `pyplot`. |
| **Basic Plot**     | Create line plots using `plt.plot()`. |
| **Customizing Plots** | Change colors, markers, and grid options. |
| **Subplots**       | Create multiple plots within the same figure. |
| **Common Plots**   | Scatter plots, bar plots, and histograms. |
| **3D Plots**       | Use `Axes3D` to create 3D visualizations. |

---
# Saving plots to file


To **save a plot** in **PDF, PNG, or SVG** formats with different sizes after displaying it using `plt.show()`, you can follow these steps:

---

# **Saving Plots with Custom Size**
1. Use **`plt.savefig()`** to save the figure.
2. You can specify the file format by using the appropriate **extension** (`.png`, `.pdf`, `.svg`).
3. To control the size, pass the **`figsize`** argument when creating the figure.
4. Ensure that the **`plt.savefig()`** function comes **after `plt.show()`** if you want to display the plot first (you may also call it before `plt.show()` if needed).

---

### **Example 1: Save Plot as PNG with Custom Size**

```python
import matplotlib.pyplot as plt

# Create a simple plot
x = [1, 2, 3, 4, 5]
y = [10, 20, 25, 30, 35]

plt.plot(x, y, marker='o')
plt.title("Line Plot Example")
plt.xlabel("X-Axis")
plt.ylabel("Y-Axis")

# Display the plot
plt.show()

# Save the plot as PNG (size in inches: width=8, height=4)
fig = plt.gcf()  # Get the current figure
fig.set_size_inches(8, 4)  # Set figure size

# Save as PNG
fig.savefig("line_plot.png", dpi=300)  # 300 DPI for high resolution
```

---

### **Explanation:**
- **`plt.gcf()`**: Gets the current figure object.
- **`fig.set_size_inches()`**: Sets the size of the figure (in inches).
- **`dpi`**: Controls the resolution of the saved image.

---

### **Example 2: Save Plot as PDF and SVG**

```python
import matplotlib.pyplot as plt

x = [0, 1, 2, 3]
y = [0, 1, 4, 9]

plt.plot(x, y, linestyle='--', color='red')
plt.title("Quadratic Plot")

plt.show()

# Save as PDF and SVG with custom size
fig = plt.gcf()
fig.set_size_inches(6, 6)  # 6x6 inches

# Save the figure in different formats
fig.savefig("quadratic_plot.pdf")
fig.savefig("quadratic_plot.svg")
```

---

### **Notes:**
1. **Order of `plt.show()` and `plt.savefig()`**:
   - If you call `plt.show()`, the plot window will display the plot, but **the figure remains accessible** using `plt.gcf()` to save it afterward.
   - You can call `plt.savefig()` **before or after** `plt.show()`—both work, though if you save after `plt.show()`, use `plt.gcf()` to ensure the figure isn't lost.

2. **File Formats**:
   - **`PNG`**: Lossy but good for general use.
   - **`PDF`**: Ideal for vector-based plots (e.g., for publication).
   - **`SVG`**: Scalable vector graphics, best for web and design.

---

### **Example 3: Save Multiple Plots in a Single PDF File**

```python
from matplotlib.backends.backend_pdf import PdfPages

x = [1, 2, 3, 4]
y1 = [1, 4, 9, 16]
y2 = [2, 4, 6, 8]

# Create two plots
plt.figure()
plt.plot(x, y1, label="y = x^2")
plt.legend()

plt.figure()
plt.plot(x, y2, label="y = 2x", color='green')
plt.legend()

# Save both plots to a single PDF file
with PdfPages('multiple_plots.pdf') as pdf:
    pdf.savefig(plt.figure(1))  # Save the first plot
    pdf.savefig(plt.figure(2))  # Save the second plot
```

