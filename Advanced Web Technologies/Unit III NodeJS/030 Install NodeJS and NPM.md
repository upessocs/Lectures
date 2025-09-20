

# Installation of Node and NPM

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js some times need to add path manually)

### Steps
1. **Install Node.js**:
   - Visit [nodejs.org](https://nodejs.org/)
   - Download and install the LTS version for your operating system
   - Verify installation by running:
     ```bash
     node --version
     npm --version
     ```

2. **Create Project Directory**:
   ```bash
   mkdir nodejs-lab
   cd nodejs-lab
   ```

3. **Initialize npm Project**:
   ```bash
   npm init -y
   ```

4. **Install Express** (for the web server):
   ```bash
   npm install express
   ```
---

5.  **Test installation**
   ```bash
   node -v
   ```



---

# Troubleshoot Node.js Installation

First, open **Command Prompt** or **PowerShell** and run:

```bash
node -v
```

If this returns a version (e.g., `v18.17.0`), Node.js is installed correctly.

Now check `npm`:

```bash
npm -v
```

If this **doesn’t return a version** or shows an error like `'npm' is not recognized`, continue below.

---

### Step 2: Check Your System PATH

Sometimes the installer doesn’t add `npm` to your system’s PATH.

#### Here's how to fix that:

1. Press `Windows Key + S`, type `Environment Variables`, and select **Edit the system environment variables**.

2. In the **System Properties** window, click **Environment Variables...**

3. Under **System variables**, find and select **Path**, then click **Edit**.

4. Check if these two paths are listed:

   * `C:\Program Files\nodejs\`
   * (Optional but useful) `%AppData%\npm`

   If they are **not there**, click **New** and add:

   ```
   C:\Program Files\nodejs\
   ```

5. Click **OK** on all windows to close.

6. **Restart your Command Prompt or PowerShell**, then try again:

```bash
npm -v
```

---

### Step 3: Reinstall Node.js (if needed)

If it's still not working, do a clean reinstall:

1. Go to **Add or Remove Programs** and uninstall **Node.js**.
2. Download the latest **LTS** version from the official site:
   [https://nodejs.org/](https://nodejs.org/)
3. **Important**: During installation, make sure the **"Add to PATH"** option is checked.
4. After installing, restart your terminal and run:

```bash
node -v
npm -v
```

