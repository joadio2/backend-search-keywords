import { Module } from '@nestjs/common';
import { GetfilesService } from './getfiles.service';
import { GetfilesController } from './getfiles.controller';
import { Report, ReportSchema } from '../analyze/schemas/keyword.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
  ],
  controllers: [GetfilesController],
  providers: [GetfilesService],
})
export class GetfilesModule {}
