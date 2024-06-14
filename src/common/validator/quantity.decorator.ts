import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'validateQuantity', async: false })
export class ValidateQuantity implements ValidatorConstraintInterface {
  validate(quantity: number, args: any) {
    const { typeGift } = args.object;
    if (typeGift === 'ONE') {
      return quantity === 1;
    }
    if (typeGift === 'ALL') {
      return quantity > 1;
    }
    if (typeGift === 'UNLIMITED') {
      return quantity === 0;
    }
    return false;
  }

  defaultMessage() {
    return 'Quantity must be 1 for typeGift ONE, and greater than 1 for typeGift ALL, and must be 0 for typeGift UNLIMITED';
  }
}
