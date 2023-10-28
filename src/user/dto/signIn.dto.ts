import { PickType } from '@nestjs/swagger';

import { User } from 'src/entities/User';

export class SignInDto extends PickType(User, ['email', 'password']) {}
