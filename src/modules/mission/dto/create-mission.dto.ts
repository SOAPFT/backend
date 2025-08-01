import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsInt,
} from 'class-validator';

export type MissionType = 'distance' | 'steps' | 'heart';

export class CreateMissionDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(['distance', 'steps', 'heart'])
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
}
