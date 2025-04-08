# **Lab Manual: Exploring Container Runtime Internals**

## **Experiment Title**  
**Exploring the Internals of Container Runtimes**  
*Understanding chroot, FreeBSD Jails, LXC, and Docker*  

### **Objective**  
To investigate the underlying technologies of container runtimes, including:  
- The `chroot` system call  
- FreeBSD Jails  
- Linux Containers (LXC)  
- Docker’s containerization approach  

By the end of this lab, students should be able to:  
1. Understand how isolation mechanisms work in Unix-like systems.  
2. Compare different containerization technologies.  
3. Run basic containers using `chroot`, LXC, and Docker.  

---

## **Prerequisites**  
- A Linux-based system (Ubuntu/Debian recommended)  
- VirtualBox (for FreeBSD Jails)  
- Docker installed (`sudo apt install docker.io`)  
- LXC installed (`sudo apt install lxc`)  
- Basic command-line familiarity  

---

## **Lab Tasks**  

### **Task 1: Experimenting with `chroot`**  
**Objective:** Understand how `chroot` provides filesystem isolation.  

#### **Steps:**  
1. Create a minimal filesystem for `chroot`:  
   ```bash
   mkdir -p ~/chroot-demo/{bin,lib,lib64}
   ```
2. Copy essential binaries (e.g., `bash`, `ls`) into the `chroot` environment:  
   ```bash
   cp /bin/bash ~/chroot-demo/bin/
   cp /bin/ls ~/chroot-demo/bin/
   ```
3. Copy required libraries (use `ldd` to find dependencies):  
   ```bash
   ldd /bin/bash
   cp /lib/x86_64-linux-gnu/{libtinfo.so.6,libc.so.6,libdl.so.2} ~/chroot-demo/lib/
   cp /lib64/ld-linux-x86-64.so.2 ~/chroot-demo/lib64/
   ```
4. Enter the `chroot` jail:  
   ```bash
   sudo chroot ~/chroot-demo /bin/bash
   ```
5. Test isolation by running `ls` and attempting to access `/` outside the jail.  

**Discussion:**  
- What are the limitations of `chroot`?  
- How does this compare to modern containers?  

---

### **Task 2: FreeBSD Jails (Using VirtualBox)**  
**Objective:** Explore FreeBSD’s process isolation mechanism.  

#### **Steps:**  
1. Install FreeBSD in VirtualBox.  
2. Create a jail:  
   ```sh
   sudo jail -c path=/mnt/jail1 ip4.addr=192.168.1.100 command=/bin/sh
   ```
3. Verify isolation:  
   ```sh
   jls   # List active jails
   ```
4. Compare with Linux namespaces.  

**Discussion:**  
- How do FreeBSD Jails differ from Linux containers?  
- What security benefits do they offer?  

---

### **Task 3: Linux Containers (LXC)**  
**Objective:** Run a lightweight Linux container using LXC.  

#### **Steps:**  
1. Install LXC:  
   ```bash
   sudo apt install lxc
   ```
2. Create and start an Ubuntu container:  
   ```bash
   sudo lxc-create -n mycontainer -t download -- --dist ubuntu --release focal --arch amd64
   sudo lxc-start -n mycontainer
   ```
3. Enter the container:  
   ```bash
   sudo lxc-attach -n mycontainer
   ```
4. Compare processes inside/outside using `ps aux`.  

**Discussion:**  
- How does LXC use cgroups and namespaces?  
- How does LXC differ from Docker?  

---

### **Task 4: Docker Containerization**  
**Objective:** Run a Docker container and analyze its runtime.  

#### **Steps:**  
1. Pull and run an Alpine Linux container:  
   ```bash
   docker run -it alpine sh
   ```
2. Inside the container, check processes:  
   ```sh
   ps aux
   ```
3. Compare with host processes (`ps aux` on host).  
4. Inspect Docker’s use of layers:  
   ```bash
   docker inspect <container_id>
   ```

**Discussion:**  
- How does Docker build on LXC/chroot concepts?  
- What advantages does Docker provide over raw LXC?  

---

## **Post-Lab Questions**  
1. What is the primary security limitation of `chroot`?  
2. How do FreeBSD Jails improve upon `chroot`?  
3. What kernel features enable LXC/Docker isolation?  
4. Compare the performance overhead of VMs vs. containers.  

---

## **Conclusion**  
This lab explored foundational containerization technologies, from `chroot` to modern Docker containers. Understanding these layers helps in debugging and optimizing containerized applications.  


