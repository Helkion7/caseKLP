const User = require("../models/UserSchema.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createJWT = require("../utils/createJWT");
const createCookie = require("../utils/createCookie.js");

// Move environment variables to top for better visibility
const saltRounds = parseInt(process.env.SALT); // Added fallback

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Input validation
      if (!email || !password) {
        return res.status(400).json({
          msg: "Email and password are required",
        });
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          msg: "Invalid email format",
        });
      }

      // Find user and handle non-existent user
      const user = await User.findOne({ email }).select("+password"); // Explicitly select password field if it's protected
      if (!user) {
        return res.status(401).json({
          msg: "Invalid credentials",
        });
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          msg: "Invalid credentials",
        });
      }

      // Generate token and set cookie
      const role = user.role || "user";
      const jwtToken = await createJWT(email, role);
      createCookie(res, jwtToken);

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      return res.status(200).json({
        msg: "Login successful",
        user: userResponse,
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
      const { email, password, repeatPassword } = req.body;

      console.log("REGISTER", req.body);
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

      // Password match validation
      if (password !== repeatPassword) {
        return res.status(400).json({
          msg: "Passwords do not match",
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          msg: "Email already registered",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user
      const user = new User({
        email,
        password: hashedPassword,
        role: "user",
      });

      // Save user
      await user.save();

      // Generate token and set cookie
      const jwtToken = await createJWT(email, "user");
      await createCookie(res, jwtToken);

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      return res.status(201).json({
        msg: "Registration successful",
        user: userResponse,
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

  // Optional: Add logout method
  logout: async (req, res) => {
    try {
      res.clearCookie("jwt"); // Assuming 'jwt' is your cookie name
      return res.status(200).json({
        msg: "Logout successful",
      });
    } catch (error) {
      console.error("Error in logout:", error);
      return res.status(500).json({
        msg: "Error during logout",
        error: error.message,
      });
    }
  },
};

module.exports = authController;
