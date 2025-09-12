import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from '@/entities/post.entity';
import { User } from '@/entities/user.entity';
import { Comment } from '@/entities/comment.entity';
import { Suspicion } from '@/entities/suspicion.entity';
import { Like } from '@/entities/like.entity';
import { ImageVerification } from '@/entities/image-verification.entity';
import { Challenge } from '@/entities/challenge.entity';
import { Repository } from 'typeorm';
import { LikesService } from '@/modules/likes/likes.service';
import { CommentsService } from '../comments/comments.service';
import { ChallengeService } from '../challenges/challenge.service';
import { UsersService } from '../users/users.service';
import { AiService } from '../ai/ai.service';
import { S3Service } from '../s3/s3.service';
import { SqsService } from '../sqs/sqs.service';
import { JwtService } from '@nestjs/jwt';
import { ChatbotService } from '../chatbot/chatbot.service';
import { CustomException } from '@/utils/custom-exception';
import { ErrorCode } from '@/types/error-code.enum';

jest.mock('ulid', () => ({
  ulid: () => 'test-ulid-123',
}));

describe('PostsService', () => {
  let service: PostsService;
  let postRepository: jest.Mocked<Repository<Post>>;
  let userRepository: jest.Mocked<Repository<User>>;
  let commentRepository: jest.Mocked<Repository<Comment>>;
  let suspicionRepository: jest.Mocked<Repository<Suspicion>>;
  let likeRepository: jest.Mocked<Repository<Like>>;
  let imageVerificationRepository: jest.Mocked<Repository<ImageVerification>>;
  let challengeRepository: jest.Mocked<Repository<Challenge>>;
  let likesService: jest.Mocked<LikesService>;
  let commentsService: jest.Mocked<CommentsService>;
  let challengeService: jest.Mocked<ChallengeService>;
  let usersService: jest.Mocked<UsersService>;
  let aiService: jest.Mocked<AiService>;
  let s3Service: jest.Mocked<S3Service>;
  let sqsService: jest.Mocked<SqsService>;
  let jwtService: jest.Mocked<JwtService>;
  let chatbotService: jest.Mocked<ChatbotService>;

  const mockPost = {
    id: 1,
    postUuid: 'test-post-uuid',
    userUuid: 'test-user-uuid',
    challengeUuid: 'test-challenge-uuid',
    title: '테스트 게시글',
    content: '테스트 내용',
    imageUrl: ['test-image.jpg'],
    isPublic: true,
    views: 10,
    verificationStatus: 'approved',
    aiConfidence: 95,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUser = {
    id: 1,
    userUuid: 'test-user-uuid',
    nickname: '테스트유저',
    profileImage: 'profile.jpg',
  };

  const mockChallenge = {
    id: 1,
    challengeUuid: 'test-challenge-uuid',
    title: '테스트 챌린지',
    introduce: '챌린지 설명',
    verificationGuide: '검증 가이드',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            findAndCount: jest.fn(),
            remove: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Comment),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnThis(),
              addSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              groupBy: jest.fn().mockReturnThis(),
              getRawMany: jest.fn(),
            }),
            count: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Suspicion),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Like),
          useValue: {
            findOne: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ImageVerification),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Challenge),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: LikesService,
          useValue: {
            getLikeCountsByPostIds: jest.fn(),
          },
        },
        {
          provide: CommentsService,
          useValue: {},
        },
        {
          provide: ChallengeService,
          useValue: {},
        },
        {
          provide: UsersService,
          useValue: {},
        },
        {
          provide: AiService,
          useValue: {},
        },
        {
          provide: S3Service,
          useValue: {
            uploadImage: jest.fn(),
          },
        },
        {
          provide: SqsService,
          useValue: {
            sendBatchImageVerificationTasks: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ChatbotService,
          useValue: {
            sendAuthCompletionMessage: jest.fn(),
            checkAllParticipantsAuthenticated: jest.fn(),
            sendGroupCompletionMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postRepository = module.get(getRepositoryToken(Post));
    userRepository = module.get(getRepositoryToken(User));
    commentRepository = module.get(getRepositoryToken(Comment));
    suspicionRepository = module.get(getRepositoryToken(Suspicion));
    likeRepository = module.get(getRepositoryToken(Like));
    imageVerificationRepository = module.get(
      getRepositoryToken(ImageVerification),
    );
    challengeRepository = module.get(getRepositoryToken(Challenge));
    likesService = module.get(LikesService);
    commentsService = module.get(CommentsService);
    challengeService = module.get(ChallengeService);
    usersService = module.get(UsersService);
    aiService = module.get(AiService);
    s3Service = module.get(S3Service);
    sqsService = module.get(SqsService);
    jwtService = module.get(JwtService);
    chatbotService = module.get(ChatbotService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPost', () => {
    const createPostDto = {
      title: '새 게시글',
      content: '게시글 내용',
      challengeUuid: 'challenge-123',
      imageUrl: ['image1.jpg'],
      isPublic: true,
    };

    it('should create post successfully', async () => {
      const savedPost = { ...mockPost, ...createPostDto };
      postRepository.create.mockReturnValue(savedPost as any);
      postRepository.save.mockResolvedValue(savedPost as any);
      chatbotService.sendAuthCompletionMessage.mockResolvedValue({} as any);
      chatbotService.checkAllParticipantsAuthenticated.mockResolvedValue(false);

      const result = await service.createPost(createPostDto, 'user-uuid');

      expect(postRepository.create).toHaveBeenCalledWith({
        postUuid: 'test-ulid-123',
        title: createPostDto.title,
        userUuid: 'user-uuid',
        challengeUuid: createPostDto.challengeUuid,
        content: createPostDto.content,
        imageUrl: createPostDto.imageUrl,
        isPublic: createPostDto.isPublic,
        verificationStatus: 'pending',
      });
      expect(postRepository.save).toHaveBeenCalledWith(savedPost);
      expect(result.message).toBe('게시물이 생성되었습니다.');
      expect(result.post).toEqual(savedPost);
    });
  });

  describe('updatePost', () => {
    const updateDto = {
      title: '수정된 제목',
      content: '수정된 내용',
    };

    it('should update post successfully', async () => {
      postRepository.findOne.mockResolvedValue(mockPost as any);
      postRepository.save.mockResolvedValue({
        ...mockPost,
        ...updateDto,
      } as any);

      const result = await service.updatePost(
        'test-post-uuid',
        updateDto,
        'test-user-uuid',
      );

      expect(postRepository.findOne).toHaveBeenCalledWith({
        where: { postUuid: 'test-post-uuid' },
      });
      expect(postRepository.save).toHaveBeenCalled();
      expect(result.message).toBe('게시글이 수정되었습니다.');
    });

    it('should throw error when post not found', async () => {
      postRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updatePost('nonexistent-uuid', updateDto, 'user-uuid'),
      ).rejects.toThrow();
    });

    it('should throw error when user is not the owner', async () => {
      const otherUserPost = { ...mockPost, userUuid: 'other-user-uuid' };
      postRepository.findOne.mockResolvedValue(otherUserPost as any);

      await expect(
        service.updatePost('test-post-uuid', updateDto, 'test-user-uuid'),
      ).rejects.toThrow();
    });
  });

  describe('getPostDetail', () => {
    it('should return post detail successfully', async () => {
      postRepository.findOne.mockResolvedValue(mockPost as any);
      postRepository.save.mockResolvedValue({ ...mockPost, views: 11 } as any);
      userRepository.findOne.mockResolvedValue(mockUser as any);
      likeRepository.count.mockResolvedValue(5);
      likeRepository.findOne.mockResolvedValue(null);
      suspicionRepository.count.mockResolvedValue(2);
      suspicionRepository.findOne.mockResolvedValue(null);

      const result = await service.getPostDetail(
        'test-post-uuid',
        'viewer-uuid',
      );

      expect(postRepository.findOne).toHaveBeenCalledWith({
        where: { postUuid: 'test-post-uuid' },
      });
      expect(result.message).toBe('게시글 상세 조회 성공');
      expect(result.post.views).toBe(11);
      expect(result.post.likeCount).toBe(5);
      expect(result.post.suspicionCount).toBe(2);
      expect(result.post.isMine).toBe(false);
    });

    it('should throw error when post not found', async () => {
      postRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getPostDetail('nonexistent-uuid', 'user-uuid'),
      ).rejects.toThrow();
    });
  });

  describe('deletePost', () => {
    it('should delete post successfully', async () => {
      postRepository.findOne.mockResolvedValue(mockPost as any);
      postRepository.remove.mockResolvedValue(mockPost as any);

      const result = await service.deletePost(
        'test-post-uuid',
        'test-user-uuid',
      );

      expect(postRepository.findOne).toHaveBeenCalledWith({
        where: { postUuid: 'test-post-uuid' },
      });
      expect(postRepository.remove).toHaveBeenCalledWith(mockPost);
      expect(result.message).toBe('게시글이 삭제되었습니다.');
    });

    it('should throw error when post not found', async () => {
      postRepository.findOne.mockResolvedValue(null);

      await expect(
        service.deletePost('nonexistent-uuid', 'user-uuid'),
      ).rejects.toThrow();
    });

    it('should throw error when user is not the owner', async () => {
      const otherUserPost = { ...mockPost, userUuid: 'other-user-uuid' };
      postRepository.findOne.mockResolvedValue(otherUserPost as any);

      await expect(
        service.deletePost('test-post-uuid', 'test-user-uuid'),
      ).rejects.toThrow();
    });
  });

  describe('getPostsByChallenge', () => {
    it('should return posts by challenge successfully', async () => {
      const mockPosts = [mockPost, { ...mockPost, id: 2, postUuid: 'post-2' }];
      postRepository.findAndCount.mockResolvedValue([mockPosts, 2] as any);
      likesService.getLikeCountsByPostIds.mockResolvedValue(
        new Map([
          ['test-post-uuid', 3],
          ['post-2', 5],
        ]),
      );
      const mockQueryBuilder = commentRepository.createQueryBuilder();
      (mockQueryBuilder.getRawMany as jest.Mock).mockResolvedValue([
        { postUuid: 'test-post-uuid', count: '2' },
        { postUuid: 'post-2', count: '1' },
      ]);
      userRepository.findOne.mockResolvedValue(mockUser as any);

      const result = await service.getPostsByChallenge('challenge-uuid', 1, 10);

      expect(postRepository.findAndCount).toHaveBeenCalledWith({
        where: { challengeUuid: 'challenge-uuid' },
        order: { createdAt: 'DESC' },
        skip: 0,
        take: 10,
      });
      expect(result.message).toBe('챌린지 게시글 목록 조회 성공');
      expect(result.total).toBe(2);
      expect(result.posts).toHaveLength(2);
    });

    it('should return empty array when no posts found', async () => {
      postRepository.findAndCount.mockResolvedValue([[], 0] as any);

      const result = await service.getPostsByChallenge('challenge-uuid', 1, 10);

      expect(result.posts).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('reportSuspiciousPost', () => {
    it('should report suspicious post successfully', async () => {
      suspicionRepository.findOne.mockResolvedValue(null);
      const mockReport = {
        id: 1,
        userUuid: 'user-uuid',
        postUuid: 'post-uuid',
      };
      suspicionRepository.create.mockReturnValue(mockReport as any);
      suspicionRepository.save.mockResolvedValue(mockReport as any);

      const result = await service.reportSuspiciousPost(
        'user-uuid',
        'post-uuid',
      );

      expect(suspicionRepository.findOne).toHaveBeenCalledWith({
        where: { userUuid: 'user-uuid', postUuid: 'post-uuid' },
      });
      expect(suspicionRepository.create).toHaveBeenCalledWith({
        userUuid: 'user-uuid',
        postUuid: 'post-uuid',
      });
      expect(result.message).toBe('의심하기 완료');
    });

    it('should throw error when already reported', async () => {
      const existingReport = {
        id: 1,
        userUuid: 'user-uuid',
        postUuid: 'post-uuid',
      };
      suspicionRepository.findOne.mockResolvedValue(existingReport as any);

      await expect(
        service.reportSuspiciousPost('user-uuid', 'post-uuid'),
      ).rejects.toThrow();
    });
  });

  describe('precheckImagesForChallenge', () => {
    const mockImages = [
      {
        originalname: 'test1.jpg',
        size: 1000000,
        buffer: Buffer.from('test'),
      },
      {
        originalname: 'test2.jpg',
        size: 2000000,
        buffer: Buffer.from('test2'),
      },
    ] as Express.Multer.File[];

    it('should precheck images successfully', async () => {
      challengeRepository.findOne.mockResolvedValue(mockChallenge as any);
      s3Service.uploadImage.mockResolvedValue(
        'https://s3.amazonaws.com/test.jpg',
      );
      imageVerificationRepository.create.mockReturnValue({
        id: 1,
        postUuid: 'test-ulid-123',
        imageUrl: 'https://s3.amazonaws.com/test.jpg',
        status: 'pending',
      } as any);
      imageVerificationRepository.save.mockResolvedValue({
        id: 1,
        postUuid: 'test-ulid-123',
        imageUrl: 'https://s3.amazonaws.com/test.jpg',
        status: 'pending',
      } as any);
      sqsService.sendBatchImageVerificationTasks.mockResolvedValue({} as any);
      jwtService.sign.mockReturnValue('verification-token');

      const result = await service.precheckImagesForChallenge(
        'challenge-uuid',
        mockImages,
        'user-uuid',
      );

      expect(challengeRepository.findOne).toHaveBeenCalledWith({
        where: { challengeUuid: 'challenge-uuid' },
      });
      expect(s3Service.uploadImage).toHaveBeenCalledTimes(2);
      expect(result.success).toBe(true);
      expect((result as any).postUuid).toBe('test-ulid-123');
      expect((result as any).verificationToken).toBe('verification-token');
      expect(result.canCreatePost).toBe(false);
    });

    it('should throw error when challenge not found', async () => {
      challengeRepository.findOne.mockResolvedValue(null);

      const result = await service.precheckImagesForChallenge(
        'nonexistent-challenge',
        mockImages,
        'user-uuid',
      );

      expect(result.success).toBe(false);
      expect(result.message).toContain('챌린지를 찾을 수 없습니다');
    });

    it('should throw error when no images provided', async () => {
      challengeRepository.findOne.mockResolvedValue(mockChallenge as any);

      const result = await service.precheckImagesForChallenge(
        'challenge-uuid',
        [],
        'user-uuid',
      );

      expect(result.success).toBe(false);
      expect(result.message).toContain('이미지가 필요합니다');
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
