# Optional Django Forms 

## Building a Student Registration Form in a New `forms` App

This tutorial continues an existing Django project created with `uv`.

Assumptions:

- The project folder is named `students-project`.
- The existing app is named `students`.
- The project already has routes, a middleware logger, and examples that call external APIs.
- The project uses a virtual environment managed by `uv`.

We will create a separate app named `forms` and use it to build a student registration form.

> Important: Django already has a module named `django.forms`. Naming an application `forms` can be confusing because both may appear in imports. For a real project, names such as `student_forms` or `registrations` are clearer. This tutorial uses `forms` because it is a useful beginner exercise.

## Learning objectives

By the end of this tutorial, you will be able to:

- create and register a new Django app;
- create a Django `Form` class;
- display a form in an HTML template;
- process `GET` and `POST` requests;
- validate submitted data;
- show validation errors;
- save valid data in the database;
- reuse the existing middleware logger;
- call an external API after a valid submission safely.

## 1. Understand the complete form flow

A Django form follows this sequence:

```text
Browser opens page
        |
        v
GET request -> Django creates an empty form -> template displays it
        |
Student fills form and clicks Submit
        |
        v
POST request -> Django receives submitted data -> form.is_valid()
        |
   Invalid ---------------------- Valid
      |                              |
      v                              v
Show errors                    Save/process data
                                     |
                                     v
                            Redirect to success page
```

The same view commonly handles both `GET` and `POST` requests:

```python
if request.method == "POST":
    form = StudentForm(request.POST)
    if form.is_valid():
        # Process valid data
else:
    form = StudentForm()
```

## 2. Create the new app

Open a terminal in the directory containing `manage.py`:

```bash
cd students-project
uv run python manage.py startapp forms
```

The command creates a structure similar to this:

```text
forms/
├── __init__.py
├── admin.py
├── apps.py
├── migrations/
├── models.py
├── tests.py
├── views.py
└── forms.py        # Create this file manually
```

Django creates `models.py`, but it does not automatically create `forms.py`. We will create it ourselves.

## 3. Register the app

Open the project settings file, usually:

```text
students_project/settings.py
```

Add the app to `INSTALLED_APPS`:

```python
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "students",
    "forms",
]
```

`INSTALLED_APPS` tells Django to load the app and discover its models, migrations, templates, and other app components.

## 4. Create a model for student records

For this tutorial, create a small model in `forms/models.py`:

```python
from django.db import models


class StudentRegistration(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    age = models.PositiveIntegerField()
    course = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.course}"
```

Run migrations:

```bash
uv run python manage.py makemigrations forms
uv run python manage.py migrate
```

`makemigrations` creates a migration instruction. `migrate` applies that instruction to the database.

## 5. Create a `ModelForm`

Create `forms/forms.py`:

```python
from django import forms

from .models import StudentRegistration


class StudentRegistrationForm(forms.ModelForm):
    class Meta:
        model = StudentRegistration
        fields = ["name", "email", "age", "course"]
        widgets = {
            "name": forms.TextInput(attrs={
                "placeholder": "Enter your full name",
            }),
            "email": forms.EmailInput(attrs={
                "placeholder": "student@example.com",
            }),
            "age": forms.NumberInput(attrs={
                "min": 16,
                "max": 100,
            }),
            "course": forms.TextInput(attrs={
                "placeholder": "Example: BCA",
            }),
        }

    def clean_age(self):
        age = self.cleaned_data["age"]

        if age < 16:
            raise forms.ValidationError(
                "The student must be at least 16 years old."
            )

        return age
```

### What does `ModelForm` do?

`ModelForm` connects a form to a model. Django automatically creates form fields from the model fields and performs basic validation.

- `model` selects the database model.
- `fields` controls which model fields appear in the form.
- `widgets` controls HTML attributes and presentation.
- `clean_age()` adds a custom validation rule.
- `cleaned_data` contains data that has passed validation.

Never trust values only because they came from an HTML form. Browser-side restrictions such as `min="16"` can be bypassed, so important rules must also be checked on the server.

## 6. Create views

Replace `forms/views.py` with:

```python
import logging

from django.contrib import messages
from django.shortcuts import redirect, render

from .forms import StudentRegistrationForm


logger = logging.getLogger(__name__)


def register_student(request):
    if request.method == "POST":
        form = StudentRegistrationForm(request.POST)

        if form.is_valid():
            student = form.save()

            logger.info(
                "Student registration created: id=%s email=%s",
                student.id,
                student.email,
            )

            messages.success(
                request,
                "Student registration submitted successfully.",
            )

            return redirect("registration-success")
    else:
        form = StudentRegistrationForm()

    return render(
        request,
        "forms/register_student.html",
        {"form": form},
    )


def registration_success(request):
    return render(request, "forms/registration_success.html")
```

### Why redirect after saving?

The redirect-after-POST pattern prevents duplicate submissions when the user refreshes the success page. Instead of returning the result directly after a POST, the view redirects to a new `GET` request.

## 7. Add app URLs

Create `forms/urls.py`:

```python
from django.urls import path

from . import views


app_name = "forms_app"

urlpatterns = [
    path("register/", views.register_student, name="register"),
    path(
        "register/success/",
        views.registration_success,
        name="registration-success",
    ),
]
```

Update the main project URL file, usually `students_project/urls.py`:

```python
from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path("admin/", admin.site.urls),
    path("students/", include("students.urls")),
    path("forms/", include("forms.urls")),
]
```

The form page will now be available at:

```text
http://127.0.0.1:8000/forms/register/
```

Because `app_name` is set, the namespaced URL is `forms_app:register` when reversing it from templates or Python code. Inside this app's own view, `registration-success` works because it is in the same URL configuration. From another app, use the full namespace: `forms_app:registration-success`.

## 8. Create templates

Create these directories and files:

```text
forms/
└── templates/
    └── forms/
        ├── register_student.html
        └── registration_success.html
```

Create `forms/templates/forms/register_student.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Registration</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 650px;
            margin: 40px auto;
            padding: 0 20px;
        }

        form {
            display: grid;
            gap: 16px;
        }

        input {
            width: 100%;
            padding: 10px;
            box-sizing: border-box;
        }

        .field-error,
        .errorlist {
            color: #b91c1c;
        }

        button {
            padding: 10px 16px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <h1>Student Registration</h1>

    {% if messages %}
        {% for message in messages %}
            <p>{{ message }}</p>
        {% endfor %}
    {% endif %}

    <form method="post">
        {% csrf_token %}

        {{ form.non_field_errors }}

        {% for field in form %}
            <div>
                {{ field.label_tag }}
                {{ field }}

                {% if field.help_text %}
                    <small>{{ field.help_text }}</small>
                {% endif %}

                {{ field.errors }}
            </div>
        {% endfor %}

        <button type="submit">Register Student</button>
    </form>
</body>
</html>
```

Create `forms/templates/forms/registration_success.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Registration Complete</title>
</head>
<body>
    <h1>Registration complete</h1>
    <p>The student record has been saved successfully.</p>
    <a href="{% url 'forms_app:register' %}">Register another student</a>
</body>
</html>
```

## 9. Understand CSRF protection

The following line is required for a normal Django POST form:

```html
{% csrf_token %}
```

CSRF protection helps prevent another website from submitting a form using a user's authenticated browser session. Do not remove CSRF protection merely to make a form work.

If the token is missing, Django usually responds with a `403 Forbidden` error when the form is submitted.

## 10. Connect the existing middleware logger

The form view uses Python's logging system:

```python
logger.info("Student registration created: id=%s", student.id)
```

Your existing request-logging middleware should also record the request method and path. A successful submission may therefore produce two useful kinds of log entries:

- middleware log: request-level information such as `POST /forms/register/`;
- view log: application-level information such as the newly created student ID.

Do not log passwords, authentication tokens, complete request bodies, or sensitive personal data. In this example, logging the student email may be acceptable for a classroom project, but production systems should consider using the student ID or a masked email instead.

## 11. Add duplicate-email handling

The model uses `unique=True` for `email`. Django normally validates this through the `ModelForm`, but database constraints remain the final protection.

For a beginner project, the form's normal error display is enough. To make the view more defensive, update the imports and save block:

```python
from django.db import IntegrityError
```

Then use:

```python
if form.is_valid():
    try:
        student = form.save()
    except IntegrityError:
        form.add_error(
            "email",
            "A student with this email already exists.",
        )
    else:
        logger.info("Student registration created: id=%s", student.id)
        messages.success(
            request,
            "Student registration submitted successfully.",
        )
        return redirect("forms_app:registration-success")
```

Notice that the redirect uses the namespace when resolving the URL from a general view.

## 12. Calling an external API after form submission

Your existing project already demonstrates external APIs. A form can trigger an API call after valid data is saved, for example to send a notification.

Keep external API code separate from the form class. The form should validate input; a service function should communicate with the external system.

Example service file: `forms/services.py`:

```python
import logging

import requests


logger = logging.getLogger(__name__)


def notify_registration(student):
    payload = {
        "student_id": student.id,
        "name": student.name,
        "course": student.course,
    }

    try:
        response = requests.post(
            "https://example.com/api/registrations",
            json=payload,
            timeout=5,
        )
        response.raise_for_status()
    except requests.RequestException:
        logger.exception(
            "Could not notify external registration service: student_id=%s",
            student.id,
        )
        return False

    return True
```

Call it only after the database save:

```python
from .services import notify_registration

# After student = form.save()
notify_registration(student)
```

For production applications, do not make the user wait for a slow external API. Move the notification to a background task system such as Celery or Django-Q. Also store API URLs and credentials in environment variables rather than hard-coding them.

## 13. Run and test the application

Start the development server:

```bash
uv run python manage.py runserver
```

Open:

```text
http://127.0.0.1:8000/forms/register/
```

Test these cases:

1. Submit the empty form. Required-field errors should appear.
2. Enter an invalid email. Django should reject it.
3. Enter an age below 16. The custom error should appear.
4. Submit valid data. A database row should be created.
5. Submit the same email again. A duplicate-email error should appear.
6. Refresh the success page. The same form submission should not be repeated.
7. Check the terminal logs to confirm middleware and view logging.

Inspect saved records using the Django shell:

```bash
uv run python manage.py shell
```

```python
from forms.models import StudentRegistration

StudentRegistration.objects.all()
```

## 14. Register the model in the admin site

Edit `forms/admin.py`:

```python
from django.contrib import admin

from .models import StudentRegistration


@admin.register(StudentRegistration)
class StudentRegistrationAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "age", "course", "created_at")
    search_fields = ("name", "email", "course")
```

Create an admin user if you do not already have one:

```bash
uv run python manage.py createsuperuser
```

Visit:

```text
http://127.0.0.1:8000/admin/
```

## 15. Common beginner mistakes

### `TemplateDoesNotExist`

Check that the path is exactly:

```text
forms/templates/forms/register_student.html
```

Also confirm that `forms` is in `INSTALLED_APPS`.

### `NoReverseMatch`

Check the URL name and namespace:

```django
{% url 'forms_app:register' %}
```

### `CSRF verification failed`

Add this inside the form:

```html
{% csrf_token %}
```

### Form always appears empty after submission

Use the submitted data when creating the form:

```python
form = StudentRegistrationForm(request.POST)
```

Do not accidentally use `StudentRegistrationForm()` in the POST branch.

### Data is not saved

Remember that `form.is_valid()` must be called before `form.save()`:

```python
if form.is_valid():
    form.save()
```

Also run both migration commands after changing the model.

## 16. Suggested exercises

1. Add a `phone_number` field and validate its length.
2. Change `course` from a text input to a dropdown using `forms.ChoiceField`.
3. Add a confirmation checkbox named `agree_to_rules`.
4. Create a page that lists all registered students.
5. Add an update form using `StudentRegistrationForm(instance=student)`.
6. Add a delete confirmation page.
7. Write tests for valid data, invalid age, invalid email, and duplicate email.
8. Replace the inline CSS with a shared base template.

## Final project structure

```text
students-project/
├── manage.py
├── students_project/
│   ├── settings.py
│   └── urls.py
├── students/
│   └── ... existing app files ...
└── forms/
    ├── admin.py
    ├── apps.py
    ├── forms.py
    ├── models.py
    ├── services.py
    ├── urls.py
    ├── views.py
    └── templates/
        └── forms/
            ├── register_student.html
            └── registration_success.html
```

The important idea is that Django forms are not only HTML generators. They are a boundary between untrusted browser input and trusted application logic. A well-designed form validates input on the server, gives useful feedback to the user, saves data safely, and keeps logging and external integrations separated from validation code.
