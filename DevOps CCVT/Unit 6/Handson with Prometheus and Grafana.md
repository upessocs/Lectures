# MonitoringWithPrometheusAndGrafana





[Project Repo](https://github.com/upessocs/MonitoringWithPrometheusAndGrafana)


# 1 Install prometheus exporter on test linux system/wsl/docker container

read instructions [https://prometheus.io/docs/guides/node-exporter/](https://prometheus.io/docs/guides/node-exporter/)

after this tutorial check metrics at http://localhost:9100/metrics


# 2 Start prometheus and grafana using docker compose
now execute `docker-compose up -d`

check prometheus data collection database server
[localhost:9090](localhost:9090)


and grafana at 
[localhost:3000](localhost:3000)

# Task/ToDo

your task is of read node exporter data in to prometheus server and then visualize data from prometheus server in to grafana

---
# Alternate Version

---

# Comprehensive Tutorial: Monitoring with Prometheus and Grafana

This tutorial provides a complete, step-by-step guide to setting up system monitoring using Prometheus and Grafana.

## Prerequisites
- Docker and Docker Compose installed
- Basic Linux command line knowledge
- Ports 9090, 3000, and 9100 available on your system

## Step 1: Install and Configure Node Exporter

### Option A: Install on a Linux System/WSL
1. Download the latest Node Exporter:
```bash
wget https://github.com/prometheus/node_exporter/releases/download/v1.6.1/node_exporter-1.6.1.linux-amd64.tar.gz
```

2. Extract the package:
```bash
tar xvfz node_exporter-1.6.1.linux-amd64.tar.gz
```

3. Move to a system directory:
```bash
sudo mv node_exporter-1.6.1.linux-amd64/node_exporter /usr/local/bin/
```

4. Create a systemd service file:
```bash
sudo nano /etc/systemd/system/node_exporter.service
```

Add this content:
```
[Unit]
Description=Node Exporter
After=network.target

[Service]
User=node_exporter
Group=node_exporter
Type=simple
ExecStart=/usr/local/bin/node_exporter

[Install]
WantedBy=multi-user.target
```

5. Create a dedicated user and start the service:
```bash
sudo useradd -rs /bin/false node_exporter
sudo systemctl daemon-reload
sudo systemctl start node_exporter
sudo systemctl enable node_exporter
```

### Option B: Run in Docker Container
```bash
docker run -d \
--net="host" \
--pid="host" \
-v "/:/host:ro,rslave" \
quay.io/prometheus/node-exporter:latest \
--path.rootfs=/host
```

### Verify Node Exporter
Access metrics at [http://localhost:9100/metrics](http://localhost:9100/metrics)

## Step 2: Set Up Prometheus and Grafana with Docker Compose

1. Create a `docker-compose.yml` file:
```yaml
version: '3'

services:
    prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
        - "9090:9090"
    volumes:
        - ./prometheus.yml:/etc/prometheus/prometheus.yml
    command:
        - '--config.file=/etc/prometheus/prometheus.yml'
    restart: unless-stopped

    grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
        - "3000:3000"
    volumes:
        - grafana-storage:/var/lib/grafana
    restart: unless-stopped

volumes:
    grafana-storage:
```

2. Create a `prometheus.yml` configuration file:
```yaml
global:
    scrape_interval: 15s
    evaluation_interval: 15s

scrape_configs:
    - job_name: 'prometheus'
    static_configs:
        - targets: ['localhost:9090']

    - job_name: 'node_exporter'
    static_configs:
        - targets: ['host.docker.internal:9100']
        # For Linux/WSL use your machine's IP or 'localhost:9100'
```

3. Start the services:
```bash
docker-compose up -d
```

## Step 3: Verify Services

1. **Prometheus**:
- Access at [http://localhost:9090](http://localhost:9090)
- Check targets under Status > Targets
- Verify node_exporter is listed and showing as UP

2. **Grafana**:
- Access at [http://localhost:3000](http://localhost:3000)
- Default credentials: admin/admin (you'll be prompted to change password)

## Step 4: Configure Grafana to Use Prometheus Data

1. Add Prometheus as a data source:
- In Grafana, go to Configuration > Data Sources
- Click "Add data source"
- Select Prometheus
- Set URL to `http://prometheus:9090` (or `http://host.docker.internal:9090` if outside Docker)
- Click "Save & Test"

2. Import a Node Exporter dashboard:
- Go to Dashboards > Manage
- Click "Import"
- Use dashboard ID `1860` (Node Exporter Full)
- Select your Prometheus data source
- Click "Import"

## Step 5: Create Custom Queries (Optional)

1. Example CPU usage query:
```
100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

2. Memory usage query:
```
(node_memory_MemTotal_bytes - node_memory_MemFree_bytes - node_memory_Buffers_bytes - node_memory_Cached_bytes) / node_memory_MemTotal_bytes * 100
```

## Troubleshooting

1. **Node Exporter not showing in Prometheus**:
- Verify the target URL in prometheus.yml is correct
- Check if the node exporter is running (`ss -tulnp | grep 9100`)
- For Docker, ensure proper networking (use `host.docker.internal` for Mac/Windows)

2. **Grafana can't connect to Prometheus**:
- Verify the data source URL
- Check if both containers are running (`docker ps`)
- Try accessing Prometheus from Grafana container:
    ```bash
    docker exec -it grafana curl http://prometheus:9090
    ```

## Advanced Configuration

1. Add alerting in Prometheus:
```yaml
alerting:
    alertmanagers:
    - static_configs:
    - targets:
        - alertmanager:9093
```

2. Set up Alertmanager for notifications (add to docker-compose.yml):
```yaml
alertmanager:
    image: prom/alertmanager:latest
    ports:
    - "9093:9093"
    volumes:
    - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml
    command:
    - '--config.file=/etc/alertmanager/alertmanager.yml'
```

This complete setup gives you a robust monitoring solution with metrics collection, visualization, and alerting capabilities.