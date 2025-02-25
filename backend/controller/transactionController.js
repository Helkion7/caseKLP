const Transaction = require("../models/TransactionSchema");
const User = require("../models/UserSchema");
const jwt = require("jsonwebtoken");

const getUserFromToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userEmail = decoded.email;

    if (!userEmail) {
      throw new Error("Invalid authentication token");
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw error;
  }
};

const createTransaction = async (
  userId,
  type,
  amount,
  balance,
  description = ""
) => {
  try {
    const transaction = new Transaction({
      user: userId,
      type,
      amount,
      balance,
      description,
    });

    await transaction.save();

    await User.findByIdAndUpdate(userId, {
      $push: { transactions: transaction._id },
    });

    return transaction;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw new Error("Failed to record transaction");
  }
};

const getTransactions = async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authenticated. Please log in." });
    }

    const user = await getUserFromToken(token);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "date";
    const order = req.query.order === "asc" ? 1 : -1;
    const type = req.query.type;
    const search = req.query.search;

    const query = { user: user._id };

    if (type && type !== "all") {
      query.type = type;
    }

    if (search && search.trim() !== "") {
      query.$text = { $search: search };
    }

    const sortObj = {};
    sortObj[sort] = order;

    const totalTransactions = await Transaction.countDocuments(query);
    const totalPages = Math.ceil(totalTransactions / limit);

    const transactions = await Transaction.find(query)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      transactions,
      currentPage: page,
      totalPages,
      totalTransactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);

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

const getTransactionById = async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authenticated. Please log in." });
    }

    const user = await getUserFromToken(token);
    const transactionId = req.params.id;

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
