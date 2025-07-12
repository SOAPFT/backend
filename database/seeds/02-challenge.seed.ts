import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Challenge } from '../../src/entities/challenge.entity';
import { User } from '../../src/entities/user.entity';
import { ChallengeType, GenderType } from '../../src/types/challenge.enum';
import { ulid } from 'ulid';

export class ChallengeSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const challengeRepository = dataSource.getRepository(Challenge);
    const userRepository = dataSource.getRepository(User);

    // 기존 데이터 확인
    const existingChallenges = await challengeRepository.find();
    if (existingChallenges.length > 0) {
      console.log('Challenge seeds already exist, skipping...');
      return;
    }

    // 사용자 데이터 가져오기
    const users = await userRepository.find();
    if (users.length === 0) {
      console.log('No users found, please run user seeds first');
      return;
    }

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const challenges = [
      {
        challengeUuid: ulid(),
        title: '30일 매일 운동하기',
        type: ChallengeType.NORMAL,
        profile: 'https://picsum.photos/300/300?random=101',
        banner: 'https://picsum.photos/800/400?random=201',
        introduce:
          '매일 30분 이상 운동하는 챌린지입니다. 건강한 삶의 첫걸음을 함께 해요!',
        verificationGuide:
          '운동 사진을 찍어 인증해주세요. 운동 종류는 자유입니다.',
        startDate: oneWeekAgo,
        endDate: oneMonthFromNow,
        goal: 7, // 주 7회
        startAge: 18,
        endAge: 65,
        gender: GenderType.NONE,
        maxMember: 50,
        creatorUuid: users[0].userUuid,
        participantUuid: [
          users[0].userUuid,
          users[1].userUuid,
          users[3].userUuid,
          users[6].userUuid,
        ],
        coinAmount: 100,
        isStarted: true,
        isFinished: false,
        successParticipantsUuid: [],
      },
      {
        challengeUuid: ulid(),
        title: '10,000보 걷기 챌린지',
        type: ChallengeType.NORMAL,
        profile: 'https://picsum.photos/300/300?random=102',
        banner: 'https://picsum.photos/800/400?random=202',
        introduce:
          '매일 10,000보 걷기 챌린지입니다. 건강한 걸음으로 활력을 찾아보세요!',
        verificationGuide:
          '만보기 앱 스크린샷 또는 걸음 수 인증 사진을 올려주세요.',
        startDate: now,
        endDate: twoWeeksFromNow,
        goal: 7, // 주 7회
        startAge: 16,
        endAge: null,
        gender: GenderType.NONE,
        maxMember: 30,
        creatorUuid: users[1].userUuid,
        participantUuid: [
          users[1].userUuid,
          users[4].userUuid,
          users[8].userUuid,
        ],
        coinAmount: 50,
        isStarted: true,
        isFinished: false,
        successParticipantsUuid: [],
      },
      {
        challengeUuid: ulid(),
        title: '홈트레이닝 챌린지',
        type: ChallengeType.NORMAL,
        profile: 'https://picsum.photos/300/300?random=103',
        banner: 'https://picsum.photos/800/400?random=203',
        introduce:
          '집에서 하는 홈트레이닝 챌린지입니다. 헬스장 없이도 건강하게!',
        verificationGuide: '홈트레이닝 운동 사진을 공유해주세요.',
        startDate: oneWeekFromNow,
        endDate: oneMonthFromNow,
        goal: 3, // 주 3회
        startAge: 18,
        endAge: null,
        gender: GenderType.NONE,
        maxMember: 25,
        creatorUuid: users[2].userUuid,
        participantUuid: [users[2].userUuid],
        coinAmount: 80,
        isStarted: false,
        isFinished: false,
        successParticipantsUuid: [],
      },
      {
        challengeUuid: ulid(),
        title: '요가 챌린지',
        type: ChallengeType.NORMAL,
        profile: 'https://picsum.photos/300/300?random=104',
        banner: 'https://picsum.photos/800/400?random=204',
        introduce: '요가 챌린지입니다. 몸과 마음의 균형을 찾아보세요.',
        verificationGuide: '요가 동작 사진을 올려주세요.',
        startDate: now,
        endDate: twoWeeksFromNow,
        goal: 5, // 주 5회
        startAge: 18,
        endAge: 45,
        gender: GenderType.FEMALE,
        maxMember: 20,
        creatorUuid: users[3].userUuid,
        participantUuid: [
          users[3].userUuid,
          users[1].userUuid,
          users[5].userUuid,
          users[7].userUuid,
        ],
        coinAmount: 120,
        isStarted: true,
        isFinished: false,
        successParticipantsUuid: [],
      },
      {
        challengeUuid: ulid(),
        title: '매일 2리터 물마시기 챌린지',
        type: ChallengeType.EVENT,
        profile: 'https://picsum.photos/300/300?random=105',
        banner: 'https://picsum.photos/800/400?random=205',
        introduce:
          '매일 2리터의 물을 마시는 건강한 습관을 만드는 특별 이벤트 챌린지입니다!',
        verificationGuide:
          '물을 마시는 사진과 하루 2리터 물 섭취량을 기록해주세요.',
        startDate: oneWeekAgo,
        endDate: oneWeekFromNow,
        goal: 7, // 주 7회 (매일)
        startAge: 15,
        endAge: null,
        gender: GenderType.NONE,
        maxMember: 100,
        creatorUuid: users[4].userUuid,
        participantUuid: [
          users[4].userUuid,
          users[0].userUuid,
          users[2].userUuid,
          users[6].userUuid,
          users[8].userUuid,
        ],
        coinAmount: 200,
        isStarted: true,
        isFinished: false,
        successParticipantsUuid: [],
      },
      {
        challengeUuid: ulid(),
        title: '러닝 마라톤 준비',
        type: ChallengeType.NORMAL,
        profile: 'https://picsum.photos/300/300?random=106',
        banner: 'https://picsum.photos/800/400?random=206',
        introduce:
          '마라톤 완주를 목표로 하는 러닝 챌린지입니다. 꾸준한 달리기로 체력을 기릅시다!',
        verificationGuide:
          '러닝 앱 기록 스크린샷과 달리기 인증 사진을 올려주세요.',
        startDate: oneWeekFromNow,
        endDate: oneMonthFromNow,
        goal: 4, // 주 4회
        startAge: 18,
        endAge: null,
        gender: GenderType.NONE,
        maxMember: 40,
        creatorUuid: users[5].userUuid,
        participantUuid: [users[5].userUuid, users[1].userUuid],
        coinAmount: 150,
        isStarted: false,
        isFinished: false,
        successParticipantsUuid: [],
      },
      {
        challengeUuid: ulid(),
        title: '웨이트 트레이닝 챌린지',
        type: ChallengeType.NORMAL,
        profile: 'https://picsum.photos/300/300?random=107',
        banner: 'https://picsum.photos/800/400?random=207',
        introduce: '웨이트 트레이닝 챌린지입니다.',
        verificationGuide: '운동 장면 사진과 세트/횟수를 기록해주세요.',
        startDate: now,
        endDate: twoWeeksFromNow,
        goal: 4, // 주 4회
        startAge: 18,
        endAge: 50,
        gender: GenderType.MALE,
        maxMember: 35,
        creatorUuid: users[6].userUuid,
        participantUuid: [
          users[6].userUuid,
          users[0].userUuid,
          users[2].userUuid,
          users[4].userUuid,
          users[8].userUuid,
        ],
        coinAmount: 150,
        isStarted: true,
        isFinished: false,
        successParticipantsUuid: [],
      },
      {
        challengeUuid: ulid(),
        title: '하루 스쿼트 100개 챌린지',
        type: ChallengeType.NORMAL,
        profile: 'https://picsum.photos/300/300?random=108',
        banner: 'https://picsum.photos/800/400?random=208',
        introduce: '매일 스쿼트 100개 하기 챌린지',
        verificationGuide: '스쿼트 운동 사진과 개수를 기록해주세요.',
        startDate: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000),
        endDate: oneWeekAgo,
        goal: 7, // 주 7회
        startAge: 15,
        endAge: null,
        gender: GenderType.NONE,
        maxMember: 30,
        creatorUuid: users[7].userUuid,
        participantUuid: [
          users[7].userUuid,
          users[1].userUuid,
          users[3].userUuid,
          users[5].userUuid,
        ],
        coinAmount: 80,
        isStarted: true,
        isFinished: true,
        successParticipantsUuid: [users[7].userUuid, users[1].userUuid],
      },
    ];

    for (const challengeData of challenges) {
      await challengeRepository.save(challengeData);
    }

    console.log('Challenge seeds created successfully!');
  }
}
