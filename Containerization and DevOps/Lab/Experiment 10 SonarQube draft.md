
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
```
┌─────────────────┐     HTTP      ┌──────────────────┐
│  Developer      │──────────────▶│  SonarQube       │
│  Machine        │               │  Server          │
│                 │               │  (Container)     │
└─────────────────┘               └──────────────────┘
        │                                │
        │                                │
        ▼                                ▼
┌─────────────────┐               ┌──────────────────┐
│  Application    │               │  PostgreSQL      │
│  Source Code    │               │  Database        │
│  (Java/Python)  │               │  (Container)     │
└─────────────────┘               └──────────────────┘
```

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