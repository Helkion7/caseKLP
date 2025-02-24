const express = require("express");
const router = express.Router();
const bankController = require("../controller/bankController");

router.post("/deposit", bankController.deposit);
router.post("/withdraw", bankController.withdraw);

module.exports = router;
