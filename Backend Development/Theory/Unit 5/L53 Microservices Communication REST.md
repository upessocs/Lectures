# Lecture 53

# Microservices Communication with REST

**Course Outcome:** CO5 – Demonstrate effective team collaboration skills.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 53 |
| Unit | Unit 5: Advanced Topics |
| Topic | Synchronous REST calls, API gateways, timeouts, and retries |
| Course Outcome | CO5 |
| Bloom's Knowledge Level | Apply |
| Skills Developed | API contract design, request tracing, timeout and error-policy design |
| Applications | Order-payment workflows, profile aggregation, internal enterprise APIs |
| PBL Activity | Design a gateway flow for retrieving a student's complete profile |
| Assessment Method | Sequence diagram and API contract exercise |

---

## Part A – Theory

REST communication is synchronous: the caller waits for a response. Explain resource-oriented endpoints, contracts, status codes, authentication between services, timeouts, retries with backoff, circuit breakers, and correlation IDs.

### Presentation Hints

Use a sequence diagram: **Client → Gateway → Student Service → Course Service → response**. Identify the danger of a long chain of dependent calls and explain why retries must be limited and idempotent.

## PBL Activity

Design an endpoint that aggregates student, course, and attendance data. Mark one timeout and the response the client should receive.

## Assessment Activity

Evaluate the diagram for contract clarity, failure handling, and observability.

## Summary

- Synchronous REST is simple but couples response time to dependencies.
- Gateways centralize routing and cross-cutting concerns.
- Timeouts and safe retries protect the system from cascading failure.

### Next Lecture

Asynchronous messaging with RabbitMQ and Kafka.
