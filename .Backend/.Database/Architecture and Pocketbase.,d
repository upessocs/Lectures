# PocketBase Data Modeling & API Tutorial

> The important shift when moving from FastAPI + PostgreSQL/MongoDB to PocketBase is:

> **Do not start by thinking about API routes. Start by modeling the data and relationships. PocketBase then gives you most of the CRUD API automatically.**

PocketBase collections are essentially application-level representations of SQLite tables: a collection contains fields, and each record corresponds roughly to a row. ([PocketBase][1])

## 1. The mental model you should use

Coming from PostgreSQL/MongoDB, think of PocketBase like this:

| Traditional DB concept | PocketBase              |
| ---------------------- | ----------------------- |
| Database               | PocketBase instance     |
| Table                  | Collection              |
| Row/document           | Record                  |
| Column/field           | Field                   |
| Foreign key            | Relation field          |
| User table             | Auth collection         |
| SQL query              | PocketBase filter       |
| JOIN                   | `expand` relation       |
| REST API route         | Automatically generated |
| Authentication API     | Automatically generated |

For example, PostgreSQL:

```text
students
---------
id
name
email
class_id  ────────> classes.id
```

PocketBase:

```text
students collection
-------------------
name       text
email      email
class      relation → classes
```

The major difference is that **you don't normally create `/students`, `/students/{id}`, `/students/{id}/classes`, etc. yourself**. PocketBase generates record APIs for the collection. ([PocketBase][2])

## 2. The most important question: "How many collections?"

There is no fixed number.

A good rule is:

> **Make a collection when an entity has its own identity, lifecycle, or needs to be referenced independently.**


---

# Todo application

For example, in a Todo application:

```text
User
  │
  └── Todo
```

You probably need only:

```text
users       Auth collection
todos       Base collection
```

Not:

```text
todo_titles
todo_statuses
todo_dates
todo_users
```

Those are attributes of a Todo, not independent entities.

### Todo

```text
users
-----
id
email
name

todos
-----
id
title
description
completed
due_date
user → users
```

Relationship:

```text
users
  │
  │ 1
  │
  ├──────────< todos
              *
```

One user can have many todos.

In PocketBase, `todos.user` is simply a **relation field** pointing to the `users` Auth collection. PocketBase supports single and multiple relation fields using record IDs. ([PocketBase][3])

## 3. Don't make collections for everything

This is one of the most common mistakes when learning relational databases.

Suppose you have:

```text
Todo
- title
- description
- priority
- completed
- dueDate
```

You should **not** initially create:

```text
todos
priorities
statuses
descriptions
dates
```

Instead:

```text
todos
-----
title
description
priority
completed
dueDate
```

Because:

```text
priority = "high"
```

is just an attribute.

But consider:

```text
Todo
Project
User
```

Now these are independent entities:

```text
users
projects
todos
```

because a project can exist independently and many todos can belong to it.

```text
users
  │
  └──< projects
          │
          └──< todos
```
---
## 4. Notes application

A slightly more interesting example is a Notes application.

Start with:

```text
users
notes
```

### users

Auth collection:

```text
id
email
password
name
```

### notes

```text
id
title
content
created
updated
owner → users
```

Relationship:

```text
User
 │
 └──────< Notes
```

You don't need a `note_users` collection because each note belongs to one owner.

### What if a note can have multiple tags?

Now you have another entity:

```text
users
notes
tags
```

And:

```text
notes
-----
title
content
owner → users
tags → tags [multiple relation]
```

Conceptually:

```text
                 ┌── tag
                 │
Note ────────────┼── tag
                 │
                 └── tag
```

PocketBase supports multiple relation fields, so you can store multiple related record IDs in a relation field. ([PocketBase][3])

You might therefore have:

```text
users
notes
tags
```

rather than immediately creating a `note_tags` collection.

## 5. When should you create a separate relationship collection?

This is where your PostgreSQL knowledge becomes useful.

Suppose you have:

```text
students
classes
```

A student can attend many classes.

A class contains many students.

That's:

```text
Student * ───── * Class
```

This is a **many-to-many relationship**.

You have two possible designs.

### Simple PocketBase approach

```text
students
classes
```

and in `students`:

```text
classes → relation → classes [multiple]
```

This works if all you care about is:

> Which classes does this student belong to?

### More sophisticated approach

Suppose you need:

```text
student
class
enrollment_date
semester
grade
attendance
status
```

Now the relationship itself has data.

You should create:

```text
students
classes
enrollments
```

with:

```text
enrollments
------------
student → students
class   → classes
semester
enrollment_date
grade
attendance
```

Conceptually:

```text
Student
   │
   │ 1
   ▼
Enrollment
   ▲
   │ 1
   │
 Class
```

This is a very important database-design principle:

> **If the relationship itself has attributes, make the relationship an entity/collection.**

## 6. Your Students + Classes + Teachers example

This is a very good project for learning PocketBase.

I would design the first version as:

```text
users
students
teachers
classes
enrollments
```

But we can simplify it further.

### users

Auth collection:

```text
id
email
password
name
role
```

where:

```text
role = student | teacher | admin
```

PocketBase Auth collections can have custom fields, and rules can use those fields for authorization. ([PocketBase][1])

### students

```text
user → users
roll_number
department
semester
```

### teachers

```text
user → users
employee_id
department
```

### classes

```text
name
code
teacher → teachers
semester
```

### enrollments

```text
student → students
class → classes
```

So:

```text
                 ┌──────────┐
                 │  users   │
                 └────┬─────┘
                      │
             ┌────────┴────────┐
             ▼                 ▼
        ┌─────────┐       ┌─────────┐
        │students │       │teachers │
        └────┬────┘       └────┬────┘
             │                 │
             │                 │
             ▼                 ▼
        ┌────────────┐    ┌─────────┐
        │enrollments │    │ classes │
        └─────┬──────┘    └────┬────┘
              └────────┬───────┘
                       │
                       ▼
                 Student-Class
```

This is already a realistic database.

## 7. How the API changes your FastAPI thinking

With FastAPI you might have written:

```text
GET /students
POST /students
GET /students/{id}
PUT /students/{id}
DELETE /students/{id}
```

and implemented each route.

With PocketBase, the collection itself gives you those operations.

For example, JavaScript:

```javascript
const pb = new PocketBase("http://127.0.0.1:8090");

const students = await pb.collection("students").getList(1, 20);
```

Create:

```javascript
const student = await pb.collection("students").create({
    roll_number: "CS001",
    department: "CSE"
});
```

Update:

```javascript
await pb.collection("students").update(student.id, {
    department: "ECE"
});
```

Delete:

```javascript
await pb.collection("students").delete(student.id);
```

These correspond directly to PocketBase's generated record APIs. ([PocketBase][2])

## 8. The really important part: relations + `expand`

This is probably the part you're currently missing.

Suppose:

```text
students
---------
name
class → classes
```

You can retrieve a student and expand the class:

```javascript
const student = await pb
    .collection("students")
    .getOne(studentId, {
        expand: "class"
    });
```

Then you get something conceptually like:

```json
{
  "id": "student123",
  "name": "Rahul",
  "class": "class456",

  "expand": {
    "class": {
      "id": "class456",
      "name": "B.Tech CSE"
    }
  }
}
```

So instead of manually doing:

```text
GET student
       ↓
GET class
       ↓
combine objects
```

you can use:

```text
student
   │
   └── expand → class
```

PocketBase supports nested expansion as well. ([PocketBase][3])

For example:

```text
enrollment
    ↓
student
    ↓
user
```

can be expanded with nested relation paths.

## 9. Filtering is also important

Suppose you want all students belonging to a particular class.

You can query:

```javascript
const students = await pb
    .collection("students")
    .getList(1, 50, {
        filter: 'class = "CLASS_ID"'
    });
```

You can also filter through relations.

PocketBase supports relation-aware filtering, sorting and expansion. ([PocketBase][3])

This is where you should start thinking:

```text
FastAPI mindset:

route → Python code → database query → response

PocketBase mindset:

collection → relation/filter/rule → generated API → response
```

## 10. What about your FastAPI?

You don't necessarily have to throw FastAPI away.

There are three architectures you can use.

### Architecture A: Frontend → PocketBase

```text
React/Vue/Svelte/etc.
          │
          ▼
      PocketBase
          │
          ▼
       SQLite
```

This is the simplest.

For a Todo/Notes/student CRUD application, this is often enough.

### Architecture B: Frontend → FastAPI → PocketBase

```text
Frontend
   │
   ▼
FastAPI
   │
   ▼
PocketBase
```

Use this when you have substantial custom backend business logic.

For example:

```text
POST /generate-report
POST /calculate-result
POST /process-payment
POST /import-students
```

FastAPI handles the business operation while PocketBase handles persistence/authentication.

### Architecture C: Frontend → PocketBase + FastAPI

```text
             ┌── PocketBase
Frontend ────┤
             └── FastAPI
```

This can be useful when most CRUD operations don't need a custom API but some computational operations do.

For the applications you're describing, I would start with **A**, then introduce FastAPI only when you actually need it.

## 11. How to decide collections: a practical algorithm

When designing an application, take the requirements and highlight the **nouns**.

For example:

> Students can enroll in classes. Teachers teach classes. Students can submit assignments.

Nouns:

```text
Student
Class
Teacher
Assignment
Submission
```

Now ask for each:

> Does this thing have its own data and identity?

If yes → probably a collection.

So:

```text
students
teachers
classes
assignments
submissions
```

Then identify relationships:

```text
Teacher → teaches → Class
Student → enrolls → Class
Class → has → Assignment
Student → makes → Submission
```

Then ask:

> Does the relationship have its own attributes?

For:

```text
Student → Class
```

if you need:

```text
semester
enrollment_date
grade
attendance
```

then:

```text
enrollments
```

becomes necessary.

This method is much more useful than asking:

> "How many collections should PocketBase have?"

## 12. A progression I recommend for you

Since you already know MongoDB, PostgreSQL, SQLite and FastAPI, I would learn PocketBase through these four applications:

### Application 1 — Todo

```text
users
todos
```

Learn:

* Auth collection
* relation
* CRUD
* filtering
* API rules

### Application 2 — Notes

```text
users
notes
tags
```

Learn:

* one-to-many
* many-to-many/simple multiple relation
* `expand`
* search
* ownership

### Application 3 — Planner

```text
users
projects
tasks
categories
```

Learn:

```text
user
 └── projects
       └── tasks
             └── category
```

Learn nested relations and filtering.

### Application 4 — Student Management

```text
users
students
teachers
classes
enrollments
assignments
submissions
```

Learn:

* multiple relationships
* many-to-many
* relationship collections
* authorization rules
* roles
* nested `expand`
* real-world data modeling

That fourth application will make PocketBase's data model click for you.

## 13. Videos/resources

I searched specifically for current PocketBase relation/API tutorials. YouTube's search indexing isn't returning reliable individual PocketBase video results right now, so I don't want to invent specific video titles or links.

Instead, these YouTube searches are useful because they target exactly the concepts you need:

[YouTube: PocketBase relations tutorial](https://www.youtube.com/results?search_query=PocketBase+relations+tutorial&utm_source=chatgpt.com)

[YouTube: PocketBase CRUD tutorial](https://www.youtube.com/results?search_query=PocketBase+CRUD+tutorial&utm_source=chatgpt.com)

[YouTube: PocketBase Todo app](https://www.youtube.com/results?search_query=PocketBase+Todo+app+tutorial&utm_source=chatgpt.com)

[YouTube: PocketBase authentication and relations](https://www.youtube.com/results?search_query=PocketBase+authentication+relations+tutorial&utm_source=chatgpt.com)

But I would **not** start by watching a generic "PocketBase full course." For your particular problem, concentrate on:

1. **Collections**
2. **Relation fields**
3. **Single vs multiple relations**
4. **Back-relations**
5. **`expand`**
6. **Filters**
7. **API rules**
8. **Auth collections**

The official PocketBase relation documentation is particularly relevant to what you're trying to understand. ([PocketBase][3])

[PocketBase — Working with relations](https://pocketbase.io/docs/working-with-relations/?utm_source=chatgpt.com)

[PocketBase — Collections](https://pocketbase.io/docs/collections/?utm_source=chatgpt.com)

[PocketBase — Record API](https://pocketbase.io/docs/api-records/?utm_source=chatgpt.com)

## 14. The key concept I want you to internalize

Think of your application as a **graph of entities**, not as a collection of API routes.

For example, for the student application:

```text
                 USER
                /    \
               /      \
          STUDENT    TEACHER
             |          |
             |          |
             v          v
        ENROLLMENT    CLASS
             \          /
              \        /
               \      /
                CLASS
```

Then ask:

```text
What are my entities?
        ↓
What data belongs to each entity?
        ↓
How are entities related?
        ↓
Does a relationship have its own data?
        ↓
What should users be allowed to read/write?
        ↓
PocketBase generates the CRUD API.
```

That is the fundamental difference between **designing an application around FastAPI routes** and **designing an application around PocketBase data + relations + API rules**.

If you learn that workflow using **Todo → Notes → Planner → Student/Class/Teacher**, you will be able to design most ordinary PocketBase applications without first reaching for FastAPI.

[1]: https://pocketbase.io/docs/collections/?utm_source=chatgpt.com "Introduction - Collections - Docs - PocketBase"
[2]: https://pocketbase.io/docs/api-records/?utm_source=chatgpt.com "Web APIs reference - API Records - Docs - PocketBase"
[3]: https://pocketbase.io/docs/working-with-relations/?utm_source=chatgpt.com "Introduction - Working with relations - Docs - PocketBase"





---







# Can we assume database table are created once from developer initially and the apps use same structure ?

> Yes. That is a good way to think about it, with one important distinction.

### Traditional application

The developer designs the database schema:

```text
users
todos
projects
tasks
```

Then the application assumes that structure exists.

For example:

```text
todos
-----
id
title
description
completed
user_id
```

The deployed application then repeatedly uses that same schema:

```text
              Developer
                  │
                  ▼
          Design DB schema
                  │
                  ▼
        ┌─────────────────┐
        │ Database schema │
        └────────┬────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
     App user 1        App user 2
     records           records
```

The **tables are not normally created every time the application runs**.

### PocketBase

The same basic idea applies:

```text
Developer
   │
   ▼
PocketBase Admin UI
   │
   ├── users
   ├── todos
   ├── projects
   └── tasks
          │
          ▼
       SQLite
```

You create/configure the collections and fields as the developer.

Then your application uses them:

```javascript
pb.collection("todos").create(...)
pb.collection("todos").getList(...)
pb.collection("todos").update(...)
```

You don't create the `todos` collection every time a user opens your application.

### But there is an important difference

**Schema/data structure** and **data** are different things.

Suppose your Todo application has:

```text
todos
----------------
id
title
completed
user
```

The developer creates this structure once.

Then 1,000 users might produce:

```text
todos
----------------
1   Buy milk       false   user1
2   Study          true    user1
3   Assignment     false   user2
4   Exercise       true    user3
...
```

The **structure is shared**, while the **records are different**.

### This is also how your Student application would work

You might define:

```text
students
teachers
classes
enrollments
```

once.

For example:

```text
students
--------------------------------
id | name | roll_no | department

classes
--------------------------------
id | name | code | teacher

enrollments
--------------------------------
id | student | class | semester
```

Then the application continuously adds and modifies records:

```text
Developer creates schema
          ↓
       PocketBase
          ↓
 ┌────────┼─────────┐
 ▼        ▼         ▼
Student  Teacher   Admin
records  records   records
```

## Where migrations come in

The word **"once"** needs a little qualification.

During development, your schema will change.

Initially:

```text
todos
-----
title
completed
```

Later you decide you need:

```text
todos
-----
title
completed
priority
due_date
```

You modify the collection.

For a production application, you should treat these schema changes as **migrations/versioned changes**, rather than manually making arbitrary changes on each production server.

PocketBase supports migrations for collection/schema changes. This becomes particularly important when deploying the same application to multiple environments.

So your overall mental model should be:

```text
                 DEVELOPMENT
                      │
             Design collections
                      │
             Define relationships
                      │
             Define API rules
                      │
                 Migration
                      │
                      ▼
                 PRODUCTION
                      │
              ┌───────┴───────┐
              │   PocketBase  │
              │               │
              │   SQLite      │
              └───────┬───────┘
                      │
              Application users
                      │
             create/read/update
                   records
```

And this is one of the reasons PocketBase can feel much simpler than building a FastAPI + PostgreSQL backend: **you spend much more time designing the data model and access rules, and much less time writing CRUD endpoints.**
