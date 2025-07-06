import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Challenge } from '@/entities/challenge.entity';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { FindAllChallengesDto } from './dto/find-all-challenges.dto';
import { User } from '@/entities/user.entity';
import { Post } from '@/entities/post.entity';
import { ulid } from 'ulid';
import {
  ChallengeType,
  GenderType,
  ChallengeFilterType,
} from '@/types/challenge.enum';
import { CustomException } from '@/utils/custom-exception';
import { ErrorCode } from '@/types/error-code.enum';
import { MoreThan, LessThan, MoreThanOrEqual, Between, ILike } from 'typeorm';
import { subDays } from 'date-fns';
import { Cron, CronExpression } from '@nestjs/schedule';

/**
 * 나이 계산 함수
 * @param birthDate
 * @returns
 */
function calculateAge(birthDate: Date | string): number {
  const dateObj = birthDate instanceof Date ? birthDate : new Date(birthDate);
  const today = new Date();
  return today.getFullYear() - dateObj.getFullYear() + 1;
}

@Injectable()
export class ChallengeService {
  constructor(
    @InjectRepository(Challenge)
    private challengeRepository: Repository<Challenge>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  /**
   * 챌린지 생성
   */
  async createChallenge(
    createChallengeDto: CreateChallengeDto,
    userUuid: string,
  ) {
    // 날짜 check
    const now = new Date();
    const startDate = new Date(createChallengeDto.start_date);
    const endDate = new Date(createChallengeDto.end_date);
    const user = await this.userRepository.findOne({ where: { userUuid } });

    if (user.coins - createChallengeDto.coin_amount < 0) {
      CustomException.throw(
        ErrorCode.INSUFFICIENT_COINS,
        '챌린지를 생성할 코인이 부족합니다.',
      );
    }

    user.coins = user.coins - createChallengeDto.coin_amount;

    // 시작일이 현재보다 과거
    if (startDate < now) {
      CustomException.throw(
        ErrorCode.INVALID_CHALLENGE_DATES,
        '시작일은 현재 시각 이후여야 합니다.',
      );
    }

    // 종료일 체크
    if (endDate < startDate) {
      CustomException.throw(
        ErrorCode.INVALID_CHALLENGE_DATES,
        '종료일은 시작일보다 이후여야 합니다.',
      );
    }
    if (endDate < now) {
      CustomException.throw(
        ErrorCode.INVALID_CHALLENGE_DATES,
        '종료일은 현재 시각 이후여야 합니다.',
      );
    }

    const userAge = calculateAge(user.birthDate);
    const { start_age, end_age } = createChallengeDto;

    if (!(start_age <= userAge && userAge <= end_age)) {
      CustomException.throw(
        ErrorCode.AGE_RESTRICTION_NOT_MET,
        `챌린지 생성 연령 조건에 맞지 않습니다. (${start_age}세 ~ ${end_age}세)`,
      );
    }

    // TODO: 챌린지 생성 로직 구현
    const challengeUuid = ulid();
    const challenge = await this.challengeRepository.create({
      challengeUuid,
      title: createChallengeDto.title,
      type: ChallengeType.NORMAL,
      profile: createChallengeDto.profile,
      banner: createChallengeDto.banner,
      introduce: createChallengeDto.introduce,
      verificationGuide: createChallengeDto.verificationGuide,
      startDate,
      endDate,
      goal: createChallengeDto.goal,
      startAge: createChallengeDto.start_age,
      endAge: createChallengeDto.end_age,
      gender: createChallengeDto.gender,
      maxMember: createChallengeDto.max_member,
      creatorUuid: userUuid,
      participantUuid: [userUuid],
      coinAmount: createChallengeDto.coin_amount,
      isStarted: false,
      isFinished: false,
      successParticipantsUuid: [],
    });

    await this.challengeRepository.save(challenge);
    await this.userRepository.save(user);
    return {
      message: '챌린지가 성공적으로 생성되었습니다.',
      challengeUuid: challenge.challengeUuid,
    };
  }

  /**
   * 모든 챌린지 조회
   */
  async findAllChallenges(findAllChallengesDto: FindAllChallengesDto) {
    // TODO: 챌린지 목록 조회 로직 구현
    const {
      page = 1,
      limit = 10,
      type,
      gender = GenderType.NONE,
      status,
    } = findAllChallengesDto;

    const where: Record<string, any> = {};

    if (type) where.type = type;
    if (gender) where.gender = gender;

    const now = new Date();

    if (status === 'before') {
      where.startDate = MoreThan(now);
    } else if (status === 'in_progress') {
      where.startDate = LessThan(now);
      where.endDate = MoreThan(now);
    } else if (status === 'completed') {
      where.endDate = LessThan(now);
    }

    const [challenges, total] = await this.challengeRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: challenges,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
      },
    };
  }

  /**
   * 챌린지 상세 조회
   */
  async findOneChallenge(challengeUuid: string, userUuid: string) {
    const challenge = await this.challengeRepository.findOne({
      where: { challengeUuid },
    });

    if (!challenge) {
      CustomException.throw(
        ErrorCode.CHALLENGE_NOT_FOUND,
        '해당 아이디의 챌린지가 없습니다.',
      );
    }

    const isParticipated = challenge.participantUuid.includes(userUuid);

    return { ...challenge, isParticipated };
  }

  /**
   * 사용자가 참여한 챌린지 조회
   */
  async findUserChallenges(userUuid: string, status: ChallengeFilterType) {
    const qb = await this.challengeRepository
      .createQueryBuilder('challenge')
      .where(':userUuid = ANY(challenge.participantUuid)', { userUuid });

    const now = new Date();

    if (status === ChallengeFilterType.ONGOING) {
      qb.andWhere('challenge.startDate <= :now AND challenge.endDate >= :now', {
        now,
      });
    } else if (status === ChallengeFilterType.UPCOMING) {
      qb.andWhere('challenge.startDate > :now', { now });
    }

    const challenges = await qb.getMany();

    return challenges;
  }

  /**
   * 사용자가 성공한 챌린지 수 조회
   */
  async countUserCompletedChallenges(userUuid: string) {
    const count = await this.challengeRepository
      .createQueryBuilder('challenge')
      .where(':userUuid =뭐 ANY(challenge.successParticipantsUuid)', {
        userUuid,
      })
      .getCount();

    return {
      message: '조회 성공',
      completedChallengeCount: count,
    };
  }

  /**
   * 챌린지 수정
   */
  async updateChallenge(
    challengeUuid: string,
    updateChallengeDto: UpdateChallengeDto,
    userUuid: string,
  ) {
    const challenge = await this.challengeRepository.findOne({
      where: { challengeUuid },
    });

    if (!challenge) {
      CustomException.throw(
        ErrorCode.CHALLENGE_NOT_FOUND,
        '해당 아이디의 챌린지가 없습니다.',
      );
    }

    if (challenge.creatorUuid !== userUuid) {
      CustomException.throw(
        ErrorCode.CHALLENGE_CANNOT_EDIT,
        '챌린지를 수정할 권한이 없습니다.',
      );
    }

    if (updateChallengeDto.banner) {
      challenge.banner = updateChallengeDto.banner;
    }
    if (updateChallengeDto.profile) {
      challenge.profile = updateChallengeDto.profile;
    }

    await this.challengeRepository.save(challenge);

    return {
      message: '챌린지 수정을 성공했습니다.',
      challenge,
    };
  }

  /**
   * 최근 생성된 챌린지 목록
   */

  async getRecentChallenges() {
    const onWeekAgo = subDays(new Date(), 7);

    const challenges = await this.challengeRepository.find({
      where: {
        createdAt: MoreThanOrEqual(onWeekAgo),
      },
      order: {
        createdAt: 'DESC',
      },
      take: 15,
    });

    return challenges;
  }

  /**
   * 인기 챌린지 목록
   */

  async getPopularChallenges() {
    const challenges = await this.challengeRepository
      .createQueryBuilder('challenge')
      .addSelect('CARDINALITY(challenge.participantUuid)', 'participantCount')
      .orderBy('participantCount', 'DESC')
      .limit(15)
      .getMany();

    return challenges;
  }

  /**
   * 챌린지 참여
   */
  async joinChallenge(challengeUuid: string, userUuid: string) {
    const challenge = await this.challengeRepository.findOne({
      where: { challengeUuid },
    });
    const user = await this.userRepository.findOne({
      where: {
        userUuid,
      },
    });

    const now = new Date();
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);

    if (!challenge) {
      CustomException.throw(
        ErrorCode.CHALLENGE_NOT_FOUND,
        '해당 아이디의 챌린지가 없습니다.',
      );
    }

    if (
      challenge.gender !== GenderType.NONE &&
      challenge.gender !== user.gender
    ) {
      CustomException.throw(
        ErrorCode.GENDER_RESTRICTION_NOT_MET,
        '성별 조건을 만족하지 않습니다.',
      );
    }

    const userAge = calculateAge(user.birthDate);

    if (!(challenge.startAge <= userAge && userAge <= challenge.endAge)) {
      CustomException.throw(
        ErrorCode.AGE_RESTRICTION_NOT_MET,
        '참여 가능한 연령 조건을 만족하지 않습니다.',
      );
    }

    if (challenge.maxMember === challenge.participantUuid.length) {
      CustomException.throw(ErrorCode.CHALLENGE_FULL, '정원이 다 찼습니다.');
    }

    const isAlreadyParticipant = challenge.participantUuid.find(
      (uuid) => uuid === userUuid,
    );

    if (isAlreadyParticipant) {
      CustomException.throw(
        ErrorCode.ALREADY_JOINED_CHALLENGE,
        '이미 참가한 챌린지 입니다.',
      );
    }

    if (user.coins - challenge.coinAmount < 0) {
      CustomException.throw(
        ErrorCode.INSUFFICIENT_COINS,
        '챌린지를 생성할 코인이 부족합니다.',
      );
    }

    if (endDate < now) {
      CustomException.throw(
        ErrorCode.CHALLENGE_ALREADY_FINISHED,
        '이미 종료된 챌린지 입니다.',
      );
    } else if (startDate < now) {
      CustomException.throw(
        ErrorCode.CHALLENGE_ALREADY_STARTED,
        '이미 시작된 챌린지입니다.',
      );
    }

    user.coins = user.coins - challenge.coinAmount;
    challenge.participantUuid.push(userUuid);

    await this.challengeRepository.save(challenge);
    await this.userRepository.save(user);

    return {
      message: '참가 완료',
      challengeUuid,
    };
  }

  /**
   * 챌린지 진행률 조회
   */
  async getUserChallengeProgress(userUuid: string, challengeUuid: string) {
    const challenge = await this.challengeRepository.findOne({
      where: { challengeUuid },
    });

    if (!challenge) {
      CustomException.throw(
        ErrorCode.CHALLENGE_NOT_FOUND,
        '해당 아이디의 챌린지가 없습니다.',
      );
    }

    const { startDate, endDate, goal, participantUuid } = challenge;

    const posts = await this.postRepository.find({
      where: {
        userUuid,
        challengeUuid,
        createdAt: Between(startDate, endDate),
      },
    });

    // 주차별 count 계산 (중복 날짜 제거)
    const weekMap: Record<number, Set<string>> = {};

    posts.forEach((post) => {
      const diffMs = post.createdAt.getTime() - startDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const weekNum = Math.floor(diffDays / 7) + 1;

      const dateKey = post.createdAt.toISOString().split('T')[0];

      if (!weekMap[weekNum]) {
        weekMap[weekNum] = new Set();
      }
      weekMap[weekNum].add(dateKey);
    });

    // 전체 주차 수 계산
    const totalWeeks = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7),
    );

    const progress = [];
    let achievedWeeks = 0;

    for (let i = 1; i <= totalWeeks; i++) {
      const count = weekMap[i] ? weekMap[i].size : 0;
      const achieved = count >= goal;

      if (achieved) achievedWeeks++;

      progress.push({
        week: i,
        count,
        achieved,
      });
    }

    const totalAchievementRate = Math.round((achievedWeeks / totalWeeks) * 100);

    return {
      challengeInfo: {
        participantCount: participantUuid.length,
        startDate,
        endDate,
        goal: challenge.goal,
      },
      totalAchievementRate,
    };
  }

  /**
   * 챌린지 탈퇴
   */
  async leaveChallenge(challengeUuid: string, userUuid: string) {
    const challenge = await this.challengeRepository.findOne({
      where: { challengeUuid },
    });

    if (!challenge) {
      CustomException.throw(
        ErrorCode.CHALLENGE_NOT_FOUND,
        '해당 아이디의 챌린지가 없습니다.',
      );
    }

    const now = new Date();
    if (challenge.startDate <= now) {
      CustomException.throw(
        ErrorCode.CHALLENGE_ALREADY_STARTED,
        '챌린지가 시작되어 나갈 수 없습니다.',
      );
    }

    challenge.participantUuid = challenge.participantUuid.filter(
      (participantUuid) => participantUuid !== userUuid,
    );

    await this.challengeRepository.save(challenge);

    return {
      message: '챌린지에서 성공적으로 탈퇴했습니다.',
    };
  }

  /**
   * 챌린지 검색
   */
  async searchChallenges(keyword: string, page: number, limit: number) {
    const [results, total] = await this.challengeRepository.findAndCount({
      where: [
        { title: ILike(`%${keyword}%`) },
        { introduce: ILike(`%${keyword}%`) },
      ],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: results,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
      },
    };
  }

  /**
   * 종료일이 지난 챌린지를 자동으로 종료 처리
   * 100% 달성한 참여자를 successParticipantsUuid에 추가
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async closeExpiredChallenges() {
    const now = new Date();

    // 1. 종료일이 지났고, 아직 종료 처리되지 않은 챌린지 조회
    const expiredChallenges = await this.challengeRepository.find({
      where: {
        endDate: LessThan(now),
        isFinished: false,
      },
    });

    for (const challenge of expiredChallenges) {
      const successParticipants: string[] = [];

      // 2. 참여자별로 진행률 조회
      for (const userUuid of challenge.participantUuid) {
        const { totalAchievementRate } = await this.getUserChallengeProgress(
          userUuid,
          challenge.challengeUuid,
        );

        // 3. 달성률 100%인 경우 successParticipants에 추가
        if (totalAchievementRate === 100) {
          successParticipants.push(userUuid);
        }
      }

      // 4. 성공자에게 보상 코인 지급
      const totalParticipants = challenge.participantUuid.length;
      const totalCoins = totalParticipants * challenge.coinAmount;
      const numSuccess = successParticipants.length;

      if (numSuccess > 0) {
        const rewardPerSuccess = Math.floor(totalCoins / numSuccess);

        for (const userUuid of successParticipants) {
          const user = await this.userRepository.findOne({
            where: {
              userUuid,
            },
          });

          if (user) {
            user.coins += rewardPerSuccess;
            await this.userRepository.save(user);
          }
        }
      }

      // 5. 챌린지 업데이트
      challenge.successParticipantsUuid = successParticipants;
      challenge.isFinished = true;

      await this.challengeRepository.save(challenge);
    }

    console.log(
      `[스케줄러] ${expiredChallenges.length}개의 챌린지가 종료 처리되었습니다.`,
    );
  }

  /**
   * 챌린지 월별 인증 현황 조회
   */
  async getMonthlyChallengeStats(
    challengeUuid: string,
    year: number,
    month: number,
  ) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999); // 해당 달의 마지막 날 끝 시간

    const posts = await this.postRepository
      .createQueryBuilder('post')
      .select(['post.id', 'post.userUuid', 'post.createdAt'])
      .where('post.challengeUuid = :challengeUuid', { challengeUuid })
      .andWhere('post.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();

    // 날짜별로 그룹핑
    const result: Record<string, { count: number; users: any[] }> = {};

    for (const post of posts) {
      const dateKey = post.createdAt.toISOString().split('T')[0]; // yyyy-mm-dd

      if (!result[dateKey]) {
        result[dateKey] = { count: 0, users: [] };
      }

      result[dateKey].count += 1;

      // userUuid로 사용자 정보 조회
      const user = await this.userRepository.findOne({
        where: { userUuid: post.userUuid },
        select: ['userUuid', 'nickname', 'profileImage'],
      });

      if (user) {
        result[dateKey].users.push(user);
      }
    }

    return result;
  }
}
