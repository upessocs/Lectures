# Backend Development Lab Examination

## Objective

Design and develop a basic **Notes Management Application** using either Node.js or Python. The application must use server-side templates and store notes in the existing MongoDB database.

**Duration:** 60 minutes
**Maximum Marks:** 30

## Technology Options

Choose any **one** stack:

| Option | Backend                      | Template Engine | MongoDB Library                    |
| ------ | ---------------------------- | --------------- | ---------------------------------- |
| A      | Node.js with Express.js      | EJS             | MongoDB Node.js Driver or Mongoose |
| B      | Python with Flask or FastAPI | Jinja2          | PyMongo or Motor                   |

## Problem Statement

Develop a web application named **My Notes** that allows users to add, view, and delete notes.

Each note should contain:

* Title
* Content
* Category
* Creation date

## Compulsory Requirements

### 1. Display Notes

Create a home page that retrieves and displays all notes stored in MongoDB.

Each note must show:

* Title
* Content
* Category
* Creation date
* Delete button

Display a suitable message if no notes are available.

### 2. Add a Note

Create an HTML form containing:

* Title
* Content
* Category

When the form is submitted:

1. Validate that the title and content are not empty.
2. Insert the note into MongoDB.
3. Redirect the user to the notes list page.

### 3. Delete a Note

Provide a Delete button for each note. When clicked, the selected note must be removed from MongoDB.

### 4. Server-Side Templates

The pages must be rendered using:

* EJS for Node.js, or
* Jinja2 for Python.

## Bonus Requirement

Implement **any one** of the following for up to 3 bonus marks:

* Edit an existing note.
* Search notes by title.
* Filter notes by category.
* Improve the interface using CSS or Bootstrap.

## Suggested Routes

| Method | Route               | Purpose                   |
| ------ | ------------------- | ------------------------- |
| `GET`  | `/` or `/notes`     | Display all notes         |
| `GET`  | `/notes/new`        | Display the add-note form |
| `POST` | `/notes`            | Add a new note            |
| `POST` | `/notes/:id/delete` | Delete a note             |

Python students may use `/notes/<id>/delete`.

## MongoDB Information

A MongoDB server is already installed and running. Students are **not required to install or configure MongoDB**.

Use the following connection information unless another URL is provided by the examiner:

```text
MongoDB URL: mongodb://127.0.0.1:27017
Database: notes_lab
Collection: notes
```

Suggested document:

```json
{
  "title": "Backend Lab",
  "content": "Complete the Notes application.",
  "category": "Study",
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

let notesCollection;

async function connectDB() {
    await client.connect();

    const database = client.db("notes_lab");
    notesCollection = database.collection("notes");

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

## Retrieve Notes

```javascript
const notes = await notesCollection.find().toArray();
```

## Insert a Note

```javascript
await notesCollection.insertOne({
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    createdAt: new Date()
});
```

## Delete a Note

```javascript
await notesCollection.deleteOne({
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
database = client["notes_lab"]
notes_collection = database["notes"]
```

## Retrieve Notes

```python
notes = list(notes_collection.find())
```

## Insert a Note

```python
notes_collection.insert_one({
    "title": request.form["title"],
    "content": request.form["content"],
    "category": request.form["category"],
    "createdAt": datetime.now()
})
```

## Delete a Note

```python
notes_collection.delete_one({
    "_id": ObjectId(note_id)
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
| Implement Add Note                    |     15 minutes |
| Display all notes                     |     10 minutes |
| Implement Delete Note                 |     10 minutes |
| Testing and correction                |      5 minutes |
| **Total**                             | **60 minutes** |

## Evaluation Scheme

| Component                            |  Marks |
| ------------------------------------ | -----: |
| Project setup and MongoDB connection |      5 |
| Add-note form and insertion          |      6 |
| Retrieve and display notes           |      6 |
| Delete operation                     |      4 |
| EJS/Jinja2 template usage            |      4 |
| Validation and error handling        |      3 |
| Code organization and interface      |      2 |
| **Total**                            | **30** |

## Submission Requirements

Students must submit:

* Complete source code
* Templates and CSS files
* A screenshot showing the application
* A short `README.md` containing execution instructions

**Note:** Authentication, REST APIs, user accounts, and frontend frameworks are not required. The main focus is backend routing, form handling, server-side rendering, and MongoDB CRUD operations.
