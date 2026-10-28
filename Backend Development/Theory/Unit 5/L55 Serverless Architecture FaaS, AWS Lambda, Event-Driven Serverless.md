# Lecture 55–57

# Building Serverless Backend Systems with AWS Lambda: SaaS, PaaS and FaaS in Context

**Course Outcome:** CO5 – Demonstrate effective team collaboration skills; CO4 – Apply security best practices and conduct testing.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 55–57 (combined session) |
| Unit | Unit V – Advanced Topics |
| Topic | Building Serverless Backend Systems: AWS Lambda; Function-as-a-Service (FaaS); SaaS, PaaS and FaaS compared; event-driven serverless architecture |
| Course Outcome | CO5, CO4 |
| Bloom's Knowledge Level | Understand → Apply → Analyze (progressive across the session) |
| Skills Developed | Writing and deploying an AWS Lambda handler in Node.js; configuring IAM execution roles with least privilege; wiring event sources (API Gateway, S3, SQS) to functions; analyzing recursion and synchronous-wait anti-patterns; positioning SaaS/PaaS/FaaS on the control spectrum |
| Applications | Serverless REST APIs via API Gateway + Lambda; S3-triggered image/file processing; SQS-buffered order/notification pipelines; scheduled jobs; FaaS as the compute model inside PaaS (e.g., Vercel/Netlify functions); SaaS products like Gmail/Slack where only configuration is available |
| PBL Activity | Extend the SMS Notification path: deploy an `attendance.marked` consumer as an AWS Lambda function behind an SQS queue, give it a least-privilege execution role that writes to S3/DynamoDB, and present the event topology with an anti-pattern audit (recursion, synchronous waits) in a team review |
| Assessment Method | Hands-on Lambda deployment (handler + IAM role + event source) + architecture review with rubric and viva on FaaS/SaaS/PaaS trade-offs |

---

## Part A – Theory

### 1. Introduction

In Lecture 54 we introduced FaaS conceptually and sketched a stateless email-dispatch function. This session makes that concrete on **AWS Lambda**, the reference implementation of FaaS, and situates FaaS correctly between **SaaS** and **PaaS** — a distinction that interviews, architecture reviews, and the course's own AI-assisted tooling choices depend on.

By the end of this session, students will be able to:

1. Write a Lambda handler in Node.js and explain the `event`/`context` contract.
2. Configure an IAM **execution role** with least privilege so the function can access only what it needs.
3. Wire an event source (API Gateway, S3, SQS) and explain sync vs async invocation.
4. Identify the two classic serverless anti-patterns: **recursive loops** and **synchronous waits**.
5. Place SaaS, PaaS, and FaaS on the control spectrum and justify a choice for a given workload.

---

### 2. SaaS, PaaS and FaaS in Brief

The three are often listed together but differ primarily in **how much the developer controls**.

| Model | What you control | What the provider manages | Typical example | Billing |
|---|---|---|---|---|
| **SaaS** | Configuration and data only — no custom code | Everything: application, runtime, servers | Gmail, Slack, Salesforce, Moodle Cloud | Per seat / per month |
| **PaaS** | Your application code and some runtime configuration | Servers, OS, scaling, patching | Heroku, Render, Google App Engine, AWS Elastic Beanstalk | Per instance-hour (even when idle) |
| **FaaS** | Individual functions (stateless code) + event triggers | Servers, runtime, scaling **including to zero** | AWS Lambda, Google Cloud Functions, Azure Functions | Per invocation + duration (idle ≈ free) |

A useful way to remember it: **SaaS gives you a finished product; PaaS gives you a running platform to deploy an app onto; FaaS gives you a place to drop a function that wakes up only when needed.**

> **Key nuance for the SMS project:** the WebSocket **Notification push service** must remain a long-lived service (container/PaaS). The **email-dispatch** step is bursty and stateless — a perfect FaaS function. Choosing per workload, not per fashion, is the skill being assessed.

---

### 3. AWS Lambda Fundamentals (Lecture 55)

#### 3.1 The handler contract

A Lambda function is a single exported handler. For Node.js, the recommended pattern is `async`:

```js
export const handler = async (event, context) => {
  // event: input payload (JSON from the trigger)
  // context: invocation metadata (request id, remaining time, etc.)
  return { statusCode: 200, body: 'ok' };
};
```

- **`event`** — trigger-specific payload. An API Gateway proxy event contains `httpMethod`, `path`, `body`; an S3 event contains `Records[].s3.bucket.name` and `object.key` .
- **`context`** — invocation info such as `context.awsRequestId` and `context.getRemainingTimeInMillis()`.
- **Handler naming** — the console setting `index.handler` means "the `handler` export in `index.mjs`/`index.js`" .

#### 3.2 A realistic handler: order receipt to S3

The AWS documentation's canonical example reads an order from the event and writes a receipt to S3 :

```js
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
const s3Client = new S3Client(); // initialized outside handler for reuse

export const handler = async (event) => {
  const bucketName = process.env.RECEIPT_BUCKET;
  if (!bucketName) throw new Error('RECEIPT_BUCKET is not set');

  const receipt = `OrderID: ${event.order_id}\nAmount: $${event.amount.toFixed(2)}\nItem: ${event.item}`;
  const key = `receipts/${event.order_id}.txt`;

  await s3Client.send(new PutObjectCommand({
    Bucket: bucketName, Key: key, Body: receipt
  }));
  return 'Success';
};
```

Two design notes worth stating explicitly in class:
- **Clients initialized outside the handler** survive across warm invocations — a legitimate, stateless-per-logical-request optimization.
- **Environment variables** (`RECEIPT_BUCKET`) keep configuration out of code, consistent with the L46 secrets discussion.

#### 3.3 Execution roles and least privilege

Every Lambda function assumes an **IAM execution role** when invoked . The trust policy must name `lambda.amazonaws.com` as the trusted principal:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "lambda.amazonaws.com" },
    "Action": "sts:AssumeRole"
  }]
}
```

The default console-created role attaches `AWSLambdaBasicExecutionRole` (CloudWatch Logs only). If the function must write to S3 or DynamoDB, attach **only** the specific permissions needed :

```bash
aws iam attach-role-policy \
  --role-name sms-attendance-consumer \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
# plus a scoped inline policy for s3:PutObject on the one receipts bucket
```

> **CO4 connection:** least-privilege IAM is a security control, not boilerplate. A function that can write only to `sms-receipts/*` cannot exfiltrate the student database even if compromised.

#### 3.4 Invocation models: sync vs async

| Model | Trigger examples | Behaviour | Error handling |
|---|---|---|---|
| **Synchronous** | API Gateway, ALB, direct `Invoke` | Caller waits for the response | Caller receives the error; retry is caller's choice |
| **Asynchronous** | S3, SNS, EventBridge | Lambda queues the event and returns `202` | Lambda retries automatically (twice by default); failures can go to a dead-letter queue |
| **Poll-based** | SQS, Kinesis, DynamoDB Streams | Lambda polls and invokes in batches | Batch failures retried; partial batch responses supported |

Most production Lambda invocations are **asynchronous**, responding to events from services like S3 or SQS, where the success of processing matters more than returning a value .

---

### 4. Event-Driven Serverless Architecture and Anti-Patterns (Lecture 56)

#### 4.1 Wiring events: the SMS topology

The SMS Notification path from L52–L54 becomes:

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 300" width="100%" role="img" aria-label="SMS attendance event topology with SQS and Lambda">
  <defs>
    <marker id="arrS" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#333"/>
    </marker>
  </defs>
  <rect x="20" y="110" width="160" height="70" rx="8" fill="#f2fff2" stroke="#3a8a3a" stroke-width="1.5"/>
  <text x="100" y="138" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold">Attendance Service</text>
  <text x="100" y="156" text-anchor="middle" font-family="sans-serif" font-size="11">publishes event</text>
  <text x="100" y="170" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#555">attendance.marked</text>

  <rect x="230" y="110" width="150" height="70" rx="8" fill="#eef4ff" stroke="#3b6ea5" stroke-width="1.5"/>
  <text x="305" y="138" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold">Amazon SQS</text>
  <text x="305" y="156" text-anchor="middle" font-family="sans-serif" font-size="11">durable buffer</text>
  <text x="305" y="170" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#555">decouples producer/consumer</text>

  <rect x="430" y="40" width="150" height="70" rx="8" fill="#fff7e6" stroke="#b07d2b" stroke-width="1.5"/>
  <text x="505" y="68" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold">Lambda: email</text>
  <text x="505" y="86" text-anchor="middle" font-family="sans-serif" font-size="11">SQS event source</text>

  <rect x="430" y="180" width="150" height="70" rx="8" fill="#fff7e6" stroke="#b07d2b" stroke-width="1.5"/>
  <text x="505" y="208" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold">Lambda: audit</text>
  <text x="505" y="226" text-anchor="middle" font-family="sans-serif" font-size="11">writes to DynamoDB</text>

  <rect x="630" y="40" width="130" height="60" rx="8" fill="#fafafa" stroke="#bbb" stroke-width="1.5"/>
  <text x="695" y="65" text-anchor="middle" font-family="sans-serif" font-size="12">SES / SNS</text>
  <text x="695" y="82" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#555">email delivery</text>

  <rect x="630" y="180" width="130" height="60" rx="8" fill="#fafafa" stroke="#bbb" stroke-width="1.5"/>
  <text x="695" y="205" text-anchor="middle" font-family="sans-serif" font-size="12">DynamoDB</text>
  <text x="695" y="222" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#555">audit table</text>

  <line x1="180" y1="145" x2="225" y2="145" stroke="#333" stroke-width="1.5" marker-end="url(#arrS)"/>
  <text x="182" y="135" font-family="sans-serif" font-size="10">send</text>

  <line x1="380" y1="130" x2="425" y2="85" stroke="#333" stroke-width="1.5" marker-end="url(#arrS)"/>
  <line x1="380" y1="160" x2="425" y2="210" stroke="#333" stroke-width="1.5" marker-end="url(#arrS)"/>
  <text x="390" y="105" font-family="sans-serif" font-size="10">poll (batch)</text>

  <line x1="580" y1="75" x2="625" y2="75" stroke="#333" stroke-width="1.5" marker-end="url(#arrS)"/>
  <line x1="580" y1="215" x2="625" y2="215" stroke="#333" stroke-width="1.5" marker-end="url(#arrS)"/>
</svg>

The **SQS queue between the producer and the Lambda function** is the standard way to decouple a fast producer from a slower consumer and to avoid the recursion trap described next .

#### 4.2 Anti-pattern 1: recursive loops

If a Lambda function writes to the same S3 bucket that triggers it, each write invokes the function again, which writes again — an infinite loop. Because both S3 and Lambda scale automatically, the loop can consume all available concurrency .

**Rule:** the resource that invokes a function should be **different** from the resource the function outputs to. In the SMS topology above, SQS invokes the email function and the function outputs to SES — no loop.

#### 4.3 Anti-pattern 2: synchronous waiting inside one function

A single function that writes to S3 and *then* writes to DynamoDB compounds the wait times sequentially. Splitting into two functions, where the S3 put triggers the second function, reduces total execution time and cost .

```text
Bad:  Lambda → S3 (wait) → DynamoDB (wait) → return
Good: Lambda → S3 → (S3 event) → Lambda → DynamoDB
```

The second Lambda returns immediately after the S3 put; the S3 service invokes the downstream function .

---

### 5. Deployment and Operations (Lecture 57)

#### 5.1 Packaging and deploying with AWS SAM

For course-sized projects, **AWS SAM** is the recommended deployment tool: it is AWS-native, free, and supports local testing . The workflow is:

```bash
sam init --app-template hello-world --name sms-attendance-consumer --runtime nodejs20.x
cd sms-attendance-consumer
sam build
sam deploy --guided
```

SAM packages the function and dependencies and deploys via a CloudFormation stack; the output includes the function ARN, the IAM role, and any API endpoint . The `template.yaml` declares the function, its runtime, handler, environment variables, and event sources:

```yaml
Resources:
  AttendanceConsumer:
    Type: AWS::Serverless::Function
    Properties:
      Handler: index.handler
      Runtime: nodejs20.x
      Environment:
        Variables:
          RECEIPT_BUCKET: !Ref ReceiptsBucket
      Policies:
        - S3WritePolicy:
            BucketName: !Ref ReceiptsBucket
      Events:
        SqsEvent:
          Type: SQS
          Properties:
            Queue: !GetAtt SmsEventsQueue.Arn
```

For local iteration, `sam local invoke` runs the function in a Docker container against a sample event file.

#### 5.2 Cost model and the free tier

Lambda bills **per request** and **per GB-second of execution time**, with no charge when code is not running . The always-free allowance is **1 million requests and 400,000 GB-seconds per month** . For the SMS project this means the email-dispatch function realistically costs nothing during the course, while a long-lived container running 24/7 would not be free.

#### 5.3 Operational checklist for the SMS Lambda

| Concern | Practice |
|---|---|
| **Least privilege** | Execution role scoped to one bucket / one table; no `*` actions |
| **Idempotency** | Store processed `eventId` in DynamoDB before side effects |
| **Timeouts** | Set a timeout shorter than the SQS visibility timeout |
| **Dead-letter queue** | Configure a DLQ for the async event source |
| **Observability** | Structured logs via `console.log(JSON.stringify(...))`; CloudWatch metrics |
| **Cold starts** | Acceptable for async work; provisioned concurrency only if latency-critical |

---

## Part B – Installation

```bash
# AWS SAM CLI (see AWS docs for OS-specific install)
# Verify:
sam --version

# Node dependencies for the handler
npm install @aws-sdk/client-s3 @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb

# AWS CLI configured with credentials (use a course IAM user, not root)
aws sts get-caller-identity
```

> **Security note (CO4):** never commit AWS access keys. Use `aws configure` locally, and in CI use short-lived credentials via OIDC, consistent with the secrets management discussed in L46.

---

## Part C – Hands-On

### Task 1 – Write and locally invoke the attendance-consumer handler

Create `index.mjs`:

```js
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = DynamoDBDocumentClient.from(new DynamoDBClient());

export const handler = async (event) => {
  // SQS event: event.Records[] each with .body
  for (const record of event.Records) {
    const payload = JSON.parse(record.body);
    if (payload.type !== 'attendance.marked') continue;

    await client.send(new PutCommand({
      TableName: process.env.AUDIT_TABLE,
      Item: {
        eventId: payload.eventId,   // idempotency key
        studentId: payload.studentId,
        classId: payload.classId,
        present: payload.present,
        at: payload.at,
      },
      ConditionExpression: 'attribute_not_exists(eventId)', // skip duplicates
    }));
  }
  return { batchItemFailures: [] };
};
```

Create `event.json` with one SQS record whose `body` is an `attendance.marked` JSON string, then run:

```bash
sam local invoke AttendanceConsumer --event event.json
```

**Checkpoint:** Run the same event twice. Explain what the `ConditionExpression` does and why it satisfies the at-least-once idempotency requirement from L53.

---

### Task 2 – Deploy with a least-privilege execution role

In `template.yaml`, declare the DynamoDB table and give the function only `dynamodb:PutItem` on that table's ARN (SAM policy template `DynamoDBCrudPolicy` is broader — prefer a scoped inline policy for this exercise). Deploy:

```bash
sam build && sam deploy --guided
```

After deployment, inspect the role in the IAM console. Confirm it has `AWSLambdaBasicExecutionRole` plus your scoped policy, and nothing else.

**Checkpoint:** Remove `dynamodb:PutItem` from the policy, redeploy, and invoke. Observe the `AccessDeniedException` in CloudWatch Logs. Explain why this is a *correct* failure demonstrating least privilege.

---

### Task 3 – Wire the SQS event source and test the end-to-end flow

Add an SQS queue to the template and attach it as an event source to the function (as shown in §5.1). Send a message:

```bash
aws sqs send-message \
  --queue-url <SmsEventsQueueUrl> \
  --message-body '{"eventId":"evt-1001","type":"attendance.marked","studentId":"S102","classId":"class-5A","present":true,"at":1730000000000}'
```

Confirm the DynamoDB audit table contains exactly one item for `evt-1001`. Send the same `eventId` again and confirm the item count is still one.

**Checkpoint:** Draw the final topology (producer → SQS → Lambda → DynamoDB) and label which components are FaaS, which are managed services, and where the idempotency guard lives.

---

## PBL Activity

### Problem Scenario

The SMS team is preparing for results day, when thousands of `result.published` events arrive within minutes. The existing Notification service (WebSocket, long-lived) handles in-app pushes, but email alerts must scale independently without running a 24/7 server.

### Student Task

In teams of 4–5:

1. **Implement:** deploy a `result.published` consumer as a Lambda function with an SQS event source, a least-privilege execution role, and a DynamoDB idempotency table. Demonstrate a duplicate-event test.
2. **Audit:** inspect the topology for the two anti-patterns from §4 — recursion (does the function output to its own trigger?) and synchronous waits (could two functions replace one?). Document the findings.
3. **Position:** classify each SMS component as **SaaS, PaaS, or FaaS** (e.g., SES = SaaS, the Node/Express Notification service = PaaS-like container, the email consumer = FaaS) and justify the boundary using the control/billing table in §2.
4. **Review:** present the deployed topology and the audit in a 5-minute team review; peers challenge the IAM scope and the idempotency design.

### Expected Learning

Students demonstrate: a working Lambda function behind an SQS event source with least-privilege IAM; correct identification of recursion and synchronous-wait risks; and a defensible SaaS/PaaS/FaaS classification tied to control and billing rather than jargon.

---

## Assessment Activity

### Assessment Method

Hands-on Lambda deployment (handler + IAM role + SQS event source + idempotency) + architecture review with rubric and viva.

### Evaluation Criteria

| Criterion | Expected Evidence |
|---|---|
| Conceptual Understanding | Explains `event`/`context`, sync vs async invocation, execution-role trust policy, and the SaaS/PaaS/FaaS control spectrum in viva |
| Practical Skill | Handler deploys via SAM; SQS triggers the function; DynamoDB receives exactly one item per `eventId`; logs show no unhandled errors |
| Problem Solving | Anti-pattern audit identifies recursion and synchronous-wait risks in a proposed topology with a concrete fix for each |
| CO Attainment (CO4) | Execution role is demonstrably least-privilege; secrets are not in code; duplicate processing is blocked |
| CO Attainment (CO5) | Team review: each member explains one decision (IAM scope, queue choice, idempotency) and responds to peer challenges |

---

## Summary

### Key Takeaways

- **SaaS** gives you a finished product (config only), **PaaS** gives you a platform for your app (pay per instance-hour), **FaaS** gives you functions that run on events (pay per invocation, idle ≈ free) — the differences are control and billing, not marketing labels.
- A Lambda handler is a single `async (event, context)` export; `event` carries the trigger payload, and clients initialized outside the handler can be reused across warm invocations .
- Every function runs under an **IAM execution role**; least privilege is a security requirement, not a formality .
- Most production invocations are **asynchronous** (S3, SQS, SNS); use **SQS between producer and function** to decouple rates and avoid runaway recursion .
- **Recursion** (function writes to its own trigger) and **synchronous waits** (sequential work in one function) are the two classic serverless anti-patterns — split functions and separate triggers from outputs.
- **AWS SAM** deploys functions via CloudFormation and supports local testing; Lambda's always-free tier (1M requests + 400K GB-seconds/month) makes the SMS email consumer effectively free for coursework .
