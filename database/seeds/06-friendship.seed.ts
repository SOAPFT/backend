import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Friendship } from '../../src/entities/friendship.entity';
import { User } from '../../src/entities/user.entity';
import { FriendshipStatus } from '../../src/types/friendship.enum';

export class FriendshipSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const friendshipRepository = dataSource.getRepository(Friendship);
    const userRepository = dataSource.getRepository(User);

    // 기존 데이터 확인
    const existingFriendships = await friendshipRepository.find();
    if (existingFriendships.length > 0) {
      console.log('Friendship seeds already exist, skipping...');
      return;
    }

    // 사용자 데이터 가져오기
    const users = await userRepository.find();
    if (users.length === 0) {
      console.log('No users found, please run user seeds first');
      return;
    }

    const friendships = [
      // 승인된 친구 관계들
      {
        requesterUuid: users[0].userUuid,
        addresseeUuid: users[1].userUuid,
        status: FriendshipStatus.ACCEPTED,
      },
      {
        requesterUuid: users[0].userUuid,
        addresseeUuid: users[3].userUuid,
        status: FriendshipStatus.ACCEPTED,
      },
      {
        requesterUuid: users[0].userUuid,
        addresseeUuid: users[6].userUuid,
        status: FriendshipStatus.ACCEPTED,
      },
      {
        requesterUuid: users[1].userUuid,
        addresseeUuid: users[4].userUuid,
        status: FriendshipStatus.ACCEPTED,
      },
      {
        requesterUuid: users[1].userUuid,
        addresseeUuid: users[5].userUuid,
        status: FriendshipStatus.ACCEPTED,
      },
      {
        requesterUuid: users[2].userUuid,
        addresseeUuid: users[7].userUuid,
        status: FriendshipStatus.ACCEPTED,
      },
      {
        requesterUuid: users[3].userUuid,
        addresseeUuid: users[7].userUuid,
        status: FriendshipStatus.ACCEPTED,
      },
      {
        requesterUuid: users[4].userUuid,
        addresseeUuid: users[8].userUuid,
        status: FriendshipStatus.ACCEPTED,
      },
      {
        requesterUuid: users[5].userUuid,
        addresseeUuid: users[8].userUuid,
        status: FriendshipStatus.ACCEPTED,
      },
      {
        requesterUuid: users[6].userUuid,
        addresseeUuid: users[8].userUuid,
        status: FriendshipStatus.ACCEPTED,
      },
      // 대기 중인 친구 요청들
      {
        requesterUuid: users[2].userUuid,
        addresseeUuid: users[0].userUuid,
        status: FriendshipStatus.PENDING,
      },
      {
        requesterUuid: users[4].userUuid,
        addresseeUuid: users[3].userUuid,
        status: FriendshipStatus.PENDING,
      },
      {
        requesterUuid: users[5].userUuid,
        addresseeUuid: users[2].userUuid,
        status: FriendshipStatus.PENDING,
      },
      {
        requesterUuid: users[7].userUuid,
        addresseeUuid: users[6].userUuid,
        status: FriendshipStatus.PENDING,
      },
      {
        requesterUuid: users[8].userUuid,
        addresseeUuid: users[0].userUuid,
        status: FriendshipStatus.PENDING,
      },
      // 거절된 친구 요청들
      {
        requesterUuid: users[2].userUuid,
        addresseeUuid: users[4].userUuid,
        status: FriendshipStatus.REJECTED,
      },
      {
        requesterUuid: users[6].userUuid,
        addresseeUuid: users[1].userUuid,
        status: FriendshipStatus.REJECTED,
      },
      // 차단된 관계들
      {
        requesterUuid: users[3].userUuid,
        addresseeUuid: users[5].userUuid,
        status: FriendshipStatus.BLOCKED,
      },
    ];

    for (const friendshipData of friendships) {
      await friendshipRepository.save(friendshipData);
    }

    console.log('Friendship seeds created successfully!');
  }
}
