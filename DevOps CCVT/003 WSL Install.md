# WSL

## **Installing and Enabling WSL (Windows Subsystem for Linux)**  

WSL (Windows Subsystem for Linux) allows you to run a Linux distribution on Windows without needing a virtual machine or dual boot. Below are the steps to install and configure it properly.


[![Watch the Video](https://img.youtube.com/vi/KZCNLvRnHc0/0.jpg)](https://youtu.be/KZCNLvRnHc0)

<iframe width="80%" style="aspect-ratio: 16 / 9;" src="https://www.youtube.com/embed/KZCNLvRnHc0" title="WSL installation" frameborder="0" allowfullscreen></iframe>




---

## **Step 1: Install WSL and Ubuntu Distribution**
Open **PowerShell as Administrator** and run:  

```powershell
wsl --install -d Ubuntu
```
This command:
- Installs WSL and enables required features (`VirtualMachinePlatform` and `Windows Subsystem for Linux`).
- Installs the **Ubuntu** distribution by default.

> **Note**: If you want another distribution, replace `Ubuntu` with the desired distro name.

---

## **Step 2: Verify Installation**
Once the installation is complete, restart your computer and verify WSL is installed:  

```powershell
wsl --list --verbose
```
OR  

```powershell
wsl -l -v
```
This will show:
- Installed distributions
- Their versions (WSL 1 or WSL 2)
- Running status  

If Ubuntu is installed but not set as the default, you can check the default distro:

```powershell
wsl --list --verbose
```
---

## **Step 3: Set a Default Distribution**
To set Ubuntu as the default Linux distribution:

```powershell
wsl --set-default Ubuntu
```
OR

```powershell
wsl -s Ubuntu
```

Now, whenever you run `wsl` in the terminal, it will launch Ubuntu by default.

---

## **Step 4: Check Installed Distributions**
To view all installed Linux distributions:

```powershell
wsl --list --all
```
If you want to install a new one, use:

```powershell
wsl --install -d <DistroName>
```
For example:

```powershell
wsl --install -d Debian
```
---

## **Step 5: Check and Change WSL Version**
WSL supports **WSL 1** and **WSL 2**. To check which version your distro is using:

```powershell
wsl --list --verbose
```
To set a distribution to WSL 2:

```powershell
wsl --set-version Ubuntu 2
```
To set a distribution to WSL 1:

```powershell
wsl --set-version Ubuntu 1
```
To make **WSL 2** the default for all future installations:

```powershell
wsl --set-default-version 2
```

---

## **Fixing Common Errors**
If you face errors during installation, try these fixes:

### **1. "WSL is not recognized as a command"**
- Ensure you're running PowerShell as **Administrator**.
- Enable WSL manually:
  ```powershell
  dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
  ```
  Enable **Virtual Machine Platform** (needed for WSL 2):
  ```powershell
  dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
  ```
  Restart the system and try again.

---

### **2. "WSL 2 requires an update to its kernel"**
If you get this error when switching to WSL 2, update the kernel manually:
1. Download and install the latest **WSL 2 kernel update** from [Microsoft's official page](https://aka.ms/wsl2kernel).
2. Try running:
   ```powershell
   wsl --set-version Ubuntu 2
   ```

---

### **3. "Error: 0x80370102 – The virtual machine could not be started"**
This happens if **Virtualization** is disabled in BIOS.

**Fix:**
- Restart your PC and enter **BIOS/UEFI** (Press `F2`, `F10`, `Delete`, or `Esc` depending on your PC).
- Look for **Intel VT-x / AMD-V** and **Enable** it.
- Save changes and restart.

---

### **4. "DNS Resolution Issues Inside WSL"**
If WSL is unable to connect to the internet:

```bash
echo "[network]" | sudo tee -a /etc/wsl.conf
echo "generateResolvConf = false" | sudo tee -a /etc/wsl.conf
sudo rm /etc/resolv.conf
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf
```
Then restart WSL:

```powershell
wsl --shutdown
```
---

## **Uninstalling WSL**
To completely remove WSL:

```powershell
wsl --unregister Ubuntu
```
To disable WSL:

```powershell
dism.exe /online /disable-feature /featurename:Microsoft-Windows-Subsystem-Linux
```

---

## **Final Notes**
- **`wsl -d <DistroName>`** runs a specific distro temporarily.
- **`wsl --terminate <DistroName>`** stops a running distro.
- **`wsl --shutdown`** stops all WSL instances.
