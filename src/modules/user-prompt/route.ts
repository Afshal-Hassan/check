import { Router } from 'express';
import { SavePromptDTO } from './dto';
import { validateDTO } from '@/middleware';
import { saveUserPrompts } from './controller';

const router = Router();

router.post('/', validateDTO(SavePromptDTO), saveUserPrompts);

export default router;
