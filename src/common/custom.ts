import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { I18nService, I18nValidationPipe } from 'nestjs-i18n';
import {
  EntityNotFoundExceptionFilter,
  HttpExceptionFilter,
  I18nValidationExceptionFilter,
} from './filters';
import { AfterInterceptor } from './interceptors';

export class Custom {
  static init(app: INestApplication) {
    const i18nService: I18nService = app.get(I18nService);
    const logger: Logger = app.get(Logger);
    app.useGlobalPipes(
      new I18nValidationPipe(),
      new ValidationPipe({ transform: true }),
    );
    app.useGlobalFilters(
      new HttpExceptionFilter(logger),
      new EntityNotFoundExceptionFilter(i18nService, logger),
      new I18nValidationExceptionFilter(),
    );
    app.useGlobalInterceptors(new AfterInterceptor(logger));

    const options = new DocumentBuilder()
      .setTitle('4UT Unisex')
      .addServer('http://localhost:3000')
      .addServer('https://be-dev.4unisex.com.vn')
      .addBasicAuth({
        name: 'Authorization',
        in: 'header',
        type: 'apiKey',
      })
      .setDescription('4UT Unisex')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/docs', app, document);
  }
}
