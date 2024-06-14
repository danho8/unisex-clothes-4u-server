import { BadRequestException, Logger, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';
import { SharedModule } from './../../common/modules/shared.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [
    SharedModule,
    MulterModule.register({
      storage: diskStorage({}),
      fileFilter: (req, file, callback) => {
        const allowedTypes = ['.png', '.jpg', '.jpeg'];
        const fileExtName = extname(file.originalname).toLowerCase();
        if (!allowedTypes.includes(fileExtName)) {
          return callback(
            new BadRequestException(
              'Chỉ cho phép tải lên file hình ảnh (png, jpg, jpeg).',
            ),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        files: 10,
        // fileSize: 1024 * 1024 * 10, // 10 MB (đơn vị tính là bytes)
      },
    }),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, Logger, CloudinaryService],
})
export class CategoryModule {}
