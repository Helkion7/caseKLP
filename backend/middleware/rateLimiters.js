const rateLimit = require("express-rate-limit");

/**
 * Rate limiter for authentication routes (login/register)
 *
 * Configuration:
 * - 15 minute window (15 * 60 * 1000 ms)
 * - Maximum 5 requests per window
 * - Does not skip failed attempts (counts both successful and failed requests)
 *
 * Purpose:
 * Prevents brute force attacks on authentication endpoints by limiting
 * the number of login/registration attempts from the same IP address
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
  max: 5, // 5 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 429,
    message: "Too many login attempts, please try again after 15 minutes",
  },
  skipSuccessfulRequests: false, // Count successful requests toward the limit
});

/**
 * General API rate limiter for standard endpoints
 *
 * Configuration:
 * - 1 minute window (60 * 1000 ms)
 * - Maximum 20 requests per window
 *
 * Purpose:
 * Prevents API abuse and DoS attacks by limiting the overall
 * number of requests from the same IP address
 */
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute in milliseconds
  max: 20, // 20 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 429,
    message: "Too many requests, please try again later",
  },
});

/**
 * Strict rate limiter for withdrawal operations
 *
 * Configuration:
 * - 1 hour window (60 * 60 * 1000 ms)
 * - Maximum 10 withdrawal requests per window
 *
 * Purpose:
 * Adds additional protection for sensitive financial operations
 * to prevent potential fraud or automated withdrawal attempts
 */
const withdrawLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
  max: 10, // 10 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 429,
    message:
      "For security reasons, withdrawal attempts are limited. Please try again later.",
  },
});

module.exports = {
  authLimiter,
  apiLimiter,
  withdrawLimiter,
};
