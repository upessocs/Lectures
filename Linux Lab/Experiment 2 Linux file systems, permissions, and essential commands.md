# Experiment 2
## Theory and the practical lab components of Linux file systems, permissions, and essential commands.


## **Part 1: Theory**

### **Overview of File Systems in Linux**
Unlike Windows, which uses drive letters (C:\, D:\), Linux has a single, unified **hierarchical directory structure**. Everything starts from the root directory, denoted by a single forward slash (**/**).

*   **/ (Root):** The base of the entire filesystem.
*   **/home:** Contains personal directories for users (e.g., `/home/ubuntu`). This is like your `C:\Users` folder.
*   **/etc:** Stores system-wide configuration files.
*   **/var:** Contains variable data, like logs and databases.
*   **/tmp:** Temporary files that are deleted on reboot.
*   **/bin and /usr/bin:** Essential user command binaries (executable programs).
*   **/sbin and /usr/sbin:** Essential system administration binaries (e.g., `reboot`, `fdisk`).

### **File Permissions and Ownership**
Linux is a multi-user system, so permissions are crucial for security. Every file and directory has an owner and a set of permissions.

There are three types of permissions:
1.  **Read (r):** Permission to view the contents of a file or list the contents of a directory.
2.  **Write (w):** Permission to modify a file's contents or create/delete files in a directory.
3.  **Execute (x):** Permission to run a file as a program/script or traverse (enter) a directory.

Permissions are defined for three entities:
1.  **Owner (u):** The user who owns the file.
2.  **Group (g):** A group of users that share the same permissions for the file.
3.  **Others (o):** Everyone else on the system.

You can view permissions using `ls -l`:
```bash
$ ls -l myfile.txt
-rwxr--r-- 1 alice developers 2048 Jan 10 11:45 myfile.txt
```
*   `-rwxr--r--`: The permission string.
*   `alice`: The owner of the file.
*   `developers`: The group associated with the file.

**Decoding the permission string:**
*   The first character is `-` for a file, `d` for directory.
*   The next three characters (`rwx`) are the **owner's** permissions.
*   The next three (`r--`) are the **group's** permissions.
*   The last three (`r--`) are for **others**.

### **Modifying File Permissions and Ownership**
*   **`chmod` (Change Mode):** Used to change permissions.
    *   **Symbolic Method:** Uses `+`, `-`, and `=` with `u`, `g`, `o`, and `a` (all).
        *   `chmod u+x myfile.txt` -> Add execute permission for the owner.
        *   `chmod go-w myfile.txt` -> Remove write permission for group and others.
        *   `chmod a=rw myfile.txt` -> Set permissions to read/write for everyone.
    *   **Numeric (Octal) Method:** More efficient. Each permission has a number: Read=4, Write=2, Execute=1. You add them up for each entity.
        *   `chmod 755 myfile.txt` -> `rwxr-xr-x` (Owner: 4+2+1=7, Group: 4+1=5, Others: 4+1=5)
        *   `chmod 640 myfile.txt` -> `rw-r-----` (Owner: 4+2=6, Group: 4=4, Others: 0)

*   **`chown` (Change Owner):** Used to change the owner and group of a file.
    *   `sudo chown bob myfile.txt` -> Change owner to `bob`.
    *   `sudo chown bob:developers myfile.txt` -> Change owner to `bob` and group to `developers`.

### **Creating and Editing Files Using Text Editors**
*   **`nano`:** A simple, beginner-friendly text editor.
    *   `nano myfile.txt` -> Open/create a file.
    *   Write your text. Use `Ctrl + O` to save (Write Out), `Enter` to confirm.
    *   Use `Ctrl + X` to exit.
*   **`vim`:** A powerful, modal editor. Has a steeper learning curve.
    *   `vim myfile.txt` -> Open/create a file.
    *   Press `i` to enter **Insert mode** and start typing.
    *   Press `Esc` to go back to **Normal mode**.
    *   In Normal mode, type `:wq` and press `Enter` to **w**rite and **q**uit.
    *   Type `:q!` and press `Enter` to quit without saving.

---

## **Part 2: Lab - Essential Linux Commands**

### **i. Basic Navigation Commands**
```bash
# Print Working Directory - shows your current location in the filesystem.
pwd

# List - shows files and directories in your current location.
ls          # Basic list
ls -l       # Detailed list (long format)
ls -a       # List all files, including hidden ones (starting with .)
ls -la      # Detailed list of all files

# Change Directory - move to another directory.
cd /home/ubuntu/Documents  # Absolute path
cd Documents               # Relative path (from current directory)
cd ..                      # Move up one directory level
cd ~                       # Move to your home directory
cd                         # Also moves to home directory
cd -                       # Move to the previous directory

# Make Directory - create a new folder.
mkdir new_folder
mkdir -p project/docs/img  # Create nested directories (parents)

# Remove Directory - delete an EMPTY folder.
rmdir empty_folder
```

### **ii. File Operations**
```bash
# Touch - create a new, empty file or update the timestamp of an existing file.
touch file.txt
touch file1.txt file2.txt

# Copy - copy files or directories.
cp file.txt file_backup.txt          # Copy a file
cp file.txt /tmp/                    # Copy to a different directory
cp -r old_dir/ new_dir/              # Copy a directory recursively (-r)

# Move - move or rename files/directories.
mv file.txt renamed_file.txt         # Rename a file
mv file.txt ~/Documents/             # Move a file
mv old_dir/ ~/Documents/new_dir/     # Move and rename a directory

# Remove - delete files or directories. USE WITH CAUTION.
rm file.txt                          # Delete a file
rm -i file.txt                       # Delete with confirmation prompt (-i)
rm -r old_dir/                       # Recursively delete a directory and its contents
rm -rf dir_name/                     # Force delete without prompts (DANGEROUS!)
```

### **iii. File Viewing and Editing**
```bash
# Cat - concatenate and display the entire file content at once.
cat file.txt

# Less / More - view a file page by page (use arrow keys, press 'q' to quit).
less long_file.txt
more long_file.txt

# Head - display the first 10 lines of a file.
head file.log
head -n 20 file.log                  # Display first 20 lines

# Tail - display the last 10 lines of a file. Essential for reading logs.
tail file.log
tail -n 20 file.log                  # Display last 20 lines
tail -f /var/log/syslog              # Follow the file in real-time (great for live logs)

# Text Editors
nano quick_note.txt                  # Simple editor
vim script.sh                        # Powerful editor
```

### **iv. User Management**
```bash
# Whoami - prints the effective username of the current user.
whoami

# Who - shows who is currently logged into the system.
who

# Passwd - change the password for the current user.
passwd

# Sudo - execute a command with superuser (root) privileges.
sudo apt update                      # Run 'apt update' as root
sudo nano /etc/hosts                 # Edit a system file as root

# To run a shell as root (Use with extreme caution!)
sudo su
```

### **v. System Information**
```bash
# Uname - print system information.
uname -a                             # Print all information

# Df (Disk Free) - report disk space usage.
df -h                                # Show in human-readable format (MB, GB)

# Top / Htop - dynamic real-time view of running system processes.
top                                  # Built-in process monitor
# If not installed: 'sudo apt install htop'
htop                                 # A much more user-friendly version of top

# History - show the list of previously executed commands.
history
history | grep apt                   # Search your history for 'apt'
!25                                  # Run command number 25 from history
```

---
### **How to Practice This Lab**

1.  **Open your Terminal:** Use your WSL Ubuntu shell or your Linux Mint VirtualBox VM.
2.  **Follow Along:** Go through each command in the lab section one by one.
3.  **Experiment:** Try the commands with different options (e.g., `ls -la`, `cp -i`). Create test files and directories to manipulate and then delete them.
4.  **Break Things (Safely):** The best way to learn is by making mistakes in a safe environment. Don't be afraid to try commands, but be very cautious with `rm -rf` and `sudo`.