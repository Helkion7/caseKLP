# Banking API Documentation

## Overview

This project is a secure banking API that provides user authentication, account management, and transaction tracking functionality. The application is built with Node.js and Express, using MongoDB as the database.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [API Endpoints](#api-endpoints)
3. [Authentication](#authentication)
4. [Security Features](#security-features)
5. [Data Models](#data-models)
6. [Controllers](#controllers)
7. [Environment Setup](#environment-setup)
8. [Error Handling](#error-handling)

## System Architecture

The application follows a modular architecture with the following components:

- **Server**: Express.js application entrypoint
- **Routes**: API endpoint definitions
- **Controllers**: Business logic handlers
- **Models**: MongoDB schemas
- **Middleware**: Request processing and security enhancements
- **Utils**: Helper functions

### Directory Structure

```
/
├── server.js                 # Main application entry point
├── routes/                   # API route definitions
│   ├── authRoutes.js         # Authentication routes
│   ├── bankRoutes.js         # Banking operation routes
│   └── transactionRoutes.js  # Transaction history routes
├── controller/               # Business logic implementation
│   ├── authController.js     # Authentication logic
│   ├── bankController.js     # Banking operations logic
│   └── transactionController.js # Transaction history logic
├── models/                   # Database schemas
│   ├── UserSchema.js         # User model definition
│   └── TransactionSchema.js  # Transaction model definition
├── middleware/               # Request processing middleware
│   ├── rateLimiters.js       # Rate limiting middleware
│   └── verifyToken.js        # JWT authentication middleware
└── utils/                    # Helper functions
    ├── createJWT.js          # JWT token generator
    ├── createCookie.js       # HTTP cookie helper
    └── bankAccountUtil.js    # Bank account number generator
```

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/auth/login` | User login | `{ email, password }` | `{ msg, success }` |
| POST | `/api/auth/register` | User registration | `{ name, email, password, repeatPassword }` | `{ msg, success }` |

### Banking Operation Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/bank/deposit` | Deposit funds | `{ amount, description? }` | `{ message, newBalance }` |
| POST | `/api/bank/withdraw` | Withdraw funds | `{ amount, description? }` | `{ message, newBalance }` |
| GET | `/api/bank/balance` | Get account balance | - | `{ balance, accountNumber, iban }` |

### Transaction Endpoints

| Method | Endpoint | Description | Query Parameters | Response |
|--------|----------|-------------|-----------------|----------|
| GET | `/api/transactions` | Get transaction history | `page, limit, sort, order, type, search` | `{ transactions, currentPage, totalPages, totalTransactions }` |
| GET | `/api/transactions/:id` | Get transaction details | - | Transaction object |

## Authentication

The system uses JWT (JSON Web Token) based authentication:

1. User registers or logs in with credentials
2. Server validates credentials and generates a JWT token
3. Token is sent to client as an HTTP-only cookie
4. Client includes the cookie in subsequent requests
5. Server validates the token for protected routes

### JWT Token

The JWT token contains:
- User email
- User role
- Expiration time

### Protected Routes

All transaction routes require authentication via the `verifyJwt` middleware.

## Security Features

The application implements several security measures:

### Rate Limiting

Three rate limiting strategies are implemented:

1. **Global Rate Limiter**: Applied to all routes
   - 100 requests per 15-minute window per IP address

2. **Authentication Rate Limiter**: Applied to login/register endpoints
   - More restrictive limits for sensitive operations

3. **Withdrawal Rate Limiter**: Applied to withdrawal endpoint
   - Special protection for financial operations

### Other Security Measures

- **Helmet**: HTTP security headers
- **CORS**: Cross-Origin Resource Sharing restrictions
- **HTTP-Only Cookies**: Prevents client-side JavaScript access to JWT tokens
- **Password Hashing**: bcrypt with configurable salt rounds
- **Input Validation**: Validation for all user inputs

## Data Models

### User Model

```javascript
{
  name: String,              // User's full name
  email: String,             // Unique email (used for login)
  password: String,          // Hashed password
  bankAccountNumber: String, // Norwegian format bank account number
  iban: String,              // International bank account number
  balance: Number,           // Current account balance
  accountType: String,       // "checking" or "savings"
  transactions: [ObjectId]   // References to Transaction documents
}
```

### Transaction Model

```javascript
{
  user: ObjectId,            // Reference to User document
  type: String,              // "deposit" or "withdrawal"
  amount: Number,            // Transaction amount
  description: String,       // Optional transaction note
  balance: Number,           // Account balance after transaction
  date: Date                 // Transaction timestamp
}
```

## Controllers

### Authentication Controller

Handles user registration and login:

- **Register**: Creates new user accounts with validation
- **Login**: Authenticates users and issues JWT tokens

### Bank Controller

Manages banking operations:

- **Deposit**: Adds funds to user account
- **Withdraw**: Removes funds from user account (with balance check)
- **Get Balance**: Returns current balance and account details

### Transaction Controller

Manages transaction history:

- **Create Transaction**: Records banking operations
- **Get Transactions**: Retrieves transaction history with filtering and pagination
- **Get Transaction by ID**: Retrieves details of a specific transaction

## Environment Setup

Required environment variables:

```
PORT=3000                      # Server port
DB_URI=mongodb://localhost/... # MongoDB connection string
SECRET_KEY=your_jwt_secret     # JWT signing key
SALT=10                        # bcrypt salt rounds
ORIGIN=http://localhost:5173   # Allowed CORS origin
```

## Error Handling

The application implements consistent error handling:

- **Authentication Errors**: 401 Unauthorized
- **Input Validation Errors**: 400 Bad Request
- **Resource Not Found**: 404 Not Found
- **Rate Limiting Exceeded**: 429 Too Many Requests
- **Server Errors**: 500 Internal Server Error

All error responses follow the format:

```javascript
{
  message: String,  // Human-readable error message
  error: String     // (Optional) Technical error details
}
```
