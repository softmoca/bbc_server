import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User';
import { SignInDto } from 'src/user/dto/signIn.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async localSignIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('해당 이메일로 가입한 유저가 없습니다.');
    }

    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValidated) {
      throw new NotFoundException('이메일과 비밀번호를 확인해주세요');
    }
    const payload = { email: email };

    const accessJwtToken = await this.jwtService.sign(payload);
    console.log(payload);
    return { accessJwtToken: accessJwtToken };
  }

  extractTokenFromHeader(header: string, isBearer: boolean) {
    const splitToken = header.split(' ');

    const prefix = isBearer ? 'Bearer' : 'Basic';

    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException('잘못된 토큰입니다.');
    }

    const token = splitToken[1];

    return token;
  }
}
