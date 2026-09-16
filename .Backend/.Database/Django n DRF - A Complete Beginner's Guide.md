# Django & DRF: A Complete Beginner's Guide

This tutorial takes you from project setup through to advanced topics like database selection and third-party backend integration. Every new concept is introduced with inline comments and plain-English explanations.

---

## Part 1: Django Project Setup

### 1.1 Installation and Project Creation

```bash
# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

# Install Django and Django REST Framework
pip install django djangorestframework

# Create a new project
django-admin startproject myproject
cd myproject

# Create an app inside the project
python manage.py startapp myapp
```

**Key concepts:**

- **Project** — the overall container holding settings and configuration.
- **App** — a self-contained module (e.g., `blog`, `users`, `shop`) with its own models, views, and templates.
- **`manage.py`** — a command-line utility for running the dev server, applying migrations, and creating superusers.

### 1.2 Registering the App

```python
# myproject/settings.py

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    # ... other built-in apps ...
    'rest_framework',   # Django REST Framework
    'myapp',            # your app
]
```

Each entry in `INSTALLED_APPS` tells Django which apps are active. Django uses this list to discover models, templates, and static files.

---

## Part 2: Models, Views, and Templates — Where to Put Them?

### 2.1 The Two Structural Strategies

Django lets you organise code in two main ways:

**Strategy A — Central (Project-Level)**

All shared templates, static files, and even some views live at the project root:

```
myproject/
├── templates/              # ALL templates here
│   ├── base.html
│   ├── home.html
│   └── blog/
│       └── post_detail.html
├── static/
├── myapp/
│   ├── models.py
│   ├── views.py
│   └── ...
└── manage.py
```

To enable this, update `settings.py`:

```python
# myproject/settings.py

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],  # <-- project-level template directory
        'APP_DIRS': True,                   # <-- also look inside each app's templates/
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```

**`DIRS`** tells Django where to look for templates **before** searching app-level directories. **`APP_DIRS: True`** tells it to also look inside each installed app's `templates/` folder. If both exist, `DIRS` is searched first, so a project-level template can **override** an app-level one.

**Strategy B — Per-App (App-Level)**

Each app carries its own templates, static files, and views:

```
myproject/
├── myapp/
│   ├── templates/
│   │   └── myapp/          # <-- repeat the app name to avoid namespace clashes
│   │       ├── base.html
│   │       └── home.html
│   ├── static/
│   ├── models.py
│   ├── views.py
│   └── ...
└── manage.py
```

Here you **must** nest the app name inside `templates/`. Without it, two apps with a file called `home.html` would conflict.

### 2.2 Comparison: Central vs Per-App

| Aspect | Central (Project-Level) | Per-App (App-Level) |
|---|---|---|
| **Discoverability** | All templates in one place — easy for small teams | Templates live with the code that uses them |
| **Reusability** | Shared base templates are naturally centralised | Sharing requires import or duplication |
| **Scalability** | Can become a dumping ground in large projects | Clean separation as the project grows |
| **Namespace safety** | Manual namespacing via sub-folders | Built-in — each app has its own namespace |
| **Django convention** | Less conventional, but widely used | The default recommended by the official tutorial |
| **Best for** | Projects where many templates are shared across apps | Projects with many independent, modular apps |

**Practical recommendation:** Start with the per-app approach (Django's default). As your project grows, add a project-level `templates/` directory for global base templates and shared partials. The two strategies are not mutually exclusive — `DIRS` and `APP_DIRS` work together.

### 2.3 Models — Always Per-App

Models should **always** live inside their app's `models.py`. A model is a Python class that inherits from `django.db.models.Model`; each class attribute becomes a database column, and each model maps to a single database table.

```python
# myapp/models.py

from django.db import models
from django.contrib.auth.models import User   # Django's built-in user model

class Author(models.Model):
    """A model representing a book author."""
    name = models.CharField(max_length=200)          # short text field
    bio = models.TextField(blank=True)                # long text, optional
    birth_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)  # set once on creation
    updated_at = models.DateTimeField(auto_now=True)      # updated on every save

    class Meta:
        ordering = ['name']      # default queryset ordering

    def __str__(self):
        """Controls how the model appears in the admin and shell."""
        return self.name


class Book(models.Model):
    """A model representing a book."""
    title = models.CharField(max_length=300)
    author = models.ForeignKey(
        Author,
        on_delete=models.CASCADE,   # delete books when the author is deleted
        related_name='books'        # access via author.books.all()
    )
    isbn = models.CharField(max_length=13, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    in_stock = models.BooleanField(default=True)

    def __str__(self):
        return self.title
```

**Explanation of key fields:**

- **`CharField`** — a short string; `max_length` is required.
- **`TextField`** — a long string with no length limit.
- **`DateTimeField(auto_now_add=True)`** — automatically set to the current time when the record is first created.
- **`DateTimeField(auto_now=True)`** — automatically updated every time the record is saved.
- **`ForeignKey`** — a many-to-one relationship. `on_delete=models.CASCADE` means deleting the parent deletes the children.
- **`__str__`** — tells Python how to print the object; always define it.

**Migrations** turn model changes into database schema changes:

```bash
python manage.py makemigrations    # generate migration files
python manage.py migrate           # apply them to the database
```

### 2.4 Views

Views handle HTTP requests and return responses. They live in each app's `views.py`. Django supports both **function-based views** (FBVs) and **class-based views** (CBVs).

```python
# myapp/views.py

from django.shortcuts import render, get_object_or_404
from .models import Book

# Function-based view: simple and explicit
def book_list(request):
    """Fetch all books and render a template."""
    books = Book.objects.all()          # QuerySet: lazy, hits DB on iteration
    return render(request, 'myapp/book_list.html', {'books': books})


def book_detail(request, pk):
    """Fetch one book by primary key or return 404."""
    book = get_object_or_404(Book, pk=pk)
    return render(request, 'myapp/book_detail.html', {'book': book})
```

**`render()`** is a shortcut that combines loading a template with a context dictionary and returning an `HttpResponse`.

### 2.5 URL Routing

```python
# myproject/urls.py  (project-level)

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('myapp.urls')),   # delegate to the app's URLs
]
```

```python
# myapp/urls.py  (app-level)

from django.urls import path
from . import views

urlpatterns = [
    path('books/', views.book_list, name='book-list'),
    path('books/<int:pk>/', views.book_detail, name='book-detail'),
]
```

---

## Part 3: Django REST Framework (DRF) Tutorial

### 3.1 What is DRF?

Django REST Framework is a toolkit for building Web APIs on top of Django. It handles serialisation, authentication, permissions, and the browsable API — the tedious parts of API development.

### 3.2 Configuration

```python
# myproject/settings.py

INSTALLED_APPS = [
    # ...
    'rest_framework',
    'rest_framework.authtoken',   # token-based authentication
]

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
}
```

These settings mean: unauthenticated users get read-only access; authenticated users get full access; responses are paginated 20 items at a time.

### 3.3 Serializers

A **serializer** converts complex data (model instances, querysets) into native Python types that can be rendered as JSON, XML, etc., and vice versa.

```python
# myapp/serializers.py

from rest_framework import serializers
from .models import Author, Book

class AuthorSerializer(serializers.ModelSerializer):
    """Serializes Author objects to and from JSON."""
    class Meta:
        model = Author
        fields = ['id', 'name', 'bio', 'birth_date']

class BookSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)   # nested read-only representation
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'isbn', 'price', 'in_stock']
```

`ModelSerializer` automatically generates fields based on the model. `read_only=True` means the field is included in output but ignored in input.

### 3.4 ViewSets and Routers

A **ViewSet** combines the logic for multiple related views (list, create, retrieve, update, destroy) into a single class. A **Router** automatically generates URL patterns from the ViewSet.

```python
# myapp/views.py  (add to existing)

from rest_framework import viewsets
from .models import Author, Book
from .serializers import AuthorSerializer, BookSerializer

class AuthorViewSet(viewsets.ModelViewSet):
    """Provides list, create, retrieve, update, destroy for Author."""
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

class BookViewSet(viewsets.ModelViewSet):
    """Provides list, create, retrieve, update, destroy for Book."""
    queryset = Book.objects.all()
    serializer_class = BookSerializer
```

```python
# myapp/urls.py  (update)

from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'authors', views.AuthorViewSet)   # /authors/ and /authors/{id}/
router.register(r'books', views.BookViewSet)       # /books/   and /books/{id}/

urlpatterns = router.urls
```

That is all the URL configuration you need — the router creates the standard CRUD endpoints automatically.

### 3.5 Authentication and Permissions

- **Authentication** identifies *who* is making the request (e.g., via a token, session, or OAuth).
- **Permission** classes determine *what* that identified user is allowed to do.

```python
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    # GET, HEAD, OPTIONS  → allowed for everyone
    # POST, PUT, DELETE    → only for authenticated users
```

To create a token for a user:

```bash
python manage.py createsuperuser
# Then, via shell or an endpoint, generate a Token for that user.
```

Clients then send: `Authorization: Token <their-token>`.

---

## Part 4: Jinja2 Templates in Django

### 4.1 Why Jinja2?

Jinja2 is a faster, more Pythonic template engine. Benchmarks show it is **10–20 times faster** than Django's built-in template engine for common operations like looping. Its syntax is similar to Django's but allows a subset of Python expressions, so you often need fewer custom tags.

### 4.2 Configuration

```bash
pip install jinja2
```

```python
# myproject/settings.py

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.jinja2.Jinja2',   # Jinja2 backend
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'environment': 'myproject.jinja2.environment',     # custom environment
        },
    },
    {
        # Keep DjangoTemplates for the admin and third-party apps
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```

Django's admin **requires** the Django template engine, so you must include both backends.

### 4.3 Custom Jinja2 Environment

The Jinja2 backend does **not** automatically know about Django's `static`, `url`, or context processors. You must wire them in yourself:

```python
# myproject/jinja2.py

from django.contrib.staticfiles.storage import staticfiles_storage
from django.urls import reverse
from jinja2 import Environment

def environment(**options):
    """Create and return a Jinja2 Environment with Django globals."""
    env = Environment(**options)
    env.globals.update({
        'static': staticfiles_storage.url,   # usage: {{ static('css/main.css') }}
        'url': reverse,                      # usage: {{ url('book-list') }}
    })
    return env
```

### 4.4 Key Syntax Differences

| Feature | Django Template | Jinja2 |
|---|---|---|
| Filter arguments | `{{ name\|truncatewords:3 }}` | `{{ name\|truncatewords(3) }}` |
| Method calls | `{{ user.get_full_name }}` | `{{ user.get_full_name() }}` |
| Loop variable | `{% for x in items %}` | `{% for x in items %}` |
| Conditional | `{% if x %}` | `{% if x %}` |
| Comments | `{# ... #}` | `{# ... #}` |

The biggest practical difference: Jinja2 uses **function-call syntax** for filter arguments and requires explicit parentheses for method calls.

### 4.5 Example Template

```html
{# myapp/templates/myapp/book_list.html #}
<!DOCTYPE html>
<html>
<head>
    <title>Book List</title>
    <link rel="stylesheet" href="{{ static('css/style.css') }}">
</head>
<body>
    <h1>Books</h1>
    <ul>
    {% for book in books %}
        <li>
            <a href="{{ url('book-detail', pk=book.pk) }}">
                {{ book.title }}
            </a>
            by {{ book.author.name }}
        </li>
    {% endfor %}
    </ul>
</body>
</html>
```

---

## Part 5: File Uploads in Django

### 5.1 The Basic Mechanism

When Django receives a file upload, the data is placed in `request.FILES` — a dictionary-like object. This only works if: the request method is `POST`, at least one file field was submitted, and the `<form>` has `enctype="multipart/form-data"`.

### 5.2 Model-Based Upload with `ImageField` / `FileField`

```python
# myapp/models.py  (add)

class UserProfile(models.Model):
    """Stores a user's profile picture."""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to='avatars/')   # saved under MEDIA_ROOT/avatars/
```

**`upload_to`** specifies the sub-directory (relative to `MEDIA_ROOT`) where files are stored.

### 5.3 Settings for Media Files

```python
# myproject/settings.py

import os

MEDIA_URL = '/media/'                              # URL prefix for uploaded files
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')        # filesystem path
```

```python
# myproject/urls.py  (add for development only)

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # ... existing patterns ...
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### 5.4 Form and View

```python
# myapp/forms.py

from django import forms

class UploadFileForm(forms.Form):
    """A simple form with a title and a file field."""
    title = forms.CharField(max_length=50)
    file = forms.FileField()          # renders <input type="file">
```

```python
# myapp/views.py  (add)

from django.shortcuts import render, redirect
from .forms import UploadFileForm

def upload_file(request):
    if request.method == 'POST':
        # Pass both POST data and FILES data to the form
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            handle_uploaded_file(request.FILES['file'])
            return redirect('upload-success')
    else:
        form = UploadFileForm()
    return render(request, 'myapp/upload.html', {'form': form})


def handle_uploaded_file(f):
    """Write the uploaded file to disk in chunks."""
    with open(f'some/path/{f.name}', 'wb+') as destination:
        for chunk in f.chunks():      # chunks() avoids loading the whole file into memory
            destination.write(chunk)
```

**Critical detail:** you **must** pass `request.FILES` into the form constructor; otherwise the file field will not be bound.

### 5.5 Template

```html
<!-- myapp/templates/myapp/upload.html -->
<form method="post" enctype="multipart/form-data">
    {% csrf_token %}
    {{ form.as_p }}
    <button type="submit">Upload</button>
</form>
```

The `enctype="multipart/form-data"` attribute is **mandatory** for file uploads.

---

## Part 6: SQLite vs PostgreSQL

### 6.1 Overview

| Aspect | SQLite | PostgreSQL |
|---|---|---|
| **Setup** | Zero configuration — a single file | Requires a server process, user accounts, connection config |
| **Concurrency** | One writer at a time; readers blocked during writes | Full concurrent read/write with MVCC |
| **Data types** | 5 basic types (INTEGER, REAL, TEXT, BLOB, NULL) | Rich types: JSONB, ARRAY, UUID, INET, range types, etc. |
| **Full-text search** | Limited (FTS5 extension) | Built-in, production-grade |
| **Indexing** | B-tree only | B-tree, GIN, GiST, BRIN, hash, partial indexes |
| **Horizontal scaling** | Not supported | Supported via replication, partitioning |
| **Django support** | Default for new projects | First-class, recommended for production |

### 6.2 When to Use Which

**Use SQLite when:**

- You are developing locally or running tests (it is extremely fast in-memory).
- The app has low traffic and few concurrent writes.
- You want zero operational overhead.
- You are building a prototype or a small internal tool.

**Use PostgreSQL when:**

- You are deploying to production with real traffic.
- You need advanced data types (e.g., JSONB for flexible schemas).
- You have concurrent write operations.
- You need full-text search, geospatial queries, or advanced indexing.
- You expect the application to scale horizontally.

### 6.3 The Migration Trap

A common pitfall: developing on SQLite and deploying on PostgreSQL. SQLite's flexible typing and limited constraint enforcement can hide bugs that only surface in PostgreSQL. For example, PostgreSQL enforces strict type checking where SQLite may silently coerce values. **Best practice:** use PostgreSQL in both development and production, or at least run your test suite against PostgreSQL.

---

## Part 7: Django's ORM — How It Fits

Django's ORM (Object-Relational Mapper) sits between your Python models and the database. It lets you work with data as Python objects instead of writing raw SQL.

```python
# CREATE
author = Author.objects.create(name='Jane Austen', bio='English novelist')

# READ — all records
all_books = Book.objects.all()

# READ — filtered
cheap_books = Book.objects.filter(price__lt=20, in_stock=True)

# READ — single record (raises DoesNotExist if not found)
book = Book.objects.get(isbn='9780141439518')

# UPDATE
Book.objects.filter(author=author).update(in_stock=False)

# DELETE
book.delete()

# RELATIONSHIP traversal
austen_books = author.books.all()      # uses related_name='books'

# AGGREGATION
from django.db.models import Count, Avg
stats = Book.objects.aggregate(avg_price=Avg('price'), total=Count('id'))
```

**Key point:** QuerySets are **lazy** — Django does not hit the database until you iterate over the queryset or explicitly evaluate it. This allows you to chain filters efficiently.

The ORM is **database-agnostic**: the same model code works against SQLite, PostgreSQL, MySQL, or Oracle. You change the `DATABASES` setting, not your models.

```python
# PostgreSQL configuration example

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mydatabase',
        'USER': 'mydbuser',
        'PASSWORD': 'secret',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

---

## Part 8: Should You Use PocketBase as a Layer for SQLite?

### 8.1 What PocketBase Is

PocketBase is a single-binary backend written in Go that bundles an embedded SQLite database (in WAL mode), a REST API, authentication, file storage, and an admin dashboard — all in one executable.

### 8.2 How It Could Fit with Django

You could run PocketBase alongside Django as a separate backend service. Django would serve your web UI and business logic; PocketBase would handle certain data operations, auth, or file storage via its REST API. Some developers describe it as a "perfect fit for small to medium-sized projects" where you don't want to maintain a traditional backend.

### 8.3 Pros and Cons

| Pros | Cons |
|---|---|
| Zero-dependency deployment — one binary | **SQLite only** — no PostgreSQL, MySQL, or Oracle |
| Built-in admin UI and REST API | Not designed for horizontal scaling (one instance) |
| Built-in auth (OAuth2, email/password, etc.) | SQLite limits concurrent writes (one writer at a time) |
| Realtime subscriptions via SSE | Migrations can cause downtime on large datasets |
| Small and fast for prototypes | Smaller ecosystem than Django or Supabase |
| SQLite in WAL mode performs well for reads | Extension language is Go, not Python |

### 8.4 The Critical Question: Does It Replace Django's ORM?

**No.** PocketBase and Django's ORM are not interchangeable. PocketBase is a **separate backend service** that exposes its own REST API; Django's ORM works directly with a database connection. Using PocketBase means:

1. You are **not** using Django's models, migrations, or ORM for the data PocketBase manages.
2. You introduce a **network hop** between Django and PocketBase.
3. You lose Django's migration system, admin integration, and model validation for that data.

### 8.5 Recommendation

| Scenario | Recommendation |
|---|---|
| Small prototype, solo developer, want auth + API + admin out of the box | Consider PocketBase **instead of** Django for that part |
| Django project that already uses the ORM and needs a bit of realtime or auth | Use Django + DRF + a dedicated auth package (e.g., `dj-rest-auth`) |
| Production app that needs PostgreSQL, complex queries, and migrations | **Do not** use PocketBase — stick with Django ORM + PostgreSQL |
| Django app that wants to offload file storage or realtime to PocketBase | Possible, but adds architectural complexity for marginal benefit |

**Bottom line:** PocketBase shines as a **standalone lightweight backend**. If you are already committed to Django and its ecosystem, adding PocketBase as a "layer" creates more problems than it solves — you would be running two backends, two data stores, and two auth systems. If you want the simplicity of PocketBase, use it on its own for small projects; if you want Django's power and scalability, use Django with PostgreSQL.

---

## Summary

| Topic | Key Takeaway |
|---|---|
| **Project structure** | Start with per-app templates; add project-level `templates/` as the project grows |
| **DRF** | Serializers convert models ↔ JSON; ViewSets + Routers eliminate boilerplate |
| **Jinja2** | Faster than Django templates; requires a custom environment for `static`/`url` |
| **File uploads** | Use `request.FILES`, `enctype="multipart/form-data"`, and `upload_to` on the field |
| **SQLite vs PostgreSQL** | SQLite for dev/prototypes; PostgreSQL for production and scale |
| **ORM** | Database-agnostic; works identically across engines — just change `DATABASES` |
| **PocketBase** | Great standalone backend; not a replacement for Django's ORM or a production PostgreSQL stack |