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