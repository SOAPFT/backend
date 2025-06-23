import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';
import { GenderType } from '@/types/challenge.enum';

export class OnBoardingDto {
  @IsString()
  @ApiProperty({
    description: '유저 닉네임',
    example: '상냥한너구리',
  })
  nickname: string;

  @IsString()
  @ApiProperty({
    description: '성별',
    example: 'MALE | FEMALE',
  })
  gender: GenderType;

  @IsInt()
  @ApiProperty({
    description: '나이',
    example: '27',
  })
  age: number;
}
