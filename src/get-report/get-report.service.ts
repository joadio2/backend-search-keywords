import { Injectable, HttpStatus } from '@nestjs/common';
import { Report } from 'src/analyze/schemas/keyword.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Title } from './dto/title';
import { Response } from 'express';

@Injectable()
export class GetReportService {
  constructor(
    @InjectModel(Report.name) private readonly getReportModel: Model<Report>,
  ) {}

  async getReport(titleToFound: Title, res: Response) {
    try {
      console.log(`✅ Title2: ${titleToFound}`);
      const report = await this.getReportModel
        .findOne({ title: titleToFound })
        .lean();
      console.log(report);
      if (!report) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'No report found' });
      }

      return res.status(HttpStatus.OK).json({ report });
    } catch (error) {
      console.error('Error fetching report:', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
    }
  }
}
