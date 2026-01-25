import { Router } from 'express';
import { OnboardingDTO } from './dto';
import { validateDTO } from '@/middleware';
import { upload } from '@/config/multer.config';
import { deleteOldFilesFromS3 } from './middleware';
import { onboarding, getUserDetailsById, uploadProfilePictures, getUsers } from './controller';

const router = Router();

/* *****  GET  ***** */
router.get('/all', getUsers);
router.get('/details', getUserDetailsById);

/* *****  POST  ***** */
router.post('/onboarding', validateDTO(OnboardingDTO), onboarding);

/* *****  PUT  ***** */
/* Images Upload */
router.put(
  '/pictures/upload',
  deleteOldFilesFromS3,
  upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  uploadProfilePictures,
);

export default router;
