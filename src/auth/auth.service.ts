import { Auth } from '@/entities/auth.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialRequest } from './auth.controller';
import { Request, Response } from 'express';
import { UsersService } from '@/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import * as bcrypt from 'bcryptjs';
import { SocialProvider } from '@/types/social-provider.enum';
import { SocialLoginDto } from './dto/auth.dto';
import * as ms from 'ms';
import { UserStatusType } from '@/types/user-status.enum';
import { decodeTokenHeader } from '@/utils/apple-jwt.util';
import { JwksClient } from 'jwks-rsa';
import { JwtPayload } from './dto/oauth-apple.dto';
import { ulid } from 'ulid';
import { ErrorCode } from '@/types/error-code.enum';
import { CustomException } from '@/utils/custom-exception';
import { generateNickname } from 'starving-orange';

@Injectable()
export class AuthService {
  private jwksClient: JwksClient;
  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getRefreshTokenExpiryMs(): number {
    const expiresIn = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '14d';
    return typeof expiresIn === 'string' ? ms(expiresIn) : parseInt(expiresIn);
  }

  /**
   * 중복되지 않는 닉네임 생성
   * @returns 고유한 닉네임
   */
  private async generateUniqueNickname(): Promise<string> {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      try {
        // starving-orange 라이브러리로 닉네임 생성
        const generatedNickname = generateNickname();
        const existingUser = await this.userService.findOneByNickname(
          generatedNickname.nickname,
        );

        if (!existingUser) {
          return generatedNickname.nickname;
        }
      } catch (error) {
        console.error('starving-orange 라이브러리 오류:', error);
        // fallback으로 수동 닉네임 생성
        break;
      }

      attempts++;
    }

    // 최대 시도 횟수 도달 시 또는 라이브러리 오류 시 fallback 닉네임 생성
    const adjectives = [
      '귀여운',
      '멋진',
      '행복한',
      '즐거운',
      '신나는',
      '사랑스러운',
      '용감한',
      '친절한',
      '배고픈',
      '달콤한',
      '상냥한',
    ];
    const nouns = [
      '토마토',
      '바나나',
      '사과',
      '오렌지',
      '포도',
      '딸기',
      '배',
      '복숭아',
      '귤',
      '한라봉',
      '두리안',
      '코코넛',
      '브로콜리',
    ];

    const randomAdjective =
      adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const timestamp = Date.now().toString().slice(-4);

    return `${randomAdjective} ${randomNoun}_${timestamp}`;
  }

  private async handleSocialLogin(
    user: SocialRequest['user'],
    deviceInfo: { deviceId?: string; deviceType?: string; appVersion?: string },
    res: Response,
  ) {
    // 유저 중복 검사
    let isNewUser = false;
    let findUser = await this.userService.findOneBySocialId(user.socialId);

    if (!findUser) {
      // 없는 유저면 DB에 유저정보 저장
      const uuid = ulid();
      findUser = await this.userService.createUser(user, uuid);
      isNewUser = true;
    } else if (findUser.status === UserStatusType.INCOMPLETE) {
      // 유저 정보 있는데 미완성
      isNewUser = true;
    }

    // accessToken 및 refreshToken 발급
    const findUserPayload = { userUuid: findUser.userUuid };
    const access_token = await this.jwtService.sign(findUserPayload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    });

    const refresh_token = await this.jwtService.sign(findUserPayload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    });

    const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);

    const existingAuth = await this.authRepository.findOne({
      where: { userUuid: findUser.userUuid },
    });

    const now = new Date();
    const authData = {
      userUuid: findUser.userUuid,
      refreshToken: hashedRefreshToken,
      deviceId: deviceInfo.deviceId || null,
      deviceType: deviceInfo.deviceType || null,
      appVersion: deviceInfo.appVersion || null,
      lastLoginAt: now,
      expiresAt: new Date(now.getTime() + this.getRefreshTokenExpiryMs()),
    };

    if (existingAuth) {
      Object.assign(existingAuth, authData);
      await this.authRepository.save(existingAuth);
    } else {
      const newAuth = this.authRepository.create(authData);
      await this.authRepository.save(newAuth);
    }

    return res.json({
      accessToken: access_token,
      refreshToken: refresh_token,
      isNewUser,
      message: '로그인 성공',
    });
  }

  async kakaoLogin(body: SocialLoginDto, res: Response) {
    try {
      // 카카오 access_token으로 사용자 정보 요청
      const userResponse = await axios.get(
        'https://kapi.kakao.com/v2/user/me',
        {
          headers: {
            Authorization: `Bearer ${body.accessToken}`,
          },
        },
      );

      const kakaoUser = userResponse.data;

      // starving-orange로 고유한 닉네임 생성
      const uniqueNickname = await this.generateUniqueNickname();

      console.log(kakaoUser);
      console.log(body);

      const user = {
        socialId: kakaoUser.id.toString(),
        socialNickname: kakaoUser.kakao_account?.profile.nickname || '',
        nickname: uniqueNickname,
        profileImage: kakaoUser.kakao_account?.profile.profile_image_url || '',
        socialProvider: SocialProvider.KAKAO,
        pushToken: body.pushToken || null,
      };
      return await this.handleSocialLogin(
        user,
        {
          deviceId: body.deviceId,
          deviceType: body.deviceType,
          appVersion: body.appVersion,
        },
        res,
      );
    } catch (error) {
      console.log(error);
      CustomException.throw(
        ErrorCode.UNAUTHORIZED,
        '유효하지 않은 토큰입니다.',
      );
    }
  }

  // naver login
  async naverLogin(body: SocialLoginDto, res: Response) {
    try {
      // 2. 유저 정보 요청
      const userRes = await axios.get('https://openapi.naver.com/v1/nid/me', {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      });

      const profile = userRes.data.response;

      // starving-orange로 고유한 닉네임 생성
      const uniqueNickname = await this.generateUniqueNickname();

      const user = {
        socialId: profile.id,
        socialNickname: profile.nickname || '',
        nickname: uniqueNickname,
        profileImage: profile.profile_image || '',
        socialProvider: SocialProvider.NAVER,
        pushToken: body.pushToken || null,
      };

      return this.handleSocialLogin(
        user,
        {
          deviceId: body.deviceId,
          deviceType: body.deviceType,
          appVersion: body.appVersion,
        },
        res,
      );
    } catch (error) {
      console.log(error);
      CustomException.throw(
        ErrorCode.UNAUTHORIZED,
        '유효하지 않은 토큰입니다.',
      );
    }
  }

  // apple login
  async appleLogin(body: SocialLoginDto, res: Response) {
    try {
      const identityToken = body.accessToken; // iOS에서 넘겨주는 Apple identity token

      // token의 header에서 kid 추출
      const header = decodeTokenHeader(identityToken);
      const kid = header.kid;

      // Apple 공개키 가져오기
      const key = await this.jwksClient.getSigningKey(kid);
      const publicKey = key.getPublicKey();

      // 토큰 검증 및 파싱
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        identityToken,
        {
          algorithms: ['RS256'],
          publicKey,
        },
      );

      const appleUserId = payload.sub;
      const email = payload.email || '';

      // starving-orange로 고유한 닉네임 생성
      const uniqueNickname = await this.generateUniqueNickname();

      const user = {
        socialId: appleUserId,
        socialNickname: email, // Apple은 닉네임 안 줘서 이메일 등으로 대체
        nickname: uniqueNickname,
        profileImage: null, // Apple은 이미지 정보 없음
        socialProvider: SocialProvider.APPLE,
        pushToken: body.pushToken || null,
      };

      return this.handleSocialLogin(
        user,
        {
          deviceId: body.deviceId,
          deviceType: body.deviceType,
          appVersion: body.appVersion,
        },
        res,
      );
    } catch (error) {
      console.log(error);
      CustomException.throw(
        ErrorCode.UNAUTHORIZED,
        '유효하지 않은 토큰입니다.',
      );
    }
  }

  // refreshToken으로 accessToken 재발급
  async RefreshToken(req: Request, res: Response) {
    console.log('req.headers: ', req.headers);
    const refreshToken = req.headers['authorization']?.replace('Bearer ', '');
    console.log('refreshToken:', refreshToken);

    if (!refreshToken) {
      CustomException.throw(
        ErrorCode.REFRESH_TOKEN_NOT_FOUND,
        '리프레시 토큰이 없습니다.',
      );
    }

    try {
      // 1. 리프레시 토큰 유효성 검사
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });

      console.log('payload:', payload);

      // 2. DB에 저장된 refreshToken과 비교
      const auth = await this.authRepository.findOne({
        where: { userUuid: payload.userUuid },
      });

      if (!auth) {
        CustomException.throw(ErrorCode.UNAUTHORIZED, '토큰이 유효하지 않음');
      }
      console.log('auth.refereshToken:', auth.refreshToken);

      if (!auth || !(await bcrypt.compare(refreshToken, auth.refreshToken))) {
        CustomException.throw(ErrorCode.UNAUTHORIZED, '리프레시 토큰 불일치');
      }

      // 3. 새 accessToken 발급
      const newAccessToken = this.jwtService.sign(
        {
          userUuid: payload.userUuid,
        },
        {
          secret: process.env.JWT_ACCESS_TOKEN_SECRET,
          expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRES_IN}`,
        },
      );

      // 리프레시 토큰 만료 여부 확인
      const nowInSec = Math.floor(Date.now() / 1000);
      let newRefreshToken = null;
      let hashedRefreshToken = null;

      if (payload.exp && payload.exp < nowInSec) {
        // refreshToken도 만료 => 새 refreshToken 재발급
        newRefreshToken = this.jwtService.sign(
          { userUuid: payload.userUuid },
          {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
            expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRES_IN}`,
          },
        );

        hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

        auth.refreshToken = hashedRefreshToken;
        await this.authRepository.save(auth);
      }

      return res.json({
        message: newRefreshToken
          ? 'accessToken 및 refreshToken 재발급 완료'
          : 'accessToken 재발급 완료',

        accessToken: newAccessToken,
        refreshToken: newRefreshToken ? newRefreshToken : null,
      });
    } catch (error) {
      console.log(error);
      CustomException.throw(
        ErrorCode.UNAUTHORIZED,
        '리프레시 토큰 만료 혹은 잘못됨',
      );
    }
  }

  async generateDevToken(res: Response) {
    try {
      // 1. 고정된 테스트용 userUuid (ENV에 없으면 fallback ULID 사용)
      const userUuid = '01JYKVN18MCW5B9FZ1PP7T14XS';

      // 2. 유저 존재 여부 확인
      const exists = await this.userService.checkUserExists(userUuid);

      // 3. 없으면 더미 유저 생성
      if (!exists) {
        await this.userService.createUser(
          {
            socialId: userUuid, // dev용 id
            socialNickname: '개발계정',
            nickname: '개발계정',
            profileImage: null,
            socialProvider: SocialProvider.KAKAO,
            pushToken: null,
          },
          userUuid,
        );
      }

      // 4. 토큰 페이로드
      const payload = { userUuid };

      // 5. 액세스 토큰 발급
      const access_token = await this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: '30d',
      });

      // 6. 리프레시 토큰 발급
      const refresh_token = await this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: '30d',
      });

      // 7. 리프레시 토큰 해싱
      const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);

      // 8. 기존 인증 정보 확인 후 저장/갱신
      const existingAuth = await this.authRepository.findOne({
        where: { userUuid },
      });

      if (existingAuth) {
        existingAuth.refreshToken = hashedRefreshToken;
        await this.authRepository.save(existingAuth);
      } else {
        const newAuth = this.authRepository.create({
          userUuid,
          refreshToken: hashedRefreshToken,
        });
        await this.authRepository.save(newAuth);
      }

      // 9. 응답 반환
      return res.json({
        accessToken: access_token,
        refreshToken: refresh_token,
      });
    } catch (error) {
      console.error('개발용 토큰 생성 에러:', error);
      CustomException.throw(
        ErrorCode.INTERNAL_SERVER_ERROR,
        '개발용 토큰 생성 실패',
      );
    }
  }

  //   async generateDevToken(userUuid: string, res: Response) {
  //     try {
  //       // 유저가 존재하는지 확인
  //       await this.userService.checkUserExists(userUuid);

  //       // 토큰 페이로드
  //       const payload = { userUuid };

  //       // 액세스 토큰 발급
  //       const access_token = await this.jwtService.sign(payload, {
  //         secret: process.env.JWT_ACCESS_TOKEN_SECRET,
  //         expiresIn: '30d',
  //       });

  //       // 리프레시 토큰 발급
  //       const refresh_token = await this.jwtService.sign(payload, {
  //         secret: process.env.JWT_REFRESH_TOKEN_SECRET,
  //         expiresIn: '30d',
  //       });

  //       // 리프레시 토큰 해싱 및 저장
  //       const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);

  //       // 기존 인증 정보 확인 및 업데이트 또는 생성
  //       const existingAuth = await this.authRepository.findOne({
  //         where: { userUuid },
  //       });

  //       if (existingAuth) {
  //         existingAuth.refreshToken = hashedRefreshToken;
  //         await this.authRepository.save(existingAuth);
  //       } else {
  //         const newAuth = this.authRepository.create({
  //           userUuid,
  //           refreshToken: hashedRefreshToken,
  //         });
  //         await this.authRepository.save(newAuth);
  //       }

  //       return res.json({
  //         accessToken: access_token,
  //         refreshToken: refresh_token,
  //       });
  //     } catch (error) {
  //       console.error('개발용 토큰 생성 에러:', error);
  //       CustomException.throw(
  //         ErrorCode.INTERNAL_SERVER_ERROR,
  //         '개발용 토큰 생성 실패',
  //       );
  //     }
  //   }
}
