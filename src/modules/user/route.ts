import { UserDTO } from './dto';
import { Router } from 'express';
import { validateDTO } from '@/middleware';
import { updateUserLocation } from './controller';

const router = Router();

router.patch('/location', validateDTO(UserDTO), updateUserLocation);

export default router;
