import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnalyzeDto } from './dto/analyze.dto';
import { OpenAIService } from '../open-ia/open-ia.service';
import { extractText } from '../common/utils/extractText';

@Injectable()
export class AnalyzeService {
  constructor(
    private readonly openAIService: OpenAIService,
    @InjectModel('Report') private readonly reportModel: Model<any>,
  ) {}

  private getUrl(originalUrl: string): string {
    try {
      const parsedUrl = new URL(originalUrl);
      if (
        parsedUrl.hostname.includes('google.com') &&
        parsedUrl.pathname === '/url'
      ) {
        const realUrl = parsedUrl.searchParams.get('url');
        if (realUrl) {
          return decodeURIComponent(realUrl);
        }
      }
    } catch (err) {
      console.warn('No se pudo parsear la URL:', originalUrl);
    }
    return originalUrl;
  }

  async analyze({
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
        const processedUrl = this.getUrl(originalUrl);

        const texts = await extractText(processedUrl);

        const allMatches = [];

        for (const kw of keywords) {
          const matches = [];

          for (const text of texts) {
            const regex = new RegExp(
              `([\\s\\S]{0,100}?)(\\b${kw}\\b)([\\s\\S]{0,100}?)`,
              'gi',
            );
            const found = [...text.matchAll(regex)];

            for (const match of found) {
              let before = match[1];
              const keyword = match[2];
              let after = match[3];

              // variants of punctuation for improved context
              const backCut = Math.max(
                before.lastIndexOf('.'),
                before.lastIndexOf('('),
                before.lastIndexOf('¿'),
                before.lastIndexOf('¡'),
                before.lastIndexOf('!'),
              );
              if (backCut !== -1) {
                before = before.slice(backCut + 1).trimStart();
              }

              // Cut forward if there is a punctuation nearby
              const forwardCut = after.search(/[.?!¡)]/);
              if (forwardCut !== -1) {
                after = after.slice(0, forwardCut + 1).trimEnd();
              }

              const context = `${before} ${keyword} ${after}`.trim();

              matches.push({
                keyword: kw,
                context,
              });
            }
          }

          if (matches.length > 0) {
            allMatches.push(...matches);
          }
        }

        if (allMatches.length > 0) {
          const saved = await this.reportModel.create({
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

          results.push({
            originalUrl,
            matches: allMatches,
            mongoId: saved._id,
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
