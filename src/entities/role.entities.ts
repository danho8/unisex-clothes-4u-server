import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AdminEntity } from './admin.entities';
import { PermissionEntity } from './permission.entities';

@Entity('Roles')
export class RoleEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: false })
  isActive: boolean;

  @Column()
  createdById: number;

  @Column()
  updatedById: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @ManyToMany(() => AdminEntity, (admin) => admin.roles)
  admins: AdminEntity[];

  @ManyToMany(() => PermissionEntity)
  @JoinTable({
    name: 'RolePermission',
    joinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permissionId',
      referencedColumnName: 'id',
    },
  })
  permissions: PermissionEntity[];

  @ManyToOne(() => AdminEntity, (admin) => admin.createdRoles, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'createdById' })
  createdBy: AdminEntity;

  @ManyToOne(() => AdminEntity, (admin) => admin.updatedRoles, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'updatedById' })
  updatedBy: AdminEntity;
}
