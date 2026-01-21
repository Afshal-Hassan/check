import { Router } from 'express';
import { validateDTO } from '@/middleware';
import { CompleteSignupDto, ForgotPasswordDto, LoginDto, ResetPasswordDto, SignupDto } from './dto';
import { signup, forgotPassword, resetPassword, completeSignup, login } from './controller';
import { forgotPasswordLimiter } from './middleware';

const router = Router();

router.post('/signup', validateDTO(SignupDto), signup);
router.post('/complete-signup', validateDTO(CompleteSignupDto), completeSignup);
router.post('/login', validateDTO(LoginDto), login);
router.post(
  '/forgot-password',
  forgotPasswordLimiter,
  validateDTO(ForgotPasswordDto),
  forgotPassword,
);
router.post('/reset-password', validateDTO(ResetPasswordDto), resetPassword);

export default router;
