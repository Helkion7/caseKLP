const express = require("express");
const router = express.Router();
const {
  deposit,
  withdraw,
  getBalance,
} = require("../controller/bankController");

router.post("/deposit", deposit);
router.post("/withdraw", withdraw);
router.get("/balance", getBalance);

module.exports = router;
