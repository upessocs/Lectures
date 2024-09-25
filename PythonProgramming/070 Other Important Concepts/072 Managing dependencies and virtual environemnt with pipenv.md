# Managing Python Dependencies and VirtualEnvironment 
## with `pip freeze > requirements.txt` and  with `pipenv`
When working on Python projects, especially in a collaborative environment or deploying to production, it's essential to ensure that your code runs consistently across different systems. This is where managing dependencies comes in.
#### Why Manage Dependencies?
- **Reproducibility**: If you install different versions of libraries across different systems, the behavior of your application may vary. By locking the dependencies in a file, you can recreate the exact environment.
- **Collaboration**: When working on a project with multiple developers, everyone can use the same set of dependencies, ensuring the code runs as expected.
- **Deployment**: In production, you need to be sure that the same versions of the libraries used in development are deployed.
#### Using `pip freeze > requirements.txt`
`pip freeze` is a command that lists all the installed packages in your current environment along with their versions. This can be saved to a file, typically named `requirements.txt`, which can be used to install the exact same dependencies later.
**Steps:**
1. **Generate `requirements.txt`**
- After installing the necessary packages for your project, run:
```bash
pip freeze > requirements.txt
```
- This will create a `requirements.txt` file containing all the installed packages and their versions.
Example `requirements.txt`:
```
flask==2.0.1
requests==2.26.0
numpy==1.21.1
```
2. **Installing dependencies from `requirements.txt`**
- On a different machine or environment, you can recreate the environment using:
```bash
pip install -r requirements.txt
```
- This installs all the packages listed in the `requirements.txt` file with the exact versions.
### Python Virtual Environment
A **Python virtual environment** isolates your project's dependencies from the system-wide Python installation or other projects. This ensures that each project can have its own dependencies and versions of libraries without conflict.
#### Why Use Virtual Environments?
- **Avoid Dependency Conflicts**: Different projects may require different versions of the same library. Virtual environments ensure each project gets its own environment.
- **Cleaner Development Setup**: By isolating each project’s dependencies, you keep your global Python environment clean.
#### Creating and Using Virtual Environments
1. **Installing `virtualenv`**
- First, install `virtualenv`:
```bash
pip install virtualenv
```
2. **Create a virtual environment**
- Create a new environment by specifying the directory where you want it:
```bash
virtualenv myenv
```
3. **Activate the virtual environment**
- On Linux/Mac:
```bash
source myenv/bin/activate
```
- On Windows:
```bash
myenv\Scripts\activate
```
4. **Install dependencies inside the virtual environment**
- Once activated, any `pip install` command will install packages inside the virtual environment.
- You can verify the installed dependencies with:
```bash
pip freeze
```
5. **Deactivate the virtual environment**
- To deactivate the environment and return to the global environment, simply run:
```bash
deactivate
```
### Using `pipenv` to Manage Python Dependencies
**Pipenv** is an alternative tool to `virtualenv` and `pip`, offering a more integrated way to manage dependencies and virtual environments.
#### Benefits of Pipenv:
- **Unified workflow**: Combines dependency management (like `pip`) and virtual environments (like `virtualenv`) into a single tool.
- **Locking dependencies**: Automatically generates a `Pipfile.lock`, ensuring deterministic builds by locking exact versions of your dependencies.
- **Ease of use**: Simplifies common tasks like activating virtual environments and managing dependencies.
#### Installing `pipenv`
To install `pipenv`, use `pip`:
```bash
pip install pipenv
```
#### Basic Pipenv Commands and Workflow
1. **Creating a New Project Environment with Pipenv**
- Initialize a new project environment and install dependencies:
```bash
pipenv install
```
- This creates a `Pipfile` and a virtual environment if none exists. `Pipfile` replaces the `requirements.txt` file and contains the dependencies required by the project.
2. **Adding Dependencies**
- Install a new package (e.g., Flask):
```bash
pipenv install flask
```
- This automatically updates the `Pipfile` and generates a `Pipfile.lock` for locking dependency versions.
3. **Using the Virtual Environment**
- To activate the virtual environment created by `pipenv`:
```bash
pipenv shell
```
- This will activate the environment, similar to `source myenv/bin/activate` in `virtualenv`.
4. **Installing Dependencies from Pipfile**
- If you have a `Pipfile`, you can install all dependencies in one go:
```bash
pipenv install
```
5. **Removing Dependencies**
- To remove a package:
```bash
pipenv uninstall flask
```
6. **Check for Security Vulnerabilities**
- Pipenv can check for known security issues in your installed dependencies:
```bash
pipenv check
```
7. **Generate `requirements.txt` from Pipfile**
- If you need a `requirements.txt` for legacy projects or deployments:
```bash
pipenv lock --requirements
```
### Example Workflow with `Pipenv`
1. Create a new project directory:
```bash
mkdir myproject
cd myproject
```
2. Initialize the project and install a package (e.g., Flask):
```bash
pipenv install flask
```
3. Activate the virtual environment:
```bash
pipenv shell
```
4. Develop your project, installing any additional dependencies as needed with `pipenv install <package>`.
5. Once done, deactivate the environment:
```bash
exit  # This exits the pipenv shell
```
6. To install dependencies later on another machine, use:
```bash
pipenv install
```
### Summary:
- **pip freeze > requirements.txt**: Ensures reproducibility by capturing exact versions of all installed packages.
- **Virtual environments**: Isolate project dependencies from global installations using `virtualenv`.
- **Pipenv**: Combines virtual environment management and dependency management with a modern workflow, using a `Pipfile` and `Pipfile.lock` or use `pipenv requirements` or `pipenv lock --requirements`.