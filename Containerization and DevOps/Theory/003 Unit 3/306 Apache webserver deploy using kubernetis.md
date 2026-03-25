# Hands-on Task: Run and Manage a “Hello Web App” (httpd)

## Objective

Deploy and manage a simple Apache-based web server and:

* verify it is running
* modify it
* scale it
* debug it

> Submit it one GitHub Repo and share its URL

---

# Task: Deploy a Simple Web Application (Apache httpd)

You will run an Apache server instead of nginx.



## Step 1: Run a Pod

```bash
kubectl run apache-pod --image=httpd
```

Check:

```bash
kubectl get pods
```



## Step 2: Inspect Pod

```bash
kubectl describe pod apache-pod
```

Focus:

* container image = `httpd`
* ports (default 80)
* events



## Step 3: Access the App

```bash
kubectl port-forward pod/apache-pod 8081:80
```

Open:

```
http://localhost:8081
```

You should see:
→ Apache default page (“It works!”)



## Step 4: Delete Pod

```bash
kubectl delete pod apache-pod
```

---

### Insight

Same as before:

* Pod disappears permanently
* No self-healing



# Task: Convert to Deployment



## Step 5: Create Deployment

```bash
kubectl create deployment apache --image=httpd
```

Check:

```bash
kubectl get deployments
kubectl get pods
```



## Step 6: Expose Deployment

```bash
kubectl expose deployment apache --port=80 --type=NodePort
```

Access again:

```bash
kubectl port-forward service/apache 8082:80
```

Open:

```
http://localhost:8082
```

---

# Task: Modify Behavior



## Step 7: Scale Deployment

```bash
kubectl scale deployment apache --replicas=2
```

Check:

```bash
kubectl get pods
```



### Observe

* Multiple pods running same app



## Step 8: Test Load Distribution (Basic)

Run port-forward again and refresh browser multiple times.

(Advanced later: logs + different content per pod)

---

# Task: Debugging Scenario



## Step 9: Break the App

```bash
kubectl set image deployment/apache httpd=wrongimage
```

Check:

```bash
kubectl get pods
```



## Step 10: Diagnose

```bash
kubectl describe pod <pod-name>
```

Look for:

* `ImagePullBackOff`
* error messages



## Step 11: Fix It

```bash
kubectl set image deployment/apache httpd=httpd
```

---

# Task: Explore Inside Container (Important Skill)



## Step 12: Exec into Pod

```bash
kubectl exec -it <pod-name> -- /bin/bash
```

Now inside container:

```bash
ls /usr/local/apache2/htdocs
```

This is where web files are stored.

Exit:

```bash
exit
```


---
# Task: Observe Self-Healing



## Step 13: Delete One Pod

```bash
kubectl delete pod <one-pod-name>
```

Watch:

```bash
kubectl get pods -w
```



### Insight

* Deployment recreates pod automatically



# Task: Cleanup

```bash
kubectl delete deployment apache
kubectl delete service apache
```



# What You Learned (Important)

This task is better than nginx because:

* You accessed actual web output
* You explored container filesystem
* You practiced debugging real errors
* You saw scaling + recovery


---
# Optional Next Challenge 

Modify container at runtime:

```bash
kubectl exec -it <pod-name> -- /bin/bash
```

Then:

```bash
echo "Hello from Kubernetes" > /usr/local/apache2/htdocs/index.html
```

Refresh browser.



---
## Why `kubectl port-forward` blocks the terminal

```
kubectl port-forward pod/apache-pod 8081:80
```

This command is **foreground by design**:

* It opens a **live tunnel** between your local machine and the Pod
* It must stay running to keep the connection active
* It continuously streams data (like a server process)

So the terminal looks “stuck”, but it’s actually **actively maintaining the port-forward session**



## Why there is no detached mode

`kubectl port-forward` is meant as a **temporary debugging tool**, not a background service.

Kubernetes expects:

* Short-lived usage
* Manual control (start → debug → stop)

For long-running exposure, Kubernetes provides proper resources:

* `Service` (NodePort / ClusterIP)
* `Ingress`



## Running in background using `&`

```
kubectl port-forward pod/apache-pod 8081:80 &
```

This sends the process to the background.



## How to identify the process

### Method 1: Using jobs (current terminal)

```
jobs
```

Output example:

```
[1]+  Running   kubectl port-forward pod/apache-pod 8081:80 &
```



### Method 2: Using `ps`

```
ps aux | grep port-forward
```

Example output:

```
user   12345  ... kubectl port-forward pod/apache-pod 8081:80
```

Here, `12345` is the **PID (Process ID)**



## How to stop the process

### Method 1: Using job number

```
kill %1
```



### Method 2: Using PID

```
kill 12345
```



### Method 3: Kill all port-forward processes

```
pkill -f port-forward
```



## Better approach (recommended)

Instead of `&`, use:

### Option 1: `tmux`

```
tmux new -s pf
kubectl port-forward pod/apache-pod 8081:80
```

Detach:

```
Ctrl + b, d
```

This is cleaner and easier to manage.



### Option 2: `nohup`

```
nohup kubectl port-forward pod/apache-pod 8081:80 > pf.log 2>&1 &
```
---


## Summary

* `kubectl port-forward` blocks terminal because it runs a **live network tunnel**
* No detached mode because it is meant for **temporary debugging**
* Use `&`, `jobs`, `ps`, and `kill` to manage background processes
* Prefer `tmux` for better control in DevOps workflows


---

# Kubernetes Commands Summary (Apache Web App Lab)

## 1. Run & Basic Pod Management

| Command                                | Purpose      | Simple Explanation                                                                           |
| -------------------------------------- | ------------ | -------------------------------------------------------------------------------------------- |
| `kubectl run apache-pod --image=httpd` | Create a Pod | Runs a single container (Apache server) directly. Quick test, not recommended for production |
| `kubectl get pods`                     | List Pods    | Shows all running Pods in current namespace                                                  |
| `kubectl describe pod apache-pod`      | Inspect Pod  | Detailed info: image, ports, events, errors                                                  |
| `kubectl delete pod apache-pod`        | Delete Pod   | Removes the Pod permanently (no auto-recreation)                                             |



## 2. Access Application

| Command                                       | Purpose                | Simple Explanation                                 |
| --------------------------------------------- | ---------------------- | -------------------------------------------------- |
| `kubectl port-forward pod/apache-pod 8081:80` | Access Pod locally     | Maps local port `8081` → Pod port `80`             |
| `kubectl port-forward service/apache 8082:80` | Access Service locally | Same as above but via Service (better abstraction) |



## 3. Deployment Management (Recommended Approach)

| Command                                                      | Purpose           | Simple Explanation                  |
| ------------------------------------------------------------ | ----------------- | ----------------------------------- |
| `kubectl create deployment apache --image=httpd`             | Create Deployment | Runs managed Pods with self-healing |
| `kubectl get deployments`                                    | List Deployments  | Shows running deployments           |
| `kubectl expose deployment apache --port=80 --type=NodePort` | Create Service    | Exposes app so it can be accessed   |
| `kubectl delete deployment apache`                           | Delete Deployment | Removes deployment and its Pods     |
| `kubectl delete service apache`                              | Delete Service    | Removes access endpoint             |



## 4. Scaling & Load Handling

| Command                                        | Purpose        | Simple Explanation              |
| ---------------------------------------------- | -------------- | ------------------------------- |
| `kubectl scale deployment apache --replicas=2` | Scale app      | Runs multiple Pods for same app |
| `kubectl get pods`                             | Verify scaling | Shows multiple Pods running     |



## 5. Debugging & Troubleshooting

| Command                                                | Purpose                 | Simple Explanation                      |
| ------------------------------------------------------ | ----------------------- | --------------------------------------- |
| `kubectl set image deployment/apache httpd=wrongimage` | Break app intentionally | Simulates failure                       |
| `kubectl get pods`                                     | Check status            | Look for errors like `ImagePullBackOff` |
| `kubectl describe pod <pod-name>`                      | Diagnose issue          | Shows exact error messages              |
| `kubectl set image deployment/apache httpd=httpd`      | Fix issue               | Restores correct image                  |



## 6. Working Inside Containers

| Command                                    | Purpose         | Simple Explanation              |
| ------------------------------------------ | --------------- | ------------------------------- |
| `kubectl exec -it <pod-name> -- /bin/bash` | Enter container | Opens terminal inside container |
| `ls /usr/local/apache2/htdocs`             | View web files  | Shows Apache website files      |
| `exit`                                     | Exit container  | Returns to local terminal       |



## 7. Self-Healing Observation

| Command                         | Purpose        | Simple Explanation          |
| ------------------------------- | -------------- | --------------------------- |
| `kubectl delete pod <pod-name>` | Delete one Pod | Simulate failure            |
| `kubectl get pods -w`           | Watch Pods     | Live view of Pod recreation |



## 8. Background Process Management (Port Forwarding)

| Command                       | Purpose              | Simple Explanation               |
| ----------------------------- | -------------------- | -------------------------------- |
| `kubectl port-forward ... &`  | Run in background    | Prevents terminal blocking       |
| `jobs`                        | List background jobs | Shows running background tasks   |
| `ps aux \| grep port-forward` | Find process         | Get process ID (PID)             |
| `kill %1`                     | Stop job             | Stops using job number           |
| `kill <PID>`                  | Stop process         | Stops using PID                  |
| `pkill -f port-forward`       | Stop all             | Kills all port-forward processes |



## 9. Better Process Handling (DevOps Practice)

| Command             | Purpose                   | Simple Explanation               |
| ------------------- | ------------------------- | -------------------------------- |
| `tmux new -s pf`    | Start session             | Run tasks in detachable terminal |
| `Ctrl + b, d`       | Detach tmux               | Leave process running safely     |
| `nohup <command> &` | Persistent background run | Runs even after terminal closes  |



# Key Beginner Insights

* **Pod vs Deployment**

  * Pod = temporary, no recovery
  * Deployment = production-ready, self-healing

* **Port Forwarding**

  * Only for debugging
  * Not for real exposure

* **Service**

  * Stable access point
  * Required for real applications

* **Scaling**

  * Multiple Pods = better availability

* **Debugging**

  * `describe` is your best friend

