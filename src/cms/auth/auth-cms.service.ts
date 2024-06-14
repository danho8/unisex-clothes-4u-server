import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync } from 'bcryptjs';
import { Repository, UpdateResult } from 'typeorm';
import { AdminEntity } from '../../entities/admin.entities';
import { CreateAdminDto } from '../dto/create-admin.dto';
@Injectable()
export class AuthCMSService {
  constructor(
    @InjectRepository(AdminEntity)
    private adminRepository: Repository<AdminEntity>,
  ) {}

  async createAdmin(body: CreateAdminDto, id: number): Promise<any> {
    const user = await this.adminRepository.findOne({
      where: { email: body.email },
    });
    if (user) {
      throw new BadRequestException('Email already exists');
    }
    const admin = this.adminRepository.create({
      ...body,
      password: hashSync(body.password, 10),
      createdById: id,
    });
    return await this.adminRepository.save(admin);
  }

  async findOne(email: string): Promise<AdminEntity> {
    return await this.adminRepository.findOne({
      where: { email },
    });
  }

  async updateToken(email: string, token: string): Promise<UpdateResult> {
    return this.adminRepository.update(
      { email: email },
      { rememberToken: token },
    );
  }
  async findUser(id: number): Promise<AdminEntity> {
    return this.adminRepository.findOneOrFail({
      select: { id: true, email: true, firstName: true, lastName: true },
      where: { id },
    });
  }

  async logout(id: number): Promise<UpdateResult> {
    return this.adminRepository.update({ id: id }, { rememberToken: null });
  }
}
