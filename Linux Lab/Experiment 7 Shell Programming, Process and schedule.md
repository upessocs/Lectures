# Experiment 7: Shell Programming

## Theory

### 1. Processes

A **process** is an instance of a running program. When you execute a command in Linux, the operating system creates a process.

* Each process has a unique **PID** (Process ID).
* The **parent process (PPID)** is the process that started it.

**Command:** `ps`

* Shows currently running processes.

```bash
ps
```

Output example:

```
  PID TTY          TIME CMD
 1234 pts/0    00:00:00 bash
 1256 pts/0    00:00:00 ps
```

Here, `PID` is the process ID, and `CMD` is the command being run.

---

### 2. Process States

Processes can be in different states:

* **Running (R):** currently executing.
* **Sleeping (S):** waiting for input/output.
* **Stopped (T):** paused.
* **Zombie (Z):** finished but still in process table.

**Command:** `top`

* Displays dynamic list of running processes, their CPU and memory usage.

```bash
top
```

Press `q` to quit.

---

### 3. Process Hierarchy

Processes form a tree structure: parent → child.

**Command:** `pstree`

* Displays process hierarchy.

```bash
pstree
```

Example (simplified):

```
systemd─┬─bash───pstree
```

---

### 4. Killing Processes

**Command:** `kill <PID>`

* Sends a signal to stop a process.

Example:

```bash
kill 1234
```

Stops process with PID 1234.

**Command:** `kill -9 <PID>`

* Forcefully kills a process.

---

### 5. Process Prioritization

Every process has a **priority** (nice value). Lower values = higher priority. Range: -20 (highest) to +19 (lowest).

**Command:** `nice -n <value> command`

* Start a process with a specific priority.

Example:

```bash
nice -n 10 sleep 60
```

Starts `sleep 60` with low priority.

**Command:** `renice <value> -p <PID>`

* Change priority of a running process.

Example:

```bash
renice 5 -p 1234
```

---

### 6. Scheduling Processes

**Command:** `at`

* Schedules one-time tasks.

Example:

```bash
echo "ls > output.txt" | at now + 1 minute
```

Runs `ls` after 1 minute.

**Command:** `cron`

* Schedules recurring tasks using a crontab file.

Example:

```bash
crontab -e
```

To run `date` every minute, add:

```
* * * * * date >> time.log
```

---

## Lab Exercises

### i. Check if File Exists

```bash
#!/bin/bash
echo "Enter filename: "
read file

if [ -e "$file" ]
then
    echo "File exists. Contents are:"
    cat "$file"
else
    echo "File does not exist."
    echo "Do you want to create it? (y/n)"
    read choice
    if [ "$choice" = "y" ]; then
        touch "$file"
        echo "File $file created."
    fi
fi
```

**New Commands Used:**

* `-e` → checks if file exists.
* `cat file` → displays file content.
* `touch file` → creates an empty file.

---

### ii. Print Numbers from 1 to 10

```bash
#!/bin/bash
for i in {1..10}
do
    echo $i
done
```

**New Concept:**

* `{1..10}` → brace expansion to generate sequence.

---

### iii. Count Lines, Words, and Characters

```bash
#!/bin/bash
if [ $# -eq 0 ]
then
    echo "Usage: $0 filename"
    exit 1
fi

file=$1

if [ -e "$file" ]
then
    echo "Lines: $(wc -l < $file)"
    echo "Words: $(wc -w < $file)"
    echo "Characters: $(wc -m < $file)"
else
    echo "File not found!"
fi
```

**New Commands:**

* `$#` → number of command line arguments.
* `$1` → first argument.
* `wc` → word count utility:

  * `wc -l` → count lines.
  * `wc -w` → count words.
  * `wc -m` → count characters.

---

### iv. Factorial Using Function

```bash
#!/bin/bash
factorial() {
    num=$1
    fact=1
    while [ $num -gt 1 ]
    do
        fact=$((fact * num))
        num=$((num - 1))
    done
    echo $fact
}

echo "Factorial of 5 is: $(factorial 5)"
echo "Factorial of 7 is: $(factorial 7)"
echo "Factorial of 10 is: $(factorial 10)"
```

**New Concepts:**

* Function definition in bash:

  ```bash
  function_name() { commands }
  ```
* `$1` → function argument.
* `$(command)` → command substitution (returns output).

---

## Assignment

1. Write a script that monitors the top 5 processes consuming the most CPU and logs them into a file every 10 seconds.
   *Hint:* Use `ps -eo pid,comm,%cpu --sort=-%cpu | head -6`.

2. Write a script that accepts a PID from the user and displays its details (state, parent process, memory usage).
   *Hint:* Use `ps -p <PID> -o pid,ppid,state,comm,%mem`.

3. Create a script that schedules a task to append the current date and time to a log file every minute using cron.

4. Modify the factorial function to check if input is negative. If yes, display an error message.

5. Write a script that accepts a filename as an argument. If the file exists, display the number of lines starting with a vowel.
   *Hint:* Use `grep -i "^[aeiou]" filename | wc -l`.

