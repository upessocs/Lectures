# Attach to stopped containers and debug with `docker run -ai <container_id>`
## Why your Ubuntu container exits immediately

When you run:

```bash
docker run ubuntu
```

Docker starts the container, runs the **default command**, and then exits.

For `ubuntu`, the default command is basically:

```bash
/bin/bash
```

But:

* There is **no TTY**
* No interactive session
* So `bash` immediately exits → container goes to **Exited** state

Docker containers **stay alive only while a foreground process is running**.

---

## Check the container status

```bash
docker ps -a
```

You’ll see something like:

```text
CONTAINER ID   IMAGE    STATUS
abc123         ubuntu   Exited (0)
```

---

## Option 1: Start and attach to an existing stopped container (BEST for you now)

### Step 1: Start the container

```bash
docker start <container_id_or_name>
```

### Step 2: Attach to it

```bash
docker attach <container_id_or_name>
```

**Important**
If the container was not started with an interactive shell, it may **exit again immediately**.

---

## Option 2: Start and attach in one command (recommended)

```bash
docker start -ai <container_id_or_name>
```

* `-a` → attach
* `-i` → interactive

Example:

```bash
docker start -ai abc123
```

---

## Option 3: Create a new Ubuntu container correctly (most common way)

If you want a **working Ubuntu shell**:

```bash
docker run -it ubuntu /bin/bash
```

Explanation:

* `-i` → interactive
* `-t` → pseudo terminal
* `/bin/bash` → keeps container running

You’ll now be inside Ubuntu:

```bash
root@container_id:/#
```

Exit with:

```bash
exit
```

The container will stop (expected).

---

## Option 4: Attach to a running container later

If the container is already running:

```bash
docker exec -it <container_id_or_name> /bin/bash
```

This is the **safest and most used** way.

---

## Summary (quick cheat sheet)

```bash
# List containers
docker ps -a

# Start + attach
docker start -ai <id>

# Create interactive ubuntu container
docker run -it ubuntu /bin/bash

# Enter running container
docker exec -it <id> /bin/bash
```

