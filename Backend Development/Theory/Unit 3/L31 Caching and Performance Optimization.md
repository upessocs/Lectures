# Lecture 31

# Caching and Performance Optimization

**Course Outcome:** CO4 – Apply security best practices and conduct testing.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 31 |
| Unit | Unit 3: Frameworks and Performance Optimization |
| Topic | Caching and Performance Optimization |
| Course Outcome | CO4 – Apply security best practices and conduct testing |
| Bloom's Knowledge Level | Apply |
| Skills Developed | Caching (Redis), Database query optimization, Code tuning |
| Applications | System scalability, API latency reduction |
| PBL Activity | Implementing caching and optimizing queries for the Student API |
| Assessment Method | Coding exercise |

---

## Part A – Theory

### 1. Introduction
High-traffic applications must be optimized to ensure low latency and high availability. Caching and query optimization are the two most effective strategies to achieve this.

### 2. Caching
Caching stores the results of expensive operations (e.g., complex database queries, external API calls, template rendering) in memory (like Redis or Memcached), allowing subsequent requests to be served almost instantly.

### 3. Query Optimization
Django’s ORM can sometimes generate inefficient SQL queries (the "N+1 problem"). Optimization involves:
- Using `select_related()` to join related tables in a single query.
- Using `prefetch_related()` to fetch related objects in a separate query and join them in Python.
- Using `only()` or `defer()` to fetch only necessary database columns.

---

## Part B – Hands-On

### Task: Implement Cache on a View
1. Install a cache backend (e.g., `django-redis`):
   ```bash
   pip install django-redis
   ```
2. Configure `settings.py` to use Redis for caching.
3. In `students/views.py`, use the `cache_page` decorator:
   ```python
   from django.views.decorators.cache import cache_page

   # Cache this view for 15 minutes (900 seconds)
   @cache_page(900)
   def slow_api_view(request):
       # ... complex database query ...
       return JsonResponse({"data": "..."})
   ```

---

## PBL Activity
*Hint: Use the `django-debug-toolbar` mentioned in the previous lecture to identify exactly how many database queries your view is making. Aim to reduce that number.*

### Problem Scenario
Your API takes over 5 seconds to load the list of students because it's performing an N+1 query (querying the database inside a loop).

### Student Task
1. Use `select_related` or `prefetch_related` to optimize the database query.
2. Implement caching on the list view so it only hits the database once every 5 minutes.

---

## Assessment Activity
*Hint: Document the "before" and "after" performance metrics. How much faster is the API with caching and query optimization?*

### Evaluation Criteria
| Criterion | Expected Evidence |
|---|---|
| Optimization | Reduction in the number of database queries |
| Performance | Reduced API response time |

---

## Summary

### Key Takeaways
- **Caching** is about avoiding expensive work; **Query Optimization** is about doing work efficiently.
- The **N+1 problem** is the most common cause of database performance issues in Django. Always look for loops that query the database!

### Next Lecture
L32 – Quiz-II (Unit-III).
