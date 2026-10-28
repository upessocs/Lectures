# Lecture 52

# Service Discovery and Service Registration

**Course Outcome:** CO5 – Demonstrate effective team collaboration skills.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 52 |
| Unit | Unit 5: Advanced Topics |
| Topic | Consul, Eureka, registration, health checks, and dynamic routing |
| Course Outcome | CO5 |
| Bloom's Knowledge Level | Understand |
| Skills Developed | Explaining registry-based discovery, health checks, and dynamic routing |
| Applications | Cloud-native services, container orchestration, autoscaling systems |
| PBL Activity | Design discovery for three replicated backend services |
| Assessment Method | Diagram-based viva |

---

## Part A – Theory

Hard-coded service addresses fail when instances move, restart, or scale. In client-side discovery, the client queries a registry such as Eureka or Consul and selects a healthy instance. In server-side discovery, a gateway or load balancer performs that lookup.

### Presentation Hints

Show: **service starts → registers address and metadata → health check → client/gateway lookup → request → deregistration**. Explain TTLs, heartbeats, stale records, load balancing, and secure registry access.

## PBL Activity

Design discovery for Student, Course, and Notification services with two instances each. Mark what happens when one instance fails.

## Assessment Activity

Students explain the difference between service registration and service discovery using their diagram.

## Summary

- Registration publishes service location and metadata.
- Discovery finds a currently usable instance.
- Health checks and failure handling are essential.

### Next Lecture

Synchronous REST communication between services.
