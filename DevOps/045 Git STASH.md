# **Git Stash**
The `git stash` command is used to temporarily save changes in your working directory that you don’t want to commit yet. It allows you to switch branches or perform other Git operations without losing your uncommitted work. Stashed changes can be reapplied later.

---

### **When to Use Git Stash (Instead of Commit)?**

- **Interruptions**: You’re working on a feature but need to switch branches to fix a critical bug.
- **Partial Work**: You’ve started a feature but it’s incomplete and not ready for a commit.
- **Keeping History Clean**: You don’t want to create unnecessary commits for unfinished work.

---

### **How Git Stash Works**
1. Saves uncommitted changes (both staged and unstaged) to a "stack."
2. Reverts the working directory to match the last commit.
3. Allows you to apply or drop the stashed changes later.

---

### **Common Subcommands**

#### **1. git stash**
Saves your changes to the stash stack.

```bash
git stash
```

#### **Example:**
```bash
echo "print('Work in progress')" > script.py
git add script.py
git stash
```

**Output:**
```
Saved working directory and index state WIP on main: d1a2b3e Update README
```

---

#### **2. git stash list**
Lists all stashes.

```bash
git stash list
```

**Output:**
```
stash@{0}: WIP on main: d1a2b3e Update README
```

---

#### **3. git stash apply**
Applies the most recent stash but doesn’t remove it from the stash stack.

```bash
git stash apply
```

#### **Example:**
1. Apply the most recent stash:
```bash
git stash apply
```

2. List stashes again:
```bash
git stash list
```

**Output:**
```
stash@{0}: WIP on main: d1a2b3e Update README
```

The stash remains.

---

#### **4. git stash pop**
Applies the most recent stash and removes it from the stash stack.

```bash
git stash pop
```

#### **Example:**
1. Pop the most recent stash:
```bash
git stash pop
```

**Output:**
```
On branch main
Changes not staged for commit:
(use "git add <file>..." to update what will be committed)
modified:   script.py
Dropped stash@{0} (ea5b8e3)
```

2. Check stash list:
```bash
git stash list
```

**Output:**
```
(No stash entries)
```

---

#### **5. git stash drop**
Deletes a specific stash without applying it.

```bash
git stash drop stash@{0}
```

**Output:**
```
Dropped stash@{0} (ea5b8e3)
```

---

#### **6. git stash clear**
Clears all stashes from the stack.

```bash
git stash clear
```

**Output:**
```
(No output, the stash stack is cleared)
```

---

#### **7. git stash show**
Shows the changes in the most recent stash.

```bash
git stash show
```

**Output:**
```
script.py | 1 +
1 file changed, 1 insertion(+)
```

To see detailed changes:
```bash
git stash show -p
```

---

#### **8. git stash branch**
Creates a new branch from the current stash and applies the stash to the branch.

```bash
git stash branch new-feature-branch
```

**Output:**
```
Switched to a new branch 'new-feature-branch'
On branch new-feature-branch
Changes not staged for commit:
(use "git add <file>..." to update what will be committed)
modified:   script.py
Dropped stash@{0} (ea5b8e3)
```

---

### **Example Workflow**

1. **Start Working on Main:**
```bash
git checkout main
echo "print('Incomplete feature')" > feature.py
git add feature.py
```

2. **Switch Branch Without Committing:**
```bash
git stash
git checkout bugfix
```

3. **Fix Bug and Return:**
```bash
echo "print('Bug fix')" > bug.py
git add bug.py
git commit -m "Fix bug"
git checkout main
```

4. **Apply Stashed Changes:**
```bash
git stash apply
```

---

### **When to Use Specific Commands**

| **Command**          | **Use Case**                                              |
|-----------------------|----------------------------------------------------------|
| `git stash`          | Temporarily save changes and clean the working directory.|
| `git stash apply`    | Reapply changes without removing them from the stash.    |
| `git stash pop`      | Reapply changes and remove from stash.                   |
| `git stash drop`     | Delete specific stash.                                   |
| `git stash clear`    | Clear all stashes.                                       |
| `git stash branch`   | Create a branch from a stash for isolated work.          |

This allows seamless switching between tasks while keeping your work safe!