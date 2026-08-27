# Lecture 21

# Authorization Mechanisms: Role-based Access Control, Permissions

**Course Outcome:** CO3 – Implement authorization mechanisms to control user access to resources.

---

## 1. Introduction

In L20, we learned how to authenticate users — verifying their identity using JWT tokens. However, authentication alone is not enough. Once a user is authenticated, we need to determine what they are allowed to do. Can a student delete other students? Can a faculty member modify grades? Can only admins manage courses?

**Authorization** is the process of determining what an authenticated user is allowed to do. It answers the question: "What resources can this user access, and what operations can they perform?"

By the end of this lecture, you will have:

1. Understanding of different authorization models (RBAC, ABAC, ACL).
2. Knowledge of how to implement Role-based Access Control (RBAC).
3. Skills to define and enforce permissions at the API level.
4. Ability to protect endpoints based on user roles and ownership.
5. Hands-on experience implementing authorization in a real application.

---

## 2. Authorization Models

### 2.1 Role-based Access Control (RBAC)

**RBAC** assigns permissions to roles, and users are assigned to roles. Users inherit permissions from their roles.

**Example:**

| Role | Permissions |
|------|-------------|
| Admin | Create, Read, Update, Delete all resources |
| Faculty | Read all students, Update grades |
| Student | Read own profile, Update own profile |

<svg xmlns="http://www.w3.org/2000/svg" width="900" height="250" viewBox="0 0 900 250">
<rect width="900" height="250" fill="white"/>
<text x="450" y="30" text-anchor="middle" font-size="18" font-weight="bold">Role-based Access Control (RBAC)</text>

<!-- Users -->
<rect x="40" y="60" width="120" height="120" rx="8" fill="#EAF4FF" stroke="#1E88E5"/>
<text x="100" y="85" text-anchor="middle" font-size="14" font-weight="bold">Users</text>
<text x="100" y="110" text-anchor="middle" font-size="11">Aarav</text>
<text x="100" y="130" text-anchor="middle" font-size="11">Diya</text>
<text x="100" y="150" text-anchor="middle" font-size="11">Dr. Sharma</text>

<!-- Roles -->
<rect x="220" y="60" width="120" height="120" rx="8" fill="#E8F8EC" stroke="#43A047"/>
<text x="280" y="85" text-anchor="middle" font-size="14" font-weight="bold">Roles</text>
<text x="280" y="110" text-anchor="middle" font-size="11">Student</text>
<text x="280" y="130" text-anchor="middle" font-size="11">Faculty</text>
<text x="280" y="150" text-anchor="middle" font-size="11">Admin</text>

<!-- Permissions -->
<rect x="400" y="60" width="160" height="120" rx="8" fill="#FFF8E6" stroke="#FB8C00"/>
<text x="480" y="85" text-anchor="middle" font-size="14" font-weight="bold">Permissions</text>
<text x="480" y="110" text-anchor="middle" font-size="11">read:own_profile</text>
<text x="480" y="130" text-anchor="middle" font-size="11">update:own_profile</text>
<text x="480" y="150" text-anchor="middle" font-size="11">delete:any_student</text>

<!-- Resources -->
<rect x="620" y="60" width="120" height="120" rx="8" fill="#F3E5F5" stroke="#8E24AA"/>
<text x="680" y="85" text-anchor="middle" font-size="14" font-weight="bold">Resources</text>
<text x="680" y="110" text-anchor="middle" font-size="11">Students</text>
<text x="680" y="130" text-anchor="middle" font-size="11">Courses</text>
<text x="680" y="150" text-anchor="middle" font-size="11">Grades</text>

<!-- Arrows -->
<line x1="160" y1="100" x2="220" y2="100" stroke="black" stroke-width="2"/>
<text x="190" y="90" font-size="10">assigned</text>

<line x1="340" y1="100" x2="400" y2="100" stroke="black" stroke-width="2"/>
<text x="370" y="90" font-size="10">has</text>

<line x1="560" y1="100" x2="620" y2="100" stroke="black" stroke-width="2"/>
<text x="590" y="90" font-size="10">access</text>

<text x="450" y="220" text-anchor="middle" font-size="12">Users → Roles → Permissions → Resources</text>
</svg>

### 2.2 Attribute-based Access Control (ABAC)

**ABAC** makes decisions based on attributes of the user, resource, and environment.

**Example:**

```
IF user.department == resource.department
AND user.role == "faculty"
AND time.hour BETWEEN 9 AND 17
THEN allow access
```

### 2.3 Access Control Lists (ACL)

**ACL** defines which users have access to specific resources.

**Example:**

| Resource | User | Permission |
|----------|------|------------|
| Student:1 | Aarav | read, update |
| Student:1 | Admin | read, update, delete |
| Course:CS301 | Faculty | read, update |

---

## 3. Implementing RBAC

### 3.1 Database Schema for Roles

```python
from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base

# Association table for many-to-many relationship
user_roles = Table(
    'user_roles',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('role_id', Integer, ForeignKey('roles.id'))
)

role_permissions = Table(
    'role_permissions',
    Base.metadata,
    Column('role_id', Integer, ForeignKey('roles.id')),
    Column('permission_id', Integer, ForeignKey('permissions.id'))
)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    email = Column(String(100), unique=True)
    roles = relationship("Role", secondary=user_roles, back_populates="users")

class Role(Base):
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True)  # admin, faculty, student
    permissions = relationship("Permission", secondary=role_permissions, back_populates="roles")
    users = relationship("User", secondary=user_roles, back_populates="roles")

class Permission(Base):
    __tablename__ = "permissions"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True)  # students:read, students:write, courses:delete
    roles = relationship("Role", secondary=role_permissions, back_populates="permissions")
```

### 3.2 Predefined Roles and Permissions

```python
def init_roles_and_permissions(db: Session):
    # Create permissions
    permissions = {
        "students:read": Permission(name="students:read"),
        "students:write": Permission(name="students:write"),
        "students:delete": Permission(name="students:delete"),
        "courses:read": Permission(name="courses:read"),
        "courses:write": Permission(name="courses:write"),
        "courses:delete": Permission(name="courses:delete"),
        "grades:read": Permission(name="grades:read"),
        "grades:write": Permission(name="grades:write"),
    }
    
    # Create roles
    admin_role = Role(name="admin", permissions=list(permissions.values()))
    faculty_role = Role(name="faculty", permissions=[
        permissions["students:read"],
        permissions["courses:read"],
        permissions["grades:read"],
        permissions["grades:write"],
    ])
    student_role = Role(name="student", permissions=[
        permissions["students:read"],
        permissions["courses:read"],
    ])
    
    db.add_all([admin_role, faculty_role, student_role])
    db.commit()
```

---

## 4. Implementing Permission Checks

### 4.1 Permission Decorator

```python
from functools import wraps
from fastapi import HTTPException, status

def require_permission(permission_name: str):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, current_user: User = Depends(get_current_user), **kwargs):
            user_permissions = []
            for role in current_user.roles:
                user_permissions.extend([p.name for p in role.permissions])
            
            if permission_name not in user_permissions:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Permission denied: {permission_name} required"
                )
            
            return await func(*args, current_user=current_user, **kwargs)
        return wrapper
    return decorator

# Usage
@app.delete("/students/{student_id}")
@require_permission("students:delete")
def delete_student(student_id: int, current_user: User = Depends(get_current_user)):
    # Only users with students:delete permission can access this
    pass
```

### 4.2 Role-based Dependency

```python
from enum import Enum

class RoleName(str, Enum):
    ADMIN = "admin"
    FACULTY = "faculty"
    STUDENT = "student"

def require_role(allowed_roles: list[RoleName]):
    def role_checker(current_user: User = Depends(get_current_user)):
        user_roles = [role.name for role in current_user.roles]
        
        if not any(role in allowed_roles for role in user_roles):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        
        return current_user
    return role_checker

# Usage
@app.delete("/students/{student_id}")
def delete_student(
    student_id: int,
    current_user: User = Depends(require_role([RoleName.ADMIN]))
):
    # Only admins can delete students
    pass
```

### 4.3 Ownership Check

```python
@app.put("/students/{student_id}")
def update_student(
    student_id: int,
    student: StudentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Students can only update their own profile
    if current_user.role == "student" and current_user.id != student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own profile"
        )
    
    # Admins and faculty can update any student
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    update_data = student.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_student, field, value)
    
    db.commit()
    return db_student
```

---

## 5. Authorization in FastAPI

### 5.1 Complete Authorization Example

```python
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

app = FastAPI()

# Dependency to check permissions
def check_permission(resource: str, action: str):
    def permission_checker(
        current_user: User = Depends(get_current_user)
    ):
        required_permission = f"{resource}:{action}"
        
        user_permissions = []
        for role in current_user.roles:
            user_permissions.extend([p.name for p in role.permissions])
        
        if required_permission not in user_permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission '{required_permission}' required"
            )
        
        return current_user
    return permission_checker

# Protected endpoints
@app.get("/students", response_model=List[StudentResponse])
def list_students(
    current_user: User = Depends(check_permission("students", "read")),
    db: Session = Depends(get_db)
):
    return db.query(Student).all()

@app.post("/students", response_model=StudentResponse, status_code=201)
def create_student(
    student: StudentCreate,
    current_user: User = Depends(check_permission("students", "write")),
    db: Session = Depends(get_db)
):
    db_student = Student(**student.model_dump())
    db.add(db_student)
    db.commit()
    return db_student

@app.delete("/students/{student_id}", status_code=204)
def delete_student(
    student_id: int,
    current_user: User = Depends(check_permission("students", "delete")),
    db: Session = Depends(get_db)
):
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    db.delete(db_student)
    db.commit()
    return None
```

---

## 6. Authorization Best Practices

| Practice | Description |
|----------|-------------|
| **Principle of least privilege** | Grant minimum permissions needed |
| **Deny by default** | Deny access unless explicitly allowed |
| **Centralize authorization** | Use middleware or decorators, not scattered checks |
| **Audit logging** | Log all authorization decisions |
| **Separate concerns** | Don't mix authentication and authorization logic |
| **Use RBAC for simplicity** | ABAC for complex requirements |
| **Test authorization** | Verify users cannot access unauthorized resources |

---

## 7. Summary

* **Authorization** determines what authenticated users can do.
* **RBAC** assigns permissions to roles; users inherit permissions through roles.
* **Ownership checks** ensure users can only access their own resources.
* **Permission-based** and **role-based** approaches can be combined for fine-grained control.
* Always apply the **principle of least privilege** — grant minimum necessary permissions.

### Key Takeaways

* RBAC is the most common authorization model for web applications.
* Permissions should be specific (e.g., `students:read`, `courses:delete`).
* Ownership checks prevent users from accessing other users' data.
* Centralize authorization logic for maintainability.
* Test authorization thoroughly to prevent security vulnerabilities.

In **L22 – Handling API Requests and Responses: Validation, Serialization**, you will learn advanced techniques for processing API data.

---

### Lab Exercise

1. Implement RBAC for the Student Management API with three roles: Admin, Faculty, Student.
2. Create permissions for each resource (students:read, students:write, students:delete, etc.).
3. Add role checks to all API endpoints.
4. Implement ownership checks so students can only update their own profiles.
5. Test the authorization by:
   - Creating users with different roles
   - Attempting to access endpoints without proper permissions
   - Verifying that ownership checks prevent unauthorized access
6. Create an admin-only endpoint for managing courses.