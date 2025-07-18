import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FindOrCreateDirectRoomDto {
  @ApiProperty({
    description: '대상 사용자 UUID',
    example: '01HVCXYZ123456789ABCDEFGHJ',
  })
  @IsNotEmpty({ message: '대상 사용자 UUID는 필수입니다.' })
  @IsString({ message: '대상 사용자 UUID는 문자열이어야 합니다.' })
  targetUserUuid: string;
}
