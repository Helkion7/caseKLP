const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema.js");
require("dotenv").config();

/**
 * Middleware to verify JWT authentication token
 *
 * Process:
 * 1. Extract JWT from cookies
 * 2. Verify token signature and expiration
 * 3. Extract user email from decoded token
 * 4. Find user in database to confirm existence
 * 5. Add user ID to request object for downstream handlers
 * 6. Pass control to the next middleware/route handler
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
async function verifyJwt(req, res, next) {
  // Extract JWT from cookies
  const jsonwebtoken = req.cookies.jwt;

  // Verify the token using the secret key from environment variables
  await jwt.verify(
    jsonwebtoken,
    process.env.SECRET_KEY,
    async (err, decoded) => {
      // Handle verification errors (expired token, invalid signature, etc.)
      if (err) {
        console.log(err);
        return res.status(401).send({ msg: "user not authenticated" });
      }

      // Log decoded token payload for debugging
      console.log(decoded);

      // Extract email from token
      let email = decoded.email;

      // Add decoded user info to request object
      req.user = decoded;

      try {
        // Find user in database to confirm they exist
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).send({ msg: "User not found" });
        }

        // Add user ID to request object for downstream handlers
        req.user.id = user._id;

        // Continue to the next middleware/route handler
        next();
      } catch (error) {
        // Handle database errors
        console.log(error);
        res.status(500).send({ msg: "Server error" });
      }
    }
  );
}

module.exports = verifyJwt;
