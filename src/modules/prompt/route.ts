import { Router } from 'express';
import { PromptDTO } from './dto';
import { validateDTO } from '@/middleware';
import { savePrompts } from './controller';

const router = Router();

router.post('/', validateDTO(PromptDTO), savePrompts);

export default router;
