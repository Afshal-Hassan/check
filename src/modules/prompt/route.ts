import { Router } from 'express';
import { getPrompts } from './controller';

const router = Router();

router.get('/all', getPrompts);

export default router;
