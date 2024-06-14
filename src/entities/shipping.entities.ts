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
import { StatusEnum } from './../common/constants';
import { OrderEntity } from './order.entities';

@Entity('Shipping')
export class ShippingEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  orderId: number;

  @Column()
  address: number;

  @Column()
  method: string;

  @Column()
  estimatedTime: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: StatusEnum,
  })
  status: StatusEnum;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => OrderEntity, (order) => order.shippings)
  @JoinColumn({ name: 'orderId' })
  orders: OrderEntity;
}
