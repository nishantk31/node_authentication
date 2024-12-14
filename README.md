Express.js Authentication System
This is a simple Express.js authentication system that allows users to register, log in, and access protected routes using JWT (JSON Web Tokens) for authentication.

Features
User registration
User login with password hashing (using bcrypt)
JWT-based authentication for protected routes
User data stored in a PostgreSQL database
Prerequisites
Before running the application, you need to have the following installed:

Node.js (v14 or later)
PostgreSQL
npm (Node Package Manager)

**Security Considerations**
Passwords are hashed using bcrypt before being stored in the database.
JWT tokens are used for user authentication and have a 1-hour expiration time.
Be sure to keep your JWT_SECRET key secure and never expose it publicly.
