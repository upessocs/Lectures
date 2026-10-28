# Lecture 58

# Performance Profiling: Measuring What Matters in Express and FastAPI

**Course Outcome:** CO4 – Apply security best practices and conduct testing; CO5 – Demonstrate effective team collaboration skills.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 58 |
| Unit | Unit V – Advanced Topics |
| Topic | Performance profiling: metrics, tools, and measurement approach for Express and FastAPI backends |
| Course Outcome | CO4, CO5 |
| Bloom's Knowledge Level | Apply → Analyze |
| Skills Developed | Instrumenting an Express/FastAPI app to capture latency and resource metrics; reading p50/p95/p99 correctly; distinguishing throughput from latency; identifying bottlenecks using profiling output |
| Applications | API performance regression testing, capacity planning for the SMS backend, choosing between Express and FastAPI for a given workload |
| PBL Activity | Teams instrument their SMS API endpoint, capture baseline metrics under load, and present a one-page profiling report identifying the top bottleneck |
| Assessment Method | Profiling report with captured metrics + short viva on interpreting percentiles and bottleneck evidence |

---

## Part A – Theory

### 1. Introduction

In Lecture 58's original scope, you were asked to compare frameworks. This simplified version focuses on the prerequisite skill: **profiling your own application to find where time goes**. You cannot compare two things fairly until you can measure one thing accurately.

By the end of this lecture, students will be able to:

1. Define the four metrics that matter: **latency (p50/p95/p99), throughput (req/sec), error rate, and resource usage (CPU/memory)**.
2. Instrument an Express or FastAPI app to capture per-request latency.
3. Run a controlled load test and read the results without falling into the "mean-only" trap.
4. Identify at least one bottleneck from profiling evidence.

---

### 2. The Four Metrics That Matter

| Metric | What it tells you | Why it matters |
|---|---|---|
| **Latency percentiles (p50/p95/p99)** | How long requests take at different points in the distribution | p99 is what your slowest users experience; a 10ms mean with 800ms p99 feels broken to 1 in 100 users |
| **Throughput (req/sec)** | How many requests complete per second | Capacity planning; a fast system with low throughput is not scalable |
| **Error rate** | Percentage of requests that fail | A fast system that errors is not fast |
| **Resource usage** | CPU and memory consumed | Memory leaks and CPU saturation cause latency spikes over time |

> **The single rule:** never report only the mean. If you report one number, report **p95**. If you report two, report **p50 and p99** .

---

### 3. Profiling an Express App

#### 3.1 Built-in timing with `perf_hooks`

Node.js provides high-precision timing via the `perf_hooks` module. Add a simple middleware to record per-request latency:

```js
const { performance } = require('perf_hooks');

const latencies = [];

app.use((req, res, next) => {
  const start = performance.now();
  res.on('finish', () => {
    const duration = performance.now() - start;
    latencies.push({ path: req.path, duration, status: res.statusCode });
    // keep only last 1000 to avoid memory growth
    if (latencies.length > 1000) latencies.shift();
  });
  next();
});

app.get('/metrics', (req, res) => {
  const sorted = latencies.map(l => l.duration).sort((a, b) => a - b);
  const p = (pct) => sorted[Math.floor(sorted.length * pct)] || 0;
  res.json({
    count: sorted.length,
    p50: p(0.50),
    p95: p(0.95),
    p99: p(0.99),
    max: sorted[sorted.length - 1] || 0,
  });
});
```

This gives you per-request percentile data without any external dependency.

#### 3.2 One-line dashboard with a profiler package

For faster setup, `bodhi-node-profiler` attaches CPU, memory, event-loop delay, and API response-time tracking to an Express app with one middleware line :

```js
const { BodhiProfiler } = require('bodhi-node-profiler');
const profiler = new BodhiProfiler({ port: 45680 });
app.use(profiler.middleware());
// Dashboard at http://localhost:45680/profiler
```

A lighter alternative is `node-runtime-monitor`, which exposes a JSON `/status` endpoint and a simple dashboard .

#### 3.3 Event-loop delay: the Node.js-specific signal

Node.js runs on a single thread. If the event loop is blocked (by synchronous code, heavy JSON serialization, or CPU work), **all** requests slow down. Track event-loop delay as a leading indicator:

```js
const { monitorEventLoopDelay } = require('perf_hooks');
const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
// After some requests: h.mean, h.percentile(99) give delay in nanoseconds
```

If event-loop p99 delay rises above ~50ms, you have a blocking problem, not a routing problem .

---

### 4. Profiling a FastAPI App

#### 4.1 Middleware timing

FastAPI is ASGI-based. Add HTTP middleware to capture latency:

```python
from fastapi import FastAPI, Request
import time

app = FastAPI()
latencies = []

@app.middleware("http")
async def timing_middleware(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    duration_ms = (time.perf_counter() - start) * 1000
    latencies.append({"path": request.url.path, "ms": duration_ms})
    if len(latencies) > 1000:
        latencies.pop(0)
    return response

@app.get("/metrics")
async def metrics():
    vals = sorted([l["ms"] for l in latencies])
    def p(pct): return vals[int(len(vals) * pct)] if vals else 0
    return {"count": len(vals), "p50": p(0.50), "p95": p(0.95), "p99": p(0.99)}
```

#### 4.2 Profiler packages

`fastapi-profiler-lite` adds a real-time dashboard at `/profiler` with endpoint analysis and response-time charts :

```python
from fastapi_profiler import Profiler
Profiler(app)  # dashboard at /profiler
```

`asgi-profiler` provides per-request traces, SQL query counts (useful for N+1 detection), and a JSON API for scripted checks .

#### 4.3 What FastAPI profiling reveals

FastAPI performance is often limited by **database calls** or **blocking synchronous code inside async endpoints**. Profiling that shows high p99 but low CPU typically points to I/O waits (database, external API), not framework overhead. A community benchmark found FastAPI at ~180 RPS vs Express at ~880 RPS on an identical trivial endpoint  — but that measures framework overhead, not your route. Profile **your** endpoint.

---

### 5. Running a Load Test to Generate Metrics

Profiling middleware only records data when requests arrive. Use a load generator to produce controlled traffic.

**autocannon** is the simplest choice for a single endpoint :

```bash
npx autocannon -c 50 -d 30 http://localhost:3000/api/ping
```

- `-c 50`: 50 concurrent connections
- `-d 30`: run for 30 seconds (warm-up matters — discard the first few seconds) 

For scripted scenarios with pass/fail thresholds (e.g., p99 < 500ms), use **k6**:

```js
// k6 script (runs in k6's own JS runtime, not Node)
export const options = {
  thresholds: { http_req_duration: ['p(99)<500'] },
};
export default function () {
  http.get('http://localhost:3000/api/ping');
}
```

k6 exits non-zero if the threshold fails, making it suitable for CI pipelines .

---

## Part B – Installation

```bash
# Express profiling
npm install bodhi-node-profiler

# Load testing
npm install -g autocannon
# or use: npx autocannon

# FastAPI profiling
pip install fastapi-profiler-lite
```

---

## Part C – Hands-On

### Task 1 – Instrument your endpoint

**Express:** Add the `perf_hooks` middleware from §3.1 to your SMS API. Hit `/api/ping` a few times and call `/metrics`. Confirm you see count, p50, p95, p99.

**FastAPI:** Add the timing middleware from §4.1. Hit the same endpoint and check `/metrics`.

**Checkpoint:** What does p99 = 120ms mean for a user? (Answer: 1 in 100 requests took longer than 120ms.)

---

### Task 2 – Run a load test and capture the four metrics

Start your server, then run:

```bash
npx autocannon -c 50 -d 30 http://localhost:3000/api/ping
```

Record from the autocannon output:
- **Req/sec** (throughput)
- **Latency p50, p99** (from the latency table)
- **Errors** (from the errors line)

Also check your `/metrics` endpoint after the test. Compare its p99 with autocannon's p99. They should be close; if not, your middleware may be missing requests.

**Checkpoint:** Run the same test twice. Is the second p99 higher, lower, or the same? What does that tell you about running a single test?

---

### Task 3 – Find a bottleneck

Introduce a deliberate bottleneck: add `await new Promise(r => setTimeout(r, 50))` to the `/api/ping` handler (simulating a slow database call).

Re-run the load test. Compare p99 before and after.

**Checkpoint:** The p99 should jump by roughly 50ms if the handler is the bottleneck. If it does not, what else might be limiting performance? (Hint: check concurrency and event-loop delay.)

---

## PBL Activity

### Problem Scenario

Your SMS API feels "slow" during the results-day demo. You must produce evidence of *where* the time goes before anyone proposes a fix.

### Student Task

1. Instrument one SMS endpoint (e.g., `/api/attendance`) with latency middleware.
2. Run autocannon at `-c 50 -d 30`.
3. Produce a one-page report containing: the endpoint tested, p50/p95/p99, req/sec, error rate, and **one identified bottleneck** with the evidence that supports it (e.g., "event-loop delay spiked to 80ms under load, suggesting blocking JSON serialization").
4. Present the report in a 5-minute team review.

### Expected Learning

A measured baseline, correct percentile interpretation, and a bottleneck claim backed by profiling evidence — not intuition.

---

## Assessment Activity

### Assessment Method

Profiling report + short viva.

### Evaluation Criteria

| Criterion | Expected Evidence |
|---|---|
| Conceptual Understanding | Correctly explains what p99 means and why mean-only reporting hides problems |
| Practical Skill | Middleware captures latency; load test produces throughput and percentile data; `/metrics` endpoint returns valid numbers |
| Problem Solving | Bottleneck identified with evidence from profiling output, not guesswork |
| CO Attainment (CO4) | Measurement methodology is repeatable and documented |
| CO Attainment (CO5) | Team report is clear enough for a peer to reproduce |

---

## Summary

### Key Takeaways

- **Four metrics matter:** p50/p95/p99 latency, req/sec throughput, error rate, and CPU/memory usage. Never report only the mean .
- **Express:** use `perf_hooks` middleware or `bodhi-node-profiler` for one-line dashboards .
- **FastAPI:** use ASGI middleware or `fastapi-profiler-lite` for endpoint-level latency and dashboard .
- **Generate traffic with autocannon** (`-c 50 -d 30`) or k6 (with thresholds for CI). Warm-up matters; run the test more than once.
- **Find bottlenecks with evidence:** if p99 rises when you add a 50ms delay, the handler is the bottleneck. If it does not, look at event-loop delay, database pools, or concurrency limits.
