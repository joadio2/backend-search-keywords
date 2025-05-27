import { Controller, Get, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { GetReportService } from './get-report.service';
import { Title } from './dto/title';

@Controller('get-report')
export class GetReportController {
  constructor(private readonly getReportService: GetReportService) {}

  @Get()
  async getReport(@Query('title') title: Title, @Res() res: Response) {
    console.log(`✅ Title: ${title}`);
    return this.getReportService.getReport(title, res);
  }
}
