# Object-Oriented Programming (OOP)

> Object-Oriented Programming (OOP) was popularized by Alan Kay, who coined the term. He later reflected that a more accurate term would have been **“cell-oriented programming”** to better align with the biological analogy that inspired the paradigm. Here’s why he thought so:

1. **Biological Cell Analogy**:  
-  **Cells as independent units**: Just like biological cells, each object in OOP is a self-contained unit that has its own properties (data) and methods (functions). Objects are designed to encapsulate everything they need to function and can interact with other objects through well-defined interfaces (messages).
-  **Communication via messages**: Objects communicate by sending and receiving messages, much like how cells interact in a biological system. This encapsulation ensures that internal mechanisms remain hidden from the outside, allowing objects to be modular and reusable.

2. **Independence and Encapsulation**:
-  In biology, each cell operates independently but works in harmony with other cells to perform complex tasks. Similarly, objects in OOP are self-sufficient and encapsulate their internal state. They interact with other objects without exposing their inner workings, maintaining a high level of modularity.
   
3. **The term “Object” vs. “Cell”**:
-  Kay believed that "object" didn’t quite capture the dynamic, self-sustaining nature of these entities as well as "cell" might have. A "cell" emphasizes the idea of independent, interactive entities that collaborate to build complex systems, just like OOP objects.
---
### Resources to Understand Alan Kay's Idea:

1. **Alan Kay's Talks and Interviews**:
-  **"The Early History of Smalltalk"**: In this paper, Kay explains the origin of OOP and how his biological inspiration led to the development of Smalltalk, one of the first object-oriented programming languages.
-  **Alan Kay on OOP**: You can find [videos and interviews](https://www.youtube.com/results?search_query=allan+kay+cell+oriented+interview) where Kay discusses his reflections on OOP and why he felt "cell" would have been a better metaphor. [This paper](https://www.researchgate.net/publication/221501755_The_Early_History_of_Smalltalk) provides some insights.

2. **Books on OOP and Smalltalk**:
-  **"Smalltalk-80: The Language and Its Implementation"**: This book by Adele Goldberg and David Robson details Smalltalk, the language created by Kay's team, and presents the foundational principles of OOP that stemmed from Kay’s biological analogy.
-  **"Object-Oriented Programming: An Evolutionary Approach" by Brad Cox**: This book discusses the evolution of OOP, touching on Kay's original inspirations and how these concepts evolved into mainstream programming.

3. **Articles and Papers**:
-  **"The Computer Revolution Hasn't Happened Yet"**: A talk by Alan Kay, where he discusses the potential of OOP and how he originally viewed objects as cells communicating with each other [Video URL](https://www.youtube.com/watch?v=aYT2se94eU0).





---

# Introduction to Classes in Python

A **class** is a blueprint for creating objects in Python. It allows you to bundle data (attributes) and functionality (methods) together, making your code more modular, reusable, and organized. Python follows the principles of **Object-Oriented Programming (OOP)**, which include concepts like inheritance, encapsulation, and polymorphism.


---

### 1. **Principles of Object Orientation**

The four main principles of object-oriented programming (OOP) are:

1. **Encapsulation**: Binding data and methods that operate on that data within a class.
2. **Abstraction**: Hiding unnecessary details and exposing only the essential parts of an object.
3. **Inheritance**: Creating new classes from existing ones, inheriting attributes and methods.
4. **Polymorphism**: Allowing objects to be treated as instances of their parent class, making the code more flexible.

---

### 2. **Creating Classes**

A class in Python is created using the `class` keyword, and the attributes and methods are defined within it.

```python
class Dog:
    # Class attribute (shared by all instances)
    species = "Canis familiaris"
    
    # Constructor (initializer)
    def __init__(self, name, age):
        # Instance attributes (unique to each instance)
        self.name = name
        self.age = age
    
    # Instance method
    def bark(self):
        return f"{self.name} says woof!"
    
    # Another instance method
    def get_age(self):
        return f"{self.name} is {self.age} years old."
```

#### Example Usage:

```python
# Creating instances (objects) of the Dog class
dog1 = Dog("Buddy", 3)
dog2 = Dog("Charlie", 5)

# Accessing attributes and methods
print(dog1.bark())         # Buddy says woof!
print(dog2.get_age())      # Charlie is 5 years old.
print(dog1.species)        # Canis familiaris
```

### Explanation:
- The `__init__` method is called a **constructor** and is used to initialize the object’s attributes.
- The `self` parameter represents the instance of the class and allows access to the instance attributes and methods.
- **Instance methods** (like `bark()` and `get_age()`) operate on individual objects.

---

### 3. **Instance Methods**

These are functions defined inside a class and can access the attributes and other methods of the object using `self`.

```python
def bark(self):
    return f"{self.name} says woof!"
```

You invoke an instance method using the syntax `object.method()`.

---

### 4. **File Organization**

In Python, you can organize classes into separate files (modules) for better code management. For example:

- `dog.py`: Contains the `Dog` class.
- `main.py`: Contains the logic that uses the `Dog` class.

You can import the `Dog` class in `main.py` using:

```python
from dog import Dog
```

---

### 5. **Special Methods (Dunder Methods)**

Special methods, often called **dunder methods** (because they have double underscores `__`), allow you to define how your objects behave in specific situations.

Some commonly used dunder methods:
- `__init__(self)`: Initializes a new object.
- `__str__(self)`: Defines the string representation of an object when you use `print()`.
- `__len__(self)`: Defines the behavior of `len()` when used on an object.

```python
class Dog:
    def __init__(self, name, age): #dunder init
        self.name = name
        self.age = age
    
    # Special method for string representation
    def __str__(self):
        return f"{self.name} is {self.age} years old."

# Example
dog = Dog("Buddy", 3)
print(dog)  # Output: Buddy is 3 years old.
```

---

### 6. **Class Variables**

Class variables are shared across all instances of a class. They are defined within the class but outside any instance methods.

```python
class Dog:
    # Class variable shared by all instances
    species = "Canis familiaris"
    
    def __init__(self, name, age):
        self.name = name
        self.age = age

dog1 = Dog("Buddy", 3)
dog2 = Dog("Charlie", 5)

print(dog1.species)  # Output: Canis familiaris
print(dog2.species)  # Output: Canis familiaris
```

---

### 7. **Inheritance**

Inheritance allows you to create a new class based on an existing class. The new class (child class) inherits attributes and methods from the existing class (parent class).

```python
class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        raise NotImplementedError("Subclass must implement abstract method")

class Dog(Animal):
    def speak(self):
        return f"{self.name} says woof!"

class Cat(Animal):
    def speak(self):
        return f"{self.name} says meow!"
```

#### Example Usage:

```python
dog = Dog("Buddy")
cat = Cat("Whiskers")

print(dog.speak())  # Output: Buddy says woof!
print(cat.speak())  # Output: Whiskers says meow!
```

### Explanation:
- The `Dog` and `Cat` classes inherit from the `Animal` class and override the `speak()` method.

---

### 8. **Polymorphism**

Polymorphism allows methods in different classes to have the same name but behave differently. It is often used with inheritance.

```python
def animal_speak(animal):
    print(animal.speak())

dog = Dog("Buddy")
cat = Cat("Whiskers")

animal_speak(dog)  # Output: Buddy says woof!
animal_speak(cat)  # Output: Whiskers says meow!
```

---

### 9. **Type Identification**

In Python, you can identify the type of an object using the `type()` or `isinstance()` function.

```python
print(type(dog))  # Output: <class '__main__.Dog'>
print(isinstance(dog, Dog))  # Output: True
print(isinstance(dog, Animal))  # Output: True
```

---

### 10. **Custom Exception Classes**

You can create custom exceptions by inheriting from the base `Exception` class.

```python
class CustomError(Exception):
    def __init__(self, message):
        self.message = message

# Raising the custom exception
def check_value(x):
    if x < 0:
        raise CustomError("Value cannot be negative!")

try:
    check_value(-1)
except CustomError as e:
    print(e.message)  # Output: Value cannot be negative!
```

---



## Why classes are useful in Python

### 1. **Modularity**: Code is organized into logical units (classes) that are easier to manage and understand.

#### Example:

Let’s say you are building a library management system with multiple functionalities. Instead of writing all the code in one place, you can create separate classes to represent different parts of the system (e.g., `Book`, `Library`, `Member`), making the code more modular.

```python
class Book:
    def __init__(self, title, author):
        self.title = title
        self.author = author

class Member:
    def __init__(self, name):
        self.name = name
        self.books_issued = []

class Library:
    def __init__(self):
        self.books = []
    
    def add_book(self, book):
        self.books.append(book)
        print(f'Book "{book.title}" added to library.')

    def issue_book(self, book, member):
        if book in self.books:
            member.books_issued.append(book)
            self.books.remove(book)
            print(f'Book "{book.title}" issued to {member.name}.')
        else:
            print(f'Book "{book.title}" is not available.')

# Example Usage
library = Library()
book1 = Book("Python Programming", "John Doe")
member1 = Member("Alice")

library.add_book(book1)
library.issue_book(book1, member1)
```

### Use Case:
- Each class (`Book`, `Library`, `Member`) represents a separate, manageable component.
- It’s easier to maintain, debug, and extend the functionality of the library system as each part is logically grouped.

---

### 2. **Reusability**: Classes can be reused in different programs, reducing redundancy.

#### Example:

Imagine you are building multiple applications that deal with users. Instead of writing a `User` class in each application, you can write it once and reuse it across applications.

```python
class User:
    def __init__(self, username, email):
        self.username = username
        self.email = email

    def get_details(self):
        return f"User: {self.username}, Email: {self.email}"

# Reusing the User class in different programs
user1 = User("johndoe", "john@example.com")
user2 = User("janedoe", "jane@example.com")

print(user1.get_details())  # Output: User: johndoe, Email: john@example.com
print(user2.get_details())  # Output: User: janedoe, Email: jane@example.com
```

### Use Case:
- The `User` class can be used in a social media app, an e-commerce app, or a blog system.
- This reduces code duplication and makes it easier to manage users across different applications.

---

### 3. **Inheritance**: You can build upon existing code and extend its functionality without rewriting it.

#### Example:

Let’s say you already have a `User` class, and now you want to create an `Admin` class that extends the functionality of the `User` class.

```python
class User:
    def __init__(self, username, email):
        self.username = username
        self.email = email

    def get_details(self):
        return f"User: {self.username}, Email: {self.email}"

class Admin(User):
    def __init__(self, username, email, permissions):
        super().__init__(username, email)  # Reuse the User's constructor
        self.permissions = permissions
    
    def get_admin_details(self):
        return f"Admin: {self.username}, Permissions: {', '.join(self.permissions)}"

# Example Usage
admin1 = Admin("admin1", "admin@example.com", ["read", "write", "delete"])

print(admin1.get_details())         # Output: User: admin1, Email: admin@example.com
print(admin1.get_admin_details())   # Output: Admin: admin1, Permissions: read, write, delete
```

### Use Case:
- The `Admin` class inherits from `User` and adds new functionality like `permissions`, without needing to rewrite the code for handling usernames and emails.
- You can extend the `User` class for other roles, like `Moderator` or `Guest`, by inheriting from the `User` class.

---

### 4. **Abstraction**: Complex functionalities can be hidden behind simpler interfaces.

#### Example:

In this example, let’s abstract the complexity of handling an account's balance and transactions within a `BankAccount` class.

```python
class BankAccount:
    def __init__(self, account_number, balance=0):
        self.account_number = account_number
        self._balance = balance  # _balance is "protected", indicating that it's internal

    def deposit(self, amount):
        if amount > 0:
            self._balance += amount
            return f"Deposited {amount}. Current balance: {self._balance}"
        else:
            return "Deposit amount must be positive."

    def withdraw(self, amount):
        if 0 < amount <= self._balance:
            self._balance -= amount
            return f"Withdrawn {amount}. Current balance: {self._balance}"
        else:
            return "Insufficient funds or invalid amount."

# Example Usage
account = BankAccount("12345678", 100)
print(account.deposit(50))   # Output: Deposited 50. Current balance: 150
print(account.withdraw(30))  # Output: Withdrawn 30. Current balance: 120
```

### Use Case:
- The inner workings of the account balance (like how it is stored and updated) are abstracted away.
- The user only interacts with simple methods like `deposit()` and `withdraw()`, while the class handles the details internally.

---

### 5. **Polymorphism**: You can write flexible and reusable code that can handle different types of objects.

#### Example:

Suppose we have a `Shape` class and subclasses like `Circle` and `Rectangle`. Polymorphism allows us to treat all these shapes the same way by defining a common method `area()` in all of them.

```python
class Shape:
    def area(self):
        raise NotImplementedError("Subclasses must implement this method")

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        return 3.14 * self.radius * self.radius

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height

# Function that accepts any shape
def print_area(shape):
    print(f"The area is: {shape.area()}")

# Example Usage
circle = Circle(5)
rectangle = Rectangle(4, 6)

print_area(circle)      # Output: The area is: 78.5
print_area(rectangle)   # Output: The area is: 24
```

### Use Case:
- We can treat all shapes (`Circle`, `Rectangle`, etc.) as `Shape` objects and call their `area()` method without worrying about the specific type.
- This allows the same function `print_area()` to work with different types of objects, making the code more flexible and reusable.

---

### Summary:

- **Modularity**: Breaking down functionality into logical units (classes) makes the code easier to manage and extend.
- **Reusability**: Classes can be reused across different projects, reducing code duplication and effort.
- **Inheritance**: Allows you to build upon existing classes, adding or modifying functionality without rewriting the base code.
- **Abstraction**: Hides internal complexity, exposing only what is necessary to the user.
- **Polymorphism**: Enables flexibility in your code by allowing different types of objects to be handled uniformly.

> Using classes provides a structured approach to writing maintainable and scalable Python applications.


---
## Advanced Topics

Sure! Let's break down these concepts in Python.

### Public and Private Properties and Methods

- **Public Properties/Methods**: These are accessible from outside the class. By default, all properties and methods in a class are public. You can access them using the dot notation.

```python
class MyClass:
  def __init__(self):
	  self.public_property = "I'm public!"
  
  def public_method(self):
	  return "This is a public method."

obj = MyClass()
print(obj.public_property)  # Accessible
print(obj.public_method())   # Accessible
```

- **Private Properties/Methods**: These are intended to be inaccessible from outside the class. In Python, you can denote a property or method as private by prefixing it with two underscores (`__`).

```python
class MyClass:
  def __init__(self):
	  self.__private_property = "I'm private!"
  
  def __private_method(self):
	  return "This is a private method."
  
  def access_private(self):
	  return self.__private_property

obj = MyClass()
# print(obj.__private_property)  # Raises an AttributeError
print(obj.access_private())      # Accessible via public method
```

### Static and Class Methods

- **Static Methods**: These are defined using the `@staticmethod` decorator. They do not take `self` or `cls` as the first parameter, meaning they don't access the instance or class properties/methods. They can be called on the class itself or on instances.

```python
class MyClass:
  @staticmethod
  def static_method():
	  return "This is a static method."

print(MyClass.static_method())  # Called on class
obj = MyClass()
print(obj.static_method())       # Called on instance
```

- **Class Methods**: These are defined using the `@classmethod` decorator. They take `cls` as the first parameter, allowing access to class properties/methods. They can be used to create factory methods or manipulate class state.

```python
class MyClass:
  class_property = "I'm a class property."

  @classmethod
  def class_method(cls):
	  return cls.class_property

print(MyClass.class_method())  # Accessing class property
```

### Special Methods

Special methods (or dunder methods) in Python allow you to define how your class behaves with built-in functions and operators.

- **`__init__`**: This method is called when an instance of the class is created. It's used to initialize the object's attributes.

```python
class MyClass:
  def __init__(self, value):
	  self.value = value

obj = MyClass(10)
print(obj.value)  # Outputs: 10
```

- **`__repr__`**: This method is meant to provide a formal string representation of the object, which is useful for debugging. It's called by the built-in `repr()` function and in the interpreter.

```python
class MyClass:
  def __init__(self, value):
	  self.value = value

  def __repr__(self):
	  return f"MyClass(value={self.value})"

obj = MyClass(10)
print(repr(obj))  # Outputs: MyClass(value=10)
```

- **`__str__`**: This method is used to provide a more user-friendly string representation of the object, which is what gets displayed when you use `print()`.

```python
class MyClass:
  def __init__(self, value):
	  self.value = value

  def __str__(self):
	  return f"Value: {self.value}"

obj = MyClass(10)
print(obj)  # Outputs: Value: 10
```

### Summary

- **Public vs. Private**: Public members are accessible anywhere; private members are restricted to the class itself.
- **Static vs. Class Methods**: Static methods don’t have access to instance or class state, while class methods have access to class state.
- **Special Methods**: These allow you to define how instances of your class behave with built-in functions and operators, like construction (`__init__`), representation (`__repr__`), and string conversion (`__str__`).



---

Special methods, also known as dunder methods (short for "double underscore"), are predefined methods in Python that allow you to define how your objects interact with built-in functions, operators, and type conversions. Here’s a rundown of some commonly used special methods:

### 1. **Initialization and Representation**
- **`__init__(self, ...)`**: Called when an object is instantiated. It initializes the object's attributes.
  
  ```python
  class MyClass:
      def __init__(self, value):
          self.value = value
  ```

- **`__repr__(self)`**: Returns a string that represents the object and is meant for developers. Used by `repr()` and in the interactive interpreter.

  ```python
  def __repr__(self):
      return f"MyClass(value={self.value})"
  ```

- **`__str__(self)`**: Returns a string that is meant to be readable and user-friendly. Used by `print()` and `str()`.

  ```python
  def __str__(self):
      return f"Value: {self.value}"
  ```

### 2. **Comparison Operators**
- **`__eq__(self, other)`**: Defines behavior for the equality operator (`==`).
  
- **`__ne__(self, other)`**: Defines behavior for the inequality operator (`!=`).

- **`__lt__(self, other)`**: Defines behavior for less than (`<`).

- **`__le__(self, other)`**: Defines behavior for less than or equal to (`<=`).

- **`__gt__(self, other)`**: Defines behavior for greater than (`>`).

- **`__ge__(self, other)`**: Defines behavior for greater than or equal to (`>=`).

### 3. **Mathematical Operations**
- **`__add__(self, other)`**: Defines behavior for addition (`+`).
  
- **`__sub__(self, other)`**: Defines behavior for subtraction (`-`).

- **`__mul__(self, other)`**: Defines behavior for multiplication (`*`).

- **`__truediv__(self, other)`**: Defines behavior for true division (`/`).

- **`__floordiv__(self, other)`**: Defines behavior for floor division (`//`).

- **`__mod__(self, other)`**: Defines behavior for modulo (`%`).

- **`__pow__(self, other)`**: Defines behavior for exponentiation (`**`).

### 4. **Container Methods**
- **`__getitem__(self, key)`**: Defines behavior for accessing items using square brackets (`obj[key]`).
  
- **`__setitem__(self, key, value)`**: Defines behavior for setting items (`obj[key] = value`).

- **`__delitem__(self, key)`**: Defines behavior for deleting items (`del obj[key]`).

- **`__len__(self)`**: Returns the length of the object (used by `len()`).

- **`__iter__(self)`**: Returns an iterator for the object (used in loops).

- **`__next__(self)`**: Defines behavior for the `next()` function when iterating.

### 5. **Context Managers**
- **`__enter__(self)`**: Called when entering a context (with statement).
  
- **`__exit__(self, exc_type, exc_value, traceback)`**: Called when exiting a context.

### 6. **Callable Objects**
- **`__call__(self, ...)`**: Allows an instance of a class to be called as a function.

  ```python
  class MyClass:
      def __call__(self, x):
          return x + 1
  ```

### 7. **Attribute Access**
- **`__getattr__(self, name)`**: Called when an attribute is not found.
  
- **`__setattr__(self, name, value)`**: Called when an attribute is set.

- **`__delattr__(self, name)`**: Called when an attribute is deleted.

### Summary
Special methods allow you to control and customize the behavior of your classes in Python, making them more intuitive and easier to work with. By implementing these methods, you can define how instances of your class behave with built-in operators, functions, and context management.

