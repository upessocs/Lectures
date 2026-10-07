# PyRunner
## From n8n to PyRunner: A Beginner's Tutorial

A short, hands-on path for beginners. You will rebuild the n8n course ideas (trigger, data, condition, HTTP, database, schedule, AI) as small Python scripts, and finish with the **Student Assignment Collector**.

---

## 1. The big idea

n8n connects visual *nodes*. PyRunner runs *Python scripts* for you, on a schedule, with their own packages and secrets. Each node becomes a function.


<svg class="dg1" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto" viewBox="0 0 700 250" width="700" height="250"><style>.dg1 text{fill:#1d1d1b;font:13px sans-serif}.dg1 .m{fill:#6b6b66;font-size:12px}.dg1 .b{fill:#fff;stroke:#8a8a84;stroke-width:1.5}.dg1 .a{fill:#eef3ff;stroke:#2f6fed;stroke-width:1.5}.dg1 .l{stroke:#6b6b66;stroke-width:1.5;fill:none}.dg1 .d{stroke:#6b6b66;stroke-width:1.5;fill:none;stroke-dasharray:5 4}</style><defs><marker id="ar1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#6b6b66"/></marker></defs>
<rect width="700" height="250" fill="#fafaf7"/>
<text x="20" y="26" class="m">n8n: one node per step</text>
<rect class="b" x="20" y="38" width="104" height="38" rx="8"/><text x="72" y="62" text-anchor="middle">Webhook</text>
<rect class="b" x="156" y="38" width="104" height="38" rx="8"/><text x="208" y="62" text-anchor="middle">Validate</text>
<rect class="b" x="292" y="38" width="104" height="38" rx="8"/><text x="344" y="62" text-anchor="middle">IF</text>
<rect class="b" x="428" y="38" width="104" height="38" rx="8"/><text x="480" y="62" text-anchor="middle">HTTP</text>
<rect class="b" x="564" y="38" width="116" height="38" rx="8"/><text x="622" y="62" text-anchor="middle">Respond</text>
<path class="l" d="M124 57H154" marker-end="url(#ar1)"/><path class="l" d="M260 57H290" marker-end="url(#ar1)"/><path class="l" d="M396 57H426" marker-end="url(#ar1)"/><path class="l" d="M532 57H562" marker-end="url(#ar1)"/>
<path class="l" d="M350 90V120" marker-end="url(#ar1)"/><text x="362" y="110" class="m">migrate</text>
<rect class="a" x="20" y="126" width="660" height="108" rx="12"/><text x="36" y="150" class="m">PyRunner: one script.py</text>
<rect class="b" x="36" y="164" width="108" height="54" rx="8"/><text x="90" y="187" text-anchor="middle">get_input()</text><text x="90" y="205" text-anchor="middle" class="m">dict</text>
<rect class="b" x="164" y="164" width="108" height="54" rx="8"/><text x="218" y="187" text-anchor="middle">validate()</text><text x="218" y="205" text-anchor="middle" class="m">Pydantic</text>
<rect class="b" x="292" y="164" width="108" height="54" rx="8"/><text x="346" y="187" text-anchor="middle">decide()</text><text x="346" y="205" text-anchor="middle" class="m">if / else</text>
<rect class="b" x="420" y="164" width="108" height="54" rx="8"/><text x="474" y="187" text-anchor="middle">save()</text><text x="474" y="205" text-anchor="middle" class="m">httpx</text>
<rect class="b" x="548" y="164" width="116" height="54" rx="8"/><text x="606" y="187" text-anchor="middle">return</text><text x="606" y="205" text-anchor="middle" class="m">result dict</text>
</svg>


| n8n | Python / PyRunner |
| --- | --- |
| Workflow | Script (`.py` file) |
| Node | Function |
| `$json` | `dict` |
| Expression | Normal Python expression |
| IF / Switch | `if / elif / else` |
| Multiple items | `list` + `for` |
| HTTP Request | `httpx` |
| Credentials | PyRunner Secrets (environment variables) |
| Schedule Trigger | PyRunner schedule |
| Error workflow | `try / except` + retry |
| Execution log | Run history (stdout / stderr) |

---

## 2. What PyRunner gives you

Python runs your code. PyRunner is the infrastructure around it: **when** it runs, **where** (which packages), **with what secrets**, and **what happened**.


<svg class="dg2" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto" viewBox="0 0 700 200" width="700" height="200"><style>.dg2 text{fill:#1d1d1b;font:13px sans-serif}.dg2 .m{fill:#6b6b66;font-size:12px}.dg2 .b{fill:#fff;stroke:#8a8a84;stroke-width:1.5}.dg2 .a{fill:#eef3ff;stroke:#2f6fed;stroke-width:1.5}.dg2 .l{stroke:#6b6b66;stroke-width:1.5;fill:none}.dg2 .d{stroke:#6b6b66;stroke-width:1.5;fill:none;stroke-dasharray:5 4}</style><defs><marker id="ar2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#6b6b66"/></marker></defs>
<rect width="700" height="200" fill="#fafaf7"/>
<rect class="a" x="20" y="20" width="400" height="160" rx="12"/><text x="36" y="42" class="m">PyRunner</text>
<rect class="b" x="40" y="56" width="170" height="44" rx="8"/><text x="125" y="82" text-anchor="middle">Scripts</text>
<rect class="b" x="230" y="56" width="170" height="44" rx="8"/><text x="315" y="82" text-anchor="middle">Schedules (when)</text>
<rect class="b" x="40" y="116" width="170" height="44" rx="8"/><text x="125" y="142" text-anchor="middle">Environments (packages)</text>
<rect class="b" x="230" y="116" width="170" height="44" rx="8"/><text x="315" y="142" text-anchor="middle">Secrets (keys)</text>
<path class="l" d="M420 100H470" marker-end="url(#ar2)"/>
<rect class="b" x="472" y="70" width="100" height="60" rx="10"/><text x="522" y="96" text-anchor="middle">Python</text><text x="522" y="114" text-anchor="middle" class="m">runs script</text>
<path class="l" d="M572 100H600" marker-end="url(#ar2)"/>
<rect class="b" x="602" y="70" width="80" height="60" rx="10"/><text x="642" y="96" text-anchor="middle">Logs</text><text x="642" y="114" text-anchor="middle" class="m">history</text>
</svg>


---

## 3. Install

```bash
# Needs Docker + Docker Compose
git clone https://github.com/hassancs91/PyRunner.git
cd PyRunner
cp .env.example .env      # edit values if needed
docker compose up -d      # start in background
# Open http://localhost:8000 and create your account
```

---

## 4. Hands-on lessons

For every lesson: create a new script in PyRunner, paste the code, click **Run**, read the output.

### Lesson 1: Hello World

Goal: run your first script and see its log.

```python
print("Hello PyRunner")
# Output: Hello PyRunner
```

### Lesson 2: Data and expressions (`$json`)

```python
student = {"name": "Rahul", "marks": 75, "total": 100}

# n8n: {{ $json.marks / $json.total * 100 }}
percentage = student["marks"] / student["total"] * 100
print(percentage)   # 75.0
```

### Lesson 3: Conditions (IF node)

```python
marks = 82

if marks >= 90:
    grade = "A+"
elif marks >= 80:
    grade = "A"
elif marks >= 40:
    grade = "Pass"
else:
    grade = "Fail"

print(grade)   # A
```

### Lesson 4: Many items (loops)

```python
students = [
    {"name": "Rahul", "marks": 80},
    {"name": "Priya", "marks": 35},
]

for s in students:
    s["result"] = "Pass" if s["marks"] >= 40 else "Fail"
    print(s)
```

### Lesson 5: Validation with Pydantic

Goal: reject bad input before it reaches your database.

```python
# 1) PyRunner: open your environment and add packages:
#      pydantic
#      email-validator     (required for EmailStr)
# 2) Run this script:
from pydantic import BaseModel, EmailStr, Field, ValidationError

class Student(BaseModel):
    name: str = Field(min_length=2)
    email: EmailStr
    marks: int = Field(ge=0, le=100)

print(Student(name="Rahul", email="rahul@example.com", marks=78))

try:
    Student(name="R", email="wrong", marks=150)
except ValidationError as e:
    print(e)          # lists every invalid field
```

### Lesson 6: HTTP requests

```python
# Environment packages: httpx
import httpx

r = httpx.get("https://api.github.com", timeout=10)
r.raise_for_status()          # error on 4xx / 5xx
print(r.status_code, list(r.json())[:3])

# POST JSON (json= converts the dict for you):
# httpx.post("https://example.com/api", json={"a": 1}, timeout=10)
```

### Lesson 7: Secrets (n8n credentials)

```python
# 1) PyRunner: Secrets -> add POCKETBASE_URL = http://pocketbase:8090
# 2) Never hard-code keys. Read them from the environment:
import os
url = os.environ["POCKETBASE_URL"]
print("Using", url)
```

The same script now works in development and production. Only the secret values change.

### Lesson 8: PocketBase (database)

```python
import os, httpx

BASE = os.environ["POCKETBASE_URL"]

# Create a record (collection "assignments" must exist)
r = httpx.post(
    f"{BASE}/api/collections/assignments/records",
    json={"student": "Rahul", "assignment": "REST API"},
    timeout=15,
)
r.raise_for_status()
print(r.json()["id"])
```

### Lesson 9: Scheduling

Let PyRunner decide *when*; your script only decides *what*.

```python
# Do NOT write: while True: ... time.sleep(3600)
def main():
    print("Daily job ran")

if __name__ == "__main__":
    main()

# PyRunner: set the schedule (e.g. daily at 08:00, your timezone).
```

### Lesson 10: Errors and retries

```python
import time, httpx

def fetch(url, attempts=3):
    for n in range(1, attempts + 1):
        try:
            r = httpx.get(url, timeout=10)
            r.raise_for_status()
            return r.json()
        except Exception as e:
            print(f"Attempt {n} failed: {e}")
            if n == attempts:
                raise                    # let PyRunner mark the run failed
            time.sleep(2 ** (n - 1))     # wait 1s, 2s, 4s...
```

### Lesson 11: AI with local Ollama

```python
import httpx

# Docker -> host Ollama: use host.docker.internal, not 127.0.0.1
OLLAMA = "http://host.docker.internal:11434"

def ask(prompt, model="YOUR_MODEL"):
    r = httpx.post(f"{OLLAMA}/api/generate",
                   json={"model": model, "prompt": prompt, "stream": False},
                   timeout=300)
    r.raise_for_status()
    return r.json()["response"]

print(ask("Explain Docker containers to a beginner in 3 lines."))
```

> **Rule:** use plain Python for dates, numbers, permissions and deadlines. Use AI only for fuzzy work such as summaries and classification.

Cloud models work the same way (an OpenAI-compatible HTTP call with the key from Secrets). PyRunner also has built-in AI helpers; check its README for the current API before relying on them.

---

## 5. Capstone: Student Assignment Collector


<svg class="dg3" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto" viewBox="0 0 700 150" width="700" height="150"><style>.dg3 text{fill:#1d1d1b;font:13px sans-serif}.dg3 .m{fill:#6b6b66;font-size:12px}.dg3 .b{fill:#fff;stroke:#8a8a84;stroke-width:1.5}.dg3 .a{fill:#eef3ff;stroke:#2f6fed;stroke-width:1.5}.dg3 .l{stroke:#6b6b66;stroke-width:1.5;fill:none}.dg3 .d{stroke:#6b6b66;stroke-width:1.5;fill:none;stroke-dasharray:5 4}</style><defs><marker id="ar3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#6b6b66"/></marker></defs>
<rect width="700" height="150" fill="#fafaf7"/>
<rect class="b" x="14" y="30" width="108" height="46" rx="8"/><text x="68" y="57" text-anchor="middle">JSON input</text>
<rect class="a" x="146" y="30" width="108" height="46" rx="8"/><text x="200" y="57" text-anchor="middle">validate</text>
<rect class="a" x="278" y="30" width="108" height="46" rx="8"/><text x="332" y="50" text-anchor="middle">decide</text><text x="332" y="67" text-anchor="middle" class="m">on_time / late</text>
<rect class="a" x="410" y="30" width="108" height="46" rx="8"/><text x="464" y="50" text-anchor="middle">save</text><text x="464" y="67" text-anchor="middle" class="m">PocketBase</text>
<rect class="b" x="542" y="30" width="144" height="46" rx="8"/><text x="614" y="57" text-anchor="middle">result dict</text>
<path class="l" d="M122 53H144" marker-end="url(#ar3)"/><path class="l" d="M254 53H276" marker-end="url(#ar3)"/><path class="l" d="M386 53H408" marker-end="url(#ar3)"/><path class="l" d="M518 53H540" marker-end="url(#ar3)"/>
<rect class="b" x="278" y="100" width="108" height="34" rx="8" stroke-dasharray="5 4"/><text x="332" y="122" text-anchor="middle" class="m">optional AI</text>
<path class="d" d="M332 100V78" marker-end="url(#ar3)"/>
</svg>


```python
# Environment packages: httpx, pydantic, email-validator
# Secrets: POCKETBASE_URL, ASSIGNMENT_DEADLINE (e.g. 2026-10-10T23:59:00)
import os
from datetime import datetime
import httpx
from pydantic import BaseModel, EmailStr, Field

BASE = os.environ["POCKETBASE_URL"]
DEADLINE = datetime.fromisoformat(os.environ["ASSIGNMENT_DEADLINE"])

class Submission(BaseModel):                       # validate
    student: str = Field(min_length=2)
    email: EmailStr
    assignment: str = Field(min_length=1)
    submitted_at: datetime

def decide(sub):                                   # business rule
    return "on_time" if sub.submitted_at <= DEADLINE else "late"

def save(sub, status):                             # database
    r = httpx.post(f"{BASE}/api/collections/assignments/records",
                   json={**sub.model_dump(mode="json"), "status": status},
                   timeout=15)
    r.raise_for_status()
    return r.json()

def process(payload):                              # whole workflow
    sub = Submission.model_validate(payload)
    status = decide(sub)
    record = save(sub, status)
    return {"success": True, "status": status, "record_id": record["id"]}

if __name__ == "__main__":
    print(process({
        "student": "Rahul", "email": "rahul@example.com",
        "assignment": "Python REST API",
        "submitted_at": "2026-10-07T18:30:00",
    }))
```

Each function does one job, so you can test `decide()` without a database.

> **Webhooks:** PyRunner webhooks are queued (asynchronous), so they do not return your result to the caller. If a form needs an instant JSON reply, put a small FastAPI service in front and call `process()` from it, or let n8n receive the webhook and call PyRunner.

---

## 6. Keep n8n or move to Python?

| Your workflow is mostly... | Use |
| --- | --- |
| Connecting apps (Gmail, Slack, Sheets) | n8n |
| Loops, validation, big data, AI pipelines | PyRunner |
| Both | n8n receives the event, calls PyRunner, uses the result |

---

## 7. Good habits

```text
# Environments: group by capability, not one per script
#   automation-web   : httpx, pydantic, email-validator
#   automation-ai    : httpx, pydantic
#   automation-data  : pandas, openpyxl
# Scripts:  put work in main(); keep schedules in PyRunner
# Config:   everything environment-specific lives in Secrets
# Logs:     use logging.info()/error() instead of bare print()
# Names:    academic.assignment_collector, monitoring.url_checker
```
