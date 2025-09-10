import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinstonModule } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from '../config/orm.config';
import { winstonConfig } from '../config/logging.config';
import { UploadsModule } from './modules/uploads/uploads.module';
import { S3Module } from './modules/s3/s3.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { HttpLoggerMiddleware } from './middlewares/http-logger.middleware';
import { CommentsModule } from './modules/comments/comments.module';
import { LikesModule } from './modules/likes/likes.module';
import { UsersModule } from './modules/users/users.module';
import { ChallengeModule } from './modules/challenges/challenge.module';
import { ChatModule } from './modules/chat/chat.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FriendshipModule } from './modules/friendship/friendship.module';
import { BoModule } from './modules/bo/bo.module';
import { AiModule } from './modules/ai/ai.module';
import { MissionModule } from './modules/mission/mission.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ChatbotModule } from './modules/chatbot/chatbot.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: `env/.${process.env.NODE_ENV || 'development'}.env`,
      isGlobal: true,
    }),
    WinstonModule.forRoot(winstonConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        typeOrmConfig(configService),
    }),
    UploadsModule,
    S3Module,
    AuthModule,
    PostsModule,
    CommentsModule,
    LikesModule,
    UsersModule,
    ChallengeModule,
    ChatModule,
    NotificationsModule,
    FriendshipModule,
    BoModule,
    AiModule,
    MissionModule,
    PaymentModule,
    ChatbotModule,
    SchedulerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
