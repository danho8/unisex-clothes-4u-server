import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { BullModule, getQueueToken } from '@nestjs/bull';
import {
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { Queue } from 'bull';
import { JWTMiddleware } from '../jwt/JWTMiddleware';
import { SharedModule } from './../../common/modules/shared.module';
import { AuthLandingController } from './auth-landing.controller';
import { EmailProcessor } from './auth-landing.processer';
import { AuthLandingService } from './auth-landing.service';
@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'email',
      inject: [EmailProcessor],
    }),
    SharedModule,
  ],
  controllers: [AuthLandingController],
  providers: [AuthLandingService, EmailProcessor],
})
export class AuthLandingModule implements NestModule {
  @Inject(getQueueToken('email'))
  private readonly queue: Queue;

  configure(consumer: MiddlewareConsumer) {
    const serverAdapter = new ExpressAdapter();
    createBullBoard({ queues: [new BullAdapter(this.queue)], serverAdapter });
    serverAdapter.setBasePath('/admin/queues');
    consumer.apply(serverAdapter.getRouter()).forRoutes('/admin/queues');
    consumer
      .apply(JWTMiddleware)
      .forRoutes({ path: 'landing/auth/me', method: RequestMethod.GET });
  }
}
