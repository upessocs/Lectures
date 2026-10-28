# Lecture 55

# Serverless Architecture and FaaS

**Course Outcome:** CO5 – Demonstrate effective team collaboration skills.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 55 |
| Unit | Unit 5: Advanced Topics |
| Topic | Serverless architecture and Function-as-a-Service |
| Course Outcome | CO5 |
| Bloom's Knowledge Level | Understand |
| Skills Developed | Architecture comparison, event-trigger mapping, cost and operational reasoning |
| Applications | Webhooks, image processing, scheduled jobs, bursty APIs |
| PBL Activity | Select serverless functions for an event-driven student service |
| Assessment Method | Compare-and-justify presentation task |

---

## Part A – Theory

Serverless does not mean “no servers”; the provider manages provisioning and much of the operations. In FaaS, a function runs in response to an event and is billed or measured by execution and resource use.

### Presentation Hints

Compare a long-running server with a function. Cover triggers, statelessness, automatic scaling, pay-per-use, cold starts, execution limits, observability, vendor lock-in, and unsuitable workloads.

## PBL Activity

Choose three tasks from a student portal and decide which should be a function, a container service, or a scheduled job. Justify each choice.

## Assessment Activity

Students defend one benefit and one limitation using a real use case.

## Summary

- Serverless shifts infrastructure responsibility to the provider.
- Functions should be small, stateless, and event-oriented.
- Cost, latency, limits, and lock-in affect suitability.

### Next Lecture

Deploying functions with AWS Lambda or Google Cloud Functions.
