import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './dto/signUp.dot';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';

@Controller('user')
@UseInterceptors(SuccessInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  @Post('signUp')
  async SignUp(@Body() signUpDto: SignUpDto) {
    return this.userService.signUp(signUpDto);
  }
}
