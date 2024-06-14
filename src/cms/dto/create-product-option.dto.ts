import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';

enum SizeEnum {
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
}

export class CreateProductOptionDto {
  @Expose()
  @ApiProperty({ example: 1 })
  productId: number;

  @Expose()
  @ApiProperty({ example: 'Đỏ Cam' })
  nameColor: string;

  @Expose()
  @ApiProperty({ example: 'S' })
  @IsEnum(SizeEnum)
  size: SizeEnum;

  @Expose()
  @ApiProperty({ example: 1 })
  quantity: number;

  @Expose()
  @ApiProperty({ example: 1 })
  cost: number;

  @Expose()
  @ApiProperty({ example: 1 })
  price: number;

  @Expose()
  @ApiProperty({ format: 'binary', type: 'string' })
  images: Express.Multer.File[];
}
