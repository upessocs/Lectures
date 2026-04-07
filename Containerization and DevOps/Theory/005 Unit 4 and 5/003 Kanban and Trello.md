### **What is Kanban?**
Kanban is a visual workflow management method to:
- Visualize work  
- Limit work in progress (WIP)  
- Improve efficiency  

**Core principles:**
1. Visualize the workflow  
2. Limit WIP  
3. Manage & improve flow  

---

### **Kanban Board Example**

| Backlog     | To Do       | In Progress (WIP: 3) | Done       |
|-------------|-------------|----------------------|------------|
| Task 1      | Task 2      | Task 3               | Task 4     |
| Task 5      |             | Task 6               |            |

- **Backlog** – Not yet started  
- **To Do** – Ready to work on  
- **In Progress** – Active tasks (WIP limit applied)  
- **Done** – Completed  

---

### **Kanban Card Example**
```
Title: Design homepage  
Description: Wireframes & mockups  
Assignee: John  
Due: 2025-04-10  
Priority: High
```

---

### **How to Move Cards**
1. Backlog → To Do (ready to start)  
2. To Do → In Progress (start working)  
3. In Progress → Done (completed)  

> If **In Progress** hits its WIP limit, finish a task before moving another in.

---

### **Limit WIP (Work in Progress)**
**Why?** Prevents multitasking, reduces bottlenecks, improves focus.

**How?**  
- Set a max number of tasks per column (e.g., In Progress: 3)  
- Stop moving tasks into a full column until one is completed  

**Example:**
| To Do (5) | In Progress (3) | Done |
|-----------|----------------|------|
| Task A    | Task X         |      |
| Task B    | Task Y         |      |
| Task C    | Task Z         |      |
| Task D    | (full)         |      |

No new task → In Progress until Z moves to Done.

---

### **Hands-On Tools**

#### **Trello (simple & visual)**
[Trello.com](https://trello.com/)
- Create a board with lists: Backlog, To Do, In Progress, Done  
- Each card = task  
- Set WIP limits with **Butler** automation or manual rule  
- **Example:** Add a label “High Priority” → drag & drop cards across lists  

#### **Jira (for teams & devs)**
- Use a **Kanban project template**  
- Columns = workflow statuses  
- Set WIP limits in **Column constraints**  
- **Example:** Limit “In Progress” to 3 issues → Jira blocks moving more until one is done  

Check [Demo Project at Trello https://trello.com/b/rLTLw1A4/devops-demo](https://trello.com/b/rLTLw1A4/devops-demo)

---

### **Quick Implementation Steps**
1. Pick a tool (Trello for personal/small teams, Jira for dev teams)  
2. Create columns: Backlog, To Do, In Progress, Done  
3. Add tasks as cards  
4. Set WIP limits (start with In Progress = 2–3)  
5. Move cards as you work  
6. Review weekly – adjust limits or columns  

---

### **Pro Tips**
- Use colors/labels for priority or task type  
- Keep columns to 4–6 for clarity  
- Review your board daily (2 minutes)  
- Continuously improve – change WIP limits if you see bottlenecks  
