import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Like } from '../../src/entities/like.entity';
import { User } from '../../src/entities/user.entity';
import { Post } from '../../src/entities/post.entity';

export class LikeSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const likeRepository = dataSource.getRepository(Like);
    const userRepository = dataSource.getRepository(User);
    const postRepository = dataSource.getRepository(Post);

    // 기존 데이터 확인
    const existingLikes = await likeRepository.find();
    if (existingLikes.length > 0) {
      console.log('Like seeds already exist, skipping...');
      return;
    }

    // 사용자 데이터 가져오기
    const users = await userRepository.find();
    if (users.length === 0) {
      console.log('No users found, please run user seeds first');
      return;
    }

    // 게시글 데이터 가져오기
    const posts = await postRepository.find();
    if (posts.length === 0) {
      console.log('No posts found, please run post seeds first');
      return;
    }

    const likes = [
      // 첫 번째 게시글 (운동 성공) - 3명의 좋아요
      { userUuid: users[1].userUuid, postUuid: posts[0].postUuid },
      { userUuid: users[2].userUuid, postUuid: posts[0].postUuid },
      { userUuid: users[3].userUuid, postUuid: posts[0].postUuid },

      // 두 번째 게시글 (10,000보 달성) - 2명의 좋아요
      { userUuid: users[4].userUuid, postUuid: posts[1].postUuid },
      { userUuid: users[8].userUuid, postUuid: posts[1].postUuid },

      // 세 번째 게시글 (홈트레이닝) - 5명의 좋아요
      { userUuid: users[0].userUuid, postUuid: posts[2].postUuid },
      { userUuid: users[1].userUuid, postUuid: posts[2].postUuid },
      { userUuid: users[5].userUuid, postUuid: posts[2].postUuid },
      { userUuid: users[6].userUuid, postUuid: posts[2].postUuid },
      { userUuid: users[7].userUuid, postUuid: posts[2].postUuid },

      // 네 번째 게시글 (요가) - 4명의 좋아요
      { userUuid: users[1].userUuid, postUuid: posts[3].postUuid },
      { userUuid: users[5].userUuid, postUuid: posts[3].postUuid },
      { userUuid: users[7].userUuid, postUuid: posts[3].postUuid },
      { userUuid: users[8].userUuid, postUuid: posts[3].postUuid },

      // 다섯 번째 게시글 (물마시기 챌린지) - 6명의 좋아요
      { userUuid: users[0].userUuid, postUuid: posts[4].postUuid },
      { userUuid: users[1].userUuid, postUuid: posts[4].postUuid },
      { userUuid: users[2].userUuid, postUuid: posts[4].postUuid },
      { userUuid: users[3].userUuid, postUuid: posts[4].postUuid },
      { userUuid: users[6].userUuid, postUuid: posts[4].postUuid },
      { userUuid: users[8].userUuid, postUuid: posts[4].postUuid },

      // 여섯 번째 게시글 (러닝 5km 완주) - 3명의 좋아요
      { userUuid: users[0].userUuid, postUuid: posts[5].postUuid },
      { userUuid: users[3].userUuid, postUuid: posts[5].postUuid },
      { userUuid: users[7].userUuid, postUuid: posts[5].postUuid },

      // 일곱 번째 게시글 (웨이트 트레이닝) - 7명의 좋아요
      { userUuid: users[0].userUuid, postUuid: posts[6].postUuid },
      { userUuid: users[2].userUuid, postUuid: posts[6].postUuid },
      { userUuid: users[3].userUuid, postUuid: posts[6].postUuid },
      { userUuid: users[4].userUuid, postUuid: posts[6].postUuid },
      { userUuid: users[5].userUuid, postUuid: posts[6].postUuid },
      { userUuid: users[7].userUuid, postUuid: posts[6].postUuid },
      { userUuid: users[8].userUuid, postUuid: posts[6].postUuid },

      // 여덟 번째 게시글 (스쿼트 100개 달성) - 2명의 좋아요
      { userUuid: users[1].userUuid, postUuid: posts[7].postUuid },
      { userUuid: users[3].userUuid, postUuid: posts[7].postUuid },

      // 아홉 번째 게시글 (아침 산책) - 4명의 좋아요
      { userUuid: users[0].userUuid, postUuid: posts[8].postUuid },
      { userUuid: users[2].userUuid, postUuid: posts[8].postUuid },
      { userUuid: users[4].userUuid, postUuid: posts[8].postUuid },
      { userUuid: users[6].userUuid, postUuid: posts[8].postUuid },

      // 열 번째 게시글 (헬스장 운동 루틴) - 6명의 좋아요
      { userUuid: users[0].userUuid, postUuid: posts[9].postUuid },
      { userUuid: users[2].userUuid, postUuid: posts[9].postUuid },
      { userUuid: users[3].userUuid, postUuid: posts[9].postUuid },
      { userUuid: users[5].userUuid, postUuid: posts[9].postUuid },
      { userUuid: users[7].userUuid, postUuid: posts[9].postUuid },
      { userUuid: users[8].userUuid, postUuid: posts[9].postUuid },

      // 열한 번째 게시글 (홈트 새로운 동작) - 3명의 좋아요
      { userUuid: users[2].userUuid, postUuid: posts[10].postUuid },
      { userUuid: users[5].userUuid, postUuid: posts[10].postUuid },
      { userUuid: users[7].userUuid, postUuid: posts[10].postUuid },

      // 열두 번째 게시글 (가족과 자전거 라이딩) - 5명의 좋아요
      { userUuid: users[0].userUuid, postUuid: posts[11].postUuid },
      { userUuid: users[1].userUuid, postUuid: posts[11].postUuid },
      { userUuid: users[3].userUuid, postUuid: posts[11].postUuid },
      { userUuid: users[5].userUuid, postUuid: posts[11].postUuid },
      { userUuid: users[8].userUuid, postUuid: posts[11].postUuid },

      // 열네 번째 게시글 (러닝 앱으로 기록 관리) - 4명의 좋아요
      { userUuid: users[0].userUuid, postUuid: posts[13].postUuid },
      { userUuid: users[2].userUuid, postUuid: posts[13].postUuid },
      { userUuid: users[4].userUuid, postUuid: posts[13].postUuid },
      { userUuid: users[6].userUuid, postUuid: posts[13].postUuid },

      // 열다섯 번째 게시글 (운동 후 건강한 간식) - 3명의 좋아요
      { userUuid: users[1].userUuid, postUuid: posts[14].postUuid },
      { userUuid: users[3].userUuid, postUuid: posts[14].postUuid },
      { userUuid: users[7].userUuid, postUuid: posts[14].postUuid },
    ];

    for (const likeData of likes) {
      await likeRepository.save(likeData);
    }

    console.log('Like seeds created successfully!');
  }
}
