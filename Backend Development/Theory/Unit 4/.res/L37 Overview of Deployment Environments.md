# Lecture 37

# Overview of Deployment Environments

**Course Outcome:** CO4 – Apply security best practices and conduct testing; CO5 – Demonstrate effective team collaboration skills.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 37 |
| Unit | Unit 4: Deployment and DevOps |
| Topic | Overview of Deployment Environments |
| Course Outcome | CO4, CO5 |
| Bloom's Knowledge Level | Understand |
| Skills Developed | Understanding cloud platforms, VPS, local envs |
| Applications | Production-grade deployment, environment consistency |
| PBL Activity | Comparing local, staging, and production environments |
| Assessment Method | Quiz |

---

## Part A – Theory

### 1. Introduction
Deployment is the process of moving your application from your local machine to a publicly accessible server. A professional workflow typically involves three distinct environments:
- **Local:** Your personal machine for development.
- **Staging:** A "production-like" environment used to test the app before the final release.
- **Production:** The live environment that end-users interact with.

### 2. Why Environment Management Matters
Ensuring these environments are consistent is critical to avoid the "it works on my machine" problem. Configuration management tools and containerization are used to ensure that code behaves identically in all three environments.

---

## Part B – Hands-On

### Task: Explore Platform-as-a-Service (PaaS)
We will explore a cloud platform (e.g., Render or Railway) that automates deployment.

1. **Create a `requirements.txt` file:**
   PaaS needs to know your project dependencies.
   ```bash
   pip freeze > requirements.txt
   ```
2. **Deploy:** Follow the platform's guide to connect your GitHub repository. The platform will automatically install dependencies and start your server.

---

## PBL Activity
*Hint: Look into 'Environment Variables' in your cloud provider's dashboard to manage database credentials securely.*

### Problem Scenario
You've built the Student API, but it only works on your laptop. You need to deploy it so your team can access it.

### Student Task
Create a free account on a cloud PaaS (e.g., Render/Railway) and successfully deploy your Student API.

---

## Assessment Activity
*Hint: Make sure to include a `README.md` that explains how to run your API locally.*

### Evaluation Criteria
| Criterion | Expected Evidence |
|---|---|
| Live URL | API is accessible via a public URL |
| Dependencies | `requirements.txt` is up-to-date |
