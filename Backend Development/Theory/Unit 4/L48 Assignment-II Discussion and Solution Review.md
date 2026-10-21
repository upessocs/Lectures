# Lecture 48

# Assignment-II Discussion and Solution Review

**Course Outcome:** CO4 – Apply security best practices and conduct testing.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 48 |
| Unit | Unit 4: Deployment and DevOps |
| Topic | Assignment-II Discussion and Solution Review |
| Course Outcome | CO4 |
| Bloom's Knowledge Level | Evaluate |
| Skills Developed | Code review, troubleshooting |
| Applications | Quality assurance |
| PBL Activity | Reviewing assignment implementations |
| Assessment Method | Peer review |

---

## Part A – Theory

### 1. Introduction
Reviewing your assignments is as important as writing the code. It allows you to spot common mistakes, learn better architectural patterns, and understand production debugging.

### 2. Code Review Checklist
- **Security:** Are secrets hardcoded? Is input validated?
- **Performance:** Are there N+1 database queries? Are there unnecessary loops?
- **Readability:** Is the code modular? Are variable names descriptive?

---

## Part B – Hands-On

### Task: Review Assignment Code
Compare your implementation of CI/CD and Docker with the expected best practices:
1. Does the `Dockerfile` follow best practices (e.g., using `python:3.10-slim`)?
2. Are all credentials handled via environment variables?
3. Does the CI pipeline block deployments on test failures?

---

## PBL Activity
*Hint: Peer review is best done by trying to run your peer's code on your machine. If it doesn't run, they have a documentation or dependency issue.*

### Problem Scenario
Your peer's deployment is failing in CI, and they don't know why.

### Student Task
Perform a peer review of a teammate's `Dockerfile` and CI configuration. Identify at least one potential improvement.

---

## Assessment Activity
*Hint: Write a summary of the improvements you found during your review.*

### Evaluation Criteria
| Criterion | Expected Evidence |
|---|---|
| Critical Thinking | Ability to identify potential production issues |
| Constructive Feedback | Providing clear improvement suggestions |
