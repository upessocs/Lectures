# Lecture 39

# Working with Docker

**Course Outcome:** CO4 – Apply security best practices and conduct testing.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 39 |
| Unit | Unit 4: Deployment and DevOps |
| Topic | Dockerfiles, Images, Containers |
| Course Outcome | CO4 |
| Bloom's Knowledge Level | Apply |
| Skills Developed | Writing Dockerfiles, building images, running containers |
| Applications | Deploying backend applications |
| PBL Activity | Dockerizing the Student API |
| Assessment Method | Coding task |

---

## Part A – Theory

### 1. Introduction
A `Dockerfile` is a text file with instructions on how to build a Docker image for your application. Each instruction adds a new layer to the image.

### 2. Common Instructions
- `FROM`: Sets the base image (e.g., `python:3.10-slim`).
- `WORKDIR`: Sets the working directory inside the container.
- `COPY`: Copies files from your local machine to the container.
- `RUN`: Executes commands (like `pip install`).
- `CMD`: Specifies the command to run when the container starts.

---

## Part B – Hands-On

### Task: Dockerize the Student API
1. Create a `Dockerfile` in your project root:
   ```dockerfile
   # 1. Base image
   FROM python:3.10-slim
   
   # 2. Set directory
   WORKDIR /app
   
   # 3. Copy dependencies
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   
   # 4. Copy app code
   COPY . .
   
   # 5. Run the app
   CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
   ```
2. Build and run:
   ```bash
   docker build -t student-api .
   docker run -p 8000:8000 student-api
   ```

---

## PBL Activity
*Hint: Remember to use a `.dockerignore` file to exclude your `venv` folder and local database files from being copied into the container.*

### Problem Scenario
You need to create a reproducible build of your Student API that can be deployed to any cloud server.

### Student Task
Create a `Dockerfile` for your API and verify it runs successfully using `docker run`.

---

## Assessment Activity
*Hint: Inspect the size of your image using `docker images` and try to make it smaller by choosing a lighter base image.*

### Evaluation Criteria
| Criterion | Expected Evidence |
|---|---|
| Dockerfile | Correct syntax and instructions |
| Build/Run | App is accessible via Docker at `localhost:8000` |
