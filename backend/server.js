const express = require("express");
require("dotenv").config(); // Load environment variables from .env file
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

// Import route modules
const authRoutes = require("./routes/authRoutes");
const bankRoutes = require("./routes/bankRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

// Initialize Express app
const app = express();

app.use(helmet());

/**
 * MongoDB Connection
 *
 * Connect to MongoDB using the connection string from environment variables
 * Log success or error messages for monitoring
 */
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

/**
 * CORS Configuration
 *
 * Restrict cross-origin requests to specified origin in environment variables
 * Allow credentials (cookies) in cross-origin requests
 * Limit HTTP methods to GET, PUT, POST, DELETE for security
 */
let corsOptions = {
  origin: process.env.ORIGIN, // Allowed origin from environment variables
  methods: "GET,PUT,POST,DELETE",
  credentials: true, // Allow cookies in CORS requests
};

/**
 * Global Rate Limiter
 *
 * Base protection against DoS attacks and abuse
 * Applies to all routes that don't have specific rate limiters
 *
 * Configuration:
 * - 15 minute window
 * - Maximum 100 requests per window per IP address
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
  max: 100, // 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 429,
    message: "Too many requests, please try again later.",
  },
});

// Apply global rate limiter to all requests
app.use(limiter);

// Apply CORS configuration
app.use(cors(corsOptions));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser());

/**
 * API Routes
 *
 * Mount route modules at their respective base paths:
 * - Authentication routes: /api/auth
 * - Banking operations routes: /api/bank
 * - Transaction history routes: /api/transactions
 */
app.use("/api/auth", authRoutes);
app.use("/api/bank", bankRoutes);
app.use("/api/transactions", transactionRoutes);

/**
 * Root Route
 *
 * Simple health check endpoint to verify server is running
 */
app.get("/", (req, res) => {
  res.send(`Server running on port ${process.env.PORT}`);
});

/**
 * Start Server
 *
 * Listen on port from environment variables
 * Log startup message for monitoring
 */
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
