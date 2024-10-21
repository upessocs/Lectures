# `Pandas`

Pandas is a powerful library for **data analysis and manipulation** in Python. Let's dive in step-by-step.


# **1. Overview of Pandas**
- **Pandas** provides easy-to-use data structures like **Series** and **DataFrames**.
- It allows for **data manipulation**, **cleaning**, **analysis**, and **exploration**.
- Built on **NumPy**, Pandas works well with **structured data**, such as CSV files, SQL tables, or Excel sheets.

---

# **2. Setup and Installation**
If you don’t have Pandas installed, run:
```bash
pip install pandas
```

Import it using:
```python
import pandas as pd
```

---

# **3. Data Structures in Pandas**

### **a) Series**: A **1D array** similar to a list or NumPy array.
```python
import pandas as pd

# Create a simple series
s = pd.Series([10, 20, 30, 40])
print(s)
```
**Output:**
```
0    10
1    20
2    30
3    40
dtype: int64
```

- **Index**: The left column (`0, 1, 2, 3`) represents the index.
- **Values**: The right column contains the data values.

---

### **b) DataFrame**: A **2D table** with labeled rows and columns.
```python
data = {
    'Name': ['Alice', 'Bob', 'Charlie'],
    'Age': [24, 27, 22],
    'City': ['New York', 'Los Angeles', 'Chicago']
}

df = pd.DataFrame(data)
print(df)
```
**Output:**
```
      Name  Age         City
0    Alice   24     New York
1      Bob   27  Los Angeles
2  Charlie   22     Chicago
```

---

# **4. Indexing and Selecting Data**

### **Selecting Columns**
```python
# Select a single column
print(df['Name'])

# Select multiple columns
print(df[['Name', 'Age']])
```

### **Selecting Rows by Index**
```python
# Select first two rows
print(df.iloc[:2])

# Select rows by label index
print(df.loc[1])
```

### **Boolean Indexing**
```python
# Select rows where Age > 23
print(df[df['Age'] > 23])
```

---

# **5. Groupby Operations**
Pandas **`groupby()`** is used to group data by a certain column and apply aggregate functions.

```python
data = {
    'Department': ['HR', 'HR', 'IT', 'IT', 'Finance'],
    'Employee': ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
    'Salary': [50000, 52000, 60000, 62000, 58000]
}
df = pd.DataFrame(data)

# Group by Department and calculate the mean salary
grouped = df.groupby('Department')['Salary'].mean()
print(grouped)
```

**Output:**
```
Department
Finance    58000.0
HR         51000.0
IT         61000.0
Name: Salary, dtype: float64
```

---

# **6. Reshaping Data**

### **Pivot Table**
Pivot tables allow you to **rearrange data** based on unique values in a column.

```python
data = {
    'City': ['New York', 'Los Angeles', 'New York', 'Chicago'],
    'Year': [2019, 2019, 2020, 2020],
    'Population': [8.4, 3.9, 8.3, 2.7]
}
df = pd.DataFrame(data)

# Create a pivot table with 'Year' as columns
pivot = df.pivot_table(values='Population', index='City', columns='Year')
print(pivot)
```

**Output:**
```
Year        2019  2020
City                  
Chicago      NaN   2.7
Los Angeles  3.9   NaN
New York     8.4   8.3
```

### **Melt Function**: Unpivot a DataFrame from wide to long format.
```python
# Melt the DataFrame
melted = pd.melt(df, id_vars=['City'], value_vars=['Year', 'Population'])
print(melted)
```

**Output:**
```
         City variable  value
0    New York     Year  2019.0
1  Los Angeles     Year  2019.0
2    New York     Year  2020.0
3     Chicago     Year  2020.0
4    New York  Population   8.4
...
```

---

# **Example: Q & A Assignment Using Pandas**

### **Q1: Create a DataFrame and Filter Employees with Salary > 60000.**
```python
import pandas as pd

data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'David'],
    'Department': ['IT', 'HR', 'IT', 'Finance'],
    'Salary': [50000, 52000, 62000, 58000]
}
df = pd.DataFrame(data)

# Filter employees with Salary > 60000
high_salary = df[df['Salary'] > 60000]
print(high_salary)
```

---

### **Q2: Group the Following Data by Department and Find the Total Salary.**

```python
data = {
    'Department': ['HR', 'HR', 'IT', 'IT', 'Finance'],
    'Employee': ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
    'Salary': [50000, 52000, 60000, 62000, 58000]
}
df = pd.DataFrame(data)

# Group by Department and calculate the total salary
grouped = df.groupby('Department')['Salary'].sum()
print(grouped)
```

---

### **Q3: Reshape the Data Below Using Pivot.**

```python
data = {
    'City': ['New York', 'New York', 'Chicago', 'Chicago'],
    'Year': [2019, 2020, 2019, 2020],
    'Sales': [200, 250, 150, 180]
}
df = pd.DataFrame(data)

# Create a pivot table
pivot = df.pivot(index='City', columns='Year', values='Sales')
print(pivot)
```

---

### **Q4: Use Boolean Indexing to Select All Employees in the IT Department.**

```python
# Filter employees in the IT department
it_employees = df[df['Department'] == 'IT']
print(it_employees)
```

---

# **Summary**

| **Topic**                | **Description** |
|--------------------------|-----------------|
| **Data Structures**      | `Series` (1D) and `DataFrame` (2D). |
| **Indexing & Selection** | Access rows/columns with `.iloc`, `.loc`, or boolean indexing. |
| **Groupby**              | Group by a column and apply aggregate functions. |
| **Reshaping**            | Use `pivot` and `melt` to restructure data. |

---

Here’s a guide on how to use **Pandas to read, modify, and save Excel files**. Pandas offers convenient functions to interact with **Excel spreadsheets**, such as `read_excel()` and `to_excel()`.

---

# **1. Install Dependencies**
To handle Excel files, you need **openpyxl** (for `.xlsx`) and **xlrd** (for `.xls`). Install them using:
```bash
pip install pandas openpyxl xlrd
```

---

# **2. Reading an Excel File**

### **Reading the Entire File**
```python
import pandas as pd

# Read the Excel file (use the appropriate sheet name or index)
df = pd.read_excel('data.xlsx', sheet_name='Sheet1')  # Or sheet_name=0 for the first sheet
print(df)
```

### **Reading Specific Columns**
```python
# Read only the 'Name' and 'Age' columns
df = pd.read_excel('data.xlsx', usecols=['Name', 'Age'])
print(df)
```

### **Reading Multiple Sheets**
```python
# Load multiple sheets into a dictionary
sheets = pd.read_excel('data.xlsx', sheet_name=None)  # None loads all sheets
for sheet_name, sheet_data in sheets.items():
    print(f'Sheet: {sheet_name}')
    print(sheet_data)
```

---

# **3. Modifying Excel Data**

### **Adding a New Column**
```python
df['New Column'] = df['Age'] + 5  # Example: Add 5 to the 'Age' column
print(df)
```

### **Filtering Data**
```python
# Filter rows where Age > 25
filtered_df = df[df['Age'] > 25]
print(filtered_df)
```

### **Updating Values**
```python
# Update all 'Age' values by adding 1
df['Age'] = df['Age'] + 1
print(df)
```

---

# **4. Saving Data to an Excel File**

### **Saving to a New Excel File**
```python
df.to_excel('modified_data.xlsx', index=False)  # Disable the default index column
```

### **Saving to a Specific Sheet**
```python
df.to_excel('modified_data.xlsx', sheet_name='Modified Data', index=False)
```

### **Appending Data to an Existing Excel File**
You can use **ExcelWriter** to manage multiple sheets:
```python
with pd.ExcelWriter('modified_data.xlsx', engine='openpyxl', mode='a') as writer:
    df.to_excel(writer, sheet_name='Appended Data', index=False)
```

---

# **5. Handling Excel Files with Multiple Sheets**

### **Example: Read from One Sheet, Modify, and Save to Another Sheet**
```python
# Read from 'Sheet1'
df = pd.read_excel('data.xlsx', sheet_name='Sheet1')

# Modify data: Add 10 to the 'Salary' column
df['Salary'] = df['Salary'] + 10

# Save the modified data to 'Sheet2'
with pd.ExcelWriter('data.xlsx', engine='openpyxl', mode='a') as writer:
    df.to_excel(writer, sheet_name='Sheet2', index=False)
```

---

# **6. Advanced Example: Combining Multiple Excel Files**

If you have multiple Excel files, you can **merge them into one**.

```python
import glob

# Get all Excel files in the current directory
excel_files = glob.glob('*.xlsx')

# Read and combine all files into a single DataFrame
combined_df = pd.concat([pd.read_excel(file) for file in excel_files])

# Save the combined data to a new Excel file
combined_df.to_excel('combined_data.xlsx', index=False)
```

---

# **Summary**

| **Operation**        | **Function**                |
|----------------------|-----------------------------|
| **Read Excel File**  | `pd.read_excel()`           |
| **Write Excel File** | `df.to_excel()`             |
| **Manage Sheets**    | `ExcelWriter` for multiple sheets |
| **Filter Data**      | Boolean indexing            |
| **Update Values**    | Direct column modification |

