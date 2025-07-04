import {
  IsDate,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '댓글이 달릴 게시글 UUID',
    example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
  })
  postUuid: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '댓글 내용',
    example: '댓글 내용입니다.',
  })
  content: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    description: '부모 댓글 ID (대댓글인 경우)',
    example: null,
    nullable: true,
  })
  parentCommentId?: number;

  @IsDate()
  createdAt: Date = new Date();

  @IsDate()
  updatedAt: Date = new Date();
}
