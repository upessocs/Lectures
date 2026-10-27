# Lecture 30: Security, Authentication, and Authorization in Django

**Course Outcome:** CO4 – Apply security best practices and conduct testing.

## 1. Session Implementation Plan

| Parameter              | Details                                                           |
| ---------------------- | ----------------------------------------------------------------- |
| Lecture No.            | 30                                                                |
| Unit                   | Unit 3: Frameworks and Performance Optimization                   |
| Topic                  | Security, Authentication, and Authorization in Django             |
| Course Outcome         | CO4 – Apply security best practices and conduct testing           |
| Bloom's Taxonomy Level | Apply (L3)                                                        |
| Skills Developed       | Authentication, authorization, access control, and web security   |
| Applications           | Secure web applications and protected REST APIs                   |
| PBL Activity           | Implement authentication and role-based access to student records |
| Assessment Method      | Coding exercise and functional testing                            |

## Part A – Theory

### 2. Introduction to Web Security

Web security ensures that only authorized users can access sensitive information and perform permitted operations.

Django provides built-in security features to help developers protect applications against common vulnerabilities.

Important security mechanisms include:

- **Authentication:** Verifies the identity of a user.
- **Authorization:** Determines which resources and operations a user can access.
- **CSRF protection:** Helps prevent unauthorized requests submitted through a user's authenticated browser.
- **XSS protection:** Django templates automatically escape many unsafe HTML characters by default.
- **SQL injection protection:** Django ORM uses parameterized queries for standard database operations.

These protections do not eliminate the need for secure coding practices. Developers must configure authentication, validate inputs, control permissions, and avoid unsafe operations.

### 3. Authentication in Django

Authentication answers the question: **Who are you?**

Django provides the `django.contrib.auth` application to manage users, passwords, groups, permissions, and login/logout operations.

The main components are:

| Component         | Purpose                                 |
| ----------------- | --------------------------------------- |
| User              | Represents a user account               |
| `authenticate()`  | Checks the supplied credentials         |
| `login()`         | Establishes an authenticated session    |
| `logout()`        | Ends the authenticated session          |
| `login_required`  | Restricts a view to authenticated users |
| `createsuperuser` | Creates an administrative account       |

Django typically uses sessions and cookies to maintain authentication across multiple HTTP requests.

**Example authentication flow:**

1. A user submits a username and password.
2. Django validates the credentials.
3. If valid, Django establishes an authenticated session.
4. The browser sends the session cookie with subsequent requests.
5. Django identifies the user associated with that session.

### 4. Authorization in Django

Authorization answers the question: **What are you allowed to do?**

A user may be authenticated but still lack permission to perform a particular operation.

For example, a student may view student records but must not delete them. An administrator may have permission to add, update, and delete records.

Django supports authorization through:

- **Permissions:** Control access to actions such as add, change, delete, and view.
- **Groups:** Assign a common set of permissions to multiple users.
- **View decorators:** Restrict access to views.
- **Object-level checks:** Enforce rules for individual records where required by the application.

Django creates the standard model permissions when migrations are applied. These permissions can be assigned to users and groups.

### 5. Authentication vs. Authorization

| Authentication                | Authorization                                      |
| ----------------------------- | -------------------------------------------------- |
| Verifies user identity        | Checks user privileges                             |
| Answers “Who are you?”        | Answers “What can you do?”                         |
| Example: Logging in           | Example: Checking permission to delete a student   |
| Uses credentials and sessions | Uses permissions, groups, and access-control rules |

### 6. Security Best Practices

1. Use Django's built-in authentication system rather than implementing password handling from scratch.
2. Protect sensitive views and data using appropriate authorization checks.
3. Keep CSRF protection enabled for browser-based form submissions.
4. Avoid using `csrf_exempt` unless a carefully reviewed design requires it.
5. Use Django ORM methods instead of constructing SQL queries through string concatenation.
6. Set `DEBUG = False` in production and configure `ALLOWED_HOSTS`.
7. Use HTTPS in production and configure secure session and CSRF cookies.
8. Never expose passwords, secret keys, or sensitive personal data in logs or API responses.
9. Test access using anonymous users, ordinary users, and administrators.

## Part B – Hands-On

### 7. Practical: Protect a Django View

**Objective:** Restrict access to student data so that only authenticated users can view it.

#### Step 1: Check the authentication configuration

In `settings.py`, ensure that Django's authentication and session applications are enabled. A standard Django project already includes these applications.

```
INSTALLED_APPS = [
    # Other installed applications...
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
]
```

The standard middleware configuration should include session and authentication middleware:

```
MIDDLEWARE = [
    # Other middleware...
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
]
```

Do not add duplicate entries if they are already present.

#### Step 2: Protect a view

Create or update the view in `students/views.py`.

```
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse


@login_required
def secure_data_view(request):
    # This code executes only after the user is authenticated.
    return JsonResponse({
        "message": "You are authenticated.",
        "username": request.user.username,
    })
```

**Explanation:**

- `login_required` checks whether the current user is authenticated.
- Anonymous users are redirected to the configured login page.
- Authenticated users can execute the view.
- `JsonResponse` returns the result in JSON format.

Authentication alone does not guarantee permission to access every student record. Additional authorization checks may be necessary.

#### Step 3: Configure the URL

In `students/urls.py`:

```
from django.urls import path
from . import views

urlpatterns = [
    path("secure-data/", views.secure_data_view, name="secure-data"),
]
```

Ensure that `students.urls` is included in the project's main `urls.py`.

#### Step 4: Configure the login URL

In the project's `settings.py`:

```
# Anonymous users will be redirected to this login URL.
LOGIN_URL = "/accounts/login/"
```

This setting specifies the login destination. It does not create a login page automatically.

#### Step 5: Create an administrator account

Run the following command:

```
python manage.py createsuperuser
```

Follow the prompts to create a username and password.

Run the development server:

```
python manage.py runserver
```

You can use Django's administration interface at `/admin/` to manage users. However, logging into `/admin/` does not automatically provide a login page at `/accounts/login/`.

#### Step 6: Enable a built-in login view

In the project's main `urls.py`, add Django's built-in authentication URLs:

```
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("django.contrib.auth.urls")),
    path("students/", include("students.urls")),
]
```

Django provides the login view through these URLs, but a login template must also be created.

Create the following file:

`templates/registration/login.html`

```
<h2>Login</h2>

<form method="post">
    {% csrf_token %}

    {{ form.as_p }}

    <button type="submit">Login</button>
</form>
```

Ensure that the `TEMPLATES` configuration in `settings.py` includes the project's `templates` directory, for example:

```
"DIRS": [BASE_DIR / "templates"],
```

After configuration, the login page is available at `/accounts/login/`.

### 8. Authorization Exercise: Restrict Access to Administrators

To restrict a view to users with the `is_staff` flag, use `staff_member_required`.

```
from django.contrib.admin.views.decorators import staff_member_required
from django.http import JsonResponse


@staff_member_required
def staff_data_view(request):
    # Only authenticated staff users can access this view.
    return JsonResponse({
        "message": "Staff access granted."
    })
```

**Important distinction:** `is_staff` generally controls access to the Django administration site. It is not a substitute for checking a specific model permission or business rule.

For a model-specific permission, use `permission_required`:

```
from django.contrib.auth.decorators import permission_required
from django.http import JsonResponse


@permission_required("students.view_student", raise_exception=True)
def student_records_view(request):
    # Users need the view_student permission for this model.
    return JsonResponse({
        "message": "Student record access granted."
    })
```

Replace `Student` with the actual model name if it differs. The permission must exist and be assigned to the user or one of their groups.

## Part C – Problem-Based Learning (PBL)

### 9. Problem Scenario

A college maintains student records in a Django application. Anonymous visitors must not access the student list. Regular users must not perform administrative operations, and only users with appropriate permissions may modify student records.

### Student Tasks

1. Create an administrator account using `createsuperuser`.
2. Create a regular user through Django admin.
3. Protect the student list view using `login_required`.
4. Configure and test the login URL.
5. Create a view that requires the `students.view_student` permission.
6. Test the application using anonymous, regular, and authorized users.
7. Record the HTTP response or redirect behavior for each test case.

**Expected learning outcome:** Students should demonstrate the difference between verifying identity and enforcing permissions.

## Part D – Assessment and Testing

### 10. Test Cases

| Test Case                        | User State              | Expected Result                   |
| -------------------------------- | ----------------------- | --------------------------------- |
| Access protected view            | Anonymous               | Redirect to login page            |
| Access protected view            | Authenticated user      | View executes                     |
| Access permission-protected view | User without permission | Access denied                     |
| Access permission-protected view | User with permission    | View executes                     |
| Submit a valid login form        | Valid credentials       | Authenticated session established |
| Submit an invalid login form     | Invalid credentials     | Login rejected                    |

Django's built-in decorators may return a redirect or a permission-denied response depending on the decorator, configuration, and user state. A redirect is not equivalent to an HTTP 403 response.

### 11. Evaluation Criteria

| Criterion                     | Marks  | Expected Evidence                                        |
| ----------------------------- | ------ | -------------------------------------------------------- |
| Authentication implementation | 3      | Correct login configuration and protected view           |
| Authorization implementation  | 3      | Appropriate permission checks                            |
| Functional testing            | 2      | Tests for anonymous and authenticated users              |
| Security practices            | 2      | CSRF protection and correct access-control configuration |
| **Total**                     | **10** | <br>                                                     |

## 12. Summary

### Key Takeaways

- Authentication verifies the identity of a user.
- Authorization determines which operations and resources a user can access.
- Django provides built-in user management, session handling, permissions, and security mechanisms.
- `login_required` protects views from anonymous access.
- `permission_required` enforces model permissions.
- A secure application must test access restrictions rather than assuming that a successful login grants all privileges.

### Next Lecture

**Lecture 31 – Caching and Performance Optimization**

Add Django security project setupAlign code with the student records