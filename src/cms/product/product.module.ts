import { Logger, Module } from '@nestjs/common';
import { CloudinaryService } from './../../common/cloudinary/cloudinary.service';
import { SharedModule } from './../../common/modules/shared.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [SharedModule],
  controllers: [ProductController],
  providers: [ProductService, Logger, CloudinaryService],
})
export class ProductModule {}
