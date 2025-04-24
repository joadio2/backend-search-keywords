import { AnalyzeService } from '../../analyze/analyze.service';
import { AppModule } from '../../app.module';
import { NestFactory } from '@nestjs/core';

let analyzeService: AnalyzeService;

export async function getAnalyzeService(): Promise<AnalyzeService> {
  if (!analyzeService) {
    const app = await NestFactory.createApplicationContext(AppModule);
    analyzeService = app.get(AnalyzeService);
  }
  return analyzeService;
}
