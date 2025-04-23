import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AnalyzeService } from './analyze.service';
import { AnalyzeDto } from './dto/analyze.dto';

@Controller('analyze')
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}

  @Post()
  create(@Body() data: AnalyzeDto) {
    return this.analyzeService.analyzeRunNow(data);
  }
}
