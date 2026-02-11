# Experiment 11
## **Interacting with Users: Interactive Shell Scripts**

### **1. Interactive Shell Scripts**

Interactive scripts engage users in two-way communication, making programs more user-friendly and adaptable.

#### **Key Components:**

#### **read Command**
- Reads input from standard input (keyboard) or file
- Stores input in variables
- Various options for controlling input behavior

**A. User Input with `read`**
- Basic input capture: `read variable_name`
- Advanced features:
  ```bash
  read -p "Enter your name: " name          # Prompt with input
  read -s -p "Password: " pass             # Silent input (for passwords)
  read -t 10 -p "Quick response: " answer  # Timeout after 10 seconds
  read -n 1 -p "Continue? (y/n): " choice  # Read single character
  ```

#### **select Command**
- Creates interactive menus automatically
- Provides numbered options for user selection
- Built-in loop for handling user choices

**B. Menu Systems with `select`**
- Automatic menu generation with numbered options
- Built-in loop handling
- Example:
  ```bash
  PS3="Select option: "
  select option in "Start" "Stop" "Status" "Exit"
  do
      case $REPLY in
          1) echo "Starting...";;
          2) echo "Stopping...";;
          3) echo "Status: Running";;
          4) break;;
          *) echo "Invalid option";;
      esac
  done
  ```

**C. Input Validation**
- Check for empty inputs
- Validate data types (numbers, email formats, etc.)
- Range checking for numerical inputs

#### **Benefits:**
- **User-Friendly**: Guides users through process
- **Error Prevention**: Validates inputs before processing
- **Flexibility**: Adapts to different user needs
- **Accessibility**: Clear prompts and feedback

---

## **2. Parsing and Processing Data Formats**

### **Theory Overview**

Data parsing involves extracting, transforming, and restructuring data from various formats for analysis or storage.

> Text processing tools are essential for handling structured data:

- **cut** - Extract columns/sections from lines
- **awk** - Pattern scanning and processing language
- **sed** - Stream editor for filtering and transforming text

#### **Common Data Formats:**

**A. Structured Text Formats:**
- **CSV (Comma-Separated Values)**: Simple tabular data
- **TSV (Tab-Separated Values)**: Tab-delimited data
- **Fixed-width**: Data in specific column positions
- **JSON/XML**: Hierarchical data structures

**B. Key Processing Tools:**

**`cut` - Column Extraction**
- Extract specific columns or character ranges
- Syntax: `cut -d',' -f1,3 file.csv` (comma-delimited, fields 1 & 3)
- Useful for: Simple column extraction, fixed-width data

**`awk` - Pattern Processing**
- Programming language for text processing
- Handles: Field separation, calculations, pattern matching
- Syntax: `awk -F',' '{print $1, $3*2}' data.csv`
- Useful for: Complex transformations, calculations, reporting

**`sed` - Stream Editing**
- Find/replace, insertion, deletion operations
- Syntax: `sed 's/old/new/g' file.txt`
- Useful for: Bulk text replacement, filtering lines

#### **Processing Pipeline:**
```
Raw Data → Extract → Transform → Validate → Output
     ↓        ↓         ↓         ↓        ↓
   File    cut/awk    sed/awk   grep    Format
```

#### **Real-world Applications:**
- **Log Analysis**: Extract error patterns, count occurrences
- **Data Cleaning**: Remove duplicates, fix formatting issues
- **Report Generation**: Summarize data, calculate metrics
- **Configuration Management**: Update settings across multiple files

---

## **3. Interacting with Databases (Code Optional)**

### **Theory Overview**

Shell scripts can interact with databases through command-line clients, enabling automation of database operations.


> Shell scripts can connect to databases using command-line clients:
- **MySQL**: `mysql -u user -p database`
- **PostgreSQL**: `psql -U user -d database`
- **SQLite**: `sqlite3 database.db`

#### **Database Interaction Methods:**

**A. Direct Command Execution**
```bash
# MySQL
mysql -u username -p -e "SELECT * FROM users;" database

# PostgreSQL  
psql -U username -d database -c "SELECT * FROM products;"

# SQLite
sqlite3 database.db "SELECT * FROM orders;"
```

**B. Script File Execution**
```bash
# Execute SQL from file
mysql -u user -p database < queries.sql
psql -U user -d database -f script.sql
```

**C. Interactive Sessions**
```bash
# Start interactive session
mysql -u user -p
psql -U user -d database
```

#### **Key Components:**

**1. Connection Parameters:**
- **Host**: Database server address
- **Port**: Connection port (default: MySQL-3306, PostgreSQL-5432)
- **Credentials**: Username and password
- **Database**: Target database name

**2. SQL Injection Prevention:**
- Use parameterized queries when possible
- Validate and sanitize user inputs
- Avoid constructing queries with string concatenation

**3. Output Handling:**
- Format results for readability
- Process query results in shell variables
- Handle NULL values and special characters

#### **Common Operations:**

**A. Data Retrieval:**
```bash
# Get single value
count=$(mysql -u user -p -N -e "SELECT COUNT(*) FROM users;")

# Process multiple rows
mysql -u user -p -B -e "SELECT name, email FROM users;" | while read name email; do
    echo "User: $name, Email: $email"
done
```

**B. Data Modification:**
```bash
# Insert/Update data
mysql -u user -p -e "INSERT INTO logs (message) VALUES ('Script executed');"

# Batch operations from file
mysql -u user -p database < data_import.sql
```

**C. Backup and Maintenance:**
```bash
# Database backup
mysqldump -u user -p database > backup.sql
pg_dump -U user database > backup.sql

# Restore from backup
mysql -u user -p database < backup.sql
psql -U user -d database < backup.sql
```

#### **Security Considerations:**
- **Credentials Management**: Store passwords securely, not in plain text
- **Connection Security**: Use SSL/TLS for remote connections
- **Error Handling**: Gracefully handle connection failures
- **Permissions**: Use database accounts with minimal required privileges

#### **Benefits of Database Interaction:**
- **Automation**: Schedule regular database maintenance tasks
- **Integration**: Connect databases with other system components
- **Monitoring**: Create custom monitoring and alerting systems
- **Reporting**: Generate automated reports from live data

---

## **Practical Integration Example**

```bash
#!/bin/bash
# Complete example integrating all three concepts

# Interactive user input
read -p "Enter customer ID: " customer_id

# Input validation
if [[ ! "$customer_id" =~ ^[0-9]+$ ]]; then
    echo "Error: Invalid customer ID"
    exit 1
fi

# Parse and process data from database
result=$(mysql -u root -p -N -e "
    SELECT o.order_id, p.product_name, o.quantity 
    FROM orders o 
    JOIN products p ON o.product_id = p.id 
    WHERE o.customer_id = $customer_id
" sales_db)

# Process the data
echo "Customer $customer_id Order History:"
echo "$result" | awk '{printf "Order: %-6s Product: %-20s Qty: %s\n", $1, $2, $3}'
```

This theoretical foundation enables creation of robust, interactive shell scripts that can handle user input, process various data formats, and interact with database systems effectively.















---

## Lab Exercises Explained

### i. Split Sentence into Words

```bash
#!/bin/bash
echo "Enter a sentence:"
read sentence
for word in $sentence; do
    echo "$word"
done
```

**Explanation:**
- When `$sentence` is unquoted in the for loop, word splitting occurs
- By default, splits on spaces, tabs, and newlines (IFS - Internal Field Separator)
- Each word becomes a separate iteration in the loop

**Enhanced version with IFS control:**
```bash
#!/bin/bash
echo "Enter a sentence:"
read sentence

# Save original IFS and set to space only
OLD_IFS="$IFS"
IFS=$' '

for word in $sentence; do
    echo "Word: $word"
done

# Restore original IFS
IFS="$OLD_IFS"
```

### ii. Palindrome Check

```bash
#!/bin/bash
echo "Enter string:"
read str
rev=$(echo "$str" | rev)

if [ "$str" = "$rev" ]; then
    echo "Palindrome"
else
    echo "Not palindrome"
fi
```

**Explanation:**
- `rev` command reverses the string character by character
- Comparison checks if original equals reversed
- Case-sensitive comparison

**Enhanced version (case-insensitive, ignore spaces):**
```bash
#!/bin/bash
echo "Enter string:"
read str

# Remove spaces and convert to lowercase
cleaned_str=$(echo "$str" | tr -d ' ' | tr '[:upper:]' '[:lower:]')
rev=$(echo "$cleaned_str" | rev)

if [ "$cleaned_str" = "$rev" ]; then
    echo "'$str' is a palindrome"
else
    echo "'$str' is not a palindrome"
fi
```

---

## Assignment Solutions

### 1. CSV File Processing - Print First Column

```bash
#!/bin/bash

echo "Enter CSV filename:"
read filename

# Check if file exists
if [ ! -f "$filename" ]; then
    echo "Error: File '$filename' not found!"
    exit 1
fi

echo "First column values:"
echo "-------------------"

# Method 1: Using cut (simple CSV)
cut -d',' -f1 "$filename"

# Alternative Method 2: Using awk (handles quoted fields better)
# awk -F',' '{print $1}' "$filename"

# Alternative Method 3: Using IFS with while loop (most robust)
# while IFS=',' read -r col1 rest
# do
#     echo "$col1"
# done < "$filename"
```

**Enhanced CSV processor with header handling:**
```bash
#!/bin/bash

echo "Enter CSV filename:"
read filename

if [ ! -f "$filename" ]; then
    echo "Error: File '$filename' not found!"
    exit 1
fi

echo "Do you want to skip header? (y/n):"
read skip_header

echo "First column values:"
echo "-------------------"

if [ "$skip_header" = "y" ] || [ "$skip_header" = "Y" ]; then
    # Skip first line (header)
    tail -n +2 "$filename" | cut -d',' -f1
else
    cut -d',' -f1 "$filename"
fi
```

### 2. Interactive Menu System

```bash
#!/bin/bash

# Function definitions
show_date() {
    echo "Current date and time: $(date)"
}

show_calendar() {
    echo "Current month calendar:"
    cal
}

show_disk_usage() {
    echo "Disk usage:"
    df -h
}

show_memory_info() {
    echo "Memory information:"
    free -h
}

# Main menu
while true; do
    echo ""
    echo "=== SYSTEM INFORMATION MENU ==="
    echo "1. Show current date and time"
    echo "2. Show calendar"
    echo "3. Show disk usage"
    echo "4. Show memory information"
    echo "5. Exit"
    echo ""
    
    read -p "Please select an option (1-5): " choice
    
    case $choice in
        1)
            show_date
            ;;
        2)
            show_calendar
            ;;
        3)
            show_disk_usage
            ;;
        4)
            show_memory_info
            ;;
        5)
            echo "Goodbye!"
            break
            ;;
        *)
            echo "Invalid option! Please enter a number between 1-5."
            ;;
    esac
    
    read -p "Press Enter to continue..."
    clear
done
```

**Using select command (alternative approach):**
```bash
#!/bin/bash

PS3="Please select an option (1-5): "

select option in "Show date" "Show calendar" "Show disk usage" "Show memory" "Exit"
do
    case $REPLY in
        1)
            echo "Current date and time: $(date)"
            ;;
        2)
            echo "Current month calendar:"
            cal
            ;;
        3)
            echo "Disk usage:"
            df -h
            ;;
        4)
            echo "Memory information:"
            free -h
            ;;
        5)
            echo "Goodbye!"
            break
            ;;
        *)
            echo "Invalid option!"
            ;;
    esac
    echo ""
done
```

### 3. Dictionary Word Check

```bash
#!/bin/bash

DICTIONARY="/usr/share/dict/words"

# Check if dictionary file exists
if [ ! -f "$DICTIONARY" ]; then
    echo "Error: Dictionary file not found at $DICTIONARY"
    echo "Try installing with: sudo apt install wamerican"  # For Ubuntu/Debian
    exit 1
fi

echo "Enter a word to check in dictionary:"
read word

# Convert to lowercase for case-insensitive search
word_lower=$(echo "$word" | tr '[:upper:]' '[:lower:]')

# Method 1: Using grep (exact match)
if grep -q "^${word_lower}$" "$DICTIONARY"; then
    echo "'$word' exists in the dictionary."
else
    echo "'$word' does not exist in the dictionary."
fi

# Alternative Method 2: Using awk
# if awk -v word="$word_lower" 'tolower($0) == word {found=1; exit} END{exit !found}' "$DICTIONARY"; then
#     echo "'$word' exists in the dictionary."
# else
#     echo "'$word' does not exist in the dictionary."
# fi
```

**Enhanced dictionary checker with suggestions:**
```bash
#!/bin/bash

DICTIONARY="/usr/share/dict/words"

if [ ! -f "$DICTIONARY" ]; then
    echo "Error: Dictionary file not found!"
    exit 1
fi

echo "Enter a word to check:"
read word

word_lower=$(echo "$word" | tr '[:upper:]' '[:lower:]')

if grep -q "^${word_lower}$" "$DICTIONARY"; then
    echo "✓ '$word' is a valid English word."
else
    echo "✗ '$word' is not found in the dictionary."
    
    # Show suggestions
    echo ""
    echo "Similar words:"
    grep -i "^${word:0:3}" "$DICTIONARY" | head -5
fi
```

---

## **expr Command - Comprehensive Guide**

### What is expr?
**expr** (expression evaluator) is a command-line utility that:
- Evaluates expressions and prints result
- Handles integer arithmetic, string operations, and pattern matching
- Available on all Unix-like systems
- Useful in shell scripts for basic calculations

### Basic Syntax:
```bash
expr expression
```

### Common expr Operations:

#### 1. **Arithmetic Operations**
```bash
# Addition
expr 10 + 5        # Output: 15

# Subtraction  
expr 20 - 8        # Output: 12

# Multiplication (need to escape *)
expr 6 \* 4        # Output: 24

# Division
expr 15 / 3        # Output: 5

# Modulus
expr 17 % 5        # Output: 2
```

#### 2. **String Operations**
```bash
# String length
expr length "hello"          # Output: 5

# Substring extraction
expr substr "hello world" 7 5  # Output: world

# Character position/index
expr index "hello" "e"       # Output: 2
```

#### 3. **Pattern Matching**
```bash
# Match characters from beginning
expr match "hello world" "hello"  # Output: 5

# Extract matched portion
expr "hello world" : '\(hello\)'  # Output: hello
```

### Practical expr Examples:

#### Example 1: Basic Calculator
```bash
#!/bin/bash
echo "Enter first number:"
read a
echo "Enter second number:"
read b

sum=$(expr $a + $b)
diff=$(expr $a - $b)
prod=$(expr $a \* $b)

echo "Sum: $sum"
echo "Difference: $diff"
echo "Product: $prod"
```

#### Example 2: String Length and Manipulation
```bash
#!/bin/bash
str="Hello World"
len=$(expr length "$str")
sub=$(expr substr "$str" 7 5)

echo "Length: $len"        # Output: 11
echo "Substring: $sub"     # Output: World
```

#### Example 3: Increment Counter in Loop
```bash
#!/bin/bash
count=0
while [ $count -lt 5 ]; do
    echo "Count: $count"
    count=$(expr $count + 1)
done
```

### Limitations and Modern Alternatives:
- **expr** only handles integer arithmetic
- Modern bash has built-in arithmetic: `$((expression))`
- For floating-point, use `bc` or `awk`

**Modern equivalent:**
```bash
# Instead of expr
result=$(expr 5 + 3)

# Use bash arithmetic
result=$((5 + 3))

# Or let command
let result=5+3
```

---

## **awk Command - Comprehensive Guide**

### What is awk?
**awk** is a powerful pattern scanning and processing language that:
- Processes text files line by line
- Splits input lines into fields
- Executes actions based on patterns
- Named after its creators: Aho, Weinberger, Kernighan

### Basic Syntax:
```bash
awk 'pattern { action }' filename
awk -F delimiter 'program' filename
```

### Key awk Concepts:

#### **Fields and Records**
- Each line = **record**
- Words in line = **fields** ($1, $2, $3...)
- `$0` = entire record

#### **Built-in Variables**
- `NR` - Record number (line number)
- `NF` - Number of fields in current record
- `FS` - Field separator (default: space/tab)
- `OFS` - Output field separator
- `RS` - Record separator

### Common awk Operations:

#### 1. **Basic Printing**
```bash
# Print entire line
awk '{print}' file.txt

# Print specific fields
awk '{print $1, $3}' file.txt

# Print with custom separator
awk '{print $1 " -> " $2}' file.txt
```

#### 2. **Pattern Matching**
```bash
# Print lines matching pattern
awk '/error/ {print}' log.txt

# Print lines where field matches condition
awk '$3 > 100 {print}' data.txt

# Multiple conditions
awk '$2 == "admin" && $4 > 50 {print}' users.txt
```

#### 3. **BEGIN and END Blocks**
```bash
# Pre-processing (BEGIN) and post-processing (END)
awk 'BEGIN {sum=0} {sum+=$1} END {print "Total:", sum}' numbers.txt
```

### Practical awk Examples:

#### Example 1: CSV File Processing
```bash
# Print first and third columns from CSV
awk -F',' '{print $1, $3}' data.csv

# Print header and specific rows
awk -F',' 'NR==1 || $3 > 50 {print}' data.csv
```

#### Example 2: Text Analysis
```bash
# Count lines in file
awk 'END {print NR}' file.txt

# Count words in file
awk '{count += NF} END {print count}' file.txt

# Find average of first column
awk '{sum += $1} END {print "Average:", sum/NR}' numbers.txt
```

#### Example 3: System Monitoring
```bash
# Process disk usage
df -h | awk '$5 > 80 {print $1 " is " $5 " full"}'

# Process memory info
free -m | awk 'NR==2 {print "Used RAM: " $3 "MB"}'
```

#### Example 4: Log File Analysis
```bash
# Count occurrences of each HTTP status code
awk '{print $9}' access.log | sort | uniq -c

# Extract IP addresses and count requests
awk '{print $1}' access.log | sort | uniq -c | sort -nr
```

### Advanced awk Features:

#### **Arrays and Loops**
```bash
# Count frequency of values in first column
awk '{count[$1]++} END {for (val in count) print val, count[val]}' data.txt
```

#### **String Functions**
```bash
# Convert to uppercase
awk '{print toupper($1)}' file.txt

# String length
awk '{print length($1)}' file.txt

# Substring extraction
awk '{print substr($1, 1, 3)}' file.txt
```

#### **Conditional Statements**
```bash
# If-else conditions
awk '{if ($3 > 50) print "High:" $1; else print "Low:" $1}' data.txt

# Switch-like using if-else chain
awk '{
    if ($2 >= 90) grade = "A";
    else if ($2 >= 80) grade = "B";
    else grade = "C";
    print $1, grade
}' scores.txt
```

### Real-world awk Scripts:

#### 1. **System Report Generator**
```bash
#!/bin/bash

echo "=== SYSTEM REPORT ==="
echo ""

# Top 5 memory-consuming processes
echo "Top 5 Memory Consumers:"
ps aux --sort=-%mem | awk 'NR<=6 {printf "%-10s %-8s %s\n", $2, $4"%", $11}'

echo ""

# Disk usage summary
echo "Disk Usage (over 50%):"
df -h | awk '$5+0 > 50 {print $1 " " $5 " full"}'
```

#### 2. **Apache Log Analyzer**
```bash
#!/bin/bash

echo "=== WEB SERVER ANALYSIS ==="
echo ""

# Total requests
echo "Total Requests:"
awk 'END {print NR}' access.log

echo ""

# Requests by status code
echo "Requests by Status Code:"
awk '{print $9}' access.log | sort | uniq -c | sort -nr

echo ""

# Top 10 IP addresses
echo "Top 10 IP Addresses:"
awk '{print $1}' access.log | sort | uniq -c | sort -nr | head -10
```

#### 3. **Data Format Converter**
```bash
#!/bin/bash

# Convert CSV to formatted table
awk -F',' '
BEGIN {
    print "================================="
    printf "%-15s %-10s %-8s\n", "Name", "Age", "Score"
    print "================================="
}
NR>1 {
    printf "%-15s %-10s %-8s\n", $1, $2, $3
}
END {
    print "================================="
}' data.csv
```

### awk vs Other Tools Comparison:

| Task | awk | Alternative |
|------|-----|-------------|
| Extract column | `awk '{print $2}'` | `cut -d' ' -f2` |
| Sum column | `awk '{sum+=$1} END{print sum}'` | `paste -sd+ | bc` |
| Filter rows | `awk '$3 > 100'` | `grep pattern` |
| Count lines | `awk 'END{print NR}'` | `wc -l` |

### Performance Tips:
- **awk** is generally faster than multiple `grep`, `cut`, `sed` pipelines
- Use single awk command instead of multiple text processing commands
- For very large files, awk is more memory efficient than loading entire file

This comprehensive guide covers essential text processing tools that are fundamental for shell programming and data manipulation tasks.
