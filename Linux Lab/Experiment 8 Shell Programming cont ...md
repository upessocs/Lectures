
# Experiment 8: Shell Programming

## Theory

### 1. Process Control and Signals

Processes can receive **signals** from the OS or the user to control execution.

* `kill -l` → list all signals.
* Common signals:

  * `SIGINT (2)` → interrupt (Ctrl+C).
  * `SIGTERM (15)` → terminate gracefully.
  * `SIGKILL (9)` → force kill.

Example:

```bash
kill -9 1234
```

Kills process with PID 1234 forcefully.

---

### 2. Process Monitoring and Resource Usage

**Commands:**

* `top` → live view of processes, CPU, memory.
* `htop` (if installed) → user-friendly version of `top`.
* `ps aux` → snapshot of all processes.
* `free -h` → shows memory usage.
* `uptime` → system load averages.

---

### 3. Process Communication

Processes communicate using files, pipes, or sockets.

**Pipes (`|`)** → pass output of one command to another.
Example:

```bash
ps aux | grep bash
```

Finds running processes with `bash`.

---

### 4. Process Synchronization

To prevent conflicts, processes can be synchronized:

* `wait` → wait for a background job to finish.
* File locks and semaphores (advanced, beyond this lab).

Example:

```bash
sleep 5 &
wait
echo "Finished after 5 seconds"
```

---

### 5. Background Processes and Job Control

* Add `&` at the end to run command in background.

```bash
sleep 30 &
```

* `jobs` → shows background jobs.
* `fg %1` → bring job 1 to foreground.
* `bg %1` → resume job 1 in background.

---

### 6. System Monitoring and Logging

* `dmesg | less` → kernel/system messages.
* `journalctl` (systemd systems) → system logs.
* `last` → last logged-in users.
* `who` or `w` → users currently logged in.

---

## Lab Exercises

### i. Check File Permissions

```bash
#!/bin/bash
echo "Enter filename:"
read file

if [ -e "$file" ]; then
    [ -r "$file" ] && echo "File is readable"
    [ -w "$file" ] && echo "File is writable"
    [ -x "$file" ] && echo "File is executable"
else
    echo "File does not exist."
fi
```

**New Concepts:**

* `-r` → check if readable.
* `-w` → check if writable.
* `-x` → check if executable.

---

### ii. String Operations

```bash
#!/bin/bash
echo "Enter first string:"
read str1
echo "Enter second string:"
read str2

# String length
echo "Length of first string: ${#str1}"
echo "Length of second string: ${#str2}"

# Concatenation
concat="$str1$str2"
echo "Concatenated string: $concat"

# Comparison
if [ "$str1" = "$str2" ]; then
    echo "Strings are equal"
else
    echo "Strings are not equal"
fi
```

**New Concepts:**

* `${#var}` → length of string.
* `"$str1$str2"` → string concatenation.
* `=` operator → string comparison.

---

### iii. Search for a Pattern in a File

```bash
#!/bin/bash
echo "Enter filename:"
read file
echo "Enter pattern to search:"
read pattern

if [ -e "$file" ]; then
    echo "Matching lines:"
    grep "$pattern" "$file"
else
    echo "File not found!"
fi
```

**New Command:**

* `grep pattern file` → searches for matching lines.

---

### iv. Display System Information

```bash
#!/bin/bash
echo "System Information:"
echo "-------------------"
echo "Date and Time: $(date)"
echo "Logged in users: $(who)"
echo "System Uptime: $(uptime -p)"
echo "Memory Usage:"
free -h
echo "Disk Usage:"
df -h
```

**New Commands:**

* `date` → current date and time.
* `who` → list logged-in users.
* `uptime -p` → pretty uptime format.
* `free -h` → memory usage in human-readable format.
* `df -h` → disk usage.

---

## Assignment

1. Write a script that starts a background job (e.g., `sleep 60`), lists all jobs, brings the job to the foreground, and then terminates it.

2. Create a script that compares two files and displays whether their contents are identical or different.
   *Hint:* Use `cmp` or `diff`.

3. Write a script that counts the number of processes currently being run by your user.
   *Hint:* Use `ps -u $USER | wc -l`.

4. Develop a script that monitors memory usage every 5 seconds and logs it into a file.
   *Hint:* Use `free -m` inside a loop with `sleep`.

5. Write a script that prompts for a filename and a search pattern, then displays the count of matching lines.
   *Hint:* Combine `grep -c`.
