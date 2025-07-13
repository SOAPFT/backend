import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '@/entities/user.entity';
import { ApnsPushService } from './apns-push.service';

export interface RegisterPushTokenDto {
  userUuid: string;
  pushToken: string;
  platform?: 'ios' | 'android';
}

@Injectable()
export class UserPushService {
  private readonly logger = new Logger(UserPushService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private apnsPushService: ApnsPushService,
  ) {}

  /**
   * 사용자의 푸시 토큰 등록/업데이트
   */
  async registerPushToken(dto: RegisterPushTokenDto): Promise<void> {
    try {
      const user = await this.userRepository.findOne({
        where: { userUuid: dto.userUuid },
      });

      if (!user) {
        throw new Error(`사용자를 찾을 수 없습니다: ${dto.userUuid}`);
      }

      // 기존 토큰 배열 가져오기 (없으면 빈 배열)
      let pushTokens = user.pushTokens || [];

      // 중복 토큰 제거 후 새 토큰 추가
      pushTokens = pushTokens.filter((token) => token !== dto.pushToken);
      pushTokens.push(dto.pushToken);

      // 최대 5개까지만 유지 (오래된 토큰 제거)
      if (pushTokens.length > 5) {
        pushTokens = pushTokens.slice(-5);
      }

      // 사용자 정보 업데이트
      await this.userRepository.update(user.id, {
        pushTokens,
        pushToken: dto.pushToken, // 레거시 필드도 최신 토큰으로 업데이트
      });

      this.logger.log(`푸시 토큰 등록 완료: ${dto.userUuid}`);
    } catch (error) {
      this.logger.error('푸시 토큰 등록 실패:', error);
      throw error;
    }
  }

  /**
   * 사용자의 푸시 토큰 제거
   */
  async removePushToken(userUuid: string, pushToken: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({
        where: { userUuid },
      });

      if (!user) {
        throw new Error(`사용자를 찾을 수 없습니다: ${userUuid}`);
      }

      // 토큰 배열에서 해당 토큰 제거
      const pushTokens = (user.pushTokens || []).filter(
        (token) => token !== pushToken,
      );

      // 레거시 필드도 확인해서 제거
      const newPushToken = user.pushToken === pushToken ? null : user.pushToken;

      await this.userRepository.update(user.id, {
        pushTokens,
        pushToken: newPushToken,
      });

      this.logger.log(`푸시 토큰 제거 완료: ${userUuid}`);
    } catch (error) {
      this.logger.error('푸시 토큰 제거 실패:', error);
      throw error;
    }
  }

  /**
   * 사용자의 모든 푸시 토큰 제거 (로그아웃 시)
   */
  async removeAllPushTokens(userUuid: string): Promise<void> {
    await this.userRepository.update(
      { userUuid },
      {
        pushTokens: [],
        pushToken: null,
      },
    );

    this.logger.log(`모든 푸시 토큰 제거 완료: ${userUuid}`);
  }

  /**
   * 단일 사용자에게 푸시 알림 발송
   */
  async sendPushToUser(
    userUuid: string,
    payload: {
      title: string;
      body: string;
      badge?: number;
      data?: Record<string, any>;
    },
  ): Promise<{ sent: number; failed: number }> {
    try {
      const user = await this.userRepository.findOne({
        where: { userUuid },
        select: ['userUuid', 'pushTokens', 'pushToken', 'isPushEnabled'],
      });

      if (!user || !user.isPushEnabled) {
        return { sent: 0, failed: 0 };
      }

      // 모든 토큰 수집 (새로운 방식 + 레거시 방식)
      const allTokens = new Set<string>();

      if (user.pushTokens) {
        user.pushTokens.forEach((token) => allTokens.add(token));
      }

      if (user.pushToken) {
        allTokens.add(user.pushToken);
      }

      const tokens = Array.from(allTokens);

      if (tokens.length === 0) {
        return { sent: 0, failed: 0 };
      }

      // APNs로 푸시 발송
      const result = await this.apnsPushService.sendToDevices(tokens, payload);

      // 잘못된 토큰들 정리
      if (result.invalidTokens.length > 0) {
        await this.removeInvalidTokens(userUuid, result.invalidTokens);
      }

      return { sent: result.sent, failed: result.failed };
    } catch (error) {
      this.logger.error(`푸시 발송 실패: ${userUuid}`, error);
      return { sent: 0, failed: 1 };
    }
  }

  /**
   * 여러 사용자에게 푸시 알림 발송
   */
  async sendPushToUsers(
    userUuids: string[],
    payload: {
      title: string;
      body: string;
      badge?: number;
      data?: Record<string, any>;
    },
  ): Promise<{ sent: number; failed: number }> {
    if (userUuids.length === 0) {
      return { sent: 0, failed: 0 };
    }

    try {
      // 푸시 허용한 사용자들의 토큰 조회
      const users = await this.userRepository.find({
        where: {
          userUuid: In(userUuids),
          isPushEnabled: true,
        },
        select: ['userUuid', 'pushTokens', 'pushToken'],
      });

      // 모든 토큰 수집
      const allTokens = new Set<string>();
      const userTokenMap = new Map<string, string[]>();

      users.forEach((user) => {
        const userTokens: string[] = [];

        if (user.pushTokens) {
          user.pushTokens.forEach((token) => {
            allTokens.add(token);
            userTokens.push(token);
          });
        }

        if (user.pushToken) {
          allTokens.add(user.pushToken);
          userTokens.push(user.pushToken);
        }

        if (userTokens.length > 0) {
          userTokenMap.set(user.userUuid, userTokens);
        }
      });

      const tokens = Array.from(allTokens);

      if (tokens.length === 0) {
        return { sent: 0, failed: 0 };
      }

      // 배치로 푸시 발송
      const result = await this.apnsPushService.sendToDevices(tokens, payload);

      // 잘못된 토큰들 정리
      if (result.invalidTokens.length > 0) {
        await this.cleanupInvalidTokensForUsers(
          userTokenMap,
          result.invalidTokens,
        );
      }

      return { sent: result.sent, failed: result.failed };
    } catch (error) {
      this.logger.error('대량 푸시 발송 실패:', error);
      return { sent: 0, failed: userUuids.length };
    }
  }

  /**
   * 잘못된 토큰들을 사용자별로 정리
   */
  private async removeInvalidTokens(
    userUuid: string,
    invalidTokens: string[],
  ): Promise<void> {
    try {
      const user = await this.userRepository.findOne({
        where: { userUuid },
      });

      if (!user) return;

      // 잘못된 토큰들 제거
      const validTokens = (user.pushTokens || []).filter(
        (token) => !invalidTokens.includes(token),
      );

      const newPushToken = invalidTokens.includes(user.pushToken)
        ? null
        : user.pushToken;

      await this.userRepository.update(user.id, {
        pushTokens: validTokens,
        pushToken: newPushToken,
      });

      this.logger.log(
        `잘못된 토큰 ${invalidTokens.length}개 제거: ${userUuid}`,
      );
    } catch (error) {
      this.logger.error('잘못된 토큰 제거 실패:', error);
    }
  }

  /**
   * 여러 사용자의 잘못된 토큰들 정리
   */
  private async cleanupInvalidTokensForUsers(
    userTokenMap: Map<string, string[]>,
    invalidTokens: string[],
  ): Promise<void> {
    for (const [userUuid, userTokens] of userTokenMap.entries()) {
      const userInvalidTokens = userTokens.filter((token) =>
        invalidTokens.includes(token),
      );
      if (userInvalidTokens.length > 0) {
        await this.removeInvalidTokens(userUuid, userInvalidTokens);
      }
    }
  }
}
