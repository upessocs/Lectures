# Lecture 31: Caching and Performance Optimization in Django

**Course Outcome:** CO4 – Apply security best practices and conduct testing.

## 1. Session Implementation Plan

| Parameter              | Details                                                             |
| ---------------------- | ------------------------------------------------------------------- |
| Lecture No.            | 31                                                                  |
| Unit                   | Unit 3: Frameworks and Performance Optimization                     |
| Topic                  | Caching and Performance Optimization                                |
| Course Outcome         | CO4 – Apply security best practices and conduct testing             |
| Bloom's Taxonomy Level | Apply (L3)                                                          |
| Skills Developed       | Caching, database query optimization, performance measurement       |
| Applications           | Scalable web applications, faster APIs, reduced database load       |
| PBL Activity           | Optimize database queries and implement caching for the Student API |
| Assessment Method      | Coding exercise and performance comparison                          |

## Part A – Theory

### 2. Introduction to Performance Optimization

Performance optimization improves an application's response time, resource utilization, and ability to handle concurrent users.

Consider a Student API that retrieves student records from a database. If every request executes expensive queries, the application may become slow as the number of users increases.

Two important optimization techniques are:

1. **Query optimization:** Reduce the time and number of database operations required to process a request.
2. **Caching:** Store frequently used results temporarily so that repeated requests can avoid expensive operations.

Other techniques include pagination, efficient algorithms, appropriate database indexes, and reducing unnecessary network requests.

### 3. Understanding Caching

Caching stores previously computed results so that they can be reused instead of recalculated or retrieved from the original source.

For example, a college dashboard may display the same student statistics to hundreds of users. Instead of calculating these statistics for every request, Django can cache the result for a specified period.

#### 3.1 How caching works

<svg
  viewBox="0 0 340 280"
  width="100%"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <marker
      id="arrow"
      viewBox="0 0 10 10"
      refX="8"
      refY="5"
      markerWidth="6"
      markerHeight="6"
      orient="auto-start-reverse"
    >
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
    </marker>
  </defs>

  <rect x="105" y="8" width="130" height="34" rx="6"
        fill="#ffffff" stroke="#64748b" />

  <text x="170" y="29" text-anchor="middle"
        font-size="12" fill="#111827">
    Client Request
  </text>

  <path d="M170 42 V60"
        stroke="#64748b" stroke-width="1.5"
        fill="none" marker-end="url(#arrow)" />

  <rect x="95" y="61" width="150" height="36" rx="6"
        fill="#ffffff" stroke="#64748b" />

  <text x="170" y="83" text-anchor="middle"
        font-size="12" fill="#111827">
    Django Cache
  </text>

  <!-- Cache miss -->
  <path d="M95 79 H55 V118"
        stroke="#64748b" stroke-width="1.5"
        fill="none" marker-end="url(#arrow)" />

  <text x="48" y="108" text-anchor="middle"
        font-size="10" fill="#374151">
    Miss
  </text>

  <!-- Cache hit -->
  <path d="M245 79 H285 V118"
        stroke="#64748b" stroke-width="1.5"
        fill="none" marker-end="url(#arrow)" />

  <text x="292" y="108" text-anchor="middle"
        font-size="10" fill="#374151">
    Hit
  </text>

  <rect x="8" y="118" width="95" height="38" rx="6"
        fill="#ffffff" stroke="#64748b" />

  <text x="55" y="134" text-anchor="middle"
        font-size="11" fill="#111827">
    Database
  </text>

  <text x="55" y="147" text-anchor="middle"
        font-size="10" fill="#374151">
    Fetch data
  </text>

  <rect x="237" y="118" width="96" height="38" rx="6"
        fill="#ffffff" stroke="#64748b" />

  <text x="285" y="134" text-anchor="middle"
        font-size="11" fill="#111827">
    Cached Result
  </text>

  <text x="285" y="147" text-anchor="middle"
        font-size="10" fill="#374151">
    Reuse data
  </text>

  <!-- Both paths lead to the response -->
  <path d="M55 156 V178 H170 V195"
        stroke="#64748b" stroke-width="1.5"
        fill="none" marker-end="url(#arrow)" />

  <path d="M285 156 V178 H170 V195"
        stroke="#64748b" stroke-width="1.5"
        fill="none" marker-end="url(#arrow)" />

  <rect x="105" y="195" width="130" height="34" rx="6"
        fill="#ffffff" stroke="#64748b" />

  <text x="170" y="216" text-anchor="middle"
        font-size="12" fill="#111827">
    HTTP Response
  </text>

  <text x="170" y="253" text-anchor="middle"
        font-size="11" fill="#374151">
    Cache hit: avoid repeated database work
  </text>
</svg>

The diagram illustrates the general caching process. The exact flow depends on the caching mechanism being used.

- **Cache hit:** The requested result is already cached and can be reused.
- **Cache miss:** The result must be obtained or calculated, and may then be stored in the cache.
- **Cache timeout:** The cached entry expires after a configured duration.

#### 3.2 Types of caching in Django

| Cache Type                  | Description                                     |
| --------------------------- | ----------------------------------------------- |
| Per-site cache              | Caches responses across an entire site          |
| Per-view cache              | Caches the response of a specific view          |
| Template fragment cache     | Caches a portion of a rendered template         |
| Low-level cache API         | Allows developers to cache individual values    |
| Database query optimization | Reduces database work; it is not itself caching |

#### 3.3 Common caching backends

| Backend            | Characteristics                                              |
| ------------------ | ------------------------------------------------------------ |
| Local-memory cache | Simple development and single-process deployments            |
| File-based cache   | Stores cached values in files                                |
| Database cache     | Stores cache entries in a database                           |
| Redis              | In-memory data store suitable for shared application caching |
| Memcached          | Distributed in-memory caching system                         |

For multi-worker or multi-server applications, Redis or Memcached can provide a shared cache. Local-memory caches are generally not shared between separate application processes.

### 4. Configuring Django Caching

Django provides a cache framework that can use different backends.

For a beginner's exercise, start with local-memory caching. Redis can be introduced after students understand the caching API.

#### 4.1 Configure local-memory caching

In `settings.py`:

```
CACHES = {
    "default": {
        # Use Django's built-in local-memory cache.
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",

        # Give this cache a descriptive name.
        "LOCATION": "student-api-cache",
    }
}
```

This configuration does not require a separate cache server. It is suitable for learning and basic development, but separate processes do not share the same cache.

#### 4.2 Configure Redis caching (optional extension)

Install the Redis Python integration package in the project's active environment:

```
python -m pip install django-redis
```

Ensure a Redis server is running and configure `settings.py`:

```
CACHES = {
    "default": {
        # Use Redis through the django-redis backend.
        "BACKEND": "django_redis.cache.RedisCache",

        # Redis server address.
        "LOCATION": "redis://127.0.0.1:6379/1",

        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        },
    }
}
```

The Redis server must be accessible at the configured address. If Redis runs in Docker or on another host, use the appropriate service hostname or address instead of `127.0.0.1`.

### 5. Implementing Per-View Caching

Django's `cache_page` decorator caches a view's HTTP response for a specified number of seconds.

Example: cache a Student API response for five minutes.

In `students/views.py`:

```
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.cache import cache_page


@login_required
@cache_page(300)
def student_list_view(request):
    # This example returns static data to demonstrate view caching.
    students = [
        {"id": 1, "name": "Amit"},
        {"id": 2, "name": "Neha"},
    ]

    return JsonResponse({"students": students})
```

**Explanation:**

- `cache_page(300)` sets a cache duration of 300 seconds (five minutes).
- `login_required` restricts access to authenticated users.
- The response is cached according to Django's cache rules, including the request URL and relevant cache settings.

**Important security note:** Do not assume that adding `login_required` automatically makes shared response caching safe. Per-view caching can serve cached responses without executing the view again. For sensitive or user-specific data, review cache-key behavior and response privacy carefully. Avoid shared caching of personalized responses unless the cache is explicitly designed to isolate users and permissions.

For a public endpoint, `cache_page` is often straightforward. For sensitive student records, use the low-level cache API with carefully designed keys, or avoid caching personalized responses.

### 6. Low-Level Caching API

The low-level API gives the developer direct control over which data is cached.

```
from django.core.cache import cache
from django.http import JsonResponse
from .models import Student


def student_summary_view(request):
    # Try to retrieve the summary from the cache.
    summary = cache.get("student-summary")

    if summary is None:
        # Cache miss: calculate the summary from the database.
        summary = {
            "total_students": Student.objects.count(),
        }

        # Store the result for five minutes.
        cache.set("student-summary", summary, timeout=300)

    return JsonResponse(summary)
```

Replace `Student` with the actual model in your project.

In this example:

- `cache.get()` retrieves an existing value.
- `cache.set()` stores a value for the specified duration.
- `None` indicates a cache miss, provided that `None` is not also being used as a valid cached result.

**Limitation:** If student records change, the cached count can become stale for up to five minutes. Production applications should consider cache invalidation or update the relevant cache entry when data changes.

## Part B – Database Query Optimization

### 7. Understanding the N+1 Query Problem

The N+1 problem occurs when an application executes one query to retrieve a collection of records and then performs an additional query for each record.

Suppose a college has 100 students, and each student belongs to a department.

An inefficient approach might execute:

- One query to retrieve all students.
- One additional query for each student's department.

This results in approximately 101 queries instead of retrieving the necessary information using a much smaller number of queries.

### 8. Using `select_related()`

Use `select_related()` for single-valued relationships such as `ForeignKey` and `OneToOneField`.

Assume the `Student` model contains a foreign key named `department`.

**Before optimization:**

```
from .models import Student


def student_list_view(request):
    students = Student.objects.all()

    # Accessing department inside the loop can cause extra queries.
    data = []

    for student in students:
        data.append({
            "name": student.name,
            "department": student.department.name,
        })

    return JsonResponse({"students": data})
```

**After optimization:**

```
from django.http import JsonResponse
from .models import Student


def optimized_student_list_view(request):
    # Retrieve students and their departments efficiently.
    students = Student.objects.select_related("department")

    data = []

    for student in students:
        data.append({
            "name": student.name,
            "department": student.department.name,
        })

    return JsonResponse({"students": data})
```

The optimized version uses a SQL join to retrieve the related department data with the student records.

### 9. Using `prefetch_related()`

Use `prefetch_related()` for multi-valued relationships such as reverse foreign keys and many-to-many relationships.

For example, if a student can enroll in multiple courses:

```
from django.http import JsonResponse
from .models import Student


def student_courses_view(request):
    # Fetch students and their related courses efficiently.
    students = Student.objects.prefetch_related("courses")

    data = []

    for student in students:
        data.append({
            "name": student.name,
            "courses": [
                course.name for course in student.courses.all()
            ],
        })

    return JsonResponse({"students": data})
```

This example assumes the `Student` model exposes a many-to-many or reverse relationship named `courses`. Adjust the relationship name to match your models.

Django generally executes one query for the students and another for the related courses rather than querying separately for each student.

### 10. Other Query Optimization Techniques

| Method           | Purpose                                               |
| ---------------- | ----------------------------------------------------- |
| `only()`         | Loads selected fields initially                       |
| `defer()`        | Defers loading specified fields                       |
| `values()`       | Returns dictionaries containing selected field values |
| `count()`        | Counts records without loading the entire queryset    |
| `exists()`       | Checks whether matching records exist                 |
| Pagination       | Limits the number of records returned per request     |
| Database indexes | Can speed up suitable filtering and lookup operations |

Example:

```
# Retrieve only the fields required by this response.
students = Student.objects.values("id", "name")
```

Query optimization should be based on measured bottlenecks. An index, join, or reduced field selection does not guarantee a performance improvement for every query.

## Part C – Problem-Based Learning (PBL)

### 11. Problem Scenario

A Student API takes more than five seconds to return a list of students. The endpoint repeatedly retrieves related department information from the database and recalculates the same student statistics for every request.

Your task is to reduce response time and database load.

### Student Tasks

1. Measure the initial response time and database query count.
2. Identify the N+1 query problem in the student list view.
3. Apply `select_related()` or `prefetch_related()` according to the relationship type.
4. Cache a suitable summary or public response for five minutes.
5. Test the endpoint with repeated requests.
6. Compare the results before and after optimization.
7. Explain the impact of cache expiration and stale data.

**Expected outcome:** Students should demonstrate that caching avoids repeated work and query optimization reduces unnecessary database operations.

## Part D – Assessment and Testing

### 12. Performance Measurement

Record the following metrics before and after optimization.

| Metric                     | Before                   | After                              |
| -------------------------- | ------------------------ | ---------------------------------- |
| HTTP response time         | Measure                  | Measure                            |
| Number of database queries | Measure                  | Measure                            |
| Cache status               | Initial miss or uncached | Hit on a repeated eligible request |
| Response correctness       | Verify                   | Verify                             |
| Data freshness             | Verify                   | Verify                             |

Do not assume a fixed improvement percentage. Actual results depend on the database, dataset size, hardware, network latency, and cache backend.

### 13. Testing Checklist

- Verify that the API returns the expected student data.
- Compare database query counts before and after optimization.
- Confirm that repeated requests can reuse cached results.
- Verify that cached data expires after the configured timeout.
- Check whether updates to student records cause stale responses.
- Ensure that cached responses do not expose private student information.
- Confirm that pagination works for large student datasets.

### 14. Evaluation Criteria

| Criterion                     | Marks  | Expected Evidence                                             |
| ----------------------------- | ------ | ------------------------------------------------------------- |
| Query optimization            | 3      | Appropriate use of `select_related()` or `prefetch_related()` |
| Caching implementation        | 3      | Correct cache configuration and timeout                       |
| Performance testing           | 2      | Before-and-after measurements                                 |
| Data correctness and security | 2      | Correct responses, freshness checks, and safe caching         |
| **Total**                     | **10** | <br>                                                          |

## 15. Summary

### Key Takeaways

- **Caching** avoids repeated expensive operations by reusing previously computed results.
- **Query optimization** reduces unnecessary database operations.
- The **N+1 query problem** often occurs when related objects are accessed repeatedly inside a loop.
- `select_related()` is suitable for single-valued relationships; `prefetch_related()` is suitable for multi-valued relationships.
- Cache expiration controls how long cached values remain available, but does not automatically guarantee fresh data.
- Performance optimization must be validated through measurements rather than assumptions.

### Next Lecture

**Lecture 32 – Quiz II (Unit III)**

Correct the caching code examplesAdd database query measurement code