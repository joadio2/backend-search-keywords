import axios from 'axios';
import * as mammoth from 'mammoth';
import * as pdfParse from 'pdf-parse';
import { htmlModified } from './html/htmlModified';
import { uploadFile } from '../functions/uploadHtml';
import { getHtmlResponse } from './html/htmlResponse';
import { getPdfResponse } from './pdf/pdfResponse';
const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
};

type HtmlMatch = {
  id: string;
  snippet: string;
  keywords: string[];
  total: number;
  score: number;
};
type ExtractedTextResult = {
  data: HtmlMatch[];
  typeDocument: 'html' | 'pdf' | 'word' | 'txt';
  htmlDoc?: string | undefined;
};
export async function extractText(
  url: string,
  keyword: string[],
  title: string,
): Promise<ExtractedTextResult> {
  try {
    console.log(`🌐 Fetching URL: ${url}`);

    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: HEADERS,
    });

    const contentType = response.headers['content-type'] || '';
    const buffer = Buffer.from(response.data);

    if (contentType.includes('text/html')) {
      try {
        const html = buffer.toString('utf-8');
        const filteredHtml = await getHtmlResponse(html, keyword, title);

        console.log(`✅ Processed HTML: ${url}`);
        return {
          data: filteredHtml.data,
          typeDocument: 'html',
          htmlDoc: filteredHtml.htmlDoc,
        };
      } catch (error) {
        console.log(`❌ Error processing HTML: ${url}`, error);
      }
    }

    if (contentType.includes('application/pdf')) {
      const pdfData = await (pdfParse as any)(buffer);
      const pages = pdfData.text.split('\n\n');

      const texts = pages
        .map((pageText) => pageText.trim())
        .filter((pageText) => pageText.length > 0)
        .map((pageText, idx) => ({
          page: idx,
          texts: [{ text: pageText }],
        }));

      const filteredPdf = await getPdfResponse(texts, keyword);
      return {
        data: filteredPdf,
        typeDocument: 'pdf',
      };
    }

    if (
      contentType.includes(
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      )
    ) {
      const result = await mammoth.extractRawText({ buffer });
      return {
        data: [],
        typeDocument: 'word',
      };
    }

    console.warn(`⚠️ Unsupported content-type: ${contentType}`);
    return {
      data: [],
      typeDocument: 'txt',
    };
  } catch (error) {
    console.error(`❌ Error fetching or processing ${url}:`, error);
    return {
      data: [],
      typeDocument: 'html',
    };
  }
}
