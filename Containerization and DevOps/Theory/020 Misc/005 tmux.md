
# tmux: Brief Explanation and Beginner Tutorial

## What is tmux?

`tmux` is a terminal multiplexer. It allows you to run multiple terminal sessions inside a single terminal window.

It introduces three main concepts:

* **Session**: A full workspace
* **Window**: Like a tab inside a session
* **Pane**: Split sections inside a window



## Why tmux is useful in Cloud and DevOps

### 1. Persistent Sessions

When working over SSH, connections may drop. Normally, this stops running processes.

With `tmux`, processes continue running even if you disconnect.

Example:

```
Start deployment → SSH disconnects → reconnect → process still running
```

This is critical for:

* Deployments
* Long builds
* Data processing jobs



### 2. Remote Server Workflow

In cloud environments (AWS, GCP, Azure), you often work on remote machines.

`tmux` allows:

* Detaching from a session
* Reconnecting later
* Continuing work without interruption



### 3. Multitasking in Terminal

You can:

* Split screen into multiple panes
* Run logs in one pane
* Run commands in another
* Edit files in another



### 4. Lightweight and Portable

* Works on any Linux server, VM, or WSL
* No GUI required
* Very low resource usage


---
## Installation

```
sudo apt install tmux
```


---
## Basic Commands

### Start a new session

```
tmux new -s dev
```

* `new`: create session
* `-s dev`: session name



### Detach from session

```
Ctrl + b, then d
```

This keeps everything running in background.



### List sessions

```
tmux ls
```



### Attach to a session

```
tmux attach -t dev
```



## Working Inside tmux

### Split terminal into panes

Vertical split:

```
Ctrl + b, %
```

Horizontal split:

```
Ctrl + b, "
```



### Switch between panes

```
Ctrl + b, o
```



### Create a new window (tab)

```
Ctrl + b, c
```



### Switch windows

```
Ctrl + b, 0 / 1 / 2
```


---
## DevOps Example

### Without tmux

```
ssh server
kubectl apply -f deployment.yaml
```

If SSH disconnects, the process stops.



### With tmux

```
ssh server
tmux new -s deploy
kubectl apply -f deployment.yaml
Ctrl + b, d
```

Reconnect later:

```
ssh server
tmux attach -t deploy
```

The process continues safely.



## Mental Model

```
Session
 ├── Window (tab)
 │    ├── Pane
 │    ├── Pane
 │
 ├── Window
```


---
## When to Use tmux

Use it when you:

* Work on remote servers
* Run long-running commands
* Need multiple terminals in one screen
* Do DevOps or cloud operations



## When Not Necessary

* Simple local tasks
* GUI-based workflows
* Short-lived commands



## Summary

* `tmux` provides persistent terminal sessions
* Prevents loss of work due to disconnections
* Enables efficient terminal multitasking
* Essential for cloud and DevOps workflows

## References
- [https://tmux.info/docs/getting-started](https://tmux.info/docs/getting-started)