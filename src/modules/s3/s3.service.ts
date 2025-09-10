import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Logger } from 'winston';
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;
  @Inject('winston')
  private readonly logger: Logger;
  private readonly bucketName: string;
  private readonly cdnDomain: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET');
    this.cdnDomain =
      this.configService.get<string>('AWS_CLOUDFRONT_DOMAIN') ||
      'd6md6o5keoxyr.cloudfront.net';

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
      const fileName = `${uuidv4()}.jpg`; // 최적화 후 항상 JPEG로 변환

      // 이미지 최적화 (Bedrock AI 5MB 제한 대응)
      const optimizedBuffer = await this.optimizeImage(
        file.buffer,
        file.originalname,
      );

      const upload = new Upload({
        client: this.s3,
        params: {
          Bucket: this.bucketName,
          Key: `images/${fileName}`,
          Body: optimizedBuffer,
          ContentType: 'image/jpeg', // 최적화 후 JPEG
          // ACL 제거 - CloudFront를 통해 public 접근
        },
      });

      await upload.done();
      // CDN URL 사용 (더 빠른 이미지 로딩)
      const location = `https://${this.cdnDomain}/images/${fileName}`;
      this.logger.info('이미지 업로드 성공', {
        location,
        s3Key: `images/${fileName}`,
        originalSize: file.size,
        optimizedSize: optimizedBuffer.length,
        compressionRatio: Math.round(
          (1 - optimizedBuffer.length / file.size) * 100,
        ),
      });
      return location;
    } catch (error) {
      this.logger.error('이미지 업로드 실패', { error: error.message });
      throw error;
    }
  }

  /**
   * 이미지 최적화 - Bedrock AI 5MB 제한 대응
   */
  private async optimizeImage(
    buffer: Buffer,
    originalName: string,
  ): Promise<Buffer> {
    try {
      const maxSize = 4 * 1024 * 1024; // 4MB (여유를 두고)
      let quality = 85;
      let optimizedBuffer: Buffer;

      // 1차 최적화: 크기 조정 + 품질 조정
      optimizedBuffer = await sharp(buffer)
        .rotate() // EXIF 회전 정보 적용
        .resize(2048, 2048, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({
          quality,
          progressive: true,
          mozjpeg: true,
        })
        .toBuffer();

      // 2차 최적화: 크기가 여전히 크면 품질을 더 낮춤
      while (optimizedBuffer.length > maxSize && quality > 60) {
        quality -= 10;
        optimizedBuffer = await sharp(buffer)
          .rotate()
          .resize(1920, 1920, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({
            quality,
            progressive: true,
            mozjpeg: true,
          })
          .toBuffer();
      }

      // 3차 최적화: 여전히 크면 더 작은 크기로 리사이즈
      if (optimizedBuffer.length > maxSize) {
        optimizedBuffer = await sharp(buffer)
          .rotate()
          .resize(1600, 1600, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({
            quality: 70,
            progressive: true,
            mozjpeg: true,
          })
          .toBuffer();
      }

      this.logger.info('이미지 최적화 완료', {
        originalName,
        originalSize: buffer.length,
        optimizedSize: optimizedBuffer.length,
        compressionRatio: Math.round(
          (1 - optimizedBuffer.length / buffer.length) * 100,
        ),
        finalQuality: quality,
      });

      return optimizedBuffer;
    } catch (error) {
      this.logger.error('이미지 최적화 실패', {
        originalName,
        error: error.message,
      });
      // 최적화 실패 시 원본을 크기만 조정해서 반환
      return await sharp(buffer)
        .rotate()
        .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 70 })
        .toBuffer();
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
