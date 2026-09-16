# Django & Django REST Framework: Complete Tutorial

## 📋 Table of Contents
1. [Django Fundamentals](#1-django-fundamentals)
2. [Django REST Framework](#2-django-rest-framework)
3. [Template Strategies Comparison](#3-template-strategies-comparison)
4. [Jinja2 Integration](#4-jinja2-integration)
5. [File Upload Handling](#5-file-upload-handling)

---

## 1. Django Fundamentals

### Quick Setup
```bash
pip install django
django-admin startproject myproject .
python manage.py startapp core
```

### Project Structure (Strategy A: Central Location)
```
myproject/
├── manage.py
├── myproject/
│   ├── settings.py          # Central: All settings here
│   ├── urls.py              # Central: Main URL routing
│   ├── wsgi.py
│   └── asgi.py
├── core/                    # Single app
│   ├── models.py            # Central: All models here
│   ├── views.py             # Central: All views here
│   ├── templates/
│   │   └── base.html        # Central: Base template here
│   └── migrations/
└── templates/               # Central: Additional templates
```

### Strategy B: Per-App Structure (Recommended for Scale)
```
myproject/
├── manage.py
├── myproject/
│   ├── settings.py          # Settings with APP_DIRS
│   ├── urls.py              # Central URL routing
│   ├── wsgi.py
│   └── asgi.py
├── users/                   # App 1
│   ├── models.py
│   ├── views.py
│   ├── urls.py              # App-specific URLs
│   ├── templates/
│   │   └── users/
│   │       └── profile.html  # App-specific templates
│   └── migrations/
├── blog/                    # App 2
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   ├── templates/
│   │   └── blog/
│   │       └── post_list.html
│   └── migrations/
└── templates/               # Optional: shared templates
```

### Django Settings (Per-App Structure)
```python
# myproject/settings.py
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    # ...
    'users',
    'blog',
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],  # Can add shared templates here
        'APP_DIRS': True,  # Auto-detect app templates/
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
            ],
        },
    },
]

# Allow app templates in multiple directories
BASE_DIR = Path(__file__).resolve().parent.parent
```

### Models (Central vs Per-App)

**Central Location:**
```python
# core/models.py
from django.db import models

class UserProfile(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
```

**Per-App:**
```python
# users/models.py
from django.db import models

class UserProfile(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()

    def __str__(self):
        return self.name

# blog/models.py
class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
```

### Views & Templates

**Central Location:**
```python
# core/views.py
from django.shortcuts import render

def home(request):
    return render(request, 'home.html')  # Looks in core/templates/

def profile(request):
    return render(request, 'profile.html')
```

**Per-App:**
```python
# users/views.py
from django.shortcuts import render

def profile(request):
    return render(request, 'profile.html')  # Looks in users/templates/
```

### URL Configuration

**Central:**
```python
# myproject/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')),  # One app
]

# core/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('profile/', views.profile, name='profile'),
]
```

**Per-App:**
```python
# myproject/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),
    path('blog/', include('blog.urls')),
]

# users/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('profile/', views.profile, name='profile'),
]

# blog/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('post-list/', views.post_list, name='post-list'),
]
```

---

## 2. Django REST Framework

### Setup
```bash
pip install djangorestframework
```

### Add to settings.py
```python
INSTALLED_APPS = [
    # ...
    'rest_framework',
    'users',
    'blog',
]

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
}
```

### Models (Same as Django)
```python
# users/models.py
from django.db import models

class UserProfile(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name
```

### Serializers
```python
# users/serializers.py
from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'name', 'email']
        read_only_fields = ['id']
```

### Views (Class-Based)
```python
# users/views.py
from rest_framework import viewsets
from .models import UserProfile
from .serializers import UserProfileSerializer

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    
    # Optional: Add filtering
    filterset_fields = ['name', 'email']
    
    # Optional: Add search
    search_fields = ['name', 'email']
```

### Views (Function-Based)
```python
# users/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import UserProfile
from .serializers import UserProfileSerializer
from rest_framework.response import Response

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def user_profiles(request):
    if request.method == 'GET':
        profiles = UserProfile.objects.all()
        serializer = UserProfileSerializer(profiles, many=True)
        return Response(serializer.data)
    
    if request.method == 'POST':
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

### URLs
```python
# users/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserProfileViewSet

router = DefaultRouter()
router.register(r'profiles', UserProfileViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
```

### Custom Router
```python
# users/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserProfileViewSet, ProfileList

router = DefaultRouter()
router.register(r'profiles', UserProfileViewSet)
router.register(r'profiles-list', ProfileList, basename='profile-list')

urlpatterns = [
    path('', include(router.urls)),
]
```

---

## 3. Template Strategies Comparison

### Strategy A: Central Location (Single App)
**Best for:** Small projects, prototypes, learning

**Pros:**
- ✅ Simple structure
- ✅ Easy navigation
- ✅ Fewer configuration issues
- ✅ Quick development speed

**Cons:**
- ❌ Hard to scale
- ❌ Template conflicts possible
- ❌ Hard to maintain as project grows
- ❌ All templates in one place

**Structure:**
```
core/
├── templates/
│   ├── base.html
│   ├── home.html
│   ├── about.html
│   └── contact.html
```

**Usage:**
```python
# views.py
from django.shortcuts import render

def home(request):
    return render(request, 'home.html')  # core/templates/home.html
```

### Strategy B: Per-App Structure (Recommended)
**Best for:** Medium to large projects, multi-app architectures

**Pros:**
- ✅ Clear separation of concerns
- ✅ Easy to scale
- ✅ No template conflicts
- ✅ Better organization
- ✅ Team collaboration friendly
- ✅ Can share templates via `TEMPLATES[0]['DIRS']`

**Cons:**
- ❌ More initial setup
- ❌ Slightly more complex
- ❌ Need to configure `APP_DIRS`

**Structure:**
```
users/
├── templates/
│   └── users/
│       ├── base.html
│       ├── profile.html
│       └── settings.html

blog/
├── templates/
│   └── blog/
│       ├── post_list.html
│       └── post_detail.html
```

**Usage:**
```python
# views.py
from django.shortcuts import render

def profile(request):
    return render(request, 'profile.html')  # users/templates/users/profile.html
```

### Shared Templates
```python
# myproject/settings.py
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'shared_templates'],  # Shared templates here
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
            ],
        },
    },
]
```

**shared_templates/base.html**
```html
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}My Site{% endblock %}</title>
</head>
<body>
    {% block content %}{% endblock %}
</body>
</html>
```

---

## 4. Jinja2 Integration

### Why Use Jinja2?
- More powerful than Django templates
- Better for complex logic
- Template inheritance
- Macros and filters

### Installation
```bash
pip install jinja2
```

### Basic Jinja2 Template
```jinja
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}Hello Jinja{% endblock %}</title>
</head>
<body>
    {% block content %}
        <h1>Hello {{ name }}!</h1>
        <p>Welcome to {{ site_name }}</p>
        {% for item in items %}
            <li>{{ item }}</li>
        {% endfor %}
    {% endblock %}
</body>
</html>
```

### Jinja2 Environment Setup
```python
# jinja_view.py
from flask import Flask, render_template  # Using Flask for simplicity
from jinja2 import Environment, BaseLoader

class Jinja2DjangoView:
    def __init__(self, template_dir):
        self.env = Environment(
            loader=BaseLoader(template_dir),
            autoescape=True
        )
        self.template_dir = template_dir
    
    def render(self, template_name, **context):
        template = self.env.get_template(template_name)
        return template.render(**context)
```

### Django + Jinja2 Hybrid
```python
# views.py
from django.shortcuts import render
from jinja2 import Environment, BaseLoader

class JinjaTemplateView:
    def __init__(self, template_dir):
        self.env = Environment(
            loader=BaseLoader(template_dir),
            autoescape=True
        )
        self.template_dir = template_dir
    
    def get_template(self, name):
        return self.env.get_template(name)

# Usage in view
def home(request):
    view = JinjaTemplateView('templates')
    template = view.get_template('home.html')
    context = {
        'name': 'World',
        'items': ['Python', 'Django', 'Jinja2'],
    }
    return HttpResponse(template.render(**context))
```

### Jinja2 vs Django Templates Comparison

| Feature | Django Templates | Jinja2 |
|---------|------------------|-------|
| Syntax | `{{ variable }}` | `{{ variable }}` |
| Conditionals | `{% if %}` | `{% if %}` |
| Loops | `{% for %}` | `{% for %}` |
| Inheritance | `{% extends %}` | `{% extends %}` |
| Macros | No | `{% macro %}` |
| Filters | `{{ var|filter }}` | `{{ var|filter }}` |
| Blocks | `{% block %}` | `{% block %}` |
| Tests | `{% if var is bool %}` | `{% if var is bool %}` |
| Custom Filters | Yes | Yes |
| Performance | Good | Excellent |
| Learning Curve | Easy | Moderate |

---

## 5. File Upload Handling

### Basic File Upload

**HTML Form:**
```html
<form method="post" enctype="multipart/form-data">
    {% csrf_token %}
    <input type="text" name="title">
    <input type="file" name="file" accept=".pdf,.doc,.docx">
    <button type="submit">Upload</button>
</form>
```

**Views:**
```python
# views.py
from django.views import View
from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404
import os

class FileUploadView(View):
    def get(self, request):
        return render(request, 'upload.html')
    
    def post(self, request):
        if request.method == 'POST':
            file = request.FILES.get('file')
            title = request.POST.get('title')
            
            if file and title:
                # Save file
                file_path = os.path.join(
                    MEDIA_ROOT, 
                    'uploads', 
                    file.name
                )
                os.makedirs(os.path.dirname(file_path), exist_ok=True)
                file.save(file_path)
                
                # Store in database
                Document.objects.create(
                    title=title,
                    file=file_path,
                    file_size=file.size,
                )
                
                return HttpResponse('File uploaded successfully!')
        
        return render(request, 'upload.html')
```

### Model for File Upload
```python
# models.py
from django.db import models
from django.conf import settings

class Document(models.Model):
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='uploads/documents/')
    file_size = models.PositiveIntegerField(default=0)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='documents'
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
    
    @property
    def file_url(self):
        return self.file.url
```

### File Upload Settings
```python
# settings.py
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Media files settings
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Create upload directory
os.makedirs(os.path.join(MEDIA_ROOT, 'uploads', 'documents'), exist_ok=True)
```

### File Upload with Validation
```python
# views.py
from django.core.exceptions import ValidationError
from django import forms

class DocumentForm(forms.Form):
    title = forms.CharField(max_length=200)
    file = forms.FileField(
        widget=forms.FileInput(attrs={
            'accept': '.pdf,.doc,.docx',
            'multiple': False,
        })
    )
    
    def clean_file(self):
        file = self.cleaned_data.get('file')
        if file:
            if file.size > 10 * 1024 * 1024:  # 10MB limit
                raise ValidationError('File size exceeds 10MB limit')
            
            # Check file extension
            if not file.name.endswith(('.pdf', '.doc', '.docx')):
                raise ValidationError('Only PDF, DOC, and DOCX files allowed')
            
            # Check if file is unique
            if Document.objects.filter(file=file.name).exists():
                raise ValidationError('File already exists')
        
        return file

# Usage
def upload_document(request):
    if request.method == 'POST':
        form = DocumentForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('document_list')
    else:
        form = DocumentForm()
    
    return render(request, 'upload.html', {'form': form})
```

### File Upload with DRF
```python
# serializers.py
from rest_framework import serializers
from .models import Document

class DocumentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = ['id', 'title', 'file_url', 'file_size', 'uploaded_by', 'uploaded_at']
    
    def get_file_url(self, obj):
        return obj.file.url
```

### File Upload with DRF View
```python
# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Document
from .serializers import DocumentSerializer
import os

class DocumentUploadView(APIView):
    def post(self, request):
        title = request.data.get('title')
        file = request.FILES.get('file')
        
        if not title or not file:
            return Response(
                {'error': 'Title and file are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate file
        if file.size > 10 * 1024 * 1024:
            return Response(
                {'error': 'File size exceeds 10MB'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Save file
        file_path = os.path.join(
            settings.MEDIA_ROOT,
            'uploads',
            file.name
        )
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        file.save(file_path)
        
        # Create document
        document = Document.objects.create(
            title=title,
            file=file_path,
            file_size=file.size,
        )
        
        serializer = DocumentSerializer(document)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
```

### File Upload with Pre-Signed URLs (AWS S3)
```python
# settings.py
AWS_ACCESS_KEY_ID = 'your-access-key'
AWS_SECRET_ACCESS_KEY = 'your-secret-key'
AWS_STORAGE_BUCKET_NAME = 'your-bucket-name'
AWS_S3_REGION_NAME = 'us-east-1'

# Install
pip install django-storages
```

### File Upload Best Practices
1. **Validate file type and size**
2. **Use unique filenames** to prevent conflicts
3. **Store files outside web root** for security
4. **Use CDN** for serving files
5. **Implement file size limits**
6. **Use pre-signed URLs** for secure uploads
7. **Clean up old files** periodically
8. **Log file uploads** for auditing

---

## Summary: Strategy Comparison

| Aspect | Central Location | Per-App Structure |
|--------|------------------|-------------------|
| **Scalability** | Poor | Excellent |
| **Maintainability** | Good for small projects | Excellent |
| **Team Collaboration** | Difficult | Easy |
| **Template Isolation** | None | Complete |
| **Configuration** | Simple | Slightly complex |
| **Best For** | Prototypes, small apps | Production, large apps |

### Recommendation
- **Small projects (<5 apps)**: Use central location
- **Medium projects (5-10 apps)**: Use per-app structure
- **Large projects (>10 apps)**: Must use per-app structure

Both approaches work well with Django REST Framework and Jinja2 integration!