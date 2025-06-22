import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from '@/entities/like.entity';
import { CreateLikeDto } from './dto/create-like.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  /**
   * 좋아요 추가
   * @param createLikeDto 좋아요 생성 정보
   * @returns 생성된 좋아요 정보와 좋아요 수
   */
  async createLike(createLikeDto: CreateLikeDto, userUuid: string) {
    // 이미 좋아요한 게시글인지 확인
    const existingLike = await this.likeRepository.findOne({
      where: {
        postUuid: createLikeDto.postUuid,
        userUuid,
      },
    });

    if (existingLike) {
      throw new ConflictException('이미 좋아요한 게시글입니다.');
    }

    // 좋아요 생성
    const like = this.likeRepository.create({
      ...createLikeDto,
      userUuid,
    });

    await this.likeRepository.save(like);

    // 게시글의 전체 좋아요 수 조회
    const likeCount = await this.getLikeCountByPostId(createLikeDto.postUuid);

    return {
      id: like.id,
      likeCount,
    };
  }

  /**
   * 게시글의 좋아요 수 조회
   * @param postUuid 게시글 ID
   * @returns 좋아요 수
   */
  async getLikeCountByPostId(postUuid: string): Promise<number> {
    return this.likeRepository.count({
      where: { postUuid },
    });
  }

  /**
   * 사용자가 게시글에 좋아요했는지 확인
   * @param userUuid 사용자 UUID
   * @param postUuid 게시글 ID
   * @returns 좋아요 여부와 좋아요 ID
   */
  async checkLikeStatus(userUuid: string, postUuid: string) {
    const like = await this.likeRepository.findOne({
      where: {
        userUuid,
        postUuid,
      },
    });

    return {
      liked: !!like,
    };
  }

  /**
   * 게시글 좋아요 삭제
   * @param postUuid 게시글 ID
   * @param userUuid 사용자 UUID
   * @returns 삭제 성공 메시지와 업데이트된 좋아요 수
   */
  async removeLike(postUuid: string, userUuid: string) {
    const like = await this.likeRepository.findOne({
      where: {
        postUuid,
        userUuid,
      },
    });

    if (!like) {
      throw new NotFoundException('해당 게시글에 좋아요를 하지 않았습니다.');
    }

    await this.likeRepository.delete(like.id);

    // 업데이트된 좋아요 수 조회
    const likeCount = await this.getLikeCountByPostId(postUuid);

    return {
      success: true,
      likeCount,
    };
  }

  /**
   * 여러 게시글의 좋아요 수 조회
   * @param postUuids 게시글 ID 배열
   * @returns 게시글 ID를 키로 하는 좋아요 수 맵
   */
  async getLikeCountsByPostIds(
    postUuids: string[],
  ): Promise<Map<string, number>> {
    const likes = await this.likeRepository
      .createQueryBuilder('like')
      .select('like.postUuid', 'postUuid')
      .addSelect('COUNT(like.id)', 'count')
      .where('like.postUuid IN (:...postUuids)', { postUuids })
      .groupBy('like.postUuid')
      .getRawMany();

    const likeCountMap = new Map<string, number>();

    // 모든 게시글에 대해 초기값 0 설정
    postUuids.forEach((id) => likeCountMap.set(id, 0));

    // 좋아요가 있는 게시글의 카운트 설정
    likes.forEach((like) => {
      likeCountMap.set(like.postUuid, parseInt(like.count));
    });

    return likeCountMap;
  }
}
