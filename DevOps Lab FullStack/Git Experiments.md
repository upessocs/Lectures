Experiments to do

Perform these experiments and create a Markdown file with summary of steps and commands with screenshots.
- [learn markdown](https://www.markdowntutorial.com/)

### **1. Git Basics: Add and Commit**
**Objective**: Understand how to stage changes and commit them.  
1. Create a new Git repository (`git init`).  
2. Create a file (e.g., `notes.txt`) and add some text.  
3. Use `git status` to see the changes.  
4. Stage the file (`git add notes.txt`).  
5. Commit the file (`git commit -m "Initial commit"`).  
6. Modify the file, then repeat `git add` and `git commit`.

---

### **2. Stash: Temporary Storage**
**Objective**: Learn to temporarily save work.  
1. Modify a file without committing the changes.  
2. Use `git stash` to save the uncommitted work.  
3. Confirm a clean working directory with `git status`.  
4. Retrieve the stashed changes using `git stash apply`.

---

### **3. Pull and Push: Remote Collaboration**
**Objective**: Learn to fetch and update repositories.  
1. Create a repository on GitHub.  
2. Connect your local repo (`git remote add origin <URL>`).  
3. Push changes to GitHub (`git push -u origin main`).  
4. Make changes to the GitHub repo directly.  
5. Pull the changes back (`git pull origin main`).

---

### **4. Fetch vs Pull**
**Objective**: Differentiate between `git fetch` and `git pull`.  
1. Push a change from a different machine or GitHub directly.  
2. Run `git fetch` and observe the changes in remote branches.  
3. Use `git pull` to update the local branch with fetched changes.

---

### **5. Branching and Merging**
**Objective**: Understand branch creation and merging.  
1. Create a new branch (`git branch feature-1`).  
2. Switch to the branch (`git checkout feature-1`).  
3. Make changes and commit them.  
4. Switch back to the main branch (`git checkout main`).  
5. Merge the branch (`git merge feature-1`).  

---

### **6. Rebase**
**Objective**: Learn rebasing for linear commit history.  
1. Create and switch to a new branch (`git checkout -b feature-2`).  
2. Make and commit changes.  
3. Switch back to `main` and make a conflicting commit.  
4. Rebase `feature-2` onto `main` (`git rebase main`).  
5. Resolve conflicts if any, then complete the rebase.

---

### **7. Submodules**
**Objective**: Manage a project with submodules.  
1. Create a repository for a small library.  
2. Create a parent repository.  
3. Add the library repo as a submodule (`git submodule add <URL>`).  
4. Clone the parent repository elsewhere and initialize submodules (`git submodule update --init --recursive`).

---

### **8. Merge Conflicts**
**Objective**: Resolve merge conflicts.  
1. Create and switch to a new branch (`git checkout -b conflict-branch`).  
2. Modify a file and commit the changes.  
3. Switch back to `main` and modify the same part of the file.  
4. Merge the branch (`git merge conflict-branch`).  
5. Resolve the conflict manually.

---

### **9. Tagging**
**Objective**: Create and manage tags for releases.  
1. Create a new tag (`git tag -a v1.0 -m "First release"`).  
2. Push tags to GitHub (`git push origin v1.0`).  
3. List tags (`git tag`).  
4. Delete a tag locally and remotely.

---

### **10. Undoing Changes**
**Objective**: Experiment with undoing commits.  
1. Make a commit with mistakes.  
2. Undo the commit but keep changes (`git reset HEAD~1`).  
3. Undo the commit and discard changes (`git reset --hard HEAD~1`).  
4. Recover a deleted commit using `git reflog`.

> you can also try to host your git repo as `ghpages` of `githubpages`