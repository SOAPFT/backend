import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Comment } from '../../src/entities/comment.entity';
import { User } from '../../src/entities/user.entity';
import { Post } from '../../src/entities/post.entity';

export class CommentSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const commentRepository = dataSource.getRepository(Comment);
    const userRepository = dataSource.getRepository(User);
    const postRepository = dataSource.getRepository(Post);

    // 기존 데이터 확인
    const existingComments = await commentRepository.find();
    if (existingComments.length > 0) {
      console.log('Comment seeds already exist, skipping...');
      return;
    }

    // 사용자 데이터 가져오기
    const users = await userRepository.find();
    if (users.length === 0) {
      console.log('No users found, please run user seeds first');
      return;
    }

    // 게시글 데이터 가져오기
    const posts = await postRepository.find();
    if (posts.length === 0) {
      console.log('No posts found, please run post seeds first');
      return;
    }

    const comments = [
      // 첫 번째 게시글의 댓글들 (오늘의 운동 성공!)
      {
        userUuid: users[1].userUuid,
        postUuid: posts[0].postUuid,
        parentCommentId: null,
        content: '와 정말 대단하세요! 저도 운동 시작해야겠어요 💪',
        mentionedUsers: [],
      },
      {
        userUuid: users[2].userUuid,
        postUuid: posts[0].postUuid,
        parentCommentId: null,
        content: '매일 운동하는 거 정말 쉽지 않은데... 존경합니다!',
        mentionedUsers: [],
      },
      {
        userUuid: users[0].userUuid,
        postUuid: posts[0].postUuid,
        parentCommentId: 1, // 첫 번째 댓글에 대한 대댓글
        content: `@${users[1].nickname} 함께 운동해요! 같이 하면 더 재미있을 것 같아요 😊`,
        mentionedUsers: [users[1].nickname],
      },
      // 두 번째 게시글의 댓글들 (10,000보 달성!)
      {
        userUuid: users[4].userUuid,
        postUuid: posts[1].postUuid,
        parentCommentId: null,
        content: '10,000보 달성 축하해요! 저도 걷기 챌린지 참여하고 싶어요 🚶‍♂️',
        mentionedUsers: [],
      },
      {
        userUuid: users[8].userUuid,
        postUuid: posts[1].postUuid,
        parentCommentId: null,
        content: '한강공원이 정말 걷기 좋죠! 저도 자주 가요',
        mentionedUsers: [],
      },
      // 세 번째 게시글의 댓글들 (홈트레이닝 완성!)
      {
        userUuid: users[5].userUuid,
        postUuid: posts[2].postUuid,
        parentCommentId: null,
        content: '홈트레이닝 정말 효과적이네요! 어떤 운동 하셨나요? 🏃‍♀️',
        mentionedUsers: [],
      },
      {
        userUuid: users[7].userUuid,
        postUuid: posts[2].postUuid,
        parentCommentId: null,
        content:
          '집에서 하는 운동이 이렇게 좋을줄 몰랐네요! 저도 시도해보겠어요',
        mentionedUsers: [],
      },
      {
        userUuid: users[2].userUuid,
        postUuid: posts[2].postUuid,
        parentCommentId: 6, // 첫 번째 댓글에 대한 대댓글
        content: `@${users[5].nickname} 유튜브 영상 링크 공유해드릴게요! 정말 따라하기 쉬워요 😊`,
        mentionedUsers: [users[5].nickname],
      },
      // 네 번째 게시글의 댓글들 (요가 수업 후 힐링 타임)
      {
        userUuid: users[1].userUuid,
        postUuid: posts[3].postUuid,
        parentCommentId: null,
        content: '요가 정말 좋아보여요! 어디서 배우시나요?',
        mentionedUsers: [],
      },
      {
        userUuid: users[7].userUuid,
        postUuid: posts[3].postUuid,
        parentCommentId: null,
        content: '요가 마스터시네요! 동작이 정말 우아해요 🧘‍♀️',
        mentionedUsers: [],
      },
      // 다섯 번째 게시글의 댓글들 (하루 2리터 물마시기 성공!)
      {
        userUuid: users[0].userUuid,
        postUuid: posts[4].postUuid,
        parentCommentId: null,
        content: '물 마시기 챌린지 정말 좋으시네요! 저도 도전해보겠어요 💧',
        mentionedUsers: [],
      },
      {
        userUuid: users[6].userUuid,
        postUuid: posts[4].postUuid,
        parentCommentId: null,
        content: '2리터 매일 마시기 쉽지 않은데... 어떻게 하시나요?',
        mentionedUsers: [],
      },
      // 여섯 번째 게시글의 댓글들 (러닝 5km 완주!)
      {
        userUuid: users[3].userUuid,
        postUuid: posts[5].postUuid,
        parentCommentId: null,
        content: '5km 완주 정말 대단하세요! 마라톤 준비 화이팅입니다 🏃‍♂️',
        mentionedUsers: [],
      },
      // 일곱 번째 게시글의 댓글들 (헬스장에서 웨이트 트레이닝)
      {
        userUuid: users[4].userUuid,
        postUuid: posts[6].postUuid,
        parentCommentId: null,
        content:
          '100kg 데드리프트 대박이에요! 웨이트 트레이닝 정말 강하시네요 💪',
        mentionedUsers: [],
      },
      {
        userUuid: users[0].userUuid,
        postUuid: posts[6].postUuid,
        parentCommentId: null,
        content:
          '저도 웨이트 트레이닝 시작해야겠어요. 어떤 운동부터 시작하는게 좋을까요?',
        mentionedUsers: [],
      },
      {
        userUuid: users[6].userUuid,
        postUuid: posts[6].postUuid,
        parentCommentId: 15, // 이전 댓글에 대한 대댓글
        content: `@${users[0].nickname} 먼저 기본 자세부터 배우시는 게 좋아요! 안전이 제일 중요해요`,
        mentionedUsers: [users[0].nickname],
      },
      // 여덟 번째 게시글의 댓글들 (스쿼트 100개 달성!)
      {
        userUuid: users[5].userUuid,
        postUuid: posts[7].postUuid,
        parentCommentId: null,
        content:
          '스쿼트 100개 정말 대단해요! 다리 근육 진짜 강해지셨을 것 같아요 💪',
        mentionedUsers: [],
      },
      // 아홉 번째 게시글의 댓글들 (아침 산책으로 하루 시작)
      {
        userUuid: users[2].userUuid,
        postUuid: posts[8].postUuid,
        parentCommentId: null,
        content: '벚꽃길 산책 정말 예쁘네요! 만보 걷기 좋은 코스 같아요 🌸',
        mentionedUsers: [],
      },
      // 열 번째 게시글의 댓글들 (헬스장 운동 루틴 완성)
      {
        userUuid: users[5].userUuid,
        postUuid: posts[9].postUuid,
        parentCommentId: null,
        content:
          '운동 루틴 정말 체계적이시네요! 저도 참고해서 운동해보겠어요 💪',
        mentionedUsers: [],
      },
      // 열한 번째 게시글의 댓글들 (홈트 새로운 동작 도전)
      {
        userUuid: users[7].userUuid,
        postUuid: posts[10].postUuid,
        parentCommentId: null,
        content: '새로운 홈트 동작 도전 멋져요! 어떤 운동부터 시작하셨나요?',
        mentionedUsers: [],
      },
      // 열두 번째 게시글의 댓글들 (가족과 함께 자전거 라이딩)
      {
        userUuid: users[3].userUuid,
        postUuid: posts[11].postUuid,
        parentCommentId: null,
        content:
          '가족과 함께 자전거 라이딩 정말 좋아보여요! 운동도 되고 가족 시간도 갖고 일석이조네요 🚴‍♀️',
        mentionedUsers: [],
      },
    ];

    for (const commentData of comments) {
      await commentRepository.save(commentData);
    }

    console.log('Comment seeds created successfully!');
  }
}
