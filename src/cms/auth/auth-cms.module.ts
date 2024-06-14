import { Logger, Module } from '@nestjs/common';
import { SharedModule } from '../../common/modules/shared.module';
import { AuthController } from './auth-cms.controller';
import { AuthCMSService } from './auth-cms.service';

@Module({
  imports: [SharedModule],
  controllers: [AuthController],
  providers: [AuthCMSService, Logger],
})
export class AuthCMSModule {}
