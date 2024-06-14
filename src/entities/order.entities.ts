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
import { StatusEnum } from './../common/constants';
import { OrderItemEntity } from './order-item.entities';
import { PaymentEntity } from './payment.entities';
import { ShippingEntity } from './shipping.entities';
import { UserEntity } from './user.entities';

@Entity('Orders')
export class OrderEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  userId: number;

  @Column()
  orderDate: Date;

  @Column()
  totalPrice: number;

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

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  users: UserEntity;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.orders)
  orderItems: OrderItemEntity[];

  @OneToMany(() => PaymentEntity, (payment) => payment.orders)
  payments: PaymentEntity[];

  @OneToMany(() => ShippingEntity, (payment) => payment.orders)
  shippings: ShippingEntity[];
}
