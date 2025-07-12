import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../../src/entities/user.entity';
import { SocialProvider } from '../../src/types/social-provider.enum';
import { UserStatusType } from '../../src/types/user-status.enum';
import { GenderType } from '../../src/types/challenge.enum';
import { ulid } from 'ulid';
import { generateNickname } from 'starving-orange';

export class UserSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    // 기존 사용자 확인
    const existingUsers = await userRepository.find();
    if (existingUsers.length > 0) {
      console.log('사용자 데이터가 이미 존재합니다. 시드를 건너뜁니다.');
      return;
    }

    // 중복되지 않는 닉네임 생성 함수
    const generateUniqueNickname = async (): Promise<string> => {
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        try {
          const generatedNickname = generateNickname();
          const existingUser = await userRepository.findOne({
            where: { nickname: generatedNickname.nickname },
          });

          if (!existingUser) {
            return generatedNickname.nickname;
          }
        } catch (error) {
          console.error('starving-orange 라이브러리 오류:', error);
          break;
        }

        attempts++;
      }

      // fallback: 랜덤 닉네임 생성
      const timestamp = Date.now().toString().slice(-6);
      return `사용자_${timestamp}`;
    };

    const users = [];
    for (let i = 0; i < 10; i++) {
      const uniqueNickname = await generateUniqueNickname();
      users.push({
        userUuid: ulid(),
        nickname: uniqueNickname,
        socialNickname: `social_${uniqueNickname}`,
        profileImage: `https://picsum.photos/200/200?random=${i}`,
        socialProvider: [
          SocialProvider.KAKAO,
          SocialProvider.NAVER,
          SocialProvider.APPLE,
        ][i % 3],
        socialId: `social_${100000 + i}`,
        introduction: `안녕하세요! ${uniqueNickname}입니다. 함께 챌린지를 도전해요! 😊`,
        gender: i % 2 === 0 ? GenderType.MALE : GenderType.FEMALE,
        birthDate: new Date(1990 + (i % 10), i % 12, (i % 28) + 1),
        coins: Math.floor(Math.random() * 100) + 20,
        pushToken: `push_token_${String(i).padStart(3, '0')}`,
        isPushEnabled: i % 7 !== 0, // 대부분 활성화, 일부는 비활성화
        status: UserStatusType.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await userRepository.save(users);
    console.log('사용자 시드 데이터 생성 완료');
  }
}
