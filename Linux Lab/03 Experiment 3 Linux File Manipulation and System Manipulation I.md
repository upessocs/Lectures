# Linux File Manipulation and System Management Tutorial

## Theory Overview

### File Manipulation Commands
Linux provides powerful commands for creating, copying, moving, and removing files and directories. These operations form the foundation of file system management.

### File Compression and Archiving
Compression reduces file sizes for storage efficiency, while archiving combines multiple files into single containers for easier management and transfer.

### File Searching
Linux offers sophisticated tools to locate files by name, content, or attributes across the entire file system.

### File System Navigation and Management
Effective navigation and organization of files requires understanding directory structures and file relationships.

### File Transfer
Moving files between locations, systems, or users requires proper commands and permissions management.

---

## Lab Section I: Working with Files

### Creating and Managing Files

#### The `touch` Command
Creates empty files or updates timestamps of existing files.

**Basic Syntax:**

```bash
touch [options] filename(s)
```

**Examples:**

```bash
# Create a single empty file
touch newfile.txt

# Create multiple files at once
touch file1.txt file2.txt file3.txt

# Update timestamp of existing file
touch existing_file.txt

# Create file with specific timestamp
touch -t 202401151430 dated_file.txt
```

**Common Options:**
- `-t`: Set specific timestamp
- `-c`: Don't create file if it doesn't exist
- `-a`: Change only access time
- `-m`: Change only modification time

---


#### The `cp` Command (Recap)
Copies files and directories to new locations.

**Basic Syntax:**

```bash
cp [options] source destination
```

**Examples:**

```bash
# Copy single file
cp document.txt backup_document.txt

# Copy file to directory
cp document.txt /home/user/backup/

# Copy directory recursively
cp -r /home/user/documents /backup/

# Copy with preservation of attributes
cp -p important.txt important_backup.txt

# Interactive copy (prompt before overwrite)
cp -i source.txt destination.txt
```

**Important Options:**
- `-r` or `-R`: Recursive (for directories)
- `-p`: Preserve attributes (timestamps, permissions)
- `-i`: Interactive mode
- `-v`: Verbose output
- `-u`: Update (copy only when source is newer)


---


#### The `mv` Command (Recap)
Moves or renames files and directories.

**Basic Syntax:**

```bash
mv [options] source destination
```

**Examples:**

```bash
# Rename a file
mv oldname.txt newname.txt

# Move file to directory
mv document.txt /home/user/documents/

# Move and rename simultaneously
mv old_document.txt /backup/new_document.txt

# Move multiple files to directory
mv file1.txt file2.txt file3.txt /destination/

# Interactive move (prompt before overwrite)
mv -i source.txt destination.txt
```
---


#### The `rm` Command
Removes (deletes) files and directories permanently.

** WARNING: rm permanently deletes files. There's no recycle bin in Linux!**

**Basic Syntax:**

```bash
rm [options] file(s)
```

**Examples:**

```bash
# Remove single file
rm unwanted_file.txt

# Remove multiple files
rm file1.txt file2.txt file3.txt

# Remove directory and contents
rm -r old_directory/

# Force removal without prompts
rm -f stubborn_file.txt

# Interactive removal (safe mode)
rm -i important_file.txt

# Remove empty directory
rmdir empty_directory
```

**Critical Options:**
- `-r` or `-R`: Recursive (required for directories)
- `-f`: Force (no prompts, ignore non-existent files)
- `-i`: Interactive (prompt for each file)
- `-v`: Verbose output
---


## Viewing File Contents

#### The `cat` Command (Recap)
Concatenates and displays file contents.

**Examples:**

```bash
# Display file contents
cat filename.txt

# Display multiple files
cat file1.txt file2.txt

# Create file with content
cat > newfile.txt
This is content
Press Ctrl+D to save

# Append to file
cat >> existing_file.txt
Additional content
Press Ctrl+D to save

# Number lines
cat -n filename.txt

# Show non-printing characters
cat -A filename.txt
```
---


#### The `less` Command
Views file contents one page at a time with navigation controls.

**Basic Usage:**

```bash
less filename.txt
```

**Navigation Commands within less:**
- `Space` or `f`: Forward one page
- `b`: Backward one page
- `Enter` or `j`: Forward one line
- `k`: Backward one line
- `/pattern`: Search forward for pattern
- `?pattern`: Search backward for pattern
- `n`: Next search result
- `N`: Previous search result
- `q`: Quit
- `h`: Help

**Examples:**

```bash
# View large file
less /var/log/syslog

# View with line numbers
less -N filename.txt

# Case-insensitive search
less -i filename.txt
```
---


#### The `head` Command
Displays the first few lines of a file.

**Basic Syntax:**

```bash
head [options] filename(s)
```

**Examples:**

```bash
# Show first 10 lines (default)
head filename.txt

# Show first 5 lines
head -n 5 filename.txt
# or
head -5 filename.txt

# Show first 20 bytes
head -c 20 filename.txt

# Multiple files
head file1.txt file2.txt

# Continuously monitor file (like tail -f)
head -f growing_file.txt
```

#### The `tail` Command
Displays the last few lines of a file.

**Basic Syntax:**

```bash
tail [options] filename(s)
```

**Examples:**

```bash
# Show last 10 lines (default)
tail filename.txt

# Show last 20 lines
tail -n 20 filename.txt
# or
tail -20 filename.txt

# Follow file (monitor for new content)
tail -f /var/log/syslog

# Show last 50 bytes
tail -c 50 filename.txt

# Start from line 100
tail -n +100 filename.txt
```


---

## Lab Section II: File Permissions and Ownership

### Understanding File Permissions

#### The `ls -l` Command (Recap)
Displays detailed file information including permissions and ownership.

**Example Output:**

```bash
$ ls -l
-rw-r--r-- 1 user group 1234 Jan 15 14:30 document.txt
drwxr-xr-x 2 user group 4096 Jan 15 14:25 mydir
-rwxr-xr-x 1 user group 8192 Jan 15 14:20 script.sh
```

**Breaking Down the Output:**

1. file type (-=file, d=directory, l=link)
2. owner permissions (rw-)
3. group permissions (r--)
4. others permissions (r--)
5. number of links
6. user owner
7. group owner
8. file size
9. modification time
10. filename



### Permission Types

#### Three Sets of Permissions:
1. **Owner (User)**: The file creator/owner
2. **Group**: Users in the same group as the file
3. **Others**: All other users on the system

#### Three Permission Types:
- **r (read)**: View file contents or list directory contents
- **w (write)**: Modify file contents or create/delete files in directory
- **x (execute)**: Run file as program or enter directory

#### Numeric Representation:
- **4** : read (r)
- **2** : write (w)
- **1** : execute (x)

**Common Permission Combinations:**
- **7** : (rwx): 4+2+1 = read, write, execute
- **6** : (rw-): 4+2+0 = read, write
- **5** : (r-x): 4+0+1 = read, execute
- **4** : (r--): 4+0+0 = read only
- **0** : (---): 0+0+0 = no permissions
---


### The `chmod` Command
Changes file permissions.

**Numeric Method:**

```bash
# Set permissions using numbers (owner, group, others)
chmod 755 script.sh     # rwxr-xr-x
chmod 644 document.txt  # rw-r--r--
chmod 600 private.txt   # rw-------
chmod 777 shared_file   # rwxrwxrwx (dangerous!)
```

**Symbolic Method:**

```bash
# Add permissions
chmod u+x script.sh      # Add execute for owner
chmod g+w document.txt   # Add write for group
chmod o+r public.txt     # Add read for others
chmod a+r file.txt       # Add read for all

# Remove permissions
chmod u-w readonly.txt   # Remove write for owner
chmod g-x dir/          # Remove execute for group
chmod o-rwx private.txt # Remove all for others

# Set exact permissions
chmod u=rwx,g=rx,o=r file.txt  # Owner: rwx, Group: rx, Others: r
```

**Symbols:**
- **u** : owner (user)
- **g** : group
- **o** : others
- **a** : all (u+g+o)
- **+** : add permission
- **-** : remove permission
- **=** : set exact permission
---


### The `chown` Command
Changes file ownership.

**Basic Syntax:**

```bash
chown [options] [owner][:group] file(s)
```

**Examples:**

```bash
# Change owner only
sudo chown newuser file.txt

# Change owner and group
sudo chown newuser:newgroup file.txt

# Change group only
sudo chown :newgroup file.txt

# Recursive change for directory
sudo chown -R user:group /path/to/directory

# Preserve root directory (safety)
sudo chown -R user:group /path/to/directory/
```

### The `chgrp` Command
Changes group ownership.

**Examples:**

```bash
# Change group
chgrp newgroup file.txt

# Recursive change
chgrp -R developers /project/

# Reference another file's group
chgrp --reference=template.txt newfile.txt
```

---

## Lab Section III: Advanced File and Directory Operations

### File Searching with `find`

The `find` command searches for files and directories based on various criteria.

**Basic Syntax:**

```bash
find [path] [expression] [action]
```

**Search by Name:**

```bash
# Find files by exact name
find /home -name "document.txt"

# Case-insensitive search
find /home -iname "Document.txt"

# Wildcard patterns
find /home -name "*.txt"
find /home -name "report_*"
find /etc -name "*conf*"
```

**Search by Type:**

```bash
# Find directories only
find /home -type d -name "backup*"

# Find regular files only
find /home -type f -name "*.log"

# Find symbolic links
find /home -type l
```

**Search by Size:**

```bash
# Files larger than 100MB
find /home -size +100M

# Files smaller than 1KB
find /home -size -1k

# Files exactly 500 bytes
find /home -size 500c
```

**Search by Time:**

```bash
# Modified in last 7 days
find /home -mtime -7

# Accessed more than 30 days ago
find /home -atime +30

# Changed in last 24 hours
find /home -ctime -1
```

**Search by Permissions:**

```bash
# Files with specific permissions
find /home -perm 644

# Files with at least specific permissions
find /home -perm -644

# Executable files
find /home -perm /111
```

**Advanced Examples:**

```bash
# Find and delete empty files
find /tmp -type f -empty -delete

# Find large files and list them
find /home -size +50M -ls

# Find files and execute command
find /home -name "*.tmp" -exec rm {} \;

# Find with multiple conditions
find /home -name "*.txt" -size +1M -mtime -7
```
---


### Pattern Searching with `grep`

The `grep` command searches for specific patterns within files.

**Basic Syntax:**

```bash
grep [options] pattern [file(s)]
```

**Basic Examples:**

```bash
# Search for pattern in file
grep "error" /var/log/syslog

# Case-insensitive search
grep -i "Error" logfile.txt

# Search in multiple files
grep "TODO" *.txt

# Recursive search in directories
grep -r "function" /home/user/code/

# Show line numbers
grep -n "pattern" file.txt
```

**Advanced Options:**

```bash
# Whole word only
grep -w "cat" animals.txt

# Invert match (lines that don't contain pattern)
grep -v "debug" logfile.txt

# Count occurrences
grep -c "error" logfile.txt

# Show only matching part
grep -o "email@[a-zA-Z0-9.-]*" contacts.txt

# Show context lines
grep -A 3 -B 3 "pattern" file.txt  # 3 lines after and before
grep -C 2 "pattern" file.txt       # 2 lines of context
```

**Regular Expressions:**

```bash
# Beginning of line
grep "^Error" logfile.txt

# End of line
grep "finished$" logfile.txt

# Any character
grep "a.b" file.txt  # matches "aab", "acb", etc.

# Character classes
grep "[0-9]" file.txt        # any digit
grep "[A-Z]" file.txt        # any uppercase letter
grep "[aeiou]" file.txt      # any vowel

# Extended regex
grep -E "(error|warning)" logfile.txt
grep -E "[0-9]{3}-[0-9]{3}-[0-9]{4}" contacts.txt  # phone numbers
```
---


### File Archiving with `tar`

The `tar` command creates archives (tarballs) from multiple files and directories.

**Basic Syntax:**

```bash
tar [options] archive_name files/directories
```

**Creating Archives:**

```bash
# Create tar archive
tar -cf backup.tar /home/user/documents

# Create compressed tar archive (gzip)
tar -czf backup.tar.gz /home/user/documents

# Create compressed tar archive (bzip2)
tar -cjf backup.tar.bz2 /home/user/documents

# Verbose output
tar -cvf backup.tar /home/user/documents
```

**Extracting Archives:**

```bash
# Extract tar archive
tar -xf backup.tar

# Extract to specific directory
tar -xf backup.tar -C /restore/location

# Extract compressed archive
tar -xzf backup.tar.gz

# List contents without extracting
tar -tf backup.tar

# Extract specific files
tar -xf backup.tar file1.txt dir1/file2.txt
```

**Common Options:**
- **c**: create archive
- **x**: extract archive
- **t**: list contents
- **f**: specify filename
- **v**: verbose output
- **z**: gzip compression
- **j**: bzip2 compression
- **C**: change directory

### File Compression with `gzip/gunzip`

#### The `gzip` Command
Compresses files using the gzip algorithm.

**Examples:**

```bash
# Compress file (original is replaced)
gzip largefile.txt  # creates largefile.txt.gz

# Keep original file
gzip -k largefile.txt

# Compress with maximum compression
gzip -9 largefile.txt

# Compress multiple files
gzip file1.txt file2.txt file3.txt

# View compression ratio
gzip -v largefile.txt
```

#### The `gunzip` Command
Decompresses gzip files.

**Examples:**

```bash
# Decompress file
gunzip largefile.txt.gz

# Keep compressed file
gunzip -k largefile.txt.gz

# Test integrity
gunzip -t largefile.txt.gz

# View contents without decompressing
zcat largefile.txt.gz
zless largefile.txt.gz
zgrep "pattern" largefile.txt.gz
```

---

## Creating Links with `ln`

The `ln` command creates links between files.

#### Hard Links
Multiple directory entries pointing to the same file data.


```bash
# Create hard link
ln original.txt hardlink.txt

# View inode numbers (same for hard links)
ls -li original.txt hardlink.txt
```

**Characteristics of Hard Links:**
- Share the same inode number
- Cannot link to directories (usually)
- Cannot cross file system boundaries
- Deleting one link doesn't affect others
- No distinction between "original" and "link"

#### Symbolic (Soft) Links
Pointers to other files or directories.


```bash
# Create symbolic link
ln -s /path/to/original.txt symlink.txt

# Link to directory
ln -s /home/user/documents doc_link

# Absolute path link
ln -s /usr/bin/python3 python

# Relative path link
ln -s ../config/settings.conf current_settings
```

**Characteristics of Symbolic Links:**
- Different inode number from target
- Can link to directories
- Can cross file system boundaries
- Becomes broken if target is deleted
- Shows link relationship in `ls -l`

**Practical Examples:**

```bash
# Create backup script link in PATH
sudo ln -s /home/user/scripts/backup.sh /usr/local/bin/backup

# Version management
ln -s /opt/app/v2.1 /opt/app/current

# Configuration management
ln -s /etc/nginx/sites-available/mysite /etc/nginx/sites-enabled/
```
