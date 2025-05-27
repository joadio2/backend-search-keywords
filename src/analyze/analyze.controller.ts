import { Controller, Post, Body, HttpStatus, Res } from '@nestjs/common';
import { AnalyzeService } from './analyze.service';
import { AnalyzeDto } from './dto/analyze.dto';
import { Response } from 'express';

@Controller('analyze')
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}

  @Post()
  async analyzeRunNow(@Body() data: AnalyzeDto, @Res() res: Response) {
    const task = await this.analyzeService.analyzeRunNow(data);
    console.log(`✅ Response from analyzeRunNow:`);

    if (task.status === 500) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error al procesar la tarea',
        error: task.message,
      });
    }

    return res.status(HttpStatus.OK).json({
      message: 'Task scheduled successfully',
    });
  }
}
