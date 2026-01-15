import { Router } from 'express';
import { validateDTO } from '@/middleware';
import { LifestylePreferenceDTO } from './dto';
import { saveLifestylePreference } from './controller';

const router = Router();

router.post('/', validateDTO(LifestylePreferenceDTO), saveLifestylePreference);

export default router;
