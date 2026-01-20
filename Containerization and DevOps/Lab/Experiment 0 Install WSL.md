Below is the **revised Lab Manual**, with:

* **Authoritative “Read More” resource URLs** added at the end of each experiment
* **Experiment 1 updated** to explicitly use **Vagrant + VirtualBox** with your provided **Linux Mint 21.2 box** for **VM vs Docker performance comparison**
* Academic, step-by-step, code-inclusive format preserved

---

# LAB MANUAL

## Virtualization and Containerization

---

## Experiment 0

### Installation and Environment Setup using WSL

### Objective

* Install WSL with Ubuntu
* Configure Linux terminal environment
* Install Git, VirtualBox, Vagrant
* Install Docker and/or Podman

---

### Requirements

**Hardware**

* 64-bit system with virtualization enabled
* Minimum 8 GB RAM (recommended)

**Software**

* Windows 10/11
* Internet connection

---

### Procedure

#### Step 1: Install WSL with Ubuntu (PowerShell – Administrator)

```powershell
wsl --install -d Ubuntu
```

Restart if prompted.

Verify:

```powershell
wsl --status
```

---

#### Step 2: Update Ubuntu

```bash
sudo apt update
sudo apt upgrade -y
```

---

#### Step 3: Install Git

```bash
sudo apt install git -y
git --version
```

---

#### Step 4: Install Docker Engine

```bash
sudo apt install ca-certificates curl gnupg -y
sudo install -m 0755 -d /etc/apt/keyrings

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu \
$(lsb_release -cs) stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io -y
```

Verify:

```bash
docker --version
```

(Optional)

```bash
sudo usermod -aG docker $USER
```

---

#### Step 5 (Alternative): Install Podman

```bash
sudo apt install podman -y
podman --version
```

---

#### Step 6: Install VirtualBox (Windows Host)

Download and install:

```
https://www.virtualbox.org/wiki/Downloads
```

Verify:

```powershell
VBoxManage --version
```

---

#### Step 7: Install Vagrant

Download:

```
https://developer.hashicorp.com/vagrant/downloads
```

Verify:

```powershell
vagrant --version
```

---

### Result

WSL, Ubuntu, Git, Docker/Podman, VirtualBox, and Vagrant were successfully installed.

---

### Read More (Experiment 0)

* WSL Documentation: [https://learn.microsoft.com/windows/wsl/](https://learn.microsoft.com/windows/wsl/)
* Docker Install Guide: [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)
* Podman Docs: [https://podman.io/docs](https://podman.io/docs)
* VirtualBox Docs: [https://www.virtualbox.org/manual/](https://www.virtualbox.org/manual/)
* Vagrant Docs: [https://developer.hashicorp.com/vagrant/docs](https://developer.hashicorp.com/vagrant/docs)

