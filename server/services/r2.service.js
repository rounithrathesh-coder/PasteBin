import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { config, isServiceConfigured } from '../config/env.js';

/**
 * Cloudflare R2 Object Storage Service
 * Integration for: File Attachments, Exported Snippets Archive, and Backup Files
 * Uses AWS S3 Compatible Protocol Client
 */
let s3Client = null;

if (isServiceConfigured('r2')) {
  try {
    s3Client = new S3Client({
      region: 'auto',
      endpoint: config.r2Endpoint,
      credentials: {
        accessKeyId: config.r2AccessKeyId,
        secretAccessKey: config.r2SecretAccessKey
      }
    });
    console.log('⚡ Cloudflare R2 S3 Storage Client initialized successfully');
  } catch (err) {
    console.error('R2 initialization error:', err.message);
  }
}

export class R2StorageService {
  /**
   * Upload file to Cloudflare R2 bucket
   */
  static async uploadFile(fileBuffer, fileName, contentType = 'application/octet-stream') {
    if (!s3Client) {
      // Mock upload URL response when R2 credentials are not set
      return {
        success: true,
        fileUrl: `https://storage.pastebin.dev/mock-r2/${fileName}`,
        storage: 'Local Dev Mock'
      };
    }

    try {
      const key = `attachments/${Date.now()}-${fileName}`;
      const command = new PutObjectCommand({
        Bucket: config.r2BucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType
      });

      await s3Client.send(command);
      return {
        success: true,
        key,
        fileUrl: `${config.r2Endpoint}/${config.r2BucketName}/${key}`
      };
    } catch (err) {
      console.error('[R2 Upload Error]:', err.message);
      throw new Error(`R2 Upload Failed: ${err.message}`);
    }
  }

  /**
   * Export user snippets as JSON archive file to R2
   */
  static async exportUserBackup(userId, snippetsData) {
    const jsonString = JSON.stringify(snippetsData, null, 2);
    const buffer = Buffer.from(jsonString, 'utf-8');
    const fileName = `backup-${userId}-${Date.now()}.json`;

    return this.uploadFile(buffer, fileName, 'application/json');
  }
}
