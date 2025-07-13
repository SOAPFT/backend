import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as apn from 'node-apn';
import * as fs from 'fs';
import * as path from 'path';
import { BusinessException } from '@/utils/custom-exception';

export interface PushPayload {
  title: string;
  body: string;
  badge?: number;
  sound?: string;
  data?: Record<string, any>;
  category?: string;
}

export interface PushResult {
  success: boolean;
  sent: number;
  failed: number;
  invalidTokens: string[];
  errors?: string[];
}

@Injectable()
export class ApnsPushService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ApnsPushService.name);
  private apnProvider: apn.Provider;
  private isInitialized = false;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.initializeProvider();
  }

  private async initializeProvider() {
    try {
      // 환경변수에서 APNs 설정 읽기
      const keyPath = this.configService.get<string>('APNS_KEY_PATH');
      const keyId = this.configService.get<string>('APNS_KEY_ID');
      const teamId = this.configService.get<string>('APNS_TEAM_ID');
      const isProduction =
        this.configService.get<string>('NODE_ENV') === 'production';

      if (!keyPath || !keyId || !teamId) {
        const errorMessage =
          '필요한 환경변수: APNS_KEY_PATH, APNS_KEY_ID, APNS_TEAM_ID';
        this.logger.error(errorMessage);
        BusinessException.pushProviderConfigurationError(errorMessage);
      }

      // .p8 파일 경로 확인
      const fullKeyPath = path.resolve(keyPath);
      if (!fs.existsSync(fullKeyPath)) {
        const errorMessage = `APNs 키 파일을 찾을 수 없습니다: ${fullKeyPath}`;
        this.logger.error(errorMessage);
        BusinessException.pushProviderConfigurationError(errorMessage);
      }

      // APNs Provider 설정
      const options: apn.ProviderOptions = {
        token: {
          key: fullKeyPath,
          keyId: keyId,
          teamId: teamId,
        },
        production: isProduction,
        // 연결 풀 설정
        connectionRetryLimit: 3,
      };

      this.apnProvider = new apn.Provider(options);
      this.setupEventListeners();
      this.isInitialized = true;

      this.logger.log(`APNs Provider 초기화 완료`);
      this.logger.log(
        `환경: ${isProduction ? 'Production' : 'Sandbox (Development)'}`,
      );
      this.logger.log(`Key ID: ${keyId}`);
      this.logger.log(`Team ID: ${teamId}`);
    } catch (error) {
      this.logger.error('APNs Provider 초기화 실패:', error);
      this.isInitialized = false;
      BusinessException.pushProviderConnectionFailed(error.message);
    }
  }

  private setupEventListeners() {
    if (!this.apnProvider) return;

    this.apnProvider.on('connected', () => {
      this.logger.log('APNs 서버에 연결됨');
    });

    this.apnProvider.on('disconnected', () => {
      this.logger.warn('APNs 서버 연결 해제됨');
    });

    this.apnProvider.on('socketError', (err) => {
      this.logger.error('APNs 소켓 에러:', err);
    });

    this.apnProvider.on('transmitted', (notification, device) => {
      this.logger.debug(`푸시 전송 성공: ${device.substring(0, 8)}...`);
    });

    this.apnProvider.on(
      'transmissionError',
      (errorCode, notification, device) => {
        this.logger.error(
          `푸시 전송 실패: ${device.substring(0, 8)}..., 에러: ${errorCode}`,
        );
      },
    );
  }

  /**
   * 단일 디바이스에 푸시 알림 전송
   */
  async sendToDevice(
    deviceToken: string,
    payload: PushPayload,
  ): Promise<PushResult> {
    return this.sendToDevices([deviceToken], payload);
  }

  /**
   * 여러 디바이스에 푸시 알림 전송
   */
  async sendToDevices(
    deviceTokens: string[],
    payload: PushPayload,
  ): Promise<PushResult> {
    if (!this.isInitialized) {
      this.logger.error('APNs Provider가 초기화되지 않았습니다');
      BusinessException.pushProviderNotInitialized();
    }

    if (!deviceTokens?.length) {
      return {
        success: true,
        sent: 0,
        failed: 0,
        invalidTokens: [],
      };
    }

    try {
      // 알림 객체 생성
      const notification = this.createNotification(payload);

      // 푸시 전송
      const result = await this.apnProvider.send(notification, deviceTokens);

      // 결과 분석
      const invalidTokens: string[] = [];
      const errors: string[] = [];

      // 실패한 토큰들 분석
      result.failed.forEach((failure) => {
        const deviceToken = failure.device;
        const status = failure.status;
        const response = failure.response;

        if (status === '410' || status === '400') {
          // 잘못된 토큰 (삭제 필요)
          invalidTokens.push(deviceToken);
          this.logger.warn(
            `잘못된 디바이스 토큰: ${deviceToken.substring(0, 8)}... (${status})`,
          );
        } else {
          // 기타 오류
          const errorMsg = `${deviceToken.substring(0, 8)}...: ${status} - ${response}`;
          errors.push(errorMsg);
          this.logger.error(`푸시 전송 실패: ${errorMsg}`);
        }
      });

      // 성공한 토큰들 로그
      result.sent.forEach((sentResult) => {
        this.logger.debug(
          `푸시 전송 성공: ${sentResult.device.substring(0, 8)}...`,
        );
      });

      const finalResult: PushResult = {
        success: true,
        sent: result.sent.length,
        failed: result.failed.length,
        invalidTokens,
        errors: errors.length > 0 ? errors : undefined,
      };

      this.logger.log(
        `푸시 전송 완료 - 성공: ${finalResult.sent}, 실패: ${finalResult.failed}, 잘못된 토큰: ${invalidTokens.length}`,
      );

      return finalResult;
    } catch (error) {
      this.logger.error('푸시 전송 중 예외 발생:', error);

      // 특정 에러 타입에 따라 적절한 예외 처리
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        BusinessException.pushProviderConnectionFailed(error.message);
      } else if (error.message?.includes('invalid token')) {
        BusinessException.pushInvalidDeviceToken(deviceTokens[0] || 'unknown');
      } else {
        BusinessException.pushSendFailed(
          deviceTokens[0] || 'unknown',
          error.message || '알 수 없는 오류',
        );
      }
    }
  }

  /**
   * APNs 알림 객체 생성
   */
  private createNotification(payload: PushPayload): apn.Notification {
    const notification = new apn.Notification();

    // 기본 알림 설정
    notification.alert = {
      title: payload.title,
      body: payload.body,
    };

    // 배지 설정
    notification.badge = payload.badge ?? 0;

    // 사운드 설정
    notification.sound = payload.sound || 'default';

    // 카테고리 설정
    if (payload.category) {
      (notification as any).category = payload.category;
    }

    // 커스텀 데이터 설정
    if (payload.data) {
      notification.payload = payload.data;
    }

    // 앱 번들 ID 설정
    const bundleId = this.configService.get<string>('APNS_BUNDLE_ID');
    if (bundleId) {
      notification.topic = bundleId;
    }

    // 알림 만료 시간 설정 (1시간)
    notification.expiry = Math.floor(Date.now() / 1000) + 3600;

    // 높은 우선순위로 설정
    notification.priority = 10;

    // 알림이 기기에 표시될 때마다 배지 증가
    notification.pushType = 'alert';

    return notification;
  }

  /**
   * APNs 연결 상태 확인
   */
  isReady(): boolean {
    return this.isInitialized && !!this.apnProvider;
  }

  /**
   * 테스트용 푸시 발송
   */
  async sendTestPush(deviceToken: string): Promise<PushResult> {
    return this.sendToDevice(deviceToken, {
      title: '테스트 알림',
      body: 'APNs 연결이 정상적으로 동작합니다.',
      badge: 1,
      sound: 'default',
      data: {
        type: 'test',
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * 모듈 종료 시 APNs 연결 해제
   */
  async onModuleDestroy() {
    if (this.apnProvider) {
      try {
        await this.apnProvider.shutdown();
        this.logger.log('APNs Provider 연결 해제 완료');
      } catch (error) {
        this.logger.error('APNs Provider 종료 중 오류:', error);
      }
    }
  }
}
