import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { FindAllChallengesDto } from './dto/find-all-challenges.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ApiCreateChallenge,
  ApiGetAllChallenges,
  ApiGetChallenge,
  ApiUpdateChallenge,
  ApiJoinChallenge,
  ApiGetUserChallenges,
  ApiLeaveChallenge,
  ApiGetRecentChallenges,
} from './decorators/challenges.swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { UserUuid } from '@/decorators/user-uuid.decorator';
import { ChallengeService } from './challenge.service';

@ApiTags('challenge')
@ApiBearerAuth('JWT-auth')
@Controller('challenge')
@UseGuards(JwtAuthGuard)
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  /**
   * 사용자가 참여한 챌린지 조회
   * @param userUuid 인증된 사용자 UUID
   * @returns 사용자가 참여한 챌린지 정보
   */
  @Get('user')
  @ApiGetUserChallenges()
  getUserChallenges(@UserUuid() userUuid: string) {
    return this.challengeService.findUserChallenges(userUuid);
  }

  /**
   * 챌린지 생성
   * @param createChallengeDto 챌린지 생성 정보
   * @param userUuid 인증된 사용자 UUID
   * @returns 생성된 챌린지 정보
   */
  @Post()
  @ApiCreateChallenge()
  create(
    @Body() createChallengeDto: CreateChallengeDto,
    @UserUuid() userUuid: string,
  ) {
    return this.challengeService.createChallenge(createChallengeDto, userUuid);
  }

  /**
   * 모든 챌린지 조회
   * @param findAllChallengesDto 조회 조건
   * @returns 모든 챌린지 정보
   */
  @Get()
  @ApiGetAllChallenges()
  findAll(@Query() findAllChallengesDto: FindAllChallengesDto) {
    return this.challengeService.findAllChallenges(findAllChallengesDto);
  }

  /**
   * 최근 생성된 챌린지 목록
   * @returns 최근 생성된 챌린지 목록
   */

  @Get('recent')
  @ApiGetRecentChallenges()
  getRecentChallenges() {
    return this.challengeService.getRecentChallenges();
  }

  /**
   * 인기있는 챌린지 목록
   * @returns 최근 생성된 챌린지 목록
   */

  @Get('recent')
  @ApiGetRecentChallenges()
  getPopularChallenges() {
    return this.challengeService.getRecentChallenges();
  }

  /**
   * 챌린지 상세 조회
   * @param challengeId 챌린지 ID
   * @param userUuid 현재 로그인한 사용자의 UUID
   * @returns 챌린지 상세 정보
   */
  @Get(':challengeUuid')
  @ApiGetChallenge()
  findOne(
    @Param('challengeUuid') challengeUuid: string,
    @UserUuid() userUuid: string,
  ) {
    return this.challengeService.findOneChallenge(challengeUuid, userUuid);
  }

  /**
   * 챌린지 수정
   * @param challengeId 챌린지 ID
   * @param updateChallengeDto 챌린지 수정 정보
   * @param userUuid 현재 로그인한 사용자의 UUID
   * @returns 수정된 챌린지 정보
   */
  @Patch(':challengeId')
  @ApiUpdateChallenge()
  update(
    @Param('challengeId') challengeId: string,
    @Body() updateChallengeDto: UpdateChallengeDto,
    @UserUuid() userUuid: string,
  ) {
    return this.challengeService.updateChallenge(
      +challengeId,
      updateChallengeDto,
      userUuid,
    );
  }

  /**
   * 챌린지 참여
   * @param challengeUuid 챌린지 Uuid
   * @param joinChallengeDto 참여 정보
   * @param userUuid 현재 로그인한 사용자의 UUID
   * @returns 참여된 챌린지 정보
   */
  @Post(':challengeId/join')
  @ApiJoinChallenge()
  joinChallenge(
    @Param('challengeUuid') challengeUuid: string,
    @UserUuid() userUuid: string,
  ) {
    return this.challengeService.joinChallenge(challengeUuid, userUuid);
  }

  /**
   * 챌린지 탈퇴
   * @param challengeId 챌린지 ID
   * @param userUuid 현재 로그인한 사용자의 UUID
   * @returns 탈퇴 메시지
   */
  @Delete(':challengeId/leave')
  @ApiLeaveChallenge()
  leaveChallenge(
    @Param('challengeUuid') challengeUuid: string,
    @UserUuid() userUuid: string,
  ) {
    return this.challengeService.leaveChallenge(challengeUuid, userUuid);
  }
}
