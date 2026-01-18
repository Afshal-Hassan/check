import { rekognitionClient } from '@/config/aws-rekognition.config';
import * as UserService from './service';
import { Request, Response } from 'express';
import {
  CompareFacesCommand,
  DetectFacesCommand,
  QualityFilter,
} from '@aws-sdk/client-rekognition';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '@/config/aws-s3.config';
import { Readable } from 'stream';

export const getUsersList = async (req: Request, res: Response) => {
  try {
    const { isVerified, isSuspended } = req.query;

    const users = await UserService.getUsersList(isVerified === 'true', isSuspended === 'true');

    res.status(200).json(users);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const onboarding = async (req: Request, res: Response) => {
  try {
    const result = await UserService.completeOnboarding(req.body);

    res.status(201).json({
      message: 'User onboarding complete successfully.',
      result,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const uploadProfilePictures = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.MulterS3.File[] | undefined;
    const result = await UserService.uploadProfilePictures(files);

    res.status(200).json({
      message: 'User images uploaded successfully.',
      result,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Helper to convert ReadableStream to Buffer
export const s3ObjectToBuffer = async (bucket: string, key: string): Promise<Buffer> => {
  const { Body } = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));

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

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const file = req.file as Express.Multer.File | undefined;
    if (!file) return res.status(400).json({ error: 'No verification image uploaded' });

    const verificationImageBuffer = file.buffer;

    // Step 1: Check for face quality and liveness indicators
    const detectCommand = new DetectFacesCommand({
      Image: { Bytes: verificationImageBuffer },
      Attributes: ['ALL'],
    });

    const detectResponse = await rekognitionClient.send(detectCommand);

    if (!detectResponse.FaceDetails || detectResponse.FaceDetails.length === 0) {
      return res.status(400).json({
        error: 'No valid face detected or image quality too low',
      });
    }

    const faceDetails = detectResponse.FaceDetails[0];

    console.log(faceDetails);

    // Check quality indicators
    if (faceDetails.Quality) {
      const { Sharpness } = faceDetails.Quality;

      // Low sharpness often indicates a photo of a photo
      if (Sharpness && Sharpness < 50) {
        return res.status(400).json({
          error: 'Image appears to be a photo of a photo or screen',
        });
      }
    }

    // Step 2: Proceed with face comparison
    const sourceImageKey =
      '/users/0e8f7914-110b-415c-bab6-297e8c361ec6/images/8b2e9783-0c22-44b5-89c8-cabbd554d0d4';
    const sourceImageBuffer = await s3ObjectToBuffer(
      process.env.AWS_S3_BUCKET_NAME!,
      sourceImageKey,
    );

    const compareCommand = new CompareFacesCommand({
      SourceImage: { Bytes: sourceImageBuffer },
      TargetImage: { Bytes: verificationImageBuffer },
      SimilarityThreshold: 80, // Increased threshold for better security
      QualityFilter: 'HIGH',
    });

    const compareResponse = await rekognitionClient.send(compareCommand);

    if (compareResponse.FaceMatches && compareResponse.FaceMatches.length > 0) {
      res.status(200).json({
        message: 'User verified successfully',
        similarity: compareResponse.FaceMatches[0].Similarity,
      });
    } else {
      res.status(401).json({ message: 'User verification failed' });
    }
  } catch (err: any) {
    console.error('Error in verification:', err);
    res.status(500).json({ error: err.message });
  }
};
