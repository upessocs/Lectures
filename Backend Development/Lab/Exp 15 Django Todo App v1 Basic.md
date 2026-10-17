# Experiment 15: Django To-Do Application — Complete Lab Manual

## 1. Objective

To install, set up, and build a simple To-Do application using the Django web framework and SQLite database.

By the end of this experiment, you will understand Django's project structure, the role of each generated file, the purpose of key `manage.py` subcommands, and how to implement basic CRUD (Create, Read, Update, Delete) functionality.

---

## 2. Prerequisites

- Python 3.x installed on your system 
- Basic familiarity with the command line/terminal
- A text editor or IDE (VS Code, PyCharm, etc.)

---

## 3. Theory: What is Django?

Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design. It follows the **MVT (Model-View-Template)** architectural pattern:

- **Model**: Defines the data structure (database schema)
- **View**: Handles HTTP requests and business logic
- **Template**: Renders the HTML presentation layer

Django comes with built-in features including an ORM (Object-Relational Mapper), authentication system, admin panel, and URL routing .

---

## 4. Installation and Setup

### Step 1: Create a Virtual Environment (Recommended)

A virtual environment isolates your project dependencies from the system Python .

```bash
# Create a project directory
mkdir django_todo_app
cd django_todo_app

# Create virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### Step 2: Install Django

```bash
pip install django
```

Verify installation:

```bash
python -m django --version
```

### Step 3: Create the Django Project

```bash
django-admin startproject todo_project .
```

**Note**: The `.` at the end creates the project in the current directory. Without it, Django creates an extra nested folder .

---

## 5. Understanding the Project Structure

After running `startproject`, your directory should look like this :

```
django_todo_app/
├── manage.py
└── todo_project/
    ├── __init__.py
    ├── asgi.py
    ├── settings.py
    ├── urls.py
    └── wsgi.py
```

### File Explanations

| File | Purpose |
|------|---------|
| `manage.py` | Command-line utility for administrative tasks. You'll use this extensively. |
| `__init__.py` | Empty file that tells Python this directory is a package. |
| `settings.py` | Main configuration file: database, installed apps, middleware, templates, etc. |
| `urls.py` | The project's "table of contents" — routes URLs to views. |
| `wsgi.py` | Entry point for WSGI-compatible web servers (production). |
| `asgi.py` | Entry point for ASGI-compatible web servers (async support). |

**Important**: Never modify `wsgi.py` or `asgi.py` unless you know what you're doing .

---

## 6. Understanding `manage.py` and Its Subcommands

`manage.py` is automatically created in every Django project. It sets the `DJANGO_SETTINGS_MODULE` environment variable and delegates commands to `django-admin` .

General syntax:

```bash
python manage.py <command> [options]
```

### Essential Subcommands for This Experiment

| Subcommand | Purpose |
|------------|---------|
| `startapp` | Creates a new Django app within the project |
| `makemigrations` | Generates migration files based on changes in `models.py` |
| `migrate` | Applies migrations to the database (creates/updates tables) |
| `runserver` | Starts the Django development server |
| `createsuperuser` | Creates an admin user for the Django admin panel |
| `shell` | Opens an interactive Python shell with Django context |
| `dbshell` | Opens the database command-line client |
| `check` | Validates the project for common issues |
| `showmigrations` | Lists all migrations and their status |
| `sqlmigrate` | Displays the SQL for a specific migration |
| `collectstatic` | Gathers static files into a single directory |
| `dumpdata` | Outputs database data as JSON |
| `loaddata` | Loads data from a JSON fixture into the database |

### Detailed Explanation of Key Commands

**`makemigrations`**: After you define or modify models in `models.py`, this command creates migration files that describe the changes. These files live in the `migrations/` folder of each app .

```bash
python manage.py makemigrations todo
```

**`migrate`**: This command applies the migration files to the database, creating or altering tables. It also applies Django's built-in migrations for admin, auth, sessions, etc. .

```bash
python manage.py migrate
```

**`runserver`**: Starts a lightweight development web server. By default, it runs at `http://127.0.0.1:8000/`. You can specify a different port .

```bash
python manage.py runserver          # default port 8000
python manage.py runserver 8080     # custom port
```

**`createsuperuser`**: Creates an admin account that can log into Django's admin interface at `/admin/` .

```bash
python manage.py createsuperuser
```

**`shell`**: Opens an interactive Python shell with your Django project's settings loaded. Useful for testing ORM queries .

```bash
python manage.py shell
```

---

## 7. Building the To-Do Application

### Step 1: Create the To-Do App

A Django **project** can contain multiple **apps**. Each app is a self-contained module with a specific purpose .

```bash
python manage.py startapp todo
```

This creates the following structure :

```
todo/
├── migrations/
│   └── __init__.py
├── __init__.py
├── admin.py
├── apps.py
├── models.py
├── tests.py
└── views.py
```

### App File Explanations

| File | Purpose |
|------|---------|
| `models.py` | Define database models (tables) using Python classes |
| `views.py` | Handle HTTP requests and return responses |
| `admin.py` | Register models with Django's admin interface |
| `apps.py` | App-specific configuration |
| `tests.py` | Write unit tests |
| `migrations/` | Stores database migration files |

### Step 2: Register the App in `settings.py`

Open `todo_project/settings.py` and add `'todo'` to `INSTALLED_APPS`:

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'todo',  # Add this line
]
```

### Step 3: Define the Model

Edit `todo/models.py`:

```python
from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
```

This creates a `Task` table with three fields: `title`, `completed`, and `created_at`.

### Step 4: Create and Apply Migrations

```bash
python manage.py makemigrations todo
python manage.py migrate
```

The `makemigrations` command generates a migration file that describes the `Task` model. The `migrate` command actually creates the table in SQLite .

### Step 5: Create a Superuser (Optional but Recommended)

```bash
python manage.py createsuperuser
```

Follow the prompts to set username, email, and password.

### Step 6: Register the Model in Admin

Edit `todo/admin.py`:

```python
from django.contrib import admin
from .models import Task

admin.site.register(Task)
```

Now you can manage tasks through the admin panel at `http://127.0.0.1:8000/admin/`.

### Step 7: Create Views

Edit `todo/views.py`:

```python
from django.shortcuts import render, redirect
from .models import Task

def task_list(request):
    tasks = Task.objects.all().order_by('-created_at')
    return render(request, 'todo/task_list.html', {'tasks': tasks})

def add_task(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        if title:
            Task.objects.create(title=title)
        return redirect('task_list')
    return render(request, 'todo/add_task.html')

def toggle_task(request, task_id):
    task = Task.objects.get(id=task_id)
    task.completed = not task.completed
    task.save()
    return redirect('task_list')

def delete_task(request, task_id):
    task = Task.objects.get(id=task_id)
    task.delete()
    return redirect('task_list')
```

### Step 8: Create URLs

Create `todo/urls.py`:

```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.task_list, name='task_list'),
    path('add/', views.add_task, name='add_task'),
    path('toggle/<int:task_id>/', views.toggle_task, name='toggle_task'),
    path('delete/<int:task_id>/', views.delete_task, name='delete_task'),
]
```

Update `todo_project/urls.py` to include the todo app URLs:

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('todo.urls')),
]
```

### Step 9: Create Templates

Create a directory `todo/templates/todo/` and add these files:

**`task_list.html`**:

```html
<!DOCTYPE html>
<html>
<head>
    <title>To-Do List</title>
</head>
<body>
    <h1>My To-Do List</h1>
    <a href="{% url 'add_task' %}">Add New Task</a>
    <ul>
        {% for task in tasks %}
        <li>
            {% if task.completed %}
                <s>{{ task.title }}</s>
            {% else %}
                {{ task.title }}
            {% endif %}
            <a href="{% url 'toggle_task' task.id %}">Toggle</a>
            <a href="{% url 'delete_task' task.id %}">Delete</a>
        </li>
        {% empty %}
        <li>No tasks yet.</li>
        {% endfor %}
    </ul>
</body>
</html>
```

**`add_task.html`**:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Add Task</title>
</head>
<body>
    <h1>Add a New Task</h1>
    <form method="post">
        {% csrf_token %}
        <input type="text" name="title" placeholder="Task title" required>
        <button type="submit">Add</button>
    </form>
    <a href="{% url 'task_list' %}">Back to List</a>
</body>
</html>
```

### Step 10: Run the Server

```bash
python manage.py runserver
```

Open your browser and go to `http://127.0.0.1:8000/`. You should see your To-Do application.

---

## 8. Testing the Application

Test each CRUD operation:

1. **Create**: Click "Add New Task", enter a title, and submit.
2. **Read**: The task list displays all tasks.
3. **Update**: Click "Toggle" to mark a task as completed/incomplete.
4. **Delete**: Click "Delete" to remove a task.

You can also verify data persistence by stopping the server and restarting it — tasks should remain because SQLite stores them in `db.sqlite3` .

---

## 9. Summary of Commands Used

```bash
# Environment setup
python -m venv venv
source venv/bin/activate
pip install django

# Project creation
django-admin startproject todo_project .

# App creation
python manage.py startapp todo

# Database
python manage.py makemigrations todo
python manage.py migrate

# Admin user
python manage.py createsuperuser

# Development server
python manage.py runserver
```

---

## 10. Common Errors and Troubleshooting

| Error | Solution |
|-------|----------|
| `No module named django` | Activate virtual environment and run `pip install django` |
| `TemplateDoesNotExist` | Ensure template directory structure is correct: `todo/templates/todo/file.html` |
| `No such table: todo_task` | Run `python manage.py makemigrations todo` then `python manage.py migrate` |
| `Port already in use` | Use a different port: `python manage.py runserver 8080` |
| `CSRF verification failed` | Ensure `{% csrf_token %}` is included in all POST forms |

---

## 11. Conclusion

In this experiment, you have:

- Installed Django and created a project using `django-admin startproject`
- Understood the purpose of each file in a Django project
- Learned the essential `manage.py` subcommands
- Created a Django app and defined a database model
- Applied migrations to create SQLite tables
- Built views, URLs, and templates for a functional To-Do application
- Implemented full CRUD operations

Django's built-in ORM and admin interface allow rapid development without writing raw SQL. The same patterns — models, views, URLs, templates — apply to any Django application you build in the future.

---
# Lab Assignment Task
## Extend your todo application 

- To show use of `static` dir *Showing how to serve static files*.
- To show the use of `extend` and `include` in templating to make templating modular and reusable.