import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AdminEntity } from './admin.entities';
import { RoleEntity } from './role.entities';

@Entity('Permissions')
export class PermissionEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  name: string;

  @Column()
  action: string;

  @Column()
  description: string;

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

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles: RoleEntity[];

  @ManyToOne(() => AdminEntity, (admin) => admin.createdPermissions, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'createdById' })
  createdBy: AdminEntity;

  @ManyToOne(() => AdminEntity, (admin) => admin.updatedPermissions, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'updatedById' })
  updatedBy: AdminEntity;
}
