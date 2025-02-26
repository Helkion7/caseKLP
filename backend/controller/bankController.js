const User = require("../models/UserSchema");
const jwt = require("jsonwebtoken");
const { createTransaction } = require("./transactionController");

/**
 * 1. Validate deposit amount
 * 2. Authenticate user via JWT
 * 3. Find user in database
 * 4. Update user balance
 * 5. Create transaction record
 * 6. Return updated balance
 */
const deposit = async (req, res) => {
  try {
    // Extract and validate amount and description from request
    const { amount, description = "Innskudd" } = req.body;
    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ message: "Please provide a valid amount to deposit" });
    }

    // Extract JWT token from cookies
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authenticated. Please log in." });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (tokenError) {
      console.error("Token verification error:", tokenError);
      return res
        .status(401)
        .json({ message: "Invalid or expired token. Please log in again." });
    }

    // Extract user email from token
    const userEmail = decoded.email;
    if (!userEmail) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    // Find user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user balance
    const prevBalance = user.balance;
    user.balance += parseFloat(amount);

    // Create transaction record for the deposit
    await createTransaction(
      user._id,
      "deposit",
      parseFloat(amount),
      user.balance,
      description
    );

    // Save updated user to database
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

/**
 * 1. Validate withdrawal amount
 * 2. Authenticate user via JWT
 * 3. Find user in database
 * 4. Check if sufficient balance exists
 * 5. Update user balance
 * 6. Create transaction record
 * 7. Return updated balance
 */
const withdraw = async (req, res) => {
  try {
    // Extract and validate amount and description from request
    const { amount, description = "Uttak" } = req.body;
    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ message: "Please provide a valid amount to withdraw" });
    }

    // Extract and verify JWT token from cookies
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authenticated. Please log in." });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (tokenError) {
      return res
        .status(401)
        .json({ message: "Invalid or expired token. Please log in again." });
    }

    // Extract user email from token
    const userEmail = decoded.email;
    if (!userEmail) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    // Find user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has sufficient balance
    if (user.balance < parseFloat(amount)) {
      return res
        .status(400)
        .json({ message: "Insufficient balance for withdrawal" });
    }

    // Update user balance
    const prevBalance = user.balance;
    user.balance -= parseFloat(amount);

    // Create transaction record for the withdrawal
    await createTransaction(
      user._id,
      "withdrawal",
      parseFloat(amount),
      user.balance,
      description
    );

    // Save updated user to database
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

/**
 * 1. Authenticate user via JWT
 * 2. Find user in database
 * 3. Return balance and account information
 */
const getBalance = async (req, res) => {
  try {
    // Extract and verify JWT token
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authenticated. Please log in." });
    }

    // Verify token validity
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (tokenError) {
      return res
        .status(401)
        .json({ message: "Invalid or expired token. Please log in again." });
    }

    // Extract user email from token
    const userEmail = decoded.email;
    if (!userEmail) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    // Find user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return balance and account details
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

/**
 * 1. Validate transfer details (recipient, amount)
 * 2. Authenticate user via JWT
 * 3. Find sender and recipient users in database
 * 4. Check if sender has sufficient balance
 * 5. Update balances for both users
 * 6. Create transaction records for both users
 * 7. Return updated balance
 */
const transfer = async (req, res) => {
  try {
    // Extract and validate input parameters
    const { recipientAccount, amount, description = "Overføring" } = req.body;

    if (!recipientAccount) {
      return res
        .status(400)
        .json({ message: "Mottakerens kontonummer må oppgis" });
    }

    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ message: "Vennligst oppgi et gyldig beløp" });
    }

    // Extract JWT token from cookies
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authenticated. Please log in." });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (tokenError) {
      console.error("Token verification error:", tokenError);
      return res
        .status(401)
        .json({ message: "Invalid or expired token. Please log in again." });
    }

    // Extract user email from token
    const senderEmail = decoded.email;
    if (!senderEmail) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    // Find sender user by email
    const sender = await User.findOne({ email: senderEmail });
    if (!sender) {
      return res.status(404).json({ message: "Sender user not found" });
    }

    // Find recipient user by account number
    const recipient = await User.findOne({
      bankAccountNumber: recipientAccount,
    });
    if (!recipient) {
      return res.status(404).json({
        message: "Mottakeren ble ikke funnet. Sjekk kontonummeret.",
      });
    }

    // Prevent transfers to self
    if (sender._id.toString() === recipient._id.toString()) {
      return res
        .status(400)
        .json({ message: "Du kan ikke overføre penger til din egen konto" });
    }

    // Check if sender has sufficient balance
    if (sender.balance < parseFloat(amount)) {
      return res
        .status(400)
        .json({ message: "Utilstrekkelig saldo for overføring" });
    }

    // Calculate new balances
    const transferAmount = parseFloat(amount);
    const senderPrevBalance = sender.balance;
    const recipientPrevBalance = recipient.balance;

    sender.balance -= transferAmount;
    recipient.balance += transferAmount;

    // Create transaction record for sender
    await createTransaction(
      sender._id,
      "withdrawal",
      transferAmount,
      sender.balance,
      `${description} til ${recipient.name}`
    );

    // Create transaction record for recipient
    await createTransaction(
      recipient._id,
      "deposit",
      transferAmount,
      recipient.balance,
      `${description} fra ${sender.name}`
    );

    // Save both users with updated balances
    await sender.save();
    await recipient.save();

    return res.status(200).json({
      message: "Overføring vellykket",
      newBalance: sender.balance,
    });
  } catch (error) {
    console.error("Error in transfer controller:", error);
    return res.status(500).json({
      message: "Server error during transfer",
      error: error.message,
    });
  }
};

module.exports = { deposit, withdraw, getBalance, transfer };
