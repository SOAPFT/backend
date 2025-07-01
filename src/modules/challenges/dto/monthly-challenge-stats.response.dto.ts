import { ApiProperty } from '@nestjs/swagger';

export class UserInfoDto {
  @ApiProperty({ example: '01HZYFDYZ0EZ4KP6FYK6G62PC6' })
  userUuid: string;

  @ApiProperty({ example: 'passu_nickname' })
  nickname: string;

  @ApiProperty({
    example: 'https://passu.s3.ap-northeast-2.amazonaws.com/user/...',
  })
  profileImage: string;
}

export class DailyStatsDto {
  @ApiProperty({ example: 3, description: '해당 날짜의 인증 수' })
  count: number;

  @ApiProperty({ type: [UserInfoDto], description: '인증한 사용자 정보 배열' })
  users: UserInfoDto[];
}

export class MonthlyChallengeStatsResponseDto {
  @ApiProperty({
    example: {
      '2025-07-01': {
        count: 3,
        users: [
          {
            userUuid: '01HZYFDYZ0EZ4KP6FYK6G62PC6',
            nickname: 'passu_nickname',
            profileImage:
              'https://passu.s3.ap-northeast-2.amazonaws.com/user/...',
          },
        ],
      },
    },
    description: '날짜별 인증 현황',
  })
  data: Record<string, DailyStatsDto>;
}
