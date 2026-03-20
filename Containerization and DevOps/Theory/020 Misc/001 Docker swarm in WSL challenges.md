
# Docker Swarm on WSL over Mobile Hotspot 

## 1. The Core Challenge

When using **WSL**, your system actually has **two different network layers**:

```text
[ Ubuntu (WSL) ]  →  172.20.x.x   (virtual NAT network)
        ↓
[ Windows Host ] →  10.96.85.32   (real hotspot network)
        ↓
[ Other devices ] → Ubuntu (another machine)
```

### Problem:

* Other machines (Ubuntu node) can **only see Windows IP**
* But Docker inside WSL **only knows WSL IP**

So:

```text
WSL IP (172.x.x.x) → NOT reachable from network
Windows IP (10.x.x.x) → NOT owned by Docker inside WSL
```





## 2. Try

```bash
docker swarm init \
  --advertise-addr 10.96.85.32 \
  --listen-addr 172.20.5.12:2377
```

explicitly solving **two different networking responsibilities**.





## 3. Difference: advertise vs listen

### `--listen-addr` (Where Docker actually runs)

```text
172.20.5.12:2377
```

* This is **inside WSL**
* Docker daemon binds here
* Must be a **real interface on the system**

Think:

```text
“Where should I open my server socket?”
```





### `--advertise-addr` (What others should use)

```text
10.96.85.32
```

* This is **visible to other machines**
* Used in `docker swarm join` command
* Must be reachable from worker nodes

Think:

```text
“What address should I tell others to connect to?”
```





## 4. Why this split is needed (WSL-specific)

In a normal Linux machine:

```text
Same IP is used for both:
listen = advertise = 192.168.x.x
```

But in WSL:

| Role                    | IP         |
| ----------------------- | ---------- |
| Internal (Docker sees)  | 172.20.x.x |
| External (network sees) | 10.96.x.x  |

So you must split them.



---

## 5. Additional Hidden Challenge: NAT

WSL uses **NAT (Network Address Translation)**

That means:

* Incoming traffic to Windows IP
* Does NOT automatically reach WSL

So even after correct init:

```text
Worker → 10.96.85.32 → ❌ stuck at Windows
```





## 6. Required Fix: Port Forwarding

You must forward traffic:

```text
Windows:2377 → WSL:2377
```

Using:

```powershell
netsh interface portproxy add v4tov4 \
 listenport=2377 listenaddress=0.0.0.0 \
 connectport=2377 connectaddress=172.20.5.12
```





## 7. Mobile Hotspot Specific Issues

Mobile hotspots often introduce extra problems:

### 1. Client Isolation

* Devices cannot talk to each other
* Fix: disable isolation in hotspot settings





### 2. Changing IP

* Hotspot IP (10.96.x.x) may change on reconnect
* Swarm may break → need re-init





### 3. Firewall Restrictions

* Windows blocks incoming ports by default
* Must allow:

  * 2377 (Swarm)
  * 7946 (node communication)
  * 4789 (overlay network)





## 8. Full Flow (Conceptual)

```text
[ Worker Node ]
        ↓ connect to
10.96.85.32:2377   (advertised address)
        ↓
[ Windows Host ]
        ↓ port forward
172.20.5.12:2377   (WSL listen address)
        ↓
[ Docker Swarm Manager (WSL) ]
```





## 9. Key Takeaways

```text
1. WSL is NOT a real network host (it’s NATed)
2. Docker needs a real interface to bind → listen-addr
3. Other nodes need reachable IP → advertise-addr
4. Windows acts as a bridge → requires port forwarding
```





## 10. One-line Summary

```text
listen-addr = where Docker runs
advertise-addr = how others find it
```

