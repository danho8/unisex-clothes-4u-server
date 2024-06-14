import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './../../entities/admin.entities';
import { CategoryEntity } from './../../entities/category.entities';
import { CustomerFeedbackEntity } from './../../entities/customer-feedback.entities';
import { GiftCodesEntity } from './../../entities/gift-code.entities';
import { OrderItemEntity } from './../../entities/order-item.entities';
import { OrderEntity } from './../../entities/order.entities';
import { PaymentEntity } from './../../entities/payment.entities';
import { PermissionEntity } from './../../entities/permission.entities';
import { ProductImageEntity } from './../../entities/product-image.entities';
import { ProductOptionEntity } from './../../entities/product-option.entities';
import { ProductEntity } from './../../entities/product.entities';
import { RoleEntity } from './../../entities/role.entities';
import { ShippingEntity } from './../../entities/shipping.entities';
import { UserAddressEntity } from './../../entities/user-address.entities';
import { UserBalanceEntity } from './../../entities/user-balance.entities';
import { UserGiftCodeEntity } from './../../entities/user-gift-code.entities';
import { UserEntity } from './../../entities/user.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdminEntity,
      PermissionEntity,
      RoleEntity,
      CategoryEntity,
      UserEntity,
      ProductEntity,
      ProductOptionEntity,
      ProductImageEntity,
      UserAddressEntity,
      UserBalanceEntity,
      GiftCodesEntity,
      UserGiftCodeEntity,
      OrderEntity,
      OrderItemEntity,
      PaymentEntity,
      ShippingEntity,
      CustomerFeedbackEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class SharedModule {}
