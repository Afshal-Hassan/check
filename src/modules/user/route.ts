import { Router } from 'express';
import { validateDTO } from '@/middleware';
import { OnboardingDTO } from './dto';
import { onboarding, getUsersList } from './controller';

const router = Router();

router.get('/all', getUsersList);
router.post('/onboarding', validateDTO(OnboardingDTO), onboarding);

export default router;
