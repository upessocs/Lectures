# GitHub Actions

### **What is GitHub Actions?**  
GitHub Actions is a CI/CD automation tool that lets you run workflows when events occur in your repository. Workflows are defined in **YAML files** inside `.github/workflows/`.

### **Basic Structure of a GitHub Actions Workflow**
A GitHub Actions workflow consists of:  
1. **Events** – What triggers the workflow (push, pull request, schedule, etc.).  
2. **Jobs** – A job runs on a virtual machine (Ubuntu, Windows, or macOS).  
3. **Steps** – A series of commands executed within a job.  
4. **Actions** – Reusable components for performing tasks (like setting up Python, running tests, or deploying).  

---

### **Step 1: Creating a Basic Workflow**
Let's start with a simple workflow that triggers when you push code to the repository.

**Create a file:** `.github/workflows/main.yml`  

```yaml
name: CI Pipeline  # Name of the workflow

on: 
  push:
    branches:
      - main  # Runs on pushes to the 'main' branch

jobs:
  build:
    runs-on: ubuntu-latest  # The virtual machine for the job

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4  # Checks out your repository code
```

---

### **Step 2: Adding More Steps**  
Let's add **setting up Python** (if you need Python-based automation).

```yaml
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
```

If you're using **Node.js**, you can set it up like this:

```yaml
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
```

---

### **Step 3: Installing Dependencies**  
If your project requires dependencies, install them.

- **For Python (pip + requirements.txt):**
  
```yaml
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
```

- **For Node.js (npm install):**
  
```yaml
      - name: Install dependencies
        run: npm install
```

---

### **Step 4: Running Tests**  
Run your test suite:

- **For Python (pytest)**:
  
```yaml
      - name: Run Python Tests
        run: pytest
```

- **For Node.js (Jest or Mocha)**:
  
```yaml
      - name: Run Node.js Tests
        run: npm test
```

---

### **Step 5: Adding Linting**
Linting ensures your code follows best practices.

- **Python (flake8)**:
  
```yaml
      - name: Run Python Linter
        run: flake8 .
```

- **JavaScript (ESLint)**:
  
```yaml
      - name: Run ESLint
        run: npm run lint
```

---

### **Step 6: Building and Deploying**
- **For a Python Web App (e.g., FastAPI, Flask, Django)**:
  
```yaml
      - name: Run Web Server
        run: python app.py
```

- **For a Node.js Web App (React, Next.js, Express)**:
  
```yaml
      - name: Build Project
        run: npm run build
```

- **Deploy to GitHub Pages**:
  
```yaml
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

---

### **Step 7: Running on a Schedule (CRON Jobs)**
You can also schedule workflows instead of running them on push:

```yaml
on:
  schedule:
    - cron: "0 0 * * *"  # Runs every midnight UTC
```

---

### **Full Example GitHub Actions Workflow**
Here’s a complete pipeline that:
1. Runs when code is pushed to `main`
2. Sets up Python and installs dependencies
3. Runs tests and linter
4. Deploys to GitHub Pages

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main
  schedule:
    - cron: "0 0 * * *"  # Runs at midnight daily

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Run Tests
        run: pytest

      - name: Run Linter
        run: flake8 .

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

---

### **Possible Steps You Might Need**
| Step | Purpose |
|------|---------|
| `actions/checkout@v4` | Checks out your repository code |
| `actions/setup-python@v4` | Sets up Python |
| `actions/setup-node@v4` | Sets up Node.js |
| Install dependencies | Runs `pip install -r requirements.txt` or `npm install` |
| Run tests | Executes `pytest` or `npm test` |
| Lint code | Runs `flake8` or `eslint` |
| Build project | Executes `npm run build` |
| Deploy to GitHub Pages | Uses `peaceiris/actions-gh-pages@v4` |
| Upload artifacts | Saves build outputs |
| Run on schedule | Uses `cron` to schedule execution |

---

### **Next Steps**
Would you like to:
1. Add a **Docker-based deployment**?
2. Run **parallel jobs**?
3. Store and use **secrets** for secure keys?
4. Deploy to **AWS/GCP/Azure**?


---
# Comparision with Jenkins (Optional for now)

### **GitHub Actions vs. Jenkins (with Parallel Example)**
Both **GitHub Actions** and **Jenkins** are CI/CD tools, but they have different approaches:  

| Feature            | GitHub Actions                           | Jenkins                              |
|--------------------|----------------------------------------|--------------------------------------|
| **Setup**         | No installation, built into GitHub     | Requires manual installation & setup |
| **Configuration** | YAML-based workflows (`.github/workflows/`) | Groovy-based pipeline (`Jenkinsfile`) |
| **Execution**     | Runs on GitHub-hosted or self-hosted runners | Runs on self-hosted agents (nodes) |
| **Triggers**      | GitHub events (`push`, `PR`, `schedule`, `workflow_dispatch`) | Webhooks, cron jobs, SCM polling |
| **Parallel Jobs** | Simple `strategy.matrix` for parallelism | Uses `parallel` block in pipelines |
| **Plugins**       | Built-in support, marketplace actions  | Requires plugins for additional functionality |

---

## **Parallel Job Example (GitHub Actions vs. Jenkins)**  

### **GitHub Actions Parallel Execution**
In GitHub Actions, parallel jobs are handled using the `strategy.matrix` feature.

```yaml
name: Parallel Jobs Example

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: [3.8, 3.9, 3.10]  # Runs in parallel for each version
        os: [ubuntu-latest, windows-latest]  # Runs in parallel across OSes

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: ${{ matrix.python-version }}

      - name: Run Tests
        run: pytest
```

🔹 This will execute 6 parallel jobs:  
- **Python 3.8 on Ubuntu**  
- **Python 3.8 on Windows**  
- **Python 3.9 on Ubuntu**  
- **Python 3.9 on Windows**  
- **Python 3.10 on Ubuntu**  
- **Python 3.10 on Windows**  

---

### **Jenkins Parallel Execution**
In **Jenkins**, parallel execution is achieved using the `parallel` block in a **Declarative Pipeline**.

```groovy
pipeline {
    agent any  // Run on any available agent

    stages {
        stage('Parallel Execution') {
            parallel {
                stage('Python 3.8 - Ubuntu') {
                    agent { label 'ubuntu' }
                    steps {
                        sh 'python3 -m pytest'
                    }
                }
                stage('Python 3.8 - Windows') {
                    agent { label 'windows' }
                    steps {
                        bat 'python -m pytest'
                    }
                }
                stage('Python 3.9 - Ubuntu') {
                    agent { label 'ubuntu' }
                    steps {
                        sh 'python3 -m pytest'
                    }
                }
                stage('Python 3.9 - Windows') {
                    agent { label 'windows' }
                    steps {
                        bat 'python -m pytest'
                    }
                }
            }
        }
    }
}
```

🔹 This will execute **four parallel jobs** based on the specified labels (`ubuntu` and `windows`).  

---

### **Comparison of Parallel Execution**
| Feature          | GitHub Actions                           | Jenkins                              |
|-----------------|----------------------------------------|--------------------------------------|
| **Syntax**      | YAML (`strategy.matrix`)               | Groovy (`parallel` block)           |
| **Execution**   | Automatically spins up parallel jobs  | Requires multiple agents (nodes)    |
| **Scaling**     | GitHub-hosted runners or self-hosted  | Needs Jenkins agent setup           |
| **Ease of Use** | Easier to configure in YAML           | Requires managing Jenkins pipelines |

---

### **Conclusion**
- **GitHub Actions** is **easier** to configure for parallel execution using `matrix`.
- **Jenkins** provides **more flexibility** but requires managing nodes and agents.  
- If you want **cloud-based CI/CD**, GitHub Actions is a good choice.  
- If you have **on-premise CI/CD with custom infrastructure**, Jenkins is a better fit.  
