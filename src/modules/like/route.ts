import { Router } from 'express';
import { SaveLikeDto } from './dto';
import { validateDTO } from '@/middleware';
import { saveUserLike } from './controller';

const router = Router();

router.post('/', validateDTO(SaveLikeDto), saveUserLike);

export default router;
