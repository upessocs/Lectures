# 1. What is Git 

Git is a **distributed version control system** used to:

* Track code changes
* Collaborate with teams
* Maintain history and rollback safely

**Core idea:**

```
Working Directory → Staging Area → Local Repo → Remote Repo
```





# 2. Repository Setup

## Initialize new repository

```bash
git init
```

**Use case:** Start tracking a new project.

## Clone existing repository

```bash
git clone <repo-url>
```

**Use case:** Work on an existing project.





# 3. File Tracking Lifecycle

## Check status

```bash
git status
```

Shows:

* Untracked files
* Modified files
* Staged files





## Add files (Staging Area)

```bash
git add <file>
git add .
```

**Use case:** Select what changes go into next commit.





## Commit changes

```bash
git commit -m "message"
```

**Use case:** Save a snapshot of staged changes.





# 4. Viewing Changes & History

## View logs

```bash
git log
git log --oneline
git log --graph --all
```

## View differences

```bash
git diff
git diff <file>
git diff --staged
```

**Use case:** Debug changes, review before commit.



---

# 5. Remote Repository Management

## Add remote

```bash
git remote add origin <url>
```

## View remotes

```bash
git remote -v
```

## Edit remote URL

```bash
git remote set-url origin <new-url>
```

**Use case:** Switch from HTTPS → SSH or change repo location.





## Push changes

```bash
git push origin main
```

## Pull changes

```bash
git pull origin main
```

(fetch + merge)

## Fetch changes

```bash
git fetch
```

**Use case:**

* `fetch`: safe preview
* `pull`: directly update



---

# 6. Branching (Core Concept)

## Create branch

```bash
git branch feature
```

## Rename branch

```bash
git branch -M main
```

## List branches

```bash
git branch
git branch -a
```





# 7. Switching (Checkout)

## Switch branch

```bash
git checkout feature
```

## Create + switch

```bash
git checkout -b feature
```

## Checkout commit (detached HEAD)

```bash
git checkout <hash>
```

## Restore file

```bash
git checkout -- file.txt
```

**Use case:**

* Try old versions
* Undo file changes




---
# 8. Stashing (Temporary Save)

## Save changes

```bash
git stash
```

## List stashes

```bash
git stash list
```

## Apply stash

```bash
git stash apply
```

## Apply & remove

```bash
git stash pop
```

## Apply specific stash

```bash
git stash apply stash@{0}
```

**Use case:**

* Switch branch without committing incomplete work



---

# 9. Merge (Branch Integration)

## Command

```bash
git merge feature
```

## Working

```
Before:

A---B---C (main)
     \
      D---E (feature)

After:

A---B---C-------F (main)
     \         /
      D---E----
```





## Merge Conflict

```
<<<<<<< HEAD
Hello World
=======
Hello Git
>>>>>>> feature
```

Resolve → then:

```bash
git add .
git commit
```

**Use case:** Combine parallel work safely.





# 10. Rebase (Linear History)

## Command

```bash
git rebase main
```

## Working

```
Before:

A---B---C (main)
     \
      D---E (feature)

After:

A---B---C---D'---E'
```

**Key Idea:**

* Rewrites commits
* Cleaner history





## Merge vs Rebase

| Aspect    | Merge      | Rebase          |
| --------- | ---------- | --------------- |
| History   | Non-linear | Linear          |
| Safety    | Safe       | Risky if shared |
| Conflicts | Once       | Multiple times  |
| Use case  | Team work  | Clean history   |




---
# 11. Undo Operations

## Unstage

```bash
git reset <file>
```

## Undo last commit (keep changes)

```bash
git reset --soft HEAD~1
```

## Hard reset

```bash
git reset --hard HEAD~1
```

## Revert commit (safe undo)

```bash
git revert <commit>
```

**Use case:**

* Fix mistakes without breaking history



---

# 12. Submodules (Advanced but Important)

## What is Submodule?

A **Git repository inside another Git repository**

**Use case:**

* Reuse shared code (e.g., common library)
* Keep external dependency as separate repo





## Add submodule

```bash
git submodule add <repo-url> libs/module1
```

## Clone repo with submodules

```bash
git clone --recurse-submodules <repo-url>
```

## Initialize submodules (after clone)

```bash
git submodule init
git submodule update
```

## Update submodule

```bash
git submodule update --remote
```





## Important Notes

* Submodule has its own `.git`
* Parent repo tracks only **reference (commit)**



---

# 13. Typical Development Workflow

```
1. git clone repo
2. git checkout -b feature
3. code changes
4. git add .
5. git commit -m "feature"
6. git fetch
7. git rebase main (or merge)
8. git push origin feature
```





# 14. Real Use Case Flow (Team)

### Scenario:

* Developer A works on feature
* Meanwhile main updated

### Solution:

```bash
git fetch
git rebase main
```

→ Avoid messy history




---
# 15. Summary Table (Quick Revision)

```text
CATEGORY        COMMAND                         PURPOSE

Setup           git init                        Create repo
                git clone                       Copy repo

Tracking        git status                      Check changes
                git add                         Stage changes
                git commit                      Save snapshot

History         git log                         View commits
                git diff                        Compare changes

Remote          git remote add                  Add remote
                git remote set-url              Change remote
                git push                        Upload changes
                git pull                        Fetch + merge
                git fetch                       Download only

Branching       git branch                      Create/list branch
                git branch -M                   Rename branch

Switching       git checkout                    Switch branch
                git checkout -b                 Create + switch

Stash           git stash                       Save temp work
                git stash pop                   Apply + remove
                git stash list                  View stashes

Merge           git merge                       Combine branches

Rebase          git rebase                      Linear history

Undo            git reset                       Undo staging/commit
                git revert                      Safe undo commit

Submodule       git submodule add               Add external repo
                git submodule update            Sync submodules
```





# Final Mental Model

```
CODE → add → commit → branch → merge/rebase → push → collaborate
```


