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
import { OrderEntity } from './order.entities';
import { ProductOptionEntity } from './product-option.entities';

@Entity('OrderItem')
export class OrderItemEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  orderId: number;

  @Column()
  productOptionId: number;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column()
  totalPrice: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => OrderEntity, (order) => order.orderItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  orders: OrderEntity;

  @ManyToOne(
    () => ProductOptionEntity,
    (productOption) => productOption.orderItems,
  )
  @JoinColumn({ name: 'productOptionId' })
  productOptions: ProductOptionEntity;
}
