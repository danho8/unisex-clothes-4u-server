import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { pagination } from './../../common/constants';
import { ProductService } from './product.service';

@ApiTags('Landing Product')
@Controller('landing/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('list')
  @ApiQuery({
    name: 'sortByName',
    required: false,
    type: String,
    enum: ['DESC', 'ASC'],
  })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiOperation({ summary: 'List All Product' })
  async list(
    @Req() req: Request,
    @Res() res: Response,
    @Query('perPage') perPage = pagination.ITEM_PER_PAGE,
    @Query('page') page = pagination.DEFAULT_PAGE,
    @Query('sortByName') sortByName: 'DESC' | 'ASC',
  ) {
    try {
      const [products, total] = await this.productService.listProduct(
        perPage,
        page,
        sortByName,
      );
      products.forEach((e) => {
        e['nameCategory'] = e ? e.categories.name : ('-' as any);
      });
      return res.json({
        messages: 'List Products Successfully!!!',
        statusCode: HttpStatus.OK,
        result: products,
        total: total,
      });
    } catch (error) {
      throw new BadRequestException(
        'List All Product Failed !!!',
        error.message,
      );
    }
  }

  @Get('detail/:id')
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'Get Detail Product And Relation' })
  async getAll(@Req() req: Request, @Res() res: Response) {
    try {
      const products = await this.productService.findProductById(
        +req.params.id,
      );
      return res.json({
        statusCode: HttpStatus.OK,
        data: products,
      });
    } catch (error) {
      throw new BadRequestException(
        'Get Product Detail Failed !!!',
        error.message,
      );
    }
  }

  @Get('detail/relation/:categoryId')
  @ApiParam({ name: 'categoryId' })
  @ApiOperation({ summary: 'Get Detail Product And Relation' })
  async getProductRelation(@Req() req: Request, @Res() res: Response) {
    try {
      const products = await this.productService.findProductByCategoryId(
        +req.params.categoryId,
      );
      return res.json({
        statusCode: HttpStatus.OK,
        data: products,
      });
    } catch (error) {
      throw new BadRequestException(
        'Get Product Detail Failed !!!',
        error.message,
      );
    }
  }

  @Get('best-selling/main')
  @ApiOperation({ summary: 'Get Products Best Selling Main Default 4' })
  async listProductBestSelling(@Req() req: Request, @Res() res: Response) {
    try {
      const products = await this.productService.findProductBestSelling();
      return res.json({
        statusCode: HttpStatus.OK,
        data: products,
      });
    } catch (error) {
      throw new BadRequestException(
        'List All Categories Failed !!!',
        error.message,
      );
    }
  }

  @Get('best-selling/detail')
  @ApiQuery({
    name: 'sortByName',
    required: false,
    type: String,
    enum: ['DESC', 'ASC'],
  })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiOperation({ summary: 'Get Products Best Selling' })
  async listProductsBestSelling(
    @Req() req: Request,
    @Res() res: Response,
    @Query('perPage') perPage = pagination.ITEM_PER_PAGE,
    @Query('page') page = pagination.DEFAULT_PAGE,
    @Query('sortByName') sortByName: 'DESC' | 'ASC',
  ) {
    try {
      const products = await this.productService.findProductsBestSelling(
        perPage,
        page,
        sortByName,
      );
      return res.json({
        statusCode: HttpStatus.OK,
        data: products,
      });
    } catch (error) {
      throw new BadRequestException(
        'List All Categories Failed !!!',
        error.message,
      );
    }
  }
}
