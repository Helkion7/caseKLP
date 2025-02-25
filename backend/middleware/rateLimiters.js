const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many login attempts, please try again after 15 minutes",
  },
  skipSuccessfulRequests: false,
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many requests, please try again later",
  },
});

const withdrawLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
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
