import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mission } from '@/entities/mission.entity';
import { MissionParticipation } from '@/entities/mission-participation.entity';
import { Repository, In } from 'typeorm';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';

type MissionStatus = '진행예정' | '진행중' | '완료';

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(Mission)
    private readonly missionRepo: Repository<Mission>,
    @InjectRepository(MissionParticipation)
    private readonly participationRepo: Repository<MissionParticipation>,
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

  async getDetailWithRank(
    missionId: number,
    userUuid: string,
  ): Promise<{
    mission: Mission;
    isParticipating: boolean;
    myResult: number | null;
    myRank: number | null;
    rankings: {
      userUuid: string;
      result: number;
    }[];
  }> {
    const mission = await this.missionRepo.findOneBy({ id: missionId });
    if (!mission) throw new NotFoundException('미션을 찾을 수 없습니다.');

    const allResults = await this.participationRepo.find({
      where: { missionId },
    });

    // 참여자 랭킹 계산 (distance가 있을 경우)
    const ranked = allResults
      .filter((p) => p.resultData?.distance != null)
      .map((p) => ({
        userUuid: p.userUuid,
        result: p.resultData.distance,
      }))
      .sort((a, b) => b.result - a.result); // 높은 순으로 정렬

    const isParticipating = allResults.some((p) => p.userUuid === userUuid);

    const myResult =
      ranked.find((r) => r.userUuid === userUuid)?.result ?? null;
    const myRank = ranked.findIndex((r) => r.userUuid === userUuid);
    const myRankValue = myRank === -1 ? null : myRank + 1;

    return {
      mission,
      isParticipating,
      myResult,
      myRank: myRankValue,
      rankings: ranked.slice(0, 20), // 상위 10명만
    };
  }

  async submitResult(
    missionId: number,
    userUuid: string,
    resultData: Record<string, any>,
  ): Promise<MissionParticipation> {
    const participation = await this.participationRepo.findOneBy({
      missionId,
      userUuid,
    });

    if (!participation) {
      throw new NotFoundException('해당 미션에 참여한 기록이 없습니다.');
    }

    participation.resultData = resultData;
    // participation.completed = true; // 결과가 올라오면 완료 처리

    return this.participationRepo.save(participation);
  }

  // 전체 미션 조회
  async findAll() {
    return await this.missionRepo.find({
      order: { startTime: 'DESC' },
    });
  }

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
}
