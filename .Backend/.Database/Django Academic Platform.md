# Django Academic Platform: Complete Incremental Tutorial

This tutorial will build the platform from an empty directory into a deployable Django application with:

* NixOS development environment
* `shell.nix`
* Pipenv
* Django fundamentals
* SQLite for initial development
* PostgreSQL for production
* Self-contained Django applications
* HTML templates inside each application
* User registration and authentication
* Courses and assignments
* Time-limited document sharing
* Student file submissions
* File validation and processing
* Django REST Framework APIs
* API authentication and permissions
* Testing
* Docker
* Docker Compose
* Development and production environments
* Jenkins CI/CD
* Caddy reverse proxy
* Optional FastAPI service for genuinely separate workloads
* Optional n8n integration as an addon, not part of the core architecture

The project will be developed **incrementally**. Do not create the entire final directory structure at the beginning.

---

# 1. What We Are Building

The initial problem is:

> An instructor should be able to create a course/assignment, publish documents for a limited time, and allow authenticated students to submit files during a specified window.

The final system will look approximately like this:

```text
                         Internet
                            |
                            v
                     Cloudflare Tunnel
                            |
                            v
                          Caddy
                            |
                            v
                 academic-platform:8000
                            |
                    +-------+-------+
                    |               |
                    v               v
                 Django          PostgreSQL
                    |
        +-----------+------------+
        |           |            |
        v           v            v
     Accounts    Courses    Assignments
                                |
                                v
                           Submissions
                                |
                                v
                              Files
```

Later:

```text
                    Django REST API
                           |
             +-------------+-------------+
             |                           |
             v                           v
       Web/mobile client          External clients
```

And only if needed:

```text
Django
   |
   +---- FastAPI
            |
            +---- OCR
            +---- AI inference
            +---- PDF processing
            +---- ML workloads
```

n8n is deliberately **not part of the core system**.

It can later be connected as an optional automation layer:

```text
Django
   |
   +---- n8n
          |
          +---- Email
          +---- Telegram
          +---- Notifications
          +---- External APIs
```

---

# 2. Why Django Instead of Django + FastAPI Initially?

Django itself can provide:

* HTML pages
* authentication
* forms
* database access
* file uploads
* permissions
* sessions
* admin interface
* REST APIs

For REST APIs, we will later add:

```text
Django REST Framework
```

So initially:

```text
Django
├── Web application
├── Database
├── Authentication
├── File handling
├── Business logic
└── REST API
```

There is no architectural requirement that the API must be FastAPI.

FastAPI becomes useful if we later have a service with a substantially different responsibility, such as:

```text
Django
   |
   +---- FastAPI AI service
             |
             +---- model inference
             +---- OCR
             +---- document extraction
```

That is a later architectural decision.

---

# 3. The Most Important Architectural Decision

We will **not** organize the project like this:

```text
templates/
views/
models/
forms/
```

with everything from every feature mixed together.

Instead, each Django application owns its functionality.

For example:

```text
apps/assignments/

├── models.py
├── views.py
├── forms.py
├── urls.py
├── admin.py
├── tests.py
│
├── templates/
│   └── assignments/
│       ├── list.html
│       ├── detail.html
│       └── create.html
│
├── static/
│   └── assignments/
│
└── api/
    ├── serializers.py
    ├── views.py
    ├── urls.py
    └── tests.py
```

This gives us a modular architecture.

The main Django project only wires applications together.

```text
config/
    ↓
    "assignments URLs are here"
    ↓
apps/assignments/
    ↓
    models
    views
    forms
    templates
    API
    tests
```

This is the structure we will establish early in the tutorial.

---

# 4. Final Project Structure

Do not create all of this yet. This is our target architecture.

```text
academic-platform/
│
├── config/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── apps/
│   │
│   ├── core/
│   │   ├── migrations/
│   │   ├── templates/
│   │   │   └── core/
│   │   ├── static/
│   │   │   └── core/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── urls.py
│   │   ├── views.py
│   │   └── tests.py
│   │
│   ├── accounts/
│   │   ├── migrations/
│   │   ├── templates/
│   │   │   └── accounts/
│   │   ├── static/
│   │   │   └── accounts/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── forms.py
│   │   ├── models.py
│   │   ├── urls.py
│   │   ├── views.py
│   │   └── tests.py
│   │
│   ├── courses/
│   │   ├── migrations/
│   │   ├── templates/
│   │   │   └── courses/
│   │   ├── static/
│   │   │   └── courses/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── urls.py
│   │   ├── views.py
│   │   └── tests.py
│   │
│   ├── assignments/
│   │   ├── migrations/
│   │   ├── templates/
│   │   │   └── assignments/
│   │   ├── static/
│   │   │   └── assignments/
│   │   ├── api/
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   ├── views.py
│   │   │   └── tests.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── forms.py
│   │   ├── models.py
│   │   ├── urls.py
│   │   ├── views.py
│   │   └── tests.py
│   │
│   └── submissions/
│       ├── migrations/
│       ├── templates/
│       │   └── submissions/
│       ├── static/
│       │   └── submissions/
│       ├── api/
│       ├── admin.py
│       ├── apps.py
│       ├── forms.py
│       ├── models.py
│       ├── urls.py
│       ├── views.py
│       └── tests.py
│
├── manage.py
│
├── media/
├── staticfiles/
│
├── Pipfile
├── Pipfile.lock
├── shell.nix
├── Dockerfile
├── compose.yaml
├── compose.dev.yaml
├── Jenkinsfile
├── .env
├── .gitignore
└── README.md
```

---

# 5. Stage 1 — NixOS Development Environment

We first create a reproducible development environment.

Create the project:

```bash
mkdir academic-platform
cd academic-platform
```

Create:

```text
shell.nix
```

with:

```nix
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  packages = with pkgs; [
    python312
    pipenv
    git
  ];

  shellHook = ''
    echo "Academic Platform development environment"
    python --version
    pipenv --version
  '';
}
```

Enter the environment:

```bash
nix-shell
```

Verify:

```bash
python --version
pipenv --version
git --version
```

The important distinction is:

```text
Nix
 └── provides the development environment

Pipenv
 └── manages Python project dependencies

Django
 └── provides the web framework
```

We are deliberately learning these as separate concepts.

---

# 6. Stage 2 — Pipenv

Initialize Pipenv:

```bash
pipenv --python 3.12
```

Install Django:

```bash
pipenv install django
```

Install development tools:

```bash
pipenv install --dev pytest pytest-django ruff
```

We now have:

```text
shell.nix
    ↓
Python 3.12
    ↓
Pipenv
    ↓
Django
```

Check:

```bash
pipenv run django-admin --version
```

The `Pipfile` records direct dependencies.

`Pipfile.lock` records the resolved versions.

---

# 7. Stage 3 — Create the Django Project

Run:

```bash
pipenv run django-admin startproject config .
```

We get:

```text
academic-platform/
├── config/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── manage.py
├── Pipfile
├── Pipfile.lock
└── shell.nix
```

Run Django:

```bash
pipenv run python manage.py runserver
```

At this point, Django is working.

---

# 8. Understand Project vs Application

This distinction is fundamental.

A **Django project** is the overall website/application configuration.

A **Django application** is a reusable piece of functionality.

For us:

```text
academic-platform
       |
       v
     Django project
       |
       +---- accounts application
       |
       +---- courses application
       |
       +---- assignments application
       |
       +---- submissions application
```

Do not think:

```text
one Django app = one website
```

Instead:

```text
one Django project
    =
multiple Django applications
```

---

# 9. Stage 4 — Establish Our Application Architecture

Create an `apps` directory:

```bash
mkdir apps
touch apps/__init__.py
```

Create our first application:

```bash
pipenv run python manage.py startapp core apps/core
```

Now:

```text
apps/
└── core/
    ├── migrations/
    ├── admin.py
    ├── apps.py
    ├── models.py
    ├── tests.py
    └── views.py
```

We will add:

```text
templates/
static/
urls.py
```

inside the application.

---

# 10. Register the Application

Open:

```text
apps/core/apps.py
```

It should contain:

```python
from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.core"
```

Add the application to:

```text
config/settings.py
```

```python
INSTALLED_APPS = [
    # Django's built-in applications.
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Applications belonging to this project.
    "apps.core",
]
```

---

# 11. Stage 5 — Application-Owned URLs

Create:

```text
apps/core/urls.py
```

```python
from django.urls import path

from . import views

app_name = "core"

urlpatterns = [
    path("", views.home, name="home"),
]
```

Create the view:

```python
# apps/core/views.py

from django.shortcuts import render


def home(request):
    # Render the home page owned by the core application.
    return render(request, "core/home.html")
```

Now create:

```text
apps/core/templates/core/home.html
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Academic Platform</title>
</head>
<body>
    <h1>Academic Platform</h1>

    <p>Django is working.</p>
</body>
</html>
```

Now connect the application to the project.

Open:

```text
config/urls.py
```

```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),

    # The core application owns the site's root URL.
    path("", include("apps.core.urls")),
]
```

This illustrates the architecture:

```text
config/urls.py
      |
      +---- apps.core.urls
                  |
                  +---- apps.core.views
                              |
                              +---- core/home.html
```

The project only performs the wiring.

---

# 12. Why Templates Are Inside the Application

This is intentional.

We use:

```text
apps/core/templates/core/home.html
```

rather than:

```text
templates/core/home.html
```

The application therefore contains:

```text
core/
├── views.py
├── urls.py
├── models.py
└── templates/
    └── core/
```

Django automatically searches templates from installed applications when:

```python
APP_DIRS = True
```

which is part of the normal Django template configuration.

---

# 13. Stage 6 — Template Inheritance

Once the application structure works, introduce a common layout.

Create:

```text
apps/core/templates/core/base.html
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <title>
        {% block title %}
        Academic Platform
        {% endblock %}
    </title>
</head>

<body>

<header>
    <nav>
        <a href="{% url 'core:home' %}">
            Home
        </a>
    </nav>
</header>

<main>
    {% block content %}
    {% endblock %}
</main>

</body>
</html>
```

Then change `home.html`:

```html
{% extends "core/base.html" %}

{% block title %}
Home
{% endblock %}

{% block content %}

<h1>Academic Platform</h1>

<p>Welcome to the academic platform.</p>

{% endblock %}
```

Now every application can use a common site layout.

Later, we can move a genuinely global base template to:

```text
templates/base.html
```

if appropriate.

The application-specific templates should still remain with their applications.

---

# 14. Stage 7 — SQLite

Django initially uses SQLite.

Conceptually:

```text
Django
   |
   v
SQLite database
   |
   v
db.sqlite3
```

SQLite is an embedded database.

There is no separate database server to install.

Django's default configuration contains:

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}
```

This is excellent for learning because:

* almost no setup
* one file
* easy backups
* easy local development
* good for small development workloads

But production will eventually use PostgreSQL.

---

# 15. What a Database Model Means

A Django model is a Python representation of database data.

For example:

```python
class Assignment(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
```

Django translates this into database structures.

Conceptually:

```text
Python model
      |
      | makemigrations
      v
Migration
      |
      | migrate
      v
Database table
```

---

# 16. Stage 8 — Courses Application

Create:

```bash
pipenv run python manage.py startapp courses apps/courses
```

Register:

```python
INSTALLED_APPS = [
    ...
    "apps.core",
    "apps.courses",
]
```

Change:

```text
apps/courses/apps.py
```

to use:

```python
name = "apps.courses"
```

Create:

```text
apps/courses/urls.py
```

```python
from django.urls import path

from . import views

app_name = "courses"

urlpatterns = [
    path("", views.course_list, name="list"),
]
```

Create:

```text
apps/courses/views.py
```

```python
from django.shortcuts import render


def course_list(request):
    # The database query will be added when the Course model is introduced.
    return render(request, "courses/list.html")
```

Create:

```text
apps/courses/templates/courses/list.html
```

```html
{% extends "core/base.html" %}

{% block title %}
Courses
{% endblock %}

{% block content %}

<h1>Courses</h1>

<p>Course listing will appear here.</p>

{% endblock %}
```

Connect it:

```python
# config/urls.py

urlpatterns = [
    path("admin/", admin.site.urls),

    path("", include("apps.core.urls")),
    path("courses/", include("apps.courses.urls")),
]
```

We now have:

```text
/              → core
/courses/      → courses
```

---

# 17. Stage 9 — Course Model

Create the model:

```python
# apps/courses/models.py

from django.db import models


class Course(models.Model):
    # Name displayed to students and instructors.
    name = models.CharField(max_length=200)

    # Optional course code such as CSFS3008.
    code = models.CharField(max_length=50, unique=True)

    # Optional description shown on the course page.
    description = models.TextField(blank=True)

    def __str__(self):
        # This is how the object appears in Django admin and debugging output.
        return f"{self.code} - {self.name}"
```

Create migration:

```bash
pipenv run python manage.py makemigrations
```

Apply it:

```bash
pipenv run python manage.py migrate
```

This demonstrates the migration workflow:

```text
models.py
   ↓
makemigrations
   ↓
migration file
   ↓
migrate
   ↓
SQLite
```

---

# 18. Stage 10 — Django Admin

Register the model:

```python
# apps/courses/admin.py

from django.contrib import admin

from .models import Course


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("code", "name")
    search_fields = ("code", "name")
```

Create an administrator:

```bash
pipenv run python manage.py createsuperuser
```

Run:

```bash
pipenv run python manage.py runserver
```

Visit:

```text
/admin/
```

The admin interface is one of Django's major advantages for this project.

Instead of building instructor management pages immediately, we can initially use Django Admin to create:

* courses
* assignments
* users
* resources

Later, custom instructor dashboards can be added.

---

# 19. Stage 11 — User Authentication

Django already provides:

```text
User
Authentication
Sessions
Groups
Permissions
Password hashing
Login
Logout
```

We don't need to create our own authentication system.

Create:

```bash
pipenv run python manage.py startapp accounts apps/accounts
```

Register:

```python
"apps.accounts",
```

The initial architecture can use Django's built-in `User`.

Later, if the project requires university-specific identity fields, we can introduce:

```text
Profile
```

or a custom user model.

For a new project, if we know from the beginning that university-specific authentication will be required, we should decide the custom-user strategy **before production**. Changing user models later is considerably more complicated than adding ordinary models.

---

# 20. Login and Logout

Django provides authentication views.

In:

```text
config/urls.py
```

we can initially use:

```python
path(
    "accounts/",
    include("django.contrib.auth.urls"),
),
```

This provides routes such as:

```text
/accounts/login/
/accounts/logout/
```

Create:

```text
apps/accounts/templates/registration/login.html
```

```html
{% extends "core/base.html" %}

{% block title %}
Login
{% endblock %}

{% block content %}

<h1>Login</h1>

<form method="post">
    {% csrf_token %}

    {{ form.as_p }}

    <button type="submit">
        Login
    </button>
</form>

{% endblock %}
```

The application-specific account pages can remain inside:

```text
apps/accounts/templates/accounts/
```

while Django's conventional login template location remains:

```text
registration/login.html
```

---

# 21. Stage 12 — Assignments

Create:

```bash
pipenv run python manage.py startapp assignments apps/assignments
```

Register:

```python
"apps.assignments",
```

The assignment model:

```python
# apps/assignments/models.py

from django.db import models
from django.utils import timezone


class Assignment(models.Model):
    # Human-readable assignment title.
    title = models.CharField(max_length=200)

    # Assignment instructions.
    description = models.TextField(blank=True)

    # Course to which this assignment belongs.
    course = models.ForeignKey(
        "courses.Course",
        on_delete=models.CASCADE,
        related_name="assignments",
    )

    # Document distributed to students.
    document = models.FileField(
        upload_to="assignments/"
    )

    # Time when students can start accessing/submitting.
    opens_at = models.DateTimeField()

    # Deadline after which submissions are rejected.
    closes_at = models.DateTimeField()

    # Allows an instructor to disable the assignment manually.
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    def is_open(self):
        # Always use server-side time.
        # A browser countdown cannot enforce a deadline securely.
        now = timezone.now()

        return (
            self.is_active
            and self.opens_at <= now
            and now <= self.closes_at
        )
```

Run:

```bash
pipenv run python manage.py makemigrations
pipenv run python manage.py migrate
```

---

# 22. Why `is_open()` Matters

A frontend might show:

```text
Submission closes in:
01:42:32
```

But the browser cannot be trusted to enforce the deadline.

A student could manipulate:

* JavaScript
* browser clock
* HTTP requests
* frontend state

Therefore:

```text
Browser
   |
   | "Submit"
   v
Django
   |
   +---- Is user authenticated?
   |
   +---- Is assignment active?
   |
   +---- Is current server time within window?
   |
   +---- Is file valid?
   |
   +---- Save submission
```

The server makes the final decision.

---

# 23. Stage 13 — Assignment Views

Create:

```text
apps/assignments/views.py
```

Initially:

```python
from django.shortcuts import get_object_or_404, render

from .models import Assignment


def assignment_list(request):
    assignments = Assignment.objects.all()

    return render(
        request,
        "assignments/list.html",
        {"assignments": assignments},
    )


def assignment_detail(request, pk):
    assignment = get_object_or_404(
        Assignment,
        pk=pk,
    )

    return render(
        request,
        "assignments/detail.html",
        {"assignment": assignment},
    )
```

URLs:

```python
from django.urls import path

from . import views

app_name = "assignments"

urlpatterns = [
    path("", views.assignment_list, name="list"),
    path("<int:pk>/", views.assignment_detail, name="detail"),
]
```

Project URL:

```python
path(
    "assignments/",
    include("apps.assignments.urls"),
),
```

---

# 24. Stage 14 — Assignment Templates

Create:

```text
apps/assignments/templates/assignments/list.html
```

```html
{% extends "core/base.html" %}

{% block title %}
Assignments
{% endblock %}

{% block content %}

<h1>Assignments</h1>

{% for assignment in assignments %}

<article>
    <h2>
        <a href="{% url 'assignments:detail' assignment.pk %}">
            {{ assignment.title }}
        </a>
    </h2>

    <p>
        Course: {{ assignment.course }}
    </p>

    <p>
        Opens: {{ assignment.opens_at }}
    </p>

    <p>
        Closes: {{ assignment.closes_at }}
    </p>
</article>

{% empty %}

<p>No assignments are currently available.</p>

{% endfor %}

{% endblock %}
```

---

# 25. Stage 15 — Student Submissions

Create:

```bash
pipenv run python manage.py startapp submissions apps/submissions
```

Register:

```python
"apps.submissions",
```

Model:

```python
# apps/submissions/models.py

from django.conf import settings
from django.db import models

from apps.assignments.models import Assignment


class Submission(models.Model):
    # Identifies the assignment receiving the submission.
    assignment = models.ForeignKey(
        Assignment,
        on_delete=models.CASCADE,
        related_name="submissions",
    )

    # The authenticated student who submitted the file.
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="submissions",
    )

    # Uploaded student file.
    file = models.FileField(
        upload_to="submissions/"
    )

    # Server-side timestamp of submission.
    submitted_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["student", "assignment"],
                name="one_submission_per_assignment",
            )
        ]

    def __str__(self):
        return f"{self.student} - {self.assignment}"
```

The constraint prevents:

```text
Student A
    ↓
Assignment 1
    ↓
Submission 1

Student A
    ↓
Assignment 1
    ↓
Submission 2
```

if the requirement is one submission per student.

Later we can change this design to allow:

```text
Submission 1
Submission 2
Submission 3
```

if resubmission is required.

---

# 26. Stage 16 — File Upload Form

Create:

```text
apps/submissions/forms.py
```

```python
from django import forms

from .models import Submission


class SubmissionForm(forms.ModelForm):
    class Meta:
        model = Submission
        fields = ["file"]

    def clean_file(self):
        # Retrieve the uploaded file from the form.
        uploaded_file = self.cleaned_data["file"]

        # Example initial size limit.
        # The production value should be selected according to requirements.
        max_size = 10 * 1024 * 1024

        if uploaded_file.size > max_size:
            raise forms.ValidationError(
                "File size must not exceed 10 MB."
            )

        return uploaded_file
```

This introduces Django's validation layer.

Eventually we can validate:

* file size
* extension
* MIME type
* filename
* PDF integrity
* archive contents
* malicious uploads
* duplicate files
* assignment-specific requirements

---

# 27. Stage 17 — Enforce the Submission Window

The submission view should look conceptually like:

```python
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render

from apps.assignments.models import Assignment

from .forms import SubmissionForm


@login_required
def submit_assignment(request, assignment_id):
    assignment = get_object_or_404(
        Assignment,
        pk=assignment_id,
    )

    # The server independently checks the submission deadline.
    if not assignment.is_open():
        return render(
            request,
            "submissions/closed.html",
            {"assignment": assignment},
        )

    if request.method == "POST":
        form = SubmissionForm(request.POST, request.FILES)

        if form.is_valid():
            submission = form.save(commit=False)

            # Associate the submission with the current user.
            submission.student = request.user

            # Associate the submission with this assignment.
            submission.assignment = assignment

            submission.save()

            return redirect(
                "submissions:success"
            )

    else:
        form = SubmissionForm()

    return render(
        request,
        "submissions/upload.html",
        {
            "assignment": assignment,
            "form": form,
        },
    )
```

This is an important security pattern:

```text
@login_required
       +
server-side deadline
       +
server-side validation
       +
database constraints
```

The browser is only the user interface.

---

# 28. Stage 18 — PostgreSQL

Once the Django fundamentals are understood, introduce PostgreSQL.

The architecture changes from:

```text
Django
  |
SQLite file
```

to:

```text
Django
  |
PostgreSQL server
```

SQLite:

```text
Simple
Embedded
Single file
Excellent for development
```

PostgreSQL:

```text
Client/server
Concurrent connections
Strong transactional capabilities
Better production database
```

For this project:

```text
SQLite
    ↓
learning/local development

PostgreSQL
    ↓
production
```

---

# 29. Configure PostgreSQL

Install the Django PostgreSQL driver:

```bash
pipenv install psycopg
```

Production settings should obtain database credentials from environment variables rather than hard-coding passwords.

Conceptually:

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ["POSTGRES_DB"],
        "USER": os.environ["POSTGRES_USER"],
        "PASSWORD": os.environ["POSTGRES_PASSWORD"],
        "HOST": os.environ["POSTGRES_HOST"],
        "PORT": os.environ["POSTGRES_PORT"],
    }
}
```

This is also where we introduce proper Django settings separation.

---

# 30. Development vs Production Settings

As the project grows, avoid putting everything into one giant `settings.py`.

Eventually:

```text
config/
├── settings/
│   ├── __init__.py
│   ├── base.py
│   ├── development.py
│   └── production.py
│
├── urls.py
├── asgi.py
└── wsgi.py
```

Conceptually:

```text
base.py
    common configuration

development.py
    SQLite
    DEBUG=True
    development settings

production.py
    PostgreSQL
    DEBUG=False
    security settings
```

We should introduce this only after the basic Django project is understood.

---

# 31. Stage 19 — REST APIs with Django REST Framework

Install:

```bash
pipenv install djangorestframework
```

Add:

```python
"rest_framework",
```

to `INSTALLED_APPS`.

We then extend an application:

```text
apps/assignments/
├── models.py
├── views.py
├── urls.py
├── forms.py
├── templates/
│
└── api/
    ├── serializers.py
    ├── views.py
    ├── urls.py
    └── tests.py
```

This keeps API code inside the application that owns the data.

---

# 32. API Serializers

A serializer converts between Django/Python objects and API representations such as JSON.

For example:

```python
# apps/assignments/api/serializers.py

from rest_framework import serializers

from ..models import Assignment


class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = [
            "id",
            "title",
            "description",
            "course",
            "opens_at",
            "closes_at",
            "is_active",
        ]
```

Conceptually:

```text
Django Model
     |
     v
Serializer
     |
     v
JSON
```

---

# 33. API Views

For example:

```python
# apps/assignments/api/views.py

from rest_framework import viewsets

from ..models import Assignment
from .serializers import AssignmentSerializer


class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
```

Then API URLs:

```python
# apps/assignments/api/urls.py

from rest_framework.routers import DefaultRouter

from .views import AssignmentViewSet


router = DefaultRouter()

router.register(
    "assignments",
    AssignmentViewSet,
    basename="assignment",
)

urlpatterns = router.urls
```

Project wiring:

```python
path(
    "api/",
    include("apps.assignments.api.urls"),
),
```

Later we will use an API router structure that scales across applications.

---

# 34. The Resulting Architecture

At this stage:

```text
Browser
   |
   +--------------------+
   |                    |
   v                    v
HTML                  REST API
   |                    |
Django views       DRF views
   |                    |
templates           serializers
   |                    |
   +---------+----------+
             |
           models
             |
          database
```

This is why FastAPI is unnecessary at this stage.

---

# 35. Stage 20 — API Authentication and Permissions

We then introduce:

```text
Authentication
```

and:

```text
Permissions
```

For example:

```text
Anonymous
   ↓
Can view public information

Authenticated student
   ↓
Can view own submissions
   ↓
Can submit assignment

Instructor
   ↓
Can create assignments
   ↓
Can inspect submissions

Administrator
   ↓
Full management
```

Django's existing authentication and permission system integrates with DRF.

This gives us one identity system rather than maintaining:

```text
Django authentication
+
FastAPI authentication
```

unnecessarily.

---

# 36. Stage 21 — File Processing

After uploads work, introduce processing.

A submission may pass through:

```text
Upload
   ↓
Validate
   ↓
Store
   ↓
Process
   ↓
Extract metadata
   ↓
Optional PDF/OCR/analysis
```

Initially this can be synchronous.

For example:

```text
PDF upload
    ↓
Django
    ↓
Validate
    ↓
Save
```

Later, if processing becomes expensive:

```text
Django
   |
   +---- background worker
```

Only then should we introduce infrastructure such as Redis/Celery/RQ.

Do not introduce a task queue merely because it is common in Django deployments.

---

# 37. Stage 22 — Testing

Create tests alongside applications.

For example:

```text
apps/assignments/
├── tests.py
```

or later:

```text
apps/assignments/
└── tests/
    ├── test_models.py
    ├── test_views.py
    └── test_api.py
```

Important tests include:

```text
Assignment
    ✓ opens at correct time
    ✓ closes at correct time
    ✓ inactive assignment is closed

Submission
    ✓ authenticated student can submit
    ✓ anonymous user cannot submit
    ✓ submission after deadline is rejected
    ✓ oversized file is rejected
    ✓ duplicate submission is rejected

API
    ✓ authentication works
    ✓ permissions work
    ✓ assignment API returns expected JSON
```

Run:

```bash
pipenv run pytest
```

---

# 38. Stage 23 — Docker

Once the application works locally, containerize it.

`Dockerfile`:

```dockerfile
FROM python:3.12-slim

# Prevent Python from creating .pyc files inside the container.
ENV PYTHONDONTWRITEBYTECODE=1

# Make Python logs appear immediately in Docker output.
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copy dependency metadata first.
# This allows Docker to cache dependency installation.
COPY Pipfile Pipfile.lock ./

# Install Pipenv and the locked production dependencies.
RUN pip install --no-cache-dir pipenv \
    && pipenv install --system --deploy

# Copy the application only after dependencies are installed.
COPY . .

EXPOSE 8000

# Gunicorn is used as the production WSGI server.
CMD [
    "gunicorn",
    "config.wsgi:application",
    "--bind",
    "0.0.0.0:8000"
]
```

---

# 39. Development Docker Compose

Use a separate development Compose file.

```yaml
services:
  web:
    build:
      context: .

    command:
      - pipenv
      - run
      - python
      - manage.py
      - runserver
      - 0.0.0.0:8000

    ports:
      - "8000:8000"

    volumes:
      # Mount source code so changes are immediately visible.
      - .:/app
```

This is a development container.

Production should not depend on this workflow.

---

# 40. Production Compose

Eventually:

```yaml
services:
  web:
    build:
      context: .

    env_file:
      - .env

    ports:
      - "8000:8000"

    volumes:
      # Uploaded files must survive container recreation.
      - /zdata/academic-platform/media:/app/media

    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:17

    environment:
      POSTGRES_DB: academic
      POSTGRES_USER: academic
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}

    volumes:
      # PostgreSQL data is stored outside the container.
      - /zdata/academic-platform/postgres:/var/lib/postgresql/data

    healthcheck:
      # Wait until PostgreSQL is accepting connections.
      test:
        [
          "CMD-SHELL",
          "pg_isready -U academic -d academic"
        ]
      interval: 5s
      timeout: 5s
      retries: 10
```

The production architecture becomes:

```text
Docker Compose
│
├── Django/Gunicorn
│
└── PostgreSQL
```

---

# 41. Uploaded Files Are Not Database Data

This distinction is important.

PostgreSQL stores:

```text
assignment
student
submission
filename
timestamp
etc.
```

The actual uploaded file is stored in:

```text
media/
```

For example:

```text
media/
├── assignments/
│   └── assignment1.pdf
│
└── submissions/
    ├── student1.pdf
    └── student2.pdf
```

The database stores the reference to the file.

Therefore we need separate backup strategies:

```text
PostgreSQL backup
+
media backup
```

---

# 42. Stage 24 — Production Deployment

The production host can use:

```text
/zdata/academic-platform/
├── postgres/
└── media/
```

Your existing NixOS host can run:

```text
Caddy
Docker
PostgreSQL
Django
```

Caddy remains outside the Django Compose project.

For example:

```caddy
academic.mgeek.in {
    reverse_proxy 127.0.0.1:8000
}
```

Therefore:

```text
Internet
   ↓
Cloudflare
   ↓
Caddy
   ↓
127.0.0.1:8000
   ↓
Django container
```

Django itself does not need to know about Caddy's routing details.

---

# 43. Stage 25 — Jenkins CI

The first Jenkins pipeline should not deploy anything.

It should simply prove:

```text
Source code
    ↓
Dependencies install
    ↓
Django check
    ↓
Tests
    ↓
Docker build
```

Example:

```groovy
pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                // Retrieve the exact Git revision that triggered this build.
                checkout scm
            }
        }

        stage('Install') {
            steps {
                // Install development dependencies defined by Pipenv.
                sh 'pipenv install --dev'
            }
        }

        stage('Django Check') {
            steps {
                // Detect Django configuration problems.
                sh 'pipenv run python manage.py check'
            }
        }

        stage('Test') {
            steps {
                // Run the automated test suite.
                sh 'pipenv run pytest'
            }
        }

        stage('Docker Build') {
            steps {
                // Build the same type of image that production will run.
                sh 'docker build -t academic-platform:${BUILD_NUMBER} .'
            }
        }
    }
}
```

---

# 44. Stage 26 — CI/CD

Eventually the pipeline becomes:

```text
Git push
   |
   v
Jenkins
   |
   +---- Checkout
   |
   +---- Install
   |
   +---- Django check
   |
   +---- Tests
   |
   +---- Docker build
   |
   +---- Push image
   |
   v
Container Registry
   |
   v
Production host
   |
   +---- docker compose pull
   |
   +---- docker compose up -d
```

The important production principle is:

> Jenkins should deploy an immutable image, rather than copying source code directly into the production application directory.

This makes deployments reproducible.

---

# 45. Image-Based Deployment

Instead of production doing:

```text
git pull
python manage.py ...
```

we eventually want:

```text
academic-platform:2026.09.16
```

or a registry image such as:

```text
registry.example/academic-platform:build-123
```

Production then runs that exact image.

This gives:

```text
Build once
Deploy the same artifact
```

rather than:

```text
Build differently on every server
```

---

# 46. Stage 27 — Database Migrations During Deployment

Deployments need to handle:

```text
New application code
+
New database schema
```

A production deployment eventually becomes something like:

```text
Pull new image
     ↓
Run migrations
     ↓
Collect static files
     ↓
Restart application
```

For example:

```bash
docker compose run --rm web python manage.py migrate
```

and:

```bash
docker compose run --rm web python manage.py collectstatic --noinput
```

The exact deployment mechanism should later be incorporated into Jenkins.

---

# 47. Stage 28 — Optional FastAPI Service

Only introduce FastAPI if we have a reason.

For example, suppose we later build:

```text
PDF → OCR → ML model → extracted information
```

and that workload becomes substantial.

Then:

```text
Django
   |
   | HTTP API
   v
FastAPI
   |
   +---- OCR
   +---- ML
   +---- AI
```

The Django application remains responsible for:

```text
Users
Courses
Assignments
Submissions
Permissions
Database
```

FastAPI becomes responsible for:

```text
specialized processing
```

This is much cleaner than starting with two frameworks and maintaining two authentication/data architectures from day one.

---

# 48. Optional n8n Addon

n8n is intentionally outside the core tutorial.

If later you want:

```text
Student submits assignment
       ↓
Django
       ↓
Webhook
       ↓
n8n
       ├── Send email
       ├── Telegram notification
       ├── Generate report
       ├── Call external API
       └── Trigger another workflow
```

then n8n can be added without changing the fundamental Django architecture.

The important separation is:

```text
Django
    = source of truth

n8n
    = automation
```

Do not make n8n responsible for:

* authentication
* assignment state
* submission state
* database ownership
* deadline enforcement

Those belong to Django.

---

# 49. Final Architecture

The completed system will therefore look like:

```text
                         Cloudflare
                             |
                             v
                           Caddy
                             |
                             v
                      Django container
                             |
             +---------------+----------------+
             |               |                |
             v               v                v
          Accounts        Courses        Assignments
                                              |
                                              v
                                         Submissions
                                              |
                             +----------------+----------------+
                             |                                 |
                             v                                 v
                        PostgreSQL                         Media files
```

REST API:

```text
                    Django REST Framework
                             |
             +---------------+---------------+
             |               |               |
             v               v               v
        Accounts API    Courses API    Assignment API
                                             |
                                             v
                                      Submission API
```

Optional specialized processing:

```text
                         Django
                           |
                           v
                       FastAPI
                           |
                  +--------+--------+
                  |        |        |
                 OCR      AI       ML
```

Optional automation:

```text
                         Django
                           |
                           v
                          n8n
                           |
              +------------+------------+
              |            |            |
            Email       Telegram    External API
```

Deployment:

```text
                         Git
                          |
                          v
                       Jenkins
                          |
                    +-----+------+
                    |            |
                  Tests       Docker
                               build
                                 |
                                 v
                          Container Registry
                                 |
                                 v
                          Production NixOS
                                 |
                         Docker Compose
                         /            \
                        v              v
                    Django        PostgreSQL
                        |
                      Caddy
                        |
                     Internet
```

---

# 50. Recommended Learning Order

The important thing is not to implement everything immediately. Build one working layer at a time:

```text
01. Nix shell
        ↓
02. Pipenv
        ↓
03. Django project
        ↓
04. Self-contained core app
        ↓
05. Application URLs
        ↓
06. Application templates
        ↓
07. Template inheritance
        ↓
08. SQLite
        ↓
09. Models and migrations
        ↓
10. Django Admin
        ↓
11. Courses
        ↓
12. Users/authentication
        ↓
13. Assignments
        ↓
14. Assignment documents
        ↓
15. Submission application
        ↓
16. File uploads
        ↓
17. File validation
        ↓
18. Server-side deadlines
        ↓
19. PostgreSQL
        ↓
20. REST Framework
        ↓
21. API authentication
        ↓
22. API permissions
        ↓
23. Testing
        ↓
24. Dockerfile
        ↓
25. Development Compose
        ↓
26. Production Compose
        ↓
27. Jenkins CI
        ↓
28. Container registry
        ↓
29. Jenkins CD
        ↓
30. Caddy
        ↓
31. Optional background processing
        ↓
32. Optional FastAPI
        ↓
33. Optional n8n integration
```

The key architectural rule throughout the tutorial is:

```text
config/
    = project configuration and wiring

apps/<application>/
    = functionality owned by that application

Django REST Framework
    = API layer inside Django applications

PostgreSQL
    = persistent relational data

media/
    = uploaded files

Docker
    = packaging/runtime

Jenkins
    = CI/CD

Caddy
    = external HTTP reverse proxy

FastAPI
    = optional specialized service

n8n
    = optional automation addon
```

This structure also means that if you later extract `submissions` or `assignments` into another Django project, you are moving a relatively self-contained application rather than hunting through global `models.py`, `views.py`, and `templates/` directories.
