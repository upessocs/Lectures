# **Lab Manual**  
#### **Experiment 7**  
**Title:** To understand the concept of containerization, its advantages over traditional deployment methods, and the basics of container runtime and images using Docker and sample container images.  

---

### **Objective:**  
1. Understand the concept of containerization and how it differs from traditional virtualization.  
2. Learn the benefits of containerization in software development and deployment.  
3. Explore the fundamentals of Docker, including images, containers, and runtime environments.  
4. Use sample container images to demonstrate the creation and deployment of containers.  

---

### **Theory:**  

#### **What is Containerization?**  
- Containerization is a lightweight virtualization technique that packages an application and its dependencies into a container, ensuring that it runs consistently across different environments.  
- Unlike traditional methods that rely on full virtual machines, containers share the host OS kernel, making them more efficient.  

#### **Key Concepts:**  
1. **Images:**  
- A container image is a lightweight, standalone, and executable package of software that includes everything needed to run a piece of software (code, runtime, libraries, etc.).  
- Images are immutable and serve as the blueprint for containers.  

2. **Containers:**  
- Containers are running instances of images.  
- They are isolated, portable, and can be created, stopped, restarted, and destroyed as needed.  

3. **Container Runtime:**  
- The software responsible for running and managing containers.  
- Docker is the most widely used container runtime.  

#### **Advantages of Containerization Over Traditional Methods:**  
- **Portability:** Containers can run anywhere (local machine, cloud, on-premises).  
- **Resource Efficiency:** Containers share the host OS kernel, making them smaller and faster.  
- **Isolation:** Applications in containers are isolated from one another, improving security.  
- **Faster Deployment:** Containers start in seconds and simplify the deployment process.  
- **Consistency:** "It works on my machine" problems are eliminated.  

---

### **Apparatus/Software Required:**  
1. Docker (installed on the system).  
2. Sample container images (e.g., Nginx, Python, MySQL).  
3. Linux/Windows/macOS system with Docker support.  

---

### **Procedure:**  

1. **Install Docker:**  
- Install Docker Desktop or Docker Engine based on your system.  
- Verify installation using the command:  
 ```bash
 docker --version
 ```  

2. **Understand Docker Images:**  
- Search for Docker images from Docker Hub using:  
 ```bash
 docker search <image_name>
 ```  
- Pull a sample image, such as Nginx:  
 ```bash
 docker pull nginx
 ```  

3. **Run a Container:**  
- Use the pulled image to create and run a container:  
 ```bash
 docker run -d -p 8080:80 nginx
 ```  
- Verify the container is running using:  
 ```bash
 docker ps
 ```  

4. **Inspect the Container:**  
- View logs:  
 ```bash
 docker logs <container_id>
 ```  
- Inspect the container:  
 ```bash
 docker inspect <container_id>
 ```  

5. **Stop and Remove the Container:**  
- Stop a running container:  
 ```bash
 docker stop <container_id>
 ```  
- Remove the container:  
 ```bash
 docker rm <container_id>
 ```  

6. **Build a Custom Docker Image:**  

`app.py`
```python
sapid=12312312

print(f"my sap id is {sapit}")
```

- Create a simple Dockerfile:  
 ```Dockerfile
 FROM python:3.9-slim  
 COPY app.py /app/  
 CMD ["python", "/app/app.py"]  
 ```  
- Build the image:  
 ```bash
 docker build -t my-python-app .
 ```  

7. **Deploy the Custom Image:**  
- Run the custom container:  
 ```bash
 docker run -d my-python-app
 ```  

---

### **Observations:**  
1. Document the steps and commands used in each stage.  
2. Observe how containers start quickly compared to traditional virtual machines.  
3. Note the size and resource efficiency of containers.  

---

### **Result:**  
The experiment successfully demonstrated the concept of containerization, its advantages, and the basic operations in Docker using container images and containers.  

---

### **Questions for Review:**  
1. What is the difference between a Docker image and a Docker container?  
2. How does containerization improve application deployment compared to traditional methods?  
3. Explain the role of the Dockerfile in creating custom images.  
4. What are the benefits of sharing the host OS kernel in containerization?  
5. Compare the performance of a container and a virtual machine.  

