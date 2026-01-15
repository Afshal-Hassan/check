import { Router } from 'express';
import { validateDTO } from '@/middleware';
import { PersonalDetailsDTO, UserProfileDTO } from './dto';
import { save, updatePersonalDetailsById } from './controller';

const router = Router();

router.post('/', validateDTO(UserProfileDTO), save);
router.patch('/personal-details', validateDTO(PersonalDetailsDTO), updatePersonalDetailsById);

export default router;
