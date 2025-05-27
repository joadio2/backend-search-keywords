import { Module } from '@nestjs/common';
import { GetReportService } from './get-report.service';
import { GetReportController } from './get-report.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from 'src/analyze/schemas/keyword.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
  ],
  controllers: [GetReportController],
  providers: [GetReportService],
})
export class GetReportModule {}
