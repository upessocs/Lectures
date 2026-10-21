# Lecture 45

# Automated Testing in CI/CD

**Course Outcome:** CO4 – Apply security best practices and conduct testing.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 45 |
| Unit | Unit 4: Deployment and DevOps |
| Topic | Integration with Pipelines |
| Course Outcome | CO4 |
| Bloom's Knowledge Level | Analyze |
| Skills Developed | CI/CD testing integration |
| Applications | Quality assurance |
| PBL Activity | Integrating tests in the CI pipeline |
| Assessment Method | Coding task |

---

## Part A – Theory

### 1. Introduction
Tests are useless if they aren't run. Integrating them into your CI/CD pipeline is the only way to guarantee that broken code never reaches production.

### 2. Testing Layers
- **Unit Tests:** Test individual functions (fast).
- **Integration Tests:** Test how components (like Views and DB) work together (slower).

---

## Part B – Hands-On

### Task: Integrate Tests into CI
Update your `.github/workflows/main.yml` to ensure the build stops if tests fail:
```yaml
      - name: Run tests
        run: python manage.py test
        # If this step fails, the pipeline stops here
```

---

## PBL Activity
*Hint: If your tests take too long, learn to run only a subset of them during CI (e.g., `python manage.py test students.tests.StudentAPITest`).*

### Problem Scenario
A developer accidentally introduced a bug that broke the login feature, but the app was deployed anyway because tests were not automatically enforced.

### Student Task
Ensure your CI pipeline is configured to *fail* the build if any tests fail, preventing auto-deployment.

---

## Assessment Activity
*Hint: Monitor the "Actions" tab in your GitHub repository to see the test results for every push.*

### Evaluation Criteria
| Criterion | Expected Evidence |
|---|---|
| CI Enforcement | Pipeline fails on test error |
| Quality | 100% of tests must pass before deployment |
