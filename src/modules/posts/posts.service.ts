/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Post } from '@/entities/post.entity';
import { CustomException } from '@/utils/custom-exception';
import { ErrorCode } from '@/types/error-code.enum';
import { LikesService } from '@/modules/likes/likes.service';
import { CommentsService } from '../comments/comments.service';
import { ChallengeService } from '../challenges/challenge.service';
import { User } from '@/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ulid } from 'ulid';
import { Comment } from '@/entities/comment.entity';
import { Suspicion } from '@/entities/suspicion.entity';
import { Like } from '@/entities/like.entity';
import { ImageVerification } from '@/entities/image-verification.entity';
import { AiService, ImageAnalysisResult } from '../ai/ai.service';
import { Challenge } from '@/entities/challenge.entity';
import { UploadsService } from '../uploads/uploads.service';
import { JwtService } from '@nestjs/jwt';
import { S3Service } from '../s3/s3.service';
import axios from 'axios';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Suspicion)
    private suspicionRepository: Repository<Suspicion>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(ImageVerification)
    private imageVerificationRepository: Repository<ImageVerification>,
    @InjectRepository(Challenge)
    private challengeRepository: Repository<Challenge>,

    private likesService: LikesService,
    @Inject(forwardRef(() => CommentsService))
    private commentsService: CommentsService,
    @Inject(forwardRef(() => ChallengeService))
    private challengeService: ChallengeService,
    private userService: UsersService,
    private aiService: AiService,
    private s3Service: S3Service,
    private jwtService: JwtService,
  ) {}

  /**
   * 게시글 생성 전 이미지 AI 검증
   */
  async precheckImagesForChallenge(
    challengeUuid: string,
    images: Express.Multer.File[],
    userUuid: string,
  ) {
    try {
      console.log(
        `이미지 사전 검증 시작 - 사용자: ${userUuid}, 챌린지: ${challengeUuid}`,
      );

      // 1. 챌린지 정보 조회
      const challenge = await this.challengeRepository.findOne({
        where: { challengeUuid },
      });

      if (!challenge) {
        throw new Error('챌린지를 찾을 수 없습니다.');
      }

      // 2. 이미지 검증 (크기, 형식 등)
      if (!images || images.length === 0) {
        throw new Error('이미지가 필요합니다.');
      }

      if (images.length > 5) {
        throw new Error('최대 5개의 이미지만 업로드할 수 있습니다.');
      }

      // 3. S3에 이미지 업로드
      const uploadResults = await Promise.all(
        images.map(async (image, index) => {
          try {
            // S3 업로드
            const imageUrl = await this.s3Service.uploadImage(image);

            return {
              success: true,
              imageUrl: imageUrl,
              originalName: image.originalname,
              size: image.size,
            };
          } catch (error) {
            console.error(`이미지 ${index} 업로드 실패:`, error);
            return {
              success: false,
              error: error.message,
              originalName: image.originalname,
            };
          }
        }),
      );

      // 업로드 실패한 이미지가 있는지 확인
      const failedUploads = uploadResults.filter((result) => !result.success);
      if (failedUploads.length > 0) {
        throw new Error(
          `이미지 업로드 실패: ${failedUploads.map((f) => f.originalName).join(', ')}`,
        );
      }

      // 4. 각 이미지에 대해 AI 분석 수행
      const analysisResults = await Promise.all(
        uploadResults.map(async (uploadResult, index) => {
          try {
            console.log(
              `이미지 ${index + 1} AI 분석 시작: ${uploadResult.imageUrl}`,
            );

            // 이미지 URL에서 Base64 변환
            const imageBase64 = await this.imageUrlToBase64(
              uploadResult.imageUrl,
            );

            // AI 분석 수행
            const analysisResult = await this.aiService.analyzeImageRelevance(
              imageBase64,
              challenge.title,
              challenge.introduce,
              challenge.verificationGuide,
            );

            console.log(
              `이미지 ${index + 1} AI 분석 완료: ${analysisResult.suggestedAction} (신뢰도: ${analysisResult.confidence}%)`,
            );

            return {
              imageUrl: uploadResult.imageUrl,
              originalName: uploadResult.originalName,
              analysis: analysisResult,
              success: true,
            };
          } catch (error) {
            console.error(`이미지 ${index + 1} AI 분석 실패:`, error);
            return {
              imageUrl: uploadResult.imageUrl,
              originalName: uploadResult.originalName,
              analysis: {
                isRelevant: false,
                confidence: 0,
                reasoning: `분석 실패: ${error.message}`,
                suggestedAction: 'review' as const,
              },
              success: false,
              error: error.message,
            };
          }
        }),
      );

      // 5. 전체 결과 종합
      const overallResult = this.aiService.getFinalVerificationResult(
        analysisResults.map((r) => r.analysis),
      );

      // 6. 검증 토큰 생성 (보안용)
      const verificationToken = this.jwtService.sign(
        {
          userUuid,
          challengeUuid,
          imageUrls: analysisResults.map((r) => r.imageUrl),
          timestamp: Date.now(),
        },
        { expiresIn: '10m' }, // 10분 유효
      );

      // 7. 프론트엔드에 반환할 응답
      const response = {
        success: true,
        message: '이미지 검증 완료',
        challengeInfo: {
          challengeUuid: challenge.challengeUuid,
          title: challenge.title,
          verificationGuide: challenge.verificationGuide,
        },
        verification: {
          overallStatus: overallResult.overallResult, // 'approved' | 'rejected' | 'pending_review'
          averageConfidence: Math.round(overallResult.averageConfidence),
          totalImages: analysisResults.length,
          approvedImages: analysisResults.filter(
            (r) => r.analysis.suggestedAction === 'approve',
          ).length,
          rejectedImages: analysisResults.filter(
            (r) => r.analysis.suggestedAction === 'reject',
          ).length,
          reviewImages: analysisResults.filter(
            (r) => r.analysis.suggestedAction === 'review',
          ).length,
        },
        images: analysisResults.map((result) => ({
          imageUrl: result.imageUrl,
          originalName: result.originalName,
          status: result.analysis.suggestedAction, // 'approve' | 'reject' | 'review'
          confidence: result.analysis.confidence,
          reasoning: result.analysis.reasoning,
          isRelevant: result.analysis.isRelevant,
        })),
        verificationToken, // 게시글 생성 시 필요
        canCreatePost: overallResult.overallResult === 'approved', // 게시글 생성 가능 여부
        recommendations: this.getRecommendations(
          overallResult.overallResult,
          analysisResults,
        ),
      };

      return response;
    } catch (error) {
      console.error('이미지 사전 검증 실패:', error);

      return {
        success: false,
        message: error.message || '이미지 검증 중 오류가 발생했습니다.',
        canCreatePost: false,
      };
    }
  }

  /**
   * AI 검증 완료된 이미지로 게시글 생성
   */
  async createVerifiedPost(
    createVerifiedPostDto: {
      title: string;
      content: string;
      challengeUuid: string;
      verifiedImageUrls: string[];
      verificationToken: string;
      isPublic?: boolean;
    },
    userUuid: string,
  ) {
    try {
      // 1. 검증 토큰 확인
      const tokenPayload = this.jwtService.verify(
        createVerifiedPostDto.verificationToken,
      );

      if (tokenPayload.userUuid !== userUuid) {
        throw new Error('유효하지 않은 검증 토큰입니다.');
      }

      if (tokenPayload.challengeUuid !== createVerifiedPostDto.challengeUuid) {
        throw new Error('챌린지 정보가 일치하지 않습니다.');
      }

      // 2. 게시글 생성
      const postUuid = ulid();
      const post = this.postRepository.create({
        postUuid,
        userUuid,
        challengeUuid: createVerifiedPostDto.challengeUuid,
        title: createVerifiedPostDto.title,
        content: createVerifiedPostDto.content,
        imageUrl: createVerifiedPostDto.verifiedImageUrls,
        isPublic: createVerifiedPostDto.isPublic ?? true,
        verificationStatus: 'approved', // 이미 검증 완료
        aiConfidence: 100, // 검증 통과
        verifiedAt: new Date(),
        createdAt: new Date(),
      });

      const savedPost = await this.postRepository.save(post);

      return {
        success: true,
        message: '게시글이 성공적으로 생성되었습니다.',
        post: savedPost,
      };
    } catch (error) {
      console.error('검증된 게시글 생성 실패:', error);
      throw new Error(`게시글 생성 실패: ${error.message}`);
    }
  }

  /**
   * AI 분석 결과에 따른 사용자 권장사항 생성
   */
  private getRecommendations(
    overallResult: string,
    analysisResults: any[],
  ): string[] {
    const recommendations: string[] = [];

    if (overallResult === 'approved') {
      recommendations.push('모든 이미지가 챌린지와 관련이 있습니다.');
      recommendations.push('이제 게시글을 작성하실 수 있습니다.');
    } else if (overallResult === 'rejected') {
      recommendations.push('일부 이미지가 챌린지와 관련이 없습니다.');

      const rejectedImages = analysisResults.filter(
        (r) => r.analysis.suggestedAction === 'reject',
      );
      if (rejectedImages.length > 0) {
        recommendations.push(
          `관련성이 낮은 이미지: ${rejectedImages.map((r) => r.originalName).join(', ')}`,
        );
      }

      recommendations.push('챌린지 가이드에 맞는 이미지로 다시 촬영해주세요.');
    } else {
      recommendations.push('일부 이미지가 명확하지 않습니다.');
      recommendations.push(
        '더 명확한 사진을 촬영하거나, 관리자 검토를 기다려주세요.',
      );
    }

    return recommendations;
  }

  /**
   * 기존 게시물 생성
   */
  async createPost(dto: CreatePostDto, userUuid: string) {
    const newPost = this.postRepository.create({
      postUuid: ulid(),
      title: dto.title,
      userUuid,
      challengeUuid: dto.challengeUuid,
      content: dto.content,
      imageUrl: dto.imageUrl,
      isPublic: dto.isPublic ?? true,
      verificationStatus: dto.challengeUuid ? 'pending' : 'approved', // 챌린지 글이면 pending, 일반 글이면 approved
    });

    await this.postRepository.save(newPost);

    return {
      message: '게시물이 생성되었습니다.',
      post: newPost,
    };
  }

  // 게시물 수정
  async updatePost(postUuid: string, dto: UpdatePostDto, userUuid: string) {
    const post = await this.postRepository.findOne({
      where: { postUuid },
    });

    if (!post) {
      CustomException.throw(
        ErrorCode.POST_NOT_FOUND,
        '해당 게시글이 없습니다.',
      );
    }

    if (post.userUuid !== userUuid) {
      CustomException.throw(
        ErrorCode.POST_ACCESS_DENIED,
        '해당 포스트에 접근할 수 없습니다.',
      );
    }

    if (dto.title !== undefined) post.title = dto.title;
    if (dto.content !== undefined) post.content = dto.content;
    if (dto.imageUrl !== undefined) post.imageUrl = dto.imageUrl;
    if (dto.isPublic !== undefined) post.isPublic = dto.isPublic;

    await this.postRepository.save(post);

    return {
      message: '게시글이 수정되었습니다.',
      post,
    };
  }

  // 자신의 게시글 조회
  async getPostsByUserUuid(userUuid: string, page = 1, limit = 10) {
    const [posts, total] = await this.postRepository.findAndCount({
      where: { userUuid },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      message: '사용자 게시글 조회 성공',
      total,
      page,
      limit,
      posts,
    };
  }

  // 특정 사용자 게시글 목록 조회
  async getUserPosts(userUuid: string, page: number, limit: number) {
    const [posts, total] = await this.postRepository.findAndCount({
      where: { userUuid },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      message: '사용자 게시글 목록 조회 성공',
      total,
      page,
      limit,
      posts,
    };
  }

  // 게시글 상세 조회
  async getPostDetail(postUuid: string, userUuid: string) {
    const post = await this.postRepository.findOne({
      where: { postUuid },
    });

    if (!post) {
      CustomException.throw(
        ErrorCode.POST_NOT_FOUND,
        '해당 게시글을 찾을 수 없습니다.',
      );
    }

    post.views += 1;
    await this.postRepository.save(post);

    // 사용자 정보 조회
    const user = await this.userRepository.findOne({
      where: { userUuid: post.userUuid },
      select: ['userUuid', 'nickname', 'profileImage'],
    });

    // 좋아요 수
    const likeCount = await this.likeRepository.count({
      where: { postUuid },
    });

    // 내가 좋아요 했는지 여부
    const liked = await this.likeRepository.findOne({
      where: { postUuid, userUuid },
    });

    // 의심 수
    const suspicionCount = await this.suspicionRepository.count({
      where: { postUuid },
    });
    // 내가 의심했는지 여부
    const suspicious = await this.suspicionRepository.findOne({
      where: { postUuid, userUuid },
    });

    return {
      message: '게시글 상세 조회 성공',
      post: {
        id: post.id,
        postUuid: post.postUuid,
        title: post.title,
        challengeUuid: post.challengeUuid,
        content: post.content,
        imageUrl: post.imageUrl,
        isPublic: post.isPublic,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        userUuid: post.userUuid,
        isMine: post.userUuid === userUuid,
        views: post.views,
        user: user
          ? {
              userUuid: user.userUuid,
              nickname: user.nickname,
              profileImage: user.profileImage,
            }
          : null,
        likeCount,
        isLiked: !!liked,
        suspicionCount,
        isSuspicious: !!suspicious,
      },
    };
  }

  // 게시글 삭제
  async deletePost(postUuid: string, userUuid: string) {
    const post = await this.postRepository.findOne({
      where: { postUuid },
    });

    if (!post) {
      CustomException.throw(
        ErrorCode.POST_NOT_FOUND,
        '해당 게시글을 찾을 수 없습니다.',
      );
    }

    if (post.userUuid !== userUuid) {
      CustomException.throw(
        ErrorCode.POST_ACCESS_DENIED,
        '해당 게시글을 삭제할 권한이 없습니다.',
      );
    }

    await this.postRepository.remove(post);

    return {
      message: '게시글이 삭제되었습니다.',
    };
  }

  // 그룹 게시글 조회
  async getPostsByChallenge(
    challengeUuid: string,
    page: number,
    limit: number,
  ) {
    const [posts, total] = await this.postRepository.findAndCount({
      where: { challengeUuid },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const postUuids = posts.map((post) => post.postUuid);

    if (postUuids.length === 0) {
      return {
        message: '챌린지 게시글 목록 조회 성공',
        total,
        page,
        limit,
        posts: [],
      };
    }

    const likeCounts =
      await this.likesService.getLikeCountsByPostIds(postUuids);

    const commentCountsArray = await this.commentRepository
      .createQueryBuilder('comment')
      .select('comment.postUuid', 'postUuid')
      .addSelect('COUNT(comment.id)', 'count')
      .where('comment.postUuid IN (:...postUuids)', { postUuids })
      .groupBy('comment.postUuid')
      .getRawMany();

    const commentCounts = new Map<string, number>();
    commentCountsArray.forEach((c) =>
      commentCounts.set(c.postUuid, parseInt(c.count)),
    );

    // 각 게시글의 userUuid로 사용자 정보 조회 후 병합
    const postsWithUserAndLike = await Promise.all(
      posts.map(async (post) => {
        const user = await this.userRepository.findOne({
          where: { userUuid: post.userUuid },
          select: ['userUuid', 'nickname', 'profileImage'],
        });

        return {
          ...post,
          user: user
            ? {
                userUuid: user.userUuid,
                nickname: user.nickname,
                profileImage: user.profileImage,
              }
            : null,
          likeCount: likeCounts.get(post.postUuid) || 0,
          commentCount: commentCounts.get(post.postUuid) || 0,
        };
      }),
    );

    return {
      message: '챌린지 게시글 목록 조회 성공',
      total,
      page,
      limit,
      posts: postsWithUserAndLike,
    };
  }

  async getUserCalendar(userUuid: string, year: number, month: number) {
    const posts = await this.postRepository.find({
      where: {
        userUuid,
        createdAt: Between(
          new Date(`${year}-${month}-01`),
          new Date(`${year}-${month}-31`),
        ),
      },
      select: ['postUuid', 'imageUrl', 'createdAt'],
    });

    // 날짜별 그룹핑
    const grouped = posts.reduce((acc, post) => {
      const date = post.createdAt.toISOString().split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push({
        postUuid: post.postUuid,
        imageUrl: post.imageUrl,
      });
      return acc;
    }, {});

    return Object.entries(grouped).map(([date, posts]) => ({
      date,
      posts,
    }));
  }

  async reportSuspiciousPost(userUuid: string, postUuid: string) {
    const existing = await this.suspicionRepository.findOne({
      where: { userUuid, postUuid },
    });

    if (existing) {
      CustomException.throw(
        ErrorCode.ALREADY_REPORTED,
        '이미 의심한 게시글입니다.',
      );
    }

    const report = this.suspicionRepository.create({ userUuid, postUuid });
    await this.suspicionRepository.save(report);

    return { message: '의심하기 완료' };
  }

  /**
   * 이미지 URL을 base64로 변환
   */
  private async imageUrlToBase64(imageUrl: string): Promise<string> {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SOAPFT-Bot/1.0)',
        },
      });
      const base64 = Buffer.from(response.data, 'binary').toString('base64');
      return base64;
    } catch (error) {
      console.error('이미지 다운로드 실패:', imageUrl, error);
      throw new Error(`이미지를 다운로드할 수 없습니다: ${imageUrl}`);
    }
  }

  /**
   * 게시글의 검증 상태 조회
   */
  async getPostVerificationStatus(postUuid: string) {
    const post = await this.postRepository.findOne({
      where: { postUuid },
      select: [
        'postUuid',
        'verificationStatus',
        'aiConfidence',
        'aiAnalysisResult',
        'verifiedAt',
      ],
    });

    if (!post) {
      CustomException.throw(
        ErrorCode.POST_NOT_FOUND,
        '해당 게시글을 찾을 수 없습니다.',
      );
    }

    const imageVerifications = await this.imageVerificationRepository.find({
      where: { postUuid },
      order: { createdAt: 'ASC' },
    });

    return {
      message: '검증 상태 조회 성공',
      verification: {
        postUuid: post.postUuid,
        status: post.verificationStatus,
        confidence: post.aiConfidence,
        verifiedAt: post.verifiedAt,
        analysisResult: post.aiAnalysisResult
          ? JSON.parse(post.aiAnalysisResult)
          : null,
        imageVerifications,
      },
    };
  }
}
