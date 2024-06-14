import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nContext, I18nService, I18nTranslation } from 'nestjs-i18n';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

@Catch(EntityNotFoundError, NotFoundException)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly i18nService: I18nService,
    private readonly logger: Logger,
  ) {}

  public catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const i18n = I18nContext.current<I18nTranslation>(host);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    this.logger.error(exception.message);

    return response.status(HttpStatus.NOT_FOUND).json({
      statusCode: HttpStatus.NOT_FOUND,
      errors: this.i18nService.t('error.notFound', { lang: i18n.lang }),
      message: this.i18nService.t('error.notFound', { lang: i18n.lang }),
      timestamp: new Date().toString(),
      path: request.url,
    });
  }
}
