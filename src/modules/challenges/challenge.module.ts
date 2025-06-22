import { Module } from '@nestjs/common';
import { ChallengeController } from './challenge.controller';
import { Challenge } from '@/entities/challenge.entity';
import { User } from '@/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { forwardRef } from '@nestjs/common';
import { ChallengeService } from './challenge.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Challenge, User]),
    forwardRef(() => UsersModule),
  ],
  controllers: [ChallengeController],
  providers: [ChallengeService],
  exports: [ChallengeService],
})
export class ChallengeModule {}
