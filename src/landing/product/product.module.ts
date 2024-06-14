import { Module } from '@nestjs/common';
import { SharedModule } from './../../common/modules/shared.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [SharedModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
