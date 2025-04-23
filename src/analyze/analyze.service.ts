import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnalyzeDto } from './dto/analyze.dto';
import { OpenAIService } from '../open-ia/open-ia.service';
import { extractText } from '../common/utils/extractText';
import { getUrl } from './functions/getUrl';
import { analyzeMatchesInText } from './functions/fechtMatches';
import { createDocument } from './functions/pushDocument';

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

    for (let originalUrl of urls) {
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

        if (mongoId) {
          results.push({
            originalUrl,
            matches: allMatches,
            mongoId,
          });
        } else {
          results.push({
            originalUrl,
            message: 'Not found matches',
          });
        }
      } catch (error) {
        console.error('Error procesando el URL:', originalUrl, error);
        results.push({ originalUrl, error: error.message });
      }
    }

    return {
      status: 'success',
      totalDocuments: results.length,
      results,
    };
  }
}
