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

export class UpdateProductOptionDto {
  @Expose()
  @ApiProperty({ example: 1, required: true })
  id: number;

  @Expose()
  @ApiProperty({ example: 1, required: true })
  productId: number;

  @Expose()
  @ApiProperty({ example: 'Đỏ Cam', required: false })
  nameColor: string;

  @Expose()
  @ApiProperty({ example: 'S', required: false })
  @IsEnum(SizeEnum)
  size: SizeEnum;

  @Expose()
  @ApiProperty({ example: 1, required: false })
  quantity: number;

  @Expose()
  @ApiProperty({ example: 1, required: false })
  cost: number;

  @Expose()
  @ApiProperty({ example: 1, required: false })
  price: number;

  @Expose()
  @ApiProperty({ example: true, required: false })
  isActive?: boolean;

  @Expose()
  @ApiProperty({ example: '1111,2222', required: false })
  publicIds?: string;

  @Expose()
  @ApiProperty({ format: 'binary', type: 'string', required: false })
  images: Express.Multer.File[];
}
