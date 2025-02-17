# Create Docker image of fastapi api server using github actions

## podman install steps

install `podman-cli` from [https://podman.io/](https://podman.io/)

then execute
```bash
podman machine init
podman machine start

alias docker=podman

docker --version
```# fastapi-dockerize

### python server
`main.py`
```python
from fastapi import FastAPI
app = FastAPI()
import uvicorn

@app.get("/")
def read_root():
    return dict(name = "Prateek", Location = "Deheradun")

@app.get("/{data}")
def read_root(data):
    return dict(hi = data, Location = "Deheradun")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=80, reload=True)
```

### python requirements 
`requirements.txt`
```txt
fastapi
uvicorn
```

### Dockerfile for image building/containerization of app
`Dockerfile`
```Dockerfile
FROM ubuntu

RUN apt update -y
RUN apt install python3 python3-pip pipenv -y

WORKDIR /app
COPY . /app/
RUN pipenv install -r requirements.txt

EXPOSE 80


# CMD pipenv run uvicorn main:app --host 0.0.0.0 --port 80
CMD pipenv run python3 ./main.py
```

### Github Actions for docker image creation 
`.github/workflows/DockerBuild.yml`
```yml
name: Docker image build

on: push
    


jobs:
    build:

        runs-on: ubuntu-latest

        steps: 
            - uses: actions/checkout@v1
            - name: Build & Push Image
              run: |
                echo ${{ secrets.DOCKERTOKEN }} | docker login -u "prateekrajgautam" --password-stdin
                docker build -t prateekrajgautam/upesmajorproject:v0.1 .
                docker push prateekrajgautam/upesmajorproject:v0.1

```


---
# docker token
To generate a token for a **Docker registry**, follow these steps based on your specific registry type:


### **1. Docker Hub (Public Registry)**
Docker Hub uses **Personal Access Tokens (PATs)** instead of passwords for authentication.

#### **Steps:**
1. **Go to Docker Hub**: [https://hub.docker.com/](https://hub.docker.com/)
2. **Sign in** with your Docker account.
3. Click on your **profile** (top-right corner) → **Account Settings**.
4. Navigate to **Security** → **Access Tokens**.
5. Click **Generate Token**.
6. Give it a **name**, set the **permissions**, and click **Generate**.
7. Copy the **token** (it will not be shown again).

#### **Use the Token for Login:**
```sh
docker login -u <your-docker-username> --password-stdin
```
Then, enter the **token** when prompted.

---

### **2. Private Docker Registry (Self-Hosted)**
If you're using a self-hosted **Docker Registry (Harbor, JFrog, Nexus, etc.)**, the steps depend on the platform.

#### **Generic Token Generation via HTTP API**
For a private Docker registry, you can get a token using basic authentication:

```sh
curl -u <username>:<password> https://<your-registry>/v2/token
```

#### **Harbor Registry**
1. Log in to **Harbor Web UI**.
2. Go to **User Profile** → **Robot Accounts** (or API Tokens).
3. Generate a **new token**.
4. Use it to log in:
   ```sh
   docker login <harbor-registry-url> -u robot$<username> --password <token>
   ```

#### **AWS Elastic Container Registry (ECR)**
For AWS ECR, generate a token using AWS CLI:
```sh
aws ecr get-login-password --region <your-region> | docker login --username AWS --password-stdin <aws-account-id>.dkr.ecr.<region>.amazonaws.com
```

#### **Google Container Registry (GCR)**
Authenticate using:
```sh
gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin https://gcr.io
```

#### **Azure Container Registry (ACR)**
Authenticate using Azure CLI:
```sh
az acr login --name <registry-name>
```

