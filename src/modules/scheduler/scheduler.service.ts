import { Injectable, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from 'winston';
import { Challenge } from '@/entities/challenge.entity';
import { ChatbotService } from '../chatbot/chatbot.service';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
    private readonly chatbotService: ChatbotService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  /**
   * 매일 오후 6시에 활성 챌린지들에 대해 리마인더 전송
   */
  @Cron('0 18 * * *', {
    name: 'dailyAuthReminder',
    timeZone: 'Asia/Seoul',
  })
  async sendDailyAuthReminders() {
    try {
      this.logger.info('일일 인증 리마인더 시작');

      // 활성 상태인 챌린지들 조회 (시작되었고 아직 끝나지 않은 것들)
      const activeChallenges = await this.challengeRepository.find({
        where: {
          isStarted: true,
          isFinished: false,
        },
        select: ['challengeUuid', 'title'],
      });

      if (activeChallenges.length === 0) {
        this.logger.info('활성 챌린지가 없습니다.');
        return;
      }

      this.logger.info(
        `${activeChallenges.length}개의 활성 챌린지에 리마인더 전송 시작`,
      );

      // 각 챌린지에 대해 리마인더 전송
      const promises = activeChallenges.map(async (challenge) => {
        try {
          await this.chatbotService.sendDailyReminder(challenge.challengeUuid);
          this.logger.info(`리마인더 전송 완료: ${challenge.title}`);
        } catch (error) {
          this.logger.error(`리마인더 전송 실패: ${challenge.title}`, error);
        }
      });

      await Promise.all(promises);
      this.logger.info('일일 인증 리마인더 완료');
    } catch (error) {
      this.logger.error('일일 인증 리마인더 처리 중 오류:', error);
    }
  }

  /**
   * 매일 자정에 어제 모든 참여자가 인증한 챌린지들에 축하 메시지 전송 (옵션)
   */
  @Cron('0 0 * * *', {
    name: 'dailyCompletionCheck',
    timeZone: 'Asia/Seoul',
  })
  async checkDailyCompletions() {
    try {
      this.logger.info('일일 완료 체크 시작');

      // 활성 상태인 챌린지들 조회 (시작되었고 아직 끝나지 않은 것들)
      const activeChallenges = await this.challengeRepository.find({
        where: {
          isStarted: true,
          isFinished: false,
        },
        select: ['challengeUuid', 'title'],
      });

      if (activeChallenges.length === 0) {
        this.logger.info('활성 챌린지가 없습니다.');
        return;
      }

      // 각 챌린지에 대해 어제 완료 상태 확인
      const promises = activeChallenges.map(async (challenge) => {
        try {
          // 어제 모든 참여자가 인증했는지 확인하는 로직이 필요하다면
          // ChatbotService에 별도 메서드 추가 가능

          this.logger.info(`완료 체크 처리: ${challenge.title}`);
        } catch (error) {
          this.logger.error(`완료 체크 실패: ${challenge.title}`, error);
        }
      });

      await Promise.all(promises);
      this.logger.info('일일 완료 체크 완료');
    } catch (error) {
      this.logger.error('일일 완료 체크 처리 중 오류:', error);
    }
  }

  /**
   * 매주 월요일 오전 9시에 주간 격려 메시지 전송 (옵션)
   */
  @Cron('0 9 * * 1', {
    name: 'weeklyMotivation',
    timeZone: 'Asia/Seoul',
  })
  async sendWeeklyMotivation() {
    try {
      this.logger.info('주간 격려 메시지 시작');

      const activeChallenges = await this.challengeRepository.find({
        where: {
          isStarted: true,
          isFinished: false,
        },
        select: ['challengeUuid', 'title'],
      });

      if (activeChallenges.length === 0) {
        return;
      }

      // 각 챌린지 채팅방에 주간 격려 메시지 전송 로직
      // ChatbotService에 주간 격려 메서드 추가 가능

      this.logger.info('주간 격려 메시지 완료');
    } catch (error) {
      this.logger.error('주간 격려 메시지 처리 중 오류:', error);
    }
  }

  /**
   * 수동으로 특정 챌린지에 리마인더 전송 (테스트/관리용)
   */
  async sendManualReminder(challengeUuid: string) {
    try {
      await this.chatbotService.sendDailyReminder(challengeUuid);
      this.logger.info(`수동 리마인더 전송 완료: ${challengeUuid}`);
      return { success: true, message: '리마인더가 전송되었습니다.' };
    } catch (error) {
      this.logger.error(`수동 리마인더 전송 실패: ${challengeUuid}`, error);
      throw error;
    }
  }

  /**
   * 현재 등록된 스케줄 작업 상태 조회
   */
  getSchedulerStatus() {
    return {
      dailyAuthReminder: {
        name: 'dailyAuthReminder',
        schedule: '매일 오후 6시',
        description: '일일 인증 리마인더',
      },
      dailyCompletionCheck: {
        name: 'dailyCompletionCheck',
        schedule: '매일 자정',
        description: '일일 완료 체크',
      },
      weeklyMotivation: {
        name: 'weeklyMotivation',
        schedule: '매주 월요일 오전 9시',
        description: '주간 격려 메시지',
      },
    };
  }
}
