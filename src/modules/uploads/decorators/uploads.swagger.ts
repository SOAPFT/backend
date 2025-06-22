import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  createErrorResponse,
  CommonAuthResponses,
  CommonErrorResponses,
} from '../../../decorators/swagger.decorator';

export function ApiUploadImage() {
  return applyDecorators(
    ApiOperation({
      summary: '이미지 업로드',
      description: 'S3 Bucket에 이미지 파일을 업로드합니다.',
    }),
    ApiBearerAuth(),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          image: {
            type: 'string',
            format: 'binary',
            description: '업로드할 이미지 파일 (jpg, jpeg, png, gif만 가능)',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: '이미지가 성공적으로 업로드됨',
      schema: {
        type: 'object',
        properties: {
          imageUrl: {
            type: 'string',
            example:
              'https://soapft-bucket.s3.amazonaws.com/images/example-image.jpg',
          },
          message: {
            type: 'string',
            example: '이미지가 업로드되었습니다.',
          },
          fileName: {
            type: 'string',
            example: 'example-image.jpg',
          },
          fileSize: {
            type: 'number',
            example: 1024000,
          },
          uploadedAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-06-22T12:00:00Z',
          },
        },
      },
    }),
    ApiResponse(
      createErrorResponse('FILE_001', '지원하지 않는 파일 형식입니다.', 400, {
        allowedTypes: ['jpg', 'jpeg', 'png', 'gif'],
      }),
    ),
    ApiResponse(
      createErrorResponse('FILE_002', '파일 크기가 너무 큽니다.', 413, {
        maxSize: '10MB',
      }),
    ),
    ApiResponse(
      createErrorResponse('FILE_003', '파일 업로드에 실패했습니다.', 500),
    ),
    ApiResponse(CommonAuthResponses.Unauthorized),
    ApiResponse(CommonErrorResponses.ValidationFailed),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiDeleteImage() {
  return applyDecorators(
    ApiOperation({
      summary: '이미지 삭제',
      description: '업로드된 이미지를 S3에서 삭제합니다.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'imageUrl',
      description: '삭제할 이미지 URL (URL 인코딩 필요)',
      required: true,
      example:
        'https%3A%2F%2Fsoapft-bucket.s3.amazonaws.com%2Fimages%2Fexample-image.jpg',
    }),
    ApiResponse({
      status: 200,
      description: '이미지가 성공적으로 삭제됨',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: '이미지가 삭제되었습니다.',
          },
          deletedUrl: {
            type: 'string',
            example:
              'https://soapft-bucket.s3.amazonaws.com/images/example-image.jpg',
          },
          deletedAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-06-22T12:00:00Z',
          },
        },
      },
    }),
    ApiResponse(
      createErrorResponse('FILE_004', '파일을 찾을 수 없습니다.', 404),
    ),
    ApiResponse(
      createErrorResponse('FILE_005', '파일 삭제에 실패했습니다.', 500),
    ),
    ApiResponse(
      createErrorResponse('FILE_006', '파일 삭제 권한이 없습니다.', 403),
    ),
    ApiResponse(CommonAuthResponses.Unauthorized),
    ApiResponse(CommonAuthResponses.Forbidden),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiUploadMultipleImages() {
  return applyDecorators(
    ApiOperation({
      summary: '다중 이미지 업로드',
      description: '여러 개의 이미지 파일을 한 번에 업로드합니다. (최대 10개)',
    }),
    ApiBearerAuth(),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          images: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
            description: '업로드할 이미지 파일들 (최대 10개)',
            maxItems: 10,
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: '이미지들이 성공적으로 업로드됨',
      schema: {
        type: 'object',
        properties: {
          imageUrls: {
            type: 'array',
            items: {
              type: 'string',
            },
            example: [
              'https://soapft-bucket.s3.amazonaws.com/images/image1.jpg',
              'https://soapft-bucket.s3.amazonaws.com/images/image2.jpg',
            ],
          },
          message: {
            type: 'string',
            example: '2개의 이미지가 업로드되었습니다.',
          },
          uploadCount: {
            type: 'number',
            example: 2,
          },
          totalSize: {
            type: 'number',
            example: 2048000,
          },
          uploadedAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-06-22T12:00:00Z',
          },
        },
      },
    }),
    ApiResponse(
      createErrorResponse('FILE_001', '지원하지 않는 파일 형식입니다.', 400, {
        allowedTypes: ['jpg', 'jpeg', 'png', 'gif'],
      }),
    ),
    ApiResponse(
      createErrorResponse('FILE_002', '파일 크기가 너무 큽니다.', 413, {
        maxSize: '10MB',
      }),
    ),
    ApiResponse(
      createErrorResponse(
        'FILE_007',
        '업로드 파일 개수가 초과되었습니다.',
        400,
        { maxFiles: 10 },
      ),
    ),
    ApiResponse(
      createErrorResponse('FILE_003', '파일 업로드에 실패했습니다.', 500),
    ),
    ApiResponse(CommonAuthResponses.Unauthorized),
    ApiResponse(CommonErrorResponses.ValidationFailed),
    ApiResponse(CommonErrorResponses.InternalServerError),
  );
}

export function ApiGetUploadHistory() {
  return applyDecorators(
    ApiOperation({
      summary: '업로드 기록 조회',
      description: '사용자가 업로드한 이미지들의 기록을 조회합니다.',
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: '업로드 기록 조회 성공',
      schema: {
        type: 'object',
        properties: {
          uploads: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 123 },
                imageUrl: {
                  type: 'string',
                  example:
                    'https://soapft-bucket.s3.amazonaws.com/images/example.jpg',
                },
                fileName: { type: 'string', example: 'example.jpg' },
                fileSize: { type: 'number', example: 1024000 },
                mimeType: { type: 'string', example: 'image/jpeg' },
                uploadedAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-06-22T12:00:00Z',
                },
                isUsed: { type: 'boolean', example: true },
                usedIn: {
                  type: 'object',
                  properties: {
                    type: { type: 'string', example: 'post' },
                    id: {
                      type: 'string',
                      example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
                    },
                  },
                },
              },
            },
          },
          totalCount: { type: 'number', example: 25 },
          totalSize: { type: 'number', example: 52428800 },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: '인증되지 않은 사용자',
    }),
  );
}
