const User = require("../models/UserSchema.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createJWT = require("../utils/createJWT");
const createCookie = require("../utils/createCookie.js");
const { generateNorwegianBankAccount } = require("../utils/bankAccountUtil.js");

const saltRounds = parseInt(process.env.SALT);

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          msg: "Email and password are required",
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          msg: "Invalid email format",
        });
      }

      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(401).json({
          msg: "Invalid credentials",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          msg: "Invalid credentials",
        });
      }

      const jwtToken = await createJWT(email, user.role);
      createCookie(res, jwtToken);

      const userResponse = user.toObject();
      delete userResponse.password;

      return res.status(201).json({
        msg: "Login successful. Redirecting to Account...",
        success: true,
      });
    } catch (error) {
      console.error("Error in login:", error);
      return res.status(500).json({
        msg: "Error during login",
        error: error.message,
      });
    }
  },

  register: async (req, res) => {
    try {
      const { name, email, password, repeatPassword } = req.body;
      if (!email || !password || !repeatPassword) {
        return res.status(400).json({
          msg: "All fields are required",
        });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          msg: "Invalid email format",
        });
      }
      if (password.length < 8) {
        return res.status(400).json({
          msg: "Password must be at least 8 characters long",
        });
      }
      if (password !== repeatPassword) {
        return res.status(400).json({
          msg: "Passwords do not match",
        });
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          msg: "Email already registered",
        });
      }
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const bankAccount = generateNorwegianBankAccount();

      const user = new User({
        name,
        email,
        password: hashedPassword,
        role: "user",
        bankAccountNumber: bankAccount.accountNumber,
        iban: bankAccount.iban,
      });

      await user.save();

      return res.status(201).json({
        msg: "Registration successful. Redirecting to login...",
        success: true,
      });
    } catch (error) {
      console.error("Error in register:", error);
      if (error.name === "ValidationError") {
        return res.status(400).json({
          msg: "Validation error",
          error: error.message,
        });
      }
      return res.status(500).json({
        msg: "Error during registration",
        error: error.message,
      });
    }
  },
};

module.exports = authController;
