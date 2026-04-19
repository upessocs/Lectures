# Experiment 10: SonarQube — Static Code Analysis


### Theory

**Problem Statement:**
Code bugs and security issues are often found too late — during testing or even after deployment. Manual code reviews are slow, inconsistent, and don't scale as teams grow.

**What is SonarQube?**
SonarQube is an open-source platform that automatically scans your source code for bugs, security vulnerabilities, and maintainability issues — without running the code. This is called **static analysis**.

**How SonarQube Solves the Problem:**
- Scans code on every commit, giving immediate feedback
- Enforces **Quality Gates** — pass/fail checks before code is deployed
- Tracks **Technical Debt** — how long it would take to fix all issues
- Supports 20+ programming languages
- Provides a visual dashboard for trends over time

**Key Terms:**

| Term | What it means |
|------|--------------|
| Quality Gate | A set of rules; code must pass before deployment |
| Bug | Code that will likely break or behave incorrectly |
| Vulnerability | A security weakness in the code |
| Code Smell | Code that works but is poorly written or hard to maintain |
| Technical Debt | Estimated time to fix all issues |
| Coverage | Percentage of code tested by unit tests |
| Duplication | Repeated code blocks (copy-paste) |

---

### Lab Architecture

> SonarQube has **two separate components** — a **Server** (the brain) and a **Scanner** (the worker). Both are required.

```
┌─────────────────────────────────────────────────────────┐
│                    Your Machine / CI                    │
│                                                         │
│   ┌──────────────┐        ┌──────────────────────────┐  │
│   │  Your Code   │──────▶ │    Sonar Scanner         │  │
│   │  (Java, JS,  │ scans  │  (CLI / Maven / Jenkins) │  │
│   │   Python...) │        └────────────┬─────────────┘  │
│   └──────────────┘                     │ sends report   │
│                                        ▼                │
│                          ┌─────────────────────────┐    │
│                          │   SonarQube Server      │    │
│                          │   (runs on port 9000)   │    │
│                          │   ┌─────────────────┐   │    │
│                          │   │ Analysis Engine │   │    │
│                          │   │ Quality Gates   │   │    │
│                          │   │ Web Dashboard   │   │    │
│                          │   └────────┬────────┘   │    │
│                          └───────────┼─────────────┘    │
│                                      │ stores results   │
│                          ┌───────────▼─────────────┐    │
│                          │   PostgreSQL Database   │    │
│                          └─────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```
<svg viewBox="0 0 900 520" width="100%" xmlns="http://www.w3.org/2000/svg">

  <!-- Background -->
  <rect x="5" y="5" width="890" height="510" rx="20" ry="20" fill="#eaf3fb" stroke="#b5c7d8" stroke-width="2"/>

  <!-- Title -->
  <text x="450" y="40" text-anchor="middle" font-size="20" font-family="Arial" fill="#2c3e50">
    Your Machine / CI
  </text>

  <!-- Your Code -->
  <rect x="80" y="100" width="180" height="70" rx="10" fill="#f7d774" stroke="#c9a93c"/>
  <text x="170" y="130" text-anchor="middle" font-size="14" font-family="Arial">Your Code</text>
  <text x="170" y="150" text-anchor="middle" font-size="12">(Java, JS, Python...)</text>

  <!-- Sonar Scanner -->
  <rect x="320" y="95" width="220" height="80" rx="12" fill="#f47c2c" stroke="#c75a15"/>
  <text x="430" y="125" text-anchor="middle" font-size="14" fill="white">Sonar Scanner</text>
  <text x="430" y="145" text-anchor="middle" font-size="12" fill="white">(CLI / Jenkins)</text>

  <!-- Arrow Code -> Scanner -->
  <line x1="260" y1="135" x2="320" y2="135" stroke="#34495e" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="290" y="125" font-size="11">scans</text>

  <!-- Arrow Scanner -> Server -->
  <line x1="430" y1="175" x2="430" y2="220" stroke="#34495e" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="440" y="200" font-size="11">report</text>

  <!-- SonarQube Server -->
  <rect x="280" y="220" width="300" height="140" rx="15" fill="#5cb85c" stroke="#3d8b3d"/>
  <text x="430" y="245" text-anchor="middle" font-size="14" fill="white">
    SonarQube Server (9000)
  </text>

  <!-- Inner blocks -->
  <rect x="310" y="260" width="240" height="25" rx="6" fill="#dff0d8"/>
  <text x="430" y="277" text-anchor="middle" font-size="12">Analysis Engine</text>

  <rect x="310" y="290" width="240" height="25" rx="6" fill="#dff0d8"/>
  <text x="430" y="307" text-anchor="middle" font-size="12">Quality Gates</text>

  <rect x="310" y="320" width="240" height="25" rx="6" fill="#dff0d8"/>
  <text x="430" y="337" text-anchor="middle" font-size="12">Web Dashboard</text>

  <!-- Database -->
  <rect x="330" y="390" width="200" height="50" rx="10" fill="#7e6bb5" stroke="#5a4a91"/>
  <text x="430" y="420" text-anchor="middle" font-size="13" fill="white">
    PostgreSQL DB
  </text>

  <!-- Arrow Server -> DB -->
  <line x1="430" y1="360" x2="430" y2="390" stroke="#34495e" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="440" y="375" font-size="11">stores</text>

  <!-- User -->
  <circle cx="720" cy="280" r="40" fill="#d9edf7" stroke="#7aa7c7"/>
  <text x="720" y="285" text-anchor="middle" font-size="12">User</text>

  <!-- Arrow Dashboard -> User -->
  <path d="M580 300 Q650 260 680 280" fill="none" stroke="#34495e" stroke-width="2" stroke-dasharray="5,5" marker-end="url(#arrow)"/>
  <text x="630" y="250" font-size="11">view</text>

  <!-- Arrow marker -->
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#34495e"/>
    </marker>
  </defs>

</svg>
---

## Part 1: SonarQube Server — "The Brain"

### What it is

The **SonarQube Server** is a web application that:
- Stores all analysis results in a database
- Applies code quality rules (bugs, vulnerabilities, smells)
- Shows a web dashboard at `http://localhost:9000`
- Enforces Quality Gates (pass/fail decisions)
- Tracks history and trends over time

### Think of it like:
> A **teacher / examiner** — it receives work, grades it, and shows the report.

### What runs inside the server:
- Analysis Engine (applies the rules)
- Web UI (dashboard you browse to)
- PostgreSQL database (stores everything)

---

## Part 2: Sonar Scanner — "The Worker"

### What it is

The **Sonar Scanner** is a command-line tool that:
- Reads your source code files
- Detects issues based on the server's rule set
- Sends an analysis report to the SonarQube Server

### Think of it like:
> A **student writing an exam** — it does the work and submits it.

### Scanner types (you don't always use the CLI):

| Scanner Type | When to use |
|-------------|-------------|
| `sonar-scanner` (CLI) | Any project, run manually |
| Maven plugin (`mvn sonar:sonar`) | Java/Maven projects |
| Gradle plugin | Java/Gradle projects |
| Jenkins integration | CI/CD pipelines |
| GitHub Actions | Automated PRs |

---

## Why Both Are Required

```
  Only Server installed        Only Scanner installed
  ─────────────────────        ──────────────────────
  Dashboard is empty           Nowhere to send results
  No code gets analyzed        Analysis is wasted

  Both installed together
  ───────────────────────
  Full pipeline works ✓
```

**Flow summary:**
```
[ Your Code ]
      │
      ▼
[ Sonar Scanner ]  ◀── reads code, detects issues
      │
      │  sends analysis report (HTTP + Token)
      ▼
[ SonarQube Server ]  ◀── validates, stores, displays results
      │
      ▼
[ PostgreSQL Database ]  ◀── persists everything
```

---

## Quick Comparison Table

| Feature | SonarQube Server | Sonar Scanner |
|---------|-----------------|--------------|
| Type | Server application | CLI / plugin |
| Role | Store & display results | Analyze code |
| Web UI | Yes (port 9000) | No |
| Runs on | Server / Docker container | Dev machine / CI |
| Required | Yes | Yes |

---

## How the Token Works

The scanner does **not** use a username/password. It uses a **token** for authentication.

```
Step 1 → Start SonarQube Server
Step 2 → Open Web UI at http://localhost:9000
Step 3 → Generate Token in UI  ← you copy this
Step 4 → Run Scanner, passing the token
Step 5 → Server validates token, stores results
Step 6 → View Dashboard
```

```
[ Scanner ]
     │
     │  HTTP request + Token header
     ▼
[ SonarQube Server ]
     │
     ├── Token valid?  ──Yes──▶  Accept analysis, store results
     │
     └── Token invalid? ──────▶  Reject (scan fails)
```

**Token is:**
- Generated once in the **Server UI**
- Used by the **Scanner** on every scan
- Shown only once — copy it immediately

---


## Hands-on Lab

---

### Step 1: Start the SonarQube Server

We will use Docker Compose to start both the SonarQube server and its PostgreSQL database together.

Create a file called `docker-compose.yml`:

```yaml
# docker-compose.yml
# This file starts two containers:
#   1. sonar-db     → PostgreSQL database (stores SonarQube data)
#   2. sonarqube    → The SonarQube server (web UI + analysis engine)

version: '3.8'

services:

  # ── Database ──────────────────────────────────────────────
  sonar-db:
    image: postgres:13
    container_name: sonar-db
    environment:
      POSTGRES_USER: sonar          # DB username
      POSTGRES_PASSWORD: sonar      # DB password
      POSTGRES_DB: sonarqube        # DB name
      POSTGRES_HOST_AUTH_METHOD: trust  # allow connections without password (for simplicity in this lab) 
    volumes:
      - sonar-db-data:/var/lib/postgresql/data   # persist data across restarts
    networks:
      - sonarqube-lab

  # ── SonarQube Server ──────────────────────────────────────
  sonarqube:
    image: sonarqube:lts-community
    container_name: sonarqube
    ports:
      - "9000:9000"                 # access dashboard at http://localhost:9000
    environment:
      SONAR_JDBC_URL: jdbc:postgresql://sonar-db:5432/sonarqube
      SONAR_JDBC_USERNAME: sonar
      SONAR_JDBC_PASSWORD: sonar
    volumes:
      - sonar-data:/opt/sonarqube/data
      - sonar-extensions:/opt/sonarqube/extensions
    depends_on:
      - sonar-db                    # wait for DB to start first
    networks:
      - sonarqube-lab

# Named volumes (Docker manages storage location)
volumes:
  sonar-db-data:
  sonar-data:
  sonar-extensions:

# Isolated network so containers can talk to each other by name
networks:
  sonarqube-lab:
    driver: bridge

```

Start both containers:

```bash
docker-compose up -d

# Watch the logs until you see "SonarQube is up"
docker-compose logs -f sonarqube
```

Once started, open `http://localhost:9000` in your browser.
Default login: **admin / admin** (you will be asked to change this on first login).

---

### Step 2: Create a Sample Java App with Code Issues

We will create a simple Java class that intentionally contains bugs, vulnerabilities, and code smells — so SonarQube has something to detect.

```bash
# Create the project folder structure
mkdir -p sample-java-app/src/main/java/com/example
cd sample-java-app
```

Create `src/main/java/com/example/Calculator.java`:

```java
package com.example;

public class Calculator {

    // ── BUG: Division by zero is not handled ──────────────
    // If someone calls divide(5, 0), this will crash at runtime.
    public int divide(int a, int b) {
        return a / b;
    }

    // ── CODE SMELL: Unused variable ────────────────────────
    // The variable 'unused' is declared but never used.
    // SonarQube flags this as unnecessary clutter.
    public int add(int a, int b) {
        int result = a + b;
        int unused = 100;   // ← code smell: delete this line
        return result;
    }

    // ── VULNERABILITY: SQL Injection risk ─────────────────
    // Building a query by concatenating user input is dangerous.
    // An attacker could pass: "1 OR 1=1" and get all users.
    public String getUser(String userId) {
        String query = "SELECT * FROM users WHERE id = " + userId;
        return query;
    }

    // ── CODE SMELL: Duplicated code ────────────────────────
    // The two methods below do exactly the same thing.
    // This is copy-paste code and should be a single method.
    public int multiply(int a, int b) {
        int result = 0;
        for (int i = 0; i < b; i++) {
            result = result + a;
        }
        return result;
    }

    public int multiplyAlt(int a, int b) {
        int result = 0;
        for (int i = 0; i < b; i++) {
            result = result + a;   // ← exact duplicate of multiply()
        }
        return result;
    }

    // ── BUG: Null pointer risk ─────────────────────────────
    // If 'name' is null, calling .toUpperCase() will throw
    // a NullPointerException at runtime.
    public String getName(String name) {
        return name.toUpperCase();
    }

    // ── CODE SMELL: Empty catch block ─────────────────────
    // The exception is caught but silently ignored.
    // This hides errors and makes debugging very hard.
    public void riskyOperation() {
        try {
            int x = 10 / 0;
        } catch (Exception e) {
            // ← never leave catch blocks empty
        }
    }
}
```

Create `pom.xml` (Maven build file):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <!-- Project identity -->
    <groupId>com.example</groupId>
    <artifactId>sample-app</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>11</maven.compiler.source>
        <maven.compiler.target>11</maven.compiler.target>

        <!-- SonarQube connection settings -->
        <sonar.projectKey>sample-java-app</sonar.projectKey>
        <sonar.host.url>http://localhost:9000</sonar.host.url>
        <!-- Replace with your actual token (generated in Step 3) -->
        <sonar.login>YOUR_TOKEN_HERE</sonar.login>
    </properties>

    <dependencies>
        <!-- JUnit for unit tests -->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- This plugin lets us run: mvn sonar:sonar -->
            <plugin>
                <groupId>org.sonarsource.scanner.maven</groupId>
                <artifactId>sonar-maven-plugin</artifactId>
                <version>3.9.1.2184</version>
            </plugin>
        </plugins>
    </build>

</project>
```

---

### Step 3: Generate a Token (Manual UI Step)

The Scanner needs a token to authenticate with the server. You generate this in the web UI.

```
1. Open http://localhost:9000
2. Log in as admin
3. Click your user icon (top right) → "My Account"
4. Click the "Security" tab
5. Under "Generate Tokens", type a name: scanner-token
6. Click "Generate"
7. Copy the token immediately — it is shown only once!
   It looks like: sqp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> **Important:** Store the token somewhere safe. You cannot retrieve it again after closing the page.

---

### Step 4: Run the Scanner

There are two ways to run the scanner. Pick the one that matches your setup.

#### Option A — Using the Maven Plugin (recommended for Java)

```bash
# Make sure you are inside the sample-java-app folder
cd sample-java-app

# Run the SonarQube analysis via Maven
# Replace YOUR_TOKEN with the token copied in Step 3
mvn sonar:sonar -Dsonar.login=YOUR_TOKEN
```

Maven will compile the code, then the sonar plugin will send the analysis report to the server.

#### Option B — Using the Sonar Scanner CLI (any language)

First, create a configuration file `sonar-project.properties` in your project root:

```properties
# sonar-project.properties
# This file tells the scanner what to analyze and where to send results.

sonar.projectKey=sample-java-app          # must match the key on the server
sonar.projectName=Sample Java Application # display name in dashboard
sonar.projectVersion=1.0

sonar.sources=src                         # folder containing source code
sonar.java.binaries=target/classes        # compiled class files (Java only)
sonar.sourceEncoding=UTF-8
```



# Run scanner using docker 
Then run the scanner using Docker (no local install needed):




```bash
# Run the scanner container, mounting your project folder inside it
docker run --rm \
  --network sonarqube-lab \
  -e SONAR_TOKEN="YOUR_TOKEN" \
  -v "$(pwd):/usr/src" \
  sonarsource/sonar-scanner-cli \
  -Dsonar.host.url=http://sonarqube:9000 \
  -Dsonar.projectBaseDir=/usr/src \
  -Dsonar.projectKey=sample-java-app
```

> you might need to change network name based on actual network name used by sonar-server

```
docker network ls
# or
docker inspect sonarqube | grep -i network

```


| Flag                     | Purpose               |
| :------------------------ | :--------------------- |
| `--rm`                   | auto delete container |
| `--network`              | connect to SonarQube  |
| `-e SONAR_TOKEN`         | authentication        |
| `-v`                     | mount source code     |
| `-Dsonar.host.url`       | server URL            |
| `-Dsonar.projectBaseDir` | project root          |
| `-Dsonar.projectKey`     | project identifier to store on server |



> **Note:** We use `http://sonarqube:9000` (container name, not localhost) because the scanner container is on the same Docker network as the server container.

---

### Step 5: View Results in the Dashboard

After the scan finishes, open the dashboard:

```
http://localhost:9000/dashboard?id=sample-java-app
```

You should see something like:

```
┌─────────────────────────────────────────────┐
│         sample-java-app — Dashboard         │
├──────────────┬──────────────┬───────────────┤
│  Bugs        │ Vulnerab.    │  Code Smells  │
│    5         │    1         │    8          │
├──────────────┴──────────────┴───────────────┤
│  Coverage: 0%    Duplications: 2 blocks     │
│  Technical Debt: ~1h 30min                  │
│  Quality Gate: ✗ FAILED                     │
└─────────────────────────────────────────────┘
```

Click on any number to see the exact line and reason for each issue.

You can also query results via the API:

```bash
# List all bugs found in the project (returns JSON)
curl -u admin:YOUR_TOKEN \
  "http://localhost:9000/api/issues/search?projectKeys=sample-java-app&types=BUG"
```

---

### Step 6: Integrate with Jenkins (CI/CD)

Once SonarQube is working locally, you can add it to a Jenkins pipeline so every code commit is automatically scanned.

```groovy
// Jenkinsfile
// This pipeline checks out code, scans it with SonarQube,
// waits for the Quality Gate result, then builds and deploys.

pipeline {
    agent any

    environment {
        SONAR_HOST_URL = 'http://sonarqube:9000'
        // 'sonar-token' is a Jenkins credential — store your token there
        SONAR_TOKEN = credentials('sonar-token')
    }

    stages {

        stage('Checkout') {
            steps {
                // Pull the latest code from the repository
                checkout scm
            }
        }


	stage('SonarQube Analysis') {
    		steps {
        		// This injects SonarQube server URL + authentication token
        		withSonarQubeEnv('SonarQube') {

 		        // mvn = Maven tool (used mainly for Java projects)
            		// clean = remove old build files
            		// verify = compile code + run tests
            		// sonar:sonar = send analysis report to SonarQube server
            		sh 'mvn clean verify sonar:sonar'
			}
    		}
	}

        stage('Quality Gate') {
            steps {
                // Wait for SonarQube to finish processing the report.
                // If the Quality Gate fails, the pipeline stops here.
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build') {
            steps {
                // Only runs if Quality Gate passed
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
```

**Pipeline flow:**
```
Checkout → Scan → Quality Gate check → Build → Deploy
                         │
                   FAIL? Pipeline stops.
                   Code does not get deployed.
```

---

## Token Generation — Step-by-Step Summary

```
┌──────────────────────────────────────────────────────────┐
│                    Token Flow                            │
│                                                          │
│  [SonarQube Web UI]                                      │
│    Admin → My Account → Security → Generate Token        │
│    Token: sqp_xxxxxxxx  ◀── copy this                   │
│                    │                                     │
│                    │ you paste it into:                  │
│                    ▼                                     │
│  [Sonar Scanner]                                         │
│    -Dsonar.login=sqp_xxxxxxxx                            │
│    OR                                                    │
│    export SONAR_TOKEN=sqp_xxxxxxxx                       │
│                    │                                     │
│                    │ HTTP request with token             │
│                    ▼                                     │
│  [SonarQube Server]                                      │
│    Validates token → Accepts analysis → Stores results   │
│                    │                                     │
│                    ▼                                     │
│  [Dashboard]                                             │
│    http://localhost:9000 → view issues                   │
└──────────────────────────────────────────────────────────┘
```

**Three ways to pass the token to the scanner:**

```bash
# Option A — directly in the command
sonar-scanner -Dsonar.login=YOUR_TOKEN

# Option B — environment variable (cleaner, preferred in CI)
export SONAR_TOKEN=YOUR_TOKEN
sonar-scanner -Dsonar.host.url=http://localhost:9000

# Option C — Maven flag
mvn sonar:sonar -Dsonar.login=YOUR_TOKEN
```

---

## Comparative Analysis & Summary

### Tool Comparison Matrix

| Feature | Jenkins | Ansible | Chef | SonarQube |
|---------|---------|---------|------|-----------|
| **Primary Purpose** | CI/CD Automation | Config Management | Config Management | Code Quality |
| **Architecture** | Master-Agent | Agentless | Client-Server | Client-Server |
| **Language** | Java / Groovy | YAML | Ruby | Java |
| **Learning Curve** | Moderate | Low | High | Low |
| **Setup Complexity** | Moderate | Simple | Complex | Simple |
| **Use Case** | Build, Test, Deploy | Infrastructure as Code | Enterprise CM | Static Analysis |

### Key Differences

**Jenkins vs. Configuration Management:**
Use Jenkins to orchestrate pipelines (build → test → deploy). Use Ansible or Chef to maintain server configuration. In practice, Jenkins calls Ansible/Chef as part of the deployment step.

**Ansible vs. Chef:**

| Aspect | Ansible | Chef |
|--------|---------|------|
| Complexity | Simple, YAML | Complex, Ruby |
| Agent required | No (agentless) | Yes (chef-client) |
| Best for | Small–medium teams | Large enterprise |

**SonarQube in CI/CD:**
Scan on every pull request and every nightly build. Use Quality Gates to block deployments when code quality drops below your threshold.

---

### Commands Quick Reference

#### SonarQube
```bash
# Start server
docker-compose up -d

# Run scan with Maven
mvn sonar:sonar -Dsonar.login=YOUR_TOKEN

# Run scan with CLI
sonar-scanner -Dsonar.host.url=http://localhost:9000 -Dsonar.login=YOUR_TOKEN

# Query API for bugs
curl -u admin:YOUR_TOKEN \
  "http://localhost:9000/api/issues/search?projectKeys=myapp&types=BUG"
```

#### Jenkins
```bash
# Start Jenkins container
docker run -d -p 8080:8080 -v jenkins-data:/var/jenkins_home jenkins/jenkins:lts

# Example pipeline stage
pipeline {
    agent any
    stages {
        stage('Build') { steps { sh 'mvn package' } }
    }
}
```

#### Ansible
```bash
ansible all -i inventory -m ping
ansible-playbook -i inventory playbook.yml
ansible webservers -m apt -a "name=nginx state=present"
```

#### Chef
```bash
knife node list
knife cookbook upload webapp
chef-client --local-mode --runlist 'recipe[webapp]'
```

---

### Best Practices

**Security:**
- Never hardcode tokens or passwords in source files — use environment variables or a secrets manager
- Use HTTPS for all SonarQube server communications in production
- Apply least-privilege: give the scanner token only the permissions it needs

**Code Quality:**
- Set Quality Gates to block merges when coverage drops below 80%
- Scan on every pull request, not just nightly
- Fix issues as they appear — do not let technical debt accumulate

**Infrastructure as Code:**
- Version all config files in Git
- Use modular Ansible roles and Chef cookbooks
- Test infrastructure code with Molecule (Ansible) or Test Kitchen (Chef)

**CI/CD Optimization:**
- Cache Maven / npm dependencies between builds
- Run SonarQube analysis in parallel with unit tests where possible
- Configure the pipeline to fail fast on Quality Gate failures

---

> **Summary:**
> SonarQube = the analysis platform that stores and displays results.
> Sonar Scanner = the tool that reads your code and sends the report to that platform.
> Both are required. The Scanner needs a Token to talk to the Server. Quality Gates let you automatically block bad code from being deployed.


---















---

# Optional read
## Better alternatives if not using maven in pipeline

### 1. If you're using **Node.js / Express**

Use SonarScanner directly (no Maven):

```groovy
stage('SonarQube Analysis') {
    steps {
        withSonarQubeEnv('SonarQube') {

            // Install scanner if not already available
            sh 'npm install -g sonar-scanner'

            // Run analysis
            sh '''
            sonar-scanner \
              -Dsonar.projectKey=my-node-app \
              -Dsonar.sources=. \
              -Dsonar.host.url=$SONAR_HOST_URL \
              -Dsonar.login=$SONAR_AUTH_TOKEN
            '''
        }
    }
}
```


### 2. If you're using **Python**

```groovy
stage('SonarQube Analysis') {
    steps {
        withSonarQubeEnv('SonarQube') {

            sh 'pip install sonar-scanner-cli'

            sh '''
            sonar-scanner \
              -Dsonar.projectKey=my-python-app \
              -Dsonar.sources=. \
              -Dsonar.host.url=$SONAR_HOST_URL \
              -Dsonar.login=$SONAR_AUTH_TOKEN
            '''
        }
    }
}
```


### 3. If you just want **simplest universal approach**

Create a `sonar-project.properties` file:

```
sonar.projectKey=my-app
sonar.sources=.
sonar.host.url=http://localhost:9000
sonar.login=YOUR_TOKEN
```

Then in Jenkins:

```groovy
stage('SonarQube Analysis') {
    steps {
        withSonarQubeEnv('SonarQube') {

            // Just run scanner (no Maven, no language dependency)
            sh 'sonar-scanner'
        }
    }
}
```



## Key Insight (important)

* **Maven = build tool (Java specific)**
* **SonarScanner = universal tool (works with any language)**

So:

> If you're not doing Java → **don’t use Maven at all**


## When should you actually use Maven?

Only if:

* You are writing Java
* You have `pom.xml` file
* You need dependency management + build lifecycle

