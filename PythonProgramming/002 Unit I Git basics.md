# Basic Git commands
> Use git-bash to execute it on windows

### 1. `git init`
**Description:** Initializes a new Git repository in the current directory.
**Example:**
```bash
$ git init
```
**Output:**
```
Initialized empty Git repository in /path/to/directory/.git/
```
**Usage:** Use this command when you want to start tracking a project with Git.
### 2. `git clone`
**Description:** Creates a copy of an existing Git repository from a remote server.
**Example:**
```bash
$ git clone https://github.com/user/repo.git
```
**Output:**
```
Cloning into 'repo'...
remote: Counting objects: 100% (XYZ/XYZ), done.
remote: Compressing objects: 100% (XYZ/XYZ), done.
Receiving objects: 100% (XYZ/XYZ), done.
```
**Usage:** Use this command when you want to download a project and all its version history from a remote repository.
### 3. `git status`
**Description:** Shows the status of changes in your working directory, including staged, unstaged, and untracked files.
**Example:**
```bash
$ git status
```
**Output:**
```
On branch main
Your branch is up to date with 'origin/main'.
Untracked files:
(use "git add <file>..." to include in what will be committed)

        newfile.txt
nothing added to commit but untracked files present (use "git add" to track)
```
**Usage:** Use this command to check the state of your working directory and staging area.
### 4. `git add`
**Description:** Adds changes in the working directory to the staging area.
**Example:**
```bash
$ git add newfile.txt
```
**Output:** No output if successful.
**Usage:** Use this command to stage changes before committing them. You can stage individual files or use `git add .` to stage all changes.
### 5. `git commit`
**Description:** Records the changes in the staging area with a descriptive message.
**Example:**
```bash
$ git commit -m "Add new feature"
```
**Output:**
```
[main f1e2d3c] Add new feature
 1 file changed, 1 insertion(+)
 create mode 100644 newfile.txt
```
**Usage:** Use this command to save the changes you've staged with `git add`. The `-m` flag allows you to add a commit message directly in the command.
### 6. `git push`
**Description:** Uploads your local repository changes to a remote repository.
**Example:**
```bash
$ git push origin main
```
**Output:**
```
Counting objects: 100% (5/5), done.
Delta compression using up to 4 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 1.21 KiB | 1.21 MiB/s, done.
Total 3 (delta 2), reused 0 (delta 0)
To https://github.com/user/repo.git
   abc1234..def5678  main -> main
```
**Usage:** Use this command to send your committed changes to a remote repository, making them accessible to others.
### 7. `git pull`
**Description:** Fetches and integrates changes from a remote repository into your current branch.
**Example:**
```bash
$ git pull origin main
```
**Output:**
```
remote: Counting objects: 100% (XYZ/XYZ), done.
remote: Compressing objects: 100% (XYZ/XYZ), done.
Receiving objects: 100% (XYZ/XYZ), done.
From https://github.com/user/repo
 * branch            main       -> FETCH_HEAD
Updating abc1234..def5678
Fast-forward
 file1.txt | 1 +
 1 file changed, 1 insertion(+)
```
**Usage:** Use this command to update your local repository with the latest changes from the remote repository.
### 8. `git branch`
**Description:** Lists all branches in your repository, or creates, renames, or deletes branches.
**Example (list branches):**
```bash
$ git branch
```
**Output:**
```
* main
feature-branch
```
**Usage:** Use this command to manage branches. The asterisk (`*`) indicates the currently checked-out branch.
### 9. `git checkout`
**Description:** Switches branches or restores files in your working directory.
**Example (switch branch):**
```bash
$ git checkout feature-branch
```
**Output:**
```
Switched to branch 'feature-branch'
```
**Usage:** Use this command to switch between branches in your repository.
### 10. `git merge`
**Description:** Merges changes from one branch into the current branch.
**Example:**
```bash
$ git merge feature-branch
```
**Output:**
```
Updating abc1234..def5678
Fast-forward
 file1.txt | 1 +
 1 file changed, 1 insertion(+)
```
**Usage:** Use this command to integrate changes from one branch into another.
These commands cover the basic operations in Git. Each command is powerful on its own, but their real strength lies in how they can be combined to manage your source code effectively.


### Understanding `git diff`, `git log`, and `git status`
These three Git commands are essential for monitoring and understanding changes in your repository.
---
### 1. `git diff`
**Description:** Displays the differences between various commits, the staging area, and your working directory.
#### Use Cases:
- **Unstaged changes:** To see changes that have been made but not yet staged.
  
**Example:**
```bash
$ git diff
```
**Output:**
```
diff --git a/file.txt b/file.txt
index e69de29..d95f3ad 100644
--- a/file.txt
+++ b/file.txt
@@ -0,0 +1 @@
+This is a new line.
```
- **Staged vs. Last commit:** To see what has been staged for commit compared to the last commit.
  
**Example:**
```bash
$ git diff --staged
```
**Output:**
```
diff --git a/file.txt b/file.txt
index e69de29..d95f3ad 100644
--- a/file.txt
+++ b/file.txt
@@ -0,0 +1 @@
+This is a new line.
```
- **Between commits or branches:** To see changes between two commits or branches.
  
**Example:**
```bash
$ git diff commit1 commit2
```
**Output:**
```
diff --git a/file.txt b/file.txt
index abc1234..def5678 100644
--- a/file.txt
+++ b/file.txt
@@ -1,3 +1,5 @@
+Added line in commit2
   This is a new line.
```
**Usage:** Use `git diff` to review changes before staging or committing, or to compare different versions of your code.
---
### 2. `git log`
**Description:** Shows a list of commits in the repository’s history, with details like the commit hash, author, date, and commit message.
#### Use Cases:
- **Basic log:** View the commit history.
  
**Example:**
```bash
$ git log
```
**Output:**
```
commit abc1234
Author: John Doe <johndoe@example.com>
Date:   Fri Aug 1 12:34:56 2024 +0000

      Initial commit
```
- **Oneline summary:** View a concise version of the commit history.
  
**Example:**
```bash
$ git log --oneline
```
**Output:**
```
abc1234 (HEAD -> main) Initial commit
def5678 Added new feature
789abcd Fixed a bug
```
- **Graph view:** Visualize the commit history with branches.
  
**Example:**
```bash
$ git log --oneline --graph --all
```
**Output:**
```
* abc1234 (HEAD -> main) Initial commit
| * 789abcd Fixed a bug
|/
* def5678 Added new feature
```
**Usage:** Use `git log` to review the history of changes in your repository, understand who made changes, and track down specific commits.
---
### 3. `git status`
**Description:** Provides a summary of the current state of the working directory and staging area, showing which files are modified, staged, or untracked.
#### Use Cases:
- **Check status:** See the current state of your working directory and staging area.
  
**Example:**
```bash
$ git status
```
**Output:**
```
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
    (use "git add <file>..." to update what will be committed)
    (use "git restore <file>..." to discard changes in working directory)
          modified:   file.txt

Untracked files:
    (use "git add <file>..." to include in what will be committed)
          newfile.txt

no changes added to commit (use "git add" and/or "git commit -a")
```
**Usage:** Use `git status` frequently to keep track of your changes and understand what needs to be staged or committed.

> These commands are key to tracking changes, understanding the history of your project, and managing your code effectively.