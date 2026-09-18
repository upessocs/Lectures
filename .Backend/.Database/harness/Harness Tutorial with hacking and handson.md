# Harness Tutorial: Deep Dive, Hacking, and Hands-on

This guide treats your coding agent not as a black box, but as an **operational framework (the Harness)** that connects an LLM to your machine via a set of well-defined API tools (`read`, `bash`, `edit`, `write`).

## What is "The Harness"?

The Harness is the **middleware layer**. It provides the interface between the "brain" (the LLM) and the "limbs" (your file system, terminal, and development environment).

Without the harness, an LLM just generates text. **With the harness, the LLM has agency to effect change.**

---

## Part 1: Hacking the Harness (Exploratory Analysis)

To understand how your agent "hacks" your environment, you must examine the source of the harness itself.

1.  **Locate the definitions:**
    Use your agent to find where its own harness logic is stored. Based on your environment, run:
    ```bash
    # Assuming you are in the project folder, look at the documentation provided
    ls C:/Users/prateek.gautam/AppData/Roaming/npm/node_modules/@earendil-works/pi-coding-agent/docs
    ```
2.  **Read the Tool Definitions:**
    The magic happens in how the tools are defined. Open and analyze how `bash` or `edit` are implemented.
    *   *Action:* Read the TypeScript definitions or configuration files that define these tools.
    *   *Hacker Insight:* Notice how the tools are constrained (e.g., input validation, file access restrictions, timeout limits). This is how you prevent the agent from destroying your machine.

---

## Part 2: Harness via Chat Mode vs. Coding Mode

The Harness behaves differently depending on the mode of interaction.

### 1. Chat Mode (Human-in-the-loop)
In chat mode, you are the pilot. You use the agent to *discuss* and *propose* changes.
*   **The Workflow:** You prompt $\rightarrow$ Agent replies $\rightarrow$ You execute the commands manually or approve the agent's proposed plan.
*   **Use this for:** Complex architectural decisions, debugging where you need to understand *why* a change is happening, or when the agent is behaving unpredictably.

### 2. Coding Mode (Agent-loop / Autonomous)
In coding mode, you are the architect; the agent is the executor. The agent loops through:
1.  **Perceive:** Reads files, runs `ls` to understand the state.
2.  **Think:** Decides the next step (e.g., "I need to fix the import error in `index.ts`").
3.  **Act:** Calls `edit` or `bash`.
4.  **Observe:** Checks the output of the tool. If it failed, it enters a self-correction loop.

*   **Hacker Insight:** To master Coding Mode, learn to write **"System Prompts"** that guide the agent's decision-making process, forcing it to "think" before it "acts."

---

## Part 3: Harness across Agents (Pi, OpenCode, DSH)

Whether you are using Pi, OpenCode, or DSH, the fundamental harness principle remains: **Capability = Tools + LLM.**

To analyze how an agent uses the harness:
*   **Log Inspection:** Check the logs (if available). Look for the interaction traces: `{"tool": "bash", "args": {...}}`.
*   **Capability Mapping:** Does one agent have `read` but not `edit`? That agent is restricted to read-only analysis. Does one have `bash`? That one has unlimited power.
*   **Standardization:** If you want to port your skills between agents, ensure your custom tools follow a generic JSON-schema format that all of them understand.

---

## Part 4: Writing Your Own Skills (The Hands-on Part)

Skills allow you to add custom functionality (e.g., "Analyze a new file type," "Deploy to a specific cloud," "Run custom static analysis").

### Step-by-Step Tutorial: Creating a `summarize-log` Skill

#### 1. Define the Requirement
We want a tool that reads a log file and returns a summary, preventing the agent from having to read thousands of lines of text.

#### 2. Create the Script/Function
You need a function that takes a file path, reads it, and applies logic to summarize it. Create a new file in your project or agent plugins directory (e.g., `skills/summarize.ts`).

#### 3. Register the Skill
You must register this function as a tool the agent can call. Look at `examples/` in the harness docs for the plugin registration API. It usually looks like this:

```typescript
// Conceptual example
registerTool({
  name: "summarize_log",
  description: "Reads a log file and returns a short summary",
  parameters: {
    type: "object",
    properties: {
      path: { type: "string" }
    },
    required: ["path"]
  },
  execute: async ({ path }) => {
    // 1. Read the file
    // 2. Perform logic (regex, LLM summarization, etc.)
    // 3. Return string result
  }
});
```

#### 4. The "Hacker" Test (Hands-on)
1.  **Create a test file:** `echo "error: db down\nerror: connection timeout\ninfo: retry 1" > test.log`
2.  **Invoke the skill:** In the agent's chat window, say: *"Use the summarize_log tool on test.log"*.
3.  **Observe:** Did the agent call your function? If not, did the tool description match the intent? Refine the description until the agent picks it up reliably.

---

## Summary Checklist for Harness Mastery
- [ ] **Can you find the source code?** (Know where your tools live)
- [ ] **Can you trigger a tool manually?** (Don't rely on the agent to do everything)
- [ ] **Can you read the tool execution logs?** (Understand the agent's thought loop)
- [ ] **Have you written a custom tool?** (The ultimate test of true understanding)
