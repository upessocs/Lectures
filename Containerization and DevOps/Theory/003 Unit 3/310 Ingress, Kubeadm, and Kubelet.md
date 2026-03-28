




















# 1. What is Ingress?

## Problem It Solves

In Kubernetes, when you expose applications using a Service:

* `NodePort` → opens random ports on nodes
* `LoadBalancer` → requires cloud provider

This becomes messy when you have multiple apps:

```id="0m4r2t"
app1 → port 30001
app2 → port 30002
app3 → port 30003
```

No clean URLs like:

```id="w9bgto"
app1.example.com
app2.example.com
```






## What Ingress Does

Ingress provides:

* HTTP/HTTPS routing
* Domain-based access
* Path-based routing
* Single entry point

Example:

```id="l2n9kc"
example.com/app1 → service1
example.com/app2 → service2
```






## Important Note

Ingress is **not a service itself**, it needs:

> An **Ingress Controller**

Popular controller:

* NGINX Ingress Controller






## How Ingress Works

Flow:

```id="47fd8c"
User → Ingress Controller → Service → Pod
```


---



## Install Ingress (k3d / local)

### Step 1: Create cluster with port mapping

```bash id="snm9xk"
k3d cluster create mycluster -p "8080:80@loadbalancer"
```






### Step 2: Install NGINX Ingress Controller

```bash id="pjhwtu"
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
```






### Step 3: Create Ingress Resource

Example:

```yaml id="yx0c7i"
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
spec:
  rules:
  - host: localhost
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web
            port:
              number: 80
```

Apply:

```bash id="5bpv7q"
kubectl apply -f ingress.yaml
```

Access:

```id="xbyy9k"
http://localhost:8080
```





---





# 2. What is kubeadm?

## Purpose

`kubeadm` is a tool to:

> **Create and initialize a real Kubernetes cluster**






## Why We Need kubeadm

Tools like:

* k3d
* minikube

→ Hide complexity

But in real environments you must:

* Set up control plane
* Join worker nodes
* Configure networking

That is where kubeadm is used.






## What kubeadm Does

Automates:

* Control plane setup
* Certificates
* API server
* Scheduler
* Controller manager






## Where It Is Used

* On-premise clusters
* Learning real cluster setup
* Production (custom setups)






## Installation (Ubuntu / VM / Bare Metal)

Install components:

```bash id="91cwul"
sudo apt update
sudo apt install -y kubeadm kubelet kubectl
```






## Create Cluster

### Initialize master node

```bash id="0s9hsf"
sudo kubeadm init
```

Output gives:

```id="7ejty6"
kubeadm join <token>
```






### Configure kubectl

```bash id="q1e5yu"
mkdir -p $HOME/.kube
sudo cp /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```






### Install Network Plugin (Required)

Example (Calico):

```bash id="c66k5s"
kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml
```






### Add Worker Node

Run on worker machine:

```bash id="6jgm5o"
kubeadm join <token>
```






## Summary

```id="vplm12"
kubeadm = cluster setup tool
```




---

# 3. What is kubelet?

## Definition

`kubelet` is:

> **An agent that runs on every node**






## What kubelet Does

* Talks to API server
* Receives instructions
* Ensures containers are running






## Example

If you create a pod:

```bash id="jz25yl"
kubectl run nginx --image=nginx
```

Flow:

```id="rzg1y3"
API Server → kubelet → container runtime → container starts
```






## Responsibilities

* Start containers
* Restart failed containers
* Report node status
* Monitor pods






## Where kubelet Runs

Every node:

```id="2w2o3n"
control plane node
worker node
```






## Check kubelet status

```bash id="8zyq9m"
systemctl status kubelet
```






## Logs

```bash id="fdm80l"
journalctl -u kubelet
```






## Important Note

You **do not directly use kubelet** like kubectl.

It works in background.





---


# 4. Relationship Between Them

```id="axng2r"
kubeadm → creates cluster
kubelet → runs on each node
Ingress → exposes applications to users
```






# 5. When to Use What

| Component | Use Case                   |
| --------- | -------------------------- |
| Ingress   | Expose apps via HTTP/HTTPS |
| kubeadm   | Build real cluster         |
| kubelet   | Node-level agent           |






# 6. Learning Order Recommendation

For students:

1. Pods
2. Deployments
3. Services
4. Ingress
5. kubelet 
6. kubeadm 






---

# 7. Simple Mental Model

```id="2s3qzw"
kubectl → sends command
API server → processes request
kubelet → executes on node
Ingress → exposes app externally
kubeadm → sets up cluster
```


> Deploy → Expose (Service) → Route (Ingress)





---
# Kubernetes Hands-on Lab: Deploy App and Expose Using Ingress

# Lab Objectives

By the end, students will:

* Deploy an application
* Understand Pods and Deployments
* Expose app using Service
* Route traffic using Ingress
* Access app via browser






# Prerequisites

Ensure installed:

* WSL (Ubuntu)
* Docker
* kubectl
* k3d






---

# Step 1: Create k3d Cluster with Ingress Support

We expose port **8080 → 80 (Ingress controller)**

```bash
k3d cluster create mycluster -p "8080:80@loadbalancer"
```

Verify:

```bash
kubectl get nodes
```






# Step 2: Install Ingress Controller

We use:

* NGINX Ingress Controller

Install:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
```

Wait until running:

```bash
kubectl get pods -n ingress-nginx
```

All pods should be `Running`.






# Step 3: Deploy Sample Application

We deploy nginx.

```bash
kubectl create deployment web --image=nginx
```

Verify:

```bash
kubectl get pods
```






# Step 4: Scale Application

```bash
kubectl scale deployment web --replicas=2
```

Check:

```bash
kubectl get pods
```

Explain:

* Multiple pods = load balancing






# Step 5: Expose Deployment as Service

```bash
kubectl expose deployment web --port=80 --type=ClusterIP
```

Check:

```bash
kubectl get services
```

Explain:

* Service provides stable internal access
* But not accessible from browser yet







---
# Step 6: Create Ingress Resource

Create file:

```bash
nano ingress.yaml
```

Paste:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
spec:
  rules:
  - host: localhost
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web
            port:
              number: 80
```

Apply:

```bash
kubectl apply -f ingress.yaml
```






# Step 7: Test in Browser

Open:

```text
http://localhost:8080
```

You should see:

```text
Welcome to nginx!
```




---



# Step 8: Verify Flow (Important for Understanding)

Explain request path:

```text
Browser → Ingress → Service → Pod
```





---






# Step 11: Debug Commands 

## Check Ingress

```bash
kubectl get ingress
```






## Describe Ingress

```bash
kubectl describe ingress web-ingress
```






## Check Service

```bash
kubectl get svc
```






## Check Pods

```bash
kubectl get pods -o wide
```






# Step 12: Cleanup

```bash
kubectl delete ingress web-ingress
kubectl delete service web
kubectl delete deployment web
```

Or delete cluster:

```bash
k3d cluster delete mycluster
```







---
# Common Issues & Fixes

## 1. Page not loading

Check:

```bash
kubectl get pods -n ingress-nginx
```

Must be `Running`.






## 2. Connection refused

* Ensure cluster created with port mapping:

```bash
-p "8080:80@loadbalancer"
```






## 3. Wrong service name

Ensure:

```yaml
name: web
```

matches service name.







---
# Concept Summary

```text
Deployment → creates pods
Service → exposes pods internally
Ingress → exposes app externally (HTTP)
```






---

# Kubeadm vs Kubelet ?

```text
kubeadm → cluster setup tool (not always running)

kubelet → core Kubernetes component (always running on every node)
```






# 1. What is kubeadm 

`kubeadm` is **not a core runtime component** of Kubernetes.

It is a:

> **bootstrap / installation tool used to create a Kubernetes cluster**

### Key points:

* Used **only during cluster setup**
* Runs once (or occasionally for upgrades)
* Not involved in daily cluster operations

### Example usage:

```bash
sudo kubeadm init        # setup control plane
sudo kubeadm join        # add worker node
```

After setup:

```text
kubeadm → job done → exits
```






# 2. What is kubelet 

`kubelet` is a **core Kubernetes agent**.

> It runs continuously on **every node (control plane + worker)**

### Responsibilities:

* Receives instructions from API server
* Starts containers
* Monitors pods
* Restarts failed containers

### Important:

```text
kubelet = actual worker doing the job
```






---

# 3. Where They Exist

| Component | Runs Where                  | Nature            |
| --------- | --------------------------- | ----------------- |
| kubeadm   | Admin machine / setup phase | Temporary tool    |
| kubelet   | Every node                  | Permanent service |






---

# 4. Real Cluster View

After cluster setup:

```text
Control Plane Node:
- API Server
- Scheduler
- Controller Manager
- etcd
- kubelet

Worker Node:
- kubelet
- container runtime
- kube-proxy
```

Notice:

```text
kubeadm is NOT running here
kubelet IS running here
```






# 5. Simple Analogy

```text
kubeadm = installer (like OS installer)
kubelet = operating system service (always running)
```






# 7. Where Do You Use Them?

### kubeadm

Use when:

* Creating real cluster (VMs / bare metal)
* Learning cluster internals

Not needed when using:

* k3d
* minikube
* kind






### kubelet

You don’t manually use it.

You **observe/debug it**:

```bash
systemctl status kubelet
journalctl -u kubelet
```






# 8. Final Mental Model

```text
kubeadm → builds cluster
kubectl → talks to cluster
API server → control center
kubelet → executes on nodes
```

