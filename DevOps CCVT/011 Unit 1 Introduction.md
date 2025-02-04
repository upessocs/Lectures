# Unit 1: Introduction to DevOps


## Definition of DevOps

### **1. Challenges of Traditional IT Systems & Processes**

#### **Silos Between Development and Operations**  
- Traditional IT environments often separate teams into silos, such as development, operations, and Quality Assurance (QA).  
- Developers focus on writing code, while operations teams handle deployments and infrastructure.  
- Lack of communication leads to delays, misunderstandings, and a "blame game" when things go wrong.

#### **Manual Deployment Processes**  
- Deployment tasks, such as code integration, testing, and release, are often performed manually.  
- These processes are prone to human error, inconsistencies, and take significant time.  
- Issues often arise only after code reaches production, causing costly rollbacks.

#### **Difficulty in Scaling and Delays in Delivery**  
- As applications grow in complexity, scaling infrastructure and processes becomes challenging.  
- Manual testing and deployment cannot keep up with fast-changing requirements.  
- Delays in delivering new features or updates frustrate end-users and affect business goals.

---

### **2. History and Emergence of DevOps**

#### **Waterfall → Agile → DevOps**  
1. **Waterfall Model**:  
- A linear, sequential approach to software development.  
- Each phase (requirements, design, implementation, testing) must be completed before moving to the next.  
- Slow and rigid, unsuitable for rapidly changing requirements.  

1. **Agile Methodology**:  
- Introduced iterative development, focusing on delivering smaller, functional components.  
- Encouraged collaboration between teams, but still lacked integration with operations.  

1. **Emergence of DevOps**:  
- Evolved to bridge the gap between Agile's iterative development and the need for faster, reliable deployments.  
- Combines development, operations, and QA into a single workflow.  

#### **Why DevOps Emerged**  
- Businesses needed to release software faster without compromising quality.  
- Cloud computing, containerization, and microservices highlighted the need for more integrated processes.  
- DevOps addresses challenges like downtime, deployment failures, and inefficiency by fostering collaboration and automation.

---

### **3. Definition of DevOps**

#### **What is DevOps?**  
- DevOps is a **set of practices, tools, and cultural philosophies** that integrate development, operations, and QA to deliver applications and services faster and more reliably.  
- It focuses on automating and improving processes across the software development lifecycle (SDLC).  

#### **Core Goals**  
- **Reduce Time-to-Market**: Accelerate the delivery of new features and bug fixes.  
- **Increase Reliability**: Ensure deployments are consistent and error-free.  
- **Enhance Collaboration**: Break down silos between teams.  

---

### **4. Principles Governing DevOps**

1. **Collaboration and Communication**:  
- Foster a culture where developers, operations, and QA work together seamlessly.  
- Tools like Slack and Microsoft Teams help enhance communication.  

2. **Automation**:  
- Automate repetitive tasks, such as testing, deployment, and monitoring.  
- Use tools like Jenkins, Ansible, and Docker for CI/CD pipelines and infrastructure automation.  

3. **Continuous Improvement**:  
- Use feedback loops to identify areas for improvement in processes and tools.  
- Adopt incremental changes instead of large-scale overhauls.  

4. **Monitoring and Feedback**:  
- Continuously monitor applications and infrastructure to identify issues proactively.  
- Use tools like Prometheus, Grafana, and ELK Stack for real-time insights.  

---

### **Summary**  
- **Challenges of Traditional IT Systems**: Silos, manual processes, and scalability issues.  
- **History of DevOps**: Evolved from Waterfall → Agile → DevOps to address business needs for faster, reliable deployments.  
- **Definition**: DevOps integrates development, operations, and QA with a focus on automation, collaboration, and continuous improvement.  
- **Principles**: Collaboration, automation, continuous improvement, and monitoring form the foundation of DevOps.  












---
## **DevOps and Agile**

### **1. Relationship Between DevOps and Agile**

#### **What is Agile?**  
- **Agile** is a methodology for software development that focuses on:  
1. **Iterative development**: Breaking projects into smaller, manageable increments (sprints).  
1. **Flexibility**: Adapting to changing customer requirements.  
1. **Collaboration**: Promoting teamwork and communication between stakeholders and developers.  
1. **Rapid delivery**: Delivering functional components frequently, often every 2-4 weeks.  

#### **What is DevOps?**  
- DevOps extends Agile principles beyond development to include **operations** and **infrastructure**.  
- It focuses on **automating**, **monitoring**, and **improving** the entire software delivery lifecycle (SDLC), from development to production.  

#### **How They Work Together**  
- **Agile focuses on development cycles**: Ensures that code is ready and meets customer requirements.  
- **DevOps focuses on delivery cycles**: Ensures that the code is tested, deployed, and maintained effectively.  

#### **Example**  
- In Agile, developers work on features during a sprint, delivering functional code.  
- DevOps takes that code, automates testing and deployment, and ensures it reaches production without errors.

---

### **2. Differences and Similarities**

#### **Similarities Between DevOps and Agile**  
1. **Collaboration**:  
- Agile promotes collaboration between developers and stakeholders.  
- DevOps promotes collaboration between development, QA, and operations teams.  

2. **Continuous Improvement**:  
- Both emphasize iterative improvement over time.  

3. **Customer-Centric**:  
- Both prioritize delivering value to the customer quickly and efficiently.  

#### **Differences Between DevOps and Agile**  

| Aspect                 | Agile                              | DevOps                           |
|------------------------|------------------------------------|----------------------------------|
| **Scope**              | Focuses on software development.  | Encompasses development, testing, deployment, and operations. |
| **Goal**               | Deliver functional, tested code.  | Ensure seamless delivery of software to production. |
| **Team Involvement**   | Developers and stakeholders.      | Developers, QA, operations, and infrastructure teams. |
| **Focus Area**         | Iterative development.            | Continuous integration and delivery. |
| **Automation**         | Not mandatory.                   | Heavily reliant on automation for testing, deployment, and monitoring. |

---

### **3. How Agile Feeds Into DevOps**

- **Agile Provides the Foundation**:  
Agile’s iterative and customer-focused approach creates the foundation for DevOps by ensuring that code is always in a “ready” state.  

- **DevOps Enhances Agile**:  
- Agile delivers smaller chunks of code quickly, but deploying them efficiently and consistently is a challenge.  
- DevOps addresses this gap by automating processes, enabling continuous delivery and deployment.  

- **Shared Principles**:  
- Agile promotes flexibility; DevOps ensures that the flexibility extends to deployment and operations.  
- Agile's iterative approach aligns perfectly with DevOps practices like continuous integration (CI) and continuous delivery (CD).  

#### **Example Workflow**  
1. **Agile Sprint Cycle**:  
- Developers complete a feature in a 2-week sprint.  
- The code is unit-tested and reviewed.  

1. **DevOps Pipeline**:  
- The code enters a CI pipeline, where it is automatically built, tested, and deployed to a staging environment.  
- Post-deployment monitoring ensures the feature works as expected.  

---

### **4. Summary: Agile vs. DevOps**

| Key Aspect                  | Agile Focus                   | DevOps Focus                   |
|-----------------------------|-------------------------------|--------------------------------|
| **How We Develop**          | Iterative development cycles. | Automating and streamlining delivery pipelines. |
| **Team Collaboration**      | Developers and stakeholders.  | Developers, QA, and operations working together. |
| **End Goal**                | Functional, tested code.      | Reliable, seamless production delivery. |

---

> By understanding how Agile and DevOps complement each other, teams can streamline both development and delivery processes, ensuring faster, higher-quality software deployment.
---

## **Business Use Case for DevOps**

### **1. The Need for Building a Business Use Case for DevOps**

A **business use case** for DevOps highlights how adopting DevOps practices directly addresses business challenges and drives value. It helps stakeholders understand why investing in DevOps is essential for the organization’s success.  

#### **Why Build a Business Use Case?**  
1. **Align Technical Goals with Business Objectives**:  
- Demonstrates how DevOps supports organizational goals such as revenue growth, customer satisfaction, and market competitiveness.  

1. **Justify Investments**:  
- DevOps requires investments in tools, training, and culture changes. A use case shows the ROI (return on investment) through improved efficiency and reduced costs.  

1. **Address Business Challenges**:  
- Solves critical issues like delayed releases, poor software quality, and inefficient workflows.  

1. **Gain Stakeholder Buy-In**:  
- A strong use case ensures leadership understands the value of DevOps and actively supports its adoption.

---

### **2. Business Drivers for DevOps**

#### **Faster Time-to-Market**  
- DevOps accelerates the software development lifecycle by automating processes like testing, integration, and deployment.  
- Frequent releases ensure that new features and updates reach customers faster, helping businesses stay competitive.  

#### **Improved Customer Satisfaction**  
- By delivering high-quality software more reliably, DevOps minimizes bugs and downtime, enhancing the user experience.  
- Continuous feedback loops help incorporate customer requirements quickly.  

#### **Cost Efficiency Through Automation**  
- Automating repetitive tasks reduces manual labor, freeing teams to focus on strategic initiatives.  
- Fewer deployment failures and faster recovery times lower operational costs.  

---

### **3. Purpose of DevOps in Solving Business Challenges**

#### **Bridge the Gap Between Development and Operations**  
- Traditional IT environments often suffer from misaligned goals between development (focused on speed) and operations (focused on stability).  
- DevOps unifies these teams with shared goals, tools, and processes, reducing friction and delays.  

#### **Reduce Deployment Failures**  
- By automating testing and deployment, DevOps ensures consistent, error-free releases.  
- Continuous integration (CI) identifies issues early, preventing bugs from reaching production.  

#### **Continuous Improvement of Application Delivery**  
- DevOps practices like continuous delivery (CD) ensure rapid and reliable deployment of software.  
- Monitoring and feedback loops allow for ongoing optimization of both processes and applications.  

---

### **Key Benefits of DevOps for Business**

| **Challenge**                     | **How DevOps Solves It**                                                                 |
|------------------------------------|-----------------------------------------------------------------------------------------|
| **Slow delivery of features**      | Continuous integration and delivery ensure faster time-to-market.                       |
| **High operational costs**         | Automation reduces manual work and operational overhead.                                |
| **Low customer satisfaction**      | High-quality, reliable software enhances user experience.                               |
| **Inefficient workflows**          | Unified processes and collaboration eliminate silos and improve efficiency.             |
| **Frequent deployment failures**   | Automated testing and deployment pipelines minimize errors and downtime.                |

---

### **4. Summary**
- A business use case for DevOps demonstrates how it aligns with organizational goals like faster delivery, cost reduction, and customer satisfaction.  
- The **purpose** of DevOps is to bridge the gap between development and operations, reduce deployment failures, and enable continuous improvement.  
- Adopting DevOps addresses critical business challenges, ensuring organizations can innovate and remain competitive in dynamic markets.



---
## Application Deployment


### **1. Overview of Application Deployment**

#### **What is Application Deployment?**
- Application deployment is the process of making an application available for use by transferring it from a development environment to a production environment.  
- It involves various steps, such as:  
1. Compiling and packaging the application code.  
1. Configuring the infrastructure.  
1. Deploying the application to servers.  

#### **Manual vs Automated Deployment**
##### 1. **Manual Deployment**:  
- Involves human intervention at every step, such as copying files, configuring settings, and restarting services.  
- **Challenges**:  
1. **High Risk of Errors**: Human mistakes can cause downtime or misconfigurations.  
1. **Time-Consuming**: Repeated manual steps slow down the release process.  
1. **Inconsistent Results**: Variations in execution can lead to unpredictable outcomes.

##### 2. **Automated Deployment**:  
- Uses scripts and tools to perform deployment tasks automatically.  
- **Benefits**:  
1. Reduces errors by eliminating manual steps.  
1. Saves time by enabling faster and repeatable deployments.  
1. Improves reliability and consistency.

---

### **2. Automated Application Deployment**

#### **What is Automated Deployment?**
- Automated deployment involves using tools and scripts to handle repetitive deployment tasks like packaging code, provisioning servers, and managing configurations.  
- It ensures that applications are deployed efficiently, consistently, and without manual intervention.

#### **Popular Deployment Tools**
1. **Jenkins**:  
- A continuous integration (CI) tool that automates code building, testing, and deployment.  
- Integrates with various plugins to automate complex deployment pipelines.

2. **Ansible**:  
- A configuration management tool that automates server setup and application deployment.  
- Uses simple YAML-based playbooks to define tasks.

3. **Docker**:  
- A containerization platform that allows applications to be packaged with their dependencies.  
- Ensures that applications run consistently across different environments.

---

### **3. Application Release Automation (ARA)**

#### **What is ARA?**
- **Application Release Automation (ARA)** refers to tools and practices that automate and streamline the release of applications.  
- It combines **deployment automation** with **release management** to ensure smooth and reliable delivery of software.

#### **Key Components of ARA**
1. **Pipeline Orchestration**:  
- Automates the flow of code from development to production.  
- Includes processes like code building, testing, packaging, and deploying.  
- Tools like Jenkins or GitLab CI/CD manage pipeline orchestration.

2. **Environment Modeling**:  
- Defines the environments (e.g., staging, production) where applications will be deployed.  
- Ensures that deployments are consistent across different environments.

3. **Release Management**:  
- Tracks which versions of the application are deployed to which environments.  
- Coordinates releases to ensure they align with business requirements.

#### **Advantages of ARA**
- **Faster Releases**: Automates repetitive tasks, reducing time-to-market.  
- **Improved Quality**: Ensures consistent deployments across environments, reducing errors.  
- **Increased Visibility**: Provides dashboards and logs to monitor the deployment process.

---

### **Examples of ARA in Action**

1. **Example with Jenkins and Docker**:  
- Developers push code to a repository.  
- Jenkins automatically builds and tests the code.  
- Docker containers are created and deployed to a Kubernetes cluster.  

2. **Example with Ansible**:  
- Ansible playbooks configure servers, deploy the application, and ensure all dependencies are in place.  

---

### **4. Summary**

| **Concept**                 | **Description**                                                                                        |
|-----------------------------|--------------------------------------------------------------------------------------------------------|
| **Application Deployment**  | The process of moving an application from development to production, traditionally done manually.      |
| **Automated Deployment**    | Uses tools like Jenkins, Ansible, and Docker to automate and simplify deployment tasks.                |
| **Application Release Automation (ARA)** | Combines automation and release management to ensure smooth, reliable, and fast application delivery. |

> By adopting automated deployment and ARA, organizations can achieve faster, more reliable releases, reduce manual errors, and improve their ability to scale applications effectively.




---


### **Continuous Integration (CI)**  

---

### **1. Definition of Continuous Integration (CI)**  

#### **What is CI?**  
Continuous Integration (CI) is a software development practice where developers frequently integrate their code into a shared repository. Each integration is automatically verified by building the application and running automated tests.  

#### **Core Objectives of CI**:  
- **Early Detection of Issues**: Identifies errors early in the development cycle, making them easier and cheaper to fix.  
- **Streamlined Collaboration**: Encourages teamwork by enabling developers to frequently merge their code.  
- **Improved Code Quality**: Automated tests ensure that only stable code is merged into the main branch.  

#### **How CI Works**:  
1. Developers write code and commit changes to a version control system (e.g., Git).  
2. The CI server (e.g., Jenkins, GitHub Actions) detects the commit and triggers a pipeline.  
3. The pipeline includes:  
- **Build**: Compiling the code.  
- **Test**: Running automated tests to verify functionality.  
- **Feedback**: Reporting results to developers (pass/fail, test coverage).  
4. If the build or tests fail, the developers are notified to fix the issues.

---

### **2. Best Practices of CI**  

#### **Commit Frequently**  
- Developers should commit small, incremental changes often. This ensures that issues are detected quickly and are easier to resolve.  

#### **Automate Build and Testing Processes**  
- Use automation tools to compile code and run tests whenever new code is committed. This ensures consistency and reduces manual effort.  

#### **Maintain a Single Source of Truth**  
- Use a shared version control repository (e.g., GitHub, GitLab) to store and manage the codebase.  

#### **Keep the Build Fast**  
- Optimize the CI pipeline to ensure quick feedback. Long builds slow down development and hinder productivity.  

#### **Test Locally Before Committing**  
- Developers should test their code locally to catch obvious issues before committing to the shared repository.  

#### **Fail Fast and Fix Quickly**  
- When a build or test fails, prioritize fixing it immediately to maintain a stable codebase.  

---

### **3. Benefits of CI**  

#### **Reduces Integration Risks**  
- By integrating code frequently, conflicts and bugs are identified early, reducing the complexity of resolving them.  

#### **Faster Bug Fixes and Feature Updates**  
- Automated tests ensure that bugs are caught as soon as they are introduced, enabling quicker resolutions.  
- New features can be deployed more confidently and rapidly.  

#### **Improved Collaboration**  
- CI encourages a culture of collaboration, where developers work together to maintain a stable and high-quality codebase.  

#### **Enhanced Code Quality**  
- Regular testing ensures that only functional and stable code is merged into the main branch.  

#### **Time and Cost Efficiency**  
- Automation reduces manual intervention, saving time and minimizing human errors.  

---

### **4. Activity: Demonstrate a Git-Based CI Workflow**  

#### **Step-by-Step CI Workflow**  
1. **Code Repository**: Developers commit code changes to a branch in a shared repository (e.g., GitHub, GitLab).  
2. **Trigger CI Pipeline**: A CI tool (e.g., GitHub Actions, Jenkins) detects the commit and initiates the pipeline.  
3. **Automated Tasks**:  
- Build the code.  
- Run unit tests, integration tests, and static code analysis.  
4. **Feedback Loop**:  
- The CI tool provides immediate feedback (pass/fail reports, error logs).  
5. **Merge**: If the pipeline succeeds, the changes are merged into the main branch.  

#### **Example Tools**  
- **GitHub Actions**: CI/CD workflows directly integrated into GitHub.  
- **Jenkins**: A widely used open-source CI server with extensive plugin support.  
- **GitLab CI/CD**: A built-in CI/CD system in GitLab for automating pipelines.

---

### **5. Summary**

| **Aspect**              | **Details**                                                                 |
|--------------------------|-----------------------------------------------------------------------------|
| **Definition of CI**     | Frequent integration of code into a shared repository, with automated testing. |
| **Best Practices**       | Commit frequently, automate processes, test locally, maintain a fast pipeline. |
| **Benefits**             | Early issue detection, faster bug fixes, better collaboration, improved quality. |
| **Tools**                | GitHub Actions, Jenkins, GitLab CI/CD.                                       |

---

> By practicing CI, teams ensure their codebase remains stable, enabling faster, safer, and more efficient delivery of software.








---









### **Continuous Delivery (CD)**  

---

### **1. Definition and Process of Continuous Delivery (CD)**  

#### **What is Continuous Delivery?**  
Continuous Delivery (CD) is a software development practice that builds on **Continuous Integration (CI)** by automating the release process to ensure that code changes are always in a deployable state. It ensures that application updates can be released to production or staging environments quickly, safely, and sustainably.  

#### **Key Objectives of CD**:  
- **Deployability**: Every change is verified and ready for release.  
- **Automation**: Deployment processes are automated to reduce manual intervention.  
- **Speed and Safety**: Enable frequent, reliable, and low-risk releases.  

#### **How CD Works**:  
1. **Build**: The application is built after developers commit code to the shared repository.  
2. **Test**: Automated tests (unit, integration, functional) ensure code stability.  
3. **Release**: Deployment to staging or production environments is prepared and, in some cases, executed automatically.  

---

### **2. Continuous Integration (CI) vs Continuous Delivery (CD)**  

| **Aspect**                 | **Continuous Integration (CI)**                              | **Continuous Delivery (CD)**                            |
|----------------------------|-------------------------------------------------------------|--------------------------------------------------------|
| **Goal**                   | Ensure code changes are integrated and tested frequently.    | Ensure that code changes are deployable at any time.   |
| **Scope**                  | Focuses on merging and testing code in the development phase.| Extends automation to staging or production releases.  |
| **Manual Steps**           | Deployment still requires manual approval.                  | Deployment can be automated up to production.          |
| **Pipeline**               | Stops after building and testing.                           | Includes deployment to staging or production.          |

#### **Key Relationship**:  
- **CI ensures that the code is ready to deploy.**  
- **CD ensures that the code is actually deployed (or ready to be deployed) in staging or production environments.**

---

### **3. Continuous Delivery Pipeline**  

A **CD pipeline** is an automated series of steps that take code from development to deployment.  

#### **Stages in a CD Pipeline**:  
1. **Build Stage**:  
- Code is compiled, packaged, and prepared for testing.  
- Tools: Jenkins, GitHub Actions.  

2. **Test Stage**:  
- Automated tests validate the functionality and quality of the code.  
- Types of tests: Unit, integration, performance, security.  

3. **Release Stage**:  
- Code is deployed to staging or production environments.  
- Deployment strategies: Rolling updates, blue-green deployments, canary releases.  

---

### **4. Tools for Continuous Delivery**

1. **Spinnaker**:  
- A multi-cloud continuous delivery platform.  
- Features: Deployment pipelines, integrations with CI tools, and automated rollbacks.  

2. **Azure DevOps**:  
- A CI/CD platform by Microsoft.  
- Features: Pipelines for build and release, support for multiple environments, and built-in test automation.  

3. **Other Tools**:  
- GitLab CI/CD: Integrated pipelines from code to deployment.  
- AWS CodePipeline: Automates release pipelines for applications deployed on AWS.

---

### **5. Benefits of Continuous Delivery**

1. **Faster Time-to-Market**:  
- Frequent, automated releases ensure that new features and bug fixes reach users quickly.  

2. **Reduced Risks**:  
- Smaller, incremental updates reduce the likelihood of errors during deployment.  

3. **Improved Quality**:  
- Automated testing and deployment processes maintain code stability and consistency.  

4. **Enhanced Collaboration**:  
- Developers, QA, and operations teams work together, fostering a DevOps culture.  

---

### **6. Example Scenario**  

1. **Developer Workflow with CI/CD**:  
- A developer pushes code to a GitHub repository.  
- Jenkins builds the code and runs automated tests.  
- After successful tests, Spinnaker deploys the build to a staging environment.  
- A product owner manually approves deployment to production.  

---

### **7. Summary**

| **Aspect**                   | **Details**                                                                 |
|-------------------------------|---------------------------------------------------------------------------|
| **Definition of CD**          | Automates release processes to ensure code is deployable at any time.    |
| **CI vs CD**                  | CI prepares code for deployment; CD ensures deployment readiness.         |
| **Pipeline Stages**           | Build → Test → Release.                                                   |
| **Popular Tools**             | Spinnaker, Azure DevOps, GitLab CI/CD.                                    |

---

> By adopting **Continuous Delivery**, teams can release features and updates faster, with reduced risks and greater confidence in their software's stability.
---





### **Summary & Best Practices**

---

#### **1. Recap of All Concepts**  
- **DevOps Overview**: Collaboration between development, operations, and QA to achieve continuous delivery and faster time-to-market.  
- **Key Components**: CI, CD, automated deployments, and application release automation (ARA).  
- **Goals**: Improve efficiency, reduce risks, and enhance product quality.  

---

#### **2. Best Practices for CI/CD and DevOps Implementation**  
- **Start Small**: Begin with pilot projects before scaling DevOps practices organization-wide.  
- **Culture & Collaboration**: Foster a culture of shared responsibility and encourage cross-functional team collaboration.  
- **Focus on Automation**: Automate repetitive tasks like testing, integration, and deployments.  
- **Monitor & Optimize**: Use feedback loops and performance metrics to continuously improve processes.  

---

#### **3. Future Trends in DevOps**  
- **DevSecOps**: Integration of security practices into DevOps pipelines to address vulnerabilities proactively.  
- **AI/ML in DevOps**: Use of machine learning to optimize CI/CD pipelines, predict failures, and enhance monitoring.  
- **Serverless Computing**: Simplifies deployment and scaling by abstracting server management.

---

> By following best practices and adapting to emerging trends, organizations can unlock the full potential of DevOps to deliver better software faster and more efficiently.


---


## **CI/CD**
CI/CD stands for **Continuous Integration (CI) and Continuous Delivery/Deployment (CD)**. It is a DevOps practice that automates software development, testing, and deployment to deliver software faster and with fewer errors.

### **1. Continuous Integration (CI)**
- Developers frequently merge code changes into a shared repository.
- Automated build and testing are triggered to detect issues early.
- Ensures that new code integrates smoothly with existing code.
- **Example Tools:** GitHub Actions, Jenkins, GitLab CI, Travis CI.

### **2. Continuous Delivery (CD - Continuous Delivery)**
- Extends CI by ensuring that the software is always in a deployable state.
- After passing CI tests, the software is automatically packaged and made ready for deployment.
- Manual approval is required before deployment to production.
- **Example Tools:** Jenkins, GitHub Actions, GitLab CI/CD, ArgoCD.

### **3. Continuous Deployment (CD - Continuous Deployment)**
- Automates the entire process, including deployment to production.
- No manual intervention is required; new code is automatically released.
- Requires a highly mature CI/CD pipeline with extensive automated testing.
- **Example Tools:** Kubernetes, ArgoCD, Spinnaker.

---

## **Difference Between Continuous Delivery and Continuous Deployment**

| Feature               | Continuous Delivery (CD - Delivery) | Continuous Deployment (CD - Deployment) |
|-----------------------|----------------------------------|----------------------------------|
| **Definition**        | Code is always ready for deployment but requires manual approval. | Code is automatically deployed to production without manual approval. |
| **Automation Level**  | Automates everything **except production deployment**. | Fully automated, including production deployment. |
| **Manual Approval**   | Required before production deployment. | No manual approval; automatic deployment. |
| **Risk Factor**       | Lower risk; allows human oversight. | Higher risk but enables faster releases. |
| **Use Case**         | Preferred when regulations, security reviews, or business decisions require approval. | Suitable for companies needing rapid, frequent updates (e.g., Netflix, Amazon). |



### **Summary**
- **CI ensures code is tested and merged frequently.**
- **CD (Delivery) keeps code ready for deployment but requires manual approval.**
- **CD (Deployment) automates the entire process, including production deployment.**