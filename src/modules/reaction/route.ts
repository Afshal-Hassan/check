import { Router } from 'express';
import { SaveLikeDto } from './dto';
import { validateDTO } from '@/middleware';
import { saveDislike, saveLike } from './controller';

const router = Router();

router.post('/like', validateDTO(SaveLikeDto), saveLike);
router.post('/dislike', validateDTO(SaveLikeDto), saveDislike);

export default router;
