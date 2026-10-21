# Lecture 40

# Monitoring Backend Applications

**Course Outcome:** CO4 – Apply security best practices and conduct testing.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 40 |
| Unit | Unit 4: Deployment and DevOps |
| Topic | Logging, Performance Monitoring |
| Course Outcome | CO4 |
| Bloom's Knowledge Level | Understand |
| Skills Developed | Setting up logging, using monitoring tools |
| Applications | Production observability |
| PBL Activity | Adding logging to the Student API |
| Assessment Method | Assignment |

---

## Part A – Theory

### 1. Introduction
In production, your application *will* fail. Monitoring and logging allow you to detect these failures before your users do.
- **Logging:** Recording events (e.g., "User logged in", "DB Connection Failed").
- **Monitoring:** Tracking metrics over time (e.g., "CPU Usage", "Request Latency", "Error Rate").

### 2. Implementation
For Django, use the built-in `logging` module. Configure `settings.py` to send logs to a file or a logging service (like Sentry or ELK Stack).

---

## Part B – Hands-On

### Task: Implement Structured Logging
In `settings.py`, configure logging:
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'django_debug.log',
        },
    },
    'root': {
        'handlers': ['file'],
        'level': 'INFO',
    },
}
```

---

## PBL Activity
*Hint: Log the execution time of slow views, not just errors.*

### Problem Scenario
Users are reporting that the API becomes unresponsive during peak hours. You don't know why.

### Student Task
Add logging to your API to track when requests start and end, and log any database errors.

---

## Assessment Activity
*Hint: Practice using command-line tools like `tail -f django_debug.log` to watch logs in real-time.*

### Evaluation Criteria
| Criterion | Expected Evidence |
|---|---|
| Logging Setup | Logs are correctly written to `django_debug.log` |
| Utility | Logs provide enough info to debug a basic view failure |
