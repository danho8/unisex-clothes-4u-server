import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync, hashSync } from 'bcryptjs';
import { randomBytes } from 'crypto';
import { generateNumber } from 'src/common/util';
import { Repository, UpdateResult } from 'typeorm';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserBalanceEntity } from './../../entities/user-balance.entities';
import { UserEntity } from './../../entities/user.entities';

@Injectable()
export class AuthLandingService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(UserBalanceEntity)
    private userBalanceRepository: Repository<UserBalanceEntity>,
  ) {}
  async getProfile(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['userBalance'],
      select: {
        id: true,
        firstName: true,
        lastName: true,
        emailVerifiedAt: true,
        isEmailConfirmed: true,
        userBalance: { point: true, lastBalance: true, balance: true },
      },
    });
  }

  async findOneUser(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }
  async logIn(body: UserLoginDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email: body.email },
    });
    if (!user) {
      throw new BadRequestException('Incorrect email or password');
    }
    if (!user.isEmailConfirmed) {
      throw new BadRequestException(
        'The account has not been confirmed. Please confirm it in your mailbox to use the account.',
      );
    }
    const isPasswordMatching = compareSync(body.password, user.password);
    if (!isPasswordMatching) {
      throw new BadRequestException('Incorrect email or password.');
    }
    return user;
  }

  async createUser(email: string, password: string): Promise<UserEntity> {
    const emailToken = randomBytes(32).toString('hex');
    const user = this.userRepository.create({
      email: email,
      password: hashSync(password),
      emailConfirmationToken: emailToken,
      code: generateNumber(''),
    });
    return await this.userRepository.save(user);
  }

  async updateToken(email: string, token: string): Promise<UpdateResult> {
    return this.userRepository.update(
      { email: email },
      { rememberToken: token },
    );
  }

  async updateResetPasswordToken(
    email: string,
    token: string,
  ): Promise<UpdateResult> {
    return this.userRepository.update(
      { email: email },
      {
        rememberToken: null,
        resetPasswordToken: token,
      },
    );
  }

  async updatePassword(
    email: string,
    password: string,
    token: string,
  ): Promise<UpdateResult> {
    return this.userRepository.update(
      { email: email },
      {
        password: hashSync(password),
        resetPasswordToken: null,
        rememberToken: token,
      },
    );
  }

  async confirmedEmail(email: string, token: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
        emailConfirmationToken: token,
      },
    });
    if (!user) {
      throw new BadRequestException('token: Token invalid');
    }
    if (user.isEmailConfirmed) {
      throw new BadRequestException('email: Already confirmed');
    }
    await this.userRepository.update(
      { id: user.id },
      {
        emailVerifiedAt: new Date(),
        isEmailConfirmed: true,
        emailConfirmationToken: null,
      },
    );
    const userBalance = this.userBalanceRepository.create({
      userId: user.id,
      balance: 0,
      lastBalance: 0,
      point: 0,
    });
    return await this.userBalanceRepository.save(userBalance);
  }
}
