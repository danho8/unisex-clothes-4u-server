import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AdminEntity } from './admin.entities';
import { OrderItemEntity } from './order-item.entities';
import { ProductImageEntity } from './product-image.entities';
import { ProductEntity } from './product.entities';

@Entity('ProductOption')
export class ProductOptionEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  productId: number;

  @Column()
  nameColor: string;

  @Column()
  slug: string;

  @Column({
    name: 'size',
    type: 'enum',
    enum: ['S', 'M', 'L', 'XL', 'XXL'],
  })
  size: string;

  @Column()
  quantity: number;

  @Column()
  cost: number;

  @Column()
  price: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  createdById: number;

  @Column({ nullable: true })
  updatedById: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => AdminEntity, (admin) => admin.createdProductOption, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'createdById' })
  createdBy: AdminEntity;

  @ManyToOne(() => AdminEntity, (admin) => admin.updatedProductOption, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'updatedById' })
  updatedBy: AdminEntity;

  @ManyToOne(() => ProductEntity, (product) => product.productOptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  products: ProductEntity;

  @OneToMany(
    () => ProductImageEntity,
    (productImage) => productImage.productOption,
    { cascade: true },
  )
  productImages: ProductImageEntity[];

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.productOptions)
  orderItems: OrderItemEntity[];
}
