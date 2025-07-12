import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import {
  ApiDevToken,
  ApiKakaoLogin,
  ApiNaverLogin,
  ApiAppleLogin,
  ApiRefreshToken,
  ApiTestAuth,
} from './decorators/auth.swagger';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { SocialLoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserUuid } from '@/decorators/user-uuid.decorator';

export interface SocialRequest {
  user: {
    socialId: string;
    nickname: string;
    profileImage: string;
    socialProvider: string;
  };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('kakao')
  @ApiKakaoLogin()
  async kakaoAuthCallback(
    @Body()
    body: SocialLoginDto,
    @Res() res: Response,
  ) {
    return this.authService.kakaoLogin(body, res);
  }

  @Post('naver')
  @ApiNaverLogin()
  async naverAuthCallback(@Body() body: SocialLoginDto, @Res() res: Response) {
    return this.authService.naverLogin(body, res);
  }

  @Post('apple')
  @ApiAppleLogin()
  async appleAuthCallback(@Body() body: SocialLoginDto, @Res() res: Response) {
    return this.authService.appleLogin(body, res);
  }

  // refreshToken으로 accessToken 재발급
  @Post('refresh')
  @ApiRefreshToken()
  async Refresh(@Req() req: Request, @Res() res: Response) {
    return this.authService.RefreshToken(req, res);
  }

  @Post('dev-token')
  @ApiDevToken()
  async getDevToken(@Res() res: Response) {
    return this.authService.generateDevToken(res);
  }

  @Post('seed-tokens')
  @ApiOperation({
    summary: '시드 데이터 유저들의 토큰 생성',
    description:
      '개발 환경에서만 사용 가능한 시드 데이터 유저들의 JWT 토큰을 생성합니다.',
  })
  async getSeedUsersTokens(@Res() res: Response) {
    return this.authService.generateSeedUsersTokens(res);
  }

  @Get('seed-users')
  @ApiOperation({
    summary: '시드 데이터 사용자 목록 조회',
    description: '시드 데이터로 생성된 사용자들의 목록을 조회합니다.',
  })
  async getSeedUsers(@Res() res: Response) {
    return this.authService.getSeedUsers(res);
  }

  @Post('seed-token/:userUuid')
  @ApiOperation({
    summary: '특정 시드 데이터 사용자의 토큰 생성',
    description: '특정 시드 데이터 사용자를 선택해서 JWT 토큰을 생성합니다.',
  })
  async getSeedUserToken(
    @Param('userUuid') userUuid: string,
    @Res() res: Response,
  ) {
    return this.authService.generateSeedUserToken(userUuid, res);
  }

  @Get('auth-test')
  @ApiTestAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  async testAuth(@UserUuid() userUuid: string) {
    return {
      message: '인증 성공',
      userUuid,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('test-nickname')
  @ApiOperation({ summary: '닉네임 생성 테스트' })
  async testNickname() {
    // 임시로 generateUniqueNickname 메서드를 public으로 호출
    const nickname = await (this.authService as any).generateUniqueNickname();
    return {
      message: '닉네임 생성 성공',
      nickname: nickname,
    };
  }
}
