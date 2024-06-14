import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateCategoryDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @ApiProperty({ example: 'Áo Ba Lỗ', required: true })
  name: string;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Mô Tả', nullable: true, required: false })
  description: string;

  @Expose()
  @ApiProperty({ example: true, type: Boolean })
  isMain: boolean;

  @Expose()
  @ApiProperty({ example: true, type: Boolean })
  isActive: boolean;

  @Expose()
  @ApiProperty({ format: 'binary', type: 'string', required: true })
  avatar: Express.Multer.File;

  @Expose()
  @IsOptional()
  @ValidateIf((o) => !o.isMain)
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ example: 1, required: false })
  parentId?: number;
}
