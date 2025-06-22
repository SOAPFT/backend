import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePostDto {
  @IsString()
  content: string;

  @IsArray()
  @IsOptional()
  imageUrl?: string[];

  @IsUUID()
  challengeUuid: string;
}
