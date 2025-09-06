import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mission } from '@/entities/mission.entity';
import { MissionParticipation } from '@/entities/mission-participation.entity';
import { Repository, In, MoreThan } from 'typeorm';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { User } from '@/entities/user.entity';
import { CustomException } from '../../utils/custom-exception';
import { ErrorCode } from '../../types/error-code.enum';

type MissionStatus = '진행예정' | '진행중' | '완료';

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(Mission)
    private readonly missionRepo: Repository<Mission>,
    @InjectRepository(MissionParticipation)
    private readonly participationRepo: Repository<MissionParticipation>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateMissionDto): Promise<Mission> {
    const mission = this.missionRepo.create(dto);
    return this.missionRepo.save(mission);
  }

  async update(id: number, dto: UpdateMissionDto): Promise<Mission> {
    const mission = await this.missionRepo.findOneBy({ id });
    if (!mission) throw new NotFoundException('해당 미션을 찾을 수 없습니다.');
    Object.assign(mission, dto);
    return this.missionRepo.save(mission);
  }

  async delete(id: number): Promise<void> {
    const mission = await this.missionRepo.findOneBy({ id });
    if (!mission) throw new NotFoundException('해당 미션을 찾을 수 없습니다.');
    await this.missionRepo.remove(mission);
  }

  // 미션 참여
  async participate(
    missionId: number,
    userUuid: string,
  ): Promise<MissionParticipation> {
    const mission = await this.missionRepo.findOneBy({ id: missionId });
    if (!mission) throw new NotFoundException('미션을 찾을 수 없습니다.');

    const exists = await this.participationRepo.findOneBy({
      missionId,
      userUuid,
    });
    if (exists) return exists;

    const participation = this.participationRepo.create({
      missionId,
      userUuid,
      joinedAt: new Date(),
      completed: false,
      resultData: null,
    });

    return this.participationRepo.save(participation);
  }

  // 미션 상세 조회 (랭킹 포함)
  async getDetailWithRank(
    missionId: number,
    userUuid: string,
  ): Promise<{
    mission: Mission;
    isParticipating: boolean;
    myResult: number | null;
    myRank: number | null;
    myName: string | null;
    myProfileImage: string | null;
    rankings: {
      userUuid: string;
      name: string;
      profileImage: string | null;
      result: number;
    }[];
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  }> {
    const mission = await this.missionRepo.findOneBy({ id: missionId });
    if (!mission) throw new NotFoundException('미션을 찾을 수 없습니다.');

    const now = new Date();
    let status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' = 'UPCOMING';
    if (mission.startTime <= now && mission.endTime >= now) {
      status = 'ONGOING';
    } else if (mission.endTime < now) {
      status = 'COMPLETED';
    }

    const allResults = await this.participationRepo.find({
      where: { missionId },
    });

    const userUuids = allResults.map((p) => p.userUuid);
    const users = await this.userRepo.findBy({ userUuid: In(userUuids) });

    const userMap = new Map(
      users.map((u) => [
        u.userUuid,
        { name: u.nickname, profileImage: u.profileImage },
      ]),
    );

    const ranked = allResults
      .filter((p) => p.resultData != null)
      .map((p) => ({
        userUuid: p.userUuid,
        name: userMap.get(p.userUuid)?.name || '알 수 없음',
        profileImage: userMap.get(p.userUuid)?.profileImage || null,
        result: p.resultData,
      }))
      .sort((a, b) => b.result - a.result);

    const isParticipating = allResults.some((p) => p.userUuid === userUuid);
    const myResult =
      ranked.find((r) => r.userUuid === userUuid)?.result ?? null;
    const myRank = ranked.findIndex((r) => r.userUuid === userUuid);
    const myRankValue = myRank === -1 ? null : myRank + 1;
    const myName = userMap.get(userUuid)?.name ?? null;
    const myProfileImage = userMap.get(userUuid)?.profileImage ?? null;

    return {
      mission,
      isParticipating,
      myResult,
      myRank: myRankValue,
      myName,
      myProfileImage,
      rankings: ranked.slice(0, 20),
      status,
    };
  }

  // 결과 제출
  async submitResult(
    missionId: number,
    userUuid: string,
    resultData: number,
  ): Promise<MissionParticipation> {
    const participation = await this.participationRepo.findOneBy({
      missionId,
      userUuid,
    });

    if (!participation) {
      throw new NotFoundException('해당 미션에 참여한 기록이 없습니다.');
    }

    // 미션 정보 가져오기 (단기 여부 판단용)
    const mission = await this.missionRepo.findOneBy({ id: missionId });
    if (!mission) {
      throw new NotFoundException('미션을 찾을 수 없습니다.');
    }

    const now = new Date();

    if (mission.startTime > now) {
      CustomException.throw(
        ErrorCode.CHALLENGE_NOT_STARTED,
        '아직 미션이 시작되지 않았습니다.',
      );
    }

    if (mission.endTime < now) {
      CustomException.throw(
        ErrorCode.CHALLENGE_ALREADY_FINISHED,
        '챌린지가 이미 종료되었습니다.',
      );
    }

    participation.resultData = resultData;

    // 단기 미션이면 완료 처리
    if (!mission.isLongTerm) {
      participation.completed = true;
    }

    return this.participationRepo.save(participation);
  }

  // 진행 중 & 예정 미션 조회
  async findAll() {
    const now = new Date();

    const missions = await this.missionRepo.find({
      where: {
        endTime: MoreThan(now),
      },
      order: { startTime: 'ASC' },
    });

    return missions.map((mission) => {
      let status: 'UPCOMING' | 'ONGOING';

      if (mission.startTime > now) {
        status = 'UPCOMING';
      } else {
        status = 'ONGOING';
      }

      return {
        ...mission,
        status,
      };
    });
  }

  // 내 미션 조회
  async findMyMissions(userUuid: string) {
    const participations = await this.participationRepo.find({
      where: { userUuid },
      order: { joinedAt: 'DESC' },
    });

    const missionIds = participations.map((p) => p.missionId);
    if (missionIds.length === 0) return [];

    const missions = await this.missionRepo.find({
      where: { id: In(missionIds) },
    });

    const now = new Date();

    return missions
      .filter((mission) => mission) // 혹시라도 null 방지
      .map((mission) => {
        let status: MissionStatus;
        if (now < mission.startTime) status = '진행예정';
        else if (now <= mission.endTime) status = '진행중';
        else status = '완료';

        return {
          id: mission.id,
          title: mission.title,
          description: mission.description,
          type: mission.type,
          startTime: mission.startTime,
          endTime: mission.endTime,
          reward: mission.reward,
          status,
        };
      });
  }

  // 참여 취소
  async cancelParticipation(userUuid: string, missionId: number) {
    const participation = await this.participationRepo.findOne({
      where: { userUuid, missionId },
    });

    if (!participation) {
      throw new NotFoundException('참여 기록이 없습니다.');
    }

    await this.participationRepo.remove(participation);

    return { message: '미션 참여가 취소되었습니다.' };
  }
}
