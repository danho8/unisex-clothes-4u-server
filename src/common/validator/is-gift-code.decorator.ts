import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreateGiftCodeDto } from './../../cms/dto/create-gift-code.dto';

@ValidatorConstraint({ name: 'IsGiftCodeType', async: false })
export class IsGiftCodeType implements ValidatorConstraintInterface {
  validate(userId: number, args: any) {
    const { typeGift } = args.object;
    if (typeGift === 'ONE' && !userId) {
      return false;
    }
    if (typeGift === 'ALL' && userId) {
      return false;
    }
    if (typeGift === 'UNLIMITED' && userId) {
      return false;
    }
    return true;
  }
  defaultMessage(args: ValidationArguments) {
    const { typeGift, userId } = args.object as CreateGiftCodeDto;
    if (typeGift === 'ONE' && !userId) {
      return 'User is required for typeGift ONE';
    }
    if (typeGift === 'ALL' && userId) {
      return 'User should not be provided for typeGift ALL';
    }
    if (typeGift === 'UNLIMITED' && userId) {
      return 'User should not be provided for typeGift UNLIMITED';
    }
    return 'Invalid gift code type and user combination';
  }
}
