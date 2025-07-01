import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class MarkAsReadDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  notificationIds?: number[];
}
