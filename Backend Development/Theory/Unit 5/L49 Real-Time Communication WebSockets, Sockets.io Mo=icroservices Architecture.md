# Real-Time Communication (WebSockets, Socket.io) and Microservices Architecture

**Course Outcome:** CO3 – Utilize frameworks and APIs; CO5 – Demonstrate effective team collaboration skills.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 49–51 (combined session) |
| Unit | Unit V – Advanced Topics |
| Topic | Real-Time Communication: WebSockets; Implementing WebSockets with Socket.io; Microservices Architecture: Overview and Benefits |
| Course Outcome | CO3, CO5 |
| Bloom's Knowledge Level | Understand → Apply → Analyze (progressive across the session) |
| Skills Developed | Explaining full-duplex vs request-response communication; implementing a Socket.io server and client with event handlers; analyzing monolithic vs microservices trade-offs; diagramming service boundaries and inter-service communication |
| Applications | Live chat and collaboration tools (Slack, Google Docs), live dashboards and stock tickers, multiplayer games, IoT telemetry, notification systems; microservices used by Netflix, Amazon, Uber, and e-commerce order/payment/inventory systems |
| PBL Activity | Extend the Student Management System (SMS): add a live "attendance/notification" channel via Socket.io, then decompose the SMS into candidate microservices and justify the boundaries in a team design review |
| Assessment Method | Hands-on Socket.io implementation task + team microservices design review with rubric (viva-style justification) |

---

## Part A – Theory

### 1. Introduction

In Lectures 37–48 we deployed the Student Management System (SMS) as a single backend application and automated its release. That application communicates with clients in the classic HTTP request–response style: the client asks, the server answers, and the connection's job is done. Two limitations now become visible as the SMS grows:

1. **The server cannot push data on its own.** A student waiting for a result update must keep polling `GET /results`.
2. **The application is one deployable unit.** A change to attendance logic forces a redeploy of everything, and the whole system scales as one block.

This session addresses both. Lectures 49–50 introduce **WebSockets** and **Socket.io** for full-duplex, server-initiated communication. Lecture 51 introduces **microservices architecture**, the dominant pattern for decomposing large backends into independently deployable services.

By the end of this session, students will be able to:

1. Explain the WebSocket handshake and how it differs from HTTP request–response.
2. Implement a Socket.io server and browser client with custom events, rooms, and broadcast.
3. Compare monolithic and microservices architectures and justify service boundaries for a given domain.
4. Identify the operational costs (discovery, communication, data consistency) that microservices introduce.

---

### 2. Why HTTP Alone Is Not Enough

HTTP is **stateless and client-initiated**. Common workarounds and their costs:

| Technique | How it works | Limitation |
|---|---|---|
| Short polling | Client calls `GET` every N seconds | Wasted requests, latency up to N seconds |
| Long polling | Server holds the request open until data exists | Ties up connections; awkward with proxies |
| Server-Sent Events (SSE) | Server streams events to client over HTTP | One-way only (server → client) |
| **WebSocket** | Single TCP connection upgraded from HTTP; both sides send frames anytime | Requires connection-state management |

> **Key idea:** WebSockets give a *persistent, bidirectional* channel. Once open, either peer can send a message with no request/response pairing.

---

### 3. The WebSocket Protocol

#### 3.1 Handshake

A WebSocket connection begins as an HTTP `GET` with upgrade headers:

```http
GET /socket HTTP/1.1
Host: sms.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
```

The server responds `101 Switching Protocols`. From that point the same TCP connection carries WebSocket **frames** instead of HTTP messages.

#### 3.2 Frames and lifecycle

- **Frame types:** text, binary, ping, pong, close.
- **Ping/pong:** keep the connection alive through NAT/proxies and detect dead peers.
- **Close handshake:** either side sends a close frame; the other acknowledges.
- **URL scheme:** `ws://` (plain) and `wss://` (TLS) — always use `wss://` in production.

#### 3.3 WebSocket vs HTTP

| Aspect | HTTP | WebSocket |
|---|---|---|
| Direction | Client → server request, server → client response | Bidirectional at any time |
| State | Stateless per request | Connection is stateful |
| Overhead per message | Full headers each request | 2–14 byte frame header |
| Server push | Not native | Native |
| Scaling | Stateless, easy to load-balance | Needs sticky sessions or a shared pub/sub layer |

---

### 4. Socket.io

Raw WebSockets are low-level. **Socket.io** is a library (Node.js server + browser client) that adds:

- **Named events** — `socket.emit('event', payload)` and `socket.on('event', handler)`.
- **Automatic reconnection** with backoff.
- **Rooms** — logical groups; `socket.join('class-5A')`, then `io.to('class-5A').emit(...)`.
- **Broadcasting** — send to everyone except the sender, or to a room.
- **Fallback transports** — falls back to HTTP long-polling if WebSocket is blocked (important in restrictive networks).
- **Acknowledgements** — request/response-style callbacks over the socket.

#### 4.1 Server essentials

```js
const { Server } = require('socket.io');
const io = new Server(httpServer, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('connected', socket.id);

  socket.on('join', (room) => socket.join(room));

  socket.on('attendance:mark', (payload) => {
    // persist, then broadcast to the room
    io.to(payload.classId).emit('attendance:update', payload);
  });

  socket.on('disconnect', (reason) => {
    console.log('disconnected', socket.id, reason);
  });
});
```

#### 4.2 Client essentials

```js
const socket = io('http://localhost:3000');

socket.on('connect', () => {
  socket.emit('join', 'class-5A');
});

socket.on('attendance:update', (data) => {
  renderAttendance(data);
});
```

#### 4.3 Scaling WebSockets

A single Node process holds its connections in memory. With multiple instances behind a load balancer:

- **Sticky sessions** keep a client on the same instance, **or**
- Use the **Socket.io Redis adapter** so `io.to(room).emit(...)` reaches clients on *all* instances via Redis pub/sub.

> This is the first hint of the next topic: independent processes communicating through a message broker is exactly the microservices communication pattern.

---

### 5. Microservices Architecture

#### 5.1 Monolith vs microservices

| Aspect | Monolith | Microservices |
|---|---|---|
| Deployment | One artifact | Many independently deployable services |
| Scaling | Scale whole app | Scale hot services only |
| Technology | Single stack | Polyglot possible |
| Data | Single database | Database per service (recommended) |
| Failure | One bug can take down all | Failures can be isolated (with circuit breakers) |
| Complexity | Low operational, high coupling over time | High operational, low coupling |
| Team fit | One team | Multiple teams owning services |

#### 5.2 When microservices are justified

Adopt microservices when **organizational and scaling forces** demand it:

- Multiple teams need independent release cadences.
- One component (e.g., notifications, search) has radically different scaling needs.
- Different components need different technology or compliance boundaries.

Do **not** start a small project as microservices — the operational cost (discovery, tracing, deployment pipelines, data consistency) usually outweighs the benefit. Start modular-monolith, extract services when a boundary proves painful.

#### 5.3 Core concerns

1. **Service boundaries** — align with business capabilities (Domain-Driven Design bounded contexts), not technical layers. *Bad:* "Database service", "Logic service". *Good:* "Enrollment service", "Attendance service", "Notification service".
2. **Communication** — synchronous REST/gRPC for queries; asynchronous messaging (RabbitMQ, Kafka) for events. Covered in L53.
3. **Service discovery & registration** — services find each other dynamically (Consul, Eureka). Covered in L52.
4. **Data consistency** — no distributed transactions; use sagas, event sourcing, and idempotent consumers.
5. **Observability** — centralized logging, distributed tracing (OpenTelemetry), health checks.

#### 5.4 Decomposition of the SMS (worked example)

```text
Student Management System (monolith)
        │
        ├── Student Service        (profiles, enrollment)
        ├── Attendance Service     (marking, reports)  ── publishes attendance.marked
        ├── Notification Service   (consumes events, pushes via WebSocket/email)
        └── Result Service         (grades, transcripts)
```

The **Notification Service** is a natural first extraction: it already speaks WebSockets (L49–L50), has different scaling characteristics (many long-lived connections), and consumes events rather than serving synchronous queries.

---

## Part B – Installation

```bash
# from the SMS project root
npm init -y
npm install express socket.io
npm install -D nodemon

# Redis adapter (optional, for multi-instance scaling demo)
npm install @socket.io/redis-adapter redis
```

Verify:

```bash
node -e "const {Server}=require('socket.io'); console.log('socket.io ok', typeof Server)"
```

---

## Part C – Hands-On

### Task 1 – Minimal WebSocket echo server

Create `server.js`:

```js
const http = require('http');
const { Server } = require('socket.io');

const httpServer = http.createServer((req, res) => {
  res.end('SMS realtime server running');
});
const io = new Server(httpServer, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('client connected:', socket.id);
  socket.on('echo', (msg) => socket.emit('echo:reply', `server got: ${msg}`));
  socket.on('disconnect', () => console.log('client left:', socket.id));
});

httpServer.listen(3000, () => console.log('listening on :3000'));
```

Create `public/client.html`:

```html
<!doctype html>
<html>
<body>
  <input id="msg" placeholder="type a message" />
  <button id="send">Send</button>
  <ul id="log"></ul>
  <script src="/socket.io/socket.io.js"></script>
  <script>
    const socket = io();
    const log = (t) => {
      const li = document.createElement('li');
      li.textContent = t;
      document.getElementById('log').appendChild(li);
    };
    document.getElementById('send').onclick = () => {
      socket.emit('echo', document.getElementById('msg').value);
    };
    socket.on('echo:reply', log);
  </script>
</body>
</html>
```

Serve `public/` statically from Express (or via `httpServer`), open two browser tabs, and confirm each tab sees its own reply.

**Checkpoint:** The server log shows two distinct `socket.id`s. Explain in one line why the replies are not shared between tabs.

---

### Task 2 – Rooms and broadcast (attendance channel)

Add to `server.js`:

```js
io.on('connection', (socket) => {
  socket.on('join', (room) => {
    socket.join(room);
    socket.to(room).emit('presence', `${socket.id} joined ${room}`);
  });

  socket.on('attendance:mark', ({ classId, studentId, present }) => {
    const event = { classId, studentId, present, at: Date.now() };
    io.to(classId).emit('attendance:update', event); // everyone in room
    socket.broadcast.emit('audit', { ...event, by: socket.id }); // everyone else
  });
});
```

On the client, emit `join` with `class-5A`, then emit `attendance:mark`. Open three tabs joined to the same room and confirm:

- All three receive `attendance:update`.
- Only the *other* tabs receive `audit`.

**Checkpoint question:** Why does `socket.broadcast.emit` exclude the sender, while `io.to(room).emit` does not?

---

### Task 3 – Scale to two instances with the Redis adapter

Run two server instances on ports 3000 and 3001. Without the adapter, a client on :3000 does not see messages emitted from :3001. Add:

```js
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

const pub = createClient(); const sub = pub.duplicate();
await Promise.all([pub.connect(), sub.connect()]);
io.adapter(createAdapter(pub, sub));
```

Connect one browser tab to each port, join the same room, and re-run Task 2. Now both tabs receive the update.

**Checkpoint:** Write a two-sentence explanation of why the Redis adapter is necessary and how it foreshadows inter-service messaging in microservices.

---

## PBL Activity

### Problem Scenario

The SMS team has been asked for (a) **real-time attendance and notification** and (b) a plan to let the **Notification** and **Attendance** capabilities be developed and deployed independently by two different student sub-teams.

### Student Task

In teams of 4–5:

1. **Build:** extend your SMS backend with a Socket.io `attendance` room per class and a `notification` event. Connect it to your existing Express app from earlier lectures.
2. **Design:** draw a target microservices decomposition of the SMS (minimum: Student, Attendance, Notification, Result). For each service, state its responsibility, the data it owns, and one synchronous and one asynchronous interaction with another service.
3. **Justify:** identify which service you would extract *first* and why — using the scaling, team-ownership, and failure-isolation criteria from §5.
4. **Review:** run a 5-minute design review per team; peers challenge boundaries using the "database service / logic service" anti-pattern as a probe.

### Expected Learning

Students demonstrate: a working real-time channel with rooms; the ability to reason about stateful connection scaling; and a defensible, business-aligned service decomposition with explicit trade-offs rather than a layer-based split.

---

## Assessment Activity

### Assessment Method

Hands-on implementation (Task 1–3) + team microservices design review with rubric and short viva.

### Evaluation Criteria

| Criterion | Expected Evidence |
|---|---|
| Conceptual Understanding | Correctly explains handshake, rooms vs broadcast, and monolith vs microservices trade-offs in viva |
| Practical Skill | Socket.io server + client with join/room/attendance events working across two browser tabs; Redis adapter demo working across two ports |
| Problem Solving | Service decomposition diagram with responsibilities, data ownership, and sync vs async interactions; first-extraction choice justified |
| CO Attainment (CO3) | Uses Socket.io framework correctly as an API layer; emits and handles events with proper payloads |
| CO Attainment (CO5) | Team design review: each member explains a boundary and responds to peer challenges |

---

## Summary

### Key Takeaways

- HTTP is client-initiated and stateless; **WebSockets** upgrade a single connection to full-duplex and let the server push data.
- **Socket.io** adds named events, rooms, broadcast, reconnection, and fallback transports over raw WebSockets; scaling stateful connections needs **sticky sessions or a shared adapter (Redis)**.
- **Microservices** decompose a backend into independently deployable, business-aligned services — powerful for team autonomy and selective scaling, costly in operational complexity and data consistency.
- The **Notification Service** (WebSocket-based, event-consuming) is the natural first extraction from the SMS monolith.
- Independent processes communicating via a broker — the Redis-adapter pattern — is a small-scale rehearsal of inter-service messaging.
