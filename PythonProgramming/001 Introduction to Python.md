# Introduction Lecture 1 and 2
## What is Python?

Python is a high-level, interpreted programming language known for its readability, simplicity, and versatility. It was created by Guido van Rossum and released in 1991. Python supports multiple programming paradigms, including procedural, object-oriented, and functional programming.

## Key Features of Python:

* Easy to Read and Write: Python’s syntax is clean and simple, making it easy for beginners to learn and for developers to read and maintain code.
* Interpreted Language: Python is interpreted, meaning code is executed line by line. This makes debugging easier but can impact performance.
* Dynamically Typed: Variables in Python do not require explicit declarations. The type is determined at runtime.
* Extensive Standard Library: Python comes with a rich standard library that supports a wide range of tasks, from file I/O to web development.
* Cross-Platform: Python is platform-independent, meaning code written on one operating system can run on another with little to no modification.
---




### 1. **Difference Between Python and C**
#### **Level of Language**:
- **C**: C is a low-level, compiled language closer to machine language. It gives you control over hardware and memory.
- **Python**: Python is a high-level, interpreted language that abstracts away most of the hardware-level details.
#### **Execution**:
- **C**: C programs are compiled into machine code using a compiler, which makes them faster but platform-dependent.
- **Python**: Python code is interpreted by the Python interpreter at runtime, which makes it slower but platform-independent.
#### **Syntax**:
- **C**: C has a more complex syntax with explicit data types, pointers, and manual memory management.
- **Python**: Python has a simpler, more readable syntax that doesn't require explicit declaration of data types.
#### **Use Cases**:
- **C**: Used in system programming, embedded systems, and performance-critical applications.
- **Python**: Used in web development, data analysis, artificial intelligence, and automation.
### 2. **Scripting vs. Dynamically Typed Languages**
#### **Scripting**: Scripting languages like Python are interpreted, meaning they are executed line by line. They are often used for automation, file manipulation, and quick tasks.
#### **Dynamically Typed**: In dynamically typed languages, variable types are determined at runtime. For example, in Python, you can assign different types to the same variable without explicit declarations (e.g., `x = 10` then `x = "hello"`).

---
### 3. **Why and How to Install WSL/WSL2 (Ubuntu)**
#### **Why Install WSL/WSL2**: WSL (Windows Subsystem for Linux) allows you to run a Linux environment on Windows without a virtual machine. WSL2 offers better performance and full Linux kernel compatibility.
#### **How to Install**:
1. **Enable WSL**: 
- Open PowerShell as an administrator and run:
```shell
wsl --install
```
- This installs the latest WSL version (WSL2 by default) and a Linux distribution (usually Ubuntu).
2. **Install a Specific Distro**:
- To install a specific distribution like Ubuntu, run:
```shell
wsl --install -d ubuntu
```
3. **Set WSL2 as Default**:
- After installation, you can set WSL2 as the default by running:
```shell
wsl --set-default-version 2
```

---
### 4. **How to Install Nix on WSL**
#### **Nix**: Nix is a powerful package manager for Linux and other Unix-like systems. It allows declarative configuration and reproducible builds.
#### **Installation Steps**:
1. Open your WSL terminal (e.g., Ubuntu).
2. Run the following command to install Nix:
```shell
sh <(curl -L https://nixos.org/nix/install) --daemon
```
3. Follow the prompts to complete the installation.
4. After installation, source your shell configuration file or restart your terminal:
```shell
source ~/.profile
```
---
### 5. **What is Git and GitHub**
#### **Git**: Git is a distributed version control system that tracks changes in source code during software development.
#### **GitHub**: GitHub is a cloud-based hosting service for Git repositories. It allows for collaboration, version control, and code sharing among developers.
### 6. **How GitHub Commit/Contribution History is Helpful While Hiring**
#### **Demonstrates Expertise**: A strong commit history shows a developer's experience and contribution to projects.
#### **Quality of Work**: Employers can review the quality of code, the complexity of issues solved, and the consistency of contributions.
#### **Collaboration**: It reflects the candidate’s ability to work in teams, manage pull requests, and contribute to open-source projects.
### 7. **Advantages of Education.GitHub.com for Students**
#### **Free Access to Tools**: GitHub Student Pack offers free access to various development tools, cloud services, and resources.
#### **Learning Opportunities**: Students get access to learning materials, tutorials, and courses.
#### **Portfolio Building**: Students can build and showcase projects on GitHub, which can be helpful for internships and job applications.
### 8. **How to Install Git-SCM and Configure it to Use GitHub Account**
#### **Install Git-SCM**:
1. Download the installer from [git-scm.com](https://git-scm.com).
2. Run the installer and follow the setup instructions.
#### **Configure Git with GitHub**:
1. Set up your username and email:
```shell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```
2. Generate an SSH key:
```shell
ssh-keygen -t rsa -b 4096 -C "your.email@example.com"
```
3. Add the SSH key to your GitHub account:
- Copy the key to your clipboard:
```shell
cat ~/.ssh/id_rsa.pub | clip
```
- Paste it into the SSH and GPG keys section of your GitHub account settings.
4. Test your connection:
```shell
ssh -T git@github.com
```

---
### 9. **Idle Command Window and .py Script Execution**
#### **IDLE**: IDLE is Python's Integrated Development and Learning Environment. You can execute Python commands directly in the IDLE shell or write scripts in the editor.
#### **.py Script Execution**:
1. Open a command window (cmd) or terminal.
2. Navigate to the directory where your `.py` script is located.
3. Run the script by typing:
```shell
python script_name.py
```
This should cover the key points for each topic!