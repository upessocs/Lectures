https://spacelift.io/blog/ansible-tutorial

> What is Ansible? How does it work? See the Ansible tutorial for beginners with playbook and commands explained with examples.

# Ansible Tutorial for Beginners: Playbook & Examples
Ansible is software that enables cross-platform automation and orchestration at scale and has become the standard choice among enterprise automation solutions. 

It’s mostly addressed to IT operators, administrators, and decision-makers, helping them achieve operational excellence across their entire infrastructure ecosystem.

Backed by RedHat and a loyal open-source community, it is considered an excellent option for configuration management, infrastructure provisioning, and application deployment use cases. 

Its automation opportunities are endless across hybrid clouds, on-prem infrastructure, and IoT and it’s an engine that can greatly improve the efficiency and consistency of your IT environments.

Ready to automate everything? Let’s go!

### How does Ansible work?

Ansible uses the concepts of control and managed nodes. It connects from the **control node**, any machine with Ansible installed, to the **managed nodes** sending commands and instructions to them.

The units of code that Ansible executes on the managed nodes are called **modules**. Each module is invoked by a **task**, and an ordered list of tasks together forms a **playbook.** Users write playbooks with tasks and modules to define the desired state of the system.

The managed machines are represented in a simplistic **inventory** file that groups all the nodes into different categories.

Ansible leverages a very simple language, [YAML](https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html), to define playbooks in a human-readable data format that is really easy to understand from day one.

Even more, Ansible doesn’t require the installation of any extra agents on the managed nodes so it’s simple to start using it.

Typically, the only thing a user needs is a terminal to execute Ansible commands and a text editor to define the configuration files.

### Benefits of using Ansible

*   A free and open-source community project with a huge audience.
*   Battle-tested over many years as the preferred tool of IT wizards.
*   Easy to start and use from day one, without the need for any special coding skills.
*   Simple deployment workflow without any extra agents.
*   Includes some sophisticated features around modularity and reusability that come in handy as users become more proficient.
*   Extensive and comprehensive official documentation that is complemented by a plethora of online material produced by its community.

To sum up, Ansible is simple yet powerful, agentless, community-powered, predictable, and secure.

Read more: [Ansible Use Cases – Management & Automation Examples](https://spacelift.io/blog/ansible-use-cases)


---


To learn and test Ansible locally, follow these steps:

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

Create a file `install_nginx.yml`:
```yaml
---
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

By following these steps, you'll gain hands-on experience with Ansible in a local environment, and you can expand to more advanced use cases as you grow more comfortable with its features.
