import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signUp.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PostImageService } from 'src/post/image/image.service';
import { ImageModelType } from 'src/entities/Image';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly postImageService: PostImageService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, nickName, password, university } = signUpDto;

    const isUserEmailExist = await this.userRepository.findOne({
      where: { email },
    });
    const isUserNickNamelExist = await this.userRepository.findOne({
      where: { nickName },
    });

    if (isUserEmailExist) {
      throw new NotFoundException('이미 해당 이메일로 가입한 유저가 있습니다.');
    }
    if (isUserNickNamelExist) {
      throw new NotFoundException(
        '이미 해당 닉네임으로 가입한 유저가 있습니다.',
      );
    }

    const hasgedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.save({
      email: email,
      nickName: nickName,
      password: hasgedPassword,
      university: university,
    });

    return user;
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async getUserById(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['posts', 'postComments', 'images'],
    });
  }

  async profileChange(updataUserDto: UpdateUserDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    console.log(user);

    await this.postImageService.createUserImage({
      user,
      path: updataUserDto.images[0],
      order: 0,
      type: ImageModelType.USER_IMAGE,
    });

    return this.getUserById(userId);
  }
}
