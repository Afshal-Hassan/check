import { Router } from 'express';
import { CreateLivenessSessionDto, OnboardingDTO } from './dto';
import { validateDTO } from '@/middleware';
import { upload } from '@/config/multer.config';
import { deleteOldFilesFromS3 } from './middleware';
import {
  onboarding,
  getUserDetailsById,
  uploadProfilePictures,
  getUsers,
  getUsersWithSimilarFaces,
  createLivenessSession,
  getLivenessSession,
} from './controller';

const router = Router();

/* *****  GET  ***** */
router.get('/all', getUsers);
router.get('/details', getUserDetailsById);
router.get('/similar-faces', getUsersWithSimilarFaces);

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

/* *****  VERIFICATION  ***** */

router.post('/create-session', validateDTO(CreateLivenessSessionDto), createLivenessSession);
router.get('/session/:sessionId', getLivenessSession);
export default router;
