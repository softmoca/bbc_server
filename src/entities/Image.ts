import {
  POST_PUBLIC_IMAGE_PATH,
  USER_PUBLIC_IMAGE_PATH,
} from './../common/const/path.const';
import { BaseModel } from './base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { join } from 'path';
import { Post } from './Post';
import { User } from './User';

export enum ImageModelType {
  POST_IMAGE,
  USER_IMAGE,
}

@Entity()
export class Image extends BaseModel {
  @Column({
    default: 0,
  })
  @IsInt()
  @IsOptional()
  order: number;

  @Column({
    enum: ImageModelType,
  })
  @IsEnum(ImageModelType)
  @IsString()
  type: ImageModelType;

  @Column()
  @Transform(({ value, obj }) => {
    // 만약에 포스트 이미지 타입이라면
    // 이렇게 매핑하기
    if (obj.type === ImageModelType.POST_IMAGE) {
      return `/${join(POST_PUBLIC_IMAGE_PATH, value)}`;
    }
    if (obj.type === ImageModelType.USER_IMAGE) {
      return `${(join(USER_PUBLIC_IMAGE_PATH), value)}`;
    } else {
      return value;
    }
  })
  @IsString()
  path: string;

  @ManyToOne((type) => Post, (post) => post.images, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  post?: Post;

  @ManyToOne((type) => User, (user) => user.images, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user?: User;
}
