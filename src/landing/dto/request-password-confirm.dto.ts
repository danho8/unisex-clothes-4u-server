import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserPasswordConfirmDto {
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'abc@gmail.com' })
  email: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '123@123' })
  otp: string;
}
