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

@Entity('UserBalance')
export class UserBalanceEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  userId: number;

  @Column()
  point: number;

  @Column()
  lastBalance: number;

  @Column()
  balance: number;

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
