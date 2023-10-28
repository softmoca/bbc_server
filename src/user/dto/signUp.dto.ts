import { PickType } from '@nestjs/swagger';

import { User } from 'src/entities/User';

export class SignUpDto extends PickType(User, [
  'email',
  'nickName',
  'password',
  'university',
]) {}
