import { ENV } from './env.config';
import { RekognitionClient } from '@aws-sdk/client-rekognition';

export const rekognitionClient = new RekognitionClient({
  region: ENV.AWS.REKOGNITION.REGION,
  credentials: {
    accessKeyId: ENV.AWS.IAM.ACCESS_KEY_ID,
    secretAccessKey: ENV.AWS.IAM.SECRET_ACCESS_KEY,
  },
});
