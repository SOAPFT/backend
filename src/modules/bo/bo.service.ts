import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Post } from '../../entities/post.entity';
import { Comment } from '../../entities/comment.entity';
import { Challenge } from '../../entities/challenge.entity';
import { Like } from '../../entities/like.entity';
import { Friendship } from '../../entities/friendship.entity';
import { ChatRoom } from '../../entities/chat-room.entity';
import { ChatMessage } from '../../entities/chat-message.entity';
import { Notification } from '../../entities/notification.entity';

@Injectable()
export class BoService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Challenge)
    private challengeRepository: Repository<Challenge>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Friendship)
    private friendshipRepository: Repository<Friendship>,
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  // === 통계 조회 ===
  async getDashboardStats() {
    const [
      totalUsers,
      totalPosts,
      totalComments,
      totalChallenges,
      totalLikes,
      totalFriendships,
      totalChatRooms,
      totalNotifications,
    ] = await Promise.all([
      this.userRepository.count(),
      this.postRepository.count(),
      this.commentRepository.count(),
      this.challengeRepository.count(),
      this.likeRepository.count(),
      this.friendshipRepository.count(),
      this.chatRoomRepository.count(),
      this.notificationRepository.count(),
    ]);

    // 오늘 생성된 데이터 수
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayUsers, todayPosts, todayComments, todayChallenges] =
      await Promise.all([
        this.userRepository.count({
          where: { createdAt: MoreThanOrEqual(today) },
        }),
        this.postRepository.count({
          where: { createdAt: MoreThanOrEqual(today) },
        }),
        this.commentRepository.count({
          where: { createdAt: MoreThanOrEqual(today) },
        }),
        this.challengeRepository.count({
          where: { createdAt: MoreThanOrEqual(today) },
        }),
      ]);

    return {
      total: {
        users: totalUsers,
        posts: totalPosts,
        comments: totalComments,
        challenges: totalChallenges,
        likes: totalLikes,
        friendships: totalFriendships,
        chatRooms: totalChatRooms,
        notifications: totalNotifications,
      },
      today: {
        users: todayUsers,
        posts: todayPosts,
        comments: todayComments,
        challenges: todayChallenges,
      },
    };
  }

  // === 사용자 관리 ===
  async getUsers(page: number = 1, limit: number = 20, search?: string) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (search) {
      queryBuilder.where(
        'user.nickname ILIKE :search OR user.socialNickname ILIKE :search',
        { search: `%${search}%` },
      );
    }

    const [users, total] = await queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserDetail(userUuid: string) {
    const user = await this.userRepository.findOne({
      where: { userUuid },
    });

    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    // 사용자의 통계 정보
    const [postCount, commentCount, likeCount, friendCount] = await Promise.all(
      [
        this.postRepository.count({ where: { userUuid } }),
        this.commentRepository.count({ where: { userUuid } }),
        this.likeRepository.count({ where: { userUuid } }),
        this.friendshipRepository.count({
          where: [{ requesterUuid: userUuid }, { addresseeUuid: userUuid }],
        }),
      ],
    );

    return {
      user,
      stats: {
        posts: postCount,
        comments: commentCount,
        likes: likeCount,
        friends: friendCount,
      },
    };
  }

  // === 게시글 관리 ===
  async getPosts(page: number = 1, limit: number = 20, search?: string) {
    const queryBuilder = this.postRepository.createQueryBuilder('post');

    if (search) {
      queryBuilder.where(
        'post.title ILIKE :search OR post.content ILIKE :search',
        { search: `%${search}%` },
      );
    }

    const [posts, total] = await queryBuilder
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPostDetail(postUuid: string) {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .where('post.postUuid = :postUuid', { postUuid })
      .getOne();

    if (!post) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }

    // 게시글의 댓글 조회
    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.postUuid = :postUuid', { postUuid })
      .orderBy('comment.createdAt', 'ASC')
      .getMany();

    // 게시글의 좋아요 수
    const likeCount = await this.likeRepository.count({
      where: { postUuid },
    });

    return {
      post,
      comments,
      likeCount,
    };
  }

  // === 댓글 관리 ===
  async getComments(page: number = 1, limit: number = 20, search?: string) {
    const queryBuilder = this.commentRepository.createQueryBuilder('comment');

    if (search) {
      queryBuilder.where('comment.content ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [comments, total] = await queryBuilder
      .orderBy('comment.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      comments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // === 챌린지 관리 ===
  async getChallenges(page: number = 1, limit: number = 20, search?: string) {
    const queryBuilder =
      this.challengeRepository.createQueryBuilder('challenge');

    if (search) {
      queryBuilder.where(
        'challenge.title ILIKE :search OR challenge.introduce ILIKE :search',
        { search: `%${search}%` },
      );
    }

    const [challenges, total] = await queryBuilder
      .orderBy('challenge.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      challenges,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getChallengeDetail(challengeUuid: string) {
    const challenge = await this.challengeRepository
      .createQueryBuilder('challenge')
      .where('challenge.challengeUuid = :challengeUuid', { challengeUuid })
      .getOne();

    if (!challenge) {
      throw new Error('챌린지를 찾을 수 없습니다.');
    }

    // 챌린지 관련 게시글 조회
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .where('post.challengeUuid = :challengeUuid', { challengeUuid })
      .orderBy('post.createdAt', 'DESC')
      .limit(10)
      .getMany();

    return {
      challenge,
      posts,
      participantCount: challenge.participantUuid?.length || 0,
      successCount: challenge.successParticipantsUuid?.length || 0,
    };
  }

  // === 알림 관리 ===
  async getNotifications(page: number = 1, limit: number = 20) {
    const [notifications, total] = await this.notificationRepository
      .createQueryBuilder('notification')
      .orderBy('notification.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // === 친구 관계 관리 ===
  async getFriendships(page: number = 1, limit: number = 20) {
    const [friendships, total] = await this.friendshipRepository
      .createQueryBuilder('friendship')
      .orderBy('friendship.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      friendships,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // === 사용자 수정/삭제 ===
  async updateUser(userUuid: string, updateData: any) {
    const user = await this.userRepository.findOne({
      where: { userUuid },
    });

    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    Object.assign(user, updateData);
    user.updatedAt = new Date();

    const updatedUser = await this.userRepository.save(user);

    return {
      success: true,
      message: '사용자 정보가 수정되었습니다.',
      user: updatedUser,
    };
  }

  async deleteUser(userUuid: string) {
    const user = await this.userRepository.findOne({
      where: { userUuid },
    });

    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    await this.userRepository.remove(user);

    return {
      success: true,
      message: '사용자가 삭제되었습니다.',
      deletedId: userUuid,
    };
  }

  // === 게시글 수정/삭제 ===
  async updatePost(postUuid: string, updateData: any) {
    const post = await this.postRepository.findOne({
      where: { postUuid },
    });

    if (!post) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }

    Object.assign(post, updateData);
    post.updatedAt = new Date();

    const updatedPost = await this.postRepository.save(post);

    return {
      success: true,
      message: '게시글이 수정되었습니다.',
      post: updatedPost,
    };
  }

  async deletePost(postUuid: string) {
    const post = await this.postRepository.findOne({
      where: { postUuid },
    });

    if (!post) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }

    await this.postRepository.remove(post);

    return {
      success: true,
      message: '게시글이 삭제되었습니다.',
      deletedId: postUuid,
    };
  }

  // === 댓글 수정/삭제 ===
  async updateComment(commentId: number, updateData: any) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error('댓글을 찾을 수 없습니다.');
    }

    Object.assign(comment, updateData);
    comment.updatedAt = new Date();

    const updatedComment = await this.commentRepository.save(comment);

    return {
      success: true,
      message: '댓글이 수정되었습니다.',
      comment: updatedComment,
    };
  }

  async deleteComment(commentId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error('댓글을 찾을 수 없습니다.');
    }

    await this.commentRepository.remove(comment);

    return {
      success: true,
      message: '댓글이 삭제되었습니다.',
      deletedId: commentId.toString(),
    };
  }

  // === 챌린지 수정/삭제 ===
  async updateChallenge(challengeUuid: string, updateData: any) {
    const challenge = await this.challengeRepository.findOne({
      where: { challengeUuid },
    });

    if (!challenge) {
      throw new Error('챌린지를 찾을 수 없습니다.');
    }

    Object.assign(challenge, updateData);
    challenge.updatedAt = new Date();

    const updatedChallenge = await this.challengeRepository.save(challenge);

    return {
      success: true,
      message: '챌린지가 수정되었습니다.',
      challenge: updatedChallenge,
    };
  }

  async deleteChallenge(challengeUuid: string) {
    const challenge = await this.challengeRepository.findOne({
      where: { challengeUuid },
    });

    if (!challenge) {
      throw new Error('챌린지를 찾을 수 없습니다.');
    }

    await this.challengeRepository.remove(challenge);

    return {
      success: true,
      message: '챌린지가 삭제되었습니다.',
      deletedId: challengeUuid,
    };
  }
}
