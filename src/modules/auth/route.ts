import { Router } from 'express';
import { validateDTO } from '@/middleware';
import { CompleteSignupDto, ForgotPasswordDto, LoginDto, ResetPasswordDto, SignupDto } from './dto';
import { signup, forgotPassword, resetPassword, completeSignup, login } from './controller';

const router = Router();

router.post('/signup', validateDTO(SignupDto), signup);
router.post('/complete-signup', validateDTO(CompleteSignupDto), completeSignup);
router.post('/login', validateDTO(LoginDto), login);
router.post('/reset-password', validateDTO(ResetPasswordDto), resetPassword);
router.post('/forgot-password', validateDTO(ForgotPasswordDto), forgotPassword);

export default router;
