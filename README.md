# Banking Website

A full-stack banking application with secure user authentication, account management, and transaction history.

![Bank Website Screenshot](https://via.placeholder.com/800x400?text=Bank+Website+Screenshot)

## Features

- 🔐 **Secure Authentication**: User login and registration with JWT authentication
- 💰 **Account Management**: View balance, make deposits and withdrawals
- 💸 **Money Transfers**: Transfer money between accounts
- 📊 **Transaction History**: View, search and filter transaction history
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React (v19)
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- Bcrypt for password encryption
- Express Rate Limiter for security

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas URI)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/bankNettside.git
cd bankNettside
```

2. Install dependencies
```bash
npm run install:all
```

3. Set up environment variables:

Create `.env` files in both frontend and backend directories:

Backend (./backend/.env):
```
DB_URI=mongodb://localhost:27017/bankNettside
PORT=4000
SECRET_KEY=yoursecretkey
ORIGIN=http://localhost:3000
SALT=10
```

Frontend (./frontend/.env):
```
VITE_BACKEND_URL=http://localhost:4000
```

4. Seed the database (optional)
```bash
cd backend
npm run seed
```

5. Start the development servers
```bash
cd ..
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## API Endpoints

### Authentication
- `POST /api/auth/login`: User login
- `POST /api/auth/register`: User registration

### Banking Operations
- `GET /api/bank/balance`: Get account balance
- `POST /api/bank/deposit`: Make a deposit
- `POST /api/bank/withdraw`: Make a withdrawal
- `POST /api/bank/transfer`: Transfer money to another account

### Transactions
- `GET /api/transactions`: Get transaction history with pagination and filters
- `GET /api/transactions/:id`: Get transaction details by ID

## Security Features

- JWT-based authentication with httpOnly cookies
- Rate limiting to prevent brute-force attacks
- Password hashing with bcrypt
- Input validation
- CORS protection
- Helmet middleware for HTTP header security

## License

[MIT](LICENSE)
