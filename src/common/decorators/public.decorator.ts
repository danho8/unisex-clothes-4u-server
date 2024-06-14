import { SetMetadata } from '@nestjs/common';

export const IsPublic = (isPublic: boolean) =>
  SetMetadata('isPublic', isPublic);
