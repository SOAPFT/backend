import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friendship } from '@/entities/friendship.entity';
import { Repository, In, ILike } from 'typeorm';
import { CreateFriendRequestDto } from './dto/create-friendrequest.dto';
import { ErrorCode } from '@/types/error-code.enum';
import { CustomException } from '@/utils/custom-exception';
import { FriendshipStatus } from '@/types/friendship.enum';
import { User } from '@/entities/user.entity';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 친구 신청
   * @param requesterUuid 요청자 UUID
   * @param dto 친구 신청 정보
   * @returns 신청 성공 메시지
   */
  async sendFriendRequest(requesterUuid: string, dto: CreateFriendRequestDto) {
    const { addresseeUuid } = dto;

    // 자기 자신에게 친구 신청 불가
    if (requesterUuid === addresseeUuid) {
      CustomException.throw(
        ErrorCode.CANNOT_FRIEND_SELF,
        '자기 자신에게 친구 신청을 할 수 없습니다.',
      );
    }

    // 이미 친구 요청이 존재하는지 확인
    const existing = await this.friendshipRepository.findOne({
      where: [
        { requesterUuid, addresseeUuid },
        { requesterUuid: addresseeUuid, addresseeUuid: requesterUuid },
      ],
    });

    if (existing) {
      CustomException.throw(
        ErrorCode.ALREADY_FRIENDS,
        '이미 친구 요청이 존재하거나 친구 상태입니다.',
      );
    }

    // 친구 요청 생성
    const friendRequest = this.friendshipRepository.create({
      requesterUuid,
      addresseeUuid,
      status: FriendshipStatus.PENDING,
    });

    await this.friendshipRepository.save(friendRequest);

    return { message: '친구 요청이 전송되었습니다.' };
  }

  /**
   * 친구 요청 수락
   * @param friendRequestId 친구 요청 ID
   * @param userUuid 수락자 UUID
   * @returns 수락 성공 메시지
   */
  async acceptFriendRequest(friendRequestId: number, userUuid: string) {
    const request = await this.friendshipRepository.findOne({
      where: { id: friendRequestId, addresseeUuid: userUuid },
    });

    if (!request) {
      CustomException.throw(
        ErrorCode.FRIEND_REQUEST_NOT_FOUND,
        '친구 요청을 찾을 수 없습니다.',
      );
    }

    request.status = FriendshipStatus.ACCEPTED;
    await this.friendshipRepository.save(request);

    return { message: '친구 요청을 수락했습니다.' };
  }

  /**
   * 친구 요청 거절
   * @param friendRequestId 친구 요청 ID
   * @param userUuid 거절자 UUID
   * @returns 거절 성공 메시지
   */
  async rejectFriendRequest(friendRequestId: number, userUuid: string) {
    const request = await this.friendshipRepository.findOne({
      where: { id: friendRequestId, addresseeUuid: userUuid },
    });

    if (!request) {
      CustomException.throw(
        ErrorCode.FRIEND_REQUEST_NOT_FOUND,
        '친구 요청을 찾을 수 없습니다.',
      );
    }

    await this.friendshipRepository.delete(friendRequestId);

    return { message: '친구 요청을 거절했습니다.' };
  }

  /**
   * 친구 삭제
   * @param friendId 친구 관계 ID
   * @param userUuid 사용자 UUID
   * @returns 삭제 성공 메시지
   */
  async removeFriend(friendId: number, userUuid: string) {
    const friend = await this.friendshipRepository.findOne({
      where: [
        { id: friendId, requesterUuid: userUuid },
        { id: friendId, addresseeUuid: userUuid },
      ],
    });

    if (!friend) {
      CustomException.throw(
        ErrorCode.FRIENDSHIP_NOT_FOUND,
        '친구 관계를 찾을 수 없습니다.',
      );
    }

    await this.friendshipRepository.delete(friendId);

    return { message: '친구가 삭제되었습니다.' };
  }

  /**
   * 친구 목록 조회
   * @param userUuid 사용자 UUID
   * @returns 친구 목록
   */
  async getFriendList(userUuid: string) {
    const friends = await this.friendshipRepository.find({
      where: [
        { requesterUuid: userUuid, status: FriendshipStatus.ACCEPTED },
        { addresseeUuid: userUuid, status: FriendshipStatus.ACCEPTED },
      ],
    });

    const friendInfos = await Promise.all(
      friends.map(async (friend) => {
        // 상대방 UUID 구하기
        const friendUuid =
          friend.requesterUuid === userUuid
            ? friend.addresseeUuid
            : friend.requesterUuid;

        // 상대방 정보 조회
        const user = await this.userRepository.findOne({
          where: { userUuid: friendUuid },
          select: ['userUuid', 'nickname', 'profileImage'],
        });

        return {
          friendId: friend.id,
          friendUuid: user?.userUuid,
          nickname: user?.nickname,
          profileImage: user?.profileImage,
          status: friend.status,
          createdAt: friend.createdAt,
        };
      }),
    );

    return { friends: friendInfos };
  }

  /**
   * 받은 친구 요청 목록 조회
   * @param userUuid 사용자 UUID
   * @returns 받은 친구 요청 목록
   */
  async getReceivedRequests(userUuid: string) {
    const requests = await this.friendshipRepository.find({
      where: {
        addresseeUuid: userUuid,
        status: FriendshipStatus.PENDING,
      },
    });

    const requesterUuids = requests.map((req) => req.requesterUuid);

    const users = await this.userRepository.find({
      where: { userUuid: In(requesterUuids) },
      select: ['userUuid', 'nickname', 'profileImage'],
    });

    const userMap = new Map(users.map((u) => [u.userUuid, u]));

    const receivedRequests = requests.map((req) => {
      const requester = userMap.get(req.requesterUuid);
      return {
        requestId: req.id,
        requesterUuid: requester?.userUuid,
        nickname: requester?.nickname,
        profileImage: requester?.profileImage,
        createdAt: req.createdAt,
      };
    });

    return { receivedRequests };
  }

  /**
   * 보낸 친구 요청 목록 조회
   * @param userUuid 사용자 UUID
   * @returns 보낸 친구 요청 목록
   */
  async getSentRequests(userUuid: string) {
    const requests = await this.friendshipRepository.find({
      where: {
        requesterUuid: userUuid,
        status: FriendshipStatus.PENDING,
      },
    });

    const addresseeUuids = requests.map((req) => req.addresseeUuid);

    const users = await this.userRepository.find({
      where: { userUuid: In(addresseeUuids) },
      select: ['userUuid', 'nickname', 'profileImage'],
    });

    const userMap = new Map(users.map((u) => [u.userUuid, u]));

    const sentRequests = requests.map((req) => {
      const addressee = userMap.get(req.addresseeUuid);
      return {
        requestId: req.id,
        addresseeUuid: addressee?.userUuid,
        nickname: addressee?.nickname,
        profileImage: addressee?.profileImage,
        createdAt: req.createdAt,
      };
    });

    return { sentRequests };
  }

  async searchMyFriends(userUuid: string, keyword: string) {
    // 1. 친구 관계 가져오기 (나와 친구 상태인 유저들)
    const friends = await this.friendshipRepository.find({
      where: [
        { requesterUuid: userUuid, status: FriendshipStatus.ACCEPTED },
        { addresseeUuid: userUuid, status: FriendshipStatus.ACCEPTED },
      ],
    });

    const friendUuids = friends.map((f) =>
      f.requesterUuid === userUuid ? f.addresseeUuid : f.requesterUuid,
    );

    if (friendUuids.length === 0) {
      return [];
    }

    // 2. 친구 목록 중 닉네임 검색
    const users = await this.userRepository.find({
      where: friendUuids.map((uuid) => ({
        userUuid: uuid,
        nickname: ILike(`%${keyword}%`),
      })),
      select: ['userUuid', 'nickname', 'profileImage'],
    });

    return users;
  }
}
