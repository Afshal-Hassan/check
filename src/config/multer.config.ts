import crypto from 'crypto';
import multerS3 from 'multer-s3';
import { s3 } from './aws-s3.config';
import multer, { FileFilterCallback } from 'multer';
import { BadRequestException } from '@/exceptions/bad-request.exception';

export const upload = multer({
  storage: multerS3({
    s3,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    bucket: process.env.AWS_S3_BUCKET_NAME as string,
    key: (req: any, _: any, cb: any) => {
      const userId = req.user.userId;
      const key = `users/${userId}/images/${crypto.randomUUID()}`;
      cb(null, key);
    },
  }),

  fileFilter: (_, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new BadRequestException('Only image files are allowed for S3 upload'));
    }
  },

  limits: {
    // fileSize: 5 * 1024 * 1024 /* ***** 5 MB ***** */,
    files: 10,
  },
});

export const uploadMemory = multer({
  storage: multer.memoryStorage(),

  fileFilter: (req, file: any, cb: FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },

  limits: { fileSize: 5 * 1024 * 1024 } /* ***** 5 MB ***** */,
});
