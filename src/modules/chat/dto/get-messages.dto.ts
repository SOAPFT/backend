import { IsOptional, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetMessagesDto {
  @ApiPropertyOptional({
    description: '페이지 번호 (기본값: 1)',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: '페이지당 메시지 수 (기본값: 50, 최대: 100)',
    example: 50,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  @Max(100)
  limit?: number = 50;

  @ApiPropertyOptional({
    description: '마지막 메시지 ID (이전 메시지 로드용)',
    example: 12345,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  lastMessageId?: number;
}
