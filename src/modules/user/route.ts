import { Router } from 'express';
import { CreateLivenessSessionDto, OnboardingDTO } from './dto';
import { validateDTO } from '@/middleware';
import { upload, uploadMemory } from '@/config/multer.config';
import { deleteOldFilesFromS3 } from './middleware';
import {
  onboarding,
  getUserDetailsById,
  uploadProfilePictures,
  getUsers,
  getUsersWithSimilarFaces,
  createLivenessSession,
  getLivenessSession,
  verifyUser,
} from './controller';
import { asyncHandler } from '@/constants';

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
router.post('/verify', uploadMemory.single('image'), verifyUser);
router.post('/create-session', asyncHandler(createLivenessSession));
router.get('/session/:sessionId', getLivenessSession);

export default router;
