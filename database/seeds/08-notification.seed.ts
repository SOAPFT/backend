import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Notification } from '../../src/entities/notification.entity';
import { User } from '../../src/entities/user.entity';
import { Post } from '../../src/entities/post.entity';
import { Challenge } from '../../src/entities/challenge.entity';
import { NotificationType } from '../../src/types/notification.enum';

export class NotificationSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const notificationRepository = dataSource.getRepository(Notification);
    const userRepository = dataSource.getRepository(User);
    const postRepository = dataSource.getRepository(Post);
    const challengeRepository = dataSource.getRepository(Challenge);

    // 기존 데이터 확인
    const existingNotifications = await notificationRepository.find();
    if (existingNotifications.length > 0) {
      console.log('Notification seeds already exist, skipping...');
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

    // 챌린지 데이터 가져오기
    const challenges = await challengeRepository.find();
    if (challenges.length === 0) {
      console.log('No challenges found, please run challenge seeds first');
      return;
    }

    const notifications = [
      // 친구 요청 알림들
      {
        recipientUuid: users[0].userUuid,
        senderUuid: users[2].userUuid,
        type: NotificationType.FRIEND_REQUEST,
        title: '새로운 친구 요청',
        content: `${users[2].nickname}님이 친구 요청을 보냈습니다.`,
        data: {
          requesterId: users[2].userUuid,
          requesterNickname: users[2].nickname,
        },
        isRead: false,
        isSent: true,
      },
      {
        recipientUuid: users[0].userUuid,
        senderUuid: users[8].userUuid,
        type: NotificationType.FRIEND_REQUEST,
        title: '새로운 친구 요청',
        content: `${users[8].nickname}님이 친구 요청을 보냈습니다.`,
        data: {
          requesterId: users[8].userUuid,
          requesterNickname: users[8].nickname,
        },
        isRead: false,
        isSent: true,
      },
      {
        recipientUuid: users[3].userUuid,
        senderUuid: users[4].userUuid,
        type: NotificationType.FRIEND_REQUEST,
        title: '새로운 친구 요청',
        content: `${users[4].nickname}님이 친구 요청을 보냈습니다.`,
        data: {
          requesterId: users[4].userUuid,
          requesterNickname: users[4].nickname,
        },
        isRead: true,
        isSent: true,
      },
      // 친구 수락 알림들
      {
        recipientUuid: users[0].userUuid,
        senderUuid: users[1].userUuid,
        type: NotificationType.FRIEND_ACCEPTED,
        title: '친구 요청 수락',
        content: `${users[1].nickname}님이 친구 요청을 수락했습니다.`,
        data: {
          friendId: users[1].userUuid,
          friendNickname: users[1].nickname,
        },
        isRead: true,
        isSent: true,
      },
      {
        recipientUuid: users[4].userUuid,
        senderUuid: users[8].userUuid,
        type: NotificationType.FRIEND_ACCEPTED,
        title: '친구 요청 수락',
        content: `${users[8].nickname}님이 친구 요청을 수락했습니다.`,
        data: {
          friendId: users[8].userUuid,
          friendNickname: users[8].nickname,
        },
        isRead: true,
        isSent: true,
      },
      // 챌린지 시작 알림들
      {
        recipientUuid: users[0].userUuid,
        senderUuid: null,
        type: NotificationType.CHALLENGE_START,
        title: '챌린지 시작',
        content: '30일 매일 운동하기 챌린지가 시작되었습니다!',
        data: {
          challengeId: challenges[0].challengeUuid,
          challengeTitle: '30일 매일 운동하기',
        },
        isRead: true,
        isSent: true,
      },
      {
        recipientUuid: users[1].userUuid,
        senderUuid: null,
        type: NotificationType.CHALLENGE_START,
        title: '챌린지 시작',
        content: '하루 한 책 읽기 챌린지가 시작되었습니다!',
        data: {
          challengeId: challenges[1].challengeUuid,
          challengeTitle: '하루 한 책 읽기',
        },
        isRead: false,
        isSent: true,
      },
      // 새 메시지 알림들
      {
        recipientUuid: users[1].userUuid,
        senderUuid: users[0].userUuid,
        type: NotificationType.NEW_MESSAGE,
        title: '새 메시지',
        content: `${users[0].nickname}님이 메시지를 보냈습니다.`,
        data: {
          senderId: users[0].userUuid,
          senderNickname: users[0].nickname,
          messagePreview: '그러게요! 오늘 운동 인증 사진 보니까...',
        },
        isRead: false,
        isSent: true,
      },
      {
        recipientUuid: users[2].userUuid,
        senderUuid: users[7].userUuid,
        type: NotificationType.NEW_MESSAGE,
        title: '새 메시지',
        content: `${users[7].nickname}님이 메시지를 보냈습니다.`,
        data: {
          senderId: users[7].userUuid,
          senderNickname: users[7].nickname,
          messagePreview: '강남에 있는 요가 스튜디오에서...',
        },
        isRead: false,
        isSent: true,
      },
      // 게시글 좋아요 알림들
      {
        recipientUuid: users[0].userUuid,
        senderUuid: users[1].userUuid,
        type: NotificationType.POST_LIKE,
        title: '게시글 좋아요',
        content: `${users[1].nickname}님이 회원님의 게시글을 좋아합니다.`,
        data: {
          postId: posts[0].postUuid,
          postTitle: '오늘의 운동 성공!',
          likerId: users[1].userUuid,
          likerNickname: users[1].nickname,
        },
        isRead: true,
        isSent: true,
      },
      {
        recipientUuid: users[2].userUuid,
        senderUuid: users[0].userUuid,
        type: NotificationType.POST_LIKE,
        title: '게시글 좋아요',
        content: `${users[0].nickname}님이 회원님의 게시글을 좋아합니다.`,
        data: {
          postId: posts[2].postUuid,
          postTitle: '홈트레이닝 완성!',
          likerId: users[0].userUuid,
          likerNickname: users[0].nickname,
        },
        isRead: false,
        isSent: true,
      },
      // 게시글 댓글 알림들
      {
        recipientUuid: users[0].userUuid,
        senderUuid: users[1].userUuid,
        type: NotificationType.POST_COMMENT,
        title: '새 댓글',
        content: `${users[1].nickname}님이 회원님의 게시글에 댓글을 달았습니다.`,
        data: {
          postId: posts[0].postUuid,
          postTitle: '오늘의 운동 성공!',
          commenterId: users[1].userUuid,
          commenterNickname: users[1].nickname,
          commentPreview: '와 정말 대단하세요! 저도 운동 시작해야겠어요',
        },
        isRead: true,
        isSent: true,
      },
      {
        recipientUuid: users[2].userUuid,
        senderUuid: users[5].userUuid,
        type: NotificationType.POST_COMMENT,
        title: '새 댓글',
        content: `${users[5].nickname}님이 회원님의 게시글에 댓글을 달았습니다.`,
        data: {
          postId: posts[2].postUuid,
          postTitle: '홈트레이닝 완성!',
          commenterId: users[5].userUuid,
          commenterNickname: users[5].nickname,
          commentPreview: '홈트레이닝 정말 효과적이네요! 어떤 운동 하셨나요?',
        },
        isRead: false,
        isSent: true,
      },
      // 멘션 알림들
      {
        recipientUuid: users[1].userUuid,
        senderUuid: users[0].userUuid,
        type: NotificationType.MENTION,
        title: '멘션',
        content: `${users[0].nickname}님이 회원님을 언급했습니다.`,
        data: {
          postId: posts[0].postUuid,
          postTitle: '오늘의 운동 성공!',
          mentionerId: users[0].userUuid,
          mentionerNickname: users[0].nickname,
          commentPreview: `@${users[1].nickname} 함께 운동해요! 같이 하면 더 재미있을 것 같아요`,
        },
        isRead: true,
        isSent: true,
      },
      {
        recipientUuid: users[5].userUuid,
        senderUuid: users[2].userUuid,
        type: NotificationType.MENTION,
        title: '멘션',
        content: `${users[2].nickname}님이 회원님을 언급했습니다.`,
        data: {
          postId: posts[2].postUuid,
          postTitle: '홈트레이닝 완성!',
          mentionerId: users[2].userUuid,
          mentionerNickname: users[2].nickname,
          commentPreview: `@${users[5].nickname} 유튜브 영상 링크 공유해드릴게요! 정말 따라하기 쉬워요`,
        },
        isRead: false,
        isSent: true,
      },
      // 챌린지 종료 알림
      {
        recipientUuid: users[7].userUuid,
        senderUuid: null,
        type: NotificationType.CHALLENGE_END,
        title: '챌린지 완료',
        content: '하루 스쿼트 100개 챌린지가 종료되었습니다. 축하합니다!',
        data: {
          challengeId: challenges[7].challengeUuid,
          challengeTitle: '하루 스쿼트 100개',
          isSuccess: true,
        },
        isRead: true,
        isSent: true,
      },
      {
        recipientUuid: users[1].userUuid,
        senderUuid: null,
        type: NotificationType.CHALLENGE_END,
        title: '챌린지 완료',
        content: '하루 스쿼트 100개 챌린지가 종료되었습니다. 축하합니다!',
        data: {
          challengeId: challenges[7].challengeUuid,
          challengeTitle: '하루 스쿼트 100개',
          isSuccess: true,
        },
        isRead: true,
        isSent: true,
      },
    ];

    for (const notificationData of notifications) {
      await notificationRepository.save(notificationData);
    }

    console.log('Notification seeds created successfully!');
  }
}
