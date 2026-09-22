# Backend Development Lab Examination

## Objective

Design and develop a **Todo Application** using either Node.js or Python. The application must use server-side templates, store tasks in the existing MongoDB database, and categorize them using the **Eisenhower Matrix** based on **Urgency** and **Importance**.

**Duration:** 60 minutes
**Maximum Marks:** 30

## Technology Options

Choose any **one** stack:

| Option | Backend                      | Template Engine | MongoDB Library                    |
| ------ | ---------------------------- | --------------- | ---------------------------------- |
| A      | Node.js with Express.js      | EJS             | MongoDB Node.js Driver or Mongoose |
| B      | Python with Flask or FastAPI | Jinja2          | PyMongo or Motor                   |

## Problem Statement

Develop a web application named **Eisenhower Todo** that allows users to add, view, and delete tasks.

Each task should contain:

* Title
* Description
* Is Urgent (Boolean/Checkbox)
* Is Important (Boolean/Checkbox)
* Creation date

## Compulsory Requirements

### 1. Display Tasks (Eisenhower Matrix)

Create a home page that retrieves all tasks and displays them in a 4-quadrant **Eisenhower Matrix** grid based on the combination of `Is Urgent` and `Is Important` flags:

1.  **Do (Urgent & Important):** High urgency, high importance.
2.  **Schedule (Not Urgent & Important):** Low urgency, high importance.
3.  **Delegate (Urgent & Not Important):** High urgency, low importance.
4.  **Eliminate (Not Urgent & Not Important):** Low urgency, low importance.

Each task entry must show the title, description, and a delete button.

### 2. Add a Task

Create an HTML form containing:

* Title
* Description
* Checkbox: Is Urgent
* Checkbox: Is Important

When the form is submitted:

1. Validate that the title is not empty.
2. Insert the task into MongoDB.
3. Redirect the user to the task list page.

### 3. Delete a Task

Provide a Delete button for each task. When clicked, the selected task must be removed from MongoDB.

### 4. Server-Side Templates

The pages must be rendered using:

* EJS for Node.js, or
* Jinja2 for Python.

## Bonus Requirement

Implement **any one** of the following for up to 3 bonus marks:

* Edit an existing task.
* Filter tasks by category/tag.
* Improve the Eisenhower Matrix layout using CSS Grid or Flexbox.
* Add a due date to the task.

## Suggested Routes

| Method | Route               | Purpose                   |
| ------ | ------------------- | ------------------------- |
| `GET`  | `/` or `/tasks`     | Display all tasks in Matrix |
| `GET`  | `/tasks/new`        | Display the add-task form |
| `POST` | `/tasks`            | Add a new task            |
| `POST` | `/tasks/:id/delete` | Delete a task             |

Python students may use `/tasks/<id>/delete`.

## MongoDB Information

A MongoDB server is already installed and running. Students are **not required to install or configure MongoDB**.

Use the following connection information unless another URL is provided by the examiner:

```text
MongoDB URL: mongodb://127.0.0.1:27017
Database: todo_lab
Collection: tasks
```

Suggested document:

```json
{
  "title": "Backend Lab",
  "description": "Complete the Todo application.",
  "isUrgent": true,
  "isImportant": false,
  "createdAt": "Date"
}
```

---

# Node.js Hints

## Install Packages

```bash
npm init -y
npm install express ejs mongodb
```

## Connect to MongoDB

```javascript
const { MongoClient, ObjectId } = require("mongodb");

const mongoURL = "mongodb://127.0.0.1:27017";
const client = new MongoClient(mongoURL);

let tasksCollection;

async function connectDB() {
    await client.connect();

    const database = client.db("todo_lab");
    tasksCollection = database.collection("tasks");

    console.log("Connected to MongoDB");
}

connectDB();
```

Reuse the same `MongoClient` instead of creating a new connection for every request.

## Configure Express and EJS

```javascript
const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
```

## Retrieve Tasks

```javascript
const tasks = await tasksCollection.find().toArray();
```

## Insert a Task

```javascript
await tasksCollection.insertOne({
    title: req.body.title,
    description: req.body.description,
    isUrgent: !!req.body.isUrgent, // Checkbox returns 'on' if checked
    isImportant: !!req.body.isImportant,
    createdAt: new Date()
});
```

## Delete a Task

```javascript
await tasksCollection.deleteOne({
    _id: new ObjectId(req.params.id)
});
```

References:

* [MongoDB Node.js connection guide](https://www.mongodb.com/docs/drivers/node/current/connect/mongoclient/)
* [Express template engines](https://expressjs.com/en/guide/using-template-engines/)

---

# Python Flask Hints

## Install Packages

```bash
pip install flask pymongo
```

## Connect to MongoDB

```python
from flask import Flask, render_template, request, redirect
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime

app = Flask(__name__)

client = MongoClient("mongodb://127.0.0.1:27017")
database = client["todo_lab"]
tasks_collection = database["tasks"]
```

## Retrieve Tasks

```python
tasks = list(tasks_collection.find())
```

## Insert a Task

```python
tasks_collection.insert_one({
    "title": request.form["title"],
    "description": request.form["description"],
    "isUrgent": "isUrgent" in request.form,
    "isImportant": "isImportant" in request.form,
    "createdAt": datetime.now()
})
```

## Delete a Task

```python
tasks_collection.delete_one({
    "_id": ObjectId(task_id)
})
```

References:

* [PyMongo connection guide](https://www.mongodb.com/docs/languages/python/pymongo-driver/current/connect/mongoclient/)
* [Flask and Jinja templates](https://flask.palletsprojects.com/en/stable/tutorial/templates/)

## Suggested Time Distribution

| Task                                  |           Time |
| ------------------------------------- | -------------: |
| Create project and connect to MongoDB |     10 minutes |
| Configure server and templates        |     10 minutes |
| Implement Add Task                    |     15 minutes |
| Display tasks in Matrix               |     10 minutes |
| Implement Delete Task                 |     10 minutes |
| Testing and correction                |      5 minutes |
| **Total**                             | **60 minutes** |

## Evaluation Scheme

| Component                            |  Marks |
| ------------------------------------ | -----: |
| Project setup and MongoDB connection |      5 |
| Add-task form and insertion          |      6 |
| Display tasks in Matrix              |      6 |
| Delete operation                     |      4 |
| EJS/Jinja2 template usage            |      4 |
| Validation and error handling        |      3 |
| Code organization and interface      |      2 |
| **Total**                             | **30** |

## Submission Requirements

Students must submit:

* Complete source code
* Templates and CSS files
* A screenshot showing the application
* A short `README.md` containing execution instructions

**Note:** Authentication, REST APIs, user accounts, and frontend frameworks are not required. The main focus is backend routing, form handling, server-side rendering, and MongoDB CRUD operations.
