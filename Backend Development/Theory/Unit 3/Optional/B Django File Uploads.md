# Django File Uploads: Normal Forms and REST APIs

## Uploading, Validating, Renaming, and Serving Student Files

This tutorial continues the existing `students-project` created with `uv`.
It assumes that the project already contains the `students` app, routes, middleware logger, external API utilities, and the separate `forms` tutorial.

We will create a new app named `uploads` and learn file uploads incrementally:

1. upload a file through a normal Django HTML form;
2. validate file size, extension, MIME type, and image dimensions;
3. rename files safely before saving them;
4. serve uploaded files during development;
5. expose uploads through Django REST Framework;
6. understand why application servers should not serve files in production;
7. configure a production design using a reverse proxy or object storage;
8. serve JavaScript, CSS, and SCSS-related static assets correctly.

> Important distinction: `static/` contains application assets such as CSS and JavaScript. `media/` contains user-uploaded files. Do not mix them.

## Learning objectives

By the end, you will understand:

- how a browser sends a file using `multipart/form-data`;
- why Django reads uploaded files from `request.FILES`;
- how `FileField` and `ImageField` work;
- how to validate and rename uploads securely;
- how to return file URLs from a REST API;
- why Django, FastAPI, and Express are suitable for application logic but are not ideal static-file servers in production;
- how Nginx, Caddy, a CDN, or object storage fits into a real deployment.

## Part A – Theory

### 1. File upload request flow

```text
Browser
  |
  | multipart/form-data
  v
Django view or DRF endpoint
  |
  | request.FILES / serializer validation
  v
Validation and safe filename generation
  |
  v
Storage: local media directory or object storage
  |
  v
Database stores the file name and metadata
```

The database usually does not store the complete file binary. A `FileField` stores a path such as `student_documents/2026/abc123.pdf`, while the actual file is stored by Django's configured storage backend.

### 2. `static/` versus `media/`

| Directory | Purpose | Examples | Usually deployed by |
|---|---|---|---|
| `static/` | Developer-controlled application assets | CSS, JS, icons, compiled CSS | WhiteNoise, Nginx, CDN |
| `media/` | User-controlled uploaded files | Profile photos, PDFs, assignments | Nginx, object storage, signed URLs |

Never let a user upload a file directly into the source-code `static/` directory. User files and application assets have different security, ownership, caching, and deployment rules.

## Part B – Hands-on: normal Django upload

## 3. Create the `uploads` app

From the directory containing `manage.py`:

```bash
uv run python manage.py startapp uploads
```

Add it to `INSTALLED_APPS` in `students_project/settings.py`:

```python
INSTALLED_APPS = [
    # Django's built-in apps...
    "students",
    "forms",
    "uploads",
]
```

Create the upload directories during development:

```bash
mkdir -p media/student_documents
mkdir -p uploads/templates/uploads
```

## 4. Configure media files

Add this to `students_project/settings.py`:

```python
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
```

`MEDIA_ROOT` is the physical directory where uploaded files are stored. `MEDIA_URL` is the URL prefix used to access them during development.

Update `students_project/urls.py`:

```python
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path("admin/", admin.site.urls),
    path("students/", include("students.urls")),
    path("forms/", include("forms.urls")),
    path("uploads/", include("uploads.urls")),
]


# Development convenience only. Do not use this as the production file server.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

The condition is important: Django's `static()` helper is intended for development and is not a replacement for Nginx, Caddy, a CDN, or object storage.

## 5. Create a document model

Create `uploads/models.py`:

```python
from django.db import models


class StudentDocument(models.Model):
    student_name = models.CharField(max_length=100)
    document = models.FileField(upload_to="student_documents/%Y/%m/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student_name} - {self.document.name}"
```

`upload_to` creates a subdirectory based on the upload date. It helps avoid placing every file in one huge directory.

Run migrations:

```bash
uv run python manage.py makemigrations uploads
uv run python manage.py migrate
```

## 6. Build a basic upload form

Create `uploads/forms.py`:

```python
from django import forms

from .models import StudentDocument


class StudentDocumentForm(forms.ModelForm):
    class Meta:
        model = StudentDocument
        fields = ["student_name", "document"]

    def clean_document(self):
        uploaded_file = self.cleaned_data["document"]

        # File size is measured in bytes.
        maximum_size = 5 * 1024 * 1024  # 5 MB
        if uploaded_file.size > maximum_size:
            raise forms.ValidationError("The file must be smaller than 5 MB.")

        allowed_extensions = {"pdf", "txt", "docx"}
        extension = uploaded_file.name.rsplit(".", 1)[-1].lower()
        if extension not in allowed_extensions:
            raise forms.ValidationError(
                "Only PDF, TXT, and DOCX files are allowed."
            )

        return uploaded_file
```

### Why validate in the form?

Validation belongs at the server boundary. An HTML `accept` attribute can improve the user interface, but it can be bypassed by a custom request. Always validate again in Django.

## 7. Create a safe filename function

A user-controlled filename must not be trusted. It may contain spaces, unusual Unicode characters, path separators, misleading extensions, or a name that collides with another file.

Create `uploads/utils.py`:

```python
from pathlib import Path
from uuid import uuid4


def safe_upload_name(uploaded_file):
    """Return a generated name while preserving the original extension."""
    original_extension = Path(uploaded_file.name).suffix.lower()

    # The UUID makes collisions very unlikely and removes user-controlled names.
    return f"{uuid4().hex}{original_extension}"
```

This function does not make an unsafe file safe by itself. It only generates a storage name. Content validation is still required.

## 8. Create the normal Django view

Create `uploads/views.py`:

```python
import logging

from django.contrib import messages
from django.shortcuts import redirect, render

from .forms import StudentDocumentForm
from .utils import safe_upload_name


logger = logging.getLogger(__name__)


def upload_document(request):
    if request.method == "POST":
        # request.FILES contains uploaded files. request.POST alone is not enough.
        form = StudentDocumentForm(request.POST, request.FILES)

        if form.is_valid():
            document = form.save(commit=False)

            # Save using a generated name instead of the user's original name.
            uploaded_file = form.cleaned_data["document"]
            document.document.save(
                safe_upload_name(uploaded_file),
                uploaded_file,
                save=False,
            )
            document.save()

            logger.info(
                "Document uploaded: id=%s student=%s",
                document.id,
                document.student_name,
            )
            messages.success(request, "Document uploaded successfully.")
            return redirect("uploads:upload-success")
    else:
        form = StudentDocumentForm()

    return render(
        request,
        "uploads/upload_document.html",
        {"form": form},
    )


def upload_success(request):
    return render(request, "uploads/upload_success.html")
```

The important detail is:

```python
StudentDocumentForm(request.POST, request.FILES)
```

`request.POST` contains text fields. `request.FILES` contains uploaded file objects. Both are needed.

## 9. Add URLs and templates

Create `uploads/urls.py`:

```python
from django.urls import path

from . import views


app_name = "uploads"

urlpatterns = [
    path("document/", views.upload_document, name="upload"),
    path("document/success/", views.upload_success, name="upload-success"),
]
```

Create `uploads/templates/uploads/upload_document.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Upload Student Document</title>
</head>
<body>
    <h1>Upload Student Document</h1>

    <form method="post" enctype="multipart/form-data">
        {% csrf_token %}
        {{ form.non_field_errors }}
        {{ form.as_p }}
        <button type="submit">Upload</button>
    </form>
</body>
</html>
```

The `enctype` attribute is essential. Without it, the browser sends the text fields but not the file contents.

Create `uploads/templates/uploads/upload_success.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Upload Complete</title>
</head>
<body>
    <h1>Upload complete</h1>
    <a href="{% url 'uploads:upload' %}">Upload another document</a>
</body>
</html>
```

Open:

```text
http://127.0.0.1:8000/uploads/document/
```

## 10. Validate images with `ImageField`

For images, use Pillow and Django's `ImageField`:

```bash
uv add Pillow
```

Add an image model:

```python
from django.core.validators import FileExtensionValidator
from django.db import models


class StudentPhoto(models.Model):
    photo = models.ImageField(
        upload_to="student_photos/%Y/%m/",
        validators=[
            FileExtensionValidator(allowed_extensions=["jpg", "jpeg", "png"])
        ],
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
```

`ImageField` checks that Django/Pillow can interpret the image. Extension validation alone is insufficient because a file can be renamed to `.jpg` without actually being a JPEG.

For stricter rules, validate dimensions:

```python
from django import forms

from .models import StudentPhoto


class StudentPhotoForm(forms.ModelForm):
    class Meta:
        model = StudentPhoto
        fields = ["photo"]

    def clean_photo(self):
        photo = self.cleaned_data["photo"]

        if photo.size > 2 * 1024 * 1024:
            raise forms.ValidationError("The image must be smaller than 2 MB.")

        if photo.image.width > 4000 or photo.image.height > 4000:
            raise forms.ValidationError(
                "The image dimensions must not exceed 4000 by 4000 pixels."
            )

        return photo
```

## 11. File validation checklist

For every upload, decide which rules apply:

- maximum file size;
- allowed extension;
- detected MIME type;
- whether the content can actually be parsed;
- image dimensions, if applicable;
- whether the file should be virus-scanned;
- whether the filename should be generated;
- whether the file should be private or public;
- how long the file should be retained.

Do not depend only on the original extension or the browser's `accept` attribute. For high-risk uploads such as PDFs, office documents, or executable-like formats, use malware scanning and private storage.

## Part C – Django REST Framework upload API

## 12. Install Django REST Framework

```bash
uv add djangorestframework
```

Add it to `INSTALLED_APPS`:

```python
INSTALLED_APPS = [
    # ...
    "rest_framework",
    "uploads",
]
```

## 13. Create a serializer

Create `uploads/serializers.py`:

```python
from pathlib import Path

from rest_framework import serializers

from .models import StudentDocument
from .utils import safe_upload_name


class StudentDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentDocument
        fields = ["id", "student_name", "document", "uploaded_at"]
        read_only_fields = ["id", "uploaded_at"]

    def validate_document(self, uploaded_file):
        if uploaded_file.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("The file must be smaller than 5 MB.")

        allowed_extensions = {"pdf", "txt", "docx"}
        extension = Path(uploaded_file.name).suffix.lower().lstrip(".")
        if extension not in allowed_extensions:
            raise serializers.ValidationError(
                "Only PDF, TXT, and DOCX files are allowed."
            )

        return uploaded_file

    def create(self, validated_data):
        uploaded_file = validated_data.pop("document")
        document = StudentDocument(**validated_data)
        document.document.save(
            safe_upload_name(uploaded_file),
            uploaded_file,
            save=False,
        )
        document.save()
        return document
```

The serializer performs the same validation as the HTML form, but the API must not depend on the HTML form. Each input boundary needs its own validation.

## 14. Create a DRF API view

Create `uploads/api_views.py`:

```python
import logging

from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import StudentDocumentSerializer


logger = logging.getLogger(__name__)


class StudentDocumentUploadAPIView(APIView):
    # These parsers allow a multipart/form-data request with a file.
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = StudentDocumentSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        document = serializer.save()
        logger.info("API document uploaded: id=%s", document.id)

        return Response(
            StudentDocumentSerializer(document).data,
            status=status.HTTP_201_CREATED,
        )
```

Add API URLs to `uploads/urls.py`:

```python
from django.urls import path

from . import api_views, views


app_name = "uploads"

urlpatterns = [
    path("document/", views.upload_document, name="upload"),
    path("document/success/", views.upload_success, name="upload-success"),
    path(
        "api/documents/",
        api_views.StudentDocumentUploadAPIView.as_view(),
        name="document-api",
    ),
]
```

## 15. Test the REST upload with `curl`

Start the server:

```bash
uv run python manage.py runserver
```

Send a multipart request:

```bash
curl -X POST http://127.0.0.1:8000/uploads/api/documents/ \
  -F "student_name=Aarav Sharma" \
  -F "document=@./sample.pdf"
```

The `@` tells `curl` to read the file from your local machine.

An invalid upload should return a response similar to:

```json
{
  "document": [
    "The file must be smaller than 5 MB."
  ]
}
```

## 16. API response and serving the uploaded file

The serializer may return a relative or absolute URL depending on the request context and Django settings. A client can use the returned `document` URL to download the file.

For private documents, do not expose a permanent public URL. Authenticate the download endpoint and check ownership or permissions before returning the file. In larger systems, return a short-lived signed URL from object storage.

## Part D – Static assets and production architecture

## 17. Can Django serve CSS and JavaScript from `static/`?

Yes, Django can serve static assets during development, and it can prepare them for production with `collectstatic`.

A typical structure is:

```text
students/
└── static/
    └── students/
        ├── css/site.css
        └── js/site.js
```

In a template:

```django
{% load static %}
<link rel="stylesheet" href="{% static 'students/css/site.css' %}">
<script src="{% static 'students/js/site.js' %}"></script>
```

For development, ensure:

```python
STATIC_URL = "/static/"
```

For production, configure a collection directory:

```python
STATIC_ROOT = BASE_DIR / "staticfiles"
```

Then run:

```bash
uv run python manage.py collectstatic --noinput
```

`collectstatic` copies assets from app-level `static/` directories into one deployment directory. It does not compile SCSS.

## 18. What about SCSS?

Django does not natively compile SCSS. The normal workflow is:

```text
SCSS source -> Sass compiler or frontend build tool -> CSS -> collectstatic
```

Example with a frontend toolchain:

```bash
npm install --save-dev sass
npx sass frontend/scss/site.scss students/static/students/css/site.css
uv run python manage.py collectstatic --noinput
```

In a real project, compile SCSS during CI/CD or the Docker build, commit or generate the resulting CSS in a controlled build step, and serve only the compiled CSS to browsers.

## 19. Why not serve files directly from Django, FastAPI, or Express in production?

Django, FastAPI, and Express can serve files, but their main job is application logic: routing, authentication, validation, database work, and API responses.

Using the application server as the primary file server is usually discouraged because:

- application workers remain busy transferring large files;
- memory and connection limits can affect normal API requests;
- high-volume static traffic competes with database and business operations;
- mature web servers provide better caching, range requests, compression, TLS handling, and efficient connection management;
- CDNs and object storage are designed for distribution and durability;
- deployment and scaling become harder when files live inside ephemeral application containers.

This is an architectural recommendation, not a statement that the frameworks are incapable of serving files. Django's development server and FastAPI/Express static middleware are excellent for local development and small controlled tools.

## 20. Production pattern for static assets

A common deployment looks like this:

```text
Browser
  |
  +--> CDN or Nginx --> static files
  |
  +--> Nginx/Caddy --> Django/FastAPI/Express application
```

Example production flow:

1. Build the application.
2. Run `collectstatic`.
3. Copy `staticfiles/` to Nginx, a CDN, or object storage.
4. Configure `/static/` to be served by that file layer.
5. Send dynamic requests such as `/api/` to Gunicorn/Uvicorn, Django, FastAPI, or Express.

WhiteNoise can serve compressed static files directly from a Django deployment and is convenient for modest deployments. A reverse proxy, CDN, or object storage is usually a better choice for large traffic or a multi-service architecture.

## 21. Production pattern for uploaded media

For uploads, a stronger design is:

```text
Browser -> Django upload endpoint -> validation -> object storage
                                      |
                                      v
                                  database path

Browser <- signed download URL <- permission check
```

Use object storage such as an S3-compatible service, Azure Blob Storage, or Google Cloud Storage when you need durability, independent scaling, backups, and access control.

Keep the following outside source code:

- storage credentials;
- bucket names when environment-specific;
- public/private configuration;
- maximum upload sizes;
- external API URLs.

Load them through environment variables or a secrets manager. Never commit access keys to Git.

## 22. Production checklist

- Set `DEBUG = False`.
- Configure `ALLOWED_HOSTS`.
- Use HTTPS.
- Set upload size limits at the reverse proxy and application layers.
- Validate extension, detected content, size, and dimensions.
- Generate storage names instead of trusting user filenames.
- Store private files outside a public web root.
- Use authentication and authorization for private downloads.
- Consider virus scanning for documents.
- Use object storage for durable media.
- Run `collectstatic` during deployment.
- Serve static files through Nginx, Caddy, WhiteNoise, a CDN, or object storage.
- Serve dynamic requests through a production process manager such as Gunicorn/Uvicorn or an appropriate Node process manager.
- Configure logging without recording sensitive file contents.
- Test failed uploads, interrupted uploads, duplicate names, oversized files, and unauthorized downloads.

## Part E – Testing

## 23. Test the normal form

Create or extend `uploads/tests.py`:

```python
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import reverse


class UploadViewTests(TestCase):
    def test_valid_document_upload(self):
        uploaded_file = SimpleUploadedFile(
            "notes.pdf",
            b"fake pdf content",
            content_type="application/pdf",
        )

        response = self.client.post(
            reverse("uploads:upload"),
            {
                "student_name": "Aarav Sharma",
                "document": uploaded_file,
            },
        )

        self.assertEqual(response.status_code, 302)

    def test_rejects_large_document(self):
        uploaded_file = SimpleUploadedFile(
            "large.pdf",
            b"x" * (5 * 1024 * 1024 + 1),
            content_type="application/pdf",
        )

        response = self.client.post(
            reverse("uploads:upload"),
            {
                "student_name": "Aarav Sharma",
                "document": uploaded_file,
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "smaller than 5 MB")
```

The fake PDF content is enough to test size and form flow, but it is not a real PDF. For production-grade content validation, use a real fixture and a parser or scanner appropriate to the file type.

Run tests:

```bash
uv run python manage.py test uploads
```

## 24. Common mistakes

### The file is missing from `request.FILES`

Check all three items:

```html
<form method="post" enctype="multipart/form-data">
```

```python
form = StudentDocumentForm(request.POST, request.FILES)
```

```python
document = form.cleaned_data["document"]
```

### The uploaded file URL returns 404

During development, check `MEDIA_URL`, `MEDIA_ROOT`, and the `static()` URL pattern. In production, check the reverse-proxy or object-storage configuration instead of adding Django's development helper.

### CSS or JavaScript returns 404

Check `{% load static %}`, `STATIC_URL`, the app's `static/<app-name>/` directory, and whether `collectstatic` ran in deployment.

### Files disappear after container restart

The container filesystem may be ephemeral. Use a persistent volume for local deployments or object storage for production.

### Renaming the file did not validate its content

Changing `.exe` to `.pdf` does not make a file a PDF. Validate the actual content using an appropriate parser, image decoder, or malware scanner.

## 25. Project-based learning task

Build a student document portal with these requirements:

- students can upload a PDF assignment;
- each upload is limited to 10 MB;
- only PDF files are accepted;
- the stored filename is generated with a UUID;
- the original filename is stored separately for display;
- an authenticated student can list and download only their own files;
- the same feature is available through a DRF endpoint;
- tests cover valid uploads, invalid extensions, oversized files, and unauthorized downloads;
- static CSS is collected during deployment;
- uploaded media is stored on a persistent volume or object storage.

## 26. Assessment criteria

| Area | Expected result |
|---|---|
| Normal upload | HTML form successfully uploads a file |
| Validation | Size and type rules are enforced server-side |
| Naming | User filename is not used as the storage path |
| REST API | Multipart API returns `201 Created` for valid data |
| Security | CSRF, authorization, and private-file concerns are addressed |
| Static files | CSS/JS use `static/` and `collectstatic` correctly |
| Production | File serving is delegated to a suitable file layer |
| Testing | Valid and invalid upload cases are automated |

## Summary

The incremental design is:

```text
HTML upload
  -> request.FILES
  -> Django form validation
  -> generated filename
  -> FileField storage

REST upload
  -> multipart request
  -> DRF parser
  -> serializer validation
  -> generated filename
  -> storage and JSON response

Production
  -> application validates and authorizes
  -> Nginx/CDN/object storage serves bytes
```

Django can serve static files during development, and it can prepare them for production. For production systems, let the application handle business logic while a dedicated file-serving layer handles high-volume static and media traffic.
