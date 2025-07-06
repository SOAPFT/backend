import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFriendRequestDto {
  @ApiProperty({
    example: '01HZQK5J8X2M3N4P5Q6R7S8T9V',
    description: '친구 요청을 받을 사용자 UUID',
  })
  @IsString()
  addresseeUuid: string;
}
