import { Controller, Get, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AppService } from './app.service';

@ApiTags('Heal Check')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Heal Check' })
  healCheck(@Res() res: Response): any {
    res.json({ status: 200, message: 'OK' });
  }
}
