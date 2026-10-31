# Complete Hands-on Tutorial: Django Forms, ModelForms, Database Operations and Authentication

## 1. Learning Objectives

The tutorial will follow the actual journey of data in a web application:

1. How an HTML form collects data from a user.
2. How the browser sends form data to a web server using HTTP.
3. How Django receives submitted data through a request.
4. How the server validates and sanitizes the input.
5. How validated data is stored in a database.
6. How the server retrieves database records and displays them in HTML.
7. How Django Forms simplify form creation, validation and data processing.
8. How ModelForms connect forms directly with database models.
9. How Django handles CSRF protection, authentication and authorization.
10. How APIs can be used instead of traditional HTML form submissions.

We will gradually develop a **Student Management Application**.

The tutorial will use three approaches:

- Approach 1: HTML forms with manual request handling.
- Approach 2: Django Forms (`forms.Form`).
- Approach 3: Django ModelForms (`forms.ModelForm`).

We will also understand where APIs fit into this architecture.

# Part 1: Understanding the Basic Form Workflow

## Stage 1: How HTML Forms Work

Before introducing Django, understand how a browser communicates with a web server.

Suppose we want to collect student information:

- Student name
- Email
- Age
- Course

The browser displays an HTML form. When the user clicks Submit, the browser sends the entered data to the server.

### 1.1 Create a basic HTML form

Create `student.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Student Registration</title>
</head>

<body>

    <h2>Student Registration Form</h2>

    <!--
        action specifies the server URL that receives the form data.
        method specifies how the browser sends the data.
    -->
    <form action="/register/" method="POST">

        <label>Student Name:</label>
        <input type="text" name="name" required>

        <br><br>

        <label>Email:</label>
        <input type="email" name="email" required>

        <br><br>

        <label>Age:</label>
        <input type="number" name="age" required>

        <br><br>

        <label>Course:</label>

        <select name="course">
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
            <option value="BTECH">B.Tech</option>
        </select>

        <br><br>

        <button type="submit">Register Student</button>

    </form>

</body>
</html>
```

### 1.2 Understand important HTML attributes

| Attribute | Purpose |
|---|---|
| `action` | Specifies the server endpoint receiving submitted data |
| `method` | Specifies HTTP method, usually GET or POST |
| `name` | Identifies the submitted field |
| `type` | Defines the input type |
| `required` | Makes a field mandatory in browser validation |
| `value` | Specifies the submitted value |
| `placeholder` | Displays an input hint |

**Important concept:**

The `name` attribute is particularly important.

For example:

```html
<input type="text" name="name">
```

When submitted, the browser sends a key-value pair:

```text
name=Prateek
```

The `id` attribute identifies an HTML element, while `name` identifies the submitted field.

### 1.3 Understand GET and POST

HTML forms commonly use two HTTP methods.

**GET request**

```html
<form action="/search/" method="GET">
    <input type="text" name="keyword">
    <button type="submit">Search</button>
</form>
```

The browser sends data as URL parameters:

```text
/search/?keyword=django
```

Typical uses:

- Searching
- Filtering
- Pagination
- Retrieving records

**POST request**

```html
<form action="/register/" method="POST">
    <input type="text" name="name">
    <button type="submit">Register</button>
</form>
```

The browser sends data in the HTTP request body.

Typical uses:

- Registration
- Login
- Creating records
- Updating records
- Submitting sensitive or large form data

POST does not automatically encrypt data. HTTPS is required to protect data during transmission.

### 1.4 Understand the complete workflow

The following diagram illustrates the basic form submission process.

<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 760 410">
<rect width="760" height="410" fill="white"/>
<g font-family="Arial" text-anchor="middle" font-size="14" fill="#172b4d">
<rect x="260" y="15" width="240" height="55" rx="8" fill="#e8f1ff" stroke="#3578c8" stroke-width="1.5"/>
<text x="380" y="38" font-weight="bold">User / Browser</text><text x="380" y="56" font-size="12">HTML Form</text>
<path d="M380 70 V105" stroke="#3578c8" stroke-width="2" fill="none"/><path d="M374 98 L380 106 L386 98" fill="none" stroke="#3578c8" stroke-width="2"/>
<rect x="260" y="110" width="240" height="55" rx="8" fill="#e8f1ff" stroke="#3578c8" stroke-width="1.5"/>
<text x="380" y="133" font-weight="bold">HTTP POST Request</text><text x="380" y="151" font-size="12">Form data + CSRF token</text>
<path d="M380 165 V200" stroke="#3578c8" stroke-width="2" fill="none"/><path d="M374 193 L380 201 L386 193" fill="none" stroke="#3578c8" stroke-width="2"/>
<rect x="260" y="205" width="240" height="55" rx="8" fill="#e8f7ed" stroke="#27965a" stroke-width="1.5"/>
<text x="380" y="228" font-weight="bold">Django View</text><text x="380" y="246" font-size="12">Receive and process data</text>
<path d="M380 260 V295" stroke="#27965a" stroke-width="2" fill="none"/><path d="M374 288 L380 296 L386 288" fill="none" stroke="#27965a" stroke-width="2"/>
<rect x="260" y="300" width="240" height="55" rx="8" fill="#fff3df" stroke="#d18b28" stroke-width="1.5"/>
<text x="380" y="323" font-weight="bold">Database</text><text x="380" y="341" font-size="12">Store validated student data</text>
<path d="M500 328 H620 V42 H505" stroke="#27965a" stroke-width="1.8" fill="none" stroke-dasharray="5 4"/>
<path d="M512 36 L504 42 L512 48" fill="none" stroke="#27965a" stroke-width="1.8"/>
<text x="645" y="183" font-size="12" transform="rotate(90 645 183)">HTTP Response</text>
<text x="380" y="389" font-size="12" fill="#596579">The server processes the request and returns an HTTP response.</text>
</g>
</svg>

The important point is that the browser does not directly communicate with the database.

The Django server acts as an intermediary.

## Stage 2: Receive HTML Form Data in Django

Now we will create a Django project and receive the submitted form data.

### 2.1 Create the project

Using `uv`:

```bash
# Create a project directory.
uv init django-forms-tutorial

cd django-forms-tutorial

# Install Django.
uv add django

# Create the Django project.
uv run django-admin startproject config .

# Create the students application.
uv run python manage.py startapp students
```

On NixOS, `uv` manages the Python project environment, so you do not need to install Django system-wide.

Add the application to `INSTALLED_APPS` in `config/settings.py`:

```python
INSTALLED_APPS = [
    # Django built-in applications.
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Our application.
    'students',
]
```

### 2.2 Create a view to receive form data

`students/views.py`

```python
from django.shortcuts import render

def register_student(request):

    if request.method == 'POST':

        # Read submitted values using their HTML name attributes.
        name = request.POST.get('name')
        email = request.POST.get('email')
        age = request.POST.get('age')
        course = request.POST.get('course')

        # Display submitted values in the server terminal.
        print(name, email, age, course)

        return render(request, 'success.html')

    # Display the empty form when the page is opened.
    return render(request, 'student.html')
```

### 2.3 Configure URLs

Create `students/urls.py`:

```python
from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_student, name='register_student'),
]
```

Include it in `config/urls.py`:

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # Forward student-related requests to the students application.
    path('', include('students.urls')),
]
```

### 2.4 Create templates

Create a `templates` directory in the project root.

Update `config/settings.py`:

```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',

        # Project-level template directory.
        'DIRS': [BASE_DIR / 'templates'],

        'APP_DIRS': True,

        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```

Create `templates/student.html` using the HTML form from Stage 1.

Create `templates/success.html`:

```html
<h2>Student Registration Successful</h2>

<p>Your information has been received.</p>
```

Run the server:

```bash
uv run python manage.py runserver
```

Open:

`http://127.0.0.1:8000/register/`

Submit the form and observe the values in the terminal.

### 2.5 How does Django receive the submitted data?

The important object here is `request`.

Django creates an HTTP request object whenever a browser sends a request.

Some useful request attributes:

| Attribute | Purpose |
|---|---|
| `request.method` | HTTP method: GET, POST, etc. |
| `request.GET` | Query parameters |
| `request.POST` | Submitted form data |
| `request.FILES` | Uploaded files |
| `request.user` | Currently authenticated user |
| `request.path` | Requested URL |

For example:

```python
name = request.POST.get('name')
```

This retrieves the submitted value corresponding to:

```html
<input type="text" name="name">
```

**Hands-on exercise 1**

Create a course enquiry form with:

- Student name
- Email
- Phone
- Course
- Message

Receive the submitted values in Django and display them on a success page.

# Part 2: Validation, Security and Database Storage

## Stage 3: Why Receiving Data Is Not Enough

In the previous stage, we received the submitted data directly from the browser.

However, this approach has several problems.

### 3.1 Browser-side validation

HTML provides basic validation:

```html
<input type="email" name="email" required>

<input type="number" name="age" min="18" max="60" required>
```

The browser checks:

- Whether required fields are filled.
- Whether email values have a valid format.
- Whether numeric values are within the specified range.

However, browser-side validation is not sufficient.

A user can disable JavaScript, modify HTML using Developer Tools or send a request using Postman or a custom script.

Therefore, validation must also happen on the server.

### 3.2 Add server-side validation manually

Update the view:

```python
from django.shortcuts import render

def register_student(request):

    errors = {}

    if request.method == 'POST':

        name = request.POST.get('name', '').strip()
        email = request.POST.get('email', '').strip()
        age = request.POST.get('age', '').strip()

        # Validate student name.
        if not name:
            errors['name'] = 'Name is required.'

        # Validate email.
        if '@' not in email:
            errors['email'] = 'Enter a valid email.'

        # Validate age.
        if not age.isdigit():
            errors['age'] = 'Age must be a number.'

        elif int(age) < 18:
            errors['age'] = 'Age must be at least 18.'

        if errors:
            return render(
                request,
                'student.html',
                {'errors': errors}
            )

        return render(request, 'success.html')

    return render(request, 'student.html')
```

Display errors in the HTML:

```html
{% if errors.name %}
    <p>{{ errors.name }}</p>
{% endif %}

{% if errors.email %}
    <p>{{ errors.email }}</p>
{% endif %}

{% if errors.age %}
    <p>{{ errors.age }}</p>
{% endif %}
```

This works, but as forms become larger, manual validation becomes difficult to maintain.

For example, a form containing 20 fields may require many validation conditions.

This is one of the problems Django Forms solve.

## Stage 4: Security Considerations

Before storing data in a database, understand the main security concerns.

### 4.1 CSRF protection

CSRF stands for Cross-Site Request Forgery.

It is an attack in which a malicious website attempts to make a user's browser send an unwanted request to another website where the user is already authenticated.

Django provides built-in CSRF protection through middleware.

Add the following inside every POST form:

```html
<form method="POST">

    {% csrf_token %}

    <!-- Form fields -->

    <button type="submit">Submit</button>

</form>
```

Django generates a CSRF token and validates it when the POST request arrives.

The token helps Django distinguish legitimate form submissions from unauthorized cross-site requests.

**Important:** CSRF protection is not the same as authentication or input validation.

### 4.2 SQL Injection

Never construct SQL queries by directly concatenating user input.

Unsafe example:

```python
# Never construct SQL queries this way.
query = "SELECT * FROM students WHERE name = '" + name + "'"
```

Use Django's ORM:

```python
Student.objects.filter(name=name)
```

The ORM handles parameterized database queries.

### 4.3 Cross-Site Scripting (XSS)

Suppose a user submits this value:

```html
<script>alert('Hacked')</script>
```

Django templates automatically escape variable output in normal template rendering:

```html
<p>{{ student.name }}</p>
```

Do not use `safe` or disable autoescaping on untrusted user input.

### 4.4 Other important security concerns

| Security concern | Django protection or approach |
|---|---|
| CSRF | CSRF middleware and tokens |
| SQL Injection | Django ORM and parameterized queries |
| XSS | Automatic template escaping |
| Password storage | Django password hashing |
| Unauthorized access | Authentication and authorization |
| Session security | Django session framework |
| Data validation | Server-side form validation |
| Secure transmission | HTTPS |
| Brute-force login attempts | Rate limiting and monitoring |
| File upload attacks | File validation, size limits and safe storage |

Security is not achieved by using Django Forms alone. Forms provide validation facilities, while other Django components and secure development practices provide additional protections.

## Stage 5: Store Data in the Database

Now that we understand how to receive and validate data, let's save it.

### 5.1 Create a Student model

`students/models.py`

```python
from django.db import models

class Student(models.Model):

    name = models.CharField(max_length=100)

    email = models.EmailField()

    age = models.IntegerField()

    course = models.CharField(max_length=50)

    def __str__(self):
        return self.name
```

A Django model represents a database table.

The model fields represent database columns.

### 5.2 Create the database table

```bash
uv run python manage.py makemigrations

uv run python manage.py migrate
```

Explain the difference:

- `makemigrations`: Generates migration files describing database changes.
- `migrate`: Applies those changes to the database.

### 5.3 Save data using Django ORM

Update the view:

```python
from .models import Student

def register_student(request):

    if request.method == 'POST':

        name = request.POST.get('name')
        email = request.POST.get('email')
        age = request.POST.get('age')
        course = request.POST.get('course')

        # Create a new database record using Django ORM.
        Student.objects.create(
            name=name,
            email=email,
            age=age,
            course=course
        )

        return render(request, 'success.html')

    return render(request, 'student.html')
```

Now submitted information is stored in the database.

However, there is an important problem.

We are directly storing the received data without proper validation.

For example, a malicious client could submit an invalid age or an excessively long name.

**Never treat data received from a browser as trusted.**

In the next stage, we will solve this problem using Django Forms.

# Part 3: Django Forms (`forms.Form`)

## Stage 6: Understanding Django Forms

Django Forms provide a structured way to:

1. Define input fields.
2. Generate HTML form elements.
3. Receive submitted data.
4. Validate submitted data.
5. Convert data into appropriate Python types.
6. Display validation errors.

However, a regular Django Form does not automatically save data to the database.

The developer must write the database operation.

### 6.1 Create a Django Form

Create `students/forms.py`:

```python
from django import forms

class StudentForm(forms.Form):

    # Define the expected input fields.
    name = forms.CharField(max_length=100)

    email = forms.EmailField()

    age = forms.IntegerField(
        min_value=18,
        max_value=60
    )

    course = forms.ChoiceField(
        choices=[
            ('BCA', 'BCA'),
            ('MCA', 'MCA'),
            ('BTECH', 'B.Tech')
        ]
    )
```

Notice that we are defining fields in Python rather than writing all the HTML inputs manually.

### 6.2 Render the form in HTML

Update `templates/student.html`:

```html
<h2>Student Registration</h2>

<form method="POST">

    {% csrf_token %}

    <!-- Django generates HTML fields from the Form class. -->
    {{ form.as_p }}

    <button type="submit">Register</button>

</form>
```

Django generates the corresponding HTML input elements.

### 6.3 Understand form rendering methods

| Method | Purpose |
|---|---|
| `{{ form }}` | Render form fields |
| `{{ form.as_p }}` | Render fields inside paragraph elements |
| `{{ form.as_ul }}` | Render fields inside list elements |
| `{{ form.as_table }}` | Render fields as table rows |

For more control, fields can be rendered individually:

```html
<form method="POST">

    {% csrf_token %}

    <p>
        {{ form.name.label_tag }}
        {{ form.name }}
        {{ form.name.errors }}
    </p>

    <p>
        {{ form.email.label_tag }}
        {{ form.email }}
        {{ form.email.errors }}
    </p>

    <button type="submit">Submit</button>

</form>
```

### 6.4 Receive and validate form data

Update `students/views.py`:

```python
from django.shortcuts import render, redirect
from .forms import StudentForm
from .models import Student

def register_student(request):

    if request.method == 'POST':

        # Bind submitted POST data to the form.
        form = StudentForm(request.POST)

        # Validate all submitted fields.
        if form.is_valid():

            # Access validated and converted Python values.
            name = form.cleaned_data['name']
            email = form.cleaned_data['email']
            age = form.cleaned_data['age']
            course = form.cleaned_data['course']

            # Save validated data using Django ORM.
            Student.objects.create(
                name=name,
                email=email,
                age=age,
                course=course
            )

            return redirect('student_list')

    else:

        # Display an empty form.
        form = StudentForm()

    return render(
        request,
        'student.html',
        {'form': form}
    )
```

### 6.5 Understand the important form concepts

**A. Unbound form**

```python
form = StudentForm()
```

An empty form without submitted data.

**B. Bound form**

```python
form = StudentForm(request.POST)
```

A form containing submitted data.

**C. Validation**

```python
form.is_valid()
```

Checks whether the submitted data meets the defined validation rules.

**D. Cleaned data**

```python
form.cleaned_data
```

Contains validated and converted Python values.

For example:

- HTML age value: `"21"` (string)
- `cleaned_data['age']`: `21` (integer)

This conversion is performed by Django's form field.

### 6.6 Understand the complete Django Form workflow

<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 760 450">
<rect width="760" height="450" fill="white"/>
<g font-family="Arial" text-anchor="middle" fill="#172b4d">
<rect x="250" y="12" width="260" height="48" rx="7" fill="#e8f1ff" stroke="#3578c8"/>
<text x="380" y="41" font-size="14" font-weight="bold">HTML Form Submission</text>
<path d="M380 60 V87" stroke="#3578c8" stroke-width="2"/><path d="M374 80 L380 88 L386 80" stroke="#3578c8" fill="none"/>
<rect x="250" y="92" width="260" height="48" rx="7" fill="#e8f1ff" stroke="#3578c8"/>
<text x="380" y="121" font-size="14">Django View receives POST data</text>
<path d="M380 140 V167" stroke="#3578c8" stroke-width="2"/><path d="M374 160 L380 168 L386 160" stroke="#3578c8" fill="none"/>
<rect x="250" y="172" width="260" height="48" rx="7" fill="#e8f7ed" stroke="#27965a"/>
<text x="380" y="201" font-size="14">StudentForm(request.POST)</text>
<path d="M380 220 V247" stroke="#27965a" stroke-width="2"/><path d="M374 240 L380 248 L386 240" stroke="#27965a" fill="none"/>
<polygon points="380,252 470,293 380,334 290,293" fill="#fff3df" stroke="#d18b28" stroke-width="1.5"/>
<text x="380" y="297" font-size="14" font-weight="bold">is_valid()?</text>
<path d="M290 293 H145 V360" stroke="#c64d4d" stroke-width="2" fill="none"/>
<path d="M139 352 L145 360 L151 352" stroke="#c64d4d" fill="none"/>
<rect x="35" y="365" width="220" height="48" rx="7" fill="#fcecec" stroke="#c64d4d"/>
<text x="145" y="394" font-size="13">Display validation errors</text>
<path d="M470 293 H615 V360" stroke="#27965a" stroke-width="2" fill="none"/>
<path d="M609 352 L615 360 L621 352" stroke="#27965a" fill="none"/>
<rect x="505" y="365" width="220" height="48" rx="7" fill="#e8f7ed" stroke="#27965a"/>
<text x="615" y="394" font-size="13">Access cleaned_data</text>
<text x="218" y="281" font-size="12" fill="#c64d4d">No</text>
<text x="540" y="281" font-size="12" fill="#27965a">Yes</text>
<text x="380" y="438" font-size="12" fill="#596579">Valid data is then passed to the database operation.</text>
</g>
</svg>

### 6.7 Custom validation

Django supports two important validation methods.

**Field-level validation: `clean_fieldname()`**

```python
class StudentForm(forms.Form):

    name = forms.CharField(max_length=100)

    age = forms.IntegerField()

    def clean_age(self):

        age = self.cleaned_data['age']

        if age < 18:
            raise forms.ValidationError(
                "Age must be at least 18."
            )

        return age
```

**Form-level validation: `clean()`**

```python
class StudentForm(forms.Form):

    email = forms.EmailField()

    confirm_email = forms.EmailField()

    def clean(self):

        # Obtain data after individual field validation.
        cleaned_data = super().clean()

        email = cleaned_data.get('email')
        confirm_email = cleaned_data.get('confirm_email')

        if email and confirm_email and email != confirm_email:

            raise forms.ValidationError(
                "Email addresses do not match."
            )

        return cleaned_data
```

### 6.8 Challenges and benefits of using forms.Form

| Benefits | Challenges |
|---|---|
| Automatic field validation | Database operations must be written manually |
| Automatic type conversion | Fields must be defined manually |
| Reusable validation logic | Form and model definitions can become inconsistent |
| Automatic error generation | More code for CRUD applications |
| Custom widgets and rendering | Additional work to handle model relationships |

**When to use `forms.Form`:**

- Login forms.
- Contact forms.
- Search forms.
- Filters.
- Calculators.
- Data that does not directly correspond to a database model.
- Multi-step forms and custom workflows.

# Part 4: Retrieving and Displaying Data

## Stage 7: Display Database Records in HTML

We have learned how to receive, validate and store data.

Now we need to retrieve the records and display them in the browser.

### 7.1 Retrieve records using Django ORM

Add a view:

`students/views.py`

```python
from .models import Student

def student_list(request):

    # Retrieve all student records.
    students = Student.objects.all()

    # Pass the records to the HTML template.
    return render(
        request,
        'student_list.html',
        {'students': students}
    )
```

### 7.2 Display records using Django templates

Create `templates/student_list.html`:

```html
<h2>Registered Students</h2>

<table border="1">

    <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Age</th>
        <th>Course</th>
    </tr>

    {% for student in students %}

    <tr>
        <td>{{ student.name }}</td>
        <td>{{ student.email }}</td>
        <td>{{ student.age }}</td>
        <td>{{ student.course }}</td>
    </tr>

    {% empty %}

    <tr>
        <td colspan="4">No students found.</td>
    </tr>

    {% endfor %}

</table>
```

### 7.3 Configure the URL

```python
urlpatterns = [
    path('register/', views.register_student, name='register_student'),

    path('students/', views.student_list, name='student_list'),
]
```

### 7.4 Understand the retrieval workflow

<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 760 310">
<rect width="760" height="310" fill="white"/>
<g font-family="Arial" font-size="14" fill="#172b4d" text-anchor="middle">
<rect x="250" y="15" width="260" height="48" rx="8" fill="#e8f1ff" stroke="#3578c8"/>
<text x="380" y="44" font-weight="bold">Browser requests /students/</text>
<path d="M380 63 V96" stroke="#3578c8" stroke-width="2"/><path d="M374 89 L380 97 L386 89" stroke="#3578c8" fill="none"/>
<rect x="250" y="102" width="260" height="48" rx="8" fill="#e8f7ed" stroke="#27965a"/>
<text x="380" y="131">Django View</text>
<path d="M380 150 V183" stroke="#27965a" stroke-width="2"/><path d="M374 176 L380 184 L386 176" stroke="#27965a" fill="none"/>
<rect x="250" y="189" width="260" height="48" rx="8" fill="#fff3df" stroke="#d18b28"/>
<text x="380" y="218">Django ORM retrieves records</text>
<path d="M510 213 H620" stroke="#d18b28" stroke-width="2"/><path d="M613 207 L621 213 L613 219" stroke="#d18b28" fill="none"/>
<rect x="625" y="189" width="120" height="48" rx="8" fill="#fff3df" stroke="#d18b28"/>
<text x="685" y="218" font-size="12">Database</text>
<path d="M380 237 V264" stroke="#27965a" stroke-width="2"/><path d="M374 257 L380 265 L386 257" stroke="#27965a" fill="none"/>
<rect x="250" y="270" width="260" height="32" rx="7" fill="#e8f1ff" stroke="#3578c8"/>
<text x="380" y="291" font-size="12">HTML template renders records</text>
</g>
</svg>

**Important concept:** In this approach, the Django view retrieves database records and passes them directly to the template.

An API is not required when the Django application itself is responsible for rendering the HTML page.

# Part 5: Understanding APIs and Their Role

## Stage 8: What If We Want to Use an API?

So far, we have used Django views to receive HTML form submissions and Django templates to display database records.

But modern applications often separate the frontend and backend.

For example:

- Frontend: React, Angular or Vue.
- Backend: Django.
- Database: PostgreSQL or MySQL.

In this architecture, the frontend communicates with Django through APIs.

### 8.1 Traditional Django architecture

```text
Browser
   |
   | HTML Form
   v
Django View
   |
   v
Django ORM
   |
   v
Database
   |
   v
Django Template
   |
   v
HTML Response
```

### 8.2 API-based architecture

```text
Browser / React / Mobile App
          |
          | JSON HTTP Request
          v
       Django API
          |
          v
       Validation
          |
          v
       Django ORM
          |
          v
       Database
          |
          v
       JSON Response
          |
          v
Frontend displays data
```

The main difference is that an API generally returns structured data, such as JSON, rather than a complete HTML page.

### 8.3 Create a simple JSON API using Django

Django provides `JsonResponse` to return JSON data.

Create a view:

`students/views.py`

```python
import json

from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_protect

from .models import Student


@require_http_methods(["POST"])
@csrf_protect
def student_api(request):

    try:
        # Convert incoming JSON into a Python dictionary.
        data = json.loads(request.body)

        # Retrieve submitted values.
        name = data.get('name')
        email = data.get('email')
        age = data.get('age')
        course = data.get('course')

        # Perform basic server-side validation.
        if not name or not email or age is None or not course:
            return JsonResponse(
                {'error': 'All fields are required.'},
                status=400
            )

        # Save the record using Django ORM.
        student = Student.objects.create(
            name=name,
            email=email,
            age=age,
            course=course
        )

        # Return the newly created record as JSON.
        return JsonResponse({
            'message': 'Student registered successfully.',
            'student': {
                'id': student.id,
                'name': student.name,
                'email': student.email,
                'age': student.age,
                'course': student.course
            }
        }, status=201)

    except (json.JSONDecodeError, TypeError, ValueError):
        return JsonResponse(
            {'error': 'Invalid JSON or data.'},
            status=400
        )
```

This is a basic demonstration. A production API should also validate field formats, numeric ranges, maximum lengths, duplicate values and authorization. The Django REST Framework introduced below provides more structured tools for this.

### 8.4 Understand the JSON request

The frontend can send the following JSON:

```json
{
    "name": "Rahul",
    "email": "rahul@example.com",
    "age": 21,
    "course": "BCA"
}
```

The API receives this data through:

```python
data = json.loads(request.body)
```

Unlike a conventional HTML form submission, JSON data is generally accessed through `request.body`, not `request.POST`.

### 8.5 Create a GET API to retrieve records

```python
from django.http import JsonResponse

def student_list_api(request):

    # Retrieve all student records.
    students = Student.objects.all()

    # Convert model objects into dictionaries.
    data = [
        {
            'id': student.id,
            'name': student.name,
            'email': student.email,
            'age': student.age,
            'course': student.course
        }
        for student in students
    ]

    # Return the records in JSON format.
    return JsonResponse(
        {'students': data}
    )
```

Configure the URLs:

```python
urlpatterns = [
    path('register/', views.register_student, name='register_student'),

    path('students/', views.student_list, name='student_list'),

    path('api/students/', views.student_list_api, name='student_list_api'),

    path('api/register/', views.student_api, name='student_api'),
]
```

Now open:

`http://127.0.0.1:8000/api/students/`

The response will look like:

```json
{
    "students": [
        {
            "id": 1,
            "name": "Rahul",
            "email": "rahul@example.com",
            "age": 21,
            "course": "BCA"
        }
    ]
}
```

### 8.6 Display API data in HTML using JavaScript

Create `templates/api_students.html`:

```html
<h2>Students Retrieved Using API</h2>

<table border="1">

    <thead>
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
        </tr>
    </thead>

    <tbody id="student-data"></tbody>

</table>

<script>
    // Request student records from the Django API.
    fetch('/api/students/')
        .then(response => response.json())

        // Process the returned JSON.
        .then(data => {

            const tbody = document.getElementById('student-data');

            data.students.forEach(student => {

                const row = document.createElement('tr');

                // Use textContent instead of innerHTML for untrusted data.
                const name = document.createElement('td');
                name.textContent = student.name;

                const email = document.createElement('td');
                email.textContent = student.email;

                const course = document.createElement('td');
                course.textContent = student.course;

                row.append(name, email, course);

                tbody.appendChild(row);
            });

        })

        .catch(error => console.error('API Error:', error));
</script>
```

Create a view to render this template:

```python
def api_students_page(request):
    return render(request, 'api_students.html')
```

Now the browser retrieves data through the API and JavaScript dynamically displays it.

### 8.7 How does security work with APIs?

APIs also need protection.

| Security concern | Traditional HTML forms | APIs |
|---|---|---|
| Input validation | Django Forms | Serializers or custom validation |
| CSRF | CSRF token | Depends on authentication mechanism |
| Authentication | Django sessions | Sessions, tokens or other authentication |
| Authorization | Django permissions/decorators | API permissions |
| SQL Injection | Django ORM | Django ORM |
| XSS | Template escaping | Safe frontend rendering |
| HTTPS | Required | Required |

**Important distinction about CSRF:**

- A traditional Django session-based application normally uses CSRF protection for unsafe requests.
- A session-authenticated API accessed by a browser also needs CSRF protection.
- A token-authenticated API using credentials that the browser does not automatically attach to cross-site requests has a different CSRF risk profile. Other token-storage and authorization risks still need to be addressed.

For a production API, Django REST Framework is generally preferable to writing all the JSON parsing, validation and response handling manually.

# Part 6: Django ModelForms

## Stage 9: Why Do We Need ModelForms?

We have now implemented three important operations:

1. Receiving data.
2. Validating data.
3. Saving data into the database.

Using `forms.Form`, we needed to define fields separately from the model and manually write database insertion logic.

Consider this situation:

Our Student model contains:

```python
class Student(models.Model):

    name = models.CharField(max_length=100)

    email = models.EmailField()

    age = models.IntegerField()

    course = models.CharField(max_length=50)
```

Our `StudentForm` separately contains:

```python
class StudentForm(forms.Form):

    name = forms.CharField(max_length=100)

    email = forms.EmailField()

    age = forms.IntegerField()

    course = forms.CharField(max_length=50)
```

We have defined essentially the same fields twice.

If we change the model, we may also need to update the form.

This introduces duplication and maintenance challenges.

**ModelForm solves this problem by generating form fields from an existing Django model.**

## Stage 10: Create Your First ModelForm

### 10.1 Create the model

`students/models.py`

```python
from django.db import models

class Student(models.Model):

    name = models.CharField(max_length=100)

    email = models.EmailField(unique=True)

    age = models.IntegerField()

    course = models.CharField(max_length=50)

    def __str__(self):
        return self.name
```

Run migrations:

```bash
uv run python manage.py makemigrations

uv run python manage.py migrate
```

### 10.2 Create a ModelForm

`students/forms.py`

```python
from django import forms
from .models import Student

class StudentModelForm(forms.ModelForm):

    class Meta:

        # Specify the model from which form fields are generated.
        model = Student

        # Specify the model fields to include in the form.
        fields = ['name', 'email', 'age', 'course']
```

Explain the `Meta` class.

| Property | Purpose |
|---|---|
| `model` | Specifies the associated database model |
| `fields` | Selects fields to include |
| `exclude` | Specifies fields to omit |
| `widgets` | Customizes HTML widgets |
| `labels` | Changes field labels |
| `help_texts` | Provides field instructions |
| `error_messages` | Customizes validation messages |

Prefer explicitly specifying `fields` rather than using `__all__`, especially when a model contains sensitive or internal fields.

### 10.3 Use ModelForm in a view

```python
from django.shortcuts import render, redirect
from .forms import StudentModelForm

def add_student(request):

    if request.method == 'POST':

        # Bind submitted values to the ModelForm.
        form = StudentModelForm(request.POST)

        if form.is_valid():

            # Validate and save the model record.
            form.save()

            return redirect('student_list')

    else:

        # Display an empty ModelForm.
        form = StudentModelForm()

    return render(
        request,
        'student_form.html',
        {'form': form}
    )
```

Notice the important difference.

With `forms.Form`, we wrote:

```python
Student.objects.create(
    name=form.cleaned_data['name'],
    email=form.cleaned_data['email'],
    age=form.cleaned_data['age'],
    course=form.cleaned_data['course']
)
```

With `ModelForm`, we simply write:

```python
form.save()
```

Django handles model instance creation and persistence.

## Stage 11: Understand ModelForm Validation

ModelForms provide several levels of validation.

1. Field validation.
2. Form-level custom validation.
3. Model field validation.
4. Model uniqueness validation.

For example:

```python
class StudentModelForm(forms.ModelForm):

    class Meta:
        model = Student
        fields = ['name', 'email', 'age', 'course']

    def clean_age(self):

        age = self.cleaned_data['age']

        if age < 18:
            raise forms.ValidationError(
                "Student must be at least 18 years old."
            )

        return age
```

Django combines the model-related field rules with form validation.

However, remember that model validation and database constraints are not identical. `ModelForm.is_valid()` does not automatically execute every custom `Model.clean()` method unless the relevant model validation is invoked. Database constraints remain important for data integrity.

## Stage 12: Create and Update Using the Same ModelForm

One of the biggest benefits of ModelForms is that the same form can create new records and update existing records.

### 12.1 Create a record

```python
form = StudentModelForm(request.POST)

if form.is_valid():
    form.save()
```

### 12.2 Update a record

```python
student = Student.objects.get(id=1)

# Bind the submitted values to the existing database object.
form = StudentModelForm(
    request.POST,
    instance=student
)

if form.is_valid():
    form.save()
```

The difference is `instance=student`.

| Without instance | With instance |
|---|---|
| Creates a new object | Updates the existing object |
| New database record | Existing database record |
| Insert operation | Update operation |

### 12.3 Understand `commit=False`

Sometimes we need to modify a model instance before saving it.

For example, suppose each student record should also store the user who created it.

Update the model:

```python
from django.conf import settings

class Student(models.Model):

    name = models.CharField(max_length=100)

    email = models.EmailField(unique=True)

    age = models.IntegerField()

    course = models.CharField(max_length=50)

    # Associate each student record with its creator.
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
```

Update the view:

```python
def add_student(request):

    if request.method == 'POST':

        form = StudentModelForm(request.POST)

        if form.is_valid():

            # Create the model object without saving it yet.
            student = form.save(commit=False)

            # Assign the logged-in user.
            student.created_by = request.user

            # Save the completed object.
            student.save()

            return redirect('student_list')

    else:
        form = StudentModelForm()

    return render(
        request,
        'student_form.html',
        {'form': form}
    )
```

This is an important concept for applications involving authentication and ownership.

The `created_by` field should not be exposed as an ordinary editable form field. The server assigns it from the authenticated request.

# Part 7: Complete CRUD with ModelForms

## Stage 13: Implement CRUD Operations

At this point, students should be comfortable with models, ModelForms, validation and database operations.

Now implement the complete application.

### 13.1 Create

Use `add_student()` from Stage 10.

### 13.2 Read

```python
def student_list(request):

    # Retrieve student records from the database.
    students = Student.objects.all()

    return render(
        request,
        'student_list.html',
        {'students': students}
    )
```

### 13.3 Update

```python
from django.shortcuts import get_object_or_404

def edit_student(request, id):

    # Retrieve the existing record.
    student = get_object_or_404(Student, id=id)

    if request.method == 'POST':

        # Update the existing object using ModelForm.
        form = StudentModelForm(
            request.POST,
            instance=student
        )

        if form.is_valid():
            form.save()
            return redirect('student_list')

    else:

        # Prepopulate fields with existing database values.
        form = StudentModelForm(instance=student)

    return render(
        request,
        'student_form.html',
        {'form': form}
    )
```

### 13.4 Delete

```python
def delete_student(request, id):

    student = get_object_or_404(Student, id=id)

    if request.method == 'POST':

        # Delete the database record.
        student.delete()

        return redirect('student_list')

    return render(
        request,
        'student_confirm_delete.html',
        {'student': student}
    )
```

Deletion should be performed through POST rather than a GET link.

### 13.5 Display the student list

`templates/student_list.html`

```html
<h2>Student Records</h2>

<a href="{% url 'add_student' %}">Add Student</a>

<table border="1">

    <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Age</th>
        <th>Course</th>
        <th>Actions</th>
    </tr>

    {% for student in students %}

    <tr>

        <td>{{ student.name }}</td>
        <td>{{ student.email }}</td>
        <td>{{ student.age }}</td>
        <td>{{ student.course }}</td>

        <td>

            <a href="{% url 'edit_student' student.id %}">
                Edit
            </a>

            <a href="{% url 'delete_student' student.id %}">
                Delete
            </a>

        </td>

    </tr>

    {% empty %}

    <tr>
        <td colspan="5">No student records available.</td>
    </tr>

    {% endfor %}

</table>
```

# Part 8: User Registration, Login and Authorization

## Stage 14: Integrate Django Authentication

Now that students understand forms and ModelForms, introduce the built-in authentication system.

Django already provides a User model, password hashing, session management and authentication functions.

We do not need to create our own user table for basic registration and login.

### 14.1 Create the accounts application

```bash
uv run python manage.py startapp accounts
```

Add `accounts` to `INSTALLED_APPS`.

### 14.2 Registration using UserCreationForm

Django provides `UserCreationForm`, which is a specialized ModelForm.

Create `accounts/forms.py`:

```python
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class RegistrationForm(UserCreationForm):

    class Meta:
        model = User

        fields = [
            'username',
            'first_name',
            'last_name',
            'email'
        ]
```

Why use `UserCreationForm` instead of creating a regular ModelForm?

Because passwords require special treatment.

`UserCreationForm` provides:

- Password entry.
- Password confirmation.
- Password validation.
- Password hashing.
- Username validation.

Never save a raw password directly into the User model using an ordinary ModelForm.

### 14.3 Registration view

`accounts/views.py`

```python
from django.shortcuts import render, redirect
from django.contrib.auth import login
from .forms import RegistrationForm

def register(request):

    if request.method == 'POST':

        form = RegistrationForm(request.POST)

        if form.is_valid():

            # Save the new user with a hashed password.
            user = form.save()

            # Automatically log in the newly registered user.
            login(request, user)

            return redirect('student_list')

    else:
        form = RegistrationForm()

    return render(
        request,
        'register.html',
        {'form': form}
    )
```

### 14.4 Login using AuthenticationForm

Django also provides `AuthenticationForm`.

`accounts/views.py`

```python
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login

def user_login(request):

    if request.method == 'POST':

        # Bind submitted credentials to AuthenticationForm.
        form = AuthenticationForm(
            request,
            data=request.POST
        )

        if form.is_valid():

            # Retrieve the authenticated user.
            user = form.get_user()

            # Establish the authenticated session.
            login(request, user)

            return redirect('student_list')

    else:
        form = AuthenticationForm(request)

    return render(
        request,
        'login.html',
        {'form': form}
    )
```

### 14.5 Logout

```python
from django.contrib.auth import logout

def user_logout(request):

    # Terminate the current authenticated session.
    logout(request)

    return redirect('login')
```

Configure logout as a POST-only URL and invoke it through a POST form with a CSRF token.

### 14.6 Protect student management pages

Django provides `login_required`.

```python
from django.contrib.auth.decorators import login_required

@login_required
def student_list(request):

    students = Student.objects.all()

    return render(
        request,
        'student_list.html',
        {'students': students}
    )
```

Apply the decorator to add, edit and delete operations too.

Configure:

```python
LOGIN_URL = '/accounts/login/'

LOGIN_REDIRECT_URL = '/students/'

LOGOUT_REDIRECT_URL = '/accounts/login/'
```

### 14.7 Authentication versus authorization

These are different concepts.

**Authentication:** Who are you?

Example: A user logs in using a username and password.

**Authorization:** What are you allowed to do?

Example:

- Administrator can manage all student records.
- Faculty can manage assigned students.
- Students can view their own records.

Using `login_required` only checks whether a user is authenticated.

It does not automatically determine whether the user owns a particular record.

For example, if students should access only their own records:

```python
@login_required
def student_list(request):

    # Retrieve records belonging only to the logged-in user.
    students = Student.objects.filter(
        created_by=request.user
    )

    return render(
        request,
        'student_list.html',
        {'students': students}
    )
```

Similarly, update and delete views must check ownership before modifying a record.

# Part 9: Comparison of All Three Approaches

At this point, students should understand why Django provides multiple ways to process form data.

| Feature | HTML + Manual Processing | `forms.Form` | `forms.ModelForm` |
|---|---|---|---|
| Field definition | HTML | Python | Generated from model |
| HTML rendering | Manual | Automatic or manual | Automatic or manual |
| Validation | Manual | Built-in and custom | Built-in, model-aware and custom |
| Data conversion | Manual | Automatic | Automatic |
| Error handling | Manual | Built-in | Built-in |
| Database saving | Manual | Manual | `form.save()` |
| Create operations | Manual | Manual | Built-in |
| Update operations | Manual | Manual | Supports `instance` |
| Reusable validation | Limited | Yes | Yes |
| Best suited for | Understanding HTTP and simple custom interfaces | Login, search and custom input | Database CRUD applications |

**Important:** All three approaches ultimately receive HTTP requests. ModelForms do not replace the HTTP request-response mechanism; they simplify how submitted data is validated and mapped to models.

# Part 10: Final Practical Assignment

## Student Management Portal

Students should now build a complete application integrating the concepts from every stage.

### Functional requirements

| Module | Functionality |
|---|---|
| Registration | Create user accounts |
| Login | Authenticate users |
| Logout | Terminate sessions |
| Dashboard | Display student information |
| Add Student | Create records using ModelForm |
| Student List | Retrieve and display records |
| Edit Student | Update existing records |
| Delete Student | Delete records with confirmation |
| Search | Search by name or course |
| Validation | Validate all submitted fields |
| Security | CSRF, authentication and authorization |
| File Upload | Upload student photographs |
| API | Retrieve student data in JSON format |

### Suggested final architecture

<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 760 500">
<rect width="760" height="500" fill="white"/>
<g font-family="Arial" text-anchor="middle" fill="#172b4d">
<rect x="240" y="12" width="280" height="54" rx="8" fill="#e8f1ff" stroke="#3578c8" stroke-width="1.5"/>
<text x="380" y="35" font-size="15" font-weight="bold">Frontend / Browser</text><text x="380" y="53" font-size="12">HTML, CSS, JavaScript</text>
<path d="M380 66 V101" stroke="#3578c8" stroke-width="2"/><path d="M374 94 L380 102 L386 94" fill="none" stroke="#3578c8" stroke-width="2"/>
<rect x="240" y="107" width="280" height="58" rx="8" fill="#e8f7ed" stroke="#27965a" stroke-width="1.5"/>
<text x="380" y="131" font-size="15" font-weight="bold">Django URL Routing</text><text x="380" y="150" font-size="12">Request dispatching</text>
<path d="M380 165 V200" stroke="#27965a" stroke-width="2"/><path d="M374 193 L380 201 L386 193" fill="none" stroke="#27965a" stroke-width="2"/>
<rect x="240" y="206" width="280" height="58" rx="8" fill="#e8f7ed" stroke="#27965a" stroke-width="1.5"/>
<text x="380" y="230" font-size="15" font-weight="bold">Django Views</text><text x="380" y="249" font-size="12">Business logic and request handling</text>
<path d="M380 264 V299" stroke="#27965a" stroke-width="2"/><path d="M374 292 L380 300 L386 292" fill="none" stroke="#27965a" stroke-width="2"/>
<rect x="240" y="305" width="280" height="58" rx="8" fill="#fff3df" stroke="#d18b28" stroke-width="1.5"/>
<text x="380" y="329" font-size="15" font-weight="bold">Django Forms / ModelForms</text><text x="380" y="348" font-size="12">Validation and data processing</text>
<path d="M380 363 V398" stroke="#d18b28" stroke-width="2"/><path d="M374 391 L380 399 L386 391" fill="none" stroke="#d18b28" stroke-width="2"/>
<rect x="240" y="404" width="280" height="54" rx="8" fill="#f0eaff" stroke="#8056b3" stroke-width="1.5"/>
<text x="380" y="428" font-size="15" font-weight="bold">Django ORM</text><text x="380" y="446" font-size="12">Database queries and persistence</text>
<path d="M520 431 H620" stroke="#8056b3" stroke-width="2"/><path d="M613 425 L621 431 L613 437" fill="none" stroke="#8056b3" stroke-width="2"/>
<rect x="625" y="404" width="125" height="54" rx="8" fill="#fff3df" stroke="#d18b28" stroke-width="1.5"/>
<text x="687" y="428" font-size="14" font-weight="bold">Database</text><text x="687" y="446" font-size="11">SQLite / PostgreSQL</text>
<text x="45" y="130" font-size="12" text-anchor="start">Authentication</text><text x="45" y="148" font-size="12" text-anchor="start">Authorization</text><text x="45" y="166" font-size="12" text-anchor="start">CSRF Protection</text>
<path d="M180 155 H232" stroke="#8056b3" stroke-width="1.5" stroke-dasharray="4 3"/>
<text x="380" y="487" font-size="12" fill="#596579">Django manages the complete request-response and data workflow.</text>
</g>
</svg>

## Recommended Session Sequence

For a 14-session practical course:

| Session | Topic | Practical output |
|---|---|---|
| 1 | HTML forms, action, GET and POST | Basic registration form |
| 2 | Django request-response handling | Receive form data |
| 3 | Server-side validation and security | Manual validation |
| 4 | Django models and ORM | Save and retrieve records |
| 5 | Django Forms | Create and render forms |
| 6 | Form validation and custom cleaning | Validated admission form |
| 7 | Displaying records using templates | Student listing |
| 8 | Introduction to APIs and JSON | GET and POST APIs |
| 9 | ModelForms | Model-based registration |
| 10 | ModelForm CRUD | Create, update and delete |
| 11 | File uploads and advanced widgets | Student photographs |
| 12 | Django User Registration and Login | Authentication |
| 13 | Sessions, CSRF and authorization | Protected dashboard |
| 14 | Integration and testing | Complete Student Management Portal |

## Final Teaching Recommendation

The most important pedagogical decision is to **teach the data flow before teaching Django's abstractions**.

Students should first understand:

1. HTML form → HTTP request.
2. HTTP request → Django view.
3. Django view → validation.
4. Validation → database.
5. Database → Django view.
6. Django view → HTML response.

Then introduce Django Forms as a better way of handling input and validation, and ModelForms as a way of connecting forms with database models.

Finally, introduce APIs as an alternative communication mechanism between frontend and backend.

This sequence gives students an understanding of not just *how to write Django code*, but *why Django provides Forms, ModelForms, ORM, authentication, CSRF middleware and API frameworks in the first place*.
