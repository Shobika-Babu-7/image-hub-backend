import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AwsS3Service {
  private s3: S3;
  private readonly bucketName = process.env.AWS_S3_BUCKET_NAME;

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async uploadFile(stream: any, name): Promise<string> {
    const uploadResult = await this.s3.upload({
      Bucket: this.bucketName,
      Key: `${uuidv4()}-${name}`,
      Body: stream,
      ACL: 'public-read',
    }).promise();

    return uploadResult.Location;
  }
}
