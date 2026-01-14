import { Router } from 'express';
import { signup, forgotPassword, resetPassword } from './controller';

const router = Router();
router.post('/signup', signup);
router.post('/reset-password', resetPassword);
router.post('/forgot-password', forgotPassword);

export default router;
