# Lecture 50

# Implementing WebSockets with Socket.io

**Course Outcome:** CO3 – Utilize frameworks and APIs.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 50 |
| Unit | Unit 5: Advanced Topics |
| Topic | Socket.io, rooms, events, and broadcasting |
| Course Outcome | CO3 |
| Bloom's Knowledge Level | Apply |
| Skills Developed | Event-driven programming, socket lifecycle handling, room and broadcast design |
| Applications | Group chat, multiplayer games, support dashboards, classroom notifications |
| PBL Activity | Extend a notification server with topic-based rooms |
| Assessment Method | Hands-on implementation and demonstration |

---

## Part A – Theory

Socket.io provides event names, acknowledgements, reconnection support, rooms, and broadcasting. It is not simply the raw WebSocket protocol; its client and server libraries manage additional behavior.

### Presentation Hints

Demonstrate the lifecycle: `connect → join room → emit event → server validates → broadcast → disconnect`. Compare raw `ws` and Socket.io by abstraction, fallback behavior, room support, and protocol compatibility. Explain `io.emit`, `socket.emit`, and `socket.to(room).emit` conceptually.

## Part B – Hands-On

Create a server with `join-course`, `post-announcement`, and `leave-course` events. Validate the room name and broadcast only to members of that room.

## PBL Activity

Design rooms for departments and course sections. Decide which events are private, room-scoped, or global.

## Assessment Activity

Demonstrate one room broadcast and explain how unauthorized users are prevented from joining it.

## Summary

- Events are the basic unit of Socket.io communication.
- Rooms provide logical channels without creating separate servers.
- Authentication and authorization still belong in the application design.

### Next Lecture

Why a growing application may be split into microservices.
