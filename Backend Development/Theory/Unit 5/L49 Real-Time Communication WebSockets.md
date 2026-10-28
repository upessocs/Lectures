# Lecture 49

# Real-Time Communication: WebSockets

**Course Outcome:** CO3 – Utilize frameworks and APIs; CO5 – Demonstrate effective team collaboration skills.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 49 |
| Unit | Unit 5: Advanced Topics |
| Topic | WebSocket architecture, handshake, and real-time use cases |
| Course Outcome | CO3, CO5 |
| Bloom's Knowledge Level | Understand |
| Skills Developed | Explaining persistent connections, tracing message flow, architecture diagramming |
| Applications | Chat, live sports scores, collaborative editing, trading dashboards |
| PBL Activity | Design a real-time notification flow for the Student Management System |
| Assessment Method | Architecture diagram and short oral explanation |

---

## Part A – Theory

### 1. Core Idea

HTTP normally follows request–response. WebSockets begin with an HTTP upgrade handshake and then maintain a two-way connection so either side can send messages when an event occurs.

### 2. Presentation Hints

Show a diagram: **Browser → HTTP Upgrade → WebSocket Server → persistent bidirectional channel**. Explain connection, open, message, error, and close events. Compare polling, long polling, and WebSockets using latency, server load, and implementation complexity.

Use a chat or live-feed example. Mention authentication, reconnection, heartbeats, message ordering, and horizontal scaling as issues students should not ignore.

## PBL Activity

Design the message flow for a student-result notification system. Identify clients, server, event, payload, and failure handling.

## Assessment Activity

Students submit one architecture diagram and answer: “Why is a WebSocket more suitable than repeated polling for this use case?”

## Summary

- WebSockets provide full-duplex communication over a persistent connection.
- The handshake starts as HTTP, but subsequent traffic is WebSocket data.
- Production designs must address security, reconnection, and scaling.

### Next Lecture

Implementing rooms, broadcasting, and events with Socket.io.
