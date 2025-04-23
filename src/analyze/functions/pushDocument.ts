// src/analyze/functions/createReport.ts

import { Model } from 'mongoose';
import { ReportMatchSchema } from '../schemas/keyword.schema';

export async function createDocument(
  reportModel: Model<any>,
  originalUrl: string,
  userId: number,
  schedule: boolean,
  reportType: string,
  tags: string[],
  allMatches: any[],
) {
  if (allMatches.length > 0) {
    const saved = await reportModel.create({
      url: originalUrl,
      createdBy: {
        userId,
        name: 'sistem',
        role: 'admin',
      },
      isScheduled: schedule,
      reportType,
      status: 'finished',
      matchCount: allMatches.length,
      matches: allMatches,
      tags,
    });

    return saved._id;
  }

  return null;
}
