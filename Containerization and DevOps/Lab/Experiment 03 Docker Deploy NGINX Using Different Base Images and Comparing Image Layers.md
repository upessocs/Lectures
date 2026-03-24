
# Deploying NGINX Using Different Base Images and Comparing Image Layers

---

## Lab Objectives

After completing this lab, students will be able to:

* Deploy NGINX using:

  * Official `nginx` image
  * Ubuntu-based image
  * Alpine-based image
* Understand Docker image layers and size differences
* Compare performance, security, and use-cases of each approach
* Explain real-world use of NGINX in containerized systems

---

## Prerequisites

* Docker installed and running
* Basic knowledge of:

  * `docker run`
  * `Dockerfile`
  * Port mapping
* Linux command basics

---

## Part 1: Deploy NGINX Using Official Image (Recommended Approach)

### Step 1: Pull the Image

```bash
docker pull nginx:latest
```

### Step 2: Run the Container

```bash
docker run -d --name nginx-official -p 8080:80 nginx
```

### Step 3: Verify

```bash
curl http://localhost:8080
```

You should see the **NGINX welcome page**.

---

### Key Observations

```bash
docker images nginx
```

* Image is **pre-optimized**
* Minimal configuration required
* Uses Debian-based OS internally

---

## Part 2: Custom NGINX Using Ubuntu Base Image

### Step 1: Create Dockerfile

```Dockerfile
FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y nginx && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Step 2: Build Image

```bash
docker build -t nginx-ubuntu .
```

### Step 3: Run Container

```bash
docker run -d --name nginx-ubuntu -p 8081:80 nginx-ubuntu
```

---

### Observations

```bash
docker images nginx-ubuntu
```

* Much **larger image size**
* More layers
* Full OS utilities available

---

## Part 3: Custom NGINX Using Alpine Base Image

### Step 1: Create Dockerfile

```Dockerfile
FROM alpine:latest

RUN apk add --no-cache nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Step 2: Build Image

```bash
docker build -t nginx-alpine .
```

### Step 3: Run Container

```bash
docker run -d --name nginx-alpine -p 8082:80 nginx-alpine
```

---

### Observations

```bash
docker images nginx-alpine
```

* Extremely **small image**
* Fewer packages
* Faster pull and startup time

---

## Part 4: Image Size and Layer Comparison

### Compare Sizes

```bash
docker images | grep nginx
```

Typical result (approx):

| Image Type   | Size      |
| ------------ | --------- |
| nginx:latest | ~140 MB   |
| nginx-ubuntu | ~220+ MB  |
| nginx-alpine | ~25–30 MB |

---

### Inspect Layers

```bash
docker history nginx
docker history nginx-ubuntu
docker history nginx-alpine
```

Observations:

* Ubuntu has many filesystem layers
* Alpine has minimal layers
* Official NGINX image is optimized but heavier than Alpine

---

## Part 5: Functional Tasks Using NGINX

### Task 1: Serve Custom HTML Page

```bash
mkdir html
echo "<h1>Hello from Docker NGINX</h1>" > html/index.html
```

Run:

```bash
docker run -d \
  -p 8083:80 \
  -v $(pwd)/html:/usr/share/nginx/html \
  nginx
```

---

### Task 2: Reverse Proxy (Conceptual)

NGINX can:

* Forward traffic to backend services
* Load balance multiple containers
* Terminate SSL

Example use cases:

* Frontend for microservices
* API gateway
* Static file server

---

## Part 6: Comparison Summary

### Image Comparison Table

| Feature          | Official NGINX | Ubuntu + NGINX | Alpine + NGINX |
| ---------------- | -------------- | -------------- | -------------- |
| Image Size       | Medium         | Large          | Very Small     |
| Ease of Use      | Very Easy      | Medium         | Medium         |
| Startup Time     | Fast           | Slow           | Very Fast      |
| Debugging Tools  | Limited        | Excellent      | Minimal        |
| Security Surface | Medium         | Large          | Small          |
| Production Ready | Yes            | Rarely         | Yes            |

---

## Part 7: When to Use What

### Use Official NGINX Image When:

* Production deployment
* Standard web hosting
* Reverse proxy / load balancer

### Use Ubuntu-Based Image When:

* Learning Linux + NGINX internals
* Heavy debugging needed
* Custom system-level dependencies

### Use Alpine-Based Image When:

* Microservices
* CI/CD pipelines
* Cloud and Kubernetes workloads

---

## Lab Assignment (For Students)

1. Measure image pull time for each image
2. Add a custom NGINX config to:

   * Change default port
   * Add basic auth
3. Remove unused layers and rebuild image
4. Explain:

   * Why Alpine images are smaller
   * Why Ubuntu images are avoided in production

---

## Expected Learning Outcome

By the end of this lab, students should clearly understand:

* Docker image construction
* Base image impact on size and security
* Why official images exist
* Real-world NGINX usage in container platforms


---
# Optional read
---
# NGINX Web Server: How to Use It and Why It’s Powerful (Optional read)

## 1. What NGINX is (quick context)

NGINX is a:

* High-performance **web server**
* **Reverse proxy**
* **Load balancer**
* **API gateway**

It is event-driven and asynchronous, which makes it far more efficient than traditional thread-based servers like Apache under high load.

---

## 2. Hosting Static Files (Most Common Use)

### Step 1: Install NGINX

**Ubuntu / Debian**

```bash
sudo apt update
sudo apt install nginx
```

**RHEL / CentOS**

```bash
sudo dnf install nginx
```

Start and enable:

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

### Step 2: Default Web Root

By default, NGINX serves files from:

```text
/var/www/html
```

Put a file there:

```bash
sudo nano /var/www/html/index.html
```

Example:

```html
<h1>Hello from NGINX</h1>
```

Access in browser:

```
http://<server-ip>
```

---

## 3. Understanding NGINX Configuration (Core Concept)

Main config:

```text
/etc/nginx/nginx.conf
```

Site configs:

```text
/etc/nginx/sites-available/
```

Enabled sites:

```text
/etc/nginx/sites-enabled/
```

NGINX uses **server blocks** (similar to Apache virtual hosts).

---

## 4. Hosting a Custom Website (Server Block)

### Step 1: Create website directory

```bash
sudo mkdir -p /var/www/myapp
sudo chown -R www-data:www-data /var/www/myapp
```

Add files:

```bash
nano /var/www/myapp/index.html
```

---

### Step 2: Create NGINX config

```bash
sudo nano /etc/nginx/sites-available/myapp
```

```nginx
server {
    listen 80;
    server_name myapp.local;

    root /var/www/myapp;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Enable it:

```bash
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 5. Serving Static Assets Efficiently

NGINX is excellent for static files (CSS, JS, images).

```nginx
location /assets/ {
    root /var/www/myapp;
    expires 30d;
    access_log off;
}
```

Benefits:

* Browser caching
* Reduced bandwidth
* Faster page load

---

## 6. Using NGINX as a Reverse Proxy (Very Important)

### Use case:

Frontend → NGINX → Backend app (Node, Java, Python, Go)

Example: Proxy to backend on port 3000

```nginx
server {
    listen 80;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Why this matters:

* Hide backend ports
* Central SSL handling
* Better security
* Easy scaling

---

## 7. Load Balancing with NGINX

### Example: Multiple backend servers

```nginx
upstream backend_pool {
    server 10.0.0.1:8080;
    server 10.0.0.2:8080;
}

server {
    listen 80;

    location / {
        proxy_pass http://backend_pool;
    }
}
```

Algorithms:

* Round-robin (default)
* Least connections
* IP hash

---

## 8. HTTPS / SSL Termination

```nginx
server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate /etc/ssl/cert.pem;
    ssl_certificate_key /etc/ssl/key.pem;

    location / {
        root /var/www/html;
    }
}
```

Why SSL at NGINX:

* Backend stays HTTP
* Centralized cert management
* Faster TLS handling

---

## 9. NGINX for APIs (API Gateway style)

Common API features:

* Rate limiting
* Auth forwarding
* Header injection

### Rate limiting example

```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location /api/ {
    limit_req zone=api burst=20;
    proxy_pass http://api_backend;
}
```

---

## 10. NGINX with Docker (Modern Use Case)

```bash
docker run -d \
  -p 80:80 \
  -v $(pwd)/html:/usr/share/nginx/html \
  nginx
```

Why this is popular:

* Immutable config
* Easy rollback
* Perfect for CI/CD

---

## 11. Other Important Use Cases

| Use Case                 | Why NGINX         |
| ------------------------ | ----------------- |
| Static websites          | Extremely fast    |
| Reverse proxy            | Simple, secure    |
| Load balancer            | Lightweight       |
| Kubernetes Ingress       | Industry standard |
| CDN edge server          | High concurrency  |
| Media streaming          | Low memory usage  |
| GitHub Pages alternative | Full control      |

---

## 12. NGINX vs Apache (Quick Comparison)

| Feature       | NGINX        | Apache         |
| ------------- | ------------ | -------------- |
| Architecture  | Event-driven | Process/thread |
| Static files  | Faster       | Slower         |
| Reverse proxy | Excellent    | Average        |
| .htaccess     | -            | yes           |
| Memory usage  | Low          | Higher         |

---

## 13. When NOT to use NGINX alone

* Dynamic PHP without PHP-FPM
* Heavy per-directory config needs
* Shared hosting environments

---

## 14. Learning Path (Recommended)

1. Static file hosting
2. Server blocks
3. Reverse proxy
4. SSL termination
5. Load balancing
6. Docker + NGINX
7. Kubernetes Ingress

