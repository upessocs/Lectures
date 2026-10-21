# Lecture 30

# Security, Authentication, and Authorization in Django

**Course Outcome:** CO4 – Apply security best practices and conduct testing.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 30 |
| Unit | Unit 3: Frameworks and Performance Optimization |
| Topic | Security, Authentication, and Authorization in Django |
| Course Outcome | CO4 – Apply security best practices and conduct testing |
| Bloom's Knowledge Level | Apply |
| Skills Developed | Authentication/Authorization implementation, Security practices, CSRF/XSS protection |
| Applications | Secure web applications |
| PBL Activity | Implementing user authentication and permissions for Student API |
| Assessment Method | Coding exercise |

---

## Part A – Theory

### 1. Introduction
Security is paramount in backend development. Django provides "batteries-included" security by default, protecting against common vulnerabilities like CSRF (Cross-Site Request Forgery), XSS (Cross-Site Scripting), and SQL injection.

### 2. Authentication
Authentication confirms a user's identity. Django’s built-in `auth` app manages user accounts, groups, permissions, and session-based login/logout.

### 3. Authorization
Authorization determines what an authenticated user is allowed to do. Django uses a system of permissions linked to users and groups to restrict access to views or data objects.

---

## Part B – Hands-On

### Task: Implement a Protected View
Use the `login_required` decorator to protect views.

1. In `students/views.py`:
```python
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

@login_required
def secure_data_view(request):
    return JsonResponse({"message": "This is only for authenticated users."})
```

2. To protect the entire API, consider using Django REST Framework's permission classes (if added to the project later). For now, use the built-in decorator to restrict access to specific views.

---

## PBL Activity
*Hint: You will need to create a superuser using `python manage.py createsuperuser` and set up a basic login form or use Django's built-in login view to test this.*

### Problem Scenario
Your API contains sensitive student records that must not be accessible to anonymous visitors.

### Student Task
1. Create a `User` in your database.
2. Protect the student data views so that only logged-in users can see the student list.
3. Configure the login URL in `settings.py` so unauthenticated users are redirected properly.

---

## Assessment Activity
*Hint: Test the protection by attempting to access the URL while logged out, and then while logged in as a regular user versus an admin.*

### Evaluation Criteria
| Criterion | Expected Evidence |
|---|---|
| Access Control | Unauthenticated users receive a 403 or redirect |
| Authentication | Authenticated users successfully access data |

---

## Summary

### Key Takeaways
- **Authentication** is about *who you are*; **Authorization** is about *what you can do*.
- Never reinvent the authentication wheel; always use Django's battle-tested `django.contrib.auth`.
- Always enable CSRF protection for any form-based interaction.

### Next Lecture
L31 – Caching and Performance Optimization.
