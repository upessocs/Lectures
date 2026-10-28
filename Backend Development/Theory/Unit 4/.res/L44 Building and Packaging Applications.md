# Lecture 44

# Building and Packaging Applications

**Course Outcome:** CO4 – Apply security best practices and conduct testing.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 44 |
| Unit | Unit 4: Deployment and DevOps |
| Topic | Build Tools, Dependency Management |
| Course Outcome | CO4 |
| Bloom's Knowledge Level | Understand |
| Skills Developed | Build tools, dependency management |
| Applications | Distribution of applications |
| PBL Activity | Creating a build script |
| Assessment Method | Quiz |

---

## Part A – Theory

### 1. Introduction
Before you deploy, your application must be "packaged"—prepared into a format that the target environment can understand.

### 2. Dependency Management
Using `requirements.txt` ensures that your production server has the exact same versions of libraries as your development machine.

---

## Part B – Hands-On

### Task: Creating a Build Script
Create a `build.sh` script to automate preparation:
```bash
#!/bin/bash
# 1. Install dependencies
pip install -r requirements.txt
# 2. Collect static files (needed if you use Django templates)
python manage.py collectstatic --noinput
# 3. Apply database migrations
python manage.py migrate
```

---

## PBL Activity
*Hint: If your project grows large, look into using `poetry` or `pipenv` instead of `requirements.txt` for more robust dependency management.*

### Problem Scenario
You try to deploy, but the server fails because it's missing a required library that you forgot to add to your list.

### Student Task
Create a `build.sh` script that prepares your Django app for production.

---

## Assessment Activity
*Hint: Run your `build.sh` script in a fresh virtual environment to ensure it correctly installs everything.*

### Evaluation Criteria
| Criterion | Expected Evidence |
|---|---|
| Script | `build.sh` successfully prepares the app |
| Reproducibility | Script can be run on a new machine |
