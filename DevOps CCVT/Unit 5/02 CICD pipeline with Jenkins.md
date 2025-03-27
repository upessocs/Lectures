# Jenkins Pipeline for Building and Deploying a FastAPI Docker Image

### Install

Preferred mode to install [jenkins](https://www.jenkins.io/) is using docker 

[Install instructions](https://github.com/jenkinsci/docker/blob/master/README.md)

[How to create first pipeline (Official Reference)](https://www.jenkins.io/doc/pipeline/tour/hello-world/)


## What Jenkins Needs to Do

Jenkins will perform similar tasks to your GitHub Actions workflow, but with more flexibility and control. For your FastAPI Docker image, Jenkins needs to:

1. Check out your source code from version control (GitHub)
2. Build your Docker image
3. Authenticate with Docker Hub
4. Push the built image to Docker Hub
5. (Optional) Deploy the image to your server
6. (Optional) Run tests

The main differences from GitHub Actions are:
- Jenkins runs on your own infrastructure
- You have more control over the execution environment
- Pipelines are defined in Jenkinsfiles (similar to GitHub Actions YAML but with Groovy syntax)
- You can easily visualize the pipeline stages

## Setting Up Jenkins for Your FastAPI Project

### Prerequisites
- Jenkins server installed (with Docker and Docker Pipeline plugin installed)
- Docker installed on the Jenkins server
- Docker Hub credentials
- Your FastAPI project in a GitHub repository

### Steps to Implement

#### 1. Install Required Jenkins Plugins
- Docker Pipeline
- Git
- Credentials Binding

#### 2. Create a New Pipeline Job
1. Go to Jenkins dashboard
2. Click "New Item"
3. Enter a name (e.g., "fastapi-docker-build")
4. Select "Pipeline" and click OK

#### 3. Configure the Pipeline
1. In the pipeline configuration:
   - Under "Pipeline", select "Pipeline script from SCM"
   - Choose "Git" as SCM
   - Enter your repository URL
   - Specify the branch (e.g., "main")
   - For "Script Path", enter "Jenkinsfile" (this will be in your repo)

#### 4. Create a Jenkinsfile in Your Repository
Create a file named `Jenkinsfile` in your project root with this content:

```groovy
pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        DOCKER_IMAGE = 'your-docker-username/your-fastapi-image'
        DOCKER_TAG = 'latest'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                url: 'https://github.com/your-username/your-fastapi-repo.git'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }
        
        stage('Login to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                // Optional: Add deployment steps here
                // For example, SSH into your server and run the container
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline completed - cleaning up'
            // Clean up Docker images to save space
            sh 'docker system prune -f'
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
```

#### 5. Set Up Docker Hub Credentials in Jenkins
1. Go to Jenkins > Credentials > System > Global credentials
2. Click "Add Credentials"
3. Kind: "Username with password"
4. Scope: "Global"
5. Username: Your Docker Hub username
6. Password: Your Docker Hub password or access token
7. ID: "docker-hub-credentials" (must match what's in Jenkinsfile)
8. Click OK

#### 6. Run the Pipeline
1. Go to your pipeline job in Jenkins
2. Click "Build Now"
3. Monitor the progress in the console output

## Additional Enhancements

You can improve this basic pipeline with:

1. **Version Tagging**: Use Git commit hash or build number as Docker tag
2. **Testing**: Add a stage to run your Python tests
3. **Notifications**: Add email/Slack notifications for build status
4. **Approvals**: Add manual approval before production deployment
5. **Multi-stage**: Different environments (dev, staging, prod)

Example with version tagging:

```groovy
environment {
    DOCKER_IMAGE = 'your-docker-username/your-fastapi-image'
    DOCKER_TAG = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.substring(0, 7)}"
}
```

Jenkins provides more flexibility than GitHub Actions for complex workflows, though it requires more setup and maintenance. The tradeoff is control vs. convenience.