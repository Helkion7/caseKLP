const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bankAccountNumber: { type: String },
  iban: { type: String },
  balance: {
    type: Number,
    default: 0,
  },
  accountType: {
    type: String,
    enum: ["checking", "savings"],
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
