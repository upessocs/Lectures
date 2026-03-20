# Docker Swarm — Complete Practical Guide with Use Cases & Hands-On

We have already covered containers, images, networking, and volumes.

> Now we move to **cluster-level management** — running containers across multiple machines reliably.

---

## Part 1: Docker Swarm Basics

### What is Docker Swarm?

Docker Swarm is a **container orchestration tool** built into Docker Engine that allows you to manage a cluster of Docker hosts (nodes) as a single virtual system.

### Why Do We Need Docker Swarm?

#### Problem Without Swarm
When you run containers using `docker run`:
- Runs on single machine only
- No automatic recovery if container crashes
- No scaling across multiple servers
- No built-in load balancing
- Manual management

#### Real World Requirements

| Requirement | Example Scenario |
|------------|-------------------|
| High availability | Web app must not go down |
| Auto healing | If container crashes → restart automatically |
| Horizontal scaling | Increase instances during high traffic |
| Rolling updates | Update app without downtime |
| Load balancing | Distribute traffic across replicas |
| Multi-node cluster | Use multiple physical/VM servers |

Docker Swarm solves all of this.

### Key Concepts

#### Swarm
A **cluster of Docker hosts** working together as a single system.

#### Nodes
A machine participating in the swarm. Two types:
- **Manager Node** → Controls cluster, maintains state, schedules services
- **Worker Node** → Runs containers (tasks)

#### Service
A definition of desired state. Example: "Run 3 nginx containers and keep them running." Swarm ensures desired state is maintained.

#### Task
A single running container inside a service. If service replicas = 3 → 3 tasks created.

#### Load Balancing
Swarm distributes traffic automatically across replicas using Routing Mesh.

---

## Part 2: Network Requirements & Setup

### Required Ports for Swarm Communication

For proper swarm operation, these ports must be open:

| Port | Purpose |
|------|---------|
| **2377/tcp** | Cluster management (secure client-to-swarm communication) |
| **7946/tcp/udp** | Container network discovery |
| **4789/udp** | Overlay network traffic (VXLAN) |

### Network Setup Options

#### Option 1: Campus/Office WiFi (May Be Blocked)
Many campus networks block these ports for security. If you encounter issues:

#### Option 2: Mobile Hotspot (Recommended for Labs)
Create a mobile hotspot from your phone:
1. Enable hotspot on your phone
2. Connect all machines to this same WiFi network
3. Check connectivity: `ping <other-node-ip>`
4. Proceed with swarm setup

#### Option 3: Cloud VMs
If using cloud providers (AWS, GCP, Azure), configure security groups to allow these ports.

### Verify Network Connectivity

Before initializing swarm, ensure nodes can communicate:
```bash
# On all nodes, check IP address
ip addr show  # Linux
ipconfig      # Windows

# Ping between nodes (replace with actual IPs)
ping 192.168.43.100
```

---

## Part 3: Setting Up the Swarm Cluster

### Important Note: Single-Node vs Multi-Node

**Even if you have only one machine**, you can still:
- Initialize a swarm
- Create services
- Scale replicas (they run on the same node)
- Practice all swarm commands
- Learn concepts before adding more nodes

The process is identical whether you have 1 node or 100 nodes!

---

### Step 1: Initialize Swarm (Manager Node)

On the machine that will be the manager:

```bash
docker swarm init --advertise-addr <MANAGER-IP>
```

**Example with actual IP:**
```bash
docker swarm init --advertise-addr 192.168.43.100
```

**Explanation:**
- `docker swarm init` → Initialize a new swarm cluster
- `--advertise-addr` → IP address other nodes use to reach manager

**Output includes:**
- Current node becomes manager
- Join token for workers (save this!)

### Step 2: Verify Manager Node

```bash
docker node ls
```

Shows:
- Node ID
- Status (Ready/Unavailable)
- Role (Manager/Worker)
- Manager Status (Leader/Reachable)

---

### Step 3: Add Worker Nodes (If Available)

**If you have additional machines**, on each worker node run:

```bash
docker swarm join --token <TOKEN> <MANAGER-IP>:2377
```

**Example:**
```bash
docker swarm join --token SWMTKN-1-abc123... 192.168.43.100:2377
```

**Explanation:**
- `join` → Join existing swarm
- `--token` → Authentication token (from manager)
- `<MANAGER-IP>:2377` → Manager IP and swarm port

### Step 4: Verify All Nodes

On manager node:
```bash
docker node ls
```

All nodes should appear with status "Ready".

---

## Part 4: Working with Services

### Group 1: Service Creation & Inspection

#### Create a Web Service

```bash
docker service create \
  --name webapp \
  --replicas 3 \
  -p 8080:80 \
  nginx
```

**Explanation:**
- `--name webapp` → Service name
- `--replicas 3` → Run 3 container instances
- `-p 8080:80` → Publish port (host:container)
- `nginx` → Image name

#### List Services

```bash
docker service ls
```

Shows all running services with:
- ID, Name, Mode, Replicas, Image, Ports

#### Inspect Service Details

```bash
# Detailed JSON view
docker service inspect webapp

# Pretty-printed human-readable format
docker service inspect --pretty webapp
```

#### View Service Tasks (Containers)

```bash
docker service ps webapp
```

Shows each replica, which node it's on, and current state.

---

### Group 2: Scaling Services

#### Scale Up (More Replicas)

```bash
docker service scale webapp=6
```

**What happens:**
- Swarm creates 3 new containers
- Distributes them across available nodes
- Updates load balancer automatically

#### Scale Down

```bash
docker service scale webapp=2
```

**What happens:**
- Swarm gracefully stops 4 containers
- Removes them from load balancer

#### Verify Scaling

```bash
docker service ls
docker service ps webapp
```

---

### Group 3: Rolling Updates

#### Create Service with Specific Version

```bash
docker service create \
  --name app \
  --replicas 3 \
  nginx:1.25
```

#### Perform Rolling Update

```bash
docker service update \
  --image nginx:latest \
  --update-parallelism 1 \
  --update-delay 10s \
  app
```

**Explanation:**
- `--image nginx:latest` → New image version
- `--update-parallelism 1` → Update 1 container at a time
- `--update-delay 10s` → Wait 10 seconds between updates

**Benefits:**
- Zero downtime
- Controlled rollout
- Easy rollback if issues

#### Rollback (If Needed)

```bash
docker service rollback app
```

---

### Group 4: Node Management

#### Drain a Node (Maintenance Mode)

When a node needs maintenance:

```bash
# Get node ID
docker node ls

# Drain the node
docker node update --availability drain <NODE-ID>
```

**What happens:**
- Containers gracefully stop
- Tasks rescheduled to other nodes
- Node marked as unavailable for new tasks

#### Activate Node Again

```bash
docker node update --availability active <NODE-ID>
```

Node rejoins the cluster and receives tasks.

#### Remove Node from Swarm

On the node being removed:
```bash
docker swarm leave
```

On manager:
```bash
docker node rm <NODE-ID>
```

---

### Group 5: Understanding Routing Mesh

#### What is Routing Mesh?

Swarm's built-in load balancer that exposes services on **all nodes**, regardless of where containers run.

#### How It Works

- Creates an **ingress network** (overlay network)
- Assigns Virtual IP (VIP) to each service
- Routes traffic from any node to available containers
- Provides automatic load balancing

#### Test Routing Mesh

1. Deploy service:
```bash
docker service create \
  --name mesh-test \
  --replicas 2 \
  -p 8080:80 \
  nginx
```

2. Access from ANY node IP:
```
http://<manager-ip>:8080
http://<worker1-ip>:8080
http://<worker2-ip>:8080
```

All requests work, even if no container runs on that node!

---

### Group 6: Advanced Service Configuration

#### Resource Limits

```bash
docker service create \
  --name web \
  --replicas 3 \
  --limit-cpu 1.5 \
  --limit-memory 512m \
  --reserve-cpu 0.5 \
  --reserve-memory 256m \
  nginx
```

#### Placement Constraints

```bash
# Run only on worker nodes
docker service create \
  --name web \
  --replicas 3 \
  --constraint 'node.role==worker' \
  nginx

# Run only on specific node
docker service create \
  --name web \
  --replicas 2 \
  --constraint 'node.hostname==worker-01' \
  nginx
```

#### Global Mode (One Container Per Node)

```bash
docker service create \
  --name monitoring-agent \
  --mode global \
  nginx
```

Useful for: logging agents, monitoring tools, backup agents

---

### Group 7: Networks and Volumes

#### Create Overlay Network (Multi-Host)

```bash
docker network create \
  --driver overlay \
  --attachable \
  myoverlay
```

#### Deploy Service with Custom Network

```bash
docker service create \
  --name app \
  --replicas 3 \
  --network myoverlay \
  nginx
```

#### Add Volumes

```bash
docker service create \
  --name web \
  --replicas 3 \
  --mount type=volume,source=webdata,target=/usr/share/nginx/html \
  nginx
```

---

### Group 8: Clean Up

#### Remove a Service

```bash
docker service rm webapp
```

Removes all containers associated with the service.

#### Leave Swarm (On Each Node)

On worker nodes:
```bash
docker swarm leave
```

On manager (last node):
```bash
docker swarm leave --force
```

#### Remove Overlay Network

```bash
docker network rm myoverlay
```

---

## Part 5: docker run vs docker service create

### Quick Comparison

| Feature | docker run | docker service create |
|---------|-----------|----------------------|
| Scope | Single container | Cluster-managed service |
| Environment | Single host | Multi-node cluster |
| Scaling | Manual | Built-in (`--replicas`) |
| Load balancing | No | Yes (Routing Mesh) |
| Self-healing | Limited (--restart) | Yes (desired state) |
| Rolling updates | No | Yes |
| Production-ready | Limited | Yes |

### Command Comparison

**Single Container (docker run):**
```bash
docker run -d -p 8080:80 --name web nginx
```

**Swarm Service (docker service create):**
```bash
docker service create \
  --name web \
  --replicas 3 \
  -p 8080:80 \
  nginx
```

### When to Use Each

**Use docker run for:**
- Local development
- Quick testing
- Debugging
- Learning Docker basics

**Use Docker Swarm for:**
- Production deployments
- High availability
- Horizontal scaling
- Multi-node clusters
- Zero-downtime updates

---

## Part 6: Real Industry Use Case

### E-commerce Website Architecture

| Layer | Swarm Configuration |
|-------|---------------------|
| Frontend | 5 replicas, load balanced |
| Backend API | 4 replicas, resource limited |
| Redis Cache | 3 replicas, global mode |
| Database | Stateful service with volumes |
| Monitoring | Global mode (1 per node) |
| Logging | Global mode with constraints |

### Deployment Strategy

```bash
# Frontend service
docker service create \
  --name frontend \
  --replicas 5 \
  --limit-cpu 0.5 \
  --limit-memory 256m \
  -p 80:80 \
  --update-parallelism 1 \
  --update-delay 10s \
  frontend:latest

# Backend API
docker service create \
  --name api \
  --replicas 4 \
  --limit-cpu 1.0 \
  --limit-memory 512m \
  --network backend \
  api:latest
```

---

## Summary: Essential Docker Swarm Commands

### Swarm Management
| Command | Purpose |
|---------|---------|
| `docker swarm init --advertise-addr <IP>` | Initialize swarm |
| `docker swarm join --token <TOKEN> <IP>:2377` | Join as worker |
| `docker swarm leave` | Leave swarm |
| `docker swarm leave --force` | Force leave (manager) |

### Node Management
| Command | Purpose |
|---------|---------|
| `docker node ls` | List all nodes |
| `docker node inspect <NODE-ID>` | Show node details |
| `docker node update --availability drain <NODE-ID>` | Drain node |
| `docker node update --availability active <NODE-ID>` | Activate node |
| `docker node rm <NODE-ID>` | Remove node |

### Service Management
| Command | Purpose |
|---------|---------|
| `docker service create [OPTIONS] IMAGE` | Create service |
| `docker service ls` | List services |
| `docker service ps <SERVICE>` | List service tasks |
| `docker service inspect <SERVICE>` | Show service details |
| `docker service logs <SERVICE>` | View service logs |
| `docker service rm <SERVICE>` | Remove service |

### Service Operations
| Command | Purpose |
|---------|---------|
| `docker service scale <SERVICE>=<REPLICAS>` | Scale service |
| `docker service update [OPTIONS] <SERVICE>` | Update service |
| `docker service rollback <SERVICE>` | Rollback update |

### Network Management
| Command | Purpose |
|---------|---------|
| `docker network create --driver overlay NETWORK` | Create overlay network |
| `docker network ls` | List networks |
| `docker network rm NETWORK` | Remove network |

---

# Docker Stack: Deploying Multi-Container Applications in Swarm
### What is Docker Stack?

Docker Stack is a feature that allows you to deploy and manage multi-container applications in a Docker Swarm cluster using a declarative YAML file (similar to `docker-compose.yml`). It bridges the gap between development (`docker-compose`) and production (`Swarm`).


# Docker Stack Deploy: The One Command You Need

## The Magic Command

```bash
docker stack deploy -c docker-compose.yml myapp
```

> That's it! One command to deploy your entire multi-container application to a Docker Swarm cluster.

## What This Single Command Does

When you run `docker stack deploy -c docker-compose.yml myapp`, Docker automatically:

### 1. **Creates Everything Defined in Your Compose File**
- All services (containers)
- All networks (overlay networks)
- All volumes
- All configs
- All secrets

### 2. **Distributes Containers Across Swarm Nodes**
- Automatically spreads replicas across available nodes
- Respects placement constraints if defined

### 3. **Sets Up Load Balancing**
- Creates routing mesh for published ports
- Load balances traffic across all replicas

### 4. **Enables Self-Healing**
- Swarm maintains desired state
- If containers crash, Swarm recreates them

## Minimal Example

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  web:
    image: nginx
    ports:
      - "80:80"
    deploy:
      replicas: 3
  
  api:
    image: your-api:latest
    environment:
      - DB_URL=postgres://db:5432/app
    deploy:
      replicas: 2

  db:
    image: postgres:13
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

**Deploy with ONE command:**
```bash
docker stack deploy -c docker-compose.yml myapp
```

## What You'll See

```bash
# After running the command
Creating network myapp_default
Creating service myapp_web
Creating service myapp_api
Creating service myapp_db
```

## Verify Everything Worked

```bash
# List all stacks
docker stack ls

# List services in your stack
docker stack services myapp

# List all containers (tasks) in your stack
docker stack ps myapp

# Check individual service
docker service logs myapp_web
```

## Common Variations

### With Different Compose File Name
```bash
docker stack deploy -c docker-stack.yml myapp
```

### With Environment Variables
```bash
docker stack deploy -c docker-compose.yml --with-registry-auth myapp
```

### Override Stack Name
```bash
docker stack deploy -c docker-compose.yml production-app
```

## What Happens Behind the Scenes

| Step | Action |
|------|--------|
| 1 | Reads your compose file |
| 2 | Converts to swarm service definitions |
| 3 | Creates networks (overlay) |
| 4 | Creates volumes (if defined) |
| 5 | Creates each service with replicas |
| 6 | Sets up load balancing |
| 7 | Monitors desired state |

## Clean Up (Also One Command)

```bash
# Remove entire stack and all its resources
docker stack rm myapp
```

## Key Points to Remember

1. **Version matters** - Use version 3+ in compose file for swarm mode
2. **Deploy section** - Add `deploy:` in compose file for swarm-specific configs
3. **One command** - `docker stack deploy` is all you need
4. **Self-healing** - No manual restart needed if containers fail
5. **Load balanced** - Traffic automatically distributed

## Quick Reference

```bash
# Deploy
docker stack deploy -c compose.yml appname

# List stacks
docker stack ls

# List services in stack
docker stack services appname

# List containers in stack
docker stack ps appname

# Remove stack
docker stack rm appname
```

That's the power of Docker Stack - one command to deploy your entire application to a production-ready cluster!

