// routes/accountRoutes.js
const express = require("express");
const router = express.Router();
// const authMiddleware = require("../middleware/authMiddleware");
const {
  deposit,
  withdraw,
  getBalance,
} = require("../controller/accountController");

// Endpoint to deposit money
router.post("/deposit", deposit);

// Endpoint to withdraw money
router.post("/withdraw", withdraw);

// Endpoint to retrieve current balance
router.get("/balance", getBalance);

module.exports = router;
