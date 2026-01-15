import { Router } from 'express';
import { save } from './controller';
import { validateDTO } from '@/middleware';
import { DatingPreferenceDTO } from './dto';

const router = Router();

router.post('/', validateDTO(DatingPreferenceDTO), save);

export default router;
