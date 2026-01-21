import rateLimit from 'express-rate-limit';

/* ***** RATE LIMITING ***** */

export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 1000 /* ***** 1 minute ***** */,
  max: 1 /* ***** limit each IP to 1 request per windowMs ***** */,
  message: { message: 'Too many Forgot Password requests. Please try again after 1 minute.' },
  standardHeaders: true /* ***** Return rate limit info in the `RateLimit-*` headers ***** */,
  legacyHeaders: false /* ***** Disable the `X-RateLimit-*` headers ***** */,
  keyGenerator: (req, res) => {
    const userId = req.body.userId || req.body.email || req.body.phone || 'anonymous';
    return `${userId}`;
  },
});
