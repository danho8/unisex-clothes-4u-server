import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserResetPasswordDto {
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'abc@gmail.com' })
  email: string;
}
