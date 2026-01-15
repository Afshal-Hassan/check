import { Router } from 'express';
import { save } from './controller';
import { validateDTO } from '@/middleware';
import { LifestylePreferenceDTO } from './dto';

const router = Router();

router.post('/', validateDTO(LifestylePreferenceDTO), save);

export default router;
