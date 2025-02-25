const User = require("../models/UserSchema");
const jwt = require("jsonwebtoken");
const { createTransaction } = require("./transactionController");

const deposit = async (req, res) => {
  try {
    const { amount, description = "Innskudd" } = req.body;
    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ message: "Please provide a valid amount to deposit" });
    }

    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authenticated. Please log in." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (tokenError) {
      console.error("Token verification error:", tokenError);
      return res
        .status(401)
        .json({ message: "Invalid or expired token. Please log in again." });
    }

    const userEmail = decoded.email;
    if (!userEmail) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const prevBalance = user.balance;
    user.balance += parseFloat(amount);

    await createTransaction(
      user._id,
      "deposit",
      parseFloat(amount),
      user.balance,
      description
    );

    await user.save();

    return res.status(200).json({
      message: "Deposit successful",
      newBalance: user.balance,
    });
  } catch (error) {
    console.error("Error in deposit controller:", error);
    return res
      .status(500)
      .json({ message: "Server error during deposit", error: error.message });
  }
};

const withdraw = async (req, res) => {
  try {
    const { amount, description = "Uttak" } = req.body;
    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ message: "Please provide a valid amount to withdraw" });
    }

    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authenticated. Please log in." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (tokenError) {
      return res
        .status(401)
        .json({ message: "Invalid or expired token. Please log in again." });
    }

    const userEmail = decoded.email;
    if (!userEmail) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.balance < parseFloat(amount)) {
      return res
        .status(400)
        .json({ message: "Insufficient balance for withdrawal" });
    }

    const prevBalance = user.balance;
    user.balance -= parseFloat(amount);

    await createTransaction(
      user._id,
      "withdrawal",
      parseFloat(amount),
      user.balance,
      description
    );

    await user.save();

    return res.status(200).json({
      message: "Withdrawal successful",
      newBalance: user.balance,
    });
  } catch (error) {
    console.error("Error in withdraw controller:", error);
    return res.status(500).json({
      message: "Server error during withdrawal",
      error: error.message,
    });
  }
};

const getBalance = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authenticated. Please log in." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (tokenError) {
      return res
        .status(401)
        .json({ message: "Invalid or expired token. Please log in again." });
    }

    const userEmail = decoded.email;
    if (!userEmail) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      balance: user.balance,
      accountNumber: user.bankAccountNumber,
      iban: user.iban,
    });
  } catch (error) {
    console.error("Error in getBalance controller:", error);
    return res.status(500).json({
      message: "Server error while retrieving balance",
      error: error.message,
    });
  }
};

module.exports = { deposit, withdraw, getBalance };
