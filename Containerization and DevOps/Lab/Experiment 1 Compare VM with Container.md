
## Experiment 1

### Introduction to Docker and Performance Comparison

### (Vagrant + VirtualBox VM vs Docker Container)

---

### Objective

* Deploy a Linux VM using **Vagrant + VirtualBox**
* Run the same workload using **Docker**
* Compare startup time, resource usage, and performance

---

### Requirements

* VirtualBox installed
* Vagrant installed
* Docker installed
* Internet connection

---

## Part A: VM Deployment using Vagrant + VirtualBox

### Vagrant Box Used

```
prateekrajgautam/linuxmint21.2
Version: 0.0.2
```

Box URL:

```
https://portal.cloud.hashicorp.com/vagrant/discover/prateekrajgautam/linuxmint21.2
```

---

### Step 1: Initialize Vagrant Box

#### Option 1: Using `vagrant init`

```bash
vagrant init prateekrajgautam/linuxmint21.2 --box-version 0.0.2
```

---

#### Option 2: Manual `Vagrantfile`

Create or edit `Vagrantfile`:

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "prateekrajgautam/linuxmint21.2"
  config.vm.box_version = "0.0.2"
end
```

---

### Step 2: Start the Virtual Machine

```bash
vagrant up
```

Login:

```bash
vagrant ssh
```

---

### Step 3: Run Sample Application in VM

Inside VM:

```bash
sudo apt update
sudo apt install nginx -y
```

Check service:

```bash
systemctl status nginx
```

Measure boot time (approximate):

```bash
time systemctl start nginx
```

Exit VM:

```bash
exit
```

---

## Part B: Docker Container Deployment

### Step 1: Run NGINX Container

```bash
docker run -d -p 8080:80 nginx
```

Measure startup time:

```bash
time docker run --rm nginx
```

---

### Step 2: Verify Container

```bash
docker ps
```

Access in browser:

```
http://localhost:8080
```

---

## Part C: Performance Comparison

| Metric         | VirtualBox VM (Vagrant) | Docker Container |
| -------------- | ----------------------- | ---------------- |
| OS boot        | ~60–120 seconds         | Not required     |
| App start time | Seconds                 | Milliseconds     |
| RAM usage      | High (Full OS)          | Low              |
| Disk usage     | Several GB              | ~100 MB          |
| Isolation      | Hardware-level          | Process-level    |

---

### Observation

Docker containers provide significantly faster startup and lower resource usage compared to VM-based deployment.

---

### Result

Application deployment using Docker was faster and more resource-efficient than deployment using VirtualBox VM via Vagrant.

---

### Read More (Experiment 1)

* Vagrant Boxes: [https://developer.hashicorp.com/vagrant/docs/boxes](https://developer.hashicorp.com/vagrant/docs/boxes)
* Vagrant + VirtualBox: [https://developer.hashicorp.com/vagrant/docs/providers/virtualbox](https://developer.hashicorp.com/vagrant/docs/providers/virtualbox)
* Linux Mint Docs: [https://linuxmint.com/documentation.php](https://linuxmint.com/documentation.php)
* Docker vs VM: [https://www.docker.com/resources/what-container/](https://www.docker.com/resources/what-container/)
