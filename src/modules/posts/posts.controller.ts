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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ApiCreatePost,
  ApiDeletePost,
  ApiGetUserPosts,
  ApiGetPostDetail,
  ApiUpdatePost,
  ApiGetGroupPosts,
  ApiGetMyPosts,
} from './decorators/posts.swagger';
import { FindGroupPostsDto } from './dto/find-group-posts.dto';
import { UserUuid } from '@/decorators/user-uuid.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('post')
@ApiBearerAuth('JWT-auth')
@Controller('post')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * 사용자 게시글 생성
   * @param createPostDto 게시글 생성 정보
   * @param userUuid 사용자 UUID
   * @returns 생성된 게시글 정보
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
   * 현재 로그인한 사용자의 게시글 조회 (페이지네이션)
   * @param userUuid 사용자 UUID
   * @param page 페이지 번호
   * @param limit 페이지당 아이템 수
   * @returns 게시글 목록
   */
  @Get('my')
  @ApiGetMyPosts()
  async getMyPosts(
    @UserUuid() userUuid: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const pageNumber = parseInt(page as any, 10);
    const limitNumber = parseInt(limit as any, 10);

    return await this.postsService.getPostsByUserUuid(
      userUuid,
      pageNumber,
      limitNumber,
    );
  }

  /**
   * 특정 사용자의 게시글 목록 조회 (페이지네이션)
   * @param userUuid 조회할 사용자 UUID
   * @param page 페이지 번호
   * @param limit 페이지당 개수
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
   * @param postUuid 게시글 ULID
   * @param userUuid 사용자 UUID
   * @returns 게시글 상세 정보
   */
  @Get(':postUuid')
  @ApiGetPostDetail()
  async findOnePost(@Param('postUuid') postUuid: string) {
    return await this.postsService.getPostDetail(postUuid);
  }

  /**
   * 게시글 수정
   * @param postUuid 게시글 ULID
   * @param updatePostDto 게시글 수정 정보
   * @param userUuid 사용자 UUID
   * @returns 수정된 게시글 정보
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
   * @param postUuid 게시글 ULID
   * @param userUuid 사용자 UUID
   * @returns 삭제된 게시글 정보
   */
  @Delete(':postUuid')
  @ApiDeletePost()
  removePost(
    @Param('postUuid') postUuid: string,
    @UserUuid() userUuid: string,
  ) {
    return null;
  }

  /**
   * 그룹 게시글 조회
   * @param groupId 그룹 ID
   * @param findGroupPostsDto 조회 옵션
   * @param userUuid 사용자 UUID
   * @returns 그룹원들의 게시글 목록
   */
  @Get('group/:groupId')
  @ApiGetGroupPosts()
  findGroupPosts(
    @Param('groupId') groupId: string,
    @Query() findGroupPostsDto: FindGroupPostsDto,
    @UserUuid() userUuid: string,
  ) {
    return null;
  }
}
