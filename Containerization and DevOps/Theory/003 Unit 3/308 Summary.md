## **Managing Applications with kubectl**



## **Objective**

By the end of this lab, you will:

* Compare `docker run`, `kubectl run`, and `kubectl create deployment`
* Understand why Kubernetes prefers Deployments over Pods
* Learn command flags in detail
* Practice testing, debugging, scaling, and updating applications
* Learn YAML-based (declarative) approach used in real-world setups

---

## **1. Step 1: Docker Approach (Baseline Understanding)**

```bash
docker run -d -p 8080:80 nginx
```

### Explanation:

* `docker run` → creates and starts container
* `-d` → run in background (detached mode)
* `-p 8080:80` → maps host port 8080 → container port 80
* `nginx` → image name

### Limitation:

* No scaling
* No auto-restart (unless configured)
* No cluster management


---
## **2. Step 2: kubectl run (Pod-Level Execution)**

```bash
kubectl run web --image=nginx --port=80
```

### Explanation:

* `kubectl` → Kubernetes CLI
* `run` → creates a **Pod directly**
* `web` → name of the Pod
* `--image=nginx` → container image
* `--port=80` → container port (informational)



### Check Pod

```bash
kubectl get pods
```



### Expose Pod (Important Step)

```bash
kubectl expose pod web --type=NodePort --port=80
```

### Explanation:

* `expose` → creates a Service
* `pod web` → target resource
* `--type=NodePort` → expose outside cluster
* `--port=80` → service port



### Access Application

```bash
kubectl port-forward pod/web 8080:80
```

Open:

```
http://localhost:8080
```



### Problem with kubectl run

* Creates only **single Pod**
* No scaling
* No rolling updates
* Not self-healing at higher level


---
## **3. Step 3: kubectl create deployment (Recommended)**

```bash
kubectl create deployment web --image=nginx
```

### Explanation:

* `create deployment` → creates Deployment resource
* `web` → deployment name
* `--image=nginx` → container image



### What Kubernetes Creates Internally

```
Deployment → ReplicaSet → Pod → Container
```



## **4. Inspect Resources**

```bash
kubectl get deployments
kubectl get pods
kubectl get rs
```

### Explanation:

* `deployments` → desired state manager
* `pods` → actual running units
* `rs` (ReplicaSet) → maintains pod count



## **5. Expose Deployment**

```bash
kubectl expose deployment web --type=NodePort --port=80
```

### Explanation:

* Same as before, but now targeting **deployment**
* Service will load balance across Pods



## **6. Access Application**

### Using Port Forward (Best for k3d)

```bash
kubectl port-forward service/web 8080:80
```

Open:

```
http://localhost:8080
```



## **7. Scaling Application**

```bash
kubectl scale deployment web --replicas=3
```

### Explanation:

* `scale` → change number of Pods
* `--replicas=3` → desired count



## **8. Updating Deployment**

```bash
kubectl set image deployment/web nginx=nginx:1.25
```

### Explanation:

* Updates container image
* `nginx=nginx:1.25`

  * left → container name
  * right → new image



### Monitor Update

```bash
kubectl rollout status deployment web
```



### Rollback

```bash
kubectl rollout undo deployment web
```



## **9. Debugging & Analysis**

### Describe Resource

```bash
kubectl describe pod <pod-name>
```

### Logs

```bash
kubectl logs <pod-name>
```



### Watch Live Changes

```bash
kubectl get pods -w
```



## **10. Modify Deployment (Imperative Way)**

```bash
kubectl edit deployment web
```

* Opens editor
* Save changes → applied immediately


---
## **11. Declarative Approach (YAML)**

### Why YAML?

* Reusable
* Version controlled
* Industry standard



## **12. Deployment YAML (Detailed Explanation)**

```yaml
apiVersion: apps/v1        # API version for Deployment
kind: Deployment          # Resource type

metadata:
  name: web-deployment    # Deployment name

spec:
  replicas: 2             # Number of Pods

  selector:
    matchLabels:
      app: web            # Select pods with this label

  template:
    metadata:
      labels:
        app: web          # Pod label

    spec:
      containers:
      - name: nginx       # Container name
        image: nginx:latest  # Container image

        ports:
        - containerPort: 80  # Container port
```



## **13. Apply YAML**

```bash
kubectl apply -f web-deployment.yaml
```

### Explanation:

* `apply` → create or update resource
* `-f` → file input

---

## **14. Service YAML**

```yaml
apiVersion: v1
kind: Service

metadata:
  name: web-service

spec:
  type: NodePort

  selector:
    app: web

  ports:
    - port: 80         # Service port
      targetPort: 80   # Container port
      nodePort: 30007  # External port
```


---
## **15. Modify YAML**

### Change replicas

```yaml
replicas: 4
```

Apply:

```bash
kubectl apply -f web-deployment.yaml
```

---

### Change image

```yaml
image: nginx:1.25
```

Kubernetes performs rolling update automatically.



## **16. Observe Changes**

```bash
kubectl rollout status deployment web-deployment
kubectl get pods -w
```

---

## **17. Final Comparison**

| Approach                  | Resource    | Use Case          |
| ------------------------- | ----------- | ----------------- |
| docker run                | Container   | Local testing     |
| kubectl run               | Pod         | Basic testing     |
| kubectl create deployment | Deployment  | Real applications |
| YAML (apply)              | Declarative | Production        |



## **Final Insight**

* `kubectl run` = quick Pod creation
* `kubectl create deployment` = proper application management
* YAML = **real-world standard**

Think like this:

> Docker → “Run container”
> Kubernetes → “Maintain desired state”

