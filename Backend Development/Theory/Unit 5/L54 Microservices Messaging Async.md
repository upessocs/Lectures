# Lecture 54

# Asynchronous Microservices Messaging

**Course Outcome:** CO5 – Demonstrate effective team collaboration skills.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 54 |
| Unit | Unit 5: Advanced Topics |
| Topic | RabbitMQ, Kafka, events, queues, and eventual consistency |
| Course Outcome | CO5 |
| Bloom's Knowledge Level | Analyze |
| Skills Developed | Event modeling, producer-consumer design, delivery and consistency analysis |
| Applications | Order processing, notifications, analytics pipelines, audit logs |
| PBL Activity | Model an event-driven result-publication workflow |
| Assessment Method | Messaging architecture case study |

---

## Part A – Theory

Messaging lets a producer continue without waiting for every consumer. Compare queues and pub/sub topics. RabbitMQ emphasizes brokers, queues, routing, acknowledgements, and consumers; Kafka emphasizes durable ordered logs, partitions, and replay.

### Presentation Hints

Explain producer, broker, exchange/topic, queue/partition, consumer, acknowledgement, retry, dead-letter handling, and idempotency. Define eventual consistency with a timeline rather than treating it as immediate synchronization.

## PBL Activity

Design events for `ResultPublished`: notification, analytics, and audit consumers. Explain what happens if one consumer is offline.

## Assessment Activity

Students justify RabbitMQ or Kafka for their scenario and identify one duplicate-delivery risk.

## Summary

- Asynchronous messaging reduces direct coupling.
- Delivery guarantees require explicit design.
- Consumers should tolerate retries and duplicates.

### Next Lecture

Serverless architecture and Function-as-a-Service.
