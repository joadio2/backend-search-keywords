import { Controller } from '@nestjs/common';
import { OpenAIService } from './open-ia.service';

@Controller('open-ia')
export class OpenIaController {
  constructor(private readonly openIaService: OpenAIService) {}
}
