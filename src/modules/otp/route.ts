import { Request, Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validateDTO } from '@/middleware';
import { resendOtp, verifyOtp } from './controller';
import { ResendOtpDto, VerifyOtpDto } from './dto';

const resendOtpLimiter = rateLimit({
  windowMs: 60 * 1000 /* ***** 1 minute ***** */,
  max: 1 /* ***** limit each IP to 1 request per windowMs ***** */,
  message: { message: 'Too many OTP resend requests. Please try again after 1 minute.' },
  standardHeaders: true /* ***** Return rate limit info in the `RateLimit-*` headers ***** */,
  legacyHeaders: false /* ***** Disable the `X-RateLimit-*` headers ***** */,
  keyGenerator: (req, res) => {
    const userId = req.body.userId || req.body.email || req.body.phone || 'anonymous';
    return `${userId}`;
  },
});

const router = Router();

router.post('/verify', validateDTO(VerifyOtpDto), verifyOtp);
router.post('/resend', resendOtpLimiter, validateDTO(ResendOtpDto), resendOtp);

export default router;
