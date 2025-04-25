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

    console.log('🔍 Starting analysis with data:', data);

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
    </head>
    <body>
  `;

    const indexHtml = await htmlIndex({
      urls: data.urls,
      keywords: data.keywords,
    });
    CompleteHtml += indexHtml;

    for (const originalUrl of data.urls) {
      try {
        console.log(`🌐 Processing URL: ${originalUrl}`);
        const processedUrl = getUrl(originalUrl);
        console.log(`🔗 Processed URL: ${processedUrl}`);

        const texts = await extractText(processedUrl);
        console.log(
          `📄 Extracted text (${texts.length} blocks):`,
          texts.slice(0, 2),
        ); // log the first 2 blocks

        console.log(
          `🔑 Searching for keywords: ${JSON.stringify(data.keywords)}`,
        );

        const allMatches = analyzeMatchesInText(texts, data.keywords);
        console.log(`✅ Total matches found: ${allMatches.length}`);

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
          console.log(`⚠️ No matches found in: ${originalUrl}`);
        }
      } catch (error) {
        console.error(`❌ Error processing URL ${originalUrl}:`, error);
        continue;
      }
    }

    CompleteHtml += '</body></html>';

    const urlHtml = await uploadFile(CompleteHtml, data.title);
    console.log(`📤 HTML report URL: ${urlHtml}`);
    if (urlHtml === 'Failed to upload file to S3') {
      console.error('❌ Failed to upload to S3');
      return 500;
    }

    const reportData = {
      url: urlHtml,
      title: data.title,
      userId: data.userId,
    };

    await this.reportModel.create(reportData);
    console.log('📝 Report saved in the database');

    await this.emailService.sendMail(
      data.email,
      'Keyword Report',
      CompleteHtml,
      data.title,
    );
    console.log(`✉️ Email sent to ${data.email}`);

    return urlHtml;
  }
}
