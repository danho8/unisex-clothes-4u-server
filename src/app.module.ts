import { BullModule } from '@nestjs/bull';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import * as winston from 'winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CmsModule } from './cms/cms.module';
import { LandingModule } from './landing/landing.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
    }),
    JwtModule.register({ global: true, signOptions: { expiresIn: '30d' } }),
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: process.env.REDIS_HOST,
          port: +process.env.REDIS_PORT,
        },
      }),
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.File({
          filename: './logs/server.log',
        }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.errors({ stack: true }),
            winston.format.colorize({
              colors: { debug: 'cyan' },
              all: true,
            }),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf(({ level, message, timestamp, stack }) => {
              if (stack) {
                return `${timestamp} ${level}: ${message} - ${stack}`;
              }
              return `${timestamp} [${level}]: ${message}`;
            }),
            nestWinstonModuleUtilities.format.nestLike('4UNISEX'),
          ),
        }),
      ],
    }),
    CmsModule,
    LandingModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
