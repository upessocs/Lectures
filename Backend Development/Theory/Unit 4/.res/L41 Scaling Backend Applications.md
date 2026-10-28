# Lecture 41

# Scaling Backend Applications

**Course Outcome:** CO4 – Apply security best practices and conduct testing.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 41 |
| Unit | Unit 4: Deployment and DevOps |
| Topic | Horizontal and Vertical Scaling |
| Course Outcome | CO4 |
| Bloom's Knowledge Level | Understand |
| Skills Developed | Load balancing, scaling strategies |
| Applications | High-traffic applications |
| PBL Activity | Discussion on scaling the Student API |
| Assessment Method | Quiz |

---

## Part A – Theory

### 1. Introduction
Scaling is the process of increasing your application's capacity to handle more users or data.

### 2. Strategies
- **Horizontal Scaling:** Adding more instances of your application server behind a Load Balancer. (Preferred approach).
- **Vertical Scaling:** Increasing the CPU/RAM of the existing server. (Limited by hardware).

---

## Part B – Hands-On

### Task: Simulating Load Balancing
While we won't set up a production load balancer, we can simulate horizontal scaling by running multiple Docker containers of our API on different ports:
```bash
# Run two instances
docker run -d -p 8001:8000 student-api
docker run -d -p 8002:8000 student-api
```
In a real production environment, a load balancer (like Nginx) would sit in front of these to distribute traffic.

---

## PBL Activity
*Hint: Research how a database can become a bottleneck when you have too many application server instances.*

### Problem Scenario
Your API is crashing during a flash sale because it cannot handle 1,000 requests per second.

### Student Task
Create a plan for scaling your Student API horizontally. Explain how you would handle the shared database state.

---

## Assessment Activity
*Hint: Think about what happens to sessions if a user is load-balanced between two different servers.*

### Evaluation Criteria
| Criterion | Expected Evidence |
|---|---|
| Scaling Plan | Correct distinction between horizontal and vertical scaling |
| Awareness | Understanding the need for a shared session store (like Redis) |
