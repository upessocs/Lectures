# Explain Harness: Test Harness, Agent Harness, and Skills Tutorial

**A harness is a controlled testing environment that isolates your code, feeds it inputs, runs it, and reports results automatically**—so you can verify correctness without manual intervention. In the AI coding context, a harness also refers to the orchestration layer that connects a coding agent (like Pi, OpenCode, or DSH) to sandboxes, tools, and verification loops.

This tutorial covers: (1) what a test harness is in classic software engineering, (2) how to use ChatGPT chat mode and Codex mode to understand harnesses, (3) how to write harnesses for Pi, OpenCode, and DSH agents, and (4) how to write your own skills in detail.

---

## Part 1: What Is a Harness?

### 1.1 Classic Test Harness

A test harness is a set of tools, scripts, and data designed to **automate test execution, manage the test environment, and generate reports**. It typically includes:

- **Test execution automation** — runs unit, integration, or regression tests without manual input
- **Test data management** — creates, stores, and manipulates inputs
- **Result logging & reporting** — captures pass/fail, errors, and execution times
- **Environment configuration** — sets up and tears down test environments
- **Integration support** — hooks into CI/CD pipelines

**Why it matters:** A harness isolates the code under test, provides controlled inputs, and ensures repeatable results. It catches bugs early, speeds up feedback loops, and enables regression testing at scale.

**A minimal Python example** from BrowserStack:

```python
# calculator.py
def add(a, b):
    return a + b

def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

# test_calculator.py (the harness)
import unittest
from calculator import add, divide

class TestCalculator(unittest.TestCase):
    def test_add(self):
        self.assertEqual(add(2, 3), 5)
    
    def test_divide(self):
        self.assertEqual(divide(10, 2), 5)
    
    def test_divide_by_zero(self):
        with self.assertRaises(ValueError):
            divide(5, 0)
```

Run `python -m unittest` and the harness executes all tests, reports results, and exits with a status code.

### 1.2 Agent Harness (AI Coding Context)

In the AI agent ecosystem, a harness is the **orchestration layer** that connects an LLM-based coding agent to external tools and execution environments. For example, the Pi harness adapter connects `HarnessAgent` to `@earendil-works/pi-coding-agent`, running Pi in the host Node.js process while using a sandbox as a remote filesystem and shell.

An agent harness typically handles:
- **Tool exposure** — making tools like `read`, `write`, `bash`, `grep` available to the agent
- **Sandbox management** — isolating execution so the agent can't damage the host system
- **Streaming results** — feeding the agent's output back to your application
- **Permission control** — deciding which actions require human approval

The `pi-agent-harness` package is a **meta-factory**: it takes a domain description and generates a multi-agent team with specialist agents, skills, and orchestration prompts.

### 1.3 Skills (Portable Procedural Knowledge)

A skill is a Markdown file (`SKILL.md`) that teaches an agent how to perform a specific workflow. Skills use **progressive disclosure**—the agent sees only the name and description initially, then loads the full instructions when the skill matches the task.

Skills are portable across compatible tools following the **open Agent Skills standard**.

---

## Part 2: Understanding Harness Using ChatGPT Chat Mode

ChatGPT chat mode is best for **conceptual understanding, test case design, and code explanation**. It has no execution environment—it generates and explains, but cannot run code.

### 2.1 The Workflow: "Design First, Generate Second"

Use chat mode to clarify *what* to test before writing the harness. A real-world workflow from a Python API testing project:

**Step 1 — Describe your system in plain language.** Paste your OpenAPI spec or feature description and ask ChatGPT to identify test scenarios:

> "Service contains order query, order creation, and order cancellation endpoints. Order query supports by order number, by user ID, and by time range. Help me create a test case matrix and point out boundary and exception scenarios."

**Step 2 — Refine the matrix.** ChatGPT may surface edge cases you missed (e.g., "time range spanning years," "order number with leading zeros").

**Step 3 — Generate the harness code.** Once the matrix is clear, ask ChatGPT to produce the test harness:

> "Generate pytest test scripts for these cases using the requests library. Include a conftest.py with fixtures for a session client and assertion helpers."

### 2.2 Practical Chat Mode Prompt Template

Use this structure for harness-related tasks:

```
I need to create a test harness for [FEATURE].

Context:
- Technology: [e.g., Python 3.10, FastAPI, pytest]
- Test framework: [e.g., pytest + requests]
- What to test: [list endpoints/functions]

Generate:
1. Test harness structure (conftest.py with fixtures)
2. Test cases covering happy path, validation, and edge cases
3. Assertion helpers

Format: Complete runnable code with comments explaining each part.
```

### 2.3 Limits of Chat Mode

- **Cannot execute code.** It generates code that may not run correctly.
- **No codebase awareness.** It doesn't know your architecture, business logic, or existing patterns.
- **Context window limits.** Large files get truncated. Work with focused snippets.

---

## Part 3: Understanding Harness Using Codex Mode

Codex is a **cloud-based software engineering agent** that works inside ChatGPT. It can write and edit code, run tests in a sandbox, and open pull requests. Unlike chat mode, Codex **executes** and **verifies**.

### 3.1 What Codex Does Differently

| Aspect | Chat Mode | Codex Mode |
|---|---|---|
| Execution | None | Runs in sandbox |
| Codebase access | None (you paste) | Connects to GitHub repos |
| Output | Code snippets | Pull requests |
| Verification | None | Runs tests and reports results |

### 3.2 Setting Up Codex

1. Log into ChatGPT and find Codex in the sidebar.
2. Complete MFA setup.
3. Connect your GitHub account and authorize repository access.
4. Select a repo and create an environment.
5. (Optional) Add an `AGENTS.md` file to define coding conventions Codex will follow.

### 3.3 Using Codex for Harness Development

**Task formulation:** Give Codex a complete task, not a fragmented question:

> "Add a pytest test harness for the order service. The harness should include fixtures for a mocked database, assertion helpers for JSON responses, and tests covering the boundary cases identified in the attached test matrix. Run the tests and report which pass and which fail."

Codex will:
- Analyze the repository
- Generate the harness files
- Run the tests
- Fix failures (if within scope)
- Open a pull request with the changes

### 3.4 Codex Skills (Deprecation of Custom Prompts)

Codex previously supported custom prompts as slash commands, but **custom prompts are deprecated**. Use **skills** instead for reusable workflows—they can be invoked explicitly or implicitly, and can be shared through repositories.

Codex skills live in `$CWD/.agents/skills` (repo-local) or `$HOME/.agents/skills` (user-global).

---

## Part 4: Writing Harnesses for Pi, OpenCode, and DSH

### 4.1 Pi Agent Harness

**What it is:** Pi's harness architecture uses a **meta-factory** approach—you describe a domain, and it generates a multi-agent team with 6 architectural patterns.

**The 6 patterns:**
1. **Pipeline** — sequential chain (`chain` mode)
2. **Fan-out/Fan-in** — parallel tasks (`parallel` mode, ≤8 tasks, 4 concurrent)
3. **Expert Pool** — selective single-agent invocation
4. **Producer-Reviewer** — worker → reviewer → worker chain
5. **Supervisor** — main agent dynamically delegates
6. **Hierarchical Delegation** — 2-level nesting

**How to install and use:**

```bash
# Install from npm
pi install npm:@baryonlabs/pi-agent-harness

# Or project-local (shareable)
pi install -l npm:@baryonlabs/pi-agent-harness
```

Then inside pi, trigger it with a domain sentence: `하네스 구성해줘` (or any natural language request to build a harness).

**Generated structure:**

```
your-project/
├── .pi/
│   ├── agents/          # Agent definitions (analyst.md, builder.md, qa-inspector.md)
│   ├── skills/          # Skill files (analyze/SKILL.md, build/SKILL.md)
│   └── prompts/         # Orchestration prompts
```

**Pi harness as a code library** (for embedding in your own app):

```ts
import { HarnessAgent } from '@ai-sdk/harness/agent';
import { pi } from '@ai-sdk/harness-pi';
import { createVercelSandbox } from '@ai-sdk/sandbox-vercel';

const agent = new HarnessAgent({
  harness: pi,
  sandbox: createVercelSandbox({ runtime: 'node24' }),
});

const session = await agent.createSession();
const result = await agent.stream({
  session,
  prompt: 'Check the test failures and fix the production code.',
});
```

### 4.2 OpenCode Harness

**How OpenCode differs from Pi:**

OpenCode reads `.opencode/opencode.jsonc` for configuration. It has two built-in primary agents: **build** (full access) and **plan** (read-only). Role agents (product-owner, architect, developer, reviewer, explorer) are **subagents**, reached via slash commands or `@mentions`.

**Key OpenCode-specific features:**

- **Auto-format on edit** — runs the matching formatter after every write/edit
- **Permission bash deny globs** — blocks destructive commands like `rm -rf`, `push --force`, `DROP TABLE`
- **No session-end verification gate** — you must run `/verify` yourself; CI is the backstop

**Invoking subagents:**

```
@explorer find where X is wired up
/spec <slug>
/plan
/build
/verify
```

**AI Harness Framework for OpenCode** (a different, composable harness):

```bash
npm install -g @piwero/ai-harness-cli

# Initialize with OpenCode
ah init --provider opencode

# Add components
ah add opencode:agents,skills

# Validate
ah validate
```

This framework uses **Guides (feedforward)** and **Sensors (feedback)** to create autonomous feedback loops.

### 4.3 DSH (DeepSeek Harness)

**DSH philosophy:** For daily project development, you **don't need to write plugins**. The Standard preset includes a complete coding agent. The workflow is "install → configure → select workspace → chat".

**Quick start:**

```bash
npx @deepseek-ai/dsh web
# or
npm install -g @deepseek-ai/dsh
dsh web
```

Then configure your DeepSeek API key in Settings → Models. The key is stored locally in `$DSH_HOME/.credentials.yaml`.

**When you DO need plugins/skills:**

| Need | Solution |
|---|---|
| Custom tools (internal APIs) | Tool plugin |
| Custom UI (panels, file tree) | Client plugin |
| Company conventions/code review checklists | **Skill** (Markdown in `.dsh/skills`) |
| Fixed capability combo (Code Review mode, PPT mode) | Creator mode + `cordis.patch.yml` preset |

**DSH Skill location:** `.dsh/skills/` or `.agents/skills/` in your project.

**DSH vs Codex vs Pi (third-party benchmarks):** A 2026 test found DSH completed a 3D game task fastest (~13 min) but with initial errors, while Codex was slower (1.2s avg loop vs DSH 3.8s) but more reliable. Token consumption was 35% higher for DSH.

---

## Part 5: How to Write Your Skills — Detailed Tutorial

### 5.1 The Anatomy of a Skill

Every skill is a folder containing `SKILL.md`. The file has two parts:

```markdown
---
name: skill-name
description: What it does + when to trigger it (be specific and "pushy")
---

# Skill Instructions

The actual workflow the agent follows.
```

**Frontmatter fields (most common):**

| Field | Purpose |
|---|---|
| `name` | Becomes the slash command (`/skill-name`) |
| `description` | Controls auto-triggering (most important line) |
| `disable-model-invocation: true` | For side effects (deployments, commits)—requires explicit invocation |
| `allowed-tools` | Grant specific tools without per-use approval |
| `context: fork` | Run in isolated subagent without conversation history |

### 5.2 Writing the Description (The Hardest Part)

Most skills fail because the description doesn't match how people actually ask for help.

**Weak description:**
```
description: Generates commit messages.
```
This undertriggers. "Write a commit for my changes" won't match.

**Strong description:**
```
description: Generates structured commit messages following the Conventional Commits standard. 
Use when you want to commit your changes and need a well-formatted message. 
Triggers on "write a commit message", "commit my changes", "summarize my staged diff", 
"what should my commit say", or any request to describe or document code changes for version control.
```

**The pattern:** What it does + when to use it + specific trigger phrases. Cover different ways a developer might phrase the same request.

**Two rules:**
1. **Be specific about the output.** "Generates commit messages" is vague. "Generates structured commit messages following Conventional Commits" tells exactly what you get.
2. **Be slightly pushy.** The agent undertriggers by nature. Explicitly listing trigger phrases counteracts this. You're training the trigger.

### 5.3 Writing the Instructions

**Principle 1: Generate first, clarify second.** The agent should produce output immediately rather than asking clarifying questions. If it must make assumptions, it should flag them after the output.

**Principle 2: Define the output format explicitly.** Don't say "write a good commit message." Say exactly what the structure is.

**Weak instructions:**
```markdown
# Commit Message Writer
Look at the staged changes and write a commit message that describes what changed.
```
This produces different results every time—different formats, lengths, conventions.

**Strong instructions:**
```markdown
Read the staged diff using `git diff --staged`. Generate a commit message
following the Conventional Commits standard.

Output format:
type(scope): short description under 72 characters

Body (if changes are non-trivial):
- What changed and why, not how
- One bullet per logical change

Footer (if applicable):
BREAKING CHANGE:
Closes #issue-number
```

### 5.4 Complete Skill Example

Here's a full skill for **pre-deploy security checks**:

```markdown
---
name: pre-deploy-check
description: Generates a security checklist for smart contracts before deployment. 
Use whenever the user mentions deploying, launching, or going to production with a contract. 
Triggers on "pre-deploy", "ready to deploy", "security check", "audit before launch".
allowed-tools: Read, Grep, Bash
---

# Pre-Deploy Security Checklist

Generate a security checklist for the contract in the current workspace.

## How to invoke
Read the contract files using Glob and Grep. Generate the checklist immediately—do not ask clarifying questions.

## Checklist format

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1 | Reentrancy guards | ✅/❌/⚠️ | ... |
| 2 | Integer overflow protection | | |
| 3 | Access control on admin functions | | |
| 4 | Event emission for state changes | | |
| 5 | Input validation on external calls | | |

## Output
1. The checklist table above
2. A "Blockers" section for any ❌ items
3. A "Recommended fixes" section with code snippets
```

### 5.5 Where to Save Skills

| Scope | Location | Use |
|---|---|---|
| Personal | `~/.claude/skills/` (Claude Code) or `$HOME/.agents/skills/` (Codex) | Across all projects |
| Project | `.claude/skills/` or `.agents/skills/` | Committed to repo, team-wide |
| Pi | `.pi/skills/` | Pi-specific |
| DSH | `.dsh/skills/` or `.agents/skills/` | DSH projects |
| Codex repo | `$CWD/.agents/skills`, `$CWD/../.agents/skills`, `$REPO_ROOT/.agents/skills` | Nested discovery |

### 5.6 Testing Your Skill

Codex supports **Record & Replay**—record a workflow, and Codex drafts a skill from the demonstration. You can also use `$skill-creator`.

**Validation approach from pi-agent-harness:**
- Trigger verification (does the description match how people ask?)
- Dry-run testing
- With-skill vs without-skill comparison

**Manual test:** After writing, invoke the skill explicitly (e.g., `/pre-deploy-check`) and check if the output matches the format you defined. Then try triggering it implicitly by using natural phrasing from your description.

### 5.7 Skill Portability

Skills follow the open Agent Skills standard, so they're portable across Claude Code, Cowork, Codex, Pi, DSH, and other compatible tools. The same `SKILL.md` can often be dropped into different harnesses' skill directories without modification.

---

## Summary Table: Harness vs Skill vs Agent

| Concept | What It Is | Where It Lives | Primary Use |
|---|---|---|---|
| **Test Harness** | Test execution environment | `test_*.py`, CI config | Automated verification |
| **Agent Harness** | Orchestration layer + sandbox | `.pi/`, `.opencode/`, DSH config | Connecting agent to tools/env |
| **Skill** | Markdown workflow instructions | `.agents/skills/`, `.claude/skills/` | Reusable procedural knowledge |
| **Agent** | Role definition (name, tools, model) | `.pi/agents/`, `.opencode/agents/` | Specialist delegation |

**The core insight:** A harness isolates and controls execution. A skill teaches the agent *how* to do something. They compose—a harness can generate skills, and a skill can describe how to build a harness.