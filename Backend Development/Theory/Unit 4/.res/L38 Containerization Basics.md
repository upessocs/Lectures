# Lecture 38

# Containerization Basics

**Course Outcome:** CO4 – Apply security best practices and conduct testing.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 38 |
| Unit | Unit 4: Deployment and DevOps |
| Topic | Introduction to Docker and Containers |
| Course Outcome | CO4 |
| Bloom's Knowledge Level | Understand |
| Skills Developed | Understanding containerization, Docker concepts |
| Applications | Portable application deployment |
| PBL Activity | Creating a simple Dockerfile |
| Assessment Method | Quiz |

---

## Part A – Theory

### 1. Introduction
Containerization is a technology that packages an application together with all of its dependencies—libraries, runtime, system tools, and settings—into a single, lightweight unit called a "container."

### 2. Why Containers?
Containers ensure your application runs exactly the same way, regardless of the underlying server infrastructure. Docker is the industry-standard tool for creating and managing these containers.

### 3. Key Concepts
- **Image:** A read-only template that contains the instructions to create a container.
- **Container:** A running instance of an image.
- **Dockerfile:** A text file containing the steps needed to build your image.

---

## Part B – Hands-On

### Task: Install and Run a Basic Docker Container
1. **Install Docker:** Follow instructions at [docker.com](https://www.docker.com/).
2. **Run a container:**
   ```bash
   # Downloads the 'hello-world' image and runs it
   docker run hello-world
   ```

---

## PBL Activity
*Hint: Research the difference between a Virtual Machine (VM) and a Container to understand why containers are faster.*

### Problem Scenario
Your application requires Python 3.10 and specific OS libraries. A team member's computer has Python 3.8 and lacks those libraries, causing the application to crash.

### Student Task
Explain how containerization solves the "It works on my machine!" problem in this scenario.

---

## Assessment Activity
*Hint: Practice listing running containers using `docker ps` and stopping them using `docker stop <container_id>`.*

### Evaluation Criteria
| Criterion | Expected Evidence |
|---|---|
| Docker Setup | Successfully runs `hello-world` |
| Concept Mastery | Correctly identifies the benefit of containerization |
