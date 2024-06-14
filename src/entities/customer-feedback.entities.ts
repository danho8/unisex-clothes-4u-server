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
import { RatingEnum } from './../common/constants';
import { ProductEntity } from './product.entities';
import { UserEntity } from './user.entities';

@Entity('CustomerFeedback')
export class CustomerFeedbackEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  userId: number;

  @Column()
  productId: number;

  @Column({
    name: 'rating',
    type: 'enum',
    enum: RatingEnum,
  })
  rating: RatingEnum;

  @Column()
  comments: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.customerFeedback)
  @JoinColumn({ name: 'userId' })
  users: UserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.customerFeedback)
  @JoinColumn({ name: 'productId' })
  products: ProductEntity;
}
