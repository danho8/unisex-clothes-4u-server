import { Logger, Module } from '@nestjs/common';
import { SharedModule } from './../../common/modules/shared.module';
import { GiftCodeController } from './gift-code.controller';
import { GiftCodeService } from './gift-code.service';

@Module({
  imports: [SharedModule],
  controllers: [GiftCodeController],
  providers: [GiftCodeService, Logger],
})
export class GiftCodeModule {}
