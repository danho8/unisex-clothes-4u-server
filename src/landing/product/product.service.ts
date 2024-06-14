import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './../../entities/product.entities';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async listProduct(
    perPage: number,
    page: number,
    sortBy: 'DESC' | 'ASC',
  ): Promise<[ProductEntity[], number]> {
    const take = perPage;
    const skip = (page - 1) * take;
    const products = await this.productRepository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.productOptions', 'productOption')
      .leftJoinAndSelect('productOption.productImages', 'productImage')
      .leftJoinAndSelect('product.categories', 'categories')
      .where('product.isActive = :isActive', { isActive: true })
      .groupBy('product.id')
      .addGroupBy('productOption.id')
      .addGroupBy('categories.id')
      .addGroupBy('productImage.id')
      .having('COUNT(productOption.id) > 0')
      .orderBy('product.name', sortBy)
      .skip(skip)
      .take(take)
      .getManyAndCount();
    return products;
  }

  async findProductById(id: number): Promise<ProductEntity[]> {
    const products = await this.productRepository.find({
      order: { name: 'DESC' },
      where: { id: id, isActive: true },
      relations: ['productOptions', 'productOptions.productImages'],
    });
    return products;
  }

  async findProductByCategoryId(categoryId: number): Promise<ProductEntity[]> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.productOptions', 'productOption')
      .leftJoinAndSelect('productOption.productImages', 'productImage')
      .where('product.isActive = :isActive', { isActive: true })
      .where('product.categoryId = :categoryId', { categoryId: categoryId })
      .groupBy('product.id')
      .addGroupBy('productOption.id')
      .addGroupBy('productImage.id')
      .having('COUNT(productOption.id) > 0')
      .orderBy('product.createdAt', 'DESC')
      .take(5)
      .getMany();
    return products;
  }

  async findProductBestSelling(): Promise<ProductEntity[]> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.productOptions', 'productOption')
      .leftJoinAndSelect('productOption.productImages', 'productImage')
      .leftJoinAndSelect('product.categories', 'categories')
      .where('product.isActive = :isActive', { isActive: true })
      .where('product.isBestSelling = :isBestSelling', { isBestSelling: true })
      .groupBy('product.id')
      .addGroupBy('productOption.id')
      .addGroupBy('categories.id')
      .addGroupBy('productImage.id')
      .having('COUNT(productOption.id) > 0')
      .orderBy('product.createdAt', 'DESC')
      .take(4)
      .getMany();

    return products;
  }

  async findProductsBestSelling(
    perPage: number,
    page: number,
    sortBy: 'DESC' | 'ASC',
  ): Promise<[ProductEntity[], number]> {
    const take = perPage;
    const skip = (page - 1) * take;
    const products = await this.productRepository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.productOptions', 'productOption')
      .leftJoinAndSelect('productOption.productImages', 'productImage')
      .leftJoinAndSelect('product.categories', 'categories')
      .where('product.isActive = :isActive', { isActive: true })
      .where('product.isBestSelling = :isBestSelling', { isBestSelling: true })
      .groupBy('product.id')
      .addGroupBy('productOption.id')
      .addGroupBy('categories.id')
      .addGroupBy('productImage.id')
      .having('COUNT(productOption.id) > 0')
      .orderBy('product.name', sortBy)
      .skip(skip)
      .take(take)
      .getManyAndCount();
    return products;
  }
}
