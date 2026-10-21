# Lecture 47

# Release Strategies

**Course Outcome:** CO4 – Apply security best practices and conduct testing.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 47 |
| Unit | Unit 4: Deployment and DevOps |
| Topic | Blue-Green, Canary, Rolling Updates |
| Course Outcome | CO4 |
| Bloom's Knowledge Level | Evaluate |
| Skills Developed | Understanding deployment strategies |
| Applications | Zero-downtime deployments |
| PBL Activity | Discussion on release strategies |
| Assessment Method | Quiz |

---

## Part A – Theory

### 1. Introduction
"How do I update my application while users are using it?" This is the core problem release strategies solve.

### 2. Strategies
- **Rolling Update:** Gradually replace old instances with new ones.
- **Blue-Green Deployment:** Run two identical environments. Route traffic to the "Green" (new) one only after it is fully verified. If it fails, instantly switch back to "Blue" (old).
- **Canary Release:** Roll out the update to only 5% of your users first. Monitor them, then slowly expand to 100%.

---

## Part B – Hands-On

### Task: Compare Strategies
In a small project, **Rolling Updates** (the default in many PaaS) are the easiest to start with.

---

## PBL Activity
*Hint: Research how Kubernetes uses "Readiness Probes" to implement zero-downtime rolling updates.*

### Problem Scenario
Your application goes offline for 30 seconds every time you deploy a new version, causing user frustration.

### Student Task
Research and explain which release strategy (Blue-Green or Canary) would best reduce downtime for a high-traffic banking application and why.

---

## Assessment Activity
*Hint: Look for documentation on your cloud provider (Render/Railway) to see which strategy they use by default.*

### Evaluation Criteria
| Criterion | Expected Evidence |
|---|---|
| Knowledge | Ability to explain the trade-offs of Blue-Green vs. Canary |
| Strategy | Selection of a strategy that prioritizes uptime |
