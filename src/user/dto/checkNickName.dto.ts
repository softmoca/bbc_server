import { PickType } from '@nestjs/swagger';
import { User } from 'src/entities/User';

export class CheckNickNameDto extends PickType(User, ['nickName']) {}
