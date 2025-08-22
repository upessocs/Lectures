# Experiment 1 

## Install WSL, virtualbox, create virtual machine with linux os like ubuntu, linuxmint, or debian

### **Part 1: Installing and Enabling WSL (Ubuntu) on Windows**

Windows Subsystem for Linux (WSL) lets you run a GNU/Linux environment directly on Windows.

#### **Step 1: Enable WSL and Virtualization Features**
1.  **Open PowerShell as Administrator**: Press `Win + X` and select "Windows PowerShell (Admin)" or "Terminal (Admin)".
2.  **Run the WSL Installation Command**:
    ```powershell
    wsl --install
    ```
    This single command does the following:
    *   Enables the required **"Virtual Machine Platform"** and **"Windows Subsystem for Linux"** optional components.
    *   Downloads and installs the latest **Ubuntu** Linux distribution by default.
    *   Requests a reboot.

3.  **Reboot your computer** when prompted.

#### **Step 2: Set Up Your Ubuntu Distribution**
1.  After rebooting, a terminal window will open for Ubuntu. If it doesn't, open your Start Menu and launch "Ubuntu".
2.  Wait for the installation to finish. You will be asked to create a **New UNIX username** and **password**. This is separate from your Windows login.

**Troubleshooting WSL Installation:**

*   **If `wsl --install` fails or the command is not recognized:**
    *   **Enable features manually:** Open "Turn Windows features on or off" in the Start Menu. Check the boxes for **"Virtual Machine Platform"** and **"Windows Subsystem for Linux"**. Click OK, reboot, and then run `wsl --install` again.

*   **Error: "The virtual machine could not be started because a required feature is not installed."**
    *   This almost always means **hardware virtualization is disabled in your BIOS/UEFI**.

#### **Step 3: Enable Virtualization in BIOS/UEFI**
1.  **Check if it's enabled:**
    *   Press `Ctrl + Shift + Esc` to open Task Manager.
    *   Go to the "Performance" tab.
    *   Look at the bottom right. **"Virtualization"** should say **Enabled**.
2.  **If it's Disabled:**
    *   **Reboot your computer** and enter the BIOS/UEFI setup. The key to press is usually `Delete`, `F2`, `F10`, `F12`, or `Esc`. It flashes on the screen during boot.
    *   Navigate the BIOS menus (often under **Advanced**, **CPU Configuration**, or **Security** settings).
    *   Find the setting for **Virtualization Technology**. It might be called:
        *   Intel Virtualization Technology (**Intel VT-x**)
        *   AMD-V (for AMD CPUs)
        *   SVM Mode
    *   **Enable** the setting.
    *   **Save and Exit** (usually `F10`). Your computer will reboot.

After enabling virtualization, Windows should automatically enable the **Hypervisor** (Windows Hypervisor Platform). WSL will now work.

**Verify WSL is working:** Open a new PowerShell or Command Prompt and type:
```powershell
wsl -l -v
```
This should list your installed Ubuntu distribution and its version.

---

### **Part 2: Installing VirtualBox**

VirtualBox is a traditional Type 2 hypervisor for running full-fledged virtual machines.

#### **Step 1: Download and Install VirtualBox**
1.  Go to the official [VirtualBox download page](https://www.virtualbox.org/wiki/Downloads).
2.  Under "VirtualBox platform packages", click **"Windows hosts"** to download the installer.
3.  Run the downloaded `.exe` file.
4.  Follow the installation wizard. You can accept all default settings. It's safe to install all features (network interfaces, etc.).
5.  You will likely get a warning about installing device software. Click **"Install"** to proceed.

#### **Step 2: (Optional) Install the Microsoft Visual C++ Redistributable**
*   This is sometimes required for VirtualBox to function correctly, especially if you see related errors.
*   Download the latest **Visual Studio 2019 Redistributable** from the [official Microsoft site](https://learn.microsoft.com/en-US/cpp/windows/latest-supported-vc-redist?view=msvc-170).
*   Download and run the **`vc_redist.x64.exe`** file.
*   Follow the prompts to install it. A reboot is recommended afterward.

---

### **Part 3: Creating a Virtual Machine with Linux Mint**

#### **Step 1: Download Linux Mint**
1.  Go to the [Linux Mint download page](https://linuxmint.com/download.php).
2.  Choose the edition you prefer (**Cinnamon** is the most feature-complete). Choose **64-bit**.
3.  Download the ISO file. This is a disk image that VirtualBox will use as the installation source.

#### **Step 2: Create a New Virtual Machine in VirtualBox**
1.  Open **Oracle VM VirtualBox**.
2.  Click the **"New"** button (blue star).
3.  **Name and Operating System:**
    *   **Name:** `Linux Mint` (this will auto-fill other fields).
    *   **ISO Image:** Click the folder icon and browse to select the Linux Mint ISO you downloaded.
    *   **Type:** **Linux**
    *   **Version:** **Ubuntu (64-bit)** (Linux Mint is Ubuntu-based, so this is the best match).
    *   Click **Next**.

4.  **Hardware Resources:**
    *   **Memory (RAM):** Allocate at least **4096 MB (4 GB)** if you have 8+ GB of physical RAM. Do not give it all your RAM.
    *   **Processors:** Allocate **2 or more CPUs** if your system has multiple cores.
    *   Click **Next**.

5.  **Hard Disk:**
    *   **"Create a virtual hard disk now"** should be selected. Click **Create**.
    *   **Hard disk file type:** **VDI (VirtualBox Disk Image)**.
    *   **Storage on physical hard disk:** **Dynamically allocated** (uses space only as needed).
    *   **File location and size:** The default location is fine. Allocate at least **25 GB** for the disk. Click **Create**.

#### **Step 3: Install Linux Mint on the Virtual Machine**
1.  With your new "Linux Mint" VM selected in the VirtualBox Manager, click the **"Start"** (green arrow) button.
2.  The VM will boot from the ISO into the Linux Mint live environment.
3.  **Double-click "Install Linux Mint"** on the desktop.
4.  Follow the installation wizard:
    *   Select your language and keyboard layout.
    *   Connect to a WiFi network if desired.
    *   **Installation type:** You can choose the default **"Erase disk and install Linux Mint"**. *This only erases the virtual hard disk you created, not your actual physical drive.*
    *   Select your time zone.
    *   Create your user account (name, computer name, username, password).
5.  The installation will run. Once finished, you will be prompted to **restart the computer**.
6.  When it asks you to "Please remove the installation medium", you can press `Enter`. VirtualBox will automatically eject the ISO on shutdown.
7.  The VM will reboot into your freshly installed Linux Mint OS.

#### **Step 4: Install Guest Additions (Highly Recommended)**
Guest Additions provide better screen resolution, shared clipboard, file sharing, and much better overall performance.
1.  Inside your running Linux Mint VM, go to the VirtualBox menu: **Devices > Insert Guest Additions CD image...**
2.  A CD icon will appear on the desktop. Open it.
3.  Right-click in the folder and select **"Open in Terminal"**.
4.  In the terminal that opens, run:
    ```bash
    sudo ./VBoxLinuxAdditions.run
    ```
5.  Enter your password and wait for the installation to complete.
6.  Reboot the VM from the Linux Mint menu for the changes to take full effect.
