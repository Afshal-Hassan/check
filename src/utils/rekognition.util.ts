import { Readable } from 'stream';
import { ENV } from '@/config/env.config';
import { s3 } from '@/config/aws-s3.config';
import * as MessageUtil from '@/utils/message.util';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import {
  CompareFacesCommand,
  CompareFacesCommandOutput,
  DetectFacesCommand,
  IndexFacesCommand,
  SearchFacesByImageCommand,
} from '@aws-sdk/client-rekognition';
import { rekognitionClient } from '@/config/aws-rekognition.config';

const s3ObjectToBuffer = async (key: string): Promise<Buffer> => {
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

const normalizeImageToBuffer = async (image: Buffer | string): Promise<Buffer> => {
  if (Buffer.isBuffer(image)) {
    return image;
  }

  if (typeof image === 'string') {
    return s3ObjectToBuffer(image);
  }

  throw new Error('Invalid image input: expected Buffer or S3 key');
};

const indexFacesFromBuffer = async (userId: string, imageBuffer: Buffer, languageCode: string) => {
  try {
    const command = new IndexFacesCommand({
      CollectionId: ENV.AWS.REKOGNITION.COLLECTION_ID!,
      Image: {
        Bytes: imageBuffer,
      },
      ExternalImageId: userId,
      DetectionAttributes: ['DEFAULT'],
      MaxFaces: 1,
      QualityFilter: 'HIGH',
    });

    const response = await rekognitionClient.send(command);

    if (!response.FaceRecords || response.FaceRecords.length === 0) {
      throw new Error(
        MessageUtil.getLocalizedMessage(USER_ERROR_MESSAGES.NO_FACE_DETECTED, languageCode),
      );
    }

    return response.FaceRecords;
  } catch (err: any) {
    throw err;
  }
};

const indexFaces = async (userId: string, key: string, languageCode: string) => {
  try {
    const imageBuffer = await s3ObjectToBuffer(key);
    return indexFacesFromBuffer(userId, imageBuffer, languageCode);
  } catch (err) {
    throw err;
  }
};

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/* -----------------------------------------------------
 * Pagination helper
 * --------------------------------------------------- */

const paginate = <T>(items: T[], page: number, pageSize: number): PaginatedResult<T> => {
  const safePage = Math.max(page, 1);
  const safePageSize = Math.max(pageSize, 1);

  const start = (safePage - 1) * safePageSize;
  const end = start + safePageSize;

  return {
    data: items.slice(start, end),
    page: safePage,
    pageSize: safePageSize,
    total: items.length,
    totalPages: Math.ceil(items.length / safePageSize),
  };
};

import { ListFacesCommand } from '@aws-sdk/client-rekognition';
import { USER_ERROR_MESSAGES } from '@/modules/user/message';
import { BadRequestException } from '@/exceptions';

export const getAllOtherRemainingUsersInCollection = async (
  userId: string,
  excludeUserIds: string[] = [],
) => {
  try {
    const allFaces: any[] = [];
    let nextToken: string | undefined;

    do {
      const command = new ListFacesCommand({
        CollectionId: ENV.AWS.REKOGNITION.COLLECTION_ID!,
        MaxResults: 100,
        NextToken: nextToken,
      });

      const response = await rekognitionClient.send(command);

      if (response.Faces) {
        allFaces.push(...response.Faces);
      }

      nextToken = response.NextToken;
    } while (nextToken);

    const excludeSet = new Set([userId, ...excludeUserIds]);

    return allFaces
      .filter((face) => face.ExternalImageId && !excludeSet.has(face.ExternalImageId))
      .map((face) => ({
        userId: face.ExternalImageId,
        faceId: face.FaceId,
        confidence: face.Confidence,
      }));
  } catch (err) {
    console.error('Error listing faces:', err);
    throw err;
  }
};

export const searchUsersWithSimilarFaces = async (userId: string, key: string) => {
  try {
    const imageBuffer = await s3ObjectToBuffer(key);
    const maxFaces = 4096;

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
        (match: any) => match.Face?.ExternalImageId && match.Face.ExternalImageId !== userId,
      )?.map((match: any) => ({
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

export const detectFace = async (image: Buffer | string) => {
  const imageBuffer = await normalizeImageToBuffer(image);

  const detectCommand = new DetectFacesCommand({
    Image: { Bytes: imageBuffer },
    Attributes: ['ALL'],
  });

  return rekognitionClient.send(detectCommand);

  // const faceDetails = detectResponse.FaceDetails[0];

  // if (faceDetails.Quality) {
  //   const { Sharpness } = faceDetails.Quality;

  //   if (Sharpness && Sharpness < 50) {
  //     throw new BadRequestException(
  //       'Image appears to be a spoofed picture or picture quality too low',
  //     );
  //   }
  // }
};

export const compareFace = async (
  {
    userId,
    sourceImageKey,
    verificationImageBuffer,
  }: { userId: string; sourceImageKey: string; verificationImageBuffer: Buffer },
  languageCode: string,
): Promise<CompareFacesCommandOutput> => {
  const sourceImageBuffer = await s3ObjectToBuffer(sourceImageKey);

  const command = new CompareFacesCommand({
    SourceImage: { Bytes: sourceImageBuffer },
    TargetImage: { Bytes: verificationImageBuffer },
    SimilarityThreshold: 90,
    QualityFilter: 'HIGH',
  });

  const response = await rekognitionClient.send(command);

  if (!response.FaceMatches || response.FaceMatches.length === 0) {
    throw new BadRequestException(
      MessageUtil.getLocalizedMessage(USER_ERROR_MESSAGES.USER_VERIFICATION_FAILED, languageCode),
    );
  }

  await indexFacesFromBuffer(userId, verificationImageBuffer, languageCode);

  return response;
};
