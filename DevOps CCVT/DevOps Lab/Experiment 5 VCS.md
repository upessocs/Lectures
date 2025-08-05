# **Lab Manual**  
#### **Experiment 5**  
**Title:** To understand the history, basic operations, and different types of Version Control Systems (VCS), and to compare their features and limitations using VCS software and a sample code repository.  

---

### **Objective:**  
1. Understand the history and evolution of Version Control Systems (VCS).  
2. Learn the basic operations of VCS, such as commit, branch, merge, and revert.  
3. Explore different types of VCS (local, centralized, distributed).  
4. Compare the features and limitations of popular VCS tools.  

---

### **Theory:**  
**Version Control System (VCS)** is a software tool that helps developers manage changes to source code over time. It maintains a history of code modifications, allowing for collaboration, rollback to previous states, and better management of software projects.  

#### **Types of VCS:**  
1. **Local VCS:** Tracks changes on a single developer's machine (e.g., RCS).  
2. **Centralized VCS:** Uses a central server to store versioned files, enabling team collaboration (e.g., Subversion, CVS).  
3. **Distributed VCS:** Each user has a complete copy of the repository, enabling offline work and enhanced reliability (e.g., Git, Mercurial).  

#### **Key Operations in VCS:**  
1. **Commit:** Save changes to the repository.  
2. **Branch:** Create a separate line of development.  
3. **Merge:** Combine changes from multiple branches.  
4. **Revert:** Undo changes in the repository.  
5. **Pull/Push:** Sync changes between local and remote repositories.  

#### **Comparison of Popular VCS Tools:**  

| Feature                | Git                  | Subversion (SVN)     | Mercurial           | CVS                 |  
|------------------------|----------------------|-----------------------|---------------------|---------------------|  
| **Type**              | Distributed          | Centralized           | Distributed         | Centralized         |  
| **Offline Work**      | Supported            | Limited               | Supported           | Limited             |  
| **Branching**         | Lightweight          | Heavyweight           | Lightweight         | Heavyweight         |  
| **Speed**             | Very Fast            | Slower                | Fast                | Moderate            |  
| **Learning Curve**    | Moderate             | Easy                  | Easy                | Moderate            |  

---

### **Apparatus/Software Required:**  
1. **VCS Software:**  
- Git  
- Subversion (SVN)  
- Mercurial  
2. **Sample Code Repository:** A simple project hosted on platforms like GitHub, GitLab, or Bitbucket.  
3. **Text Editor/IDE:** Visual Studio Code, IntelliJ IDEA, or PyCharm.  
4. **Operating System:** Windows/Linux/MacOS.  

---

### **Procedure:**  
1. **Understand the VCS Types:**  
a. Study the differences between local, centralized, and distributed VCS.  
b. Research the features and workflows of Git, SVN, and Mercurial.  

2. **Set Up a Sample Repository:**  
a. Use Git to create a local repository.  
b. Initialize the repository and add files.  

3. **Perform Basic Operations in Git:**  
a. Stage and commit changes using `git add` and `git commit`.  
b. Create a new branch, make changes, and merge it into the main branch.  
c. Explore commands like `git revert`, `git log`, and `git diff`.  

4. **Explore Another VCS:**  
a. Install and configure Subversion (SVN) or Mercurial.  
b. Perform similar operations (commit, branch, merge).  

5. **Compare Features:**  
a. Document the differences in workflow, usability, and performance between Git and other VCS tools.  
b. Highlight the strengths and limitations of each tool.  

---

### **Observations:**  
1. Record the steps and commands used for each VCS operation.  
2. Compare the speed and ease of operations between Git, SVN, and Mercurial.  
3. Note the advantages and disadvantages of each system.  

---

### **Result:**  
The experiment successfully demonstrated the history, basic operations, and comparison of different Version Control Systems (VCS) using software tools and a sample code repository.  

---

### **Questions for Review:**  
1. What is the main purpose of a Version Control System (VCS)?  
2. How do centralized and distributed VCS differ?  
3. What are the advantages of using Git over SVN or Mercurial?  
4. Describe the significance of branching in VCS.  
5. What challenges did you face while using multiple VCS tools?  
---


# **Brief History and Comparison of Git, SVN, Mercurial, and CVS**  

#### **1. Git**  
- **History:**  
- Created by Linus Torvalds in 2005 to manage the Linux kernel development.  
- Designed as a distributed version control system with speed, data integrity, and support for distributed workflows.  
- **Key Features:**  
- Fully distributed architecture: Every user has a complete copy of the repository.  
- Fast branching and merging.  
- Powerful and flexible, but requires learning.  
- Open-source and widely adopted by modern software development teams.  
- **Use Case:** Ideal for large, collaborative projects with distributed teams.



#### **2. Subversion (SVN)**  
- **History:**  
- Developed by CollabNet in 2000 as an improvement over CVS.  
- Centralized version control system designed to address the limitations of CVS.  
- **Key Features:**  
- Centralized architecture: A single central repository.  
- Strong access control and simple to understand.  
- Supports atomic commits (all changes are committed together).  
- Slower branching and merging compared to Git.  
- **Use Case:** Suitable for teams that prefer centralized workflows and need fine-grained access control.  



#### **3. Mercurial**  
- **History:**  
- Created by Matt Mackall in 2005 as an alternative to Git.  
- Designed to be a distributed version control system with simplicity and performance.  
- **Key Features:**  
- Distributed architecture like Git.  
- Simple and user-friendly compared to Git.  
- Extensible with plugins but less flexible than Git.  
- Written in Python, making it easy to customize.  
- **Use Case:** Preferred for smaller teams or projects prioritizing simplicity over complex workflows.  



#### **4. CVS (Concurrent Versions System)**  
- **History:**  
- Originated in the late 1980s as one of the earliest version control systems.  
- Initially designed for managing text-based source code in centralized workflows.  
- **Key Features:**  
- Centralized architecture similar to SVN.  
- Basic functionality but lacks advanced features like atomic commits and robust branching.  
- Has been largely replaced by modern VCS tools due to limitations.  
- **Use Case:** Historically used but now considered obsolete for modern projects.  



### **Comparison Table**  

| Feature                | **Git**             | **SVN**               | **Mercurial**        | **CVS**              |  
|------------------------|---------------------|-----------------------|----------------------|----------------------|  
| **Type**               | Distributed         | Centralized           | Distributed          | Centralized          |  
| **Offline Work**       | Fully Supported     | Limited               | Fully Supported      | Limited              |  
| **Branching**          | Lightweight         | Heavyweight           | Lightweight          | Limited              |  
| **Merging**            | Efficient           | Slower                | Efficient            | Basic or Manual      |  
| **Speed**              | Very Fast           | Slower                | Fast                 | Moderate             |  
| **Learning Curve**     | Moderate            | Easy                  | Easy                 | Moderate             |  
| **Collaboration**      | Excellent for Distributed Teams | Suitable for Centralized Teams | Good for Smaller Teams | Limited Features    |  
| **Popularity**         | Widely Used         | Moderate Usage        | Less Popular         | Obsolete             |  
| **Best For**           | Modern, large-scale, distributed projects | Centralized workflows | Small teams or simpler workflows | Historical context only |  


### **Conclusion:**  
- **Git** is the most widely used and versatile system, best suited for modern distributed projects.  
- **SVN** is easier to learn but less flexible, making it a good choice for centralized teams.  
- **Mercurial** is a simpler alternative to Git for smaller teams.  
- **CVS** has historical significance but is rarely used in current development due to its limitations.  
