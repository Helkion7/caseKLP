const express = require("express");
const router = express.Router();
const {
  getTransactions,
  getTransactionById,
} = require("../controller/transactionController");
const verifyJwt = require("../middleware/verifyToken");

// Apply JWT verification middleware to all routes
router.use(verifyJwt);

// Get all transactions for the logged-in user with pagination, sorting, and filtering
router.get("/", getTransactions);

// Get a specific transaction by ID
router.get("/:id", getTransactionById);

module.exports = router;
