import { s3 } from '@/config/aws-s3.config';
import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';

export class S3Util {
  private static s3Client = s3;
  private static bucketName = process.env.AWS_S3_BUCKET_NAME as string;

  /**
   * Delete a single file from S3
   */
  static async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      console.log(`File deleted successfully: ${key}`);
    } catch (error) {
      console.error(`Error deleting file ${key}:`, error);
      throw error;
    }
  }

  /**
   * Delete all files in a folder (prefix)
   */
  static async deleteFolder(prefix: string): Promise<void> {
    try {
      // List all objects with the given prefix
      const listCommand = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: prefix,
      });

      const listedObjects = await this.s3Client.send(listCommand);

      if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
        console.log(`No objects found with prefix: ${prefix}`);
        return;
      }

      // Prepare objects for deletion
      const deleteParams = {
        Bucket: this.bucketName,
        Delete: {
          Objects: listedObjects.Contents.map((object) => ({ Key: object.Key })),
        },
      };

      // Delete all objects
      const deleteCommand = new DeleteObjectsCommand(deleteParams);
      await this.s3Client.send(deleteCommand);

      console.log(`Deleted ${listedObjects.Contents.length} objects from folder: ${prefix}`);

      // If there are more objects (pagination), recursively delete
      if (listedObjects.IsTruncated) {
        await this.deleteFolder(prefix);
      }
    } catch (error) {
      console.error(`Error deleting folder ${prefix}:`, error);
      throw error;
    }
  }

  /**
   * Delete multiple specific files
   */
  static async deleteMultipleFiles(keys: string[]): Promise<void> {
    if (keys.length === 0) return;

    try {
      const deleteParams = {
        Bucket: this.bucketName,
        Delete: {
          Objects: keys.map((key) => ({ Key: key })),
        },
      };

      const command = new DeleteObjectsCommand(deleteParams);
      await this.s3Client.send(command);

      console.log(`Deleted ${keys.length} files successfully`);
    } catch (error) {
      console.error('Error deleting multiple files:', error);
      throw error;
    }
  }
}
