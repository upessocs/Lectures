# Experiment 15: Django To-Do Application — Complete Lab Manual

## 1. Objective

Build a working To-Do application using Django and SQLite. Then extend it to demonstrate Django Admin registration, reusable templates, and static assets.

By the end of this experiment, you will be able to:

- Explain the Django project/app structure and the MVT pattern.
- Create a model and use migrations to create database tables.
- Implement Create, Read, Update, and Delete (CRUD) operations.
- Configure URL routes, views, and templates.
- Register models in Django Admin and explain the roles of `admin.py` and `apps.py`.
- Reuse page layouts with `base.html`, `header.html`, `footer.html`, template inheritance, and template includes.
- Serve CSS, JavaScript, and image assets from a Django app.
- Test and troubleshoot a small Django application.

## 2. Prerequisites

- Python 3.x
- A terminal or command prompt
- A code editor such as VS Code or PyCharm
- Basic Python, HTML, and CSS knowledge
---
## 3. Theory: Django and the MVT pattern

Django is a Python web framework. It provides URL routing, database access through an Object-Relational Mapper (ORM), HTML templating, authentication, and an administrative interface.

Django commonly uses the Model–View–Template (MVT) pattern:

- **Model:** defines the data and database fields.
- **View:** receives an HTTP request, runs application logic, and returns a response.
- **Template:** describes the HTML presented to the user.
- **URL configuration:** maps a URL path to a view.

A typical request follows this path:

1. The browser requests a URL.
2. Django matches the URL against `urls.py`.
3. Django calls the mapped view.
4. The view reads or changes data through the model.
5. The view renders a template or redirects the browser.
6. Django returns the HTTP response.
---
## 4. Installation and project setup

### Step 1: Create and activate a virtual environment

A virtual environment keeps this project's Python packages separate from other projects.

```bash
mkdir django_todo_app
cd django_todo_app

# Create an isolated Python environment.
python -m venv venv

# Windows Command Prompt:
venv\Scripts\activate

# macOS/Linux (or Windows Git Bash):
source venv/bin/activate
```

Run only the activation command appropriate for your terminal.

### Step 2: Install Django

```bash
python -m pip install django
python -m django --version
```

Using `python -m pip` helps ensure that packages are installed into the Python environment currently selected by `python`.
---
### Step 3: Create the project

```bash
django-admin startproject todo_project .
```

The final dot tells Django to create the project in the current directory rather than creating another nested directory.

### Step 4: Create the application

```bash
python manage.py startapp todo
```

A **project** contains site-wide configuration. An **app** contains a feature or domain area. A project can contain multiple apps.

### Step 5: Register the app in settings

Open `todo_project/settings.py` and add `'todo'` to `INSTALLED_APPS`:

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'todo',  # Tell Django to load the To-Do application.
]
```

Registering an app allows Django to discover its models, migrations, and app configuration.
---
## 5. Understand the project structure

After the project and app have been created, the important files look like this:

```text
django_todo_app/
├── manage.py
├── db.sqlite3                 # Appears after database migrations.
├── todo_project/
│   ├── __init__.py
│   ├── settings.py             # Project configuration.
│   ├── urls.py                 # Project-level URL routes.
│   ├── asgi.py
│   └── wsgi.py
└── todo/
    ├── migrations/
    ├── __init__.py
    ├── admin.py                # Admin site registration.
    ├── apps.py                 # App configuration.
    ├── models.py               # Database models.
    ├── tests.py                # Automated tests.
    └── views.py                # Request-handling functions.
```

The templates and static directories will be added later.

| File | Purpose |
|---|---|
| `manage.py` | Runs Django management commands using this project's settings. |
| `settings.py` | Configures installed apps, database, middleware, templates, and static files. |
| `urls.py` | Maps URL paths to views. |
| `models.py` | Defines database-backed data structures. |
| `views.py` | Implements request-handling logic. |
| `admin.py` | Registers models and customizes their admin interface. |
| `apps.py` | Defines app metadata and optional startup configuration. |
| `migrations/` | Stores versioned database schema changes. |
---
## 6. Essential management commands

Run these from the directory containing `manage.py`.

```bash
# Create a new Django app.
python manage.py startapp todo

# Create migration files from model changes.
python manage.py makemigrations

# Apply migrations and create/update database tables.
python manage.py migrate

# Start the development server.
python manage.py runserver

# Create a user who can log in to Django Admin.
python manage.py createsuperuser

# Open an interactive Python shell with Django configured.
python manage.py shell

# Check the project for common configuration problems.
python manage.py check

# Show migration status.
python manage.py showmigrations
```

`makemigrations` creates migration files; `migrate` applies them to the database. These commands perform different jobs.
---
## 7. Build the working To-Do application

This section builds the user-facing application first. Do not depend on Django Admin to create or manage tasks during this section.

### Step 1: Define the Task model

Open `todo/models.py`:

```python
from django.db import models


class Task(models.Model):
    # Store the short description entered by the user.
    title = models.CharField(max_length=200)

    # New tasks are incomplete unless explicitly changed.
    completed = models.BooleanField(default=False)

    # Django records the creation time when the row is first saved.
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # Use the task title in the admin site and object representations.
        return self.title
```

The model defines three fields:

- `title`: a string limited to 200 characters.
- `completed`: a Boolean value, initially `False`.
- `created_at`: the timestamp assigned when the object is created.

The `__str__()` method returns a readable representation of a `Task` object.

### Step 2: Create and apply migrations

```bash
python manage.py makemigrations todo
python manage.py migrate
```

Django creates a migration for the `Task` model and applies it to the configured database. The default project uses SQLite, normally stored in `db.sqlite3`.

If you see `no such table: todo_task`, verify that the app is in `INSTALLED_APPS` and run both commands above.
---
### Step 3: Implement the views

Open `todo/views.py`:

```python
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_POST

from .models import Task


def task_list(request):
    # Read tasks from newest to oldest and pass them to the template.
    tasks = Task.objects.all().order_by('-created_at')
    return render(request, 'todo/task_list.html', {'tasks': tasks})


def add_task(request):
    # Only create a task when the form is submitted with POST.
    if request.method == 'POST':
        title = request.POST.get('title', '').strip()

        # Ignore empty or whitespace-only titles.
        if title:
            Task.objects.create(title=title)

        # Redirect after processing the form to avoid accidental resubmission.
        return redirect('task_list')

    # GET requests display the blank form.
    return render(request, 'todo/add_task.html')


@require_POST
def toggle_task(request, task_id):
    # Return a 404 response if the requested task does not exist.
    task = get_object_or_404(Task, pk=task_id)

    # Reverse the current completion state and save it to the database.
    task.completed = not task.completed
    task.save(update_fields=['completed'])

    return redirect('task_list')


@require_POST
def delete_task(request, task_id):
    # Fetch the task safely; a missing ID produces a 404 response.
    task = get_object_or_404(Task, pk=task_id)

    # Delete the database row.
    task.delete()

    return redirect('task_list')
```

Important concepts:

- `render()` combines a template with context data and returns an HTTP response.
- `redirect()` sends the browser to another URL, usually after a successful form submission.
- `get_object_or_404()` fetches an object or raises a 404 response if it does not exist.
- `@require_POST` restricts state-changing actions to POST requests.
- `Task.objects.all()` is a Django ORM query. `order_by('-created_at')` sorts newest first.
- `request.POST.get()` reads a submitted form value.
- The delete and toggle actions use POST forms so a simple link or crawler cannot accidentally change data. Django's CSRF protection is included in each form below.
---
### Step 4: Create app URL routes

Create `todo/urls.py`:

```python
from django.urls import path
from . import views

urlpatterns = [
    # The home page displays the task list.
    path('', views.task_list, name='task_list'),

    # The form page creates a new task.
    path('add/', views.add_task, name='add_task'),

    # These routes identify a task by its integer primary key.
    path('toggle/<int:task_id>/', views.toggle_task, name='toggle_task'),
    path('delete/<int:task_id>/', views.delete_task, name='delete_task'),
]
```

The `name` argument gives each route a stable name. Templates can use `{% url 'task_list' %}` instead of hardcoding a path.

### Step 5: Connect the app URLs to the project

Open `todo_project/urls.py`:

```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    # Django's built-in administrative interface.
    path('admin/', admin.site.urls),

    # Send the site's root URLs to the To-Do app.
    path('', include('todo.urls')),
]
```

`include()` delegates matching to the app's URL configuration. The admin route is kept separate from the user-facing To-Do routes.
---
### Step 6: Create the templates

Create this directory structure:

```text
todo/
└── templates/
    └── todo/
        ├── task_list.html
        └── add_task.html
```

Django's default app-template discovery finds templates stored in an installed app's `templates/` directory.

Create `todo/templates/todo/task_list.html`:

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My To-Do List</title>
</head>
<body>
    <main>
        <h1>My To-Do List</h1>
        <p><a href="{% url 'add_task' %}">Add a task</a></p>

        <ul>
            {% for task in tasks %}
                <li>
                    {% if task.completed %}
                        <s>{{ task.title }}</s> <span>(completed)</span>
                    {% else %}
                        {{ task.title }}
                    {% endif %}

                    <!-- POST is used because toggling changes stored data. -->
                    <form method="post" action="{% url 'toggle_task' task.id %}">
                        {% csrf_token %}
                        <button type="submit">
                            {% if task.completed %}Mark incomplete{% else %}Mark complete{% endif %}
                        </button>
                    </form>

                    <!-- Deletion is also a POST operation, not a plain link. -->
                    <form method="post" action="{% url 'delete_task' task.id %}">
                        {% csrf_token %}
                        <button type="submit">Delete</button>
                    </form>
                </li>
            {% empty %}
                <li>No tasks yet. Add your first task.</li>
            {% endfor %}
        </ul>
    </main>
</body>
</html>
```

Create `todo/templates/todo/add_task.html`:

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Add a Task</title>
</head>
<body>
    <main>
        <h1>Add a task</h1>

        <form method="post">
            {% csrf_token %}
            <label for="title">Task title</label>
            <input id="title" type="text" name="title"
                   maxlength="200" required>
            <button type="submit">Save task</button>
        </form>

        <p><a href="{% url 'task_list' %}">Back to task list</a></p>
    </main>
</body>
</html>
```

`{% csrf_token %}` adds a CSRF token to a POST form. Include it in every internal POST form that changes data.
---
### Step 7: Run and test the application

```bash
python manage.py check
python manage.py runserver
```

Open `http://127.0.0.1:8000/`.

Test the following operations:

1. **Create:** select “Add a task,” enter a title, and save it.
2. **Read:** confirm that the task appears on the home page.
3. **Update:** select “Mark complete,” then verify the title is shown as completed. Select “Mark incomplete” to reverse it.
4. **Delete:** select “Delete” and verify that the task disappears.
5. **Persistence:** stop and restart the server. Existing tasks should remain in SQLite.

At this stage, the To-Do application works independently of the Django Admin interface.
---
## 8. Separate topic: Register and manage tasks in Django Admin

Django Admin is a staff-facing interface for inspecting and managing database records. It is separate from the custom To-Do pages just created.

### Step 1: Create an administrator account

First, ensure migrations have been applied:

```bash
python manage.py migrate
python manage.py createsuperuser
```

Follow the prompts to create a username and password. The user must have appropriate staff permissions to access the admin site.

### Step 2: Register the model in `admin.py`

Open `todo/admin.py`:

```python
from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    # Show these fields as columns on the task listing page.
    list_display = ('title', 'completed', 'created_at')

    # Add a sidebar filter for the completion state.
    list_filter = ('completed',)

    # Allow staff to search task titles.
    search_fields = ('title',)

    # Make the completion field editable in the list, if desired.
    list_editable = ('completed',)
```

The `@admin.register(Task)` decorator registers the `Task` model with Django Admin and associates it with the custom `TaskAdmin` configuration. This is an alternative to the shorter `admin.site.register(Task)` statement.

`ModelAdmin` customizes how a model is presented in the admin site. Here, it adds columns, filters, search, and inline editing.

Open `http://127.0.0.1:8000/admin/`, sign in, and select Tasks.

### Step 3: What does `apps.py` do?

Open `todo/apps.py`. Django normally creates a class similar to this:

```python
from django.apps import AppConfig


class TodoConfig(AppConfig):
    # Use an integer primary key type for model IDs by default.
    default_auto_field = 'django.db.models.BigAutoField'

    # The Python package name of this app.
    name = 'todo'

    # Human-readable label used in places such as the admin site.
    verbose_name = 'To-Do Tasks'
```

`apps.py` defines the app's configuration. It is **not** the normal place to register models with the admin site. Model registration belongs in `admin.py`.

To explicitly reference this configuration, use the following entry in `INSTALLED_APPS`:

```python
INSTALLED_APPS = [
    # Other Django apps...
    'todo.apps.TodoConfig',
]
```

Use either `'todo'` or `'todo.apps.TodoConfig'`, not both.

#### When is `AppConfig.ready()` useful?

Django calls `ready()` when the app registry is populated. It is intended for startup tasks such as importing signal handlers, not for defining the admin listing.

For example, if an app later uses signals, it can import their definitions in `ready()`:

```python
from django.apps import AppConfig


class TodoConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'todo'

    def ready(self):
        # Import signal handlers so they are registered at startup.
        # This line is only appropriate if todo/signals.py exists.
        from . import signals  # noqa: F401
```

Do not add this example unless you have created `todo/signals.py`. Avoid database queries in `ready()`, because it can run during management commands and tests as well as server startup.

**Key distinction:**

| File | Responsibility |
|---|---|
| `models.py` | Defines the data model. |
| `admin.py` | Registers models and customizes their admin interface. |
| `apps.py` | Configures the app and optional startup initialization. |
| `settings.py` | Enables the app through `INSTALLED_APPS`. |

---
## 9. Separate topic: Template inheritance and reusable components

The two templates currently repeat the document structure. Template inheritance reduces duplication: common HTML goes into a parent template, while child templates provide page-specific content.

We will use all three of these reusable files:

- `base.html`: the shared HTML document, navigation area, and content block.
- `header.html`: the shared site header.
- `footer.html`: the shared footer.

### Step 1: Create a shared template directory

Create the following structure:

```text
todo/
└── templates/
    └── todo/
        ├── base.html
        ├── header.html
        ├── footer.html
        ├── task_list.html
        └── add_task.html
```

### Step 2: Create `header.html`

Create `todo/templates/todo/header.html`:

```html
<header class="site-header">
    <a class="site-title" href="{% url 'task_list' %}">Task Tracker</a>

    <nav aria-label="Main navigation">
        <a href="{% url 'task_list' %}">All tasks</a>
        <a href="{% url 'add_task' %}">Add task</a>
    </nav>
</header>
```

This file contains a reusable HTML fragment, not a complete HTML document. It can be inserted into another template with `{% include %}`.

### Step 3: Create `footer.html`

Create `todo/templates/todo/footer.html`:

```html
<footer class="site-footer">
    <p>Task Tracker — Django learning project</p>
</footer>
```

Keep shared footer content here so that changing it updates every page that includes it.

### Step 4: Create `base.html`

Create `todo/templates/todo/base.html`:

```html
{% load static %}
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Child templates can override the page title. -->
    <title>{% block title %}Task Tracker{% endblock %}</title>

    <!-- Load the shared stylesheet from the static-files system. -->
    <link rel="stylesheet" href="{% static 'todo/css/style.css' %}">

    <!-- Child templates can add page-specific CSS in this block. -->
    {% block extra_css %}{% endblock %}
</head>
<body>
    {% include 'todo/header.html' %}

    <main class="container">
        <!-- Child templates replace this block with page content. -->
        {% block content %}{% endblock %}
    </main>

    {% include 'todo/footer.html' %}

    <!-- Load shared JavaScript after the page markup. -->
    <script src="{% static 'todo/js/app.js' %}" defer></script>

    <!-- Child templates can add page-specific JavaScript here. -->
    {% block extra_js %}{% endblock %}
</body>
</html>
```

There are two different template features here:

- `{% extends 'todo/base.html' %}` inherits the overall document and fills its blocks.
- `{% include 'todo/header.html' %}` inserts a reusable fragment at that location.

A template that uses `{% extends %}` should place that tag first, before ordinary page markup. The child supplies the contents of blocks defined by the parent.

### Step 5: Update `task_list.html` to extend the base

Replace `todo/templates/todo/task_list.html` with:

```html
{% extends 'todo/base.html' %}

{% block title %}My Tasks | Task Tracker{% endblock %}

{% block content %}
    <section class="panel">
        <h1>My To-Do List</h1>
        <p>Track your work and mark tasks complete when they are done.</p>

        <p><a class="button" href="{% url 'add_task' %}">Add a task</a></p>

        <ul class="task-list">
            {% for task in tasks %}
                <li class="task-item">
                    <span class="{% if task.completed %}completed{% endif %}">
                        {{ task.title }}
                    </span>

                    <div class="task-actions">
                        <form method="post" action="{% url 'toggle_task' task.id %}">
                            {% csrf_token %}
                            <button type="submit">
                                {% if task.completed %}Mark incomplete{% else %}Mark complete{% endif %}
                            </button>
                        </form>

                        <form method="post" action="{% url 'delete_task' task.id %}">
                            {% csrf_token %}
                            <button class="danger" type="submit">Delete</button>
                        </form>
                    </div>
                </li>
            {% empty %}
                <li>No tasks yet. Add your first task.</li>
            {% endfor %}
        </ul>
    </section>
{% endblock %}
```

Notice that the child no longer needs `<!doctype html>`, `<html>`, `<head>`, or `<body>`. Those elements are inherited from `base.html`.
---
### Step 6: Update `add_task.html` to extend the base

Replace `todo/templates/todo/add_task.html` with:

```html
{% extends 'todo/base.html' %}

{% block title %}Add Task | Task Tracker{% endblock %}

{% block content %}
    <section class="panel">
        <h1>Add a task</h1>

        <form method="post" class="task-form">
            {% csrf_token %}
            <label for="title">Task title</label>
            <input id="title" type="text" name="title"
                   maxlength="200" required>
            <button type="submit">Save task</button>
        </form>

        <p><a href="{% url 'task_list' %}">Back to task list</a></p>
    </section>
{% endblock %}
```

### Step 7: Understand the difference between `extends` and `include`

| Feature | `extends` | `include` |
|---|---|---|
| Purpose | Inherit a parent page layout | Insert a reusable template fragment |
| Typical use | `base.html` | `header.html`, `footer.html` |
| Uses blocks | Yes; child templates override blocks | Not required |
| Example | `{% extends 'todo/base.html' %}` | `{% include 'todo/header.html' %}` |

A useful rule is to use inheritance for the page's overall structure and includes for reusable pieces of markup.
---
## 10. Separate topic: Static files — CSS, JavaScript, and images

Static files are assets that Django serves separately from dynamically rendered HTML. Typical assets include stylesheets, JavaScript files, logos, icons, and other images.

### Step 1: Create the static directory structure

Create these directories and files:

```text
todo/
└── static/
    └── todo/
        ├── css/
        │   └── style.css
        ├── js/
        │   └── app.js
        └── images/
            └── logo.png
```

Place your own image at `todo/static/todo/images/logo.png`. The filename and path are case-sensitive on many systems.

The extra `todo/` directory namespaces this app's assets and helps avoid filename collisions with other apps.

### Step 2: Configure static files

In `todo_project/settings.py`, Django's default configuration usually already contains:

```python
STATIC_URL = 'static/'
```

For this app-level static directory, no additional `STATICFILES_DIRS` setting is normally required because `django.contrib.staticfiles` is installed and the `todo` app is listed in `INSTALLED_APPS`.

During development, with `DEBUG = True`, Django's development server can serve discovered static files. This setup is not a production static-file deployment strategy. In production, configure a web server or static-file service and run `python manage.py collectstatic` as part of deployment.

### Step 3: Create the CSS stylesheet

Create `todo/static/todo/css/style.css`:

```css
/* Use a consistent box model so element sizes are easier to reason about. */
* {
    box-sizing: border-box;
}

body {
    margin: 0;
    font-family: Arial, sans-serif;
    line-height: 1.5;
    color: #202938;
    background: #f4f6fa;
}

.site-header,
.site-footer {
    padding: 1rem 5%;
    background: #ffffff;
}

.site-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    border-bottom: 1px solid #d8deea;
}

.site-title {
    font-weight: 700;
    text-decoration: none;
}

.site-header nav {
    display: flex;
    gap: 1rem;
}

.container {
    width: min(900px, 92%);
    margin: 2rem auto;
}

.panel {
    padding: 1.5rem;
    background: #ffffff;
    border: 1px solid #d8deea;
    border-radius: 0.75rem;
}

.task-list {
    padding: 0;
    list-style: none;
}

.task-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.9rem 0;
    border-bottom: 1px solid #e5e9f1;
}

.task-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.completed {
    color: #687386;
    text-decoration: line-through;
}

button,
.button {
    display: inline-block;
    padding: 0.55rem 0.85rem;
    border: 0;
    border-radius: 0.35rem;
    background: #2457c5;
    color: white;
    font: inherit;
    text-decoration: none;
    cursor: pointer;
}

button.danger {
    background: #a62b37;
}

.task-form {
    display: grid;
    gap: 0.75rem;
    max-width: 30rem;
}

.task-form input {
    padding: 0.65rem;
    border: 1px solid #aeb8c8;
    border-radius: 0.35rem;
}

.site-footer {
    border-top: 1px solid #d8deea;
    text-align: center;
}

@media (max-width: 600px) {
    /* Stack navigation and task controls on narrow screens. */
    .site-header,
    .task-item {
        align-items: flex-start;
        flex-direction: column;
    }
}
```

### Step 4: Create a JavaScript file

Create `todo/static/todo/js/app.js`:

```javascript
// Run this function after the HTML document has been parsed.
document.addEventListener("DOMContentLoaded", function () {
    // Select the task-title input, if the current page contains it.
    const titleInput = document.querySelector("#title");

    // Focus the input on the Add Task page to speed up data entry.
    if (titleInput) {
        titleInput.focus();
    }

    // Log a simple message for students to verify that the file loaded.
    console.log("Task Tracker JavaScript loaded.");
});
```

The `DOMContentLoaded` event fires after the document has been parsed. The `querySelector()` method finds the first element matching a CSS selector. The `if` statement prevents errors on pages without the title input.

Open the browser's developer tools and check the Console to verify the message appears. Remove or replace the log message in a production application.

### Step 5: Add an image to the shared header

Update `todo/templates/todo/header.html`:

```html
<header class="site-header">
    <a class="site-title" href="{% url 'task_list' %}">
        <!-- The static template tag generates the correct asset URL. -->
        <img src="{% static 'todo/images/logo.png' %}"
             alt="Task Tracker logo" width="40" height="40">
        <span>Task Tracker</span>
    </a>

    <nav aria-label="Main navigation">
        <a href="{% url 'task_list' %}">All tasks</a>
        <a href="{% url 'add_task' %}">Add task</a>
    </nav>
</header>
```

Because the header uses `{% static %}`, it must load the static template library. Add `{% load static %}` as the first line of `header.html`:

```django
{% load static %}
```

Template libraries loaded in one template should not be assumed to be available in a separately included template, so load `static` in any template that uses the `{% static %}` tag. `base.html` already loads it for its own stylesheet and script.

### Step 6: Verify the static asset URLs

Start the development server and inspect the page source or browser Network panel. The stylesheet, JavaScript, and image should load successfully.

Typical development URLs look like:

```text
/static/todo/css/style.css
/static/todo/js/app.js
/static/todo/images/logo.png
```

Do not hardcode these paths in templates. Use `{% static 'todo/css/style.css' %}` so Django can generate the URL using the configured `STATIC_URL`.

If a file returns 404, check:

1. `django.contrib.staticfiles` is in `INSTALLED_APPS`.
2. `todo` is in `INSTALLED_APPS`.
3. The file is inside `todo/static/todo/...`.
4. The template includes `{% load static %}`.
5. The path passed to `{% static %}` matches the directory and filename exactly.
---
## 11. Final assignment: Improve the To-Do application

### Assignment title

**Develop a branded, responsive Task Tracker using Django templates and static assets.**

### Scenario

Extend the working To-Do application into a small, polished task tracker. Keep the existing database model and CRUD operations working. Your application must use a shared template, separate header and footer templates, and static CSS, JavaScript, and image files.

### Functional requirements

1. Display all tasks on the home page.
2. Allow users to add tasks.
3. Allow users to mark tasks complete or incomplete.
4. Allow users to delete tasks.
5. Display a useful message when there are no tasks.
6. Preserve tasks after the development server is restarted.
7. Keep all state-changing actions protected by CSRF tokens and use POST requests.
8. Register the `Task` model in Django Admin with a useful list display, filter, and search.

### Template requirements

1. Create `base.html` containing the HTML document structure, page title block, shared stylesheet, header include, content block, footer include, and shared JavaScript.
2. Create `header.html` containing the application name/logo and navigation links.
3. Create `footer.html` containing a footer message.
4. Make both `task_list.html` and `add_task.html` extend `base.html`.
5. Use `{% include %}` for the shared header and footer.
6. Use named URL routes with `{% url %}` instead of hardcoded internal application paths.
7. Add at least one page-specific block, such as `extra_css` or `extra_js`, to demonstrate child-template customization.

### Static asset requirements

Create the following files:

```text
todo/static/todo/
├── css/
│   └── style.css
├── js/
│   └── app.js
└── images/
    └── logo.png
```

Hints:

- Put CSS rules in `style.css`; do not place the entire stylesheet inline in each template.
- Link the stylesheet from `base.html` using `{% load static %}` and `{% static 'todo/css/style.css' %}`.
- Link JavaScript using `{% static 'todo/js/app.js' %}`. Use `defer` or place the script near the end of the body.
- Put a logo or other image in the images directory and display it with `{% static 'todo/images/logo.png' %}`.
- Include meaningful `alt` text for images.
- Use responsive CSS, such as a media query, so the page works on a narrow mobile screen.
- Use JavaScript for a small user-interface enhancement, such as focusing the task input, confirming a delete action, or displaying a character count. Do not rely on JavaScript alone for data validation.
- Keep the `todo/` namespace in the static path to avoid collisions with assets from other apps.
- In development, verify static files using the browser Network panel. For production, configure static hosting and run `collectstatic`.

### Suggested implementation plan

1. Confirm the original CRUD application works before changing templates.
2. Create `header.html`, `footer.html`, and `base.html`.
3. Convert `task_list.html` and `add_task.html` to use `{% extends %}` and `{% block content %}`.
4. Create the static directories and add CSS, JavaScript, and an image.
5. Link all assets using `{% static %}`.
6. Configure the Django Admin list display, filtering, and search.
7. Run `python manage.py check` and test every route.
8. Use the browser developer tools to inspect the Console and Network panels.
9. Test the layout at desktop and mobile widths.
10. Capture screenshots of the home page, add-task page, and admin task list for submission.

### Testing checklist

- [ ] Home page lists tasks correctly.
- [ ] Adding a task creates a database record.
- [ ] Complete/incomplete state can be changed.
- [ ] Deleting a task removes it.
- [ ] Empty task list has a helpful message.
- [ ] POST forms contain `{% csrf_token %}`.
- [ ] Both page templates extend `base.html`.
- [ ] Header and footer are included from separate templates.
- [ ] CSS loads and changes the page appearance.
- [ ] JavaScript loads without Console errors.
- [ ] Logo/image loads with correct alternative text.
- [ ] Layout remains usable on a narrow screen.
- [ ] Django Admin shows tasks with list display, filter, and search.
- [ ] Tasks remain in the database after a server restart.

### Submission

Submit:

1. The Django project source code, excluding the virtual environment.
2. The `todo/templates/todo/` templates.
3. The `todo/static/todo/` CSS, JavaScript, and image assets.
4. Screenshots showing the home page, add-task page, and Django Admin task list.
5. A short explanation of the difference between `admin.py` and `apps.py`, and between `extends` and `include`.

### Evaluation rubric (20 marks)

| Criterion | Marks |
|---|---:|
| CRUD operations and database persistence | 5 |
| Correct URL routing, views, and CSRF-safe forms | 3 |
| Admin registration and configuration | 2 |
| Template inheritance using `base.html` | 3 |
| Reusable header/footer includes | 2 |
| Correct CSS, JavaScript, and image loading | 3 |
| Responsive layout and testing evidence | 2 |
| **Total** | **20** |

## 12. Troubleshooting

| Problem | Checks and solution |
|---|---|
| `No module named django` | Activate the virtual environment and run `python -m pip install django`. |
| `/admin/` shows a database/table error | Run `python manage.py migrate`. The admin, auth, and session tables are created by Django migrations. |
| `no such table: todo_task` | Ensure `todo` is in `INSTALLED_APPS`, then run `python manage.py makemigrations todo` and `python manage.py migrate`. |
| Admin login fails | Create a superuser with `python manage.py createsuperuser`; verify the account has staff/superuser permissions. |
| `TemplateDoesNotExist` | Check the exact path under `todo/templates/todo/` and ensure the app is installed. |
| `NoReverseMatch` | Check the route names in `todo/urls.py` and the names used in `{% url %}`. |
| CSRF verification error | Include `{% csrf_token %}` inside each internal POST form. |
| Static CSS, JavaScript, or image returns 404 | Check `INSTALLED_APPS`, the `static/todo/...` directory structure, `{% load static %}`, and the path passed to `{% static %}`. |
| JavaScript is not running | Check the browser Console and Network panels, verify the script URL, and check for syntax errors. |
| Port is already in use | Run `python manage.py runserver 8080`. |

## 13. Conclusion

This experiment builds a complete Django CRUD application before extending it with the framework's administrative and presentation features. It demonstrates how models, views, URL routes, and templates work together; why `admin.py` is responsible for model registration while `apps.py` configures the app; and how `base.html`, `header.html`, and `footer.html` reduce duplicated markup. Finally, it shows how to organize and load CSS, JavaScript, and images with Django's static-files system.
