## 1. What is CI and CD in DevOps

### Continuous Integration (CI)

CI is the practice of **frequently integrating code changes into a shared repository** (usually `main` or `develop`) and **automatically validating them** using builds and tests.

**Goal:** Detect issues early.






### Continuous Delivery / Continuous Deployment (CD)

Both are often written as CD but mean different things:

* **Continuous Delivery**

  * Code is automatically built, tested, and **ready for deployment**
  * Deployment to production is **manual approval**

* **Continuous Deployment**

  * Code is automatically built, tested, and **deployed to production without manual approval**


---



## 2. Example: Simple Web App (FastAPI)

Assume a simple app:

## Git Repository Structure (Example: FastAPI CI/CD Project)

```bash
fastapi-ci-cd-app/
├── app/
│   ├── __init__.py
│   └── app.py
├── tests/
│   └── test_app.py
├── requirements.txt
├── Dockerfile
├── Jenkinsfile
├── .gitignore
└── README.md
```



### Explanation of Each File

#### `app/app.py`

Main FastAPI application

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello World"}
```



#### `tests/test_app.py`

Basic test for CI

```python
from fastapi.testclient import TestClient
from app.app import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
```


#### `requirements.txt`

Project dependencies

```txt
fastapi
uvicorn
pytest
```



#### `Dockerfile`

Containerizes the application

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "app.app:app", "--host", "0.0.0.0", "--port", "80"]
```



#### `Jenkinsfile`

Defines CI/CD pipeline (Pipeline as Code)

```groovy
pipeline {
    agent any

    stages {
        stage('Install') {
            steps {
                sh 'pip install -r requirements.txt'
            }
        }

        stage('Test') {
            steps {
                sh 'pytest'
            }
        }

        stage('Build Docker') {
            steps {
                sh 'docker build -t fastapi-app .'
            }
        }

        stage('Run') {
            steps {
                sh 'docker run -d -p 80:80 fastapi-app'
            }
        }
    }
}
```


#### `.gitignore`

Ignore unnecessary files

```txt
__pycache__/
*.pyc
.env
venv/
```


---

## 3. Types of Changes in a Web App

Typical changes developers make:

* Feature changes (new API endpoint)
* Bug fixes
* Refactoring code
* Dependency updates (requirements.txt)
* Config changes (env variables)
* UI/API response changes




---

## 4. Git Flow (Branching Strategy)

Standard Git Flow:

```
main        -> production-ready code
develop     -> integration branch
feature/*   -> new features
hotfix/*    -> urgent fixes
release/*   -> pre-release stabilization
```

### Workflow

1. Create feature branch:

```bash
git checkout develop
git checkout -b feature/login-api
```

2. Work and commit:

```bash
git add .
git commit -m "Add login API"
```

3. Push:

```bash
git push origin feature/login-api
```

4. Merge back to develop (via PR)

5. When ready:

```bash
develop -> main
```




---

## 5. How CI Works (Step-by-Step)

Whenever code is pushed:

1. Code checkout
2. Install dependencies
3. Run tests
4. Static code analysis (quality check)
5. Build artifact (Docker image)






### Automated Testing in CI

Examples:

* Unit tests (pytest)
* API tests
* Integration tests

```bash
pytest tests/
```




---

### Code Quality with SonarQube

Used for:

* Code smells
* Bugs
* Security vulnerabilities
* Coverage

Flow:

```
Code → SonarQube Scan → Quality Gate → Pass/Fail CI
```





---
## 6. Continuous Delivery / Deployment Flow

After CI passes:

1. Build Docker image
2. Push to registry
3. Deploy to staging
4. (Optional approval)
5. Deploy to production






### What is Deployment?

Deployment = **running your application on a server/environment**

Examples:

* VM (EC2)
* Kubernetes cluster
* Docker container


---



## 7. Full Pipeline Flow

```
Developer → Git Push → CI Pipeline
           → Test → SonarQube → Build
           → Docker Image → Registry
           → Deploy → Server/K8s
```





---
## 8. FastAPI App in GitHub (CI/CD Setup)

### Without Jenkinsfile (GUI Pipeline)

Using Jenkins GUI:

* Create pipeline in web UI
* Add steps manually:

  * Git checkout
  * Run tests
  * Build Docker
  * Deploy

### Drawbacks

* Not version controlled
* Hard to track changes
* Cannot review pipeline via PR
* Difficult to replicate across environments
* Risk of manual misconfiguration





---
## 9. With Jenkinsfile (Recommended)

A `Jenkinsfile` stored in Git:

```groovy
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/user/fastapi-app.git'
            }
        }

        stage('Install') {
            steps {
                sh 'pip install -r requirements.txt'
            }
        }

        stage('Test') {
            steps {
                sh 'pytest'
            }
        }

        stage('SonarQube') {
            steps {
                sh 'sonar-scanner'
            }
        }

        stage('Build Docker') {
            steps {
                sh 'docker build -t fastapi-app .'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker run -d -p 80:80 fastapi-app'
            }
        }
    }
}
```






### Advantages of Jenkinsfile

* Version controlled (stored in Git)
* Peer review via PR
* Easy rollback
* Reusable pipelines
* Infrastructure as Code




---

## 10. CI with Jenkins + SonarQube

Flow:

```
Git Push
 → Jenkins Trigger
 → Build + Test
 → SonarQube Analysis
 → Quality Gate Check
 → Continue / Fail
```






## 11. Jenkins Architecture

### Master (Controller)

* Manages jobs
* Schedules builds

### Agents (Nodes)

* Execute jobs






## 12. Types of Jenkins Agents

1. Static Agents

   * Pre-configured machines
   * Always available

2. Dynamic Agents

   * Created on-demand (Docker/Kubernetes)

3. Docker Agents

   * Run jobs in containers

4. Cloud Agents

   * AWS, Azure, etc.






## 13. Adding Jenkins Agents (Steps)

1. Go to Jenkins → Manage Nodes
2. Add new node
3. Configure:

   * Name
   * Remote directory
   * Labels
   * Launch method (SSH, JNLP)

Example SSH-based:

```bash
ssh user@agent-ip
```




---

## 14. Credential Management in Jenkins

Use Jenkins Credentials Manager:

Types:

* Username/Password
* SSH Keys
* API Tokens
* Secret Text

### Steps

1. Manage Jenkins → Credentials
2. Add credentials
3. Use in pipeline:

```groovy
withCredentials([usernamePassword(credentialsId: 'git-creds', ...)]) {
    // use credentials
}
```



---


## 15. End-to-End Example (Putting It All Together)

1. Developer creates feature branch
2. Pushes code to GitHub
3. Jenkins triggers pipeline
4. CI runs:

   * Install
   * Test
   * SonarQube
5. CD runs:

   * Build Docker image
   * Push to registry
   * Deploy to server
6. App is live






## 16. Summary

* CI ensures **code quality and stability**
* CD ensures **fast and reliable delivery**
* Git flow organizes development
* Jenkins automates pipeline
* SonarQube ensures code quality
* Jenkinsfile enables **pipeline as code**
* Agents scale execution
* Credentials secure access

