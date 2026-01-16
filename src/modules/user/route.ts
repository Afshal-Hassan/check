import { UserDTO } from './dto';
import { Router } from 'express';
import { validateDTO } from '@/middleware';
import { getUsersList, updateUserLocation } from './controller';

const router = Router();

router.get('/all', getUsersList);
router.patch('/location', validateDTO(UserDTO), updateUserLocation);

export default router;
