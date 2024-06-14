import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAdminDto {
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(20)
  @ApiProperty({ example: 'abc@gmail.com' })
  email: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(12)
  @ApiProperty({ example: '123@123' })
  password: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @ApiProperty({ example: 'John' })
  firstName: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @ApiProperty({ example: 'Dang' })
  lastName: string;
}
