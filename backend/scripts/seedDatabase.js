const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const User = require("../models/UserSchema");
const Transaction = require("../models/TransactionSchema");
const { generateNorwegianBankAccount } = require("../utils/bankAccountUtil");

// Load environment variables from .env file
dotenv.config();

// Database URI from environment or fallback
const dbURI = process.env.DB_URI || "mongodb://localhost:27017/bankNettside";

// Number of random transactions to generate per user
const TRANSACTIONS_PER_USER = 30;

// Seed users data
const users = [
  {
    name: "Anna Nordmann",
    email: "anna@example.com",
    password: "password123",
    balance: 15000,
  },
  {
    name: "Ole Hansen",
    email: "ole@example.com",
    password: "password123",
    balance: 7500,
  },
  {
    name: "Kari Svendsen",
    email: "kari@example.com",
    password: "password123",
    balance: 25000,
  },
];

// Sample transaction descriptions for more realistic data
const depositDescriptions = [
  "Lønn",
  "Overføring fra sparing",
  "Gave fra familie",
  "Tilbakebetaling",
  "Salg på Finn.no",
  "Skatterefusjon",
  "Utbytte",
  "Freelance oppdrag",
  "Bonus",
];

const withdrawalDescriptions = [
  "Mathandel",
  "Transport",
  "Strøm og internett",
  "Husleie",
  "Forsikring",
  "Mobilabonnement",
  "Restaurant",
  "Klær og sko",
  "Underholdning",
  "Helsetjenester",
  "Husholdningsartikler",
];

// Generate a random date within the last 90 days
const getRandomDate = () => {
  const now = new Date();
  const pastDate = new Date(
    now.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000
  );
  return pastDate;
};

// Get a random element from an array
const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Generate a random transaction amount between min and max
const getRandomAmount = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Generate transactions for a user
const generateTransactions = async (userId, initialBalance = 0) => {
  let currentBalance = initialBalance;
  let transactions = [];

  // Generate random transactions
  for (let i = 0; i < TRANSACTIONS_PER_USER; i++) {
    // For realistic transaction history, start with some deposits to build up balance
    const isDeposit = i < 5 ? true : Math.random() > 0.4;

    // Generate appropriate amount based on transaction type
    let amount;
    if (isDeposit) {
      amount = getRandomAmount(500, 10000);
      currentBalance += amount;

      const transaction = new Transaction({
        user: userId,
        type: "deposit",
        amount,
        description: getRandomElement(depositDescriptions),
        balance: currentBalance,
        date: getRandomDate(),
      });

      transactions.push(transaction);
    } else {
      // Ensure withdrawal doesn't exceed current balance
      const maxWithdrawal = Math.min(currentBalance * 0.7, 5000);
      if (maxWithdrawal < 100) continue; // Skip if balance too low

      amount = getRandomAmount(100, maxWithdrawal);
      currentBalance -= amount;

      const transaction = new Transaction({
        user: userId,
        type: "withdrawal",
        amount,
        description: getRandomElement(withdrawalDescriptions),
        balance: currentBalance,
        date: getRandomDate(),
      });

      transactions.push(transaction);
    }
  }

  // Sort transactions by date in ascending order
  transactions.sort((a, b) => a.date - b.date);

  // Recalculate balances to ensure consistency
  let runningBalance = initialBalance;
  transactions.forEach((transaction) => {
    if (transaction.type === "deposit") {
      runningBalance += transaction.amount;
    } else {
      runningBalance -= transaction.amount;
    }
    transaction.balance = runningBalance;
  });

  // Save all transactions
  const savedTransactions = await Transaction.insertMany(transactions);

  // Return final balance and transaction IDs
  return {
    finalBalance: runningBalance,
    transactionIds: savedTransactions.map((t) => t._id),
  };
};

// Main seeding function
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(dbURI);
    console.log("Connected to MongoDB successfully!");

    // Clear existing data
    console.log("Clearing existing database data...");
    await Transaction.deleteMany({});
    await User.deleteMany({});
    console.log("Database cleared!");

    // Create users with transactions
    console.log("Creating users with transactions...");
    for (const userData of users) {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Generate bank account details
      const bankAccount = generateNorwegianBankAccount();

      // Create user
      const user = new User({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        bankAccountNumber: bankAccount.accountNumber,
        iban: bankAccount.iban,
      });

      // Save user to get ID
      await user.save();

      // Generate transactions for this user
      console.log(`Generating transactions for ${userData.name}...`);
      const { finalBalance, transactionIds } = await generateTransactions(
        user._id,
        0
      );

      // Update user with transactions and final balance
      user.transactions = transactionIds;
      user.balance = finalBalance;
      await user.save();

      console.log(
        `Created user: ${userData.name} with ${transactionIds.length} transactions and final balance: ${finalBalance} NOK`
      );
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

// Run the seeding function
seedDatabase();
