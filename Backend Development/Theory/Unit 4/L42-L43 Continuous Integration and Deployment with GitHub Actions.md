# Lectures 42–43

# Continuous Integration and Continuous Deployment with GitHub Actions

**Course Outcome:** CO4 – Apply security best practices and conduct testing; CO5 – Demonstrate effective team collaboration skills.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture Nos. | 42–43 |
| Unit | Unit 4: Deployment and DevOps |
| Topic | Continuous Integration, Continuous Deployment, pipelines, and automation |
| Course Outcome | CO4, CO5 |
| Bloom's Knowledge Level | Apply, Analyze, Create |
| Skills Developed | Git workflows, automated testing, Docker image builds, GitHub Actions YAML, secrets management, registry publishing, deployment automation, and failure analysis |
| Applications | Reliable team development, reproducible releases, cloud deployment, VPS deployment, and rapid software delivery |
| PBL Activity | Build a CI/CD pipeline that tests and publishes the containerized FastAPI and Express Student APIs |
| Assessment Method | GitHub Actions implementation, coding task, pipeline demonstration, and viva |

> **Lecture flow:** CI verifies that a change is healthy. CD moves a verified change toward a staging or production environment. Docker provides the repeatable package that is tested and deployed.

---

## Learning Objectives

By the end of these lectures, students should be able to:

1. Explain the difference between Continuous Integration, Continuous Delivery, and Continuous Deployment.
2. Create a GitHub Actions workflow that runs tests on pull requests and pushes.
3. Test FastAPI and Express applications automatically.
4. Build Docker images inside a GitHub Actions runner.
5. Publish images to GitHub Container Registry or another registry.
6. Use environments, variables, and secrets safely.
7. Design a deployment pipeline with approval, rollback, and failure handling.
8. Diagnose a failed workflow using logs and local reproduction.

---

# Part A – Why CI/CD Is Required

## 1. The Manual Delivery Problem

Without automation, a developer may need to:

1. Pull the latest code.
2. Install dependencies.
3. Run tests manually.
4. Build a Docker image.
5. Log in to a registry.
6. Push the image.
7. Connect to a server.
8. Pull the new image.
9. Stop the old container.
10. Start the new container.
11. Check whether the service works.

Manual steps are slow and error-prone. A forgotten test, wrong tag, incorrect environment variable, or wrong server command can cause a failed release.

## 2. Continuous Integration

**Continuous Integration (CI)** means integrating small code changes frequently and automatically validating them.

A CI pipeline normally performs:

```text
Checkout → Install dependencies → Lint → Unit tests → Build validation
```

If a step fails, the workflow reports failure. The team fixes the problem before merging or releasing the change.

**Comment:** CI is not just “running a YAML file.” It is a development practice: small changes, version control, automated checks, and quick feedback.

## 3. Continuous Delivery and Continuous Deployment

| Practice | Meaning | Release decision |
|---|---|---|
| Continuous Integration | Automatically validate code changes | Code is tested |
| Continuous Delivery | Keep a tested build ready for release | Human may approve production |
| Continuous Deployment | Automatically release every change that passes all checks | System releases automatically |

A simple distinction is:

- **CI:** Is the code healthy?
- **Continuous Delivery:** Is the build ready to release?
- **Continuous Deployment:** Has the approved build been released automatically?

## 4. Pipeline Stages

A practical pipeline for the Student API is:

```text
Pull request
    ↓
Checkout
    ↓
Install dependencies
    ↓
Run tests and lint checks
    ↓
Build Docker images
    ↓
Publish images to registry
    ↓
Deploy to staging
    ↓
Health check
    ↓
Production approval or deployment
```

Each stage should have one clear responsibility.

---

# Part B – Repository Structure

## 5. Recommended Project Structure

The following structure supports both examples:

```text
student-api/
├── fastapi-app/
│   ├── main.py
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   ├── Dockerfile
│   └── test_main.py
├── express-app/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   └── test/
│       └── server.test.js
└── .github/
    └── workflows/
        ├── ci.yml
        └── cd.yml
```

**Comment:** The tests are kept with the application code. Workflow files must be stored in `.github/workflows/`.

## 6. Branch and Pull Request Workflow

A team can use:

```text
feature branch → Pull request → CI checks → Code review → main branch
```

Recommended rules:

- Do not commit directly to `main` for team projects.
- Require the CI check to pass before merging.
- Use meaningful commit messages.
- Keep pull requests small enough to review.
- Review workflow changes carefully because workflows can access secrets.

---

# Part C – Create Automated Tests

## 7. FastAPI Test

Install development dependencies in `fastapi-app/requirements-dev.txt`:

```text
-r requirements.txt
pytest==8.3.4
httpx==0.28.1
```

Create `fastapi-app/test_main.py`:

```python
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["framework"] == "FastAPI"


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_students():
    response = client.get("/students")
    assert response.status_code == 200
    assert len(response.json()) >= 1
```

Run locally:

```bash
cd fastapi-app
python -m pip install -r requirements-dev.txt
pytest -q
```

**Comment:** The tests call the application through a test client. They do not require a public server or production database for this simple example.

## 8. Express Test

Install test dependencies:

```bash
cd express-app
npm install
npm install --save-dev jest supertest
```

Update `express-app/package.json`:

```json
{
  "name": "student-api-express",
  "version": "1.0.0",
  "private": true,
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "test": "jest --runInBand"
  },
  "dependencies": {
    "express": "^4.21.2"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^7.0.0"
  }
}
```

Export the Express application separately from the server startup in `server.js`:

```javascript
// Keep the routes and middleware above this point.

if (require.main === module) {
  app.listen(port, "0.0.0.0", () => {
    console.log("Express API listening on port " + port);
  });
}

module.exports = app;
```

Create `express-app/test/server.test.js`:

```javascript
const request = require("supertest");
const app = require("../server");

describe("Student API", () => {
  test("GET / returns application information", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.body.framework).toBe("Express");
  });

  test("GET /health returns healthy", async () => {
    const response = await request(app).get("/health");
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("healthy");
  });

  test("GET /students returns an array", async () => {
    const response = await request(app).get("/students");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

Run locally:

```bash
npm test
```

**Comment:** Exporting `app` allows the test runner to create an in-memory HTTP request. The server listens on a real port only when the file is executed directly.

---

# Part D – Continuous Integration with GitHub Actions

## 9. Basic CI Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: Student API CI

on:
  pull_request:
  push:
    branches:
      - main
      - "feature/**"

permissions:
  contents: read

jobs:
  test-fastapi:
    name: Test FastAPI
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: fastapi-app

    steps:
      - name: Checkout repository
        uses: actions/checkout@v6

      - name: Set up Python
        uses: actions/setup-python@v6
        with:
          python-version: "3.12"
          cache: pip
          cache-dependency-path: fastapi-app/requirements-dev.txt

      - name: Install dependencies
        run: python -m pip install -r requirements-dev.txt

      - name: Run tests
        run: pytest -q

  test-express:
    name: Test Express
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: express-app

    steps:
      - name: Checkout repository
        uses: actions/checkout@v6

      - name: Set up Node.js
        uses: actions/setup-node@v6
        with:
          node-version: "22"
          cache: npm
          cache-dependency-path: express-app/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test
```

**Explanation:**

- `on` defines the events that trigger the workflow.
- `pull_request` checks proposed changes before merging.
- `push` checks changes pushed to selected branches.
- Separate jobs test FastAPI and Express independently.
- `working-directory` keeps commands inside the correct application folder.
- `permissions: contents: read` follows least privilege for this CI-only workflow.
- `npm ci` installs from the lock file for reproducible builds.
- Python and npm caching can reduce repeated installation time.

## 10. Run CI Locally Before Pushing

FastAPI:

```bash
cd fastapi-app
python -m pip install -r requirements-dev.txt
pytest -q
```

Express:

```bash
cd express-app
npm ci
npm test
```

Then commit and push:

```bash
git add .
git commit -m "Add CI tests for Student APIs"
git push origin feature/student-api-ci
```

Open the repository's **Actions** tab to inspect the workflow.

## 11. Intentionally Test a Failure

Change an expected value temporarily:

```python
assert response.json()["framework"] == "WrongFramework"
```

Push the change and observe that the workflow fails. Restore the correct assertion and push again.

**Learning point:** A failed CI run is useful feedback. It prevents a known-broken change from being treated as ready.

## 12. Add Docker Build Validation to CI

After the test jobs, add a build job:

```yaml
  build-images:
    name: Build Docker Images
    needs:
      - test-fastapi
      - test-express
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v6

      - name: Build FastAPI image
        run: docker build -t student-api-fastapi:ci ./fastapi-app

      - name: Build Express image
        run: docker build -t student-api-express:ci ./express-app
```

**Comment:** `needs` ensures Docker images are built only after both application test jobs pass. This prevents publishing an image from code that has already failed automated tests.

## 13. Test the Built Containers in CI

The build job can start the images and call their health endpoints:

```yaml
      - name: Start FastAPI container
        run: docker run -d --name fastapi-ci -p 8000:8000 student-api-fastapi:ci

      - name: Start Express container
        run: docker run -d --name express-ci -p 3000:3000 student-api-express:ci

      - name: Test container health endpoints
        run: |
          curl --fail http://localhost:8000/health
          curl --fail http://localhost:3000/health

      - name: Show container logs after tests
        if: always()
        run: |
          docker logs fastapi-ci || true
          docker logs express-ci || true
```

**Explanation:** Application tests verify code behavior. Container smoke tests verify that the Docker image starts and responds through its published port.

---

# Part E – Continuous Deployment with GitHub Actions

## 14. CD Pipeline Design

A safe CD pipeline separates validation from release:

```text
CI tests → Docker build → Image registry → Staging deployment
                                      ↓
                                  Health check
                                      ↓
                              Production deployment
```

The deployment target may be:

- A PaaS connected to GitHub
- A VPS running Docker Compose
- A cloud container service
- A Kubernetes cluster
- A self-hosted server

The first practical exercise publishes images to GitHub Container Registry. Deployment can then consume those immutable image tags.

## 15. Image Tags

Avoid relying only on `latest`. Prefer tags that identify the source revision:

```text
ghcr.io/OWNER/REPOSITORY/fastapi:sha-abc1234
ghcr.io/OWNER/REPOSITORY/express:sha-abc1234
```

Useful tags include:

- Commit SHA: precise and immutable
- Release version: easy for humans to understand
- Branch tag: useful for staging, but can move over time
- `latest`: convenient but ambiguous

**Comment:** A deployment should record the exact image tag it uses so a previous version can be restored.

## 16. Publish Images to GitHub Container Registry

Create `.github/workflows/cd.yml`:

```yaml
name: Build and Publish Images

on:
  push:
    branches:
      - main
  workflow_dispatch:

env:
  REGISTRY: ghcr.io
  IMAGE_PREFIX: ghcr.io/${{ github.repository_owner }}/student-api

permissions:
  contents: read
  packages: write

jobs:
  publish:
    name: Publish Docker Images
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v6

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build and push FastAPI image
        uses: docker/build-push-action@v6
        with:
          context: ./fastapi-app
          push: true
          tags: |
            ${{ env.IMAGE_PREFIX }}/fastapi:sha-${{ github.sha }}
            ${{ env.IMAGE_PREFIX }}/fastapi:main

      - name: Build and push Express image
        uses: docker/build-push-action@v6
        with:
          context: ./express-app
          push: true
          tags: |
            ${{ env.IMAGE_PREFIX }}/express:sha-${{ github.sha }}
            ${{ env.IMAGE_PREFIX }}/express:main
```

**Explanation:**

- The workflow runs after a push to `main` or manually through `workflow_dispatch`.
- `packages: write` permits the workflow token to publish packages.
- `docker/login-action` authenticates with GHCR.
- `docker/build-push-action` builds and publishes an image.
- The commit SHA tag identifies the exact source revision.
- The `main` tag is convenient for a staging environment but should not be the only record of a release.

**Security comment:** Use the automatically provided `GITHUB_TOKEN` where possible. Do not print tokens or write registry passwords directly in YAML.

## 17. Registry Verification

After the workflow succeeds:

```bash
docker pull ghcr.io/OWNER/student-api/fastapi:sha-COMMIT_SHA
docker pull ghcr.io/OWNER/student-api/express:sha-COMMIT_SHA
```

Run the published images:

```bash
docker run --rm -p 8000:8000 ghcr.io/OWNER/student-api/fastapi:sha-COMMIT_SHA
docker run --rm -p 3000:3000 ghcr.io/OWNER/student-api/express:sha-COMMIT_SHA
```

Test:

```bash
curl http://localhost:8000/health
curl http://localhost:3000/health
```

Replace `OWNER` and `COMMIT_SHA` with the actual repository owner and commit value.

---

# Part F – Deployment to a VPS

## 18. Simple VPS Deployment Model

A VPS can pull the published image and restart a service:

```text
GitHub Actions → GHCR → VPS → Docker container
```

A simplified deployment script on the VPS might be:

```bash
#!/usr/bin/env bash
set -euo pipefail

IMAGE_TAG="$1"

docker pull "ghcr.io/OWNER/student-api/fastapi:$IMAGE_TAG"

docker stop student-api || true
docker rm student-api || true

docker run -d   --name student-api   --restart unless-stopped   -p 8000:8000   "ghcr.io/OWNER/student-api/fastapi:$IMAGE_TAG"

curl --fail http://localhost:8000/health
```

**Comment:** This is an instructional deployment model. A production VPS should additionally use a non-root deployment user, firewall rules, HTTPS, secure registry authentication, backups, monitoring, and a controlled rollback process.

## 19. Triggering VPS Deployment

A GitHub Actions deployment job may connect using a protected deployment mechanism. Do not place a private SSH key in the repository.

Conceptual workflow:

```yaml
  deploy-staging:
    name: Deploy to Staging
    needs: publish
    runs-on: ubuntu-latest
    environment: staging

    steps:
      - name: Deploy selected image
        run: |
          echo "Deploy image tagged with commit ${{ github.sha }}"
          echo "Use a protected SSH or cloud deployment action here"
```

For a real implementation, configure:

- A GitHub **staging environment**
- Environment-specific variables and secrets
- An approved deployment method
- A health-check URL
- A rollback command
- Optional required reviewers for production

## 20. PaaS Auto-Deployment Alternative

A PaaS such as Render or Railway can be connected to a GitHub repository. A push to the selected branch can trigger:

```text
GitHub push → PaaS build → dependency installation → deployment → health check
```

This is easier for beginners because the platform manages the server. However, students should still understand what happens behind the button: source checkout, build, configuration, process startup, logs, and health verification.

---

# Part G – Environments, Secrets, and Approvals

## 21. Development, Staging, and Production

| Environment | Purpose | Deployment trigger |
|---|---|---|
| Development | Local coding and debugging | Manual |
| CI | Automated validation | Pull request or push |
| Staging | Production-like verification | Successful main-branch build |
| Production | End-user service | Approval, release tag, or automatic policy |

A production deployment should not use development credentials or an unverified branch tag.

## 22. GitHub Secrets

Secrets may include:

- Registry access tokens
- VPS SSH keys
- Cloud provider credentials
- Database passwords
- Application signing keys
- External API keys

Use them through the `secrets` context:

```yaml
env:
  DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
```

**Security rules:**

- Never commit secrets to Git.
- Never echo secrets in workflow logs.
- Use the smallest required permission.
- Prefer short-lived or identity-based cloud authentication where available.
- Separate staging and production secrets.
- Review pull requests that modify workflows.
- Be cautious with workflows triggered by untrusted forks.

---

# Part H – Release, Health Checks, and Rollback

## 23. Deployment Verification

A deployment is not complete merely because the command succeeded. Verify:

```bash
curl --fail https://staging.example.com/health
curl --fail https://staging.example.com/students
```

Also check:

- Container status
- Application logs
- HTTP status codes
- Response time
- Database connectivity
- Error rate
- Important user flows

## 24. Failure Handling

Possible failure points:

| Stage | Example failure | Action |
|---|---|---|
| Checkout | Wrong branch or permissions | Check repository and token access |
| Install | Dependency conflict | Reproduce locally and pin versions |
| Test | Assertion failure | Fix code or test |
| Docker build | Missing file or invalid Dockerfile | Check build context and logs |
| Registry push | Insufficient permissions | Check package permission and token |
| Deployment | Server unavailable | Check SSH, firewall, and server status |
| Health check | App starts but endpoint fails | Inspect logs and configuration |
| Runtime | Database or secret error | Verify environment configuration |

## 25. Rollback

Rollback means returning to a previously known-good image or release.

Because the image is tagged with a commit SHA, rollback can use an earlier tag:

```bash
docker pull ghcr.io/OWNER/student-api/fastapi:sha-PREVIOUS_GOOD_SHA
docker stop student-api
docker rm student-api
docker run -d   --name student-api   --restart unless-stopped   -p 8000:8000   ghcr.io/OWNER/student-api/fastapi:sha-PREVIOUS_GOOD_SHA
curl --fail http://localhost:8000/health
```

**Comment:** Rollback is easier when images are immutable, configuration is documented, database migrations are backward-compatible, and the previous version remains available.

---

# Part I – Required Hands-On Activity

## 26. Practical Problem Statement

A team maintains FastAPI and Express versions of the Student API. Every change must be tested automatically. A successful change should produce Docker images that can be tested and published for deployment.

### Student task

1. Create or use the FastAPI and Express Student APIs from Lectures 37–39.
2. Add automated tests for `/`, `/health`, and `/students`.
3. Create `.github/workflows/ci.yml`.
4. Configure CI for pull requests and pushes.
5. Build both Docker images after the test jobs pass.
6. Start the images and run health-check requests.
7. Create `.github/workflows/cd.yml`.
8. Publish images to GHCR using commit SHA tags.
9. Record the workflow run URL and image tags.
10. Explain how the deployment can be rolled back.

## 27. Failure Demonstration

Students must intentionally create one controlled failure:

- Break a test assertion, or
- Use an invalid Dockerfile instruction, or
- Call the wrong health-check port.

Then:

1. Push the change.
2. Inspect the failed Actions job.
3. Identify the failed step.
4. Correct the problem.
5. Push again.
6. Confirm that the workflow becomes successful.

**Learning point:** Debugging a pipeline is part of DevOps work. The failure message and logs are evidence.

## 28. Submission Structure

```text
student-api-cicd/
├── README.md
├── fastapi-app/
│   ├── main.py
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   ├── Dockerfile
│   └── test_main.py
├── express-app/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   └── test/
│       └── server.test.js
└── .github/
    └── workflows/
        ├── ci.yml
        └── cd.yml
```

README requirements:

- Explain CI, CD, and the workflow stages.
- Include local test commands.
- Include Docker build and run commands.
- Include the GitHub Actions workflow URL.
- Include successful test and health-check output.
- Include published image names and tags.
- Document one intentional failure and its solution.
- Explain secrets and rollback handling.

---

# Part J – Troubleshooting

## 29. Common GitHub Actions Problems

| Problem | Likely cause | Fix |
|---|---|---|
| Workflow does not run | Incorrect file location or trigger | Place YAML under `.github/workflows/` and check `on` |
| Python tests fail in CI only | Version or dependency difference | Pin versions and reproduce with the same runtime |
| `npm ci` fails | Lock file does not match `package.json` | Run `npm install` locally and commit the updated lock file |
| Docker cannot find a file | Wrong build context | Check `context` and Dockerfile paths |
| Image push denied | Missing `packages: write` permission | Add the required job permission |
| Secret is empty | Secret not defined for repository/environment | Check name and environment selection |
| Health check fails | Wrong port or application binding | Use `0.0.0.0`, verify `-p host:container`, inspect logs |
| Deployment succeeds but app is unavailable | Configuration, firewall, or runtime error | Check server logs and health endpoint |
| Old image is deployed | Mutable tag or cache | Deploy using an immutable commit SHA tag |

## 30. Local Debugging Checklist

Before changing the workflow, run the same actions locally:

```bash
pytest -q
npm test
docker build -t student-api-fastapi:local ./fastapi-app
docker build -t student-api-express:local ./express-app
docker run --rm -p 8000:8000 student-api-fastapi:local
docker run --rm -p 3000:3000 student-api-express:local
```

Then test:

```bash
curl --fail http://localhost:8000/health
curl --fail http://localhost:3000/health
```

---

# Part K – PBL Activity and Assessment

## 31. PBL Scenario

A development team releases updates manually. Broken code sometimes reaches the server, and developers cannot reliably reproduce the deployment steps. Design and implement a CI/CD pipeline that tests the Student API and publishes deployable Docker images.

### Expected design discussion

Students should explain:

- Why tests run before image publication
- Why FastAPI and Express can have separate jobs
- Why Docker build validation is useful
- Why a commit SHA is a better deployment identifier than only `latest`
- Which secrets are required and how they are protected
- How staging differs from production
- How a health check detects an unsuccessful deployment
- How rollback uses a previous image tag

## 32. Evaluation Rubric

| Criterion | Marks | Expected evidence |
|---|---:|---|
| CI/CD concepts | 2 | Clearly distinguishes CI, Continuous Delivery, and Continuous Deployment |
| Automated tests | 2 | FastAPI and Express tests run successfully |
| GitHub Actions CI | 2 | Workflow runs on pull requests or pushes and fails on broken tests |
| Docker integration | 2 | Images build and health endpoints are tested |
| CD and registry | 1 | Image is published with a traceable tag |
| Security and documentation | 1 | Secrets, permissions, README, and rollback are explained |
| **Total** | **10** | |

## 33. Exit Questions

1. What problem does Continuous Integration solve?
2. How is Continuous Deployment different from Continuous Delivery?
3. Why should tests run before Docker images are published?
4. What does `needs` do in a GitHub Actions job?
5. Why should production use an immutable image tag?
6. What is the purpose of `packages: write`?
7. Why should secrets not be written directly in a workflow file?
8. What does a deployment health check verify?
9. How would you roll back a deployment?
10. What is the difference between an application test and a container smoke test?

## Summary

Continuous Integration automatically validates changes through tests, linting, and build checks. Continuous Deployment extends this process by publishing and releasing verified artifacts. GitHub Actions coordinates the workflow, Docker provides reproducible application images, a registry stores those images, health checks validate deployments, and immutable tags make rollback possible. Together, CI and CD create a repeatable path from a developer commit to a tested and deployable backend application.

