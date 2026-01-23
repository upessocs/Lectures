# How to preserve changes made inside a container

> Install Java compiler, create Java app in `/home/app`**), and then **export it for reuse and sharing**.


1. **Commit container → Image** (most common for learning/labs)
2. **Export / Import vs Save / Load** (important difference)

---

# Scenario Overview

You will:

* Start an Ubuntu container
* Install Java (javac)
* Create a Java program at `/home/app`
* Convert the modified container into an image
* Reuse & share that image

---

## 1. Run Base Ubuntu Container

```bash
docker run -it --name java_lab ubuntu:22.04 bash
```

Now you are **inside the container**.

---

## 2. Install Java Compiler (Inside Container)

```bash
apt update
apt install -y openjdk-17-jdk
```

Verify:

```bash
javac --version
```

---

## 3. Create Java App in `/home/app`

```bash
mkdir -p /home/app
cd /home/app
```

Create Java file:

```bash
nano Hello.java
```

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello from Docker container!");
    }
}
```

Compile and run:

```bash
javac Hello.java
java Hello
```

Your container now has:

* Java installed
* Source + compiled class in `/home/app`

---

## 4. Exit Container (Changes Persist in Stopped Container)

```bash
exit
```

Container **stops**, but changes remain.

---

## 5. Convert Container → Image (docker commit)

This is the **key step**.

```bash
docker commit java_lab myrepo/java-app:1.0
```

What happened:

* Container filesystem snapshot taken
* New reusable image created

Verify:

```bash
docker images
```

---

## 6. Reuse the Exported Image (Locally)

### Run new container from saved image

```bash
docker run -it myrepo/java-app:1.0 bash
```

Test:

```bash
cd /home/app
java Hello
```

Java and program already exist.

---

## 7. Save / Load (Offline Transfer)

### Save image to file

```bash
docker save -o java-app.tar myrepo/java-app:1.0
```

Transfer `java-app.tar` via USB / SCP.

### Load image

```bash
docker load -i java-app.tar
```

Now image is available:

```bash
docker images
```

---

## Important: Export vs Save (Very Common Confusion)

### docker export

```bash
docker export java_lab > container.tar
```

* Exports **filesystem only**
* Loses:

  * Image name
  * Layers
  * CMD / ENTRYPOINT
  * Metadata

### docker save (Recommended)

```bash
docker save -o image.tar myrepo/java-app:1.0
```

| Command                | Use case           |
| ---------------------- | ------------------ |
| `docker commit`        | Container → Image  |
| `docker save`          | Image → File       |
| `docker load`          | File → Image       |
| `docker push/pull`     | Registry sharing   |
| `docker export/import` | Raw FS only (rare) |


## Best Practice Note (Important we will discuss this later)

For **real projects**, prefer **Dockerfile**:

```dockerfile
FROM ubuntu:22.04
RUN apt update && apt install -y openjdk-17-jdk
WORKDIR /home/app
COPY Hello.java .
RUN javac Hello.java
CMD ["java", "Hello"]
```

Build:

```bash
docker build -t java-app:2.0 .
```

But for **learning, labs, debugging**, `docker commit` is perfectly valid.

---

## 11. One-Line Summary

* **Modified container → `docker commit`**
* **Reuse locally → `docker run`**
* **Share online → `docker push/pull`**
* **Share offline → `docker save/load`**

