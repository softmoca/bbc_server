import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from 'src/entities/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { PostImageService } from 'src/post/image/image.service';
import { Image } from 'src/entities/Image';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Image]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, PostImageService],
  exports: [UserService],
})
export class UserModule {}
