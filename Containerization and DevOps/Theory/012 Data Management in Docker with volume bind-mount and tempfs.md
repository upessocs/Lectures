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


