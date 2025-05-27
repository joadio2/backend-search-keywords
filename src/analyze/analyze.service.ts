import { Injectable } from '@nestjs/common';

import { AnalyzeDto } from './dto/analyze.dto';
import { extractText } from './utils/extractText';
import { getUrl } from './functions/getUrl';

import { Report } from './schemas/keyword.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AnalyzeService {
  constructor(
    @InjectModel(Report.name)
    private readonly reportModel: Model<Report>,
    private readonly emailService: EmailService,
  ) {}

  async analyzeRunNow(data: AnalyzeDto) {
    try {
      console.log('🔍 Starting analysis with data:', data);
      const dataForSave = [];
      for (const originalUrl of data.urls) {
        try {
          console.log(`🌐 Processing URL: ${originalUrl}`);
          const processedUrl = getUrl(originalUrl);
          console.log(`🔗 Processed URL: ${processedUrl}`);

          const texts = await extractText(
            processedUrl,
            data.keywords,
            data.title,
          );
          console.log(`✅ extractText URL: ${processedUrl}`);
          const save = {
            url: processedUrl,
            match: texts,
            typeDocument: texts.typeDocument,
            htmlDoc: texts.htmlDoc,
          };
          console.log(`✅ Saved URL: ${processedUrl}`);
          dataForSave.push(save);
          console.log(`✅ Saved dataForSave`);
        } catch (error) {
          console.log(`❌ Error processing URL ${originalUrl}:`, error);
          continue;
        }
      }
      console.log(`✅ dataForSave`);
      const completeData = {
        data: dataForSave,
        title: data.title,
        userId: data.userId,
        reportType: data.reportType,
        keywords: data.keywords,
        tags: data.tags,
      };
      console.log(`✅ completeData`);
      await this.reportModel.create(completeData);
      console.log(`✅ Report saved`);
      await this.emailService.sendMail(
        data.email,
        'Keyword Report',
        data.title,
      );
      return {
        status: 200,
        message: 'REPORT SAVED',
      };
    } catch (error) {
      console.log(`❌ Error analyzing data:`, error);
      return {
        status: 500,
        message: error,
      };
    }

    /*   console.log(
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
  }*/
  }
}
