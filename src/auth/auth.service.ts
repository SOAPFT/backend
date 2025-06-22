import { Auth } from '@/entities/auth.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialRequest } from './auth.controller';
import { Request, Response } from 'express';
import { UsersService } from '@/modules/users/users.service';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { customAlphabet } from 'nanoid';
import axios from 'axios';
import * as bcrypt from 'bcryptjs';
import { SocialProvider } from '@/types/social-provider.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private async handleSocialLogin(user: SocialRequest['user'], res: Response) {
    // 유저 중복 검사
    let findUser = await this.userService.findOneBySocialId(user.socialId);
    if (!findUser) {
      // 없는 유저면 DB에 유저정보 저장
      const uuid = uuidv4();
      findUser = await this.userService.createUser(user, uuid);
    }

    // 카카오 가입이 되어 있는 경우 accessToken 및 refreshToken 발급
    const findUserPayload = { userUuid: findUser.userUuid };
    const access_token = await this.jwtService.sign(findUserPayload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    });

    const refresh_token = await this.jwtService.sign(findUserPayload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    });

    const existingAuth = await this.authRepository.findOne({
      where: { userUuid: findUser.userUuid },
    });

    const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);

    if (existingAuth) {
      existingAuth.refreshToken = hashedRefreshToken;
      await this.authRepository.save(existingAuth);
    } else {
      const newAuth = await this.authRepository.create({
        userUuid: findUser.userUuid,
        refreshToken: hashedRefreshToken,
      });
      await this.authRepository.save(newAuth);
    }

    return res.json({
      access_token,
      refresh_token,
      message: '로그인 성공',
    });
  }

  async kakaoLogin(code: string, res: Response) {
    try {
      // 1. 인가 코드로 access token 요청
      const tokenResponse = await axios.post(
        'https://kauth.kakao.com/oauth/token',
        null,
        {
          params: {
            grant_type: 'authorization_code',
            client_id: process.env.KAKAO_REST_API_KEY,
            redirect_uri: process.env.KAKAO_REDIRECT_URL,
            code: code,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const kakaoAccessToken = tokenResponse.data.access_token;

      // 2. 카카오 access_token으로 사용자 정보 요청
      const userResponse = await axios.get(
        'https://kapi.kakao.com/v2/user/me',
        {
          headers: {
            Authorization: `Bearer ${kakaoAccessToken}`,
          },
        },
      );

      const kakaoUser = userResponse.data;

      const randomId = customAlphabet(
        '0123456789abcdefghijklmnopqrstuvwxyz',
        4,
      );

      const user = {
        socialId: kakaoUser.id.toString(),
        socialNickname: kakaoUser.properties?.nickname || '',
        nickname: `익명_${randomId()}`,
        profileImage: kakaoUser.properties?.profile_image || '',
        socialProvider: SocialProvider.KAKAO,
        introduction: null,
      };
      return await this.handleSocialLogin(user, res);
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: '카카오 로그인 실패', error });
    }
  }

  // naver login
  async naverLogin(code: string, res: Response) {
    try {
      // 1. 네이버 토큰 요청
      const tokenRes = await axios.post(
        'https://nid.naver.com/oauth2.0/token',
        null,
        {
          params: {
            grant_type: 'authorization_code',
            client_id: process.env.NAVER_ID,
            client_secret: process.env.NAVER_SECRET,
            code,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const accessToken = tokenRes.data.access_token;

      // 2. 유저 정보 요청
      const userRes = await axios.get('https://openapi.naver.com/v1/nid/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const profile = userRes.data.response;
      const randomId = customAlphabet(
        '0123456789abcdefghijklmnopqrstuvwxyz',
        4,
      );

      const user = {
        socialId: profile.id,
        socialNickname: profile.nickname || '',
        nickname: `익명_${randomId()}`,
        profileImage: profile.profile_image || '',
        socialProvider: SocialProvider.NAVER,
        introduction: null,
      };

      return this.handleSocialLogin(user, res);
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: '네이버 로그인 실패', error });
    }
  }

  // refreshToken으로 accessToken 재발급
  async RefreshToken(req: Request, res: Response) {
    console.log('req.headers: ', req.headers);
    const refreshToken = req.headers['authorization']?.replace('Bearer ', '');
    console.log('refreshToken:', refreshToken);

    if (!refreshToken) {
      return res.status(401).json({ message: '리프레시 토큰 없음' });
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
        console.log('에러나옴');
        return res.status(401).json({ message: '유효하지 않음' });
      }
      console.log('auth.refereshToken:', auth.refreshToken);

      if (!auth || !(await bcrypt.compare(refreshToken, auth.refreshToken))) {
        return res.status(401).json({ message: '리프레시 토큰 불일치' });
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

        access_token: newAccessToken,
        refresh_token: newRefreshToken ? newRefreshToken : null,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(401)
        .json({ message: '리프레시 토큰 만료 혹은 잘못됨' });
    }
  }

  async generateDevToken(userUuid: string, res: Response) {
    try {
      // 유저가 존재하는지 확인
      await this.userService.checkUserExists(userUuid);

      // 토큰 페이로드
      const payload = { userUuid };

      // 액세스 토큰 발급
      const access_token = await this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: '30d',
      });

      // 리프레시 토큰 발급
      const refresh_token = await this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: '30d',
      });

      // 리프레시 토큰 해싱 및 저장
      const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);

      // 기존 인증 정보 확인 및 업데이트 또는 생성
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

      return res.json({
        access_token,
        refresh_token,
      });
    } catch (error) {
      console.error('개발용 토큰 생성 에러:', error);
      return res.status(500).json({
        message: '개발용 토큰 생성 실패',
        error: error.message,
      });
    }
  }
}
