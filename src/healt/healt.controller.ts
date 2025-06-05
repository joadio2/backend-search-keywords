import { Controller, Get } from '@nestjs/common';
import { HealtService } from './healt.service';

@Controller('healt')
export class HealtController {
  constructor(private readonly healtService: HealtService) {}

  @Get()
  healthCheck() {
    return { status: 'ok' };
  }
}
