// server.js
const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const app = express();

app.use(cors());
app.use(express.json());

// In-memory database (replace with real DB in production)
let users = new Map();
let transactions = new Map();

// Account types and their interest rates
const ACCOUNT_TYPES = {
  CHECKING: { name: "Checking", interestRate: 0.5 },
  SAVINGS: { name: "Savings", interestRate: 2.0 },
  BSU: { name: "BSU", interestRate: 3.5, maxYearlyDeposit: 27500 },
};

// User registration
app.post("/api/users/register", (req, res) => {
  const { name, email, password } = req.body;
  const userId = uuidv4();

  // Create default accounts for new user
  const accounts = {
    checking: {
      accountNumber: generateAccountNumber(),
      balance: 0,
      type: "CHECKING",
    },
    savings: {
      accountNumber: generateAccountNumber(),
      balance: 0,
      type: "SAVINGS",
    },
    bsu: {
      accountNumber: generateAccountNumber(),
      balance: 0,
      type: "BSU",
      yearlyDeposits: 0,
    },
  };

  users.set(userId, {
    id: userId,
    name,
    email,
    password, // Note: Hash this in production
    accounts,
  });

  res.json({ userId, accounts });
});

// Account operations
app.post("/api/accounts/deposit", (req, res) => {
  const { userId, accountType, amount } = req.body;
  const user = users.get(userId);

  if (!user) return res.status(404).json({ error: "User not found" });

  const account = user.accounts[accountType.toLowerCase()];
  if (!account) return res.status(404).json({ error: "Account not found" });

  // BSU deposit validation
  if (accountType === "BSU") {
    const currentYear = new Date().getFullYear();
    if (account.yearlyDeposits + amount > ACCOUNT_TYPES.BSU.maxYearlyDeposit) {
      return res
        .status(400)
        .json({ error: "Exceeds yearly BSU deposit limit" });
    }
    account.yearlyDeposits += amount;
  }

  account.balance += amount;
  recordTransaction(userId, accountType, "DEPOSIT", amount);

  res.json({ balance: account.balance });
});

app.post("/api/accounts/withdraw", (req, res) => {
  const { userId, accountType, amount } = req.body;
  const user = users.get(userId);

  if (!user) return res.status(404).json({ error: "User not found" });

  const account = user.accounts[accountType.toLowerCase()];
  if (!account) return res.status(404).json({ error: "Account not found" });

  if (account.balance < amount) {
    return res.status(400).json({ error: "Insufficient funds" });
  }

  // BSU withdrawal restrictions
  if (accountType === "BSU") {
    return res
      .status(400)
      .json({ error: "Cannot withdraw from BSU account directly" });
  }

  account.balance -= amount;
  recordTransaction(userId, accountType, "WITHDRAWAL", amount);

  res.json({ balance: account.balance });
});

app.post("/api/accounts/transfer", (req, res) => {
  const { userId, fromAccount, toAccount, amount } = req.body;
  const user = users.get(userId);

  if (!user) return res.status(404).json({ error: "User not found" });

  const sourceAccount = user.accounts[fromAccount.toLowerCase()];
  const targetAccount = user.accounts[toAccount.toLowerCase()];

  if (!sourceAccount || !targetAccount) {
    return res.status(404).json({ error: "Account not found" });
  }

  if (sourceAccount.balance < amount) {
    return res.status(400).json({ error: "Insufficient funds" });
  }

  sourceAccount.balance -= amount;
  targetAccount.balance += amount;

  recordTransaction(userId, fromAccount, "TRANSFER_OUT", amount);
  recordTransaction(userId, toAccount, "TRANSFER_IN", amount);

  res.json({
    sourceBalance: sourceAccount.balance,
    targetBalance: targetAccount.balance,
  });
});

// Get account balance and details
app.get("/api/accounts/:userId/:accountType", (req, res) => {
  const { userId, accountType } = req.params;
  const user = users.get(userId);

  if (!user) return res.status(404).json({ error: "User not found" });

  const account = user.accounts[accountType.toLowerCase()];
  if (!account) return res.status(404).json({ error: "Account not found" });

  res.json(account);
});

// Get transaction history
app.get("/api/transactions/:userId", (req, res) => {
  const { userId } = req.params;
  const userTransactions = transactions.get(userId) || [];
  res.json(userTransactions);
});

// Calculate interest
app.get("/api/accounts/interest/:userId/:accountType", (req, res) => {
  const { userId, accountType } = req.params;
  const user = users.get(userId);

  if (!user) return res.status(404).json({ error: "User not found" });

  const account = user.accounts[accountType.toLowerCase()];
  if (!account) return res.status(404).json({ error: "Account not found" });

  const interestRate = ACCOUNT_TYPES[account.type].interestRate;
  const yearlyInterest = account.balance * (interestRate / 100);

  res.json({
    balance: account.balance,
    interestRate,
    yearlyInterest,
  });
});

// Helper functions
function generateAccountNumber() {
  return Math.floor(10000000000 + Math.random() * 90000000000).toString();
}

function recordTransaction(userId, accountType, type, amount) {
  const transaction = {
    id: uuidv4(),
    timestamp: new Date(),
    accountType,
    type,
    amount,
  };

  if (!transactions.has(userId)) {
    transactions.set(userId, []);
  }

  transactions.get(userId).push(transaction);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
