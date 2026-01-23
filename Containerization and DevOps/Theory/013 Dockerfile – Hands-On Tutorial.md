# Dockerfile – Hands-On Tutorial (Automation-First Approach)


## 1. Why exporting changes made inside a container is NOT useful for automation

When you install software and create files **manually inside a running container** and then use `docker commit`, you get a working image — but it is **not suitable for automation**.

### Problems with container-based changes

#### 1. **Not reproducible**
   - No record of *how* Java was installed
   - No way to rebuild the same image automatically

#### 2. **Not version controlled**
   - Changes cannot be reviewed in Git
   - No history of what changed and why

#### 3. **Not deterministic**
   - Manual steps can differ each time
   - Leads to "works on my machine" issues

#### 4. **Not CI/CD friendly**
   - CI systems cannot replay interactive shell commands
   - Automation requires declarative instructions

#### 5. **Poor maintenance**
   - Updating Java version requires repeating everything manually
   - No clear dependency documentation

### Conclusion
For **learning and debugging**, `docker commit` is acceptable.  
For **automation, CI/CD, production, and team usage**, it is the **wrong approach**.

> This is why **Dockerfile exists**.

---

## 2. What is a Dockerfile

A **Dockerfile** is a **text file** containing **step-by-step instructions** to build a Docker image.

Key properties:
- Declarative
- Reproducible
- Version controllable
- Automatable
- Deterministic

---

## 3. Dockerfile Keywords (Core Instructions)

### FROM
Specifies the base image.

```dockerfile
FROM ubuntu:22.04
````

Rules:

* Must be the first instruction
* Defines OS / runtime environment

---

### RUN

Executes commands at build time.

```dockerfile
RUN apt update && apt install -y openjdk-17-jdk
```

Used for:

* Installing packages
* Configuring system

---

### WORKDIR

Sets working directory inside the image.

```dockerfile
WORKDIR /home/app
```

* Creates directory if it does not exist
* Replaces `cd`

---

### COPY

Copies files from host to image.

```dockerfile
COPY Hello.java .
```

---

### ADD

Similar to COPY but with extra features.

```dockerfile
ADD app.tar /home/app
```

Rarely used. Prefer COPY.

---

### ENV

Sets environment variables.

```dockerfile
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

---

### EXPOSE

Documents container listening port.

```dockerfile
EXPOSE 8080
```

* Does NOT publish the port
* Used for documentation and tooling

---

### CMD

Default command when container starts.

```dockerfile
CMD ["java", "Hello"]
```

* Can be overridden at runtime

---

### ENTRYPOINT

Defines fixed executable.

```dockerfile
ENTRYPOINT ["java"]
```

Often combined with CMD.

---

## 4. Hands-On: Build Java App Using Dockerfile

### Step 1: Project Structure (Host Machine)

```text
java-docker/
├── Dockerfile
└── Hello.java
```

---

### Step 2: Java Program (Hello.java)

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello from Dockerfile automation");
    }
}
```

---

### Step 3: Dockerfile (Automation-Friendly)

```dockerfile
FROM ubuntu:22.04

RUN apt update && apt install -y openjdk-17-jdk

WORKDIR /home/app

COPY Hello.java .

RUN javac Hello.java

CMD ["java", "Hello"]
```

---

## 5. Build Image from Dockerfile

From the project directory:

```bash
docker build -t java-app:1.0 .
```

Explanation:

* `-t` → image name and tag
* `.` → build context (current directory)
* `-f` → specify alternative dockerfile like `test.Dockerfile` 
Verify:

```bash
docker images
```

---

## 6. Run Container from Built Image

```bash
docker run java-app:1.0
```

Output:

```text
Hello from Dockerfile automation
```

---

## 7. Override CMD at Runtime

```bash
docker run -it java-app:1.0 bash
```

CMD replaced by `bash`.

---

## 8. Layered Build Concept (Important)

Each Dockerfile instruction creates a **layer**:

```text
FROM ubuntu
RUN install java
WORKDIR /home/app
COPY Hello.java
RUN javac Hello.java
CMD java Hello
```

Benefits:

* Faster rebuilds (layer caching)
* Smaller downloads
* Better debugging

---

## 9. Rebuild After Code Change

Modify `Hello.java`, then:

```bash
docker build -t java-app:1.1 .
```

Only layers after `COPY` are rebuilt.

---

## 10. Share Dockerfile-Based Image

### Push to registry

```bash
docker tag java-app:1.0 username/java-app:1.0
docker push username/java-app:1.0
```

### Pull anywhere

```bash
docker pull username/java-app:1.0
docker run username/java-app:1.0
```

---

## 11. Dockerfile vs docker commit (Exam Ready)

| Aspect          | Dockerfile | docker commit |
| --------------- | ---------- | ------------- |
| Automation      | Yes        | No            |
| Version control | Yes        | No            |
| CI/CD           | Yes        | No            |
| Reproducible    | Yes        | No            |
| Production use  | Yes        | No            |

---

## 12. Key Takeaway

If it cannot be rebuilt automatically, it does not scale.

**Dockerfile = Infrastructure as Code**



