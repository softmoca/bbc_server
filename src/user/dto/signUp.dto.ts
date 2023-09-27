import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  @MinLength(4)
  @MaxLength(30)
  @IsEmail()
  email: string;

  @MinLength(4)
  @MaxLength(20)
  @IsNotEmpty()
  nickName: string;

  @MinLength(4)
  @MaxLength(20)
  @IsNotEmpty()
  password: string;

  @MinLength(4)
  @MaxLength(20)
  @IsNotEmpty()
  university: string;
}
