# Monitoring and Logging - Prometheus, Grafana, and ELK Stack

## 1. The Problem: No Visibility in Distributed Systems

When an application fails in production, answering basic questions becomes difficult:

- Where is the error occurring?
- Which specific server is having issues?
- What happened in the minutes before the failure?
- Are there patterns across multiple servers?

Without proper tooling, you end up SSH-ing into each server, searching through log files manually, and having no centralized view of system health.

Monitoring and logging solve this problem in two complementary ways:

- **Metrics** (time-series data): CPU usage, memory, request rates, error counts
- **Logs** (event data): Detailed records of what happened, when, and why

This tutorial covers both using the Prometheus + Grafana stack for metrics and the ELK stack for logs.
---
## 2. Overview: Prometheus + Grafana for Metrics


<svg width="900" height="300" xmlns="http://www.w3.org/2000/svg">

  <!-- Background -->
  <rect width="100%" height="100%" fill="#0f172a"/>

  <!-- Server Box -->
  <rect x="50" y="100" width="200" height="100" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="150" y="130" text-anchor="middle" fill="#e2e8f0" font-size="14">Server</text>
  <text x="150" y="150" text-anchor="middle" fill="#94a3b8" font-size="12">CPU / RAM / Disk</text>

  <!-- Node Exporter -->
  <rect x="70" y="170" width="160" height="40" rx="6" fill="#0ea5e9"/>
  <text x="150" y="195" text-anchor="middle" fill="white" font-size="12">Node Exporter :9100</text>

  <!-- Prometheus -->
  <rect x="350" y="100" width="200" height="120" rx="10" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
  <text x="450" y="130" text-anchor="middle" fill="#e2e8f0" font-size="14">Prometheus</text>
  <text x="450" y="150" text-anchor="middle" fill="#94a3b8" font-size="12">Scrapes Metrics</text>
  <text x="450" y="170" text-anchor="middle" fill="#94a3b8" font-size="12">Stores Time-Series</text>
  <text x="450" y="190" text-anchor="middle" fill="#94a3b8" font-size="12">:9090</text>

  <!-- Grafana -->
  <rect x="650" y="100" width="200" height="120" rx="10" fill="#1e293b" stroke="#22c55e" stroke-width="2"/>
  <text x="750" y="130" text-anchor="middle" fill="#e2e8f0" font-size="14">Grafana</text>
  <text x="750" y="150" text-anchor="middle" fill="#94a3b8" font-size="12">Dashboards</text>
  <text x="750" y="170" text-anchor="middle" fill="#94a3b8" font-size="12">Queries Prometheus</text>
  <text x="750" y="190" text-anchor="middle" fill="#94a3b8" font-size="12">:3000</text>

  <!-- Arrow: Node Exporter -> Prometheus -->
  <line x1="230" y1="190" x2="350" y2="160" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="290" y="170" fill="#38bdf8" font-size="11">HTTP /metrics (pull)</text>

  <!-- Arrow: Prometheus -> Grafana -->
  <line x1="550" y1="160" x2="650" y2="160" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="600" y="145" fill="#22c55e" font-size="11">PromQL Query</text>

  <!-- Arrow Definition -->
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#e2e8f0"/>
    </marker>
  </defs>

</svg>




# What This Diagram Explains 

## Flow:

```
Server → Node Exporter → Prometheus → Grafana
```

## Key Concepts Visualized

### 1. Node Exporter

* Runs on each server
* Exposes:

```bash
http://server:9100/metrics
```


### 2. Prometheus (Pull Model)

* Pulls (scrapes) metrics
* Stores time-series data

Important:

* **Prometheus pulls**, not push


### 3. Grafana

* Does NOT store data
* Queries Prometheus using:

```
PromQL
```



### What Each Component Does

**Node Exporter**

Node Exporter is a lightweight agent that runs on each server you want to monitor. It collects system-level metrics (CPU, memory, disk, network) and exposes them on an HTTP endpoint in a format Prometheus understands. It does not store anything - it simply makes metrics available at a moment in time.

**Prometheus Server**

Prometheus is an open-source time-series database and monitoring system. It works on a pull model: it regularly scrapes metrics from exporters (like Node Exporter) and stores them locally with timestamps. Key features include:

- Multi-dimensional data model with labels
- Powerful query language (PromQL)
- Built-in alerting
- Reliable storage

**Grafana**

Grafana is an open-source visualization platform. It connects to Prometheus as a data source and allows you to create dashboards with graphs, tables, and alerts. Grafana does not store metrics - it only queries and displays them.

**Loki (side note)**

Loki is Grafana's lightweight logging system, designed to be cost-effective and tightly integrated with Prometheus. Unlike ELK, Loki does not index log content - it indexes only labels (like server name or application), making it cheaper but less searchable. It is best suited for cloud-native environments where logs are already structured.

### How They Work Together

```
[Server] → Node Exporter (metrics) → Prometheus (stores) → Grafana (visualizes)
```
---
### Hands-On Example: Local Monitoring Stack with Docker

**Prerequisites:** Docker and Docker Compose installed.

**Step 1: Create `docker-compose.yml`**

```yaml
version: '3.8'

services:
  node_exporter:
    image: prom/node-exporter:latest
    container_name: node_exporter
    restart: unless-stopped
    ports:
      - "9100:9100"
    command:
      - '--path.rootfs=/host'
    volumes:
      - '/:/host:ro,rslave'

  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-storage:/var/lib/grafana

volumes:
  grafana-storage:
```

**Step 2: Create `prometheus.yml`**

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'node_exporter'
    static_configs:
      - targets: ['node_exporter:9100']
```

**Step 3: Start the stack**

```bash
docker-compose up -d
```

**Step 4: Verify each component**

- Node Exporter metrics: http://localhost:9100/metrics
- Prometheus UI: http://localhost:9090
- Grafana: http://localhost:3000 (login: admin / admin)

**Step 5: Add Prometheus as a data source in Grafana**

1. Log into Grafana (http://localhost:3000)
2. Go to Configuration → Data Sources → Add data source
3. Select Prometheus
4. Set URL to `http://prometheus:9090`
5. Click Save & Test

**Step 6: Create a basic dashboard**

1. Click Create → Dashboard → Add visualization
2. Select your Prometheus data source
3. Enter a PromQL query: `rate(node_cpu_seconds_total{mode="system"}[5m])`
4. Save the dashboard
---



## 3. ELK Stack for Logs

### Why Logs Are Different from Metrics

Metrics tell you that something is wrong (e.g., high error rate). Logs tell you exactly what happened (e.g., "payment failed for user ID 123 due to timeout").

Without centralized logging:
- Logs are scattered across multiple servers
- No search capability across servers
- Debugging requires knowing which server to check
- Root cause analysis takes hours
---
### What Each ELK Component Does

<svg width="1000" height="350" xmlns="http://www.w3.org/2000/svg">

  <!-- Background -->
  <rect width="100%" height="100%" fill="#0f172a"/>

  <!-- Application Servers -->
  <rect x="50" y="120" width="180" height="100" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="140" y="145" text-anchor="middle" fill="#e2e8f0" font-size="14">App Servers</text>
  <text x="140" y="165" text-anchor="middle" fill="#94a3b8" font-size="12">Logs Generated</text>
  <text x="140" y="185" text-anchor="middle" fill="#94a3b8" font-size="12">/var/log/*.log</text>

  <!-- Filebeat -->
  <rect x="260" y="130" width="160" height="80" rx="8" fill="#0ea5e9"/>
  <text x="340" y="165" text-anchor="middle" fill="white" font-size="12">Filebeat</text>
  <text x="340" y="185" text-anchor="middle" fill="white" font-size="11">Log Shipper</text>

  <!-- Logstash -->
  <rect x="460" y="120" width="200" height="100" rx="10" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
  <text x="560" y="145" text-anchor="middle" fill="#e2e8f0" font-size="14">Logstash</text>
  <text x="560" y="165" text-anchor="middle" fill="#94a3b8" font-size="12">Parse / Transform</text>
  <text x="560" y="185" text-anchor="middle" fill="#94a3b8" font-size="12">Enrich Logs</text>

  <!-- Elasticsearch -->
  <rect x="700" y="120" width="220" height="100" rx="10" fill="#1e293b" stroke="#22c55e" stroke-width="2"/>
  <text x="810" y="145" text-anchor="middle" fill="#e2e8f0" font-size="14">Elasticsearch</text>
  <text x="810" y="165" text-anchor="middle" fill="#94a3b8" font-size="12">Index & Store Logs</text>
  <text x="810" y="185" text-anchor="middle" fill="#94a3b8" font-size="12">Search Engine</text>

  <!-- Kibana -->
  <rect x="760" y="260" width="140" height="70" rx="8" fill="#a855f7"/>
  <text x="830" y="295" text-anchor="middle" fill="white" font-size="12">Kibana</text>
  <text x="830" y="310" text-anchor="middle" fill="white" font-size="11">Dashboards</text>

  <!-- Arrows -->
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#e2e8f0"/>
    </marker>
  </defs>

  <!-- App -> Filebeat -->
  <line x1="230" y1="170" x2="260" y2="170" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="245" y="160" fill="#38bdf8" font-size="11">Logs</text>

  <!-- Filebeat -> Logstash -->
  <line x1="420" y1="170" x2="460" y2="170" stroke="#0ea5e9" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="440" y="160" fill="#0ea5e9" font-size="11">Ship</text>

  <!-- Logstash -> Elasticsearch -->
  <line x1="660" y1="170" x2="700" y2="170" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="680" y="160" fill="#f59e0b" font-size="11">Processed Logs</text>

  <!-- Elasticsearch -> Kibana -->
  <line x1="810" y1="220" x2="810" y2="260" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="820" y="240" fill="#22c55e" font-size="11">Query</text>

</svg>


# What This Diagram Explains

## Flow:

```id="elkflow1"
Application → Filebeat → Logstash → Elasticsearch → Kibana
```


# Key Concepts 
## 1. Filebeat

* Lightweight agent on servers
* Ships logs (no heavy processing)


## 2. Logstash

* Central processing pipeline
* Parses logs (JSON, regex, fields)


## 3. Elasticsearch

* Stores logs as indexed documents
* Enables fast search:

```id="elkquery1"
error AND payment_failed
```


## 4. Kibana

* UI for searching + dashboards
* Used by developers & SREs



**Elasticsearch**

Elasticsearch is a distributed search and analytics engine. It stores logs in an indexed format, making them searchable at high speed. Think of it as a database optimized for text search. You can query with terms like `error AND payment_failed` and get results in milliseconds even across terabytes of logs.

**Logstash**

Logstash is the data processing pipeline. It ingests logs from multiple sources, transforms them (parsing JSON, extracting fields, adding metadata), and sends them to Elasticsearch. It sits between your applications and the storage layer.

**Kibana**

Kibana is the web interface for Elasticsearch. It provides dashboards, log search, visualizations, and alerting. This is where you actually read and analyze logs.

### Alternative: Filebeat

In modern deployments, Filebeat (a lightweight shipper) often replaces Logstash for log collection. The typical flow becomes:

```
Application logs → Filebeat → (optional Logstash for processing) → Elasticsearch → Kibana
```

Filebeat is lighter and simpler, while Logstash offers more transformation capabilities.
---
### Hands-On Example: Local ELK Stack with Docker

**Step 1: Create `docker-compose-elk.yml`**

```yaml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch-data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:8.11.0
    container_name: logstash
    ports:
      - "5000:5000"
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    container_name: kibana
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - elasticsearch

volumes:
  elasticsearch-data:
```

**Step 2: Create `logstash.conf`**

```
input {
  http {
    port => 5000
    codec => json
  }
}

filter {
  # Add timestamp if not present
  date {
    match => ["timestamp", "ISO8601"]
    target => "@timestamp"
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "app-logs-%{+YYYY.MM.dd}"
  }
  stdout { codec => rubydebug }
}
```

**Step 3: Start ELK stack**

```bash
docker-compose -f docker-compose-elk.yml up -d
```

**Step 4: Send a test log**

```bash
curl -X POST http://localhost:5000 \
  -H "Content-Type: application/json" \
  -d '{"timestamp": "2024-01-15T10:30:00Z", "level": "error", "message": "Payment failed for user 123", "service": "payment-api"}'
```

**Step 5: View logs in Kibana**

1. Open http://localhost:5601
2. Go to Discover
3. Create an index pattern for `app-logs-*`
4. View and search your logs
---
## 4. When to Use Which Stack

| Use Case | Recommended Tool |
|----------|------------------|
| Real-time metrics dashboards | Prometheus + Grafana |
| Long-term metric storage | Prometheus with remote storage |
| Deep log analysis and search | ELK Stack |
| Cost-sensitive log storage with labels | Loki |
| Security and compliance auditing | ELK Stack |
| Cloud-native Kubernetes monitoring | Prometheus + Loki |

## 5. Mental Model Summary

- Node Exporter = "System health reporter" (collects vitals)
- Prometheus = "Database with a pull-based memory" (stores time-series metrics)
- Grafana = "Dashboard maker" (visualizes what Prometheus stores)
- Loki = "Labels-first logging" (cheaper, less searchable)
- Elasticsearch = "Search engine for logs" (fast text search)
- Logstash = "Log processing pipeline" (transform before storing)
- Kibana = "Log browser" (search and visualize logs)
- ELK = "Full-text search for everything that happened"