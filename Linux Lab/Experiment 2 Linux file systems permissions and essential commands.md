# Experiment 2 

## Linux file systems permissions and essential commands

### Table of Contents
1. Theory: Understanding Linux File Systems
2. File Permissions and Ownership
3. Basic Navigation Commands
4. File Operations
5. File Viewing and Editing
6. User Management
7. System Information
8. Practice Exercises

---

## Theory: Understanding Linux File Systems

### What is a File System?
A file system is how Linux organizes and stores files on your computer. Think of it as a filing cabinet with folders and documents arranged in a hierarchical structure.

### Linux Directory Structure
Linux uses a tree-like directory structure starting from the root directory `/`. Here are the key directories:

- `/` - Root directory (the top of everything)
- `/home` - User home directories
- `/usr` - User programs and applications
- `/etc` - System configuration files
- `/var` - Variable data (logs, temporary files)
- `/bin` - Essential system binaries
- `/tmp` - Temporary files

### Example Structure:


```bash
/
├── home/
│   ├── john/
│   └── mary/
├── usr/
├── etc/
└── var/
```
---
## File Permissions and Ownership

### Understanding Permissions
Every file and directory in Linux has three types of permissions for three categories of users:

**Permission Types:**
- `r` (read) - Can view file content
- `w` (write) - Can modify file content
- `x` (execute) - Can run the file as a program

**User Categories:**
- **Owner** - The user who owns the file
- **Group** - Users in the same group as the owner
- **Others** - Everyone else

### Reading Permission Format
When you see: `rwxr-xr--`
- First 3 characters (`rwx`) - Owner permissions
- Next 3 characters (`r-x`) - Group permissions
- Last 3 characters (`r--`) - Others permissions

### Modifying Permissions

**Using `chmod` command:**


```bash
# Give execute permission to owner
chmod u+x filename

# Remove write permission from group
chmod g-w filename

# Set specific permissions using numbers
chmod 755 filename  # rwxr-xr-x
chmod 644 filename  # rw-r--r--
```

**Permission Numbers:**
- 4 = read (r)
- 2 = write (w)
- 1 = execute (x)
- Add them together: 7 = rwx, 6 = rw-, 5 = r-x, etc.

### Changing Ownership

**Using `chown` command:**

```bash
# Change owner
sudo chown newowner filename

# Change owner and group
sudo chown newowner:newgroup filename

# Change only group
sudo chgrp newgroup filename
```
---
## Basic Navigation Commands

Let's start with the essential commands for moving around your Linux system.

### 1. `ls` - List Directory Contents

**Basic usage:**

```bash
# List files in current directory
ls

# List with detailed information
ls -l

# List all files including hidden ones
ls -a

# Combine options for detailed view with hidden files
ls -la
```

**Try this:**

```bash
ls
ls -l
ls -la /home
```

### 2. `pwd` - Print Working Directory

Shows your current location in the file system.


```bash
pwd
```

**Output example:** `/home/username`

### 3. `cd` - Change Directory

**Basic usage:**

```bash
# Go to home directory
cd

# Go to a specific directory
cd /home/username/Documents

# Go up one level
cd ..

# Go up two levels
cd ../..

# Go to previous directory
cd -

# Go to root directory
cd /
```

**Practice sequence:**

```bash
pwd                    # See where you are
cd /                  # Go to root
pwd                   # Confirm you're at root
ls                    # Look around
cd home               # Go to home directory
ls                    # See user directories
cd                    # Go to your home
pwd                   # Confirm location
```

### 4. `mkdir` - Make Directory

Create new directories (folders).


```bash
# Create a single directory
mkdir myfolder

# Create multiple directories
mkdir folder1 folder2 folder3

# Create nested directories
mkdir -p documents/projects/linux_tutorial

# Create directory with specific permissions
mkdir -m 755 public_folder
```

**Hands-on exercise:**

```bash
cd                           # Go to home
mkdir practice_linux         # Create practice folder
cd practice_linux           # Enter the folder
mkdir files documents scripts
ls                          # See what you created
```

### 5. `rmdir` - Remove Directory

Remove empty directories only.


```bash
# Remove empty directory
rmdir empty_folder

# Remove multiple empty directories
rmdir folder1 folder2

# Try to remove nested empty directories
rmdir -p path/to/empty/directories
```

**Note:** `rmdir` only works on empty directories. For directories with content, use `rm -r` (covered later).

---

## File Operations

Now let's learn how to create, copy, move, and delete files.

### 1. `touch` - Create Files

Creates empty files or updates timestamps of existing files.


```bash
# Create a single file
touch myfile.txt

# Create multiple files
touch file1.txt file2.txt file3.txt

# Create file with current timestamp
touch document_$(date +%Y%m%d).txt
```

**Practice:**

```bash
cd ~/practice_linux/files
touch readme.txt notes.txt log.txt
ls -l                        # See the files you created
```

### 2. `cp` - Copy Files and Directories

**Basic file copying:**

```bash
# Copy a file
cp source_file destination_file

# Copy file to different directory
cp myfile.txt ~/documents/

# Copy with a new name
cp original.txt backup_original.txt
```

**Directory copying:**

```bash
# Copy directory and its contents
cp -r source_directory destination_directory

# Copy with preserve attributes
cp -p file.txt backup_file.txt
```

**Hands-on practice:**

```bash
cd ~/practice_linux
echo "This is my first Linux file" > files/readme.txt
cp files/readme.txt documents/
cp files/readme.txt documents/readme_backup.txt
cp -r files backup_files
ls -la documents
ls -la backup_files
```

### 3. `mv` - Move and Rename

**Moving files:**

```bash
# Move file to different directory
mv file.txt ~/documents/

# Move multiple files
mv file1.txt file2.txt ~/documents/
```

**Renaming files:**

```bash
# Rename a file
mv oldname.txt newname.txt

# Rename directory
mv old_folder new_folder
```

**Practice:**

```bash
cd ~/practice_linux/files
touch temp_file.txt
mv temp_file.txt important_file.txt
ls
mv important_file.txt ../documents/
ls ../documents/
```

### 4. `rm` - Remove Files and Directories

**Warning:** Be very careful with `rm` - deleted files are usually not recoverable!

**Basic usage:**

```bash
# Remove a file
rm filename.txt

# Remove multiple files
rm file1.txt file2.txt

# Remove directory and contents (be careful!)
rm -r directory_name

# Force remove (no confirmation)
rm -f filename.txt

# Interactive removal (asks for confirmation)
rm -i filename.txt
```

**Safe practice:**

```bash
cd ~/practice_linux
touch test_delete.txt
ls
rm -i test_delete.txt       # Type 'y' to confirm
ls                          # Confirm it's gone
```

---

## File Viewing and Editing

Learn different ways to view and edit file contents.

### 1. `cat` - Display File Contents

**Basic usage:**

```bash
# Display entire file content
cat filename.txt

# Display multiple files
cat file1.txt file2.txt

# Display with line numbers
cat -n filename.txt

# Create a file with cat (Ctrl+D to save)
cat > newfile.txt
```

**Practice:**

```bash
cd ~/practice_linux
echo "Line 1: Hello Linux" > sample.txt
echo "Line 2: Learning commands" >> sample.txt
echo "Line 3: This is fun!" >> sample.txt
cat sample.txt
cat -n sample.txt
```

### 2. `less` and `more` - Paginated Viewing

Better for viewing large files.

**Using `less`:**

```bash
less filename.txt
```

**Navigation in `less`:**
- `Space` - Next page
- `b` - Previous page
- `q` - Quit
- `/search_term` - Search forward
- `?search_term` - Search backward

**Using `more`:**

```bash
more filename.txt
```
- `Space` - Next page
- `q` - Quit

### 3. `head` and `tail` - Partial File Viewing

**`head` - Show beginning of file:**

```bash
# Show first 10 lines (default)
head filename.txt

# Show first 5 lines
head -n 5 filename.txt

# Show first 20 characters
head -c 20 filename.txt
```

**`tail` - Show end of file:**

```bash
# Show last 10 lines (default)
tail filename.txt

# Show last 15 lines
tail -n 15 filename.txt

# Follow file changes (useful for logs)
tail -f logfile.txt
```

**Practice:**

```bash
cd ~/practice_linux
# Create a larger file for testing
seq 1 100 > numbers.txt
head numbers.txt
head -n 5 numbers.txt
tail numbers.txt
tail -n 3 numbers.txt
```
---
## Text Editors: `nano` and `vim`

### Using `nano` (Beginner-friendly)


```bash
# Open/create file in nano
nano filename.txt
```

**Nano shortcuts:**
- `Ctrl + O` - Save file
- `Ctrl + X` - Exit nano
- `Ctrl + W` - Search
- `Ctrl + K` - Cut line
- `Ctrl + U` - Paste

**Hands-on with nano:**

```bash
cd ~/practice_linux
nano my_first_edit.txt
```
Type some text, press `Ctrl+O` to save, then `Ctrl+X` to exit.

### Using `vim` (Advanced but powerful)


```bash
# Open file in vim
vim filename.txt
```

**Basic vim commands:**
- `i` - Enter insert mode (to type)
- `Esc` - Exit insert mode
- `:w` - Save file
- `:q` - Quit
- `:wq` - Save and quit
- `:q!` - Quit without saving

**Quick vim practice:**

```bash
vim quick_test.txt
```
1. Press `i` to enter insert mode
2. Type "Hello from vim!"
3. Press `Esc`
4. Type `:wq` and press Enter


---

## User Management

Learn about users and permissions.

### 1. `whoami` - Current User

Shows your current username.

```bash
whoami
```

### 2. `who` - Logged in Users

Shows all users currently logged into the system.

```bash
who

# More detailed information
w
```

### 3. `passwd` - Change Password

Change your user password.

```bash
passwd
```
You'll be prompted to enter your current password, then the new password twice.

### 4. `sudo` - Execute as Administrator

Run commands with administrative privileges.


```bash
# Update system packages (example)
sudo apt update

# Edit system file
sudo nano /etc/hosts

# Switch to root user
sudo su -

# Run command as different user
sudo -u username command
```

**Important `sudo` practices:**
- Only use when necessary
- Be careful with system files
- Understand what commands do before running with `sudo`

---

## System Information

Learn to gather information about your Linux system.

### 1. `uname` - System Information


```bash
# Basic system info
uname

# All information
uname -a

# Kernel version
uname -r

# Machine hardware
uname -m

# Operating system
uname -o
```

### 2. `df` - Disk Space Usage


```bash
# Basic disk usage
df

# Human-readable format
df -h

# Specific filesystem
df -h /
```

**Example output:**

```bash
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        20G  5.5G   13G  30% /
```

### 3. `top` and `htop` - Process Monitoring

**Using `top`:**

```bash
top
```
- `q` - Quit
- `k` - Kill process
- `M` - Sort by memory usage
- `P` - Sort by CPU usage

**Using `htop` (if installed):**

```bash
htop
```
More user-friendly than `top` with color coding and easier navigation.

### 4. `history` - Command History


```bash
# Show command history
history

# Show last 20 commands
history 20

# Search history
history | grep "search_term"

# Execute previous command
!!

# Execute command from history by number
!123
```

**Practice:**

```bash
history
history 10
history | grep "ls"
```
---

## Practice Exercises

Let's put everything together with some practical exercises.

### Exercise 1: File System Navigation

```bash
# 1. Go to your home directory
cd

# 2. Check your current location
pwd

# 3. Create a project structure
mkdir -p projects/linux_practice/{scripts,documents,backup}

# 4. Navigate to the scripts folder
cd projects/linux_practice/scripts

# 5. Create some files
touch setup.sh cleanup.sh readme.txt

# 6. List the files with details
ls -la

# 7. Go back to linux_practice directory
cd ..

# 8. List all subdirectories
ls -la
```

### Exercise 2: File Operations and Permissions

```bash
# 1. Go to documents folder
cd ~/projects/linux_practice/documents

# 2. Create a text file
echo "This is a practice document" > practice.txt

# 3. Check current permissions
ls -l practice.txt

# 4. Make it readable by everyone
chmod 644 practice.txt

# 5. Copy to backup folder
cp practice.txt ../backup/

# 6. Create a backup with timestamp
cp practice.txt ../backup/practice_backup_$(date +%Y%m%d).txt

# 7. List backup folder contents
ls -la ../backup/
```

### Exercise 3: Text Editing and Viewing

```bash
# 1. Create a larger file for practice
cd ~/projects/linux_practice/documents
seq 1 50 > numbers.txt

# 2. View first 10 lines
head numbers.txt

# 3. View last 5 lines
tail -n 5 numbers.txt

# 4. Search for specific number
cat numbers.txt | grep "25"

# 5. Edit the file with nano
nano numbers.txt
# Add a comment at the top: "# Number list from 1 to 50"
# Save with Ctrl+O, exit with Ctrl+X

# 6. View the modified file
cat numbers.txt
```

### Exercise 4: System Exploration

```bash
# 1. Check system information
uname -a

# 2. Check disk usage
df -h

# 3. See your recent commands
history 10

# 4. Check who's logged in
who

# 5. Find your username
whoami

# 6. Check current processes (press 'q' to quit)
top
```

### Exercise 5: Cleanup

```bash
# 1. Go to practice directory
cd ~/projects/linux_practice

# 2. Remove a test file safely
rm -i documents/numbers.txt

# 3. Remove empty directory (if any)
# First try: rmdir backup  # This might fail if not empty
# Then: rm -r backup       # This removes directory and contents

# 4. List what remains
ls -la

# 5. Check history of your session
history | tail -20
```

## Quick Reference Card

### Essential Commands Summary

| Command | Purpose | Example |
|---------|---------|---------|
| `pwd` | Show current directory | `pwd` |
| `ls` | List files | `ls -la` |
| `cd` | Change directory | `cd /home` |
| `mkdir` | Create directory | `mkdir newfolder` |
| `rmdir` | Remove empty directory | `rmdir oldfolder` |
| `touch` | Create empty file | `touch newfile.txt` |
| `cp` | Copy files | `cp file1.txt file2.txt` |
| `mv` | Move/rename files | `mv old.txt new.txt` |
| `rm` | Delete files | `rm -i file.txt` |
| `cat` | Display file content | `cat file.txt` |
| `less` | View file with pagination | `less largefile.txt` |
| `head` | Show file beginning | `head -n 5 file.txt` |
| `tail` | Show file end | `tail -n 5 file.txt` |
| `nano` | Simple text editor | `nano file.txt` |
| `chmod` | Change permissions | `chmod 755 script.sh` |
| `chown` | Change ownership | `sudo chown user:group file` |
| `whoami` | Current user | `whoami` |
| `sudo` | Run as administrator | `sudo command` |
| `history` | Command history | `history` |

### Permission Numbers
- `755` = rwxr-xr-x (executable files)
- `644` = rw-r--r-- (regular files)  
- `700` = rwx------ (private files)
- `666` = rw-rw-rw- (world-writable)


---

# Question Bank / Lab Exam

> Complete each task to test your understanding of Linux commands. Try to solve them first, then check hints if needed.

---

## Task 1: Directory Navigation
Create a directory called `test_project` in your home directory, then create subdirectories `docs`, `scripts`, and `data` inside it. Navigate to the `scripts` directory and display your current path.





<details>
<summary>Hints</summary>

- Use <code>mkdir</code> to create directories
- Use <code>cd</code> to navigate
- Use <code>pwd</code> to show current path
- You can create multiple directories at once: <code>mkdir dir1 dir2 dir3</code>
</details>

---

## Task 2: File Creation and Content
Create three files in the <code>docs</code> directory: <code>readme.txt</code>, <code>notes.txt</code>, and <code>todo.txt</code>. Add the text "Project documentation" to <code>readme.txt</code> and "Important notes" to <code>notes.txt</code>. Display the contents of both files.

<details>
<summary>Hints</summary>

- Use <code>touch</code> to create empty files
- Use <code>echo "text" > file.txt</code> to add content
- Use <code>cat</code> to display file contents
- Use <code>>></code> instead of <code>></code> to append without overwriting
</details>

---

## Task 3: File Operations
Copy <code>readme.txt</code> to the <code>data</code> directory and rename the copy to <code>project_info.txt</code>. Then move <code>todo.txt</code> from <code>docs</code> to <code>scripts</code> directory.

<details>
<summary>Hints</summary>

- Use <code>cp source destination</code> to copy files
- Use <code>mv oldname newname</code> to rename files
- Use <code>mv file directory/</code> to move files to another directory
- You can combine copy and rename: <code>cp file.txt newdir/newname.txt</code>
</details>

---

## Task 4: File Permissions
Create a shell script file called <code>backup.sh</code> in the <code>scripts</code> directory. Add the content <code>#!/bin/bash</code> and <code>echo "Backup complete"</code> to it. Make the file executable only for the owner.

<details>
<summary>Hints</summary>

- Use <code>echo</code> with <code>></code> and <code>>></code> to add multiple lines
- Use <code>chmod u+x filename</code> to make executable for user only
- Use <code>ls -l</code> to check permissions
- Script files typically need execute permission to run
</details>

---

## Task 5: File Viewing
Create a file called <code>numbers.txt</code> with numbers 1 to 20 (each on a new line). Display only the first 5 lines, then only the last 3 lines, then search for lines containing the number "1".

<details>
<summary>Hints</summary>

- Use <code>seq 1 20 > numbers.txt</code> to generate numbers quickly
- Use <code>head -n 5</code> to show first 5 lines
- Use <code>tail -n 3</code> to show last 3 lines
- Use <code>grep "1"</code> to search for pattern "1"
- Alternative: manually create with multiple <code>echo</code> commands
</details>

---

## Task 6: Text Editing
Using <code>nano</code>, create a file called <code>config.txt</code> with the following content:
<pre></pre>`
Database=localhost
Port=5432
Username=admin
<pre></pre>`
Save the file and then display its contents.

<details>
<summary>Hints</summary>

- Open nano with <code>nano filename.txt</code>
- Type your content normally
- Use <code>Ctrl+O</code> to save (write out)
- Use <code>Ctrl+X</code> to exit
- Use <code>cat</code> to verify the contents after saving
</details>

---

## Task 7: System Information
Create a file called <code>system_info.txt</code> that contains: your username, current date, your current directory, and disk usage information in human-readable format.

<details>
<summary>Hints</summary>

- Use <code>whoami</code> for username
- Use <code>date</code> for current date
- Use <code>pwd</code> for current directory  
- Use <code>df -h</code> for disk usage
- Combine with redirection: <code>command >> filename.txt</code>
- Use <code>echo</code> to add labels: <code>echo "Username:" >> file.txt</code>
</details>

---

## Task 8: File Organization
In your <code>test_project</code> directory, create a <code>backup</code> folder. Copy all <code>.txt</code> files from all subdirectories into this backup folder. Then list all files in the backup folder with detailed information.

<details>
<summary>Hints</summary>

- Use <code>find</code> to locate all .txt files: <code>find . -name "*.txt"</code>
- Or navigate to each directory and copy manually
- Use <code>cp file1.txt file2.txt destination/</code> to copy multiple files
- Use <code>ls -la</code> for detailed file information
- Wildcard <code>*.txt</code> matches all files ending in .txt
</details>

---

## Task 9: Process and History
Display your command history and count how many commands you've executed. Then show the top 10 most recent commands.

<details>
<summary>Hints</summary>

- Use <code>history</code> to show all commands
- Use <code>history | wc -l</code> to count total commands
- Use <code>history 10</code> to show last 10 commands
- Or use <code>history | tail -10</code> for last 10 lines
- <code>wc -l</code> counts lines in output
</details>

---

## Task 10: Comprehensive Cleanup
Set the permissions of your <code>backup.sh</code> script to be readable, writable, and executable by owner, readable and executable by group, and readable by others. Then create a summary file that lists the total number of files and directories in your entire <code>test_project</code>.

<details>
<summary> Hints</summary>

- Use <code>chmod 754 backup.sh</code> for rwxr-xr-- permissions
- Or use <code>chmod u=rwx,g=rx,o=r backup.sh</code>
- Use <code>find . -type f | wc -l</code> to count files
- Use <code>find . -type d | wc -l</code> to count directories  
- Use <code>ls -R</code> to see recursive directory structure
- Combine commands with <code>&&</code> or save outputs to summary file
</details>

---

## Quick Verification Commands

After each task, verify your work:

```bash
# Check current location
pwd

# List files with details
ls -la

# Check file contents
cat filename.txt

# Check permissions
ls -l filename

# Check directory structure
ls -R

# Check command history
history 5
```

## Common Commands You Should Know After This

| Task | Key Commands Used |
|------|-------------------|
| 1 | `mkdir`, `cd`, `pwd` |
| 2 | `touch`, `echo >`, `cat` |
| 3 | `cp`, `mv` |
| 4 | `chmod`, `ls -l` |
| 5 | `head`, `tail`, `grep` |
| 6 | `nano` |
| 7 | `whoami`, `date`, `df -h` |
| 8 | `find`, wildcard `*` |
| 9 | `history`, `wc -l` |
| 10 | `chmod` with numbers, `find` with types |