# **Lab Manual – Experiment 1**

Comparison of Virtual Machines (VMs) and Containers using Ubuntu and Nginx

---

## **Objective**

1. To understand the conceptual and practical differences between Virtual Machines and Containers.
2. To install and configure a Virtual Machine using VirtualBox and Vagrant on Windows.
3. To install and configure Containers using Docker inside WSL.
4. To deploy an Ubuntu-based Nginx web server in both environments.
5. To compare resource utilization, performance, and operational characteristics of VMs and Containers.

---

## **Software and Hardware Requirements**

### **Hardware**

* 64-bit system with virtualization support enabled in BIOS
* Minimum 8 GB RAM (4 GB minimum acceptable)
* Internet connection

### **Software (Windows Host)**

* Oracle VirtualBox
* Vagrant
* Windows Subsystem for Linux (WSL 2)
* Ubuntu (WSL distribution)
* Docker Engine (docker.io)

### **Software (macOS – for troubleshooting/reference)**

* Oracle VirtualBox (Intel Macs only)
* Vagrant
* Docker Desktop (alternative if WSL is not applicable)

---

## **Theory**

### **Virtual Machine (VM)**

A Virtual Machine emulates a complete physical computer, including its own operating system kernel, hardware drivers, and user space. Each VM runs on top of a hypervisor.

**Characteristics:**

* Full OS per VM
* Higher resource usage
* Strong isolation
* Slower startup time

### **Container**

Containers virtualize at the operating system level. They share the host OS kernel while isolating applications and dependencies in user space.

**Characteristics:**

* Shared kernel
* Lightweight
* Fast startup
* Efficient resource usage

---

## **Experiment Setup – Part A: Virtual Machine (Windows)**

### **Step 1: Install VirtualBox**

1. Download VirtualBox from the official website.
2. Run the installer and keep default options.
3. Restart the system if prompted.

### **Step 2: Install Vagrant**

1. Download Vagrant for Windows.
2. Install using default settings.
3. Verify installation:

   ```bash
   vagrant --version
   ```

### **Step 3: Create Ubuntu VM using Vagrant**

1. Create a new directory:

   ```bash
   mkdir vm-lab
   cd vm-lab
   ```
2. Initialize Vagrant with Ubuntu box:

   ```bash
   vagrant init ubuntu/jammy64
   ```
3. Start the VM:

   ```bash
   vagrant up
   ```
4. Access the VM:

   ```bash
   vagrant ssh
   ```

### **Step 4: Install Nginx inside VM**

```bash
sudo apt update
sudo apt install -y nginx
sudo systemctl start nginx
```

### **Step 5: Verify Nginx**

```bash
curl localhost
```

### Stop and remove vm

```bash
vagrant halt
vagrant destroy
```

---



## **Experiment Setup – Part B: Containers using WSL (Windows)**

### **Step 1: Install WSL 2**

```powershell
wsl --install
```

Reboot the system after installation.

### **Step 2: Install Ubuntu on WSL**

```powershell
wsl --install -d Ubuntu
```

### **Step 3: Install Docker Engine inside WSL**

```bash
sudo apt update
sudo apt install -y docker.io
sudo systemctl start docker
sudo usermod -aG docker $USER
```

Logout and login again to apply group changes.

### **Step 4: Run Ubuntu Container with Nginx**

```bash
docker pull ubuntu

docker run -d -p 8080:80 --name nginx-container nginx
```

### **Step 5: Verify Nginx in Container**

```bash
curl localhost:8080
```

---

## **Resource Utilization Observation**

### **VM Observation Commands**

```bash
free -h
htop
systemd-analyze
```

### **Container Observation Commands**

```bash
docker stats
free -h
```

### **Parameters to Compare**

| Parameter    | Virtual Machine | Container |
| ------------ | --------------- | --------- |
| Boot Time    | High            | Very Low  |
| RAM Usage    | High            | Low       |
| CPU Overhead | Higher          | Minimal   |
| Disk Usage   | Larger          | Smaller   |
| Isolation    | Strong          | Moderate  |

---

## **macOS Instructions & Troubleshooting**

### **macOS (Intel-based)**

* VirtualBox and Vagrant work similarly to Windows.
* Ensure kernel extensions are allowed in **System Settings → Security & Privacy**.

### **macOS (Apple Silicon – M1/M2/M3)**

* VirtualBox has limited support.
* Use **UTM** or **Parallels** as alternatives.
* Use `ubuntu/arm64` Vagrant boxes.

### **Docker on macOS**

* WSL is not available.
* Install **Docker Desktop for Mac**.
* Docker runs containers inside a lightweight Linux VM.

---

## **Common Troubleshooting**

### **VirtualBox Issues**

* VT-x/AMD-V not enabled: Enable virtualization in BIOS.
* Hyper-V conflict: Disable Hyper-V on Windows.

### **Vagrant Issues**

* Box download failure: Check proxy/firewall.
* SSH timeout: Run `vagrant reload`.

### **Docker Issues (WSL)**

* Permission denied: Ensure user is added to `docker` group.
* Docker service not running:

  ```bash
  sudo systemctl start docker
  ```

---

## **Result**

The experiment demonstrates that containers are significantly more lightweight and resource-efficient compared to virtual machines, while virtual machines provide stronger isolation and full OS-level abstraction.

---

## **Conclusion**

Virtual Machines are suitable for full OS isolation and legacy workloads, whereas Containers are ideal for microservices, rapid deployment, and efficient resource utilization.

---

## **Viva Voce Questions**

1. What is the main difference between a VM and a container?
2. Why do containers start faster than VMs?
3. What role does the hypervisor play in virtualization?
4. Can containers run different kernels than the host OS?
5. Why is Docker considered lightweight?

---

## **References**

1. VirtualBox Documentation
2. Vagrant Documentation
3. Docker Official Documentation



---


# Troubleshooting Guide for Mac Users

## Vagrant on macOS (M1 / M2 / M3 – Apple Silicon)

---

## 1. Symptom → Root Cause → Fix (Quick Diagnosis)

### Problem 1: VirtualBox VM does not start / kernel panic

**Cause**

* VirtualBox has limited ARM support
* Most Vagrant boxes are amd64

**Fix**

* Do **not** use VirtualBox
* Use **QEMU (ARM native)** instead

---

### Problem 2: `vagrant up` hangs at “SSH unavailable”

**Cause**

* Wrong architecture box (amd64 on ARM)
* Provider mismatch

**Fix**

* Use **arm64/aarch64 box**
* Explicitly configure QEMU provider

---

### Problem 3: “Provider not found: qemu”

**Cause**

* QEMU provider plugin not installed

**Fix**

* Install `vagrant-qemu` plugin

---

## 2. Correct Setup for macOS (Apple Silicon)

### Requirements

* macOS 12+
* Apple Silicon (M1/M2/M3)
* Internet connection
* Admin (sudo) access

---

## 3. Step 1 – Install Homebrew (if not installed)

Check:

```bash
brew --version
```

If missing:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

After install (important on Apple Silicon):

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
source ~/.zprofile
```

Verify:

```bash
brew doctor
```

---

## 4. Step 2 – Install QEMU

```bash
brew install qemu
```

Verify:

```bash
qemu-system-aarch64 --version
```

Expected:

* Version info printed
* No command-not-found error

---

## 5. Step 3 – Install Vagrant (ARM version)

### Recommended (Homebrew)

```bash
brew install --cask vagrant
```

Verify:

```bash
vagrant --version
```

Expected:

```
Vagrant 2.x.x
```

---

## 6. Step 4 – Install QEMU Provider for Vagrant

```bash
vagrant plugin install vagrant-qemu
```

Verify:

```bash
vagrant plugin list
```

You must see:

```
vagrant-qemu
```

---

## 7. Step 5 – Use an ARM-Compatible Box

### IMPORTANT RULE

> **The box must support `arm64` or `aarch64`**

Good examples:

```bash
ubuntu/jammy64
ubuntu/focal64   # only if ARM variant exists
```

Check box info:

```bash
vagrant box add ubuntu/jammy64
```

If it downloads successfully → box supports ARM.

---

## 8. Step 6 – Sample `Vagrantfile` (QEMU)

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/jammy64"

  config.vm.provider "qemu" do |q|
    q.arch = "aarch64"
    q.machine = "virt"
    q.cpu = "cortex-a72"
    q.memory = 2048
    q.cpus = 2
  end
end
```

---

## 9. Step 7 – Start the VM

```bash
vagrant up --provider=qemu
```

First boot may take time.

Login:

```bash
vagrant ssh
```

---

## 10. Common Errors and Fixes

### Error: `No usable default provider`

**Fix**

```bash
vagrant up --provider=qemu
```

---

### Error: `qemu-system-aarch64 not found`

**Cause**

* QEMU not installed or PATH issue

**Fix**

```bash
brew reinstall qemu
```

---

### Error: VM boots but SSH fails

**Cause**

* Box architecture mismatch

**Fix**

* Remove box:

```bash
vagrant box remove ubuntu/jammy64
```

* Re-add correct box

---

### Error: Extremely slow VM

**Cause**

* Running amd64 emulation

**Fix**

* Ensure:

```bash
uname -m
```

Inside VM should return:

```
aarch64
```

---

## 11. What NOT to Do (Important for Students)

Do NOT use:

* VirtualBox on M1/M2/M3
* Old `.box` files from Windows labs
* amd64-only boxes

Do NOT expect:

* Same provider across all OS

---

## 12. Instructor Recommendation (Best Practice)

For mixed classrooms:

* **Windows / Linux** → VirtualBox + Vagrant
* **macOS ARM** → QEMU + Vagrant
* **Same learning outcome** → Prefer Docker where possible
