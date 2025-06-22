import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DevLoginDto {
  @IsString()
  @IsNotEmpty()
  userUuid: string;
}

export class SocialLoginDto {
  @ApiProperty({ description: '소셜 access token' })
  @IsString()
  accessToken: string;

  @ApiProperty({
    description: '디바이스 고유 식별자 (iOS UUID 등)',
    required: false,
  })
  @IsOptional()
  @IsString()
  deviceId?: string;

  @ApiProperty({
    description: '디바이스 종류 (iOS, Android 등)',
    required: false,
  })
  @IsOptional()
  @IsString()
  deviceType?: string;

  @IsOptional()
  @IsString()
  pushToken?: string;

  @ApiProperty({ description: '앱 버전 정보', required: false })
  @IsOptional()
  @IsString()
  appVersion?: string;
}
