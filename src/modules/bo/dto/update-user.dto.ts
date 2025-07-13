import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatusType } from '../../../types/user-status.enum';

export class UpdateUserDto {
  @ApiProperty({
    description: '사용자 닉네임',
    example: '수정된닉네임',
    required: false,
  })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiProperty({
    description: '사용자 소개',
    example: '수정된 소개입니다.',
    required: false,
  })
  @IsOptional()
  @IsString()
  introduce?: string;

  @ApiProperty({
    description: '사용자 상태',
    enum: UserStatusType,
    example: UserStatusType.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserStatusType)
  status?: UserStatusType;

  @ApiProperty({
    description: '탈퇴 여부',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}
