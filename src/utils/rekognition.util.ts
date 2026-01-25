import { IndexFacesCommand, SearchFacesByImageCommand } from '@aws-sdk/client-rekognition';
import { rekognitionClient } from '@/config/aws-rekognition.config';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '@/config/aws-s3.config';
import { Readable } from 'stream';
import { ENV } from '@/config/env.config';

export const s3ObjectToBuffer = async (key: string): Promise<Buffer> => {
  const { Body } = await s3.send(
    new GetObjectCommand({ Bucket: ENV.AWS.S3.BUCKET_NAME!, Key: key }),
  );

  if (Body instanceof Readable) {
    const chunks: Buffer[] = [];
    for await (const chunk of Body) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  } else if (Body instanceof Uint8Array) {
    return Buffer.from(Body);
  } else if (Buffer.isBuffer(Body)) {
    return Body;
  } else {
    throw new Error('Unsupported S3 object Body type');
  }
};

export const indexFaces = async (key: string, userId: string) => {
  try {
    const imageBuffer = await s3ObjectToBuffer(key);

    const command = new IndexFacesCommand({
      CollectionId: ENV.AWS.REKOGNITION.COLLECTION_ID!,
      Image: {
        Bytes: imageBuffer,
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

export const searchUsersWithSimilarFaces = async (userId: string, s3Key: string) => {
  try {
    const imageBuffer = await s3ObjectToBuffer(s3Key);
    const maxFaces = 10;

    const command = new SearchFacesByImageCommand({
      CollectionId: ENV.AWS.REKOGNITION.COLLECTION_ID!,
      Image: {
        Bytes: imageBuffer,
      },
      MaxFaces: maxFaces,
      FaceMatchThreshold: 0, // Minimum similarity threshold (10-100)
    });

    const response = await rekognitionClient.send(command);

    // Results are already sorted by similarity in descending order by AWS Rekognition
    return (
      response.FaceMatches?.filter(
        (match) => match.Face?.ExternalImageId && match.Face.ExternalImageId !== userId,
      )?.map((match) => ({
        userId: match.Face?.ExternalImageId,
        faceId: match.Face?.FaceId,
        similarity: match.Similarity,
        confidence: match.Face?.Confidence,
      })) || []
    );
  } catch (err) {
    console.error('Error searching face by image:', err);
    throw err;
  }
};
