import { Injectable } from '@nestjs/common';
import { AnalyzeDto } from './dto/analyze.dto';
import { extractText } from '../common/utils/extractText';
import { getUrl } from './functions/getUrl';
import { analyzeMatchesInText } from './functions/context';
import { htmlReport } from './functions/htmlBody';
import { uploadFile } from './functions/uploadHtml';
import { Report } from './schemas/keyword.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EmailService } from 'src/email/email.service';
import { htmlIndex } from './functions/htmlIndex';
@Injectable()
export class AnalyzeService {
  constructor(
    @InjectModel(Report.name)
    private readonly reportModel: Model<Report>,
    private readonly emailService: EmailService,
  ) {}

  async analyzeRunNow(data: AnalyzeDto) {
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
    const indexHtml = await htmlIndex({
      urls: data.urls,
      keywords: data.keywords,
    });
    CompleteHtml += indexHtml;
    // Generate HTML report for each URL
    for (const originalUrl of data.urls) {
      try {
        const processedUrl = getUrl(originalUrl);
        const texts = await extractText(processedUrl);

        // Find matches in the text
        const allMatches = analyzeMatchesInText(texts, data.keywords);

        if (allMatches.length > 0) {
          const reportData = {
            url: originalUrl,

            isScheduled: data.schedule,
            reportType: data.reportType,
            status: 'finished',
            matchCount: allMatches.length,
            matches: allMatches,
            tags: data.tags,
          };

          const getReport = await htmlReport(reportData);
          CompleteHtml += getReport;
        } else {
          results.push({
            originalUrl,
            message: 'No matches found.',
          });
        }
      } catch (error) {
        return 500;
      }
    }
    CompleteHtml += '</body></html>';
    const urlHtml = await uploadFile(CompleteHtml, data.title);
    if (urlHtml === 'Failed to upload file to S3') return 500;
    const reportData = {
      url: urlHtml,
      title: data.title,
      userId: data.userId,
    };
    await this.reportModel.create(reportData);

    await this.emailService.sendMail(
      data.email,
      'Keyword Report',
      CompleteHtml,
      data.title,
    );
    return urlHtml;
  }
}
