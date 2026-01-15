import { Router } from 'express';
import { validateDTO } from '@/middleware';
import { PersonalDetailsDTO, UserProfileDTO } from './dto';
import { saveUserProfile, updatePersonalDetails } from './controller';

const router = Router();

router.post('/', validateDTO(UserProfileDTO), saveUserProfile);
router.patch('/personal-details', validateDTO(PersonalDetailsDTO), updatePersonalDetails);

export default router;
