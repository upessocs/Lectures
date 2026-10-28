# Lecture 51

# Microservices Architecture

**Course Outcome:** CO5 – Demonstrate effective team collaboration skills.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 51 |
| Unit | Unit 5: Advanced Topics |
| Topic | Microservices benefits, challenges, and decomposition |
| Course Outcome | CO5 |
| Bloom's Knowledge Level | Analyze |
| Skills Developed | Domain decomposition, trade-off analysis, service-boundary communication |
| Applications | Payments, e-commerce catalogs, food delivery, large-scale SaaS |
| PBL Activity | Decompose the Student Management System into bounded services |
| Assessment Method | Architecture case study and peer review |

---

## Part A – Theory

Microservices organize an application as independently deployable services aligned with business capabilities. Contrast this with a monolith, but avoid presenting microservices as automatically superior.

### Presentation Hints

Discuss independent deployment, scaling, team ownership, technology choice, and fault isolation. Balance these with network latency, distributed debugging, data consistency, deployment complexity, and operational cost.

Use a decomposition diagram: **API Gateway → Student, Course, Result, Notification services**, each owning its data. Explain decomposition by business capability rather than by technical layers.

## PBL Activity

Teams propose service boundaries and defend one boundary that could create coupling.

## Assessment Activity

Peer review checks whether each service has a clear responsibility, API, owner, and failure behavior.

## Summary

- A service boundary should reflect a business capability.
- Distributed systems introduce operational and consistency costs.
- Architecture decisions must be justified by context.

### Next Lecture

Finding service instances as they scale and change.
