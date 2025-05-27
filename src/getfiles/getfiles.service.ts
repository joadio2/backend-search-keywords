import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report, ReportSchema } from '../analyze/schemas/keyword.schema';
@Injectable()
export class GetfilesService {
  constructor(
    @InjectModel(Report.name)
    private readonly reportModel: Model<Report>,
  ) {}

  async findByUserId(userId: string) {
    const getData = await this.reportModel.find({ userId }).exec();
    if (getData.length === 0) {
      return 404;
    }
    return getData;
  }
}
