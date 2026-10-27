# Tutorial: Using `uv` to Manage a Django Project

`uv` is a fast Python package and project manager. It can create virtual environments, install dependencies, manage Python versions, and run Django commands without requiring you to activate the virtual environment manually.

This tutorial uses a simple Django project named `college` with an application named `students`. Commands are suitable for Linux and NixOS.

## 1. What is `uv`?

Traditionally, Python projects use `venv` to create virtual environments and `pip` to install packages. `uv` combines these workflows and provides dependency locking and project management.

| Command/tool     | Purpose                                               |
| ---------------- | ----------------------------------------------------- |
| `uv init`        | Initialize a Python project                           |
| `uv venv`        | Create a virtual environment                          |
| `uv add`         | Add and install a project dependency                  |
| `uv sync`        | Synchronize the environment with project dependencies |
| `uv run`         | Run a command inside the project's environment        |
| `uv lock`        | Generate or update the dependency lockfile            |
| `uv python list` | List available Python installations and versions      |

## 2. Install `uv`

On Linux, install `uv` using its official installer:

```
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Restart the terminal if necessary, then verify the installation:

```
uv --version
```

On NixOS, you can alternatively run `uv` temporarily without installing it system-wide:

```
nix shell nixpkgs#uv
```

This opens a shell with `uv` available, provided the package is available in your configured nixpkgs.

## 3. Create a Django project

Create a project directory and initialize it.

```
mkdir college
cd college

# Create the Python project configuration.
uv init

# Install Django as a project dependency.
uv add django
```

The `uv init` command creates project metadata, typically including `pyproject.toml`. The `uv add django` command records Django as a dependency and updates the environment and lockfile.

Your directory will contain files similar to these:

```
college/
├── .venv/
├── .python-version
├── main.py
├── pyproject.toml
└── uv.lock
```

The exact files depend on the `uv` version and initialization options. Django's project files have not yet been created.

## 4. Create the Django project

Run Django's project-generation command through `uv`:

```
uv run django-admin startproject config .
```

The final `.` tells Django to create the project in the current directory rather than creating another nested directory.

The structure will now resemble:

```
college/
├── .venv/
├── config/
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── manage.py
├── pyproject.toml
└── uv.lock
```

Here, `config` contains the Django project configuration, while `manage.py` provides access to Django management commands.

## 5. Create a Django application

Create an application named `students`:

```
uv run python manage.py startapp students
```

A Django project can contain multiple applications. For example, `students` can manage student records while another application manages courses.

Register the application in `config/settings.py`:

```
INSTALLED_APPS = [    # Django's built-in applications.    "django.contrib.admin",    "django.contrib.auth",    "django.contrib.contenttypes",    "django.contrib.sessions",    "django.contrib.messages",    "django.contrib.staticfiles",    # Our application.    "students",]
```

## 6. Run database migrations

Django includes built-in models for users, groups, permissions, and sessions. Migrations create the corresponding database tables.

First, generate migration files for changes to your own models when needed:

```
uv run python manage.py makemigrations
```

Then apply all pending migrations:

```
uv run python manage.py migrate
```

Difference between the two commands:

- `makemigrations` generates migration files based on model changes.
- `migrate` applies migration files to the database.

At this stage, `makemigrations` may report that no changes were detected for your application. That is normal because you have not created any custom models yet.

## 7. Create a superuser

A superuser is an administrative account with all permissions. It allows you to log in to Django's administration interface.

```
uv run python manage.py createsuperuser
```

Follow the prompts to enter a username, email address if requested, and password.

The password will not appear as you type it. This is normal terminal behavior.

## 8. Start and test the Django server

Run:

```
uv run python manage.py runserver
```

Open these URLs in your browser:

- Application root: `http://127.0.0.1:8000/`
- Django administration: `http://127.0.0.1:8000/admin/`

Log in to `/admin/` using the superuser credentials created in the previous step.

Stop the server by pressing `Ctrl+C`.

## 9. Understand `uv run` versus activating a shell

You do not need to activate the virtual environment to run Django commands.

For example:

```
# Run Django directly in the project's environment.
uv run python manage.py migrate
uv run python manage.py createsuperuser
uv run python manage.py runserver
```

If you prefer an interactive virtual environment shell, activate `.venv` manually.

On Linux and NixOS:

```
source .venv/bin/activate

# Commands now use the activated environment.
python manage.py runserver
python manage.py migrate

# Leave the virtual environment.
deactivate
```

Unlike `uv run`, activation changes the environment of your current terminal session. Both approaches work.

## 10. Common `uv` commands for Django development

| Task                             | Command                                     |
| -------------------------------- | ------------------------------------------- |
| Install a dependency             | `uv add django`                             |
| Install a development dependency | `uv add --dev django-debug-toolbar`         |
| Synchronize dependencies         | `uv sync`                                   |
| Run Django commands              | `uv run python manage.py <command>`         |
| Create an app                    | `uv run python manage.py startapp students` |
| Generate migrations              | `uv run python manage.py makemigrations`    |
| Apply migrations                 | `uv run python manage.py migrate`           |
| Create an admin user             | `uv run python manage.py createsuperuser`   |
| Start the server                 | `uv run python manage.py runserver`         |
| Open a Python shell              | `uv run python manage.py shell`             |
| Run tests                        | `uv run python manage.py test`              |

## 11. NixOS notes

On NixOS, Python packages installed through `uv` generally work inside the project's virtual environment, but packages that require native libraries may need additional system dependencies.

If `python` or `uv` is missing, you can temporarily enter a development shell:

```
nix shell nixpkgs#uv nixpkgs#python313
```

Use a Python version supported by your Django version and project dependencies. If you have already configured a project Python version, retain it rather than changing versions unnecessarily.

## 12. Final workflow

For a new Django project, the normal sequence is:

```
mkdir college
cd college

uv init
uv add django

uv run django-admin startproject config .
uv run python manage.py startapp students

# Register "students" in config/settings.py first.
uv run python manage.py makemigrations
uv run python manage.py migrate

uv run python manage.py createsuperuser
uv run python manage.py runserver
```

Remember: `uv` manages the Python environment and dependencies; Django manages the project, applications, database migrations, users, and development server. `uv run` connects the two by executing Django commands in the project's environment.