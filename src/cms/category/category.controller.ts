import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBasicAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';
import { ToBoolean } from '../../common/util';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { AuthGuardCMS } from '../guard/auth-cms.guard';
import { CategoryService } from './category.service';

@Controller('cms/category')
@ApiTags('CMS Category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(AuthGuardCMS)
  @ApiBasicAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @Post('create')
  @ApiOperation({ summary: 'Create  Category' })
  async create(
    @Body() body: CreateCategoryDto,
    @UploadedFile() avatar: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      body.isMain = ToBoolean(body.isMain);
      body.isActive = ToBoolean(body.isActive);
      if (body.isMain == true && +body.parentId) {
        throw new BadRequestException(
          'Main categories cannot have a parent category.',
        );
      }
      const category = await this.categoryService.createCategory(
        body,
        avatar,
        req['user']['id'],
      );
      return res.json({
        statusCode: HttpStatus.OK,
        data: category,
      });
    } catch (error) {
      throw new BadRequestException(
        'Create Categories Failed !!!',
        error.message,
      );
    }
  }

  @UseGuards(AuthGuardCMS)
  @ApiBasicAuth()
  @Get('relation/parent')
  @ApiOperation({ summary: 'Get Parent Categories' })
  async getCategoriesParent(@Res() res: Response) {
    try {
      const category = await this.categoryService.getCategoriesParent();
      return res.json({
        statusCode: HttpStatus.OK,
        data: category,
      });
    } catch (error) {
      throw new BadRequestException(
        'Get Parent Categories Failed !!!',
        error.message,
      );
    }
  }

  @UseGuards(AuthGuardCMS)
  @ApiBasicAuth()
  @Get('relation/children')
  @ApiOperation({ summary: 'Get Children Categories' })
  async getCategoriesChildren(@Res() res: Response) {
    try {
      const category = await this.categoryService.getCategoriesChildren();
      return res.json({
        statusCode: HttpStatus.OK,
        data: category,
      });
    } catch (error) {
      throw new BadRequestException(
        'Get Children Categories Failed !!!',
        error.message,
      );
    }
  }

  @UseGuards(AuthGuardCMS)
  @ApiBasicAuth()
  @Get('list')
  @ApiOperation({ summary: 'Get All Categories' })
  async getAll(@Res() res: Response) {
    try {
      const category = await this.categoryService.findAllCategory();
      return res.json({
        statusCode: HttpStatus.OK,
        data: category,
      });
    } catch (error) {
      throw new BadRequestException(
        'Get All Categories Failed !!!',
        error.message,
      );
    }
  }

  @UseGuards(AuthGuardCMS)
  @ApiBasicAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Get Detail Category' })
  async getOne(@Res() res: Response, @Param('id') id: number) {
    try {
      const category = await this.categoryService.findOneCategory(id);
      return res.json({
        statusCode: HttpStatus.OK,
        data: category,
      });
    } catch (error) {
      throw new BadRequestException(
        'Get Detail Category Failed !!!',
        error.message,
      );
    }
  }

  @UseGuards(AuthGuardCMS)
  @ApiBasicAuth()
  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({ summary: 'Update Category' })
  async updateOne(
    @Body() body: UpdateCategoryDto,
    @UploadedFile() avatar: Express.Multer.File,
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      body.isMain = ToBoolean(body.isMain);
      body.isActive = ToBoolean(body.isActive);
      if (body.isMain == true && +body.parentId) {
        throw new BadRequestException(
          'Main categories cannot have a parent category.',
        );
      }
      const [category, categoryName] = await Promise.all([
        this.categoryService.findOneCategoryById(id),
        this.categoryService.findOneCategoryBySlug(body.name),
      ]);
      if (categoryName && categoryName.id !== category.id) {
        throw new BadRequestException('Category already exists !!!');
      }
      if (+body.parentId) {
        const categoryMain = await this.categoryService.findCategoryMain(
          +body.parentId,
        );
        if (!categoryMain) {
          throw new BadRequestException(
            `Category Main with Parent ID not found`,
          );
        }
      }
      if (avatar) {
        const result = await this.cloudinaryService.updateFile(
          avatar,
          category.avatar,
        );
        await this.categoryService.updateImages(category.id, result);
      }
      await this.categoryService.updateOneCategory(req['user']['id'], id, body);
      return res.json({
        message: 'Update Category Successfully',
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      throw new BadRequestException(
        'Update Category Failed !!!',
        error.message,
      );
    }
  }

  @UseGuards(AuthGuardCMS)
  @ApiBasicAuth()
  @Delete(':id')
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'Delete Category' })
  async deleteOne(@Req() req: Request, @Res() res: Response) {
    try {
      const category = await this.categoryService.findOneCategory(
        +req.params.id,
      );
      if (category.avatar && category.avatarUploaded) {
        await this.cloudinaryService.deleteFile(category.avatar);
      }
      await this.categoryService.deleteOneCategory(+req.params.id);
      return res.json({
        message: 'Delete Category Successfully',
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      throw new BadRequestException(
        'Delete Category Failed !!!',
        error.message,
      );
    }
  }
}
