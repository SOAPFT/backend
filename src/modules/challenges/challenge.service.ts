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
    // TODO: 챌린지 생성 로직 구현
    throw new Error('Method not implemented.');
  }

  /**
   * 모든 챌린지 조회
   */
  async findAllChallenges(findAllChallengesDto: FindAllChallengesDto) {
    // TODO: 챌린지 목록 조회 로직 구현
    throw new Error('Method not implemented.');
  }

  /**
   * 챌린지 상세 조회
   */
  async findOneChallenge(challengeId: number, userUuid: string) {
    const challenge = await this.challengeRepository.findOne({
      where: { id: challengeId },
    });

    if (!challenge) {
      throw new NotFoundException('해당 ID의 챌린지를 찾을 수 없습니다.');
    }

    return challenge;
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
