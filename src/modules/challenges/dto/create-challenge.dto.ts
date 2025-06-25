import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ChallengeType, GenderType } from '@/types/challenge.enum';

export class CreateChallengeDto {
  @ApiProperty({ description: '챌린지명', example: '6월 새벽 기상 챌린지' })
  @IsString()
  title: string;

  @ApiProperty({
    description: '챌린지 유형',
    enum: ChallengeType,
    example: ChallengeType.NORMAL,
  })
  @IsEnum(ChallengeType)
  type: ChallengeType;

  @ApiProperty({
    description: '챌린지 소개글',
    example: '하루를 일찍 시작하고 싶은 사람들을 위한 챌린지입니다.',
  })
  @IsString()
  introduce: string;

  @ApiProperty({
    description: '시작 일자',
    example: '2025-07-01T00:00:00.000Z',
  })
  @IsString()
  start_date: string;

  @ApiProperty({
    description: '종료 일자',
    required: false,
    example: '2025-07-31T23:59:59.000Z',
  })
  @IsOptional()
  @IsString()
  end_date?: string;

  @ApiProperty({ description: '주당 인증 목표 횟수', example: 5 })
  @IsNumber()
  goal: number;

  @ApiProperty({ description: '참여 가능 최소 연령', example: 18 })
  @IsNumber()
  start_age: number;

  @ApiProperty({
    description: '참여 가능 최대 연령',
    required: false,
    example: 40,
  })
  @IsOptional()
  @IsNumber()
  end_age?: number;

  @ApiProperty({
    description: '성별 제한',
    enum: GenderType,
    example: GenderType.NONE,
  })
  @IsEnum(GenderType)
  gender: GenderType;

  @ApiProperty({ description: '최대 참여자 수', example: 30 })
  @IsNumber()
  max_member: number;

  @ApiProperty({ description: '참여 시 필요한 코인 양', example: 5 })
  @IsNumber()
  coin_amount: number;

  @ApiProperty({
    description: '챌린지 프로필 이미지',
    required: false,
    example: 'https://cdn.example.com/images/challenge-profile.png',
  })
  @IsOptional()
  @IsString()
  profile?: string;

  @ApiProperty({
    description: '챌린지 배너 이미지',
    required: false,
    example: 'https://cdn.example.com/images/challenge-banner.png',
  })
  @IsOptional()
  @IsString()
  banner?: string;
}
