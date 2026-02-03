

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
