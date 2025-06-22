import { ApiProperty } from '@nestjs/swagger';
import { ChallengeResponseDto } from './challenge-response.dto';

export class ChallengeListResponseDto {
  @ApiProperty({ type: [ChallengeResponseDto] })
  challenges: ChallengeResponseDto[];

  @ApiProperty({ description: '총 챌린지 수' })
  total: number;

  @ApiProperty({ description: '현재 페이지' })
  page: number;

  @ApiProperty({ description: '페이지당 항목 수' })
  limit: number;
}
