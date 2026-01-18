import { IndexFacesCommand } from '@aws-sdk/client-rekognition';
import { rekognitionClient } from '@/config/aws-rekognition.config';

export const indexFaces = async (key: string, userId: string) => {
  try {
    const command = new IndexFacesCommand({
      CollectionId: process.env.AWS_REKOGNITION_COLLECTION_ID!,
      Image: {
        S3Object: { Bucket: process.env.AWS_S3_BUCKET_NAME, Name: key },
      },
      ExternalImageId: userId,
      DetectionAttributes: ['DEFAULT'],
    });

    const response = await rekognitionClient.send(command);
    return response.FaceRecords;
  } catch (err) {
    console.error('Error indexing face:', err);
    throw err;
  }
};
