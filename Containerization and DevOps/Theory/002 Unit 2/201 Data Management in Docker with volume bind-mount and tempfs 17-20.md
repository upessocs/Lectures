# 17. Data Management in Docker with `volume` `bind mount` and `tempfs`

## Problem Statement (Why Data Management?)

**Task Scenario:**
You run a MySQL container. After inserting data, the container crashes or is removed.
When you start a new container, all data is gone.

**Reason:**
Containers are ephemeral.
Data stored inside container filesystem is deleted when the container is removed.

### Solution: Persist Data Outside Container Layer

Docker provides three main approaches:

1. **Volumes (Recommended for production)**
2. **Bind Mounts**
3. **tmpfs Mounts (Memory-only storage)**

---

# 1. Docker Volumes

## Concept

A **volume** is a Docker-managed storage location stored under:

```
/var/lib/docker/volumes/
```

Docker controls its lifecycle.

---

## Task 1: Create a Volume

### Method 1 – Explicit Creation

```bash
docker volume create myvolume
```

### Verify

```bash
docker volume ls
```

---

## Task 2: Use Volume in Container

### Using `-v` flag

```bash
docker run -d \
  --name mysql-container \
  -v myvolume:/var/lib/mysql \
  mysql
```

### Using `--mount` flag (Recommended Modern Syntax)

```bash
docker run -d \
  --name mysql-container \
  --mount source=myvolume,target=/var/lib/mysql \
  mysql
```

---

## Task 3: Inspect Volume

```bash
docker volume inspect myvolume
```

Shows:

* Mountpoint
* Driver
* Metadata

---

## Task 4: Remove Volume

```bash
docker volume rm myvolume
```

Remove unused volumes:

```bash
docker volume prune
```

---

## Volume Use Case

### Use Case 1: Database Storage

* MySQL
* PostgreSQL
* MongoDB

Why?

* Docker-managed
* Safe
* Portable
* Production-ready

---

# 2. Bind Mount

## Concept

Bind mount maps a **host directory directly** into a container.

Host controls data.

---

## Task 1: Create Bind Mount

### Using `-v`

```bash
docker run -d \
  --name nginx-container \
  -v /home/prateek/html:/usr/share/nginx/html \
  nginx
```

### Using `--mount`

```bash
docker run -d \
  --name nginx-container \
  --mount type=bind,source=/home/prateek/html,target=/usr/share/nginx/html \
  nginx
```

Now:

* Editing files on host
* Changes reflect immediately inside container

---

## Task 2: Remove Bind Mount

Bind mount is removed when container is removed:

```bash
docker rm -f nginx-container
```

No separate "delete" like volume.

---

## Bind Mount Use Case

### Use Case 1: Development Environment

Example:

* Node.js app
* Source code on host
* Container runs app

Benefits:

* Live code updates
* No rebuild required
* Fast development

---

# 3. tmpfs Mount

## Concept

tmpfs stores data in **RAM only**.

* No persistence
* Deleted when container stops
* Very fast

---

## Task: Create tmpfs Mount

```bash
docker run -d \
  --name temp-container \
  --mount type=tmpfs,target=/app/cache \
  nginx
```

Or:

```bash
docker run -d \
  --tmpfs /app/cache \
  nginx
```

---

## tmpfs Use Case

### Use Case 1: Sensitive Temporary Data

Example:

* Encryption keys
* Session tokens
* Temporary cache

Why?

* Not written to disk
* More secure
* High speed

---

# Differences: Volume vs Bind Mount vs tmpfs

| Feature         | Volume           | Bind Mount    | tmpfs     |
| --------------- | ---------------- | ------------- | --------- |
| Managed by      | Docker           | Host OS       | Memory    |
| Location        | Docker directory | Any host path | RAM       |
| Persistence     | Yes              | Yes           | No        |
| Performance     | Good             | Good          | Very Fast |
| Production safe | Yes              | Risky         | Limited   |
| Dev friendly    | Moderate         | Excellent     | No        |

---

# Real-World Scenario Based Explanation

## Scenario 1: MySQL Production Server

Task:

* Deploy MySQL
* Ensure data survives restart

Best Choice:
→ Volume

---

## Scenario 2: React / Node Development

Task:

* Edit code locally
* See changes instantly

Best Choice:
→ Bind Mount

---

## Scenario 3: High-Security Application

Task:

* Store temporary encryption keys
* Avoid disk writing

Best Choice:
→ tmpfs

---

# Complete Practical Comparison Task

### Step 1: Run MySQL with Volume

```bash
docker run -d \
  --name mysql-test \
  -e MYSQL_ROOT_PASSWORD=pass \
  -v dbdata:/var/lib/mysql \
  mysql
```

Insert data.

Stop & remove container.

Recreate container using same volume → Data remains.

---

### Step 2: Run MySQL Without Volume

```bash
docker run -d mysql
```

Remove container → Data lost.

---

# Summary in Teaching Format

## When to Use What?

### Use Volume When:

* Database
* Production
* Persistent app data

### Use Bind Mount When:

* Development
* Config files
* Static content

### Use tmpfs When:

* Temporary data
* Cache
* Sensitive runtime data



---

# 1. Bind Mount Using `--mount` (Recommended Modern Syntax)

### General Format

```bash
docker run \
  --mount type=bind,source=<host-path>,target=<container-path> \
  image_name
```

### Example

```bash
docker run -d \
  --name nginx-bind \
  --mount type=bind,source=/home/prateek/html,target=/usr/share/nginx/html \
  nginx
```

### Important Notes

* `type=bind` → Specifies bind mount
* `source=` → Full path on host machine
* `target=` → Path inside container
* Host path must exist (otherwise container fails)

---

# 2. Bind Mount Using `-v` (Short Syntax)

### General Format

```bash
docker run -v <host-path>:<container-path> image_name
```

### Example

```bash
docker run -d \
  --name nginx-bind \
  -v /home/prateek/html:/usr/share/nginx/html \
  nginx
```

---

# 3. Read-Only Bind Mount

## Using `--mount`

```bash
docker run \
  --mount type=bind,source=/home/prateek/html,target=/usr/share/nginx/html,readonly \
  nginx
```

## Using `-v`

```bash
docker run \
  -v /home/prateek/html:/usr/share/nginx/html:ro \
  nginx
```

---

# 4. Bind Mount in Docker Compose (For Reference)

```yaml
services:
  web:
    image: nginx
    volumes:
      - /home/prateek/html:/usr/share/nginx/html
```

---

# 5. Key Differences in Syntax

| Feature       | `--mount` | `-v`                  |
| ------------- | --------- | --------------------- |
| Readability   | High      | Compact               |
| Explicit type | Yes       | No                    |
| Recommended   | Yes       | Older but widely used |

---

# Important Rules

1. Always use **absolute path** in bind mount.
2. If host directory does not exist:

   * `-v` may create it automatically
   * `--mount` will fail
3. Bind mount ties container to specific host path (less portable).


---

# Class Discussion

# Docker Volume & Bind Mount Tutorial 

Hands On:

1. Named Volumes (Persistent storage managed by Docker)
2. Bind Mounts (Mapping host folder directly)
3. Difference between `-v` and `--mount`
4. tmpfs mount (Temporary in-memory storage)

---

# Part 1: Docker Named Volume (Data Persistence)

## Step 1: List existing volumes

```bash
docker volume ls
```

This shows all Docker-managed volumes.

---

## Step 2: Create a new volume

```bash
docker volume create testvol1
```

Verify:

```bash
docker volume ls
```

You should see:

```
testvol1
```

---

## Step 3: Run container and attach volume

```bash
docker run -it --rm -v testvol1:/home/app ubuntu /bin/bash
```

### What this means:

* `-it` → interactive terminal
* `--rm` → remove container after exit
* `-v testvol1:/home/app` → attach volume to container path
* `ubuntu` → image
* `/bin/bash` → shell

Now inside container.

---

## Step 4: Create file inside container

```bash
echo "sapid=343423" >> /home/app/sapid.txt
```

Verify:

```bash
cat /home/app/sapid.txt
```

Output:

```
sapid=343423
```

Exit container:

```bash
exit
```

Container is deleted (because of `--rm`).

---

## Step 5: Start new container with same volume

```bash
docker run -it --rm -v testvol1:/home/app ubuntu /bin/bash
```

Check file:

```bash
cat /home/app/sapid.txt
```

If output is:

```
sapid=343423
```

Then data persisted.

### Conclusion

Even though container was removed, data still exists because:

**Docker Volume is independent of container lifecycle.**

---

# Part 2: Using Host Folder (Bind Mount)

Now we compare with host folder mapping.

---

## Step 1: Create folder on host

Linux / Mac:

```bash
mkdir hostfolder
```

Windows (PowerShell):

```powershell
mkdir hostfolder
```

---

## Step 2: Map host folder using `-v`

Linux/Mac:

```bash
docker run -it --rm -v $(pwd)/hostfolder:/data ubuntu /bin/bash
```

Windows (PowerShell):

```powershell
docker run -it --rm -v ${PWD}/hostfolder:/data ubuntu /bin/bash
```

Inside container:

```bash
echo "Hello from bind mount" >> /data/test.txt
exit
```

---

## Step 3: Check host folder

On host:

```bash
cat hostfolder/test.txt
```

You will see:

```
Hello from bind mount
```

### Conclusion

Here file is directly created in your host OS folder.

This is called **Bind Mount**.

---

# Difference: Volume vs Bind Mount

| Feature              | Named Volume               | Bind Mount       |
| -------------------- | -------------------------- | ---------------- |
| Managed by Docker    | Yes                        | No               |
| Stored location      | `/var/lib/docker/volumes/` | Anywhere on host |
| Good for Production  | Yes                        | Not recommended  |
| Good for Development | Sometimes                  | Yes              |
| Host dependency      | No                         | Yes              |

---

# Why Bind Mount is Needed?

Use bind mount when:

* You want live code changes (development)
* You want to edit files from host editor
* You want to share config files

Example: Web development

```bash
docker run -p 8080:80 -v $(pwd)/website:/usr/share/nginx/html nginx
```

Now editing files locally updates container instantly.

---

# Using `--mount` (Recommended Modern Syntax)

Same volume using `--mount`:

### Named Volume

```bash
docker run -it --rm \
--mount source=testvol1,target=/home/app \
ubuntu /bin/bash
```

### Bind Mount

```bash
docker run -it --rm \
--mount type=bind,source=$(pwd)/hostfolder,target=/data \
ubuntu /bin/bash
```

---

## Difference Between `-v` and `--mount`

| `-v`          | `--mount`                        |
| ------------- | -------------------------------- |
| Short syntax  | More readable                    |
| Older style   | Recommended                      |
| Less explicit | Explicit type=bind / type=volume |

---

# Part 3: tmpfs Mount (Temporary Memory Storage)

tmpfs is stored in RAM.

* Data disappears when container stops
* Faster than disk
* Used for secrets or temporary files

---

## Example of tmpfs

```bash
docker run -it --rm \
--mount type=tmpfs,target=/app/temp \
ubuntu /bin/bash
```

Inside container:

```bash
echo "temporary data" >> /app/temp/file.txt
cat /app/temp/file.txt
exit
```

Start container again:

```bash
docker run -it --rm \
--mount type=tmpfs,target=/app/temp \
ubuntu /bin/bash
```

Check file:

```bash
cat /app/temp/file.txt
```

You will see:

```
No such file or directory
```

Because tmpfs does NOT persist.

---

# Final Comparison

| Storage Type | Persist After Container Delete? | Stored Where?           | Use Case                 |
| ------------ | ------------------------------- | ----------------------- | ------------------------ |
| Named Volume | Yes                             | Docker internal storage | Databases                |
| Bind Mount   | Yes                             | Host folder             | Development              |
| tmpfs        | No                              | RAM                     | Temporary sensitive data |

---

# Real World Use Cases

### 1. Database in Production

Use Named Volume

```bash
docker run -d \
-v mysql_data:/var/lib/mysql \
mysql
```

---

### 2. Code Development

Use Bind Mount

```bash
docker run -v $(pwd):/app node
```

---

### 3. Secrets / Temporary Cache

Use tmpfs

```bash
docker run --mount type=tmpfs,target=/cache ubuntu
```

---

# Important Concept

Containers are ephemeral (temporary).
Volumes are persistent.
tmpfs is temporary memory storage.





---

# Docker Mount Types Comparison

| Feature                               | `type=volume`                                        | `type=bind`               | `type=tmpfs`                    |
| ------------------------------------- | ---------------------------------------------------- | ------------------------- | ------------------------------- |
| Managed by Docker                     | Yes                                                  | No                        | Yes (runtime memory)            |
| Storage Location                      | `/var/lib/docker/volumes/`                           | Any host directory        | RAM (memory)                    |
| Data Persists After Container Removal | Yes                                                  | Yes                       | No                              |
| Depends on Host Directory Structure   | No                                                   | Yes                       | No                              |
| Performance                           | Good                                                 | Depends on host disk      | Very Fast (RAM)                 |
| Editable from Host                    | Not directly (unless you go to Docker internal path) | Yes                       | No                              |
| Suitable for Production               | Yes                                                  | Sometimes (careful usage) | Rarely                          |
| Suitable for Development              | Sometimes                                            | Yes (ideal)               | No                              |
| Data Survives Docker Restart          | Yes                                                  | Yes                       | No                              |
| Risk of Host File Overwrite           | No                                                   | Yes                       | No                              |
| Backup Friendly                       | Yes                                                  | Depends on host           | Not needed                      |
| Typical Use Case                      | Databases, persistent app data                       | Source code, config files | Cache, secrets, temporary files |

---

# Syntax Comparison

## Volume

```bash
docker run --mount type=volume,source=myvol,target=/data ubuntu
```

## Bind Mount

```bash
docker run --mount type=bind,source=$(pwd)/hostfolder,target=/data ubuntu
```

## tmpfs

```bash
docker run --mount type=tmpfs,target=/data ubuntu
```

---

# When to Use What?

### Use `type=volume` when:

* Running databases (MySQL, PostgreSQL)
* Production workloads
* You want Docker to manage storage safely

### Use `type=bind` when:

* Developing applications
* Editing source code live
* Sharing config files from host

### Use `type=tmpfs` when:

* Storing temporary files
* Handling sensitive data
* Needing high-speed caching
* Data should disappear after container stops

---

# Simple Rule to Remember

* Volume → Persistent + Safe + Production
* Bind → Host Controlled + Development
* tmpfs → Temporary + Fast + Memory Only

