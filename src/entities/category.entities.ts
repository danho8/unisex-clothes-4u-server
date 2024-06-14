import {
  BaseEntity,
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
import { ProductEntity } from './product.entities';

@Entity('Categories')
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  isMain: boolean;

  @Column()
  isActive: boolean;

  @Column()
  avatar: string;

  @Column()
  avatarUploaded: string;

  @Column({ nullable: true })
  parentId: number | null;

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

  @ManyToOne(() => AdminEntity, (admin) => admin.createdCategories, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'createdById' })
  createdBy: AdminEntity;

  @ManyToOne(() => AdminEntity, (admin) => admin.updatedCategories, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'updatedById' })
  updatedBy: AdminEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.children, {
    cascade: true,
  })
  @JoinColumn({ name: 'parentId' })
  parent: CategoryEntity;

  @OneToMany(() => CategoryEntity, (category) => category.parent)
  children: CategoryEntity[];

  @OneToMany(() => ProductEntity, (product) => product.categories)
  products: ProductEntity[];
}
