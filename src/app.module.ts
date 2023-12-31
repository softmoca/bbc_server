import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { Post } from './entities/Post';
import { Comment } from './entities/Comment';
import { PostModule } from './post/post.module';
import { CommentModule } from './post/comment/comment.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PUBLIC_FOLDER_PATH } from './common/const/path.const';
import { Image } from './entities/Image';
import { ChatsModule } from './chats/chats.module';
import { Chats } from './entities/chats.entity';
import { Messages } from './entities/messages.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Board } from './entities/Board.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'env',
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: PUBLIC_FOLDER_PATH,
      serveRoot: '/public',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'fotdrds.cfeyrpadoh9b.ap-northeast-2.rds.amazonaws.com',
      port: 3306,
      username: 'admin',
      password: '00000000',
      database: 'fotdDB',
      entities: [User, Post, Comment, Image, Chats, Messages, Board],
      synchronize: true,
      //logging: true,
      charset: 'utf8mb4',
    }),
    UserModule,
    AuthModule,
    PostModule,
    CommentModule,
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
