import { Router } from 'express';
import { verifyOtp } from './controller';

const router = Router();
router.post('/verify', verifyOtp);

export default router;
