
## Experiment 10: SonarQube

### Theory

**Problem Statement:**
Code quality issues (bugs, vulnerabilities, code smells) are often discovered late in the development cycle, making them expensive to fix. Manual code reviews are inconsistent and don't scale.

**What is SonarQube?**
SonarQube is an open-source platform for continuous inspection of code quality. It performs automatic reviews with static analysis to detect bugs, code smells, and security vulnerabilities.

**How SonarQube Solves the Problem:**
- **Continuous Inspection**: Scans code with every commit, providing immediate feedback
- **Quality Gates**: Defines pass/fail criteria for code quality
- **Technical Debt Quantification**: Measures effort needed to fix issues
- **Multi-language Support**: Supports 20+ programming languages
- **Visual Analytics**: Dashboard showing code quality metrics and trends

**Key Concepts:**
- **Quality Gate**: Set of conditions that code must meet before deployment
- **Technical Debt**: Estimated time to fix all issues
- **Code Smells**: Maintainability issues that don't affect functionality
- **Vulnerabilities**: Security-related issues
- **Bugs**: Code that might break or behave unexpectedly
- **Coverage**: Percentage of code covered by tests
- **Duplications**: Repeated code blocks

### Hands-on Lab Setup

#### Lab Architecture

<svg width="900" height="420" xmlns="http://www.w3.org/2000/svg">

  <!-- Developer -->
  <rect x="30" y="150" width="150" height="80" fill="#e3f2fd" stroke="#000"/>
  <text x="45" y="190" font-size="14">Developer</text>
  <text x="45" y="210" font-size="12">Source Code</text>

  <!-- Scanner -->
  <rect x="230" y="150" width="180" height="80" fill="#fff3e0" stroke="#000"/>
  <text x="250" y="190" font-size="14">Sonar Scanner</text>
  <text x="245" y="210" font-size="12">(CLI / Maven / CI)</text>

  <!-- SonarQube Server -->
  <rect x="460" y="120" width="200" height="120" fill="#e8f5e9" stroke="#000"/>
  <text x="490" y="170" font-size="14">SonarQube Server</text>
  <text x="480" y="190" font-size="12">Analysis Engine</text>
  <text x="480" y="205" font-size="12">Quality Gates</text>
  <text x="480" y="220" font-size="12">Web Dashboard</text>

  <!-- Database -->
  <rect x="720" y="150" width="150" height="80" fill="#fce4ec" stroke="#000"/>
  <text x="735" y="190" font-size="14">PostgreSQL</text>
  <text x="745" y="210" font-size="12">Database</text>

  <!-- Arrows -->
  <line x1="180" y1="190" x2="230" y2="190" stroke="#000" marker-end="url(#arrow)"/>
  <line x1="410" y1="190" x2="460" y2="190" stroke="#000" marker-end="url(#arrow)"/>
  <line x1="660" y1="190" x2="720" y2="190" stroke="#000" marker-end="url(#arrow)"/>

  <!-- Labels -->
  <text x="185" y="175" font-size="11">code</text>
  <text x="420" y="175" font-size="11">analysis report</text>
  <text x="665" y="175" font-size="11">store results</text>

  <!-- Arrow Marker -->
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5"
      orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L10,5 L0,10 Z" fill="#000" />
    </marker>
  </defs>

</svg>




---









> There are two components to use SonarQube (server and agent)

# 1. SonarQube (Server) → “Brain / Dashboard”

### What it is:

SonarQube is a **server application** that:

* Stores analysis results
* Applies rules (bugs, vulnerabilities, code smells)
* Shows dashboards (UI on port 9000)
* Enforces **Quality Gates**
* Tracks history (technical debt, trends)

### Think of it like:

> A **central analysis platform + database + UI**

From your file:

* It runs as a container
* Uses PostgreSQL
* Accessible at `http://localhost:9000` 

---

### What it provides:

* Code quality reports
* Issue tracking
* Security vulnerability detection
* Coverage reports
* Quality gate decision (pass/fail)

---

# 2. SonarQube Scanner → “Worker / Agent”

### What it is:

Sonar Scanner is a **CLI tool** that:

* Reads your source code
* Analyzes it locally
* Sends results to SonarQube server

### Think of it like:

> A **client/agent that does the scanning work**

From your setup:

```bash
sonar-scanner \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login="your-token"
```

---

### What it provides:

* Parses your code
* Detects issues based on rules
* Uploads analysis report to server

---

# How they work together (important)

```
[ Your Code ]
      ↓
[ Sonar Scanner ]  → does analysis
      ↓
[ SonarQube Server ] → stores + shows results
```

---

# Real-world analogy

| Component        | Analogy              |
| ---------------- | -------------------- |
| SonarQube Server | Teacher / Examiner   |
| Sonar Scanner    | Student writing exam |
| Code             | Answer sheet         |

* Scanner = writes answers (analysis)
* Server = checks, grades, shows report


# Why both are needed

If you only install:

### Only SonarQube

* No code gets analyzed
* Empty dashboard

### Only Scanner

* No place to send results
* Analysis wasted

### Together

* Full pipeline works

---

# Extra clarity (very important for DevOps)

You **don’t always manually install scanner**:

### Different scanner types:

* CLI (`sonar-scanner`)
* Maven plugin (`mvn sonar:sonar`)
* Gradle plugin
* Jenkins integration
* GitHub Actions

From your file:

```xml
<plugin>
  <artifactId>sonar-maven-plugin</artifactId>
</plugin>
```

→ This itself acts as a **scanner** 

---

# Key Differences (Quick Table)

| Feature    | SonarQube                 | Sonar Scanner          |
| ---------- | ------------------------- | ---------------------- |
| Type       | Server                    | Client/CLI             |
| Role       | Stores & displays results | Analyzes code          |
| UI         | Yes (Web dashboard)       | No                     |
| Runs where | Server/Container          | Developer machine / CI |
| Required   | Yes                       | Yes                    |

---

# In CI/CD (real DevOps flow)

In Jenkins pipeline:

```groovy
stage('SonarQube Analysis') {
    sh 'mvn sonar:sonar'
}
```

Here:

* Jenkins runs **scanner**
* Results go to **SonarQube server**


> **SonarQube = analysis platform**
> **Scanner = tool that sends code analysis to that platform**












---
#### Step 1: Setup SonarQube Environment

```bash
# Create Docker network
docker network create sonarqube-lab

# Start PostgreSQL database for SonarQube
docker run -d \
  --name sonar-db \
  --network sonarqube-lab \
  -e POSTGRES_USER=sonar \
  -e POSTGRES_PASSWORD=sonar \
  -e POSTGRES_DB=sonarqube \
  -v sonar-db-data:/var/lib/postgresql/data \
  postgres:13

# Start SonarQube server
docker run -d \
  --name sonarqube \
  --network sonarqube-lab \
  -p 9000:9000 \
  -e SONAR_JDBC_URL=jdbc:postgresql://sonar-db:5432/sonarqube \
  -e SONAR_JDBC_USERNAME=sonar \
  -e SONAR_JDBC_PASSWORD=sonar \
  -v sonar-data:/opt/sonarqube/data \
  -v sonar-extensions:/opt/sonarqube/extensions \
  sonarqube:lts-community

# Wait for SonarQube to start (about 2-3 minutes)
docker logs -f sonarqube

# Access SonarQube at http://localhost:9000
# Default credentials: admin/admin
```
### OR use docker-compose up -d with 

`docker-compose.yml`
```yaml
version: '3.8'

services:
  sonar-db:
    image: postgres:13
    container_name: sonar-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: sonar
      POSTGRES_PASSWORD: sonar
      POSTGRES_DB: sonarqube
    volumes:
      - sonar-db-data:/var/lib/postgresql/data
    networks:
      - sonarqube-lab

  sonarqube:
    image: sonarqube:lts-community
    container_name: sonarqube
    restart: unless-stopped
    ports:
      - "9000:9000"
    environment:
      SONAR_JDBC_URL: jdbc:postgresql://sonar-db:5432/sonarqube
      SONAR_JDBC_USERNAME: sonar
      SONAR_JDBC_PASSWORD: sonar
    volumes:
      - sonar-data:/opt/sonarqube/data
      - sonar-extensions:/opt/sonarqube/extensions
    depends_on:
      - sonar-db
    networks:
      - sonarqube-lab

volumes:
  sonar-db-data:
  sonar-data:
  sonar-extensions:

networks:
  sonarqube-lab:
    driver: bridge
```


#### Step 2: Create Sample Application with Code Issues

```bash
# Create sample Java application with issues
mkdir -p sample-java-app/src/main/java/com/example

# Create Java class with various issues
cat > sample-java-app/src/main/java/com/example/Calculator.java << 'EOF'
package com.example;

import java.util.ArrayList;
import java.util.List;

public class Calculator {
    
    // Bug: Division by zero not handled
    public int divide(int a, int b) {
        return a / b;  // Bug: Potential division by zero
    }
    
    // Code Smell: Unused variable
    public int add(int a, int b) {
        int result = a + b;
        int unused = 100;  // Code smell: Unused variable
        return result;
    }
    
    // Vulnerability: SQL injection risk
    public String getUser(String userId) {
        String query = "SELECT * FROM users WHERE id = " + userId;  // Vulnerability: SQL injection
        return query;
    }
    
    // Code Smell: Duplicate code
    public int multiply(int a, int b) {
        int result = 0;
        for (int i = 0; i < b; i++) {
            result = result + a;
        }
        return result;
    }
    
    // Duplicate code (same as multiply method)
    public int multiplyAlt(int a, int b) {
        int result = 0;
        for (int i = 0; i < b; i++) {
            result = result + a;
        }
        return result;
    }
    
    // Code Smell: Too many parameters
    public void processUser(String name, String email, String phone, 
                           String address, String city, String state, 
                           String zip, String country) {
        // Process user data
        System.out.println("Processing: " + name);
    }
    
    // Bug: Null pointer risk
    public String getName(String name) {
        return name.toUpperCase();  // Bug: Null pointer if name is null
    }
    
    // Code Smell: Empty catch block
    public void riskyOperation() {
        try {
            int x = 10 / 0;
        } catch (Exception e) {
            // Empty catch block - swallowing exception
        }
    }
}
EOF

# Create pom.xml for Maven build
cat > sample-java-app/pom.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.example</groupId>
    <artifactId>sample-app</artifactId>
    <version>1.0-SNAPSHOT</version>
    
    <properties>
        <maven.compiler.source>11</maven.compiler.source>
        <maven.compiler.target>11</maven.compiler.target>
        <sonar.projectKey>sample-java-app</sonar.projectKey>
        <sonar.organization>my-org</sonar.organization>
        <sonar.host.url>http://localhost:9000</sonar.host.url>
        <sonar.login>your-sonar-token</sonar.login>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.sonarsource.scanner.maven</groupId>
                <artifactId>sonar-maven-plugin</artifactId>
                <version>3.9.1.2184</version>
            </plugin>
        </plugins>
    </build>
</project>
EOF
```

#### Step 3: Install SonarQube Scanner

```bash
# Install SonarQube Scanner (on host machine or in Docker)
docker run -d \
  --name sonar-scanner \
  --network sonarqube-lab \
  -v $(pwd)/sample-java-app:/usr/src \
  sonarsource/sonar-scanner-cli:latest \
  sleep infinity

# Or install locally (for Ubuntu/Debian)
wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-linux.zip
unzip sonar-scanner-cli-5.0.1.3006-linux.zip
sudo mv sonar-scanner-5.0.1.3006-linux /opt/sonar-scanner
export PATH=$PATH:/opt/sonar-scanner/bin
```

#### Step 4: Configure and Run SonarQube Analysis

```bash
# Generate SonarQube token
# Access http://localhost:9000 → Login (admin/admin)
# Click on user icon → My Account → Security → Generate Token
# Copy the token (e.g., sqp_xxxxxxxxxxxx)

# Create sonar-project.properties
cat > sample-java-app/sonar-project.properties << 'EOF'
sonar.projectKey=sample-java-app
sonar.projectName=Sample Java Application
sonar.projectVersion=1.0
sonar.sources=src
sonar.java.binaries=target/classes
sonar.language=java
sonar.sourceEncoding=UTF-8
EOF

# Run SonarQube scan (using Docker)
docker exec -e SONAR_TOKEN="your-sonar-token" \
  sonar-scanner \
  sonar-scanner \
  -Dsonar.host.url=http://sonarqube:9000 \
  -Dsonar.projectKey=sample-java-app \
  -Dsonar.projectName="Sample Java App" \
  -Dsonar.sources=/usr/src/src

# Or using local scanner
cd sample-java-app
sonar-scanner \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login="your-sonar-token"
```

#### Step 5: Integrate with Jenkins (CI/CD)

```bash
# Add SonarQube stage to Jenkinsfile
cat > sample-webapp/Jenkinsfile << 'EOF'
pipeline {
    agent any
    
    environment {
        SONAR_HOST_URL = 'http://sonarqube:9000'
        SONAR_TOKEN = credentials('sonar-token')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'mvn clean verify sonar:sonar'
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        
        stage('Build') {
            steps {
                sh 'mvn package'
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'docker build -t sample-app .'
                sh 'docker run -d -p 8080:8080 sample-app'
            }
        }
    }
}
EOF
```

#### Step 6: Analyze Results

```bash
# View analysis results
# Open http://localhost:9000/dashboard?id=sample-java-app

# You'll see:
# - 8 Bugs
# - 1 Vulnerability
# - 12 Code Smells
# - 2 Duplicated blocks
# - 0% Test coverage
# - Technical Debt: ~2 hours

# Generate report using SonarQube API
curl -u admin:admin \
  "http://localhost:9000/api/issues/search?projectKeys=sample-java-app&types=BUG"
```




---







---

## Step-by-step Token Generation (manually generate and provide it.)

### 1. Open SonarQube Web UI

* Go to: `http://localhost:9000`
* Login: `admin / admin`



### 2. Generate Token (Manual Step)

Inside UI:

```
User Icon → My Account → Security → Generate Token
```

* Give it a name (e.g., `scanner-token`)
* Copy the token (looks like: `sqp_xxxxxxxxx`)

**Important:**

* Token is shown **only once**
* Store it securely


### 3. Pass Token to Scanner

Scanner does NOT “log in” interactively.
You pass token in config or CLI.

### Option A — CLI

```bash
sonar-scanner \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=YOUR_TOKEN
```


### Option B — Environment Variable

```bash
export SONAR_TOKEN=YOUR_TOKEN

sonar-scanner \
  -Dsonar.host.url=http://localhost:9000
```


### Option C — Maven (CI/CD)

```bash
mvn sonar:sonar \
  -Dsonar.login=YOUR_TOKEN
```


### Option D — Jenkins (Best Practice)

```groovy
environment {
    SONAR_TOKEN = credentials('sonar-token')
}
```


# What Actually Happens Internally

```
[ Scanner ]
     |
     | (HTTP + Token)
     ↓
[ SonarQube Server ]
     |
     | Validate token
     ↓
[ Accept / Reject ]
```

### Flow:

1. Scanner sends request with token
2. Server validates token
3. If valid → accepts analysis
4. If invalid → scan fails

### Scanner does NOT:

* Fetch token automatically
* Store credentials permanently (unless you configure it)
* Authenticate via username/password (deprecated)

### Token is:

* Generated by **server UI**
* Used by **scanner**
* Passed via **CLI / CI**
### Summary of token generation

<svg width="520" height="220" xmlns="http://www.w3.org/2000/svg">

  <!-- Scanner -->
  <rect x="20" y="80" width="150" height="60" fill="#fff3e0" stroke="#000"/>
  <text x="35" y="110" font-size="13">Scanner</text>
  <text x="30" y="125" font-size="11">(CLI / CI)</text>

  <!-- SonarQube Server -->
  <rect x="200" y="60" width="180" height="100" fill="#e8f5e9" stroke="#000"/>
  <text x="215" y="100" font-size="13">SonarQube Server</text>
  <text x="220" y="115" font-size="11">(Web + API)</text>
  <text x="220" y="130" font-size="11">Auth + Analysis</text>

  <!-- Database -->
  <rect x="410" y="80" width="90" height="60" fill="#fce4ec" stroke="#000"/>
  <text x="420" y="110" font-size="12">DB</text>

  <!-- Arrow: Scanner to Server -->
  <line x1="170" y1="110" x2="200" y2="110" stroke="#000" marker-end="url(#arrow)"/>
  <text x="135" y="95" font-size="10">HTTP + Token</text>

  <!-- Arrow: Server to DB -->
  <line x1="380" y1="110" x2="410" y2="110" stroke="#000" marker-end="url(#arrow)"/>
  <text x="330" y="95" font-size="10">store results</text>

  <!-- Arrow Marker -->
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5"
      orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#000"/>
    </marker>
  </defs>

</svg>

```
Step 1: Start SonarQube Server
Step 2: Open Web UI
Step 3: Generate Token  ← (Missing clarity in lab)
Step 4: Run Scanner with Token
Step 5: Server validates + stores results
Step 6: View Dashboard
```

---

## Comparative Analysis & Summary

### Tool Comparison Matrix

| Feature | Jenkins | Ansible | Chef | SonarQube |
|---------|---------|---------|------|-----------|
| **Primary Purpose** | CI/CD Automation | Configuration Management | Configuration Management | Code Quality Analysis |
| **Architecture** | Master-Agent | Push-based, Agentless | Pull-based, Client-Server | Client-Server |
| **Language** | Java, Groovy | Python, YAML | Ruby | Java |
| **Learning Curve** | Moderate | Low | High | Low |
| **Setup Complexity** | Moderate | Simple | Complex | Simple |
| **Scalability** | High (with agents) | Very High | Very High | Moderate |
| **Use Case** | Build, Test, Deploy | Infrastructure as Code | Enterprise CM | Static Code Analysis |
| **State Management** | Imperative | Declarative | Declarative | N/A |
| **Idempotency** | No (by default) | Yes | Yes | N/A |
| **Real-time** | Push (triggers) | Push | Pull (periodic) | Push |

### Commands Summary

#### Jenkins
```bash
# Start Jenkins
docker run -d -p 8080:8080 -p 50000:50000 -v jenkins-data:/var/jenkins_home jenkins/jenkins:lts

# Jenkins CLI
java -jar jenkins-cli.jar -s http://localhost:8080 build sample-pipeline

# Pipeline syntax
pipeline {
    agent any
    stages {
        stage('Build') { steps { sh 'make' } }
    }
}
```

#### Ansible
```bash
# Ansible commands
ansible all -i inventory -m ping
ansible-playbook -i inventory playbook.yml
ansible-vault encrypt secrets.yml
ansible-galaxy install geerlingguy.nginx

# Key modules
ansible webservers -m apt -a "name=nginx state=present"
ansible webservers -m service -a "name=nginx state=started"
ansible webservers -m copy -a "src=file dest=/tmp/"
```

#### Chef
```bash
# Chef commands
knife node list
knife cookbook upload webapp
knife bootstrap node1 -x user -P pass --run-list 'recipe[webapp]'
chef-client --local-mode --runlist 'recipe[webapp]'

# Cookbook management
chef generate cookbook my_cookbook
chef exec berks install
chef exec foodcritic my_cookbook
```

#### SonarQube
```bash
# SonarQube commands
docker run -d -p 9000:9000 sonarqube:lts-community

# Scanner commands
sonar-scanner -Dsonar.projectKey=myapp -Dsonar.sources=.
mvn sonar:sonar

# API calls
curl -u admin:admin "http://localhost:9000/api/measures/component?component=myapp&metricKeys=bugs,coverage"
```

### Key Differences and When to Use

#### **Jenkins vs. Configuration Management Tools**
- **Jenkins**: Use for build pipelines, testing, and deployment orchestration
- **Ansible/Chef**: Use for maintaining consistent server configurations
- **Best Practice**: Combine both - Jenkins orchestrates, CM tools configure

#### **Ansible vs. Chef**
| Aspect | Ansible | Chef |
|--------|---------|------|
| **Complexity** | Simpler, YAML-based | Complex, Ruby-based |
| **Learning** | Easy to start | Steep learning curve |
| **Performance** | Slower with many nodes | Better with large scale |
| **Agent** | Agentless | Requires Chef client |
| **Best For** | Small to medium environments | Large enterprise |

#### **SonarQube in CI/CD**
- **When to scan**: Every pull request and nightly builds
- **Quality Gates**: Define thresholds to block deployments
- **Integration**: Jenkins, GitLab CI, GitHub Actions

### Lab Procedure Summary

1. **Setup Environment**
   ```bash
   # Create Docker network
   docker network create devops-lab
   
   # Run all containers
   docker run -d --name jenkins --network devops-lab -p 8080:8080 jenkins/jenkins
   docker run -d --name sonarqube --network devops-lab -p 9000:9000 sonarqube
   docker run -d --name ansible-control --network devops-lab ubuntu sleep infinity
   ```

2. **Configure Tools**
   - Jenkins: Install plugins, configure credentials
   - SonarQube: Generate token, set quality gates
   - Ansible: Create inventory, write playbooks
   - Chef: Bootstrap nodes, upload cookbooks

3. **Create Application**
   - Sample web app with tests
   - Dockerfile for containerization
   - Jenkinsfile for pipeline

4. **Implement CI/CD Pipeline**
   ```groovy
   pipeline {
       stages {
           stage('Build') { ... }
           stage('Test') { ... }
           stage('SonarQube') { ... }
           stage('Deploy') { ... }
       }
   }
   ```

5. **Verify Results**
   - Check Jenkins build status
   - View SonarQube dashboard
   - Verify deployed application
   - Validate configuration state

### Best Practices

1. **Security**
   - Never hardcode credentials - use secrets management
   - Use SSL/TLS for all communications
   - Implement least privilege principle

2. **Code Quality**
   - Set quality gates to prevent technical debt accumulation
   - Enforce code coverage thresholds (80%+)
   - Regular SonarQube scans in pipeline

3. **Infrastructure as Code**
   - Version all configuration files
   - Use modular roles/cookbooks/playbooks
   - Implement testing (Test Kitchen for Chef, Molecule for Ansible)

4. **CI/CD Optimization**
   - Use build caching
   - Parallelize stages where possible
   - Implement proper error handling

This comprehensive lab provides hands-on experience with four essential DevOps tools. The key takeaway is understanding how these tools complement each other in a modern DevOps workflow, with Jenkins orchestrating the pipeline, Ansible/Chef managing infrastructure, and SonarQube ensuring code quality.