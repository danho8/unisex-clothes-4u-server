import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';

export class UpdateCategoryDto {
  @Expose()
  @IsString()
  @MinLength(2)
  @ApiProperty({ example: 'Áo Ba Lỗ', required: false })
  name: string;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Mô Tả', nullable: true, required: false })
  description: string;

  @Expose()
  @ApiProperty({ example: true, type: Boolean, required: false })
  isMain: boolean;

  @Expose()
  @ApiProperty({ example: true, type: Boolean, required: false })
  isActive: boolean;

  @Expose()
  @ApiProperty({ format: 'binary', type: 'string', required: false })
  avatar?: Express.Multer.File;

  @Expose()
  @IsOptional()
  @ValidateIf((o) => !o.isMain)
  @Type(() => Number)
  @ApiProperty({ example: 1, required: false })
  parentId?: number | null;
}
