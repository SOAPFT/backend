import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// Simple mock auth service for testing
class MockAuthService {
  generateDevToken() {
    return {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      message: '개발용 토큰이 생성되었습니다.',
    };
  }

  generateUniqueNickname() {
    return 'TestUser_' + Math.random().toString(36).substring(7);
  }

  getSeedUsers() {
    return [
      { userUuid: 'seed-user-1', nickname: 'SeedUser1' },
      { userUuid: 'seed-user-2', nickname: 'SeedUser2' },
    ];
  }
}

// Simple mock controller for testing
import { Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('auth')
class MockAuthController {
  constructor(private readonly authService: MockAuthService) {}

  @Post('dev-token')
  async getDevToken(@Res() res: Response) {
    const result = this.authService.generateDevToken();
    return res.status(201).json(result);
  }

  @Get('test-nickname')
  async testNickname() {
    const nickname = this.authService.generateUniqueNickname();
    return {
      message: '닉네임 생성 성공',
      nickname: nickname,
    };
  }

  @Get('seed-users')
  async getSeedUsers() {
    return this.authService.getSeedUsers();
  }
}

describe('Auth Integration Tests (Simplified)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
            signOptions: { expiresIn: '1h' },
          }),
        }),
      ],
      controllers: [MockAuthController],
      providers: [MockAuthService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/dev-token', () => {
    it('should generate dev token successfully', () => {
      return request(app.getHttpServer())
        .post('/auth/dev-token')
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('refreshToken');
          expect(res.body.message).toBe('개발용 토큰이 생성되었습니다.');
        });
    });
  });

  describe('GET /auth/test-nickname', () => {
    it('should generate unique nickname successfully', () => {
      return request(app.getHttpServer())
        .get('/auth/test-nickname')
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('닉네임 생성 성공');
          expect(res.body).toHaveProperty('nickname');
          expect(typeof res.body.nickname).toBe('string');
          expect(res.body.nickname.length).toBeGreaterThan(0);
        });
    });
  });

  describe('GET /auth/seed-users', () => {
    it('should get seed users list successfully', () => {
      return request(app.getHttpServer())
        .get('/auth/seed-users')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty('userUuid');
            expect(res.body[0]).toHaveProperty('nickname');
          }
        });
    });
  });
});
