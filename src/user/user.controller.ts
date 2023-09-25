import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './dto/signUp.dot';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('signUp')
  async SignUp(@Body() signUpDto: SignUpDto) {
    return this.userService.signUp(signUpDto);
  }
}
