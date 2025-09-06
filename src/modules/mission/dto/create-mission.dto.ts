import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsInt,
  IsBoolean,
  Min,
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
  isLongTerm?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  rewardTopN?: number;
}
