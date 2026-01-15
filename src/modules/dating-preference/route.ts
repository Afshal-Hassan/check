import { Router } from 'express';
import { validateDTO } from '@/middleware';
import { DatingPreferenceDTO } from './dto';
import { saveDatingPreference } from './controller';

const router = Router();

router.post('/', validateDTO(DatingPreferenceDTO), saveDatingPreference);

export default router;
