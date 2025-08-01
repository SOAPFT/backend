import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateMissionDto } from '../dto/create-mission.dto';
import { UpdateMissionDto } from '../dto/update-mission.dto';

export function ApiCreateMission() {
  return applyDecorators(
    ApiOperation({
      summary: '미션 생성',
      description: '관리자가 새로운 미션을 생성합니다.',
    }),
    ApiBody({
      type: CreateMissionDto,
      examples: {
        default: {
          summary: '예시',
          value: {
            title: '7월 런닝 미션',
            description: '일주일 간 20km 달리기',
            type: 'distance',
            startTime: '2025-07-01T00:00:00Z',
            endTime: '2025-07-07T23:59:59Z',
            durationSeconds: 3600,
            reward: 1000,
          },
        },
      },
    }),
    ApiResponse({ status: 201, description: '미션 생성 성공' }),
    ApiResponse({ status: 400, description: '잘못된 요청' }),
  );
}

export function ApiUpdateMission() {
  return applyDecorators(
    ApiOperation({
      summary: '미션 수정',
      description: '기존 미션 정보를 수정합니다.',
    }),
    ApiParam({ name: 'id', description: '미션 ID', example: 1 }),
    ApiBody({
      type: UpdateMissionDto,
      examples: {
        default: {
          summary: '예시',
          value: {
            title: '수정된 런닝 미션',
            reward: 1500,
          },
        },
      },
    }),
    ApiResponse({ status: 200, description: '수정 성공' }),
    ApiResponse({ status: 404, description: '미션을 찾을 수 없음' }),
  );
}

export function ApiDeleteMission() {
  return applyDecorators(
    ApiOperation({
      summary: '미션 삭제',
      description: '특정 미션을 삭제합니다.',
    }),
    ApiParam({ name: 'id', description: '미션 ID', example: 1 }),
    ApiResponse({ status: 200, description: '삭제 성공' }),
    ApiResponse({ status: 404, description: '미션을 찾을 수 없음' }),
  );
}

export function ApiGetMissionDetail() {
  return applyDecorators(
    ApiOperation({
      summary: '미션 상세 조회',
      description: '미션 상세 정보와 사용자 랭킹 정보를 함께 반환합니다.',
    }),
    ApiParam({ name: 'id', description: '미션 ID', example: 1 }),
    ApiResponse({ status: 200, description: '조회 성공' }),
    ApiResponse({ status: 404, description: '미션을 찾을 수 없음' }),
  );
}

export function ApiGetAllMissions() {
  return applyDecorators(
    ApiOperation({
      summary: '전체 미션 목록 조회',
      description: '등록된 전체 미션 목록을 조회합니다.',
    }),
    ApiResponse({ status: 200, description: '조회 성공' }),
  );
}

export function ApiParticipateMission() {
  return applyDecorators(
    ApiOperation({
      summary: '미션 참여',
      description: '사용자가 특정 미션에 참여합니다.',
    }),
    ApiParam({ name: 'missionId', description: '미션 ID', example: 1 }),
    ApiResponse({ status: 201, description: '참여 성공' }),
    ApiResponse({ status: 404, description: '미션 또는 사용자 정보 없음' }),
  );
}

export function ApiSubmitMissionResult() {
  return applyDecorators(
    ApiOperation({
      summary: '미션 결과 제출',
      description: '사용자가 완료한 미션 데이터를 제출합니다.',
    }),
    ApiParam({ name: 'missionId', description: '미션 ID', example: 1 }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          resultData: {
            type: 'object',
            example: {
              distance: 5300,
              calories: 230,
              duration: 1800,
            },
          },
        },
      },
    }),
    ApiResponse({ status: 200, description: '제출 성공' }),
    ApiResponse({ status: 404, description: '참여 정보 없음' }),
  );
}

export function ApiGetMyMissions() {
  return applyDecorators(
    ApiOperation({
      summary: '내 미션 목록 조회',
      description: '내가 참여한 미션들을 조회합니다.',
    }),
    ApiResponse({ status: 200, description: '조회 성공' }),
  );
}

export function ApiCancelMissionParticipation() {
  return applyDecorators(
    ApiOperation({
      summary: '미션 참여 취소',
      description: '사용자가 참여했던 미션을 취소합니다.',
    }),
    ApiParam({ name: 'id', description: '미션 ID', example: 1 }),
    ApiResponse({ status: 200, description: '참여 취소 성공' }),
    ApiResponse({ status: 404, description: '참여 기록 없음' }),
  );
}
