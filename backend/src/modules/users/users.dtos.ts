import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AddUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

export class UpdateUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}