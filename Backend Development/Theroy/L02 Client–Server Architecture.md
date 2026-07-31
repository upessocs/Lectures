
# Lecture 02

# Client–Server Architecture: Understanding the Model and Communication Protocols

**Course Outcome:** CO1 – Understand the client-server model and communication protocols used in backend development.

## 1. Introduction

Modern web applications are built on the principle of distributed computing, where different components of an application execute on different computers connected through a network. Instead of storing all data and performing all computations on a user's device, applications distribute responsibilities between clients and servers.

The **client-server architecture** is the most widely adopted computing model for web applications. It enables millions of users to simultaneously access centralized services while ensuring security, scalability, maintainability, and efficient resource sharing.

Every interaction with a website or web application, such as opening a webpage, logging into an account, uploading a file, or making an online payment, follows the client-server communication model.

Understanding this architecture is essential because every backend application is designed to receive requests from clients, process those requests, interact with databases or external services, and return appropriate responses.

## 2. What is a Client?

A **client** is a software application or device that requests services or resources from another computer over a network. Clients initiate communication by sending requests to servers and presenting the received information to users.

Clients are responsible for:

* Accepting user input.
* Displaying graphical interfaces.
* Sending requests to servers.
* Receiving responses.
* Rendering webpages or application data.

Common examples of clients include:

* Web browsers such as Chrome, Firefox, Edge, and Safari.
* Mobile applications such as WhatsApp, Instagram, and Amazon.
* Desktop applications.
* IoT devices.
* Smart TVs.
* Command-line tools such as `curl`.

Although clients may perform some processing locally, they generally rely on backend servers for authentication, business logic, and persistent data storage.

## 3. What is a Server?

A **server** is a computer system or software application that provides services, resources, or data to one or more clients over a network. Servers continuously listen for incoming requests, process them according to predefined rules, and return appropriate responses.

Backend servers perform tasks such as:

* User authentication.
* Business logic execution.
* Database operations.
* File management.
* Email notifications.
* Payment processing.
* API services.
* Logging and monitoring.

Unlike client applications, servers are expected to remain continuously available and capable of handling multiple users simultaneously.

## 4. Client–Server Architecture

The client-server architecture separates user interaction from application processing.

In a typical web application:

1. The client collects input from the user.
2. The client sends a request to the server.
3. The server processes the request.
4. The server communicates with databases or external services if required.
5. The server prepares a response.
6. The response is sent back to the client.
7. The client displays the result to the user.

This separation provides several advantages, including centralized data management, easier maintenance, improved security, and better scalability.

### Basic Client–Server Architecture

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="240" viewBox="0 0 900 240">
<rect width="900" height="240" fill="white"/>

<rect x="40" y="60" width="180" height="120" rx="8" fill="#EAF4FF" stroke="#1E88E5"/>
<text x="130" y="95" text-anchor="middle" font-size="20">Client</text>
<text x="130" y="120" text-anchor="middle" font-size="14">Browser / Mobile App</text>
<text x="130" y="145" text-anchor="middle" font-size="14">User Interface</text>

<rect x="360" y="60" width="180" height="120" rx="8" fill="#E8F8EC" stroke="#43A047"/>
<text x="450" y="95" text-anchor="middle" font-size="20">Backend Server</text>
<text x="450" y="120" text-anchor="middle" font-size="14">Business Logic</text>
<text x="450" y="145" text-anchor="middle" font-size="14">API Processing</text>

<rect x="680" y="60" width="180" height="120" rx="8" fill="#FFF8E6" stroke="#FB8C00"/>
<text x="770" y="95" text-anchor="middle" font-size="20">Database</text>
<text x="770" y="120" text-anchor="middle" font-size="14">Persistent Storage</text>

<line x1="220" y1="120" x2="360" y2="120" stroke="black" stroke-width="2"/>
<polygon points="355,115 368,120 355,125" fill="black"/>

<line x1="540" y1="120" x2="680" y2="120" stroke="black" stroke-width="2"/>
<polygon points="675,115 688,120 675,125" fill="black"/>

<text x="290" y="105" font-size="13">HTTP Request</text>
<text x="290" y="145" font-size="13">HTTP Response</text>
</svg>
```

## 5. Types of Client–Server Architectures

### Two-Tier Architecture

The client communicates directly with the database server or application server.

Characteristics:

* Simple implementation.
* Suitable for small applications.
* Limited scalability.
* Difficult to maintain for large systems.

Examples include desktop database applications and small office management systems.

### Three-Tier Architecture

Modern web applications generally follow the three-tier architecture.

The three layers are:

* Presentation Layer (Client)
* Application Layer (Backend Server)
* Data Layer (Database)

Advantages include:

* Better security.
* Independent scalability.
* Easier maintenance.
* Modular development.
* Improved performance.

Most enterprise applications use this architecture.

### Multi-Tier Architecture

Large-scale cloud applications further divide the application layer into multiple services such as authentication servers, API gateways, payment services, caching servers, and microservices.

Examples include Amazon, Netflix, and Microsoft Azure.

## 6. Communication Between Client and Server

Communication begins when the client initiates a request. The server processes the request and returns a response. This communication follows predefined rules known as **communication protocols**.

A protocol defines:

* Message format.
* Data encoding.
* Communication sequence.
* Error handling.
* Security mechanisms.

Without standardized protocols, computers developed by different manufacturers would not be able to communicate effectively.

## 7. Common Communication Protocols

### HTTP (HyperText Transfer Protocol)

HTTP is the primary communication protocol used for transferring webpages and API data between clients and servers.

Applications:

* Web browsing.
* REST APIs.
* Web services.

HTTP will be studied in detail in the next lecture.

### HTTPS (HyperText Transfer Protocol Secure)

HTTPS is the secure version of HTTP that encrypts communication using SSL/TLS.

Benefits include:

* Data confidentiality.
* Data integrity.
* Authentication.
* Protection against eavesdropping.

Modern websites use HTTPS by default.

### WebSocket

WebSocket enables continuous, bidirectional communication between clients and servers without repeatedly opening new HTTP connections.

Applications:

* Online gaming.
* Live chat.
* Stock market dashboards.
* Collaborative editors.

### FTP (File Transfer Protocol)

FTP is used for transferring files between computers over a network.

Applications:

* Website deployment.
* File sharing.
* Remote backups.

### SMTP

Simple Mail Transfer Protocol is used for sending emails from applications.

Backend systems use SMTP for:

* Password reset emails.
* Account verification.
* Notifications.

## 8. Real-World Example

Consider an online shopping application.

1. A customer opens the application.
2. The client sends a request for product information.
3. The backend server receives the request.
4. The server queries the product database.
5. Product details are retrieved.
6. The server formats the response.
7. The client displays the product catalog.
8. When the customer places an order, another request is sent to the backend, which validates payment, updates inventory, stores the order, and returns an order confirmation.

Although the customer only sees a few screens, the backend performs multiple coordinated operations.

## 9. Advantages of Client–Server Architecture

* Centralized data management.
* Improved security.
* Easier maintenance.
* Better scalability.
* Efficient resource utilization.
* Multi-user support.
* Simplified software updates.
* Reliable backup and recovery.

## 10. Limitations

Despite its advantages, the client-server model has certain limitations.

* Server failures may interrupt services.
* High server load can reduce performance.
* Network failures affect communication.
* Infrastructure costs increase as applications grow.
* Proper security mechanisms are essential.

Modern cloud computing addresses many of these challenges through redundancy, load balancing, and distributed architectures.

## 11. Client–Server Architecture in AI-Powered Applications

AI-powered applications also follow the client-server model.

For example, when a user submits a prompt to ChatGPT:

1. The browser acts as the client.
2. The prompt is transmitted over HTTPS.
3. Backend servers authenticate the request.
4. AI models process the prompt.
5. The generated response is returned to the client.
6. The browser renders the response.

This demonstrates that even advanced AI systems fundamentally rely on the same client-server communication principles.

## 12. Summary

The client-server architecture forms the foundation of modern backend development. It separates user interaction from application processing, allowing systems to be scalable, secure, and maintainable. Clients initiate communication by sending requests, while servers process those requests and return responses using standardized communication protocols. Understanding this architecture is essential before studying HTTP, RESTful APIs, sessions, and server-side programming, all of which build upon the client-server communication model.
