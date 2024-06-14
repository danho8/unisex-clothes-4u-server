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
import { PaymentType, StatusEnum } from './../common/constants';
import { OrderEntity } from './order.entities';

@Entity('Payment')
export class PaymentEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  orderId: number;

  @Column()
  amount: number;

  @Column({
    name: 'type',
    type: 'enum',
    enum: PaymentType,
  })
  type: PaymentType;

  @Column({
    name: 'status',
    type: 'enum',
    enum: StatusEnum,
  })
  status: StatusEnum;

  @Column()
  description: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => OrderEntity, (order) => order.payments)
  @JoinColumn({ name: 'orderId' })
  orders: OrderEntity;
}
