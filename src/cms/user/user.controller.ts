import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuardCMS } from '../guard/auth-cms.guard';
import { UserService } from './user.service';

@ApiTags('CMS User')
@Controller('cms/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuardCMS)
  @ApiBasicAuth()
  @Get()
  @ApiOperation({ summary: 'Get Users' })
  async create(@Req() req: Request, @Res() res: Response) {
    try {
      const users = this.userService.findAll();
      return res.json({
        messages: 'Create Product Successfully!!!',
        statusCode: HttpStatus.OK,
        data: users,
      });
    } catch (error) {
      throw new BadRequestException('Get Users Failed!!!', error.message);
    }
  }
}
