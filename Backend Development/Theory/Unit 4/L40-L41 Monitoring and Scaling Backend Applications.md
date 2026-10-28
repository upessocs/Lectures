# Lectures 40–41

# Monitoring and Scaling Backend Applications

**Course Outcome:** CO4 – Apply security best practices and conduct testing.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture Nos. | 40–41 |
| Unit | Unit 4: Deployment and DevOps |
| Topic | Logging, performance monitoring, horizontal scaling, and vertical scaling |
| Course Outcome | CO4 |
| Bloom's Knowledge Level | Understand, Apply, Analyze |
| Skills Developed | Structured logging, request tracing, metric interpretation, performance testing, container orchestration, scaling decisions, and debugging |
| Applications | Production observability, high-traffic APIs, cloud deployment, fault diagnosis, and capacity planning |
| PBL Activity | Monitor and horizontally scale the containerized FastAPI and Express Student APIs |
| Assessment Method | Practical implementation, performance investigation, design explanation, and quiz |

> **Lecture flow:** L40 answers “What is happening inside the application?” L41 answers “How can the application handle more traffic?” Monitoring provides evidence for scaling decisions.

---

## Learning Objectives

By the end of these lectures, students should be able to:

1. Explain the purpose of logs, metrics, traces, health checks, and alerts.
2. Add useful request, error, and performance logs to FastAPI and Express.
3. Measure response time and identify slow or failing requests.
4. Distinguish vertical scaling from horizontal scaling.
5. Run multiple API containers on different ports.
6. Explain the role of load balancers, shared databases, caches, and session stores.
7. Propose a safe scaling plan based on monitoring evidence.

---

# Part A – Monitoring Backend Applications (L40)

## 1. Why Monitoring Is Required

A backend may fail because of errors in application code, database connections, memory, CPU, network access, or external services. Users usually experience these problems as slow responses, error messages, or timeouts.

Monitoring helps answer:

- Is the application running?
- How many requests are arriving?
- How long do requests take?
- How many requests fail?
- Is CPU or memory usage increasing?
- Which endpoint or dependency is slow?
- Did a recent deployment introduce a problem?

**Comment:** Without monitoring, developers are forced to guess. With monitoring, they can use evidence from logs and metrics to diagnose the problem.

## 2. Observability: Logs, Metrics, and Traces

| Component | What it records | Example |
|---|---|---|
| Logs | Detailed events and errors | `GET /students returned 200` |
| Metrics | Numeric measurements over time | Error rate = 2%, latency = 180 ms |
| Traces | A request's path through services | API → database → payment service |
| Health check | Whether a service is operational | `/health` returns 200 |
| Alert | Notification when a condition is abnormal | Error rate above 5% |

### 2.1 Logs

A log entry should provide enough context to understand an event:

```text
2026-10-27T10:15:20Z INFO method=GET path=/students status=200 duration_ms=18
```

Useful log fields include:

- Timestamp
- Log level
- HTTP method
- Request path
- Status code
- Request duration
- Error message
- Request or correlation ID
- Service name

**Security comment:** Do not log passwords, access tokens, complete credit-card numbers, or other sensitive data.

### 2.2 Metrics

Important backend metrics include:

- Request count
- Requests per second
- Success and error counts
- Average and percentile latency
- CPU utilization
- Memory utilization
- Database connection usage
- Queue length
- Container restart count

The 95th percentile latency, often written as **p95**, means 95% of requests are faster than that value. Percentiles often describe user experience better than a simple average.

### 2.3 Health Checks

A health endpoint allows Docker, a load balancer, or a cloud platform to determine whether an application is responding.

```http
GET /health
```

Example response:

```json
{"status":"healthy"}
```

A production health check may also verify database connectivity, but a simple liveness check should remain lightweight.

---

# Part B – Add Monitoring to the Student APIs

## 3. FastAPI Request Logging

Install no additional package for this basic example. Update `fastapi-app/main.py`:

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
            request.method,
            request.url.path,
            response.status_code,
            duration_ms,
        )
        return response
    except Exception:
        duration_ms = (time.perf_counter() - start) * 1000
        logger.exception(
            "method=%s path=%s status=500 duration_ms=%.2f",
            request.method,
            request.url.path,
            duration_ms,
        )
        raise


@app.get("/")
def root():
    return {
        "application": "Student API",
        "framework": "FastAPI",
        "status": "running",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/students")
def list_students():
    return students
```

**Explanation:**

- Middleware runs for every request.
- `time.perf_counter()` measures elapsed time accurately.
- `logger.info()` records successful requests.
- `logger.exception()` records the error and stack trace.
- The request is not silently swallowed; the error is raised after logging.

Run locally or in Docker and observe the logs:

```bash
docker logs -f student-fastapi
```

The `-f` option follows new log entries as they are produced.

## 4. Express Request Logging

Update `express-app/server.js`:

```javascript
const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

const students = [
  { id: 1, name: "Aarav", course: "Backend Development" },
  { id: 2, name: "Diya", course: "Backend Development" }
];

app.use((req, res, next) => {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;

    console.log(JSON.stringify({
      time: new Date().toISOString(),
      level: "info",
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration_ms: Number(durationMs.toFixed(2))
    }));
  });

  next();
});

app.get("/", (req, res) => {
  res.json({
    application: "Student API",
    framework: "Express",
    status: "running"
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.get("/students", (req, res) => {
  res.json(students);
});

app.use((error, req, res, next) => {
  console.error(JSON.stringify({
    time: new Date().toISOString(),
    level: "error",
    message: error.message,
    path: req.originalUrl
  }));

  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, "0.0.0.0", () => {
  console.log("Express API listening on port " + port);
});
```

**Explanation:**

- The middleware starts a timer before passing control to the route.
- The `finish` event runs after the response has been sent.
- JSON logs are easier for log platforms to search and process.
- The error middleware provides one central place for unexpected errors.

View the logs:

```bash
docker logs -f student-express
```

## 5. Generate Test Requests

With the containers running, make repeated requests:

```bash
curl http://localhost:8000/health
curl http://localhost:8000/students
curl http://localhost:3000/health
curl http://localhost:3000/students
```

For a simple repeated test on Linux or macOS:

```bash
for i in {1..20}; do curl -s http://localhost:8000/health > /dev/null; done
```

On Windows PowerShell:

```powershell
1..20 | ForEach-Object {
  Invoke-WebRequest http://localhost:8000/health | Out-Null
}
```

**Comment:** This is not a complete load test. It is only a simple way to create observable traffic during the practical session.

---

# Part C – Performance Monitoring

## 6. Measuring Response Time

The `time` command provides a basic measurement:

```bash
time curl -s http://localhost:8000/students
```

For a better HTTP benchmark, students may use a tool such as ApacheBench:

```bash
ab -n 100 -c 5 http://localhost:8000/health
```

Meaning:

- `-n 100`: send 100 total requests
- `-c 5`: send up to 5 concurrent requests

**Safety comment:** Run load tests only against your own local or authorized server. Do not send uncontrolled traffic to public services.

## 7. What to Look for in Results

| Observation | Possible interpretation |
|---|---|
| High latency with low traffic | Slow code, database query, or external service |
| Increasing latency under concurrency | Insufficient workers or a resource bottleneck |
| Many 5xx responses | Application or dependency failure |
| High CPU | CPU-bound work or too many requests |
| High memory | Memory leak, large responses, or too many workers |
| Containers restarting | Crash, health-check failure, or resource limit |

Monitoring does not automatically identify the cause. It provides evidence that must be interpreted with logs, code inspection, and controlled testing.

---

# Part D – Scaling Backend Applications (L41)

## 8. What Is Scaling?

Scaling is increasing an application's ability to handle more traffic, users, data, or work while maintaining acceptable performance and reliability.

Scaling may be required because of:

- More concurrent users
- Larger requests or responses
- More database operations
- Traffic spikes
- Background jobs
- New geographic regions
- Availability requirements

## 9. Vertical Scaling

**Vertical scaling** increases the resources of one server or container host.

Examples:

- More CPU cores
- More RAM
- Faster storage
- Higher network capacity

Advantages:

- Simple to understand and implement
- Often requires few application changes
- Useful for small systems

Limitations:

- Hardware has a maximum size
- A single server remains a failure point
- Larger machines may become expensive
- Scaling may require downtime or migration

## 10. Horizontal Scaling

**Horizontal scaling** adds more application instances.

```text
                    ┌── API instance 1
Client → Load balancer ├── API instance 2
                    └── API instance 3
```

Advantages:

- Handles more concurrent requests
- Improves availability
- Allows instances to be added or removed
- Supports rolling deployments

Challenges:

- Requires a load balancer
- Sessions must be shared or made stateless
- Database capacity must also scale
- Logs and metrics must be collected centrally
- Files should not be stored only inside one container

## 11. Stateless Applications

A stateless API does not depend on memory stored in one particular application instance. Each request contains enough information, or the required state is stored in a shared service.

For example, avoid storing important session data only in:

```text
API instance 1 memory
```

Use a shared store instead:

```text
API instances → Redis or database
```

**Comment:** JWT-based authentication can reduce server-side session dependence, but token expiry, revocation, and secret management still require careful design.

## 12. Scaling Dependencies

Adding application instances does not solve every bottleneck.

| Component | Possible bottleneck | Scaling approach |
|---|---|---|
| Application server | CPU or worker saturation | Add instances or workers |
| Database | Connection or query limit | Indexing, read replicas, larger instance, pooling |
| Cache | Memory or throughput | Larger cache or clustered cache |
| File storage | Local container files disappear | Object storage or shared volume |
| External API | Rate limits | Caching, queues, retries, provider limits |
| Logs | Too much local output | Centralized log collection |

**Important:** The database often becomes the bottleneck when more API instances are added. Every instance may create database connections and issue queries.

---

# Part E – Hands-On Scaling Simulation

## 13. Run Multiple FastAPI Instances

Build the FastAPI image from the previous lecture, then run two containers:

```bash
docker run -d --name fastapi-1 -p 8001:8000 student-api-fastapi:1.0
docker run -d --name fastapi-2 -p 8002:8000 student-api-fastapi:1.0
```

Test both instances:

```bash
curl http://localhost:8001/health
curl http://localhost:8002/health
```

Inspect them:

```bash
docker ps
docker logs fastapi-1
docker logs fastapi-2
```

**Explanation:** The host exposes ports 8001 and 8002, while both applications listen on port 8000 inside their separate containers. This demonstrates multiple instances, but it is not yet load balancing.

## 14. Run Multiple Express Instances

```bash
docker run -d --name express-1 -p 3001:3000 student-api-express:1.0
docker run -d --name express-2 -p 3002:3000 student-api-express:1.0
```

Test both:

```bash
curl http://localhost:3001/health
curl http://localhost:3002/health
```

## 15. Observe Distribution Manually

Send requests to the two instances:

```bash
for i in {1..10}; do
  curl -s http://localhost:8001/health > /dev/null
  curl -s http://localhost:8002/health > /dev/null
done
```

Then compare their logs:

```bash
docker logs fastapi-1
docker logs fastapi-2
```

**Observation:** Requests are distributed only because the commands explicitly select different ports. A real load balancer would choose an instance automatically.

## 16. Optional Nginx Load-Balancer Demonstration

Create `nginx.conf`:

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

Run Nginx:

```bash
docker run -d --name student-lb \
  -p 8080:8080 \
  -v "$(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro" \
  nginx:alpine
```

Test the load-balancer endpoint:

```bash
curl http://localhost:8080/health
```

**Platform note:** `host.docker.internal` works conveniently with Docker Desktop. On some Linux Docker Engine installations, use a suitable host gateway configuration or place all services on a Docker network and refer to containers by service name.

**Comment:** This demonstration shows the idea of a reverse proxy and load balancer. Production systems also require health checks, timeouts, TLS termination, access logs, and failure handling.

## 17. Clean Up

```bash
docker stop fastapi-1 fastapi-2 express-1 express-2 student-lb
docker rm fastapi-1 fastapi-2 express-1 express-2 student-lb
```

---

# Part F – Monitoring and Scaling Troubleshooting

## 18. Common Problems

| Problem | Likely cause | Fix |
|---|---|---|
| No logs appear | Container is not running or request was not sent | Check `docker ps` and call an endpoint |
| Logs contain secrets | Sensitive fields are being logged | Remove or mask secrets |
| Response time increases | Slow code, dependency, or resource saturation | Compare logs, metrics, and dependency timings |
| Second instance cannot start | Host port already used | Choose another host port |
| Load balancer returns 502 | Backend is unreachable or wrong port is configured | Check upstream address and container logs |
| User state disappears | Session data stored in one instance's memory | Use Redis/database or stateless authentication |
| More instances overload database | Too many connections or queries | Use pooling, indexes, caching, and database scaling |
| Container restarts | Process crash or health failure | Inspect `docker logs` and container status |

## 19. Debugging Procedure

Use this order:

1. Check whether the container is running:
   ```bash
   docker ps -a
   ```
2. Inspect application logs:
   ```bash
   docker logs <container-name>
   ```
3. Test the health endpoint.
4. Test the API directly without the load balancer.
5. Check host-port and container-port mapping.
6. Compare response time and error status.
7. Inspect CPU and memory usage.
8. Check database and external-service dependencies.
9. Reproduce the failure with a small, controlled request load.

---

# Part G – PBL Activity and Assessment

## 20. PBL Scenario

The Student API works during development but becomes slow when many users access it at the same time. The team has no evidence about whether the problem is caused by application code, the database, or insufficient server resources.

### Student task

1. Add request logging to either the FastAPI or Express API.
2. Include method, path, status, and duration in each log entry.
3. Run the application in Docker.
4. Generate a controlled set of requests.
5. Compare the logs of two application instances.
6. Create a scaling plan that identifies:
   - What should be monitored
   - Whether vertical or horizontal scaling should be used
   - How a load balancer will distribute traffic
   - Where sessions, files, and database state will be stored
   - How failures and unhealthy instances will be detected
7. Explain one limitation of the proposed plan.

## 21. Submission Requirements

```text
monitoring-scaling-student-api/
├── README.md
├── fastapi-app/ or express-app/
├── Dockerfile
├── .dockerignore
├── nginx.conf
└── screenshots-or-output/
```

The README must include:

- Logging implementation
- Example log output
- Commands used to run two instances
- Test results from both instances
- Scaling diagram or written architecture
- One observed problem and its solution
- Explanation of database and session handling

## 22. Evaluation Rubric

| Criterion | Marks | Expected evidence |
|---|---:|---|
| Monitoring concepts | 2 | Correctly explains logs, metrics, traces, health checks, and alerts |
| Structured logging | 2 | Logs include method, path, status, and duration |
| Performance investigation | 2 | Generates controlled requests and interprets results |
| Scaling implementation | 2 | Runs two or more containers and tests them |
| Architecture reasoning | 1 | Discusses load balancing, sessions, database, and shared storage |
| Documentation and viva | 1 | Clear commands, output, and explanations |
| **Total** | **10** | |

## 23. Exit Questions

1. What is the difference between logging and monitoring?
2. Why is request duration useful in a log entry?
3. What does p95 latency represent?
4. What is the difference between vertical and horizontal scaling?
5. Why can horizontal scaling overload a database?
6. Why should important sessions not be stored only in application memory?
7. What role does a load balancer play?
8. What should you inspect when a container returns HTTP 502?

---

## Summary

Monitoring provides evidence about application behavior through logs, metrics, traces, health checks, and alerts. Scaling increases capacity by adding resources to one server or adding more application instances. A practical backend system combines both: monitoring identifies the bottleneck, and scaling addresses the bottleneck. The Student API exercise demonstrates structured logging, controlled testing, multiple Docker instances, and the architectural concerns involved in production scaling.

