import { ApiProperty } from '@nestjs/swagger';

export class ChallengeProgressResponseDto {
  @ApiProperty({ example: 1, description: '주차' })
  week: number;

  @ApiProperty({ example: 3, description: '해당 주의 인증 일수' })
  count: number;

  @ApiProperty({ example: false, description: '목표 달성 여부' })
  achieved: boolean;
}
