# Docker Engine API – Hands-On Tutorial (WSL)

## 1. What is the Docker Engine API?

Docker is not magic.
The **Docker CLI (`docker run`, `docker ps`, etc.) is just a client**.

Under the hood:

```
docker CLI  →  Docker Engine API  →  containerd / runc
```

* The **Docker Engine API** is a **REST API**
* It runs on the Docker daemon (`dockerd`)
* By default in Linux/WSL, it listens on a **Unix socket**

```
/var/run/docker.sock
```

When you run:

```bash
docker ps
```

It actually does something equivalent to:

```http
GET /containers/json
```

---

## 2. Verify Docker API Socket in WSL

Inside WSL:

```bash
ls -l /var/run/docker.sock
```

Expected output:

```text
srw-rw---- 1 root docker 0 docker.sock
```

Check daemon info using API:

```bash
curl --unix-socket /var/run/docker.sock http://localhost/_ping
```

Expected:

```text
OK
```

If this works, your Docker API is accessible.

---

## 3. API Versioning

Docker API is versioned.

Check version:

```bash
curl --unix-socket /var/run/docker.sock http://localhost/version
```

Sample output:

```json
{
  "Version": "25.0.3",
  "ApiVersion": "1.44"
}
```

We will use:

```
/v1.44/
```

---

## 4. List Containers (docker ps)

### CLI

```bash
docker ps
```

### API

```bash
curl --unix-socket /var/run/docker.sock \
  http://localhost/v1.44/containers/json
```

All containers (including stopped):

```bash
curl --unix-socket /var/run/docker.sock \
  "http://localhost/v1.44/containers/json?all=true"
```

---

## 5. Create a Container (docker create)

### Step 1: Pull Image (docker pull)

```bash
docker pull nginx
```

API equivalent:

```bash
curl --unix-socket /var/run/docker.sock \
  -X POST \
  "http://localhost/v1.44/images/create?fromImage=nginx&tag=latest"
```

---

### Step 2: Create Container

```bash
docker create --name mynginx -p 8080:80 nginx
```

API:

```bash
curl --unix-socket /var/run/docker.sock \
  -X POST \
  -H "Content-Type: application/json" \
  http://localhost/v1.44/containers/create?name=mynginx \
  -d '{
    "Image": "nginx",
    "ExposedPorts": {
      "80/tcp": {}
    },
    "HostConfig": {
      "PortBindings": {
        "80/tcp": [
          { "HostPort": "8080" }
        ]
      }
    }
  }'
```

Response contains container ID.

---

## 6. Start / Stop / Restart Container

### Start

```bash
docker start mynginx
```

API:

```bash
curl --unix-socket /var/run/docker.sock \
  -X POST \
  http://localhost/v1.44/containers/mynginx/start
```

### Stop

```bash
docker stop mynginx
```

API:

```bash
curl --unix-socket /var/run/docker.sock \
  -X POST \
  http://localhost/v1.44/containers/mynginx/stop
```

### Restart

```bash
curl --unix-socket /var/run/docker.sock \
  -X POST \
  http://localhost/v1.44/containers/mynginx/restart
```

---

## 7. Inspect Container (docker inspect)

```bash
docker inspect mynginx
```

API:

```bash
curl --unix-socket /var/run/docker.sock \
  http://localhost/v1.44/containers/mynginx/json
```

This gives:

* IP address
* Mounts
* Environment variables
* Resource limits

---

## 8. Container Logs (docker logs)

```bash
docker logs mynginx
```

API:

```bash
curl --unix-socket /var/run/docker.sock \
  "http://localhost/v1.44/containers/mynginx/logs?stdout=true&stderr=true"
```

Follow logs:

```bash
curl --unix-socket /var/run/docker.sock \
  "http://localhost/v1.44/containers/mynginx/logs?follow=true&stdout=true"
```

---

## 9. Execute Command Inside Container (docker exec)

### CLI

```bash
docker exec -it mynginx bash
```

### API (Two Steps)

#### Step 1: Create exec instance

```bash
curl --unix-socket /var/run/docker.sock \
  -X POST \
  -H "Content-Type: application/json" \
  http://localhost/v1.44/containers/mynginx/exec \
  -d '{
    "Cmd": ["ls", "/usr/share/nginx/html"],
    "AttachStdout": true,
    "AttachStderr": true
  }'
```

Response:

```json
{ "Id": "exec_id_here" }
```

#### Step 2: Start exec

```bash
curl --unix-socket /var/run/docker.sock \
  -X POST \
  -H "Content-Type: application/json" \
  http://localhost/v1.44/exec/exec_id_here/start \
  -d '{ "Detach": false, "Tty": false }'
```

---

## 10. Remove Container (docker rm)

```bash
docker rm mynginx
```

API:

```bash
curl --unix-socket /var/run/docker.sock \
  -X DELETE \
  http://localhost/v1.44/containers/mynginx
```

Force remove:

```bash
curl --unix-socket /var/run/docker.sock \
  -X DELETE \
  "http://localhost/v1.44/containers/mynginx?force=true"
```

---

## 11. Images API

### List Images

```bash
docker images
```

API:

```bash
curl --unix-socket /var/run/docker.sock \
  http://localhost/v1.44/images/json
```

### Remove Image

```bash
docker rmi nginx
```

API:

```bash
curl --unix-socket /var/run/docker.sock \
  -X DELETE \
  http://localhost/v1.44/images/nginx
```

---

## 12. System & Stats

### Docker Info

```bash
curl --unix-socket /var/run/docker.sock \
  http://localhost/v1.44/info
```

### Container Stats (docker stats)

```bash
curl --unix-socket /var/run/docker.sock \
  http://localhost/v1.44/containers/mynginx/stats?stream=false
```

---

## 13. Why This Matters (Real Use Cases)

* Build **custom Docker dashboards**
* Write **CI/CD tools** (GitHub Actions, Jenkins)
* Build **desktop apps** (Go, Python, Electron)
* Control Docker **without shell access**
* Remote Docker management (with TLS)

---

## 14. Security Warning (Important)

Docker socket is **root equivalent**.

Anyone with access can:

* Start privileged containers
* Mount host filesystem
* Gain full host control

Never expose `/var/run/docker.sock` publicly.

---

## 15. Mini Practice Tasks (with hints)

### Task 1

List only running containers using API.

Hint:

* Use `/containers/json`
* Look at `?all=false`

---

### Task 2

Create an Ubuntu container that sleeps for 300 seconds.

Hint:

* Image: `ubuntu`
* Cmd: `["sleep", "300"]`

---

### Task 3

Fetch logs of a stopped container.

Hint:

* Logs are available even after stop
* Use `stdout=true`

---

### Task 4

Write a small script (curl or Go) that:

* Lists containers
* Prints name + state

Hint:

* Parse JSON from `/containers/json`



---

---


# Docker Engine API on Windows vs macOS vs WSL

## 1. Big Picture Architecture Difference

### Linux / WSL (what you already saw)

```
Client (docker / curl)
        |
Unix socket
/var/run/docker.sock
        |
dockerd (Linux)
```

* Native Linux daemon
* Unix socket by default
* No TCP port exposed unless configured

---

### Windows Docker Desktop

```
docker.exe (Windows)
        |
Named Pipe
//./pipe/docker_engine
        |
Docker Desktop VM (LinuxKit / WSL2)
        |
dockerd
```

Key points:

* Docker daemon runs **inside a Linux VM**
* Windows does NOT use Unix sockets
* Uses **Windows Named Pipes**

---

### macOS Docker Desktop

```
docker (macOS)
        |
Unix socket (user space)
~/Library/Containers/.../docker.sock
        |
Docker Desktop VM (LinuxKit)
        |
dockerd
```

* Docker runs inside a hidden Linux VM
* macOS provides a **proxy Unix socket**
* Still REST API underneath

---

## 2. Where the Docker API Actually Lives

### Summary Table

| OS      | Default API Access                     |
| ------- | -------------------------------------- |
| Linux   | `/var/run/docker.sock`                 |
| WSL2    | `/var/run/docker.sock`                 |
| Windows | `npipe:////./pipe/docker_engine`       |
| macOS   | `~/Library/Containers/.../docker.sock` |

---

## 3. Using Docker API on Windows Docker Desktop

### Named Pipe Access

Docker CLI internally does:

```
npipe:////./pipe/docker_engine
```

You cannot directly `curl` a named pipe.

### Options to Access API on Windows

#### Option 1: Use Docker CLI only (default)

Most users never touch the API directly.

#### Option 2: Use WSL (recommended)

Inside WSL:

```bash
curl --unix-socket /var/run/docker.sock http://localhost/version
```

This is the cleanest and safest way.

#### Option 3: Expose Docker API over TCP (advanced, risky)

Docker Desktop Settings:

```
Settings → Docker Engine
```

Add:

```json
{
  "hosts": [
    "npipe:////./pipe/docker_engine",
    "tcp://127.0.0.1:2375"
  ]
}
```

Restart Docker Desktop.

Now:

```bash
curl http://localhost:2375/version
```

Security:

* No TLS
* Full root access
* Localhost only recommended

---

## 4. Using Docker API on macOS

### Default Socket Location

```bash
ls ~/Library/Containers/com.docker.docker/Data/docker.sock
```

Use it:

```bash
curl --unix-socket \
  ~/Library/Containers/com.docker.docker/Data/docker.sock \
  http://localhost/version
```

---

### Expose Docker API on macOS (TCP)

Edit Docker Desktop settings:

```
Settings → Docker Engine
```

Add:

```json
{
  "hosts": [
    "unix:///var/run/docker.sock",
    "tcp://127.0.0.1:2375"
  ]
}
```

Restart Docker Desktop.

Test:

```bash
curl http://localhost:2375/info
```

---

## 5. Can Docker API Be Mapped to a Standard Web Port?

### Short Answer

Yes — but **not recommended without TLS and auth**.

---

### Mapping Docker API to Port 2375 or 2376

Docker daemon supports TCP:

```json
{
  "hosts": [
    "unix:///var/run/docker.sock",
    "tcp://0.0.0.0:2375"
  ]
}
```

* `2375` → plain HTTP (unsafe)
* `2376` → HTTPS (TLS)

---

### Mapping to Port 80 or 443 (Technically Possible)

Example:

```json
{
  "hosts": [
    "unix:///var/run/docker.sock",
    "tcp://0.0.0.0:443"
  ]
}
```

Why this is bad:

* Docker API is **not a public REST service**
* No authentication
* Anyone can get root

---

## 6. Correct Way: Reverse Proxy with TLS (Advanced)

If you **must** expose Docker API:

```
Client
  |
HTTPS (443)
  |
Nginx / Traefik (Auth + TLS)
  |
Docker API (localhost:2376)
```

Example Nginx idea:

* mTLS or basic auth
* IP allowlist
* Rate limiting

---

## 7. Docker Contexts (Important Concept)

Docker Desktop uses **contexts** to hide complexity.

List contexts:

```bash
docker context ls
```

Inspect:

```bash
docker context inspect default
```

Example output:

```json
{
  "Endpoints": {
    "docker": {
      "Host": "npipe:////./pipe/docker_engine"
    }
  }
}
```

This is how Docker CLI stays portable across OS.

---

## 8. Why Docker Desktop Hides the API by Default

Reasons:

* Prevent accidental root exposure
* Avoid malware abuse
* Avoid breaking host isolation
* Users don’t need it directly

Docker Desktop is intentionally opinionated.

---

## 9. Practical Recommendation (Real World)

### Best Practice by Platform

| Platform     | Recommended API Access          |
| ------------ | ------------------------------- |
| Windows      | WSL → Unix socket               |
| macOS        | Unix socket                     |
| Linux server | Unix socket + TLS TCP if remote |
| CI/CD        | TLS-secured TCP                 |

---

## 10. Lab-Style Tasks (with hints)

### Task 1

Find the Docker API endpoint used by your OS.

Hint:

```bash
docker context inspect
```

---

### Task 2

Expose Docker API on `localhost:2375` and verify `/version`.

Hint:

* Docker Desktop → Engine JSON
* Restart required

---

### Task 3

Explain why exposing Docker API on `0.0.0.0:80` is dangerous.

Hint:

* Root privileges
* No auth
* Container escape

---

### Task 4

Access Docker API from:

* Windows PowerShell
* WSL
* macOS Terminal

Hint:

* Pipes vs Unix sockets
