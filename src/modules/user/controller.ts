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

    // Step 1: Detect face and get detailed attributes
    const detectCommand = new DetectFacesCommand({
      Image: { Bytes: verificationImageBuffer },
      Attributes: ['ALL'],
    });

    const detectResponse = await rekognitionClient.send(detectCommand);

    if (!detectResponse.FaceDetails || detectResponse.FaceDetails.length === 0) {
      return res.status(400).json({
        error: 'No valid face detected',
      });
    }

    const faceDetails = detectResponse.FaceDetails[0];

    // ANTI-SPOOFING CHECKS

    // Check 1: Face detection confidence
    if (faceDetails.Confidence && faceDetails.Confidence < 95) {
      return res.status(400).json({
        error: 'Face detection confidence too low - please try again',
        confidence: faceDetails.Confidence,
      });
    }

    // Check 2: Image quality (Sharpness & Brightness)
    if (faceDetails.Quality) {
      const { Sharpness, Brightness } = faceDetails.Quality;

      // Low sharpness = photo of a photo or screen
      if (Sharpness && Sharpness < 40) {
        return res.status(400).json({
          error: 'Image quality too low - appears to be photo of a photo or screen',
          sharpness: Sharpness,
          hint: 'Use a real camera to take a live photo',
        });
      }

      // Too sharp = professional print or high-res screen
      if (Sharpness && Sharpness > 95) {
        return res.status(400).json({
          error: 'Image quality appears artificially enhanced',
          sharpness: Sharpness,
        });
      }

      // Check brightness range
      if (Brightness && (Brightness < 25 || Brightness > 95)) {
        return res.status(400).json({
          error: 'Poor lighting conditions detected',
          brightness: Brightness,
          hint: 'Please ensure good lighting',
        });
      }
    }

    // Check 3: Eyes must be open (closed eyes = static photo)
    if (faceDetails.EyesOpen) {
      const { Value, Confidence } = faceDetails.EyesOpen;
      if (Value === false && Confidence && Confidence > 90) {
        return res.status(400).json({
          error: 'Eyes appear to be closed - please keep eyes open',
        });
      }
    }

    // Check 4: No sunglasses
    if (faceDetails.Sunglasses && faceDetails.Sunglasses.Value === true) {
      return res.status(400).json({
        error: 'Please remove sunglasses for verification',
      });
    }

    // Check 5: Face should be relatively frontal
    if (faceDetails.Pose) {
      const { Yaw, Pitch, Roll } = faceDetails.Pose;

      // Extreme angles suggest holding a photo
      if (Yaw && Math.abs(Yaw) > 35) {
        return res.status(400).json({
          error: 'Please face the camera directly',
          yaw: Yaw,
          hint: 'Turn your face towards the camera',
        });
      }

      if (Pitch && Math.abs(Pitch) > 35) {
        return res.status(400).json({
          error: 'Please hold the camera at eye level',
          pitch: Pitch,
          hint: 'Adjust camera angle',
        });
      }

      // Excessive roll indicates photo might be tilted
      if (Roll && Math.abs(Roll) > 20) {
        return res.status(400).json({
          error: 'Please hold the device steady and upright',
          roll: Roll,
        });
      }
    }

    // Check 6: Verify natural emotions are detected
    // Real faces show micro-expressions, photos are frozen
    if (faceDetails.Emotions && faceDetails.Emotions.length > 0) {
      const topEmotions = faceDetails.Emotions.slice(0, 2);
      const hasStrongEmotion = topEmotions.some((e) => e.Confidence && e.Confidence > 60);

      if (!hasStrongEmotion) {
        return res.status(400).json({
          error: 'Could not detect natural facial expression - possible static image',
          hint: 'Please ensure you are taking a live photo',
        });
      }
    }

    // Check 7: Face occlusion check
    if (faceDetails.FaceOccluded && faceDetails.FaceOccluded.Value === true) {
      return res.status(400).json({
        error: 'Face appears to be partially covered',
        hint: 'Ensure your entire face is visible',
      });
    }

    // Check 8: Mouth open detection (helpful for liveness)
    // If mouth is slightly open, more likely to be live
    if (faceDetails.MouthOpen) {
      const { Value, Confidence } = faceDetails.MouthOpen;

      // This is optional - you can use this for additional verification
      // Store this info for pattern analysis
      console.log('Mouth open:', Value, 'Confidence:', Confidence);
    }

    // ALL CHECKS PASSED - Proceed with face comparison

    // Step 2: Get stored profile image
    const sourceImageKey =
      'users/0e8f7914-110b-415c-bab6-297e8c361ec6/images/8b2e9783-0c22-44b5-89c8-cabbd554d0d4';

    const sourceImageBuffer = await s3ObjectToBuffer(
      process.env.AWS_S3_BUCKET_NAME!,
      sourceImageKey,
    );

    // Step 3: Compare faces
    const compareCommand = new CompareFacesCommand({
      SourceImage: { Bytes: sourceImageBuffer },
      TargetImage: { Bytes: verificationImageBuffer },
      SimilarityThreshold: 85, // Increased for better security
      QualityFilter: 'HIGH',
    });

    const compareResponse = await rekognitionClient.send(compareCommand);

    if (compareResponse.FaceMatches && compareResponse.FaceMatches.length > 0) {
      const similarity = compareResponse.FaceMatches[0].Similarity;

      res.status(200).json({
        success: true,
        message: 'User verified successfully',
        similarity: similarity,
        verificationDetails: {
          faceConfidence: faceDetails.Confidence,
          sharpness: faceDetails.Quality?.Sharpness,
          brightness: faceDetails.Quality?.Brightness,
          eyesOpen: faceDetails.EyesOpen?.Value,
          livenessChecks: 'passed',
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Face verification failed - face does not match profile',
        hint: 'Please ensure you are the registered user',
      });
    }
  } catch (err: any) {
    console.error('Error in verification:', err);
    res.status(500).json({ error: err.message });
  }
};
