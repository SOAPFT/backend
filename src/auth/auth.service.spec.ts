import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Auth } from '../entities/auth.entity';
import { UsersService } from '../modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { SocialProvider } from '../types/social-provider.enum';
import { UserStatusType } from '../types/user-status.enum';
import axios from 'axios';
import * as bcrypt from 'bcryptjs';

jest.mock('axios');
jest.mock('bcryptjs');
jest.mock('starving-orange', () => ({
  generateNickname: () => ({ nickname: '테스트닉네임' }),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let authRepository: jest.Mocked<Repository<Auth>>;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let response: jest.Mocked<Response>;

  const mockUser = {
    id: 1,
    userUuid: 'test-uuid-123',
    nickname: '테스트유저',
    socialId: '12345',
    socialProvider: SocialProvider.KAKAO,
    status: UserStatusType.ACTIVE,
    profileImage: 'test-image.jpg',
  };

  const mockAuth = {
    id: 1,
    userUuid: 'test-uuid-123',
    refreshToken: 'hashed-refresh-token',
    deviceId: 'test-device',
    deviceType: 'iOS',
    appVersion: '1.0.0',
    lastLoginAt: new Date(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Auth),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOneBySocialId: jest.fn(),
            findOneByNickname: jest.fn(),
            createUser: jest.fn(),
            checkUserExists: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            sign: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authRepository = module.get(getRepositoryToken(Auth));
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);

    response = {
      json: jest.fn(),
    } as any;

    process.env.JWT_ACCESS_TOKEN_SECRET = 'test-access-secret';
    process.env.JWT_REFRESH_TOKEN_SECRET = 'test-refresh-secret';
    process.env.JWT_ACCESS_TOKEN_EXPIRES_IN = '1h';
    process.env.JWT_REFRESH_TOKEN_EXPIRES_IN = '14d';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('kakaoLogin', () => {
    const mockKakaoUser = {
      id: 12345,
      kakao_account: {
        profile: {
          nickname: '카카오유저',
          profile_image_url: 'kakao-image.jpg',
        },
      },
    };

    const mockLoginDto = {
      accessToken: 'kakao-access-token',
      pushToken: 'push-token',
      deviceId: 'device-123',
      deviceType: 'iOS',
      appVersion: '1.0.0',
    };

    beforeEach(() => {
      mockedAxios.get.mockResolvedValue({ data: mockKakaoUser });
      jwtService.signAsync.mockResolvedValue('jwt-token');
      mockedBcrypt.hash.mockResolvedValue('hashed-token' as never);
    });

    it('should successfully login with existing user', async () => {
      usersService.findOneBySocialId.mockResolvedValue(mockUser as any);
      usersService.findOneByNickname.mockResolvedValue(null);
      authRepository.findOne.mockResolvedValue(mockAuth as any);
      authRepository.save.mockResolvedValue(mockAuth as any);

      await service.kakaoLogin(mockLoginDto, response);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://kapi.kakao.com/v2/user/me',
        { headers: { Authorization: 'Bearer kakao-access-token' } },
      );
      expect(response.json).toHaveBeenCalledWith({
        accessToken: 'jwt-token',
        refreshToken: 'jwt-token',
        isNewUser: false,
        message: '로그인 성공',
      });
    });

    it('should create new user when not exists', async () => {
      usersService.findOneBySocialId.mockResolvedValue(null);
      usersService.findOneByNickname.mockResolvedValue(null);
      usersService.createUser.mockResolvedValue(mockUser as any);
      authRepository.findOne.mockResolvedValue(null);
      authRepository.create.mockReturnValue(mockAuth as any);
      authRepository.save.mockResolvedValue(mockAuth as any);

      await service.kakaoLogin(mockLoginDto, response);

      expect(usersService.createUser).toHaveBeenCalled();
      expect(response.json).toHaveBeenCalledWith({
        accessToken: 'jwt-token',
        refreshToken: 'jwt-token',
        isNewUser: true,
        message: '로그인 성공',
      });
    });

    it('should throw error on invalid token', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Invalid token'));

      await expect(
        service.kakaoLogin(mockLoginDto, response),
      ).rejects.toThrow();
    });
  });

  describe('naverLogin', () => {
    const mockNaverUser = {
      response: {
        id: 'naver123',
        nickname: '네이버유저',
        profile_image: 'naver-image.jpg',
      },
    };

    const mockLoginDto = {
      accessToken: 'naver-access-token',
      pushToken: 'push-token',
      deviceId: 'device-123',
      deviceType: 'iOS',
      appVersion: '1.0.0',
    };

    beforeEach(() => {
      mockedAxios.get.mockResolvedValue({ data: mockNaverUser });
      jwtService.signAsync.mockResolvedValue('jwt-token');
      mockedBcrypt.hash.mockResolvedValue('hashed-token' as never);
    });

    it('should successfully login with naver', async () => {
      usersService.findOneBySocialId.mockResolvedValue(mockUser as any);
      usersService.findOneByNickname.mockResolvedValue(null);
      authRepository.findOne.mockResolvedValue(mockAuth as any);
      authRepository.save.mockResolvedValue(mockAuth as any);

      await service.naverLogin(mockLoginDto, response);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://openapi.naver.com/v1/nid/me',
        { headers: { Authorization: 'Bearer naver-access-token' } },
      );
      expect(response.json).toHaveBeenCalledWith({
        accessToken: 'jwt-token',
        refreshToken: 'jwt-token',
        isNewUser: false,
        message: '로그인 성공',
      });
    });
  });

  describe('RefreshToken', () => {
    const mockRequest = {
      headers: {
        authorization: 'Bearer refresh-token',
      },
    } as any;

    it('should refresh access token successfully', async () => {
      const payload = {
        userUuid: 'test-uuid-123',
        exp: Math.floor(Date.now() / 1000) + 1000,
      };

      jwtService.verifyAsync.mockResolvedValue(payload);
      authRepository.findOne.mockResolvedValue(mockAuth as any);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      jwtService.sign.mockReturnValue('new-access-token');

      await service.RefreshToken(mockRequest, response);

      expect(response.json).toHaveBeenCalledWith({
        message: 'accessToken 재발급 완료',
        accessToken: 'new-access-token',
        refreshToken: null,
      });
    });

    it('should throw error when refresh token is missing', async () => {
      const requestWithoutToken = { headers: {} } as any;

      await expect(
        service.RefreshToken(requestWithoutToken, response),
      ).rejects.toThrow();
    });

    it('should throw error when refresh token is invalid', async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(
        service.RefreshToken(mockRequest, response),
      ).rejects.toThrow();
    });
  });

  describe('generateDevToken', () => {
    it('should generate dev token successfully', async () => {
      usersService.checkUserExists.mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue('dev-token');
      mockedBcrypt.hash.mockResolvedValue('hashed-token' as never);
      authRepository.findOne.mockResolvedValue(mockAuth as any);
      authRepository.save.mockResolvedValue(mockAuth as any);

      await service.generateDevToken(response);

      expect(response.json).toHaveBeenCalledWith({
        accessToken: 'dev-token',
        refreshToken: 'dev-token',
      });
    });

    it('should create user if not exists', async () => {
      usersService.checkUserExists.mockResolvedValue(false);
      usersService.createUser.mockResolvedValue(mockUser as any);
      jwtService.signAsync.mockResolvedValue('dev-token');
      mockedBcrypt.hash.mockResolvedValue('hashed-token' as never);
      authRepository.findOne.mockResolvedValue(null);
      authRepository.create.mockReturnValue(mockAuth as any);
      authRepository.save.mockResolvedValue(mockAuth as any);

      await service.generateDevToken(response);

      expect(usersService.createUser).toHaveBeenCalled();
      expect(response.json).toHaveBeenCalledWith({
        accessToken: 'dev-token',
        refreshToken: 'dev-token',
      });
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
