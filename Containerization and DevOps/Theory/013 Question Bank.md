# Question Bank

---
# UNIT I — Introduction to Containerization and DevOps

## Part A — Theory and Analytical Questions

1. A startup currently uses virtual machines for all deployments and faces resource wastage and slow provisioning. Recommend whether they should migrate to containers, virtualization, or a hybrid model. Justify your answer.

2. Compare monolithic, SOA, and microservices architectures for:

   * banking systems
   * e-commerce systems
   * IoT platforms

3. A company wants to adopt serverless architecture but already uses Docker heavily. Explain how serverless and container-based architectures can coexist.

4. Analyze the role of Docker in DevOps pipelines compared to traditional deployment approaches.

5. Explain why Docker is “not a virtual machine” using architecture diagrams and execution flow.

6. Compare Docker CE and Docker EE for:

   * startups
   * enterprise banking
   * regulated industries

7. Explain how BuildKit improves modern container image creation.



## Part B — Practical / Coding / Design Questions

1. Install Docker on Linux/Windows and document:

   * installation steps
   * verification commands
   * troubleshooting issues

2. Create a comparison table between:

   * VirtualBox VM
   * Docker container
   * Kubernetes Pod

3. Design container architecture for:

   * video streaming platform
   * food delivery application
   * online examination portal

4. Demonstrate Docker architecture by identifying:

   * Docker daemon
   * Docker host
   * Docker Hub
   * Docker CLI
   * Docker API

5. Build a simple microservice-based application using containers for:

   * frontend
   * backend
   * database

---

# UNIT II — Docker Fundamentals

## Part A — Theory and Scenario-Based Questions

1. A telecom company needs ultra-low-latency networking between containers. Recommend suitable Docker networking drivers with justification.

2. Compare bind mounts, volumes, and tmpfs mounts for:

   * databases
   * temporary caches
   * production deployments

3. A development team faces inconsistent builds across environments. Explain how Docker images and layers solve this issue.

4. Explain tagging strategies suitable for:

   * production systems
   * CI/CD pipelines
   * rolling updates

5. Analyze the security implications of exposing Docker daemon ports.

6. Compare default bridge networks and user-defined bridge networks with deployment scenarios.

7. Explain how Docker can be used as a build environment in CI/CD systems.



## Part B — Practical / Coding / CLI Questions

1. Build and run an NGINX container with:

   * custom ports
   * mounted volumes
   * environment variables

2. Create a Dockerfile for:

   * Python Flask application
   * Node.js application
   * FastAPI application

3. Demonstrate:

   * image tagging
   * pushing to Docker Hub
   * pulling specific versions

4. Create and manage:

   * bridge network
   * host network
   * overlay network

5. Configure persistent database storage using Docker volumes.

6. Build a multi-container application using Docker Compose.

7. Create GitHub Actions workflow for automatic Docker image build and deployment.

---

# UNIT III — Automation and Orchestration

## Part A — Theory, Comparative and Case-Based Questions

1. A company running 500 microservices wants automated scaling and failover. Compare Kubernetes, Docker Swarm, and Apache Mesos.

2. Design Kubernetes architecture for a scalable e-commerce platform with:

   * load balancing
   * persistent storage
   * fault tolerance
   * rolling updates

3. Compare ECS and EKS for:

   * startup environments
   * enterprise cloud deployments
   * hybrid cloud systems

4. Explain why orchestration becomes necessary in large-scale container deployments.

5. Analyze Kubernetes control plane architecture and node communication mechanisms.

6. Compare StatefulSets, Deployments, DaemonSets, and Jobs with real-world use cases.

7. Explain Kubernetes networking model and service discovery mechanisms.

8. Explain Kubernetes RBAC and security policies for enterprise deployments.



## Part B — Practical / YAML / CLI Questions

1. Create Docker Swarm cluster with:

   * manager node
   * worker nodes
   * replicated services

2. Deploy scalable web application using Docker Swarm.

3. Write Kubernetes YAML files for:

   * Pod
   * Deployment
   * Service
   * ConfigMap
   * Secret

4. Configure Kubernetes persistent volumes and persistent volume claims.

5. Deploy application with:

   * rolling updates
   * rollback strategy
   * autoscaling

6. Demonstrate:

   * kubectl commands
   * node inspection
   * service exposure
   * logs monitoring

7. Build Kubernetes deployment for:

   * online shopping system
   * learning management system
   * banking portal

---

# UNIT IV — DevOps Principles and Practices

## Part A — Theory and Analytical Questions

1. Analyze how Deming, Lean Manufacturing, and Kaizen influenced modern DevOps culture.

2. A cloud-native application experiences frequent outages. Design a DevOps resilience strategy using automation and failover mechanisms.

3. Compare traditional software delivery lifecycle and DevOps lifecycle.

4. Explain how continuous feedback improves product quality in DevOps systems.

5. Evaluate DevOps adoption challenges in:

   * government organizations
   * startups
   * healthcare systems

6. Explain cloud resiliency and DevOps resiliency with examples.

7. Design monitoring and recovery workflow for a production microservices application.


## Part B — Practical / Applied Questions

1. Design CI/CD workflow for:

   * fintech application
   * healthcare platform
   * IoT monitoring system

2. Create incident response plan for containerized infrastructure.

3. Build resilience architecture diagram for highly available cloud system.

4. Prepare workflow showing:

   * monitoring
   * alerting
   * failover
   * recovery

5. Analyze failure scenarios and suggest DevOps automation solutions.

---

# UNIT V — DevOps Adoption and Business Patterns

## Part A — Theory, Business and Comparative Questions

1. Compare Agile, DevOps, and SRE using software delivery scenarios.

2. A company struggles with collaboration between development and operations teams. Design DevOps adoption strategy.

3. Compare Continuous Integration, Continuous Delivery, and Continuous Deployment using real deployment examples.

4. Analyze role of Kanban in DevOps workflow optimization.

5. Compare platform teams and application teams in cloud-native organizations.

6. Explain how DevSecOps integrates security into CI/CD pipelines.

7. Evaluate challenges in DevOps adoption for large enterprises.

8. Design DevOps toolchain for:

   * fintech company
   * SaaS startup
   * educational platform



## Part B — Practical / Workflow Questions

1. Create Kanban board for software development lifecycle.

2. Design release management workflow with feedback loops.

3. Prepare architecture for:

   * blue-green deployment
   * canary deployment
   * rolling deployment

4. Build DevSecOps workflow integrating:

   * code scanning
   * dependency scanning
   * container scanning

5. Create GitOps workflow using GitHub and Kubernetes.

---

# UNIT VI — DevOps Tools

## Part A — Theory and Comparative Questions

1. Compare GitHub Actions, Jenkins, and TravisCI for enterprise CI/CD.

2. Analyze advantages and limitations of Infrastructure as Code.

3. Compare Terraform and Ansible using infrastructure provisioning scenarios.

4. Explain observability using Prometheus and ELK stack.

5. Compare GitHub, GitLab, and BitBucket for collaborative development.

6. Explain webhook-driven automation in DevOps pipelines.

7. Design monitoring architecture for distributed microservices platform.

8. Explain SCM integration in Jenkins pipelines.


## Part B — Practical / Tool-Based Questions

1. Create Jenkins pipeline for:

   * build
   * testing
   * Docker image creation
   * deployment

2. Configure GitHub Actions workflow for automated CI/CD.

3. Create Terraform scripts for cloud infrastructure provisioning.

4. Write Ansible playbook for automated server configuration.

5. Configure:

   * Prometheus monitoring
   * Grafana dashboards
   * ELK logging pipeline

6. Demonstrate:

   * branching
   * pull requests
   * GitHub packages
   * webhooks

7. Integrate Slack or Microsoft Teams notifications into CI/CD workflow.

8. Build complete DevOps pipeline for containerized application deployment.

