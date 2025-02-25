const Transaction = require("../models/TransactionSchema");
const User = require("../models/UserSchema");
const jwt = require("jsonwebtoken");

/**
 * Helper function to extract and validate user from JWT token
 *
 * @param {string} token - JWT token from cookies
 * @returns {Object} - User document from database
 * @throws {Error} - If token is invalid or user not found
 */
const getUserFromToken = async (token) => {
  try {
    // Verify the token and extract payload
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userEmail = decoded.email;

    if (!userEmail) {
      throw new Error("Invalid authentication token");
    }

    // Find the user in the database
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new transaction record and associate with user
 *
 * @param {string} userId - MongoDB ObjectId of user
 * @param {string} type - Transaction type ('deposit' or 'withdrawal')
 * @param {number} amount - Transaction amount
 * @param {number} balance - User's balance after transaction
 * @param {string} description - Optional transaction description
 * @returns {Object} - Created transaction document
 */
const createTransaction = async (
  userId,
  type,
  amount,
  balance,
  description = ""
) => {
  try {
    // Create new transaction document
    const transaction = new Transaction({
      user: userId,
      type,
      amount,
      balance,
      description,
    });

    // Save transaction to database
    await transaction.save();

    // Add transaction reference to user's transactions array
    await User.findByIdAndUpdate(userId, {
      $push: { transactions: transaction._id },
    });

    return transaction;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw new Error("Failed to record transaction");
  }
};

/**
 * Get transactions for authenticated user with pagination and filtering
 *
 * Supported query parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10)
 * - sort: Field to sort by (default: 'date')
 * - order: Sort order ('asc' or 'desc', default: 'desc')
 * - type: Filter by transaction type
 * - search: Text search in transaction descriptions
 */
const getTransactions = async (req, res) => {
  try {
    // Extract and verify JWT token
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authenticated. Please log in." });
    }

    // Get user from token
    const user = await getUserFromToken(token);

    // Parse pagination, sorting and filtering parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "date";
    const order = req.query.order === "asc" ? 1 : -1;
    const type = req.query.type;
    const search = req.query.search;

    // Build query object starting with user filter
    const query = { user: user._id };

    // Add type filter if specified
    if (type && type !== "all") {
      query.type = type;
    }

    // Add text search if specified
    if (search && search.trim() !== "") {
      query.$text = { $search: search };
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order;

    // Get total count for pagination
    const totalTransactions = await Transaction.countDocuments(query);
    const totalPages = Math.ceil(totalTransactions / limit);

    // Execute query with pagination and sorting
    const transactions = await Transaction.find(query)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit);

    // Return transactions with pagination metadata
    return res.status(200).json({
      transactions,
      currentPage: page,
      totalPages,
      totalTransactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);

    // Handle token expiration specifically
    if (error.message === "Invalid or expired token") {
      return res
        .status(401)
        .json({ message: "Session expired. Please log in again." });
    }

    return res.status(500).json({
      message: "Error retrieving transactions",
      error: error.message,
    });
  }
};

/**
 * Get a single transaction by ID
 *
 * Security: Only returns the transaction if it belongs to the authenticated user
 */
const getTransactionById = async (req, res) => {
  try {
    // Extract and verify JWT token
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authenticated. Please log in." });
    }

    // Get user from token
    const user = await getUserFromToken(token);
    const transactionId = req.params.id;

    // Find transaction that belongs to this user
    const transaction = await Transaction.findOne({
      _id: transactionId,
      user: user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(200).json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);

    // Handle token expiration specifically
    if (error.message === "Invalid or expired token") {
      return res
        .status(401)
        .json({ message: "Session expired. Please log in again." });
    }

    return res.status(500).json({
      message: "Error retrieving transaction",
      error: error.message,
    });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
};
