# Lecture 52–54

# Service Discovery, Inter-Service Communication and Serverless Architecture

**Course Outcome:** CO5 – Demonstrate effective team collaboration skills.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 52–54 (combined session) |
| Unit | Unit V – Advanced Topics |
| Topic | Service Discovery and Service Registration (Consul, Eureka); Communication Between Microservices (REST, messaging via RabbitMQ/Kafka); Serverless Architecture and Functions-as-a-Service (FaaS) |
| Course Outcome | CO5 |
| Bloom's Knowledge Level | Understand → Apply → Analyze (progressive across the session) |
| Skills Developed | Explaining client-side vs server-side discovery and registry health checks; comparing synchronous REST with asynchronous messaging and choosing per interaction; analyzing serverless trade-offs (cold starts, statelessness, cost model); designing an event-driven flow across services |
| Applications | Kubernetes/DNS-based discovery, Consul and Eureka registries in enterprise microservice fleets; Kafka event pipelines in e-commerce and fintech; RabbitMQ work queues; AWS Lambda and Google Cloud Functions for image processing, webhooks, scheduled jobs and IoT ingestion |
| PBL Activity | Extend the SMS microservice decomposition from L49–L51: register the Attendance and Notification services in a registry, connect them with a message broker (attendance.marked → notification), and migrate one endpoint to a serverless function; present the target architecture in a team review |
| Assessment Method | Architecture design task + hands-on broker/registry demonstration + team architecture review with rubric (viva-style justification) |

---

## Part A – Theory

### 1. Introduction

In Lectures 49–51 we decomposed the Student Management System (SMS) into services and used the Redis adapter to let independent Socket.io instances exchange messages. That raised two practical questions we deferred:

1. **How do services find each other** when they run on changing hosts and ports, scale up and down, and restart?
2. **How should services talk** — synchronous request/response, or asynchronous events?

Lecture 52 answers the first with **service discovery and registration**. Lecture 53 answers the second by comparing **REST vs messaging** and introducing brokers (RabbitMQ, Kafka). Lecture 54 introduces **serverless / Functions-as-a-Service**, a deployment model where the platform manages servers, scaling, and idle cost entirely — a natural home for event-driven, bursty work like notifications.

By the end of this session, students will be able to:

1. Explain service registration, health checks, and client-side vs server-side discovery.
2. Choose between synchronous REST and asynchronous messaging for a given interaction and justify it.
3. Describe the FaaS execution model and evaluate when serverless is (and is not) appropriate.
4. Design an event-driven flow connecting the SMS services, with at least one serverless consumer.

---

### 2. Service Discovery and Registration (Lecture 52)

#### 2.1 The problem

Hard-coding `http://10.0.0.7:4001` for the Attendance service breaks the moment that service scales to three replicas, moves hosts, or restarts on a new port. Containers make this the *normal* case, not the exception.

#### 2.2 The registry pattern

A **service registry** is a highly available directory of currently healthy instances.

- **Registration:** an instance registers itself (`service name`, `host`, `port`, `health endpoint`) on startup and deregisters on shutdown.
- **Health checks:** the registry (or the instance) periodically probes the health endpoint; unhealthy instances are removed.
- **Lookup:** a client asks the registry for live instances of a service name and picks one (round-robin, least-connections, etc.).

**Client-side discovery:** the client queries the registry and load-balances itself. Fewer hops, but every client needs discovery logic (e.g., Eureka + Ribbon/Spring Cloud LoadBalancer).

**Server-side discovery:** the client calls a stable router/load-balancer, which consults the registry and forwards. Clients stay simple; the router is a critical component (e.g., an API gateway, Kubernetes Service + kube-proxy).

#### 2.3 Registry implementations

| Registry | Model | Notes |
|---|---|---|
| **Consul** | Client-side or via DNS; built-in health checks, KV store | Multi-datacenter, service mesh friendly |
| **Eureka** | Client-side; Spring Cloud ecosystem | AP-oriented; clients cache the registry |
| **Kubernetes DNS** | Server-side; every Service gets a stable DNS name | `attendance.default.svc.cluster.local` |

> **Key idea:** discovery replaces static addresses with a *name* that resolves to a live, healthy instance. Kubernetes makes DNS the registry, which is why most modern deployments rarely configure Consul or Eureka by hand.

#### 2.4 Discovery flow (diagram)

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 300" width="100%" role="img" aria-label="Service registration and discovery flow">
  <defs>
    <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#333"/>
    </marker>
  </defs>
  <rect x="290" y="20" width="180" height="60" rx="8" fill="#eef4ff" stroke="#3b6ea5" stroke-width="1.5"/>
  <text x="380" y="45" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="bold">Service Registry</text>
  <text x="380" y="63" text-anchor="middle" font-family="sans-serif" font-size="12">(Consul / Eureka / K8s DNS)</text>

  <rect x="40" y="200" width="170" height="60" rx="8" fill="#f2fff2" stroke="#3a8a3a" stroke-width="1.5"/>
  <text x="125" y="225" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold">Attendance Service</text>
  <text x="125" y="243" text-anchor="middle" font-family="sans-serif" font-size="11">instance A :4001</text>

  <rect x="290" y="200" width="170" height="60" rx="8" fill="#f2fff2" stroke="#3a8a3a" stroke-width="1.5"/>
  <text x="375" y="225" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold">Attendance Service</text>
  <text x="375" y="243" text-anchor="middle" font-family="sans-serif" font-size="11">instance B :4002</text>

  <rect x="550" y="200" width="170" height="60" rx="8" fill="#fff7e6" stroke="#b07d2b" stroke-width="1.5"/>
  <text x="635" y="225" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold">Notification Client</text>
  <text x="635" y="243" text-anchor="middle" font-family="sans-serif" font-size="11">needs attendance</text>

  <line x1="180" y1="170" x2="330" y2="82" stroke="#333" stroke-width="1.5" marker-end="url(#arr)"/>
  <text x="200" y="120" font-family="sans-serif" font-size="11" fill="#333">1. register + heartbeat</text>

  <line x1="380" y1="170" x2="365" y2="82" stroke="#333" stroke-width="1.5" marker-end="url(#arr)"/>
  <text x="400" y="120" font-family="sans-serif" font-size="11" fill="#333">2. register + heartbeat</text>

  <line x1="600" y1="170" x2="440" y2="82" stroke="#333" stroke-width="1.5" marker-end="url(#arr)"/>
  <text x="470" y="120" font-family="sans-serif" font-size="11" fill="#333">3. lookup("attendance")</text>

  <line x1="550" y1="230" x2="465" y2="230" stroke="#333" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#arr)"/>
  <text x="470" y="218" font-family="sans-serif" font-size="11" fill="#333">4. call a healthy instance</text>

  <text x="380" y="150" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#555">registry evicts instances that fail health checks</text>
</svg>

---

### 3. Communication Between Microservices (Lecture 53)

#### 3.1 Synchronous vs asynchronous

| Aspect | Synchronous (REST/gRPC) | Asynchronous (messaging) |
|---|---|---|
| Coupling | Caller waits; temporal coupling | Producer does not wait; decoupled |
| Failure mode | Caller fails if callee is down | Message queues/buffers; callee catches up later |
| Latency | Round-trip per call | Fire-and-forget; eventual processing |
| Best for | Queries the caller needs *now* (e.g., get student profile) | Side effects and events (e.g., attendance marked → notify) |
| Complexity | Simple to reason about | Broker, idempotency, ordering, retries |

> **Rule of thumb:** use REST for **queries the caller must have to continue**, and messaging for **events that describe something already happened** and that zero or many consumers may react to.

#### 3.2 REST and gRPC

- **REST over HTTP/JSON:** ubiquitous, human-readable, cacheable. Fine for internal service calls at moderate scale.
- **gRPC:** HTTP/2, Protobuf, strongly typed, streaming. Better for high-throughput internal calls and cross-language contracts.
- Guard every synchronous call with **timeouts, retries with backoff, and a circuit breaker** — a slow callee must not exhaust the caller.

#### 3.3 Brokers: RabbitMQ vs Kafka

| Aspect | RabbitMQ | Kafka |
|---|---|---|
| Model | Message broker; smart broker, dumb consumer | Distributed log; dumb broker, smart consumer |
| Delivery | Work queues, routing exchanges, acknowledgements | Append-only partitioned log; consumer groups |
| Retention | Removed after consumption | Retained for a configured period; replayable |
| Ordering | Per-queue | Per-partition |
| Best for | Task distribution, RPC-style jobs | Event streaming, event sourcing, audit pipelines |

#### 3.4 Delivery semantics and idempotency

Messages can be delivered **at-most-once**, **at-least-once** (the usual choice), or **exactly-once** (only at the broker/log level; end-to-end is a systems problem). With at-least-once, consumers **must be idempotent** — processing the same `attendance.marked` event twice must not send two notifications. Common approach: store a processed `eventId` and skip duplicates.

#### 3.5 Event-driven flow (diagram)

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 340" width="100%" role="img" aria-label="Event-driven communication through a message broker">
  <defs>
    <marker id="arr2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#333"/>
    </marker>
  </defs>
  <rect x="30" y="130" width="170" height="70" rx="8" fill="#f2fff2" stroke="#3a8a3a" stroke-width="1.5"/>
  <text x="115" y="158" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold">Attendance Service</text>
  <text x="115" y="176" text-anchor="middle" font-family="sans-serif" font-size="11">publishes event</text>
  <text x="115" y="190" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#555">attendance.marked</text>

  <rect x="305" y="20" width="170" height="110" rx="8" fill="#eef4ff" stroke="#3b6ea5" stroke-width="1.5"/>
  <text x="390" y="50" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold">Message Broker</text>
  <text x="390" y="70" text-anchor="middle" font-family="sans-serif" font-size="11">RabbitMQ / Kafka</text>
  <text x="390" y="90" text-anchor="middle" font-family="sans-serif" font-size="11">topic: sms.events</text>
  <text x="390" y="108" text-anchor="middle" font-family="sans-serif" font-size="11">buffers, retries, replay</text>

  <rect x="580" y="30" width="170" height="70" rx="8" fill="#fff7e6" stroke="#b07d2b" stroke-width="1.5"/>
  <text x="665" y="58" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold">Notification Service</text>
  <text x="665" y="76" text-anchor="middle" font-family="sans-serif" font-size="11">push via WebSocket</text>

  <rect x="580" y="140" width="170" height="70" rx="8" fill="#fff7e6" stroke="#b07d2b" stroke-width="1.5"/>
  <text x="665" y="168" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold">Analytics Service</text>
  <text x="665" y="186" text-anchor="middle" font-family="sans-serif" font-size="11">consumes same event</text>

  <rect x="580" y="250" width="170" height="70" rx="8" fill="#fff0f0" stroke="#b04a4a" stroke-width="1.5"/>
  <text x="665" y="278" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold">Serverless Function</text>
  <text x="665" y="296" text-anchor="middle" font-family="sans-serif" font-size="11">email/SMS dispatch</text>

  <line x1="200" y1="165" x2="300" y2="120" stroke="#333" stroke-width="1.5" marker-end="url(#arr2)"/>
  <text x="205" y="125" font-family="sans-serif" font-size="11">publish</text>

  <line x1="475" y1="60" x2="575" y2="65" stroke="#333" stroke-width="1.5" marker-end="url(#arr2)"/>
  <line x1="475" y1="80" x2="575" y2="170" stroke="#333" stroke-width="1.5" marker-end="url(#arr2)"/>
  <line x1="475" y1="100" x2="575" y2="280" stroke="#333" stroke-width="1.5" marker-end="url(#arr2)"/>
  <text x="480" y="30" font-family="sans-serif" font-size="11" fill="#333">fan-out to consumers</text>
</svg>

The producer is decoupled from *how many* consumers exist. Adding the Analytics service or a serverless email function requires no change to the Attendance service — the broker handles fan-out.

---

### 4. Serverless and Functions-as-a-Service (Lecture 54)

#### 4.1 What "serverless" means

There are still servers — students do not manage them. The platform handles provisioning, scaling (including to zero), patching, and high availability. You deploy a **function** (or a managed container) and pay per invocation and duration rather than per idle hour.

**FaaS characteristics:**

- **Event-triggered:** HTTP, queue message, object upload, schedule, database change.
- **Stateless per invocation:** no in-memory state survives between calls; persist to a database or object store.
- **Bounded execution:** timeouts (seconds to minutes), memory limits, cold starts.
- **Scale to zero:** idle cost is ~zero; scale-out is automatic and near-instant.

#### 4.2 FaaS vs long-lived services

| Aspect | Long-lived service (container) | FaaS function |
|---|---|---|
| Connection state | Persistent (DB pools, WebSockets) | No persistent connections across invocations |
| Cold start | None (always warm) | Possible latency spike |
| Cost model | Pay for uptime | Pay per invocation + duration |
| Scaling | Configured (HPA etc.) | Automatic, including to zero |
| Best for | APIs, WebSocket servers, steady traffic | Bursty, event-driven, glue, scheduled jobs |

> **Key insight:** the Notification Service in our SMS keeps **long-lived WebSocket connections**, so it is a poor fit for FaaS. The **email/SMS dispatch** triggered by `attendance.marked` is bursty and stateless — an ideal serverless function. Choosing per workload, not per fashion, is the skill.

#### 4.3 Deployment models side by side (diagram)

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 300" width="100%" role="img" aria-label="Long-lived microservice versus serverless function deployment">
  <defs>
    <marker id="arr3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#333"/>
    </marker>
  </defs>
  <text x="200" y="28" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="bold">Long-lived microservice</text>
  <text x="590" y="28" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="bold">Serverless function</text>

  <rect x="50" y="55" width="300" height="210" rx="10" fill="#fafafa" stroke="#bbb" stroke-width="1.5"/>
  <rect x="80" y="80" width="240" height="50" rx="6" fill="#eef4ff" stroke="#3b6ea5"/>
  <text x="200" y="110" text-anchor="middle" font-family="sans-serif" font-size="13">Container (always warm)</text>
  <rect x="80" y="145" width="240" height="50" rx="6" fill="#f2fff2" stroke="#3a8a3a"/>
  <text x="200" y="175" text-anchor="middle" font-family="sans-serif" font-size="13">DB pool + WebSocket state</text>
  <rect x="80" y="210" width="240" height="40" rx="6" fill="#fff7e6" stroke="#b07d2b"/>
  <text x="200" y="235" text-anchor="middle" font-family="sans-serif" font-size="12">pay for uptime</text>

  <rect x="440" y="55" width="300" height="210" rx="10" fill="#fafafa" stroke="#bbb" stroke-width="1.5"/>
  <rect x="470" y="80" width="240" height="50" rx="6" fill="#eef4ff" stroke="#3b6ea5"/>
  <text x="590" y="110" text-anchor="middle" font-family="sans-serif" font-size="13">Invocation (cold/warm)</text>
  <rect x="470" y="145" width="240" height="50" rx="6" fill="#fff0f0" stroke="#b04a4a"/>
  <text x="590" y="175" text-anchor="middle" font-family="sans-serif" font-size="13">stateless — no pool, no socket</text>
  <rect x="470" y="210" width="240" height="40" rx="6" fill="#fff7e6" stroke="#b07d2b"/>
  <text x="590" y="235" text-anchor="middle" font-family="sans-serif" font-size="12">pay per invocation + duration</text>

  <line x1="350" y1="160" x2="440" y2="160" stroke="#333" stroke-width="1.5" stroke-dasharray="6 4" marker-end="url(#arr3)"/>
  <text x="395" y="150" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#555">scale to zero</text>
</svg>

#### 4.4 Cold starts and mitigations

A **cold start** is the latency of initializing a function instance (runtime, dependencies). Mitigations: provisioned concurrency (keep N warm), smaller packages, faster runtimes, or use a long-lived service for latency-critical paths. Cold starts are usually acceptable for asynchronous/event work, less so for synchronous user-facing APIs.

#### 4.5 Serverless pitfalls

- **Statelessness:** cannot hold DB pools or WebSocket connections across invocations — use managed connection brokers (e.g., RDS Proxy, API Gateway WebSockets).
- **Vendor lock-in:** event sources, IAM, and deployment tooling are provider-specific.
- **Observability:** distributed tracing is essential; per-invocation logs need aggregation.
- **Cost surprises:** high steady throughput can be cheaper on containers; the pay-per-invocation model rewards burstiness, not constant load.

---

## Part B – Installation

```bash
# from the SMS project root (continuing L49–L51 work)
npm install amqplib           # RabbitMQ client
npm install kafkajs           # Kafka client (alternative)
npm install consul            # Consul client (optional, for local registry demo)

# Serverless local tooling (optional)
npm install -g serverless     # Serverless Framework
npm install -g @google-cloud/functions-framework

# Broker and registry via Docker (recommended for the hands-on)
docker run -d --name sms-rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management
docker run -d --name sms-consul -p 8500:8500 consul agent -dev -client=0.0.0.0
```

Verify:

```bash
node -e "const amqp=require('amqplib'); console.log('amqplib ok')"
curl -s http://localhost:8500/v1/status/leader && echo " <- consul up"
```

---

## Part C – Hands-On

### Task 1 – Register the Attendance service in Consul and discover it

Register a service via the Consul HTTP API (simulating what a service does at startup):

```bash
curl -X PUT http://localhost:8500/v1/agent/service/register -d '{
  "Name": "attendance",
  "ID": "attendance-1",
  "Address": "127.0.0.1",
  "Port": 4001,
  "Check": {
    "HTTP": "http://127.0.0.1:4001/health",
    "Interval": "5s",
    "Timeout": "1s"
  }
}'
```

Discover healthy instances from Node.js:

```js
// discover.js
const fetch = (...a) => import('node-fetch').then(m => m.default(...a));
(async () => {
  const res = await fetch('http://localhost:8500/v1/health/service/attendance?passing=true');
  const instances = await res.json();
  console.log('healthy attendance instances:',
    instances.map(i => `${i.Service.Address}:${i.Service.Port}`));
})();
```

**Checkpoint:** Stop the Attendance service's `/health` endpoint and re-run `discover.js` after ~10 seconds. Explain why the instance disappears from the `passing=true` list and how a client benefits from this.

---

### Task 2 – Asynchronous event: `attendance.marked` via RabbitMQ

Producer (inside the Attendance service):

```js
const amqp = require('amqplib');
async function publishAttendanceMarked(event) {
  const conn = await amqp.connect('amqp://localhost');
  const ch = await conn.createChannel();
  await ch.assertQueue('sms.events', { durable: true });
  ch.sendToQueue('sms.events', Buffer.from(JSON.stringify(event)), { persistent: true });
  await ch.close(); await conn.close();
}

publishAttendanceMarked({
  eventId: 'evt-0001',
  type: 'attendance.marked',
  classId: 'class-5A',
  studentId: 'S102',
  present: true,
  at: Date.now()
});
```

Consumer (Notification service) with **idempotency**:

```js
const amqp = require('amqplib');
const seen = new Set(); // in production: a database table of processed eventIds

(async () => {
  const conn = await amqp.connect('amqp://localhost');
  const ch = await conn.createChannel();
  await ch.assertQueue('sms.events', { durable: true });
  ch.prefetch(10);
  ch.consume('sms.events', async (msg) => {
    if (!msg) return;
    const event = JSON.parse(msg.content.toString());
    if (seen.has(event.eventId)) { ch.ack(msg); return; } // skip duplicate
    seen.add(event.eventId);
    console.log('notify:', event.studentId, 'was', event.present ? 'present' : 'absent');
    ch.ack(msg);
  });
})();
```

**Checkpoint:** Publish the *same* `eventId` twice. Confirm only one notification prints. Explain why at-least-once delivery forces this idempotency guard.

---

### Task 3 – Serverless consumer for email dispatch

Create a stateless function that consumes the same event and "sends" an email (mocked). Using the Google Functions Framework locally:

```js
// index.js (cloud function entry)
exports.sendAttendanceEmail = async (req, res) => {
  const event = req.body;
  if (event.type !== 'attendance.marked') return res.status(204).end();
  // stateless: no in-memory cache, no persistent connection
  await fetch('https://api.mail-mock.local/send', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ to: `${event.studentId}@sms.example`, subject: 'Attendance update' })
  });
  res.status(200).json({ ok: true, eventId: event.eventId });
};
```

Wire the broker to the function: a thin bridge in the Notification service forwards `sms.events` messages to the function's HTTP endpoint (in production, a queue trigger such as API Gateway / Eventarc does this natively). Run:

```bash
npx functions-framework --target=sendAttendanceEmail --port=8080
```

**Checkpoint:** Explain in two sentences why this function cannot maintain a persistent DB connection or WebSocket, and why the Notification *push* service must remain long-lived.

---

## PBL Activity

### Problem Scenario

The SMS is now a fleet of services (Student, Attendance, Notification, Result). Two student sub-teams own Attendance and Notification. They must agree on *how* to integrate without a shared deployment schedule, and the college wants email alerts handled cheaply for sporadic bursts (results day, fee deadlines).

### Student Task

In teams of 4–5:

1. **Integrate:** register Attendance and Notification in the registry (Consul or Kubernetes DNS), then connect them with `attendance.marked` via RabbitMQ or Kafka. Demonstrate end-to-end flow with a duplicate-event test proving idempotency.
2. **Classify:** for each remaining SMS interaction (e.g., "get student profile" vs "result published"), label it **synchronous REST** or **asynchronous event** and justify with the criteria in §3.1.
3. **Migrate:** choose one endpoint or job to run as a serverless function (e.g., email dispatch, nightly report). State why it fits FaaS and what would break if it needed long-lived state.
4. **Review:** present the target architecture in a 5-minute team review; peers challenge discovery choice (client vs server), delivery semantics, and serverless fit.

### Expected Learning

Students demonstrate: a working registry + broker integration with idempotency; correct sync/async classification with justification; and a defensible decision to migrate a specific workload to serverless while identifying its limits.

---

## Assessment Activity

### Assessment Method

Architecture design task + hands-on registry/broker demonstration + team architecture review with rubric and short viva.

### Evaluation Criteria

| Criterion | Expected Evidence |
|---|---|
| Conceptual Understanding | Correctly explains registration/health checks, client vs server-side discovery, sync vs async, at-least-once and FaaS statelessness in viva |
| Practical Skill | Consul registration with health check; RabbitMQ producer + idempotent consumer; serverless function responding to an event |
| Problem Solving | Sync/async classification justified; serverless migration chosen for the right workload with stated limits |
| CO Attainment (CO5) | Team review: each member explains one boundary or decision and responds to peer challenges |

---

## Summary

### Key Takeaways

- **Service discovery** replaces hard-coded addresses with a registry of healthy instances; Kubernetes DNS, Consul, and Eureka are the common forms.
- **Client-side vs server-side discovery** trade client complexity against a central router; health checks are what keep the registry honest.
- **REST/gRPC** suit synchronous queries the caller needs now; **messaging** (RabbitMQ/Kafka) suits events with zero-to-many consumers — and at-least-once delivery demands **idempotent consumers**.
- **Serverless/FaaS** is ideal for bursty, stateless, event-driven work but unsuitable for long-lived connections like the WebSocket Notification service.
- The same event (`attendance.marked`) can feed a long-lived push service, an analytics consumer, and a serverless email function with no change to the producer — the payoff of event-driven design.
