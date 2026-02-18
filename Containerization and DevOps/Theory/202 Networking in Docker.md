# 1. Networking in Docker – Fundamentals

## Why Docker Networking is Needed

Containers:

* Run in isolated environments
* Have their own network namespace
* Need to communicate:

  * Container ↔ Container
  * Container ↔ Host
  * Container ↔ External world
  * Cross-host (multi-node cluster)

Docker provides a pluggable networking model via **network drivers**.

---

## Core Concepts

### 1. Network Namespace

Each container gets:

* Own IP
* Own routing table
* Own network interfaces
* Own port space

### 2. Virtual Ethernet (veth pair)

Docker connects containers using:

* One side inside container
* One side attached to bridge on host

### 3. Docker Embedded DNS

* Automatic container name resolution
* Works inside user-defined bridge/overlay networks

---

# 2. Docker Network Drivers

Docker supports multiple network drivers:

| Driver  | Scope                    | Isolation      | Multi-host | Performance | Complexity  |
| ------- | ------------------------ | -------------- | ---------- | ----------- | ----------- |
| bridge  | Single host              | Medium         | No         | Good        | Simple      |
| host    | Single host              | None           | No         | Excellent   | Very Simple |
| overlay | Multi-host               | Strong         | Yes        | Moderate    | Complex     |
| macvlan | Single host (can extend) | High           | Limited    | High        | Medium      |
| ipvlan  | Single host              | High           | Limited    | High        | Medium      |
| none    | Single host              | Full isolation | No         | N/A         | Simple      |

---

# 3. Bridge Network (Default Driver)

## What is Bridge Network?

* Default driver
* Creates virtual bridge `docker0`
* Containers get private IP (172.x.x.x)
* NAT used for external communication


## Types

1. Default bridge (`docker0`)
2. User-defined bridge (recommended)


## Requirements

* Single host
* No cross-host communication
* Internal microservices
* Development environment

---

## Hands-on Tasks

### Task 1: Inspect Default Bridge

```bash
docker network ls
docker network inspect bridge
```


### Task 2: Create Custom Bridge

```bash
docker network create my_bridge
docker network inspect my_bridge
```


### Task 3: Run Containers in Same Network

```bash
docker run -dit --name container1 --network my_bridge nginx
docker run -dit --name container2 --network my_bridge busybox
```

Test DNS:

```bash
docker exec -it container2 ping container1
```

Notice:

* DNS resolution works automatically
* No need to know IP

---

## Advantages

* Easy
* Built-in DNS
* Good isolation
* Ideal for microservices on same host

## Disadvantages

* Not multi-host
* Slight NAT overhead

---

# 4. Host Network

## What is Host Networking?

Container shares:

* Host IP
* Host network stack
* No separate namespace


## Behavior

If nginx runs in container on port 80:
It binds directly to host port 80.

No port publishing required.


## Requirements

* High performance
* No port isolation needed
* Linux only (not Docker Desktop Mac/Windows fully supported)

---

## Hands-on Task

```bash
docker run -d --network host nginx
```

Check:

```bash
ss -tulnp | grep 80
```

You’ll see nginx directly on host.

---

## Advantages

* Best performance
* No NAT
* Low latency

## Disadvantages

* No isolation
* Port conflicts
* Security risk

---

# 5. Overlay Network

## What is Overlay Network?

* Multi-host networking
* Used in Docker Swarm / Kubernetes
* Uses VXLAN tunneling
* Containers across different hosts can communicate


## Requirements

* Multiple hosts
* Swarm mode enabled
* Open ports:

  * 2377 (cluster management)
  * 7946 (communication)
  * 4789 (overlay network)

---
## Setup Hands-on (Swarm)

### Task 1: Initialize Swarm

```bash
docker swarm init
```


### Task 2: Create Overlay Network

```bash
docker network create -d overlay my_overlay
```


### Task 3: Deploy Service

```bash
docker service create --name web --network my_overlay nginx
```

---

## Advantages

* Cross-host communication
* Service discovery
* Encrypted traffic option

## Disadvantages

* More complex
* Slight performance overhead (encapsulation)

---

# 6. MACVLAN Network

## What is MACVLAN?

* Container gets:

  * Real MAC address
  * IP from physical network
* Appears as physical device in LAN


## Use Case

* Legacy apps needing:

  * Direct LAN IP
  * Static IP
  * Network appliances
  * Monitoring tools


## Requirements

* Network switch must allow multiple MAC per port
* Not suitable for WiFi adapters often
* Host cannot directly talk to container unless configured

---

## Hands-on Task

```bash
docker network create -d macvlan \
  --subnet=192.168.1.0/24 \
  --gateway=192.168.1.1 \
  -o parent=eth0 \
  my_macvlan
```

Run container:

```bash
docker run -dit --network my_macvlan --ip 192.168.1.50 nginx
```

---

## Advantages

* Full LAN integration
* No NAT
* Real IP assignment

## Disadvantages

* Complex
* Host communication issues
* Network dependency

---

# 7. IPVLAN Network

Similar to macvlan but:

* Shares MAC address
* Multiple IPs per MAC
* Lower broadcast overhead


## Modes

* L2 mode
* L3 mode


## Use Case

* Large-scale container deployment
* Reduced broadcast domain load
* Datacenter environments

---

## Hands-on Example

```bash
docker network create -d ipvlan \
  --subnet=192.168.1.0/24 \
  --gateway=192.168.1.1 \
  -o parent=eth0 \
  my_ipvlan
```

---

## Comparison: MACVLAN vs IPVLAN

| Feature              | MACVLAN       | IPVLAN |
| -------------------- | ------------- | ------ |
| MAC per container    | Yes           | No     |
| Broadcast traffic    | Higher        | Lower  |
| Switch compatibility | Needs support | Easier |
| Performance          | High          | High   |

---

# 8. Publishing Ports

Used mainly in bridge mode.


## Syntax

### Using -p

```bash
docker run -p 8080:80 nginx
```

Format:

```
hostPort:containerPort
```

---

### Bind specific IP

```bash
docker run -p 127.0.0.1:8080:80 nginx
```

---

## -P (capital P)

Automatically maps all exposed ports:

```bash
docker run -P nginx
```

---

## Inspect Mapping

```bash
docker ps
docker port container_name
```

---

# 9. IP Address and Hostname

## Container IP

```bash
docker inspect container_name
```

Look under:

```
NetworkSettings
```

---

## Set Hostname

```bash
docker run -dit --hostname myhost ubuntu
```


## Test

```bash
docker exec -it container_name hostname
```

---

# 10. Docker Embedded DNS

Available in:

* User-defined bridge
* Overlay networks


## Works like:

Container name → IP resolution

Example:

```bash
docker exec container2 ping container1
```

No manual `/etc/hosts` needed.

---

# 11. Network Drivers Use Case Summary

| Scenario                         | Best Driver | Reason         |
| -------------------------------- | ----------- | -------------- |
| Single-host dev                  | bridge      | Easy, isolated |
| High-performance app             | host        | No NAT         |
| Microservices cluster            | overlay     | Multi-host     |
| Legacy app needing real LAN IP   | macvlan     | Direct LAN     |
| Large datacenter container infra | ipvlan      | Scalable       |
| Full isolation                   | none        | No network     |

---

# 12. Trade-off Summary

| Driver  | Isolation | Performance | Complexity | Multi-host |
| ------- | --------- | ----------- | ---------- | ---------- |
| bridge  | Medium    | Good        | Low        | No         |
| host    | None      | Best        | Low        | No         |
| overlay | Strong    | Medium      | High       | Yes        |
| macvlan | High      | High        | Medium     | Limited    |
| ipvlan  | High      | High        | Medium     | Limited    |

---

# 13. Real-World Architecture Examples

### Example 1: Dev Environment

Frontend → Backend → DB
All on bridge network
Expose only frontend.


### Example 2: Production Cluster

Web service replicated
Overlay network
Load balanced
Encrypted overlay


### Example 3: Monitoring Appliance

Use macvlan
Assign real LAN IP
Network scanning enabled

---

# 14. Advanced Lab Challenge

### Lab 1: Microservice Architecture

1. Create custom bridge
2. Run:

   * nginx
   * mysql
   * redis
3. Test DNS resolution
4. Publish only nginx


### Lab 2: Host Mode Benchmark

1. Run nginx in bridge
2. Run nginx in host
3. Compare latency using curl or ab


### Lab 3: Multi-host Simulation

1. Enable swarm
2. Create overlay
3. Deploy 2 services
4. Scale service
5. Inspect network

---

# 15. Interview-Level Questions

1. Difference between bridge and host networking?
2. Why is overlay required in swarm?
3. When to use macvlan over bridge?
4. How does Docker DNS work?
5. Why host networking is risky?

---

# Final Architecture Understanding

Think of it like:

* bridge → Apartment building
* host → Same house
* overlay → Tunnels connecting buildings
* macvlan → Separate physical house
* ipvlan → Same building, different rooms but shared entrance

