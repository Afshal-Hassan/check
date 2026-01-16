import { Router } from 'express';
import { UserPromptDTO } from './dto';
import { validateDTO } from '@/middleware';
import { saveUserPrompt } from './controller';

const router = Router();

router.post('/', validateDTO(UserPromptDTO), saveUserPrompt);

export default router;
