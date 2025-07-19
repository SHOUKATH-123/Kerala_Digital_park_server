
import fs from 'fs';
import path from 'path';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../../domain/entities/awsS3Client.js';
import config from '../../config/env.js';
import { v4 as uniqueIdv4 } from 'uuid';

class AwsS3Bucket {
  async storeImages(images) {
    try {
      const uploadedUrls = [];

      for (const file of images) {
        const fileStream = fs.createReadStream(file.path);
        const fileExtension = path.extname(file.originalname);
        const s3Key = `ProductImage/${uniqueIdv4()}${fileExtension}`;

        const uploadParams = {
          Bucket: config.S3_BUCKET_NAME,
          Key: s3Key,
          Body: fileStream,
          ContentType: file.mimetype,
          //  ACL: 'public-read'
        };

        await s3Client.send(new PutObjectCommand(uploadParams));

        const imageUrl = `https://${config.S3_BUCKET_NAME}.s3.${config.AWS_REGION}.amazonaws.com/${s3Key}`;
        uploadedUrls.push(imageUrl);

        // ✅ Optionally delete local file after upload
        fs.unlink(file.path, (err) => {
          if (err) console.error('Failed to delete local file:', file.path);
        });
      }

      return uploadedUrls;
    } catch (error) {
      images.forEach((file) => {
        const filePath = path.resolve(file.path);
        fs.unlink(filePath, () => { });
      });
      console.error('S3 Upload Error:', error);
      throw {
        status: 500,
        message: 'Failed to upload images to S3'
      };
    }
  }
  async deleteImageFromAwsS3(imageUrl) {
    try {
    
      const url = new URL(imageUrl); 
      const s3Key = decodeURIComponent(url.pathname).replace(/^\/+/, '');

      const deleteParams = {
        Bucket: config.S3_BUCKET_NAME,
        Key: s3Key
      };

      await s3Client.send(new DeleteObjectCommand(deleteParams));
      // console.log(`Image deleted successfully from S3: ${s3Key}`);
      return true;

    } catch (error) {
      console.error('S3 delete Error:', error);
      // throw {
      //   status: 500,
      //   message: 'Failed to upload images to S3'
      // };
    }
  }
}

export default AwsS3Bucket;
