const rateLimit = require("express-rate-limit");

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
