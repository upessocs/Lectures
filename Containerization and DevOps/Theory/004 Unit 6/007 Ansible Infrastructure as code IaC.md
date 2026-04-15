# Ansible


**Problem Statement:**
Managing infrastructure manually across multiple servers leads to configuration drift, inconsistent environments, and time-consuming repetitive tasks. Scaling from one server to hundreds becomes nearly impossible with manual SSH-based administration.

### **What is Ansible?**
- Ansible is an open-source **automation tool** for **configuration management**, **application deployment**, and **orchestration**.
- It follows an **agentless** architecture, using SSH for Linux and WinRM for Windows.
- Uses YAML-based **playbooks** to define automation tasks.

> Ansible is software that enables cross-platform automation and orchestration at scale and has become the standard choice among enterprise automation solutions. 


### **How Ansible Solves the Problem:**
- **Agentless Architecture**: No software installation required on managed nodes
- **Idempotency**: Running playbooks multiple times yields same result
- **Declarative Syntax**: Describe desired state, not the steps to achieve it
- **Push-based**: Initiates changes from control node immediately

### **Key Concepts**
| Component       | Description |
| :----------------|:------------|
| **Control Node**|  Machine with Ansible installed| 
| **Managed Nodes**|  Target servers (no Ansible agent needed)| 
| **Inventory** | Defines the list of managed nodes (EC2 instances, servers, etc.). `inventory.ini`|
| **Playbooks** | YAML files containing a sequence of automation steps. |
| **Tasks** | Individual actions in playbooks (e.g., installing a package). |
| **Modules** | Built-in functionality to perform tasks (e.g., `yum`, `apt`, `service`). |
| **Roles** | Pre-defined reusable automation scripts. |


### How does Ansible work?

Ansible uses the concepts of control and managed nodes. It connects from the **control node**, any machine with Ansible installed, to the **managed nodes** sending commands and instructions to them.
The units of code that Ansible executes on the managed nodes are called **modules**. Each module is invoked by a **task**, and an ordered list of tasks together forms a **playbook.** Users write playbooks with tasks and modules to define the desired state of the system.
The managed machines are represented in a simplistic **inventory** file that groups all the nodes into different categories.
Ansible leverages a very simple language, [YAML](https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html), to define playbooks in a human-readable data format that is really easy to understand from day one.
> Even more, Ansible doesn’t require the installation of any extra agents on the managed nodes so it’s simple to start using it.
Typically, the only thing a user needs is a terminal to execute Ansible commands and a text editor to define the configuration files.


### Benefits of using Ansible

*   A free and open-source community project with a huge audience.
*   Battle-tested over many years as the preferred tool of IT wizards.
*   Easy to start and use from day one, without the need for any special coding skills.
*   Simple deployment workflow without any extra agents.
*   Includes some sophisticated features around modularity and reusability that come in handy as users become more proficient.
*   Extensive and comprehensive official documentation that is complemented by a plethora of online material produced by its community.

> To sum up, Ansible is simple yet powerful, agentless, community-powered, predictable, and secure.


---

## Part A

### **Ansible Installation Instructions**  

#### **1. Install via `pip` (Python Package Manager)**  
```bash
# Install Ansible globally
pip install ansible

# Verify installation
ansible --version
```
**Best for**: Latest versions, macOS/Linux, or Python environments.  

#### **2. Install via `apt` (Debian/Ubuntu)**  

```bash
# Update packages
sudo apt update -y

# Install Ansible
sudo apt install ansible -y

# Verify
ansible --version
```

**Best for**: Stable versions on Ubuntu/Debian.  

#### **3. Post-Installation Check**  
```bash
# Test with a local ping
ansible localhost -m ping
```
**Expected Output**:  
```json
localhost | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
```


---
# Ansible Demo

> Ansible demo with docker container as servers


---
# Create Docker image and test ssh login

> First create ssh key-pair and then create custom ubuntu-server image with open-ssh configured.

## Testing SSH Key Pair Login with Docker and WSL

Here's a step-by-step guide to create and test SSH key pair authentication between WSL and a Docker container running Ubuntu with OpenSSH server:

## 1. Create SSH Key Pair in WSL

First, generate an SSH key pair in your WSL environment:

```bash
# Generate RSA key pair (accept defaults when prompted)
ssh-keygen -t rsa -b 4096

# This creates:
# Private key: ~/.ssh/id_rsa
# Public key: ~/.ssh/id_rsa.pub
# copy keys to current directory to be added to docker images
cp ~/.ssh/id_rsa.pub .
cp ~/.ssh/id_rsa .
```

> Here’s a simple breakdown of where each key should be placed:

|File	|Location (Machine)	|Purpose|
|:---|:---|:---|
|id_rsa (Private Key)	|Your local machine (where you run ssh or Ansible)	|Used to authenticate when connecting to servers. Never share this!|
|id_rsa.pub (Public Key)	|Remote server (inside ~/.ssh/authorized_keys)	|Grants access to anyone who has the matching private key.|



## 2. Create Dockerfile for Ubuntu SSH Server

Create a Dockerfile with the following content:

```dockerfile
FROM ubuntu


RUN apt update -y
RUN apt install -y python3 python3-pip openssh-server
RUN mkdir -p /var/run/sshd

# Configure SSH
RUN mkdir -p /run/sshd && \
    echo 'root:password' | chpasswd && \
    sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config && \
    sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config


# Create .ssh directory and set proper permissions
RUN mkdir -p /root/.ssh && \
    chmod 700 /root/.ssh

# Copy SSH keys (note: this is not secure for production!)
COPY id_rsa /root/.ssh/id_rsa
COPY id_rsa.pub /root/.ssh/authorized_keys

# Set proper permissions for keys
RUN chmod 600 /root/.ssh/id_rsa && \
    chmod 644 /root/.ssh/authorized_keys

# Fix for SSH login
RUN sed -i 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' /etc/pam.d/sshd

# Expose SSH port
EXPOSE 22

# Start SSH service when container starts
CMD ["/usr/sbin/sshd", "-D"]
```

## 3. Build the Docker Image

```bash
# Copy your public key to the current directory
cp ~/.ssh/id_rsa.pub .

# Build the Docker image
docker build -t ubuntu-server .

# Remove the public key from build directory (optional)
rm id_rsa.pub
```

## 4. Run the Docker Container

```bash
# Run the container with port mapping
docker run -d -p --rm 2222:22 -p 8221:8221 --name ssh-test-server ubuntu-server

```

## 5. Find the Container IP Address

```bash
# Get the container's IP address
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ssh-test-server
```

Note this IP address (e.g., 172.17.0.2)

## 6. Test SSH Connections

### Test password authentication:
```bash
ssh root@localhost -p 2222
# OR
ssh root@172.17.0.2 
# If ssh keys are working it likely not use them, Else, When prompted, enter password: "password" 
```

### Test key-based authentication:
```bash
ssh -i ~/.ssh/id_rsa root@localhost -p 2222
# Should log in without password prompt
```

## 7. Alternative: Using Container IP Directly

If you prefer to use the container's IP instead of port mapping:

```bash
# Using the IP you got from docker inspect
ssh root@172.17.0.2
# or with key:
ssh -i ~/.ssh/id_rsa root@172.17.0.2
```

## Verification Steps

1. Confirm password authentication works
2. Confirm key-based authentication works without password prompt
3. Verify you can access port 8221 (though nothing is running there yet)
4. Check logs if any issues occur: `docker logs ssh-test`

## Clean Up

When done testing:
```bash
docker stop ssh-test
docker rm ssh-test
```

This setup demonstrates both SSH key-based authentication and password authentication working together in a Docker container.

---











# Ansible with Docker Exercise

Using docker image `ubuntu-server` created in previous part
run 4 test servers named server1 to serve4

#### Step 1: Start multiple containers to act as server (to be configured by ansible)

```bash
for i in {1..4}; do
  echo -e "\n Creating server${i}\n"
  docker run -d --rm -p 220${i}:22 --name server${i} ubuntu-server
  echo -e "IP of server${i} is $(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' server${i})"
done
```

#### Step X: To stop all servers (if required)

```bash
for i in {1..4}; do
  docker stop server${i}  
done
```


## Step 2: Create Ansible Inventory

below script will create an update inventory.ini with updated docker container IPs, review this file and you can create your own if needed.

```bash
# Get container IPs
echo "[servers]" > inventory.ini
for i in {1..4}; do
  docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' server${i} >> inventory.ini
done

# Add inventory variables
cat << EOF >> inventory.ini

[servers:vars]
ansible_user=root
; ansible_ssh_private_key_file=./id_rsa
ansible_ssh_private_key_file=~/.ssh/id_rsa
ansible_python_interpreter=/usr/bin/python3
EOF
```

## Step 3: review content of inventory.ini
```bash
cat inventory.ini
```

it should look something like
```ini
[servers]
172.17.0.3
172.17.0.4
172.17.0.5
172.17.0.6
server1 ansible_host=localhost ansible_connection=2201
server2 ansible_host=localhost ansible_connection=2202
server3 ansible_host=localhost ansible_connection=2203
server4 ansible_host=localhost ansible_connection=2204

[servers:vars]
ansible_user=root
; ansible_ssh_private_key_file=./id_rsa
ansible_ssh_private_key_file=~/.ssh/id_rsa
ansible_python_interpreter=/usr/bin/python3


```
## Step 4: Test Connectivity
```bash
# Manual SSH test
ssh -i $(pwd)/id_rsa root@172.17.0.3
## above on will work on linux and may cause problems on NTFS file systems, then try
ssh -i ~/.ssh/id_rsa root@172.17.0.3 

# Ansible ping test
ansible all -i inventory.ini -m ping
OR
ansible all -i inventory.ini -m ping -vvv
```

## Step 5: Create Playbook (update.yml)


The yaml file should start with three dash only `---`

```yaml
--- # it should start with three dash only
- name: Update and configure servers
  hosts: all
  become: yes

  tasks:
    - name: Update apt packages
      apt:
        update_cache: yes
        upgrade: dist

    - name: Install required packages
      apt:
        name: ["vim", "htop", "wget"]
        state: present

    - name: Create test file
      copy:
        dest: /root/ansible_test.txt
        content: "Configured by Ansible on {{ inventory_hostname }}"
```





## Step 6: Run Playbook
```bash
ansible-playbook -i inventory.ini playbook1.yml
```

## Step 7: Verify Changes
```bash
# Using Ansible
ansible all -i inventory.ini -m command -a "cat /root/ansible_test.txt"

# Manually via Docker
for i in {1..4}; do
  docker exec server${i} cat /root/ansible_test.txt
done
```

## Step 8: Cleanup
```bash
# Stop and remove containers
for i in {1..4}; do docker rm -f server${i}; done
```



> The workflow is now:
> 1. Setup SSH keys → 2. Build image → 3. Launch containers → 4. Create inventory → 5. Test → 6. Run playbook → 7. Verify → 8. Cleanup



---

Try this playbook also

`playbook1.yml`

> The yaml file should start with three dash only `---`

```yaml
--- # it should start with three dash only
- name: Configure multiple servers
  hosts: servers
  become: yes

  tasks:
    - name: Update apt package index
      apt:
        update_cache: yes

    - name: Install Python 3.13 (or latest available)
      apt:
        name: python3
        state: latest

    - name: Create test file with content
      copy:
        dest: /root/test_file.txt
        content: |
          This is a test file created by Ansible
          Server name: {{ inventory_hostname }}
          Current date: {{ ansible_date_time.date }}

    - name: Display system information
      command: uname -a
      register: uname_output
      
    - name: Show disk space
      command: df -h
      register: disk_space

    - name: Print results
      debug:
        msg: 
          - "System info: {{ uname_output.stdout }}"
          - "Disk space: {{ disk_space.stdout_lines }}"
```


---

# The Need for Ansible in Server Management

### Ansible is a powerful automation tool that addresses several critical challenges in server management:

1. **Scalability**: Managing multiple servers manually becomes impractical as infrastructure grows.
2. **Consistency**: Ensures identical configurations across all servers, reducing "works on my machine" issues.
3. **Efficiency**: Automates repetitive tasks, saving time and reducing human error.
4. **Idempotency**: Operations can be run multiple times without causing unintended changes.
5. **Infrastructure as Code**: Configuration is version-controlled and documented.


### **Key Features of Ansible**  
1. **Agentless** – Uses SSH (no need to install software on managed nodes).  
2. **Idempotent** – Ensures desired state without repeating changes unnecessarily.  
3. **YAML-Based Playbooks** – Simple, human-readable automation scripts.  
4. **Modules** – 3000+ built-in modules for cloud, containers, networking, etc.  
5. **Push-Based** – Executes tasks from a control machine.  
6. **Infrastructure as Code (IaC)** – Supports declarative configuration management.  




### **Why Choose Ansible?**  
- **No Agents**: Uses SSH/WinRM.  
- **Extensible**: Custom modules via Python.  
- **Multi-Platform**: Linux, Windows, cloud (AWS/Azure), networking devices.  

For troubleshooting, check:  
```bash
ansible-doc -l         # List all modules
ansible-doc apt        # View module docs
# do try
ansible-doc -l | grep aws
```  

# You can try this using ubuntu running in VM instead of docker container or your another system.



>  Try to use **Ansible** to configure an **EC2 instance** on **AWS**. 






---
## Optional Part B

### 1. **Set up a local environment**:
- **Install Ansible**: If you're on Linux or macOS, you can install Ansible with:
```bash
sudo apt-get install ansible  # For Ubuntu
brew install ansible          # For macOS
```
For Windows, you can install Ansible using Windows Subsystem for Linux (WSL) or use the Windows version of Ansible through Cygwin.

- **Create a Virtual Machine or Use Containers**: You can use tools like VirtualBox, Vagrant, or Docker to spin up virtual machines or containers to test Ansible playbooks locally.
- For Vagrant:
```bash
vagrant init ubuntu/bionic64
vagrant up
```

- **Set Up Local Inventory**: Create an inventory file (`inventory.ini`) listing the hosts you want to target. For testing locally, you can use `localhost`:
```ini
[local]
localhost ansible_connection=local
```

### 2. **Write a Simple Playbook**:
A playbook is where you'll define the tasks you want Ansible to perform. Here's an example of a simple playbook that installs `nginx` on your machine:

Create a file `install_nginx.yml`

> The yaml file should start with three dash only `---`

```yaml
--- # it should start with three dash only
- name: Install Nginx on localhost
hosts: local
become: yes
tasks:
- name: Install nginx package
 apt:
   name: nginx
   state: present
```

### 3. **Run the Playbook**:
Test the playbook by running it on the local host. Use the command:
```bash
ansible-playbook -i inventory.ini install_nginx.yml
```

### 4. **Test Other Tasks**:
- Test various modules (like `copy`, `file`, `template`, `command`, etc.) to get hands-on experience.
- Create playbooks for different tasks (e.g., managing services, creating users, configuring files).

### 5. **Use Ansible Vault for Secrets**:
When you're ready to manage sensitive data, learn how to use Ansible Vault to encrypt passwords and other secrets:
```bash
ansible-vault create secrets.yml
```

### 6. **Use `ansible` Command for Ad-hoc Tasks**:
For testing individual tasks without creating a playbook, you can use the `ansible` command:
```bash
ansible localhost -m ping -i inventory.ini
```

### 7. **Leverage Ansible Collections**:
Explore Ansible collections, which are packaged sets of modules and roles. Install them from Ansible Galaxy for more functionality:

```bash
ansible-galaxy collection install community.general
```

### 8. **Test Different Ansible Features**:
- **Roles**: Organize playbooks using roles.
- **Variables**: Learn how to use variables and templates.
- **Handlers**: Use handlers to trigger actions like restarting a service when a configuration file changes.

### 9. **Use Docker for Testing**:
If you want a clean slate for testing or isolated environments, use Docker to run containers. Example to test in Docker:

```bash
docker run -it --rm ubuntu bash
apt update
apt install ansible
```

> By following these steps, you'll gain hands-on experience with Ansible in a local environment, and you can expand to more advanced use cases as you grow more comfortable with its features.


### References:

- [https://spacelift.io/blog/ansible-tutorial](https://spacelift.io/blog/ansible-tutorial)
- Official Website: **[https://www.ansible.com](https://www.ansible.com)**  
- Documentation: **[https://docs.ansible.com](https://docs.ansible.com)**  
- GUI [Ansible Tower](https://ansible.github.io/lightbulb/decks/intro-to-ansible-tower.html)
- GUI [Ansible Tower Tutorial](https://www.geeksforgeeks.org/devops/ansible-tower/)



