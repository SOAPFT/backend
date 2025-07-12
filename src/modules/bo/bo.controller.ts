import {
  Controller,
  Get,
  Query,
  Param,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { BoService } from './bo.service';

@ApiTags('BO (Back Office)')
@Controller('bo')
export class BoController {
  constructor(private readonly boService: BoService) {}

  // === 대시보드 통계 ===
  @Get('dashboard/stats')
  @ApiOperation({
    summary: '대시보드 통계 조회',
    description: '전체 데이터 통계와 오늘 생성된 데이터 통계를 조회합니다.',
  })
  async getDashboardStats() {
    return this.boService.getDashboardStats();
  }

  // === 사용자 관리 ===
  @Get('users')
  @ApiOperation({
    summary: '사용자 목록 조회',
    description: '페이지네이션과 검색 기능이 포함된 사용자 목록을 조회합니다.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호 (기본값: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '페이지 크기 (기본값: 20)',
  })
  @ApiQuery({ name: 'search', required: false, description: '닉네임 검색어' })
  async getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.boService.getUsers(page, limit, search);
  }

  @Get('users/:userUuid')
  @ApiOperation({
    summary: '사용자 상세 조회',
    description: '특정 사용자의 상세 정보와 통계를 조회합니다.',
  })
  @ApiParam({ name: 'userUuid', description: '사용자 UUID' })
  async getUserDetail(@Param('userUuid') userUuid: string) {
    return this.boService.getUserDetail(userUuid);
  }

  // === 게시글 관리 ===
  @Get('posts')
  @ApiOperation({
    summary: '게시글 목록 조회',
    description: '페이지네이션과 검색 기능이 포함된 게시글 목록을 조회합니다.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호 (기본값: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '페이지 크기 (기본값: 20)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: '제목/내용 검색어',
  })
  async getPosts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.boService.getPosts(page, limit, search);
  }

  @Get('posts/:postUuid')
  @ApiOperation({
    summary: '게시글 상세 조회',
    description: '특정 게시글의 상세 정보, 댓글, 좋아요 수를 조회합니다.',
  })
  @ApiParam({ name: 'postUuid', description: '게시글 UUID' })
  async getPostDetail(@Param('postUuid') postUuid: string) {
    return this.boService.getPostDetail(postUuid);
  }

  // === 댓글 관리 ===
  @Get('comments')
  @ApiOperation({
    summary: '댓글 목록 조회',
    description: '페이지네이션과 검색 기능이 포함된 댓글 목록을 조회합니다.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호 (기본값: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '페이지 크기 (기본값: 20)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: '댓글 내용 검색어',
  })
  async getComments(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.boService.getComments(page, limit, search);
  }

  // === 챌린지 관리 ===
  @Get('challenges')
  @ApiOperation({
    summary: '챌린지 목록 조회',
    description: '페이지네이션과 검색 기능이 포함된 챌린지 목록을 조회합니다.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호 (기본값: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '페이지 크기 (기본값: 20)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: '제목/소개 검색어',
  })
  async getChallenges(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.boService.getChallenges(page, limit, search);
  }

  @Get('challenges/:challengeUuid')
  @ApiOperation({
    summary: '챌린지 상세 조회',
    description: '특정 챌린지의 상세 정보와 관련 게시글을 조회합니다.',
  })
  @ApiParam({ name: 'challengeUuid', description: '챌린지 UUID' })
  async getChallengeDetail(@Param('challengeUuid') challengeUuid: string) {
    return this.boService.getChallengeDetail(challengeUuid);
  }

  // === 알림 관리 ===
  @Get('notifications')
  @ApiOperation({
    summary: '알림 목록 조회',
    description: '페이지네이션이 포함된 알림 목록을 조회합니다.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호 (기본값: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '페이지 크기 (기본값: 20)',
  })
  async getNotifications(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.boService.getNotifications(page, limit);
  }

  // === 친구 관계 관리 ===
  @Get('friendships')
  @ApiOperation({
    summary: '친구 관계 목록 조회',
    description: '페이지네이션이 포함된 친구 관계 목록을 조회합니다.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호 (기본값: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '페이지 크기 (기본값: 20)',
  })
  async getFriendships(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.boService.getFriendships(page, limit);
  }
}
