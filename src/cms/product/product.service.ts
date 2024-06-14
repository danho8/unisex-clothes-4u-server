import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, UpdateResult } from 'typeorm';
import { CreateProductOptionDto } from '../dto/create-product-option.dto';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductOptionDto } from '../dto/update-product-option.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { RandomName } from './../../common/constants';
import { generateNumber, ToBoolean, toSlug } from './../../common/util';
import { CategoryEntity } from './../../entities/category.entities';
import { ProductImageEntity } from './../../entities/product-image.entities';
import { ProductOptionEntity } from './../../entities/product-option.entities';
import { ProductEntity } from './../../entities/product.entities';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,

    @InjectRepository(ProductOptionEntity)
    private productOptionRepository: Repository<ProductOptionEntity>,

    @InjectRepository(ProductImageEntity)
    private productImageRepository: Repository<ProductImageEntity>,

    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findProductById(id: number): Promise<ProductEntity> {
    return this.productRepository.findOne({ where: { id } });
  }

  async findProductOptionById(
    id: number,
    productId: number,
  ): Promise<ProductOptionEntity> {
    return this.productOptionRepository.findOne({
      where: { id, productId },
      relations: ['productImages'],
    });
  }
  async findProductAndRelation(id: number): Promise<ProductEntity> {
    const product: any = await this.productRepository.findOne({
      where: { id },
      relations: [
        'categories',
        'productOptions',
        'productOptions.productImages',
      ],
    });
    product['nameCategory'] = product.categories
      ? product.categories.name
      : ('-' as any);
    return product;
  }

  async findProductOptionAndRelation(
    productId: number,
    id: number,
  ): Promise<ProductOptionEntity> {
    return this.productOptionRepository.findOne({
      where: { id, productId },
      relations: ['productImages'],
    });
  }

  async findCategoryById(id: number): Promise<CategoryEntity> {
    return await this.categoryRepository.findOne({
      where: { id },
    });
  }

  async findProductExist(name: string): Promise<ProductEntity> {
    return this.productRepository.findOne({
      where: { slug: toSlug(name) },
    });
  }

  async findCategoryExist(id: number): Promise<CategoryEntity> {
    return this.categoryRepository.findOne({ where: { id } });
  }

  async createProduct(
    body: CreateProductDto,
    userId: number,
  ): Promise<ProductEntity> {
    const product = this.productRepository.create({
      ...body,
      slug: toSlug(body.name),
      sku: generateNumber(RandomName.SKU),
      createdById: userId,
      view: 0,
    });
    return await this.productRepository.save(product);
  }

  async findProductOptionExist(
    slug: string,
    size: string,
  ): Promise<ProductOptionEntity> {
    return await this.productOptionRepository.findOne({
      where: { slug, size },
    });
  }

  async createProductOption(
    userId: number,
    body: CreateProductOptionDto,
    results: Array<{ url: string; public_id: string }>,
  ): Promise<ProductOptionEntity> {
    const productOption = this.productOptionRepository.create({
      productId: +body.productId,
      nameColor: body.nameColor,
      slug: toSlug(body.nameColor),
      size: body.size,
      quantity: +body.quantity,
      cost: +body.cost,
      price: +body.price,
      isActive: true,
      createdById: userId,
    });
    productOption.productImages = results.map((e) => {
      return this.productImageRepository.create({
        image: e.public_id,
        imageUploaded: e.url,
        createdById: userId,
      });
    });
    return await this.productOptionRepository.save(productOption);
  }

  async updateProductOption(
    userId: number,
    body: UpdateProductOptionDto,
  ): Promise<UpdateResult> {
    return await this.productOptionRepository.update(
      {
        id: body.id,
      },
      {
        slug: toSlug(body.nameColor),
        nameColor: body.nameColor,
        size: body.size,
        quantity: body.quantity,
        cost: +body.cost,
        price: +body.price,
        isActive: ToBoolean(body.isActive),
        updatedById: userId,
      },
    );
  }

  async createProductImage(
    userId: number,
    productOptionId: number,
    results: Array<{ url: string; public_id: string }>,
  ): Promise<any> {
    const productImages = [];
    for (const result of results) {
      const data = this.productImageRepository.create({
        productOptionId: productOptionId,
        image: result.public_id,
        imageUploaded: result.url,
        createdById: userId,
      });
      const productImage = this.productImageRepository.save(data);
      productImages.push(productImage);
    }
    return productImages;
  }

  async listProduct(): Promise<ProductEntity[]> {
    const products = await this.productRepository.find({
      relations: [
        'categories',
        'productOptions',
        'productOptions.productImages',
      ],
      order: { createdAt: 'DESC' },
    });
    products.forEach((e) => {
      e['nameCategory'] = e.categories ? e.categories.name : ('-' as any);
    });
    return products;
  }
  async updateProduct(
    userId: number,
    body: UpdateProductDto,
  ): Promise<UpdateResult> {
    return await this.productRepository.update(
      { id: body.id },
      {
        ...body,
        slug: toSlug(body.name),
        updatedById: userId,
      },
    );
  }

  async deleteProduct(id: number): Promise<any> {
    return await this.productRepository.softDelete({ id: id });
  }

  async deleteProductOptions(ids: number[]): Promise<any> {
    return await this.productOptionRepository.softDelete({ id: In(ids) });
  }

  async deleteProductOption(id: number): Promise<any> {
    return await this.productOptionRepository.softDelete({ id: id });
  }

  async deleteProductImage(ids: number[]): Promise<any> {
    return await this.productImageRepository.delete({ id: In(ids) });
  }

  async deleteProductImageByImages(images: string[]): Promise<any> {
    return await this.productImageRepository.delete({ image: In(images) });
  }
}
