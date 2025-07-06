import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: '홍길동',
    description: '새로운 닉네임',
  })
  newNickname?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: '안녕하세요. 자기소개입니다!',
    description: '새로운 소개글',
  })
  newIntroduction?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'https://example.com/profile.jpg',
    description: '새로운 프로필 이미지 URL',
  })
  newProfileImg?: string;
}
