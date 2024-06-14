import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ValidationError,
} from '@nestjs/common';
import * as lodash from 'lodash';
import {
  I18nContext,
  I18nService,
  I18nValidationError,
  I18nValidationException,
  Path,
  TranslateOptions,
} from 'nestjs-i18n';
import {
  I18nValidationExceptionFilterDetailedErrorsOption,
  I18nValidationExceptionFilterErrorFormatterOption,
} from 'nestjs-i18n/dist/interfaces/i18n-validation-exception-filter.interface';

type I18nValidationExceptionFilterOptions =
  | I18nValidationExceptionFilterDetailedErrorsOption
  | I18nValidationExceptionFilterErrorFormatterOption;

@Catch(I18nValidationException)
export class I18nValidationExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly options: I18nValidationExceptionFilterOptions = {
      detailedErrors: true,
    },
  ) {}
  catch(exception: I18nValidationException, host: ArgumentsHost) {
    const i18n = I18nContext.current();
    const errors = this.formatI18nErrors(exception.errors ?? [], i18n.service, {
      lang: i18n.lang,
    });
    const response = host.switchToHttp().getResponse();
    const messages = this.formatMessage(errors);

    response
      .status(this.options.errorHttpStatusCode || exception.getStatus())
      .send({
        statusCode: this.options.errorHttpStatusCode || exception.getStatus(),
        errors: exception.getResponse(),
        message: messages,
      });
  }
  private formatMessage(errors: ValidationError[]): string[] {
    return errors.reduce(
      (result: string[], error: ValidationError): string[] => {
        if (!lodash.isEmpty(error.constraints)) {
          result.push(...Object.values(error.constraints));
        } else {
          result.push(...this.formatMessage(error.children));
        }
        return result;
      },
      [],
    );
  }

  private formatI18nErrors<K = Record<string, unknown>>(
    errors: I18nValidationError[],
    i18n: I18nService<K>,
    options?: TranslateOptions,
  ): I18nValidationError[] {
    return errors.map((error) => {
      error.children = this.formatI18nErrors(
        error.children ?? [],
        i18n,
        options,
      );
      error.constraints = Object.keys(error.constraints).reduce(
        (result, key) => {
          const [translationKey, argsString] =
            error.constraints[key].split('|');
          const args = !!argsString ? JSON.parse(argsString) : {};

          result[key] = i18n.translate(translationKey as Path<K>, {
            ...options,
            args: { property: error.property, ...args },
          });

          const errorPropertyInString = (result[key] as string).match(
            error.property,
          );
          let replacementKey = error.property;
          if (errorPropertyInString) {
            const baseKey = translationKey.split('.')[0];
            const replacementKeySub = i18n.t(
              `${baseKey}.${errorPropertyInString[0]}` as Path<string>,
              { ...options },
            ) as string;

            if (!replacementKeySub.includes(baseKey)) {
              replacementKey = replacementKeySub;
            }
          }

          result[key] = result[key].replace(error.property, replacementKey);
          return result;
        },
        {},
      );
      return error;
    });
  }
}
