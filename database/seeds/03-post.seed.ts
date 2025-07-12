import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Post } from '../../src/entities/post.entity';
import { User } from '../../src/entities/user.entity';
import { Challenge } from '../../src/entities/challenge.entity';
import { ulid } from 'ulid';

export class PostSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const postRepository = dataSource.getRepository(Post);
    const userRepository = dataSource.getRepository(User);
    const challengeRepository = dataSource.getRepository(Challenge);

    // 기존 데이터 확인
    const existingPosts = await postRepository.find();
    if (existingPosts.length > 0) {
      console.log('Post seeds already exist, skipping...');
      return;
    }

    // 사용자 데이터 가져오기
    const users = await userRepository.find();
    if (users.length === 0) {
      console.log('No users found, please run user seeds first');
      return;
    }

    // 챌린지 데이터 가져오기
    const challenges = await challengeRepository.find();
    if (challenges.length === 0) {
      console.log('No challenges found, please run challenge seeds first');
      return;
    }

    const posts = [
      // 운동 관련 챌린지 게시글들
      {
        postUuid: ulid(),
        title: '오늘의 운동 성공!',
        userUuid: users[0].userUuid,
        challengeUuid: challenges[0].challengeUuid, // 30일 매일 운동하기
        content:
          '오늘도 30분 러닝머신으로 운동했어요! 땀이 많이 났지만 기분이 좋습니다 💪',
        imageUrl: [
          'https://picsum.photos/600/400?random=301',
          'https://picsum.photos/600/400?random=302',
        ],
        isPublic: true,
        views: 45,
      },
      {
        postUuid: ulid(),
        title: '10,000보 달성! 🚶‍♂️',
        userUuid: users[1].userUuid,
        challengeUuid: challenges[1].challengeUuid, // 10,000보 걷기 챌린지
        content:
          '오늘 목표했던 10,000보 달성했어요! 한강공원 걸으면서 맑은 공기도 마시고 정말 상쾌합니다 🌳',
        imageUrl: ['https://picsum.photos/600/400?random=303'],
        isPublic: true,
        views: 23,
      },
      {
        postUuid: ulid(),
        title: '홈트레이닝 완성!',
        userUuid: users[2].userUuid,
        challengeUuid: challenges[2].challengeUuid, // 홈트레이닝 챌린지
        content:
          '집에서 하는 운동이 이렇게 효과적일 줄 몰랐어요! 유튜브 영상 보며 열심히 했습니다 🏃‍♀️',
        imageUrl: [
          'https://picsum.photos/600/400?random=304',
          'https://picsum.photos/600/400?random=305',
        ],
        isPublic: true,
        views: 67,
      },
      {
        postUuid: ulid(),
        title: '요가 수업 후 힐링 타임',
        userUuid: users[3].userUuid,
        challengeUuid: challenges[3].challengeUuid, // 요가 챌린지
        content:
          '오늘 요가 수업이 특히 힘들었지만 끝나고 나니 몸이 정말 가벼워요 🧘‍♀️',
        imageUrl: ['https://picsum.photos/600/400?random=306'],
        isPublic: true,
        views: 34,
      },
      {
        postUuid: ulid(),
        title: '하루 2리터 물마시기 성공!',
        userUuid: users[4].userUuid,
        challengeUuid: challenges[4].challengeUuid, // 매일 2리터 물마시기 챌린지
        content:
          '매일 2리터 물마시기 챌린지 5일째! 피부가 좋아지는 것 같아요. 계속 도전해보겠습니다 💧',
        imageUrl: ['https://picsum.photos/600/400?random=307'],
        isPublic: true,
        views: 52,
      },
      {
        postUuid: ulid(),
        title: '러닝 5km 완주! 🏃‍♂️',
        userUuid: users[5].userUuid,
        challengeUuid: challenges[5].challengeUuid, // 러닝 마라톤 준비
        content:
          '마라톤 준비 챌린지 일환으로 5km 달렸어요! 숨이 차지만 완주의 기쁨이 더 큽니다 🎽',
        imageUrl: ['https://picsum.photos/600/400?random=308'],
        isPublic: true,
        views: 28,
      },
      {
        postUuid: ulid(),
        title: '헬스장에서 웨이트 트레이닝',
        userUuid: users[6].userUuid,
        challengeUuid: challenges[6].challengeUuid, // 웨이트 트레이닝 챌린지
        content: '오늘 데드리프트 개인 기록 갱신! 100kg 성공했습니다 🏋️‍♂️',
        imageUrl: ['https://picsum.photos/600/400?random=309'],
        isPublic: true,
        views: 89,
      },
      {
        postUuid: ulid(),
        title: '스쿼트 100개 달성!',
        userUuid: users[7].userUuid,
        challengeUuid: challenges[7].challengeUuid, // 하루 스쿼트 100개 챌린지
        content:
          '드디어 스쿼트 100개 완료! 처음엔 50개도 힘들었는데 이제 100개까지 할 수 있어요 💪',
        imageUrl: ['https://picsum.photos/600/400?random=310'],
        isPublic: true,
        views: 41,
      },
      // 추가 운동 관련 게시글들
      {
        postUuid: ulid(),
        title: '아침 산책으로 하루 시작',
        userUuid: users[8].userUuid,
        challengeUuid: challenges[1].challengeUuid, // 10,000보 걷기 챌린지
        content:
          '날씨가 너무 좋아서 아침 일찍 산책 나왔어요! 벚꽃길 걸으며 만보 채우는 중입니다 🌸',
        imageUrl: [
          'https://picsum.photos/600/400?random=311',
          'https://picsum.photos/600/400?random=312',
        ],
        isPublic: true,
        views: 76,
      },
      {
        postUuid: ulid(),
        title: '헬스장 운동 루틴 완성',
        userUuid: users[1].userUuid,
        challengeUuid: challenges[0].challengeUuid, // 30일 매일 운동하기
        content:
          '매일 운동하기 챌린지 2주차! 오늘은 상체 위주로 운동했어요. 근력이 많이 늘었습니다 💪',
        imageUrl: ['https://picsum.photos/600/400?random=313'],
        isPublic: true,
        views: 95,
      },
      {
        postUuid: ulid(),
        title: '홈트 새로운 동작 도전',
        userUuid: users[0].userUuid,
        challengeUuid: challenges[2].challengeUuid, // 홈트레이닝 챌린지
        content:
          '오늘은 새로운 홈트 동작에 도전했어요! 생각보다 어렵지만 재미있어요 🤸‍♀️',
        imageUrl: ['https://picsum.photos/600/400?random=314'],
        isPublic: true,
        views: 38,
      },
      {
        postUuid: ulid(),
        title: '가족과 함께 자전거 라이딩',
        userUuid: users[2].userUuid,
        challengeUuid: challenges[0].challengeUuid, // 30일 매일 운동하기
        content:
          '가족과 함께 한강 자전거 도로 라이딩! 아이들도 너무 좋아하고 운동도 되고 일석이조 🚴‍♀️',
        imageUrl: [
          'https://picsum.photos/600/400?random=315',
          'https://picsum.photos/600/400?random=316',
        ],
        isPublic: true,
        views: 62,
      },
      {
        postUuid: ulid(),
        title: '개인 운동 기록',
        userUuid: users[3].userUuid,
        challengeUuid: challenges[3].challengeUuid, // 요가 챌린지
        content:
          '요가 수업에서 배운 새로운 자세들을 연습해보고 있어요. 유연성이 늘고 있는 것 같아요 🧘‍♀️',
        imageUrl: [],
        isPublic: false,
        views: 1,
      },
      {
        postUuid: ulid(),
        title: '러닝 앱으로 기록 관리 시작',
        userUuid: users[8].userUuid,
        challengeUuid: challenges[5].challengeUuid, // 러닝 마라톤 준비
        content:
          '마라톤 준비를 위해 러닝 앱으로 기록 관리 시작했어요! 체계적으로 훈련해보겠습니다 📱',
        imageUrl: ['https://picsum.photos/600/400?random=317'],
        isPublic: true,
        views: 44,
      },
      {
        postUuid: ulid(),
        title: '운동 후 건강한 간식',
        userUuid: users[4].userUuid,
        challengeUuid: challenges[4].challengeUuid, // 매일 2리터 물마시기 챌린지
        content:
          '운동 후 단백질 셰이크와 물 한 잔! 건강한 습관을 만들어가고 있어요 🥤',
        imageUrl: ['https://picsum.photos/600/400?random=318'],
        isPublic: true,
        views: 29,
      },
    ];

    for (const postData of posts) {
      await postRepository.save(postData);
    }

    console.log('Post seeds created successfully!');
  }
}
