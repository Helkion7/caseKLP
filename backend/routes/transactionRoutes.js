const express = require("express");
const router = express.Router();
const {
  getTransactions,
  getTransactionById,
} = require("../controller/transactionController");
const verifyJwt = require("../middleware/verifyToken");

router.use(verifyJwt);

router.get("/", getTransactions);

router.get("/:id", getTransactionById);

module.exports = router;
