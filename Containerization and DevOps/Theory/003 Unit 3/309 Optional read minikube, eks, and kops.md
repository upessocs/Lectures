# Minikube cluster and AWS EKS (Elastic Kubernetes Service) 

Below is a structured, hands-on tutorial that connects all pieces:

* Minikube setup (local cluster)
* kubectl configuration & context switching
* Connecting kubectl to AWS Kubernetes (EKS)
* Introduction + guided tutorial for Kops (self-managed cluster on AWS)



# 1. Minikube Setup (Local Kubernetes Cluster)

## 1.1 Install Minikube

[Minikube Web](https://minikube.sigs.k8s.io/docs/start/)

### Linux (recommended method)

```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

### Verify

```bash
minikube version
```



## 1.2 Install kubectl (if not already)

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

chmod +x kubectl
sudo mv kubectl /usr/local/bin/
```



## 1.3 Start Minikube Cluster

```bash
minikube start --driver=docker
```

Explanation:

* `--driver=docker` → runs Kubernetes inside Docker (similar to k3d concept)
* Minikube creates:

  * VM/container
  * control plane
  * kubeconfig entry automatically



## 1.4 Verify Cluster

```bash
kubectl get nodes
kubectl get pods -A
```



## 1.5 Deploy Test App

```bash
kubectl create deployment hello-minikube --image=nginx
kubectl expose deployment hello-minikube --type=NodePort --port=80
```

Access:

```bash
minikube service hello-minikube
```



# 2. kubectl Configuration & Context Management

kubectl uses a config file:

```bash
~/.kube/config
```

This file contains:

* clusters (API server endpoints)
* users (auth info)
* contexts (cluster + user mapping)



## 2.1 View Config

```bash
kubectl config view
```



## 2.2 List Contexts

```bash
kubectl config get-contexts
```

Example output:

```
CURRENT   NAME            CLUSTER         AUTHINFO
*         minikube       minikube        minikube-user
          k3d-mycluster  k3d-mycluster   admin@k3d
```



## 2.3 Switch Context

```bash
kubectl config use-context minikube
kubectl config use-context k3d-mycluster
```



## 2.4 Check Current Context

```bash
kubectl config current-context
```



## 2.5 Why This Matters (Important Insight)

You can manage **multiple clusters from one kubectl**:

* Minikube (local learning)
* k3d (lightweight testing)
* AWS (production)

kubectl just switches API server + credentials.


---
# 3. Connecting kubectl to AWS Kubernetes

There are two main cases:

## Case A: AWS Managed Kubernetes (EKS)

This is the most common.



### 3.1 Install AWS CLI

```bash
aws configure
```

You need:

* Access Key
* Secret Key
* Region



### 3.2 Update kubeconfig for EKS

```bash
aws eks update-kubeconfig --region <region> --name <cluster-name>
```

Example:

```bash
aws eks update-kubeconfig --region ap-south-1 --name my-cluster
```



### What this command does:

It adds a new context in:

```bash
~/.kube/config
```



### 3.3 Verify

```bash
kubectl config get-contexts
kubectl get nodes
```



### Required Details for EKS

You **do NOT manually manage tokens usually**. Required:

* AWS credentials (IAM user/role)
* Cluster name
* Region

Behind the scenes:

* AWS generates authentication token dynamically
* kubectl uses AWS IAM for authentication



## Case B: Generic Kubernetes Cluster (Manual Setup)

If not EKS (like kubeadm cluster), you need:

### Required Details:

* API Server Endpoint
  Example:

  ```
  https://<public-ip>:6443
  ```

* CA Certificate

* User Credentials:

  * Token OR
  * Client certificate + key



### Example kubeconfig entry:

```yaml
clusters:
- cluster:
    server: https://1.2.3.4:6443
    certificate-authority-data: <base64-cert>
  name: my-cluster

users:
- name: my-user
  user:
    token: <token>

contexts:
- context:
    cluster: my-cluster
    user: my-user
  name: my-context
```

---

# 4. Kops (Kubernetes Operations on AWS)

Kops is used to create and manage Kubernetes clusters on AWS (instead of EKS).

Think:

* EKS → managed by AWS
* Kops → you manage everything (control plane + nodes)



## 4.1 Install Kops

```bash
curl -LO https://github.com/kubernetes/kops/releases/latest/download/kops-linux-amd64
chmod +x kops-linux-amd64
sudo mv kops-linux-amd64 /usr/local/bin/kops
```



## 4.2 Prerequisites

* AWS CLI configured
* IAM permissions
* S3 bucket (for cluster state)



## 4.3 Create S3 Bucket (State Store)

```bash
aws s3api create-bucket \
  --bucket my-kops-state-store \
  --region ap-south-1
```

Enable versioning:

```bash
aws s3api put-bucket-versioning \
  --bucket my-kops-state-store \
  --versioning-configuration Status=Enabled
```



## 4.4 Set Environment Variables

```bash
export KOPS_STATE_STORE=s3://my-kops-state-store
export NAME=mycluster.k8s.local
```



## 4.5 Create Cluster (Dry Run First)

```bash
kops create cluster \
  --name=$NAME \
  --zones=ap-south-1a \
  --node-count=2 \
  --node-size=t3.medium \
  --control-plane-size=t3.medium \
  --yes
```



## 4.6 What Happens Internally

Kops creates:

* EC2 instances (nodes + master)
* VPC, subnets
* Security groups
* Load balancer
* etcd cluster



## 4.7 Update kubeconfig

```bash
kops export kubecfg --name $NAME
```

Now kubectl can access cluster.



## 4.8 Validate Cluster

```bash
kops validate cluster
kubectl get nodes
```



## 4.9 Delete Cluster

```bash
kops delete cluster --name $NAME --yes
```



# 5. Key Comparison (Important for DevOps Understanding)

| Tool     | Type             | Use Case             |
| -------- | ---------------- | -------------------- |
| k3d      | Lightweight      | Local testing (fast) |
| Minikube | Local VM-based   | Learning Kubernetes  |
| EKS      | Managed          | Production           |
| Kops     | Self-managed AWS | Advanced control     |



# 6. Suggested Learning Flow (Based on Your Current Setup)

Since you already use k3d:

1. Try Minikube (compare behavior with k3d)
2. Practice kubectl context switching
3. Connect to EKS (if available)
4. Try Kops (understand infra-level setup)



# 7. Practical Exercise

### Task:

1. Run both clusters:

   * k3d
   * Minikube

2. Deploy nginx in both:

```bash
kubectl create deployment web --image=nginx
```

3. Switch contexts and compare:

```bash
kubectl config use-context minikube
kubectl get pods

kubectl config use-context k3d-mycluster
kubectl get pods
```



# 8. Key Takeaway

* kubectl is just a client
* kubeconfig is the brain
* clusters are interchangeable targets





---
## Optional Read for cloud 

**EKS (Elastic Kubernetes Service)** is a managed Kubernetes service provided by Amazon Web Services.

In simple terms:

> EKS lets you run Kubernetes on AWS **without managing the control plane yourself**.



# 1. What EKS Actually Is

Normally in Kubernetes, you must manage:

* API Server
* etcd (cluster database)
* Scheduler
* Controller Manager

With EKS:

* AWS manages all of the above (control plane)
* You manage:

  * worker nodes (EC2 or serverless)
  * applications (pods, deployments)



# 2. Architecture (Simplified)

```
                AWS Managed (You don't manage)
              -------------------------------
              |  API Server                |
              |  etcd                      |
              |  Scheduler                 |
              |  Controller Manager        |
              -------------------------------
                         |
                         |
        -----------------------------------------
        | EC2 Nodes / Fargate (You manage)     |
        | Pods, Containers                     |
        -----------------------------------------
```

---

# 3. Why EKS Exists

Without EKS:

* You manually create cluster (kubeadm / kops)
* Manage upgrades
* Handle failures
* Secure control plane

With EKS:

* AWS handles:

  * High availability
  * Scaling control plane
  * Security patches
  * Backups (etcd)



# 4. How You Interact with EKS

You still use:

```bash
kubectl
```

Example:

```bash
aws eks update-kubeconfig --region ap-south-1 --name my-cluster
kubectl get nodes
```

So:

> EKS ≠ new tool
> EKS = managed backend for Kubernetes



# 5. Key Features

### 1. Managed Control Plane

* No need to install or maintain Kubernetes master components

### 2. High Availability

* Control plane runs across multiple AWS Availability Zones

### 3. IAM Integration

* Uses AWS IAM for authentication instead of manual tokens

### 4. Scaling

* Add/remove worker nodes easily
* Use Auto Scaling Groups

### 5. Fargate Support

* Run pods **without managing servers**


---
# 6. EKS vs Kops vs Minikube

| Feature          | EKS         | Kops                  | Minikube |
| ---------------- | ----------- | --------------------- | -------- |
| Control Plane    | AWS managed | You manage            | Local    |
| Use Case         | Production  | Advanced/self-managed | Learning |
| Setup Complexity | Medium      | High                  | Low      |
| Cost             | Paid        | Paid (infra)          | Free     |



# 7. What You Need to Connect to EKS

Unlike manual Kubernetes, you don’t need:

* API server IP
* Certificates
* Tokens

You only need:

* AWS credentials (IAM user/role)
* Cluster name
* Region

Command:

```bash
aws eks update-kubeconfig --name my-cluster --region ap-south-1
```

AWS handles authentication behind the scenes.

---

# 8. When to Use EKS

Use EKS when:

* You want Kubernetes in production
* You don’t want to manage control plane
* You are already using AWS ecosystem



# 9. Key Insight (Very Important)

EKS is still **100% Kubernetes**.

That means:

* Same `kubectl`
* Same YAML
* Same deployments

Only difference:

> Who manages the cluster infrastructure.




---










