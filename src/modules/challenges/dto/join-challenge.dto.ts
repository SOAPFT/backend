import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class JoinChallengeDto {
  @ApiProperty({ description: '챌린지 참여 비밀번호', required: false })
  @IsOptional()
  @IsString()
  password?: string;
}
