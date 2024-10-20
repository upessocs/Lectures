The `os` module in Python provides a way to interact with the underlying operating system. It offers functions for file handling, directory management, environment variables, and platform detection. Let's explore some of the key functions and submodules of `os` with example questions and explanations.

---

### 1. **Get the Current Working Directory**
**Question**: Write a program to print the current working directory using the `os` module.

**Code**:
```python
import os

# Get the current working directory
cwd = os.getcwd()
print(f"Current Working Directory: {cwd}")
```

**Explanation**:  
- `os.getcwd()` returns the path of the current working directory.
- This function is useful to know where your Python script is being executed.

---

### 2. **Change the Current Working Directory**
**Question**: Write a program that changes the working directory to another location and confirms the change.

**Code**:
```python
import os

# Change directory to user's home directory
os.chdir(os.path.expanduser('~'))

# Verify the change
print(f"Changed Directory: {os.getcwd()}")
```

**Explanation**:  
- `os.chdir(path)` changes the working directory to the given `path`.
- `os.path.expanduser('~')` returns the path to the user’s home directory.

---

### 3. **Create a New Directory**
**Question**: Write a program that creates a directory named `new_folder` if it doesn't exist.

**Code**:
```python
import os

# Check if the directory exists, if not, create it
if not os.path.exists('new_folder'):
    os.mkdir('new_folder')
    print("Directory 'new_folder' created")
else:
    print("Directory already exists")
```

**Explanation**:  
- `os.mkdir(path)` creates a directory with the specified path.
- `os.path.exists(path)` checks if a path exists, which prevents errors when trying to create an existing directory.

---

### 4. **List Files in a Directory**
**Question**: Write a program to list all files and directories in the current directory.

**Code**:
```python
import os

# List files and directories
items = os.listdir()
print("Items in current directory:", items)
```

**Explanation**:  
- `os.listdir(path='.')` returns a list of files and directories in the given directory. If no path is provided, it defaults to the current directory.

---

### 5. **Rename a File or Directory**
**Question**: Write a program that renames `new_folder` to `renamed_folder`.

**Code**:
```python
import os

# Rename directory
if os.path.exists('new_folder'):
    os.rename('new_folder', 'renamed_folder')
    print("Directory renamed to 'renamed_folder'")
else:
    print("Directory 'new_folder' does not exist")
```

**Explanation**:  
- `os.rename(src, dst)` renames the file or directory from `src` to `dst`.

---

### 6. **Delete a Directory**
**Question**: Write a program to delete the `renamed_folder`.

**Code**:
```python
import os

# Remove the directory if it exists
if os.path.exists('renamed_folder'):
    os.rmdir('renamed_folder')
    print("Directory 'renamed_folder' removed")
else:
    print("Directory does not exist")
```

**Explanation**:  
- `os.rmdir(path)` removes an empty directory.

---

### 7. **Get Information About the Operating System**
**Question**: Write a program to print the name of the operating system and the current process ID.

**Code**:
```python
import os

# Print OS name and process ID
print(f"Operating System: {os.name}")
print(f"Process ID: {os.getpid()}")
```

**Explanation**:  
- `os.name` returns the name of the OS ('posix', 'nt', or 'java').
- `os.getpid()` returns the current process ID.

---

### 8. **Working with Environment Variables**
**Question**: Write a program to print all environment variables and access the `PATH` variable.

**Code**:
```python
import os

# Print all environment variables
env_vars = os.environ
print("Environment Variables:", env_vars)

# Access the PATH variable
path_var = os.getenv('PATH')
print(f"PATH: {path_var}")
```

**Explanation**:  
- `os.environ` returns a dictionary of environment variables.
- `os.getenv(varname)` retrieves the value of the environment variable `varname`.

---

### 9. **Check OS Type (Windows vs Others)**
**Question**: Write a program to check if the OS is Windows.

**Code**:
```python
import os

# Check if OS is Windows
if os.name == 'nt':
    print("Running on Windows")
else:
    print("Not running on Windows")
```

**Explanation**:  
- This check is helpful when writing platform-specific code since `os.name` returns `'nt'` for Windows and `'posix'` for Unix-like systems.

---

### 10. **Execute System Commands**
**Question**: Write a program to execute a system command to list files in the directory.

**Code**:
```python
import os

# Execute system command
os.system('dir' if os.name == 'nt' else 'ls')
```

**Explanation**:  
- `os.system(command)` runs a shell command from within a Python script.
- The command is chosen based on the operating system: `'dir'` for Windows and `'ls'` for Unix-like systems.

---

### Summary of Important Functions and Submodules in `os`:

| Function/Attribute        | Description                                          |
|---------------------------|------------------------------------------------------|
| `os.getcwd()`             | Get current working directory                        |
| `os.chdir(path)`          | Change current working directory                     |
| `os.mkdir(path)`          | Create a new directory                               |
| `os.rmdir(path)`          | Remove an empty directory                            |
| `os.listdir(path)`        | List files and directories in the given path         |
| `os.rename(src, dst)`     | Rename a file or directory                           |
| `os.remove(file)`         | Remove a file                                        |
| `os.name`                 | Get the OS name ('posix', 'nt', 'java')              |
| `os.getpid()`             | Get the current process ID                           |
| `os.getenv(varname)`      | Get the value of an environment variable             |
| `os.system(command)`      | Execute a system command                             |
| `os.path`                 | Submodule for file and directory path manipulation   |

---





# `path` submodule of `os`


> The `os.path` module in Python provides a set of functions for manipulating **file and directory paths**. It is especially useful for checking, joining, normalizing, and navigating file paths in a cross-platform way (i.e., paths work correctly on Windows, Linux, and macOS). Let's explore the key functions and their use with examples and explanations.

---

## **Key Functions in `os.path`**

| **Function**             | **Description** |
|--------------------------|-----------------|
| `os.path.join()`          | Joins one or more path components intelligently. |
| `os.path.abspath()`       | Returns the absolute path of a given file or directory. |
| `os.path.exists()`        | Checks if a given path exists. |
| `os.path.isfile()`        | Checks if the given path points to a file. |
| `os.path.isdir()`         | Checks if the given path points to a directory. |
| `os.path.basename()`      | Returns the base name (last component) of a path. |
| `os.path.dirname()`       | Returns the directory name of a path. |
| `os.path.split()`         | Splits the path into a tuple of (directory, file). |
| `os.path.splitext()`      | Splits a file into (name, extension). |
| `os.path.getsize()`       | Returns the size of a file (in bytes). |
| `os.path.normpath()`      | Normalizes a path, fixing slashes and redundant components. |
| `os.path.isabs()`         | Checks if the given path is absolute. |
| `os.path.relpath()`       | Computes the relative path from one location to another. |

---

## **Detailed Explanation with Examples**

---

### 1. **Joining Paths with `os.path.join()`**  
This function is **cross-platform friendly**. It ensures that path separators (`/` or `\`) are correctly handled, depending on the operating system.

```python
import os

# Join folder and file name to create a path
path = os.path.join("folder", "subfolder", "file.txt")
print(path)
```

**Output on Windows**:  
```
folder\subfolder\file.txt
```

**Output on Linux/macOS**:  
```
folder/subfolder/file.txt
```

**Explanation**:  
`os.path.join()` ensures that paths are properly separated according to the underlying OS.

---

### 2. **Get the Absolute Path with `os.path.abspath()`**

```python
import os

# Get the absolute path of a file
relative_path = "file.txt"
absolute_path = os.path.abspath(relative_path)
print(f"Absolute Path: {absolute_path}")
```

**Output**:  
```
/Users/username/current_directory/file.txt
```

**Explanation**:  
`os.path.abspath()` converts a **relative path** to an **absolute path** by appending the current working directory to it.

---

### 3. **Check Path Existence with `os.path.exists()`**

```python
import os

# Check if a path exists
path = "file.txt"
if os.path.exists(path):
    print("Path exists")
else:
    print("Path does not exist")
```

**Explanation**:  
- `os.path.exists()` returns `True` if the path exists, whether it is a file or directory.
- Use this function to avoid errors when trying to open or modify files.

---

### 4. **Check if a Path is a File or Directory**

```python
import os

# Check if the path is a file
path = "example.txt"
if os.path.isfile(path):
    print("It's a file")

# Check if the path is a directory
dir_path = "my_folder"
if os.path.isdir(dir_path):
    print("It's a directory")
```

**Explanation**:  
- `os.path.isfile()` checks if the given path points to a file.
- `os.path.isdir()` checks if the given path points to a directory.

---

### 5. **Extract File Name and Directory Name with `basename()` and `dirname()`**

```python
import os

path = "/home/user/documents/report.pdf"

# Get the base name (file name with extension)
print("Base Name:", os.path.basename(path))  # Output: report.pdf

# Get the directory name
print("Directory Name:", os.path.dirname(path))  # Output: /home/user/documents
```

**Explanation**:  
- `os.path.basename()` extracts the **last component** of the path (usually a file name).
- `os.path.dirname()` extracts the **directory path** from the full path.

---

### 6. **Split Path with `os.path.split()`**

```python
import os

path = "/home/user/documents/report.pdf"
directory, file = os.path.split(path)
print(f"Directory: {directory}, File: {file}")
```

**Output**:  
```
Directory: /home/user/documents, File: report.pdf
```

**Explanation**:  
`os.path.split()` splits a path into **two parts**: the directory and the last component (file).

---

### 7. **Split File Extension with `os.path.splitext()`**

```python
import os

file = "report.pdf"
name, extension = os.path.splitext(file)
print(f"Name: {name}, Extension: {extension}")
```

**Output**:  
```
Name: report, Extension: .pdf
```

**Explanation**:  
`os.path.splitext()` splits the file into two parts: the **name** and the **extension** (including the dot `.`).

---

### 8. **Get File Size with `os.path.getsize()`**

```python
import os

# Get the size of a file in bytes
file_size = os.path.getsize("example.txt")
print(f"File Size: {file_size} bytes")
```

**Explanation**:  
`os.path.getsize()` returns the **size of the file** in bytes. This function raises an error if the file doesn't exist.

---

### 9. **Normalize a Path with `os.path.normpath()`**

```python
import os

# Normalize a path with redundant components
path = "/home/user//documents/../report.pdf"
normalized_path = os.path.normpath(path)
print(f"Normalized Path: {normalized_path}")
```

**Output**:  
```
/home/user/report.pdf
```

**Explanation**:  
`os.path.normpath()` simplifies the path by resolving redundant slashes (`//`) and `..` (parent directory) references.

---

### 10. **Check if a Path is Absolute with `os.path.isabs()`**

```python
import os

path = "/home/user/documents"
print(f"Is Absolute Path: {os.path.isabs(path)}")
```

**Output**:  
```
Is Absolute Path: True
```

**Explanation**:  
`os.path.isabs()` returns `True` if the path is absolute (i.e., starts from the root directory).

---

### 11. **Get Relative Path with `os.path.relpath()`**

```python
import os

# Get the relative path from /home/user to /home/user/documents/report.pdf
rel_path = os.path.relpath("/home/user/documents/report.pdf", "/home/user")
print(f"Relative Path: {rel_path}")
```

**Output**:  
```
documents/report.pdf
```

**Explanation**:  
`os.path.relpath()` computes the **relative path** between two directories.

---

## **Summary**

| **Function**             | **Usage** |
|--------------------------|-----------|
| `os.path.join()`          | Joins multiple path components intelligently. |
| `os.path.abspath()`       | Converts a relative path to an absolute path. |
| `os.path.exists()`        | Checks if a path exists. |
| `os.path.isfile()`        | Checks if a path points to a file. |
| `os.path.isdir()`         | Checks if a path points to a directory. |
| `os.path.basename()`      | Extracts the file name from a path. |
| `os.path.dirname()`       | Extracts the directory path from a path. |
| `os.path.split()`         | Splits a path into (directory, file). |
| `os.path.splitext()`      | Splits a file into (name, extension). |
| `os.path.getsize()`       | Returns the size of a file in bytes. |
| `os.path.normpath()`      | Normalizes a path. |
| `os.path.isabs()`         | Checks if a path is absolute. |
| `os.path.relpath()`       | Computes a relative path. |

> These examples and explanations should help you understand the **`os.path`** submodule and how to use it for **file path operations**. 












---

### **Assignment Questions on the `os` Module**

---

### 1. **Directory and File Operations**  
**Problem**:  
Write a Python program to perform the following operations:  
1. Create a directory named `Project`.
2. Inside the `Project` directory, create a file named `info.txt`.
3. Rename the `info.txt` file to `details.txt`.
4. Verify that the directory and file were created and renamed successfully.  
5. Finally, delete the file and directory.

**Hint**: Use `os.mkdir()`, `os.rename()`, `os.path.exists()`, and `os.rmdir()`.

---

### 2. **List Only Files from a Directory**  
**Problem**:  
Write a program that lists **only files** (not directories) from the current working directory. If there are no files, print "No files found."  

**Hint**:  
- Use `os.listdir()` to get all items in the directory.
- Use `os.path.isfile()` to filter files.

---

### 3. **Check for a Specific Environment Variable**  
**Problem**:  
Write a program that checks if the `HOME` or `USERPROFILE` environment variable exists (depending on the OS). If it exists, print its value. If not, print "Environment variable not found."  

**Hint**:  
Use `os.name` to detect the OS and `os.getenv()` to get the environment variable.

---

### 4. **Execute System Commands Based on OS**  
**Problem**:  
Write a program that executes the following **system commands** based on the operating system:
1. If the OS is **Windows**, run the command to list files (`dir`).
2. If the OS is **Unix-like**, run the command (`ls -l`).  
The output of the command should be printed in the console.

**Hint**: Use `os.system()` to execute system commands and `os.name` to detect the OS.

---

### 5. **Directory Size Calculator**  
**Problem**:  
Write a Python function that calculates the total size (in bytes) of all files in a given directory. The program should prompt the user to enter the directory path and print the total size of the files.

**Hint**: Use `os.listdir()` and `os.path.getsize()`.

---

### 6. **Check Disk Space**  
**Problem**:  
Create a program that checks the **free space available** on the disk where the current working directory is located. Print the total, used, and free space in bytes.

**Hint**: Use `os.statvfs()` on Unix-like systems.

---

### 7. **Create a Directory Tree**  
**Problem**:  
Write a program to create the following directory structure:  
```
/MainProject  
    /SubProject1  
    /SubProject2  
        /SubSubProject
```
After creating the directories, list all the directories inside `/MainProject`.

**Hint**: Use `os.makedirs()` to create nested directories and `os.listdir()` to list them.

---

### 8. **Log Current Working Directory and OS Details**  
**Problem**:  
Create a program that writes the following information into a **log file** named `system_log.txt`:
1. Current Working Directory
2. OS Name
3. Process ID  
Ensure the log file is created in the same directory as the script.

**Hint**: Use `os.getcwd()`, `os.name`, and `os.getpid()`.

---

### 9. **Temporary File Creation and Cleanup**  
**Problem**:  
Write a program that:
1. Creates a **temporary directory** and prints its path.
2. Creates a file named `temp.txt` inside the temporary directory.
3. Waits for 5 seconds and then deletes the file and directory.

**Hint**: Use `os.mkdir()` and `os.remove()`. You can use `time.sleep()` to introduce a delay.

---

### 10. **Search for a File in Directories**  
**Problem**:  
Write a program that searches for a file named `target.txt` in all directories starting from the **current working directory**. If the file is found, print its path; otherwise, print "File not found."

**Hint**:  
- Use `os.walk()` to recursively traverse directories.
- Use `os.path.join()` to build paths.

---

### 11. **Detect Hidden Files in a Directory**  
**Problem**:  
Write a program that lists all **hidden files** from the current directory. On **Unix-like systems**, hidden files start with a `.`. On **Windows**, they are marked as hidden.

**Hint**:  
- Use `os.listdir()` and filter by filenames starting with a `.` for Unix-like systems.
- Use `os.system('attrib')` on Windows to check hidden files.

---

### 12. **Cross-Platform Path Handling**  
**Problem**:  
Write a program that takes a file path as input and prints the **absolute path** in a cross-platform way. Use the appropriate functions from the `os.path` submodule to ensure the path works on all operating systems.

**Hint**: Use `os.path.abspath()` and `os.path.join()`.

---

### 13. **Backup and Restore Script**  
**Problem**:  
Write a script that:
1. Takes a directory path as input.
2. Creates a backup copy of all the files from the given directory into a new directory named `backup`.
3. List the contents of the `backup` directory to verify the files are copied.

**Hint**:  
- Use `os.makedirs()` to create the `backup` directory.
- Use `os.rename()` or `os.system()` to copy files.

---

### 14. **Detecting Windows or Linux OS**  
**Problem**:  
Write a program to detect if the **host OS** is Windows, Linux, or macOS.  
Print a different message for each OS type.

**Hint**: Use `os.name` and additional checks using `platform.system()`.

---

### 15. **Python Version Detector**  
**Problem**:  
Write a program that uses the `os` module to detect and print the version of Python installed on the system. If multiple versions are installed, print the version for which the script is running.

**Hint**: Use `os.system('python --version')`.

