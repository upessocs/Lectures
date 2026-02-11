# Docker Data Management Explained

## 17. Data Management in Docker: Overview

### **The Need/Problem:**
By default, Docker containers are **ephemeral** - all data created inside a container is lost when the container stops or is removed. This poses challenges for:
- Database storage (MySQL, PostgreSQL, MongoDB)
- Application configurations
- Log files
- User uploads/content
- Cache and session data

### **Three Approaches to Persist Data:**

1. **Volumes** - Docker-managed storage
2. **Bind Mounts** - Host filesystem mounted into container
3. **tmpfs Mounts** - In-memory storage (Linux only)

### **Key Differences:**

| Aspect | Volumes | Bind Mounts | tmpfs Mounts |
|--------|---------|-------------|--------------|
| **Storage Location** | Docker-managed (`/var/lib/docker/volumes/`) | Host filesystem | RAM only |
| **Persistence** | Survives container removal | Persists indefinitely | Lost on container stop |
| **Performance** | Good | Depends on host filesystem | Excellent (RAM speed) |
| **Portability** | High (backup/restore easy) | Low (host path dependent) | None |
| **Use Case** | Production data, databases | Development, config files | Temporary files, secrets |

---

## 18. **Volumes** - Hands-on Tasks

### **Task 1: Create a Volume**
```bash
# Create a named volume
docker volume create myapp_data

# Create volume with specific driver (default: local)
docker volume create --driver local myapp_data2
```

### **Task 2: List and Inspect Volumes**
```bash
# List all volumes
docker volume ls

# Inspect a volume (shows mount point, driver, etc.)
docker volume inspect myapp_data

# Output shows: CreatedAt, Driver, Labels, Mountpoint, Name, Options, Scope
```

### **Task 3: Use Volume with Container (Different Methods)**

**Method A: Using `-v` flag (Legacy syntax)**
```bash
# Create container with volume
docker run -d --name mysql_db \
  -v mysql_data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=secret \
  mysql:latest

# Breakdown: -v [volume_name]:[container_path]:[options]
```

**Method B: Using `--mount` flag (Modern syntax)**
```bash
# More verbose but explicit syntax
docker run -d --name web_app \
  --mount source=app_logs,target=/var/log/app \
  nginx:latest

# With type specification (more readable)
docker run -d --name web_app \
  --mount type=volume,source=app_logs,target=/var/log/app,readonly=true \
  nginx:latest
```

### **Task 4: Verify Volume Usage**
```bash
# Check which containers use a volume
docker volume inspect --format='{{.Name}} -> {{.Mountpoint}}' mysql_data

# See volume usage in container
docker inspect mysql_db | grep -A 10 Mounts
```

### **Task 5: Remove Volumes**
```bash
# Remove specific volume (must not be in use)
docker volume rm myapp_data

# Remove unused volumes (cleanup)
docker volume prune

# Force remove even if in use (not recommended for production)
docker volume rm -f myapp_data
```

### **Task 6: Backup and Restore Volume**
```bash
# Backup volume data
docker run --rm \
  -v mysql_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/mysql_backup.tar.gz -C /data .

# Restore to volume
docker run --rm \
  -v mysql_data:/restore \
  -v $(pwd):/backup \
  alpine tar xzf /backup/mysql_backup.tar.gz -C /restore
```

---

## 19. **Bind Mounts** - Hands-on Tasks

### **Task 1: Create Bind Mount with Different Syntaxes**

**Method A: Using `-v` flag**
```bash
# Mount host directory to container
docker run -d --name dev_server \
  -v /home/user/app:/usr/share/nginx/html:ro \
  -p 8080:80 \
  nginx:latest

# Syntax: -v [host_path]:[container_path]:[options]
# Options: ro (read-only), rw (read-write, default)
```

**Method B: Using `--mount` flag (Recommended)**
```bash
# More explicit syntax
docker run -d --name dev_server \
  --mount type=bind,source=/home/user/app,target=/usr/share/nginx/html,readonly \
  -p 8080:80 \
  nginx:latest
```

### **Task 2: Test Bind Mount Behavior**
```bash
# Create test directory
mkdir -p ~/test-app
echo "<h1>Hello from Host</h1>" > ~/test-app/index.html

# Run container with bind mount
docker run -d --name web-test \
  -v ~/test-app:/usr/share/nginx/html \
  -p 8081:80 \
  nginx

# Access in browser: http://localhost:8081
# Modify file on host and refresh browser
echo "<h1>Updated from Host</h1>" > ~/test-app/index.html
```

### **Task 3: tmpfs Mount (In-memory storage)**
```bash
# Create tmpfs mount for temporary files
docker run -d --name tmpfs_test \
  --tmpfs /app/cache:size=100M,mode=1770 \
  alpine sleep 3600

# Alternative using --mount
docker run -d --name tmpfs_test2 \
  --mount type=tmpfs,destination=/app/cache,tmpfs-size=100000000 \
  alpine sleep 3600

# Verify it's in memory
docker exec tmpfs_test df -h /app/cache
```

### **Task 4: Cleanup Bind Mounts**
```bash
# Stop and remove container (bind mount persists on host)
docker stop dev_server && docker rm dev_server

# Host directory remains unchanged
ls -la ~/test-app/
```

---

## 20. **Use Case Scenarios** - Practical Applications

### **Scenario 1: Database Application (VOLUMES recommended)**
```bash
# Production PostgreSQL with volume
docker run -d --name postgres_prod \
  -v pg_data:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=secret \
  postgres:latest

# Why volumes? 
# - Data persists after container removal
# - Easy backup/restore
# - Managed by Docker (portable)
# - Better performance for databases
```

**Hands-on Task:**
```bash
# 1. Create volume and run DB
docker volume create db_volume
docker run -d --name test_db \
  -v db_volume:/data \
  alpine sh -c "echo 'Initial data' > /data/test.txt && sleep 3600"

# 2. Stop and remove container
docker rm -f test_db

# 3. Create new container with same volume
docker run --rm \
  -v db_volume:/data \
  alpine cat /data/test.txt
# Output: "Initial data" - data persisted!
```

### **Scenario 2: Development Environment (BIND MOUNTS recommended)**
```bash
# Node.js development with live reload
docker run -d --name node_dev \
  -v $(pwd)/src:/app/src \
  -v $(pwd)/package.json:/app/package.json \
  -p 3000:3000 \
  node:latest npm run dev

# Why bind mounts?
# - Immediate file changes on host reflect in container
# - Use host IDE/editor
# - No need to rebuild image for code changes
```

**Hands-on Task:**
```bash
# 1. Create simple web app structure
mkdir -p ~/dev-app
cat > ~/dev-app/index.html << EOF
<!DOCTYPE html>
<html>
<body>
  <h1>Dev Mode</h1>
  <p>Edit this file on host!</p>
</body>
</html>
EOF

# 2. Run with bind mount for live editing
docker run -d --name web_dev \
  -v ~/dev-app:/usr/share/nginx/html \
  -p 8082:80 \
  nginx

# 3. Edit file on host and refresh browser
# Try: echo "<h2>Live Update Works!</h2>" >> ~/dev-app/index.html
```

### **Scenario 3: Sensitive Data/Temp Files (TMPFS recommended)**
```bash
# Application with sensitive session data
docker run -d --name secure_app \
  --tmpfs /tmp/sessions:noexec,nosuid,size=50M \
  --tmpfs /app/cache:size=100M \
  myapp:latest

# Why tmpfs?
# - Data never hits disk (more secure for secrets)
# - Very fast I/O
# - Automatically cleaned up
```

**Hands-on Task:**
```bash
# 1. Create container with tmpfs
docker run -d --name tmp_demo \
  --tmpfs /scratch:size=50M \
  alpine sleep 3600

# 2. Write data to tmpfs
docker exec tmp_demo sh -c "dd if=/dev/zero of=/scratch/test.bin bs=1M count=10"

# 3. Check it's in memory
docker exec tmp_demo df -h /scratch

# 4. Stop container - data is gone forever
docker rm -f tmp_demo
```

### **Scenario 4: Mixed Approach (Real-world example)**
```bash
# Complete application with different storage needs
docker run -d --name full_app \
  # Config files (bind mount - development)
  -v ./config:/app/config:ro \
  
  # Database data (volume - persistent)
  -v app_data:/app/data \
  
  # Temporary uploads (tmpfs - secure)
  --tmpfs /app/uploads:size=200M \
  
  # Logs (bind mount or volume)
  -v ./logs:/var/log/app \
  
  # Cache (tmpfs - fast)
  --tmpfs /tmp/cache:size=100M \
  
  myapp:latest
```

### **Scenario 5: Read-Only Configurations**
```bash
# Production app with read-only configs
docker run -d --name prod_app \
  --mount type=bind,source=/etc/app/config,target=/app/config,readonly \
  --mount type=volume,source=app_data,target=/app/storage \
  app_image:prod

# Why readonly? Prevents accidental modifications, improves security
```

### **Quick Reference Cheat Sheet:**

```bash
# VOLUME - For persistent data
docker volume create [name]
docker run -v [volume]:[container_path] [image]

# BIND MOUNT - For development/shared files
docker run -v [host_path]:[container_path] [image]

# TMPFS - For temporary/secure data
docker run --tmpfs [container_path]:[options] [image]

# Check what's mounted where
docker inspect [container] | grep -A 20 Mounts
```

### **Best Practices Summary:**
1. **Use Volumes for** production data, databases, anything that needs backup
2. **Use Bind Mounts for** development, configuration files, build contexts
3. **Use tmpfs for** temporary files, cache, session data, secrets
4. **Always use `--mount`** for new projects (more explicit)
5. **Use `:ro` flag** for read-only mounts when possible
6. **Backup volumes regularly** with `docker run --rm -v` pattern
7. **Avoid bind mounts in production** unless necessary for host-specific files



---


