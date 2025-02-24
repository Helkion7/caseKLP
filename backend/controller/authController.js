// controllers/authController.js
const User = require("../models/UserSchema");
const generateAccountNumber = require("../utils/generateAccountNumber");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    console.log("Registration attempt with data:", {
      ...req.body,
      password: "[HIDDEN]",
    });

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log("Missing required fields");
      return res
        .status(400)
        .json({ message: "Please provide name, email, and password" });
    }

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      console.log(
        "Existing user check:",
        existingUser ? "User exists" : "User does not exist"
      );

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
    } catch (error) {
      console.error("Error checking existing user:", error);
      return res.status(500).json({ message: "Error checking existing user" });
    }

    try {
      // Hash the password
      const saltRounds = parseInt(process.env.SALT_ROUNDS);
      console.log("Using salt rounds:", saltRounds);
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Generate bank account number
      const bankAccountNumber = generateAccountNumber();
      console.log("Generated bank account number:", bankAccountNumber);

      // Create the user object
      const userObject = {
        name,
        email,
        password: hashedPassword,
        bankAccountNumber,
        balance: 0,
      };
      console.log("Creating user with data:", {
        ...userObject,
        password: "[HIDDEN]",
      });

      // Create and save the user
      const newUser = new User(userObject);
      const savedUser = await newUser.save();
      console.log("User saved successfully:", {
        id: savedUser._id,
        email: savedUser.email,
        bankAccountNumber: savedUser.bankAccountNumber,
      });

      res.status(201).json({
        message: "User registered successfully",
        userId: savedUser._id,
        bankAccountNumber: savedUser.bankAccountNumber,
      });
    } catch (error) {
      console.error("Error saving user:", error);
      // MongoDB duplicate key error
      if (error.code === 11000) {
        return res.status(400).json({
          message: "Duplicate field value entered",
          field: Object.keys(error.keyPattern)[0],
        });
      }

      // Validation error
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({
          message: "Validation Error",
          errors: messages,
        });
      }

      res.status(500).json({
        message: "Server error during registration",
        error: error.message,
      });
    }
  } catch (error) {
    console.error("Registration error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    console.log("Login attempt for email:", req.body.email);

    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing login credentials");
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    try {
      // Find user by email
      const user = await User.findOne({ email });
      console.log("User found:", user ? "Yes" : "No");

      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      try {
        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", isMatch ? "Yes" : "No");

        if (!isMatch) {
          return res.status(400).json({ message: "Invalid email or password" });
        }

        try {
          // Generate a JWT token
          const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            {
              expiresIn: "1h", // Token valid for 1 hour
            }
          );

          console.log("Login successful for user:", user._id);
          res.json({ token, message: "Logged in successfully" });
        } catch (error) {
          console.error("Error generating JWT:", error);
          res
            .status(500)
            .json({ message: "Error generating authentication token" });
        }
      } catch (error) {
        console.error("Error comparing passwords:", error);
        res.status(500).json({ message: "Error verifying password" });
      }
    } catch (error) {
      console.error("Error finding user:", error);
      res.status(500).json({ message: "Error finding user" });
    }
  } catch (error) {
    console.error("Login error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: "Server error during login" });
  }
};
