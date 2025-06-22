import {
  BadRequestException,
  Controller,
  Delete,
  Inject,
  Param,
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { Logger } from 'winston';
import { S3Service } from '../s3/s3.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UploadResponseDto } from './dto/upload-response.dto';
import { DeleteResponseDto } from './dto/delete-response.dto';
import { DeleteImageParamDto } from './dto/delete-image-param.dto';
import { ImageFileInterceptor } from '@/decorators/file-interceptor.decorator';
import { ApiDeleteImage, ApiUploadImage } from './decorators/uploads.swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('upload')
@ApiBearerAuth('JWT-auth')
@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
    @Inject('winston')
    private readonly logger: Logger,
    private readonly s3Service: S3Service,
  ) {}

  @Post('image')
  @ApiUploadImage()
  @ImageFileInterceptor('image')
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException('이미지 파일을 제공해주세요.');
    }

    try {
      this.logger.info(`이미지 업로드 시작: ${file.originalname}`);
      const imageUrl = await this.s3Service.uploadImage(file);
      this.logger.info(`이미지 업로드 완료: ${imageUrl}`);

      return { message: '이미지가 업로드되었습니다.', imageUrl };
    } catch (error) {
      this.logger.error(`이미지 업로드 실패 - ${error.message}`);
      throw new BadRequestException(`이미지 업로드 실패: ${error.message}`);
    }
  }

  @Delete('image/:url')
  @ApiDeleteImage()
  async deleteImage(
    @Param() params: DeleteImageParamDto,
  ): Promise<DeleteResponseDto> {
    try {
      this.logger.info(`이미지 삭제 시작: ${params.ImageUrl}`);
      await this.s3Service.deleteImage(params.ImageUrl);
      this.logger.info(`이미지 삭제 완료: ${params.ImageUrl}`);

      return {
        message: '이미지가 삭제되었습니다.',
      };
    } catch (error) {
      this.logger.error(`이미지 삭제 실패 - ${error.message}`);
      throw new BadRequestException(`이미지 삭제 실패: ${error.message}`);
    }
  }
}
