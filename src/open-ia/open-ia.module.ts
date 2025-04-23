import { Module } from '@nestjs/common';
import { OpenIaController } from './open-ia.controller';
import { OpenAIService } from './open-ia.service';

@Module({
  controllers: [OpenIaController],
  providers: [OpenAIService],
  exports: [OpenAIService],
})
export class OpenIaModule {}
