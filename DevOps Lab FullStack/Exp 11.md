# **Lab Manual: Docker Architecture & Container Orchestration**  
## **Understanding Docker, Docker Swarm, and Kubernetes**  

### **Experiment Title**  
**Exploring Docker Architecture and Container Orchestration**  

### **Objective**  
By the end of this lab, students will:  
1. Understand Docker’s architecture and components.  
2. Deploy a multi-container application using Docker.  
3. Compare Docker Swarm and Kubernetes for orchestration.  
4. Set up a basic Docker Swarm cluster and deploy a sample application.  

---

## **Prerequisites**  
- **Docker installed** (`sudo apt install docker.io` or [Docker Desktop](https://www.docker.com/products/docker-desktop))  
- **Docker Compose** (`sudo apt install docker-compose`)  
- **Basic Linux command-line knowledge**  
- **A sample application (e.g., a Flask + Redis app or a simple web service)**  

---

## **Lab Tasks**  

### **Task 1: Docker Architecture & Basic Commands**  
**Objective:** Understand Docker components (Docker Engine, Images, Containers, Registries).  

#### **Steps:**  
1. Verify Docker installation:  
   ```bash
   docker --version
   docker info
   ```
2. Pull and run a sample container:  
   ```bash
   docker run hello-world
   ```
3. List running and stopped containers:  
   ```bash
   docker ps -a
   ```
4. Inspect Docker’s storage and networking:  
   ```bash
   docker system df
   docker network ls
   ```

**Discussion:**  
- What are the key components of Docker?  
- How does Docker differ from a virtual machine?  

---

### **Task 2: Deploying a Multi-Container App with Docker Compose**  
**Objective:** Use Docker Compose to define and run a multi-service application.  

#### **Steps:**  
1. Create a `docker-compose.yml` file for a Flask + Redis app:  
   ```yaml
   version: "3.8"
   services:
     web:
       image: flask-app:latest
       ports:
         - "5000:5000"
       depends_on:
         - redis
     redis:
       image: redis:alpine
   ```
2. Build and run the application:  
   ```bash
   docker-compose up -d
   ```
3. Verify services are running:  
   ```bash
   docker-compose ps
   ```
4. Access the app at `http://localhost:5000`.  

**Discussion:**  
- How does Docker Compose simplify multi-container deployments?  
- What are the limitations of Docker Compose for production?  

---

### **Task 3: Introduction to Docker Swarm**  
**Objective:** Set up a basic Docker Swarm cluster and deploy a service.  

#### **Steps:**  
1. Initialize a Swarm (on the manager node):  
   ```bash
   docker swarm init
   ```
2. Add worker nodes (if available):  
   ```bash
   docker swarm join --token <token> <manager-ip>:2377
   ```
3. Deploy a sample service (Nginx):  
   ```bash
   docker service create --name web --replicas 3 -p 8080:80 nginx
   ```
4. Check service status:  
   ```bash
   docker service ls
   docker service ps web
   ```

**Discussion:**  
- How does Swarm handle load balancing and failover?  
- When would you choose Swarm over Kubernetes?  

---

### **Task 4: Comparing Docker Swarm and Kubernetes**  
**Objective:** Explore Kubernetes basics and contrast with Docker Swarm.  

#### **Steps:**  
1. Install Minikube (for local Kubernetes):  
   ```bash
   curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
   sudo install minikube-linux-amd64 /usr/local/bin/minikube
   minikube start
   ```
2. Deploy a sample app in Kubernetes:  
   ```bash
   kubectl create deployment hello-node --image=k8s.gcr.io/echoserver:1.4
   kubectl expose deployment hello-node --type=LoadBalancer --port=8080
   ```
3. Compare Swarm vs. Kubernetes:  
   | Feature          | Docker Swarm | Kubernetes |
   |----------------|-------------|------------|
   | **Ease of Setup** | Simple | Complex |
   | **Scalability** | Good | Excellent |
   | **Auto-Healing** | Yes | Yes |
   | **Networking** | Overlay | CNI Plugins |

**Discussion:**  
- What are the trade-offs between Swarm and Kubernetes?  
- When would you use each in production?  

---

## **Post-Lab Questions**  
1. What is the role of the Docker Daemon?  
2. How does Docker Swarm handle service discovery?  
3. What are the advantages of Kubernetes over Docker Swarm?  
4. How does Docker Compose differ from Docker Swarm?  

---

## **Conclusion**  
This lab covered Docker’s architecture, multi-container deployments, and basic orchestration with Swarm and Kubernetes.  

**Further Exploration:**  
- Deploy a CI/CD pipeline with Docker and Kubernetes.  
- Experiment with Helm charts for Kubernetes deployments.  

**Instructor Notes:**  
- Ensure Docker’s experimental features are enabled for Swarm.  
- Provide a pre-built Flask app for Task 2 if needed.  

---

**Lab Prepared by:** [Your Name]  
**Date:** [Current Date]  
**Course:** [Cloud Computing / DevOps]  

---

Would you like any modifications (e.g., adding a specific app code example)?