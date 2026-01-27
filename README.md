# subscription-tracker
A RESTful Subscription Management API built using Node.js, Express, and MongoDB.
This backend application allows users to register, authenticate, and manage their subscriptions securely using JWT-based authentication.

#Features
User authentication (Sign Up / Sign In) using JWT
Secure user authorization middleware
Create and manage subscriptions per user
Automatic renewal date calculation
Subscription status handling (Active / Expired / Cancelled)
Centralized error handling
MongoDB with Mongoose ODM
Cookie & Bearer token support

#Tech Stack
Backend: Node.js, Express.js
Database: MongoDB, Mongoose
Authentication: JWT, bcrypt
Environment Config: dotenv
Middleware: Custom auth & error middleware
