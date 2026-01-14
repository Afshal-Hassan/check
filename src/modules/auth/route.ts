import { Router } from 'express';
import { signup, save, forgotPassword, resetPassword } from './controller';

const router = Router();
router.post('/save', save);
router.post('/signup', signup);
router.post('/reset-password', resetPassword);
router.post('/forgot-password', forgotPassword);

export default router;
