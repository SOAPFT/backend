import { ApiProperty } from '@nestjs/swagger';

export class ChallengeResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '01JYKQ330DPJ46AKH3A28S85F9' })
  challengeUuid: string;

  @ApiProperty({ example: '6월 새벽 기상 챌린지' })
  title: string;

  @ApiProperty({ example: 'NORMAL' })
  type: string;

  @ApiProperty({
    example: 'https://cdn.example.com/images/challenge-profile.png',
  })
  profile: string;

  @ApiProperty({
    example: 'https://cdn.example.com/images/challenge-banner.png',
  })
  banner: string;

  @ApiProperty({
    example: '하루를 일찍 시작하고 싶은 사람들을 위한 챌린지입니다.',
  })
  introduce: string;

  @ApiProperty({ example: '6시 전에 일어나서 인증샷!!' })
  verificationGuide: string;

  @ApiProperty({ example: '2025-07-01T00:00:00.000Z' })
  startDate: string;

  @ApiProperty({ example: '2025-07-31T23:59:59.000Z' })
  endDate: string;

  @ApiProperty({ example: 5, description: '챌린지 목표 수치' })
  goal: number;

  @ApiProperty({ example: 18 })
  startAge: number;

  @ApiProperty({ example: 40 })
  endAge: number;

  @ApiProperty({ example: 'NONE' })
  gender: string;

  @ApiProperty({ example: 30 })
  maxMember: number;

  @ApiProperty({ example: '01JYKQ0P03G8AFAAW4AZ31P19B' })
  creatorUuid: string;

  @ApiProperty({
    example: ['01JYKQ0P03G8AFAAW4AZ31P19B'],
    type: [String],
  })
  participantUuid: string[];

  @ApiProperty({ example: 5 })
  coinAmount: number;

  @ApiProperty({ example: false })
  isStarted: boolean;

  @ApiProperty({ example: false })
  isFinished: boolean;

  @ApiProperty({
    example: [],
    type: [String],
  })
  successParticipantsUuid: string[];

  @ApiProperty({ example: '2025-06-25T14:15:25.966Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-06-25T14:15:25.966Z' })
  updatedAt: string;
}
