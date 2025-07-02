import { IsOptional, IsString, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    example: '오늘의 인증글 제목',
    description: '게시글 제목',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: '01JZ13GQ31DJAY0GVF5F69HEH2',
    description: '연동된 챌린지 UUID',
  })
  @IsString()
  challengeUuid: string;

  @ApiProperty({
    example: '오늘은 이렇게 운동했습니다!',
    description: '게시글 내용',
  })
  @IsString()
  content: string;

  @ApiProperty({
    example: ['https://example.com/image1.jpg'],
    description: '첨부 이미지 URL 배열',
  })
  @IsArray()
  imageUrl: string[];

  @ApiProperty({
    example: true,
    description: '공개 여부 (true: 공개, false: 비공개)',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean = true;
}
