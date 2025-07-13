import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiProperty({
    description: '댓글 내용',
    example: '수정된 댓글 내용',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: '삭제 여부',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}
