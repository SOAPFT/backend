import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsInt,
  IsBoolean,
} from 'class-validator';

export type MissionType = 'distance' | 'steps' | 'calories';

export class CreateMissionDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(['distance', 'steps', 'calories'])
  type: MissionType;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsOptional()
  @IsInt()
  durationSeconds?: number;

  @IsOptional()
  @IsInt()
  reward?: number;

  @IsOptional()
  @IsBoolean()
  isLongTerm?: boolean; // ✅ 추가
}
