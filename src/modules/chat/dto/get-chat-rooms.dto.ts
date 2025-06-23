import { IsEnum, IsOptional, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ChatRoomType } from '@/types/chat.enum';
import { Transform } from 'class-transformer';

export class GetChatRoomsDto {
  @ApiPropertyOptional({
    description: '채팅방 타입 필터',
    enum: ChatRoomType,
    example: ChatRoomType.DIRECT,
  })
  @IsOptional()
  @IsEnum(ChatRoomType)
  type?: ChatRoomType;

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
    description: '페이지당 항목 수 (기본값: 20, 최대: 50)',
    example: 20,
    minimum: 1,
    maximum: 50,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  @Max(50)
  limit?: number = 20;
}
