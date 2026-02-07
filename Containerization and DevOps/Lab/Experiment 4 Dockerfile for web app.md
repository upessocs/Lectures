# **Experiment 4: Dockerfile for web app containerization**

## **Part 1: Flask Application**

### **Lab 1: Basic Flask Web App Structure**

#### **Step 1: Create Flask Application Files**
```bash
# Create project folder
mkdir flask-lab
cd flask-lab

# Create app file
touch app.py
touch requirements.txt
```

#### **Step 2: Flask Application Code**

**`app.py`:**
```python
from flask import Flask

# Create Flask app
app = Flask(__name__)

# Define a route
@app.route('/')
def hello():
    return "Hello from Flask App!"

# Health check route
@app.route('/health')
def health():
    return "OK"

# Run the app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

**`requirements.txt`:**
```
Flask==2.3.3
```

#### **Step 3: Run Flask App Normally (Without Docker)**
```bash
# Install Flask
pip install Flask

# Run the application
python app.py

# In another terminal, test it:
curl http://localhost:5000
# Output: Hello from Flask App!
```

---

### **Lab 2: Run Flask App with Docker (Manual Method)**

#### **Step 1: Start with Python Base Image**
```bash
# Download Python base image
docker pull python:3.9-slim

# Run interactive container
docker run -it --name flask-container python:3.9-slim /bin/bash
```

#### **Step 2: Inside Container - Manual Setup**
```bash
# Inside container terminal:
# 1. Install Flask
pip install Flask

# 2. Create app directory
mkdir /app
cd /app

# 3. Create app.py (copy your code manually)
echo "from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello from Flask in Docker!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)" > app.py

# 4. Run the app
python app.py

# 5. Press Ctrl+P then Ctrl+Q to detach
```

#### **Step 3: Save Container as Image**
```bash
# Open new terminal (outside container)
# Commit container to image
docker commit flask-container my-flask-app:v1

# Stop and remove container
docker stop flask-container
docker rm flask-container
```

#### **Step 4: Run from Saved Image**
```bash
# Run container from your image
docker run -d --name my-flask -p 5000:5000 my-flask-app:v1 python /app/app.py

# Test the app
curl http://localhost:5000
# Output: Hello from Flask in Docker!
```

**What Happened:**
1. We created a container manually
2. Installed dependencies inside
3. Created application files
4. Saved as reusable image
5. Ran container from that image

---

### **Lab 3: Flask App with Dockerfile (Better Method)**

#### **Step 1: Create Project Structure**
```bash
flask-docker-project/
├── app.py
├── requirements.txt
└── Dockerfile
```

#### **Step 2: Create Dockerfile**

**`Dockerfile` (Create this file):**
```dockerfile
# STEP 1: Choose base image
FROM python:3.9-slim

# STEP 2: Set working directory inside container
WORKDIR /app

# STEP 3: Copy requirements file
COPY requirements.txt .

# STEP 4: Install dependencies
RUN pip install -r requirements.txt

# STEP 5: Copy application code
COPY app.py .

# STEP 6: Expose port
EXPOSE 5000

# STEP 7: Command to run app
CMD ["python", "app.py"]
```

#### **Step 3: Build Docker Image**
```bash
# Build image from Dockerfile
docker build -t flask-app:latest .

# Check image created
docker images
```

**Command Breakdown:**
- `docker build`: Build command
- `-t flask-app:latest`: Tag/name the image
- `.`: Use current directory (where Dockerfile is)

#### **Step 4: Run Container**
```bash
# Run container from image
docker run -d --name flask-container -p 5000:5000 flask-app:latest

# Test
curl http://localhost:5000
```

#### **Step 5: Manage Container**
```bash
# See running containers
docker ps

# View logs
docker logs flask-container

# Stop container
docker stop flask-container

# Start again
docker start flask-container

# Remove container
docker rm flask-container
```

---

## **Part 2: Node.js Application**

### **Lab 1: Basic Node.js Web App Structure**

#### **Step 1: Create Node.js Application Files**
```bash
# Create project folder
mkdir node-lab
cd node-lab

# Create app file
touch app.js
touch package.json
```

#### **Step 2: Node.js Application Code**

**`app.js`:**
```javascript
const express = require('express');
const app = express();
const port = 3000;

// Define a route
app.get('/', (req, res) => {
    res.send('Hello from Node.js App!');
});

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

**`package.json`:**
```json
{
  "name": "node-app",
  "version": "1.0.0",
  "main": "app.js",
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

#### **Step 3: Run Node App Normally (Without Docker)**
```bash
# Install dependencies
npm install

# Run the application
node app.js

# In another terminal, test:
curl http://localhost:3000
# Output: Hello from Node.js App!
```

---

### **Lab 2: Run Node.js App with Docker (Manual Method)**

#### **Step 1: Start with Node Base Image**
```bash
# Download Node base image
docker pull node:18-alpine

# Run interactive container
docker run -it --name node-container node:18-alpine /bin/sh
```

#### **Step 2: Inside Container - Manual Setup**
```bash
# Inside container terminal:
# 1. Create app directory
mkdir /app
cd /app

# 2. Initialize npm
npm init -y

# 3. Install Express
npm install express

# 4. Create app.js (copy your code manually)
echo "const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello from Node in Docker!');
});

app.listen(port, () => {
    console.log('Server running');
});" > app.js

# 5. Run the app
node app.js

# 6. Press Ctrl+P then Ctrl+Q to detach
```

#### **Step 3: Save Container as Image**
```bash
# In new terminal
docker commit node-container my-node-app:v1

# Clean up
docker stop node-container
docker rm node-container
```

#### **Step 4: Run from Saved Image**
```bash
# Run container from your image
docker run -d --name my-node -p 3000:3000 my-node-app:v1 node /app/app.js

# Test
curl http://localhost:3000
# Output: Hello from Node in Docker!
```

---

### **Lab 3: Node.js App with Dockerfile (Better Method)**

#### **Step 1: Create Project Structure**
```bash
node-docker-project/
├── app.js
├── package.json
└── Dockerfile
```

#### **Step 2: Create Dockerfile**

**`Dockerfile`:**
```dockerfile
# STEP 1: Choose base image
FROM node:18-alpine

# STEP 2: Set working directory
WORKDIR /app

# STEP 3: Copy package files
COPY package*.json ./

# STEP 4: Install dependencies
RUN npm install

# STEP 5: Copy application code
COPY app.js .

# STEP 6: Expose port
EXPOSE 3000

# STEP 7: Command to run app
CMD ["node", "app.js"]
```

#### **Step 3: Build and Run**
```bash
# Build image
docker build -t node-app:latest .

# Run container
docker run -d --name node-container -p 3000:3000 node-app:latest

# Test
curl http://localhost:3000
```

---

## **Comparison: Manual vs Dockerfile Approach**

### **Manual Method (Learning Purpose)**
```bash
# Pros: Good for understanding
# Cons: Not repeatable, time-consuming

docker run -it BASE_IMAGE
# Do everything manually inside
# Install dependencies
# Create files
# Save as image
```

### **Dockerfile Method (Real Projects)**
```bash
# Pros: Repeatable, automated, version-controlled
# Cons: Need to write Dockerfile

# 1. Write Dockerfile
# 2. Build image: docker build -t myapp .
# 3. Run container: docker run -p PORT:PORT myapp
```

---

## **Common Docker Commands Cheatsheet**

| Command | Purpose | Example |
|---------|---------|---------|
| `docker build` | Create image from Dockerfile | `docker build -t myapp .` |
| `docker run` | Run container from image | `docker run -p 3000:3000 myapp` |
| `docker ps` | List running containers | `docker ps` |
| `docker stop` | Stop container | `docker stop container-name` |
| `docker rm` | Remove container | `docker rm container-name` |
| `docker images` | List images | `docker images` |
| `docker rmi` | Remove image | `docker rmi image-name` |
| `docker logs` | View container logs | `docker logs container-name` |

---

## **Quick Practice Exercise**

### **Task 1: Modify Flask App**
1. Add new route `/about` that returns "About Page"
2. Update Dockerfile to install additional package `requests`
3. Rebuild and test

### **Task 2: Modify Node.js App**
1. Add new route `/api/data` that returns JSON
2. Change port to 8080 in both app.js and Dockerfile
3. Rebuild and test

### **Solution Hints:**
```bash
# For Flask:
# In requirements.txt add: requests==2.31.0
# Rebuild: docker build -t flask-app:v2 .
# Run: docker run -p 5000:5000 flask-app:v2

# For Node.js:
# In Dockerfile change: EXPOSE 8080
# Rebuild: docker build -t node-app:v2 .
# Run: docker run -p 8080:8080 node-app:v2
```

---

## **Key Takeaways**

1. **Dockerfile automates** what you do manually in container
2. **Three-step process** for any app:
   - Write Dockerfile
   - Build image: `docker build -t name .`
   - Run container: `docker run -p PORT:PORT name`
3. **Port mapping** is crucial: `-p HOST_PORT:CONTAINER_PORT`
4. **Always use** Dockerfile for real projects - it's repeatable and shareable

---

## **Cleanup**
```bash
# Stop and remove all containers
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

# Remove all images
docker rmi $(docker images -q)

# Remove unused data
docker system prune -a
```