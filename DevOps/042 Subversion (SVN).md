# Subversion (SVN)

Apache Subversion (often referred to as SVN) is a version control system that allows you to manage and track changes to your files and directories over time. Below is a step-by-step guide to install and use Subversion:

---

## **1. Install Apache Subversion**

### **On Windows**
1. **Download VisualSVN Server (recommended)**:
   - Download from [VisualSVN Server](https://www.visualsvn.com/server/).
   - Run the installer and follow the setup wizard to configure the server, repository location, and users.
2. **Command-line SVN Client**:
   - Install TortoiseSVN from [TortoiseSVN](https://tortoisesvn.net/) to get a graphical client and command-line tools.

### **On Linux**
1. Update your package index:
   ```bash
   sudo apt update  # For Debian/Ubuntu
   sudo yum update  # For CentOS/RHEL
   ```
2. Install Subversion:
   ```bash
   sudo apt install subversion -y  # Debian/Ubuntu
   sudo yum install subversion -y  # CentOS/RHEL
   ```

### **On macOS**
Use Homebrew to install Subversion:
```bash
brew install svn
```

---

## **2. Set Up an SVN Repository**

### **Create a Local Repository**
1. Create a directory for your repository:
   ```bash
   mkdir ~/svn_repo
   ```
2. Initialize the repository:
   ```bash
   svnadmin create ~/svn_repo/my_project
   ```

### **Start SVN Server (Optional)**
If you want remote access to the repository:
1. Start the SVN server (using `svnserve`):
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
1. Navigate to your working directory:
   ```bash
   cd my_project
   ```
2. Add new files:
   ```bash
   svn add file.txt
   ```
3. Commit the changes:
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
1. Remove a file from the repository:
   ```bash
   svn delete file.txt
   ```
2. Commit the changes:
   ```bash
   svn commit -m "Deleted file.txt"
   ```

---

## **4. Access Control (Optional)**

### Edit `svnserve.conf`
1. Open the configuration file:
   ```bash
   nano ~/svn_repo/my_project/conf/svnserve.conf
   ```
2. Enable authentication by setting:
   ```
   [general]
   anon-access = none
   auth-access = write
   password-db = passwd
   ```
3. Edit the `passwd` file in the same directory to add users:
   ```
   [users]
   user1 = password1
   user2 = password2
   ```

---

## **5. Using TortoiseSVN (Windows GUI Client)**

1. **Install TortoiseSVN**:
   - Download and install from [TortoiseSVN](https://tortoisesvn.net/).
2. **Checkout Repository**:
   - Right-click in a folder > "SVN Checkout".
   - Enter the repository URL and destination folder.
3. **Perform SVN Operations**:
   - Right-click files or folders to commit, update, or view logs.

---

## **6. Best Practices**
- Always update your working copy before starting new work.
- Use meaningful commit messages.
- Organize your repository structure (e.g., `trunk`, `branches`, `tags`).
