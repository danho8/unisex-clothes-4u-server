import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CategoryService } from './category.service';

@ApiTags('Landing Category')
@Controller('landing/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('list')
  @ApiOperation({ summary: 'Get All Categories' })
  async getAll(@Req() req: Request, @Res() res: Response) {
    try {
      const categories = await this.categoryService.findAllCategory();
      return res.json({
        statusCode: HttpStatus.OK,
        data: categories,
      });
    } catch (error) {
      throw new BadRequestException(
        'List All Categories Failed !!!',
        error.message,
      );
    }
  }
}
