import { Router } from 'express';
import { validateDTO } from '@/middleware';
import { OnboardingDTO } from './dto';
import { onboarding, getUsers } from './controller';

const router = Router();

router.get('/all', getUsers);
router.post('/onboarding', validateDTO(OnboardingDTO), onboarding);

export default router;
