import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
  @MinLength(4)
  @MaxLength(30)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(4)
  @MaxLength(20)
  @IsNotEmpty()
  password: string;
}
