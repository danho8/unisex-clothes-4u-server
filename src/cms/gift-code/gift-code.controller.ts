import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CreateGiftCodeDto } from '../dto/create-gift-code.dto';
import { UpdateGiftCodeDto } from '../dto/update-gift-code.dto';
import { AuthGuardCMS } from '../guard/auth-cms.guard';
import { GiftCodeService } from './gift-code.service';

@ApiTags('CMS GiftCode')
@Controller('cms/gift-code')
export class GiftCodeController {
  constructor(private readonly giftCodeService: GiftCodeService) {}

  @UseGuards(AuthGuardCMS)
  @ApiBasicAuth()
  @Post()
  @ApiOperation({ summary: 'Create Gift Code' })
  async create(
    @Body() body: CreateGiftCodeDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      if (body.userId) {
        await this.giftCodeService.findUserById(body.userId);
      }
      const giftCode = await this.giftCodeService.create(
        body,
        req['user']['id'],
        body.userId,
      );
      return res.json({
        messages: 'Create Gift Code Successfully!!!',
        statusCode: HttpStatus.OK,
        data: giftCode,
      });
    } catch (error) {
      throw new BadRequestException(
        'Create Gift Code Failed !!!',
        error.message,
      );
    }
  }

  @UseGuards(AuthGuardCMS)
  @ApiBasicAuth()
  @Get()
  @ApiOperation({ summary: 'List Gift Codes' })
  async list(@Req() req: Request, @Res() res: Response) {
    try {
      const giftCodes = await this.giftCodeService.find();
      return res.json({
        messages: 'Get List Gift Code Successfully!!!',
        statusCode: HttpStatus.OK,
        data: giftCodes,
      });
    } catch (error) {
      throw new BadRequestException('Get List Codes Failed !!!', error.message);
    }
  }

  @UseGuards(AuthGuardCMS)
  @ApiBasicAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Get One Gift Code' })
  async getOne(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const giftCodes = await this.giftCodeService.findOne(+id);
      return res.json({
        messages: 'Get One Gift Code Successfully!!!',
        statusCode: HttpStatus.OK,
        data: giftCodes,
      });
    } catch (error) {
      throw new BadRequestException(
        'Get One Gift Code Failed !!!',
        error.message,
      );
    }
  }

  @UseGuards(AuthGuardCMS)
  @ApiBasicAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Update Gift Code' })
  async update(
    @Body() body: UpdateGiftCodeDto,
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const giftCode = await this.giftCodeService.findOne(+id);
      if (body.userId) {
        await this.giftCodeService.findUserById(body.userId);
      }
      if (!giftCode) {
        throw new BadRequestException('Gift Code Does Not Exist!!!');
      }
      await this.giftCodeService.update(giftCode, body, req['user']['id']);
      return res.json({
        messages: 'Update Gift Code Successfully!!!',
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      throw new BadRequestException(
        'Update Gift Code Failed !!!',
        error.message,
      );
    }
  }

  @UseGuards(AuthGuardCMS)
  @ApiBasicAuth()
  @Delete(':id')
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'Delete Gift Code' })
  async deleteOne(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const giftCode = await this.giftCodeService.findOne(+id);
      if (!giftCode) {
        throw new BadRequestException('Gift Code Does Not Exist!!!');
      }
      await this.giftCodeService.delete(+id);
      return res.json({
        message: 'Delete Gift Code Successfully',
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      throw new BadRequestException(
        'Delete Gift Code Failed !!!',
        error.message,
      );
    }
  }
}
