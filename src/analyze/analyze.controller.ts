import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AnalyzeService } from './analyze.service';
import { AnalyzeDto } from './dto/analyze.dto';

@Controller('analyze')
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}

  @Post()
  async create(@Body() data: AnalyzeDto, @Res() res: Response) {
    const response = await this.analyzeService.analyzeRunNow(data);
    return res.status(HttpStatus.OK).json({
      message: 'Analysis completed',
      html: response,
    });
  }
}
