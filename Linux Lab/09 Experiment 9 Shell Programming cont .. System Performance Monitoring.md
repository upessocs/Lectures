# Experiment 9: Shell Programming

## Theory

### 1. System Performance Monitoring

System performance is tracked using CPU, memory, disk, and network usage.
**Useful commands:**

* `top` → live CPU & memory usage per process.
* `htop` → improved version of `top` (if installed).
* `free -h` → memory usage in human-readable form.
* `df -h` → disk space usage.
* `iostat` → input/output statistics (may need `sysstat` package).
* `uptime` → system load averages (1, 5, 15 minutes).

### 2. System Security and User Management

Linux is **multi-user**. Security involves controlling file permissions, users, and groups.
**Important commands:**

* `whoami` → current user.
* `id` → user & group info.
* `adduser <name>` → add new user.
* `passwd <name>` → set/change password.
* `groups` → display user’s groups.
* `chmod` → change permissions (r, w, x).
* `chown` → change ownership.

Example:

```bash
chmod 755 script.sh   # owner rwx, group r-x, others r-x
```

---

## Lab

### i. Rename All Files in a Directory

```bash
#!/bin/bash
echo "Enter directory path:"
read dir
echo "Enter prefix or suffix to add:"
read add

cd "$dir" || { echo "Directory not found!"; exit 1; }

for file in *; do
    if [ -f "$file" ]; then
        mv "$file" "${add}_$file"
    fi
done
echo "Files renamed successfully."
```

**Explanation:**

* `cd "$dir"` → move into directory.
* `for file in *` → iterate over all files.
* `mv old new` → rename file.

---

### ii. Search Files by Extension or Size

```bash
#!/bin/bash
echo "Enter directory to search:"
read dir
echo "Enter file extension (e.g. .txt):"
read ext
echo "Enter minimum size in KB:"
read size

find "$dir" -type f -name "*$ext" -size +"${size}k"
```

**New Command:**

* `find` searches files:

  * `-type f` → files only.
  * `-name "*.txt"` → by extension.
  * `-size +100k` → larger than 100 KB.

---

### iii. Fibonacci Series

```bash
#!/bin/bash
echo "Enter the number of terms:"
read n

a=0
b=1
echo "Fibonacci Series:"
for ((i=0; i<n; i++))
do
    echo -n "$a "
    fn=$((a + b))
    a=$b
    b=$fn
done
echo
```

**Explanation:**

* Fibonacci starts with 0, 1.
* Each term = sum of previous two.

---

## Assignment (Experiment 9)

1. Write a script to find the largest file in a given directory.
2. Create a script that counts how many `.sh` files exist in `/home/user`.
3. Write a script to monitor CPU usage every 10 seconds and log to a file.
4. Create a script that adds a new user and sets default permissions for their home directory.

