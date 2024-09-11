

# Reading Assignment 

### **JSON (JavaScript Object Notation) Format**

**JSON** is a lightweight data interchange format that is easy for humans to read and write, and easy for machines to parse and generate. It is text-based and language-independent, often used to transmit data between a server and a web application. JSON is commonly used in APIs, web development, and data exchange formats.

#### **Basic Structure of JSON**

JSON is based on two structures:
1. **Objects** (similar to Python dictionaries): A collection of key-value pairs.
2. **Arrays** (similar to Python lists): An ordered list of values.

##### **Example of a JSON object**:
```json
{
  "name": "John Doe",
  "age": 30,
  "is_employee": true,
  "address": {
    "street": "123 Main St",
    "city": "New York"
  },
  "skills": ["Python", "JavaScript", "SQL"]
}
```

#### **JSON Data Types**:
- **Strings**: `"name": "John Doe"`
- **Numbers**: `"age": 30`
- **Boolean**: `"is_employee": true`
- **Null**: `"middle_name": null`
- **Arrays**: `"skills": ["Python", "JavaScript", "SQL"]`
- **Objects**: `"address": {"street": "123 Main St", "city": "New York"}`

### **Common Usage of JSON**

1. **Web Development**: JSON is the standard for transmitting data between a client and server in RESTful APIs.
2. **Data Interchange**: JSON is commonly used to store and transmit structured data between applications or systems.
3. **Configuration Files**: JSON is used in configuration files because it is easy to edit manually.
4. **Cross-Language Data Exchange**: JSON is language-independent, so data serialized in JSON can be easily consumed by different programming languages.

---

### **The `json` Module in Python**

Python’s built-in `json` module provides an easy way to convert Python objects to JSON format (serialization) and parse JSON back into Python objects (deserialization).

#### **Common JSON Functions in Python**:
1. **`json.dumps()`**: Convert a Python object into a JSON string.
2. **`json.loads()`**: Parse a JSON string into a Python object.
3. **`json.dump()`**: Write a Python object as JSON into a file.
4. **`json.load()`**: Read JSON data from a file and convert it to a Python object.

---

### **Serializing Python Objects to JSON**

#### **Example: Python to JSON String (`dumps()`)**
Converting a Python dictionary into a JSON string.

```python
import json

# Python dictionary
person = {
    "name": "John Doe",
    "age": 30,
    "is_employee": True,
    "skills": ["Python", "JavaScript", "SQL"],
    "address": {
        "street": "123 Main St",
        "city": "New York"
    }
}

# Convert to JSON string
person_json = json.dumps(person)

print(person_json)
```

**Output (formatted as JSON)**:
```json
{"name": "John Doe", "age": 30, "is_employee": true, "skills": ["Python", "JavaScript", "SQL"], "address": {"street": "123 Main St", "city": "New York"}}
```

#### **Pretty Printing JSON with `indent`**
You can use the `indent` argument to format the JSON string for readability.

```python
person_json = json.dumps(person, indent=4)
print(person_json)
```

**Output (formatted and indented)**:
```json
{
    "name": "John Doe",
    "age": 30,
    "is_employee": true,
    "skills": [
        "Python",
        "JavaScript",
        "SQL"
    ],
    "address": {
        "street": "123 Main St",
        "city": "New York"
    }
}
```

---

### **Deserializing JSON Strings to Python Objects**

#### **Example: JSON String to Python Object (`loads()`)**
Convert a JSON string into a Python dictionary.

```python
import json

# JSON string
person_json = '''
{
    "name": "John Doe",
    "age": 30,
    "is_employee": true,
    "skills": ["Python", "JavaScript", "SQL"],
    "address": {"street": "123 Main St", "city": "New York"}
}
'''

# Convert JSON string to Python dictionary
person_dict = json.loads(person_json)

print(person_dict)
```

**Output**:
```python
{
    'name': 'John Doe',
    'age': 30,
    'is_employee': True,
    'skills': ['Python', 'JavaScript', 'SQL'],
    'address': {'street': '123 Main St', 'city': 'New York'}
}
```

---

### **Writing and Reading JSON from Files**

#### **Write JSON to a File (`dump()`)**

```python
import json

# Python object
person = {
    "name": "John Doe",
    "age": 30,
    "is_employee": True,
    "skills": ["Python", "JavaScript", "SQL"]
}

# Writing JSON to a file
with open("person.json", "w") as file:
    json.dump(person, file, indent=4)
```

This code will create a `person.json` file with the JSON representation of the `person` object.

#### **Read JSON from a File (`load()`)**

```python
import json

# Reading JSON from a file
with open("person.json", "r") as file:
    person_data = json.load(file)

print(person_data)
```

**Output**:
```python
{
    'name': 'John Doe',
    'age': 30,
    'is_employee': True,
    'skills': ['Python', 'JavaScript', 'SQL']
}
```

---

### **Handling Complex Python Objects**

Python's `json` module can serialize simple data types like strings, integers, lists, and dictionaries, but it cannot serialize complex objects like custom classes or objects such as dates directly.

To handle more complex objects, you can define custom serialization behavior by extending the `json.JSONEncoder` class or providing a custom function to `dumps()`.

#### **Example: Handling Complex Python Objects**

```python
import json
from datetime import datetime

# Custom Python object
class Person:
    def __init__(self, name, birthdate):
        self.name = name
        self.birthdate = birthdate

# Custom function to convert Person and datetime objects into JSON
def custom_serializer(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    if isinstance(obj, Person):
        return {"name": obj.name, "birthdate": obj.birthdate.isoformat()}
    raise TypeError("Type not serializable")

# Create an instance of Person
person = Person("John Doe", datetime(1990, 1, 1))

# Serialize with custom function
person_json = json.dumps(person, default=custom_serializer, indent=4)
print(person_json)
```

**Output**:
```json
{
    "name": "John Doe",
    "birthdate": "1990-01-01T00:00:00"
}
```

---

### **Comparing JSON and Pickle**

- **JSON**:
  - Text-based, human-readable.
  - Language-independent, widely used for APIs and web data exchange.
  - Only supports basic data types (strings, numbers, lists, dictionaries, etc.).
  
- **Pickle**:
  - Binary format, not human-readable.
  - Python-specific and can handle complex objects like custom classes, functions, and more.
  - Suitable for storing Python objects but not for cross-language data interchange.

---

### **Summary of `json` Module in Python**:
- **Serialization (Python to JSON)**:
  - `json.dumps()`: Converts Python objects to JSON strings.
  - `json.dump()`: Writes Python objects as JSON to a file.
  
- **Deserialization (JSON to Python)**:
  - `json.loads()`: Converts JSON strings to Python objects.
  - `json.load()`: Reads JSON data from a file and converts it to Python objects.
  
- **Usage**: The `json` module is commonly used for web development (APIs), configuration files, and data interchange between different systems and programming languages.
