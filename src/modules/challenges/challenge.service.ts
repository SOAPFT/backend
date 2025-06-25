import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Challenge } from '@/entities/challenge.entity';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { FindAllChallengesDto } from './dto/find-all-challenges.dto';
import { User } from '@/entities/user.entity';
import { ulid } from 'ulid';
import { ChallengeType, GenderType } from '@/types/challenge.enum';
import { CustomException } from '@/utils/custom-exception';
import { ErrorCode } from '@/types/error-code.enum';
import { MoreThan, LessThan } from 'typeorm';

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
  async findUserChallenges(userUuid: string) {
    const challenges = await this.challengeRepository
      .createQueryBuilder('challenge')
      .where(':userUuid = ANY(challenge.participantUuid)', { userUuid })
      .getMany();

    return challenges;
  }

  /**
   * 챌린지 수정
   */
  async updateChallenge(
    challengeId: number,
    updateChallengeDto: UpdateChallengeDto,
    userUuid: string,
  ) {
    // TODO: 챌린지 수정 로직 구현
    throw new Error('Method not implemented.');
  }

  /**
   * 챌린지 삭제
   */
  async deleteChallenge(challengeId: number, userUuid: string) {
    // TODO: 챌린지 삭제 로직 구현
    throw new Error('Method not implemented.');
  }

  /**
   * 챌린지 참여
   */
  async joinChallenge(
    challengeId: number,
    userUuid: string,
    password?: string,
  ) {
    // TODO: 챌린지 참여 로직 구현
    throw new Error('Method not implemented.');
  }

  /**
   * 챌린지 탈퇴
   */
  async leaveChallenge(challengeId: number, userUuid: string) {
    // TODO: 챌린지 탈퇴 로직 구현
    throw new Error('Method not implemented.');
  }
}
