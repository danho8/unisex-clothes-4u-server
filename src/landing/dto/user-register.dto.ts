import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UserRegisterDto {
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'abc@gmail.com' })
  email: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @ApiProperty({ example: '123@123' })
  password: string;
}
