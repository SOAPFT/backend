import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import {
  ApiDevToken,
  ApiKakaoLogin,
  ApiNaverLogin,
  ApiRefreshToken,
  ApiTestAuth,
} from './decorators/auth.swagger';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DevLoginDto, SocialLoginDto } from './dto/auth.dto';
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

  // refreshToken으로 accessToken 재발급
  @Post('refresh')
  @ApiRefreshToken()
  async Refresh(@Req() req: Request, @Res() res: Response) {
    return this.authService.RefreshToken(req, res);
  }

  @Post('dev-token')
  @ApiDevToken()
  async getDevToken(@Body() devLoginDto: DevLoginDto, @Res() res: Response) {
    return this.authService.generateDevToken(devLoginDto.userUuid, res);
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
}
