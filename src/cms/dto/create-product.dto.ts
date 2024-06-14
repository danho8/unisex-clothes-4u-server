import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateProductDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @ApiProperty({ example: 'Áo Ba Lỗ', required: true })
  name: string;

  @Expose()
  @IsNotEmpty()
  @ApiProperty({ example: 1, required: true })
  categoryId: number;

  @Expose()
  @IsString()
  @MinLength(4)
  @ApiProperty({ example: 'Mô Tả', nullable: true })
  description: string;
}
