import { Router } from 'express';
import { validateDTO } from '@/middleware';
import { PersonalDetailsDTO } from './dto';
import { updatePersonalDetails } from './controller';

const router = Router();

router.patch('/personal-details', validateDTO(PersonalDetailsDTO), updatePersonalDetails);

export default router;
