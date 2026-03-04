import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RemoveUserDto {
  @IsString()
  @IsNotEmpty()
  id!: string
}

export class AddUserDto{
  @IsEmail()
  email!: string
}