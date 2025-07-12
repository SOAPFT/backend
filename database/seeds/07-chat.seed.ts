import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { ChatRoom } from '../../src/entities/chat-room.entity';
import { User } from '../../src/entities/user.entity';
import { Challenge } from '../../src/entities/challenge.entity';
import { ChatRoomType } from '../../src/types/chat.enum';
import { ulid } from 'ulid';

export class ChatSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const chatRoomRepository = dataSource.getRepository(ChatRoom);
    const userRepository = dataSource.getRepository(User);
    const challengeRepository = dataSource.getRepository(Challenge);

    // 기존 데이터 확인
    const existingChatRooms = await chatRoomRepository.find();
    if (existingChatRooms.length > 0) {
      console.log('Chat seeds already exist, skipping...');
      return;
    }

    // 사용자 데이터 가져오기
    const users = await userRepository.find();
    if (users.length === 0) {
      console.log('No users found, please run user seeds first');
      return;
    }

    // 챌린지 데이터 가져오기
    const challenges = await challengeRepository.find();
    if (challenges.length === 0) {
      console.log('No challenges found, please run challenge seeds first');
      return;
    }

    const now = new Date();
    const allUserUuids = users.map((user) => user.userUuid);

    // 챌린지별 채팅방 생성 (모든 사용자 참여)
    const chatRooms = [];

    for (const challenge of challenges) {
      chatRooms.push({
        roomUuid: ulid(),
        type: ChatRoomType.GROUP,
        name: challenge.title,
        participantUuids: allUserUuids,
        challengeUuid: challenge.challengeUuid,
        isActive: true,
        lastMessageAt: now,
      });
    }

    // 채팅방 저장
    for (const chatRoomData of chatRooms) {
      await chatRoomRepository.save(chatRoomData);
    }

    console.log('Chat seeds created successfully!');
  }
}
