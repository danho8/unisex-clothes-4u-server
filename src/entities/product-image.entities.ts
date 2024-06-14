import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AdminEntity } from './admin.entities';
import { ProductOptionEntity } from './product-option.entities';

@Entity('ProductImage')
export class ProductImageEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  productOptionId: number;

  @Column()
  image: string;

  @Column()
  imageUploaded: string;

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

  @ManyToOne(() => ProductOptionEntity, (product) => product.productImages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productOptionId' })
  productOption: ProductOptionEntity;
}
