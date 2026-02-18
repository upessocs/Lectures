# Docker Networking – Complete Guide (Part 1: Core Concepts)

## 1. What is Docker Networking?

When you run a container, it runs in an isolated environment. Think of it like an apartment:
- Each apartment (container) has its own address (IP)
- Apartments need ways to talk to each other (hallways)
- They need ways to get mail from outside (internet access)
- They need doors (ports) to receive visitors

**Docker networking solves:**
- Container ↔ Container communication
- Container ↔ Host machine communication  
- Container ↔ Internet communication
- Containers on different servers talking to each other

---

## 2. Docker Network Drivers (The Basics)

Docker provides different types of networks (drivers) for different needs:

| Driver | Simple Analogy | When to Use |
|--------|---------------|-------------|
| **bridge** | Apartment building with shared hallway | Default for single host, most common |
| **host** | Living in same room as host | Need max performance, no isolation needed |
| **overlay** | Underground tunnel connecting buildings | Multiple servers need to talk |
| **macvlan** | Separate house with own mailbox | Need real network IP |
| **none** | Isolated room with no doors | Complete isolation needed |

---

## 3. Bridge Network (The Default)

### What is Bridge?

When you install Docker, it creates a default bridge network called `docker0`. Think of it as a virtual switch inside your computer.

```bash
# See all networks
docker network ls
```

Output:
```
NETWORK ID     NAME      DRIVER    SCOPE
xxxxxx         bridge    bridge    local
xxxxxx         host      host      local
xxxxxx         none      null      local
```

### Your First Bridge Network Tasks

#### Task 1: Inspect the Default Bridge
```bash
# Look at bridge details
docker network inspect bridge
```
**What you'll see:** IP range (172.17.0.0/16), gateway, and any connected containers.

#### Task 2: Create Your Own Bridge (Better than default)
```bash
# Create custom bridge (like creating your own private network)
docker network create my_app_net

# Verify it exists
docker network ls

# Inspect it
docker network inspect my_app_net
```
**Why custom bridge?** It gives you automatic DNS (containers can find each other by name).

#### Task 3: Run Containers in Your Network
```bash
# Run an nginx web server
# -d = detach (run in background)
# --name = give it a name
# --network = which network to use
docker run -d --name web --network my_app_net nginx

# Run a utility container
docker run -d --name utils --network my_app_net alpine sleep 3600

# Test if they can talk (using container names!)
docker exec utils ping web
```
**Magic moment:** Ping works using container names! Docker runs its own DNS.

#### Task 4: Publish a Port (Make Container Accessible)
```bash
# Run nginx and make it available on your computer's port 8080
# -p 8080:80 means "host port 8080 maps to container port 80"
docker run -d --name web-public -p 8080:80 nginx

# Open browser and go to: http://localhost:8080
# You'll see nginx welcome page!

# Check the port mapping
docker port web-public
# Shows: 80/tcp -> 0.0.0.0:8080
```

### Bridge Network Cheat Sheet
```bash
# List networks
docker network ls

# Create network
docker network create mynet

# Run container in network
docker run -d --network mynet --name myapp nginx

# Connect running container to network
docker network connect mynet mycontainer

# Disconnect container
docker network disconnect mynet mycontainer

# Remove network
docker network rm mynet
```

---

## 4. Host Network

### What is Host Network?

Container shares your computer's network directly – no separation, no private IP.

```bash
# Run nginx in host network
# --network host means "use my computer's network directly"
docker run -d --network host --name nginx-host nginx

# Check if it's running on host port 80
# On Linux:
ss -tulnp | grep 80

# On Mac/Windows (Docker Desktop):
# Host network works differently, better to use bridge with -p
```

**When to use:**
- Need maximum performance
- Application needs to monitor host network
- Short-term testing

**When NOT to use:**
- Need isolation (containers can conflict with host apps)
- On Docker Desktop (limited support)
- Running multiple containers needing same ports

---

## 5. Publishing Ports Explained

### The -p Flag (Publish Ports)

```bash
# Basic syntax: -p HOST_PORT:CONTAINER_PORT
# Map port 8080 on host to port 80 in container
docker run -d -p 8080:80 nginx

# Map multiple ports
docker run -d \
  -p 8080:80 \
  -p 8443:443 \
  nginx

# Bind to specific IP (localhost only)
docker run -d -p 127.0.0.1:8080:80 nginx

# UDP port (for DNS, games, etc.)
docker run -d -p 53:53/udp mydns

# Random port assignment (capital P)
# Docker chooses random high port
docker run -d -P nginx

# See which random port was assigned
docker ps
# Or
docker port container_name
```

### Port Publishing Examples

```bash
# Example 1: Web app with database
# Database (no public port)
docker run -d --name db -e MYSQL_ROOT_PASSWORD=secret mysql

# Web app (public port 8080)
docker run -d --name web -p 8080:3000 --link db myapp

# Example 2: Multiple web servers
docker run -d -p 8081:80 --name web1 nginx
docker run -d -p 8082:80 --name web2 nginx
# Access: http://localhost:8081 and http://localhost:8082
```

---

## 6. Container Communication Basics

### Finding Container IP
```bash
# Get container IP address
docker inspect container_name | grep IPAddress

# Better way using format
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' container_name
```

### Setting Hostname
```bash
# Set custom hostname
docker run -d --hostname myserver --name test alpine sleep 3600

# Check hostname
docker exec test hostname
# Output: myserver
```

### Communication Examples

```bash
# Create network
docker network create demo

# Run two containers
docker run -d --network demo --name server nginx
docker run -d --network demo --name client alpine sleep 3600

# Test communication by name
docker exec client ping server
# Works! (on user-defined bridge)

# Test communication by IP
SERVER_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' server)
docker exec client ping $SERVER_IP
# Also works!
```

---

## 7. Simple Hands-On Lab: Two-Tier App

### Objective: Run a web app that talks to a database

```bash
# Step 1: Create a network for them to share
docker network create todo_app

# Step 2: Run MySQL database
# -e = environment variables
docker run -d \
  --network todo_app \
  --name mysql-db \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=todos \
  mysql:5.7

# Step 3: Run a simple web app
# This assumes you have a todo app image
docker run -d \
  --network todo_app \
  --name web-app \
  -p 3000:3000 \
  -e DB_HOST=mysql-db \
  your-todo-app:latest

# Step 4: Test the connection
# The web app can now connect to "mysql-db:3306" (default MySQL port)
# No need for IP addresses!

# Step 5: Verify
docker logs web-app  # Should show successful DB connection
```

**What just happened?** The web app connected to MySQL using the container name `mysql-db` – Docker DNS handled the IP lookup automatically.

---

## 8. Common Commands Reference

```bash
# Network management
docker network ls                    # List networks
docker network create mynet          # Create network
docker network rm mynet              # Delete network
docker network prune                 # Remove unused networks
docker network inspect mynet         # Show network details

# Container network commands
docker run --network mynet ...       # Run in specific network
docker network connect mynet cont    # Add container to network
docker network disconnect mynet cont # Remove from network

# Port publishing
-p 8080:80                          # Map port
-p 127.0.0.1:8080:80                # Bind to specific IP
-P                                  # Auto-assign ports

# Inspect networking
docker port cont                    # Show port mappings
docker inspect cont | grep IP       # Find IP
docker exec cont ip addr show       # Network inside container
```

---

## Part 1 Summary: What You've Learned

* What Docker networks are and why they matter
* Bridge network (default) and how to use it
* How to create custom networks
* Container-to-container communication
* Port publishing basics
* Simple two-tier application setup

**You're now ready for basic Docker networking!** This covers 80% of what you'll do day-to-day.

---

# Docker Networking – Part 2: Advanced Topics (Optional)

*This section covers advanced networking for when you need multi-host setups, special network types, or deeper understanding.*

---

## 1. Overlay Networks (Multi-Host)

### What is Overlay?

When you have multiple servers (hosts) running Docker, containers need to talk across hosts. Overlay networks create a virtual network that spans all hosts.

**Analogy:** Imagine tunnels connecting buildings – containers in different buildings can talk as if they're next door.

### Prerequisites for Overlay

1. **Docker Swarm mode enabled** (Docker's clustering solution)
2. **Ports open** between hosts:
   - 2377/tcp: Swarm management
   - 7946/tcp/udp: Node communication
   - 4789/udp: Overlay network traffic

### Important Note for Beginners

**If you're on a laptop/college WiFi:**
- Overlay networks for **multi-host** likely won't work (WiFi blocks the ports)
- But you can still **learn** by running everything on one machine!

### Single-Machine Overlay Lab (Learning Purpose)

```bash
# Step 1: Initialize Swarm (on one machine)
# --advertise-addr tells Swarm "I'm at this IP"
# Use 127.0.0.1 for learning (only works locally!)
docker swarm init --advertise-addr 127.0.0.1

# Step 2: Create overlay network
# --attachable allows regular containers to use it
docker network create -d overlay --attachable my_overlay

# Step 3: Run containers (they'll all be on same machine)
docker run -d --network my_overlay --name app1 alpine sleep 3600
docker run -d --network my_overlay --name app2 alpine sleep 3600

# Step 4: Test communication
docker exec app1 ping app2  # Works!
```

### Why This Works (Even on One Machine)
- Overlay is designed for multiple hosts
- But Docker can run it on one host for testing
- Real multi-host requires open ports and proper networking

### Real Multi-Host Setup (For Reference)

**On Host 1 (Manager):**
```bash
# Initialize with actual IP
docker swarm init --advertise-addr 192.168.1.10

# Shows join command for workers
docker swarm join-token worker
```

**On Host 2 (Worker):**
```bash
# Run the join command from manager
docker swarm join --token SWMTKN-1-xxxx 192.168.1.10:2377
```

**On Manager (after workers joined):**
```bash
# Create overlay (now spans both hosts)
docker network create -d overlay prod_net

# Deploy service (spreads across hosts)
docker service create \
  --name web \
  --network prod_net \
  --replicas 4 \
  nginx
```

---

## 2. MACVLAN Network

### What is MACVLAN?

Each container gets:
- A real MAC address (like a physical network card)
- A real IP from your physical network
- Appears as a separate device on your LAN

**Analogy:** Instead of apartments sharing a mailbox (NAT), each container has its own house with its own mailbox.

### When to Use MACVLAN

* **Good for:**
- Legacy apps that expect direct network access
- Network monitoring tools
- Apps that don't work well with NAT
- When you need containers to have real LAN IPs

**Not good for:**
- Laptops on WiFi (usually doesn't work)
- When host needs to talk to container (complex)
- Networks that limit MAC addresses per port

### MACVLAN Lab (If Your Network Allows)

```bash
# Step 1: Find your network details
# On Linux:
ip route show default
# Shows: default via 192.168.1.1 dev eth0
# Interface: eth0, Gateway: 192.168.1.1

# Step 2: Create MACVLAN network
# -o parent=eth0 : Use your actual network interface
docker network create -d macvlan \
  --subnet=192.168.1.0/24 \
  --gateway=192.168.1.1 \
  -o parent=eth0 \
  my_macvlan

# Step 3: Run container with specific IP
docker run -d \
  --name web-macvlan \
  --network my_macvlan \
  --ip 192.168.1.100 \
  nginx

# Step 4: Test from ANOTHER computer on same network
# Open browser to http://192.168.1.100
# Should see nginx!

# Step 5: Important - Host cannot reach container!
# This won't work (expected behavior)
curl 192.168.1.100  # From host, may fail
```

**Why host can't reach container:** The host's physical interface and the MACVLAN interface are separate – they don't talk to each other directly.

---

## 3. IPVLAN Network

### What is IPVLAN?

Similar to MACVLAN but containers share the host's MAC address while having different IPs.

**Analogy:** Apartment building with one main door (shared MAC) but different apartment numbers (IPs).

### IPVLAN vs MACVLAN

| Feature | MACVLAN | IPVLAN |
|--------|---------|--------|
| MAC addresses | One per container | One shared for all |
| Network switch load | Higher (learns many MACs) | Lower (one MAC) |
| Scalability | Limited by switch | Much higher |
| Best for | Small deployments | Large-scale |

### IPVLAN Lab

```bash
# Create IPVLAN network
docker network create -d ipvlan \
  --subnet=192.168.1.0/24 \
  --gateway=192.168.1.1 \
  -o parent=eth0 \
  -o ipvlan_mode=l2 \
  my_ipvlan

# Run container
docker run -d \
  --name web-ipvlan \
  --network my_ipvlan \
  --ip 192.168.1.110 \
  nginx
```

---

## 4. Embedded DNS Deep Dive

### How Docker DNS Works

In user-defined networks, Docker runs a DNS server at 127.0.0.11 inside each container.

```bash
# See it in action
docker run -it --network my_app_net alpine cat /etc/resolv.conf
# Shows: nameserver 127.0.0.11

# Test DNS resolution
docker run -it --network my_app_net alpine nslookup web
```

### DNS Resolution Order

1. **Container name** → IP (within same network)
2. **Service name** (Swarm) → Virtual IP
3. **External DNS** → Internet addresses

### DNS Examples

```bash
# Create network with two containers
docker network create dns_demo
docker run -d --network dns_demo --name app1 nginx
docker run -d --network dns_demo --name app2 alpine sleep 3600

# Test name resolution
docker exec app2 ping app1      # Works
docker exec app2 getent hosts app1  # Shows IP

# Different networks = no DNS
docker network create another_net
docker network connect another_net app2
# Now app2 is on two networks
docker exec app2 ping app1  # Still works (first network)
```

---

## 5. Advanced Port Publishing

### Publishing to Specific Interfaces

```bash
# Listen only on localhost (not accessible from network)
docker run -d -p 127.0.0.1:8080:80 nginx

# Listen on specific network interface
docker run -d -p 192.168.1.100:8080:80 nginx

# Different ports for different IPs
docker run -d \
  -p 127.0.0.1:8080:80 \
  -p 192.168.1.100:8081:80 \
  nginx
```

### Publishing Ranges

```bash
# Bind to random port in range
docker run -d -p 8000-9000:80 nginx
# Docker picks a free port between 8000-9000

# UDP range
docker run -d -p 8000-9000:80/udp nginx
```

---

## 6. Network Security Basics

### Isolating Networks

```bash
# Create internal network (no external access)
docker network create \
  --internal \
  --subnet=10.10.0.0/16 \
  internal_net

# Containers here can't reach internet
docker run -d --network internal_net --name db mysql
```

### Network Encryption (Swarm)

```bash
# Create encrypted overlay
docker network create \
  -d overlay \
  -o encrypted \
  secure_net
```

### Network Policies

```bash
# Run container with no network
docker run -d --network none --name isolated alpine sleep 3600

# Add specific networks later
docker network connect db_net isolated
docker network connect app_net isolated
```

---

## 7. Troubleshooting Commands

```bash
# Check network connectivity
docker exec container ping google.com
docker exec container nslookup google.com

# Check network config inside container
docker exec container ip addr show
docker exec container ip route show
docker exec container netstat -tuln

# Check Docker's network settings
docker network inspect network_name

# View container network details
docker inspect container_name | jq '.[0].NetworkSettings'

# Monitor network traffic (if tools installed)
docker exec container tcpdump -i eth0

# Test port connectivity
docker run --rm --network container:target_container alpine nc -zv localhost 80
```

---

## 8. Common Problems and Solutions

### Problem 1: Containers Can't Talk by Name
**Symptom:** `ping container2` fails
**Solution:** Use user-defined bridge, not default bridge
```bash
# Wrong
docker run --name app1 nginx
docker run --name app2 alpine ping app1  # Fails

# Correct
docker network create mynet
docker run --network mynet --name app1 nginx
docker run --network mynet --name app2 alpine ping app1  # Works
```

### Problem 2: Port Already in Use
**Symptom:** `docker: Error response from daemon: driver failed programming external connectivity`
**Solution:** Use different port or stop conflicting container
```bash
# Check what's using port 80
sudo lsof -i :80  # Linux
netstat -ano | findstr :80  # Windows

# Use different port
docker run -d -p 8080:80 nginx
```

### Problem 3: Container Can't Access Internet
**Symptom:** `ping google.com` fails
**Check:**
```bash
# Check DNS
docker exec container cat /etc/resolv.conf

# Check default route
docker exec container ip route

# Check if network is internal
docker network inspect network_name | grep internal
```

### Problem 4: Host Can't Reach MACVLAN Container
**Symptom:** Can ping from other machines but not host
**Solution:** This is by design. Workaround (complex):
```bash
# Create second MACVLAN for host (advanced)
ip link add macvlan_host link eth0 type macvlan mode bridge
ip addr add 192.168.1.200/24 dev macvlan_host
ip link set macvlan_host up
# Then host can reach containers at 192.168.1.x
```

---

## 9. Real-World Scenarios

### Scenario 1: Development Environment
```yaml
# docker-compose.yml
version: '3'
services:
  web:
    image: nginx
    ports:
      - "8080:80"
    networks:
      - frontend
      - backend
  app:
    image: node:14
    networks:
      - backend
  db:
    image: postgres
    networks:
      - backend
    environment:
      - POSTGRES_PASSWORD=secret

networks:
  frontend:
  backend:
```

### Scenario 2: Production with Swarm
```bash
# Create networks
docker network create -d overlay frontend
docker network create -d overlay backend

# Deploy services
docker service create \
  --name web \
  --network frontend \
  --publish 80:80 \
  --replicas 3 \
  nginx

docker service create \
  --name api \
  --network backend \
  --replicas 5 \
  myapi:latest

# Connect web to backend
docker service update --network-add backend web
```

### Scenario 3: Legacy App Migration
```bash
# App needs direct LAN IP
docker network create -d macvlan \
  --subnet=10.0.0.0/8 \
  --gateway=10.0.0.1 \
  -o parent=eth0 \
  legacy_net

docker run -d \
  --network legacy_net \
  --ip 10.0.1.50 \
  legacy-app:latest
```

---

## 10. Quick Reference Card

### Network Creation
```bash
# Bridge
docker network create mynet

# Overlay (with Swarm)
docker network create -d overlay myoverlay

# MACVLAN
docker network create -d macvlan \
  --subnet=192.168.1.0/24 \
  -o parent=eth0 \
  mymacvlan

# IPVLAN
docker network create -d ipvlan \
  --subnet=192.168.1.0/24 \
  -o parent=eth0 \
  myipvlan
```

### Port Publishing
```bash
# Single port
-p 8080:80

# Multiple ports
-p 8080:80 -p 8443:443

# Specific IP
-p 127.0.0.1:8080:80

# Random port
-P

# UDP
-p 53:53/udp
```

### Troubleshooting
```bash
# Quick checks
docker network ls
docker network inspect network_name
docker inspect container_name | grep -A 10 "Networks"
docker exec container_name ip addr
docker exec container_name ping other_container
```

---

## Part 2 Summary: Advanced Topics Covered

* Overlay networks (multi-host communication)
* MACVLAN (real IP per container)
* IPVLAN (scalable alternative)
* DNS deep dive
* Advanced port publishing
* Security basics
* Troubleshooting
* Real-world scenarios

---

## Final Tips

1. **Start simple** – Bridge networks cover 90% of use cases
2. **Always use user-defined bridges** for DNS resolution
3. **Understand before using** – Don't jump to overlay/macvlan without need
4. **Test locally first** – Even overlay can be tested on one machine
5. **Remember networking is complex** – When in doubt, use bridge