# Lectures 37–39

# Deployment Environments, Containerization, and Docker

**Course Outcome:** CO4 – Apply security best practices and conduct testing; CO5 – Demonstrate effective team collaboration skills.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture Nos. | 37–39 |
| Unit | Unit 4: Deployment and DevOps |
| Topic | Deployment environments, containerization, Docker images, and containers |
| Course Outcome | CO4, CO5 |
| Bloom's Knowledge Level | Understand, Apply, Analyze |
| Skills Developed | Comparing deployment environments, writing Dockerfiles, building images, running containers, API testing, debugging, and documentation |
| Applications | Deploying APIs to local systems, VPS platforms, cloud services, and container-based infrastructure |
| PBL Activity | Containerize and test the same Student API using FastAPI and Express |
| Assessment Method | Practical coding task, Docker demonstration, API test, and viva |

> **Lecture flow:** L37 explains where applications run, L38 explains why containers help, and L39 applies the concepts by creating and testing Docker images for FastAPI and Express.

---

## Learning Objectives

By the end of these lectures, students should be able to:

1. Distinguish between local, staging, production, cloud, VPS, and container-based environments.
2. Explain the difference between a Dockerfile, image, container, registry, and volume.
3. Create Dockerfiles for FastAPI and Express applications.
4. Build and run Docker images with port mapping.
5. Test containerized APIs using a browser, `curl`, or an API client.
6. Identify and fix common Docker problems.

# Part A – Deployment Environments (L37)

## 1. What Is Deployment?

Deployment is the process of making an application available in an environment where it can be used by developers, testers, or end users.

```text
Developer machine → Staging environment → Production environment
       build              test                 serve users
```

**Comment:** The same application may run in several environments, but each environment can have different configuration, data, permissions, and users.

## 2. Common Deployment Environments

| Environment | Purpose | Typical example |
|---|---|---|
| Local | Development and debugging | Laptop with Python, Node.js, or Docker |
| Staging | Production-like testing | Separate VPS or cloud service |
| Production | Live service for users | AWS, Azure, or a production VPS |
| Container environment | Reproducible execution | Docker host or Kubernetes cluster |

### Local, Cloud, and VPS

The local environment is fast for development but may differ between team members. Cloud platforms such as AWS and Azure provide managed computing, networking, storage, and deployment services. A VPS gives more control, but the developer manages updates, firewall rules, Docker, monitoring, backups, and security.

**Comment:** Containerization reduces differences between these environments by packaging the application with its runtime and dependencies.

## 3. Configuration and Secrets

Use environment variables for values such as:

```text
PORT=8000
DATABASE_URL=...
API_KEY=...
```

**Security comment:** Never commit passwords, API keys, private tokens, or production database credentials to Git or copy them into a Docker image.

# Part B – Containerization Basics (L38)

## 4. What Is Containerization?

Containerization packages an application, its runtime, libraries, and configuration into a portable unit called a **container**.

```text
Dockerfile → Docker image → Running container → HTTP API
 instructions    package       process          users
```

**Explanation:** A Dockerfile describes how to create an image. An image is a reusable package. A container is a running instance of that image.

## 5. Docker Concepts

| Concept | Meaning |
|---|---|
| Dockerfile | Instructions used to build an image |
| Image | Read-only package containing application files and dependencies |
| Container | Running instance of an image |
| Registry | Service for storing and distributing images, such as Docker Hub |
| Port mapping | Connects a host port to a container port |
| Volume | Persistent storage managed separately from a container |
| `.dockerignore` | Files excluded from the image build context |

## 6. Containers and Virtual Machines

| Container | Virtual machine |
|---|---|
| Shares the host operating-system kernel | Includes a complete guest operating system |
| Starts quickly and usually uses fewer resources | Usually takes longer to start and uses more resources |
| Packages an application and dependencies | Virtualizes an entire machine |

**Comment:** Containers still require secure images, patching, secret management, restricted access, and suitable users and permissions.

## 7. Install and Verify Docker

Install Docker Desktop on Windows or macOS, or Docker Engine on Linux.

```bash
docker --version
docker run hello-world
docker ps
docker images
```

**Expected result:** `hello-world` prints a success message. `docker ps` may be empty because the example container exits after printing its message.

# Part C – Working with Docker (L39)

## 8. Dockerfile Instructions

```dockerfile
FROM       # selects a base image
WORKDIR    # selects the working directory
COPY       # copies application files
RUN        # executes a build-time command
EXPOSE     # documents the application port
CMD        # default command when the container starts
```

**Important:** `EXPOSE` documents a port; it does not publish the port. Publishing is done with `docker run -p`.

## 9. Build–Run–Test Workflow

```text
Write application
      ↓
Write Dockerfile and .dockerignore
      ↓
docker build
      ↓
docker run -p host:container
      ↓
curl/browser/API client test
      ↓
docker logs and debugging
```

Common commands:

```bash
docker build -t image-name:1.0 .
docker run --name container-name -p 8000:8000 image-name:1.0
docker ps
docker logs container-name
docker stop container-name
docker rm container-name
docker images
```

# Part D – Required Hands-On

## 10. Problem Statement

Create the same small **Student API** in FastAPI and Express. Build a separate Docker image for each implementation, run both containers, and verify their responses.

### Required API contract

| Method | Endpoint | Expected result |
|---|---|---|
| GET | `/` | Application name and status |
| GET | `/health` | Health status |
| GET | `/students` | List of students |

Recommended structure:

```text
docker-student-api/
├── fastapi-app/
└── express-app/
```

## 11. FastAPI Application

Create `fastapi-app/main.py`:

```python
from fastapi import FastAPI

app = FastAPI(title="Student API - FastAPI")

students = [
    {"id": 1, "name": "Aarav", "course": "Backend Development"},
    {"id": 2, "name": "Diya", "course": "Backend Development"},
]

@app.get("/")
def root():
    return {"application": "Student API", "framework": "FastAPI", "status": "running"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/students")
def list_students():
    return students
```

**Comment:** Each decorator maps an HTTP method and path to a Python function. FastAPI serializes the returned dictionaries and list as JSON.

Create `fastapi-app/requirements.txt`:

```text
fastapi==0.115.6
uvicorn[standard]==0.34.0
```

Create `fastapi-app/Dockerfile`:

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Comment:** Dependencies are copied before application code so Docker can reuse the dependency layer. `0.0.0.0` is required for access from outside the container.

Create `fastapi-app/.dockerignore`:

```text
__pycache__/
*.pyc
.venv/
.git/
```

Build and run:

```bash
cd fastapi-app
docker build -t student-api-fastapi:1.0 .
docker run --name student-fastapi -p 8000:8000 student-api-fastapi:1.0
```

Test the container:

```bash
curl http://localhost:8000/
curl http://localhost:8000/health
curl http://localhost:8000/students
```

You can also open `http://localhost:8000/docs` to use FastAPI's generated documentation.

Expected health response:

```json
{"status":"healthy"}
```

## 12. Express Application

Create `express-app/package.json`:

```json
{
  "name": "student-api-express",
  "version": "1.0.0",
  "private": true,
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.21.2"
  }
}
```

Create `express-app/server.js`:

```javascript
const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

const students = [
  { id: 1, name: "Aarav", course: "Backend Development" },
  { id: 2, name: "Diya", course: "Backend Development" }
];

app.get("/", (req, res) => {
  res.json({ application: "Student API", framework: "Express", status: "running" });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.get("/students", (req, res) => {
  res.json(students);
});

app.listen(port, "0.0.0.0", () => {
  console.log("Express API listening on port " + port);
});
```

**Comment:** `process.env.PORT` allows configuration without changing source code. Binding to `0.0.0.0` makes the server reachable through Docker port mapping.

Create `express-app/Dockerfile`:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY server.js .

EXPOSE 3000

CMD ["npm", "start"]
```

**Comment:** Copying `package*.json` before `server.js` allows Docker to cache the dependency layer.

Create `express-app/.dockerignore`:

```text
node_modules/
npm-debug.log
.git/
.env
```

Build and run:

```bash
cd express-app
docker build -t student-api-express:1.0 .
docker run --name student-express -p 3000:3000 student-api-express:1.0
```

Test the container:

```bash
curl http://localhost:3000/
curl http://localhost:3000/health
curl http://localhost:3000/students
```

Expected health response:

```json
{"status":"healthy"}
```

## 13. Run Both Containers Together

Run both applications on different host ports:

```bash
docker run -d --name student-fastapi -p 8000:8000 student-api-fastapi:1.0
docker run -d --name student-express -p 3000:3000 student-api-express:1.0
```

Test both:

```bash
curl http://localhost:8000/health
curl http://localhost:3000/health
curl http://localhost:8000/students
curl http://localhost:3000/students
```

**Observation:** Both applications provide the same API contract even though they use different languages and frameworks.

Inspect and clean up:

```bash
docker ps
docker logs student-fastapi
docker logs student-express
docker stop student-fastapi student-express
docker rm student-fastapi student-express
```

# Part E – Testing and Troubleshooting

## 14. Verification Checklist

| Check | Evidence |
|---|---|
| Docker installed | `docker --version` |
| Images built | `docker images` |
| Containers running | `docker ps` |
| FastAPI endpoints work | `curl http://localhost:8000/...` |
| Express endpoints work | `curl http://localhost:3000/...` |
| Logs are understandable | `docker logs <container-name>` |
| Documentation is complete | README with commands and outputs |

## 15. Common Problems

| Problem | Likely cause | Fix |
|---|---|---|
| Cannot connect to Docker daemon | Docker is not running | Start Docker Desktop or Docker Engine |
| Port already in use | Another process uses the host port | Use another host port, such as `-p 8001:8000` |
| Container exits immediately | Command or dependency failed | Run `docker logs <container-name>` |
| API is unreachable | Server listens on `127.0.0.1` | Bind the application to `0.0.0.0` |
| Dependency file not found | Wrong build context or filename | Run `docker build` from the app directory |
| Code changes are missing | Image was not rebuilt | Rebuild the image and recreate the container |

**Debugging comment:** Inspect errors in this order: container status, container logs, image build output, port mapping, and application configuration.

# Part F – PBL Activity and Assessment

## 16. PBL Activity: Portable Student API

A team has implemented a Student API in FastAPI and Express. Team members use different operating systems and runtime versions. Create reproducible images that can later be deployed to a VPS or cloud platform.

### Student task

1. Create both applications using the API contract.
2. Write a Dockerfile and `.dockerignore` for each.
3. Build both images with meaningful tags.
4. Run both containers on separate host ports.
5. Test `/`, `/health`, and `/students`.
6. Record commands and outputs in `README.md`.
7. Work in pairs: one student handles FastAPI and the other Express, then review each other's Dockerfiles.

## 17. Submission Requirements

```text
student-docker-api/
├── README.md
├── fastapi-app/
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .dockerignore
└── express-app/
    ├── server.js
    ├── package.json
    ├── Dockerfile
    └── .dockerignore
```

The README must include installation requirements, build commands, run commands, API test commands, successful output, and one problem with its solution.


## 19. Exit Questions

1. What is the difference between an image and a container?
2. Why do both applications bind to `0.0.0.0` inside Docker?
3. What does `-p 8000:8000` mean?
4. Why is `.dockerignore` useful?
5. How would you debug a container that exits immediately?
6. Why should secrets not be copied into a Docker image?

## Summary

> Deployment environments determine where an application runs. Containerization packages an application and its dependencies into a portable unit. Dockerfiles create images, and containers run those images. In this practical sequence, the same Student API contract was implemented in FastAPI and Express, containerized independently, run on different ports, and tested using HTTP requests.

