import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';

import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';

import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { User } from 'src/entities/User';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';

@Controller('user')
@UseInterceptors(SuccessInterceptor)
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('signUp')
  async SignUp(@Body() signUpDto: SignUpDto) {
    return this.userService.signUp(signUpDto);
  }

  @Post('/localSignIn')
  async localSignIn(@Body() signInDto: SignInDto) {
    return this.authService.localSignIn(signInDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async guardTest(@CurrentUser() user: User) {
    const id = user.id;

    const userData = await this.userService.getUserById(id);

    return userData;
  }
}
