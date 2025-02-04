# Subversion (SVN)

Apache Subversion (often referred to as SVN) is a version control system that allows you to manage and track changes to your files and directories over time. Below is a step-by-step guide to install and use Subversion:

---

## **1. Install Apache Subversion**

### **On Windows**
#### 1.  **Download VisualSVN Server (recommended)**:
- Download from [VisualSVN Server](https://www.visualsvn.com/server/).
- Run the installer and follow the setup wizard to configure the server, repository location, and users.
#### 2.  **Command-line SVN Client**:
- Install TortoiseSVN from [TortoiseSVN](https://tortoisesvn.net/) to get a graphical client and command-line tools.

### **On Linux**
#### 1.  Update your package index:
```bash
sudo apt update  # For Debian/Ubuntu
sudo yum update  # For CentOS/RHEL
```
#### 2.  Install Subversion:

[Download page](https://subversion.apache.org/packages.html)

### **On macOS**
Use Homebrew to install Subversion:
```bash
brew install svn
```

### On Nix

```nix
nix-shell -p subversion subversionClient tkrev

```

---

## **2. Set Up an SVN Repository**

### **Create a Local Repository**
#### 1.  Create a directory for your repository:
```bash
mkdir ~/svn_repo
```
#### 2.  Initialize the repository:
```bash
svnadmin create ~/svn_repo/my_project
```

### **Start SVN Server (Optional)**
If you want remote access to the repository:
#### 1.  Start the SVN server (using `svnserve`):
```bash
svnserve -d -r ~/svn_repo
```
This starts the server in daemon mode, making repositories available at `svn://<hostname>/my_project`.

---

## **3. Basic SVN Commands**

### **Checkout a Repository**
To get a working copy of the repository:
```bash
svn checkout file:///path/to/svn_repo/my_project
```
For remote repositories:
```bash
svn checkout svn://<hostname>/my_project
```

### **Add Files to the Repository**
#### 1.  Navigate to your working directory:
```bash
cd my_project
```
#### 2.  Add new files:
```bash
svn add file.txt
```
#### 3.  Commit the changes:
```bash
svn commit -m "Added file.txt"
```

### **Update Your Working Copy**
To sync with the latest changes in the repository:
```bash
svn update
```

### **Check Status**
To see the status of your working copy:
```bash
svn status
```

### **View Logs**
To view commit history:
```bash
svn log
```

### **Delete Files**
#### 1.  Remove a file from the repository:
```bash
svn delete file.txt
```
#### 2.  Commit the changes:
```bash
svn commit -m "Deleted file.txt"
```

---

## **4. Access Control (Optional)**

### Edit `svnserve.conf`
#### 1.  Open the configuration file:
```bash
nano ~/svn_repo/my_project/conf/svnserve.conf
```
#### 2.  Enable authentication by setting:
```
[general]
anon-access = none
auth-access = write
password-db = passwd
```
#### 3.  Edit the `passwd` file in the same directory to add users:
```
[users]
user1 = password1
user2 = password2
```

---

## **5. Using TortoiseSVN (Windows GUI Client)**

#### 1.  **Install TortoiseSVN**:
- Download and install from [TortoiseSVN](https://tortoisesvn.net/).
#### 2.  **Checkout Repository**:
- Right-click in a folder > "SVN Checkout".
- Enter the repository URL and destination folder.
#### 3.  **Perform SVN Operations**:
- Right-click files or folders to commit, update, or view logs.

---

## **6. Best Practices**
- Always update your working copy before starting new work.
- Use meaningful commit messages.
- Organize your repository structure (e.g., `trunk`, `branches`, `tags`).
- 

---
# Linux

### **1. Setting Up SVN Server with `svnserve`**

#### Step 1: Install Subversion
On a Linux system, install Subversion using your package manager:
```bash
sudo apt update
sudo apt install subversion
```

#### Step 2: Create a Repository
Create a directory for your repositories and initialize a new repository:
```bash
sudo mkdir -p /var/svn/repos
sudo svnadmin create /var/svn/repos/myrepo
```

#### Step 3: Configure `svnserve`
Edit the `svnserve.conf` file to configure access:
```bash
sudo nano /var/svn/repos/myrepo/conf/svnserve.conf
```

Make the following changes:
```ini
[general]
anon-access = none      # Disable anonymous access
auth-access = write     # Allow authenticated users to write
password-db = passwd    # Use the passwd file for authentication
```

#### Step 4: Set Up Users
Edit the `passwd` file to add users:
```bash
sudo nano /var/svn/repos/myrepo/conf/passwd
```

Add a user:
```ini
[users]
alice = alicepassword
bob = bobpassword
```

#### Step 5: Start `svnserve`
Start the `svnserve` daemon:
```bash
sudo svnserve -d -r /var/svn/repos
```

The `-d` flag runs it in daemon mode, and `-r` specifies the root directory for repositories.

---

### **2. Common SVN Commands**

#### Task 1: Check Out a Repository
To check out the repository to your local machine:
```bash
svn checkout svn://localhost/myrepo --username alice
```
You'll be prompted for the password.

#### Task 2: Add Files to the Repository
Create a new file and add it to the repository:
```bash
cd myrepo
echo "Hello, SVN!" > file.txt
svn add file.txt
svn commit -m "Added file.txt"
```

#### Task 3: Update Your Working Copy
To update your working copy with the latest changes:
```bash
svn update
```

#### Task 4: View Repository Status
Check the status of your working copy:
```bash
svn status
```

#### Task 5: View Change History
View the commit history of the repository:
```bash
svn log
```

#### Task 6: Create a Branch
Create a branch for new development:
```bash
svn copy svn://localhost/myrepo/trunk svn://localhost/myrepo/branches/feature-branch -m "Creating feature branch"
```

#### Task 7: Switch to a Branch
Switch your working copy to the new branch:
```bash
svn switch svn://localhost/myrepo/branches/feature-branch
```

#### Task 8: Merge Changes
Merge changes from the branch back to the trunk:
```bash
svn merge svn://localhost/myrepo/branches/feature-branch
svn commit -m "Merged feature-branch into trunk"
```

#### Task 9: Resolve Conflicts
If there are conflicts during an update or merge, resolve them:
```bash
svn resolve --accept working file.txt
```

#### Task 10: Delete a File
Delete a file and commit the change:
```bash
svn delete file.txt
svn commit -m "Deleted file.txt"
```

---

### **3. Example Workflow**

1. **Create a Repository**: Follow the steps above to set up `svnserve` and create a repository.
2. **Check Out the Repository**: Use `svn checkout` to get a working copy.
3. **Add Files**: Add files and commit them to the repository.
4. **Create a Branch**: Create a branch for a new feature.
5. **Switch to the Branch**: Work on the branch and commit changes.
6. **Merge Changes**: Merge the branch back into the trunk.
7. **Update and Resolve Conflicts**: Regularly update your working copy and resolve conflicts if necessary.

---

### **4. Additional Tips**
- Use `svn help` to get help on any command.
- Use `svn diff` to see differences between versions.
- Use `svn revert` to undo local changes.

--- 
# Windows


If you're using **TortoiseSVN** on Windows, you can set up an SVN server and use it with TortoiseSVN. Below, I'll guide you through the process of creating an SVN server on Windows and using TortoiseSVN to interact with it.

### **1. Setting Up an SVN Server on Windows**

#### Step 1: Install VisualSVN Server
1. Download and install **VisualSVN Server** (free version available) from [VisualSVN's official website](https://www.visualsvn.com/).
2. During installation, choose the default options unless you have specific requirements.

#### Step 2: Create a Repository
1. Open **VisualSVN Server Manager** (installed with VisualSVN Server).
2. Right-click on **Repositories** in the left pane and select **Create New Repository**.
3. Choose a repository name (e.g., `myrepo`) and select **FSFS** as the repository type.
4. Set up permissions:
   - Choose **Custom permissions**.
   - Add users (e.g., `alice` and `bob`) and assign them read/write access.

#### Step 3: Access the Repository URL
1. After creating the repository, VisualSVN Server will display the repository URL (e.g., `https://your-pc-name/svn/myrepo`).
2. Note this URL, as you'll use it to connect with TortoiseSVN.

---

### **2. Using TortoiseSVN to Interact with the Repository**

#### Step 1: Install TortoiseSVN
1. Download and install **TortoiseSVN** from [TortoiseSVN's official website](https://tortoisesvn.net/).
2. Restart your computer after installation.

#### Step 2: Check Out the Repository
1. Open **File Explorer** and navigate to the folder where you want to check out the repository.
2. Right-click in the folder and select **SVN Checkout**.
3. Enter the repository URL (e.g., `https://your-pc-name/svn/myrepo`).
4. Click **OK** and enter your credentials (username and password) if prompted.
5. A working copy of the repository will be created in the selected folder.

#### Step 3: Add Files to the Repository
1. Create a new file (e.g., `file.txt`) in the checked-out folder.
2. Right-click the file and select **TortoiseSVN > Add**.
3. Right-click in the folder and select **SVN Commit**.
4. Enter a commit message (e.g., "Added file.txt") and click **OK**.

#### Step 4: Update Your Working Copy
1. Right-click in the working copy folder and select **SVN Update**.
2. This will sync your working copy with the latest changes from the repository.

#### Step 5: View Repository Status
1. Right-click in the working copy folder and select **TortoiseSVN > Check for Modifications**.
2. This will show you the status of your files (e.g., modified, added, or conflicted).

#### Step 6: View Change History
1. Right-click in the working copy folder and select **TortoiseSVN > Show Log**.
2. This will display the commit history of the repository.

#### Step 7: Create a Branch
1. Right-click in the working copy folder and select **TortoiseSVN > Branch/Tag**.
2. Enter the branch name (e.g., `branches/feature-branch`) and a commit message.
3. Click **OK** to create the branch.

#### Step 8: Switch to a Branch
1. Right-click in the working copy folder and select **TortoiseSVN > Switch**.
2. Enter the branch URL (e.g., `https://your-pc-name/svn/myrepo/branches/feature-branch`).
3. Click **OK** to switch to the branch.

#### Step 9: Merge Changes
1. Right-click in the working copy folder and select **TortoiseSVN > Merge**.
2. Choose **Merge a range of revisions** or **Reintegrate a branch**.
3. Follow the prompts to merge changes from the branch to the trunk.

#### Step 10: Resolve Conflicts
1. If conflicts occur during an update or merge, right-click the conflicted file and select **TortoiseSVN > Edit Conflicts**.
2. Resolve the conflicts and mark the file as resolved:
   - Right-click the file and select **TortoiseSVN > Resolved**.

#### Step 11: Delete a File
1. Right-click the file you want to delete and select **TortoiseSVN > Delete**.
2. Commit the change by right-clicking in the folder and selecting **SVN Commit**.

---

### **3. Example Workflow with TortoiseSVN**

1. **Create a Repository**: Use VisualSVN Server to create a repository.
2. **Check Out the Repository**: Use TortoiseSVN to check out the repository to your local machine.
3. **Add Files**: Add files to the repository and commit them.
4. **Create a Branch**: Create a branch for a new feature.
5. **Switch to the Branch**: Work on the branch and commit changes.
6. **Merge Changes**: Merge the branch back into the trunk.
7. **Update and Resolve Conflicts**: Regularly update your working copy and resolve conflicts if necessary.

---

### **4. Additional Tips**
- Use **TortoiseSVN > Repo-Browser** to browse the repository directly.
- Use **TortoiseSVN > Settings** to configure TortoiseSVN (e.g., enabling auto-update).
- Use **TortoiseSVN > Export** to create a clean copy of the repository without SVN metadata.
