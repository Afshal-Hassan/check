import { ENV } from './env.config';
import { S3Client } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
  region: ENV.AWS.S3.REGION,
  credentials: {
    accessKeyId: ENV.AWS.IAM.ACCESS_KEY_ID,
    secretAccessKey: ENV.AWS.IAM.SECRET_ACCESS_KEY,
  },
});
