# Docker Swarm — Complete Practical Guide with Use Cases & Hands-On

We have already covered containers, images, networking, and volumes.
> Now we move to **cluster-level management** — running containers across multiple machines reliably.


# 1. Why Do We Need Docker Swarm?

## Problem Without Swarm

If you run containers using:

```bash
docker run nginx
```

Problems:

* Runs on single machine only
* No automatic recovery if container crashes
* No scaling across multiple servers
* No built-in load balancing
* Manual management

## Real World Requirements

| Requirement        | Example Scenario                             |
| ------------------ | -------------------------------------------- |
| High availability  | Web app must not go down                     |
| Auto healing       | If container crashes → restart automatically |
| Horizontal scaling | Increase instances during high traffic       |
| Rolling updates    | Update app without downtime                  |
| Load balancing     | Distribute traffic across replicas           |
| Multi-node cluster | Use multiple physical/VM servers             |

Docker Swarm solves all of this.

---

# 2. Feature Highlights of Docker Swarm

* Built into Docker Engine (no extra installation)
* Declarative service model
* Automatic load balancing
* Rolling updates
* Service scaling
* Self-healing containers
* Routing mesh
* Secure by default (TLS between nodes)

---

# 3. Swarm Mode Key Concepts

## 3.1 Swarm

A **cluster of Docker hosts** working together.

---

## 3.2 Nodes

A machine participating in the swarm.

Types:

* **Manager Node** → Controls cluster
* **Worker Node** → Runs containers

---

## 3.3 Service

A definition of desired state.

Example:

> “Run 3 nginx containers and keep them running.”

Swarm ensures desired state is maintained.

---

## 3.4 Task

A single running container inside a service.

If service replicas = 3 → 3 tasks created.

---

## 3.5 Load Balancing

Swarm distributes traffic automatically across replicas.

---

# HANDS-ON LAB

You can test on:

* Single machine (localhost)
* Or multiple VMs (recommended for real lab)

---

# PART A — Create a Swarm

## Objective

Initialize cluster manager.

---

### Step 1: Initialize Swarm

```bash
docker swarm init
```

### Explanation

* `docker` → Docker CLI
* `swarm` → Swarm management command
* `init` → Initialize a new swarm cluster

Output:

* Current node becomes manager
* Displays join token for workers

---

### Step 2: Verify Node

```bash
docker node ls
```

### Explanation

* `node` → Manage swarm nodes
* `ls` → List nodes

Shows:

* Node ID
* Status
* Role (Manager/Worker)

---

# PART B — Add Nodes to Swarm

## Use Case

Production setup:

* 1 Manager
* 2 Worker nodes

---

## On Worker Machine

Run join command (copied from manager):

```bash
docker swarm join --token <TOKEN> <MANAGER-IP>:2377
```

### Explanation

* `join` → Join existing swarm
* `--token` → Authentication token (security)
* `<MANAGER-IP>:2377` → Manager IP and swarm port

---

Verify on Manager:

```bash
docker node ls
```

Now multiple nodes should appear.

---

# PART C — Deploy a Service

## Use Case

Deploy web server with 3 replicas.

---

### Step 1: Create Service

```bash
docker service create \
  --name webapp \
  --replicas 3 \
  -p 8080:80 \
  nginx
```

---

### Explanation (First Use Detailed)

* `docker service` → Manage swarm services
* `create` → Create new service
* `--name webapp` → Assign service name
* `--replicas 3` → Run 3 container instances
* `-p 8080:80` → Publish port

  * 8080 → Host port
  * 80 → Container port
* `nginx` → Image name

---

### Step 2: Check Services

```bash
docker service ls
```

* `ls` → List all services

---

### Step 3: Inspect Tasks

```bash
docker service ps webapp
```

* `ps` → Show tasks (containers) of service
* `webapp` → Service name

---

# PART D — Inspect the Service

## Use Case

Check configuration & runtime details.

---

```bash
docker service inspect webapp
```

### Explanation

* `inspect` → Show detailed JSON configuration
* Useful for debugging

For formatted output:

```bash
docker service inspect --pretty webapp
```

* `--pretty` → Human-readable format

---

# PART E — Scale the Service

## Use Case

Traffic increased during sale → need 6 replicas.

---

```bash
docker service scale webapp=6
```

### Explanation

* `scale` → Change replica count
* `webapp=6` → Desired replicas

Verify:

```bash
docker service ls
```

---

Swarm automatically:

* Creates new containers
* Distributes them across nodes

---

# PART F — Delete the Service

## Use Case

Application no longer required.

---

```bash
docker service rm webapp
```

### Explanation

* `rm` → Remove service
* Deletes all replicas automatically

---

# PART G — Apply Rolling Updates

## Use Case

Deploy new version without downtime.

---

### Step 1: Create Service

```bash
docker service create \
  --name app \
  --replicas 3 \
  nginx:1.25
```

---

### Step 2: Update Image

```bash
docker service update \
  --image nginx:latest \
  --update-parallelism 1 \
  --update-delay 10s \
  app
```

---

### Explanation

* `update` → Modify existing service
* `--image nginx:latest` → Change image version
* `--update-parallelism 1` → Update 1 container at a time
* `--update-delay 10s` → Wait 10 seconds between updates
* `app` → Service name

This ensures:

* No downtime
* Controlled update

---

# PART H — Drain a Node

## Use Case

Node maintenance required (hardware update).

---

### Step 1: Drain Node

```bash
docker node update --availability drain <NODE-ID>
```

---

### Explanation

* `node update` → Modify node
* `--availability drain` → Stop scheduling tasks
* `<NODE-ID>` → Target node

Effect:

* Running containers moved to other nodes
* No new tasks scheduled here

---

### Step 2: Activate Again

```bash
docker node update --availability active <NODE-ID>
```

---

# PART I — Swarm Routing Mesh

## What is Routing Mesh?

Swarm exposes service on **all nodes**, even if container is not running there.

Example:

* 3 nodes
* Only 1 node running container
* Access from ANY node IP works

---

## Test Routing Mesh

Deploy:

```bash
docker service create \
  --name mesh-test \
  --replicas 2 \
  -p 8080:80 \
  nginx
```

Access from:

```
http://<any-node-ip>:8080
```

Swarm automatically forwards request.

---

## How It Works

* Uses ingress network
* Built-in load balancer
* Internal VIP (Virtual IP)

---

# Summary of Core Commands

| Action          | Command                                 |
| --------------- | --------------------------------------- |
| Init swarm      | docker swarm init                       |
| Join swarm      | docker swarm join                       |
| List nodes      | docker node ls                          |
| Create service  | docker service create                   |
| List services   | docker service ls                       |
| Inspect service | docker service inspect                  |
| Scale service   | docker service scale                    |
| Update service  | docker service update                   |
| Drain node      | docker node update --availability drain |
| Remove service  | docker service rm                       |

---

# Real Industry Use Case Example

E-commerce Website:

| Layer           | Swarm Usage                 |
| --------------- | --------------------------- |
| Frontend        | 5 replicas                  |
| Backend API     | 4 replicas                  |
| Redis           | 3 replicas                  |
| Database        | Stateful service            |
| Rolling updates | During deployments          |
| Node drain      | During hardware maintenance |

---

# Learning Outcome

After completing these labs, you understand:

* Cluster initialization
* Multi-node management
* Service deployment
* Scaling & load balancing
* Rolling updates
* Node maintenance
* Routing mesh

---



# Docker `run` vs Docker Swarm 


### Important conceptual and practical difference:

> **`docker run` runs a container**
> **Docker Swarm runs a service (cluster-managed containers)**

---

# 1. Why Compare Them?

Root of confuse:

```bash
docker run nginx
```

vs

```bash
docker service create nginx
```

Both run containers — but the architecture, purpose, and behavior are completely different.

Understanding this difference is critical for:

* Dev vs Production environments
* Single-node vs Multi-node deployments
* High availability systems
* Scaling applications properly

---

# 2. Conceptual Difference

| Feature             | docker run       | Docker Swarm (docker service) |
| ------------------- | ---------------- | ----------------------------- |
| Scope               | Single container | Cluster-managed service       |
| Environment         | Single host      | Multi-node cluster            |
| Scaling             | Manual           | Automatic                     |
| Load balancing      | No               | Yes                           |
| Self-healing        | No               | Yes                           |
| Rolling updates     | No               | Yes                           |
| Desired state model | No               | Yes                           |
| Production-ready    | Limited          | Yes                           |

---

# 3. What `docker run` Actually Does

When you execute:

```bash
docker run nginx
```

Docker:

1. Creates container
2. Starts container
3. Runs on current host only
4. No cluster awareness

If container crashes:

* It stays stopped (unless restart policy set)

---

# 4. What Swarm Does Instead

When you execute:

```bash
docker service create --replicas 3 nginx
```

Swarm:

1. Creates service definition
2. Creates tasks (containers)
3. Distributes across nodes
4. Maintains desired state
5. Recreates failed containers
6. Load balances traffic

---

# 5. Command Structure Comparison

## A. Basic Container Run

```bash
docker run -d -p 8080:80 --name web nginx
```

### Flag Explanation

* `run` → Create & start container
* `-d` → Detached mode (background)
* `-p 8080:80` → Publish port (host:container)
* `--name web` → Assign container name
* `nginx` → Image

---

## Equivalent in Swarm

```bash
docker service create \
  --name web \
  --replicas 1 \
  -p 8080:80 \
  nginx
```

### New Concepts

* `service create` → Create service (not container)
* `--replicas 1` → Desired number of containers

---

# 6. Common Flags (Same Purpose, Different Context)

| Purpose        | docker run       | docker service create | Notes                   |
| -------------- | ---------------- | --------------------- | ----------------------- |
| Name           | `--name`         | `--name`              | Same                    |
| Publish Port   | `-p`             | `-p`                  | Swarm uses routing mesh |
| Environment    | `-e`             | `-e`                  | Same                    |
| Mount Volume   | `-v` / `--mount` | `--mount`             | Slight syntax diff      |
| Network        | `--network`      | `--network`           | Swarm uses overlay      |
| Detach         | `-d`             | Default               | Swarm runs detached     |
| Restart policy | `--restart`      | `--restart-condition` | Swarm more advanced     |

---

# 7. Different Flags (Swarm-Specific)

These DO NOT exist in `docker run`:

| Swarm Flag             | Purpose                     |
| ---------------------- | --------------------------- |
| `--replicas`           | Number of containers        |
| `--mode`               | replicated / global         |
| `--update-delay`       | Rolling update delay        |
| `--update-parallelism` | Update concurrency          |
| `--constraint`         | Node placement              |
| `--limit-cpu`          | Resource limit cluster-wide |
| `--reserve-memory`     | Resource reservation        |
| `--with-registry-auth` | Pass registry credentials   |
| `--placement-pref`     | Spread tasks                |

---

# 8. Detailed Flag Comparison by Category

---

# A. Port Publishing

## docker run

```bash
docker run -p 8080:80 nginx
```

* Direct port binding on host
* Only works on that host

---

## Swarm

```bash
docker service create -p 8080:80 nginx
```

* Uses routing mesh
* Accessible from ANY node
* Built-in load balancing

---

# B. Scaling

## docker run

To scale manually:

```bash
docker run -d nginx
docker run -d nginx
docker run -d nginx
```

No grouping. No load balancing.

---

## Swarm

```bash
docker service create --replicas 3 nginx
```

Or later:

```bash
docker service scale web=5
```

Automatic:

* Scheduling
* Load balancing
* Health monitoring

---

# C. Restart Policy

## docker run

```bash
docker run --restart always nginx
```

Options:

* no
* on-failure
* always
* unless-stopped

---

## Swarm

```bash
docker service create \
  --restart-condition on-failure \
  --restart-delay 5s \
  nginx
```

More control:

* Delay
* Max attempts
* Window

---

# D. Resource Limits

## docker run

```bash
docker run --cpus="1.5" --memory="512m" nginx
```

Limits container only on that host.

---

## Swarm

```bash
docker service create \
  --limit-cpu 1.5 \
  --limit-memory 512m \
  nginx
```

Cluster-aware scheduling:

* Places task only where resources available

---

# E. Networking

## docker run

```bash
docker run --network mybridge nginx
```

Uses:

* bridge
* host
* custom bridge

---

## Swarm

```bash
docker service create --network myoverlay nginx
```

Uses:

* overlay network (multi-host)

Requires:

```bash
docker network create --driver overlay myoverlay
```

---

# F. Volumes

## docker run

```bash
docker run -v myvol:/data nginx
```

Works locally.

---

## Swarm

```bash
docker service create \
  --mount type=volume,source=myvol,target=/data \
  nginx
```

Better syntax:

* Explicit type
* Source
* Target

---

# G. Placement Constraints (Swarm Only)

```bash
docker service create \
  --constraint 'node.role==worker' \
  nginx
```

Meaning:

* Only run on worker nodes

Not available in `docker run`.

---

# H. Rolling Updates (Swarm Only)

```bash
docker service update \
  --image nginx:latest \
  --update-parallelism 1 \
  --update-delay 10s \
  web
```

Not possible with `docker run`.

---

# I. Global Mode (Swarm Only)

```bash
docker service create \
  --mode global \
  nginx
```

Meaning:

* 1 container per node

Used for:

* Monitoring agents
* Logging agents

Not possible with `docker run`.

---

# 9. Architectural Difference

## docker run Architecture

User → Docker Engine → Container

Single machine only.

---

## Docker Swarm Architecture

User → Manager Node → Scheduler → Worker Nodes → Tasks

Cluster-based.

---

# 10. Real-World Use Case Comparison

## When to Use docker run

* Learning Docker
* Quick testing
* Debugging container
* Local development
* Single-server apps

---

## When to Use Docker Swarm

* Production applications
* High availability systems
* Horizontal scaling
* Multi-node clusters
* Rolling updates required
* Load-balanced services

---

# 11. Side-by-Side Example

### Single Host Dev

```bash
docker run -d -p 8080:80 nginx
```

Simple, fast.

---

### Production Cluster

```bash
docker service create \
  --name web \
  --replicas 5 \
  --limit-memory 512m \
  --update-delay 10s \
  -p 8080:80 \
  nginx
```

* 5 replicas
* Auto healing
* Load balanced
* Rolling updates
* Resource aware

---

# 12. Final Summary

| Capability           | docker run | Docker Swarm  |
| -------------------- | ---------- | ------------- |
| Runs container       | Yes        | Yes (as task) |
| Multi-node           | No         | Yes           |
| Scaling              | Manual     | Built-in      |
| Auto-healing         | No         | Yes           |
| Rolling updates      | No         | Yes           |
| Routing mesh         | No         | Yes           |
| Placement rules      | No         | Yes           |
| Resource scheduling  | Basic      | Advanced      |
| Production readiness | Limited    | Yes           |

---

# Final Understanding

`docker run` is **container-level execution**.
Docker Swarm is **cluster-level orchestration**.

Think of it as:

* docker run → Single soldier
* Swarm → Army management system
