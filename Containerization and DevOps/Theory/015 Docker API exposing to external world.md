# Docker API exposing to external network via port — Hands-On Tutorial

(WSL + Linux + Windows + macOS)

---

## 1. What is the Docker API (quick recap)

Docker Engine exposes a **REST API** used by:

* Docker CLI
* Docker Desktop
* Portainer, Jenkins, GitLab, Kubernetes
* Any HTTP client (`curl`, SDKs)

Default endpoint:

```
Unix socket: /var/run/docker.sock
```

Optional:

```
TCP socket: tcp://HOST:2375 (NO TLS)
TCP socket: tcp://HOST:2376 (TLS)
```

---

## 2. Check your current Docker API setup

### Verify Docker Engine

```bash
docker version
docker info
```

### Check socket

```bash
ls -l /var/run/docker.sock
```

Typical output:

```
srw-rw---- 1 root docker ...
```

This means:

* Root or `docker` group can access API
* Others cannot

---

## 3. Using Docker API locally (Unix socket)

### Test API with curl (no TCP needed)

```bash
curl --unix-socket /var/run/docker.sock http://localhost/version
```

Expected JSON response:

```json
{
  "Version": "24.x.x",
  "ApiVersion": "1.43",
  ...
}
```

More examples:

```bash
# List containers
curl --unix-socket /var/run/docker.sock http://localhost/containers/json

# List images
curl --unix-socket /var/run/docker.sock http://localhost/images/json
```

This works on:

* Linux
* WSL
* macOS
* Windows (via Docker Desktop VM)

---

## 4. Exposing Docker API over TCP (DANGEROUS if misused)

### Why expose it?

* Remote CI/CD
* Portainer
* External automation tools

### Why dangerous?

> Docker API = **root access to host**

---

## 5. Expose Docker API on Linux / WSL (docker.io)

### Step 1: Edit Docker daemon config

```bash
sudo nano /etc/docker/daemon.json
```

Add:

```json
{
  "hosts": [
    "unix:///var/run/docker.sock",
    "tcp://0.0.0.0:2375"
  ]
}
```

### Step 2: Restart Docker

```bash
sudo systemctl daemon-reexec
sudo systemctl restart docker
```

### Step 3: Verify port is open

```bash
ss -lntp | grep 2375
```

---

## 6. Test Docker API over TCP

From same machine:

```bash
curl http://localhost:2375/version
```

From another machine:

```bash
curl http://<host-ip>:2375/containers/json
```

If this works → Docker is remotely controllable.

---

## 7. Windows (Docker Desktop)

### Docker Desktop behavior

* Docker runs **inside a VM**
* API is **not exposed by default**

### Enable TCP API

1. Docker Desktop → Settings
2. Docker Engine
3. Edit JSON:

```json
{
  "hosts": [
    "unix:///var/run/docker.sock",
    "tcp://0.0.0.0:2375"
  ]
}
```

4. Apply & Restart

### Test (PowerShell)

```powershell
curl http://localhost:2375/version
```

---

## 8. macOS (Docker Desktop)

Same as Windows:

* Docker → Settings → Docker Engine
* Add TCP host
* Restart

Test:

```bash
curl http://localhost:2375/version
```

---

## 9. Using Docker API programmatically

### Example: Create container using curl

```bash
curl -X POST http://localhost:2375/containers/create \
  -H "Content-Type: application/json" \
  -d '{
    "Image": "nginx",
    "HostConfig": {
      "PortBindings": {
        "80/tcp": [{ "HostPort": "8080" }]
      }
    }
  }'
```

Start it:

```bash
curl -X POST http://localhost:2375/containers/<container-id>/start
```

---

## 10. Securing Docker API (CRITICAL)

### NEVER do this in production

```
tcp://0.0.0.0:2375
```

Anyone can:

* Run containers
* Mount `/`
* Delete data
* Escape containers

---

## 11. Secure Docker API with TLS (Recommended)

### Generate certs (simplified overview)

```bash
mkdir ~/docker-certs
cd ~/docker-certs
```

Create CA, server, client certificates
Then update daemon.json:

```json
{
  "hosts": ["tcp://0.0.0.0:2376"],
  "tls": true,
  "tlscacert": "/etc/docker/ca.pem",
  "tlscert": "/etc/docker/server-cert.pem",
  "tlskey": "/etc/docker/server-key.pem",
  "tlsverify": true
}
```

Client usage:

```bash
docker --tlsverify \
  --tlscacert=ca.pem \
  --tlscert=cert.pem \
  --tlskey=key.pem \
  -H=tcp://host:2376 ps
```

---

## 12. Safer Alternatives to TCP Exposure

### Option 1: SSH tunneling (BEST)

```bash
ssh -L 2375:/var/run/docker.sock user@host
```

Then locally:

```bash
export DOCKER_HOST=tcp://localhost:2375
docker ps
```

### Option 2: Portainer agent

* Uses encrypted tunnel
* No open Docker API

---

## 13. Common Issues & Fixes

### Issue: `permission denied`

```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Issue: API works locally but not remotely

* Firewall blocking port
* Docker bound to `127.0.0.1`

Check:

```bash
ss -lntp | grep docker
```

### Issue: Docker Desktop ignores daemon.json

* Docker Desktop overwrites config
* Must edit via UI, not file

---

## 14. How to Verify Exposure (Security Check)

```bash
nmap -p 2375 <host-ip>
```

If open → system is vulnerable.

Also test:

```bash
curl http://<host-ip>:2375/containers/json
```

If this works → **full host compromise possible**

---

## 15. Recommended Learning Flow

1. Unix socket API usage
2. TCP exposure locally
3. Remote API testing
4. TLS protection
5. SSH tunneling
6. CI/CD integration
7. Kubernetes vs Docker API comparison

---

## Summary (Key Takeaways)

* Docker CLI = Docker API client
* Unix socket is safest
* TCP without TLS is **root-level vulnerability**
* SSH tunnel is simplest secure method
* Docker Desktop behaves differently from Linux/WSL

