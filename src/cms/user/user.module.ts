import { Logger, Module } from '@nestjs/common';
import { SharedModule } from './../../common/modules/shared.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [SharedModule],
  controllers: [UserController],
  providers: [UserService, Logger],
})
export class UserModule {}
