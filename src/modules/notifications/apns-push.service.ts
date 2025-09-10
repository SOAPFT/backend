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
  private apnSandboxProvider: apn.Provider;
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

      if (!keyPath || !keyId || !teamId) {
        const warningMessage =
          'APNs 환경변수가 설정되지 않았습니다. 푸시 알림 기능이 비활성화됩니다. (APNS_KEY_PATH, APNS_KEY_ID, APNS_TEAM_ID)';
        this.logger.warn(warningMessage);
        this.isInitialized = false;
        return;
      }

      // .p8 파일 경로 확인
      const fullKeyPath = path.resolve(keyPath);
      if (!fs.existsSync(fullKeyPath)) {
        const warningMessage = `APNs 키 파일을 찾을 수 없습니다: ${fullKeyPath}. 푸시 알림 기능이 비활성화됩니다.`;
        this.logger.warn(warningMessage);
        this.isInitialized = false;
        return;
      }

      // 기본 옵션
      const baseOptions = {
        token: {
          key: fullKeyPath,
          keyId: keyId,
          teamId: teamId,
        },
        connectionRetryLimit: 3,
      };

      // Production Provider 설정
      const productionOptions: apn.ProviderOptions = {
        ...baseOptions,
        production: true,
      };

      // Sandbox Provider 설정
      const sandboxOptions: apn.ProviderOptions = {
        ...baseOptions,
        production: false,
      };

      this.apnProvider = new apn.Provider(productionOptions);
      this.apnSandboxProvider = new apn.Provider(sandboxOptions);

      this.setupEventListeners(this.apnProvider, 'Production');
      this.setupEventListeners(this.apnSandboxProvider, 'Sandbox');
      this.isInitialized = true;

      this.logger.log(`APNs Provider 초기화 완료 (Production & Sandbox)`);
      this.logger.log(`Key ID: ${keyId}`);
      this.logger.log(`Team ID: ${teamId}`);
    } catch (error) {
      this.logger.error('APNs Provider 초기화 실패:', error);
      this.isInitialized = false;
      BusinessException.pushProviderConnectionFailed(error.message);
    }
  }

  private setupEventListeners(provider: apn.Provider, environment: string) {
    if (!provider) return;

    provider.on('connected', () => {
      this.logger.log(`APNs 서버에 연결됨 (${environment})`);
    });

    provider.on('disconnected', () => {
      this.logger.warn(`APNs 서버 연결 해제됨 (${environment})`);
    });

    provider.on('socketError', (err) => {
      this.logger.error(`APNs 소켓 에러 (${environment}):`, err);
    });

    provider.on('transmitted', (notification, device) => {
      this.logger.debug(
        `푸시 전송 성공 (${environment}): ${device.substring(0, 8)}...`,
      );
    });

    provider.on('transmissionError', (errorCode, notification, device) => {
      this.logger.error(
        `푸시 전송 실패 (${environment}): ${device.substring(0, 8)}..., 에러: ${errorCode}`,
      );
    });
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
   * 여러 디바이스에 푸시 알림 전송 (샌드박스 + 프로덕션 모두)
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

      // 프로덕션과 샌드박스 모두에 전송
      const [productionResult, sandboxResult] = await Promise.all([
        this.apnProvider.send(notification, deviceTokens),
        this.apnSandboxProvider.send(notification, deviceTokens),
      ]);

      // 결과 분석
      const invalidTokens: string[] = [];
      const errors: string[] = [];
      let totalSent = 0;
      let totalFailed = 0;

      // 프로덕션 결과 분석
      this.analyzeResults(
        productionResult,
        'Production',
        invalidTokens,
        errors,
      );
      totalSent += productionResult.sent.length;
      totalFailed += productionResult.failed.length;

      // 샌드박스 결과 분석
      this.analyzeResults(sandboxResult, 'Sandbox', invalidTokens, errors);
      totalSent += sandboxResult.sent.length;
      totalFailed += sandboxResult.failed.length;

      const finalResult: PushResult = {
        success: true,
        sent: totalSent,
        failed: totalFailed,
        invalidTokens: [...new Set(invalidTokens)], // 중복 제거
        errors: errors.length > 0 ? errors : undefined,
      };

      this.logger.log(
        `푸시 전송 완료 (전체) - 성공: ${finalResult.sent}, 실패: ${finalResult.failed}, 잘못된 토큰: ${finalResult.invalidTokens.length}`,
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
   * 푸시 전송 결과 분석 헬퍼 메서드
   */
  private analyzeResults(
    result: any,
    environment: string,
    invalidTokens: string[],
    errors: string[],
  ) {
    // 실패한 토큰들 분석
    result.failed.forEach((failure) => {
      const deviceToken = failure.device;
      const status = failure.status;
      const response = failure.response;

      if (status === '410' || status === '400') {
        // 잘못된 토큰 (삭제 필요)
        invalidTokens.push(deviceToken);
        this.logger.warn(
          `잘못된 디바이스 토큰 (${environment}): ${deviceToken.substring(0, 8)}... (${status})`,
        );
      } else {
        // 기타 오류
        const errorMsg = `${environment} - ${deviceToken.substring(0, 8)}...: ${status} - ${response}`;
        errors.push(errorMsg);
        this.logger.error(`푸시 전송 실패: ${errorMsg}`);
      }
    });

    // 성공한 토큰들 로그
    result.sent.forEach((sentResult) => {
      this.logger.debug(
        `푸시 전송 성공 (${environment}): ${sentResult.device.substring(0, 8)}...`,
      );
    });

    if (result.sent.length > 0 || result.failed.length > 0) {
      this.logger.log(
        `푸시 전송 완료 (${environment}) - 성공: ${result.sent.length}, 실패: ${result.failed.length}`,
      );
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
    const shutdownPromises: Promise<void>[] = [];

    if (this.apnProvider) {
      shutdownPromises.push(
        Promise.resolve(this.apnProvider.shutdown()).catch((error: any) => {
          this.logger.error('APNs Production Provider 종료 중 오류:', error);
        }),
      );
    }

    if (this.apnSandboxProvider) {
      shutdownPromises.push(
        Promise.resolve(this.apnSandboxProvider.shutdown()).catch(
          (error: any) => {
            this.logger.error('APNs Sandbox Provider 종료 중 오류:', error);
          },
        ),
      );
    }

    if (shutdownPromises.length > 0) {
      await Promise.all(shutdownPromises);
      this.logger.log('APNs Provider 연결 해제 완료');
    }
  }
}
