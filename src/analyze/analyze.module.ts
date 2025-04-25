import { Module } from '@nestjs/common';
import { AnalyzeService } from './analyze.service';
import { AnalyzeController } from './analyze.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from './schemas/keyword.schema';
import { EmailModule } from 'src/email/email.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
    EmailModule,
  ],

  controllers: [AnalyzeController],
  providers: [AnalyzeService],
})
export class AnalyzeModule {}
