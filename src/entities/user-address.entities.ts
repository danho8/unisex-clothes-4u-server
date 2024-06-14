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
import { UserEntity } from './user.entities';

@Entity('UserAddress')
export class UserAddressEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  userId: number;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column({ default: false })
  default: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.userAddress)
  @JoinColumn({ name: 'userId' })
  users: UserEntity;
}
