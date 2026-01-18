import { Router } from 'express';
import { OnboardingDTO } from './dto';
import { validateDTO } from '@/middleware';
import { upload, uploadMemory } from '@/config/multer.config';
import { onboarding, getUsersList, uploadProfilePictures, verifyUser } from './controller';

const router = Router();

router.get('/all', getUsersList);
router.post('/onboarding', validateDTO(OnboardingDTO), onboarding);
router.post(
  '/pictures/upload',
  upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  uploadProfilePictures,
);
router.post('/verify', uploadMemory.single('image'), verifyUser);

export default router;
