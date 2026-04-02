# **Introduction to Git and Version Control**

## **What is Version Control?**

Version Control is a system that helps track changes in files over time. It allows multiple users to collaborate, maintain history, and revert to previous versions when needed.

### **Why Version Control is Important**

* Tracks file changes (who, what, when)
* Enables team collaboration
* Prevents data loss
* Supports branching and parallel development
* Helps in debugging (rollback to previous versions)





## **What is Git?**

Git is a **Distributed Version Control System (DVCS)** used to track changes in source code during software development.

* Developed by Linus Torvalds
* Created in **2005**
* Designed for **speed, flexibility, and distributed workflows**





## **What is SCM (Source Code Management)?**

SCM is a broader concept that refers to tools and practices used to manage changes in source code.

* Git is a **tool**
* SCM is the **process/discipline**

---



## **Types of Version Control Systems**

### **1. Centralized Version Control System (CVCS)**

* Single central server stores all versions
* Developers commit changes to the central repository

Examples:

* Apache Subversion (SVN)

**Limitations:**

* Requires constant network connection
* Single point of failure
* Slower operations





### **2. Distributed Version Control System (DVCS)**

* Every developer has a full copy of the repository
* Work can be done offline
* Faster and more flexible

Examples:

* Git
* Mercurial


---


## **Git vs SVN vs Mercurial (Brief Comparison)**

| Feature        | Git                           | SVN                | Mercurial            |
| -------------- | ----------------------------- | ------------------ | -------------------- |
| Type           | Distributed (DVCS)            | Centralized (CVCS) | Distributed (DVCS)   |
| Speed          | Very fast                     | Slower             | Fast                 |
| Offline Work   | Yes                           | No                 | Yes                  |
| Branching      | Lightweight, powerful         | Heavy and complex  | Simple and efficient |
| Learning Curve | Moderate                      | Easy               | Easy                 |
| Popularity     | Very high (industry standard) | Declining          | Moderate             |
| Data Storage   | Snapshot-based                | File-based         | Changeset-based      |





## **Why Git Became Popular**

* No dependency on central server
* Efficient branching and merging
* High performance
* Strong community support
* Widely used in DevOps and CI/CD pipelines


---


## **Key Concept: Snapshot vs Changes**

* **Git** stores snapshots of the entire project
* **SVN** stores changes (deltas) between versions





## **Summary**

* Version Control is essential for modern development
* Git is the most widely used DVCS
* SVN and Mercurial are alternatives, but Git dominates due to flexibility and ecosystem




---


# **Git Hands-on **

## **Pre-Lab Setup **

### **Objective**

Configure Git identity and authentication so commits and remote operations work correctly.


### **1. Set Git Username and Email**

These details are attached to every commit (important for collaboration and tracking).

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

Verify configuration:

```bash
git config --list
```





### **2. Generate SSH Key (for GitHub Authentication)**

SSH keys allow secure communication without typing passwords every time.

```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```

Press **Enter** for default location and optionally set a passphrase.





### **3. Start SSH Agent and Add Key**

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```





### **4. Copy SSH Public Key**

```bash
cat ~/.ssh/id_ed25519.pub
```

* Copy the output
* Go to GitHub → Settings → SSH Keys → Add new key [https://github.com/settings/keys](https://github.com/settings/keys)





### **5. Test SSH Connection**

```bash
ssh -T git@github.com
```

Expected message:

```
Hi username! You've successfully authenticated...
```





### **Why This Setup is Important**

* Ensures proper **author identity in commits**
* Enables **secure GitHub access without passwords**
* Required for **push/pull operations in real projects**

<iframe width="90%" style="aspect-ratio: 16 / 9;" src="https://www.youtube.com/embed/uGnkvpD44Pg" title="Git, Github, and github-pages" frameborder="0" allowfullscreen></iframe>


---

## **Experiment 1: Initializing a Git Repository**

### **Objective**

Learn to create a local Git repository and track changes.

### **Steps**

```bash
cd ~/devops-project
git init
```

Create file:

```bash
echo "# DevOps Project" > README.md
```

Track and commit:

```bash
git add README.md
git commit -m "Initial commit"
git status
```





### **Explanation**

* `git init` → creates `.git` folder (version control starts)
* `git add` → stages file
* `git commit` → saves snapshot





---

### **Experiment 2: Git Branching**
**Objective**: Understand branching and merging to manage parallel development.

#### **Steps:**
1. Create a new branch named `feature-branch`:
```bash
git branch feature-branch
```
2. Switch to the new branch:
```bash
git checkout feature-branch
```
3. Modify `README.md` to include:
```markdown
## Feature: User Authentication
This branch adds authentication features.
```
4. Commit the changes:
```bash
git commit -am "Add user authentication feature to README.md"
```
5. Switch back to the `main` branch:
```bash
git checkout main
```
6. Merge the `feature-branch` into `main`:
```bash
git merge feature-branch
```

#### **Explanation:**
Branches allow developers to work on features in isolation. Merging integrates these changes into the main branch.



---

### **Experiment 3: Resolving Merge Conflicts**
**Objective**: Learn how to resolve conflicts during a merge.

#### **Steps:**
1. Create and switch to a branch named `conflict-branch`:
```bash
git checkout -b conflict-branch
```
2. Modify `README.md` to:
```markdown
## Feature: Conflict Resolution
This branch demonstrates conflict resolution.
```
3. Commit the changes:
```bash
git commit -am "Add conflict resolution details"
```
4. Switch to the `main` branch and make a conflicting change to the same section:
```markdown
## Feature: Main Updates
This section is updated in the main branch.
```
5. Commit the main branch changes:
```bash
git commit -am "Update main branch README.md"
```
6. Attempt to merge `conflict-branch` into `main`:
```bash
git merge conflict-branch
```
7. Resolve the conflict in `README.md` by manually editing the file.
8. Mark the conflict as resolved:
```bash
git add README.md
```
9. Complete the merge:
```bash
git commit
```

#### **Explanation:**
Merge conflicts occur when the same section of a file is modified in different branches. Manual intervention resolves the conflict.



---

### **Experiment 4: Using Git Stash**
**Objective**: Temporarily save changes without committing.

#### **Steps:**
1. Modify `README.md` but do not commit.
2. Stash the changes:
```bash
git stash
```
3. Verify a clean working directory:
```bash
git status
```
4. Reapply the stashed changes:
```bash
git stash apply
```

#### **Explanation:**
The `git stash` command allows developers to save work temporarily and return to a clean state for other tasks.



---

### **Experiment 5: Setting Up a Remote Repository**
**Objective**: Push local changes to GitHub and pull updates.

#### **Steps:**
1. Create a repository on GitHub (e.g., `devops-sample`).
2. Link the local repo to GitHub:
```bash
git remote add origin <repository-URL>
```
3. Push the local changes:
```bash
git push -u origin main
```
4. Make a change directly on GitHub.
5. Pull the changes locally:
```bash
git pull origin main
```

#### **Explanation:**
This experiment demonstrates remote collaboration by syncing local and remote repositories.


---


### **Experiment 6: Submodules**
**Objective**: Include a project as a submodule in another repository.

#### **Steps:**
1. Create a new Git repository for a library (e.g., `devops-library`).
2. Add this library as a submodule to your main repository:
```bash
git submodule add <library-repo-URL>
```
3. Clone the main repository elsewhere:
```bash
git clone <main-repo-URL>
```
4. Initialize and update submodules:
```bash
git submodule update --init --recursive
```

#### **Explanation:**
Submodules allow projects to include dependencies while maintaining their independent histories.



---

### **Experiment 7: Rebase**
**Objective**: Reorganize commit history for cleaner tracking.

#### **Steps:**
1. Create a branch `feature-rebase` and make several commits.
2. Switch to the `main` branch and make conflicting commits.
3. Rebase the feature branch onto `main`:
```bash
git checkout feature-rebase
git rebase main
```
4. Resolve conflicts if any and complete the rebase.

#### **Explanation:**
Rebasing provides a linear commit history, making it easier to follow changes.








## Practics tasks and hints

### **1. Git Basics: Add and Commit**
**Objective**: Understand how to stage changes and commit them.  
1. Create a new Git repository (`git init`).  
2. Create a file (e.g., `notes.txt`) and add some text.  
3. Use `git status` to see the changes.  
4. Stage the file (`git add notes.txt`).  
5. Commit the file (`git commit -m "Initial commit"`).  
6. Modify the file, then repeat `git add` and `git commit`.



### **2. Stash: Temporary Storage**
**Objective**: Learn to temporarily save work.  
1. Modify a file without committing the changes.  
2. Use `git stash` to save the uncommitted work.  
3. Confirm a clean working directory with `git status`.  
4. Retrieve the stashed changes using `git stash apply`.



### **3. Pull and Push: Remote Collaboration**
**Objective**: Learn to fetch and update repositories.  
1. Create a repository on GitHub.  
2. Connect your local repo (`git remote add origin <URL>`).  
3. Push changes to GitHub (`git push -u origin main`).  
4. Make changes to the GitHub repo directly.  
5. Pull the changes back (`git pull origin main`).



### **4. Fetch vs Pull**
**Objective**: Differentiate between `git fetch` and `git pull`.  
1. Push a change from a different machine or GitHub directly.  
2. Run `git fetch` and observe the changes in remote branches.  
3. Use `git pull` to update the local branch with fetched changes.



### **5. Branching and Merging**
**Objective**: Understand branch creation and merging.  
1. Create a new branch (`git branch feature-1`).  
2. Switch to the branch (`git checkout feature-1`).  
3. Make changes and commit them.  
4. Switch back to the main branch (`git checkout main`).  
5. Merge the branch (`git merge feature-1`).  



### **6. Rebase**
**Objective**: Learn rebasing for linear commit history.  
1. Create and switch to a new branch (`git checkout -b feature-2`).  
2. Make and commit changes.  
3. Switch back to `main` and make a conflicting commit.  
4. Rebase `feature-2` onto `main` (`git rebase main`).  
5. Resolve conflicts if any, then complete the rebase.



### **7. Submodules**
**Objective**: Manage a project with submodules.  
1. Create a repository for a small library.  
2. Create a parent repository.  
3. Add the library repo as a submodule (`git submodule add <URL>`).  
4. Clone the parent repository elsewhere and initialize submodules (`git submodule update --init --recursive`).



### **8. Merge Conflicts**
**Objective**: Resolve merge conflicts.  
1. Create and switch to a new branch (`git checkout -b conflict-branch`).  
2. Modify a file and commit the changes.  
3. Switch back to `main` and modify the same part of the file.  
4. Merge the branch (`git merge conflict-branch`).  
5. Resolve the conflict manually.



### **9. Tagging**
**Objective**: Create and manage tags for releases.  
1. Create a new tag (`git tag -a v1.0 -m "First release"`).  
2. Push tags to GitHub (`git push origin v1.0`).  
3. List tags (`git tag`).  
4. Delete a tag locally and remotely.



### **10. Undoing Changes**
**Objective**: Experiment with undoing commits.  
1. Make a commit with mistakes.  
2. Undo the commit but keep changes (`git reset HEAD~1`).  
3. Undo the commit and discard changes (`git reset --hard HEAD~1`).  
4. Recover a deleted commit using `git reflog`.









