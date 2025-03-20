

## **1. Introduction to Ansible**


>  Learn **Ansible** and use it to configure an **EC2 instance** on **AWS**. 

### **What is Ansible?**
- Ansible is an open-source **automation tool** for **configuration management**, **application deployment**, and **orchestration**.
- It follows an **agentless** architecture, using SSH for Linux and WinRM for Windows.
- Uses YAML-based **playbooks** to define automation tasks.

### **Key Concepts**
| Component       | Description |
|----------------|------------|
| **Inventory** | Defines the list of managed nodes (EC2 instances, servers, etc.). |
| **Playbooks** | YAML files containing a sequence of automation steps. |
| **Tasks** | Individual actions in playbooks (e.g., installing a package). |
| **Modules** | Built-in functionality to perform tasks (e.g., `yum`, `apt`, `service`). |
| **Roles** | Pre-defined reusable automation scripts. |

---

## **2. Install Ansible on Your Local Machine**
### **On Ubuntu/Linux**
```bash
sudo apt update
sudo apt install -y ansible
```

### **On macOS**
```bash
brew install ansible
```

### **On Windows (WSL)**
1. Enable WSL (Windows Subsystem for Linux) and install Ubuntu.
2. Run:
   ```bash
   sudo apt update
   sudo apt install -y ansible
   ```

---

## **3. Set Up AWS Credentials for Ansible**
Ansible uses **boto3** and **botocore** to interact with AWS. Install them:
```bash
pip install boto3 botocore
```

**Configure AWS CLI (Required for Ansible to authenticate):**
```bash
aws configure
```
You'll be prompted to enter:
- **AWS Access Key ID**
- **AWS Secret Access Key**
- **Default region** (e.g., `us-east-1`)
- **Output format** (default: `json`)

---

## **4. Create an EC2 Instance Using Ansible**
### **Step 1: Define an Inventory File**
Create `inventory.ini`:
```ini
[aws_servers]
ec2-instance ansible_host=your-ec2-public-ip ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/id_rsa
```

---

### **Step 2: Write an Ansible Playbook to Launch an EC2 Instance**
Create `launch-ec2.yml`:
```yaml
- name: Launch EC2 instance
  hosts: localhost
  connection: local
  gather_facts: False
  tasks:
    - name: Create an EC2 instance
      amazon.aws.ec2_instance:
        name: "Ansible-EC2"
        key_name: "your-key-pair"
        instance_type: "t2.micro"
        security_groups: ["default"]
        image_id: "ami-0c55b159cbfafe1f0" # Amazon Linux 2 AMI (Change based on region)
        region: "us-east-1"
        wait: yes
      register: ec2

    - name: Add new instance to inventory
      add_host:
        name: "{{ ec2.instances[0].public_ip_address }}"
        groups: aws_servers
```
Run the playbook:
```bash
ansible-playbook launch-ec2.yml
```

---

## **5. Configure EC2 Instance Using Ansible**
Once the EC2 instance is running, we can install and configure software on it.

### **Step 1: Write a Playbook to Configure EC2**
Create `configure-ec2.yml`:
```yaml
- name: Configure EC2 instance
  hosts: aws_servers
  become: yes
  tasks:
    - name: Update packages
      apt:
        update_cache: yes

    - name: Install Nginx
      apt:
        name: nginx
        state: present

    - name: Start and Enable Nginx
      service:
        name: nginx
        state: started
        enabled: yes
```

Run the playbook:
```bash
ansible-playbook -i inventory.ini configure-ec2.yml
```

---

## **6. Verify the Configuration**
### **Check if Nginx is Running**
```bash
ssh -i ~/.ssh/id_rsa ubuntu@your-ec2-public-ip
systemctl status nginx
```

### **Access the Nginx Web Page**
Open your browser and go to:
```
http://your-ec2-public-ip
```
You should see the **Nginx default page**.

---

## **7. Cleanup - Terminate the EC2 Instance**
To terminate the EC2 instance, create `terminate-ec2.yml`:
```yaml
- name: Terminate EC2 instance
  hosts: localhost
  connection: local
  gather_facts: False
  tasks:
    - name: Terminate EC2 instance
      amazon.aws.ec2_instance:
        state: absent
        instance_ids: "{{ ec2.instances[0].id }}"
        region: "us-east-1"
```
Run the playbook:
```bash
ansible-playbook terminate-ec2.yml
```

---

## **Conclusion**
You have successfully:
* Installed Ansible  
* Launched an EC2 instance  
* Configured Nginx using Ansible  
* Terminated the EC2 instance  

This process can be extended to automate large-scale deployments. 