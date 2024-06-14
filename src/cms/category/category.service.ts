import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { toSlug } from './../../common/util';
import { CategoryEntity } from './../../entities/category.entities';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,

    private cloudinaryService: CloudinaryService,
  ) {}

  async createCategory(
    body: CreateCategoryDto,
    avatar: Express.Multer.File,
    id: number,
  ): Promise<CategoryEntity> {
    const slug = toSlug(body.name);
    const categoryExist = await this.categoryRepository.findOne({
      where: { slug: slug },
    });
    if (categoryExist) {
      throw new BadRequestException('Category Does Not Exist');
    }
    if (!avatar) {
      throw new NotFoundException('No file uploaded');
    }
    const result = await this.cloudinaryService.uploadFile(avatar);
    if (body.parentId) {
      const parent = await this.categoryRepository.findOne({
        where: { id: +body.parentId },
      });
      if (!parent) {
        throw new BadRequestException({
          message: ['Parent Category not found!'],
          error: 'Bad Request',
          statusCode: 400,
        });
      }
      body.parentId = +parent.id;
    }
    const category = this.categoryRepository.create({
      ...body,
      parentId: body.isMain == true ? null : +body.parentId,
      slug: slug,
      avatar: result.public_id,
      avatarUploaded: result.url,
      createdById: id,
    });
    return await this.categoryRepository.save(category);
  }

  async getCategoriesParent(): Promise<CategoryEntity[]> {
    return this.categoryRepository.find({
      where: { isMain: true },
    });
  }
  async getCategoriesChildren(): Promise<CategoryEntity[]> {
    return this.categoryRepository.find({
      where: { isMain: false },
    });
  }
  async findAllCategory(): Promise<any> {
    const categories = await this.categoryRepository.find({
      relations: ['parent'],
    });
    categories.forEach((e) => {
      e['parentName'] = e.parent ? e.parent.name : ('-' as any);
    });
    return categories;
  }

  async findOneCategory(id: number): Promise<CategoryEntity> {
    try {
      return await this.categoryRepository.findOneOrFail({
        where: { id },
        relations: ['parent'],
      });
    } catch (error) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }

  async findOneCategoryById(id: number): Promise<CategoryEntity> {
    try {
      return await this.categoryRepository.findOneOrFail({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }

  async findOneCategoryBySlug(name: string): Promise<CategoryEntity> {
    return await this.categoryRepository.findOne({
      where: { slug: toSlug(name) },
    });
  }

  async deleteOneCategory(id: number): Promise<UpdateResult> {
    await this.categoryRepository.update(
      { id },
      { avatar: '', avatarUploaded: '' },
    );
    await this.categoryRepository.update({ parentId: id }, { parentId: null });
    return this.categoryRepository.softDelete({
      id,
    });
  }
  async updateImages(
    id: number,
    result: { url: string; public_id: string },
  ): Promise<UpdateResult> {
    return await this.categoryRepository.update(
      {
        id,
      },
      {
        avatar: result.public_id,
        avatarUploaded: result.url,
      },
    );
  }

  async findCategoryMain(id: number): Promise<CategoryEntity> {
    return this.categoryRepository.findOne({
      where: { id, isMain: true },
    });
  }

  async updateOneCategory(
    userId: number,
    id: number,
    body: UpdateCategoryDto,
  ): Promise<UpdateResult> {
    return await this.categoryRepository.update(
      {
        id,
      },
      {
        slug: toSlug(body.name),
        name: body.name,
        description: body.description,
        isMain: body.isMain,
        isActive: body.isActive,
        updatedById: userId,
        parentId: +body.parentId ? +body.parentId : null,
      },
    );
  }
}
