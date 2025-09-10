# **Git Installation and Basic Tutorial (Windows, macOS, Ubuntu)**






<iframe
  width="70%"
  height="60%"
  src="https://www.youtube-nocookie.com/embed/uGnkvpD44Pg"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen>
</iframe>

[Video](https://youtu.be/uGnkvpD44Pg)

## **1. Installing Git**

### **Windows (using git-scm)**
##### 1. **Download Git**:
   - Go to [https://git-scm.com/downloads](https://git-scm.com/downloads)
   - Click on "Download for Windows"

##### 2. **Run the Installer**:
   - Double-click the downloaded `.exe` file.
   - Follow the setup wizard (default options are fine for most users).
   - Select **"Git from the command line and also from 3rd-party software"** (recommended).
   - Choose **"Use the OpenSSL library"** for HTTPS connections.
   - Select **"Checkout Windows-style, commit Unix-style line endings"** (default).
   - Choose **"Use MinTTY"** (better terminal experience).
   - Click **Install**.

##### 3. **Verify Installation**:
   - Open **Git Bash** (installed with Git) or **Command Prompt**.
   - Run:
     ```bash
     git --version
     ```
   - You should see the installed Git version.

---

### **macOS (using Homebrew)**
##### 1. **Install Homebrew (if not installed)**:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

##### 2. **Install Git**:
   ```bash
   brew install git
   ```

##### 3. **Verify Installation**:
   ```bash
   git --version
   ```

---

### **Ubuntu (using apt)**
##### 1. **Update Package List**:
   
   ```bash
   sudo apt update
   ```

##### 2. **Install Git**:
   
   ```bash
   sudo apt install git -y
   ```

##### 3. **Verify Installation**:
   
   ```bash
   git --version
   ```

---

## **2. Git Configuration (All Platforms)**
Set your name and email (required before making commits):

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Check your settings:

```bash
git config --list
```

---

## **3. Creating & Cloning a Repository**
### **Creating a New Repository on GitHub**
1. Go to [GitHub.com](https://github.com) and log in.
2. Click **"+" and "New repository"** or directly visit `github.new`.
3. Enter a **Repository name**.
4. Choose **Public/Private**.
5. Check **"Add a README.md"** (recommended).
6. Click **"Create repository"**.

### **Cloning the Repository**
1. On the repository page, click **"Code"** (green button).
2. Copy the **HTTPS URL** (e.g., `https://github.com/username/repo.git`).
3. Open **Terminal (macOS/Linux) or Git Bash (Windows)**.
4. Run:
   
   ```bash
   git clone https://github.com/username/repo.git
   cd repo
   ```

---

## **4. Making & Pushing Changes**
##### 1. **Edit the `README.md`** (add your name and SAP ID).
##### 2. **Check changes**:
   ```bash
   git status  # Shows modified files
   git diff    # Shows exact changes
   ```
##### 3. **Stage changes**:
   ```bash
   git add README.md

   # or to add all changed in repo folder
   git add .
   ```
##### 4. **Commit changes**:
   ```bash
   git commit -m "Added name and SAP ID"
   ```
##### 5. **Push to GitHub**:
   ```bash
   git push origin main
   ```
   - The first time, you may need to authenticate via browser.

---

## **5. Verifying Changes**
- Refresh your GitHub repository page.
- You should see the updated `README.md`.

---

## **Troubleshooting**
**Permission denied (publickey)?**  
> Use HTTPS instead of SSH for cloning.
  
**GitHub authentication failing?**  
> Use a **Personal Access Token (PAT)** instead of a password.  
> Generate one in GitHub **Settings → Developer Settings → Personal Access Tokens**.

**Line ending issues (Windows)?**  
> Ensure Git is configured with `core.autocrlf=true`:
 
  ```bash
  git config --global core.autocrlf true
  ```

---

## **Summary of Commands**
| Command | Description |
|:---|:---|
| `git --version` | Check Git installation |
| `git config --global user.name "..."` | Set your name |
| `git config --global user.email "..."` | Set your email |
| `git clone <URL>` | Clone a repository |
| `git status` | Check file changes |
| `git diff` | View changes in files |
| `git add <file>` or `git add .`| Stage changes |
| `git commit -m "message"` | Commit changes |
| `git push origin main` | Push to GitHub |


---

# To Do / Assignment
  
# Add day1 work in repo folder, and commit it, and push changes   
1. Try adding folder `day1` with files like `index.html`
2. Use `git add .`, `git commit -m "Lecture 1 progress"`, and `git push`.
3. Check whether changes are reflected on your github repository url.
4. Check no of commits and commit history.
5. Check output of `git log`