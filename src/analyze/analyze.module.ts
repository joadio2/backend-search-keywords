import { Module } from '@nestjs/common';
import { AnalyzeService } from './analyze.service';
import { AnalyzeController } from './analyze.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportSchema } from './schemas/keyword.schema';
import { OpenIaModule } from 'src/open-ia/open-ia.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Report', schema: ReportSchema }]),
    OpenIaModule,
  ],
  controllers: [AnalyzeController],
  providers: [AnalyzeService],
})
export class AnalyzeModule {}
