import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnalyzeDto } from './dto/analyze.dto';
import { OpenAIService } from '../open-ia/open-ia.service';
import { extractText } from '../common/utils/extractText';
import { getUrl } from './functions/getUrl';
import { analyzeMatchesInText } from './functions/context';
import { createDocument } from './functions/pushDocument';
import { indexFunction } from './functions/htmlIndex';
import { htmlReport } from './functions/htmlBody';
import { ReportData } from './functions/interfaceMatches';
@Injectable()
export class AnalyzeService {
  constructor(
    private readonly openAIService: OpenAIService,
    @InjectModel('Report') private readonly reportModel: Model<any>,
  ) {}

  async analyzeRunNow({
    urls,
    keywords,
    userId,
    schedule,
    reportType,
    tags,
  }: AnalyzeDto) {
    const results = [];

    let CompleteHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Detailed Report</title>
        <style>
          body {
            width: 210mm;
            margin: 10px auto;
            border: 2px solid #939292;
            border-radius: 5px;
            padding: 0;
            font-family: "Roboto", sans-serif;
            background-color: #fff;
            color: #333;
          }
          </style>
          <body>    
    `;
    const data = {
      urls,
      keywords,
    };
    const indexHtml = await indexFunction(data);

    CompleteHtml += indexHtml;
    for (const originalUrl of urls) {
      try {
        const processedUrl = getUrl(originalUrl);

        const texts = await extractText(processedUrl);

        const allMatches = analyzeMatchesInText(texts, keywords);

        const mongoId = await createDocument(
          this.reportModel,
          originalUrl,
          userId,
          schedule,
          reportType,
          tags,
          allMatches,
        );

        if (data) {
          const reportDoc = await this.reportModel
            .findById(mongoId)
            .lean<ReportData>();
          if (reportDoc !== null) {
            const plainReport = JSON.parse(JSON.stringify(reportDoc));
            const getReport = await htmlReport(plainReport);
            CompleteHtml += getReport;
          }
        } else {
          results.push({
            originalUrl,
            message: 'Not found matches',
          });
        }
      } catch (error) {}
    }
    CompleteHtml += '</body></html>';
    return CompleteHtml;
  }
}
