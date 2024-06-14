import { Logger, Module } from '@nestjs/common';
import { SharedModule } from 'src/common/modules';
import { AuthLandingModule } from './auth/auth-landing.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [AuthLandingModule, SharedModule, ProductModule, CategoryModule],
  providers: [Logger],
})
export class LandingModule {}
