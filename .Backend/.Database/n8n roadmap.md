# Learning n8n Through Small Practical Use Cases

## 1. Introduction

The best way to learn **n8n** is not to start with a large automation. Start with small workflows where each workflow introduces one new concept.

The learning path in this tutorial goes from:

```text
Basic Workflow
      ↓
Data & Expressions
      ↓
Conditions
      ↓
HTTP APIs
      ↓
Webhooks
      ↓
Database
      ↓
Scheduling
      ↓
AI
      ↓
Complete Automation
```

Since n8n is fundamentally a **workflow automation platform**, the most important thing to understand is how data moves from one node to another.

## 2. The Basic n8n Mental Model

An n8n workflow generally consists of:

```text
Trigger → Process Data → Make Decision → Perform Action
```

For example:

```text
Webhook
   ↓
Validate data
   ↓
IF
 ┌─┴─┐
Yes  No
 ↓    ↓
DB   Error
```

A workflow is simply a sequence of operations where the output of one node becomes input to another node.

### Basic workflow illustration

<svg width="760" height="190" viewBox="0 0 760 190" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="190" fill="white"/>

  <rect x="30" y="55" width="150" height="70" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="105" y="84" text-anchor="middle" font-family="sans-serif" font-size="16">Trigger</text>
  <text x="105" y="107" text-anchor="middle" font-family="sans-serif" font-size="13">Start workflow</text>

  <line x1="180" y1="90" x2="270" y2="90" stroke="#333" stroke-width="2"/>
  <polygon points="270,90 258,83 258,97" fill="#333"/>

  <rect x="270" y="55" width="180" height="70" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="360" y="84" text-anchor="middle" font-family="sans-serif" font-size="16">Process</text>
  <text x="360" y="107" text-anchor="middle" font-family="sans-serif" font-size="13">Transform data</text>

  <line x1="450" y1="90" x2="540" y2="90" stroke="#333" stroke-width="2"/>
  <polygon points="540,90 528,83 528,97" fill="#333"/>

  <rect x="540" y="55" width="190" height="70" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="635" y="84" text-anchor="middle" font-family="sans-serif" font-size="16">Action</text>
  <text x="635" y="107" text-anchor="middle" font-family="sans-serif" font-size="13">Do something</text>

<text x="380" y="160" text-anchor="middle" font-family="sans-serif" font-size="13">Data flows from node to node</text> </svg>

## 3. Prerequisites

You do not need advanced programming knowledge.

It is useful to understand:

* JSON
* HTTP requests
* APIs
* Basic JavaScript
* Basic database concepts

You should also understand the following JSON structure:

```json
{
  "name": "Aarav",
  "marks": 72,
  "branch": "CSE"
}
```

n8n will frequently pass data between nodes in a similar structure.

## 4. Exercise 1 — Hello World

### Objective

Learn:

* How to create a workflow
* What a node is
* How to execute a workflow
* How to inspect node output

### Workflow

```text
Manual Trigger
      ↓
Edit Fields
```

### Step 1: Create a workflow

Create a new workflow in n8n.

Add:

**Manual Trigger**

Then add:

**Edit Fields**

Connect them.

### Step 2: Add data

In Edit Fields, create:

```text
message = Hello n8n
```

Execute the workflow.

The result should be similar to:

```json
{
  "message": "Hello n8n"
}
```

### Illustration

<svg width="650" height="170" viewBox="0 0 650 170" xmlns="http://www.w3.org/2000/svg">
  <rect width="650" height="170" fill="white"/>

  <rect x="60" y="45" width="210" height="70" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="165" y="75" text-anchor="middle" font-family="sans-serif" font-size="16">Manual Trigger</text>
  <text x="165" y="98" text-anchor="middle" font-family="sans-serif" font-size="13">Start manually</text>

  <line x1="270" y1="80" x2="380" y2="80" stroke="#333" stroke-width="2"/>
  <polygon points="380,80 368,73 368,87" fill="#333"/>

  <rect x="380" y="45" width="210" height="70" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="485" y="75" text-anchor="middle" font-family="sans-serif" font-size="16">Edit Fields</text>
  <text x="485" y="98" text-anchor="middle" font-family="sans-serif" font-size="13">message = Hello n8n</text>
</svg>

### What you learned

You have learned the basic n8n execution model:

```text
Trigger → Node → Output
```

### Task

Create three fields:

```text
name = Prateek
course = n8n
level = beginner
```

Expected output:

```json
{
  "name": "Prateek",
  "course": "n8n",
  "level": "beginner"
}
```

## 5. Exercise 2 — Expressions and Calculations

### Objective

Learn how to use data from previous nodes.

### Workflow

```text
Manual Trigger
      ↓
Edit Fields
```

Create:

```text
a = 10
b = 20
```

Create another field:

```text
sum = {{ $json.a + $json.b }}
```

The result should be:

```json
{
  "a": 10,
  "b": 20,
  "sum": 30
}
```

### Understanding `$json`

`$json` represents the JSON data available from the current input.

For example:

```text
$json.name
$json.marks
$json.email
```

If the previous node produces:

```json
{
  "name": "Aarav",
  "marks": 72
}
```

You can access:

```text
{{ $json.name }}
```

and:

```text
{{ $json.marks }}
```

### Illustration

<svg width="700" height="190" viewBox="0 0 700 190" xmlns="http://www.w3.org/2000/svg">
  <rect width="700" height="190" fill="white"/>

  <rect x="30" y="45" width="160" height="90" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="110" y="72" text-anchor="middle" font-family="sans-serif" font-size="15">Input</text>
  <text x="110" y="97" text-anchor="middle" font-family="sans-serif" font-size="13">a = 10</text>
  <text x="110" y="118" text-anchor="middle" font-family="sans-serif" font-size="13">b = 20</text>

  <line x1="190" y1="90" x2="280" y2="90" stroke="#333" stroke-width="2"/>
  <polygon points="280,90 268,83 268,97" fill="#333"/>

  <rect x="280" y="45" width="160" height="90" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="360" y="72" text-anchor="middle" font-family="sans-serif" font-size="15">Expression</text>
  <text x="360" y="100" text-anchor="middle" font-family="sans-serif" font-size="13">$json.a + $json.b</text>

  <line x1="440" y1="90" x2="530" y2="90" stroke="#333" stroke-width="2"/>
  <polygon points="530,90 518,83 518,97" fill="#333"/>

  <rect x="530" y="45" width="140" height="90" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="600" y="72" text-anchor="middle" font-family="sans-serif" font-size="15">Output</text>
  <text x="600" y="101" text-anchor="middle" font-family="sans-serif" font-size="14">sum = 30</text>
</svg>

### Task

Create a simple salary calculator.

Input:

```text
basic = 30000
hra = 10000
bonus = 5000
```

Calculate:

```text
total = basic + hra + bonus
```

## 6. Exercise 3 — IF Condition

### Objective

Learn conditional branching.

Suppose you have:

```json
{
  "name": "Aarav",
  "marks": 72
}
```

You want:

```text
marks >= 40 → Pass
marks < 40  → Fail
```

### Workflow

```text
Manual Trigger
      ↓
Edit Fields
      ↓
IF
   ┌──┴──┐
 True   False
   ↓      ↓
 Pass    Fail
```

### Illustration

<svg width="760" height="250" viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="250" fill="white"/>

  <rect x="40" y="90" width="170" height="65" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="125" y="118" text-anchor="middle" font-family="sans-serif" font-size="15">Student Data</text>
  <text x="125" y="139" text-anchor="middle" font-family="sans-serif" font-size="12">marks = 72</text>

  <line x1="210" y1="122" x2="300" y2="122" stroke="#333" stroke-width="2"/>
  <polygon points="300,122 288,115 288,129" fill="#333"/>

  <rect x="300" y="90" width="150" height="65" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="375" y="118" text-anchor="middle" font-family="sans-serif" font-size="15">IF</text>
  <text x="375" y="139" text-anchor="middle" font-family="sans-serif" font-size="12">marks ≥ 40?</text>

  <line x1="450" y1="108" x2="560" y2="65" stroke="#333" stroke-width="2"/>
  <polygon points="560,65 547,64 552,76" fill="#333"/>
  <text x="505" y="75" font-family="sans-serif" font-size="12">true</text>

  <line x1="450" y1="138" x2="560" y2="180" stroke="#333" stroke-width="2"/>
  <polygon points="560,180 549,172 546,184" fill="#333"/>
  <text x="505" y="175" font-family="sans-serif" font-size="12">false</text>

  <rect x="560" y="35" width="150" height="60" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="635" y="70" text-anchor="middle" font-family="sans-serif" font-size="15">PASS</text>

  <rect x="560" y="160" width="150" height="60" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="635" y="195" text-anchor="middle" font-family="sans-serif" font-size="15">FAIL</text>
</svg>

### Task

Create a student result workflow.

Input:

```json
{
  "name": "Rohan",
  "marks": 35
}
```

Condition:

```text
marks >= 40
```

Return different messages for Pass and Fail.

## 7. Exercise 4 — Calling an API

### Objective

Learn how n8n communicates with external applications.

The most important node here is:

**HTTP Request**

### Workflow

```text
Manual Trigger
      ↓
HTTP Request
      ↓
Edit Fields
```

Use a public API such as JSONPlaceholder for practice.

The basic concept is:

```text
n8n
 ↓
HTTP GET
 ↓
External API
 ↓
JSON response
 ↓
n8n
```

### Illustration

<svg width="760" height="210" viewBox="0 0 760 210" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="210" fill="white"/>

  <rect x="35" y="70" width="150" height="65" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="110" y="98" text-anchor="middle" font-family="sans-serif" font-size="15">n8n</text>
  <text x="110" y="119" text-anchor="middle" font-family="sans-serif" font-size="12">HTTP Request</text>

  <line x1="185" y1="90" x2="290" y2="90" stroke="#333" stroke-width="2"/>
  <polygon points="290,90 278,83 278,97" fill="#333"/>
  <text x="235" y="78" text-anchor="middle" font-family="sans-serif" font-size="12">GET</text>

  <rect x="290" y="50" width="180" height="105" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="380" y="82" text-anchor="middle" font-family="sans-serif" font-size="15">External API</text>
  <text x="380" y="108" text-anchor="middle" font-family="sans-serif" font-size="12">Request</text>
  <text x="380" y="129" text-anchor="middle" font-family="sans-serif" font-size="12">JSON response</text>

  <line x1="470" y1="125" x2="575" y2="125" stroke="#333" stroke-width="2"/>
  <polygon points="575,125 563,118 563,132" fill="#333"/>
  <text x="522" y="115" text-anchor="middle" font-family="sans-serif" font-size="12">JSON</text>

  <rect x="575" y="70" width="150" height="65" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="650" y="98" text-anchor="middle" font-family="sans-serif" font-size="15">Process</text>
  <text x="650" y="119" text-anchor="middle" font-family="sans-serif" font-size="12">API data</text>
</svg>

### What to inspect

After executing the HTTP Request node, inspect:

* Status code
* Headers
* JSON body
* Individual fields

For example:

```json
{
  "id": 1,
  "title": "Example post",
  "body": "Example content"
}
```

You can then access:

```text
{{ $json.id }}
{{ $json.title }}
{{ $json.body }}
```

### Task

Find a public API that returns JSON.

Create a workflow that:

1. Calls the API.
2. Extracts two fields.
3. Creates a new simplified JSON object.

Example:

```json
{
  "id": 1,
  "title": "Example"
}
```

## 8. Exercise 5 — Build Your Own API with a Webhook

### Objective

Understand one of the most useful n8n features: **Webhook**.

A webhook allows another application to send data into n8n.

### Workflow

```text
Webhook
    ↓
Edit Fields
    ↓
Respond to Webhook
```

### Illustration

<svg width="760" height="220" viewBox="0 0 760 220" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="220" fill="white"/>

  <rect x="25" y="70" width="180" height="70" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="115" y="100" text-anchor="middle" font-family="sans-serif" font-size="15">Client</text>
  <text x="115" y="122" text-anchor="middle" font-family="sans-serif" font-size="12">POST JSON</text>

  <line x1="205" y1="105" x2="300" y2="105" stroke="#333" stroke-width="2"/>
  <polygon points="300,105 288,98 288,112" fill="#333"/>

  <rect x="300" y="70" width="160" height="70" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="380" y="100" text-anchor="middle" font-family="sans-serif" font-size="15">Webhook</text>
  <text x="380" y="122" text-anchor="middle" font-family="sans-serif" font-size="12">Receive data</text>

  <line x1="460" y1="105" x2="555" y2="105" stroke="#333" stroke-width="2"/>
  <polygon points="555,105 543,98 543,112" fill="#333"/>

  <rect x="555" y="70" width="180" height="70" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="645" y="100" text-anchor="middle" font-family="sans-serif" font-size="15">Process</text>
  <text x="645" y="122" text-anchor="middle" font-family="sans-serif" font-size="12">Return response</text>

  <line x1="645" y1="140" x2="645" y2="180" stroke="#333" stroke-width="2"/>
  <polygon points="645,180 638,168 652,168" fill="#333"/>
  <text x="665" y="167" font-family="sans-serif" font-size="12">JSON response</text>
</svg>

### Example request

Suppose your webhook receives:

```json
{
  "name": "Prateek",
  "course": "Backend Development"
}
```

You can access:

```text
{{ $json.name }}
```

and:

```text
{{ $json.course }}
```

### Testing with curl

You can test the webhook from a terminal:

```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"name":"Prateek","course":"n8n"}'
```

The response could be:

```json
{
  "message": "Submission received",
  "student": "Prateek"
}
```

### What you learned

n8n can act as a lightweight API backend:

```text
Application
     ↓
Webhook
     ↓
n8n workflow
     ↓
Response
```

This is particularly useful for connecting applications without writing a complete backend service.

## 9. Exercise 6 — Connect n8n to PocketBase

This is an important exercise if you are already learning PocketBase.

The workflow will demonstrate how an automation system communicates with a database through an API.

### Use case

Create a Todo API.

A client sends:

```json
{
  "title": "Learn n8n",
  "done": false
}
```

n8n stores it in PocketBase.

### Workflow

```text
Webhook
    ↓
Validate
    ↓
HTTP Request
    ↓
PocketBase
    ↓
Respond
```

### Illustration

<svg width="820" height="240" viewBox="0 0 820 240" xmlns="http://www.w3.org/2000/svg">
  <rect width="820" height="240" fill="white"/>

  <rect x="20" y="85" width="145" height="65" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="92" y="113" text-anchor="middle" font-family="sans-serif" font-size="15">Client</text>
  <text x="92" y="134" text-anchor="middle" font-family="sans-serif" font-size="12">Todo JSON</text>

  <line x1="165" y1="117" x2="235" y2="117" stroke="#333" stroke-width="2"/>
  <polygon points="235,117 223,110 223,124" fill="#333"/>

  <rect x="235" y="85" width="135" height="65" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="302" y="113" text-anchor="middle" font-family="sans-serif" font-size="15">Webhook</text>
  <text x="302" y="134" text-anchor="middle" font-family="sans-serif" font-size="12">Receive</text>

  <line x1="370" y1="117" x2="440" y2="117" stroke="#333" stroke-width="2"/>
  <polygon points="440,117 428,110 428,124" fill="#333"/>

  <rect x="440" y="85" width="135" height="65" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="507" y="113" text-anchor="middle" font-family="sans-serif" font-size="15">Validate</text>
  <text x="507" y="134" text-anchor="middle" font-family="sans-serif" font-size="12">Check fields</text>

  <line x1="575" y1="117" x2="645" y2="117" stroke="#333" stroke-width="2"/>
  <polygon points="645,117 633,110 633,124" fill="#333"/>

  <rect x="645" y="85" width="155" height="65" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="722" y="113" text-anchor="middle" font-family="sans-serif" font-size="15">PocketBase</text>
  <text x="722" y="134" text-anchor="middle" font-family="sans-serif" font-size="12">Store record</text>
</svg>

### PocketBase collection

Create a collection:

```text
tasks
```

Fields:

```text
title   → text
done    → boolean
```

### HTTP Request

Configure an HTTP Request node to call the PocketBase REST API.

Conceptually:

```text
POST
http://your-pocketbase:8090/api/collections/tasks/records
```

Body:

```json
{
  "title": "{{ $json.title }}",
  "done": "{{ $json.done }}"
}
```

The exact URL depends on your PocketBase deployment.

### Important concept

n8n does not need direct database access.

You can have:

```text
n8n → PocketBase REST API
```

rather than:

```text
n8n → SQLite/PocketBase database files
```

This is generally a cleaner architecture.

### Task

Extend the workflow with:

```text
POST /tasks
GET /tasks
DELETE /tasks/:id
```

Build each as a separate n8n workflow.

## 10. Exercise 7 — Scheduled Automation

### Objective

Learn how to run workflows automatically without a user making a request.

Use:

**Schedule Trigger**

### Example

Run every day at 9:00 AM.

```text
Schedule Trigger
       ↓
HTTP Request
       ↓
IF
       ↓
Action
```

### Illustration

<svg width="760" height="220" viewBox="0 0 760 220" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="220" fill="white"/>

  <circle cx="100" cy="105" r="48" fill="white" stroke="#333" stroke-width="2"/>
  <line x1="100" y1="105" x2="100" y2="75" stroke="#333" stroke-width="2"/>
  <line x1="100" y1="105" x2="122" y2="118" stroke="#333" stroke-width="2"/>
  <text x="100" y="175" text-anchor="middle" font-family="sans-serif" font-size="13">Schedule</text>

  <line x1="148" y1="105" x2="255" y2="105" stroke="#333" stroke-width="2"/>
  <polygon points="255,105 243,98 243,112" fill="#333"/>

  <rect x="255" y="70" width="160" height="70" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="335" y="100" text-anchor="middle" font-family="sans-serif" font-size="15">HTTP Request</text>
  <text x="335" y="122" text-anchor="middle" font-family="sans-serif" font-size="12">Fetch data</text>

  <line x1="415" y1="105" x2="510" y2="105" stroke="#333" stroke-width="2"/>
  <polygon points="510,105 498,98 498,112" fill="#333"/>

  <rect x="510" y="70" width="110" height="70" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="565" y="100" text-anchor="middle" font-family="sans-serif" font-size="15">IF</text>
  <text x="565" y="122" text-anchor="middle" font-family="sans-serif" font-size="12">Check</text>

  <line x1="620" y1="105" x2="700" y2="105" stroke="#333" stroke-width="2"/>
  <polygon points="700,105 688,98 688,112" fill="#333"/>
  <text x="700" y="135" text-anchor="middle" font-family="sans-serif" font-size="12">Action</text>
</svg>

### Task

Create an automation that:

1. Runs every morning.
2. Calls an API.
3. Checks the response.
4. Performs an action if a condition is true.

Do not worry about email or Telegram yet. The objective is to understand scheduling.

## 11. Exercise 8 — AI Workflow

Once you understand webhooks and HTTP requests, AI integration becomes relatively straightforward.

### Use case

Create a simple question-answering API.

### Workflow

```text
Webhook
    ↓
AI Model
    ↓
Edit Fields
    ↓
Respond to Webhook
```

### Illustration

<svg width="780" height="220" viewBox="0 0 780 220" xmlns="http://www.w3.org/2000/svg">
  <rect width="780" height="220" fill="white"/>

  <rect x="25" y="70" width="150" height="70" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="100" y="100" text-anchor="middle" font-family="sans-serif" font-size="15">Client</text>
  <text x="100" y="122" text-anchor="middle" font-family="sans-serif" font-size="12">Question</text>

  <line x1="175" y1="105" x2="255" y2="105" stroke="#333" stroke-width="2"/>
  <polygon points="255,105 243,98 243,112" fill="#333"/>

  <rect x="255" y="70" width="130" height="70" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="320" y="100" text-anchor="middle" font-family="sans-serif" font-size="15">Webhook</text>
  <text x="320" y="122" text-anchor="middle" font-family="sans-serif" font-size="12">Receive</text>

  <line x1="385" y1="105" x2="465" y2="105" stroke="#333" stroke-width="2"/>
  <polygon points="465,105 453,98 453,112" fill="#333"/>

  <rect x="465" y="70" width="135" height="70" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="532" y="100" text-anchor="middle" font-family="sans-serif" font-size="15">AI Model</text>
  <text x="532" y="122" text-anchor="middle" font-family="sans-serif" font-size="12">Generate</text>

  <line x1="600" y1="105" x2="680" y2="105" stroke="#333" stroke-width="2"/>
  <polygon points="680,105 668,98 668,112" fill="#333"/>

  <rect x="680" y="70" width="80" height="70" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="720" y="100" text-anchor="middle" font-family="sans-serif" font-size="15">JSON</text>
  <text x="720" y="122" text-anchor="middle" font-family="sans-serif" font-size="12">Reply</text>
</svg>

### Example input

```json
{
  "question": "Explain Docker in simple terms"
}
```

The AI node receives:

```text
{{ $json.question }}
```

and generates an answer.

### With Ollama

If you are running Ollama locally, the architecture can be:

```text
Application
     ↓
n8n
     ↓
Ollama
     ↓
Local LLM
     ↓
n8n
     ↓
Application
```

This is a useful project because it combines:

* Webhooks
* HTTP/API communication
* JSON
* Expressions
* AI
* Response handling

## 12. Exercise 9 — Multiple Items

One of the important concepts in n8n is that a node can process multiple items.

Suppose the input contains students:

```json
[
  {
    "name": "Aarav",
    "marks": 75
  },
  {
    "name": "Diya",
    "marks": 82
  },
  {
    "name": "Rohan",
    "marks": 35
  }
]
```

The workflow can process each student.

```text
Input
  ↓
Transform
  ↓
IF
  ↓
Output
```

### Task

Create a workflow that:

1. Receives multiple students.
2. Determines Pass/Fail.
3. Produces:

```json
{
  "name": "Aarav",
  "marks": 75,
  "result": "Pass"
}
```

This introduces an important n8n concept:

**item-based data processing**.

## 13. Exercise 10 — Error Handling

Real workflows fail.

For example:

```text
HTTP Request
      ↓
API unavailable
      ↓
Workflow failure
```

Learn how to handle failures rather than assuming every request succeeds.

### Example architecture

```text
HTTP Request
      ↓
   Success
      ↓
   Continue

HTTP Request
      ↓
    Error
      ↓
Error Handler
```

Learn about:

* Error handling
* Retry strategies
* Conditional handling
* Logging
* Notifications

### Task

Create an API workflow where an unsuccessful API request produces a controlled response instead of an unexplained failure.

## 14. Mini Project — Student Assignment Collector

Now combine everything you have learned.

### Objective

Build a small backend automation that receives student assignments.

### Input

```json
{
  "student": "Aarav",
  "email": "aarav@example.com",
  "assignment": "Experiment 1",
  "submitted_at": "2026-08-14T10:30:00"
}
```

### Workflow

```text
                   ┌───────────────┐
                   │    Webhook    │
                   └───────┬───────┘
                           │
                           ↓
                   ┌───────────────┐
                   │   Validate    │
                   └───────┬───────┘
                           │
                           ↓
                   ┌───────────────┐
                   │   Check Late  │
                   └───────┬───────┘
                           │
                      ┌────┴────┐
                      │         │
                    On time    Late
                      │         │
                      └────┬────┘
                           ↓
                   ┌───────────────┐
                   │   PocketBase  │
                   └───────┬───────┘
                           │
                           ↓
                   ┌───────────────┐
                   │    Response   │
                   └───────────────┘
```

### Architecture illustration

<svg width="820" height="390" viewBox="0 0 820 390" xmlns="http://www.w3.org/2000/svg">
  <rect width="820" height="390" fill="white"/>

  <rect x="300" y="20" width="220" height="55" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="410" y="53" text-anchor="middle" font-family="sans-serif" font-size="15">Webhook</text>

  <line x1="410" y1="75" x2="410" y2="110" stroke="#333" stroke-width="2"/>
  <polygon points="410,110 403,98 417,98" fill="#333"/>

  <rect x="300" y="110" width="220" height="55" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="410" y="143" text-anchor="middle" font-family="sans-serif" font-size="15">Validate Submission</text>

  <line x1="410" y1="165" x2="410" y2="200" stroke="#333" stroke-width="2"/>
  <polygon points="410,200 403,188 417,188" fill="#333"/>

  <rect x="300" y="200" width="220" height="55" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="410" y="233" text-anchor="middle" font-family="sans-serif" font-size="15">Check Submission Time</text>

  <line x1="300" y1="227" x2="180" y2="290" stroke="#333" stroke-width="2"/>
  <polygon points="180,290 193,288 187,277" fill="#333"/>
  <text x="225" y="265" font-family="sans-serif" font-size="12">On time</text>

  <line x1="520" y1="227" x2="640" y2="290" stroke="#333" stroke-width="2"/>
  <polygon points="640,290 633,277 627,288" fill="#333"/>
  <text x="560" y="265" font-family="sans-serif" font-size="12">Late</text>

  <rect x="90" y="290" width="180" height="50" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="180" y="320" text-anchor="middle" font-family="sans-serif" font-size="14">Store: on-time</text>

  <rect x="550" y="290" width="180" height="50" rx="10" fill="white" stroke="#333" stroke-width="2"/>
  <text x="640" y="320" text-anchor="middle" font-family="sans-serif" font-size="14">Store: late</text>

  <line x1="180" y1="340" x2="350" y2="370" stroke="#333" stroke-width="2"/>
  <line x1="640" y1="340" x2="470" y2="370" stroke="#333" stroke-width="2"/>

  <rect x="350" y="350" width="120" height="35" rx="8" fill="white" stroke="#333" stroke-width="2"/>
  <text x="410" y="373" text-anchor="middle" font-family="sans-serif" font-size="13">Response</text>
</svg>

### Step-by-step implementation

#### Step 1 — Webhook

Accept:

```json
{
  "student": "Aarav",
  "email": "aarav@example.com",
  "assignment": "Experiment 1",
  "submitted_at": "2026-08-14T10:30:00"
}
```

#### Step 2 — Validation

Check:

```text
student exists
email exists
assignment exists
submitted_at exists
```

If something is missing, return an error.

#### Step 3 — Determine status

For example:

```text
submission time <= deadline
        ↓
      on-time

submission time > deadline
        ↓
       late
```

#### Step 4 — Store in PocketBase

Create:

```text
assignments
```

with fields such as:

```text
student
email
assignment
submitted_at
status
```

#### Step 5 — Return response

Example:

```json
{
  "success": true,
  "student": "Aarav",
  "assignment": "Experiment 1",
  "status": "on-time"
}
```

## 15. A Better Learning Sequence

Do not immediately start using every n8n integration.

Follow this sequence:

### Level 1 — Fundamentals

```text
1. Manual Trigger
2. Edit Fields
3. Expressions
4. IF
5. Switch
```

### Level 2 — Data

```text
6. Multiple items
7. Data transformation
8. Merge
9. Filter
10. Looping
```

### Level 3 — APIs

```text
11. HTTP Request
12. REST APIs
13. Headers
14. Query parameters
15. JSON request bodies
16. Authentication
```

### Level 4 — Events

```text
17. Webhooks
18. Webhook responses
19. Schedule Trigger
20. Event-driven workflows
```

### Level 5 — Storage

```text
21. PocketBase
22. PostgreSQL
23. MongoDB
24. Google Sheets
```

### Level 6 — Production Concepts

```text
25. Credentials
26. Error handling
27. Retries
28. Logging
29. Execution history
30. Workflow activation
```

### Level 7 — AI

```text
31. OpenAI
32. Ollama
33. Prompt construction
34. Structured output
35. AI agents
36. Tool calling
```

## 16. Small Use Cases to Build

After completing the exercises above, build these independently.

| #  | Use case                       | Main concepts            |
| -- | ------------------------------ | ------------------------ |
| 1  | Student result calculator      | Expressions, IF          |
| 2  | Todo API                       | Webhook, PocketBase      |
| 3  | Contact form processor         | Webhook, validation      |
| 4  | Daily API checker              | Schedule, HTTP           |
| 5  | Website uptime monitor         | HTTP, IF                 |
| 6  | URL status checker             | HTTP, branching          |
| 7  | Student attendance processor   | Webhook, database        |
| 8  | Assignment submission system   | Webhook, database        |
| 9  | AI question-answer API         | Webhook, AI              |
| 10 | Document summarizer            | File input, AI           |
| 11 | Daily report generator         | Schedule, database, AI   |
| 12 | Telegram notification system   | Webhook, Telegram        |
| 13 | Email notification system      | Trigger, email           |
| 14 | API-to-PocketBase synchronizer | HTTP, database           |
| 15 | Website monitoring dashboard   | Schedule, HTTP, database |

## 17. Projects That Match Your Existing Skills

Because you already work with Docker, PocketBase, APIs, Ollama, and self-hosted services, these would be particularly useful.

### Project 1 — PocketBase API Automation

```text
Client
  ↓
n8n Webhook
  ↓
Validation
  ↓
PocketBase
  ↓
Response
```

This teaches you how n8n can complement a backend rather than replace it.

### Project 2 — Self-hosted AI API

```text
Application
     ↓
n8n
     ↓
Ollama
     ↓
Local LLM
     ↓
n8n
     ↓
Application
```

### Project 3 — Server Monitoring

```text
Schedule
    ↓
Check services
    ↓
IF
 ┌──┴──┐
OK    Failed
      ↓
   Notification
```

You could monitor:

```text
PocketBase
n8n
Ollama
Pi-hole
Caddy
Nextcloud
```

### Project 4 — Automated Academic Workflow

```text
Student Submission
        ↓
     Webhook
        ↓
    Validation
        ↓
    PocketBase
        ↓
      AI
        ↓
Feedback / Report
```

This is a good example of combining traditional automation with AI.

## 18. What You Should Understand Before Moving to AI Agents

Do not jump directly to n8n AI Agents.

First make sure you understand:

```text
Trigger
   ↓
Data
   ↓
Expression
   ↓
Condition
   ↓
HTTP Request
   ↓
Database
   ↓
Error Handling
```

Then learn:

```text
LLM
 ↓
Prompt
 ↓
Structured Output
 ↓
Tool
 ↓
Agent
```

An AI agent is much easier to understand when you already understand ordinary n8n workflows.

## 19. The Most Important n8n Concepts

If you only remember ten things, remember these:

1. **Trigger** — determines when a workflow starts.
2. **Node** — performs an operation.
3. **Item** — represents a unit of data moving through the workflow.
4. **Expression** — dynamically accesses or calculates data.
5. **HTTP Request** — connects n8n to external APIs.
6. **Webhook** — allows external applications to trigger n8n.
7. **IF/Switch** — controls workflow branching.
8. **Credentials** — securely stores authentication information.
9. **Execution** — one run of a workflow.
10. **Activation** — enables a workflow to run automatically.

The central idea is:

```text
          DATA
           │
           ▼
       ┌───────┐
       │ Trigger│
       └───┬───┘
           │
           ▼
       ┌───────┐
       │Process│
       └───┬───┘
           │
           ▼
       ┌───────┐
       │ Decide│
       └───┬───┘
           │
           ▼
       ┌───────┐
       │ Action│
       └───────┘
```

Once this model is clear, most n8n workflows become combinations of the same fundamental operations.

## 20. Recommended Practice Method

For every new n8n node you learn, use this pattern:

### 1. Understand

Find out:

```text
What does this node do?
What does it receive?
What does it produce?
```

### 2. Build the smallest possible workflow

For example:

```text
Manual Trigger
      ↓
HTTP Request
```

Do not add five other nodes.

### 3. Inspect the output

Always inspect the actual JSON produced by the node.

### 4. Modify the data

Use expressions:

```text
{{ $json.field }}
```

### 5. Add a condition

For example:

```text
IF marks >= 40
```

### 6. Connect it to another system

For example:

```text
n8n → PocketBase
```

### 7. Automate it

Replace:

```text
Manual Trigger
```

with:

```text
Schedule
```

or:

```text
Webhook
```

### 8. Add error handling

Only after the basic workflow works.

This approach prevents n8n from becoming a collection of nodes that you know how to click but do not understand.

## 21. Final Learning Path

A practical progression is:

```text
                 n8n
                  │
        ┌─────────┴─────────┐
        │                   │
     Triggers              Data
        │                   │
 Manual / Webhook       JSON / Expressions
 Schedule                  │
        └─────────┬─────────┘
                  │
                  ▼
              Conditions
                  │
             IF / Switch
                  │
                  ▼
              HTTP APIs
                  │
                  ▼
              Databases
                  │
             PocketBase
                  │
                  ▼
             Automation
                  │
                  ▼
                 AI
                  │
                  ▼
           AI-powered workflows
                  │
                  ▼
             AI Agents
```

The key is to **build each level before moving to the next one**.

For your particular background, the most useful first serious project is:

```text
Webhook
   ↓
Validate JSON
   ↓
IF / Switch
   ↓
HTTP Request
   ↓
PocketBase
   ↓
Response
```

Once you can build that workflow without following a tutorial, you have the foundation needed to build substantially more complex n8n automations.
