import {
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChallengeStatusType } from '../../../types/challenge.enum';

export class UpdateChallengeDto {
  @ApiProperty({
    description: '챌린지 제목',
    example: '수정된 챌린지 제목',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: '챌린지 소개',
    example: '수정된 챌린지 소개',
    required: false,
  })
  @IsOptional()
  @IsString()
  introduce?: string;

  @ApiProperty({
    description: '목표 달성 일수',
    example: 30,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  goalDays?: number;

  @ApiProperty({
    description: '챌린지 상태',
    enum: ChallengeStatusType,
    example: ChallengeStatusType.IN_PROGRESS,
    required: false,
  })
  @IsOptional()
  @IsEnum(ChallengeStatusType)
  status?: ChallengeStatusType;

  @ApiProperty({
    description: '삭제 여부',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}
