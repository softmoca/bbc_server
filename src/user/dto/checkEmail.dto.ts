import { PickType } from '@nestjs/swagger';
import { User } from 'src/entities/User';

export class CheckEmailDto extends PickType(User, ['email']) {}
