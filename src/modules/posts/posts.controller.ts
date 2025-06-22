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
  ApiGetAllPosts,
  ApiGetPostById,
  ApiUpdatePost,
  ApiGetPostsByNickname,
  ApiGetGroupPosts,
} from './decorators/posts.swagger';
import { FindAllPostsDto } from './dto/find-all-posts.dto';
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
  createPost(
    @Body() createPostDto: CreatePostDto,
    @UserUuid() userUuid: string,
  ) {
    return null;
  }

  /**
   * 현재 로그인 사용자의 게시글 조회
   * @param findAllPostsDto 게시글 목록 조회 조건들
   * @param userUuid 사용자 UUID
   * @returns 사용자 게시글 목록
   */
  @Get()
  @ApiGetAllPosts()
  findAllPosts(
    @Query() findAllPostsDto: FindAllPostsDto,
    @UserUuid() userUuid: string,
  ) {
    return null;
  }

  /**
   * 다른 사용자의 게시글 조회
   * @param nickname 사용자 닉네임
   * @param findAllPostsDto 게시글 목록 조회 조건들
   * @returns 사용자 게시글 목록
   */
  @Get('user/:nickname')
  @ApiGetPostsByNickname()
  findAllPostsByNickname(@Param('nickname') nickname: string) {
    return null;
  }

  /**
   * 게시글 상세 조회
   * @param postUuid 게시글 ULID
   * @param userUuid 사용자 UUID
   * @returns 게시글 상세 정보
   */
  @Get(':postUuid')
  @ApiGetPostById()
  findOnePost(
    @Param('postUuid') postUuid: string,
    @UserUuid() userUuid: string,
  ) {
    return null;
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
  updatePost(
    @Param('postUuid') postUuid: string,
    @Body() updatePostDto: UpdatePostDto,
    @UserUuid() userUuid: string,
  ) {
    return null;
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
