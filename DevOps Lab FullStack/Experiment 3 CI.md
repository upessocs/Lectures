# **Lab Manual**  
#### **Experiment 3**  
**Title:** To understand the concepts of Continuous Integration (CI) and how to set up a basic CI pipeline for a software project using CI tools.  

---

### **Objective:**  
1. Understand the concept and importance of Continuous Integration (CI).  
2. Learn the components of a CI pipeline.  
3. Set up a basic CI pipeline for a software project using a CI tool.  

---

### **Theory:**  
**Continuous Integration (CI)** is a software development practice where developers regularly integrate code changes into a shared repository. Each integration triggers an automated build and testing process to ensure that the new changes do not break the existing codebase.  

#### **Key Concepts of CI:**  
1. **Version Control System (VCS):** Tools like Git to manage code repositories.  
2. **Build Automation:** Automating the process of compiling source code into executable artifacts.  
3. **Automated Testing:** Running test cases to verify the correctness of code changes.  
4. **Feedback Mechanism:** Providing immediate feedback to developers about integration results.  

#### **Benefits of CI:**  
1. **Early Detection of Bugs:** Issues are identified and resolved quickly.  
2. **Faster Development Cycles:** Frequent integrations prevent large merge conflicts.  
3. **Improved Collaboration:** Encourages teamwork and consistent coding practices.  
4. **High-Quality Software:** Ensures a stable and reliable codebase.  

---

### **Apparatus/Software Required:**  
1. **CI Tools:**  
- GitHub Actions  
- GitLab CI/CD  
- Jenkins  
- Travis CI  
2. **Sample Project:** A basic project in Python, Java, or Node.js hosted on GitHub/GitLab.  
3. **Text Editor/IDE:** Visual Studio Code, IntelliJ IDEA, or PyCharm.  
4. **Operating System:** Windows/Linux/MacOS.  

---

### **Procedure:**  
1. **Understand the CI Workflow:**  
a. Learn how CI integrates with version control systems (e.g., Git).  
b. Familiarize yourself with a sample CI tool and its interface.  

2. **Set Up a Repository:**  
a. Create or fork a sample project repository on GitHub/GitLab.  
b. Clone the repository to your local system and make small changes (e.g., update a README file or a script).  

3. **Configure the CI Pipeline:**  
a. For GitHub Actions:  
  - Create a `.github/workflows/ci.yml` file in your repository.  
  - Define the CI workflow, including steps to install dependencies, run tests, and build the project.  
b. For GitLab CI/CD:  
  - Create a `.gitlab-ci.yml` file.  
  - Specify stages like `build`, `test`, and `deploy`.  

4. **Run the CI Pipeline:**  
a. Push changes to the repository.  
b. Observe the pipeline execution triggered automatically by the push event.  
c. Review logs for each stage to understand what was executed.  

5. **Analyze Test Results:**  
a. Check if all test cases pass successfully.  
b. Identify and fix any issues highlighted by the CI process.  

6. **Document Findings:**  
a. Record the time taken to build and test the application.  
b. Note any challenges faced while setting up the pipeline.  

---

### **Observations:**  
1. Observe the pipeline stages and their execution order.  
2. Document the results of automated tests.  
3. Note the feedback provided by the CI tool on code changes.  

---

### **Result:**  
The experiment successfully demonstrated the concept of Continuous Integration (CI) and the steps to set up a basic CI pipeline for a software project.  

---

### **Questions for Review:**  
1. What is Continuous Integration (CI), and why is it important?  
2. What are the key components of a CI pipeline?  
3. How does a CI tool like GitHub Actions or Jenkins automate the build and test process?  
4. What challenges did you face during the setup, and how did you overcome them?  
