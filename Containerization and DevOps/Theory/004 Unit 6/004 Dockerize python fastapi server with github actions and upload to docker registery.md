# Task:  Dockerize python fastapi server with github actions and upload to docker registery

---

# Continuous Delivery with GitHub Actions

## What is Continuous Delivery (CD)

**Continuous Delivery (CD)** is a DevOps practice where code changes are:

1. **Automatically built**
2. **Automatically tested**
3. **Automatically prepared for release**

The key idea:

> Every change pushed to the repository is always in a deployable state.

### Difference from Continuous Deployment

| Concept               | Meaning                                               |
| --------------------- | ----------------------------------------------------- |
| Continuous Delivery   | Code is ready to deploy, but deployment may be manual |
| Continuous Deployment | Code is automatically deployed to production          |

### Flow of Continuous Delivery

```
Developer → Git Push → CI Pipeline → Build → Test → Package → Ready to Deploy
```

In our case:

```
GitHub → GitHub Actions → Build Docker Image → Push to Docker Hub
```

---

## How GitHub Actions Works

**GitHub Actions** is a CI/CD tool built into GitHub that allows automation using workflows.

### Core Concepts

#### 1. Workflow

* Defined in `.github/workflows/*.yml`
* Describes automation steps

#### 2. Event Trigger

* Defines **when workflow runs**

```yaml
on: push
```

#### 3. Job

* A set of steps running on a machine

```yaml
jobs:
  build:
```

#### 4. Runner

* Machine where job runs

```yaml
runs-on: ubuntu-latest
```

#### 5. Steps

* Individual commands or actions

```yaml
steps:
  - uses: actions/checkout@v1
```

---

### Execution Flow

When you push code:

1. GitHub detects event (`push`)
2. Workflow file is read
3. Runner (VM) is created
4. Steps are executed:

   * Clone repo
   * Login to Docker
   * Build image
   * Push image

---

## Hands-On: Dockerizing FastAPI + GitHub Actions

---

## Step 1: FastAPI Application

### `main.py`

```python
from fastapi import FastAPI
app = FastAPI()
import uvicorn

@app.get("/")
def read_root():
    return dict(name="Prateek", Location="Dehradun")

@app.get("/{data}")
def read_data(data):
    return dict(hi=data, Location="Dehradun")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=80, reload=True)
```

---

## Step 2: Requirements

### `requirements.txt`

```txt
fastapi
uvicorn
```

---

## Step 3: Dockerfile

```Dockerfile
FROM ubuntu

RUN apt update -y
RUN apt install python3 python3-pip pipenv -y

WORKDIR /app
COPY . /app/

RUN pipenv install -r requirements.txt

EXPOSE 80

CMD pipenv run python3 ./main.py
```

---

## Step 4: GitHub Actions Workflow

### `.github/workflows/DockerBuild.yml`

```yaml
name: Docker image build

on: push

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v1

      - name: Login to DockerHub
        run: |
          echo ${{ secrets.DOCKERTOKEN }} | docker login -u "your_docker_username" --password-stdin

      - name: Build Docker Image
        run: |
          docker build -t your_docker_username/fastapi-app:v0.1 .

      - name: Push Docker Image
        run: |
          docker push your_docker_username/fastapi-app:v0.1
```

---

## Step 5: Create Docker Token

1. Go to: [https://hub.docker.com/](https://hub.docker.com/)
2. Account Settings → Security → Access Tokens
3. Generate token
4. Copy it

---

## Step 6: Add Secret in GitHub

Go to:

```
https://github.com/<username>/<repo>/settings/secrets/actions
```

Add:

```
Name: DOCKERTOKEN
Value: <your token>
```

---

## Final Flow (What Happens Now)

```
You push code → GitHub Actions triggers → 
Docker image builds → Image pushed to Docker Hub
```

---

## Optional: Test Locally (WSL Docker)

Since you're using WSL with docker:

```bash
docker build -t fastapi-app .
docker run -p 80:80 fastapi-app
```

Open:

```
http://localhost
```

---

## Summary

| Step           | Purpose                |
| -------------- | ---------------------- |
| FastAPI App    | Backend API            |
| Dockerfile     | Containerize app       |
| GitHub Actions | Automate build & push  |
| Docker Token   | Secure authentication  |
| Secret         | Safe storage in GitHub |

---










# Step 2 
## Verification Task: Validate Full CI/CD Flow

This task ensures that:

* GitHub Actions is working correctly
* Docker image is updated on Docker Hub
* Latest changes are reflected when running the container

---

## Task 1: Modify Application Response

Update your FastAPI response to include your **SAP ID**.

### Update `main.py`

```python
@app.get("/")
def read_root():
    return dict(
        name="Your Name",
        sapid="YOUR_SAP_ID",
        Location="Dehradun"
    )
```

---

## Task 2: Commit and Push Changes

```bash
git add .
git commit -m "Added SAP ID for CI/CD verification"
git push
```

---

## Task 3: Verify GitHub Actions Execution

1. Go to your repository
2. Navigate to **Actions tab**
3. Open latest workflow run

Check:

* Workflow triggered on push
* Build step executed
* Docker image pushed successfully

Expected result:

```text
Build → Success
Push → Success
```

---

## Task 4: Verify Updated Image on Docker Hub

Go to your Docker Hub repository and confirm:

* Latest tag (e.g., `v0.1`) is updated
* Timestamp reflects recent push

---

## Task 5: Run Updated Docker Image Locally

Pull and run the latest image:

```bash
docker run --rm -p 8080:80 your_docker_username/fastapi-app:v0.1
```

---

## Task 6: Validate Output

Open browser:

```text
http://localhost:8080
```

Expected response:

```json
{
  "name": "Your Name",
  "sapid": "YOUR_SAP_ID",
  "Location": "Dehradun"
}
```

---

## What This Confirms

| Check                            | Verified |
| -------------------------------- | -------- |
| Code change detected             | Yes      |
| GitHub Actions triggered         | Yes      |
| Docker image rebuilt             | Yes      |
| Image pushed to registry         | Yes      |
| Latest container reflects change | Yes      |

---

## Common Issues & Fixes

### Image not updated

* Ensure tag is same (`v0.1`)
* Or use new tag:

```bash
docker build -t username/app:v0.2 .
```

### Old container running

* Use `--rm` flag (already used)
* Ensure no cached container:

```bash
docker ps -a
```

### GitHub Action failed

* Check logs in Actions tab
* Verify `DOCKERTOKEN` secret

---

## Final Outcome

You have now validated a complete pipeline:

```text
Code Change → Git Push → GitHub Actions → Docker Build → Docker Push → Local Run → Verified Output
```

