import { IsOptional, IsString, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty({
    description: '게시글 제목',
    example: '수정된 제목',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: '게시글 내용',
    example: '수정된 내용입니다.',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: '이미지 URL 배열',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({
    description: '삭제 여부',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}
