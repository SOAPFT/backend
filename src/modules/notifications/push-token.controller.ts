import {
  Controller,
  Post,
  Delete,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UserPushService } from './user-push.service';
import { UserUuid } from '@/decorators/user-uuid.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

export class RegisterPushTokenDto {
  pushToken: string;
  platform?: 'ios' | 'android';
}

export class RemovePushTokenDto {
  pushToken: string;
}

@ApiTags('push-tokens')
@ApiBearerAuth('JWT-auth')
@Controller('push-tokens')
@UseGuards(JwtAuthGuard)
export class PushTokenController {
  constructor(private readonly userPushService: UserPushService) {}

  /**
   * 푸시 토큰 등록
   */
  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '푸시 토큰 등록',
    description: '푸시 알림을 위한 디바이스 토큰을 등록합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '푸시 토큰 등록 성공',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: '푸시 토큰이 등록되었습니다.' },
      },
    },
  })
  async registerPushToken(
    @Body() dto: RegisterPushTokenDto,
    @UserUuid() userUuid: string,
  ) {
    await this.userPushService.registerPushToken({
      userUuid,
      pushToken: dto.pushToken,
      platform: dto.platform || 'ios',
    });

    return {
      success: true,
      message: '푸시 토큰이 등록되었습니다.',
    };
  }

  /**
   * 특정 푸시 토큰 제거
   */
  @Delete('remove')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '푸시 토큰 제거',
    description: '등록된 특정 푸시 토큰을 제거합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '푸시 토큰 제거 성공',
  })
  async removePushToken(
    @Body() dto: RemovePushTokenDto,
    @UserUuid() userUuid: string,
  ) {
    await this.userPushService.removePushToken(userUuid, dto.pushToken);

    return {
      success: true,
      message: '푸시 토큰이 제거되었습니다.',
    };
  }

  /**
   * 모든 푸시 토큰 제거 (로그아웃 시)
   */
  @Delete('remove-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '모든 푸시 토큰 제거',
    description: '사용자의 모든 푸시 토큰을 제거합니다. (로그아웃 시 사용)',
  })
  async removeAllPushTokens(@UserUuid() userUuid: string) {
    await this.userPushService.removeAllPushTokens(userUuid);

    return {
      success: true,
      message: '모든 푸시 토큰이 제거되었습니다.',
    };
  }
}
