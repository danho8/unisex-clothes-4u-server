import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Queue } from 'bull';
import { Request, Response } from 'express';
import * as speakeasy from 'speakeasy';
import { UserPasswordConfirmDto } from '../dto/request-password-confirm.dto';
import { UserResetPasswordDto } from '../dto/request-reset-password.dto';
import { PasswordConfirmDto } from '../dto/reset-password';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserRegisterDto } from '../dto/user-register.dto';
import { UserEntity } from './../../entities/user.entities';
import { AuthLandingService } from './auth-landing.service';

@ApiTags('Landing Auth')
@Controller('landing/auth')
export class AuthLandingController {
  constructor(
    @InjectQueue('email') private readonly emailQueue: Queue,
    private readonly authLandingService: AuthLandingService,
    private jwtService: JwtService,
  ) {}

  @ApiBasicAuth()
  @Get('me')
  getProfile(@Req() req: Request) {
    return this.authLandingService.getProfile(req['user']['id']);
  }

  @Post('sign-up')
  @ApiOperation({ summary: 'Register User' })
  async signUp(
    @Body() body: UserRegisterDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const userExists = await this.authLandingService.findOneUser(body.email);
      if (userExists) {
        throw new BadRequestException('Email already exists');
      }
      const user: UserEntity = await this.authLandingService.createUser(
        body.email,
        body.password,
      );
      // Enqueue email sending
      await this.emailQueue.add('sendEmail', {
        email: body.email,
        token: user.emailConfirmationToken,
      });
      return res.json({
        messages: 'Register Successfully, Please Login Email Confirmed !!!',
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      throw new BadRequestException('Sign Up User Failed !!!', error.message);
    }
  }

  @ApiOperation({ summary: 'Confirmed Email' })
  @Post('sign-up/confirm')
  async confirmEmail(
    @Query('email') email: string,
    @Query('token') token: string,
    @Res() res: Response,
  ) {
    try {
      await this.authLandingService.confirmedEmail(email, token);
      return res.json({
        messages: 'Email successfully confirmed',
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      throw new BadRequestException(
        'Confirmed Email Failed !!!',
        error.message,
      );
    }
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'Login User' })
  async signIn(@Body() body: UserLoginDto, @Res() res: Response): Promise<any> {
    try {
      const user = await this.authLandingService.logIn(body);
      if (user) {
        const payload = {
          id: user.id,
          username: user.email,
          name: user.firstName + ' ' + user.lastName,
        };
        const access_token = await this.jwtService.signAsync(payload, {
          secret: process.env.LANDING_JWT_SECRET || 'LANDING_JWT_SECRET',
        });
        await this.authLandingService.updateToken(body.email, access_token);
        return res.json({
          messages: 'Sign In Successfully!!!',
          statusCode: HttpStatus.OK,
          access_token: access_token,
        });
      } else {
        throw new NotFoundException('User Does Not Exist');
      }
    } catch (error) {
      throw new BadRequestException('Sign In User Failed !!!', error.message);
    }
  }

  @Post('request-reset-password')
  @ApiOperation({ summary: 'Request Reset Password' })
  async requestResetPassword(
    @Body() body: UserResetPasswordDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const user = await this.authLandingService.findOneUser(body.email);
      if (user) {
        const secret = speakeasy.generateSecret({ length: 20 }).base32;
        const resetPasswordToken = speakeasy.totp({
          secret: secret,
          encoding: 'base32',
          digits: 6,
        });
        await this.authLandingService.updateResetPasswordToken(
          body.email,
          secret,
        );
        await this.emailQueue.add('sendOTPByEmail', {
          email: body.email,
          otp: resetPasswordToken,
        });

        return res.json({
          messages:
            'Request Reset Password Successfully, Please Login Email Confirmed !!!',
          statusCode: HttpStatus.OK,
        });
      } else {
        throw new NotFoundException('User Does Not Exist');
      }
    } catch (error) {
      throw new BadRequestException(
        'Request Reset Password Failed !!!',
        error.message,
      );
    }
  }

  @ApiOperation({ summary: 'Request Confirmed Email' })
  @Post('request-reset-password/confirm')
  async resetPasswordConfirm(
    @Body() body: UserPasswordConfirmDto,
    @Res() res: Response,
  ) {
    try {
      const user = await this.authLandingService.findOneUser(body.email);
      if (!user.resetPasswordToken) {
        throw new BadRequestException('token: Token invalid');
      }
      const verified = speakeasy.totp.verify({
        secret: user.resetPasswordToken,
        encoding: 'base32',
        token: body.otp,
        window: 1,
      });
      if (!verified) {
        throw new BadRequestException('OTP invalid');
      }
      return res.json({
        messages: 'Confirmed OTP Successfully, Please Enter Your Password!!!',
        statusCode: HttpStatus.OK,
        data: verified,
      });
    } catch (error) {
      throw new BadRequestException(
        'Confirmed Email Failed !!!',
        error.message,
      );
    }
  }

  @ApiOperation({ summary: 'Please Enter Password' })
  @Post('reset-password')
  async resetPassword(
    @Body() body: PasswordConfirmDto,
    @Query('otp') otp: string,
    @Res() res: Response,
  ) {
    try {
      if (body.password !== body.rePassword) {
        throw new BadRequestException(
          'Password and Re-password are not the same',
        );
      }
      const user = await this.authLandingService.findOneUser(body.email);
      if (!user) {
        throw new NotFoundException('User Does Not Exist!!!');
      }
      const verified = speakeasy.totp.verify({
        secret: user.resetPasswordToken,
        encoding: 'base32',
        token: otp,
        window: 1,
      });
      if (!verified) {
        throw new BadRequestException('OTP invalid');
      }
      const payload = {
        id: user.id,
        username: user.email,
        name: user.firstName + ' ' + user.lastName,
      };
      const access_token = await this.jwtService.signAsync(payload, {
        secret: process.env.LANDING_JWT_SECRET || 'LANDING_JWT_SECRET',
      });
      await this.authLandingService.updatePassword(
        user.email,
        body.password,
        access_token,
      );
      return res.json({
        messages: ' Reset Password Successfully, Please Login To Website !!!',
        statusCode: HttpStatus.OK,
        access_token: access_token,
      });
    } catch (error) {
      throw new BadRequestException('Re-Password Failed !!!', error.message);
    }
  }
}
