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
import { DiscountType, GiftCodeType } from './../common/constants';
import { AdminEntity } from './admin.entities';
import { UserGiftCodeEntity } from './user-gift-code.entities';

@Entity('GiftCodes')
export class GiftCodesEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column({
    name: 'typeDiscount',
    type: 'enum',
    enum: DiscountType,
  })
  typeDiscount: string;

  @Column()
  discount: number;

  @Column()
  condition: number;

  @Column()
  quantity: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({
    name: 'typeGift',
    type: 'enum',
    enum: GiftCodeType,
  })
  typeGift: string;

  @Column()
  isActive: boolean;

  @Column({ nullable: true })
  createdById: number;

  @Column({ nullable: true })
  updatedById: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @OneToMany(() => UserGiftCodeEntity, (userGiftCode) => userGiftCode.giftCodes)
  userGiftCode: UserGiftCodeEntity[];

  @ManyToOne(() => AdminEntity, (admin) => admin.createdGiftCode, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'createdById' })
  createdBy: AdminEntity;

  @ManyToOne(() => AdminEntity, (admin) => admin.updatedGiftCode, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'updatedById' })
  updatedBy: AdminEntity;
}
