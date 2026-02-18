# **Experiment 5: Docker - Volumes, Environment Variables, Monitoring & Networks**

## **Part 1: Docker Volumes - Persistent Data Storage**

### **Lab 1: Understanding Data Persistence**

#### **The Problem: Container Data is Ephemeral**
```bash
# Create a container that writes data
docker run -it --name test-container ubuntu /bin/bash

# Inside container:
echo "Hello World" > /data/message.txt
cat /data/message.txt  # Shows "Hello World"
exit

# Restart container
docker start test-container
docker exec test-container cat /data/message.txt
# ERROR: File doesn't exist! Data was lost.
```

#### **Solution: Docker Volumes**
---
### **Lab 2: Volume Types**

#### **1. Anonymous Volumes**
```bash
# Create anonymous volume (auto-generated name)
docker run -d -v /app/data --name web1 nginx

# Check volume
docker volume ls
# Shows: anonymous volume with random hash

# Inspect container to see volume mount
docker inspect web1 | grep -A 5 Mounts
```

#### **2. Named Volumes**
```bash
# Create named volume
docker volume create mydata

# Use named volume
docker run -d -v mydata:/app/data --name web2 nginx

# List volumes
docker volume ls
# Shows: mydata

# Inspect volume
docker volume inspect mydata
```

#### **3. Bind Mounts (Host Directory)**
```bash
# Create directory on host
mkdir ~/myapp-data

# Mount host directory to container
docker run -d -v ~/myapp-data:/app/data --name web3 nginx

# Add file on host
echo "From Host" > ~/myapp-data/host-file.txt

# Check in container
docker exec web3 cat /app/data/host-file.txt
# Shows: From Host
```
---
### **Lab 3: Practical Volume Examples**

#### **Example 1: Database with Persistent Storage**
```bash
# MySQL with named volume
docker run -d \
  --name mysql-db \
  -v mysql-data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=secret \
  mysql:8.0

# Check data persists
docker stop mysql-db
docker rm mysql-db

# New container with same volume
docker run -d \
  --name new-mysql \
  -v mysql-data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=secret \
  mysql:8.0
# Data is preserved!
```

#### **Example 2: Web App with Configuration Files**
```bash
# Create config directory
mkdir ~/nginx-config

# Create nginx config file
echo 'server {
    listen 80;
    server_name localhost;
    location / {
        return 200 "Hello from mounted config!";
    }
}' > ~/nginx-config/nginx.conf

# Run nginx with config bind mount
docker run -d \
  --name nginx-custom \
  -p 8080:80 \
  -v ~/nginx-config/nginx.conf:/etc/nginx/conf.d/default.conf \
  nginx

# Test
curl http://localhost:8080
```
---
### **Lab 4: Volume Management Commands**
```bash
# List all volumes
docker volume ls

# Create a volume
docker volume create app-volume

# Inspect volume details
docker volume inspect app-volume

# Remove unused volumes
docker volume prune

# Remove specific volume
docker volume rm volume-name

# Copy files to/from volume
docker cp local-file.txt container-name:/path/in/volume
```

---

## **Part 2: Environment Variables**

### **Lab 1: Setting Environment Variables**

#### **Method 1: Using -e flag**
```bash
# Single variable
docker run -d \
  --name app1 \
  -e DATABASE_URL="postgres://user:pass@db:5432/mydb" \
  -e DEBUG="true" \
  -p 3000:3000 \
  my-node-app

# Multiple variables
docker run -d \
  -e VAR1=value1 \
  -e VAR2=value2 \
  -e VAR3=value3 \
  my-app
```

#### **Method 2: Using --env-file**
```bash
# Create .env file
echo "DATABASE_HOST=localhost" > .env
echo "DATABASE_PORT=5432" >> .env
echo "API_KEY=secret123" >> .env

# Use env file
docker run -d \
  --env-file .env \
  --name app2 \
  my-app

# Use multiple env files
docker run -d \
  --env-file .env \
  --env-file .env.secrets \
  my-app
```

#### **Method 3: In Dockerfile**
```dockerfile
# Set default environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV APP_VERSION=1.0.0

# Can be overridden at runtime
```

### **Lab 2: Environment Variables in Applications**

#### **Python Flask Example**
```python
# app.py
import os
from flask import Flask

app = Flask(__name__)

# Read environment variables
db_host = os.environ.get('DATABASE_HOST', 'localhost')
debug_mode = os.environ.get('DEBUG', 'false').lower() == 'true'
api_key = os.environ.get('API_KEY')

@app.route('/config')
def config():
    return {
        'db_host': db_host,
        'debug': debug_mode,
        'has_api_key': bool(api_key)
    }

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
```

#### **Dockerfile with Environment Variables**
```dockerfile
FROM python:3.9-slim

# Set environment variables at build time
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app.py .

# Default runtime environment variables
ENV PORT=5000
ENV DEBUG=false

EXPOSE 5000

CMD ["python", "app.py"]
```

### **Lab 3: Test Environment Variables**
```bash
# Run with custom env vars
docker run -d \
  --name flask-app \
  -p 5000:5000 \
  -e DATABASE_HOST="prod-db.example.com" \
  -e DEBUG="true" \
  -e PORT="8080" \
  flask-app

# Check environment in running container
docker exec flask-app env
docker exec flask-app printenv DATABASE_HOST

# Test the endpoint
curl http://localhost:5000/config
```

---

## **Part 3: Docker Monitoring**

### **Lab 1: Basic Monitoring Commands**

#### **`docker stats` - Real-time Container Metrics**
```bash
# Live stats for all containers
docker stats

# Live stats for specific containers
docker stats container1 container2

# Specific format output
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

# No-stream (single snapshot)
docker stats --no-stream

# All containers (including stopped)
docker stats --all
```

#### **Useful Format Options:**
```bash
# Custom format
docker stats --format "Container: {{.Name}} | CPU: {{.CPUPerc}} | Memory: {{.MemPerc}}"

# JSON output
docker stats --format json --no-stream

# Wide output
docker stats --no-stream --no-trunc
```

### **Lab 2: `docker top` - Process Monitoring**
```bash
# View processes in container
docker top container-name

# View with full command line
docker top container-name -ef

# Compare with host processes
ps aux | grep docker
```

### **Lab 3: `docker logs` - Application Logs**
```bash
# View logs
docker logs container-name

# Follow logs (like tail -f)
docker logs -f container-name

# Last N lines
docker logs --tail 100 container-name

# Logs with timestamps
docker logs -t container-name

# Logs since specific time
docker logs --since 2024-01-15 container-name

# Combine options
docker logs -f --tail 50 -t container-name
```

### **Lab 4: Container Inspection**
```bash
# Detailed container info
docker inspect container-name

# Specific information
docker inspect --format='{{.State.Status}}' container-name
docker inspect --format='{{.NetworkSettings.IPAddress}}' container-name
docker inspect --format='{{.Config.Env}}' container-name

# Resource limits
docker inspect --format='{{.HostConfig.Memory}}' container-name
docker inspect --format='{{.HostConfig.NanoCpus}}' container-name
```

### **Lab 5: Events Monitoring**
```bash
# Monitor Docker events in real-time
docker events

# Filter events
docker events --filter 'type=container'
docker events --filter 'event=start'
docker events --filter 'event=die'

# Since specific time
docker events --since '2024-01-15'

# Format output
docker events --format '{{.Type}} {{.Action}} {{.Actor.Attributes.name}}'
```

### **Lab 6: Practical Monitoring Script**
```bash
#!/bin/bash
# monitor.sh - Simple Docker monitoring

echo "=== Docker Monitoring Dashboard ==="
echo "Time: $(date)"
echo

echo "1. Running Containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo

echo "2. Resource Usage:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
echo

echo "3. Recent Events:"
docker events --since '5m' --until '0s' --format '{{.Time}} {{.Type}} {{.Action}}' | tail -5
echo

echo "4. System Info:"
docker system df
```

---

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

---

## **Part 5: Complete Real-World Example**

### **Application Architecture:**
- Flask Web App (port 5000)
- PostgreSQL Database (port 5432)
- Redis Cache (port 6379)
- All connected via custom network

### **Implementation:**
```bash
# 1. Create network
docker network create myapp-network

# 2. Start database with volume
docker run -d \
  --name postgres \
  --network myapp-network \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_DB=mydatabase \
  -v postgres-data:/var/lib/postgresql/data \
  postgres:15

# 3. Start Redis
docker run -d \
  --name redis \
  --network myapp-network \
  -v redis-data:/data \
  redis:7-alpine

# 4. Start Flask app with all configurations
docker run -d \
  --name flask-app \
  --network myapp-network \
  -p 5000:5000 \
  -v $(pwd)/app:/app \
  -v app-logs:/var/log/app \
  -e DATABASE_URL="postgresql://postgres:mysecretpassword@postgres:5432/mydatabase" \
  -e REDIS_URL="redis://redis:6379" \
  -e DEBUG="false" \
  -e LOG_LEVEL="INFO" \
  --env-file .env.production \
  flask-app:latest
```

### **Monitoring Commands:**
```bash
# Check all components
docker ps

# Monitor resources
docker stats postgres redis flask-app

# Check logs
docker logs -f flask-app

# Network connectivity test
docker exec flask-app ping -c 2 postgres
docker exec flask-app ping -c 2 redis

# View network details
docker network inspect myapp-network
```

---

## **Quick Reference Cheatsheet**

### **Volumes:**
```bash
docker volume create <name>
docker run -v <volume>:/path
docker run -v /host/path:/container/path
docker volume ls
docker volume rm <name>
```

### **Environment Variables:**
```bash
docker run -e VAR=value
docker run --env-file .env
# In Dockerfile: ENV VAR=value
```

### **Monitoring:**
```bash
docker stats
docker logs -f <container>
docker top <container>
docker inspect <container>
docker events
```

### **Networks:**
```bash
docker network create <name>
docker run --network <name>
docker network connect <network> <container>
docker network inspect <network>
```

---

## **Practice Exercises**

### **Exercise 1: Database Backup**
```bash
# Create a PostgreSQL container with volume
# Backup data using docker cp or volume backup techniques
# Restore to new container
```

### **Exercise 2: Multi-Service Setup**
```bash
# Create: web app + database + cache
# Use custom network for communication
# Set environment variables for configuration
# Monitor all services
```

### **Exercise 3: Log Analysis**
```bash
# Run a container that generates logs
# Use docker logs with various filters
# Redirect logs to a file on host using bind mount
```

### **Exercise 4: Network Isolation**
```bash
# Create two separate networks
# Put containers in different networks
# Test connectivity between networks
# Connect a container to both networks
```

---

## **Cleanup**
```bash
# Stop and remove all containers
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

# Remove all volumes
docker volume prune -f

# Remove all networks (except defaults)
docker network prune -f

# Remove unused images
docker image prune -f
```

---

## **Key Takeaways**

1. **Volumes** persist data beyond container lifecycle
2. **Environment variables** configure containers dynamically
3. **Monitoring commands** help debug and optimize containers
4. **Networks** enable secure container communication
5. **Always use named volumes** for production data
6. **Custom networks** provide better isolation and DNS
7. **Monitor resource usage** to prevent issues
8. **Use .env files** for sensitive configuration

> This experiment covers essential Docker features for building, configuring, and managing production-ready containerized applications.