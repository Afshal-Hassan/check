import { Router } from 'express';
import { save } from './controller';
import { InterestDTO } from './dto';
import { validateDTO } from '@/middleware';

const router = Router();

router.post('/', validateDTO(InterestDTO), save);

export default router;
