import rateLimit from "express-rate-limit";

export const sosRateLimiter = rateLimit({
  windowMs: 60_000, // 1 minute
  max: 5,
  message: { message: "Too many SOS requests. Please wait a moment." },
  standardHeaders: true,
  legacyHeaders: false,
});
