
# **DevOps Lab Experiment File**


### **Experiment 1: Core Principles of DevOps and its Significance**

#### **Objective:**
To understand the core principles of DevOps, its significance in modern software development, and its practical application using DevOps tools and a sample code repository.

#### **Tools Required:**
1. Git
2. Docker
3. Jenkins
4. Sample Code Repository (e.g., from GitHub)

#### **Procedure:**

1. **Setup Environment**:
- Ensure you have the following installed:
- **Git**:
```bash
sudo apt update
sudo apt install git -y
git --version
```
- **Docker**:
```bash
sudo apt update
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker
docker --version
```
- **Jenkins**:
```bash
sudo apt update
sudo apt install openjdk-11-jdk -y
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt update
sudo apt install jenkins -y
sudo systemctl start jenkins
sudo systemctl enable jenkins
```
- Verify Jenkins installation by accessing `http://<your-server-ip>:8080`.

2. **Clone the Sample Code Repository**:
- Choose a sample repository, such as a Node.js or Python app:
```bash
git clone https://github.com/some-sample-repo.git
cd some-sample-repo
```

3. **Build and Run Application using Docker**:
- Create a `Dockerfile` in the project directory if not available.
- Build the Docker image:
```bash
docker build -t sample-app .
```
- Run the container:
```bash
docker run -d -p 8080:8080 sample-app
```

4. **Integrate CI/CD with Jenkins**:
- Add a new job in Jenkins and configure the Git repository.
- Set up a build trigger for commits and configure Jenkins to run build and deployment tasks.

5. **Observation**:
- Understand how Git, Docker, and Jenkins work together to automate build, test, and deployment tasks.
- Explore logs in Jenkins and Docker.

---

### **Experiment 2: Application Release Automation (ARA) in DevOps**

#### **Objective:**
To explore the components and benefits of Application Release Automation (ARA) in the context of DevOps using ARA tools.

#### **Tools Required:**
1. Ansible
2. Jenkins
3. Docker

#### **Procedure:**

1. **Setup Environment**:
- Install **Ansible**:
```bash
sudo apt update
sudo apt install ansible -y
ansible --version
```
- Ensure **Docker** and **Jenkins** are already installed from Experiment 1.

2. **Prepare Ansible Playbooks**:
- Create a directory for playbooks:
```bash
mkdir ansible-playbooks
cd ansible-playbooks
```
- Write a playbook (`deploy.yml`) for deploying a sample application:
```yaml
- hosts: localhost
tasks:
 - name: Pull Docker image
   docker_image:
	 name: sample-app
	 source: pull

 - name: Run Docker container
   docker_container:
	 name: sample-container
	 image: sample-app
	 state: started
	 ports:
	   - "8080:8080"
```

3. **Integrate ARA with Jenkins**:
- Install Ansible plugin in Jenkins.
- Configure Jenkins to trigger Ansible playbooks after a successful build.

4. **Execute Playbooks**:
- Test the playbook locally:
```bash
ansible-playbook deploy.yml
```
- Observe the logs to verify deployment.

5. **Observation**:
- Understand the role of ARA tools like Ansible in automating application deployment.
- Examine how ARA complements CI/CD pipelines for reliable and repeatable releases.

---

### **Conclusion:**
Both experiments demonstrate the practical application of DevOps principles, focusing on automation, continuous integration, and continuous delivery. These labs equip students with hands-on skills using modern DevOps tools like Git, Docker, Jenkins, and Ansible.
