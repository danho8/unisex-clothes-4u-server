import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { generateNumber } from '../../common/util';
import { CreateGiftCodeDto } from '../dto/create-gift-code.dto';
import { UpdateGiftCodeDto } from '../dto/update-gift-code.dto';
import { GiftCodesEntity } from './../../entities/gift-code.entities';
import { UserGiftCodeEntity } from './../../entities/user-gift-code.entities';
import { UserEntity } from './../../entities/user.entities';

@Injectable()
export class GiftCodeService {
  constructor(
    @InjectRepository(GiftCodesEntity)
    private giftCodeRepository: Repository<GiftCodesEntity>,

    @InjectRepository(UserGiftCodeEntity)
    private userGiftCodeEntity: Repository<UserGiftCodeEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findUserById(id: number): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: {
          id: id,
          isEmailConfirmed: true,
        },
      });
      return user;
    } catch (error) {
      throw new BadGatewayException(
        'User Do Not Exist Or Account Has Not Been Activated Email ',
      );
    }
  }

  async create(
    body: CreateGiftCodeDto,
    userCreateId: number,
    userId?: number,
  ): Promise<GiftCodesEntity> {
    const giftCode = this.giftCodeRepository.create({
      ...body,
      createdById: userCreateId,
      code: generateNumber('CODE'),
    });
    await this.giftCodeRepository.save(giftCode);

    if (userId) {
      const userGiftCode = this.userGiftCodeEntity.create({
        userId: userId,
        giftCodeId: giftCode.id,
      });
      await this.userGiftCodeEntity.save(userGiftCode);
    }
    return giftCode;
  }

  async find(): Promise<GiftCodesEntity[]> {
    return await this.giftCodeRepository.find({
      relations: ['userGiftCode', 'userGiftCode.users'],
    });
  }
  async findOne(id: number): Promise<GiftCodesEntity> {
    return await this.giftCodeRepository.findOne({
      where: { id },
      relations: ['userGiftCode', 'userGiftCode.users'],
    });
  }

  async update(
    giftCode: GiftCodesEntity,
    body: UpdateGiftCodeDto,
    userCreateId: number,
  ): Promise<UpdateResult> {
    if (!giftCode.userGiftCode && body.userId) {
      const userGiftCode = this.userGiftCodeEntity.create({
        userId: body.userId,
        giftCodeId: giftCode.id,
      });
      await this.userGiftCodeEntity.save(userGiftCode);
    }
    if (giftCode.userGiftCode && body.userId) {
      await this.userGiftCodeEntity.update(
        { giftCodeId: giftCode.id },
        {
          userId: body.userId,
        },
      );
    }
    if (giftCode.userGiftCode && !body.userId) {
      await this.userGiftCodeEntity.delete({ giftCodeId: giftCode.id });
    }
    return await this.giftCodeRepository.update(
      {
        id: giftCode.id,
      },
      {
        name: body.name,
        typeDiscount: body.typeDiscount,
        discount: body.discount,
        condition: body.condition,
        typeGift: body.typeGift,
        quantity: body.quantity,
        startDate: body.startDate,
        endDate: body.endDate,
        isActive: body.isActive,
        updatedById: userCreateId,
      },
    );
  }

  async delete(id: number): Promise<any> {
    const userGiftCode = await this.userGiftCodeEntity.findOne({
      where: {
        giftCodeId: id,
      },
    });
    if (userGiftCode) {
      await this.userGiftCodeEntity.delete({ giftCodeId: id });
    }
    return await this.giftCodeRepository.softDelete({ id });
  }
}
