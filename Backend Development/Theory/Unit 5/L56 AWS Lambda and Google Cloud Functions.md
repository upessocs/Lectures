# Lecture 56

# Building Serverless Backends: AWS Lambda and Google Cloud Functions

**Course Outcome:** CO5 – Demonstrate effective team collaboration skills.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 56 |
| Unit | Unit 5: Advanced Topics |
| Topic | Function configuration, handlers, cold starts, and execution limits |
| Course Outcome | CO5 |
| Bloom's Knowledge Level | Apply |
| Skills Developed | Function handler design, configuration management, cloud deployment reasoning |
| Applications | API endpoints, file processing, scheduled automation, webhook handlers |
| PBL Activity | Design a cloud function for processing a student document upload |
| Assessment Method | Function design and deployment walkthrough |

---

## Part A – Theory

Explain handler, event, context, runtime, memory, timeout, environment variables, permissions, logs, and deployment package. Compare Lambda and Google Cloud Functions at the conceptual level; avoid claiming that one provider is universally better.

### Presentation Hints

Show **trigger → function handler → validation → service/database → response/log**. Discuss cold starts, warm invocations, stateless execution, least-privilege permissions, retries, and secrets.

## PBL Activity

Design the function contract for an upload event. Include input, output, timeout, error response, and permission scope.

## Assessment Activity

Students explain how they would test a function locally and observe it after deployment.

## Summary

- A function is controlled by an event and a handler contract.
- Configuration and permissions are part of the design.
- Cold starts, retries, limits, and logs must be presented honestly.

### Next Lecture

Connecting triggers and services in event-driven serverless systems.
