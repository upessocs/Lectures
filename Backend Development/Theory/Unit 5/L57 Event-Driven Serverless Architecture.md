# Lecture 57

# Event-Driven Serverless Architecture

**Course Outcome:** CO5 – Demonstrate effective team collaboration skills; CO4 – Apply security best practices and conduct testing.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 57 |
| Unit | Unit 5: Advanced Topics |
| Topic | Triggers, SQS/EventBridge, integration patterns, and reliability |
| Course Outcome | CO4, CO5 |
| Bloom's Knowledge Level | Analyze |
| Skills Developed | Event-flow analysis, reliability design, observability, security reasoning |
| Applications | File pipelines, notifications, audit workflows, IoT processing |
| PBL Activity | Design an EventBridge/SQS-style workflow for result publication |
| Assessment Method | Reliability-focused architecture review |

---

## Part A – Theory

An event-driven system reacts to facts such as `ResultPublished` rather than requiring one component to call every other component directly. Explain triggers, event buses, queues, fan-out, filtering, retries, dead-letter queues, idempotency, and least-privilege permissions.

### Presentation Hints

Draw: **S3/API trigger → EventBridge → filtered rules → Lambda functions → SQS retry queue → dead-letter queue**. Distinguish an event from a command and explain why event schemas must be versioned.

## PBL Activity

Design failure handling for a notification function that fails three times. Include retry, dead-letter review, alerting, and replay.

## Assessment Activity

Review the architecture for duplicate processing, unauthorized triggers, missing observability, and unclear ownership.

## Summary

- Events enable loose coupling and fan-out.
- Reliable event processing needs retries, dead-letter handling, and idempotency.
- Security includes both publisher and consumer permissions.

### Next Lecture

Profiling performance and presenting evidence-based optimization.
