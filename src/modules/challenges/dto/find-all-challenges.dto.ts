import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import {
  ChallengeType,
  GenderType,
  ChallengeStatusType,
} from '@/types/challenge.enum';

export class FindAllChallengesDto {
  @ApiProperty({ description: '페이지 번호', default: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiProperty({
    description: '페이지당 챌린지 수',
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @ApiProperty({
    description: '챌린지 타입 필터',
    enum: ChallengeType,
    required: false,
  })
  @IsOptional()
  @IsEnum(ChallengeType)
  type?: ChallengeType;

  @ApiProperty({ description: '성별 필터', enum: GenderType, required: false })
  @IsOptional()
  @IsEnum(GenderType)
  gender?: GenderType;

  @ApiProperty({
    description: '챌린지 상태 필터',
    enum: ChallengeStatusType,
    required: false,
  })
  @IsOptional()
  @IsEnum(ChallengeStatusType)
  status?: ChallengeStatusType;
}
