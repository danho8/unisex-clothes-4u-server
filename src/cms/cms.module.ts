import { Logger, Module } from '@nestjs/common';
import { SharedModule } from 'src/common/modules';
import { AuthCMSModule } from './auth/auth-cms.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { GiftCodeModule } from './gift-code/gift-code.module';

@Module({
  imports: [
    AuthCMSModule,
    CategoryModule,
    SharedModule,
    ProductModule,
    UserModule,
    GiftCodeModule,
  ],
  providers: [Logger],
})
export class CmsModule {}
