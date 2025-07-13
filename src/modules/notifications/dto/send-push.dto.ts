import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendPushDto {
  @ApiProperty({
    description: '디바이스 토큰',
    example: 'a9d0ed10e9cfd022a61cb08753f49c5a0b0dfb383697bf9f9d750a1003da19c7',
  })
  @IsString()
  deviceToken: string;

  @ApiProperty({
    description: '푸시알림 제목',
    example: '새로운 메시지',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '푸시알림 내용',
    example: '배고픈 귤님이 메시지를 보냈습니다.',
  })
  @IsString()
  body: string;

  @ApiProperty({
    description: '앱 아이콘의 배지 수',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  badge?: number;

  @ApiProperty({
    description: '알림 소리 (default, 사용자 정의 소리 파일명)',
    example: 'default',
    required: false,
  })
  @IsOptional()
  @IsString()
  sound?: string;

  @ApiProperty({
    description: '앱으로 전달할 커스텀 데이터',
    example: { messageId: 123, type: 'message', senderId: 'user123' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @ApiProperty({
    description: '알림 카테고리',
    example: 'MESSAGE_CATEGORY',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;
}

export class SendPushMultipleDto {
  @ApiProperty({
    description: '디바이스 토큰 배열',
    example: [
      'a9d0ed10e9cfd022a61cb08753f49c5a0b0dfb383697bf9f9d750a1003da19c7',
      'b8c1fe21f0dfe133b72dc19864g50d6b1c1egc484708cgag851b1104eb20d8',
      'c7d2gf32g1ege244c83ed20975h61e7c2d2fhd595819dhbh962c2205fc31e9',
    ],
  })
  @IsArray()
  @IsString({ each: true })
  deviceTokens: string[];

  @ApiProperty({
    description: '푸시알림 제목',
    example: '새로운 공지사항',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '푸시알림 내용',
    example: '앱 업데이트가 완료되었습니다. 새로운 기능을 확인해보세요!',
  })
  @IsString()
  body: string;

  @ApiProperty({
    description: '앱 아이콘의 배지 수',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  badge?: number;

  @ApiProperty({
    description: '알림 소리 (default, 사용자 정의 소리 파일명)',
    example: 'default',
    required: false,
  })
  @IsOptional()
  @IsString()
  sound?: string;

  @ApiProperty({
    description: '앱으로 전달할 커스텀 데이터',
    example: { announcementId: 456, type: 'announcement', priority: 'high' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @ApiProperty({
    description: '알림 카테고리',
    example: 'ANNOUNCEMENT_CATEGORY',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;
}

export class SendTestPushDto {
  @ApiProperty({
    description: '테스트용 디바이스 토큰',
    example: 'a9d0ed10e9cfd022a61cb08753f49c5a0b0dfb383697bf9f9d750a1003da19c7',
  })
  @IsString()
  deviceToken: string;
}
