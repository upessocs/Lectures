# Experiment 10: Shell Programming - Complete Guide

## Theory Explained

### 1. Modular and Reusable Code

**Modular programming** means breaking down a program into smaller, independent, and reusable components. In shell scripting, this is achieved through:

#### **Functions**
- Named blocks of code that can be called multiple times
- Improve code readability and maintainability
- Reduce code duplication

#### **Sourcing Scripts**
- Using `. script.sh` or `source script.sh` to include external scripts
- Makes functions and variables from the sourced file available in current script
- Unlike executing a script (which runs in a subshell), sourcing runs in current shell

### 2. Script Optimization Techniques

- **Avoid unnecessary subshells**: Each `$(command)` creates a new process, which is resource-intensive
- **Use built-in string operations**: Bash has built-in string manipulation that's faster than external commands like `expr`, `sed`, or `awk`
- **Minimize loops**: Use shell expansions and built-ins instead of loops when possible

---

## Lab Exercises Explained

### i. String Length

```bash
#!/bin/bash
echo "Enter a string:"
read str
echo "Length: ${#str}"
```

**Explanation:**
- `${#str}` is a **bash parameter expansion** that returns the length of the variable
- Much faster than `echo $str | wc -c` (which creates subshells and pipes)

### ii. Reverse String

```bash
#!/bin/bash
echo "Enter a string:"
read str
rev=""
len=${#str}
for (( i=$len-1; i>=0; i-- ))
do
    rev="$rev${str:$i:1}"
done
echo "Reversed: $rev"
```

**Explanation:**
- `${str:$i:1}` extracts 1 character from position `$i` (string slicing)
- Loop runs from last character to first
- Alternative: `echo $str | rev` (if `rev` command is available)

### iii. Concatenate Strings

```bash
#!/bin/bash
echo "Enter first string:"
read s1
echo "Enter second string:"
read s2
echo "Concatenated: $s1$s2"
```

**Explanation:**
- In bash, simple variable juxtaposition concatenates strings
- No need for special operators or functions

---

## Assignment Solutions

### 1. Factorial Function (Modular Approach)

**math.sh:**
```bash
#!/bin/bash

# Function to calculate factorial
factorial() {
    local n=$1
    local result=1
    
    if [ $n -eq 0 ] || [ $n -eq 1 ]; then
        echo 1
        return
    fi
    
    for (( i=2; i<=n; i++ ))
    do
        result=$((result * i))
    done
    
    echo $result
}
```

**main_script.sh:**
```bash
#!/bin/bash

# Source the external script
source math.sh

echo "Enter a number:"
read num

# Call the imported function
result=$(factorial $num)
echo "Factorial of $num is: $result"
```

### 2. Optimized Fibonacci Script with Functions

```bash
#!/bin/bash

# Function to calculate Fibonacci series
fibonacci() {
    local n=$1
    local a=0
    local b=1
    local temp
    
    echo "Fibonacci series up to $n terms:"
    
    for (( i=0; i<n; i++ ))
    do
        echo -n "$a "
        temp=$((a + b))
        a=$b
        b=$temp
    done
    echo
}

# Main script
echo "Enter number of terms:"
read terms

# Input validation
if [[ ! $terms =~ ^[0-9]+$ ]] || [ $terms -lt 1 ]; then
    echo "Error: Please enter a positive integer"
    exit 1
fi

# Call the function
fibonacci $terms
```

### 3. Filename Lengths in Directory

```bash
#!/bin/bash

echo "Enter directory path (press enter for current directory):"
read dirpath

# Use current directory if empty
if [ -z "$dirpath" ]; then
    dirpath="."
fi

# Check if directory exists
if [ ! -d "$dirpath" ]; then
    echo "Error: Directory '$dirpath' does not exist"
    exit 1
fi

echo "Filename lengths in '$dirpath':"
echo "--------------------------------"

# Process each file in the directory
for file in "$dirpath"/*
do
    if [ -e "$file" ]; then  # Check if file exists
        filename=$(basename "$file")
        length=${#filename}
        printf "%-30s : %2d characters\n" "$filename" "$length"
    fi
done
```

---

## Helpful Commands Reference

### **Shell Built-in Commands:**

| Command | Purpose | Example |
|---------|---------|---------|
| `echo` | Print text | `echo "Hello"` |
| `read` | Read input | `read variable` |
| `test` or `[ ]` | Conditional testing | `[ -f file.txt ]` |
| `export` | Set environment variable | `export PATH=...` |
| `source` or `.` | Execute script in current shell | `source utils.sh` |

### **String Operations:**
```bash
str="hello"
echo ${#str}          # Length: 5
echo ${str:1:3}       # Substring: ell
echo ${str#he}        # Remove prefix: llo
echo ${str%lo}        # Remove suffix: hel
```

### **File Test Operators:**
- `-f file` : True if file exists and is regular file
- `-d file` : True if file exists and is directory
- `-r file` : True if file exists and is readable
- `-w file` : True if file exists and is writable
- `-x file` : True if file exists and is executable

---

## **sed Command (Optional Read)**

### What is sed?
**sed** (Stream EDitor) is a powerful text processing tool that:
- Processes text line by line
- Can perform search, find/replace, insertion, deletion
- Works with files or standard input
- Uses regular expressions

### Basic Syntax:
```bash
sed [options] 'command' filename
```

### Common sed Commands:

#### 1. **Substitution (Find and Replace)**
```bash
# Basic substitution
sed 's/old/new/' file.txt

# Global substitution (all occurrences in line)
sed 's/old/new/g' file.txt

# Case insensitive substitution
sed 's/old/new/i' file.txt

# Substitute specific occurrence
sed 's/old/new/2' file.txt  # Replace only 2nd occurrence
```

#### 2. **Deletion**
```bash
# Delete specific line
sed '5d' file.txt           # Delete line 5
sed '2,5d' file.txt         # Delete lines 2-5

# Delete lines matching pattern
sed '/pattern/d' file.txt

# Delete empty lines
sed '/^$/d' file.txt
```

#### 3. **Printing**
```bash
# Print specific lines
sed -n '3p' file.txt        # Print only line 3
sed -n '1,5p' file.txt      # Print lines 1-5

# Print lines matching pattern
sed -n '/error/p' file.txt
```

#### 4. **Insertion and Appending**
```bash
# Insert before line
sed '3i\Insert this line' file.txt

# Append after line
sed '3a\Append this line' file.txt
```

### Practical sed Examples:

#### Example 1: Simple Text Replacement
```bash
# Replace "cat" with "dog" in file.txt
sed 's/cat/dog/g' file.txt

# Save changes to original file
sed -i 's/cat/dog/g' file.txt
```

#### Example 2: Remove Comments from Config File
```bash
# Remove lines starting with # (comments)
sed '/^#/d' config.txt

# Remove comments and empty lines
sed -e '/^#/d' -e '/^$/d' config.txt
```

#### Example 3: Extract Specific Lines
```bash
# Extract lines 10-20 from a file
sed -n '10,20p' largefile.txt > extracted.txt
```

#### Example 4: Multiple Operations
```bash
# Replace multiple patterns
sed -e 's/foo/bar/g' -e 's/hello/world/g' file.txt

# Using multiple commands file
sed -f commands.sed file.txt
```

#### Example 5: In-place Editing with Backup
```bash
# Edit file and create backup
sed -i.bak 's/old/new/g' file.txt
```

### Advanced sed Features:

#### Using Regular Expressions:
```bash
# Replace word at beginning of line
sed 's/^word/replacement/' file.txt

# Replace word at end of line
sed 's/word$/replacement/' file.txt

# Replace numbers with "NUM"
sed 's/[0-9][0-9]*/NUM/g' file.txt
```

#### Grouping and Backreferences:
```bash
# Swap two words
sed 's/\(word1\) \(word2\)/\2 \1/' file.txt

# Modern syntax (with -r option)
sed -r 's/(word1) (word2)/\2 \1/' file.txt
```

### Common sed Options:

| Option | Purpose |
|--------|---------|
| `-n` | Suppress automatic printing |
| `-i` | Edit files in-place |
| `-e` | Add multiple commands |
| `-r` | Use extended regular expressions |
| `-f` | Read commands from file |

### Real-world sed Use Cases:

1. **Config File Modification:**
```bash
# Change port in config file
sed -i 's/^Port.*/Port 2222/' /etc/ssh/sshd_config
```

2. **Log File Processing:**
```bash
# Extract error lines from log
sed -n '/ERROR/p' application.log
```

3. **CSV/Data File Processing:**
```bash
# Replace commas with tabs
sed 's/,/\t/g' data.csv
```

4. **HTML/XML Processing:**
```bash
# Remove HTML tags
sed 's/<[^>]*>//g' file.html
```

