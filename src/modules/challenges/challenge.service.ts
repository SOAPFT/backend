import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Challenge } from '@/entities/challenge.entity';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { FindAllChallengesDto } from './dto/find-all-challenges.dto';
import { User } from '@/entities/user.entity';
import { ulid } from 'ulid';
import {
  ChallengeType,
  GenderType,
  ChallengeFilterType,
} from '@/types/challenge.enum';
import { CustomException } from '@/utils/custom-exception';
import { ErrorCode } from '@/types/error-code.enum';
import { MoreThan, LessThan, MoreThanOrEqual } from 'typeorm';
import { subDays } from 'date-fns';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectRepository(Challenge)
    private challengeRepository: Repository<Challenge>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
    return;
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

    if (!(challenge.startAge <= user.age && user.age <= challenge.endAge)) {
      CustomException.throw(
        ErrorCode.AGE_RESTRICTION_NOT_MET,
        '참여 가능한 연력 조건을 만족하지 않습니다.',
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
}
