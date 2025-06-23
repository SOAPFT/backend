import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChatRoomType } from '@/types/chat.enum';

export class CreateChatRoomDto {
  @ApiProperty({
    description: '채팅방 타입',
    enum: ChatRoomType,
    example: ChatRoomType.DIRECT,
  })
  @IsEnum(ChatRoomType)
  type: ChatRoomType;

  @ApiProperty({
    description: '참여자 UUID 배열 (1대1: 1개, 그룹: 여러개)',
    type: [String],
    example: ['01HZQK5J8X2M3N4P5Q6R7S8T9V'],
    minItems: 1,
    maxItems: 50,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsString({ each: true })
  participantUuids: string[];

  @ApiPropertyOptional({
    description: '채팅방 이름 (그룹 채팅방인 경우)',
    example: '30일 헬스 챌린지 채팅방',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({
    description: '챌린지 UUID (챌린지 그룹 채팅인 경우)',
    example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
  })
  @IsOptional()
  @IsString()
  challengeUuid?: string;
}
