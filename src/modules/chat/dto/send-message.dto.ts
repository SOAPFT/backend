import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MessageType } from '@/types/chat.enum';

export class SendMessageDto {
  @ApiProperty({
    description: '메시지 타입',
    enum: MessageType,
    example: MessageType.TEXT,
  })
  @IsEnum(MessageType)
  type: MessageType;

  @ApiProperty({
    description: '메시지 내용',
    example: '안녕하세요! 오늘 운동 어떠셨나요?',
    maxLength: 1000,
  })
  @IsString()
  @MaxLength(1000)
  content: string;

  @ApiPropertyOptional({
    description: '첨부 이미지 URL (이미지 메시지인 경우)',
    example: 'https://soapft-bucket.s3.amazonaws.com/images/chat-image.jpg',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
