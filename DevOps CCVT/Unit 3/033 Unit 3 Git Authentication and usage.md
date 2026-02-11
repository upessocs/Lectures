# Git and GitHub

<div id="git"> </div>

<script>
     function addGitBlock() {





var Style = `
code{
display:block;
margin:1em;
padding:2em;
background-color:brown;
color:white;
border-radius:1em;
}"

`

gen(git, "appmain", gen(h1, "", "Generate script to configure git and github"), 'appmain container')
append(app, gen(footer, "appfooter", "Footer content", 'container'));

append(git, gen(input, "username", "Github Username", "", { placeholder: "Github Username" }))
append(git, gen(input, "email", "Github Email", "", { placeholder: "Github Email" }))
append(git, gen(button, "generate", "Generate Script", "btn", { onclick: "generateScript()" }))

loadscss(Style)
}

function generateScript() {
   // log("gen")
   var username = grab("#username")[0].value
   var email = grab("#email")[0].value
   // log(username)
   // log(email)

   var GitScript = `
# copy this script and paste in to git bash to configure
git config --global user.email "${email}"
git config --global user.name = "${username}"

ssh-keygen -t ed25519 -C "${email}"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519


echo -c "\n\n Copy this key and paste in to url shown below"


cat ~/.ssh/id_ed25519.pub


echo -c "\n\n https://github.com/settings/keys "



echo -c "after saving key on github\n #execute  ssh -T git@githubcom" 


ssh -T git@github.com

echo "not you can clone your repo and push in to it"




`

   append("#gitScript", "", "r")
   append(git, gen(code, "gitScript", GitScript))
}


setTimeout(addGitBlock(),4000);
</script>

---
## finding help on Git commands:

| **Command**                  | **Description**                                              | **Example**              |
|------------------------------|--------------------------------------------------------------|--------------------------|
| `git help <command>`         | Opens the full manual page for a Git command.                | `git help commit`        |
| `git <command> --help`       | Equivalent to `git help <command>`.                          | `git commit --help`      |
| `man git-<command>`          | Opens the manual using the `man` command.                    | `man git-commit`         |
| `git <command> -h`           | Provides a brief summary of the command’s usage and options. | `git commit -h`          |
| `git help -a`                | Lists all available Git commands.                           | `git help -a`            |
| `git help -g`                | Lists Git guides and concept documents.                     | `git help -g`            |
| Contextual Help              | Running a command incorrectly or without args shows a hint. | `git commit`             |
| Online Documentation         | Opens the Git documentation on the web.                     | `https://git-scm.com/doc`|

---
# git config
To set your username and email in the Git configuration, you'll use the `git config` command. Here's how you can do it:
### **Setting Global Username and Email**
This sets your username and email for all repositories on your system.
1. **Open Terminal/Command Prompt**:
- On **Linux/MacOS**: Use the Terminal.
- On **Windows**: You can use Git Bash or Command Prompt.
2. **Set Username**:
```bash
git config --global user.name "Your Name"
```
Replace `"Your Name"` with your actual name.
3. **Set Email**:
```bash
git config --global user.email "your_email@example.com"
```
Replace `"your_email@example.com"` with your actual email address.
### **Setting Username and Email for a Specific Repository**
If you want to set a different username and email for a particular repository, navigate to the repository folder and run the same commands without the `--global` flag:
1. **Navigate to Your Repository**:
```bash
cd /path/to/your/repository
```
2. **Set Username**:
```bash
git config user.name "Your Name"
```
3. **Set Email**:
```bash
git config user.email "your_email@example.com"
```
### **Verify Your Configuration**
You can check your configuration settings with the following command:
1. **Check Global Configuration**:
```bash
git config --global --list
```
2. **Check Repository-Specific Configuration**:
```bash
git config --list
```
This will display your configured username, email, and other settings.
---
## Git authentication
To work with GitHub securely, you can use both Personal Access Tokens (PAT) and SSH key pairs for authentication. Below is a step-by-step guide for both methods.
### 1. **Creating a Personal Access Token (PAT) and Adding It to Credential Manager**
#### **Creating a Personal Access Token:**
1. **Log in to GitHub**: Go to [github.com](https://github.com) and sign in.
2. **Go to Settings**: Click on your profile icon in the top right corner and select **Settings**.
3. **Access Developer Settings**: Scroll down and select **Developer settings** on the left-hand side.
4. **Personal Access Tokens**: Click on **Personal access tokens** > **Tokens (classic)** > **Generate new token**.
5. **Configure the Token**:
- **Note**: Give your token a descriptive name.
- **Expiration**: Set the expiration date (e.g., 30 days, 60 days, etc.).
- **Select Scopes**: Choose the scopes for the token (e.g., `repo` for full control of private repositories).
- **Generate Token**: Click **Generate token**.
6. **Copy the Token**: Copy the token that appears (you won’t be able to see it again).
#### **Adding PAT to Credential Manager (Windows):**
1. **Open Credential Manager**: Search for “Credential Manager” in the Windows Start menu and open it.
2. **Add Generic Credential**:
- Click on **Windows Credentials**.
- Click **Add a generic credential**.
- **Internet or network address**: Enter `git:https://github.com`.
- **Username**: Enter your GitHub username.
- **Password**: Paste the Personal Access Token.
3. **Save**: Click OK to save the credentials.
Now, Git will use this PAT whenever you perform Git operations with GitHub.
### 2. **Generating and Using SSH Key Pair for GitHub**
#### **Generating SSH Key Pair:**
1. **Open Terminal/Command Prompt**:
- On **Linux/MacOS**: Use the Terminal.
- On **Windows**: You can use Git Bash or Command Prompt.
2. **Generate SSH Key**:
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```
- If you’re using an older system that doesn’t support Ed25519, you can use RSA instead:
```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```
3. **Follow the Prompts**:
- When asked for a file to save the key, press **Enter** to use the default location (`~/.ssh/id_ed25519` or `~/.ssh/id_rsa`).
- Set a **passphrase** if you want extra security (or press Enter for no passphrase).
#### **Adding the SSH Key to the SSH-Agent:**
1. **Start the SSH-Agent**:
- On **Linux/MacOS**:
```bash
eval "$(ssh-agent -s)"
```
- On **Windows**:
```bash
eval $(ssh-agent -s)
```
2. **Add SSH Key**:
```bash
ssh-add ~/.ssh/id_ed25519
```
#### **Adding SSH Key to GitHub:**
1. **Copy SSH Public Key**:
```bash
cat ~/.ssh/id_ed25519.pub
```
Copy the output of the above command (your SSH public key).
2. **Add to GitHub**:
- Go to **GitHub** > **Settings** > **SSH and GPG keys** > **New SSH key**.
- **Title**: Give the key a recognizable title.
- **Key**: Paste your SSH public key.
- Click **Add SSH key**.
#### **Using the SSH Key with GitHub:**
1. **Clone a Repository Using SSH**:
```bash
git clone git@github.com:username/repository.git
```
2. **Push/Pull Changes**:
Now, Git will use SSH for authentication instead of a username and password.
### Summary
- **PAT**: Use this for HTTPS-based Git operations.
- **SSH Key**: Use this for SSH-based Git operations, often preferred for its security and ease of use.
---
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