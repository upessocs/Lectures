# Subversion (SVN)

Apache Subversion (often referred to as SVN) is a version control system that allows you to manage and track changes to your files and directories over time. Below is a step-by-step guide to install and use Subversion.

## Linux

## Server Side
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
# Restart your SVN server
## To restart your SVN server after editing the repository configuration, follow these steps:

### 1. **Stop the SVN Server**
The command depends on how you started the server:

- If running as a **service**:
  ```sh
  sudo systemctl stop svnserve
  ```
  or  
  ```sh
  service svnserve stop
  ```

- If started manually with `svnserve`:
  Find the process ID and kill it:
  ```sh
  pkill svnserve
  ```
  or  
  ```sh
  ps aux | grep svnserve
  kill <PID>
  ```

### 2. **Edit the Repository Configuration**
Navigate to your repository’s configuration directory:
```sh
cd /path/to/repo/conf/
```
Edit the relevant configuration files using a text editor:
```sh
nano svnserve.conf  # Main server config
nano passwd         # User authentication
nano authz          # Access control
```
Save changes and exit the editor.

### 3. **Start the SVN Server Again**
- If using **systemd**:
  ```sh
  sudo systemctl start svnserve
  ```

- If running manually:
  ```sh
  svnserve -d -r /path/to/repositories
  ```

- If using a specific port:
  ```sh
  svnserve -d -r /path/to/repositories --listen-port=3690
  ```

Verify that the server is running:
```sh
ps aux | grep svnserve
```
or
```sh
netstat -tulnp | grep 3690
```

---

# Client Side

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

#### Task 6: Create a Branch (before that create trunk as shown in next slide)
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
## Trunk in SVN repo

The concept of a **`trunk`** in SVN (Subversion) is similar to the **`main`** or **`master`** branch in Git. It serves as the primary line of development where the latest stable code resides. However, unlike Git, SVN uses a centralized repository model, and the `trunk` is just a convention, not a strict requirement. Let’s break this down:

### **What is the `trunk` in SVN?**
- The `trunk` is the main directory in an SVN repository where the primary development happens.
- It is analogous to the `main` branch in Git.
- By convention, the `trunk` contains the latest stable code and serves as the base for creating branches and tags.



### **Why is the `trunk` needed?**
1. **Centralized Development**:
- The `trunk` provides a single place for all developers to collaborate on the latest code.
- It ensures that everyone is working from the same baseline.

2. **Branching and Tagging**:
- Branches are typically created from the `trunk` for feature development, bug fixes, or experiments.
- Tags (snapshots) are often created from the `trunk` to mark releases or milestones.

3. **Stability**:
- The `trunk` is expected to contain stable, tested code. Developers merge their changes back into the `trunk` after completing work in branches.

4. **Convention**:
- While not mandatory, the `trunk` is a widely adopted convention in SVN. It makes the repository structure predictable and easier to navigate.



### **Can you work without a `trunk`?**
Yes, you can work without a `trunk`, but it’s not recommended unless you have a specific reason to deviate from the standard structure. Here’s why:

1. **Non-Standard Workflow**:
- Without a `trunk`, you’ll need to define your own workflow, which might confuse team members who are used to the standard structure.

2. **Branching and Tagging**:
- If you don’t have a `trunk`, you’ll need to decide where branches and tags are created from. This can lead to inconsistency.

3. **Tooling and Automation**:
- Many tools and scripts assume the presence of a `trunk`, `branches`, and `tags` directory structure. Deviating from this might break compatibility.



### **Workflow with `trunk`**
Here’s a typical SVN workflow using the `trunk`:

1. **Develop in the `trunk`**:
- Developers work on the `trunk` for small changes or when the codebase is stable.

2. **Create a Branch for Features or Fixes**:
- For larger changes, create a branch from the `trunk`:
```
svn copy http://your-svn-server/svn/myrepo/trunk http://your-svn-server/svn/myrepo/branches/feature-x -m "Creating feature-x branch"
```

3. **Work in the Branch**:
- Developers make changes in the branch without affecting the `trunk`.

4. **Merge Back to `trunk`**:
- Once the work is complete and tested, merge the branch back into the `trunk`:
```
svn merge http://your-svn-server/svn/myrepo/branches/feature-x
svn commit -m "Merging feature-x into trunk"
```

5. **Create Tags for Releases**:
- When the `trunk` reaches a stable state, create a tag for the release:
```
svn copy http://your-svn-server/svn/myrepo/trunk http://your-svn-server/svn/myrepo/tags/release-1.0 -m "Tagging release 1.0"
```



### **Workflow Without `trunk`**
If you choose not to use a `trunk`, you can still manage your repository, but you’ll need to define your own structure. For example:

1. **Use a Single Directory**:
- You could use a single directory (e.g., `main`) as your primary development line:
```
svn copy http://your-svn-server/svn/myrepo/main http://your-svn-server/svn/myrepo/feature-y -m "Creating feature-y branch"
```

2. **Branch and Merge**:
- Create branches from `main` and merge back into `main` when the work is complete.

3. **Tagging**:
- Create tags from `main` to mark releases.

---

### **Comparison with Git**
- **Git’s `main`/`master` Branch**:
- In Git, the `main` or `master` branch serves the same purpose as the `trunk` in SVN.
- Git’s branching model is more flexible and lightweight compared to SVN.

- **Key Differences**:
- Git is distributed, so every developer has a full copy of the repository, including all branches.
- SVN is centralized, so branches and tags are stored on the server.


### **Conclusion**
While you can work without a `trunk` in SVN, it’s generally best to follow the standard structure (`trunk`, `branches`, `tags`) for clarity and consistency. The `trunk` serves as the central line of development, similar to Git’s `main` branch, and provides a stable foundation for branching and tagging. If you choose to deviate, ensure your team agrees on the new structure and workflow.



---

# How to create `trunk` directory in SVN repo 

In SVN (Subversion), you can create the **`trunk`** directory either **on the server side** or **from the client side**. Both approaches are valid, but the choice depends on your workflow and access permissions. Here's a detailed explanation of both methods:



### **1. Creating `trunk` on the Server Side**
If you have direct access to the SVN server (e.g., via SSH or file system access), you can create the `trunk` directory directly in the repository.

#### Steps:
1. **Access the SVN Repository Directory**:
- Navigate to the directory where your SVN repository is stored on the server. For example:
```
cd /path/to/svn/repositories/myrepo
```

2. **Create the `trunk` Directory**:
- Use the `svn mkdir` command to create the `trunk` directory:
```
svn mkdir file:///path/to/svn/repositories/myrepo/trunk -m "Creating trunk directory"
```

3. **Verify the `trunk` Directory**:
- Check that the `trunk` directory has been created:
```
svn list file:///path/to/svn/repositories/myrepo
```



### **2. Creating `trunk` from the Client Side**
If you don’t have direct access to the server, you can create the `trunk` directory from a client machine using the SVN command-line tools or a GUI client like TortoiseSVN.

#### Steps:
1. **Ensure You Have the Correct URL**:
- Make sure you know the URL of your SVN repository. For example:
```
http://your-svn-server/svn/myrepo
```

2. **Create the `trunk` Directory**:
- Use the `svn mkdir` command to create the `trunk` directory remotely:
```
svn mkdir http://your-svn-server/svn/myrepo/trunk -m "Creating trunk directory"
```

3. **Verify the `trunk` Directory**:
- Check that the `trunk` directory has been created:
```
svn list http://your-svn-server/svn/myrepo
```



### **3. Creating `trunk` Using a Working Copy**
If you already have a working copy of the repository, you can create the `trunk` directory locally and then commit it to the server.

#### Steps:
1. **Check Out the Repository**:
- Check out the repository to your local machine:
```
svn checkout http://your-svn-server/svn/myrepo /path/to/working/copy
```

2. **Create the `trunk` Directory Locally**:
- Navigate to your working copy and create the `trunk` directory:
```
cd /path/to/working/copy
mkdir trunk
```

3. **Add the `trunk` Directory to SVN**:
- Add the `trunk` directory to version control:
```
svn add trunk
```

4. **Commit the `trunk` Directory**:
- Commit the new `trunk` directory to the server:
```
svn commit -m "Creating trunk directory"
```

5. **Verify the `trunk` Directory**:
- Check that the `trunk` directory has been created on the server:
```
svn list http://your-svn-server/svn/myrepo
```

---

### **Key Considerations**
1. **Permissions**:
- Ensure you have the necessary permissions to create directories and commit changes to the repository.

2. **Repository Structure**:
- If you’re setting up a new repository, it’s a good idea to create the standard directories (`trunk`, `branches`, `tags`) at the same time:
```
svn mkdir http://your-svn-server/svn/myrepo/trunk -m "Creating trunk"
svn mkdir http://your-svn-server/svn/myrepo/branches -m "Creating branches"
svn mkdir http://your-svn-server/svn/myrepo/tags -m "Creating tags"
```

3. **Working Copy**:
- If you’re working with a local working copy, always ensure it’s up to date before making changes:
```
svn update
```

---

### **Which Method Should You Use?**
- **Server Side**:
- Use this method if you have direct access to the server and want to set up the repository structure quickly.
- **Client Side**:
- Use this method if you don’t have direct access to the server or prefer to manage the repository remotely.
- **Working Copy**:
- Use this method if you’re already working with a local copy of the repository and want to make changes incrementally.

---

### **Example Workflow**
Here’s an example of creating the `trunk`, `branches`, and `tags` directories from the client side:

1. **Create the Directories**:
```
svn mkdir http://your-svn-server/svn/myrepo/trunk -m "Creating trunk"
svn mkdir http://your-svn-server/svn/myrepo/branches -m "Creating branches"
svn mkdir http://your-svn-server/svn/myrepo/tags -m "Creating tags"
```

2. **Verify the Structure**:
```
svn list http://your-svn-server/svn/myrepo
```

3. **Check Out the Repository**:
```
svn checkout http://your-svn-server/svn/myrepo /path/to/working/copy
```



By following these steps, you can create the `trunk` directory (and other standard directories) either on the server or from the client side, depending on your needs.

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
