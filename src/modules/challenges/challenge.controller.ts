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
import { JoinChallengeDto } from './dto/join-challenge.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ApiCreateChallenge,
  ApiGetAllChallenges,
  ApiGetChallenge,
  ApiUpdateChallenge,
  ApiDeleteChallenge,
  ApiJoinChallenge,
  ApiGetUserChallenges,
  ApiLeaveChallenge,
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
   * 챌린지 상세 조회
   * @param challengeId 챌린지 ID
   * @param userUuid 현재 로그인한 사용자의 UUID
   * @returns 챌린지 상세 정보
   */
  @Get(':challengeId')
  @ApiGetChallenge()
  findOne(
    @Param('challengeId') challengeId: string,
    @UserUuid() userUuid: string,
  ) {
    return this.challengeService.findOneChallenge(+challengeId, userUuid);
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
   * 챌린지 삭제
   * @param challengeId 챌린지 ID
   * @param userUuid 현재 로그인한 사용자의 UUID
   */
  @Delete(':challengeId')
  @ApiDeleteChallenge()
  remove(
    @Param('challengeId') challengeId: string,
    @UserUuid() userUuid: string,
  ) {
    return this.challengeService.deleteChallenge(+challengeId, userUuid);
  }

  /**
   * 챌린지 참여
   * @param challengeId 챌린지 ID
   * @param joinChallengeDto 참여 정보
   * @param userUuid 현재 로그인한 사용자의 UUID
   * @returns 참여된 챌린지 정보
   */
  @Post(':challengeId/join')
  @ApiJoinChallenge()
  joinChallenge(
    @Param('challengeId') challengeId: string,
    @Body() joinChallengeDto: JoinChallengeDto,
    @UserUuid() userUuid: string,
  ) {
    return this.challengeService.joinChallenge(
      +challengeId,
      userUuid,
      joinChallengeDto.password,
    );
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
    @Param('challengeId') challengeId: string,
    @UserUuid() userUuid: string,
  ) {
    return this.challengeService.leaveChallenge(+challengeId, userUuid);
  }
}
