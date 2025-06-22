import { ApiProperty } from '@nestjs/swagger';
import { ChallengeType } from '@/types/challenge.enum';

export class ChallengeResponseDto {
  @ApiProperty({ description: '챌린지 ID' })
  id: number;

  @ApiProperty({ description: '챌린지 UUID' })
  challenge_uuid: string;

  @ApiProperty({ description: '챌린지명' })
  title: string;

  @ApiProperty({ description: '챌린지 타입' })
  type: ChallengeType;

  @ApiProperty({ description: '챌린지 소개' })
  introduce: string;

  @ApiProperty({ description: '참여자 수' })
  current_participants: number;

  @ApiProperty({ description: '최대 참여자 수' })
  max_member: number;

  @ApiProperty({ description: '코인 양' })
  coin_amount: number;

  @ApiProperty({ description: '시작 여부' })
  is_started: boolean;

  @ApiProperty({ description: '종료 여부' })
  is_finished: boolean;
}
