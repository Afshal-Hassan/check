import { UserDTO } from './dto';
import { Router } from 'express';
import { validateDTO } from '@/middleware';
import { updateUserLocationById } from './controller';

const router = Router();

router.patch('/location', validateDTO(UserDTO), updateUserLocationById);

export default router;
