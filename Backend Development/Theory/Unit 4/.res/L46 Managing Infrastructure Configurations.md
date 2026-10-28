# Lecture 46

# Managing Infrastructure Configurations

**Course Outcome:** CO4 – Apply security best practices and conduct testing.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 46 |
| Unit | Unit 4: Deployment and DevOps |
| Topic | Environment Variables, Secrets |
| Course Outcome | CO4 |
| Bloom's Knowledge Level | Apply |
| Skills Developed | Secure configuration management |
| Applications | Production security |
| PBL Activity | Using environment variables in the Student API |
| Assessment Method | Coding task |

---

## Part A – Theory

### 1. Introduction
Hardcoding configuration (database passwords, API keys) into your code is a major security vulnerability. If you push that code to GitHub, your secrets are compromised.

### 2. Best Practices
Use **Environment Variables**. These are key-value pairs stored by the operating system or deployment platform, *not* in your code.

---

## Part B – Hands-On

### Task: Use `.env` Files
1. Install `python-dotenv`: `pip install python-dotenv`
2. Create a `.env` file (never commit this to GitHub):
   ```text
   DATABASE_URL=postgres://user:password@localhost:5432/db
   SECRET_KEY=super-secret-key-123
   ```
3. Update `settings.py`:
   ```python
   import os
   from dotenv import load_dotenv
   load_dotenv()
   SECRET_KEY = os.getenv('SECRET_KEY')
   ```

---

## PBL Activity
*Hint: Add `.env` to your `.gitignore` file immediately so it's never uploaded to your repository.*

### Problem Scenario
Your production database password was leaked because it was hardcoded in `settings.py`.

### Student Task
Refactor your project to use environment variables for sensitive settings like `SECRET_KEY` and database credentials.

---

## Assessment Activity
*Hint: Double-check your GitHub repository to ensure the `.env` file is not visible.*

### Evaluation Criteria
| Criterion | Expected Evidence |
|---|---|
| Security | Sensitive info removed from `settings.py` |
| .gitignore | `.env` is correctly ignored |
