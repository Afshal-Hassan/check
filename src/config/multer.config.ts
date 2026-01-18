import crypto from 'crypto';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { s3 } from './aws-s3.config';

export const upload = multer({
  storage: multerS3({
    s3,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    bucket: process.env.AWS_S3_BUCKET_NAME as string,

    key: (req: any, _: any, cb: any) => {
      const userId = req.body.userId;
      const key = `users/${userId}/images/${crypto.randomUUID()}`;
      cb(null, key);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 /* ***** 5 MB ***** */,
    files: 10,
  },
});

export const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});
