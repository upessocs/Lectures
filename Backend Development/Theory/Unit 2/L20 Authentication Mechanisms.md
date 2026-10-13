# Lecture 20

# Authentication Mechanisms: Basic Auth, Token-based Auth, JWT

**Course Outcome:** CO3 – Implement secure authentication mechanisms to protect API endpoints.

## Session Implementation Plan

| Parameter | Details |
|---|---|
| Lecture No. | 20 |
| Unit | Unit 2: Backend Development |
| Topic | Authentication Mechanisms: Basic Auth, Token-based Auth, JWT |
| Course Outcome | CO3 |
| Bloom's Knowledge Level | Apply |
| Skills Developed | Authentication/Authorization concepts, Basic Auth, JWT implementation, Token management, NodeJS setup |
| Applications | API security, User identity verification, Secure backend services |
| PBL Activity | Securing the Student Management API with JWT-based authentication in both Python and Node.js |
| Assessment Method | Coding project & Security implementation demonstration |

---

## 1. Introduction

In L19, we built complete CRUD APIs for managing students and courses. However, anyone can currently access and modify data without permission. In real-world applications, we need to verify user identities before allowing access to protected resources.

**Authentication** is the process of verifying who a user is. It answers the question: "Are you who you claim to be?" This is different from **authorization**, which determines what an authenticated user is allowed to do.

By the end of this lecture, you will have:

1. Understanding of different authentication methods and their trade-offs.
2. Knowledge of how HTTP Basic Authentication works.
3. Skills to implement token-based authentication using JWT.
4. Ability to implement JWT authentication in both Python and Node.js.

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
1. Client sends `Authorization: Basic base64(username:password)` header.
2. Server decodes and verifies credentials.
3. Server responds with data or 401 Unauthorized.

**Implementation (Python):**

```bash
# Set up environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install fastapi uvicorn
```

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
import base64

# Defines the security scheme for FastAPI, which will handle the Basic Auth header parsing
security = HTTPBasic()

def verify_basic_auth(credentials: HTTPBasicCredentials = Depends(security)):
    # Simple hardcoded check (NOT FOR PRODUCTION)
    correct_username = "admin"
    correct_password = "secret123"
    
    # Check if credentials match
    if not (credentials.username == correct_username and credentials.password == correct_password):
        # Raise 401 Unauthorized if check fails
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

- Simple to implement
- Works with all HTTP clients

**Cons:**

- Credentials sent with every request
- No logout mechanism (credentials cached by browser)
- No expiration
- Not suitable for production

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

### 6.1 Python Implementation

**Setup Environment:**
```bash
# Set up virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
# Install dependencies
pip install fastapi uvicorn python-jose[cryptography] passlib[bcrypt] python-multipart sqlalchemy
```

**auth.py:**

```python
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
# Assume models and database are defined in your project
from database import get_db
from models import Student

# Configuration
SECRET_KEY = "your-secret-key-keep-it-secret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# CryptContext used for password hashing/verification
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2PasswordBearer extracts the token from the Authorization header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Compares plain password with the stored hash
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    # Hashes the password before storage
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    # Encodes the JWT with payload, secret key, and algorithm
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        # Decodes the JWT to verify signature and expiration
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Student:
    payload = decode_token(token)
    user_id = payload.get("sub")
    
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    
    user = db.query(Student).filter(Student.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

### 6.2 Python Implementation - Login & Endpoints

**main.py:**

```python
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from auth import (
    verify_password, create_access_token,
    get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
)
from pydantic import BaseModel
from database import get_db
from models import Student
from datetime import timedelta

app = FastAPI()

class LoginRequest(BaseModel):
    email: str
    password: str

# Login endpoint: validates credentials and returns a JWT
@app.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(Student).filter(Student.email == request.email).first()
    
    # Validate user existence and password
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create and return JWT
    access_token = create_access_token(
        data={"sub": user.id, "email": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

# Protected route: requires a valid JWT
@app.get("/protected")
def protected_route(current_user: Student = Depends(get_current_user)):
    return {"message": f"Hello, {current_user.name}!"}
```

---
### 6.2 NodeJS Implementation

**Setup Process:**
1. Initialize project: `npm init -y`
2. Install dependencies: `npm install express jsonwebtoken bcryptjs`

**app.js:**

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

const SECRET_KEY = "your-secret-key-keep-it-secret";

// User database simulation
const users = [];

// Register user
app.post('/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 8); // Hashing password
    users.push({ email: req.body.email, password: hashedPassword });
    res.status(201).send("User registered");
});

// Login and get token
app.post('/login', async (req, res) => {
    const user = users.find(u => u.email === req.body.email);
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(401).send("Invalid credentials");
    }
    // Signing the token with payload and secret
    const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '30m' });
    res.json({ access_token: token, token_type: "bearer" });
});

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
    
    if (!token) return res.sendStatus(401);
    
    // Verify token
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: `Hello, ${req.user.email}!` });
});

app.listen(3000, () => console.log('Server running on port 3000'));
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