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
import { CategoryEntity } from './category.entities';
import { CustomerFeedbackEntity } from './customer-feedback.entities';
import { ProductOptionEntity } from './product-option.entities';

@Entity('Products')
export class ProductEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  name: string;

  @Column()
  categoryId: number;

  @Column()
  slug: string;

  @Column()
  sku: string;

  @Column()
  description: string;

  @Column({ default: 0 })
  view: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFave: boolean;

  @Column({ default: false })
  isBestSelling: boolean;

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

  @ManyToOne(() => AdminEntity, (admin) => admin.createdProducts, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'createdById' })
  createdBy: AdminEntity;

  @ManyToOne(() => AdminEntity, (admin) => admin.updatedProducts, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'updatedById' })
  updatedBy: AdminEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  categories: CategoryEntity;

  @OneToMany(
    () => ProductOptionEntity,
    (productOption) => productOption.products,
    { cascade: true },
  )
  productOptions: ProductOptionEntity[];

  @OneToMany(
    () => CustomerFeedbackEntity,
    (customerFeedback) => customerFeedback.products,
  )
  customerFeedback: CustomerFeedbackEntity[];
}
