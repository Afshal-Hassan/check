import { Router } from 'express';
import { validateDTO } from '@/middleware';
import { OnboardingDTO } from './dto';
import { onboarding, getUsers, uploadProfilePictures } from './controller';
import { upload } from '@/config/multer.config';

const router = Router();

router.get('/all', getUsers);
router.post('/onboarding', validateDTO(OnboardingDTO), onboarding);

/* Images Upload */
router.post(
  '/pictures/upload',
  upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  uploadProfilePictures,
);

export default router;
