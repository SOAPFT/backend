import { ApiProperty } from '@nestjs/swagger';

export class DeleteResponseDto {
  @ApiProperty({
    description: '삭제 성공 여부',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: '삭제 응답 메시지',
    example: '성공적으로 삭제되었습니다.',
  })
  message: string;

  @ApiProperty({
    description: '삭제된 아이템 UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  deletedId: string;
}
