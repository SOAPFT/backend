import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DevLoginDto {
  @IsString()
  @IsNotEmpty()
  userUuid: string;
}

export class SocialLoginDto {
  @ApiProperty({
    description: '소셜 access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  accessToken: string;

  @ApiProperty({
    description: '디바이스 고유 식별자 (iOS UUID 등)',
    required: false,
    example: 'BFF12E03-81AE-4E30-91DE-8D2F78A4A10F',
  })
  @IsOptional()
  @IsString()
  deviceId?: string;

  @ApiProperty({
    description: '디바이스 종류 (iOS, Android 등)',
    required: false,
    example: 'iOS',
  })
  @IsOptional()
  @IsString()
  deviceType?: string;

  @ApiProperty({
    description: 'FCM 등 푸시 토큰',
    required: false,
    example: 'f2YbkmwqT2ydIOh8A7fMnZ:APA91bE...',
  })
  @IsOptional()
  @IsString()
  pushToken?: string;

  @ApiProperty({
    description: '앱 버전 정보',
    required: false,
    example: '1.0.3',
  })
  @IsOptional()
  @IsString()
  appVersion?: string;
}
