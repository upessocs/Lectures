# Lectures 46–47

# Infrastructure Configuration and Safe Release Strategies

**Course Outcome:** CO4 – Apply security best practices and conduct testing.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture Nos. | 46–47 |
| Unit | Unit 4: Deployment and DevOps |
| Topic | Environment variables, secrets, blue-green, canary, and rolling releases |
| Course Outcome | CO4 |
| Bloom's Knowledge Level | Apply, Analyze, Evaluate |
| Skills Developed | Secure configuration management, environment separation, secret handling, release planning, health checks, rollback, and deployment evaluation |
| Applications | Secure cloud deployments, zero-downtime releases, VPS operations, PaaS deployments, and production incident response |
| PBL Activity | Configure and release the containerized FastAPI and Express Student APIs using safe configuration and a selected release strategy |
| Assessment Method | Coding task, release-strategy comparison, deployment demonstration, and viva |

> **Lecture flow:** L46 explains how an application receives configuration safely. L47 explains how a new version can be released while reducing downtime and deployment risk.

---

## Learning Objectives

By the end of these lectures, students should be able to:

1. Distinguish application code, configuration, and secrets.
2. Use environment variables in FastAPI and Express applications.
3. Create safe `.env.example` files and configure `.gitignore`.
4. Pass configuration to Docker containers without embedding secrets in images.
5. Explain blue-green, canary, and rolling releases.
6. Select an appropriate release strategy for a given scenario.
7. Use health checks, readiness checks, logs, and rollback tags during deployment.
8. Simulate a safe release with two Docker application versions.

---

# Part A – Infrastructure Configuration (L46)

## 1. What Is Infrastructure Configuration?

Infrastructure configuration is the collection of values that changes between environments or controls how an application runs.

Examples include:

- Application port
- Database URL
- Debug mode
- Allowed host names
- CORS origins
- Secret keys
- API tokens
- Feature flags
- Log level
- External service URLs
- Worker count

The application code should remain mostly the same across environments. Configuration should be supplied by the environment.

```text
Same application image
        +
Development configuration → Development behavior
Staging configuration     → Staging behavior
Production configuration  → Production behavior
```

**Comment:** This is a central DevOps principle. Build an artifact once and configure it differently at runtime instead of modifying source code for every environment.

## 2. Configuration Versus Secrets

| Type | Example | Handling |
|---|---|---|
| Normal configuration | `PORT=8000` | Environment variable or configuration file |
| Feature flag | `ENABLE_DOCS=true` | Environment variable |
| Secret | Database password | Secret manager or protected environment secret |
| Private key | SSH or signing key | Secret manager; never commit |
| Public value | API base URL | May be stored as a normal variable |

A secret is not made safe merely because it is placed in a file called `.env`. It must also be excluded from version control, protected in deployment systems, and prevented from appearing in logs.

## 3. The Hardcoded Secret Problem

Unsafe code:

```python
DATABASE_URL = "postgresql://admin:actual-password@db.example.com/app"
SECRET_KEY = "actual-production-secret"
```

Problems:

- Anyone with repository access can read the values.
- Secrets may remain in Git history even after deletion.
- Logs, screenshots, and error reports may expose them.
- The same secret may be reused across environments.
- Rotation becomes difficult.

Safe pattern:

```python
DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
```

## 4. Environment Separation

Use different values for different environments:

| Variable | Development | Staging | Production |
|---|---|---|---|
| `DEBUG` | `true` | `false` | `false` |
| `LOG_LEVEL` | `DEBUG` | `INFO` | `WARNING` or `INFO` |
| `DATABASE_URL` | Local database | Staging database | Production database |
| `CORS_ORIGINS` | Local frontend | Staging frontend | Production frontend |
| `SECRET_KEY` | Local-only value | Staging secret | Separate production secret |

**Security rule:** Never copy production secrets into a local `.env` file unless absolutely necessary. Prefer separate credentials with limited permissions.

---

# Part B – Configure the FastAPI Application

## 5. FastAPI Settings

Install the settings dependency:

```text
pydantic-settings==2.7.1
```

Create `fastapi-app/config.py`:

```python
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Student API"
    environment: str = "development"
    debug: bool = False
    port: int = 8000
    cors_origins: str = "http://localhost:5173"
    database_url: str = "sqlite:///./student.db"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
```

Update `fastapi-app/main.py`:

```python
from fastapi import FastAPI

from config import settings

app = FastAPI(
    title=settings.app_name,
    docs_url="/docs" if settings.debug else None,
)

@app.get("/")
def root():
    return {
        "application": settings.app_name,
        "environment": settings.environment,
        "status": "running",
    }

@app.get("/health")
def health():
    return {"status": "healthy", "environment": settings.environment}
```

**Explanation:**

- `Settings` reads values from environment variables.
- Defaults make local development easier.
- Production can override the defaults without changing code.
- Disabling documentation in production is a policy choice; API documentation should only be hidden if the project requires it.
- Do not return secret values in the API response.

## 6. FastAPI Environment Files

Create `fastapi-app/.env.example`:

```text
APP_NAME=Student API
ENVIRONMENT=development
DEBUG=true
PORT=8000
CORS_ORIGINS=http://localhost:5173
DATABASE_URL=sqlite:///./student.db
```

A developer may copy it locally:

```bash
cp .env.example .env
```

Create a local `.env` with actual development values. Do not commit it.

Add to `fastapi-app/.gitignore`:

```text
.env
*.db
__pycache__/
.venv/
```

## 7. FastAPI Docker Configuration

The Dockerfile should not contain secrets:

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY *.py .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Pass non-secret configuration at runtime:

```bash
docker run --rm   --name student-fastapi   -p 8000:8000   -e ENVIRONMENT=staging   -e DEBUG=false   -e APP_NAME="Student API - Staging"   student-api-fastapi:1.0
```

For local development, an environment file can be supplied:

```bash
docker run --rm   --env-file .env   -p 8000:8000   student-api-fastapi:1.0
```

**Security comment:** Do not use `docker history` or image layers as a place to store secrets. Values passed with `-e` are not written into the Dockerfile, but production systems should use a dedicated secret mechanism.

---

# Part C – Configure the Express Application

## 8. Express Configuration

Install the configuration package:

```bash
cd express-app
npm install dotenv
```

Update `express-app/server.js`:

```javascript
require("dotenv").config();

const express = require("express");

const app = express();
const port = Number(process.env.PORT || 3000);
const environment = process.env.ENVIRONMENT || "development";
const appName = process.env.APP_NAME || "Student API";

app.get("/", (req, res) => {
  res.json({
    application: appName,
    framework: "Express",
    environment,
    status: "running"
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", environment });
});

if (require.main === module) {
  app.listen(port, "0.0.0.0", () => {
    console.log(appName + " listening on port " + port);
  });
}

module.exports = app;
```

**Explanation:**

- `dotenv` reads a local `.env` file during development.
- Production should normally provide variables through the deployment platform.
- `process.env.PORT` allows the same image to run on different ports.
- The application does not expose database passwords or tokens.

## 9. Express Environment Files

Create `express-app/.env.example`:

```text
APP_NAME=Student API
ENVIRONMENT=development
PORT=3000
DATABASE_URL=postgresql://localhost/student
```

Add to `express-app/.gitignore`:

```text
.env
node_modules/
npm-debug.log
```

Verify that the real `.env` file is ignored:

```bash
git check-ignore -v .env
git status --ignored
```

## 10. Express Docker Configuration

The Dockerfile contains no secret values:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY server.js .env.example ./

EXPOSE 3000

CMD ["npm", "start"]
```

Run with runtime configuration:

```bash
docker run --rm   --name student-express   -p 3000:3000   -e ENVIRONMENT=staging   -e APP_NAME="Student API - Staging"   student-api-express:1.0
```

**Comment:** `.env.example` documents expected names but contains no credentials. The real `.env` file must be excluded by `.dockerignore`.

---

# Part D – Configuration in Docker Compose

## 11. Compose for Local Development

Create `compose.yml`:

```yaml
services:
  fastapi:
    build: ./fastapi-app
    environment:
      APP_NAME: Student API - FastAPI
      ENVIRONMENT: development
      DEBUG: "true"
      PORT: "8000"
    ports:
      - "8000:8000"

  express:
    build: ./express-app
    environment:
      APP_NAME: Student API - Express
      ENVIRONMENT: development
      PORT: "3000"
    ports:
      - "3000:3000"
```

Start the services:

```bash
docker compose up --build
```

Test:

```bash
curl http://localhost:8000/health
curl http://localhost:3000/health
```

Stop:

```bash
docker compose down
```

## 12. Compose with an Environment File

A local `.env` file can provide Compose interpolation values:

```text
FASTAPI_ENV=development
EXPRESS_ENV=development
```

Use it in `compose.yml`:

```yaml
services:
  fastapi:
    build: ./fastapi-app
    environment:
      ENVIRONMENT: ${FASTAPI_ENV}
      DEBUG: "true"

  express:
    build: ./express-app
    environment:
      ENVIRONMENT: ${EXPRESS_ENV}
      PORT: "3000"
```

**Important distinction:**

- Compose interpolation uses the project `.env` file.
- Container environment variables are the values visible to the application.
- A `.env` file used locally must not be committed or copied into the image.

For production, use the deployment platform's environment configuration or a secret manager rather than committing a production `.env` file.

---

# Part E – GitHub Actions and Secret Management

## 13. Repository Variables and Secrets

GitHub Actions supports values at repository, organization, and environment levels.

Use **variables** for non-sensitive values:

```text
DEPLOY_HOST
IMAGE_NAME
STAGING_URL
```

Use **secrets** for sensitive values:

```text
VPS_SSH_KEY
VPS_USER
REGISTRY_TOKEN
DATABASE_PASSWORD
```

Reference them without printing them:

```yaml
env:
  IMAGE_TAG: sha-${{ github.sha }}
  STAGING_URL: ${{ vars.STAGING_URL }}

steps:
  - name: Deploy
    env:
      DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
      DEPLOY_KEY: ${{ secrets.VPS_SSH_KEY }}
    run: ./scripts/deploy.sh
```

**Security rules:**

- Never place a secret directly in YAML.
- Never use `echo` to print a secret.
- Use separate staging and production secrets.
- Use environment protection rules for production.
- Give the workflow only the permissions it needs.
- Review any pull request that changes workflow files.
- Do not pass untrusted user input directly into shell commands.

## 14. Environment-Specific GitHub Actions Deployment

Conceptual example:

```yaml
jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Deploy staging image
        env:
          STAGING_URL: ${{ vars.STAGING_URL }}
          DEPLOY_TOKEN: ${{ secrets.STAGING_DEPLOY_TOKEN }}
        run: |
          echo "Deploying image sha-${{ github.sha }}"
          ./scripts/deploy-staging.sh "sha-${{ github.sha }}"

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy production image
        env:
          PRODUCTION_URL: ${{ vars.PRODUCTION_URL }}
          DEPLOY_TOKEN: ${{ secrets.PRODUCTION_DEPLOY_TOKEN }}
        run: |
          echo "Deploying image sha-${{ github.sha }}"
          ./scripts/deploy-production.sh "sha-${{ github.sha }}"
```

**Comment:** The `production` environment can require a reviewer before the job starts. This creates a controlled promotion from staging to production.

---

# Part F – Release Strategies (L47)

## 15. Why Release Strategies Matter

A release changes software used by real people. A poor release can cause:

- Downtime
- Failed requests
- Incompatible database changes
- Broken sessions
- Incorrect configuration
- User-visible bugs
- Difficult rollback
- Loss of data

A release strategy defines how the new version is introduced and how the old version is removed.

## 16. Rolling Update

A rolling update gradually replaces old instances with new instances.

```text
Start:  old  old  old
Step 1: new  old  old
Step 2: new  new  old
End:    new  new  new
```

Advantages:

- Uses existing infrastructure efficiently
- Can avoid complete downtime
- Common in orchestrators and PaaS platforms
- Supports gradual replacement

Risks:

- Old and new versions run simultaneously
- Both versions must often work with the same database schema
- A bad release may affect users before all instances are replaced
- Rollback may require replacing instances again

Use readiness and health checks so traffic is sent only to ready instances.

## 17. Blue-Green Deployment

Blue-green deployment maintains two environments:

- **Blue:** current stable version
- **Green:** new version

Traffic initially goes to Blue:

```text
Users → Router → Blue v1
                 Green v2
```

After Green is tested, traffic switches:

```text
Users → Router → Green v2
                 Blue v1
```

Advantages:

- Fast traffic switch
- Easy rollback by switching back
- New version can be tested before user traffic

Risks:

- Requires capacity for two environments
- Database migrations require careful compatibility
- Both environments may need synchronized configuration
- A traffic switch does not undo an incompatible data migration

## 18. Canary Release

A canary release sends a small percentage of traffic to the new version.

```text
95% users → v1
 5% users → v2
```

If metrics remain healthy, traffic may progress:

```text
5% → 25% → 50% → 100%
```

Monitor:

- Error rate
- Latency
- CPU and memory
- Business transaction failures
- User feedback
- Logs and traces

Advantages:

- Limits the blast radius of a bad release
- Uses real traffic for validation
- Supports evidence-based promotion

Risks:

- Requires traffic splitting
- More difficult to implement correctly
- Users may receive different behavior
- Database and API compatibility remain important

## 19. Strategy Comparison

| Strategy | Traffic model | Main advantage | Main risk | Suitable for |
|---|---|---|---|---|
| Rolling | Instances replaced gradually | Efficient and common | Mixed versions | Routine compatible releases |
| Blue-green | Switch between two environments | Fast rollback | Requires duplicate capacity | Important services needing quick switch |
| Canary | Small traffic percentage first | Limits blast radius | Needs routing and monitoring | High-risk or high-traffic releases |

---

# Part G – Hands-On Release Simulation

## 20. Create Versioned API Images

Change the root response in the FastAPI application:

Version 1:

```python
return {
    "application": settings.app_name,
    "version": "1.0.0",
    "environment": settings.environment,
    "status": "running",
}
```

Build:

```bash
docker build -t student-api-fastapi:1.0.0 ./fastapi-app
```

Create Version 2 by changing only the version:

```python
"version": "2.0.0",
```

Build:

```bash
docker build -t student-api-fastapi:2.0.0 ./fastapi-app
```

Do the same for Express:

```bash
docker build -t student-api-express:1.0.0 ./express-app
docker build -t student-api-express:2.0.0 ./express-app
```

## 21. Blue-Green Simulation with Docker Ports

Run Blue:

```bash
docker run -d   --name student-blue   -p 8001:8000   -e ENVIRONMENT=blue   student-api-fastapi:1.0.0
```

Run Green:

```bash
docker run -d   --name student-green   -p 8002:8000   -e ENVIRONMENT=green   student-api-fastapi:2.0.0
```

Test both directly:

```bash
curl http://localhost:8001/
curl http://localhost:8002/
curl --fail http://localhost:8001/health
curl --fail http://localhost:8002/health
```

In a real deployment, a reverse proxy or cloud load balancer would point the public service to Blue first. After Green passes its health and smoke tests, change the router target to Green.

Simulate rollback by routing traffic back to Blue.

Clean up:

```bash
docker stop student-blue student-green
docker rm student-blue student-green
```

**Comment:** Different host ports represent two environments. They do not by themselves create a production-grade traffic switch.

## 22. Rolling Update Simulation

Start two Version 1 instances:

```bash
docker run -d --name api-v1-a -p 8011:8000 student-api-fastapi:1.0.0
docker run -d --name api-v1-b -p 8012:8000 student-api-fastapi:1.0.0
```

Replace one instance with Version 2:

```bash
docker stop api-v1-a
docker rm api-v1-a
docker run -d --name api-v2-a -p 8011:8000 student-api-fastapi:2.0.0
```

Test both:

```bash
curl http://localhost:8011/
curl http://localhost:8012/
```

Replace the remaining instance only after the new instance is healthy.

**Discussion:** During the transition, both versions exist. The API contract and database schema must support both versions.

## 23. Canary Discussion

A complete canary requires a proxy or cloud traffic router. For this lecture, simulate the decision process:

1. Run Version 1 as the main service.
2. Run Version 2 on a separate port.
3. Send a small, controlled set of requests to Version 2.
4. Compare health, latency, logs, and error responses.
5. Promote Version 2 only if the results meet the release criteria.
6. Stop promotion and route traffic back if errors increase.

Example test:

```bash
for i in {1..20}; do
  curl --fail -s http://localhost:8002/health > /dev/null
done
```

Define release criteria before testing:

```text
Health check: 100% successful
HTTP 5xx errors: 0 during smoke test
p95 latency: below agreed threshold
Critical endpoint: successful
Logs: no unhandled exception
```

---

# Part H – Database and Compatibility Concerns

## 24. Expand-and-Contract Migration

During rolling or blue-green releases, old and new application versions may run together. Avoid a database change that only one version understands.

Safer sequence:

1. **Expand:** Add the new nullable column or table.
2. Deploy code that can work with both old and new schema.
3. Backfill or migrate data.
4. Switch the application to use the new field.
5. **Contract:** Remove the old field only after old code is no longer running.

**Example:** Do not rename `student_name` to `name` in one step while Version 1 still queries `student_name`. Add `name`, support both versions temporarily, then remove the old field later.

## 25. Sessions and Files

Release strategies also affect state:

- Store sessions in Redis or a shared database.
- Store uploaded files in object storage or a shared volume.
- Do not depend on one container's local filesystem.
- Use compatible authentication and signing keys across versions.
- Keep secrets consistent during a transition, unless intentionally rotating them.

---

# Part I – Rollback and Incident Handling

## 26. Rollback Plan

Every release should answer:

- Which version is currently deployed?
- Which previous version is known to work?
- How is traffic moved back?
- How are database changes reversed or tolerated?
- Who is allowed to approve rollback?
- How are users and team members informed?

For image-based deployment, retain the previous immutable tag:

```text
student-api-fastapi:sha-previous-good
student-api-fastapi:sha-current
```

A rollback should:

1. Stop promotion.
2. Inspect logs and health checks.
3. Route traffic to the previous version or restart the previous image.
4. Confirm the health endpoint.
5. Confirm a critical user flow.
6. Record the incident and root cause.

## 27. Release Checklist

### Before release

- Tests pass in CI.
- Docker image builds successfully.
- Image has an immutable tag.
- Configuration names are documented.
- Required secrets exist in the target environment.
- Database migration is backward-compatible.
- Health and readiness checks work.
- Rollback image is available.
- Monitoring and alerting are active.

### During release

- Deploy to staging first.
- Run smoke tests.
- Monitor logs, error rate, and latency.
- Promote gradually according to the selected strategy.
- Stop if release criteria fail.

### After release

- Check application health.
- Check critical endpoints.
- Monitor for a defined period.
- Record deployed image tag.
- Remove old instances only after rollback confidence is established.

---

# Part J – PBL Activity and Assessment

## 28. PBL Scenario

The Student API currently stores configuration in source code and experiences downtime during deployment. The team wants to release a new version without exposing secrets or interrupting users.

### Student task

1. Refactor FastAPI or Express configuration to use environment variables.
2. Create `.env.example` and update `.gitignore`.
3. Verify that no real secret is tracked by Git.
4. Build two versioned Docker images.
5. Run Blue and Green versions on separate ports.
6. Test both health endpoints and version responses.
7. Select Blue-Green, Canary, or Rolling release for a given scenario.
8. Define measurable promotion criteria.
9. Demonstrate rollback to the previous version.
10. Document database, session, file-storage, and secret considerations.

## 29. Scenario Selection Exercise

Choose and justify a strategy:

| Scenario | Recommended discussion |
|---|---|
| Small internal API with compatible changes | Rolling update |
| Banking service requiring quick rollback | Blue-green with strong verification |
| Social platform with high traffic and uncertain feature impact | Canary release |
| Database migration that removes a field immediately | Redesign migration using expand-and-contract |
| Application with local in-memory sessions | Add shared session storage before horizontal release |

There may be more than one valid answer. Students must justify their choice using downtime, risk, capacity, observability, and rollback requirements.

## 30. Submission Requirements

```text
infrastructure-release-student-api/
├── README.md
├── compose.yml
├── fastapi-app/ or express-app/
│   ├── .env.example
│   ├── .gitignore
│   ├── Dockerfile
│   └── application files
├── release/
│   ├── version-1-output.txt
│   ├── version-2-output.txt
│   └── rollback-output.txt
└── .github/
    └── workflows/
        └── deployment.yml
```

README must include:

- Configuration variables and their purpose
- Secret-handling method
- Docker commands
- Selected release strategy
- Release criteria
- Health-check results
- Rollback procedure
- One limitation or risk

## 31. Evaluation Rubric

| Criterion | Marks | Expected evidence |
|---|---:|---|
| Configuration concepts | 2 | Correctly separates code, configuration, and secrets |
| Secure implementation | 2 | Uses environment variables, `.env.example`, and `.gitignore` |
| Release strategy | 2 | Compares and justifies blue-green, canary, or rolling release |
| Hands-on deployment | 2 | Runs versioned containers and performs health checks |
| Rollback and compatibility | 1 | Demonstrates rollback and discusses schema/state concerns |
| Documentation and viva | 1 | Clear commands, output, and reasoning |
| **Total** | **10** | |

## 32. Exit Questions

1. Why should configuration be separated from application code?
2. Is a `.env` file automatically secure? Explain.
3. What is the difference between a normal environment variable and a secret?
4. Why should secrets not be included in a Dockerfile?
5. What is the purpose of `.env.example`?
6. How does blue-green deployment support fast rollback?
7. What is the main advantage of a canary release?
8. Why can a rolling update temporarily run two application versions?
9. Why must database migrations be backward-compatible during rolling deployments?
10. What should be checked before promoting a new version?

## Summary

Infrastructure configuration allows the same application artifact to run safely in development, staging, and production. Environment variables and secret stores prevent sensitive values from being hardcoded or committed. Release strategies control how a new version reaches users. Rolling updates replace instances gradually, blue-green deployments switch between two environments, and canary releases expose a small percentage of users first. Health checks, monitoring, immutable image tags, compatible migrations, and rollback plans make these strategies safer for real backend systems.

