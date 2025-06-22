import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ChallengeType, GenderType } from '@/types/challenge.enum';

export class CreateChallengeDto {
  @ApiProperty({ description: '챌린지명' })
  @IsString()
  title: string;

  @ApiProperty({ description: '챌린지 유형', enum: ChallengeType })
  @IsEnum(ChallengeType)
  type: ChallengeType;

  @ApiProperty({ description: '챌린지 소개글' })
  @IsString()
  introduce: string;

  @ApiProperty({ description: '시작 일자' })
  @IsString()
  start_date: string;

  @ApiProperty({ description: '종료 일자', required: false })
  @IsOptional()
  @IsString()
  end_date?: string;

  @ApiProperty({ description: '주당 인증 목표 횟수' })
  @IsNumber()
  goal: number;

  @ApiProperty({ description: '참여 가능 최소 연령' })
  @IsNumber()
  start_age: number;

  @ApiProperty({ description: '참여 가능 최대 연령', required: false })
  @IsOptional()
  @IsNumber()
  end_age?: number;

  @ApiProperty({ description: '성별 제한', enum: GenderType })
  @IsEnum(GenderType)
  gender: GenderType;

  @ApiProperty({ description: '최대 참여자 수' })
  @IsNumber()
  max_member: number;

  @ApiProperty({ description: '참여 시 필요한 코인 양' })
  @IsNumber()
  coin_amount: number;

  @ApiProperty({ description: '챌린지 프로필 이미지', required: false })
  @IsOptional()
  @IsString()
  profile?: string;

  @ApiProperty({ description: '챌린지 배너 이미지', required: false })
  @IsOptional()
  @IsString()
  banner?: string;
}
