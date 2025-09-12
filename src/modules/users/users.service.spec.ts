import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@/entities/user.entity';
import { Auth } from '@/entities/auth.entity';
import { Post } from '@/entities/post.entity';
import { Friendship } from '@/entities/friendship.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { SocialProvider } from '@/types/social-provider.enum';
import { UserStatusType } from '@/types/user-status.enum';
import { FriendshipStatus } from '@/types/friendship.enum';
import { GenderType } from '@/types/challenge.enum';
import { CustomException } from '@/utils/custom-exception';
import { ErrorCode } from '@/types/error-code.enum';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: jest.Mocked<Repository<User>>;
  let authRepository: jest.Mocked<Repository<Auth>>;
  let postRepository: jest.Mocked<Repository<Post>>;
  let friendshipRepository: jest.Mocked<Repository<Friendship>>;

  const mockUser = {
    id: 1,
    userUuid: 'test-uuid-123',
    nickname: '테스트유저',
    socialId: '12345',
    socialProvider: SocialProvider.KAKAO,
    socialNickname: '카카오유저',
    profileImage: 'test-image.jpg',
    introduction: '안녕하세요',
    birthDate: new Date('1990-01-01'),
    gender: 'M',
    status: UserStatusType.ACTIVE,
    coins: 100,
    pushToken: 'push-token',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Auth),
          useValue: {
            update: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Post),
          useValue: {
            count: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Friendship),
          useValue: {
            count: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
    authRepository = module.get(getRepositoryToken(Auth));
    postRepository = module.get(getRepositoryToken(Post));
    friendshipRepository = module.get(getRepositoryToken(Friendship));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateAge', () => {
    it('should calculate age correctly from Date object', () => {
      const birthDate = new Date('1990-01-01');
      const age = service.calculateAge(birthDate);
      const expectedAge = new Date().getFullYear() - 1990 + 1;
      expect(age).toBe(expectedAge);
    });

    it('should calculate age correctly from string', () => {
      const birthDate = '1995-06-15';
      const age = service.calculateAge(birthDate);
      const expectedAge = new Date().getFullYear() - 1995 + 1;
      expect(age).toBe(expectedAge);
    });
  });

  describe('findOneBySocialId', () => {
    it('should find user by social id', async () => {
      userRepository.findOneBy.mockResolvedValue(mockUser as any);

      const result = await service.findOneBySocialId('12345');

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        socialId: '12345',
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findOneBySocialId('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findOneByNickname', () => {
    it('should find user by nickname', async () => {
      userRepository.findOneBy.mockResolvedValue(mockUser as any);

      const result = await service.findOneByNickname('테스트유저');

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        nickname: '테스트유저',
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('createUser', () => {
    const userInput = {
      nickname: '새유저',
      socialNickname: '카카오새유저',
      profileImage: 'new-image.jpg',
      socialProvider: SocialProvider.KAKAO,
      socialId: '67890',
      pushToken: 'new-push-token',
    };

    it('should create user successfully', async () => {
      const newUser = {
        ...mockUser,
        ...userInput,
        status: UserStatusType.INCOMPLETE,
        coins: 20,
      };
      userRepository.create.mockReturnValue(newUser as any);
      userRepository.save.mockResolvedValue(newUser as any);

      const result = await service.createUser(userInput, 'new-uuid');

      expect(userRepository.create).toHaveBeenCalledWith({
        userUuid: 'new-uuid',
        nickname: userInput.nickname,
        socialNickname: userInput.socialNickname,
        profileImage: userInput.profileImage,
        socialProvider: userInput.socialProvider,
        socialId: userInput.socialId,
        pushToken: userInput.pushToken,
        coins: 20,
        status: UserStatusType.INCOMPLETE,
      });
      expect(userRepository.save).toHaveBeenCalledWith(newUser);
      expect(result).toEqual(newUser);
    });
  });

  describe('getUserIdByUuid', () => {
    it('should return user id when user exists', async () => {
      userRepository.findOne.mockResolvedValue({ id: 1 } as any);

      const result = await service.getUserIdByUuid('test-uuid');

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { userUuid: 'test-uuid' },
        select: ['id'],
      });
      expect(result).toBe(1);
    });

    it('should throw NotFoundException when user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.getUserIdByUuid('nonexistent-uuid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getUserByUuid', () => {
    it('should return user when exists', async () => {
      userRepository.findOne.mockResolvedValue(mockUser as any);

      const result = await service.getUserByUuid('test-uuid');

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { userUuid: 'test-uuid' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.getUserByUuid('nonexistent-uuid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('completeOnboarding', () => {
    const onboardingDto = {
      nickname: '새닉네임',
      gender: GenderType.FEMALE,
      birthDate: new Date('1995-01-01'),
    };

    it('should complete onboarding successfully', async () => {
      const incompleteUser = { ...mockUser, status: UserStatusType.INCOMPLETE };
      userRepository.findOne.mockResolvedValue(incompleteUser as any);
      userRepository.save.mockResolvedValue({
        ...incompleteUser,
        ...onboardingDto,
        status: UserStatusType.ACTIVE,
      } as any);

      const result = await service.completeOnboarding(
        'test-uuid',
        onboardingDto,
      );

      expect(userRepository.save).toHaveBeenCalled();
      expect(result).toEqual({
        statusCode: 201,
        message: '회원가입 완료',
      });
    });

    it('should throw error when user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        service.completeOnboarding('nonexistent-uuid', onboardingDto),
      ).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      authRepository.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.logout('test-uuid');

      expect(authRepository.update).toHaveBeenCalledWith(
        { userUuid: 'test-uuid' },
        { refreshToken: null },
      );
      expect(result).toEqual({ message: '로그아웃 성공' });
    });
  });

  describe('updateProfile', () => {
    const updateDto = {
      newNickname: '변경된닉네임',
      newIntroduction: '변경된소개',
      newProfileImg: 'new-profile.jpg',
    };

    it('should update profile successfully', async () => {
      userRepository.findOneBy.mockResolvedValue(mockUser as any);
      userRepository.save.mockResolvedValue({
        ...mockUser,
        ...updateDto,
      } as any);

      const result = await service.updateProfile('test-uuid', updateDto);

      expect(userRepository.save).toHaveBeenCalled();
      expect(result).toEqual({ message: '프로필이 수정되었습니다.' });
    });

    it('should throw error when user not found', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.updateProfile('nonexistent-uuid', updateDto),
      ).rejects.toThrow();
    });
  });

  describe('checkUserExists', () => {
    it('should return true when user exists', async () => {
      userRepository.findOne.mockResolvedValue(mockUser as any);

      const result = await service.checkUserExists('test-uuid');

      expect(result).toBe(true);
    });

    it('should return false when user does not exist', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await service.checkUserExists('nonexistent-uuid');

      expect(result).toBe(false);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      userRepository.findOneBy.mockResolvedValue(mockUser as any);
      userRepository.save.mockResolvedValue({
        ...mockUser,
        status: UserStatusType.DELETE,
        nickname: null,
        profileImage: null,
      } as any);

      const result = await service.deleteUser('test-uuid');

      expect(userRepository.save).toHaveBeenCalled();
      expect(result).toEqual({ message: '회원 탈퇴 성공!' });
    });

    it('should throw error when user not found', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      await expect(service.deleteUser('nonexistent-uuid')).rejects.toThrow();
    });
  });

  describe('getUserInfo', () => {
    it('should return user info successfully', async () => {
      userRepository.findOne.mockResolvedValue(mockUser as any);
      postRepository.count.mockResolvedValue(5);
      friendshipRepository.count.mockResolvedValue(10);

      const result = await service.getUserInfo('test-uuid');

      const expectedAge = new Date().getFullYear() - 1990 + 1;
      expect(result).toEqual({
        userName: mockUser.nickname,
        userImage: mockUser.profileImage,
        userIntroduction: mockUser.introduction,
        userUuid: mockUser.userUuid,
        userAge: expectedAge,
        coins: mockUser.coins,
        postCount: 5,
        friendCount: 10,
      });
    });

    it('should throw error when user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.getUserInfo('nonexistent-uuid')).rejects.toThrow();
    });
  });

  describe('getOtherUserInfo', () => {
    const mockFriendship = {
      id: 1,
      requesterUuid: 'viewer-uuid',
      addresseeUuid: 'test-uuid',
      status: FriendshipStatus.ACCEPTED,
    };

    it('should return other user info with friend status', async () => {
      userRepository.findOne.mockResolvedValue(mockUser as any);
      postRepository.count.mockResolvedValue(3);
      friendshipRepository.count.mockResolvedValue(8);
      friendshipRepository.findOne.mockResolvedValue(mockFriendship as any);

      const result = await service.getOtherUserInfo('viewer-uuid', 'test-uuid');

      const expectedAge = new Date().getFullYear() - 1990 + 1;
      expect(result).toEqual({
        userName: mockUser.nickname,
        userImage: mockUser.profileImage,
        userIntroduction: mockUser.introduction,
        userUuid: mockUser.userUuid,
        userAge: expectedAge,
        postCount: 3,
        friendCount: 8,
        friendStatus: 'friends',
        friendId: 1,
      });
    });

    it('should return no_relation status when no friendship exists', async () => {
      userRepository.findOne.mockResolvedValue(mockUser as any);
      postRepository.count.mockResolvedValue(3);
      friendshipRepository.count.mockResolvedValue(8);
      friendshipRepository.findOne.mockResolvedValue(null);

      const result = await service.getOtherUserInfo('viewer-uuid', 'test-uuid');

      expect(result.friendStatus).toBe('no_relation');
      expect(result.friendId).toBeNull();
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
