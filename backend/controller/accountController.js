// controllers/accountController.js
const User = require("../models/UserSchema");

exports.deposit = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid deposit amount" });
    }
    // Find the user by the ID stored in the JWT (set in authMiddleware)
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Update the user's balance
    user.balance = (user.balance || 0) + parseFloat(amount);
    await user.save();
    res.json({ message: "Deposit successful", balance: user.balance });
  } catch (error) {
    console.error("Deposit error:", error);
    res.status(500).json({ message: "Server error during deposit" });
  }
};

exports.withdraw = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid withdrawal amount" });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Ensure the user has enough balance
    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }
    // Update the user's balance
    user.balance -= parseFloat(amount);
    await user.save();
    res.json({ message: "Withdrawal successful", balance: user.balance });
  } catch (error) {
    console.error("Withdrawal error:", error);
    res.status(500).json({ message: "Server error during withdrawal" });
  }
};

exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ balance: user.balance });
  } catch (error) {
    console.error("Balance retrieval error:", error);
    res.status(500).json({ message: "Server error retrieving balance" });
  }
};
