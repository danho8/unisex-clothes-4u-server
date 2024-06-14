import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBasicAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { toSlug } from '../../common/util';
import { CreateProductOptionDto } from '../dto/create-product-option.dto';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductOptionDto } from '../dto/update-product-option.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { AuthGuardCMS } from '../guard/auth-cms.guard';
import { CloudinaryService } from './../../common/cloudinary/cloudinary.service';
import { multerOptions } from './../../configs/multer.config';
import { ProductService } from './product.service';

@ApiTags('CMS Product')
@Controller('cms/product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(AuthGuardCMS)
  @ApiBasicAuth()
  @Post('create')
  @ApiOperation({ summary: 'Create Product' })
  async create(
    @Body() body: CreateProductDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const [productExist, categoryExist] = await Promise.all([
        this.productService.findProductExist(body.name),
        this.productService.findCategoryExist(body.categoryId),
      ]);
      if (productExist) {
        throw new NotFoundException('Product Exist');
      }
      if (!categoryExist) {
        throw new NotFoundException('Category Does Not Exist');
      }
      const product = await this.productService.createProduct(
        body,
        req['user']['id'],
      );
      return res.json({
        messages: 'Create Product Successfully!!!',
        statusCode: HttpStatus.OK,
        data: product,
      });
    } catch (error) {
      throw new BadRequestException('Create Product Failed !!!', error.message);
    }
  }

  @UseGuards(AuthGuardCMS)
  @ApiBasicAuth()
  @Post('create/product-option')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 5, multerOptions))
  @ApiOperation({ summary: 'Create Product Option' })
  async createProductOption(
    @Body() body: CreateProductOptionDto,
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    try {
      const slug = toSlug(body.nameColor);
      await this.productService.findProductById(+body.productId);
      const productOptionExist =
        await this.productService.findProductOptionExist(slug, body.size);

      if (productOptionExist) {
        throw new BadRequestException('Product Option already exist');
      }
      if (!files) {
        throw new NotFoundException('No file uploaded');
      }
      const uploadedFiles: any = await Promise.all(
        files.map(
          async (file: Express.Multer.File) =>
            await this.cloudinaryService.uploadFileBase64(file),
        ),
      );
      const productOption = await this.productService.createProductOption(
        req['user']['id'],
        body,
        uploadedFiles,
      );
      return res.json({
        messages: 'Create Product Successfully!!!',
        statusCode: HttpStatus.OK,
        results: productOption,
      });
    } catch (error) {
      throw new BadRequestException(
        'Create Product Option Failed !!!',
        error.message,
      );
    }
  }

  @UseGuards(AuthGuardCMS)
  @ApiBasicAuth()
  @Get('list')
  @ApiOperation({ summary: 'List All Product' })
  async find(@Req() req: Request, @Res() res: Response) {
    try {
      const products = await this.productService.listProduct();
      return res.json({
        messages: 'List Products Successfully!!!',
        statusCode: HttpStatus.OK,
        result: products,
      });
    } catch (error) {
      throw new BadRequestException(
        'List All Product Failed !!!',
        error.message,
      );
    }
  }

  @UseGuards(AuthGuardCMS)
  @ApiBasicAuth()
  @Get('detail/:productId')
  @ApiOperation({ summary: 'Get One Product And Relation' })
  async getProduct(
    @Param('productId') productId: number,
    @Res() res: Response,
  ) {
    try {
      const product =
        await this.productService.findProductAndRelation(+productId);
      if (!product) {
        throw new BadRequestException('Product Does Not Exist');
      }
      return res.json({
        messages: 'List Product Successfully!!!',
        statusCode: HttpStatus.OK,
        result: product,
      });
    } catch (error) {
      throw new BadRequestException('Get Product Failed !!!', error.message);
    }
  }

  @UseGuards(AuthGuardCMS)
  @ApiBasicAuth()
  @Put('update')
  @ApiOperation({ summary: 'Update One Product And Relation' })
  async updateProduct(
    @Req() req: Request,
    @Body() body: UpdateProductDto,
    @Res() res: Response,
  ) {
    try {
      const [product, category] = await Promise.all([
        this.productService.findProductById(body.id),
        this.productService.findCategoryById(body.categoryId),
      ]);
      if (!product || !category) {
        throw new BadRequestException('Product Or Category Does Not Exist !!!');
      }
      await this.productService.updateProduct(req['user']['id'], body);
      return res.json({
        messages: 'Update Product Successfully!!!',
        statusCode: HttpStatus.OK,
        result: body,
      });
    } catch (error) {
      throw new BadRequestException('Update Product Failed !!!', error.message);
    }
  }

  @UseGuards(AuthGuardCMS)
  @ApiBasicAuth()
  @Put('update/product-option')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 5, multerOptions))
  @ApiOperation({ summary: 'Update One Product Option And Relation' })
  async updateProductOption(
    @Req() req: Request,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: UpdateProductOptionDto,
    @Res() res: Response,
  ) {
    try {
      const [productOption, productOptionExist] = await Promise.all([
        this.productService.findProductOptionById(body.id, body.productId),
        this.productService.findProductOptionExist(
          toSlug(body.nameColor),
          body.size,
        ),
      ]);
      if (productOptionExist && productOptionExist.id !== productOption.id) {
        throw new BadRequestException('Product Option already exists !!!');
      }
      if (!productOption) {
        throw new BadRequestException('Product Option Does Not Exist !!!');
      }
      const imageIds: string[] = productOption.productImages.map((e) => {
        return e.image;
      });
      const imageDeleteIds = body.publicIds.split(',');
      if (
        imageDeleteIds.includes('') ||
        imageDeleteIds.length < imageIds.length
      ) {
        const results: string[] = imageIds.filter(
          (item) => !body.publicIds.includes(item),
        );
        for (const result of results) {
          await this.cloudinaryService.deleteFile(result);
        }
        await this.productService.deleteProductImageByImages(results);
      }
      if (files) {
        const uploadedFiles: any = await Promise.all(
          files.map(
            async (file: Express.Multer.File) =>
              await this.cloudinaryService.uploadFileBase64(file),
          ),
        );
        await this.productService.createProductImage(
          req['user']['id'],
          body.id,
          uploadedFiles,
        );
      }
      await this.productService.updateProductOption(req['user']['id'], body);
      return res.json({
        messages: 'Update Product Successfully!!!',
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      throw new BadRequestException('Get Product Failed !!!', error.message);
    }
  }

  @UseGuards(AuthGuardCMS)
  @ApiBasicAuth()
  @Delete(':id')
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'Delete Product And Relation' })
  async deleteProduct(@Req() req: Request, @Res() res: Response) {
    try {
      const product = await this.productService.findProductAndRelation(
        +req.params.id,
      );

      if (!product) {
        throw new BadRequestException('Product Does Not Exist !!!');
      }

      if (product.productOptions.length > 0) {
        const publicIds = [];
        const productOptionIds = [];
        const productImageIds = [];
        for (const productOption of product.productOptions) {
          productOptionIds.push(productOption.id);
          for (const productImage of productOption.productImages) {
            publicIds.push(productImage.image);
            productImageIds.push(productImage.id);
          }
        }
        for (const publicId of publicIds) {
          await this.cloudinaryService.deleteFile(publicId);
        }
        await Promise.all([
          this.productService.deleteProductOptions(productOptionIds),
          this.productService.deleteProductImage(productImageIds),
        ]);
      }

      await this.productService.deleteProduct(product.id);
      return res.json({
        messages: 'Delete Product Successfully!!!',
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      throw new BadRequestException('Delete Product Failed !!!', error.message);
    }
  }

  @UseGuards(AuthGuardCMS)
  @ApiBasicAuth()
  @Delete(':id/:productIdOption')
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'productIdOption' })
  @ApiOperation({ summary: 'Delete Product Option And Relation' })
  async deleteProductOption(@Req() req: Request, @Res() res: Response) {
    try {
      const productOption =
        await this.productService.findProductOptionAndRelation(
          +req.params.id,
          +req.params.productIdOption,
        );

      if (!productOption) {
        throw new BadRequestException('Product Does Not Exist !!!');
      }

      if (productOption.productImages.length > 0) {
        const publicIds = [];
        const productImageIds = [];
        for (const productImage of productOption.productImages) {
          publicIds.push(productImage.image);
          productImageIds.push(productImage.id);
        }
        for (const publicId of publicIds) {
          this.cloudinaryService.deleteFile(publicId);
        }
        await this.productService.deleteProductImage(productImageIds);
      }
      await this.productService.deleteProductOption(productOption.id);
      return res.json({
        messages: 'Delete Product Successfully!!!',
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      throw new BadRequestException('Delete Product Failed !!!', error.message);
    }
  }
}
