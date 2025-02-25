const express = require("express");
const router = express.Router();
const {
  deposit,
  withdraw,
  getBalance,
} = require("../controller/bankController");
const { apiLimiter, withdrawLimiter } = require("../middleware/rateLimiters");

router.post("/deposit", apiLimiter, deposit);
router.post("/withdraw", withdrawLimiter, withdraw);
router.get("/balance", apiLimiter, getBalance);

module.exports = router;
