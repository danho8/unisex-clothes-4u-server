import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryEntity } from './category.entities';
import { GiftCodesEntity } from './gift-code.entities';
import { PermissionEntity } from './permission.entities';
import { ProductOptionEntity } from './product-option.entities';
import { ProductEntity } from './product.entities';
import { RoleEntity } from './role.entities';

@Entity('Admins')
export class AdminEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true })
  emailVerifiedAt: Date;

  @Column({ nullable: true })
  rememberToken: string;

  @Column({ default: false })
  isBlocked: boolean;

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

  @ManyToMany(() => RoleEntity)
  @JoinTable({
    name: 'AdminRole',
    joinColumn: {
      name: 'adminId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
  })
  roles: RoleEntity[];

  @OneToMany(() => PermissionEntity, (permission) => permission.createdBy)
  createdPermissions: PermissionEntity[];

  @OneToMany(() => PermissionEntity, (permission) => permission.updatedBy)
  updatedPermissions: PermissionEntity[];

  @OneToMany(() => CategoryEntity, (category) => category.createdBy)
  createdCategories: CategoryEntity[];

  @OneToMany(() => CategoryEntity, (category) => category.updatedBy)
  updatedCategories: CategoryEntity[];

  @OneToMany(() => RoleEntity, (role) => role.createdBy)
  createdRoles: RoleEntity[];

  @OneToMany(() => RoleEntity, (role) => role.updatedBy)
  updatedRoles: RoleEntity[];

  @OneToMany(() => ProductEntity, (product) => product.createdBy)
  createdProducts: ProductEntity[];

  @OneToMany(() => ProductEntity, (product) => product.updatedBy)
  updatedProducts: ProductEntity[];

  @OneToMany(() => GiftCodesEntity, (giftCode) => giftCode.createdBy)
  createdGiftCode: GiftCodesEntity[];

  @OneToMany(() => GiftCodesEntity, (giftCode) => giftCode.updatedBy)
  updatedGiftCode: GiftCodesEntity[];

  @OneToMany(
    () => ProductOptionEntity,
    (productOption) => productOption.createdBy,
  )
  createdProductOption: ProductOptionEntity[];

  @OneToMany(
    () => ProductOptionEntity,
    (productOption) => productOption.updatedBy,
  )
  updatedProductOption: ProductOptionEntity[];
}
