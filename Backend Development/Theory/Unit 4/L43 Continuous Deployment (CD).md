# Lecture 43

# Continuous Deployment (CD)

**Course Outcome:** CO4 – Apply security best practices and conduct testing; CO5 – Demonstrate effective team collaboration skills.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 43 |
| Unit | Unit 4: Deployment and DevOps |
| Topic | Deployment Pipelines and Automation |
| Course Outcome | CO4, CO5 |
| Bloom's Knowledge Level | Apply |
| Skills Developed | CD pipeline setup |
| Applications | Rapid deployment |
| PBL Activity | Automating deployment for the Student API |
| Assessment Method | Coding task |

---

## Part A – Theory

### 1. Introduction
Continuous Deployment (CD) takes CI one step further: every change that passes all stages of your production pipeline is released to your customers automatically.

### 2. CI/CD Philosophy
- **CI:** "Make sure the code is healthy."
- **CD:** "Make sure the code reaches the user."

---

## Part B – Hands-On

### Task: Automate Deployment
Using your PaaS (e.g., Render), you can configure it to "auto-deploy" whenever a push is made to the `main` branch. This is the simplest form of CD.

1. Go to your PaaS dashboard.
2. Enable "Auto-deploy" on your service.
3. Push a small change (e.g., update a message in a view) and watch your live site update automatically.

---

## PBL Activity
*Hint: If you are using a more advanced tool like AWS CodePipeline, research "Deployment Groups" to understand how to control who receives the update.*

### Problem Scenario
Your boss wants you to deploy updates 5 times a day, but manual deployment is too slow and error-prone.

### Student Task
Configure your PaaS to automatically redeploy your app whenever you push code to GitHub.

---

## Assessment Activity
*Hint: Always check your live URL after an auto-deploy to ensure the deployment was successful.*

### Evaluation Criteria
| Criterion | Expected Evidence |
|---|---|
| Automation | Push to GitHub results in automatic live site update |
| Reliability | Deployment process is reproducible |
