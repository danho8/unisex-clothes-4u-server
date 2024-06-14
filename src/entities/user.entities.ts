import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerFeedbackEntity } from './customer-feedback.entities';
import { OrderEntity } from './order.entities';
import { UserAddressEntity } from './user-address.entities';
import { UserBalanceEntity } from './user-balance.entities';
import { UserGiftCodeEntity } from './user-gift-code.entities';

@Entity('Users')
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  code: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  birthday: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  rememberToken: string;

  @Column({ nullable: true })
  emailVerifiedAt: Date;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @Column({ nullable: true })
  emailConfirmationToken: string;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ default: false })
  isBlocked: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @OneToMany(() => UserAddressEntity, (userAddress) => userAddress.users)
  userAddress: UserAddressEntity[];

  @OneToMany(() => UserBalanceEntity, (userBalance) => userBalance.users)
  userBalance: UserBalanceEntity[];

  @OneToMany(() => UserGiftCodeEntity, (userGiftCode) => userGiftCode.users)
  userGiftCodes: UserGiftCodeEntity[];

  @OneToMany(() => OrderEntity, (orders) => orders.users)
  orders: OrderEntity[];

  @OneToMany(
    () => CustomerFeedbackEntity,
    (customerFeedback) => customerFeedback.users,
  )
  customerFeedback: CustomerFeedbackEntity[];
}
