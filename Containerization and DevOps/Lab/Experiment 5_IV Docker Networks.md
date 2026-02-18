
## **Part 4: Docker Networks**

### **Lab 1: Understanding Docker Network Types**

#### **List Networks**
```bash
# Default networks
docker network ls

# Output:
# NETWORK ID     NAME      DRIVER    SCOPE
# abc123         bridge    bridge    local
# def456         host      host      local
# ghi789         none      null      local
```
---
### **Lab 2: Network Types Explained**

#### **1. Bridge Network (Default)**
```bash
# Containers on bridge network can communicate
# Each container gets own IP, isolated from host

# Create custom bridge network
docker network create my-network

# Inspect network
docker network inspect my-network

# Run containers on custom network
docker run -d --name web1 --network my-network nginx
docker run -d --name web2 --network my-network nginx

# Containers can communicate using container names
docker exec web1 curl http://web2
```

#### **2. Host Network**
```bash
# Container uses host's network directly
# No network isolation, shares host's IP

docker run -d --name host-app --network host nginx

# Access directly on host port 80
curl http://localhost
```

#### **3. None Network**
```bash
# No network access
docker run -d --name isolated-app --network none alpine sleep 3600

# Test - no network interfaces
docker exec isolated-app ifconfig
# Only loopback interface
```

#### **4. Overlay Network (Swarm)**
```bash
# For Docker Swarm - multi-host networking
docker network create --driver overlay my-overlay
```
---
### **Lab 3: Network Management Commands**
```bash
# Create network
docker network create app-network
docker network create --driver bridge --subnet 172.20.0.0/16 --gateway 172.20.0.1 my-subnet

# Connect container to network
docker network connect app-network existing-container

# Disconnect container from network
docker network disconnect app-network container-name

# Remove network
docker network rm network-name

# Prune unused networks
docker network prune
```
---
### **Lab 4: Multi-Container Application Example**

#### **Web App + Database Communication**
```bash
# Create network
docker network create app-network

# Start database
docker run -d \
  --name postgres-db \
  --network app-network \
  -e POSTGRES_PASSWORD=secret \
  -v pgdata:/var/lib/postgresql/data \
  postgres:15

# Start web application
docker run -d \
  --name web-app \
  --network app-network \
  -p 8080:3000 \
  -e DATABASE_URL="postgres://postgres:secret@postgres-db:5432/mydb" \
  -e DATABASE_HOST="postgres-db" \
  node-app

# Web app can connect to database using "postgres-db" hostname
```
---
### **Lab 5: Network Inspection & Debugging**
```bash
# Inspect network
docker network inspect bridge

# Check container IP
docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' container-name

# DNS resolution test
docker exec container-name nslookup another-container

# Network connectivity test
docker exec container-name ping -c 4 google.com
docker exec container-name curl -I http://another-container

# View network ports
docker port container-name
```

### **Lab 6: Port Publishing vs Exposing**
```bash
# PORT PUBLISHING (host:container)
docker run -d -p 80:8080 --name app1 nginx
# Host port 80 → Container port 8080

# Dynamic port publishing
docker run -d -p 8080 --name app2 nginx
# Docker assigns random host port

# Multiple ports
docker run -d -p 80:80 -p 443:443 --name app3 nginx

# Specific host IP
docker run -d -p 127.0.0.1:8080:80 --name app4 nginx

# EXPOSE in Dockerfile (metadata only)
# Dockerfile: EXPOSE 80
# Still need -p to publish
```

