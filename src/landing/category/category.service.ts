import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './../../entities/category.entities';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}
  async findAllCategory(): Promise<any> {
    return CategoryEntity.createQueryBuilder('Categories')
      .select()
      .leftJoinAndSelect('Categories.children', 'child')
      .getMany();
  }
}
