# Multistage Dockerfiles: Explanation & Benefits

## Why Use Multistage Dockerfiles?

Multistage Dockerfiles allow you to use multiple `FROM` statements in a single Dockerfile, where each stage can have its own base image, dependencies, and build tools. The key benefit is that you can separate the build environment from the runtime environment.

## Key Benefits

### 1. **Reduced Image Size**
- Only include runtime dependencies, not build tools
- Eliminate intermediate build artifacts
- Remove source code from final image

### 2. **Improved Build Speed**
- Better use of Docker layer caching
- Parallelizable build stages
- Smaller images = faster push/pull operations

### 3. **Enhanced Security**
- Minimal attack surface (fewer packages)
- No build tools in production
- No source code exposure

### 4. **Clean Separation of Concerns**
- Development environment separate from production
- Consistent build environments
- Reproducible builds

## `scratch` Image
The `scratch` image is an empty base image (0 bytes) - perfect for statically compiled binaries. It contains:
- No shell
- No package manager
- No libraries (you must include all dependencies)

## C Program Example

### Single-stage (Problematic)
```dockerfile
FROM ubuntu:22.04 AS build
RUN apt-get update && apt-get install -y gcc
COPY hello.c .
RUN gcc -static -o hello hello.c

# Problem: Includes entire Ubuntu + gcc in final image
CMD ["./hello"]
```

### Multistage (Optimized)
```dockerfile
# Stage 1: Build
FROM ubuntu:22.04 AS builder
RUN apt-get update && apt-get install -y gcc
COPY hello.c .
RUN gcc -static -o hello hello.c

# Stage 2: Runtime (FROM scratch = minimal)
FROM scratch
COPY --from=builder /hello /hello
CMD ["/hello"]
```

**Result**: Image size reduced from ~150MB to ~1MB!

## Java Program Example

### Single-stage (Problematic)
```dockerfile
FROM maven:3.8-openjdk-11 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Problem: Includes Maven, JDK, and source code
CMD ["java", "-jar", "target/app.jar"]
```

### Multistage (Optimized)
```dockerfile
# Stage 1: Build
FROM maven:3.8-openjdk-11 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM openjdk:11-jre-slim
WORKDIR /app
# Copy only the built JAR, not source code or Maven
COPY --from=builder /app/target/app.jar app.jar

# Security: Run as non-root user
RUN useradd -m myuser
USER myuser

CMD ["java", "-jar", "app.jar"]
```

**Benefits**:
- Final image: ~150MB (vs ~750MB with full JDK/Maven)
- No source code exposure
- No build tools in production
- Non-root user execution

## Advanced: Copying Layers Between Images

### Selective Layer Copying
```dockerfile
# Build specific components in separate stages
FROM node:16 AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM maven:3.8-openjdk-11 AS backend-builder
WORKDIR /app
COPY backend/ .
RUN mvn clean package -DskipTests

# Final image combining both
FROM nginx:alpine AS frontend
COPY --from=frontend-builder /app/build /usr/share/nginx/html

FROM openjdk:11-jre-slim AS backend
COPY --from=backend-builder /app/target/app.jar /app.jar

# Or combine in one image
FROM openjdk:11-jre-slim
COPY --from=frontend-builder /app/build /static
COPY --from=backend-builder /app/target/app.jar /app.jar
```

### Multi-architecture Builds
```dockerfile
# Build for multiple architectures
FROM --platform=$BUILDPLATFORM golang:1.19 AS builder
ARG TARGETARCH
WORKDIR /app
COPY . .
RUN GOARCH=$TARGETARCH go build -o app .

FROM scratch
COPY --from=builder /app/app /app
CMD ["/app"]
```

## Security Best Practices with Multistage

```dockerfile
# Stage 1: Build with all tools
FROM golang:1.19 AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o app .

# Stage 2: Security-hardened runtime
FROM gcr.io/distroless/static-debian11
# OR FROM scratch for maximum security

# Add certificates if needed (for HTTPS)
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# Copy only the binary
COPY --from=builder /app/app /app

# Non-root user
USER 65534:65534  # nobody:nobody

CMD ["/app"]
```

## Real-World Example: Complete Java Microservice

```dockerfile
# Stage 1: Dependency resolution (cached layer)
FROM maven:3.8-openjdk-11 AS deps
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline

# Stage 2: Build with cached dependencies
FROM deps AS builder
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 3: Test (optional)
FROM builder AS tester
RUN mvn test

# Stage 4: Security scan (optional)
FROM aquasec/trivy:latest AS scanner
COPY --from=builder /app/target/app.jar /
RUN trivy filesystem --exit-code 1 --no-progress /

# Stage 5: Production runtime
FROM openjdk:11-jre-slim
WORKDIR /app

# Create non-root user
RUN groupadd -r spring && useradd -r -g spring spring
USER spring:spring

# Copy application
COPY --from=builder /app/target/app.jar app.jar

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Runtime configuration
ENV JAVA_OPTS="-Xmx512m -Xms256m"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

## Performance Comparison

| Aspect | Single-Stage | Multistage |
|--------|-------------|------------|
| **Image Size** | 500MB-1GB | 50-200MB |
| **Build Time** | Slower (rebuilds everything) | Faster (cached stages) |
| **Security** | High risk (full toolchain) | Minimal (runtime only) |
| **Push/Pull** | Slow | Fast |
| **Deployment** | Heavy | Lightweight |

## When to Use Multistage

1. **Production deployments** - Always use multistage
2. **Microservices** - Where small images matter
3. **CI/CD pipelines** - For efficient caching
4. **Multi-architecture builds** - Different build/runtime environments
5. **Security-sensitive applications** - Minimize attack surface

## When NOT to Use Multistage

1. **Development containers** - Need full toolchain
2. **Debugging containers** - Need build tools for investigation
3. **Simple scripts** - When size doesn't matter
4. **Proof of concepts** - When speed of setup is priority

## Tips for Effective Multistage Builds

1. **Name your stages** for clarity: `FROM node AS frontend-builder`
2. **Use `.dockerignore`** to exclude unnecessary files
3. **Order commands wisely** for better caching
4. **Combine related operations** in single RUN commands
5. **Test each stage independently** when debugging
6. **Use ARG for stage communication** when needed

> By using multistage Dockerfiles, you create production-ready images that are secure, fast, and efficient - crucial for modern containerized applications.



---







