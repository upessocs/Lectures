# Lecture 20

# Authentication Mechanisms: Basic Auth, Token-based Auth, JWT

**Course Outcome:** CO3 – Implement secure authentication mechanisms to protect API endpoints.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 20 |
| Unit | Unit 2: Database Management |
| Topic | Authentication Mechanisms: Basic Auth, Token-based Auth, JWT |
| Course Outcome | CO3 |
| Bloom's Knowledge Level | Apply |
| Skills Developed | Authentication/Authorization concepts, Basic Auth, JWT implementation, Token management |
| Applications | API security, User identity verification, Secure backend services |
| PBL Activity | Securing the Student Management API with JWT-based authentication |
| Assessment Method | Coding project & Security implementation demonstration |

---

## 1. Introduction

In L19, we built complete CRUD APIs for managing students and courses. However, anyone can currently access and modify data without permission. In real-world applications, we need to verify user identities before allowing access to protected resources.

**Authentication** is the process of verifying who a user is. It answers the question: "Are you who you claim to be?" This is different from **authorization**, which determines what an authenticated user is allowed to do.

By the end of this lecture, you will have:

1. Understanding of different authentication methods and their trade-offs.
2. Knowledge of how HTTP Basic Authentication works.
3. Skills to implement token-based authentication.
4. Ability to implement JWT (JSON Web Tokens) for stateless authentication.
5. Hands-on experience securing API endpoints.

---

## 2. Authentication vs Authorization

| Concept | Question | Example |
|---------|----------|---------|
| **Authentication** | "Who are you?" | Login with email and password |
| **Authorization** | "What can you do?" | Admin can delete; student cannot |

<svg xmlns="http://www.w3.org/2000/svg" width="800" height="200" viewBox="0 0 800 200">
<rect width="800" height="200" fill="white"/>
<text x="400" y="30" text-anchor="middle" font-size="18" font-weight="bold">Authentication vs Authorization Flow</text>

<rect x="40" y="60" width="150" height="80" rx="8" fill="#EAF4FF" stroke="#1E88E5"/>
<text x="115" y="95" text-anchor="middle" font-size="14">User</text>
<text x="115" y="115" text-anchor="middle" font-size="11">Credentials</text>

<line x1="190" y1="100" x2="250" y2="100" stroke="black" stroke-width="2"/>
<text x="220" y="90" font-size="10">1. Login</text>

<rect x="250" y="60" width="150" height="80" rx="8" fill="#E8F8EC" stroke="#43A047"/>
<text x="325" y="95" text-anchor="middle" font-size="14">Auth Server</text>
<text x="325" y="115" text-anchor="middle" font-size="11">Verify Identity</text>

<line x1="400" y1="100" x2="460" y2="100" stroke="black" stroke-width="2"/>
<text x="430" y="90" font-size="10">2. Token</text>

<rect x="460" y="60" width="150" height="80" rx="8" fill="#FFF8E6" stroke="#FB8C00"/>
<text x="535" y="95" text-anchor="middle" font-size="14">API Server</text>
<text x="535" y="115" text-anchor="middle" font-size="11">Check Permissions</text>

<line x1="610" y1="100" x2="670" y2="100" stroke="black" stroke-width="2"/>
<text x="640" y="90" font-size="10">3. Access</text>

<rect x="670" y="60" width="110" height="80" rx="8" fill="#F3E5F5" stroke="#8E24AA"/>
<text x="725" y="95" text-anchor="middle" font-size="14">Resource</text>
<text x="725" y="115" text-anchor="middle" font-size="11">Data</text>

<text x="400" y="170" text-anchor="middle" font-size="12">Authentication: "Who are you?" → Authorization: "What can you do?"</text>
</svg>

---

## 3. Authentication Methods

### 3.1 HTTP Basic Authentication

The simplest authentication method. Credentials are sent with every request encoded in Base64.

**How it works:**

1. Client sends `Authorization: Basic base64(username:password)` header
2. Server decodes and verifies credentials
3. Server responds with data or 401 Unauthorized

**Implementation:**

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
import base64

security = HTTPBasic()

def verify_basic_auth(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = "admin"
    correct_password = "secret123"
    
    username_correct = credentials.username == correct_username
    password_correct = credentials.password == correct_password
    
    if not (username_correct and password_correct):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username

@app.get("/protected")
def protected_route(username: str = Depends(verify_basic_auth)):
    return {"message": f"Hello, {username}!"}
```

**Pros:**
* Simple to implement
* Works with all HTTP clients

**Cons:**
* Credentials sent with every request
* No logout mechanism (credentials cached by browser)
* No expiration
* Not suitable for production

---

## 4. Token-based Authentication

Instead of sending credentials with every request, the user authenticates once and receives a **token**. Subsequent requests include only the token.

### 4.1 How Token Auth Works

<svg xmlns="http://www.w3.org/2000/svg" width="900" height="250" viewBox="0 0 900 250">
<rect width="900" height="250" fill="white"/>
<text x="450" y="30" text-anchor="middle" font-size="18" font-weight="bold">Token-based Authentication Flow</text>

<rect x="40" y="60" width="120" height="80" rx="8" fill="#EAF4FF" stroke="#1E88E5"/>
<text x="100" y="95" text-anchor="middle" font-size="14">Client</text>

<rect x="220" y="60" width="120" height="80" rx="8" fill="#E8F8EC" stroke="#43A047"/>
<text x="280" y="95" text-anchor="middle" font-size="14">Auth API</text>

<rect x="400" y="60" width="120" height="80" rx="8" fill="#FFF8E6" stroke="#FB8C00"/>
<text x="460" y="95" text-anchor="middle" font-size="14">API Server</text>

<rect x="580" y="60" width="120" height="80" rx="8" fill="#F3E5F5" stroke="#8E24AA"/>
<text x="640" y="95" text-anchor="middle" font-size="14">Database</text>

<!-- Step 1: Login -->
<line x1="160" y1="80" x2="220" y2="80" stroke="black" stroke-width="2"/>
<text x="190" y="70" font-size="10">1. Login</text>

<!-- Step 2: Token -->
<line x1="340" y1="80" x2="400" y2="80" stroke="black" stroke-width="2"/>
<text x="370" y="70" font-size="10">2. Token</text>

<!-- Step 3: Request with token -->
<line x1="160" y1="120" x2="400" y2="120" stroke="black" stroke-width="2"/>
<text x="280" y="135" font-size="10">3. Request + Token</text>

<!-- Step 4: Validate token -->
<line x1="460" y1="140" x2="580" y2="140" stroke="black" stroke-width="2"/>
<text x="520" y="135" font-size="10">4. Query</text>

<!-- Step 5: Response -->
<line x1="400" y1="150" x2="160" y2="150" stroke="black" stroke-width="2"/>
<text x="280" y="165" font-size="10">5. Response</text>

<text x="450" y="220" text-anchor="middle" font-size="12">Token eliminates sending credentials with every request</text>
</svg>

### 4.2 Token Storage

**Client-side storage options:**

| Storage | Security | Usage |
|---------|----------|-------|
| Memory (JavaScript variable) | Lost on refresh | SPA with refresh tokens |
| localStorage | Vulnerable to XSS | Simple applications |
| httpOnly cookie | Secure from XSS | Recommended for web apps |

---

## 5. JWT (JSON Web Tokens)

**JWT** is a compact, URL-safe token format for securely transmitting information between parties as a JSON object.

### 5.1 JWT Structure

A JWT consists of three parts separated by dots:

```
xxxxx.yyyyy.zzzzz
```

| Part | Name | Content |
|------|------|---------|
| Header | Algorithm & type | `{"alg": "HS256", "typ": "JWT"}` |
| Payload | Claims (user data) | `{"sub": 1, "name": "Aarav", "exp": 1234567890}` |
| Signature | Verification hash | `HMACSHA256(base64(header) + "." + base64(payload), secret)` |

### 5.2 JWT Claims

**Registered claims:**

| Claim | Description | Example |
|-------|-------------|---------|
| `sub` | Subject (user ID) | `1` |
| `exp` | Expiration time | `1234567890` |
| `iat` | Issued at | `1234567890` |
| `iss` | Issuer | `"student-api"` |

**Custom claims:**

```json
{
    "sub": 1,
    "name": "Aarav",
    "email": "aarav@upes.ac.in",
    "role": "student",
    "exp": 1735689600,
    "iat": 1735603200
}
```

### 5.3 JWT Flow

1. User logs in with email and password
2. Server verifies credentials and generates JWT
3. Server returns JWT to client
4. Client stores JWT and sends it with every request
5. Server verifies JWT signature and extracts user data
6. Server processes request and returns response

---

## 6. Implementing JWT Authentication

### 6.1 Install Dependencies

```bash
pip install python-jose[cryptography] passlib[bcrypt] python-multipart
```

### 6.2 Create Auth Module

**auth.py:**

```python
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import get_db
from models import Student

# Configuration
SECRET_KEY = "your-secret-key-keep-it-secret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Student:
    payload = decode_token(token)
    user_id = payload.get("sub")
    
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    user = db.query(Student).filter(Student.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user
```

### 6.3 Add Login Endpoint

**main.py:**

```python
from auth import (
    verify_password, get_password_hash, create_access_token,
    get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
)
from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

@app.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(Student).filter(Student.email == request.email).first()
    
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    access_token = create_access_token(
        data={"sub": user.id, "email": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@app.get("/protected")
def protected_route(current_user: Student = Depends(get_current_user)):
    return {
        "message": f"Hello, {current_user.name}!",
        "user_id": current_user.id
    }
```

### 6.4 Secure Existing Endpoints

```python
@app.delete("/students/{student_id}", status_code=204)
def delete_student(
    student_id: int, 
    current_user: Student = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Only admins or the student themselves can delete
    if current_user.role != "admin" and current_user.id != student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this student"
        )
    
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    db.delete(db_student)
    db.commit()
    return None
```

---

## 7. Testing JWT Authentication

### 7.1 Register a Student

```bash
curl -X POST http://localhost:8000/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Aarav",
    "email": "aarav@upes.ac.in",
    "branch": "CSE",
    "password": "securepassword123"
  }'
```

### 7.2 Login

```bash
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"email": "aarav@upes.ac.in", "password": "securepassword123"}'
```

Response:

```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
}
```

### 7.3 Access Protected Route

```bash
curl http://localhost:8000/protected \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 8. Security Best Practices

| Practice | Description |
|----------|-------------|
| **Use HTTPS** | Never send tokens over plain HTTP |
| **Short expiration** | Tokens should expire in 15-30 minutes |
| **Refresh tokens** | Use long-lived refresh tokens for getting new access tokens |
| **Store securely** | Use httpOnly cookies, not localStorage |
| **Validate tokens** | Always verify signature and expiration |
| **Hash passwords** | Use bcrypt or Argon2, never store plain text |
| **Rate limiting** | Prevent brute force attacks |
| **CORS** | Configure Cross-Origin Resource Sharing properly |

---

## 9. Summary

* **Authentication** verifies user identity; **authorization** determines permissions.
* **HTTP Basic Auth** is simple but insecure for production use.
* **Token-based authentication** eliminates sending credentials with every request.
* **JWT** is a compact, self-contained token format for secure API authentication.
* Always use HTTPS, hash passwords, and implement proper token expiration.

### Key Takeaways

* JWT tokens contain encoded user data and a signature for verification.
* Access tokens should be short-lived (15-30 minutes).
* Store tokens in httpOnly cookies for web applications.
* Validate token signature and expiration on every request.
* Combine authentication with authorization for complete security.

In **L21 – Authorization Mechanisms: Role-based Access Control, Permissions**, you will learn how to control what authenticated users can do.

---

### Lab Exercise

1. Implement JWT authentication for the Student Management API.
2. Add a `password` field to the Student model (store as hashed password).
3. Create `/login` and `/register` endpoints.
4. Secure the `DELETE /students/{id}` endpoint to allow only admins or the student themselves.
5. Test the authentication flow using Postman:
   - Register a new student
   - Login and obtain a JWT token
   - Access a protected route with the token
   - Try accessing without a token (should get 401)
6. Implement token expiration and test what happens when the token expires.