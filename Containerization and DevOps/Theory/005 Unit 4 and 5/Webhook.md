# Webhook

> A **webhook** is a way for one system to **automatically send real-time data to another system when an event happens**, instead of the second system repeatedly asking (“polling”) for updates.



# 1. What is a Webhook (Simple Idea)

Think of it like this:

* **Polling approach** → “Hey, anything new? … now? … now?”
* **Webhook approach** → “I’ll call you when something happens.”

### Example

When you push code to a Git repository:

* Without webhook → Jenkins keeps checking repo every few minutes
* With webhook → Git instantly notifies Jenkins



# 2. How Webhook Works (Flow)

1. You configure a **URL (endpoint)** in a system (like Jenkins)
2. Another system (like GitHub) is told:

   > “When event X happens, send data to this URL”
3. Event occurs (e.g., code push)
4. HTTP request (POST) is sent to Jenkins
5. Jenkins triggers a job/pipeline

---

# 3. Webhook in Jenkins (Core Idea)

In **Jenkins**, a webhook is used to **trigger builds automatically** when something changes in your code repository.

---

# 4. Typical Integration with Git

Common flow using **GitHub**:

```
Developer → Push code → GitHub → Webhook → Jenkins → Build Pipeline Runs
```



# 5. Step-by-Step: Webhook with Jenkins

## Step 1: Configure Jenkins Job

* Create a job or pipeline
* Enable:

  ```
  Build Triggers → GitHub hook trigger for GITScm polling
  ```

## Step 2: Get Jenkins Webhook URL

Usually:

```
http://<jenkins-url>/github-webhook/
```

---

## Step 3: Configure Webhook in GitHub

In repository:

```
Settings → Webhooks → Add Webhook
```

Set:

* Payload URL → Jenkins webhook URL
* Content type → `application/json`
* Events → Push (or others)

---

## Step 4: Trigger Event

* Push code → webhook fires → Jenkins starts build

---

# 6. What Data is Sent?

Webhook sends JSON payload like:

```json
{
  "ref": "refs/heads/main",
  "commits": [...],
  "repository": {
    "name": "project-name"
  }
}
```

Jenkins uses this info to:

* Identify branch
* Trigger correct pipeline
* Fetch latest code

---

# 7. Webhook vs Polling in Jenkins

| Feature        | Webhook            | Polling      |
| -------------- | ------------------ | ------------ |
| Trigger time   | Instant            | Delayed      |
| Resource usage | Efficient          | Wasteful     |
| Complexity     | Needs setup        | Simple       |
| Reliability    | Depends on network | Always works |



# 8. Why Webhooks are Important in CI/CD

In a CI/CD pipeline:

* Faster feedback
* Real-time automation
* No unnecessary load
* Event-driven architecture



# 9. Real DevOps Flow

```
git push
   ↓
GitHub Webhook
   ↓
Jenkins Pipeline
   ↓
Build → Test → Deploy
```

---

# 10. Common Issues

* Jenkins not accessible (public URL needed)
* Firewall blocking requests
* Wrong webhook URL
* Missing permissions


# 12. One-Line Summary

A webhook in Jenkins is:

> **An HTTP callback that automatically triggers a build when an external event (like a Git push) occurs.**

