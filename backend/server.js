const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const bankRoutes = require("./routes/bankRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

let corsOptions = {
  origin: process.env.ORIGIN,
  methods: "GET,PUT,POST,DELETE",
  credentials: true,
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many requests, please try again later.",
  },
});

app.use(limiter);

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/bank", bankRoutes);
app.use("/api/transactions", transactionRoutes);

app.get("/", (req, res) => {
  res.send(`Server running on port ${process.env.PORT}`);
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
