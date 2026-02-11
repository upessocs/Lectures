# Docker Commands & Flags – HandsOn

## 1. Docker Basics

### Check Docker version

```bash
docker version
```

* Client + Server version
* Confirms Docker daemon connectivity

```bash
docker info
```

* System-wide info: storage driver, cgroups, images, containers

---

## 2. Image Management

### List local images

```bash
docker images
```

Flags:

* `-a` → show all images (including intermediate layers)
* `-q` → only image IDs

---

### Pull image from registry

```bash
docker pull ubuntu
```

```bash
docker pull ubuntu:22.04
```

* Downloads image from Docker Hub (default registry)
* `:tag` specifies version

---

### Remove image

```bash
docker rmi ubuntu
```

Flags:

* `-f` → force removal
* `-a` → remove all unused images

---

## 3. Container Lifecycle

### Run a container

```bash
docker run ubuntu
```

Common flags:

* `-it` → interactive + terminal
* `--name mycontainer` → custom container name
* `-d` → detached (background)
* `--rm` → auto-remove container after exit

Example:

```bash
docker run -it --name test ubuntu bash
```

---

### List containers

```bash
docker ps
```

Flags:

* `-a` → all containers (stopped + running)
* `-q` → only container IDs

---

### Start / Stop / Restart

```bash
docker start container_name
docker stop container_name
docker restart container_name
```

---

### Remove container

```bash
docker rm container_name
```

Flags:

* `-f` → force stop and remove
* `-a` (with `prune`) → remove all stopped containers

---

## 4. Executing Commands Inside Containers

### Attach terminal

```bash
docker attach container_name
```

### Execute command in running container

```bash
docker exec -it container_name bash
```

Flags:

* `-i` → interactive
* `-t` → terminal

---

## 5. Networking & Ports

### Port mapping

```bash
docker run -d -p 8080:80 nginx
```

Explanation:

* Host port `8080`
* Container port `80`

Flags:

* `-p host:container`
* `-P` → random host ports

---

### List networks

```bash
docker network ls
```

---

### Create network

```bash
docker network create mynet
```

Attach container:

```bash
docker run -d --network=mynet nginx
```

---

## 6. Volumes & Data Persistence

### Create volume

```bash
docker volume create mydata
```

### Mount volume

```bash
docker run -v mydata:/data ubuntu
```

Bind mount:

```bash
docker run -v /host/path:/container/path ubuntu
```

Read-only:

```bash
docker run -v mydata:/data:ro ubuntu
```

---

## 7. Logs & Monitoring

### View logs

```bash
docker logs container_name
```

Flags:

* `-f` → follow (live)
* `--tail 50` → last 50 lines
* `--since 10m`

---

### Resource usage

```bash
docker stats
```

Shows:

* CPU
* Memory
* Network I/O
* Disk I/O

---

## 8. Inspect & Metadata

### Inspect object

```bash
docker inspect container_name
```

Returns:

* IP address
* Mounts
* Env variables
* Network config (JSON)

---

## 9. Docker Build (Images)

### Build image

```bash
docker build -t myapp .
```

Flags:

* `-t` → tag image
* `-f Dockerfile.dev` → alternate Dockerfile
* `--no-cache`

---

### Example Dockerfile

```dockerfile
FROM ubuntu:22.04
RUN apt update && apt install -y nginx
CMD ["nginx", "-g", "daemon off;"]
```

---

## 10. Cleanup Commands

### Remove unused containers

```bash
docker container prune
```

### Remove unused images

```bash
docker image prune
```

### Remove everything unused

```bash
docker system prune
```

Flags:

* `-a` → remove all unused images
* `--volumes`

---

## 11. Docker Compose (Overview)

### Start services

```bash
docker compose up
```

Flags:

* `-d` → detached
* `--build`

### Stop services

```bash
docker compose down
```

---

## 12. Important Run Flags (Quick Reference)

| Flag               | Meaning              |
| ------------------ | -------------------- |
| `-it`              | Interactive terminal |
| `-d`               | Detached mode        |
| `--rm`             | Auto-remove          |
| `--name`           | Container name       |
| `-p`               | Port mapping         |
| `-v`               | Volume mount         |
| `-e`               | Environment variable |
| `--network`        | Custom network       |
| `--restart=always` | Auto restart         |

---

## 13. Minimal Lab Example (Ubuntu + Nginx)

```bash
docker pull nginx
docker run -d --name web -p 8080:80 nginx
docker ps
docker logs web
docker stop web
docker rm web
```

---

## 14. Key Concept Summary

* **Image** → Blueprint
* **Container** → Running instance
* **Volume** → Persistent data
* **Network** → Container communication
* **Dockerfile** → Image build instructions

