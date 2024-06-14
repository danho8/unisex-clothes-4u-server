import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GiftCodesEntity } from './gift-code.entities';
import { UserEntity } from './user.entities';

@Entity('UserGiftCode')
export class UserGiftCodeEntity {
  @Column({ type: 'int', primary: true, nullable: false })
  userId: number;

  @Column({ type: 'int', primary: true, nullable: false })
  giftCodeId: number;

  @Column({ type: 'boolean', nullable: true })
  isUsed: boolean;

  @ManyToOne(() => UserEntity, (userGiftCode) => userGiftCode.userGiftCodes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  users: UserEntity;

  @ManyToOne(
    () => GiftCodesEntity,
    (userGiftCode) => userGiftCode.userGiftCode,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'giftCodeId' })
  giftCodes: GiftCodesEntity;
}
