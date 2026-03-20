
# 1. Problem with create deployment

```bash
kubectl create deployment web --image=nginx
```

This command *works*, but it has **serious limitations**.

### A. It is **imperative (command-based)**

You are telling Kubernetes *what to do right now*, not *what the system should look like*.

But Kubernetes is designed for **declarative model**
(from your notes: desired state + reconciliation loop )

So instead of:

> “Create a deployment”

Kubernetes prefers:

> “This deployment should exist like this”




### B. No version control

If you create using CLI:

```bash
kubectl create deployment web --image=nginx
```

There is:

* no file
* no history
* no reproducibility

You cannot:

* track changes
* share config
* use Git




### C. Hard to modify

Suppose later you want:

* 3 replicas
* environment variables
* resource limits

You will need multiple commands:

```bash
kubectl scale deployment web --replicas=3
kubectl set env deployment/web ENV=prod
```

This becomes messy.




### D. Hidden defaults

You don’t see:

* labels
* selectors
* pod template details

Kubernetes creates them internally.

So beginners don’t understand:

* how deployment actually works
* how pods are linked




### E. Not suitable for real-world usage

In real systems:

* CI/CD pipelines
* GitOps tools
* teams

→ All require **YAML-based configuration**

---


# 2. Better way: Use YAML (Declarative Approach)

Instead of command, you define:

```yaml
apiVersion: apps/v1
kind: Deployment

metadata:
  name: web

spec:
  replicas: 3

  selector:
    matchLabels:
      app: web

  template:
    metadata:
      labels:
        app: web

    spec:
      containers:
      - name: nginx
        image: nginx
        ports:
        - containerPort: 80
```

Apply it using:

```bash
kubectl apply -f deployment.yaml
```

---


### Why YAML is better

| Feature           | CLI | YAML |
| ----------------- | --- | ---- |
| Reproducible      | NO   | YES    |
| Version control   | NO   | YES    |
| Readable          | NO   | YES    |
| Scalable configs  | NO   | YES    |
| Industry standard | NO   | YES    |


---

# 3. Improve Your kubectl Basics (Important Tasks)

Right now you are using kubectl as **command runner**.
You should use it as **cluster inspection + debugging tool**.

### Core skill set

### 1. Inspect everything

```bash
kubectl get pods
kubectl get deployments
kubectl get services
```




### 2. Detailed debugging

```bash
kubectl describe pod <pod-name>
```

Very important:

* shows events
* tells *why something failed*




### 3. Logs

```bash
kubectl logs <pod-name>
```




### 4. YAML view (VERY IMPORTANT)

```bash
kubectl get deployment web -o yaml
```

This is how you **learn YAML automatically**.




### 5. Edit live resources

```bash
kubectl edit deployment web
```




### 6. Port forward (testing)

```bash
kubectl port-forward service/web 8080:80
```




### 7. Watch changes

```bash
kubectl get pods -w
```


---

# 4. How to Learn YAML for Kubernetes (Best Approach)

Don’t learn YAML separately first. Learn it **with Kubernetes objects**.




## Step 1: Generate YAML from command

Run:

```bash
kubectl create deployment web --image=nginx --dry-run=client -o yaml
```

This gives you:
→ **auto-generated YAML**




## Step 2: Save and modify

```bash
kubectl create deployment web --image=nginx \
  --dry-run=client -o yaml > deployment.yaml
```

Then edit:

* replicas
* ports
* labels




## Step 3: Apply it

```bash
kubectl apply -f deployment.yaml
```




## Step 4: Observe changes

```bash
kubectl get pods
kubectl describe deployment web
```

---


# 5. Where to Learn YAML (Focused for Kubernetes)

### A. Understand YAML basics (quick)

You only need:

* key-value
* lists
* indentation

Example:

```yaml
name: web
replicas: 3

containers:
  - name: nginx
    image: nginx
```




### B. Learn Kubernetes YAML structure

Every resource follows:

```yaml
apiVersion:
kind:
metadata:
spec:
```



---
### C. Best Practical Learning Sources

### 1. Your own cluster (BEST)

Use:

```bash
kubectl get pod <name> -o yaml
```

Learn from real objects.




### 2. Official docs (gold standard)

Kubernetes documentation:

* Workloads → Deployments
* Services
* ConfigMaps




### 3. Practice repos

Search:

* “kubernetes examples github”
* “k8s yaml examples”




### 4. Tools

* `kubectl explain deployment`
  → explains YAML fields

Example:

```bash
kubectl explain deployment.spec.template.spec.containers
```




# 6. Mental Model You Should Build

From your notes :

> Kubernetes = desired state system

So think like this:

```
YAML → desired state
kubectl apply → send to API server
controller → ensures it runs
```




# 7. Suggested Practice Flow (Very Important)

Do this once properly:

### Step 1

Create using CLI

```bash
kubectl create deployment web --image=nginx
```




### Step 2

Export YAML

```bash
kubectl get deployment web -o yaml > web.yaml
```




### Step 3

Delete deployment

```bash
kubectl delete deployment web
```




### Step 4

Recreate using YAML

```bash
kubectl apply -f web.yaml
```




### Step 5

Modify YAML (replicas = 3)
Apply again.




This single exercise will **bridge CLI → YAML → real Kubernetes**


---

# Final Insight

You are transitioning from:

```
Docker mindset → run container
```

to:

```
Kubernetes mindset → define system state
```

That’s the key shift.

