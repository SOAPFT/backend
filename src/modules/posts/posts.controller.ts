import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiOperation,
} from '@nestjs/swagger';
import {
  ApiCreatePost,
  ApiDeletePost,
  ApiGetUserPosts,
  ApiGetPostDetail,
  ApiUpdatePost,
  ApiGetPostsByChallenge,
  ApiGetMyPosts,
  ApiGetMyCalendar,
  ApiGetOtherCalendar,
  ApiReportSuspicion,
  ApiGetPostVerificationStatus,
} from './decorators/posts.swagger';
import { UserUuid } from '@/decorators/user-uuid.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('post')
@ApiBearerAuth('JWT-auth')
@Controller('post')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * 게시글 생성 전 이미지 AI 검증
   */
  @Post('precheck-images')
  @UseInterceptors(FilesInterceptor('images', 5))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '게시글 생성 전 이미지 AI 검증',
    description: `
      게시글 작성 전에 이미지를 업로드하고 AI가 챌린지 관련성을 검증합니다.
      - 이미지 S3 업로드
      - Bedrock AI 분석
      - 즉시 결과 반환 (approve/reject/review)
    `,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        challengeUuid: {
          type: 'string',
          description: '챌린지 UUID',
          example: '01JZZ7V6QKM61EM8CK3D6WA885',
        },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: '검증할 이미지들 (최대 5개)',
        },
      },
    },
  })
  async precheckImages(
    @Body('challengeUuid') challengeUuid: string,
    @UploadedFiles() images: Express.Multer.File[],
    @UserUuid() userUuid: string,
  ) {
    return this.postsService.precheckImagesForChallenge(
      challengeUuid,
      images,
      userUuid,
    );
  }

  /**
   * AI 검증 완료된 이미지로 게시글 생성
   */
  @Post('create-verified')
  @ApiOperation({
    summary: 'AI 검증 완료된 이미지로 게시글 생성',
    description: '이미 AI 검증을 통과한 이미지들로 게시글을 생성합니다.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: '런닝 챌린지 5일차 인증' },
        content: { type: 'string', example: '오늘 5km 뛰었습니다!' },
        challengeUuid: { type: 'string' },
        verifiedImageUrls: {
          type: 'array',
          items: { type: 'string' },
          description: 'AI 검증을 통과한 이미지 URL들',
        },
        verificationToken: {
          type: 'string',
          description: 'AI 검증 완료 토큰 (보안용)',
        },
        isPublic: { type: 'boolean', default: true },
      },
    },
  })
  async createVerifiedPost(
    @Body()
    createVerifiedPostDto: {
      title: string;
      content: string;
      challengeUuid: string;
      verifiedImageUrls: string[];
      verificationToken: string;
      isPublic?: boolean;
    },
    @UserUuid() userUuid: string,
  ) {
    return this.postsService.createVerifiedPost(
      createVerifiedPostDto,
      userUuid,
    );
  }

  /**
   * 기존 게시글 생성
   */
  @Post()
  @ApiCreatePost()
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @UserUuid() userUuid: string,
  ) {
    return await this.postsService.createPost(createPostDto, userUuid);
  }

  /**
   * 현재 로그인한 사용자의 게시글 조회
   */
  @Get('my')
  @ApiGetMyPosts()
  async getMyPosts(
    @UserUuid() userUuid: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return await this.postsService.getPostsByUserUuid(
      userUuid,
      Number(page),
      Number(limit),
    );
  }

  /**
   * 현재 로그인한 사용자의 게시글 캘린더 조회
   */
  @Get('calendar')
  @ApiGetMyCalendar()
  async getMyCalendar(
    @UserUuid() userUuid: string,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    const data = await this.postsService.getUserCalendar(userUuid, year, month);
    return { data };
  }

  /**
   * 다른 사용자의 게시글 캘린더 조회
   */
  @Get('calendar/:userUuid')
  @ApiGetOtherCalendar()
  async getOtherCalendar(
    @Param('userUuid') userUuid: string,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    const data = await this.postsService.getUserCalendar(userUuid, year, month);
    return { data };
  }

  /**
   * 특정 사용자의 게시글 목록 조회
   */
  @Get('user/:userUuid')
  @ApiGetUserPosts()
  async getUserPosts(
    @Param('userUuid') userUuid: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return await this.postsService.getUserPosts(
      userUuid,
      Number(page),
      Number(limit),
    );
  }

  /**
   * 게시글 상세 조회
   */
  @Get(':postUuid')
  @ApiGetPostDetail()
  async findOnePost(
    @Param('postUuid') postUuid: string,
    @UserUuid() userUuid: string,
  ) {
    return await this.postsService.getPostDetail(postUuid, userUuid);
  }

  /**
   * 게시글 수정
   */
  @Patch(':postUuid')
  @ApiUpdatePost()
  async updatePost(
    @Param('postUuid') postUuid: string,
    @Body() updatePostDto: UpdatePostDto,
    @UserUuid() userUuid: string,
  ) {
    return await this.postsService.updatePost(
      postUuid,
      updatePostDto,
      userUuid,
    );
  }

  /**
   * 게시글 삭제
   */
  @Delete(':postUuid')
  @ApiDeletePost()
  async deletePost(
    @Param('postUuid') postUuid: string,
    @UserUuid() userUuid: string,
  ) {
    return await this.postsService.deletePost(postUuid, userUuid);
  }

  /**
   * 특정 챌린지의 게시글 목록 조회
   */
  @Get('/challenge/:challengeUuid')
  @ApiGetPostsByChallenge()
  async getPostsByChallenge(
    @Param('challengeUuid') challengeUuid: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return await this.postsService.getPostsByChallenge(
      challengeUuid,
      Number(page),
      Number(limit),
    );
  }

  /**
   * 게시글 의심하기
   */
  @Post('post/:postUuid/report')
  @ApiReportSuspicion()
  async reportPost(
    @Param('postUuid') postUuid: string,
    @UserUuid() userUuid: string,
  ) {
    return this.postsService.reportSuspiciousPost(userUuid, postUuid);
  }

  /**
   * 게시글 검증 상태 조회
   */
  @Get(':postUuid/verification')
  @ApiGetPostVerificationStatus()
  async getPostVerificationStatus(@Param('postUuid') postUuid: string) {
    return this.postsService.getPostVerificationStatus(postUuid);
  }
}
