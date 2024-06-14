import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { DiscountType, GiftCodeType } from './../../common/constants';
import { EndDateNotBeforeStartDateConstraint } from './../../common/validator/end-date-befor-to-start-date.decorator';
import { IsGiftCodeType } from './../../common/validator/is-gift-code.decorator';
import { ValidateQuantity } from './../../common/validator/quantity.decorator';

export class CreateGiftCodeDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Mô tả discount', required: true })
  name: string;

  @Expose()
  @IsEnum(DiscountType)
  @ApiProperty({ enum: DiscountType, required: true })
  typeDiscount: string;

  @Expose()
  @ApiProperty({ example: 30, required: true })
  discount: number;

  @Expose()
  @ApiProperty({ example: 30000, required: true })
  condition: number;

  @Expose()
  @IsEnum(GiftCodeType)
  @ApiProperty({ enum: GiftCodeType, required: true })
  typeGift: string;

  @Expose()
  @ApiProperty({ example: 30, required: false })
  @Validate(ValidateQuantity)
  quantity: number;

  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: '2024-12-11', required: false })
  startDate: string;

  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: '2024-12-11', required: false })
  @Validate(EndDateNotBeforeStartDateConstraint)
  endDate: string;

  @Expose()
  @ApiProperty({ example: true, required: false })
  isActive: boolean;

  @Expose()
  @IsOptional()
  @ApiProperty({ example: 1, required: false })
  @Validate(IsGiftCodeType)
  userId?: number | null;
}
