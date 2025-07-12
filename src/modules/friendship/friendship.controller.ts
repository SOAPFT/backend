import { Controller } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { UserUuid } from '@/decorators/user-uuid.decorator';
import { Body, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { CreateFriendRequestDto } from './dto/create-friendrequest.dto';
import {
  ApiAcceptFriendRequest,
  ApiGetFriendList,
  ApiGetReceivedRequests,
  ApiGetSentRequests,
  ApiRejectFriendRequest,
  ApiRemoveFriend,
  ApiSendFriendRequest,
  ApiSearchUsersWithFriendStatus,
} from './decorators/friendship.swagger';

@ApiTags('frendship')
@Controller('friendship')
@ApiBearerAuth('JWT-auth')
@Controller('friendship')
@UseGuards(JwtAuthGuard)
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  /**
   * 친구 신청
   * @param dto 친구 신청 정보 (상대 UUID)
   * @param userUuid 요청자 UUID
   * @returns 신청 성공 메시지
   */
  @Post('request')
  @ApiSendFriendRequest()
  async sendFriendRequest(
    @Body() dto: CreateFriendRequestDto,
    @UserUuid() userUuid: string,
  ) {
    return this.friendshipService.sendFriendRequest(userUuid, dto);
  }

  /**
   * 친구 요청 수락
   * @param friendRequestId 친구 요청 ID
   * @param userUuid 수락자 UUID
   * @returns 수락 성공 메시지
   */
  @Post('accept/:friendRequestId')
  @ApiAcceptFriendRequest()
  async acceptFriendRequest(
    @Param('friendRequestId') friendRequestId: number,
    @UserUuid() userUuid: string,
  ) {
    return this.friendshipService.acceptFriendRequest(
      friendRequestId,
      userUuid,
    );
  }

  /**
   * 친구 요청 거절
   * @param friendRequestId 친구 요청 ID
   * @param userUuid 거절자 UUID
   * @returns 거절 성공 메시지
   */
  @ApiRejectFriendRequest()
  @Post('reject/:friendRequestId')
  async rejectFriendRequest(
    @Param('friendRequestId') friendRequestId: number,
    @UserUuid() userUuid: string,
  ) {
    return this.friendshipService.rejectFriendRequest(
      friendRequestId,
      userUuid,
    );
  }

  /**
   * 친구 삭제
   * @param friendId 친구 관계 ID
   * @param userUuid 사용자 UUID
   * @returns 삭제 성공 메시지
   */
  @Delete(':friendId')
  @ApiRemoveFriend()
  async removeFriend(
    @Param('friendId') friendId: number,
    @UserUuid() userUuid: string,
  ) {
    return this.friendshipService.removeFriend(friendId, userUuid);
  }

  /**
   * 친구 목록 조회
   * @param userUuid 사용자 UUID
   * @returns 친구 목록
   */
  @Get('list')
  @ApiGetFriendList()
  async getFriendList(@UserUuid() userUuid: string) {
    return this.friendshipService.getFriendList(userUuid);
  }

  /**
   * 받은 친구 요청 목록 조회
   * @param userUuid 사용자 UUID
   * @returns 받은 친구 요청 목록
   */
  @Get('received-requests')
  @ApiGetReceivedRequests()
  async getReceivedRequests(@UserUuid() userUuid: string) {
    return this.friendshipService.getReceivedRequests(userUuid);
  }

  /**
   * 보낸 친구 요청 목록 조회
   * @param userUuid 사용자 UUID
   * @returns 보낸 친구 요청 목록
   */
  @Get('sent-requests')
  @ApiGetSentRequests()
  async getSentRequests(@UserUuid() userUuid: string) {
    return this.friendshipService.getSentRequests(userUuid);
  }

  /**
   * 친구 검색 함수
   */
  @Get('friends/search')
  @ApiSearchUsersWithFriendStatus()
  async searchFriends(
    @UserUuid() userUuid: string, // 현재 로그인한 사용자 UUID
    @Query('keyword') keyword: string, // 검색할 닉네임 키워드
  ) {
    return this.friendshipService.searchUsersWithFriendStatus(
      userUuid,
      keyword,
    );
  }
}
