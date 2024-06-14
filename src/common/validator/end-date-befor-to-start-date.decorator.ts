import {
  ValidateIf,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'endDateNotBeforeStartDate', async: false })
export class EndDateNotBeforeStartDateConstraint
  implements ValidatorConstraintInterface
{
  @ValidateIf((object) => object.startDate && object.endDate)
  validate(endDate: string, args: ValidationArguments) {
    const startDate = new Date(args.object['startDate']);
    const endDateDate = new Date(endDate);
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    const formattedDate = `${year}-${month}-${day}`;
    return (
      startDate.toDateString() >= formattedDate && endDateDate >= startDate
    );
  }

  defaultMessage() {
    return 'endDate must not be before startDate';
  }
}
