I'll create a comprehensive guide covering all four experiments with theory, hands-on examples, and comparisons. Let me structure this as a complete lab manual.

# DevOps Tools Lab Manual: CI/CD, Configuration Management & Code Quality

## Table of Contents
1. [Experiment 7: Jenkins CI/CD Pipeline](#experiment-7-jenkins-cicd-pipeline)
2. [Experiment 8: Ansible Configuration Management](#experiment-8-ansible)
3. [Experiment 9: Chef Infrastructure as Code](#experiment-9-chef)
4. [Experiment 10: SonarQube Code Quality](#experiment-10-sonarqube)
5. [Comparative Analysis & Summary](#comparative-analysis--summary)

---

## Experiment 7: Jenkins CI/CD Pipeline

### Theory

**Problem Statement:**
In traditional software development, integration and deployment are manual, error-prone processes. Developers work in isolation, leading to "integration hell" when merging code. Deployment requires manual steps, causing inconsistency and delays.

**What is Jenkins?**
Jenkins is an open-source automation server that enables Continuous Integration and Continuous Delivery (CI/CD). It automates building, testing, and deploying applications.

**How Jenkins Solves the Problem:**
- **Continuous Integration**: Automatically builds and tests code whenever changes are pushed
- **Continuous Delivery**: Automates deployment to staging/production environments
- **Pipeline as Code**: Defines entire workflow in a Jenkinsfile (version-controlled)
- **Plugin Ecosystem**: 1800+ plugins for integration with virtually any tool

**Key Concepts:**
- **Master Node**: Central Jenkins server managing jobs and distributing work
- **Agent Nodes**: Worker machines executing build tasks
- **Pipeline**: Series of steps defined as code (Declarative or Scripted)
- **Job/Project**: Configured task with specific steps
- **Build Trigger**: Events that start a build (SCM commit, schedule, manual)

### Hands-on Lab Setup

#### Prerequisites
- Docker installed on host machine
- Basic understanding of Git and web applications

#### Lab Architecture
```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Git Repository │────▶│   Jenkins        │────▶│  Web Server     │
│  (GitHub/Git)   │     │   Container      │     │  Container      │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │  Build & Test    │
                        │  (Maven/NPM)     │
                        └──────────────────┘
```

#### Step 1: Setup Jenkins with Docker

```bash
# Create a Docker network for our services
docker network create devops-lab

# Create persistent volume for Jenkins data
docker volume create jenkins-data

# Run Jenkins container
docker run -d \
  --name jenkins \
  --network devops-lab \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins-data:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts

# Get initial admin password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword

# Access Jenkins at http://localhost:8080
# Install suggested plugins
# Create admin user: admin/admin123 (or your choice)
```

#### Step 2: Create Sample Web Application

Create a simple Node.js application:

```bash
# On host machine, create app directory
mkdir sample-webapp && cd sample-webapp

# Create package.json
cat > package.json << 'EOF'
{
  "name": "sample-webapp",
  "version": "1.0.0",
  "description": "Sample web app for CI/CD demo",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "test": "echo \"Running tests...\" && exit 0"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
EOF

# Create app.js
cat > app.js << 'EOF'
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from CI/CD Pipeline!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

module.exports = app;
EOF

# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
EOF

# Create Jenkinsfile
cat > Jenkinsfile << 'EOF'
pipeline {
    agent any
    
    environment {
        APP_NAME = 'sample-webapp'
        REGISTRY = 'localhost:5000'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                    url: 'https://github.com/yourusername/sample-webapp.git'
                // Or for local: checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${APP_NAME}:${BUILD_NUMBER} ."
            }
        }
        
        stage('Deploy') {
            steps {
                sh '''
                    docker stop ${APP_NAME} || true
                    docker rm ${APP_NAME} || true
                    docker run -d --name ${APP_NAME} \
                      --network devops-lab \
                      -p 3000:3000 \
                      ${APP_NAME}:${BUILD_NUMBER}
                '''
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline execution completed'
        }
        success {
            echo 'Deployment successful! App running at http://localhost:3000'
        }
        failure {
            echo 'Pipeline failed! Check logs for details.'
        }
    }
}
EOF

# Initialize Git repository
git init
git add .
git commit -m "Initial commit with CI/CD pipeline"
```

#### Step 3: Configure Jenkins Pipeline

1. **Access Jenkins**: http://localhost:8080
2. **Create New Item**: Click "New Item" → Enter name "sample-webapp-pipeline" → Select "Pipeline" → OK
3. **Pipeline Configuration**:
   - Under "Pipeline" section:
     - Definition: "Pipeline script from SCM"
     - SCM: "Git"
     - Repository URL: Path to your Git repo (or use GitHub URL)
     - Branches to build: "*/main"
     - Script Path: "Jenkinsfile"
4. **Save** and click "Build Now"

#### Step 4: Verify Deployment

```bash
# Check if container is running
docker ps | grep sample-webapp

# Test the application
curl http://localhost:3000

# Expected output:
# {"message":"Hello from CI/CD Pipeline!","timestamp":"2024-...","version":"1.0.0"}
```

---


---
