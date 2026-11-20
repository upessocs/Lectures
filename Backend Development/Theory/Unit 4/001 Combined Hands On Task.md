# Tutorial: From Docker to Production — Containerizing a FastAPI App, Pushing to Docker Hub, and Monitoring & Scaling

This tutorial combines the theory of **monitoring and scaling backend applications** with the practical workflow of **containerizing a FastAPI app**, **pushing it to Docker Hub**, and **automating the build/push with GitHub Actions**.

We'll progress from the simplest manual workflow to a fully automated CI/CD pipeline, then layer on observability and scaling concepts.

---

## Table of Contents

1. **Part 1 — Theory: Why Monitoring and Scaling Matter**
2. **Part 2 — The FastAPI Application**
3. **Part 3 — Manual Docker Build and Push to Docker Hub**
4. **Part 4 — Automating Build & Push with GitHub Actions**
5. **Part 5 — Adding Structured Logging & Health Checks**
6. **Part 6 — Running Multiple Instances (Horizontal Scaling)**
7. **Part 7 — Load Balancing with Nginx**
8. **Part 8 — Verifying the Full CI/CD + Monitoring Flow**
9. **Part 9 — Troubleshooting Cheat Sheet**

[Demo Repository https://github.com/upessocs/fastapiDockerImageAction](https://github.com/upessocs/fastapiDockerImageAction)

<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;border-radius:12px">
  <iframe src="https://www.youtube-nocookie.com/embed/vCpj3W-yHes?modestbranding=1&amp;rel=0" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" title="YouTube video player" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
</div>
<p style="margin:4px 0 0;text-align:right;font-size:11px;opacity:0.6"><a href="https://www.freewebtools.com/youtube-embed-generator/" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">⚡ Enhanced by FreeWebTools</a></p>

---

# Part 1 — Theory: Why Monitoring and Scaling Matter

## 1.1 Continuous Delivery in One Picture

```
Developer → Git Push → CI Pipeline → Build → Test → Package → Ready to Deploy
```

In our case:

```
GitHub → GitHub Actions → Build Docker Image → Push to Docker Hub
```

Continuous **Delivery** means every push leaves the repo in a deployable state (deployment may be manual). Continuous **Deployment** goes one step further and auto-deploys to production.

## 1.2 Monitoring vs. Scaling — Two Sides of the Same Coin

- **Monitoring** answers: *"What is happening inside the application?"*
  - Logs — detailed events (`GET /students returned 200 in 18ms`)
  - Metrics — numbers over time (error rate, p95 latency, CPU)
  - Traces — a request's path across services
  - Health checks — is the service alive? (`GET /health`)
  - Alerts — notify when something is abnormal
- **Scaling** answers: *"How can the application handle more traffic?"*
  - **Vertical** — bigger machine (more CPU/RAM). Simple, but hit a ceiling.
  - **Horizontal** — more instances behind a load balancer. Better availability, but needs stateless design, shared sessions, and a scalable database.

> **Key idea:** Monitoring provides the *evidence* that drives scaling decisions. Don't scale blindly — measure first.

## 1.3 The Observability Mental Model

| Component | Records | Example |
|---|---|---|
| Logs | Discrete events | `method=GET path=/students status=200 duration_ms=18` |
| Metrics | Aggregated numbers | `p95 latency = 180ms`, `error rate = 2%` |
| Traces | Request path | `API → DB → payment service` |
| Health check | Liveness | `/health` → `{"status":"healthy"}` |
| Alert | Threshold breach | Error rate > 5% |

**Security rule:** never log passwords, tokens, full credit card numbers, or PII.

## 1.4 Scaling Dependencies (Why "just add containers" fails)

| Component | Bottleneck | Scaling approach |
|---|---|---|
| App server | CPU/worker saturation | Add instances |
| Database | Connection/query limits | Indexes, pooling, read replicas |
| Cache | Memory/throughput | Larger/clustered cache |
| File storage | Local container files vanish | Object storage or shared volume |
| Sessions | Stored in one instance's memory | Redis / DB / stateless JWT |
| Logs | Too much local output | Centralized log collection |

Keep this table in mind — it will resurface in Part 6.

---

# Part 2 — The FastAPI Application

We'll use a **Student API** because it will double as our monitoring target later.

## 2.1 Create the Repository

1. Create a new repo at <https://github.com/new> (private is fine, add a README).
2. Create the following structure:

```bash
.
├── .env                      # local-only; NOT committed
├── .gitignore
├── .github/workflows/ActionsYaml.yaml
├── README.md
├── Dockerfile
├── main.py
└── requirements.txt
```

## 2.2 `.env` (local only)

```env
DOCKERTOKEN=<token-generated-from-dockerhub>
```

## 2.3 `.gitignore`

```ini
.env
__pycache__/
*.pyc
```

> Commit `.gitignore` **before** creating `.env` so the token never enters git history.

## 2.4 `main.py`

```python
import logging
import time
from fastapi import FastAPI, Request

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)
logger = logging.getLogger("student-api")

app = FastAPI(title="Student API - FastAPI")

students = [
    {"id": 1, "name": "Aarav", "course": "Backend Development"},
    {"id": 2, "name": "Diya", "course": "Backend Development"},
]


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.perf_counter()
    try:
        response = await call_next(request)
        duration_ms = (time.perf_counter() - start) * 1000
        logger.info(
            "method=%s path=%s status=%s duration_ms=%.2f",
            request.method, request.url.path, response.status_code, duration_ms,
        )
        return response
    except Exception:
        duration_ms = (time.perf_counter() - start) * 1000
        logger.exception(
            "method=%s path=%s status=500 duration_ms=%.2f",
            request.method, request.url.path, duration_ms,
        )
        raise


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

> We already baked in the monitoring middleware from Part 1 — no extra work later.

## 2.5 `requirements.txt`

```txt
fastapi
uvicorn
```

## 2.6 `Dockerfile`

```Dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

> The lecture note used `FROM ubuntu` + `pipenv`. A `python:3.12-slim` base + `pip` is smaller, faster, and more reproducible. We'll stick with it here.

## 2.7 Commit and Push

```bash
git add .
git commit -m "Initial FastAPI student API"
git push origin main
```

---

# Part 3 — Manual Docker Build and Push to Docker Hub

This is the **baseline**. Understand it before automating it.

## 3.1 Create a Docker Hub Access Token

1. Go to <https://hub.docker.com/>
2. **Account Settings → Security → Access Tokens → New Access Token**
3. Copy the token (you'll only see it once). This is your `DOCKERTOKEN`.

## 3.2 Log In Manually (from your terminal / WSL)

```bash
# Using the token you generated:
echo "<your-docker-token>" | docker login -u "<your_docker_username>" --password-stdin
```

Expected:

```
Login Succeeded
```

> Never run `docker login -p <token>` — it leaks the token into shell history. Always use `--password-stdin`.

## 3.3 Build the Image

```bash
docker build -t <your_docker_username>/fastapi-app:v0.1 .
```

## 3.4 Test It Locally Before Pushing

```bash
docker run --rm -p 8000:8000 <your_docker_username>/fastapi-app:v0.1
```

In another terminal:

```bash
curl http://localhost:8000/health
curl http://localhost:8000/students
```

Expected:

```json
{"status":"healthy"}
[{"id":1,"name":"Aarav","course":"Backend Development"}, ...]
```

## 3.5 Push to Docker Hub

```bash
docker push <your_docker_username>/fastapi-app:v0.1
```

Verify at `https://hub.docker.com/r/<your_docker_username>/fastapi-app` — the tag should appear with a fresh timestamp.

## 3.6 What You Just Proved

- The Dockerfile builds reproducibly.
- The image runs and serves traffic.
- Your token authenticates against Docker Hub.

**All of this is the exact work GitHub Actions will now automate.**

---

# Part 4 — Automating Build & Push with GitHub Actions

## 4.1 How GitHub Actions Works (Quick Recap)

| Concept | Meaning | In our workflow |
|---|---|---|
| Workflow | YAML in `.github/workflows/*.yml` | `ActionsYaml.yaml` |
| Event trigger | When it runs | `on: push` |
| Job | A unit of work on a runner | `build` |
| Runner | VM that executes the job | `ubuntu-latest` |
| Step | A single command or `uses:` action | checkout, login, build, push |

Execution flow on push:
1. GitHub detects `push`
2. Reads the workflow file
3. Spins up a runner VM
4. Runs: checkout → login → build → push

## 4.2 Store the Token as a GitHub Secret

Go to:

```
https://github.com/<username>/<repo>/settings/secrets/actions
```

Add:

- **Name:** `DOCKERTOKEN`
- **Value:** the token from 3.1

Optionally also add `DOCKERUSERNAME` for cleanliness.

## 4.3 The Workflow File

Create `.github/workflows/ActionsYaml.yaml`:

```yaml
name: Docker image build

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Login to DockerHub
        run: |
          echo "${{ secrets.DOCKERTOKEN }}" | docker login -u "${{ secrets.DOCKERUSERNAME }}" --password-stdin

      - name: Build Docker Image
        run: |
          docker build -t ${{ secrets.DOCKERUSERNAME }}/fastapi-app:v0.1 .

      - name: Push Docker Image
        run: |
          docker push ${{ secrets.DOCKERUSERNAME }}/fastapi-app:v0.1
```

> The lecture example used `actions/checkout@v1`; `@v4` is current. The lecture also hard-coded the username — using a secret keeps the file portable.

## 4.4 Trigger the Pipeline

```bash
git add .github/workflows/ActionsYaml.yaml
git commit -m "Add CI workflow"
git push
```

Then go to your repo's **Actions** tab. You should see a run named *"Docker image build"*.

**Expected result:**

```
Build → Success
Push → Success
```

## 4.5 Verify on Docker Hub

Open `https://hub.docker.com/r/<your_docker_username>/fastapi-app` — the `v0.1` tag timestamp should match the run.

## 4.6 Pull the CI-Built Image Locally

```bash
docker pull <your_docker_username>/fastapi-app:v0.1
docker run --rm -p 8000:8000 <your_docker_username>/fastapi-app:v0.1
curl http://localhost:8000/health
```

If the health check responds, the *entire* path — code → git → Actions → Docker Hub → local pull → running container — has been proven.

---

# Part 5 — Structured Logging & Health Checks in Action

Your `main.py` already emits structured request logs and exposes `/health`. Now let's use them.

## 5.1 Generate Traffic

```bash
# Linux/macOS
for i in {1..20}; do curl -s http://localhost:8000/health > /dev/null; done
```

```powershell
# Windows PowerShell
1..20 | ForEach-Object { Invoke-WebRequest http://localhost:8000/health | Out-Null }
```

> This is **not** a load test — just controlled traffic to make logs observable.

## 5.2 Read the Logs

```bash
docker logs -f <container-id>
```

You should see structured entries like:

```
2025-01-01T10:15:20Z INFO method=GET path=/health status=200 duration_ms=3.41
2025-01-01T10:15:20Z INFO method=GET path=/health status=200 duration_ms=2.87
...
```

## 5.3 Measure Response Time

```bash
time curl -s http://localhost:8000/students
```

Or with ApacheBench (local/authorized servers only!):

```bash
ab -n 100 -c 5 http://localhost:8000/health
```

**How to interpret results:**

| Observation | Likely cause |
|---|---|
| High latency, low traffic | Slow code / DB / external dep |
| Latency rises with concurrency | Worker saturation |
| Many 5xx | App or dependency failure |
| High CPU | CPU-bound work / too many requests |
| High memory | Leak / large responses |
| Container restarts | Crash / health-check failure |

> p95 latency = 95% of requests are faster than that value. It describes user experience far better than the average.

**At this point you have Part 1's monitoring theory running in a container.** Next, we scale.

---

# Part 6 — Running Multiple Instances (Horizontal Scaling)

## 6.1 Why We Can Scale Horizontally Here

The Student API is **stateless** — no session data, no local files. That is precisely what makes horizontal scaling safe. (If you *did* store sessions in memory, users would randomly "lose" state when the load balancer hit a different instance — see 6.4.)

## 6.2 Run Two Containers

```bash
docker run -d --name fastapi-1 -p 8001:8000 <your_docker_username>/fastapi-app:v0.1
docker run -d --name fastapi-2 -p 8002:8000 <your_docker_username>/fastapi-app:v0.1
```

Test both:

```bash
curl http://localhost:8001/health
curl http://localhost:8002/health
```

Inspect:

```bash
docker ps
docker logs fastapi-1
docker logs fastapi-2
```

> The host exposes 8001/8002; both containers listen on 8000 internally. This gives you **multiple instances** but **no load balancing yet** — requests are distributed only because you manually pick the port.

## 6.3 Observe Distribution Manually

```bash
for i in {1..10}; do
  curl -s http://localhost:8001/health > /dev/null
  curl -s http://localhost:8002/health > /dev/null
done
docker logs fastapi-1
docker logs fastapi-2
```

Each container logs its own requests — cleanly separated.

## 6.4 The Stateless Warning

If `main.py` stored, say, `users_sessions = {}` in module scope, an instance behind a load balancer would "forget" a user mid-session. The fix is a shared store:

```
API instances → Redis or database
```

JWT-based auth reduces server-side session dependence, but expiry, revocation, and secret management still need design.

## 6.5 Scaling Dependencies — Revisited

Adding containers often just shifts the bottleneck:

| Component | New bottleneck | Approach |
|---|---|---|
| Database | Too many connections | Pooling, indexes, read replicas |
| Cache | Throughput | Cluster the cache |
| Sessions | Lost across instances | Redis / JWT |
| Logs | Too much local output | Centralized collection |

**Monitor, then scale — not the reverse.**

---

# Part 7 — Load Balancing with Nginx

## 7.1 The Role of a Load Balancer

```
                    ┌── API instance 1
Client → Load balancer ├── API instance 2
                    └── API instance 3
```

The LB picks an instance automatically — no manual port selection.

## 7.2 `nginx.conf`

```nginx
events {}

http {
    upstream student_api {
        server host.docker.internal:8001;
        server host.docker.internal:8002;
    }

    server {
        listen 8080;

        location / {
            proxy_pass http://student_api;
        }
    }
}
```

## 7.3 Run It

```bash
docker run -d --name student-lb \
  -p 8080:8080 \
  -v "$(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro" \
  nginx:alpine
```

## 7.4 Test

```bash
curl http://localhost:8080/health
for i in {1..10}; do curl -s http://localhost:8080/health > /dev/null; done
```

Compare `docker logs fastapi-1` and `docker logs fastapi-2` — requests should be split between them.

> **Platform note:** `host.docker.internal` works out of the box on Docker Desktop. On Linux Docker Engine, either use the host gateway or put all services on a shared user-defined network and refer to them by container name.
>
> **Production note:** real load balancers add health checks, timeouts, TLS termination, access logs, and failure handling. This demo is the *idea*.

## 7.5 Clean Up

```bash
docker stop fastapi-1 fastapi-2 student-lb
docker rm   fastapi-1 fastapi-2 student-lb
```

---

# Part 8 — Verifying the Full CI/CD + Monitoring Flow

This is the end-to-end verification that the whole pipeline works.

## 8.1 Make a Visible Code Change

Edit `main.py` — add your SAP ID (or any marker):

```python
@app.get("/")
def root():
    return {
        "application": "Student API",
        "framework": "FastAPI",
        "status": "running",
        "sapid": "YOUR_SAP_ID",
        "location": "Dehradun",
    }
```

## 8.2 Commit and Push

```bash
git add main.py
git commit -m "Added SAP ID for CI/CD verification"
git push
```

## 8.3 Watch GitHub Actions

Repository → **Actions** tab → open the latest run:

- OK Workflow triggered on push
- OK Build step succeeded
- OK Push step succeeded

## 8.4 Verify the Image on Docker Hub

The `v0.1` tag's timestamp should reflect the new push.

## 8.5 Pull and Run the Updated Image

```bash
docker pull <your_docker_username>/fastapi-app:v0.1
docker run --rm -p 8080:8000 <your_docker_username>/fastapi-app:v0.1
```

## 8.6 Validate the Output

```bash
curl http://localhost:8080/
```

```json
{
  "application": "Student API",
  "framework": "FastAPI",
  "status": "running",
  "sapid": "YOUR_SAP_ID",
  "location": "Dehradun"
}
```

## 8.7 What This Confirms

| Check | Verified |
|---|---|
| Code change detected | OK |
| GitHub Actions triggered | OK |
| Docker image rebuilt | OK |
| Image pushed with token from secrets | OK |
| Latest container reflects change | OK |
| `/health` returns 200 | OK |
| Structured request logs emitted | OK |
| Two instances serve independently | OK |
| Load balancer splits traffic | OK |

**Final pipeline:**

```
Code Change → Git Push → GitHub Actions → Docker Build → Docker Push
    → Local Pull/Run → Health Check OK → Logs OK → Scaled OK
```

---

# Part 9 — Troubleshooting Cheat Sheet

## CI/CD

| Symptom | Cause | Fix |
|---|---|---|
| Action fails at login | Bad/missing `DOCKERTOKEN` | Re-create token, re-add secret |
| Action fails at build | Dockerfile syntax / missing file | Check build logs in Actions tab |
| Push says "denied" | Wrong username in workflow | Use `DOCKERUSERNAME` secret |
| `.env` appears in git | Committed before `.gitignore` | `git rm --cached .env`, rotate token |

## Runtime

| Symptom | Cause | Fix |
|---|---|---|
| No logs appear | Container not running / no traffic | `docker ps`, then curl an endpoint |
| Logs contain secrets | Logging sensitive fields | Mask/remove them |
| Second instance won't start | Host port in use | Pick another host port |
| LB returns 502 | Backend unreachable / wrong port | Check upstream + `docker logs` |
| User state disappears | In-memory session in one instance | Redis / DB / stateless JWT |
| More instances overload DB | Too many connections | Pooling, indexes, caching, DB scaling |
| Container keeps restarting | Crash or health-check failure | `docker logs`, inspect status |

## Debugging Order (memorize this)

1. `docker ps -a` — is it running?
2. `docker logs <container>` — any errors?
3. Hit `/health` directly.
4. Hit the API **without** the load balancer.
5. Check host↔container port mapping.
6. Compare response time and error status.
7. Inspect CPU/memory usage.
8. Check DB and external dependencies.
9. Reproduce with a small, controlled request load.

---

## Summary Table

| Layer | Manual (Part 3) | Automated (Part 4+) |
|---|---|---|
| Auth | `docker login --password-stdin` | GitHub secret + same command |
| Build | `docker build -t ... .` | Workflow step |
| Push | `docker push ...` | Workflow step |
| Verify | `docker pull`, `curl` | Actions tab + `docker pull` |
| Monitoring | `docker logs -f` | Same — but now structured |
| Scaling | Run multiple `docker run` | Same, with image from registry |
| Load balancing | Nginx config | Same, feeding instances from CI images |

**Mental model to walk away with:**

> **Monitoring gives you evidence. Scaling changes capacity. CI/CD keeps capacity consistent with the code.** All three meet at the same artifact — the Docker image — which GitHub Actions builds once and Docker Hub distributes everywhere.


---

# PBL

1. Replace main soruce with any previous project like todo/notes/blog/cms or student management app designed using express fastapi or django.
2. Containerize this app using Dockerfile
3. Add docker-compose.yml to run this service [Read more about docker compose](https://upessocs.github.io/#d=/Lectures/Backend%20Development/Theory/Unit%204/Docker%20Handson/&f=5%20Docker%20Compose%20vs%20Docker%20Run.md)
4. Create automationTesting.py to test all routes [Read more on test automation](https://upessocs.github.io/#d=/Lectures/Backend%20Development/Theory/Unit%204/&f=L44-L45%20Github%20Actions%20Test%20Automation%20Backend%20API%20testing.md). 
5. Create github action in to test code (automationTesting) and then build and push image to docker hub

> remember to use new repository to test github-actions

In your main Backend Development repository add link to this repository as `PBL Assignment`