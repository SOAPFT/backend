import { Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendship } from '@/entities/friendship.entity';
import { User } from '@/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship, User])],
  controllers: [FriendshipController],
  providers: [FriendshipService],
  exports: [FriendshipService],
})
export class FriendshipModule {}
