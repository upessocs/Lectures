# Lecture 42

# Continuous Integration (CI)

**Course Outcome:** CO4 – Apply security best practices and conduct testing; CO5 – Demonstrate effective team collaboration skills.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 42 |
| Unit | Unit 4: Deployment and DevOps |
| Topic | CI Principles and Implementation |
| Course Outcome | CO4, CO5 |
| Bloom's Knowledge Level | Apply |
| Skills Developed | CI pipeline setup, automated testing |
| Applications | Rapid development cycles |
| PBL Activity | Setting up GitHub Actions for the Student API |
| Assessment Method | Coding task |

---

## Part A – Theory

### 1. Introduction
Continuous Integration (CI) is a practice where developers merge their code changes back to the main branch as often as possible. Each merge triggers an automated build and test sequence.

### 2. CI Pipelines
If the automated tests fail, the build is considered "broken," and developers must fix it immediately. This prevents the accumulation of bugs.

---

## Part B – Hands-On

### Task: Setup GitHub Actions
Create `.github/workflows/main.yml` in your repo:
```yaml
name: Django CI
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with: { python-version: '3.10' }
      - run: pip install -r requirements.txt
      - run: python manage.py test
```

---

## PBL Activity
*Hint: GitHub Actions also allows you to run `flake8` or `black` to automatically check for code style issues.*

### Problem Scenario
Your team keeps merging broken code, and other developers spend hours trying to fix it.

### Student Task
Set up a CI pipeline that runs your tests automatically on every `git push` to your repository.

---

## Assessment Activity
*Hint: Intentionally push a failing test to verify that the CI pipeline correctly blocks the "build".*

### Evaluation Criteria
| Criterion | Expected Evidence |
|---|---|
| Automation | CI pipeline triggers on `git push` |
| Test Integration | Pipeline fails if tests fail |
