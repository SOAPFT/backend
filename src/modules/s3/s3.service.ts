import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Logger } from 'winston';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;
  @Inject('winston')
  private readonly logger: Logger;
  private readonly bucketName: string;
  private readonly cdnDomain: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET');
    this.cdnDomain = this.configService.get<string>('AWS_CLOUDFRONT_DOMAIN') || 'd6md6o5keoxyr.cloudfront.net';

    this.s3 = new S3Client({
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;

      const upload = new Upload({
        client: this.s3,
        params: {
          Bucket: this.bucketName,
          Key: `images/${fileName}`,
          Body: file.buffer,
          ContentType: file.mimetype,
          // ACL 제거 - CloudFront를 통해 public 접근
        },
      });

      const result = await upload.done();
      // CDN URL 사용 (더 빠른 이미지 로딩)
      const location = `https://${this.cdnDomain}/images/${fileName}`;
      this.logger.info('이미지 업로드 성공', { location, s3Key: `images/${fileName}` });
      return location;
    } catch (error) {
      this.logger.error('이미지 업로드 실패', { error: error.message });
      throw error;
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const key = imageUrl.split('/').slice(3).join('/');

      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3.send(command);
      this.logger.info('이미지 삭제 성공', { key });
    } catch (error) {
      this.logger.error('이미지 삭제 실패', { error: error.message });
      throw error;
    }
  }
}
