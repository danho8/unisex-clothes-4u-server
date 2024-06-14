import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class UpdateProductDto {
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1, required: true })
  id: number;

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

  @Expose()
  @ApiProperty({ example: true, required: false })
  isActive: boolean;

  @Expose()
  @ApiProperty({ example: true, required: false })
  isFave: boolean;

  @Expose()
  @ApiProperty({ example: true, required: false })
  isBestSelling: boolean;
}
