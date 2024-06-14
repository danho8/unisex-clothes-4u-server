import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { compareSync } from 'bcryptjs';
import { Request, Response } from 'express';
import { AdminDto } from '../dto/admin.dto';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { AuthGuardCMS } from '../guard/auth-cms.guard';
import { AuthCMSService } from './auth-cms.service';

@ApiTags('CMS Auth')
@Controller('cms/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthCMSService,
    private jwtService: JwtService,
  ) {}

  @Post('sign-in')
  @ApiOperation({ summary: 'Login User Admin' })
  async signIn(@Body() body: AdminDto): Promise<{ access_token: string }> {
    try {
      const user = await this.authService.findOne(body.email);
      if (!user) {
        throw new BadRequestException('Incorrect email or password');
      }
      const verify = compareSync(body.password, user.password);
      if (verify == false) {
        throw new UnauthorizedException();
      }
      const payload = {
        id: user.id,
        username: user.email,
        name: user.firstName + ' ' + user.lastName,
      };
      const access_token = await this.jwtService.signAsync(payload, {
        secret: process.env.CMS_JWT_SECRET || 'CMS_JWT_SECRET',
      });
      await this.authService.updateToken(body.email, access_token);
      return { access_token };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuardCMS)
  @ApiBasicAuth()
  @Post('create')
  @ApiOperation({ summary: 'Create User Admin' })
  async create(
    @Body() body: CreateAdminDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const user = await this.authService.createAdmin(body, req['user']['id']);
      return res.json({
        statusCode: HttpStatus.OK,
        data: user,
      });
    } catch (error) {
      throw new BadRequestException(
        'Create User Admin Failed!!!',
        error.message,
      );
    }
  }

  @UseGuards(AuthGuardCMS)
  @ApiBasicAuth()
  @Get('profile')
  @ApiOperation({ summary: 'Get Profile User Admin' })
  async getProfile(@Req() req: Request, @Res() res: Response) {
    try {
      const user = await this.authService.findUser(req['user']['id']);
      return res.json({
        statusCode: HttpStatus.OK,
        data: user,
      });
    } catch (error) {
      throw new BadRequestException(
        'Get Profile User Admin Failed!!!',
        error.message,
      );
    }
  }

  @UseGuards(AuthGuardCMS)
  @ApiBasicAuth()
  @Post('sign-out')
  @ApiOperation({ summary: 'Logout User Admin' })
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      const id: number = req['user']['id'];
      if (!id) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'No token provided.' });
      }
      await this.authService.logout(id);
      res.clearCookie('access_token');
      return res.json({
        statusCode: HttpStatus.OK,
        message: 'You have been logged out.',
      });
    } catch (error) {
      throw new BadRequestException(
        'Logout User Admin Failed!!!',
        error.message,
      );
    }
  }
}
